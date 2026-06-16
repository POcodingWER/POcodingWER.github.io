---
layout: post
title: "[FRONT] www.google.com 입력하면 일어나는 일 — DNS부터 렌더링까지"

subtitle: "주소창 한 줄 뒤에 숨은 DNS, TCP, TLS, HTTP, 렌더링 파이프라인"

date: 2026-06-16 10:00:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/06/browser_request_pipeline.png"

categories:
  - FRONT

tags:
  - DNS
  - TCP
  - TLS
  - HTTPS
  - HTTP
  - 브라우저 렌더링
  - Critical Rendering Path
  - 3-Way Handshake
  - 네트워크
  - Web Vitals
  - Chrome DevTools
---

{% include post/front_contents.md %}

> 주소창에 `www.google.com`을 입력하고 Enter를 누르면, 화면에 검색창이 뜨기까지 브라우저·OS·네트워크·서버가 각자 역할을 수행합니다. 이 글은 그 전체 흐름을 **DNS → TCP → TLS → HTTP → 렌더링** 순서로 정리합니다.
>
> - [[FRONT] URL과 Domain 정확히 이해하자](/front/2025/01/03/url_domain/)
> - [[FRONT] HTTP 헤더 완벽 이해하기](/front/2025/01/07/HTTP-header/)
> - [[FRONT] 브라우저 렌더링 과정](/front/2024/12/26/lender/)

---

## 들어가며

프론트엔드 개발을 하다 보면 "페이지가 왜 느리지?", "캐시를 지웠더니 갑자기 빨라졌다", "Mixed Content 에러가 왜 나지?" 같은 문제를 만납니다. 이런 이슈의 상당수는 **브라우저가 URL을 받아 화면을 그리기까지** 거치는 단계를 모르면 원인을 좁히기 어렵습니다.

이 글은 `www.google.com`을 예시로, 그 사이에 일어나는 일을 **네트워크 계층 → 애플리케이션 계층 → 렌더링** 순서로 따라갑니다.

---

## 전체 파이프라인

```
[0] URL 입력 & 파싱
      ↓
[1] DNS 조회 — www.google.com → IP 주소
      ↓
[2] TCP 3-Way Handshake — IP:443 포트 연결
      ↓
[3] TLS Handshake — 암호화 통신 준비 (HTTPS)
      ↓
[4] HTTP 요청/응답 — GET / → HTML 수신
      ↓
[5] 브라우저 렌더링 — DOM → CSSOM → Render Tree → Layout → Paint
      ↓
[6] 추가 리소스 — CSS, JS, 이미지, 폰트 병렬 요청
```

Chrome DevTools **Network** 탭의 Timing breakdown은 대략 이 순서와 대응됩니다.

| Timing 항목           | 대응 단계                       |
| --------------------- | ------------------------------- |
| DNS Lookup            | 1. DNS                          |
| Initial connection    | 2. TCP                          |
| SSL                   | 3. TLS                          |
| Waiting (TTFB)        | 4. HTTP — 서버 처리 + 첫 바이트 |
| Content Download      | 4. HTTP — Body 수신             |
| (이후 Performance 탭) | 5~6. 파싱·렌더링                |

