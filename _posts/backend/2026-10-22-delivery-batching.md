---
layout: post
title: "[BACKEND] 클릭 1만 건 — 느린 이유는 요청 수가 아니라 커밋 횟수였다"

subtitle: "하나씩 18.7초, 100개씩 묶으면 0.29초. create와 createMany를 같은 MySQL에서 비교"

date: 2026-10-22 11:03:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/05/architecture_comparison.webp"

categories:
  - BACKEND

tags:
  - 배치
  - createMany
  - MySQL
  - Prisma
  - sendBeacon
  - 집계
  - NestJS
  - backend-visualized
---

{% include post/backend_contents.md %}

> 클릭 기록을 남길 때마다 `POST` 한 번, `INSERT` 한 번이 가장 단순하다. 10,000번이면 요청도 10,000번이고 커밋도 10,000번이다. [버튼 하나 뒤에서](https://bv.chuckplay.dev/delivery) 3장은 그 경로와, 100개씩 모아 한 문장으로 넣는 경로를 같은 노트북에서 재 봤다.

이전 글: [[BACKEND] 로그인이 만료된 순간 요청 5개](/backend/2026/10/22/wristband-refresh-token/)

---

## 무엇을 재었나

이벤트 10,000개. 하나는 `{ name, sessionId, properties }`다. 배치는 100개. 동시 요청은 10개까지. 2026-10-19, M1 Pro 한 대에서 클라이언트·API·MySQL 8.4를 같이 돌렸다. 절대 시간보다 같은 조건의 상대 비교다. 실행마다 ±30% 정도 흔들린다.

| 경로                                       |        1회 |        2회 |
| ------------------------------------------ | ---------: | ---------: |
| DB `create` 10,000번, 순차                 |     70.4초 |     75.0초 |
| DB `create` 10,000번, 동시 10              |     20.6초 |     15.2초 |
| DB `createMany` 100개씩, 순차              |     1.21초 |     1.04초 |
| HTTP `POST /events` 10,000번, 동시 10      |     18.7초 |     16.1초 |
| HTTP `POST /events/batch` 100개씩, 순차    |     1.51초 |     1.00초 |
| HTTP `POST /events/batch` 100개씩, 동시 10 | **0.29초** | **0.25초** |

순차로 보면 `createMany`가 `create`보다 58~72배 빠르다. HTTP만 보면 동시 10 기준으로 18.7초가 0.29초가 되어 약 65배다.

---

## 병목은 HTTP가 아니었다

단건 HTTP(동시 10, 18.7초)와 DB에 직접 단건 insert(동시 10, 20.6초·15.2초)가 비슷하다. 요청을 줄여서 얻은 이득만으로는 이 차이가 설명되지 않는다. 커밋 횟수가 같다.

MySQL 기본값은 `innodb_flush_log_at_trx_commit=1`이다. 커밋마다 redo log를 디스크에 내린다. 행 하나를 넣는 일이 디스크 한 번이 된다. 10,000행이면 디스크 동기화가 10,000번이다.

`createMany`는 이것을 한 문장으로 바꾼다.

```ts
const { count } = await prisma.event.createMany({
  data: dtos.map(toRow),
});
```

Prisma가 `INSERT INTO Event (...) VALUES (...), (...), ...` 한 개를 보낸다. 100행이 트랜잭션 하나, 커밋 하나다. 10,000행이면 커밋이 100번이다.

그래서 순서가 이렇게 읽힌다.

```text
하나씩 보내기  요청 10,000  커밋 10,000  18.7초
묶어 보내기    요청 100     커밋 100     0.29초
```

요청이 100분의 1이 된 것과 커밋이 100분의 1이 된 것이 같이 일어났다. DB만 따로 재 보면, HTTP가 빠진 상태에서도 58~72배가 난다. 수집 경로에서 먼저 줄여야 하는 것은 왕복 횟수보다 **커밋 횟수**다.

---

## SDK는 언제 묶음을 보내나

브라우저 SDK는 메모리 큐에 이벤트를 쌓는다. 개수가 차거나, 시간이 차면 `POST /events/batch`로 비운다. SDK 기본값은 20개 또는 5초이고, 서버가 한 번에 받는 상한은 100개다. 데모 화면은 차이를 보여 주려고 10개 또는 10초로 맞춰 두었다.

페이지를 떠날 때는 `fetch`를 기다릴 수 없다. `visibilitychange`가 hidden이 되거나 `pagehide`가 오면 `navigator.sendBeacon`으로 남은 큐를 보낸다. body의 `Content-Type`을 `text/plain`으로 둔다. `application/json`이면 교차 출처에서 preflight가 먼저 나가는데, 페이지가 닫히는 중에는 그 왕복을 기다릴 여유가 없다.

```text
클릭
  → 메모리 큐
       ├─ 개수 또는 시간 도달 → POST /events/batch
       ├─ 페이지 이탈         → sendBeacon (text/plain)
       └─ 5xx, 네트워크 실패  → localStorage에 보관 후 다음 방문에 재전송
```

실패하면 묶음째 localStorage에 넣었다가 `online`이 되거나 다음 로드에서 다시 보낸다. 배치는 한 문장이라 100개 중 1개만 실패하는 상태가 없다. 하나가 잘못되면 100개가 같이 실패하고, SDK는 그 묶음을 통째로 재시도한다. 일부만 성공하는 정교함 대신, 재시도 단위를 묶음으로 고정했다.

입구에는 제한이 있다. IP당 10초에 200요청이다. 배치가 아니면 클릭 몇 초에 이 한도에 닿는다. 배치의 부수 효과는 속도만이 아니라, 같은 한도 안에서 더 많은 이벤트를 통과시킨다는 점이다.

---

## 차트는 원본을 세지 않는다

이벤트가 쌓인 뒤 차트를 열 때마다 `COUNT(*)`를 하면, 수집이 빨라질수록 조회가 느려진다. 그래서 5분마다 어제와 오늘을 다시 집계해 `EventDailyStat`에 덮어쓴다. 차트는 그 표를 읽는다. 원본과 최대 5분 차이가 난다.

날짜 경계는 KST다. `createdAt`은 UTC로 저장되므로, 집계 SQL은 9시간을 더한 뒤 `DATE()`를 취한다.

```sql
INSERT INTO EventDailyStat (date, name, count, uniqueSessions, updatedAt)
SELECT DATE(createdAt + INTERVAL 9 HOUR), name,
       COUNT(*), COUNT(DISTINCT sessionId), UTC_TIMESTAMP(3)
FROM Event
WHERE createdAt >= ? AND createdAt < ?
GROUP BY 1, name
ON DUPLICATE KEY UPDATE count = VALUES(count), ...
```

`2026-10-19T23:30:00Z`는 UTC로는 19일이지만 서울에서는 이미 20일 08:30이다. 자정을 UTC로 자르면 한국 사용자의 하루가 오전 9시에 바뀐다. 오프셋을 상수로 둔 이유는 이 서비스의 하루가 한국 달력이기 때문이다. 서머타임이 없는 UTC+9라 날짜 계산이 고정이다.

집계는 `ON DUPLICATE KEY UPDATE`라 같은 날을 여러 번 돌려도 행이 늘어나지 않는다. 5분 cron이 겹치면 집계가 두 번 돌지 않도록 진행 중 플래그를 둔다.

---

## 포기한 것

| 방법                       | 왜 안 골랐나                                      |
| -------------------------- | ------------------------------------------------- |
| 클릭마다 즉시 저장         | 가장 실시간에 가깝지만 10,000건에 18.7초          |
| 차트를 열 때마다 원본 집계 | 항상 맞지만 원본이 늘수록 느려짐. 5분 지연을 받음 |
| 배치 안에서 행 단위 성공   | 한 문장이라 불가능. 실패는 묶음 단위로 재시도     |

배치 크기별 곡선은 아직 없다. 100과 동시 10만 재 봤다. 디스크와 `innodb_flush_log_at_trx_commit`을 바꾸면 격차도 바뀐다. 이 숫자는 그 기본값에서의 상대 비교다.

---

## 이 장에서 가져온 것

1. 단건 수집의 병목은 HTTP 오버헤드보다 커밋마다 디스크에 쓰는 횟수였다.
2. 배치의 이득은 요청이 줄어든 것과 커밋이 줄어든 것이 겹친 결과다.
3. 떠나는 페이지에서는 `sendBeacon`과 `text/plain`이 왕복을 생략하는 방법이다.
4. 읽기 쪽도 같이 배치해야 한다. 쓰기를 모아 두고 조회 때마다 원본을 세면 병목이 차트로 옮겨 간다.

다음은 4장 포인트 통장이다. 잔액 칸만 고치면 왜 포인트가 사라지고, 내역을 남기면 그 사라진 양을 셀 수 있는지 본다.

---

## 참고

- [버튼 하나 뒤에서 — 3장 묶음배송](https://bv.chuckplay.dev/delivery)
- 저장소 `docs/benchmarks/delivery-batching.md`
- 저장소 `packages/sdk/src/index.ts`
- 저장소 `apps/api/src/events/events.service.ts`
- 저장소 `apps/api/src/events/lib/aggregation.service.ts`
- [MySQL 8.4 — innodb_flush_log_at_trx_commit](https://dev.mysql.com/doc/refman/8.4/en/innodb-parameters.html#sysvar_innodb_flush_log_at_trx_commit)
- [MDN — Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
