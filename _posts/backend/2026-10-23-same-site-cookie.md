---
layout: post
title: "[BACKEND] 도메인을 사자 쿠키가 Lax로 충분해졌다"

subtitle: "vercel.app과 API는 다른 사이트였다. chuckplay.dev로 합치고 나서 막힌 세 가지"

date: 2026-10-23 10:00:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/09/auth-vs-authz.webp"

categories:
  - BACKEND

tags:
  - SameSite
  - 쿠키
  - CORS
  - Route 53
  - Vercel
  - Caddy
  - Let's Encrypt
  - backend-visualized
---

{% include post/backend_contents.md %}

> 도메인을 산 뒤 코드는 거의 안 바뀌었다. 바뀐 것은 브라우저가 화면과 API를 같은 사이트로 보느냐다. 2026-10-23에 화면을 `bv.chuckplay.dev`, API를 `api.chuckplay.dev`로 옮기자 리프레시 쿠키를 `SameSite=None`으로 보내던 이유가 사라졌다.

이전 글: [[BACKEND] 로그인이 만료된 순간 요청 5개](/backend/2026/10/22/wristband-refresh-token/)

---

## 등록 가능한 도메인이 같아야 같은 사이트다

브라우저는 포트가 아니라 **등록 가능한 도메인(eTLD+1)** 으로 사이트를 가른다. `vercel.app`은 공개 접미사라 `backend-visualized.vercel.app`의 사이트는 그 호스트 자신이다. API가 `api.다른도메인`이면 둘은 다른 사이트다.

다른 사이트로 쿠키를 보내려면 `SameSite=None`이고, `None`이면 `Secure`가 필수다. 이 프로젝트는 거기에 `Partitioned`를 붙여, 쿠키를 최상위 사이트별로 나눠 저장했다. 2026-10-21에 Safari에서 `backend-visualized.vercel.app`으로 로그인하고 새로고침해도 유지되는 것을 확인했다. 다만 "모든 쿠키 차단"이나 오래된 브라우저에서는 새로고침 뒤 복구가 실패할 수 있다. 로그인 직후가 되는 이유는 액세스 토큰이 메모리에 있기 때문이다. 쿠키는 그 다음부터다.

| 구성 | 브라우저가 보는 관계 | 쿠키 |
| --- | --- | --- |
| `localhost:3000` ↔ `localhost:4000` | 같은 사이트. 포트는 무시 | `Lax` |
| `*.vercel.app` ↔ 다른 도메인 API | 다른 사이트 | `None` + `Secure` + `Partitioned` |
| `bv.chuckplay.dev` ↔ `api.chuckplay.dev` | 같은 사이트 | `Lax` |

`Lax`는 주소창에 치는 이동이나 같은 사이트의 요청에는 쿠키를 보내고, 다른 사이트에서 시작하는 POST에는 보내지 않는다. 2장에서 CSRF를 `SameSite`로 줄인다고 한 그 설정이다. 다른 사이트일 때는 그 보호를 풀고(`None`) 파티션으로 보완해야 했다.

---

## DNS는 화면과 API가 다르다

Route 53에서 `chuckplay.dev`를 샀다. 레코드는 두 개다.

```text
bv.chuckplay.dev    CNAME  →  Vercel
api.chuckplay.dev   A      →  Elastic IP (EC2)
```

화면은 Vercel이 IP를 바꿀 수 있어서 CNAME이다. API는 EC2의 고정 IP라 A 레코드다. Elastic IP가 없으면 인스턴스를 중지했다 켤 때 공인 IP가 바뀌고, A 레코드도 같이 바꿔야 한다. 재부팅만으로는 IP가 유지된다.

Caddy의 `API_DOMAIN=api.chuckplay.dev`로 Let's Encrypt 인증서를 받는다. API의 `VERCEL_ORIGIN=https://bv.chuckplay.dev`, `REFRESH_COOKIE_SAME_SITE=lax`. 화면은 `NEXT_PUBLIC_API_URL=https://api.chuckplay.dev`로 다시 빌드했다.

---

## 막힌 곳이 세 번이었다

**인증서 요청이 Vercel로 갔다.** `API_DOMAIN`에 화면 주소를 넣으면 Caddy가 그 이름으로 인증서를 발급받으려 한다. HTTP-01 확인은 80번 포트의 그 호스트로 가는데, `bv`는 Vercel을 보고 있었다. 인증서 발급 요청이 API가 아닌 Vercel에서 404가 됐다. 인증서를 받을 이름과 화면 이름은 다른 레코드여야 한다.

**API 주소는 빌드할 때 박힌다.** `NEXT_PUBLIC_API_URL`은 브라우저 번들에 들어간다. Vercel 환경 변수만 바꾸고 다시 빌드하지 않으면 화면은 예전 API 주소를 계속 호출한다. 빠진 값이면 빌드가 실패하게 해 두었다.

**CORS 허용 주소는 프로세스가 켜질 때 읽는다.** `VERCEL_ORIGIN`을 파일에 적어도 이미 떠 있는 컨테이너는 모른다. `./deploy/deploy.sh current`로 같은 이미지를 다른 색에 다시 띄워야 새 출처가 허용된다. 화면 배포와 API 재시작은 별개의 버튼이다.

---

## 이 변경에서 가져온 것

1. 커스텀 도메인의 효과는 주소가 짧아진 것이 아니라, 화면과 API가 같은 사이트가 된 것이다.
2. `SameSite=None`은 다른 사이트로 쿠키를 보내기 위한 예외다. 같은 사이트면 `Lax`가 그 예외를 거둔다.
3. 인증서 도메인, 브라우저에 박히는 API 주소, 서버가 켜질 때 읽는 CORS는 서로 다른 시점에 적용된다. 한 곳만 바꾸면 나머지 둘은 예전 주소를 본다.

같은 날 API 프로세스를 하나 더 켠 기록은 [서버를 늘렸더니 처리량은 그대로였다](/backend/2026/10/23/two-node-processes/)에 있다.

---

## 참고

- [버튼 하나 뒤에서 — 배포 및 회고](https://bv.chuckplay.dev/deploy)
- [MDN — SameSite 쿠키](https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value)
- [Public Suffix List](https://publicsuffix.org/) — `vercel.app`이 등록 가능한 도메인으로 안 잘리는 이유
