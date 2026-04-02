---
layout: post
title: "[DEVELOP] 클로드 코드 50만 줄 소스코드 유출 사건 분석"

subtitle: "다마고치 펫, 감정 감지, 토큰 버그까지 — AI 코딩 도구의 민낯"

date: 2026-04-02 09:00:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/04/claude_code.png"

categories:
  - DEVELOP

tags:
  - Claude Code
  - Anthropic
  - 소스코드 유출
  - AI 코딩 도구
  - 보안 사고
  - 토큰 사용량
  - 프롬프트 캐시
  - npm
  - 소스맵
  - 개발자 도구
---

{% include post/develop_contents.md %}

> 클로드 코드의 50만 줄 소스코드가 npm 패키지를 통해 통째로 유출되었습니다. 숨겨진 다마고치 펫, 사용자 감정 감지, 토큰 급증 버그까지 — AI 코딩 도구의 내부를 날것 그대로 들여다봅니다.
>
> - [The Verge - Claude Code leak exposes a Tamagotchi-style 'pet' and an always-on agent](https://www.theverge.com/ai-artificial-intelligence/904776/anthropic-claude-source-code-leak)
> - [GitHub - leaked-claude-code/leaked-claude-code](https://github.com/leaked-claude-code/leaked-claude-code)
> - [GitHub - instructkr/claw-code (Python 재구현, 50K+ Stars)](https://github.com/instructkr/claude-code)
> - [GitHub Issue #26330 - Prompt cache corruption](https://github.com/anthropics/claude-code/issues/26330)

---

## 사건 개요 — 소스맵 하나로 51만 줄이 털렸다

2026년 3월 31일, 보안 연구원 **Chaofan Shou**가 **npm 패키지 저장소**에서 **60MB 크기의 소스맵 파일**을 발견하면서 사건이 시작되었습니다.

### 소스맵(Source Map)이란?

소스맵은 압축·난독화된 코드를 **원래 소스 코드로 되돌리는 지도** 역할을 합니다. 개발 중에는 디버깅에 유용하지만, **배포 시에는 반드시 제거해야** 하는 파일입니다.

### 유출 경로

유출된 버전은 **v2.1.88**이며, 빌드 도구 [Bun](https://bun.sh/)이 생성한 소스맵이 `.npmignore` 설정 누락으로 패키지에 포함되었습니다.

```
npm 패키지 배포 (v2.1.88)
  └─ .map 소스맵 파일 포함 (.npmignore 누락)
       └─ Anthropic R2 스토리지 버킷 주소 노출
            └─ 원본 소스코드 다운로드 가능
                 └─ 1,900개 TypeScript 파일, 512,000줄+ 전체 유출
```

### 유출된 코드의 규모

| 항목                | 수치                                                         |
| ------------------- | ------------------------------------------------------------ |
| 전체 코드 라인      | **512,000줄+**                                               |
| TypeScript 파일     | **1,900개**                                                  |
| Agent 도구          | **~40개** (BashTool, FileReadTool, FileEditTool, MCPTool 등) |
| 슬래시 커맨드       | **~50개**                                                    |
| QueryEngine         | 46,000줄                                                     |
| Tool 시스템         | 29,000줄                                                     |
| Commands 레지스트리 | 25,000줄                                                     |

Anthropic은 유출된 패키지를 삭제하고 이전 버전도 레지스트리에서 제거했지만, 이미 **50,000건 이상 포크**되어 여러 GitHub 저장소에 아카이브된 상태였습니다.

### 연이은 실수

이 사건은 **5일 전(3월 26일) Anthropic CMS 설정 노출로 내부 파일 3,000개가 공개된 사건**에 이은 두 번째 실수였습니다. Anthropic 측은 "a release packaging issue caused by human error, not a security breach(보안 침해가 아닌 사람의 실수로 인한 릴리즈 패키징 문제)"라고 밝혔지만, 커뮤니티의 반응은 싸늘했습니다.

> 해커 뉴스: "클로드에게 '패키지 삭제해 줘'라고 시킨 것 아니냐?"
>
> GitHub: 포크 수 급증 — "외양간 고치려는데 문이 안 잠긴 상황"

---

## 유출된 소스에서 발견된 숨겨진 기능들

### 1. 버디 시스템 (Buddy System) — 터미널 속 다마고치

클로드 코드 터미널 안에 **다마고치 같은 AI 펫 시스템**이 숨겨져 있었습니다.

소스코드의 `BUDDY` 피처 플래그 뒤에 완전한 가상 펫 시스템이 구현되어 있었습니다.

| 항목      | 내용                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 펫 종류   | 오리, 거위, 고양이, 드래곤, 문어, 올빼미, 펭귄, 거북이, 달팽이, 유령, 아홀로틀, 카피바라, 선인장, 로봇, 토끼, 버섯, 뚱보 등 **18종** |
| 등급      | Common(60%) → Uncommon(25%) → Rare(10%) → Epic(4%) → **Legendary(1%)**                                                               |
| 반짝이    | 각 등급에서 **1% 확률**로 반짝이(Shiny) 버전 존재                                                                                    |
| 능력치    | DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK (5가지)                                                                                    |
| 생성 방식 | userId 기반 **Mulberry32 PRNG**으로 결정적 생성                                                                                      |
| 이름      | 클로드가 이름과 성격을 **직접** 지어줌                                                                                               |
| 비주얼    | 아스키 아트 캐릭터 + 하트 애니메이션                                                                                                 |

이 기능은 **만우절 이벤트**로 준비 중이었으며, 4월 1일부터 티저 공개 후 5월 정식 출시 예정이었으나 유출로 인해 미리 공개되어 버렸습니다. 현재 [Claude Buddy Checker](https://claudebuddychecker.netlify.app/)에서 자신의 버디를 확인해볼 수 있습니다.

### 2. 좌절 감지 시스템 — AI 없는 감정 분석

사용자가 욕설이나 특정 표현을 입력하면 이를 감지하는 기능이 포함되어 있었습니다.

충격적인 점은 구현 방식이었습니다.

```
❌ 예상: AI 기반 자연어 감정 분석
✅ 실제: 단순한 문자열 매칭 (string matching)
```

세계 최고의 AI 회사가 사용자 감정 분석을 **AI 없이 문자열 비교로 처리**한다는 사실에 비판이 쏟아졌습니다. 물론 매번 AI를 호출하면 비용이 급증하기 때문에 합리적인 선택일 수 있지만, 아이러니하다는 반응이 많았습니다.

### 3. 언더커버 모드 (Undercover Mode)

Anthropic 직원이 **오픈소스 프로젝트에 기여**할 때 자동으로 켜지는 기능입니다.

- 커밋과 PR에서 **"Claude Code" 레퍼런스 제거**
- 모델명, 내부 코드네임 노출 방지
- 사람이 직접 작성한 것처럼 보이도록 설정

오픈소스 커뮤니티에서 AI 사용 사실을 **조직적으로 숨기는 것이 윤리적인지**에 대한 논쟁이 벌어졌습니다. 그리고 이 언더커버 모드 자체도 유출된 소스코드 안에 있었다는 것이 최고의 아이러니입니다.

### 4. 도둑 방지 장치 (Anti-Theft System)

누군가 클로드 코드의 API 통신을 가로채 **학습 데이터로 사용하는 것을 막기 위한** 장치입니다.

```
API 요청에 특정 플래그가 켜져 있으면
  → 서버가 가짜 도구 정의를 섞어서 응답
    → 이를 학습시키면 데이터가 오염됨
```

하지만 아이러니하게도, 이 도둑 방지 장치를 **비활성화하는 설정값**도 소스 코드에 그대로 노출되어 있었습니다.

### 5. 미공개 기능 및 모델

소스 코드에서 **44개의 피처 플래그**가 발견되었습니다.

| 코드네임        | 기능                                                        |
| --------------- | ----------------------------------------------------------- |
| **카이로스**    | 자율 에이전트 — GitHub 알림, 푸시 알림, 파일 전송 자동 수행 |
| **울트라플랜**  | 원격 계획 기능                                              |
| **보이스 모드** | 음성 인터페이스                                             |

또한 아직 발표되지 않은 **다음 세대 모델 이름**까지 코드에 포함되어 있었습니다.

| 모델명     | 비고                 |
| ---------- | -------------------- |
| 오퍼스 4.7 | 차세대 플래그십 모델 |
| 소네 4.8   | 차세대 중급 모델     |
| 카피바라   | 신규 모델 (코드네임) |

이는 **경쟁사에게 Anthropic의 로드맵을 통째로 보여주는 것**이나 다름없어 전략적 타격이 될 수 있습니다.

---

## 토큰 사용량 급증의 진짜 원인

### 문제 현상

2026년 3월 23일부터 클로드 코드 사용자들 사이에서 **토큰이 비정상적으로 빨리 소진**된다는 불만이 폭주했습니다.

- 월 100달러 요금제가 **45분 만에** 한도 소진
- 사용량 미터가 **갑자기 급증**하는 현상 다수 보고

### 원인: 프롬프트 캐시 버그

유출된 소스코드를 분석한 개발자가 원인을 찾아냈습니다. 관련 이슈는 [GitHub Issue #26330](https://github.com/anthropics/claude-code/issues/26330)에서 확인할 수 있으며, 캐시 읽기 시 67,374 토큰의 캐시를 읽으면서 실제 새 입력은 고작 3 토큰이었다는 비정상적 수치가 보고되었습니다.

```
정상 동작:
  이전 대화 → 캐시 저장 ✅ → 캐시에서 읽기 ✅ → 효율적 처리

실제 동작 (버그):
  이전 대화 → 캐시 저장 ✅ → 캐시에서 읽기 ❌ → 전체 재처리 💸
```

캐시에 저장하는 것은 성공했으나, **다시 꺼내 읽는 데 실패**하는 버그였습니다. 결과적으로 매 대화마다 전체 내용을 처음부터 다시 처리하게 되면서 비용이 급증했습니다.

### 추가 문제: 자동 압축 무한 루프

캐시 버그에 더해 **자동 압축 기능 버그**로 하루 **25만 건의 불필요한 API 호출**이 발생했습니다.

한 사용자는 세션을 다시 열었을 뿐인데 **65만 개의 출력 토큰이 생성**되어 약 **342달러**의 비용이 발생했다고 보고했습니다.

### 해결: 고작 세 줄의 코드

자동 압축 무한 루프 버그는 **연속 압축 실패 횟수를 3번으로 제한**하는 코드 한 줄이면 충분했습니다.

```typescript
// 수정 전: 압축 실패 시 무한 재시도
while (needsCompaction) {
  await compact();
}

// 수정 후: 최대 3번까지만 재시도
let retries = 0;
while (needsCompaction && retries < 3) {
  await compact();
  retries++;
}
```

수백 달러의 비용을 발생시킨 문제가 이렇게 간단한 수정으로 해결 가능했다는 점에서 많은 개발자들이 허탈해했습니다.

---

## 커뮤니티 반응과 코드 품질 비판

### 오픈소스 재구현 프로젝트 폭발

유출된 소스를 기반으로 **파이썬으로 클린룸 재구현**한 [instructkr/claw-code](https://github.com/instructkr/claude-code) 프로젝트가 2시간 만에 GitHub 스타 **5만 개**를 돌파하며 역사상 가장 빠른 기록을 세웠습니다. 현재는 **10만 스타를 돌파**했으며, **Rust로 재구현**하는 작업도 진행 중입니다. 이 프로젝트는 단순 아카이브가 아닌 실제 동작하는 도구를 만드는 것을 목표로 하고 있습니다.

### 3,167줄짜리 함수

코드 품질에 대한 비판도 거셌습니다.

| 항목           | 수치    |
| -------------- | ------- |
| 함수 길이      | 3,167줄 |
| 들여쓰기 깊이  | 12단계  |
| 매개변수 수    | 12개    |
| 분기점(branch) | 486개   |

여러 모듈로 분리해야 할 내용을 한 함수에 전부 담고 있어, **"AI에게 코딩을 시킨 것 아니냐"**는 추측까지 나왔습니다.

---

## 사건의 의미와 사용자 권고

### 이번 유출이 보여준 것

이번 유출은 단순한 보안 사고를 넘어 **AI 코딩 도구의 내부 작동 방식을 날것 그대로** 볼 수 있었던 사건입니다.

- 유출을 막기 위해 만든 **언더커버 모드**조차 소스 코드 안에 있었고, 결국 유출되면서 **비밀을 지키는 방법까지 전부 드러남**
- 소스맵 파일 **하나의 실수**로 다마고치 펫부터 미공개 모델명까지 모든 것이 공개
- 토큰 급증 문제의 원인이 **세 줄 코드로 해결 가능한 버그**였다는 사실

### 클로드 코드 사용자 권고 사항

| 권고                     | 이유                                                      |
| ------------------------ | --------------------------------------------------------- |
| 세션을 너무 길게 유지 X  | 오래된 세션에서 캐시 비효율이 남아있을 수 있음            |
| 토큰 급증 시 세션 재시작 | 캐시 버그 패치 이후에도 기존 세션에는 영향이 남을 수 있음 |
| 사용량 모니터링          | 비정상적 토큰 소비가 감지되면 즉시 세션 교체              |

---

## 마무리

소스맵 파일 하나의 실수가 만우절 이벤트용 다마고치 펫부터 차세대 모델 코드네임, 그리고 수백 달러의 비용을 유발한 캐시 버그의 원인까지 모든 것을 드러낸 사건이었습니다.

AI 도구를 만드는 회사도 결국 사람이 만드는 소프트웨어라는 것, 그리고 **npm publish 전에 소스맵을 꼭 확인하자**는 교훈을 남긴 사건이었습니다.

---

## 참고자료

| 분류        | 링크                                                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 뉴스        | [The Verge - Claude Code leak exposes a Tamagotchi-style 'pet' and an always-on agent](https://www.theverge.com/ai-artificial-intelligence/904776/anthropic-claude-source-code-leak)                                      |
| 분석 블로그 | [Medium - Claude Code's Entire Source Code Was Just Leaked via npm Source Maps](https://medium.com/@anhaia.gabriel/claude-codes-entire-source-code-was-just-leaked-via-npm-source-maps-here-s-what-s-inside-eb9f6a1d5ccb) |
| 분석 블로그 | [Alex Kim - The Claude Code Source Leak: fake tools, frustration regexes, undercover mode, and more](https://alex000kim.com/posts/2026-03-31-claude-code-source-leak/)                                                    |
| 기술 분석   | [DEV.to - I Tore Apart the Claude Code Source Code (3부작)](https://dev.to/_53fb7c03dd741a6124e4e/i-tore-apart-the-claude-code-source-code-33-2jb1)                                                                       |
| 기술 분석   | [Siddhant Khare - The plumbing behind Claude Code](https://siddhantkhare.com/writing/the-plumbing-behind-claude-code)                                                                                                     |
| GitHub      | [leaked-claude-code/leaked-claude-code (유출 원본 아카이브)](https://github.com/leaked-claude-code/leaked-claude-code)                                                                                                    |
| GitHub      | [instructkr/claw-code (Python/Rust 재구현, 100K+ Stars)](https://github.com/instructkr/claude-code)                                                                                                                       |
| GitHub      | [anthropics/claude-code Issue #26330 - Prompt cache corruption](https://github.com/anthropics/claude-code/issues/26330)                                                                                                   |
| 재미        | [Claude Buddy Checker (내 버디 확인하기)](https://claudebuddychecker.netlify.app/)                                                                                                                                        |
