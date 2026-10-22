---
layout: post
title: "[BACKEND] 서버에서 이미지를 굽지 않는다 — blue/green으로 배포 중 실패 0번"

subtitle: "GHCR에 올리고, SSM으로 쉬던 색을 띄운 뒤 /health가 200일 때만 Caddy를 돌린다"

date: 2026-10-22 11:07:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/05/architecture_comparison.webp"

categories:
  - BACKEND

tags:
  - blue-green
  - Docker
  - Caddy
  - GitHub Actions
  - OIDC
  - SSM
  - MySQL
  - k6
  - EC2
  - backend-visualized
---

{% include post/backend_contents.md %}

> 화면은 Vercel이 `main`을 받으면 끝이다. API는 그렇게 바꾸면 안 된다. MySQL과 Redis가 EC2 안에 있고, 이미지를 그 서버에서 굽는 동안 2GB 메모리가 빌드와 서비스를 같이 감당해야 한다. [버튼 하나 뒤에서](https://backend-visualized.vercel.app/deploy)의 배포 기록은, 빌드를 GitHub Actions로 옮기고 서버는 받기만 한 뒤의 숫자다.

이전 글: [[BACKEND] 메뉴판은 5초만 믿는다](/backend/2026/10/22/menu-cache/)

---

## 누가 어디에 있나

|          | 화면    | API                                             |
| -------- | ------- | ----------------------------------------------- |
| 배포     | Vercel  | EC2 `t4g.small`, Ubuntu 24.04, ARM              |
| 프로세스 | Next.js | NestJS 컨테이너 하나 (blue 또는 green)          |
| 앞단     | Vercel  | Caddy. 80/443만 공개, Let's Encrypt             |
| 데이터   | 없음    | 같은 EC2의 MySQL 8.4, Redis 7.4. 포트는 안 연다 |

4000번과 3306번을 보안 그룹에 넣지 않는다. API는 Caddy를 통해서만 들어오고, 클라이언트 IP는 `X-Forwarded-For`의 마지막 한 홉만 믿는다. MySQL은 데모라 RDS 대신 같은 머신의 컨테이너다. EC2가 죽으면 DB도 같이 죽는다. 그 선택을 백업으로 보완한다.

---

## 배포는 받는 일이다

예전에는 서버가 이미지를 직접 빌드했다. 서버 배포 job이 135초였고, 그 동안 2GB 박스가 빌드와 API를 같이 돌렸다. 지금은 GitHub의 ARM 러너가 `linux/arm64` 이미지를 구워 GHCR에 올린다. 서버는 `docker pull`만 한다.

```text
git push main
  → CI 성공
  → Actions가 GHCR에 SHA 태그로 push
  → OIDC로 1시간짜리 AWS 역할
  → SSM으로 EC2에 deploy.sh <SHA> 전달
  → 쉬던 색에 새 컨테이너
  → Caddy 안에서 /health 200
  → upstream만 바꾸고 caddy reload
  → 10초 뒤 예전 색 정지
```

| 경우                 | 워크플로 전체 | 서버 배포 job |
| -------------------- | ------------: | ------------: |
| 서버에서 직접 빌드   |      2분 18초 |         135초 |
| API 코드 변경 없음   |   약 1분 12초 |       37~39초 |
| API 코드를 다시 굽기 |      2분 23초 |          51초 |

API가 바뀌면 전체 시간은 비슷하다. 달라진 것은 서버가 하는 일이다. 135초가 37~51초가 됐고, 그동안 서비스는 예전 색이 계속 받는다.

SSH로 배포하지 않는다. Actions 러너 IP는 매번 바뀌므로 22번을 열려면 세상에 열어야 하고, 배포 키를 GitHub Secret에 넣어야 한다. SSM은 EC2의 에이전트가 AWS로 나가는 연결만 쓴다. 인바운드 포트는 그대로다. OIDC라 장기 Access Key도 GitHub에 없다. 이미지 pull은 패키지가 public이라 서버에 GitHub 토큰을 두지 않는다.

---

## 문을 돌리기 전에 건강을 본다

평소에는 blue만 떠 있다. 배포는 green에 새 이미지를 올리고, Caddy는 아직 blue를 본다. green이 뜨면서 `prisma migrate deploy`를 한 번 실행한다. Caddy 컨테이너 안에서 `wget http://api_green:4000/health`가 200이 될 때까지 최대 2분을 기다린다. 컨테이너가 죽으면 거기서 멈춘다.

200이 아니면 `upstream.caddy`를 바꾸지 않고 green을 끈다. blue가 계속 서비스한다. 마이그레이션 실패나 환경 변수 오류가 사용자를 새 버전으로 보내지 않는다.

200이면 upstream 파일을 한 번에 갈아끼우고 `caddy reload`만 한다. 리스너를 내리지 않는다. 예전 색에 남아 있는 요청이 끝나도록 10초를 기다린 뒤 blue를 끈다. 두 색이 같이 떠 있는 건 그 잠깐이다. 배포 3번 동안 0.2초마다 찌른 요청이 862, 705, 565번이었고 200이 아닌 응답은 0번이었다. 그때 메모리는 최고 869MiB / 1836MiB였다.

오래 열린 SSE는 전환 때 한 번 끊긴다. 브라우저는 다시 연결한다. MySQL과 Redis는 `--no-deps`라 이 교체에서 재시작하지 않는다.

스키마는 이 순서 때문에 한 번에 깨면 안 된다. 전환 직전까지 예전 프로세스가 새 스키마 위에서 돈다.

```text
1. 컬럼을 더한다 (nullable 또는 기본값)
2. 새 코드가 그 컬럼을 쓰게 하고 배포
3. 아무도 안 쓰면 그때 삭제
```

Prisma 마이그레이션은 앞으로만 간다. 롤백은 예전 이미지로 색을 다시 바꾸는 것이지, DB를 되돌리는 것이 아니다. 그래서 삭제보다 추가가 먼저다.

---

## 백업은 떠 두고 끝이 아니다

DB가 EC2 디스크에 있으므로 그 디스크가 망가지면 데이터도 없다. 매일 04:00 KST에 `mysqldump --single-transaction`으로 한 시점의 스냅샷을 뜬다. InnoDB라 테이블을 잠그지 않아 API는 백업 중에도 받는다. gzip은 우선순위를 낮춰 2GB 서버의 요청과 I/O를 다투지 않게 한다. 당시 DB는 0.5MB, 덤프는 약 0.4초, 메모리 28MB였다.

파일은 `.partial`로 쓰다가 `gzip -t`와 마지막 줄 `-- Dump completed`를 확인한 뒤에만 이름을 바꾼다. 반쯤 쓴 파일을 백업으로 세지 않기 위해서다. 서버에는 7일, S3 현재 버전은 30일 뒤 만료다. S3 권한은 쓰기만 있다. 서버가 털려도 백업을 읽거나 지우지는 못한다.

복원 테스트는 운영 DB를 건드리지 않는다. 최신 덤프를 `backend_visualized_restore_test`에 넣고 테이블별 `COUNT(*)`를 비교한 뒤 그 DB를 지운다. 백업 직후가 아니면 데모 쓰기가 달라 불일치가 날 수 있다. 그 불일치는 실패가 아니라 "백업 이후 쓰기가 있었다"는 신호다.

덤프에는 비밀번호 해시와 리프레시 토큰 기록이 들어 있다. 권한 600이고 git에 올리지 않는다.

---

## 부하를 올리면 먼저 막히는 것

맥에서 k6로 읽기만 12분 동안 올렸다. `/health`와 `/events/stats`. 10에서 800 VU까지. 389,658 요청, 평균 541 req/s, 실패 0.89%, 중앙값 86ms, p95 2.64초, p99 7.22초. 끝난 뒤 재시작 0번, OOM 없음, MySQL `Max_used_connections` 14, Redis `rejected_connections` 0이었다.

|  VU | 대략의 처리량 | p95       | 실패                 |
| --: | ------------: | --------- | -------------------- |
|  50 | 530~545 req/s | 약 0.12초 | 0                    |
| 100 | 600~620 req/s | 약 0.46초 | 0                    |
| 800 | 645~655 req/s | 7~10초    | 4~6%, 전부 10초 초과 |

처리량은 100 VU 근처 약 620 req/s에서 멈추고, 그 다음부터는 대기만 늘었다. API CPU는 100~120%였다. 2코어라 상한은 200%다. Node는 요청을 이벤트 루프 하나에서 처리해서, 코어 하나가 차면 나머지는 줄을 선다. 메모리와 DB, Redis에는 여유가 있었다.

그래서 "동시 사용자 몇 명"으로 옮기면 안 되는 숫자다. 읽기 전용이고, 맥 한 대에서 보낸 것이고, 한도는 429가 먼저 나오지 않게 빼 둔 경로다. 다음에 할 일은 복제본으로 코어를 둘 다 쓰는 쪽이지, 인스턴스를 키우는 쪽이 이 곡선의 다음 칸은 아니다. 프로세스 메모리에만 있는 동시 실행 제한과 SSE는 복제하면 Redis로 옮겨야 한다.

---

## 이 배포에서 가져온 것

1. 작은 서버에서는 빌드와 서비스를 같은 메모리에 두지 않는다. 이미지는 밖에서 굽고 서버는 받는다.
2. 새 프로세스를 먼저 띄우고, `/health`가 200일 때만 문을 돌린다. 실패하면 예전 색이 그대로다.
3. 배포 중 스키마 삭제는 예전 프로세스를 깨뜨린다. 추가는 먼저, 삭제는 다음 배포에.
4. 같은 EC2의 MySQL은 싸고, 디스크와 운명을 같이한다. 덤프를 뜨는 것보다 그 덤프가 복원되는지를 확인하는 쪽이 백업이다.
5. 이 서버의 첫 천장은 CPU 코어 하나였다. DB가 아니었다.

시리즈의 장면은 여기까지다. 티켓팅부터 캐시까지는 [[BACKEND] 버튼 하나 뒤에서](/backend/2026/10/22/button-behind-architecture/)에 지도가 있다.

---

## 참고

- [버튼 하나 뒤에서 — 배포 및 회고](https://backend-visualized.vercel.app/deploy)
- 저장소 `docs/deploy.md`
- 저장소 `deploy/deploy.sh`
- 저장소 `load/breakpoint.js`
- [GitHub Actions — OpenID Connect](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
- [AWS — SSM Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html)
