---
layout: post
title: "[BACKEND] 잔액만 고치면 포인트가 사라진다 — 통장 내역이 근거인 이유"

subtitle: "적립·사용 200건이 동시에 몰리자 10,100P가 증발했다. 내역 합계와 비교하니 개수가 보였다"

date: 2026-10-22 11:04:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/05/architecture_comparison.webp"

categories:
  - BACKEND

tags:
  - 원장
  - 동시성
  - Lost Update
  - SELECT FOR UPDATE
  - 대사
  - MySQL
  - Prisma
  - NestJS
  - backend-visualized
---

{% include post/backend_contents.md %}

> 포인트 잔액은 숫자 하나처럼 보인다. 읽고, 더하고, 그 결과를 다시 쓰면 된다. 그 세 단계 사이에 다른 요청이 끼어들면 먼저 더한 값은 사라진다. [버튼 하나 뒤에서](https://backend-visualized.vercel.app/ledger) 4장은 잔액 칸만 고치는 방식과, 내역을 남기고 잔액을 그 내역에 맞추는 방식을 같은 지갑에 200건씩 넣어 비교했다.

이전 글: [[BACKEND] 클릭 1만 건](/backend/2026/10/22/delivery-batching/)

---

## 실험

시작 잔액은 5,000P다. 요청 200개가 동시에 들어온다. 네 번 중 세 번은 +100P, 한 번은 −100P라서 적립 150건, 사용 50건이다.

```text
기대 잔액 = 5,000 + 150×100 − 50×100 = 15,000P
```

시작 잔액이 충분해서, 정상적으로 직렬화되면 거절되는 요청은 없다. 끝난 뒤 잔액 칸과 내역 합계를 비교한다. 둘의 차이가 사라진 포인트다.

| 방식                      | 잔액 칸 | 내역 합계 | 사라진 포인트 |   시간 |
| ------------------------- | ------: | --------: | ------------: | -----: |
| 읽고 덮어쓰기             |  4,900P |   15,000P |   **10,100P** | 0.11초 |
| 통장 (잠금 + 내역 + 증가) | 15,000P |   15,000P |            0P | 0.26초 |

다른 실행에서는 덮어쓰기로 사라진 양이 9,900P였다. 재현이 매번 같지 않다.

---

## 덮어쓰기는 마지막에 쓴 사람이 이긴다

```ts
const wallet = await prisma.pointWallet.findUniqueOrThrow({ where: { name } });
if (wallet.balance + amount < 0) return rejected();

await prisma.pointEntry.create({ data: { walletName: name, amount, reason } });
await prisma.pointWallet.update({
  where: { name },
  data: { balance: wallet.balance + amount },
});
```

잔액을 읽고, 메모리에서 더한 뒤, 그 계산 결과를 잔액 칸에 그대로 넣는다. 1장의 쿠폰 카운터와 같은 lost update다.

```text
A가 5,000을 읽음
B도 5,000을 읽음
A가 5,100을 씀
B가 5,100이 아니라 5,000+100=5,100을 다시 씀
→ A의 +100은 잔액에서 사라짐
```

200건이 각자 자기가 읽은 값으로 덮어쓰면, 중간에 반영된 적립과 사용이 잔액에 남지 않는다. 이번 측정에서는 15,000P가 되어야 할 잔액이 4,900P로 끝났다.

중요한 점은 이 방식도 내역 행은 남겼다는 것이다. 그래서 사후에 이렇게 말할 수 있다.

```text
내역 합계 15,000P
잔액 칸    4,900P
차이      10,100P
```

내역이 없었다면 잔액 4,900P는 그냥 현재 잔액이다. 얼마가 사라졌는지, 사라졌는지조차 모른다. 동시성 버그는 실행마다 양이 달라서, 테스트를 한 번 통과했다고 없는 버그가 아니다. 잔액과 내역 합계를 비교하는 대사가 실패를 숫자로 고정한다.

```ts
const entriesSum = sum._sum.amount ?? 0;
return {
  balance: wallet.balance,
  entriesSum,
  difference: wallet.balance - entriesSum,
};
```

차이가 0이 아니면 장부가 틀린 것이다. 잔액 칸만 믿는 시스템에는 이 비교 자체가 없다.

---

## 통장 방식은 한 행을 잠그고 증가만 한다

```ts
await prisma.$transaction(async (tx) => {
  const [wallet] = await tx.$queryRaw`
    SELECT balance FROM PointWallet WHERE name = ${name} FOR UPDATE`;

  if (Number(wallet.balance) + amount < 0) return rejected();

  await tx.pointEntry.create({ data: { walletName: name, amount, reason } });
  await tx.pointWallet.update({
    where: { name },
    data: { balance: { increment: amount } },
  });
});
```

세 가지가 한 트랜잭션 안에 있다.

1. `SELECT ... FOR UPDATE`로 그 지갑 행을 잠근다. 다른 요청은 이 트랜잭션이 끝날 때까지 같은 행을 읽지 못한다.
2. 잠근 뒤에 0 미만인지 본다. 잔액보다 큰 사용은 내역을 남기지 않고 거절한다.
3. 내역을 추가하고, 잔액은 읽은 값을 덮어쓰지 않고 `balance + amount`로 증가시킨다.

측정에서는 잔액 15,000P와 내역 합계 15,000P가 같았다. 끝난 뒤 15,100P를 쓰려는 요청은 거절됐다. 잠금 안에서 잔액을 다시 읽기 때문에, 그 사이에 잔액이 바뀐 상태를 보고 판단한다.

대가는 속도다. 0.11초가 0.26초가 됐다. 지갑 한 행을 잠그므로 한 사람에게 요청이 몰리면 줄이 길어진다. 1장에서 본 것처럼 그 줄은 커넥션을 붙잡고 선다. 포인트처럼 사용자마다 지갑이 나뉘어 있으면 서로 다른 행이라 영향이 작고, 한 지갑에 몰리는 이벤트성 적립이면 비관적 락의 줄이 그대로 드러난다.

---

## 잔액 칸은 필수가 아니다

통장 방식을 골랐지만, 잔액 칸을 잠그는 것만이 방법은 아니다.

| 방법                                      | 맞는 곳                             | 비용                      |
| ----------------------------------------- | ----------------------------------- | ------------------------- |
| 잔액 칸을 덮어쓰기                        | 없음. 이번 실험에서 포인트가 사라짐 | 가장 빠름                 |
| 잠금 후 내역 추가 + `increment`           | 지갑 단위 경합이 크지 않을 때       | 한 행에 줄이 섬           |
| 잔액은 저장하지 않고 `SUM(amount)`만 사용 | 내역이 진실이어야 할 때             | 내역이 길면 합계가 느려짐 |
| 잔액 칸은 캐시, 주기적으로 합계와 대사    | 읽기가 많고 잠시 어긋남을 감수할 때 | 대사 주기가 오차의 상한   |

원장(`PointEntry`)은 추가만 한다. 적립 행을 나중에 수정하지 않는다. 잘못 적립했으면 반대 부호 행을 하나 더 넣는다. 그러면 합계를 다시 계산해도 과거가 지워지지 않는다.

잔액 칸은 그 합계를 빨리 보여 주려고 적어 둔 결과다. 결과가 근거와 다르면 근거를 따른다. 이번 실험에서 근거가 없었던 것은 아니다. 덮어쓰기 방식도 내역은 남겼고, 그래서 10,100P가 사라진 사실을 셀 수 있었다. 없는 것은 잔액을 그 근거에 맞추는 쓰기와, 어긋남을 실패로 보는 검사였다.

---

## 이 장에서 가져온 것

1. `balance = 읽은 값 + amount`는 동시에 쓰면 먼저 쓴 금액을 지운다.
2. 사라진 양은 실행마다 달라진다. 9,900P일 수도 있고 10,100P일 수도 있다. 한 번의 성공으로 동시성 테스트를 통과시키면 안 된다.
3. 내역이 있어야 "합계 15,000인데 잔액 4,900"이라고 말할 수 있다. 내역이 없으면 4,900이 맞아 보인다.
4. 잠금과 `increment`는 그 어긋남을 쓰기 시점에 막는다. 대신 한 지갑에 몰리면 느려진다.

다음은 5장 결제다. 버튼을 잠가도 한 번만 눌러도 두 번 결제되는 이유와, 같은 시도에 같은 번호표를 붙이면 왜 한 번만 결제되는지를 본다.

---

## 참고

- [버튼 하나 뒤에서 — 4장 포인트 통장](https://backend-visualized.vercel.app/ledger)
- 저장소 `apps/api/src/points/points.service.ts`
- 저장소 `docs/decisions.md` 4장
- [MySQL 8.4 — Locking Reads (`SELECT ... FOR UPDATE`)](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html)
