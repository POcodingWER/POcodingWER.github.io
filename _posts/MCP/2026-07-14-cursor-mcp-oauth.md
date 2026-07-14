---
layout: post
title: "[MCP] Cursor에서 Figma·Sentry 로그인은 어떻게 되나 — 토큰은 누가 들고 있나"

subtitle: "stdio + API 키 시대에서 Remote MCP + OAuth로 — Cursor가 세션을 유지하고 AI는 tool만 호출한다"

date: 2026-07-14 11:30:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/07/cursor_mcp_oauth_hero.png"

categories:
  - MCP

tags:
  - MCP
  - Cursor
  - OAuth
  - Figma MCP
  - Sentry MCP
  - Remote MCP
  - Streamable HTTP
  - Access Token
  - 인증
  - 개발 회고
---

{% include post/mcp_contents.md %}

> 예전 Cursor MCP는 `npx`로 로컬 프로세스를 띄우고 `.env`에 API 키를 넣는 방식이 많았습니다. 지금은 Figma·Sentry처럼 **Connect만 누르면 브라우저 로그인**이 뜨고, 이후엔 **내 계정 권한**으로 tool이 돌아갑니다. 그 로그인 토큰은 AI가 들고 있는 게 아닙니다 — **Cursor(MCP Client)** 가 들고 있습니다.
>
> - 이전 글: [[MCP] 통신 구조 flow 심층분석](/mcp/2025/04/17/sse_stdio/) - [[MCP] 커서 mcp 추천3](/mcp/2026/03/19/mcp_recommend3/)

---

## 한 줄 요약

**AI는 tool 이름과 인자만 고른다. Access Token / Refresh Token은 Cursor가 저장하고, Remote MCP 호출 때 `Authorization: Bearer ...`로 붙인다.**

그래서 채팅창에 토큰이 안 보이고, Cursor Settings에 MCP가 **Connected**로 남는 겁니다.

