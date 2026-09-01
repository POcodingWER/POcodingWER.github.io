---
layout: post
title: "[DEVELOP] 실무 모노레포에 에이전트 하네스를 깔고 운영해본 기록"

subtitle: "프롬프트를 잘 쓰는 대신 코드베이스에 에이전트가 일할 환경을 만들었습니다 — 컨텍스트 문서, 행동 제약 룰, MCP 예산 관리, 리뷰 로그까지"

date: 2026-09-01 10:40:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/04/claude_code.webp"

categories:
  - DEVELOP

tags:
  - Agent Harness
  - 에이전트 하네스
  - 바이브 코딩
  - Vibe Coding
  - AI Agent
  - Cursor
  - Cursor Rules
  - Cursor Skill
  - CLAUDE.md
  - MCP
  - Sentry
  - Module Federation
  - 모노레포
  - PR Review
  - 컨텍스트 관리
---

{% include post/develop_contents.md %}

> 예전에 [에이전트 하네스 엔지니어링이란?](/develop/2026/04/09/agent-harness/) 이라는 글에서 개념을 정리한 적이 있습니다. 그 뒤로 실제 업무 프로젝트에 하네스를 하나씩 깔아보면서 몇 달을 굴려봤고, 이 글은 그 운영 기록입니다. **"AI에게 뭘 시켰나"가 아니라 "AI가 일할 환경을 어떻게 만들었나"** 에 대한 이야기입니다.

---

## 시작은 리팩터링 사고에서

지금 맡고 있는 프로젝트는 **앱 9개짜리 pnpm 모노레포**입니다. `main`이 Module Federation 호스트이고 그 아래로 `charging`, `laundry`, `point`, `ticket`, `conversion`, `login`, `error` 가 리모트로 붙습니다. (`ground` 하나만 Federation에 포함되지 않고 별도 배포입니다.)

```
main (호스트) ─── remotes ──→ ticket, laundry, point, error, login, conversion, charging
```

그 밑을 `packages/` 가 단일 워크스페이스 `@shared`로 받칩니다. 여기에 이 구조의 함정이 있습니다.

> `packages/*` 변경은 해당 패키지를 사용하는 **모든 앱에 영향**을 줌.
> Turbo `globalDependencies`에 포함되어 변경 시 전체 앱 캐시가 무효화됨.

사람은 이걸 알고 조심하는데, 에이전트는 모릅니다. 그래서 초반에 이런 일이 반복됐습니다.

- "이 버튼 하나 고쳐줘" → 공유 컴포넌트를 추상화하기 시작함
- 이미 `@shared/utils`에 있는 함수를 새로 만들어서 중복시킴
- 번역 키를 보기 좋게 리네이밍해서 다른 앱 텍스트가 깨짐

문제는 에이전트의 능력이 아니었습니다. **매 세션마다 이 프로젝트가 어떤 곳인지 모른 채 시작한다는 것**이 문제였습니다. 사람이라면 온보딩하면서 배우는 걸 에이전트는 배울 데가 없었던 거죠.

그래서 방향을 바꿨습니다. 프롬프트를 정교하게 쓰는 데 시간을 쓰는 대신, **코드베이스 자체에 에이전트가 읽을 환경을 만들어 두기로** 했습니다.

---

## 1층: 프로젝트 컨텍스트 문서 (`CLAUDE.md`)

가장 먼저 만든 건 루트의 컨텍스트 문서입니다. `CLAUDE.md` 하나에 308줄.

