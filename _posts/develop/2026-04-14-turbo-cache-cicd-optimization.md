---
layout: post
title: "[DEVELOP] 모노레포 빌드 10분 → 2분, Turborepo 캐시와 CI/CD 최적화 실전기"

subtitle: "빌드 구조 변경부터 Turbo 캐시 동작 원리, VITE_ 접두사 함정, S3 배포 최적화까지 — 실무에서 겪은 삽질과 해결 과정"

date: 2026-04-14 08:10:30

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/04/turbo.png"

categories:
  - DEVELOP

tags:
  - CI/CD
  - Turborepo
  - Turbo Cache
  - GitHub Actions
  - 모노레포
  - Monorepo
  - 빌드 최적화
  - 캐시
  - 롤백
  - DevOps
  - S3
  - CloudFront
  - Vite
  - Module Federation
---

{% include post/develop_contents.md %}

> 모노레포에서 앱 하나만 수정했는데 전체 빌드가 10분씩 돌아갔습니다. Turborepo 캐시를 제대로 적용하고 CI 파이프라인을 개선한 결과, **캐시 히트 시 2~3분, 캐시 미스에도 5분**으로 줄었습니다. 이 글에서는 빌드 구조 변경부터 Turbo 캐시 원리, 실전 삽질 기록, S3 배포 최적화까지 전 과정을 다룹니다.
>
> - 이전 글: [[DEVELOP] Turborepo 캐시로 CI/CD 빌드 시간을 90% 줄이는 법](/develop/2026/04/14/turbo-cache-cicd/)

---

## 들어가며: 왜 빌드가 10분이나 걸렸나

7개의 앱(main + 6개 remote)을 가진 Module Federation 모노레포에서, 매 배포마다 **모든 앱을 처음부터 빌드**하고 있었습니다. 변경한 건 remote 앱 하나인데, 나머지 6개까지 다시 빌드되는 구조였죠.

Turborepo의 캐시 기능을 알고는 있었지만, **빌드 출력 경로 문제**로 캐시가 제대로 동작하지 않았습니다.
![10분](/img/post/2026/04/build_1.png)
이전 cache Hit가 제대로 동작하지않고 s3업로드시 시간이 많이걸림
![2분](/img/post/2026/04/build_2.png)
이전 cache Hit가 제대로 동작 s3업로드 시간 단축

---

## 빌드 구조 변경: 캐시가 안 되던 이유

### 이전 구조 (캐시 불가능)

모든 앱이 프로젝트 최상단 `dist/`에 직접 빌드하는 구조였습니다.

```
metaclub-v2-web/
├── apps/
│   ├── main/        ──── outDir: ../../dist ──────────┐
│   ├── charging/    ──── outDir: ../../dist/charging ─┤
│   ├── ticket/      ──── outDir: ../../dist/ticket ───┤
│   ├── laundry/     ──── outDir: ../../dist/laundry ──┤
│   └── ...                                            │
│                                                      ▼
├── dist/  ◀── 전부 여기로 빌드 (패키지 디렉토리 밖!)
│   ├── index.html          (main)
│   ├── assets/             (main)
│   ├── charging/assets/    (charging)
│   └── ...
│
└── .turbo/  ◀── outputs: ["../../dist/**"] 로 캐시 저장은 되지만 복원 ✗
```

**Turbo는 패키지 디렉토리 밖의 경로를 캐시에서 복원하지 못합니다.** `outputs: ["../../dist/**"]`로 저장은 가능하지만, 다음 빌드에서 `.turbo/` 안의 캐시를 `../../dist/`로 되돌리는 건 지원하지 않습니다.

추가로, `remoteEntry.${gitHash}.js`처럼 파일명에 커밋 해시를 넣어 빌드하고 있었기 때문에 **커밋이 바뀔 때마다 빌드 결과물이 달라져** 캐시가 무조건 무효화됐습니다.

### 현재 구조 (캐시 가능)

각 앱이 **자기 내부의 `dist/`**에 빌드하도록 변경했습니다.

