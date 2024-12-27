---
layout: post
title: "[AWS] CSR / SSR infura 구성도 흐름도 파악해보고 트렉픽 증가시 어떻게 처리할까?"

subtitle: "infura 구성 흐름 파악중요!"

date: 2024-12-27 13:05:59
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1227/ssr-architecture.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - AWS
tags:
  - AWS
  - CSR Architecture
  - SSR Architecture
  - Cloud Front
  - 클라우드 프론트
  - Lambda@Edge
  - 람다@엣지
  - Edge Locations
  - 엣지 로케이션
  - S3 Bucket
  - 버킷
  - Elastic Beanstalk
  - 엘라스틱 빈스톡
  - Auto Scaling
  - 오토 스케일링
  - pipeline
  - 파이프라인
---

## 배경

> 개발하다 보니 포트 열어서 프론트 돌리는 건 알겠는데, 전체적인 인프라 흐름이 아직 좀 헷갈리더라구요.  
> 시스템이 어떻게 돌아가는지 제대로 이해하는 게 중요할 것 같아요. 특히 인프라 구성이나 트래픽이 늘어날 때 어떻게 대응할지 계획하려면 전체 흐름을 잘 알아야 할 것 같습니다.  
> 그래서 오늘은 각 부분이 어떤 역할을 하는지, 전체 시스템이 어떻게 흘러가는지 한번 살펴보려고 해요!

## 들어가기전 AWS 인프라 용어 정리 / ssr csr 차이점 비교

1. 주요 서비스 약어

   | 약어  | 풀네임                    | 설명                         |
   | ----- | ------------------------- | ---------------------------- |
   | `ALB` | Application Load Balancer | 트래픽 분산 처리 서비스      |
   | `CDN` | Content Delivery Network  | 콘텐츠 전송 네트워크         |
   | `CSR` | Client Side Rendering     | 클라이언트 측 렌더링         |
   | `SSR` | Server Side Rendering     | 서버 측 렌더링               |
   | `EB`  | Elastic Beanstalk         | AWS 애플리케이션 배포 플랫폼 |
   | `EC2` | Elastic Compute Cloud     | 가상 서버 서비스             |
   | `S3`  | Simple Storage Service    | 클라우드 스토리지 서비스     |

2. 아키텍처 관련 용어

   | 용어            | 설명                            |
   | --------------- | ------------------------------- |
   | `Auto Scaling`  | 서버 자동 확장/축소 기능        |
   | `Edge Location` | CDN의 캐시 서버 위치            |
   | `Route 53`      | AWS의 DNS 서비스                |
   | `CloudFront`    | AWS의 CDN 서비스                |
   | `CodePipeline`  | 자동화된 배포 파이프라인 서비스 |

3. 인프라 구성 유형

   1. **CSR 구성**

      - Route 53 → CloudFront → S3
      - 정적 웹사이트 호스팅에 적합

   2. **SSR 구성**

      - Route 53 → ALB → EB(EC2)
      - 동적 웹사이트에 적합

4. 주요 개념

   - **PaaS**: Platform as a Service
   - **Edge Computing**: 엣지 컴퓨팅
   - **Load Balancing**: 부하 분산
   - **Health Check**: 서버 상태 확인
   - **Zero Downtime Deploy**: 무중단 배포