| 섹션                   | 내용                                                      |
| ---------------------- | --------------------------------------------------------- |
| 아키텍처               | Module Federation 호스트–리모트 관계, shared 모듈 목록    |
| 앱별 도메인 책임       | 9개 앱 각각의 담당 도메인과 특이사항 (Jotai 사용 여부 등) |
| 공유 패키지 역할       | `@shared/*` 서브패스별 import 경로와 역할                 |
| packages 변경 시 주의  | 캐시 무효화 영향 범위                                     |
| 코드 스타일 / 스타일링 | SCSS 규칙, 네이밍 컨벤션                                  |
| i18n                   | 네임스페이스 구조, 공통 언어시트 판단 기준                |
| API 및 상태관리        | `ResponseController` 패턴, React Query 우선 원칙          |
| 런타임 환경            | 웹뷰 환경 제약                                            |
| **에이전트 행동 규칙** | 하지 말아야 할 것 + 작업 완료 체크리스트                  |

앞쪽은 평범한 온보딩 문서인데, **마지막 섹션이 이 문서를 하네스로 만듭니다.**

### 하지 말아야 할 것 (IMPORTANT)

```markdown
- **요청하지 않은 리팩토링 수행 금지** — 지시받은 범위만 수정
- **새로운 추상화 레이어 도입 시 반드시 사유 설명** — 100줄 이상의 새 모듈/클래스 생성 전 확인 요청
- **기존 패턴과 다른 새로운 패턴 도입 금지** — 프로젝트 내 기존 패턴을 따를 것
  (예: 상태관리는 React Query 우선, API는 fetch + ResponseController 패턴)
- **사용하지 않는 코드/import 남기기 금지** — 작업 완료 후 반드시 정리
- **packages/\* 변경 시 영향받는 앱 목록 반드시 명시**
- **과도한 주석 금지** — 코드가 스스로 설명하지 못하는 부분만 주석 작성
- **확실하지 않은 가정 위에 구현 쌓기 금지** — 불확실하면 질문할 것
```

그리고 작업이 끝날 때 스스로 확인할 체크리스트를 붙였습니다.

```markdown
- [ ] 새 유틸/훅에 vitest 테스트를 작성했는가
- [ ] 미사용 import/변수를 제거했는가
- [ ] 기존 코드 패턴과 일관성이 있는가
- [ ] TypeScript strict 모드에서 에러가 없는가
- [ ] packages/\* 변경이라면 영향 범위를 명시했는가
- [ ] 100줄 이상의 새 파일이라면 그 필요성이 정당한가
```

이 문서에 적어둔 협업 원칙 한 줄이 있는데, 지금도 제일 잘 지키려고 하는 문장입니다.

> AI 에이전트와 협업할 때, 노력의 70%는 **문제 정의와 검증**에, 30%를 **실행**에 투자합니다.

문서를 넣고 나서 눈에 띄게 달라진 건, **"이거 고치면 `packages/*`라서 이 앱들에 영향이 갑니다"** 를 에이전트가 먼저 말하기 시작했다는 점입니다.

---

## 2층: 룰로 행동을 제약하기

컨텍스트 문서가 **"이 프로젝트는 이렇게 생겼다"** 라면, 룰은 **"그러니까 너는 이렇게 판단해라"** 입니다. `.cursor/rules/`에 `alwaysApply: true`인 룰 두 개를 얹었습니다.

### `ponytail.mdc` — 게으른 시니어 모드

이름은 그냥 취향이고, 내용은 **코드를 쓰기 전에 올라가야 할 사다리**입니다.

```markdown
---
description: Ponytail, lazy senior dev mode. Always pick the simplest solution that works.
alwaysApply: true
---

You are a lazy senior developer.
Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase?
3. Does the standard library already do this?
4. Does a native platform feature cover it?
5. Does an already-installed dependency solve it?
6. Can this be one line?
7. Only then: write the minimum code that works.
```

**"조건이 성립하는 첫 번째 칸에서 멈춰라(stop at the first rung that holds)"** 라는 표현을 쓴 게 핵심입니다. 7번까지 가는 걸 기본값이 아니라 예외로 만들어버리는 거죠.

여기에 안전장치를 두 개 붙였습니다. 하나는 **사다리를 타기 전에 문제를 먼저 이해하라**는 조건입니다.

