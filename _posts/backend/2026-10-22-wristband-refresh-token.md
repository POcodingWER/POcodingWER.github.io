---
layout: post
title: "[BACKEND] 로그인이 만료된 순간 요청 5개 — 리프레시 토큰은 왜 한 번만 써야 하나"

subtitle: "액세스 토큰은 메모리, 리프레시 토큰은 httpOnly 쿠키. 회전, 재사용 감지, single-flight"

date: 2026-10-22 11:02:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/09/auth-vs-authz.webp"

categories:
  - BACKEND

tags:
  - JWT
  - Refresh Token
  - httpOnly
  - XSS
  - CSRF
  - single-flight
  - NestJS
  - backend-visualized
---

{% include post/backend_contents.md %}

> 액세스 토큰 하나만 오래 들고 있으면 편하다. 서명을 검증하면 되고, DB를 안 봐도 된다. 문제는 그 토큰이 새면 **만료 전까지 폐기할 방법이 없다**는 점이다. [버튼 하나 뒤에서](https://bv.chuckplay.dev/wristband) 2장은 그래서 토큰을 둘로 나눈다. 짧게 사는 손목밴드와, 쓸 때마다 바뀌는 재발급 영수증이다.

이전 글: [[BACKEND] 표 100장에 500명](/backend/2026/10/22/ticketing-concurrency/)

---

## 토큰을 둘로 나눈 이유

|                | 액세스 토큰                   | 리프레시 토큰                              |
| -------------- | ----------------------------- | ------------------------------------------ |
| 형식           | JWT, HS256                    | 랜덤 32바이트, base64url                   |
| 수명           | 기본 20초                     | 24시간                                     |
| 보관           | 자바스크립트 메모리           | httpOnly 쿠키 `bv_refresh_token`           |
| 서버가 아는 것 | 서명과 만료                   | DB의 SHA-256 해시와 상태                   |
| 하는 일        | API의 `Authorization: Bearer` | `POST /auth/refresh`로 새 액세스 토큰 발급 |

액세스 토큰은 DB를 보지 않고 서명만 확인한다. 그래서 빠르지만, 한 번 발급하면 그 20초 동안은 서버가 개별 토큰을 취소하지 못한다. 수명을 짧게 해서 새어도 피해 시간을 줄인다.

리프레시 토큰은 DB에 상태가 있다. 로그아웃하거나 탈취가 의심되면 그 줄을 폐기할 수 있다. 원문은 쿠키에만 있고, DB에는 해시만 저장한다. DB가 유출돼도 그 해시로 쿠키를 복원해서 쓸 수 없다.

쿠키 속성은 `Path=/auth`, `SameSite=Lax`다. 인증 경로에만 붙고, 다른 사이트에서 시작하는 POST에는 실리지 않는다. 운영 환경에서는 `Secure`를 켠다.

---

## 어디에 두나

페이지 안에서 돌아가는 스크립트가 세 곳을 읽어 보게 했다. 결과는 세 곳 중 localStorage만 열렸다.

| 보관                      | 스크립트가 읽나                | 브라우저가 알아서 보내나 |
| ------------------------- | ------------------------------ | ------------------------ |
| localStorage              | 읽힌다. `getItem` 한 번이면 끝 | 안 보낸다                |
| 메모리 (전역이 아닌 변수) | `window`에 없으면 못 읽는다    | 안 보낸다                |
| httpOnly 쿠키             | `document.cookie`에 안 보인다  | 조건이 맞으면 보낸다     |

localStorage가 편한 이유는 새로고침해도 남기 때문이다. 그 편의가 XSS 한 번에 토큰 전체를 넘긴다. 그래서 액세스 토큰은 메모리에만 둔다. 새로고침하면 사라지지만, 쿠키의 리프레시 토큰으로 `POST /auth/refresh`를 한 번 호출해 다시 만든다.

메모리가 XSS에 완전하다는 뜻은 아니다. 전역 변수에만 안 올렸을 뿐, 페이지 안에서 이미 실행 중인 스크립트는 앱의 `fetch`를 대신 호출할 수 있다. httpOnly는 "토큰 문자열을 못 읽는다"이지 "그 브라우저의 요청을 못 시킨다"가 아니다.

쿠키는 브라우저가 알아서 붙이므로 CSRF가 문제다. 여기서는 `SameSite=Lax`, `Path=/auth`, 그리고 CORS가 `WEB_ORIGIN`만 `credentials`와 함께 허용하는 것으로 범위를 줄였다.

---

## 쓸 때마다 영수증을 바꾼다

로그인은 패밀리 하나를 만들고 첫 리프레시 토큰을 `active`로 둔다. 갱신할 때마다 그 토큰을 `used`로 바꾸고, 같은 `familyId`로 다음 토큰을 발급한다. `parentId`가 직전 토큰을 가리켜서 체인이 된다.

```text
login        RT1  active
refresh(RT1) RT1  used   →  RT2  active
refresh(RT2) RT2  used   →  RT3  active
refresh(RT1) RT1은 이미 used
             → 이 패밀리의 토큰을 전부 revoked
```

이미 쓴 토큰이 다시 오면, 그 토큰을 가진 주체가 둘이라는 뜻이다. 사용자와 훔친 쪽 중 누가 진짜인지 서버는 모른다. 그래서 패밀리 전체를 폐기하고 둘 다 다시 로그인하게 한다. 불편하지만, 훔친 토큰은 그 순간부터 쓸 수 없다.

동시에 같은 토큰이 두 번 들어와도 한 명만 이기게 만든 부분이 1장과 같다. 읽고 나서 상태를 덮어쓰지 않고, 조건이 맞을 때만 갱신한다.

```ts
const { count } = await prisma.refreshToken.updateMany({
  where: { id: existing.id, status: "active" },
  data: { status: "used", usedAt: new Date() },
});

if (count === 0) {
  await revokeFamily(familyId, "reuse_detected");
  return reuseDetected();
}
```

`updateMany`가 바꾼 행이 0이면 다른 요청이 먼저 `active`를 가져간 것이다. 그 요청은 재사용으로 보고 패밀리를 닫는다. 실제 MySQL 테스트에서 같은 토큰을 동시에 5번 보내면 회전은 1번만 성공한다.

---

## 만료 직후 요청 5개가 각자 갱신하면 로그아웃된다

액세스 토큰이 끝난 뒤 API 5개가 동시에 401을 받으면, 순진한 클라이언트는 각자 `/auth/refresh`를 호출한다. 쿠키는 하나라 다섯 요청이 같은 RT를 제출한다.

```text
요청 1  refresh(RT2) → 성공, RT3 발급, RT2는 used
요청 2  refresh(RT2) → 이미 used → 재사용 감지
요청 3~5 같음
→ 패밀리 전체 revoked. 사용자는 로그아웃
```

서버가 엄격할수록 클라이언트가 요청을 묶어야 한다. 진행 중인 refresh Promise를 하나 두고, 나중에 401을 받은 요청은 그 Promise가 끝나기를 기다린다.

```ts
export function createSingleFlight<T>(
  task: () => Promise<T>,
): () => Promise<T> {
  let inFlight: Promise<T> | null = null;
  return () => {
    inFlight ??= task().finally(() => {
      inFlight = null;
    });
    return inFlight;
  };
}
```

갱신은 1번이고, 나머지 4개는 새 액세스 토큰을 받아서 자기 요청만 다시 보낸다. 데모에서 재발급 창구에 간 횟수가 5번에서 1번으로 줄어든 이유가 이것이다.

이 함수는 모듈 스코프에 하나다. 컴포넌트 안에 두면 React StrictMode가 개발 모드에서 effect를 두 번 실행할 때 refresh도 두 번 나간다. 두 번째가 재사용으로 보여 방금 복구한 로그인이 바로 취소된다.

---

## 일부러 하지 않은 것

실무에서는 직전 리프레시 토큰을 몇 초간 더 받아 주는 유예 시간이 흔하다. 네트워크가 느려 응답을 못 받은 클라이언트가 같은 토큰으로 다시 시도하는 경우를 로그아웃으로 처리하지 않으려고다.

이 데모는 그 유예를 넣지 않았다. 재사용 감지가 왜 필요한지 흐려지기 때문이다. 대신 클라이언트가 single-flight로 동시 요청을 묶는 비용을 그대로 진다.

오래 사는 액세스 토큰 하나도 쓰지 않았다. 검증은 서명만으로 끝나서 빠르지만, 로그아웃이 "그 토큰을 잊어 달라"는 요청에 그친다. 서버가 기억하지 않는 토큰은 서버가 취소할 수 없다.

---

## 이 장에서 가져온 것

1. 액세스 토큰은 짧게, 폐기 가능한 상태는 리프레시 토큰에만 둔다.
2. 리프레시 토큰 원문은 쿠키에만 두고 DB에는 해시를 둔다.
3. `active`에서 `used`로의 전환은 조건부 UPDATE라야 동시 요청 중 하나만 이긴다.
4. 회전을 엄격히 하면, 갱신 API를 여러 번 부르는 정상적인 클라이언트도 탈취로 보인다. 그래서 클라이언트에서 한 번만 호출해야 한다.

다음은 3장 묶음배송이다. 클릭 10,000건을 하나씩 저장할 때와 100개씩 묶어 저장할 때, 차이가 요청 수인지 DB 커밋 수인지 본다.

---

## 참고

- [버튼 하나 뒤에서 — 2장 손목밴드](https://bv.chuckplay.dev/wristband)
- 저장소 `docs/auth-tokens.md`
- 저장소 `apps/api/src/auth/lib/refresh-token.store.ts`
- 저장소 `apps/web/lib/single-flight.ts`
- [MDN — Set-Cookie, HttpOnly와 SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