5. SSR vs CSR 인프라 구축 차이점

   | 구성 요소           | SSR                        | CSR                    | 비고                          |
   | ------------------- | -------------------------- | ---------------------- | ----------------------------- |
   | **배포 방식**       | Elastic Beanstalk          | S3                     | SSR은 서버 실행 환경 필요     |
   | **서버 구성**       | EC2 인스턴스 필요          | 서버 불필요            | CSR은 정적 파일만 호스팅      |
   | **스케일링**        | Auto Scaling으로 서버 확장 | CloudFront로 캐싱 처리 | 부하 처리 방식의 차이         |
   | **로드밸런싱**      | ALB 필요                   | 불필요                 | SSR만 서버 부하 분산 필요     |
   | **배포 파이프라인** | CodePipeline → EB          | CodePipeline → S3      | SSR이 더 복잡한 배포 과정     |
   | **비용**            | 더 높음 (서버 유지)        | 더 낮음 (저장소만)     | SSR은 서버 운영 비용 발생     |
   | **캐싱**            | 서버 레벨 캐싱             | CloudFront 엣지 캐싱   | 캐싱 위치의 차이              |
   | **보안**            | 서버 보안 필요             | CDN 수준 보안          | SSR이 더 복잡한 보안 구성     |
   | **모니터링**        | 서버 + 애플리케이션        | CDN + 저장소           | SSR이 더 많은 모니터링 포인트 |
   | **장애 대응**       | 서버 문제 대응 필요        | 정적 파일 복구만       | SSR이 더 복잡한 장애 대응     |

## CSR 인프라

### 1. CSR 배포 구성 가이드

#### - 배포 흐름

1. 코드 Push → CodePipeline 트리거
2. 빌드 (npm build)
3. S3 업로드
4. CloudFront 캐시 무효화
5. 배포 완료

#### - 주의사항

- HTTPS 설정 필수
- 적절한 캐시 설정
- 보안 설정 (버킷 정책, OAI)
- 비용 최적화 설정

### 2.CSR 아키텍처

![CSR 인프라 구성도](/img/post/2024/1227/csr-architecture.png)

#### 1. Route 53

```plaintext
역할: DNS 서비스
- 도메인 네임을 CloudFront 배포 주소로 라우팅
- www.example.com → d111111abcdef8.cloudfront.net

예시:
사용자 → www.example.com 접속 요청
→ Route 53이 CloudFront 주소로 연결
```

#### 2. CloudFront

```plaintext
역할: CDN 서비스
- 전세계 엣지 로케이션에 콘텐츠 캐싱
- HTTPS 제공
- 트래픽 분산

기능:
1. 캐시 관리
2. SSL/TLS 인증서 관리
3. 엣지 로케이션 자동 선택
```

#### 3. Edge Location

```plaintext
역할: 캐시 서버
- 사용자와 가까운 위치에서 콘텐츠 제공
- S3 접근 최소화

동작 방식:
1. 캐시 확인
2. 캐시 있음 → 즉시 응답
3. 캐시 없음 → S3에서 가져와서 저장
```

#### 4. S3 Bucket

```plaintext
역할: 정적 파일 저장소
- HTML, CSS, JavaScript 파일 저장
- 이미지, 폰트 등 리소스 저장

특징:
1. 원본 파일 보관
2. 버전 관리 가능
3. 정적 웹사이트 호스팅
```

#### 5. 전체 흐름 예시

```plaintext
1. 사용자 접속
   www.example.com 접속
   ↓
2. Route 53 처리
   CloudFront로 라우팅
   ↓
3. CloudFront 처리
   가까운 엣지 로케이션 선택
   ↓
4. Edge Location 처리
   캐시 확인 → 있으면 즉시 응답
   없으면 S3에서 가져옴
   ↓
5. S3 Bucket
   필요한 파일 제공
```

## SSR 인프라

### 1. SSR 배포 구성 가이드

#### - 배포 흐름

1. 코드 Push → CodePipeline 트리거
2. 빌드 프로세스
3. Elastic Beanstalk 배포
   - 새 EC2 인스턴스 생성
   - 애플리케이션 설치
   - 헬스 체크
4. ALB 트래픽 전환
5. 이전 버전 종료

#### - 주의사항

- 환경변수 관리
- 로그 설정
- 보안 그룹 설정
- 스케일링 임계값 설정
- 무중단 배포 설정
- 헬스 체크 엔드포인트 구현

### 2. SSR 아키텍처

![SSR 인프라 구성도](/img/post/2024/1227/ssr-architecture.png)

#### 1. 배포 흐름

ssr은 서버가 구성됨으로 배포 흐름도 알고있어야 좋을거 같아 추가

