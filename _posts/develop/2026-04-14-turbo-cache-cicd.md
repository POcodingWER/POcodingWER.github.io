---
layout: post
title: "[DEVELOP] Turborepo 캐시로 CI/CD 빌드 시간을 90% 줄이는 법"

subtitle: "Turbo 캐시 동작 원리부터 GitHub Actions 롤백 시나리오까지, 모노레포 빌드 최적화 실전 가이드"

date: 2026-04-14 08:35:00

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
---

{% include post/develop_contents.md %}

> 모노레포에서 앱 하나만 수정했는데 전체 빌드가 돌아가는 경험, 해보셨나요? **Turborepo 캐시**를 제대로 이해하면 변경되지 않은 앱의 빌드를 **0.1초**만에 복원할 수 있습니다. 이 글에서는 캐시 동작 원리부터 GitHub Actions에서의 실전 적용, 그리고 롤백 시 주의점까지 다룹니다.

---

## Turbo 캐시란?

Turborepo는 모노레포 빌드 도구로, **각 태스크(빌드, 린트, 테스트 등)의 결과를 캐싱**하여 동일한 입력에 대해 재실행을 건너뜁니다. 이것이 바로 **Turbo 캐시**입니다.

핵심 아이디어는 단순합니다:

> **같은 입력이면 같은 출력이다. 다시 빌드할 필요가 없다.**

---

## 1단계: 캐시 키 생성

Turbo가 각 앱을 빌드할 때, `turbo.json`의 `inputs`를 기반으로 **해시(hash)**를 생성합니다.

```json
{
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

이 파일들의 내용을 모두 해시하여 `4fb5c290b1c53dcc` 같은 **고유 캐시 키**를 만듭니다.

| 항목        | 설명                                                  |
| ----------- | ----------------------------------------------------- |
| **inputs**  | 해시 계산에 포함되는 파일들 (소스코드, 설정 파일 등)  |
| **outputs** | 캐시에 저장되는 빌드 결과물 (`dist/` 등)              |
| **해시 키** | inputs의 모든 파일 내용을 기반으로 생성된 고유 식별자 |

### 핵심 포인트

`inputs`에 명시된 파일이 **단 한 글자라도 변경**되면 해시가 완전히 달라집니다. 반대로, 변경이 없으면 항상 같은 해시가 나옵니다.

---

## 2단계: 캐시 확인 (Hit or Miss)

빌드 실행 시 Turbo는 다음과 같은 흐름으로 동작합니다:

![Turbo 캐시 동작 흐름도](/img/post/2026/04/turbo_cache_flow.png)

```
해시 계산 → .turbo/ 폴더에 같은 해시가 있는지 확인
├─ ✅ 있음 → cache hit → 빌드 스킵, 저장된 dist/ 복원
└─ ❌ 없음 → cache miss → 실제 빌드 실행 → 결과를 .turbo/에 저장
```

### 로컬에서 확인하기

```bash
npx turbo build --dry
```

`--dry` 플래그를 사용하면 실제 빌드 없이 각 태스크의 캐시 상태를 확인할 수 있습니다.

```
# 출력 예시
Tasks:    3 successful, 3 total
Cached:   2 cached, 3 total    ← 2개는 캐시 히트!
Time:     0.8s
```

---

## 3단계: CI에서의 캐시 흐름

![CI 전체 흐름도](/img/post/2026/04/turbo_ci_flow.png)

GitHub Actions에서 Turbo 캐시를 활용하는 전체 흐름입니다.

### 워크플로우 설정

```yaml
- name: Restore Turbo Cache
  uses: actions/cache@v4
  with:
    path: .turbo
    key: turbo-${{ github.sha }}
    restore-keys: |
      turbo-

- name: Build
  run: npx turbo build

- name: Save Turbo Cache
  uses: actions/cache@v4
  with:
    path: .turbo
    key: turbo-${{ github.sha }}
```

### 첫 배포 시나리오 (커밋 A)

```
① Restore Turbo Cache
   → restore-keys로 이전 .turbo/ 복원 (있다면)

② Turbo가 각 앱별 inputs 해시 비교
   - charging 앱: src 변경됨 → cache miss → 빌드 (15초)
   - ticket 앱:   src 변경 없음 → cache hit → dist 복원 (0.1초)

③ Save Turbo Cache
   → .turbo/ 저장 (key: turbo-{sha-A})
