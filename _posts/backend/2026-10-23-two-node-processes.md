---
layout: post
title: "[BACKEND] API를 두 개 켜도 처리량은 그대로였다"

subtitle: "620에서 640 req/s. 대신 800 VU의 p95가 10초에서 1.9초로 줄고 시간 초과는 0이 됐다"

date: 2026-10-23 11:00:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/05/architecture_comparison.webp"

categories:
  - BACKEND

tags:
  - 스케일아웃
  - Caddy
  - least_conn
  - Node.js
  - Redis
  - blue-green
  - k6
  - backend-visualized
---

{% include post/backend_contents.md %}

> 앞 글의 부하 테스트는 처리량이 약 620 req/s에서 멈추고, API CPU만 코어 하나(100~120%)를 쓰고 있었다. 박스는 2코어다. 그래서 색마다 API를 두 개 띄우고 Caddy가 나누게 했다. 2026-10-22에 같은 스크립트로 다시 재자, 초당 처리 건수는 거의 그대로이고 기다리던 시간이 줄었다.

이전 글: [[BACKEND] 서버에서 이미지를 굽지 않는다](/backend/2026/10/22/blue-green-deploy/)

---

## 무엇을 늘렸나

인스턴스를 키우지 않았다. `t4g.small` 한 대 안에서 blue와 green이 각각 컨테이너 두 개를 가진다. 평소에는 한 색의 둘만 떠 있다.

```text
인터넷 → Caddy :443
           reverse_proxy api_blue_1:4000 api_blue_2:4000
           lb_policy least_conn
           health_uri /health   (30초, 실패하면 그 업스트림을 뺌)
```

`least_conn`은 진행 중인 요청이 적은 쪽으로 보낸다. 라운드 로빈은 느린 쪽에도 같은 수로 넣는다. 응답 헤더 `x-instance-id`에 `INSTANCE_NAME`을 실어, 어느 컨테이너가 받았는지 화면에서 본다. 컨테이너 ID는 넣지 않는다.

배포 규칙은 그대로다. 쉬던 색의 둘을 같이 켜고, Caddy 안에서 둘 다 `/health`가 200일 때만 upstream을 바꾼다. 하나라도 실패하면 둘 다 끄고 예전 색이 계속 받는다. 마이그레이션은 `_1`만 실행한다. `_2`는 `RUN_MIGRATIONS=false`다. 스키마는 추가를 먼저 하는 순서라, `_2`가 먼저 떠도 옛 코드와 새 코드가 같은 테이블을 볼 수 있다.

Node `cluster`로 컨테이너 하나 안에서 코어 두 개를 쓰는 방법은 쓰지 않았다. 프로세스가 죽어도 Caddy가 그 업스트림만 빼게 하려면 컨테이너가 나뉘어 있어야 한다.

---

## 다시 잰 숫자

조건은 이전과 같다. 맥 한 대에서 k6, 읽기만 (`/health`, `/events/stats`), 10에서 800 VU. VU는 0.05초마다 보내므로 사람 수가 아니다.

| VU | API 1개 p95 | API 2개 처리량 | API 2개 p95 | API 2개 실패 |
| ---: | --- | ---: | --- | --- |
| 50 | 약 0.12초 | 약 533 req/s | 130ms | 0 |
| 100 | 약 0.46초 | 약 621 req/s | 227ms | 0 |
| 200 | 약 1.3초 | 약 641 req/s | 476ms | 0 |
| 400 | 약 3.1초 | 약 651 req/s | 953ms | 0 |
| 800 | 7~10초 | 약 639 req/s | **1.88초** | **0** (1개일 때 4~6%) |

전체는 12분, 395,841 요청, 평균 550 req/s, 실패 0%, p95 1.4초, p99 1.85초, 최대 3.6초다. 재시작은 없었다. 메모리는 최고 1133MB, 가용은 최저 703MB였다.

처리량의 천장은 약 620에서 약 640이다. 늘리려고 켠 것치고 초당 건수는 그대로다. 준 것은 꼬리다. 800 VU에서 10초 넘김이 사라졌다.

중앙값은 오히려 늘었다. 800 VU에서 190~350ms가 1.18초가 됐다. 추정으로는, 1개일 때 늦은 요청이 10초 초과로 집계에서 빠져 나머지가 빨라 보였고, 2개일 때는 실패 없이 모두가 조금 기다린 결과다. 따로 확인하지는 않았다. 평균만 보면 나빠진 것처럼 읽힐 수 있는 숫자다.