```
metaclub-v2-web/
├── apps/
│   ├── main/
│   │   └── dist/  ◀── outDir: dist (내부)
│   │       ├── index.html
│   │       └── assets/
│   ├── charging/
│   │   └── dist/  ◀── outDir: dist (내부)
│   │       └── assets/remoteEntry.js   ← 고정 파일명!
│   ├── ticket/
│   │   └── dist/  ◀── outDir: dist (내부)
│   │       └── assets/remoteEntry.js
│   └── ...
│
├── .turbo/  ◀── outputs: ["dist/**"] 로 캐시 저장/복원 ✓
│
│   ┌─── CI에서만 실행 (Assemble dist step) ───┐
│   │  apps/main/dist     → dist/               │
│   │  apps/charging/dist → dist/charging/      │
│   │  remoteEntry.js     → remoteEntry.{hash}.js │
│   └───────────────────────────────────────────┘
│                       ▼
└── dist/  ◀── S3 업로드용 (CI에서만 조립)
```

핵심 변경 사항:

- remote 앱은 **`remoteEntry.js` 고정 파일명**으로 빌드 → 캐시 유지
- CI의 Assemble 단계에서만 `remoteEntry.{hash}.js`로 리네임 (브라우저 캐시 버스팅)
- Turbo는 각 앱의 `dist/`를 정상적으로 캐시/복원 가능

---

## Turbo 캐시 동작 원리

### 캐시 키 생성

Turbo는 `turbo.json`의 `inputs` + `globalDependencies` 파일들의 내용을 해시하여 캐시 키를 생성합니다.

```json
{
  "globalDependencies": [
    "packages/ui/components/**",
    "packages/utils/src/**",
    "packages/styles/src/**"
  ],
  "tasks": {
    "build": {
      "inputs": [
        "src/**",
        "vite.config.ts",
        "tsconfig.json",
        "package.json",
        "index.html"
      ],
      "outputs": ["dist/**"]
    }
  }
}
```

```
태스크별 inputs:      [src/**, vite.config.ts, tsconfig.json, ...]
globalDependencies:  [packages/ui/**, packages/utils/**, ...]
         ↓
  해시: 4fb5c290b1c53dcc
         ↓
  .turbo/ 폴더에 해시별 빌드 결과 저장
```

### 캐시 판정 (Hit or Miss)

![Turbo 캐시 동작 흐름도](/img/post/2026/04/turbo_cache_flow.png)

```
빌드 실행 시:
  inputs + globalDeps 해시 계산 → .turbo/에 같은 해시 존재?
  ├─ YES → cache hit  → 빌드 스킵, 저장된 dist/ 복원 (~0.1초)
  └─ NO  → cache miss → 실제 빌드 실행 → 결과를 .turbo/에 저장 (~15초)
```

### main 앱은 왜 캐시하지 않나

main 앱은 `BUILD_GIT_HASH` 환경변수로 remote 앱들의 URL을 동적으로 생성합니다. 커밋이 바뀌면 이 값이 달라지므로 빌드 결과가 매번 다릅니다.

```json
{
  "tasks": {
    "build:dev": {
      "cache": false
    }
  }
}
```

main 앱에 한해 `cache: false`를 설정하여, Turbo가 항상 재빌드하도록 했습니다.

---

## 삽질 1: VITE\_ 접두사 함정

이것이 가장 오래 걸린 삽질이었습니다.

### 문제 상황

처음에는 git 해시를 `VITE_GIT_HASH`라는 환경변수로 전달했습니다. 빌드 자체는 정상이었지만, **모든 앱의 캐시가 매번 깨졌습니다.**

### 원인: Turbo의 프레임워크 감지

Turbo는 Vite 프로젝트를 감지하면 `VITE_*` 접두사의 환경변수를 **자동으로 태스크 해시에 포함**시킵니다. `globalPassThroughEnv`나 `passThroughEnv`로 제외해도 프레임워크 추론이 우선 적용되는 **Turbo 2.4.x 버그**였습니다.

