---
layout: post
title: "[MCP] Tesla MCP 만들기 — Authorization 붙이고 LLM으로 내 차 조작해보기"

subtitle: "MCP OAuth 서버 구현 + Tesla Fleet API — Cursor Connect 한 번이면 배터리·문 잠금·내비까지"

date: 2026-07-22 09:30:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/07/tesla_mcp_hero.png"

categories:
  - MCP

tags:
  - MCP
  - Tesla
  - OAuth
  - MCP Authorization
  - Cursor
  - Fleet API
  - Remote MCP
  - Node.js
  - TypeScript
  - Claude
  - 개발 회고
---

{% include post/mcp_contents.md %}

> [이전 글](/mcp/2026/07/14/cursor-mcp-oauth/)에서 Figma·Sentry는 **클라이언트가 OAuth로 로그인**하는 구조를 봤습니다. 이번엔 반대로, **내가 만든 MCP 서버가 Authorization Server**가 되는 쪽을 직접 붙여 봤습니다. 그리고 연결 대상이 문서가 아니라 **내 Tesla**였습니다.
>
> - 프로젝트: Tesla Fleet API 기반 MCP (v0.2.0, 15 tools)
> - 배포 예: `https://tesla-mcp-12nv.onrender.com/mcp`

---

## 한 줄 요약

**Cursor Connect → MCP OAuth → Tesla 로그인 → Fleet API로 내 차 조회·제어.**  
AI는 tool만 고르고, 토큰은 Cursor와 MCP 서버가 각각 들고, 실제 차 명령은 **내 Tesla 계정 권한**으로 나갑니다.

서버 URL이 공개돼 있어도 **Connect한 본인 Tesla만** 접근합니다. A가 로그인하면 A 차량, B가 로그인하면 B 차량 — 남의 차를 건드리는 구조가 아닙니다.