---

## 코어가 빈 게 아니었다

정점 구간의 `docker stats`다. 100%는 코어 하나다.

| 컨테이너 | CPU |
| --- | --- |
| api_blue_1 | 약 50~65% |
| api_blue_2 | 약 45~60%, 가끔 75~90% |
| caddy | 약 35~50% |
| mysql | 약 25~40% |
| redis | 1% 아래 |

합이 측정마다 약 175~190%라 2코어(200%)가 거의 차 있다. API 하나는 반 코어 정도만 쓰고, 나머지는 TLS와 프록시인 Caddy, 그리고 `/events/stats`의 `COUNT`와 `GROUP BY`인 MySQL이 가져간다. 같은 상자에서 API를 세 개로 늘려도 그 몫을 더 받을 자리가 없다.

다음 손잡이는 API 개수가 아니다. `/events/stats`를 짧게 캐시해 MySQL 몫을 줄이거나, Caddy와 DB를 다른 머신으로 빼거나, 인스턴스를 키우는 쪽이다. 통계 캐시는 아직 없다.

---

## 프로세스가 둘이면 메모리 잠금은 잠금이 아니다

한 프로세스만 있을 때 "진행 중인 작업은 이 변수에 있다"고 둔 코드가 둘 사이에서는 서로 안 보인다. 처음에는 세 군데로 세었는데 네 군데였다.

| 상태 | 프로세스 안에 두면 | 한 일 |
| --- | --- | --- |
| 5분 집계 cron | 두 API가 같은 분을 두 번 집계 | 5분 칸마다 Redis `SET NX PX`. 잡은 쪽만 실행 |
| 쿠폰·포인트 시뮬레이션 "한 번에 하나" | 상자 전체 제한이 아니라 프로세스당 하나 | Redis 잠금으로 이동 |
| SSE "방금 저장됨" | 배치를 받은 API의 Subject만 앎. 다른 API에 붙은 브라우저는 조용함 | Redis `PUBLISH` / `SUBSCRIBE` (`bv:events:ingested`) |
| 결제 `processing` 정리 | 두 cron이 같이 돌아도 됨 | 조건부 UPDATE라 한 행은 한 번만 바뀜. 그대로 둠 |

SSE는 구독 연결이 다른 명령을 못 해서, publish에 쓰는 연결과 subscriber를 `duplicate()`로 나눈다. Redis에 못 보내면 그 프로세스 안에서만 알린다. 예전 동작으로 떨어진다.

IP당 요청 한도는 아직 프로세스마다 따로 센다. 사실상 한도가 두 배가 됐다. 요청마다 Redis를 한 번 더 가는 비용보다, 데모 한도가 두 배가 되는 쪽이 작다고 보고 남겼다. 운영에서 "IP당 정확히 N"이 필요하면 이 카운터도 Redis로 가야 한다.

---

## 이 측정에서 가져온 것

1. 이벤트 루프가 하나라 막힌 문제는 프로세스를 하나 더 두면 풀린다. 그 프로세스가 같은 상자의 다른 코어를 실제로 받을 때만 그렇다.
2. 처리량이 그대로여도 꼬리 지연과 시간 초과는 줄어들 수 있다. 이번 변경의 결과는 초당 건수가 아니라 p95와 실패율이다.
3. 복제 전에 프로세스 메모리에만 있는 잠금, 알림, cron을 찾아야 한다. 조건부 UPDATE로 이미 안전한 것은 옮기지 않아도 된다.
4. 다음 천장은 API가 아니라, TLS와 집계 쿼리가 남은 코어를 쓰고 있다는 점이었다.

도메인을 붙여 쿠키를 `Lax`로 바꾼 기록은 [도메인을 사자 쿠키가 Lax로 충분해졌다](/backend/2026/10/23/same-site-cookie/)에 있다.

---

## 참고

- [버튼 하나 뒤에서 — 7장 스케일아웃](https://bv.chuckplay.dev/scale-out)
- 저장소 `docs/deploy.md` 7-4, 7-5
- 저장소 `deploy/deploy.sh` — `least_conn`, 두 인스턴스 모두 200일 때만 전환
- 저장소 `apps/api/src/events/lib/event-bus.ts`
- [Caddy — reverse_proxy, lb_policy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy#load-balancing)