```
VITE_GIT_HASH 사용 시:
  Turbo: "VITE_* 환경변수 발견! 해시에 포함시키자"
  ├── ① 자식 프로세스에 전달 ✓ → 빌드 정상
  └── ② 태스크 해시에 포함 ✗ → 매 커밋마다 값 변경 → 전체 캐시 무효화!

BUILD_GIT_HASH + globalPassThroughEnv 사용 시:
  Turbo: "VITE_* 없음, 무시"
  globalPassThroughEnv: "BUILD_GIT_HASH는 전달하되 해시에서 제외"
  ├── ① 자식 프로세스에 전달 ✓ → 빌드 정상
  └── ② 태스크 해시에 미포함 ✓ → 캐시 유지!
```

### 해결

환경변수 이름을 `VITE_GIT_HASH` → `BUILD_GIT_HASH`로 변경하고, `globalPassThroughEnv`에 등록했습니다.

```json
{
  "globalPassThroughEnv": ["BUILD_GIT_HASH"]
}
```

`process.env.BUILD_GIT_HASH`는 `vite.config.ts` (Node.js 런타임)에서 사용하므로 `VITE_` 접두사가 필요 없습니다. 클라이언트 코드(`src/*.tsx`)에서 `import.meta.env`로 접근할 때만 `VITE_` 접두사가 필요합니다.

