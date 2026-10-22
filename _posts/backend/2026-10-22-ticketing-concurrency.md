---
layout: post
title: "[BACKEND] 표 100장에 500명 — 선착순 동시성 제어 4가지를 직접 재 봤다"

subtitle: "대책 없음, 비관적 락, 낙관적 락, 원자적 UPDATE. 같은 MySQL에서 몇 장이 팔리고 몇 초가 걸렸나"

date: 2026-10-22 12:00:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/05/architecture_comparison.webp"

categories:
  - BACKEND

tags:
  - 동시성
  - Race Condition
  - 비관적 락
  - 낙관적 락
  - SELECT FOR UPDATE
  - MySQL
  - Prisma
  - NestJS
  - backend-visualized
---

{% include post/backend_contents.md %}

> 선착순 쿠폰 100장에 500명이 동시에 누르면 서버는 몇 장을 팔까. 프론트에서 보면 `if (남은 수량 > 0) 발급()` 한 줄이지만, 서버에서는 그 한 줄 사이로 다른 요청 499개가 끼어든다. [버튼 하나 뒤에서](https://backend-visualized.vercel.app/ticketing) 1장에서 같은 MySQL로 네 가지 방법을 돌려 본 기록이다.

---

## 실험 조건

| 항목 | 값                                                 |
| ---- | -------------------------------------------------- |
| 쿠폰 | 100장                                              |
| 요청 | 사용자 500명이 동시에 1번씩                        |
| DB   | MySQL 8.4, InnoDB 기본 격리 수준 `REPEATABLE READ` |
| 서버 | NestJS 11, Prisma 6.19 기본 커넥션 풀, Node 20     |
| 머신 | M1 Pro 한 대에서 클라이언트·API·DB 모두 실행       |
| 날짜 | 2026-10-19                                         |

테이블은 두 개다. `Coupon`에는 총 수량 `totalQuantity`, 발급 카운터 `issuedCount`, 낙관적 락용 `version`이 있고, 실제 발급 내역은 `CouponIssue`에 한 줄씩 쌓인다.

일부러 `CouponIssue`에 `(couponId, userId)` unique 제약을 걸지 않았다. 대책 없는 방식이 얼마나 초과 발급하는지 **그대로 보이게** 하려는 실험용 선택이다. 실서비스라면 1인 1매 규칙은 unique 제약으로 막는다.

---

## 결과부터

동시 Promise 500개를 서버 안에서 직접 실행한 결과다. 시간은 3회 측정값이다.

| 방법          | 실제 발급 행 | 카운터 | 초과 발급 | 재시도 합계 | 시간                     |
| ------------- | -----------: | -----: | --------: | ----------: | ------------------------ |
| 대책 없음     |          500 |      1 |   **400** |           0 | 2.48 / 2.35 / 2.34초     |
| 비관적 락     |          100 |    100 |         0 |           0 | 1.68 / 1.70 / 1.73초     |
| 낙관적 락     |      **100** |     60 |         0 |   약 14,140 | 23.4 / 24.0 / 23.3초     |
| 원자적 UPDATE |          100 |    100 |         0 |           0 | **0.46 / 0.39 / 0.41초** |

HTTP로 `POST /coupons/issue`를 동시에 500번 보낸 결과도 순서는 같았다. 원자적 UPDATE가 0.61 / 0.55초로 가장 빨랐다.

---

## 1. 대책 없음 — 500명이 모두 "0장 팔림"을 읽었다

```ts
const coupon = await db.coupon.findUniqueOrThrow({ where: { id: couponId } });
if (coupon.issuedCount >= coupon.totalQuantity) return soldOut();

await db.couponIssue.create({ data: { couponId, userId, strategy: "none" } });
await db.coupon.update({
  where: { id: couponId },
  data: { issuedCount: coupon.issuedCount + 1 },
});
```

읽고, 판단하고, 쓴다. 문제는 세 단계 사이에 틈이 있다는 점이다.

```text
요청 A: issuedCount 읽음 → 0
요청 B: issuedCount 읽음 → 0
요청 C: issuedCount 읽음 → 0
...
모두 "남았다"고 판단 → 모두 발급 행 INSERT
모두 issuedCount = 0 + 1 로 덮어씀
```

결과는 두 가지 버그가 동시에 난다.

- **초과 발급**: 100장 쿠폰이 500장 나갔다.
- **Lost update**: 500명이 각자 `0 + 1`을 덮어써서 카운터는 1이다.

카운터만 보면 1장 팔린 것처럼 보인다. 실제 행을 세야 500장이 보인다. 그래서 이 프로젝트의 테스트는 카운터가 아니라 **실제 발급 행 수**로 검증한다. 300명이 50장 쿠폰에 몰리는 상황을 실제 MySQL로 돌려서, 대책 없는 방식은 초과 발급하고 나머지 세 방식은 정확히 50장인지 확인한다.

---

## 2. 비관적 락 — 정확하지만 줄이 커넥션을 쥔다

```ts
await db.$transaction(async (tx) => {
  const [coupon] = await tx.$queryRaw`
    SELECT issuedCount, totalQuantity FROM Coupon
    WHERE id = ${couponId} FOR UPDATE`;

  if (coupon.issuedCount >= coupon.totalQuantity) return soldOut();

  await tx.couponIssue.create({
    data: { couponId, userId, strategy: "pessimistic" },
  });
  await tx.coupon.update({
    where: { id: couponId },
    data: { issuedCount: { increment: 1 } },
  });
});
```

`SELECT ... FOR UPDATE`는 그 행에 쓰기 잠금을 건다. 다음 트랜잭션은 앞 트랜잭션이 커밋할 때까지 같은 행을 읽지 못하고 기다린다. 500명이 한 줄로 서니 정확히 100장이 나간다.

예상과 달랐던 건 **기다리는 위치**였다. 요청마다 두 시간을 나눠 기록했다.

- 커넥션 풀 대기: 트랜잭션을 시작할 커넥션을 받기까지
- 행 락 대기: 커넥션을 받은 뒤 `FOR UPDATE`가 잠금을 얻기까지

500건의 중간값은 커넥션 풀 대기 170.1ms, 행 락 대기 2.4ms였다. 전체 대기의 96%가 풀 앞이었다.

```text
요청 500개
  └─ 커넥션 풀 (기본 크기만큼만 입장)  ← 대부분 여기서 대기
        └─ 트랜잭션 시작
              └─ FOR UPDATE 행 락     ← 실제 락 대기는 짧음
```

트랜잭션은 시작부터 커밋까지 커넥션 하나를 붙잡는다. 락 줄이 길어지면 같은 서버의 다른 API도 커넥션을 못 받는다. 쿠폰 하나 때문에 로그인 API가 느려질 수 있다는 뜻이다. 비관적 락은 정확성은 좋지만, **트랜잭션 안에서 외부 API를 부르거나 오래 일하면 안 되는** 이유가 여기 있다.

---

## 3. 낙관적 락 — 충돌이 몰리면 재시도가 재시도를 부른다

```ts
for (let retries = 0; retries <= 30; retries++) {
  const coupon = await db.coupon.findUniqueOrThrow({ where: { id: couponId } });
  if (coupon.issuedCount >= coupon.totalQuantity) return soldOut();

  const { count } = await db.coupon.updateMany({
    where: { id: couponId, version: coupon.version },
    data: { issuedCount: { increment: 1 }, version: { increment: 1 } },
  });

  if (count === 1) return issue();
  await sleep(Math.random() * 5 * (retries + 1));
}
return retryExhausted();
```

잠그지 않는다. 읽을 때의 `version`이 쓸 때도 그대로면 성공하고, 누가 먼저 바꿨으면 0행이 바뀌니 다시 읽고 재시도한다. 동시에 재시도해서 또 부딪히지 않도록 랜덤 대기도 넣었다.

결과가 가장 나빴다.

- 재시도 약 14,140번
- 30번 한도를 넘긴 440명 실패
- 쿠폰 100장 중 **60장만 발급**
- 약 24초

한 행에 500명이 몰리면 매 라운드에서 한 명만 이기고 나머지는 전부 진다. 진 사람들이 다시 몰려서 또 진다. 다른 날 측정에서는 9,015번 재시도 끝에 모두 성공해서, 실행마다 결과가 크게 흔들렸다.

낙관적 락이 나쁜 방법은 아니다. 게시글 수정이나 설정 저장처럼 **같은 행을 동시에 고칠 일이 드문 데이터**에 맞는다. 선착순처럼 경합이 한 행에 몰리는 곳에는 맞지 않는다.

---

## 4. 원자적 UPDATE — 판단과 증가를 한 문장에

```ts
const affectedRows = await db.$executeRaw`
  UPDATE Coupon
  SET issuedCount = issuedCount + 1
  WHERE id = ${couponId} AND issuedCount < totalQuantity`;

if (affectedRows !== 1) return soldOut();

await db.couponIssue.create({ data: { couponId, userId, strategy: "atomic" } });
```

"남았는지 확인"과 "1 늘리기"를 애플리케이션에서 나누지 않고 MySQL 한 문장에 넘긴다. InnoDB는 이 UPDATE를 처리하는 동안 해당 행을 잠그고 조건을 다시 평가한다. 101번째 요청이 도착하면 `issuedCount < totalQuantity`가 거짓이라 바뀐 행이 0개다. 그걸로 품절을 판단한다.

| 장점         | 이유                                            |
| ------------ | ----------------------------------------------- |
| 정확히 100장 | 확인과 증가 사이에 끼어들 틈이 없음             |
| 가장 빠름    | 애플리케이션 트랜잭션이 커넥션을 오래 쥐지 않음 |
| 재시도 없음  | 실패는 곧 품절                                  |
| 코드가 짧음  | 네 방법 중 가장 짧음                            |

다만 한계도 있다.

**한 문장에 담기는 규칙만 된다.** "1인 1매", "VIP는 2매", "다른 쿠폰과 중복 불가" 같은 규칙이 붙으면 조건부 UPDATE 하나로 표현하기 어렵다. 그때는 `CouponIssue(couponId, userId)` unique 제약을 더하거나, 비관적 락 트랜잭션으로 돌아가야 한다.

**카운터 증가와 발급 행 INSERT가 별개의 문장이다.** 지금 코드는 UPDATE가 성공한 뒤 INSERT를 따로 실행한다. 그 사이에 프로세스가 죽거나 INSERT가 실패하면, 카운터는 올라갔는데 발급 행은 없는 상태가 된다. 실서비스라면 두 문장을 같은 트랜잭션에 넣거나, 카운터와 실제 행 수를 주기적으로 맞춰 보는 대사가 필요하다. 이 실험은 동시성 비교가 목적이라 그 부분은 단순하게 두었다.

---

## 고른 것과 포기한 것

| 방법          | 판단                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| 원자적 UPDATE | **선택.** 재고 차감처럼 규칙이 "남았으면 1 감소" 하나일 때 가장 단순하고 빠름 |
| 비관적 락     | 정확하지만 커넥션 풀 대기가 길어짐. 규칙이 복잡할 때의 대안                   |
| 낙관적 락     | 고경합에서 실패와 지연이 큼. 충돌이 드문 데이터용                             |
| 대책 없음     | 초과 발급과 lost update                                                       |

프론트에서 버튼을 `disabled`로 막는 건 한 사람의 연타만 줄인다. 500명이 각자 한 번씩 누르는 상황은 서버와 DB가 막아야 한다. 이번 실험에서 배운 건 세 가지다.

1. **카운터를 믿지 말고 실제 행 수로 검증한다.** 대책 없는 방식은 카운터 1, 실제 500이었다.
2. **락 비용의 대부분은 락이 아니라 커넥션 풀 대기일 수 있다.** 재 보기 전까지는 반대로 생각했다.
3. **낙관적 락은 경합이 낮을 때의 도구다.** 같은 행에 몰리면 재시도 폭풍이 난다.

다음 글은 2장 손목밴드다. 로그인이 만료된 순간 요청 5개가 동시에 refresh를 보내면 왜 로그인이 통째로 끊기는지 다룬다.

---

## 참고

- [버튼 하나 뒤에서 — 1장 티켓팅](https://backend-visualized.vercel.app/ticketing)
- 저장소 `apps/api/src/coupons/lib/coupon-strategies.ts` — 네 가지 발급 전략
- 저장소 `docs/benchmarks/ticketing-coupon.md` — 환경, 재현 명령, 측정 결과
- [MySQL 8.4 — Locking Reads (`SELECT ... FOR UPDATE`)](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html)
