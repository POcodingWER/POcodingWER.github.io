---
layout: post
title: "[DEVELOP] 실시간 통신 방식 비교 (HTTP, SSE, WebSocket, stdio)"

subtitle: "HTTP, SSE, WebSocket, stdio 한번에 정리하기"

date: 2026-03-11 08:32:33

# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"
# header-style: text
catalog: true
header-mask: 0.4
header-img: "img/post/2026/03/realtime_communication.png"

# sitemap:
# changefreq: daily #스크랩 주기 daily | weekly | monthly
# priority: 1.0 # 스크랩 우선순위
# hidden: true

categories:
  - DEVELOP

tags:
  - 실시간 통신
  - HTTP
  - SSE
  - Server-Sent Events
  - WebSocket
  - Socket.IO
  - stdio
  - MCP
  - 통신 프로토콜
  - 양방향 통신
---

{% include post/develop_contents.md %}

## 실시간 통신 방식 비교

웹 개발을 하다 보면 서버와 클라이언트 사이에 데이터를 어떻게 주고받을지 선택해야 하는 순간이 온다.
HTTP, SSE, WebSocket, stdio — 각각 언제, 왜 쓰는지 정리해보자.

![](/img/post/2026/03/realtime_communication.png){: #magnific}

## 1. HTTP (일반 요청/응답)

가장 기본적인 통신 방식. **요청 1번 → 응답 1번 → 끝.**

```
클라이언트 ──GET /data──▶ 서버
클라이언트 ◀──응답 1개──── 서버
(연결 끊김 ✂️)
```

- 클라이언트가 요청해야만 서버가 응답
- 새 데이터가 필요하면 **다시 요청**해야 함
- 비유: **편의점 가서 물 1병 사오기** (갈 때마다 다시 가야 함)

---

## 2. SSE (Server-Sent Events)

**단방향 스트리밍**: 서버 → 클라이언트 only

```
클라이언트 ──GET /stream──▶ 서버
클라이언트 ◀──데이터 1────── 서버
클라이언트 ◀──데이터 2────── 서버
클라이언트 ◀──데이터 3────── 서버
...  (연결 계속 유지 🔗)
```

- 요청 1번 → 응답이 **계속 흘러옴** → 연결 유지
- 서버가 원할 때마다 데이터를 **계속 밀어넣음**
- 클라이언트가 서버에 뭔가 보내려면 **별도의 HTTP 요청**을 해야 함
- 비유: **수도꼭지 틀어놓기** (한번 틀면 물이 계속 나옴)

### 클라이언트가 서버에 요청을 보내려면?

SSE는 받기 전용이라 **별도 HTTP 요청을 따로 보내야** 한다.

```
[SSE 채널]     클라이언트 ◀──스트리밍── 서버    (연결 유지, 받기만)
[일반 HTTP]    클라이언트 ──POST──────▶ 서버    (필요할 때 별도 요청)
```

두 개의 채널을 동시에 쓰는 방식이다.

```javascript
// SSE로 서버에서 데이터 받기 (연결 유지)
const eventSource = new EventSource("/stream");
eventSource.onmessage = (event) => {
  console.log("서버에서 옴:", event.data);
};

// 서버에 뭔가 보내고 싶을 때 → 별도 HTTP 요청
await fetch("/send", {
  method: "POST",
  body: JSON.stringify({ message: "안녕" }),
});
```

### MCP에서 SSE 테스트 (curl)

실제로 터미널 3개로 테스트해보면 SSE의 동작을 확실히 이해할 수 있다.

```bash
# 터미널1: 서버 실행
npm run sse

# 터미널2: SSE 연결 (받는 파이프 🔗)
curl -N http://localhost:3001/sse
# → sessionId를 받아온다
# event: endpoint
# data: /messages?sessionId=abc123...

# 터미널3: POST 요청 (보내는 용)
curl -X POST "http://localhost:3001/messages?sessionId=abc123..." \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"2","method":"tools/list","params":{}}'

# 응답은 터미널3이 아니라 → 터미널2(SSE 스트림)에서 나온다!
```

**포인트**: 터미널3에서 POST로 요청을 보냈는데, 응답은 **터미널2의 SSE 스트림**으로 온다.

| 터미널   | 역할             | 채널                   |
| -------- | ---------------- | ---------------------- |
| 터미널 1 | 서버 실행        | -                      |
| 터미널 2 | SSE 연결 (수신)  | `GET /sse` 연결 유지   |
| 터미널 3 | 요청 전송 (발신) | `POST /messages` 1회성 |

### 대표적 사용 사례

- ChatGPT 답변 스트리밍 (한 글자씩 타이핑되듯 나오는 것)
- 실시간 알림
- MCP 원격 서버 통신

---

## 3. WebSocket (Socket.IO)

**양방향 실시간 통신**: 서버 ↔ 클라이언트

```
클라이언트 ──연결──▶ 서버
클라이언트 ◀──데이터── 서버
클라이언트 ──데이터──▶ 서버
클라이언트 ◀──데이터── 서버
...  (하나의 연결에서 자유롭게 양방향 🔁)
```

- 한번 연결하면 서버↔클라이언트가 **자유롭게 메시지를 주고받음**
- 1:N 지원 — 서버 하나에 클라이언트 수천 명 연결 가능
- 비유: **전화 통화** (서로 말하고 듣고)

```javascript
// 서버 (Node.js)
const io = require("socket.io")(3000);

io.on("connection", (socket) => {
  socket.on("chat", (msg) => {
    io.emit("chat", msg); // 모든 클라이언트에 전달
  });
});

// 클라이언트
const socket = io("http://localhost:3000");
socket.emit("chat", "안녕!"); // 서버로 전송
socket.on("chat", (msg) => {
  // 서버에서 수신
  console.log(msg);
});
```

### 대표적 사용 사례

- 채팅 앱
- 블록체인 이벤트 수신 (새 블록 생성 → 모든 클라이언트에 전달)
- 온라인 게임
- 실시간 협업 도구 (Google Docs 등)

---

## 4. stdio (Standard I/O)

**양방향 프로세스 간 통신**: 같은 머신 안에서만

```
부모 프로세스 ──stdin──▶ 자식 프로세스
부모 프로세스 ◀──stdout── 자식 프로세스
```

- `stdin`(입력) / `stdout`(출력) 파이프를 통해 데이터 주고받음
- **같은 머신** 안에서 프로세스끼리 통신
- 터미널 1개로 입력도, 출력도 같은 곳에서 처리

```bash
# 터미널 1개로 다 됨
echo '{"jsonrpc":"2.0","id":"1","method":"tools/list"}' | node server.js
# → 입력도 여기, 출력도 여기
```

### 대표적 사용 사례

- MCP 로컬 서버 통신
- CLI 도구 간 파이프라인

---

## 한눈에 비교

|               | 방향               | 범위      | 연결 수          | 동시 접속 |
| ------------- | ------------------ | --------- | ---------------- | --------- |
| **HTTP**      | 단방향 (요청/응답) | 네트워크  | 매번 새 연결     | -         |
| **SSE**       | 단방향 (서버→클라) | 네트워크  | 2개 (SSE + HTTP) | 1:N       |
| **WebSocket** | 양방향             | 네트워크  | 1개              | 1:N       |
| **stdio**     | 양방향             | 로컬 전용 | 1개 (파이프)     | 1:1       |

### 느낌 요약

```
HTTP       = 편의점 (갈 때마다 다시)
SSE        = 수도꼭지 (틀면 계속 나옴, 단방향)
WebSocket  = 전화 통화 (서로 자유롭게)
stdio      = 옆자리 메모 넘기기 (로컬, 양방향)
```

### 관계 정리

```
stdio     = 양방향 + 로컬 전용      → MCP 로컬 서버
SSE+HTTP  = 양방향 흉내 + 네트워크   → MCP 원격 서버, ChatGPT 스트리밍
WebSocket = 양방향 + 네트워크        → 채팅, 블록체인, 게임
```

WebSocket은 **"네트워크 버전 stdio"**, SSE는 **HTTP만으로 어떻게든 양방향을 해보려고 채널을 쪼갠 방식**이라고 이해하면 된다.