> **참고**: 이 버그는 Turbo 2.7+에서 수정됨 (PR #11303). 업그레이드 후에는 `VITE_GIT_HASH`로 복원 가능합니다.

---

## 삽질 2: globalDependencies 범위 설정

### 문제 상황

처음에 `globalDependencies`를 이렇게 설정했습니다:

```json
{
  "globalDependencies": ["packages/**"]
}
```

공유 패키지가 변경되면 전체 앱을 재빌드하려는 의도였는데, `pnpm install`만 해도 **매번 캐시가 깨졌습니다.**

### 원인

```
packages/**           → 2,935개 파일 (node_modules 2,812개 포함!)
packages/ui/src/** 등 → 122개 파일 (소스만)
```

`packages/**`로 퉁치면 `packages/ui/node_modules`까지 포함되어, 의존성 업데이트마다 캐시가 무효화됩니다.

### 해결

소스 파일만 정확히 지정했습니다:

```json
{
  "globalDependencies": [
    "packages/ui/components/**",
    "packages/utils/src/**",
    "packages/styles/src/**"
  ]
}
```

---

## 삽질 3: GitHub Actions 캐시 키

### 문제 상황

기존 캐시 키가 `hashFiles('**.[jt]s', '**.[jt]sx', '*.json')`이었는데, 빌드 결과물(`dist/`)이 해시에 포함되면서 restore/save 키가 항상 달라졌습니다.

```
① Restore → hash-X로 복원
② 빌드 실행 → dist/ 파일 생성 → 전체 파일 해시 변경
③ Save → hash-Y로 저장 (restore 때와 key가 다름!)
④ 다음 배포 → hash-X도 hash-Y도 아닌 새로운 해시 → 매번 캐시 미스!
```

### 해결

```yaml
key: Linux-turbo-dev-${{ github.sha }}
restore-keys: Linux-turbo-dev-
```

`github.sha`는 **커밋 해시**이므로 빌드 결과물과 완전히 무관합니다. 같은 커밋이면 항상 같은 캐시 키가 생성됩니다.

| 항목             | `hashFiles(...)`    | `github.sha`       |
| ---------------- | ------------------- | ------------------ |
| 빌드 결과물 영향 | 받음 (dist 포함 시) | 안 받음            |
| 캐시 일관성      | 매번 달라질 수 있음 | 커밋 단위로 일관됨 |
| 롤백 캐시 히트   | 불가능              | 가능               |
| 동일 코드 재배포 | 캐시 미스           | 캐시 히트          |

---

## CI 파이프라인 전체 흐름

![CI 전체 흐름도](/img/post/2026/04/turbo_ci_flow.png)

최적화된 CI 파이프라인의 전체 흐름입니다.

### 1. Restore Turbo Cache

```yaml
- name: Restore Turbo Cache
  uses: actions/cache@v5
  with:
    path: .turbo
    key: Linux-turbo-dev-${{ github.sha }}
    restore-keys: Linux-turbo-dev-
```

`github.sha`로 정확히 매칭되면 해당 커밋의 캐시를, 없으면 `restore-keys`로 가장 최근 캐시를 복원합니다.

### 2. Typecheck & Build

```bash
BUILD_GIT_HASH={hash} turbo run typecheck build:dev --concurrency=4
```

- typecheck과 build를 **병렬 실행** (`--concurrency=4`)
- 변경 없는 앱은 cache hit로 스킵
- typecheck도 캐시 가능 (변경 없으면 ~44초 절약)

### 3. Assemble dist

각 앱의 내부 `dist/`를 루트 `dist/`로 조립하는 단계입니다. CI에서만 실행됩니다.

```
apps/main/dist       → dist/
apps/charging/dist   → dist/charging/
apps/ticket/dist     → dist/ticket/
remoteEntry.js       → remoteEntry.{hash}.js  (브라우저 캐시 버스팅)
```

JS 파일은 immutable 1년 캐시이므로, 해시 없는 `remoteEntry.js`를 그대로 배포하면 브라우저가 구버전을 계속 로드합니다. 그래서 CI에서만 해시를 붙여 리네임합니다.

### 4. Deploy to S3

```bash
aws s3 cp dist/ s3://bucket/ --recursive
```

> **최적화 포인트**: `s3 sync` 대신 `s3 cp --recursive`를 사용합니다. `sync`는 기존 파일 리스팅이 먼저 필요해서 느린 반면, `cp`는 즉시 업로드를 시작합니다.

캐시 헤더 전략:

- **JS/CSS 파일**: immutable, max-age=1년 (파일명에 해시 포함)
- **HTML 파일**: no-cache (항상 최신 버전 확인)

### 5. CloudFront Invalidation

```bash
aws cloudfront create-invalidation --paths "/index.html" "/*/index.html"
```

`index.html`만 무효화합니다. JS/CSS는 파일명에 해시가 포함되어 있어 별도 무효화가 불필요합니다.

### 6. Save Turbo Cache

```yaml
- name: Save Turbo Cache
  uses: actions/cache@v5
  with:
    path: .turbo
    key: Linux-turbo-dev-${{ github.sha }}
```

---

## 롤백 시나리오

### 정상 케이스

```
A 배포 → .turbo/ 저장 (key: turbo-dev-{sha-A})
B 배포 → A 캐시 복원 → 변경분만 빌드 → 저장 (key: turbo-dev-{sha-B})
C 배포 → B 캐시 복원 → 변경분만 빌드 → 저장 (key: turbo-dev-{sha-C})

B로 revert (새 커밋 D, 코드는 B와 동일):
  ① restore-keys로 turbo-dev-{sha-C} 복원
  ② .turbo/ 안에 여러 빌드 캐시가 누적되어 있음
  ③ D의 inputs 해시 === B의 inputs 해시 (코드 동일)
  ④ .turbo/에 B 때의 캐시가 남아있으면 → cache hit!
     없으면 → cache miss → 재빌드 (에러 아님)
```

핵심: **Turbo는 git 커밋이 아닌 파일 내용의 해시로 캐시를 판단합니다.** revert로 코드를 되돌리면, 이전 빌드의 캐시가 `.turbo/`에 남아있을 때 cache hit이 발생합니다.

### 주의: GitHub Actions 캐시 제한

| 제한 사항             | 값                         |
| --------------------- | -------------------------- |
| 총 캐시 용량          | **10GB** (레포지토리 단위) |
| 미사용 캐시 자동 삭제 | **7일**                    |

오래된 커밋의 캐시가 삭제된 경우, `restore-keys`로 가장 최근 캐시를 복원한 뒤 Turbo가 inputs를 비교하여 **변경된 앱만 재빌드**합니다. 최악의 경우 전체 재빌드가 되지만, 에러는 발생하지 않습니다.

---

## 적용된 최적화 총정리

### 빌드 속도

| 항목                              | 변경 내용                                          | 효과                                    |
| --------------------------------- | -------------------------------------------------- | --------------------------------------- |
| Turbo 빌드 캐시                   | remote 앱 7개 outDir을 내부로 변경하여 캐시 활성화 | 변경 없는 앱 빌드 스킵 (~50초 → ~0.1초) |
| Turbo typecheck 캐시              | typecheck 태스크 cache: true                       | 변경 없으면 ~44초 절약                  |
| typecheck + build 병렬            | --concurrency=4로 동시 실행                        | 순차 → 병렬로 시간 단축                 |
| @vitejs/plugin-react-swc          | Babel → SWC 트랜스파일러 변경                      | 트랜스파일 속도 향상                    |
| vite-plugin-compression 제거      | 빌드 시 gzip/brotli 압축 삭제                      | CloudFront가 자동 압축하므로 불필요     |
| build.reportCompressedSize: false | 빌드 완료 시 압축 크기 계산 생략                   | 빌드 시간 단축                          |

### 번들 크기

| 항목                        | 변경 내용                             | 효과                       |
| --------------------------- | ------------------------------------- | -------------------------- |
| framer-motion → motion 통합 | framer-motion 제거, motion으로 일원화 | 번들 크기 감소 (중복 제거) |

### CI/CD 파이프라인

| 항목                   | 변경 내용                      | 효과                                     |
| ---------------------- | ------------------------------ | ---------------------------------------- |
| S3 cp --recursive      | sync → cp로 변경               | 배포 시간 대폭 단축                      |
| GitHub Actions 캐시 키 | hashFiles() → github.sha       | 빌드 결과물에 의한 캐시 미스 방지        |
| BUILD_GIT_HASH 접두사  | VITE_GIT_HASH → BUILD_GIT_HASH | Turbo 프레임워크 감지 우회로 캐시 안정화 |
| actions/cache@v5       | v3 → v5 업그레이드             | Node.js 20 deprecation 해결              |

### 캐시 무효화 원인 (트러블슈팅)

| 원인                    | 설명                                            | 해결                                  |
| ----------------------- | ----------------------------------------------- | ------------------------------------- |
| turbo.json 변경         | 설정 자체가 해시에 포함 → 전체 캐시 무효화      | 설정 안정화 후 자연 해소              |
| VITE\_\* 환경변수       | Turbo 프레임워크 감지로 해시에 자동 포함        | BUILD\_ 접두사 + globalPassThroughEnv |
| globalDependencies 범위 | packages/\*\* 사용 시 node_modules 포함         | 소스 파일만 세분화하여 지정           |
| hashFiles() 캐시 키     | 빌드 결과물이 키에 포함되어 restore/save 불일치 | github.sha로 변경                     |

---

## 결과

| 구분                     | 이전  | 이후       |
| ------------------------ | ----- | ---------- |
| 전체 빌드 (캐시 미스)    | ~10분 | ~5분       |
| 일부 앱 변경 (캐시 히트) | ~10분 | **~2~3분** |
| 롤백 배포                | ~10분 | **~2분**   |

**빌드 시간을 최대 80% 줄이면서**, 캐시 안정성도 확보했습니다.

---

## 마무리

이번 최적화에서 가장 중요했던 세 가지:

1. **빌드 출력 경로를 패키지 내부로** — Turbo가 캐시를 복원하려면 `outputs`가 패키지 디렉토리 안에 있어야 한다
2. **환경변수 접두사 주의** — `VITE_*`는 Turbo가 자동으로 해시에 포함시키므로, 캐시 무효화 원인이 될 수 있다
3. **CI 캐시 키는 빌드 결과물과 무관해야 한다** — `hashFiles()` 대신 `github.sha`를 쓰면 캐시 히트율이 근본적으로 달라진다

단순히 "Turbo 쓰면 빠르다"가 아니라, **캐시가 깨지는 원인을 하나하나 잡아가는 과정**이 핵심이었습니다. 비슷한 모노레포 환경을 운영하고 계신 분들에게 도움이 되길 바랍니다.

---

> 참고 자료
>
> - [Turborepo 공식 문서 - Caching](https://turbo.build/repo/docs/crafting-your-repository/caching)
> - [GitHub Actions Cache 제한사항](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
> - [Turbo 환경변수 프레임워크 추론 버그 (PR #11303)](https://github.com/vercel/turborepo/pull/11303)
