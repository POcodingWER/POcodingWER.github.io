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

채팅에 보이는 TOOL 호출에는 보통 **인자 JSON만** 있고, Bearer 토큰은 나오지 않습니다. 토큰은 HTTP 레이어에서 Cursor가 붙이기 때문입니다.

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

## 토큰은 어디에 저장되나 (Cursor · macOS)

Settings의 Logout은 UI 신호일 뿐이고, 실제 자격증명은 로컬에 있습니다. macOS 기준은 대략 이렇습니다.

| 구분 | 위치 | 내용 |
| ---- | ---- | ---- |
| 메타·암호문 | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` | `mcpOAuth.global.*`(서버 URL 등), `mcpOAuth.secret.*`(토큰 등) |
| 복호화 키 | 키체인 `Cursor Safe Storage` / `Cursor Key` | Electron safeStorage (`v10...` 암호문) |
| OAuth 시도 정보 | `.../globalStorage/mcp-oauth-attempts/` | client_id, serverUrl 등 (원문 토큰 아님) |
| 로그 | `.../logs/.../workbench.mcp.oauth.log` | authenticate / logout 상태 전이 |

`mcp.json`에는 URL만 있고 OAuth access/refresh는 보통 평문으로 안 둡니다.  
`mcpOAuth.secret` 값은 `{"type":"Buffer","data":[118,49,48,...]}`처럼 보이는데, 앞의 `v10`이 Chromium/Electron 암호문 표시입니다.

키 이름만 조회할 때는 예를 들어:

```bash
sqlite3 "$HOME/Library/Application Support/Cursor/User/globalStorage/state.vscdb" \
  "SELECT key FROM ItemTable WHERE key LIKE 'mcpOAuth.%';"
```

**value(암호문·복호화 결과)는 공유·스크린샷에 올리지 마세요.**  
Finder에서는 `~/Library`가 기본 숨김이라, `⇧⌘G`로 `~/Library/Application Support/Cursor`를 여는 편이 빠릅니다.

### Logout은 어디를 끊나

Logout의 주된 동작은 **Cursor가 로컬에 든 토큰을 지우는 것**입니다.  
로그에도 `OAuth clear candidate ... cause=user_logout`처럼 클라이언트 clear가 찍힙니다.

- Cursor 로컬 토큰 삭제 → Bearer를 붙일 수 없음 → MCP 호출 불가
- Figma/Sentry 쪽은 revocation을 호출하면 서버 토큰도 폐기될 수 있지만, “MCP 서버가 먼저 내 토큰을 날려서 로그아웃된다”가 기본 그림은 아님
- 완전히 끊으려면 서비스 계정 설정의 **연결된 앱 / 권한 철회**까지 하면 됩니다

---

## 스크린샷으로 확인한 것

1. **브라우저 Allow** — 동의 주체는 AI가 아니라 Cursor MCP Client
2. **Logout이 Settings에 남음** — 세션·토큰이 Cursor 쪽에 붙어 있음
3. **tool / resource 목록** — Agent는 이 목록에서 tool만 고름

---

## 보안적으로 알아둘 점

- **토큰을 채팅에 붙여 넣지 마세요.** Cursor가 관리하는 쪽이 정상 경로입니다.
- **Logout**으로 로컬 자격증명을 지우고, 필요하면 서비스 쪽 앱 권한도 철회하세요.
- 조직 계정은 SSO·관리형 권한 정책이 추가로 걸릴 수 있습니다.
- env의 Personal Access Token과 OAuth Access Token은 비슷해 보여도, **발급·갱신·철회 UX**가 다릅니다.
- `state.vscdb`의 `mcpOAuth.secret` value는 올리지 마세요. 구조·키 이름 설명만으로 충분합니다.

API Key MCP가 틀린 방식은 아닙니다. 로컬 전용·오프라인·키만 있는 서비스에는 여전히 적합합니다.  
SaaS Remote MCP에서는 OAuth가 **기본값에 가까워진 것**입니다.

---

## 마무리

Cursor + Figma/Sentry MCP의 “로그인 유지”를 한 줄로 쓰면 이렇습니다.

**Remote MCP URL → 브라우저 OAuth 동의 → 토큰은 Cursor가 암호화 저장 → AI는 tool만 고름 → Cursor가 Bearer를 붙여 내 계정 ACL로 실행**

예전 [stdio / SSE](/mcp/2025/04/17/sse_stdio/) 글과 이어 읽으면, “통신 방식”과 “권한 방식”이 한 세트로 정리됩니다.

---

_마지막 업데이트: 2026-07-14_
