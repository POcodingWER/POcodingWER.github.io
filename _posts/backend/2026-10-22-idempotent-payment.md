---
layout: post
title: "[BACKEND] 결제 버튼을 잠가도 두 번 빠진다 — 같은 시도에는 같은 번호표"

subtitle: "앱이 0.6초에 포기해도 서버의 0.9초 승인은 계속된다. Idempotency-Key로 4번을 1번으로"

date: 2026-10-22 11:05:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/05/architecture_comparison.webp"

categories:
  - BACKEND

tags:
  - 멱등성
  - Idempotency-Key
  - 결제
  - UNIQUE
  - Prisma
  - MySQL
  - NestJS
  - backend-visualized
---

{% include post/backend_contents.md %}

> 결제 버튼을 누르면 바로 `disabled`로 잠그는 것으로 중복 결제가 끝난다고 생각하기 쉽다. 한 사람이 한 번만 눌러도, 앱이 응답을 기다리다 포기하고 같은 결제를 다시 보내면 서버는 새 결제로 받는다. [버튼 하나 뒤에서](https://backend-visualized.vercel.app/double-pay) 5장은 그 재시도를 결제 시도 하나의 번호표로 묶는다.

이전 글: [[BACKEND] 잔액만 고치면 포인트가 사라진다](/backend/2026/10/22/point-ledger/)

---

## 한 번 눌렀는데 요청이 네 개가 된다

데모의 가짜 결제사 승인은 0.9초 걸린다. 앱은 0.6초 안에 답이 없으면 첫 요청을 끊고 같은 결제를 다시 보낸다. 화면의 연타는 그 위에 더해진다. 버튼을 0.09초 간격으로 세 번 누르면, 첫 요청의 자동 재시도까지 서버에는 네 요청이 도착한다.

```text
0.00초  1번째 누름        서버는 0.9초짜리 승인 시작
0.09초  2번째 누름
0.18초  3번째 누름
0.60초  앱이 1번째를 포기하고 재시도
        서버의 1번째는 그대로 승인 중
```

번호표가 없으면 네 요청이 네 행이 되고 네 번 결제된다. 버튼을 잠그고 한 번만 눌러도 자동 재시도 때문에 두 번 결제된다. 클라이언트가 abort해도 서버가 이미 받은 승인은 멈추지 않는다.

중복의 출발점은 사용자의 실수보다 타임아웃이다. 승인이 재시도보다 길면, 정상 경로가 그대로 중복 결제가 된다.

---

## 조회하고 없으면 넣는 순서는 막지 못한다

같은 키인지 먼저 조회하고, 없을 때만 저장하면 동시에 도착한 두 요청이 둘 다 "없음"을 본다.

```text
요청 A  조회 → 없음
요청 B  조회 → 없음
요청 A  INSERT
요청 B  INSERT   ← 둘 다 통과
```

막아야 하는 지점은 애플리케이션의 if가 아니다. `Payment.idempotencyKey`에 UNIQUE를 걸고, 조회보다 INSERT를 먼저 한다.

```ts
try {
  reserved = await prisma.payment.create({
    data: { orderId, amount, status: "processing", idempotencyKey },
  });
} catch (error) {
  if (idempotencyKey && isUniqueViolation(error))
    return waitForStoredResult(idempotencyKey, orderId, amount);
  throw error;
}
```

Prisma가 unique 충돌을 `P2002`로 돌려준다. 동시에 같은 키가 와도 행은 하나만 생긴다. 진 요청은 50ms마다 그 행을 보다가 `paid`가 되면 같은 결제 본문을 돌려준다. 응답 헤더에 `Idempotent-Replayed: true`를 붙여, 새로 청구한 것인지 저장해 둔 결과를 다시 준 것인지 구분한다.

같은 키로 주문이나 금액이 다르면 422다. 재시도가 아니라 키를 잘못 재사용한 것으로 본다.

통합 테스트는 같은 키 5개를 동시에 보내 행이 1개이고, 응답 5개가 모두 그 결제의 id인지 실제 MySQL로 확인한다. 데모에서 번호표가 없을 때 4번이던 결제는, 세 번의 클릭과 재시도가 같은 UUID를 쓰면 1번이 된다.

---

## 승인 중에 서버가 죽으면

INSERT는 `processing`으로 시작하고, 0.9초를 기다린 뒤 `paid`로 바꾼다. 그 사이에 프로세스가 죽으면 키는 `processing`인 채로 남는다. 같은 키의 재시도는 끝나지 않은 결제를 영영 기다릴 수 있다.

매분 도는 작업이 5분보다 오래된 `processing`을 `failed`로 닫는다. 이것도 조건부 UPDATE다.

```ts
await prisma.payment.updateMany({
  where: { status: "processing", createdAt: { lt: cutoff } },
  data: { status: "failed" },
});
```

blue/green 두 컨테이너가 같이 돌아도 한 행은 한 번만 바뀐다. 늦게 살아난 원래 요청이 `paid`로 덮어쓰지 못하게, 승인 완료 UPDATE도 `status = 'processing'`일 때만 성공한다. 이미 `failed`면 바꾼 행이 0이고, 그 요청은 실패로 끝난다.

데모의 가짜 결제사는 승인 기록이 없어서, 죽은 요청은 "돈이 안 나갔다"고 보고 `failed`로 닫는다. 진짜 결제사라면 이 자리에서 승인 조회를 해야 한다. 승인이 이미 됐는데 `failed`로 닫으면, 사용자는 새 키로 다시 결제하고 돈은 두 번 나간다. 키를 재사용하라는 409는 "돈은 나가지 않았다"는 전제가 있을 때만 맞다.

---

## 번호표는 누가 만드나

키는 서버가 아니라 앱이 결제 시도마다 UUID로 만든다. 재시도와 연타에는 그 값을 그대로 보낸다. 사용자가 결제를 새로 시작하면 새 UUID다.

서버가 키를 만들면 재시도는 이미 다른 요청이다. 첫 요청의 응답을 받지 못한 클라이언트는 자기가 보낸 시도를 가리킬 번호가 없다.

버튼을 잠그는 일은 연타를 줄이는 UI다. 번호표는 그 시도가 서버에 여러 번 도착해도 결제가 하나이게 하는 서버 계약이다. 둘은 같이 쓰되, 잠금만으로는 0.6초 재시도를 막지 못한다.

---

## 이 장에서 가져온 것

1. 중복 결제는 두 번 누름보다, 승인(0.9초)보다 짧은 클라이언트 타임아웃(0.6초)에서 생긴다.
2. "있는지 보고 없으면 넣기"는 동시에 보면 둘 다 없다. UNIQUE INSERT가 먼저다.
3. 진 요청은 에러로 끝내지 않고, 이긴 행이 `paid`가 될 때까지 기다렸다가 같은 본문을 돌려준다.
4. `processing`으로 남은 키는 결제사에 승인 여부를 물어 닫아야 한다. 물어보지 않고 실패로 보면 다음 결제가 두 번째 청구가 된다.

다음은 6장 맛집 메뉴판이다. 손님 1,000명이 같은 메뉴를 물을 때 데이터베이스에 몇 번 가는지, 메뉴가 바뀐 순간 캐시를 어떻게 지우는지를 본다.

---

## 참고

- [버튼 하나 뒤에서 — 5장 결제 버튼 두 번](https://backend-visualized.vercel.app/double-pay)
- 저장소 `apps/api/src/payments/payments.service.ts`
- 저장소 `apps/web/app/double-pay/PaymentDemo.tsx`
- 저장소 `docs/decisions.md` 5장
- [Stripe — Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