> The ladder runs after you understand the problem, not instead of it.
> Shortest working diff wins, **but only once you understand the problem.**
> The smallest change in the wrong place isn't lazy, it's a second bug.

짧은 diff만 강조하면 에이전트가 증상만 때우는 패치를 내놓습니다. 그래서 버그 수정은 **호출자를 전부 grep해서 공통 함수 한 곳을 고치라**고 따로 못 박아 뒀습니다. 티켓에 적힌 경로만 고치면 형제 호출자는 그대로 깨져 있으니까요.

다른 하나는 **게으르면 안 되는 목록**입니다.

> Not lazy about: 문제 이해, 신뢰 경계에서의 입력 검증, 데이터 손실을 막는 에러 처리,
> 보안, 접근성, 그리고 명시적으로 요청된 것.

그리고 의도적으로 단순하게 짠 부분은 `ponytail:` 주석으로 표시하고, **한계와 업그레이드 경로를 같이 적게** 했습니다. 전역 락이나 O(n²) 스캔 같은 걸 그냥 두더라도 "언제 터지는지"는 코드에 남게 됩니다.

이 룰 하나로 **요청하지 않은 추상화**가 확 줄었습니다.

에이전트는 기본적으로 잘 보이고 싶어합니다. 시키지 않은 리팩터링, 과한 방어 코드, 미래를 대비한 인터페이스... 전부 선의에서 나오는데 리뷰 비용은 사람이 냅니다. 그래서 **"잘 일하게 만드는 것"만큼 "과하게 일하지 않게 막는 것"** 이 중요했습니다.

### `i18n-key-naming.mdc` — 번역 키 보호

두 번째 룰은 신규 번역 키의 형식을 고정합니다.

```
{ns_prefix}.{section}_{element}_{variant}

예) home.main_quick_charge_button
    laundry.equipment_connect_error_title
    setting.account_delete_confirm_title
```

그런데 이 룰에서 진짜 일하는 건 형식이 아니라 **첫 문장**입니다.

> 이 규칙은 **신규 및 변경 번역 key**에만 적용한다.
> 기존 key는 별도 마이그레이션 요청이 없으면 수정하지 않는다.

그리고 금지 항목에 못을 한 번 더 박았습니다.

```markdown
## 금지

- 기존 key를 새 규칙에 맞추기 위한 임의 일괄 변경
- `market.post.delete.title`처럼 점을 사용한 다단계 계층
- `camelCase`, `kebab-case`, `SCREAMING_SNAKE_CASE` 신규 key
```

이 한 줄이 실제로 사고를 막았습니다. 에이전트 입장에서 네이밍이 지저분한 옛날 키를 보면 정리하고 싶어지는데, **그 키를 다른 앱 3개가 쓰고 있다는 건 diff에 안 보이거든요.**

**룰은 스타일 가이드가 아니라 가드레일입니다.** 컨벤션을 예쁘게 만드는 게 목적이 아니라, 에이전트가 밟으면 안 되는 지뢰밭에 울타리를 치는 겁니다.

---

## 3층: MCP는 붙이는 것보다 끄는 게 설계