```plaintext
1. 코드 Push & 빌드
   개발자 → Bitbucket(dev) → CodePipeline
                                  ↓
                              npm build
                                  ↓
                          Elastic Beanstalk
                                  ↓
                          EC2 인스턴스 생성
                                  ↓
                          ALB 트래픽 전환
                                  ↓
                          EC2 인스턴스 종료

2. 새 버전 배포
   - 새 EC2 인스턴스 생성
   - 애플리케이션 설치
   - 환경 설정 적용 (.ebextensions, .platform)

3. 무중단 배포
   - 새 버전 헬스 체크
   - ALB 트래픽 전환
   - 이전 버전 종료
```

#### 2. Route 53

```plaintext
역할: DNS 서비스
- 도메인 네임을 ALB 주소로 라우팅
- www.example.com → ALB-xxxx.region.elb.amazonaws.com
```

#### 3. ALB (Application Load Balancer)

사용자 접근시 서버 Health Check후 라우팅해주는 역활

```plaintext
역할: 부하 분산
- 트래픽을 여러 EC2 인스턴스로 분배
- 헬스 체크 수행
- SSL/TLS 처리
```

#### 4. Elastic Beanstalk

빌드가 끝난후 새로운 서버를 EC2

```plaintext
역할: 애플리케이션 환경 관리
- EC2 인스턴스 관리
- Auto Scaling 설정
- 환경 구성
```

#### 5. Auto Scaling Group

EC2 모니터링함

```plaintext
역할: 서버 자동 확장/축소
- CPU 사용률 모니터링
- 트래픽에 따른 서버 조절
- 비정상 인스턴스 교체
```

#### 6. EC2 Instances

말 그대로 포트열어 놓은 서버

```plaintext
역할: 애플리케이션 서버
- Node.js/Next.js 실행
- SSR 처리
- API 요청 처리
```

#### 7. 전체 시스템 흐름

```plaintext
1. 사용자 요청
   www.example.com 접속
   ↓
2. Route 53
   ALB로 라우팅
   ↓
3. ALB
   트래픽 분산
   ↓
4. EC2 Instances
   요청 처리 & SSR
   ↓
5. 응답 반환
   렌더링된 HTML 전송
```

#### 8. 트래픽 증가 시 처리

모니터링하다가 cpu 사용률 80% 이상 감지시 새로운 서버를 생성해줌

```plaintext
1. CloudWatch 모니터링
   - CPU 사용률 80% 이상 감지
   - 메모리 사용률 체크
   - 네트워크 트래픽 체크
   ↓
2. Auto Scaling Group 동작
   - 새 EC2 인스턴스 생성 시작
   - 기존: EC2 x 2
   - 증설: EC2 x 3 또는 4
   ↓
3. 새 인스턴스 준비
   - 애플리케이션 설치
   - 환경 설정
   - 헬스 체크 통과
   ↓
4. ALB 트래픽 재분배
   - 라운드 로빈으로 분산
   - 각 인스턴스에 균등 분배
   ↓
5. 모니터링 지속
   - 추가 스케일 아웃 필요시 반복
   - 트래픽 감소 시 스케일 인
```

## 마무리

흐름도만 따졌을때는 크게 어려울게 없는듯??? 그냥 처음 듣는 단어가 생소해서 그런거같은데 까먹지말자 그냥 이해하면 쉬움

### CSR

정상작동

- user -> Route 53 -> CloudFront -> S3

트레픽 증가시??라고하기도 머함 누군가 한번 경로를 지나가면서 캐시가 생겨있으면 그걸로 보내줌

- user -> Route 53 -> CloudFront -> Edge Location

### SSR

배포

- codepipeline -> elastic beanstalk -> ec2

사용자

- user -> Route 53 -> ALB -> EC2

트레픽 증가시

- user -> Route 53 -> ALB -> EC2 -> Auto Scaling -> cpu 사용률 80% 이상 감지시 새로운 EC2 생성 -> ALB 트래픽 재분배
