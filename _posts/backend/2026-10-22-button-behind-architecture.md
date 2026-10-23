---
layout: post
title: "[BACKEND] 버튼 하나 뒤에서 — 프론트가 서버를 나누는 법"

subtitle: "Next.js는 Vercel에, NestJS·MySQL·Redis는 EC2 한 대에. 풀스택으로 옮기며 잡은 첫 지도"

date: 2026-10-22 11:00:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/05/architecture_comparison.webp"

categories:
  - BACKEND

tags:
  - NestJS
  - Next.js
  - Prisma
  - MySQL
  - Redis
  - Docker
  - Caddy
  - 모노레포
  - 풀스택
  - backend-visualized
---

{% include post/backend_contents.md %}

> 프론트만 하다가 서버를 직접 만들면, 처음 막히는 지점은 문법이 아니라 **버튼을 눌렀을 때 요청이 어디를 지나가는지**다. [버튼 하나 뒤에서](https://bv.chuckplay.dev/)는 그 길을 티켓팅, 로그인, 클릭 기록, 포인트, 결제, 캐시 여섯 장면으로 일부러 깨뜨려 보고 고친 프로젝트다. 이 글은 장면 속으로 들어가기 전에, 화면·API·데이터베이스·배포가 어떻게 나뉘어 있는지만 지도로 남긴다.

---

## 한 저장소, 세 개의 실행 단위

저장소는 pnpm workspace와 Turborepo 모노레포다. 패키지는 세 개다.

| 패키지         | 역할                                 | 돌아가는 곳  |
| -------------- | ------------------------------------ | ------------ |
| `apps/web`     | Next.js 15, React 19 화면            | Vercel       |
| `apps/api`     | NestJS 11, Prisma 6 API              | EC2의 Docker |
| `packages/sdk` | 클릭 기록을 모아 보내는 브라우저 SDK | 웹이 의존    |

화면과 API를 한 프로세스에 넣지 않았다. 브라우저는 화면을 Vercel에서 받고, 데이터 요청은 EC2의 HTTPS로 따로 보낸다.

```text
브라우저
  ├─ 화면 ──────────► Vercel · Next.js (:443)
  └─ API (HTTPS) ──► EC2
                       Caddy :443
                         └─ NestJS :4000  (밖으로는 포트를 열지 않음)
                              ├─ MySQL 8.4
                              └─ Redis 7.4
```

밖에서 열려 있는 포트는 Caddy의 80/443과, 내 IP·내 키만 허용하는 SSH뿐이다. API 4000번, MySQL, Redis는 서버 안쪽 네트워크에만 있다. 프론트에서 익숙한 "API Route에 DB를 붙인다"와 달리, **DB 비밀번호가 브라우저 배포물 쪽에 있을 이유가 없다.**

로컬에서는 `docker compose up -d`로 MySQL(호스트 3307)과 Redis(호스트 6380)만 띄우고, `pnpm dev`가 웹 3000과 API 4000을 같이 켠다.

---

## 요청 하나가 지나가는 길

`POST /payments`를 예로 들면 계층은 고정이다. 컨트롤러가 SQL을 만들지 않고, 서비스는 HTTP 상태 코드를 모른다.

```text
브라우저 fetch
  → main.ts          JSON 바디, CORS
  → 가드             IP당 요청 수. 넘치면 429. 컨트롤러는 실행되지 않음
  → ValidationPipe   DTO가 틀리면 400. 역시 컨트롤러 전
  → 컨트롤러         헤더를 읽고 HTTP 응답으로 바꿈
  → 서비스           결제 행을 processing으로 넣고, 처리 후 paid
  → Prisma           SQL
  → MySQL
```

캐시가 있는 요청만 서비스 안에서 한 갈래가 더 있다. Redis를 먼저 보고, 없을 때만 Prisma로 MySQL에 간다.

프론트 개념으로 옮기면 이렇다.

| Nest     | 하는 일                            | 프론트에서 비슷하게                    |
| -------- | ---------------------------------- | -------------------------------------- |
| 모듈     | 컨트롤러·서비스를 한 기능으로 등록 | 기능 폴더. `app.module.ts`는 `App.tsx` |
| 컨트롤러 | URL과 HTTP 응답                    | `app/api/.../route.ts`                 |
| 서비스   | 로직과 DB. HTTP를 모름             | UI 없는 훅·클라이언트 모듈             |
| DTO      | 요청 모양 + `class-validator`      | zod 스키마의 `parse`                   |
| 가드     | 컨트롤러 전에 통과/거절            | `middleware.ts`                        |
| DI       | Nest가 생성자에 인스턴스를 넣어 줌 | Context를 `new` 하지 않고 받아 쓰는 것 |

DTO는 타입과 검증이 한 클래스다. 전역 `ValidationPipe`가 매 요청을 검사하고, 스키마에 없는 필드는 거절한다. 컨트롤러 안에서 `if (!body.amount)`를 흩뿌리지 않기 위한 자리다.

DB 모델은 `schema.prisma` 한 파일이다. `prisma generate`가 `Payment`, `PointWallet` 같은 타입을 만들고, 모듈은 그 타입을 같이 쓴다. TypeORM식 `entity.ts`를 또 두면 같은 모델을 두 번 적게 된다.

---

## URL 첫 단어가 폴더다

기능은 `apps/api/src` 아래 모듈 하나다. 폴더 이름, URL 첫 단어, 모듈 이름이 같다.

| 장         | 화면          | API          | 서버가 일부러 틀리는 지점           |
| ---------- | ------------- | ------------ | ----------------------------------- |
| 1 티켓팅   | `/ticketing`  | `coupons`    | 표 100장에 500명이 동시에 누름      |
| 2 손목밴드 | `/wristband`  | `auth`       | 만료 직후 refresh 5개가 동시에 나감 |
| 3 묶음배송 | `/delivery`   | `events`     | 클릭 10,000건을 한 건씩 커밋        |
| 4 포인트   | `/ledger`     | `points`     | 잔액 칸만 덮어씀                    |
| 5 결제     | `/double-pay` | `payments`   | 같은 결제를 재시도가 다시 보냄      |
| 6 메뉴판   | `/cache`      | `cache-demo` | 캐시가 비는 순간 1000명이 DB로      |

모듈 안 파일도 역할이 이름에 있다.

```text
coupons/
  coupons.module.ts
  coupons.controller.ts    HTTP만
  coupons.service.ts       로직과 DB
  dto/coupons.dto.ts
  lib/coupon-strategies.ts 발급 전략 4종. Nest 없이 PrismaClient만 받음
  test/coupon-strategies.spec.ts
```

두 모듈 이상이 쓰는 것만 `common/`으로 올린다. 관리자 키 가드, 시뮬레이션 동시 실행 1개와 쿨다운, 진행 중인 Promise를 하나로 묶는 `single-flight`가 거기 있다. 모듈 하나만 쓰는 비밀번호 해시, 쿠키, 쿠폰 전략은 그 모듈의 `lib/`에 둔다.

리포지토리 계층, 인터페이스, `index.ts` 배럴은 만들지 않았다. 파일이 두 가지 일을 할 때만 나눈다. 프론트에서 폴더를 잘게 나누던 습관으로 백엔드를 쪼개면, 요청이 지나가는 길이 오히려 안 보인다.

웹도 같은 원칙이다. 여러 장이 같이 쓰는 UI만 `atoms` / `molecules` / `organisms`로 올리고, 한 장에서만 쓰는 컴포넌트는 그 장 폴더에 둔다. API 호출은 장마다 `api.ts` 하나다. 화면 컴포넌트는 `fetch`를 직접 부르지 않는다.

---

## 배포는 화면과 서버가 따로다

화면은 Vercel이 `main`을 받으면 끝이다. API는 그렇게 올리면 안 된다. MySQL과 Redis가 EC2 안에 있고, 배포 중에 요청이 죽으면 안 되기 때문이다.

흐름은 이렇다.

```text
git push
  → GitHub Actions가 ARM 이미지를 GHCR에 push
  → OIDC로 받은 임시 권한으로 SSM에 deploy.sh <SHA> 전달
  → 쉬고 있던 색(blue 또는 green)에 새 컨테이너
  → /health 가 200일 때만 Caddy가 그 색으로 전환
```

서버가 GitHub을 폴링하지 않는다. Actions가 서버를 호출한다. 배포용으로 열어 둔 포트도, 저장소에 넣어 둔 AWS 장기 키도 없다. 평소에는 blue/green 중 한 색만 떠 있고, 교체하는 잠깐만 둘이 같이 뜬다.

측정에서 배포 세 번 동안 0.2초마다 보낸 요청은 실패가 0번이었다. API 코드가 바뀔 때 push부터 끝까지 약 2분 23초, 서버 쪽 job만 보면 이미지를 서버에서 빌드하던 135초가 Actions 빌드로 옮긴 뒤 37~51초가 됐다.

데이터는 캐시와 원장을 다르게 둔다. Redis는 디스크에 쓰지 않고 메모리 64MB를 넘으면 오래된 키부터 버린다. 메뉴판은 사라져도 MySQL에서 다시 만들면 된다. MySQL은 매일 04:00에 백업하고, 서버에 7일, S3에 30일 둔 뒤 임시 DB로 복원해서 테이블 행 수가 맞는지 확인한다.

---

## 이 지도 다음에 볼 것

장면마다 "고른 것, 포기한 것, 다시 재 보니 배운 것"이 따로 있다. 숫자는 맥북 한 대와 EC2 `t4g.small` 한 대에서 잰 상대 비교다. 실행마다 흔들리고, 동시 사용자 수 주장으로 쓰면 안 된다.

이 카테고리에서는 그 장면을 서버 코드 기준으로 하나씩 푼다.

1. [티켓팅 — 한 행을 500명이 동시에 고칠 때](/backend/2026/10/22/ticketing-concurrency/)
2. [손목밴드 — 액세스 토큰과 리프레시 토큰이 갈라지는 이유](/backend/2026/10/22/wristband-refresh-token/)
3. [묶음배송 — 요청 수가 아니라 커밋 횟수가 병목인 이유](/backend/2026/10/22/delivery-batching/)
4. [포인트 — 잔액은 결과이고 내역이 근거인 이유](/backend/2026/10/22/point-ledger/)
5. [결제 — 버튼 잠금으로 중복 결제가 안 막히는 이유](/backend/2026/10/22/idempotent-payment/)
6. [메뉴판 — 캐시가 비는 순간과 메뉴가 바뀌는 순간](/backend/2026/10/22/menu-cache/)
7. [배포 — blue/green, 백업, 부하 테스트에서 실제로 막힌 것](/backend/2026/10/22/blue-green-deploy/)

---

## 참고

- [버튼 하나 뒤에서](https://bv.chuckplay.dev/)
- 저장소 `docs/architecture.md` — 폴더 규칙, Nest와 프론트 대응
- 저장소 `docs/decisions.md` — 장마다 고른 방법과 실측
- 저장소 `docs/deploy.md` — EC2, Caddy, GHCR, OIDC, SSM, 백업