MCP는 두 개만 씁니다.

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "Sentry": { "url": "https://mcp.sentry.dev/mcp" },
    "figma": { "type": "http", "url": "https://mcp.figma.com/mcp" }
  }
}
```

그런데 진짜 중요한 건 붙였다는 사실이 아니라 **언제 켤지**를 문서로 못 박은 점입니다. `.cursor/docs/MCP.md`에 144줄짜리 사용 규칙을 따로 뒀고, 맨 위에 이렇게 적혀 있습니다.

> MCP는 **필요할 때만 켜고, 안 쓸 때는 반드시 끈다.**

다만 이건 **자동으로 꺼진다는 뜻이 아닙니다.** Cursor는 작업이 끝났다고 MCP를 Disable하지 않습니다. `mcp.json`은 서버 목록일 뿐이고, 실제 스위치는 **Settings → Tools & MCP 패널의 Enable/Disable**입니다. 조사나 UI 작업이 끝나도 패널을 안 건드리면 툴 스펙은 다음 세션 컨텍스트에 그대로 남습니다. 문서에 "즉시 OFF"라고 써둔 건 시스템이 하는 일이 아니라, **사람이 패널에서 끄는 습관을 팀 규칙으로 만든 것**입니다.

| MCP        | 켤 때 (패널 Enable)                    | 끌 때 (패널 Disable, 수동)   |
| ---------- | -------------------------------------- | ---------------------------- |
| **Sentry** | 에러·이슈를 찾을 때만 (장애 조사)      | 조사 끝나면 패널에서 끈다    |
| **Figma**  | UI 작업할 때만 (spacing/컬러/스크린샷) | UI 작업 끝나면 패널에서 끈다 |

그래서 팀원들이 제일 많이 헷갈렸던 문장을 문서에 따로 넣었습니다.

> `mcp.json`에 정의되어 있어도, **패널에서 OFF면 에이전트가 쓰지 않는다.** 설정 파일 ≠ 항상 켜짐.

![Cursor MCP 패널. Figma만 Enable이고 Sentry는 Disabled](/img/post/2026/09/cursor-mcp-panel.webp){: width="770" height="320"}

위 화면이 그 스위치입니다. `mcp.json`에는 Figma와 Sentry가 둘 다 정의돼 있지만, 실제로 켜진 건 Figma뿐입니다. Sentry는 Disabled라 에이전트가 못 씁니다. 대신 Figma가 Enable인 동안 **툴 32개 + 리소스 104개**가 컨텍스트에 실립니다. UI 작업이 끝났는데도 이 상태를 두면, 다음 코딩 세션까지 그 스펙이 따라옵니다. 자동으로 꺼지지 않으니까요.

이유는 이렇습니다.

- MCP가 켜져 있으면 도구 목록·설명이 에이전트 컨텍스트에 실려 **토큰 사용량이 증가**한다.
- 서버/도구가 많을수록 오버헤드가 커지고, 불필요한 툴 호출로 **응답 품질이 떨어질 수 있다.**
- 일상 코딩(버그 수정, UI 문구 변경 등)에는 MCP가 필요 없다.

여기에 제약을 하나 더 뒀습니다. 꺼지지 않는다는 전제에서, **애초에 적어둘 서버 수부터 줄이는** 쪽입니다.

> 프로젝트에 상시 연결해도 되는 서버는 **소수(대략 2~4개)** 로 유지한다.
> "있으면 좋을 것 같은" MCP를 계속 추가하지 않는다. (토큰·노이즈만 증가)

MCP를 처음 붙일 때는 다들 신기해서 이것저것 연결합니다. 저도 그랬고요. 그런데 툴이 늘어날수록 에이전트가 **엉뚱한 툴을 고르는 빈도**가 눈에 띄게 올라갑니다. 파일 하나 읽으면 될 일에 MCP 툴을 세 번 호출하고 있는 걸 보고, 켤 때를 좁히고 목록 자체를 줄이는 쪽으로 갔습니다. 자동 OFF가 없으니, 예산 관리는 결국 **연결 개수와 수동 토글** 두 축입니다.

컨텍스트는 무한 자원이 아니라 **관리해야 할 예산**입니다. 이건 [컨텍스트 로트](/develop/2026/04/09/context-rot/) 글에서 다뤘던 문제와도 이어집니다.

---

## 4층: 볼 만한 데이터가 있어야 MCP가 값을 한다

Sentry MCP를 붙이고 나서 알게 된 게 있습니다. **MCP를 켜도 이슈 목록이 쓰레기면 아무 소용이 없습니다.**

저희 서비스는 전부 네이티브 앱의 웹뷰에서 돕니다. 그래서 코드 버그가 아닌 **환경 노이즈**가 에러 목록을 덮고 있었습니다. 이걸 `beforeSend`에서 걷어냈는데, 중요한 건 **거른 이유를 주석으로 남겨뒀다는 점**입니다.

```typescript
const UNHANDLABLE_ERROR_NAME = [
  // 브라우저 에러
  "SecurityError", // 브라우저 보안 정책 문제
  "ReferenceError", // 브라우저가 react 기능 일부분을 지원하지 않음
  "NotSupportedError", // 브라우저가 특정 js 기능을 지원하지 않음
  "NotFoundError", // 브라우저가 특정 메소드를 지원하지 않음

  // 센트리 에러
  "<unlabeled event>", // 센트리에서 파싱 실패한 에러
  "<unknown>", // 센트리에서 파싱 실패한 에러, 굉장히 희소하게 발생
];