![](/img/post/2026/07/cursor_mcp_oauth_hero.png){: #magnific}

---

## 예전엔 왜 “로그인”이 없었나

초창기 MCP는 대부분 **stdio**였습니다.

```json
{
  "mcpServers": {
    "something": {
      "command": "npx",
      "args": ["-y", "some-mcp@latest"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_xxxxx"
      }
    }
  }
}
```

- MCP 서버 = **내 PC 프로세스**
- 권한 = **.env에 넣은 API 키 주인**의 권한
- 세션 개념이 거의 없음 (프로세스 켜져 있는 동안만)

키가 있으면 로그인이 필요 없었습니다. 대신 키 유출·공유·만료 관리가 전부 사용자 책임이었습니다.

지금은 URL 한 줄이 흔합니다.

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

서버가 **SaaS(원격)** 이라서, 요청마다 “이게 누구냐”를 증명해야 합니다. 그래서 **OAuth 로그인**이 붙었습니다.

![](/img/post/2026/07/cursor_mcp_auth_before_after.png){: #magnific}

|           | Before (stdio + API Key)  | After (Remote MCP + OAuth)      |
| --------- | ------------------------- | ------------------------------- |
| 설정      | `command` + `env` API 키  | `url` + Connect                 |
| 인증      | 정적 키                   | 브라우저 로그인 · 동의          |
| 권한 주체 | 키 발급자                 | **로그인한 Cursor 사용자**      |
| 갱신      | 키 만료 시 수동 교체      | Refresh Token으로 자동 갱신     |
| 위험      | 키가 mcp.json/환경에 평문 | 스코프 · 철회 · 클라이언트 보관 |

---

## Cursor 기준으로 누가 무엇을 하나

![](/img/post/2026/07/cursor_mcp_who_holds_token.png){: #magnific}

| 주체                    | 토큰을 보나? | 하는 일                                      |
| ----------------------- | ------------ | -------------------------------------------- |
| **AI (LLM)**            | ❌           | “Figma 이 프레임 가져와” → `tools/call` 제안 |
| **Cursor (MCP Client)** | ✅           | OAuth 진행, 토큰 저장, HTTP에 Bearer 부착    |
| **Figma / Sentry MCP**  | 요청마다     | Bearer 검증 → 그 사용자 ACL로 본사 API 호출  |
| **채팅 / 프롬프트**     | 원칙상 ❌    | 토큰이 모델 컨텍스트에 안 들어가게 설계      |

채팅에서 보이는 건 대략 이런 수준입니다.

```
USER: 하남스타필드 슈퍼차저 찾아줘   (또는 Figma 디자인 가져와)
AI  → tools/call search_...(place, ...)   ← 인자만
Cursor → HTTPS + Authorization: Bearer <token>  ← 토큰은 여기서
MCP  → 내 권한으로 데이터 반환
AI  → 돌아온 결과만 읽고 답변
```

**세션처럼 보이는 것**의 정체도 Cursor입니다. Access Token이 만료되면 Refresh Token으로 갱신하고, Refresh도 끊기면 다시 Connect를 요구합니다. 웹 쿠키 세션과 느낌은 비슷하지만, 실제로는 **OAuth 토큰 수명 + 클라이언트 auto-refresh** 입니다.

---

## Cursor에서 실제로 일어나는 5단계

![](/img/post/2026/07/cursor_mcp_oauth_flow.png){: #magnific}

### 1. MCP URL 등록

Settings → MCP (또는 `.cursor/mcp.json`)에 Remote 서버를 넣습니다.

```json
{
  "mcpServers": {
    "figma": { "url": "https://mcp.figma.com/mcp" },
    "sentry": { "url": "https://mcp.sentry.dev/mcp" }
  }
}
```

> URL은 서비스마다 다를 수 있습니다. 공식 문서의 Remote MCP endpoint를 그대로 쓰세요.

### 2. Connect / Authenticate

Cursor UI에서 **Connect** (또는 Authenticate)를 누릅니다.  
이 순간 Cursor는 자신을 **OAuth Client**로 두고, Figma/Sentry를 **Authorization Server**로 호출합니다.

Settings → **Tools**에는 `Wait for MCP Authentication` 옵션도 있습니다. 켜 두면 로그인 프롬프트가 끝날 때까지 기다리고, 끄면 약 30초 후 인증을 건너뜁니다.

### 3. 브라우저 로그인 + Allow

브라우저가 뜹니다.

1. Figma/Sentry 계정으로 로그인
2. “이 앱이 어떤 권한(scope)을 요구하는지” 확인
3. **Agree & Allow Access**

여기서 동의하는 대상은 AI가 아니라 **Cursor MCP Client ↔ 해당 서비스** 입니다.

![](/img/post/2026/07/cursor_mcp_oauth_browser.png){: #magnific}

위 화면처럼 _“Cursor MCP Client would like to access your account”_ 문구가 나오고, 동의하면 Figma Remote MCP에 읽기·쓰기 접근이 부여됩니다. 아래에는 현재 로그인된 계정(이메일)과 Switch accounts가 보입니다.

### 4. 토큰 교환 · Cursor가 저장

Authorization Code를 Access Token(+ Refresh Token)으로 바꿉니다.  
토큰은 **Cursor 쪽 보안 저장소**에 들어갑니다. 채팅 메시지로 흘러가지 않습니다.

동의가 끝나면 Settings → Tools에서 Figma·Sentry 옆에 **Logout**이 생깁니다. 세션이 Cursor에 붙어 있다는 증거입니다.

![](/img/post/2026/07/cursor_mcp_settings_connected.png){: #magnific}

- **figma** — Logout, `26 tools, 1 prompts, 104 resources`, 녹색 점
- **Sentry** — Logout, `9 tools enabled`, 녹색 점

“AI가 로그인된 상태”가 아니라, **Cursor가 서비스별로 토큰을 들고 있는 상태**로 읽는 게 맞습니다. Logout을 누르면 그 MCP만 인증이 끊깁니다.

서버를 펼치면 Cursor가 쓸 수 있는 tool·resource 목록이 그대로 나옵니다.

![](/img/post/2026/07/cursor_mcp_figma_tools.png){: #magnific}

`get_design_context`, `get_screenshot`, `whoami` 같은 tool 태그와 code-connect 관련 resource가 보입니다. Agent는 이 목록 안에서 tool을 고르고, 실제 HTTP 인증은 여전히 Cursor가 담당합니다.

### 5. Tool 호출 = Cursor가 Bearer를 붙임

이후 Agent가 tool을 고르면:

1. AI: `tools/call` (이름 + arguments)
2. Cursor: Remote MCP로 HTTP 요청 + `Authorization: Bearer <access_token>`
3. MCP 서버: 토큰으로 사용자 식별 → Figma/Sentry REST API를 **그 사용자 권한**으로 호출
4. 결과만 AI에게 전달

채팅의 TOOL 호출 블록에는 보통 **인자 JSON만** 보이고 토큰은 안 나옵니다. (이 컷은 나중에 보강 가능)

---

## “내 권한만”인 이유

OAuth가 마법을 부리는 게 아니라, **원래 SaaS ACL을 그대로 태웁니다.**

1. **로그인 주체 = 나**  
   토큰에 묶인 identity가 Cursor에 로그인한(동의한) 계정입니다.

2. **스코프(scope)**  
   읽기만 허용했는데 write tool을 부르면 API/서버가 거절합니다.

3. **리소스 권한**  
   Figma에서 열 수 없는 파일은 MCP로도 못 엽니다.  
   Sentry에서 안 보이는 org/project도 마찬가지입니다.

정리하면 MCP는 새 권한 체계가 아니라, **내 API 권한을 Cursor가 대신 쓰는 파이프**에 가깝습니다.

---

## 전송 방식 vs 인증 — 헷갈리기 쉬운 부분

예전에 정리했던 [stdio / SSE](/mcp/2025/04/17/sse_stdio/)는 **어떻게 붙느냐(transport)** 이슈였습니다.

| 레이어        | 예                          | 역할                   |
| ------------- | --------------------------- | ---------------------- |
| Transport     | stdio, SSE, Streamable HTTP | 메시지 전달 통로       |
| Authorization | API Key, OAuth Bearer       | 누구 권한으로 실행할지 |

Remote + OAuth는 보통 **HTTP 계열 transport** 위에서 돌아갑니다.  
로그인 UI가 생겼다고 transport가 사라진 게 아니라, **그 위에 auth 레이어가 올라온 것**입니다.

---

## Cursor에서 확인한 화면

실제로 찍은 컷 기준으로 정리하면 아래와 같습니다.

| 순서 | 화면                                               | 파일                                |
| ---- | -------------------------------------------------- | ----------------------------------- |
| 1    | 브라우저 OAuth — Agree & Allow Access              | `cursor_mcp_oauth_browser.png`      |
| 2    | Settings → Tools — Figma·Sentry Logout / Connected | `cursor_mcp_settings_connected.png` |
| 3    | Figma MCP tool·resource 목록                       | `cursor_mcp_figma_tools.png`        |
| 4    | Agent TOOL 호출 채팅 (요청 JSON에 토큰 없음)       | _(미촬영 — 추후 보강)_              |

체크포인트:

- [x] 브라우저에서 Cursor MCP Client 권한 동의
- [x] Connect 후 Logout이 보이는지 (세션이 Cursor에 있음)
- [x] tool 목록이 펼쳐지는지
- [ ] 채팅 TOOL 호출에 토큰이 안 보이는지 (4번 컷)

---

## 보안적으로 알아둘 점

- **토큰을 채팅에 붙여 넣지 마세요.** Cursor가 관리하는 쪽이 정상 경로입니다.
- **Logout / 서비스 쪽 앱 권한 철회**로 접근을 끊을 수 있습니다.
- 조직 계정은 SSO·관리형 권한 정책이 추가로 걸릴 수 있습니다.
- 예전에 env에 넣던 Personal Access Token과 OAuth Access Token은 비슷해 보여도, **발급·갱신·철회 UX**가 다릅니다.

API Key MCP가 틀린 방식은 아닙니다. 로컬 전용·오프라인·키만 있는 서비스에는 여전히 적합합니다.  
SaaS Remote MCP에서는 OAuth가 **기본값에 가까워진 것**입니다.

---

## 마무리

Cursor + Figma/Sentry MCP에서 보이는 “로그인 유지”는:

1. Remote MCP가 공개 URL로 떠 있고
2. Cursor가 OAuth Client로 브라우저 동의를 받고
3. **Cursor가 토큰을 보관·갱신**하고
4. AI는 tool call만 하며
5. 실제 API는 **내 계정 ACL**로 실행된다

는 구조입니다.

예전 stdio 글과 이어 읽으면 “통신 방식”과 “권한 방식”이 한 세트로 정리됩니다.  
Agent TOOL 호출 스크린샷(4번)이 생기면 Settings 컷 옆에 이어서 붙이겠습니다.

---

_마지막 업데이트: 2026-07-14_
