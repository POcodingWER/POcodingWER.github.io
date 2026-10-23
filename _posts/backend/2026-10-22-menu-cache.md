---
layout: post
title: "[BACKEND] 메뉴판은 5초만 믿는다 — 캐시가 비는 순간과 메뉴가 바뀌는 순간"

subtitle: "손님 1,000명의 DB 조회를 1번으로. 대신 고친 메뉴는 DEL로 바로 지운다"

date: 2026-10-22 11:06:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/05/architecture_comparison.webp"

categories:
  - BACKEND

tags:
  - Redis
  - cache-aside
  - cache stampede
  - 분산 락
  - MySQL
  - Prisma
  - NestJS
  - backend-visualized
---

{% include post/backend_contents.md %}

> 같은 메뉴를 손님 1,000명이 물으면 데이터베이스도 1,000번 읽는다. 메뉴는 자주 안 바뀌니 잠깐 기억해 두면 된다. 그 기억이 남는 시간만큼 손님은 옛 메뉴를 보고, 기억이 사라지는 순간에는 1,000명이 다시 데이터베이스로 몰린다. [버튼 하나 뒤에서](https://bv.chuckplay.dev/cache) 6장은 그 두 순간을 Redis와 MySQL로 나눠 다룬다.

이전 글: [[BACKEND] 결제 버튼을 잠가도 두 번 빠진다](/backend/2026/10/22/idempotent-payment/)

---

## 읽을 때는 캐시를 먼저 본다

cache-aside다. 요청마다 Redis를 보고, 없으면 MySQL에서 읽어 5초짜리로 넣는다.

```text
GET bv:menu:board
  ├─ 있음 → 그 JSON을 반환
  └─ 없음 → SELECT MenuBoard
             SET EX 5
```

손님 1,000명이 매번 데이터베이스로 가면 조회 1,000번, 63ms였다. 캐시를 먼저 채운 뒤 같은 1,000명이 읽으면 데이터베이스는 1번, 23ms였다. 메뉴 원본은 MySQL `MenuBoard` 행이고, Redis 값은 그 행을 JSON으로 베낀 것이다. Redis가 죽거나 만료돼도 원본은 남아 있다.

5초는 일부러 짧게 잡았다. 데모에서 만료와 갱신이 보이게 하려는 값이지, 운영 메뉴의 정답은 아니다.

---

## 고치면 남은 시간을 기다리지 않는다

TTL만 믿으면 메뉴를 고쳐도 캐시에 남은 시간만큼 옛 메뉴가 보인다. 측정에서는 새 메뉴가 보이기까지 5.2초였다. 남은 TTL이다.

그래서 수정 요청은 UPDATE 다음에 그 키를 지운다.

```ts
await prisma.menuBoard.update({ where: { name }, data: { content, version } });
if (invalidate) await redis.del(cacheKey);
```

다음 읽기는 miss가 되고, 방금 고친 행을 다시 읽어 캐시를 채운다. 새 메뉴가 보이기까지 걸린 시간은 5.2초에서 0초가 됐다. 캐시를 고친 값으로 덮어쓰지 않고 지운 이유는, 쓰는 쪽이 캐시 모양을 다시 만들 필요가 없기 때문이다. 채우는 일은 읽는 경로 하나에만 있다.

지우는 것을 빼먹으면 TTL이 상한이다. 메뉴처럼 "바뀌면 바로 보여야 하는" 데이터는 만료만으로 부족하다.

---

## 캐시가 비는 순간 1,000명이 같이 내려간다

만료되거나 DEL된 직후 손님 1,000명이 동시에 읽으면, 전원이 miss를 보고 전원이 SELECT를 한다. 캐시가 있으려고 만든 경로가, 비는 순간에 데이터베이스 부하가 된다. 이게 cache stampede다.

대책이 없으면 데이터베이스 조회 1,000번, 96ms였다.

프로세스 안 single-flight는 진행 중인 "DB에서 읽어 캐시에 넣기" Promise를 그 프로세스 안에서만 공유한다. 서버 한 대에서는 가장 빨랐다. 10ms, 데이터베이스는 한 번이다. 서버 3대를 한 프로세스에서 흉내 내자 조회가 3번이 됐다. 인스턴스마다 자기 비행만 알기 때문이다. 서버가 늘수록 데이터베이스도 는다.

그래서 잠금은 Redis에 둔다. 캐시가 없으면 `SET lock NX PX 2000`을 시도한다. NX는 키가 없을 때만 성공하고, PX 2000은 잡은 사람이 죽어도 2초 뒤 잠금이 풀린다는 뜻이다.

```text
캐시 miss
  → SET lock NX PX 2000
       ├─ 성공한 한 명만 SELECT 후 SET EX 5, 끝나면 잠금 삭제
       └─ 진 사람들은 20ms마다 GET
            ├─ 생기면 그 값을 받음
            └─ 1초가 넘으면 DB에서 직접 읽음 (캐시는 채우지 않음)
```

잠금을 지울 때는 내가 넣은 토큰일 때만 DEL한다. Lua로 GET과 DEL을 한 번에 비교한다. 2초가 지나 다른 요청이 잠금을 새로 잡았는데, 늦잠 잔 주인이 그 잠금을 지우면 두 명이 동시에 데이터베이스로 간다.

```lua
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
else
  return 0
end
```

이 대책의 비용은 Redis 조회가 늘어나는 것이다. 기다리는 손님이 다시 GET하므로 명령이 1,999번, 전체 45ms였다. 데이터베이스는 서버 수와 상관없이 1번이다. 메뉴 읽기에서 보호할 대상이 데이터베이스라 이 비용을 택했다.

1초를 넘기면 기다리다 지치고 데이터베이스를 직접 읽는다. 그 경로는 캐시를 채우지 않는다. 잠금 주인이 아직 채우는 중일 수 있어서, 빈 값이나 옛 시도로 덮지 않기 위해서다.

---

## 측정이 거짓말을 한 자리

Prisma `findUnique`는 같은 틱에 들어온 같은 행 조회를 한 쿼리로 묶는다. 코드가 1,000번 호출해도 MySQL에는 1번만 도착할 수 있다. "DB 1,000번"이 숫자로는 1번이라, 스탬피드가 없어 보였다.

조회를 `findFirst`로 바꾸고 MySQL `Com_select`가 얼마나 늘었는지로 다시 세자 약 1,000개였다. 캐시 실험은 애플리케이션 카운터만 보면 안 되고, 데이터베이스가 실제로 받은 쿼리로 확인해야 한다.

빈 데이터베이스에서 첫 손님 1,000명이 동시에 메뉴 행을 만들 때도 비슷한 경쟁이 났다. `name` unique 때문에 한 명만 INSERT에 성공하고 나머지는 `P2002`로 500이 됐다. upsert도 이 경쟁에서는 같은 오류를 낸다. 충돌하면 예외를 삼키지 않고, 먼저 만든 행을 다시 읽도록 바꿨다.

---

## 이 장에서 가져온 것

1. 캐시는 원본의 복사본이다. 읽는 경로는 GET 다음 SELECT, 수명은 5초.
2. 바뀌면 DEL한다. TTL은 지우기를 깜빡했을 때의 상한이지, 갱신 방법이 아니다.
3. 비는 순간을 프로세스 안에서만 묶으면 서버 대수만큼 데이터베이스가 간다. 잠금은 Redis에 두고, 지울 때는 내 토큰만 지운다.
4. ORM이 조회를 묶어 주면 측정이 조용해진다. 그때는 데이터베이스의 쿼리 카운터를 본다.

다음은 [배포](/backend/2026/10/22/blue-green-deploy/)다. 화면은 Vercel에 두고 API만 EC2에서 blue/green으로 바꾸는 이유, 배포 중에 실패한 요청이 0번이었던 측정을 본다.

---

## 참고

- [버튼 하나 뒤에서 — 6장 맛집 메뉴판](https://bv.chuckplay.dev/cache)
- 저장소 `apps/api/src/cache-demo/cache-demo.service.ts`
- 저장소 `docs/decisions.md` 6장
- [Redis — SET NX, PX](https://redis.io/docs/latest/commands/set/)
- [Prisma — Query batching](https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance)