const UNHANDLABLE_ERROR_MESSAGE_KEYWORDS = [
  // 네트워크 에러
  "Failed to fetch", // 요청 후 바로 나가는 케이스에서 주로 발생, 너무 광범위함
  "Load failed", // 페이지 진입 후 fetch 완료 전 나가는 경우 주로 발생

  // 브릿지 에러
  "AppBridge", // 세탁 접근 후 포인트로 왔을 때 없는 브릿지 메서드 호출 에러
];

function isCapturableError(errorName: string, errorMessage: string) {
  return (
    !UNHANDLABLE_ERROR_NAME.includes(errorName) &&
    !UNHANDLABLE_ERROR_MESSAGE_KEYWORDS.some((keyword) =>
      errorMessage.includes(keyword),
    )
  );
}
```

이 주석들이 나중에 그대로 컨텍스트가 됩니다. `AppBridge` 옆에 "세탁 접근 후 포인트로 왔을 때"라고 적혀 있으면, 나중에 비슷한 이슈를 조사할 때 사람도 에이전트도 판단 근거를 갖게 되니까요. **필터는 지우는 행위인데, 지운 이유를 남기면 자산이 됩니다.**

### 샘플링은 "문제 난 순간"에 예산을 몰아줬습니다

```typescript
Sentry.init({
  // ...
  allowUrls: [/\/point.*/], // Federation 환경에서 내 앱 번들 에러만 수집

  tracesSampleRate: 0, // 성능 트레이싱은 비용 대비 얻는 게 적었음
  tracePropagationTargets: [],

  replaysSessionSampleRate: 0.1, // 평상시 세션은 10%만
  replaysOnErrorSampleRate: 1.0, // 에러 난 세션은 100% 리플레이
});
```

`allowUrls`가 Module Federation 환경에서 특히 중요했습니다. 호스트 한 페이지에 여러 리모트 앱 번들이 같이 올라오기 때문에, 이걸 안 걸면 **point 프로젝트에 laundry 에러가 섞여서** 들어옵니다.

샘플링은 평상시를 얕게(10%), 에러 순간을 완전하게(100%) 가져가는 쪽으로 맞췄습니다. 성능 트레이싱은 `charging`·`laundry`·`point` 에서 껐습니다. 웹뷰 환경이라 얻는 정보 대비 이벤트 비용이 커서요.

그리고 결제·환불·충전처럼 **실패가 곧 사용자 손해인 경로** 13개 파일에서는 `captureException`에 회원 식별자와 잔액 같은 컨텍스트를 태그로 붙였습니다. 소스맵은 `hidden`으로 빌드하고 업로드 직후 삭제합니다.

```typescript
// vite.config.ts
build: {
  sourcemap: 'hidden',
},
plugins: [
  sentryVitePlugin({
    org: 'fingerverse',
    project: 'metaclub-point',
    authToken: env.VITE_APP_SENTRY_AUTH_TOKEN,
    sourcemaps: {
      filesToDeleteAfterUpload: ['./dist/**/*.map'], // 업로드 후 삭제
    },
  }),
];
```

이 작업을 먼저 해뒀기 때문에 지금은 이런 게 가능합니다.

```
point 앱 최근 에러 뭐 있어?
METACLUB-CHARGING-C 이슈 상세 보여줘
이 이슈 Seer로 분석해줘
```

한 문장으로 조사가 시작되고, 에이전트가 보는 목록에 **쓸 만한 신호만** 들어있습니다. 관측 데이터 정제는 원래 MCP 때문에 한 일이 아니었는데, 결과적으로는 **MCP가 의미를 갖기 위한 전제 조건**이었습니다.

---

## 5층: PR 리뷰 스킬, 그리고 결과를 로그로 남기기

가장 효과가 컸던 건 PR 리뷰 워크플로우를 스킬로 만든 일입니다. 구현 과정은 [Cursor Agent로 PR 자동 리뷰 시스템 만들기](/develop/2026/04/29/cursor-pr-review-agent/)에 자세히 써뒀으니, 여기서는 **운영해보니 어땠는지**만 정리하겠습니다.

`.cursor/skills/pr-review/SKILL.md` 386줄이 이 순서를 정의합니다.

1. `pr-review-context.md` 로드 (모노레포·`@shared`·웹뷰 컨텍스트)
2. `gh`로 PR 정보와 diff 수집
3. `git worktree`로 PR 브랜치를 별도 디렉토리에 체크아웃 — **진행 중인 내 작업은 그대로**
4. Critical / Medium / Low 분류 리뷰
5. PR에 `[Cursor Review]` 코멘트 (요약 + 인라인)
6. `.cursor/pr-review-logs/reviews.jsonl`에 로그 저장

레포 전용 컨텍스트 파일에는 이 프로젝트에서만 중요한 확인 사항을 주입해뒀습니다.

```markdown
## 리뷰 시 중점 확인