![](/img/post/2026/07/tesla_mcp_hero.png){: #magnific}

헤더 이미지는 전체 흐름을 한눈에 보여 줍니다. 채팅 한 줄 → MCP tool → Fleet API → 내 차. OAuth 자물쇠는 **두 번** 붙는다는 점이 이 프로젝트의 핵심입니다.

---

## 왜 만들었나

Figma MCP OAuth 글을 쓰면서 “클라이언트 쪽 로그인”은 이해했는데, **서버 쪽 MCP Authorization**은 직접 안 붙여 보면 감이 안 온다고 느꼈습니다.

그때 떠오른 게 Tesla였습니다.

- Fleet API가 공식적으로 있음
- “배터리 몇 %야?” “문 잠궈줘” 같은 **자연어 명령**이 딱 맞음
- Remote MCP + OAuth 흐름을 **끝까지** 검증하기 좋음

솔직히 재미있었습니다. 채팅창에 “실내 23도로 맞춰줘” 치면 HVAC tool이 돌아가는 순간이, MCP가 왜 재밌는지 바로 체감됩니다.

---

## 이전 글과 뭐가 다른가

|            | Figma / Sentry MCP                | Tesla MCP (내가 만든 것)               |
| ---------- | --------------------------------- | -------------------------------------- |
| OAuth 역할 | **서비스가** Authorization Server | **내 MCP 서버가** Authorization Server |
| 로그인     | Cursor → Figma/Sentry             | Cursor → **내 서버** → Tesla           |
| API        | Figma/Sentry REST                 | Tesla Fleet API                        |
| 토큰 저장  | 주로 Cursor (클라이언트)          | Cursor(MCP JWT) + **서버(Tesla 토큰)** |

이전 글은 “토큰은 Cursor가 든다”가 핵심이었고, 이번엔 **서버도 OAuth를 구현**해서 이중 로그인 체인을 만든 셈입니다.

![](/img/post/2026/07/tesla_mcp_dual_oauth_flow.png){: #magnific}

왼쪽은 Cursor가 들고 있는 **MCP JWT**, 가운데 `tesla_mcp`가 Provider이면서 동시에 Tesla OAuth Client, 오른쪽은 서버가 userId별로 보관하는 **Fleet access/refresh**입니다. tool이 실제로 나가려면 **두 토큰 체인이 모두** 살아 있어야 합니다.

```
Cursor ──MCP OAuth──► tesla_mcp ──Tesla OAuth──► Tesla 계정
         (JWT)              (Fleet access/refresh)
                              │
                              └── Fleet API → 내 차
```

---

## 기술 스택

| 항목     | 선택                                                            |
| -------- | --------------------------------------------------------------- |
| 런타임   | Node.js 20 · TypeScript                                         |
| MCP      | `@modelcontextprotocol/sdk` — Streamable HTTP `/mcp`            |
| MCP Auth | `mcpAuthRouter` · `requireBearerAuth` · `TeslaMcpOAuthProvider` |
| Tesla    | Fleet API (`na` 리전) · Virtual Key · (선택) tesla-http-proxy   |
| 배포     | Render · Docker Hub `pocodingwer/tesla-mcp`                     |

찾아줘 주차장! MCP 때와 비슷하게 Express 위에 MCP SDK를 올리는 구조입니다. 차이는 **Authorization 레이어를 직접 구현**했다는 점입니다.

---

## MCP Authorization — 서버에서 한 일

![](/img/post/2026/07/tesla_mcp_who_holds_token.png){: #magnific}

[이전 OAuth 글](/mcp/2026/07/14/cursor-mcp-oauth/)에서 “AI는 토큰을 안 든다”는 표는 그대로입니다. Tesla MCP에서는 **Cursor가 MCP JWT**, **tesla_mcp 서버가 Tesla Fleet 토큰**을 각각 보관합니다. 채팅에 배터리 %가 보여도 Bearer 문자열은 안 나옵니다.

핵심 파일은 `src/auth/teslaOAuthProvider.ts`와 `src/index.ts`입니다.

### 1. MCP OAuth 라우터 마운트

```typescript
app.use(
  mcpAuthRouter({
    provider: oauthProvider,
    issuerUrl,
    scopesSupported: ["mcp:tools"],
    resourceName: MCP_NAME,
    resourceServerUrl: mcpServerUrl,
  }),
);

app.use(
  mcpAuthMetadataRouter({
    oauthMetadata,
    resourceServerUrl: mcpServerUrl,
    scopesSupported: ["mcp:tools"],
    resourceName: MCP_NAME,
  }),
);

app.use(
  "/mcp",
  requireBearerAuth({
    verifier: oauthProvider,
    requiredScopes: [],
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(mcpServerUrl),
  }),
);
```

Cursor가 Connect를 누르면 MCP 스펙대로 **내 서버가 OAuth Provider** 역할을 합니다. Cursor·Claude 같은 클라이언트는 **PKCE public client**로 Dynamic Client Registration을 쓰고, 메타데이터는 `mcpAuthMetadataRouter`가 노출합니다.

### 2. Tesla 로그인으로 이어지기

`authorize()`에서 내부 state를 만들고, 사용자를 **Tesla OAuth**로 redirect합니다.

```typescript
res.redirect(buildTeslaAuthorizeUrl(internalState));
```

Tesla 로그인이 끝나면 `/auth/tesla/callback` → Tesla code를 userId와 매핑 → MCP authorization code를 Cursor redirect URI로 돌려줍니다.

Tesla OAuth 스코프에는 `vehicle_device_data`, `vehicle_location`, `vehicle_cmds` 등이 포함됩니다. v0.2.0에서 **위치 tool**을 넣으면서 `vehicle_location`을 추가했고, 이미 Connect한 세션은 **Logout → 재로그인**이 필요할 수 있습니다.

### 3. MCP JWT 발급

Tesla 인증이 끝나면 서버가 **MCP용 access_token(JWT)** 과 refresh_token을 발급합니다.  
이후 `/mcp` 요청마다 `requireBearerAuth`가 JWT를 검증하고, `userId`로 **어느 Tesla 계정 토큰을 쓸지** 결정합니다.

### 4. Tesla 토큰은 서버 in-memory

```typescript
const teslaTokens = new Map<string, TeslaTokenSet>();
export const sessionUsers = new Map<string, string>(); // MCP session → userId
```

- **Cursor** → MCP Bearer JWT
- **tesla_mcp 서버** → Tesla Fleet access/refresh (사용자별)

이전 OAuth 글에서 “AI는 토큰을 안 든다”는 말은 그대로고, 여기서 추가되는 건 **MCP 서버가 Tesla 토큰을 대신 보관**한다는 점입니다.

> 서버 재시작 시 in-memory라 **MCP Logout → Connect 재인증**이 필요합니다. 프로덕션에서는 Redis 등으로 옮기는 게 다음 단계입니다.

---

## 15개 tool — 뭘 할 수 있나

![](/img/post/2026/07/tesla_mcp_tools_overview.png){: #magnific}

조회·기후·출입·충전·내비로 나뉜 15개 tool입니다. LLM은 자연어를 오른쪽 tool 이름으로 바꿉니다. `wake_vehicle`은 조회 전에 자주 끼어드는 전처리 tool이고, `get_virtual_key_link`는 제어 명령이 막혔을 때 먼저 확인하는 용도입니다.

| 구분 | Tool                                                                            |
| ---- | ------------------------------------------------------------------------------- |
| 조회 | `list_vehicles`, `get_vehicle_status`, `get_vehicle_location`, `wake_vehicle`   |
| 기후 | `set_climate`, `set_seat_climate`, `set_steering_wheel_heat`                    |
| 출입 | `set_door_lock`, `actuate_trunk`                                                |
| 충전 | `set_charge_port`, `control_charging`                                           |
| 기타 | `set_sentry_mode`, `control_windows`, `send_navigation`, `get_virtual_key_link` |

Fleet API **지원 범위 안**만 넣었습니다. 테슬라 앱 전용 기능(세차 모드 등)이나 API 미지원(글로브박스 등)은 의도적으로 빼 두었습니다.

¹ `get_vehicle_location`은 오너 계정 + `vehicle_location` 스코프 필요. 공유 운전자(`DRIVER`)는 좌표가 비어 올 수 있음 → 아래 **삽질 메모 §3** 참고.

### 채팅으로 해본 것

```
내 테슬라 배터리 알려줘
차 깨우고 상태 알려줘
실내 온도 23도로 맞춰줘
문 잠궈줘
프렁크 열어줘
충전 한도 90%로
강남역으로 내비 보내줘
```

조회는 비교적 잘 됩니다. **명령(잠금·트렁크·충전)** 은 Virtual Key 페어링 + (대부분) **tesla-http-proxy 명령 서명**이 추가로 필요합니다. “API 붙였는데 왜 안 돼?”의 80%는 여기서 걸립니다.

---

## 삽질 메모

### 1. 차가 offline / asleep

주차 후 차가 자동으로 잠듭니다. `get_vehicle_status`만 치면 `vehicle unavailable`이 나올 수 있습니다.

**해결:** `wake_vehicle` 먼저 → online 될 때까지 대기(최대 60초) → 다시 조회.

### 2. Virtual Key + 명령 서명

Fleet API 원격 명령은 Virtual Key 등록이 필요하고, 많은 명령은 **서명된 프록시**를 거칩니다. 조회(`get_vehicle_status`)만 할 때와 제어(`set_door_lock`)할 때 요구사항이 다릅니다 — 아래 아키텍처에서 Fleet API 옆 `(+ tesla-http-proxy)` 분기가 그 차이입니다.

```bash
./tesla-http-proxy -key-file keys/private-key.pem -host 127.0.0.1 -port 4443
```

```env
TESLA_COMMAND_PROXY_URL=https://127.0.0.1:4443
```

proxy 없이 Fleet API 직접 호출은 **일부 차량·명령**에서만 동작합니다. 제어가 막히면 Virtual Key → proxy 순으로 확인합니다.

### 3. 위치 스코프 + 공유 운전자

`get_vehicle_location`은 다음이 **모두** 맞아야 합니다.

- **오너 계정**으로 Connect (공유 운전자 `access_type: DRIVER`는 정밀 위치가 API로 안 내려올 수 있음)
- Tesla OAuth에 **`vehicle_location` 스코프** 허용
- 차량 **online** (`wake_vehicle` 선행)

스코프를 서버에 추가한 뒤엔 **Logout → Connect**로 재로그인해야 합니다. 그래도 좌표가 비면 응답의 `hide_private` 등 **계정 권한** 문제일 가능성이 큽니다 — Tesla 앱에서 위치가 보이는지 먼저 확인하면 됩니다.

### 4. Render cold start

무료 플랜은 15분 미사용 시 슬립 → 첫 요청 30초~1분. MCP Connect 직후 첫 tool이 느리면 서버가 깨는 중일 수 있습니다.

### 5. 테슬라 앱이 더 빠름

일상 제어는 **Tesla 앱**이 낫습니다. 이 MCP는 “AI 대화 안에서 차 상태 묻기”, “다른 MCP와 시나리오 묶기” 용도에 맞춰 두었습니다.

---

## Cursor에서 연결하기

![](/img/post/2026/07/tesla_mcp_connect_sequence.png){: #magnific}

실제 순서는 위 그림과 같습니다. **① Connect** → **② 브라우저 Tesla 로그인** → **③ MCP JWT 발급** → **④ 채팅으로 자연어** → **⑤ tool 결과**. ②에서 Tesla 계정을 바꾸면 이후 조회·제어 대상 차량도 그 계정 기준으로 바뀝니다.

`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "tesla": {
      "url": "https://YOUR_DOMAIN/mcp"
    }
  }
}
```

1. Settings → MCP → **tesla** → **Connect**
2. 브라우저에서 Tesla 로그인
3. “내 테슬라 배터리 알려줘”

URL 끝 **`/mcp`** 필수입니다. [OAuth 글](/mcp/2026/07/14/cursor-mcp-oauth/)에서 본 것처럼, Connect 후 **Logout**이 보이면 MCP JWT 세션이 붙은 상태입니다. Tesla 로그인까지 끝났는데 tool이 401이면 서버 쪽 Tesla 토큰 만료·재시작(in-memory 초기화)을 의심하면 됩니다.

로컬 개발 시 `AUTH_DISABLED=true` + `TESLA_DEV_ACCESS_TOKEN`으로 OAuth를 건너뛸 수도 있습니다.

### Claude에서 연결하기

Cursor와 동일하게 **커스텀 커넥터**에 Remote MCP URL만 넣으면 됩니다.

| 항목                   | 값                                    |
| ---------------------- | ------------------------------------- |
| 이름                   | `Tesla MCP`                           |
| URL                    | `https://YOUR_DOMAIN/mcp`             |
| OAuth Client ID/Secret | 비워 둠 (Dynamic Client Registration) |

추가 후 **Connect** → 브라우저 Tesla 로그인. 흐름은 Cursor와 같습니다.

### Fleet 파트너 등록 (배포 후 1회)

공개 HTTPS 도메인으로 배포한 뒤, 로컬에서 한 번 실행합니다.

```bash
PUBLIC_BASE_URL=https://YOUR_DOMAIN \
TESLA_CLIENT_ID=... \
TESLA_CLIENT_SECRET=... \
TESLA_PUBLIC_KEY_PATH=./deploy/public-key.pem \
npm run register:partner
```

Virtual Key용 **공개키**는 `/.well-known/appspecific/com.tesla.3p.public-key.pem` 에 서빙됩니다. **개인키**(`keys/private-key.pem`)는 Git·블로그 어디에도 올리지 않습니다.

---

## 아키텍처

전체 컴포넌트 배치입니다. `/mcp` 앞의 `requireBearerAuth`가 MCP JWT를 검증하고, tool handler 안에서 `userId`로 Tesla 토큰을 꺼내 Fleet API를 호출합니다.

![](/img/post/2026/07/tesla_mcp_architecture.png){: #magnific}

조회 API는 Fleet API만으로 충분한 경우가 많고, 잠금·트렁크·충전 같은 **명령**은 오른쪽 `tesla-http-proxy` 분기로 서명된 요청을 보냅니다. Virtual Key용 `public-key.pem`은 Fleet API가 차량과 신뢰 관계를 맺을 때 씁니다.

```
[Cursor / PlayMCP]
      │  Connect (MCP OAuth, PKCE)
      ▼
[tesla_mcp /mcp]  ← requireBearerAuth (JWT)
      │
      ├─ TeslaMcpOAuthProvider (MCP JWT 발급·검증)
      ├─ tokenStore (Tesla access/refresh, userId별)
      │
      ├─ GET  /auth/tesla/callback  (Tesla OAuth 복귀)
      ├─ GET  /.well-known/appspecific/com.tesla.3p.public-key.pem  (Virtual Key)
      │
      ▼
[Tesla Fleet API]  (+ tesla-http-proxy, 명령 서명 시)
      ▼
[내 차]
```

---

## 이전 MCP 글들과 이어지는 지점

| 글                                                              | 이번 프로젝트에서 쓴 것                    |
| --------------------------------------------------------------- | ------------------------------------------ |
| [stdio / SSE](/mcp/2025/04/17/sse_stdio/)                       | Streamable HTTP transport                  |
| [테스트 환경](/mcp/2025/04/22/test_environment/)                | `/health`, tool 등록 패턴                  |
| [찾아줘 주차장!](/mcp/2026/07/10/find-parking-mcp-dev-history/) | Express + MCP SDK, KC/Render 배포 감각     |
| [Cursor OAuth](/mcp/2026/07/14/cursor-mcp-oauth/)               | **이번엔 서버가 Provider** — 개념이 맞물림 |

클라이언트 OAuth만 알면 “로그인 UI가 생겼구나”에서 끝나는데, **직접 Provider를 구현**해 보니 `authorize` → callback → `exchangeAuthorizationCode` → `verifyAccessToken` 흐름이 손에 잡힙니다.

---

## 실제 스크린샷으로 더 보강하면 좋은 것

다이어그램은 개념 정리용이고, 아래는 직접 찍어 넣으면 글이 훨씬 살아납니다.

| 캡처 대상                                   | 설명                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------- |
| Cursor Settings → MCP → **tesla** Connected | Logout·tool 개수(15개)가 보이면 MCP JWT 세션 OK                       |
| 브라우저 Tesla OAuth 동의 화면              | 이중 OAuth 중 **두 번째** 로그인 — Fleet API 스코프 확인              |
| 채팅 + TOOL 호출                            | “배터리 알려줘” → `get_vehicle_status` 인자만 보이고 Bearer는 안 보임 |
| tool 결과 JSON                              | 배터리 %, 실내 온도, `state: online/asleep` 등 실제 응답              |
| `wake_vehicle` 후 재조회                    | asleep → wake → online 전환 과정 (삽질 메모와 연결)                   |
| 위치 조회 실패 메시지                       | 공유 운전자·스코프 미허용 시 tool이 **빈 값 대신 안내 문구** 반환     |

토큰·VIN·위치 좌표는 마스킹해서 올리면 됩니다.

---

## 마무리

Tesla MCP는 “재미 프로젝트”에 가깝지만, 배운 건 꽤 실전입니다.

1. **MCP Authorization**을 서버에 붙이는 방법
2. **이중 OAuth** — MCP 클라이언트 ↔ 내 서버 ↔ Tesla
3. Fleet API·Virtual Key·wake·명령 서명 같은 **IoT API 현실**
4. LLM으로 **내 차를 조작**해 보는 경험 (이건 진짜 재밌음)

다음에 손대고 싶은 것: Tesla 토큰 **Redis 영속화**, PlayMCP 등록, 스타터 메시지로 “배터리 + 문 잠금” 데모.

---