```

5개의 앱이 있는 모노레포에서 **1개만 변경**했다면, 나머지 4개는 캐시로 복원되어 전체 빌드 시간이 **수 분에서 수십 초로** 단축됩니다.

### 롤백 시나리오 (커밋 A로 복귀)

```
① Restore → turbo-{sha-A} 정확히 매칭 → 복원
② 모든 앱 inputs 동일 → 전부 cache hit
③ Save → 이미 같은 key 존재 → 스킵
```

롤백 시에는 이전 커밋의 캐시 키가 정확히 매칭되므로 **모든 앱이 캐시 히트**되어 빌드가 거의 즉시 완료됩니다.

---

## 4단계: 롤백 시 주의사항

### GitHub Actions 캐시 제한

| 제한 사항                | 값                         |
| ------------------------ | -------------------------- |
| 총 캐시 용량             | **10GB** (레포지토리 단위) |
| 미사용 캐시 자동 삭제    | **7일**                    |
| 단일 캐시 항목 최대 크기 | **10GB**                   |

### 문제 시나리오

```
커밋 A 배포 → .turbo/ 저장 (key: turbo-{sha-A})
커밋 B 배포 → 이전 .turbo/ 복원 → 빌드 → .turbo/ 저장 (key: turbo-{sha-B})
...
(7일 경과, 캐시 많이 쌓임)
...
커밋 A 롤백 → turbo-{sha-A} 캐시가 삭제됐다면?
```

이 경우 `restore-keys: turbo-`로 **가장 최근 캐시**가 복원됩니다. Turbo가 각 앱의 inputs를 비교하여 **변경된 앱만 재빌드**하므로, 전체 빌드보다는 훨씬 빠르지만 완전한 캐시 히트는 아닙니다.

---

## 삽질 기록: 캐시 키를 hashFiles로 쓰면 안 되는 이유

### 이전 방식 (문제 있음)

```yaml
key: turbo-${{ hashFiles('**.[jt]s', '**.[jt]sx', '*.json') }}
```

이 방식의 문제는 `hashFiles`가 **빌드 결과물(`dist/`)까지 포함**해서 해시를 계산한다는 점입니다.

```
① Restore → hash-X로 복원
② 빌드 실행 → dist/ 파일 생성 → 전체 파일 해시 변경
③ Save → hash-Y로 저장 (restore 때와 key가 다름!)
④ 다음 배포 → hash-X도 hash-Y도 아닌 새로운 해시 → 매번 캐시 미스!
```

### 현재 방식 (해결)

```yaml
key: turbo-${{ github.sha }}
```

`github.sha`는 **커밋 해시**이므로 빌드 결과물과 완전히 무관합니다. 같은 커밋이면 항상 같은 캐시 키가 생성되어, 롤백 시에도 정확한 캐시를 복원할 수 있습니다.

### 비교 정리

| 항목             | `hashFiles(...)`       | `github.sha`          |
| ---------------- | ---------------------- | --------------------- |
| 빌드 결과물 영향 | ⚠️ 받음 (dist 포함 시) | ✅ 안 받음            |
| 캐시 일관성      | ❌ 매번 달라질 수 있음 | ✅ 커밋 단위로 일관됨 |
| 롤백 캐시 히트   | ❌ 불가능              | ✅ 가능               |
| 동일 코드 재배포 | ❌ 캐시 미스           | ✅ 캐시 히트          |

---

## 전체 흐름 요약

```
개발자가 커밋 push
    │
    ▼
GitHub Actions 시작
    │
    ├─ 1. Restore Cache (turbo-{sha} 또는 turbo- prefix로 복원)
    │
    ├─ 2. turbo build 실행
    │     │
    │     ├─ 앱 A: inputs 해시 비교 → cache hit  → dist 복원 (0.1s)
    │     ├─ 앱 B: inputs 해시 비교 → cache miss → 실제 빌드 (15s)
    │     └─ 앱 C: inputs 해시 비교 → cache hit  → dist 복원 (0.1s)
    │
    ├─ 3. Save Cache (turbo-{sha}로 저장)
    │
    └─ 4. 배포
```

---

## 실전 팁

### 1. `inputs`를 명시적으로 설정하세요

```json
{
  "tasks": {
    "build": {
      "inputs": [
        "src/**",
        "vite.config.ts",
        "tsconfig.json",
        "package.json",
        "index.html"
      ]
    }
  }
}
```

`inputs`를 지정하지 않으면 Turbo는 `.gitignore`에 포함되지 않은 **모든 파일**을 추적합니다. README 수정만으로 캐시가 무효화될 수 있습니다.

### 2. Remote Cache 활용

팀원 간 캐시를 공유하려면 [Vercel Remote Cache](https://turbo.build/repo/docs/core-concepts/remote-caching)를 사용할 수 있습니다.

```bash
npx turbo login
npx turbo link
```

로컬 개발 환경에서도 CI에서 만든 캐시를 재사용할 수 있어 개발 생산성이 크게 향상됩니다.

### 3. 캐시 디버깅

캐시가 예상대로 동작하지 않을 때:

```bash
# 캐시 상태 확인
npx turbo build --summarize

# 캐시 완전 초기화
npx turbo build --force
```

`--summarize` 플래그는 각 태스크의 캐시 키 구성 요소를 상세히 보여줍니다.

---

## 마무리

Turborepo 캐시의 핵심은 단순합니다:

1. **inputs 기반 해시**로 변경 여부를 판단한다
2. **변경되지 않은 앱은 빌드하지 않는다**
3. **CI 캐시 키는 빌드 결과물과 무관해야 한다**

이 세 가지만 기억하면, 모노레포의 CI/CD 파이프라인을 극적으로 개선할 수 있습니다. 특히 `hashFiles` → `github.sha`로의 전환은 작은 변경이지만 캐시 히트율을 근본적으로 바꿔주는 핵심 포인트입니다.

---

> 참고 자료
>
> - [Turborepo 공식 문서 - Caching](https://turbo.build/repo/docs/crafting-your-repository/caching)
> - [GitHub Actions Cache 제한사항](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