- 모노레포 구조이므로 변경이 다른 앱/패키지에 영향을 줄 수 있는지 확인
- packages/\* 변경 시 의존하는 모든 앱에서의 호환성 검토
- import 경로가 실제 파일/디렉토리 구조 및 exports 패턴과 일치하는지 검증
- WebBridge 유틸리티는 앱-웹 간 통신 담당, 변경 시 네이티브 앱 영향도 확인
- locales/ 내 JSON 번역 파일 변경 시 키 일관성 확인
- 웹뷰 환경에 맞지 않는 기능 추가 여부
```

스킬 본체와 레포 컨텍스트를 분리해둔 덕분에, 다른 레포에 옮길 때는 **이 파일만 갈아끼우면** 됩니다.

### 로그 한 줄이 이렇게 생겼습니다

```json
{
  "reviewId": "pr-924",
  "date": "2026-08-11",
  "repo": "metaclub-v2-web",
  "branch": "MC-626 → develop",
  "filesChanged": 150,
  "additions": 7931,
  "deletions": 255,
  "issues": { "critical": 2, "medium": 1, "low": 1 },
  "accepted": 4,
  "rejected": 0,
  "rejectedReasons": []
}
```

여기서 제일 중요한 필드는 `rejectedReasons`입니다. **왜 안 고쳤는지를 남기는 칸**이거든요.

### 실제로 쌓인 통계

`scripts/stats.py`를 돌리면 이렇게 나옵니다.

```
============================================================
  PR 리뷰 통계 요약 [현재 프로젝트]
============================================================

📊 전체 현황
  총 리뷰 건수        : 3건
  총 변경 파일         : 154개
  총 변경 코드         : +8004 / -258 (8262줄)

🔍 심각도 분포
  Critical/High       : 2건
  Medium              : 4건
  Low/Style           : 4건
  합계                : 10건

📈 핵심 지표
  수용률              : 60.0% (6/10)
  리뷰 밀도           : 1.2건 / 1000줄
  Critical 검출률     : 33.3% (1/3 PR)

