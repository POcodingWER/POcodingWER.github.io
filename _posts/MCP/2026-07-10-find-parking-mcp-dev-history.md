---
layout: post
title: "[MCP] 찾아줘 주차장! — Agentic Player 10 MCP 서버 개발 회고"

subtitle: "카카오맵·주차앱·EV앱을 AI 채팅 한 번에 — PlayMCP in KC 배포까지 겪은 삽질과 해결"

date: 2026-07-10 16:37:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/07/find_parking_mcp_under_review.png"

categories:
  - MCP

tags:
  - MCP
  - PlayMCP
  - Agentic Player 10
  - 카카오클라우드
  - 주차장
  - EV 충전기
  - TypeScript
  - Node.js
  - Docker
  - 공모전
  - 개발 회고
---

> 운전할 때마다 반복되는 질문 — "지금 출발하면 강남역 가서 주차 될까?", "근처에 무료·야간 주차 없나?", "병원 가는데 길이랑 주차, EV 충전까지 한 번에 알고 싶다." 카카오 **Agentic Player 10** 공모전(PlayMCP in KC 필수) 일정에 맞춰, 이 질문들에 답하는 MCP 서버 **찾아줘 주차장!** v0.6.0을 만들었습니다.
>
> - PlayMCP: [찾아줘 주차장!](https://playmcp.kakao.com/mcp/68948413827338498) _(전체 공개)_
> - KC Endpoint: `https://find-parking-mcp.playmcp-endpoint.kakaocloud.io/mcp`

---

## 왜 만들었나

운전할 때마다 카카오맵, 주차 앱, EV 앱을 번갈아 켜는 게 번거로웠습니다. AI 채팅 한 번에 묶어 주면 어떨까 싶어서 시작했고, 공모전 일정(예선 마감 **7/14**)이 개발 마감선 역할을 했습니다.

목표는 단순했습니다.

- **장소 기준** 전국 주차장 검색
- **서울 시영** 123곳 실시간 잔여면
- **EV 충전기** 위치·상태
- **길찾기 + 도착 예상 주차** 시나리오

"강남역 근처 주차장 알려줘"부터 "지금 출발해서 코엑스 가면 주차 될까?"까지, 자연어 한 줄로 처리하는 MCP를 만들기로 했습니다.

---

## 기술 선택

| 항목        | 선택                                                              |
| ----------- | ----------------------------------------------------------------- |
| 언어        | TypeScript (Node.js 20)                                           |
| MCP         | `@modelcontextprotocol/sdk` — Streamable HTTP `/mcp`              |
| 데이터      | 국토부 전국 주차 1.7만 곳, 서울 시영 실시간 123곳, 환경부 EV 충전 |
| 지도·길찾기 | 카카오 로컬·모빌리티 API                                          |
| 배포        | Docker Hub → PlayMCP in KC (카카오클라우드)                       |

초기에는 Python으로 시작했다가, 팀 스택과 Cursor 연동 편의를 위해 **TypeScript로 전환**했습니다. Express 위에 MCP SDK를 올리고, 공공 API + 카카오 지오코딩을 붙이는 구조입니다.

---

## 개발 타임라인

### Phase 1 — 로컬 MCP (MVP)

- Express + MCP SDK로 `/mcp` 엔드포인트 구성
- `search_parking_by_place` 등 기본 tool로 "강남역 근처 주차장" 동작 확인
- 공공데이터 API + 카카오 지오코딩 연동

로컬에서 `pnpm dev` → `/health` → Cursor MCP 연동까지 먼저 끝냈습니다. 공모전 가이드도 **로컬에서 테스트 완료 후 KC 배포**를 권장합니다.

### Phase 2 — 기능 확장

- **서울 실시간 잔여면** (`search_realtime_parking`) — 시영 123곳, API 필드명 버그 수정 (`TPKCT` − `NOW_PRK_VHCL_CNT`)
- **EV 충전기** — 전국 17개 지역 `getChargerInfo` / `getChargerStatus` 캐시
- **길찾기·도착 주차** (`check_parking_on_arrival`, `plan_destination_visit`)
- **무료·야간·저렴** (`search_smart_parking`), **요금 예상** (`estimate_parking_cost`)

tool이 늘수록 "이거 다 쓸 일 있나?" 싶은 기능도 생겼고, 응답 시간도 길어지기 시작했습니다.

### Phase 3 — v0.6.0 정리 (16 tool → 9 tool)

PlayMCP 심사 기준(**tool 3~10개 권장**)에 맞춰 **시나리오 중심**으로 재구성했습니다.

| 구분     | tool                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 시나리오 | `check_parking_on_arrival`, `search_smart_parking`, `plan_destination_visit`, `estimate_parking_cost`, `get_route_between_places` |
| 주차     | `search_parking_by_place`, `search_realtime_parking`, `search_monthly_parking`                                                    |
| EV       | `search_ev_chargers_near_place`                                                                                                   |

주차 검색에서 EV 전수 스캔을 제거해 **응답 속도**를 개선했습니다. "주차 찾기"와 "충전기 찾기"를 분리한 게 체감 차이가 컸습니다.

### Phase 4 — 운영·배포

- Docker 이미지에 `parking-lots.json` + EV 캐시 bake (~360MB)
- **Docker Hub:** `pocodingwer/find-parking-mcp:0.6.0`
- **KC Endpoint:** `https://find-parking-mcp.playmcp-endpoint.kakaocloud.io/mcp`
- PlayMCP 개발자 콘솔 **임시 등록 → 채팅 테스트 → 심사 요청** (2026.07)

---

## 아키텍처

```
[PlayMCP 채팅]
      ↓ HTTP
[KC Pod — find-parking-mcp:0.6.0]
      ↓
┌─────────────────────────────────────┐
│  Express /mcp  (9 tools)            │
│  ├─ parking.ts   주차·실시간·스마트  │
│  ├─ evCharger.ts EV 캐시·스케줄러   │
│  ├─ kakao.ts     지오코딩           │
│  └─ dataGoKr.ts  전국 주차 캐시     │
└─────────────────────────────────────┘
      ↓
[디스크 캐시] parking-lots.json + ev/zcode-*.json
      ↓ (백그라운드)
[공공 API] 국토부 · 서울시영 · 환경부 EV
```

데이터 소스별 갱신 전략도 다릅니다.

| 데이터                 | API                         | 갱신 방식                                          |
| ---------------------- | --------------------------- | -------------------------------------------------- |
| 전국 주차장 (1.7만 곳) | 국토교통부 주차장 API       | 디스크 캐시 **6h** TTL → 만료 시 백그라운드 재조회 |
| 서울 실시간 잔여면     | 서울 GetParkingInfo         | **5분** 백그라운드 스케줄                          |
| EV 충전기 위치         | 환경공단 `getChargerInfo`   | **롤링** — 약 **85분/지역** (24h 전국 1바퀴)       |
| EV 충전기 상태         | 환경공단 `getChargerStatus` | **스케줄** — 전국 5분 (MCP는 캐시만)               |

---

## 삽질과 해결 — 블로그 핵심 거리

### 1. KC에서 주차 검색만 30초 타임아웃

**증상:** `/health`는 빠른데 `search_parking_by_place`만 30초 타임아웃.

**원인:** 디스크 캐시 TTL(6시간) 만료 후, 첫 요청이 국토부 API **전체 19페이지** 다운로드를 **동기**로 기다림.

**해결:** 만료 캐시도 **즉시 반환**, API 갱신은 **백그라운드**만 (`dataGoKr.ts`, `parking.ts`).

로컬에서는 잘 되다가 KC에 올리면 갑자기 느려지는 전형적인 패턴이었습니다. "캐시가 있으면 빠르다"와 "캐시가 없으면 사용자가 기다린다"를 분리하는 게 핵심이었습니다.

### 2. EV 전국 로드 시 OOM / stack overflow

**증상:** Pod `JavaScript heap out of memory`, 경기(41) 조회 시 `Maximum call stack size exceeded`.

**원인:**

- EV 전국 49만 건을 메모리에 올리고 `array.push(...huge)` spread
- 24시간마다 전 지역 `getChargerInfo` 일괄 호출

**해결:**

- 위치 갱신 **지역 1개씩 롤링** (약 85분/지역, 24h 1바퀴)
- 조회 시 `scanEvChargersForZcodes`로 **필요 지역만 순회**, spread 제거
- K8s 메모리 limits 1536Mi, `NODE_OPTIONS=--max-old-space-size=1400`

공공 API 한도(개발 계정 일 1,000건/엔드포인트)도 같이 맞춰야 해서, "한 번에 전국 갱신"은 구조적으로 불가능했습니다.

### 3. 테슬라 슈퍼차저가 "없다"고 나옴

**증상:** 하남 스타필드 슈퍼차저가 있는데 `operator: tesla` 결과 0건.

**원인:** 공공 API에 **이름에 '테슬라'가 없음**. `스타필드하남점` + `신세계아이앤씨` + DC 100kW로 등록됨. NACS 타입(09·10)도 전국에 극소수.

**해결:**

- `matchesTeslaEvCharger`: 이름 + NACS(09·10) + 스타필드·신세계아이앤씨 휴리스틱
- 표시: `슈퍼차저 100kW` / `슈퍼차저 NACS` (완속·고속과 구분)

공공데이터를 그대로 믿으면 안 되는 대표 사례였습니다. 실제 현장 데이터와 API 스키마의 간극을 코드로 메워야 했습니다.

휴리스틱 적용 후 PlayMCP 채팅에서 "하남스타필드 슈퍼차저 찾아줘"를 물어보면 `search_ev_chargers_near_place`가 정상 호출되고, 8대 중 충전·대기 상태까지 응답합니다.

![](/img/post/2026/07/playmcp_tesla_supercharger_demo.png){: #magnific}

### 4. EV status API 한도

**초기:** 개발 계정 일 1,000건/엔드포인트 → 수도권 30분·지방 2시간으로 차등.

**이후:** 한도 **10만 건**으로 상향 → **전국 5분** 갱신으로 통일.

> `getChargerStatus`는 지역 1회가 아니라 **페이지 수만큼** 호출됩니다 (경기만 16페이지). 한도 계산 시 이걸 빼먹으면 바로 막힙니다.

### 5. PlayMCP 심사 대응

| 항목                     | 대응                                  |
| ------------------------ | ------------------------------------- |
| tool 이름에 `kakao` 금지 | tool명에 미사용                       |
| annotations 5종          | `readOnlyHint` 등 전 tool 지정        |
| description              | 한글 + `Find Parking(찾아줘 주차장!)` |
| 응답 p99 3초             | 캐시·워밍업·EV 스캔 분리              |
| KC 필수                  | PlayMCP in KC Endpoint 사용           |

심사 전 `npx @modelcontextprotocol/inspector`로 tool 목록·annotations를 한 번 더 확인하는 걸 권장합니다.

---

## Agentic Player 10 참가 흐름

공모전은 **직접 개발한 MCP를 PlayMCP에 등록**하는 방식입니다. 예선 참가에는 **반드시 PlayMCP in KC**로 배포한 Endpoint URL을 써야 하고, 개인 서버나 다른 클라우드는 인정되지 않습니다.

### 참가 순서 (요약)

1. **MCP 서버 개발** — 로컬에서 테스트 완료
2. **PlayMCP in KC 배포** — Git 소스 또는 **컨테이너 이미지** 등록
3. **PlayMCP 등록** — Endpoint URL → 정보 불러오기 → **임시 등록** → 채팅 테스트 → **심사 요청**
4. **심사 승인 후** — 공개 상태를 **전체 공개**로 전환, MCP 상세 URL 복사
5. **공모전 비즈폼** — Player 예선 참여 (MCP 최대 2개)

### KC 컨테이너 등록

Apple Silicon Mac은 **반드시** `linux/amd64`로 빌드해야 합니다. arm64 이미지는 서버 활성화에 실패합니다.

![](/img/post/2026/07/kc_mcp_server_register.png){: #magnific}

```bash
# EV 캐시 bake (권장 — 없으면 기동 시 전남 등 API 대기·느림)
# pnpm fetch:ev

docker build --platform linux/amd64 -t find-parking-mcp:latest .
docker tag find-parking-mcp:latest YOUR_ID/find-parking-mcp:0.6.0
docker push YOUR_ID/find-parking-mcp:0.6.0
```

**PlayMCP in KC → 이미지 등록 폼**

| 항목            | 값                             |
| --------------- | ------------------------------ |
| Registry 호스트 | `docker.io`                    |
| image_name      | `pocodingwer/find-parking-mcp` |
| image_tag       | `0.6.0`                        |

Active 후 **Endpoint URL**을 PlayMCP 개발자 콘솔에 붙여 넣습니다.

![](/img/post/2026/07/kc_mcp_server_active.png){: #magnific}

### PlayMCP 등록

[PlayMCP 개발자 콘솔](https://playmcp.kakao.com/console)에서 Endpoint URL을 입력하고 **정보 불러오기** → **임시 등록** 순서로 진행합니다. 심사 요청 전에는 반드시 **임시 등록**만 하고, 채팅 테스트를 충분히 한 뒤 심사를 요청하세요.

![](/img/post/2026/07/playmcp_register_form.png){: #magnific}

등록이 완료되면 MCP 설명·대화 예시·Endpoint가 아래처럼 채워집니다.

![](/img/post/2026/07/playmcp_register_detail.png){: #magnific}

### MCP 업데이트 후 재배포

동일 태그로 이미지를 다시 푸시해도 KC가 캐시를 들고 있을 수 있어서, 실제로는 이렇게 했습니다.

1. PlayMCP in KC에서 기존 MCP 서버 **삭제**
2. **새 MCP 서버 등록** (이름은 기존과 동일하게)
3. PlayMCP에서 **정보 수정 → 정보 불러오기 → 재심사 요청**

### PlayMCP 등록 팁

심사 요청 전에 **임시 등록** 상태에서 충분히 테스트하세요. "등록 및 심사요청"을 바로 누르지 말고, 도구함에 추가한 뒤 스타터 메시지로 실제 대화를 돌려 보는 게 안전합니다.

추천 스타터 메시지 예시:

| 제목                | 메시지                                                                           |
| ------------------- | -------------------------------------------------------------------------------- |
| 도착하면 주차 될까? | 지금 출발해서 코엑스 가면 주차 될까? 도착 예상 시간이랑 근처 실시간 주차 알려줘. |
| 무료 주차 찾기      | 강남역 근처 무료 주차장 알려줘.                                                  |
| 병원 방문 플랜      | 천호역에서 강동성심병원 갈 건데 길이랑 주차 알려줘. 전기차 충전도 되는지 봐줘.   |

---

## 9개 tool 한눈에

### 시나리오 tool (추천)

| Tool                       | 한 줄 설명                                      | 예시 질문                                        |
| -------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `check_parking_on_arrival` | 출발→도착 길찾기 + 도착 예상 시각 + 실시간 주차 | "지금 출발해서 강남역 가면 주차 될까?"           |
| `search_smart_parking`     | 무료·야간·저렴 주차                             | "강남역 근처 무료 주차", "밤 10시에 열린 주차장" |
| `plan_destination_visit`   | 목적지 이동·주차·(선택) EV                      | "강동성심병원 갈 건데 주차랑 길 알려줘"          |
| `estimate_parking_cost`    | 주차 시간 기준 요금 예상                        | "강남역 3시간 주차하면 얼마?"                    |
| `get_route_between_places` | 두 장소 간 자동차 길찾기                        | "강남역에서 천호역까지 얼마나 걸려?"             |

### 주차·실시간·월주차

| Tool                      | 한 줄 설명                        |
| ------------------------- | --------------------------------- |
| `search_parking_by_place` | 장소 기준 근처 주차장 (EV 미포함) |
| `search_realtime_parking` | 서울 시영 123곳 실시간 잔여면     |
| `search_monthly_parking`  | 월정기권 주차장                   |

### EV

| Tool                            | 한 줄 설명                               |
| ------------------------------- | ---------------------------------------- |
| `search_ev_chargers_near_place` | 장소 근처 충전기 (급속/완속/테슬라 필터) |

---

## 테스트

| 명령                                    | 내용                                  |
| --------------------------------------- | ------------------------------------- |
| `pnpm test:unit`                        | 주차 시간·퍼지 매칭                   |
| `npx tsx scripts/unit/test-ev-tesla.ts` | 슈퍼차저 분류 (API 없음)              |
| `pnpm test:mcp:suite`                   | MCP 90케이스 (서버 필요)              |
| `pnpm test:mcp:all`                     | suite + regions + stress (~540케이스) |

로컬 Docker 검증 후 Hub 푸시 → KC **삭제·재등록** 순서로 배포했습니다. 릴리스 전 `pnpm test:mcp:all` 한 번 돌리는 걸 기준으로 잡았습니다.

---

## 공모전 진행 상태 (2026.07.14 기준)

- [x] MCP 개발 v0.6.0
- [x] PlayMCP in KC 배포
- [x] PlayMCP 임시 등록·채팅 테스트
- [x] **심사 요청** 제출
- [x] 심사 승인
- [x] **전체 공개** 전환 — [찾아줘 주차장!](https://playmcp.kakao.com/mcp/68948413827338498)
- [x] Player 예선 비즈폼 접수 완료 (마감 **7/14**)

![](/img/post/2026/07/find_parking_mcp_under_review.png){: #magnific}

> 위 스크린샷은 심사 요청 직후(심사 중) 화면입니다. 이후 승인되어 **전체 공개**로 전환했고, 공모전 예선 접수도 마쳤습니다.

공식 **진행 방식**은 아래와 같습니다. 지금은 **STEP 1 예선**을 끝낸 상태이고, 본선 진출작 발표는 **7/30**입니다.

![](/img/post/2026/07/agentic_player_10_schedule.png){: #magnific}

| STEP | 내용 | 일정 |
|------|------|------|
| 1 예선 참여 | PlayMCP 등록·응모 → 본선 20개 선정 | 접수 6/15~7/14 · 발표 **7/30** |
| 2 본선 추가 개발 | Kakao Tools 공개·추가 개발 | 7/30~8/27 |
| 3 본선 투표 | 사용자 투표 + 심사위원 심사 | 8/31~9/28 |
| 4 최종 심사·시상 | 오프라인 시상식 (카카오 AI 캠퍼스) | **10/23** |

PlayMCP in KC는 예선 접수 기간(**6/15 ~ 7/14**)에만 MCP 서버 발급이 가능합니다. 심사는 영업일 1~2일, 최대 7일까지 걸릴 수 있어서 여유를 두는 게 좋습니다.

---

## 앞으로 할 일 (v0.7 아이디어)

1. **EV 반경 자동 확장** — 500m → 1km → 3km → 5km (주차는 이미 유사 로직 있음, EV만 미적용)
2. **`pnpm test:ev-tesla`** 스크립트 등록
3. **GitHub Actions** — `typecheck` + unit + mcp suite
4. PlayMCP 스타터에 **하남 스타필드 슈퍼차저** 데모 추가
5. 전남(zcode=46) 등 **EV 빈 지역** 안내 문구

---

## 링크 모음

|               | URL                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Docker Hub    | https://hub.docker.com/r/pocodingwer/find-parking-mcp                                                      |
| KC Endpoint   | https://find-parking-mcp.playmcp-endpoint.kakaocloud.io/mcp                                                |
| PlayMCP 콘솔  | https://playmcp.kakao.com/console                                                                          |
| 공모전 가이드 | [Agentic Player 10 참가 방법](https://app.notion.com/p/Agentic-Player-10-3749b97b4888806b8564ee264e2fafde) |

---

## 마무리

MCP 하나 만들면서 공공 API 한도, 캐시 전략, KC 배포, PlayMCP 심사 정책까지 한꺼번에 배웠습니다. 로컬에서 잘 되는 코드가 클라우드에 올라가면 갑자기 OOM·타임아웃이 터지는 것도, 공공데이터에 '테슬라'가 없는 것도, 직접 겪어 봐야 체감이 됩니다.

같이 공모전 준비하시는 분들께는 **로컬 완성 → amd64 Docker → KC → 임시 등록 테스트 → 심사 → 전체 공개 → 비즈폼** 순서를 추천합니다. tool 개수는 심사 권장 범위 안에서 **시나리오 중심**으로 줄이는 편이 응답 속도·유지보수 모두에 유리했습니다.

심사 승인 후 PlayMCP에서 **전체 공개**로 전환했고, Player 예선 접수도 완료했습니다.  
공개 페이지: [찾아줘 주차장!](https://playmcp.kakao.com/mcp/68948413827338498)

---

_마지막 업데이트: 2026-07-14_