![](/img/post/2026/06/browser_request_pipeline.png){: #magnific}

---

## URL 입력과 파싱

`www.google.com`만 입력하면 브라우저는 보통 **`https://www.google.com/`** 으로 보완합니다. 최근 브라우저는 HTTP보다 HTTPS를 우선하고, HSTS 목록에 있는 도메인은 HTTP 요청 없이 바로 HTTPS로 갑니다.

```
https://www.google.com/search?q=hello
│      │              │       │
Scheme  Host           Path    Query
```

| 구성요소 | 역할           | 이 예시                        |
| -------- | -------------- | ------------------------------ |
| Scheme   | 통신 규칙      | `https` → TLS + HTTP           |
| Host     | 접속할 서버    | `www.google.com`               |
| Port     | 생략 시 기본값 | HTTPS → **443**, HTTP → **80** |
| Path     | 리소스 경로    | `/search`                      |
| Query    | 추가 파라미터  | `?q=hello`                     |

Host를 알았으면 다음은 **도메인 → IP 변환(DNS)** 입니다.

> URL·도메인 구조 상세 → [[FRONT] URL과 Domain 정확히 이해하자](/front/2025/01/03/url_domain/)

---

## DNS — 도메인을 IP로 바꾸기

### DNS가 하는 일

**DNS(Domain Name System)** 는 도메인 이름을 IP 주소로 변환하는 분산 이름 해석 시스템입니다.

```
사람이 쓰는 주소:  www.google.com
실제 연결 대상:    142.250.196.4 (예시)
```

TCP/IP 연결은 IP 주소가 있어야 시작할 수 있습니다. DNS는 그 변환을 담당합니다.

### 조회 경로 — 캐시부터

매 요청마다 Root DNS부터 타지 않습니다. **가까운 캐시에 답이 있으면 거기서 끝**납니다.

```
1. 브라우저 DNS 캐시
      ↓ (miss)
2. OS DNS 캐시 (/etc/hosts 포함)
      ↓ (miss)
3. Recursive Resolver (ISP DNS, 8.8.8.8, 1.1.1.1 등)
      ↓ (miss)
4. Root → TLD(.com) → Authoritative(google.com)
      ↓
5. IP 반환 — 응답 TTL만큼 각 계층에 캐시
```

![](/img/post/2026/06/dns_lookup_flow.png){: #magnific}

실제 PC·모바일에서는 **Recursive Resolver**에 한 번 질의하고, Resolver가 Root부터 Authoritative까지 **Iterative**하게 추적하는 경우가 많습니다.

### 자주 보는 DNS 레코드

| 레코드    | 용도                        |
| --------- | --------------------------- |
| **A**     | 도메인 → IPv4               |
| **AAAA**  | 도메인 → IPv6               |
| **CNAME** | 도메인 → 다른 도메인 (별칭) |
| **NS**    | 권한 DNS 서버               |
| **TXT**   | SPF, 도메인 소유 검증 등    |

`www.google.com`은 보통 **CNAME → A** 또는 **A** 레코드로 IP를 얻습니다.

### TTL과 CDN/장애 대응

DNS 응답의 **TTL(Time To Live)** 동안은 캐시된 IP를 재사용합니다.

```
TTL = 300  → 5분간 같은 IP
TTL = 60   → 1분마다 갱신 가능 (트래픽 전환에 유리)
```

프론트엔드 입장에서 DNS TTL은 **배포·CDN 전환·장애 failover**와 직결됩니다. TTL이 길면 DNS 변경이 전파되는 데 시간이 걸리고, 짧으면 조회 부하가 늘어납니다.

### DevTools에서 확인

Chrome DevTools → Network → 문서 요청 선택 → **Timing** → `DNS Lookup`.

- 캐시 히트: 0ms에 가깝게 표시
- Hard refresh / Private window: 수 ms~수십 ms

터미널에서 직접 확인하려면:

```bash
# macOS / Linux
dig www.google.com

# 간단히 IP만
nslookup www.google.com
```

---

## TCP — 3-Way Handshake

IP와 포트를 알면 브라우저는 해당 서버에 **TCP 연결**을 수립합니다.

### TCP를 쓰는 이유

**TCP**는 순서 보장, 재전송, 흐름 제어가 있는 **신뢰성 전송** 프로토콜입니다. HTML·JSON·이미지처럼 **바이트 하나하나가 정확히 도착해야 하는** 웹 통신에 적합합니다.

반면 **UDP**는 DNS 질의, WebRTC, 실시간 스트리밍처럼 **속도·지연**을 우선하는 곳에 씁니다. (HTTP/3은 QUIC 위에서 UDP를 사용합니다.)

### 3-Way Handshake

```
클라이언트                          서버
    │  ──── SYN (seq=x) ────────▶  │
    │  ◀── SYN-ACK (seq=y, ack=x+1) │
    │  ──── ACK (ack=y+1) ────────▶  │
    │         ESTABLISHED             │
```

| 플래그  | 의미                      |
| ------- | ------------------------- |
| SYN     | 연결 시작                 |
| ACK     | 수신 확인                 |
| SYN-ACK | 연결 수락 + 상대 SYN 확인 |

연결 **종료**는 FIN/ACK 조합으로 4-way에 가깝게 진행됩니다. "3-Way"는 **연결 시작**을 말합니다.

### TLS와의 관계

**TLS는 TCP 위에서 동작**합니다. 순서는 항상 고정입니다.

```
TCP 연결 → TLS Handshake → HTTP 요청/응답
```

### Keep-Alive와 HTTP/2

HTTP/1.1의 `Connection: keep-alive`로 **같은 TCP 연결을 재사용**합니다. CSS·JS·이미지 요청마다 Handshake를 반복하지 않아 지연이 줄어듭니다.

HTTP/2는 하나의 TCP 연결 위에서 **멀티플렉싱** — 여러 요청/응답을 스트림 단위로 동시에 처리합니다. HTTP/3(QUIC)은 TCP 대신 UDP 기반으로 Handshake 자체를 줄이는 방향으로 진화했습니다.

---

## TLS — HTTPS 암호화 채널

`https://` 스킴이면 TCP 연결 직후 **TLS(Transport Layer Security)** Handshake가 진행됩니다.

### TLS Handshake가 하는 일

1. **서버 인증** — CA 체인으로 인증서 검증
2. **키 교환** — 대칭키(세션키) 협상
3. **이후 HTTP 트래픽 암호화**

### TLS 1.3 흐름 (요약)

```
클라이언트                          서버
    │  ─── ClientHello ───────────▶  │  cipher suite, random
    │  ◀── ServerHello ────────────  │  선택 cipher, 인증서
    │  ◀── Certificate ────────────  │
    │  ─── Finished ──────────────▶  │
    │  ◀── Finished ───────────────  │
    │      암호화된 HTTP 시작         │
```

TLS 1.3은 1.2 대비 **왕복(round-trip) 횟수가 줄어** Initial connection 시간이 짧아집니다. DevTools Timing의 `SSL` 항목에 반영됩니다.

### 인증서 검증 실패 시

브라우저는 다음을 확인합니다.

1. CA 체인 신뢰 여부
2. 인증서 CN/SAN과 접속 Host 일치
3. 만료·폐기(OCSP) 상태

하나라도 실패하면 **"연결이 비공개가 아닙니다"** 경고가 뜹니다. 로컬 개발에서 `localhost` 자체 서명 인증서를 쓸 때도 같은 메커니즘입니다.

### HTTP vs HTTPS — 개발자 관점

|               | HTTP      | HTTPS                                         |
| ------------- | --------- | --------------------------------------------- |
| 전송          | 평문      | 암호화                                        |
| 중간자 열람   | 가능      | 불가                                          |
| 쿠키·토큰     | 탈취 위험 | 전송 구간 보호                                |
| Mixed Content | —         | HTTPS 페이지에서 HTTP 리소스 로드 시 **차단** |

> HTTP 헤더·캐시 정책 상세 → [[FRONT] HTTP 헤더 완벽 이해하기](/front/2025/01/07/HTTP-header/)

---

## HTTP — 요청과 응답

TLS 채널 위에서 브라우저가 **HTTP 요청**을 보냅니다.

### 요청

```http
GET / HTTP/2
Host: www.google.com
User-Agent: Mozilla/5.0 ...
Accept: text/html,application/xhtml+xml
Accept-Encoding: gzip, deflate, br
Accept-Language: ko-KR,ko;q=0.9
Cookie: ...
```

| 헤더              | 역할                                   |
| ----------------- | -------------------------------------- |
| `GET /`           | 루트 HTML 요청                         |
| `Host`            | 가상 호스트 구분 — 한 IP에 여러 도메인 |
| `Accept-Encoding` | br, gzip 등 압축 포맷 협상             |
| `Cookie`          | 이전 방문 쿠키 전송                    |

### 응답

```http
HTTP/2 200 OK
Content-Type: text/html; charset=UTF-8
Content-Encoding: br
Cache-Control: private, max-age=0
Set-Cookie: ...
```

| 상태 코드 | 상황                                         |
| --------- | -------------------------------------------- |
| 200       | 정상                                         |
| 301/302   | 리다이렉트 — 브라우저가 Location 따라 재요청 |
| 304       | Not Modified — 캐시된 Body 재사용            |
| 403/404   | 접근 거부 / 없음                             |
| 500       | 서버 오류                                    |

응답 Body의 HTML을 받는 즉시 브라우저는 **파싱을 시작**합니다. HTML 전체를 다 받을 때까지 기다리지 않고, **스트리밍 파싱**을 합니다.

### TTFB — Waiting 시간

DevTools Timing의 **Waiting (TTFB)** 는 요청을 보낸 뒤 **첫 바이트**가 도착하기까지의 시간입니다.

```
TTFB = DNS + TCP + TLS + 서버 처리 + 네트워크 왕복
```

TTFB가 길다면 DNS/TLS 문제인지, 서버·DB·API 지연인지 Network 탭에서 Timing breakdown으로 분리해 봐야 합니다.

### HTTP/1.1 vs HTTP/2

|              | HTTP/1.1                     | HTTP/2                     |
| ------------ | ---------------------------- | -------------------------- |
| 연결         | keep-alive 재사용            | 단일 TCP, 멀티플렉싱       |
| 병렬         | 브라우저당 도메인별 6~8 연결 | 스트림 단위 병렬           |
| 헤더         | 매 요청 전송                 | HPACK 압축                 |
| HOL Blocking | 큐 대기                      | TCP 레벨 HOL은 여전히 존재 |

---

## 브라우저 렌더링 — Critical Rendering Path

HTML 수신 후 브라우저는 화면을 그리기 위해 **Critical Rendering Path(CRP)** 를 따릅니다.

```
HTML 파싱 → DOM Tree
CSS 파싱  → CSSOM Tree
         ↓
    Render Tree (DOM + CSSOM)
         ↓
      Layout — 위치·크기 계산
         ↓
      Paint — 픽셀 채우기
         ↓
      Composite — GPU 레이어 합성
         ↓
      화면 출력
```

![](/img/post/2026/06/critical_rendering_path.png){: #magnific}

### DOM 생성

HTML을 토큰화·파싱하며 **DOM 트리**를 구축합니다.

```html
<html>
  <head>
    <title>Google</title>
  </head>
  <body>
    <div id="search">...</div>
  </body>
</html>
```

```
html
├── head
│   └── title
└── body
    └── div#search
```

파서는 `<script>`(동기), CSS 등 **블로킹 리소스**를 만나면 DOM 구축을 잠시 멈출 수 있습니다.

### CSSOM과 Render Blocking

`<link rel="stylesheet">`의 CSS는 **CSSOM**을 만들고, CSSOM 없이는 Render Tree를 만들지 않습니다. 그래서 CSS는 **렌더 블로킹** 리소스입니다.

```html
<!-- 렌더를 막음 — CSSOM 필요 -->
<link rel="stylesheet" href="/main.css" />

<!-- media 조건으로 블로킹 완화 -->
<link rel="stylesheet" href="/print.css" media="print" />
```

### Render Tree

DOM + CSSOM에서 **실제로 그릴 노드**만 Render Tree에 포함합니다.

```
display: none       → 제외
visibility: hidden  → 포함 (레이아웃 공간 유지)
```

### Layout → Paint → Composite

| 단계      | 동작               | 변경 시                                      |
| --------- | ------------------ | -------------------------------------------- |
| Layout    | 박스 모델 계산     | width, margin, font-size 등 → **Reflow**     |
| Paint     | 시각적 픽셀 그리기 | color, background → **Repaint**              |
| Composite | 레이어 합성        | transform, opacity → GPU 레이어, Reflow 없음 |

성능 최적화에서 `transform`/`opacity` 애니메이션을 쓰는 이유가 Composite 단계에 있습니다.

> Reflow·Repaint·최적화 패턴 → [[FRONT] 브라우저 렌더링 과정](/front/2024/12/26/lender/)

### `<script>` — Parser Blocking

동기 `<script>`는 HTML 파싱을 **중단**하고, JS 다운로드·실행 후 파싱을 재개합니다. JS가 `document.write` 등으로 DOM을 바꿀 수 있기 때문입니다.

```html
<!-- 파서 블로킹 (기본) -->
<script src="app.js"></script>

<!-- HTML 파싱 계속, DOM 준비 후 실행 -->
<script defer src="app.js"></script>

<!-- HTML 파싱 계속, 다운로드 완료 즉시 실행 (순서 무관) -->
<script async src="analytics.js"></script>

<!-- ES Module — defer와 유사하게 동작 -->
<script type="module" src="app.js"></script>
```

React/Vue SPA는 보통 `<div id="root">`만 있는 HTML + 큰 JS 번들 구조입니다. **FCP(First Contentful Paint)가 JS 실행 이후**로 밀리는 이유가 여기 있습니다.

### 로드 이벤트 타이밍

```javascript
// HTML 파싱 완료 — defer 스크립트 실행 직후
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");
});

// 모든 리소스(이미지, CSS, iframe 등) 로드 완료
window.addEventListener("load", () => {
  console.log("All resources loaded");
});
```

Performance 탭의 **FCP, LCP**는 DOMContentLoaded/load와 별개 지표입니다. LCP는 **가장 큰 콘텐츠가 화면에 그려진 시점**을 봅니다.

---

## 추가 리소스 — HTML 이후의 Waterfall

첫 HTML 응답 뒤, 파서·preload 스캐너가 **외부 리소스**를 추가 요청합니다.

```html
<link rel="stylesheet" href="/styles.css" />
<script defer src="/app.js"></script>
<img src="/logo.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preload" href="/hero.woff2" as="font" crossorigin />
```

각 리소스는 이론상 **DNS → TCP → TLS → HTTP** 를 거칠 수 있지만, 실제로는:

- **같은 origin** → TCP/TLS/DNS 재사용
- **preconnect** → DNS+TCP+TLS 미리 수립
- **HTTP/2** → 한 연결에서 병렬 스트림

### DevTools Waterfall 읽기

Network 탭 Waterfall에서 자주 보는 패턴:

```
document.html  ████░░░░░░  (TTFB 길면 서버·CDN 확인)
main.css       ░░████      (렌더 블로킹 — HTML 직후)
app.js         ░░░░████    (defer면 HTML 파싱과 병렬)
logo.png       ░░░░░░██    (img는 보통 렌더 블로킹 아님)
font.woff2     ░░░░░░░░██  (FOIT/FOUT — font-display 확인)
```

CSS·동기 JS가 길면 **렌더 시작이 늦어지고**, LCP 요소(히어로 이미지 등)가 늦게 요청되면 LCP 수치가 나빠집니다.

> 캐시·CDN 전략 → [[FRONT] 웹 캐시 전략과 구현](/cache/2024/09/03/web-cache/)

---

## 단계별 병목 — 어디를 볼 것인가

| 증상                    | 의심 구간        | 확인 방법                             |
| ----------------------- | ---------------- | ------------------------------------- |
| 첫 방문만 느림          | DNS, TCP, TLS    | Timing → DNS Lookup, SSL              |
| 매 요청 느림            | TTFB (서버)      | Waiting 시간, 서버 로그               |
| 재방문은 빠름           | 캐시 동작        | 304, `(disk cache)`, `(memory cache)` |
| HTML은 빠른데 화면 늦음 | JS/CSS 블로킹    | Coverage, Performance → Main thread   |
| 이미지·폰트 늦음        | 리소스 Waterfall | preload, priority hints, CDN          |
| HTTPS 페이지 깨짐       | Mixed Content    | Console Mixed Content 경고            |

---

## 정리

`www.google.com` 입력 한 번 뒤에는 다음 순서로 동작합니다.

```
1. URL 파싱 → https://www.google.com:443
2. DNS → IP (캐시 → OS → Resolver → Authoritative)
3. TCP 3-Way Handshake
4. TLS Handshake → 암호화 채널
5. HTTP GET / → HTML 수신
6. HTML/CSS 파싱 → DOM, CSSOM → Render Tree
7. Layout → Paint → Composite
8. CSS/JS/이미지/폰트 추가 요청 (Waterfall)
9. 화면 표시
```

프론트엔드 개발에서 이 파이프라인을 알면 **Network Timing, Web Vitals, 캐시, Mixed Content, script loading** 문제를 같은 프레임으로 이해할 수 있습니다. 각 단계를 더 깊게 보려면 아래 글들과 함께 읽어보면 좋습니다.

| 주제        | 글                                                                    |
| ----------- | --------------------------------------------------------------------- |
| URL·도메인  | [[FRONT] URL과 Domain 정확히 이해하자](/front/2025/01/03/url_domain/) |
| HTTP 헤더   | [[FRONT] HTTP 헤더 완벽 이해하기](/front/2025/01/07/HTTP-header/)     |
| 렌더링·성능 | [[FRONT] 브라우저 렌더링 과정](/front/2024/12/26/lender/)             |
| 웹 캐시     | [[FRONT] 웹 캐시 전략과 구현](/cache/2024/09/03/web-cache/)           |

---

## 참고자료

| 분류           | 링크                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| MDN            | [How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)             |
| MDN            | [Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path) |
| MDN            | [DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS)                                                       |
| Google Web Dev | [Critical Rendering Path](https://web.dev/articles/critical-rendering-path)                                        |
| Google Web Dev | [Understanding DNS lookup time](https://web.dev/articles/critical-request-chains)                                  |