❌ 미수정 사유 (상위 5개)
  [1건] Medium: 디바이스 시간 변경으로 테스트 가능하며, 배포 시점에는 실제 시간과 동일하게 동작
  [1건] Low: 캐시백 이벤트는 기간제 프로모션이므로 현재 하드코딩 방식으로 관리
  [1건] 이번 작업이 임시 처리고 이후 필요 시 네이티브 단에서 처리할 예정 (openTerms 로직 중복)
  [1건] 이번 작업이 임시 처리고 이후 필요 시 네이티브 단에서 처리할 예정 (staging 환경 URL 분기 기준 불일치)
============================================================
```

PR별로 보면 이렇습니다.

| PR     | 변경 규모           | 지적              | 수용 | 거부 |
| ------ | ------------------- | ----------------- | ---- | ---- |
| pr-884 | 2파일, +16/-3       | M 1, L 1          | 0    | 2    |
| pr-924 | 150파일, +7931/-255 | **C 2**, M 1, L 1 | 4    | 0    |
| pr-925 | 2파일, +57          | M 2, L 2          | 2    | 2    |

### 수용률보다 "미수정 사유"가 중요합니다

수용률 60%만 보면 애매한 숫자입니다. 그런데 저는 이 통계에서 **맨 아래 미수정 사유 블록**을 제일 자주 봅니다.

거부된 4건에 전부 이유가 남아 있습니다.

- _"캐시백 이벤트는 기간제 프로모션이므로 현재 하드코딩 방식으로 관리"_
- _"이번 작업이 임시 처리고 이후 필요 시 네이티브 단에서 처리할 예정"_

AI 리뷰를 그대로 따르는 게 목적이 아닙니다. **어떤 지적이 실제로 맞았고 어떤 게 맥락을 몰라서 나온 건지를 축적**하는 게 목적입니다. 위 사유가 쌓이면 `pr-review-context.md`에 "기간제 프로모션 상수는 하드코딩 허용" 같은 항목을 추가할 수 있고, 그러면 **같은 지적이 반복되지 않습니다.** 로그가 리뷰 품질의 피드백 루프가 되는 구조입니다.

### 대규모 PR에서 값을 낸 사례

표에서 **pr-924**를 보면 150파일에 8천 줄 가까이 바뀐 PR입니다. 솔직히 사람이 집중력을 유지하며 제대로 보기 힘든 규모입니다.

![PR #924 Cursor Review. Critical 2건 포함 4건 전부 수정 완료](/img/post/2026/09/cursor-pr-924-review.webp){: width="649" height="838"}

여기서 Critical 2건이 잡혔고 **4건 전부 수용**됐습니다. 닉네임 입력에 에러 코드를 번역 없이 노출한 것과, fallback 키 끝에 점이 하나 더 붙어 번역이 깨지던 건 사람이 8천 줄 사이에서 놓치기 쉬운 종류입니다. 반대로 pr-884는 2파일짜리 작은 PR인데 수용 0/2입니다. 작은 변경은 사람이 이미 잘 보고 있으니까요.

**AI 리뷰는 사람 리뷰를 대체하는 게 아니라, 사람의 주의력이 떨어지는 지점을 메꾸는 도구**라는 게 데이터로 확인된 셈입니다.

---

## 솔직하게, 아직 안 된 것들

기록을 남기는 김에 과장하지 않으려고 한계도 적어둡니다.

### "PR 리뷰 봇"은 아닙니다

GitHub App도 Actions 워크플로우도 아닙니다. **로컬 Cursor 스킬 + `gh` CLI** 방식이고, 코멘트도 제 개인 계정으로 달립니다. `.github/workflows/`에는 `deploy-dev` / `deploy-stage` / `deploy-prod` 3개뿐이고 AI 리뷰나 lint·test CI는 없습니다.

즉 **트리거가 사람**입니다. "PR 리뷰해줘"를 직접 쳐야 돌아갑니다. 그래서 코멘트에 `[Cursor Review]` 태그를 붙여 사람 리뷰와 구분하고 있고, 다음 단계로 GitHub App 전환을 계획 중입니다.

### 문서로 정한 규칙이 기계로 검증되지 않습니다

이게 제일 뼈아픈 부분입니다. `CLAUDE.md`에는 이렇게 적혀 있습니다.

> **새 유틸 함수/커스텀 훅 작성 시 테스트 필수**

그런데 실제 레포에는 vitest 테스트가 사실상 1개, Playwright가 `ticket`·`login` 앱에만 있고, **그마저 CI에서 실행되지 않습니다.** ESLint도 사내 공유 config를 쓰고 프로젝트 전용 커스텀 룰은 없습니다.

문서는 어기면 그만이지만 lint 룰과 CI는 못 어깁니다. MCP도 같은 부류입니다. 작업이 끝났다고 패널이 꺼지지 않으니, 규칙을 안 지키면 다음 세션까지 툴이 컨텍스트에 남습니다. **에이전트에게 규칙을 알려주는 층은 만들었는데, 그 규칙을 기계가 강제하는 층이 비어 있는 상태**입니다. 여기가 다음 숙제입니다.

### 실험은 수집만 되고 검증 루프가 없습니다

GTM 계측은 `collectGTM` 유틸과 GA 임프레션 훅으로 노출/클릭 규칙(`{gaCode}` / `{gaCode}-c`)을 만들어서 **122개 파일**에서 호출됩니다. 데이터는 잘 쌓이고 있습니다.

그런데 **쌓은 데이터로 가설을 검증하고 다음 결정을 내리는 루프**는 아직 없습니다. 실험 인프라의 절반(수집)만 있는 상태입니다.

---

## 정리하면

몇 달 굴려보고 나서 남은 생각은 이겁니다.

**AI를 쓰는 방식 자체를 제품처럼 다뤄야 합니다.**

| 제품 개발에서 하는 일 | 에이전트 하네스에서 대응되는 것             |
| --------------------- | ------------------------------------------- |
| 요구사항 명세         | `CLAUDE.md` 프로젝트 컨텍스트               |
| 코딩 컨벤션           | `.cursor/rules/*.mdc` 가드레일              |
| 성능 예산             | MCP 연결 개수 제한 + 패널 수동 토글         |
| 모니터링              | 노이즈 걸러낸 Sentry 데이터                 |
| 회고                  | `reviews.jsonl` 수용/거부 로그와 `stats.py` |

프롬프트를 잘 쓰는 건 그 순간에만 유효합니다. 세션이 바뀌면 사라지고, 팀원에게 전달되지도 않습니다. 반면 **코드베이스에 박아둔 문서와 룰은 팀 전체가 공유하고 git 히스토리에 남습니다.** 그래서 `.cursor/README.md`에도 이렇게 적어뒀습니다.

> `rules` / `skills` 변경은 에이전트 행동에 바로 영향이 갑니다. **PR로 리뷰하는 걸 권장합니다.**

그리고 하나 더. **잘 일하게 만드는 것보다 과하게 일하지 않게 막는 게 실제 협업 품질을 좌우했습니다.** 에이전트의 출력이 늘어나는 건 쉬운데, 그중 리뷰할 가치가 있는 것만 남기는 건 어렵습니다.

배포가 끝이 아닌 것처럼, 에이전트를 도입한 것도 시작이었습니다. 지금은 lint 룰과 CI 검증 층을 채우는 게 다음 목표입니다.

---

## 함께 보면 좋은 글

- [에이전트 하네스 엔지니어링이란?](/2026/04/09/agent-harness/) — 개념과 5대 구성 요소
- [컨텍스트 로트(Context Rot)](/2026/04/09/context-rot/) — 컨텍스트가 길어질 때 생기는 문제
- [Cursor Agent로 PR 자동 리뷰 시스템 만들기](/2026/04/29/cursor-pr-review-agent/) — 스킬 구현 상세
