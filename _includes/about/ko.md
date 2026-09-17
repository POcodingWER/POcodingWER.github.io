# 프론트엔드와 AI 에이전트 하네스를 함께 다루는 개발자입니다 👋

**블록체인(Solidity) 개발자로 시작해 4년 만에** 10개 서비스를 운영하는 B2C 모바일 플랫폼의
프레임워크 마이그레이션과 모노레포 전환을 리드했고, **AWS 비용 88% 절감(연 약 $16,500)** 과
**로딩 속도 60% 개선**을 만들어낸 프론트엔드 개발자입니다.

## 🚀 핵심 성과

### 📊 비용 최적화

- **총 AWS 비용 88% 절감**: 월 $1,500+ → $120 (연 약 $16,500 절감)
  - 1단계 마이그레이션(SSR → CSR): **65% 절감**
  - 2단계 CloudFront 최적화: **추가 76% 절감** (월 $500 → $120)
- **CloudFront 요청 90% 감소**: 1,200만 → 100만 요청/월
- **캐시 hit률 90% 달성**, 초기 로딩 속도 **60% 개선** (3초 → 1.2초)

### 🏗️ 아키텍처 설계

- **Nuxt.js → React 마이그레이션 리드**: 10개 핵심 서비스, 10개월, 2인 팀
- **모노레포 구축**: PNPM workspace + Turborepo로 CI 빌드 시간 **80% 단축**
- **Lambda@Edge + S3 점진적 배포**: 페이지 단위 독립 배포 파이프라인 구성

### 🛠 운영 · 자동화

- **블루투스 IoT 장애 해결**: 연결 실패율 **80% 감소**, 고객 문의 **90% 감소**
- **개발 프로세스 자동화**: 언어팩 **70%**, 약관 업데이트 **90%** 시간 단축
- **AI 에이전트 하네스 운영**: 150개 파일·8,000줄 PR에서 Critical 버그 사전 검출

## 💼 경력

### 프론트엔드 개발자

**2022.09 ~ 현재**

캠퍼스 중심 B2C 모바일 앱 회사에서 10개 독립 서비스를 운영하며 기술 전환과 최적화를 주도했습니다.

#### 1. Nuxt.js → React 마이그레이션 프로젝트 리드

**2025.01 ~ 2025.11 (10개월)**

- 10개 핵심 서비스 점진적 전환 (main, charging, conversion, laundry, point, ticket 등)
- Lambda@Edge + S3 기반 점진적 배포 전략 설계
- 2인 팀 리드 역할 수행

**기술적 의사결정**

- Redux 대신 **Context API + React Query** 선택
- **Vite** 번들러 선택 (Webpack 대비 10배 빠른 HMR)
- **Lambda@Edge** 선택 (낮은 운영 비용)

**✅ 성과**: AWS 비용 1단계 65% 절감, 유지보수 비용 감소

#### 2. 모노레포 아키텍처 구축

- PNPM workspace 기반 멀티 서비스 통합 관리 시스템 구축
- 공통 UI 라이브러리 설계 (`packages/ui`, `packages/styles`, `packages/utils`)
- 페이지별 독립 빌드/배포 파이프라인 구성
- Turborepo 빌드 캐시 도입

**✅ 성과**: CI 빌드 시간 80% 단축(전체 재빌드 → 변경된 앱만 빌드), 배포 시간 35% 단축, 번들 사이즈 25% 감소

#### 3. CloudFront 캐싱 최적화 및 비용 절감

**2025.01 ~ 2025.11**

- CloudFront 캐싱 정책 세분화 (HTML/CSS/JS 별도 전략)
- S3 정적 파일 압축 최적화(Brotli + Gzip) 및 CDN 설정
- Lambda@Edge로 동적 라우팅 구현

**✅ 성과**

- CloudFront 비용 **76% 절감** (월 $500 → $120)
- 총 AWS 비용 **88% 절감** (월 $1,500+ → $120, 연 약 $16,500 절감)
  - 1단계(마이그레이션): SSR → CSR 전환으로 65% 절감
  - 2단계(최적화): CloudFront 최적화로 76% 추가 절감
- CloudFront 요청 **90% 감소** (1,200만 → 100만/월)
- 로딩 속도 **60% 개선** (3초 → 1.2초), 캐시 hit률 **90% 달성**

#### 4. 블루투스 IoT 장애 대응 및 모니터링 시스템 구축

**2025.04 ~ 2025.06**

- 세탁기 블루투스 연결 실패 이슈 2개월 디버깅 (일 평균 40~50건 이상 발생)
- Sentry 에러 트래킹 시스템 도입 제안 및 구축
- 앱 개발자와 협업하여 상세 로그 수집 구조 설계
- 에러 패턴 분석 → 특정 기기/OS 버전에서만 발생 확인 → 타임아웃 + 재시도 로직 추가

**✅ 성과**: 장애 대응 시간 65% 단축(평균 2시간 → 40분), 연결 실패율 80% 감소, 고객 문의 90% 감소

#### 5. 개발 프로세스 자동화

**2023.07 ~ 2024.08 (13개월)**

**언어팩 반자동화 시스템**

- 기획자가 MS Excel에서 한/영 번역 관리 → 개발자가 터미널 명령어 실행
- Node.js 스크립트로 Excel → JSON 자동 변환
- 기술: Node.js, xlsx 라이브러리, 커스텀 JSON 변환 로직

**약관 업데이트 자동화**

- 노션 → HTML 자동 변환 시스템 구축
- 스크립트로 HTML에 서비스 CSS 자동 적용

**✅ 성과**: 언어팩 업데이트 70% 시간 단축, 약관 업데이트 90% 시간 단축(30분 → 3분), 개발 생산성 향상

#### 6. 도메인별 서비스 개발

- **충전/결제**: 문화상품권, 가상계좌 등 다중 결제 수단 통합
- **세탁 서비스**: 블루미터(블루투스 IoT) 연동 세탁기 제어 시스템 개발, 앱-웹 브릿지 통신 구현
- **게임**: 룰렛, 점프 게임 등 실시간 랭킹 시스템 개발
- **티켓**: 클립(Clip) 연동 뮤지컬/공연 예매 플랫폼 구축

#### 7. 디자인 시스템 및 협업 문화 개선

- Figma 디자인 토큰 시스템(style-dictionary) 구축
- Storybook 도입 → 디자인 토큰 및 주요 컴포넌트 문서화
- 주간 기술 공유 세션 제안 및 진행

**✅ 성과**: 디자인-개발 협업 효율 향상

#### 8. AI 에이전트 하네스 설계 및 운영

- **프로젝트 컨텍스트 문서 작성**: 아키텍처, 앱별 도메인 책임, 공유 패키지 영향범위, 에이전트 행동 규칙 및 작업 완료 체크리스트 포함
- **에이전트 행동 제약 룰 설계**: 요청 범위 외 리팩토링 금지, 신규 추상화 도입 시 사유 설명 의무화, 공유 패키지 변경 시 영향 앱 명시 등 — 불필요한 과잉 작업으로 인한 리뷰 비용 방지
- **MCP(Sentry/Figma) 작업별 수동 토글 정책 수립**: 상시 연결 서버 수 2~4개로 제한하여 토큰 예산 관리
- **GitHub PR 리뷰 자동화 스킬 구축**: Critical/Medium/Low 등급 분류, 요약·인라인 코멘트 자동 등록, 리뷰 로그 저장 및 통계화

**✅ 성과**

- 150개 파일·8,000줄 규모 대형 PR에서 사람이 놓치기 쉬운 Critical 버그를 AI 리뷰로 사전 검출·수정
- 리뷰에서 반려된 의견에 사유를 기록해 축적 → 같은 지적이 반복되지 않도록 리뷰 기준을 지속 개선하는 체계 구축
- Sentry 오류 데이터를 정제(불필요한 알림 제거, 핵심 기능에 사용자 식별 정보 태깅)해 장애 원인 파악에 필요한 조사 범위 축소

#### 기술 스택

React, TypeScript, Vite, React Query, Nuxt.js, Vue.js, PNPM workspace, Turborepo,
AWS (Lambda@Edge, S3, CloudFront), Sentry, Storybook, style-dictionary, Node.js

---

### 블록체인 개발자 & NFT 프로젝트

**2022.06 ~ 2022.09 (3개월)**

Solidity 기반 스마트 컨트랙트 개발 및 NFT 민팅 플랫폼 구축 경험을 통해 **블록체인 기술과 Web3 생태계에 대한 깊은 이해**를 갖추게 되었습니다. 이후 프론트엔드 개발로 전환하며 더 넓은 사용자에게 가치를 전달하는 방향으로 커리어를 발전시켰습니다.

**주요 프로젝트**

- **Delica NFT 민팅 플랫폼**: Solidity 스마트 컨트랙트 설계 및 React 기반 프론트엔드 구현
- **Bellygom NFT 프로젝트**: 이더리움 기반 NFT 발행 시스템 개발

**기술 스택**: Solidity, Web3.js, Ethereum, React, ethers.js

## 💻 기술 스택

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)

### Monorepo & Build

![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)

### DevOps & Tools

![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Lambda@Edge](https://img.shields.io/badge/Lambda@Edge-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)
![CloudFront](https://img.shields.io/badge/CloudFront-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![S3](https://img.shields.io/badge/S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### AI · MCP

![Cursor](https://img.shields.io/badge/Cursor-000000?style=for-the-badge&logo=cursor&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-6366F1?style=for-the-badge&logo=protocol&logoColor=white)

### Backend (Experience)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

## 🎯 강점

### 1. 비용과 성능을 수치로 증명하는 개발

기능 구현에서 끝내지 않고 AWS 비용 88% 절감, 요청 90% 감소, 로딩 속도 60% 개선처럼 측정 가능한 지표로 결과를 만듭니다.

### 2. 아키텍처 설계와 기술 의사결정

모노레포, 점진적 마이그레이션, 페이지별 독립 배포 등 서비스 규모에 맞는 구조를 설계하고 선택 이유를 문서로 남깁니다.

### 3. 반복 업무를 시스템으로 바꾸는 자동화

언어팩·약관 업데이트·PR 리뷰처럼 사람이 반복하던 작업을 스크립트와 AI 에이전트 워크플로로 전환합니다.

### 4. 끝까지 파고드는 문제 해결

2개월간의 블루투스 통신 디버깅처럼 재현이 어려운 문제도 로그 설계부터 다시 만들어 근본 원인을 찾아냅니다.

## 📚 기술 블로그

실무에서 마주한 문제와 해결 과정을 꾸준히 기록하고 있습니다.

### AWS · 프론트엔드

- **CloudFront 캐시 최적화**: [보러가기](https://pocodingwer.github.io/aws/2025/12/02/cloudfront_cache/)
- **CloudFront 비용 절감**: [보러가기](https://pocodingwer.github.io/aws/2025/12/10/cloudfront_cost_savings/)
- **Cookie 보안 완벽 가이드**: [보러가기](https://pocodingwer.github.io/front/2025/08/07/cookie/)
- **React Query 사용법**: [보러가기](https://pocodingwer.github.io/reactguide/2025/08/01/reactQuery/)

### MCP · AI Agent

카카오 **Agentic Player 10** 공모전에 [찾아줘 주차장!](https://playmcp.kakao.com/mcp/68948413827338498) MCP를 제출했습니다. (PlayMCP 전체 공개 · 예선 접수 완료)

- **찾아줘 주차장! 개발 회고**: [보러가기](https://pocodingwer.github.io/mcp/2026/07/10/find-parking-mcp-dev-history/) — Node.js MCP 서버, KC 배포, 공모전 심사
- **Cursor MCP OAuth 인증**: [보러가기](https://pocodingwer.github.io/mcp/2026/07/14/cursor-mcp-oauth/) — Figma·Sentry 로그인, 토큰은 Cursor가 보관
- **MCP 시리즈 전체**: [보러가기](https://pocodingwer.github.io/mcp/2026/03/19/mcp_recommend3/) — stdio/SSE부터 Remote MCP까지

👉 [전체 블로그 보기](https://pocodingwer.github.io/)

## 📬 연락처

- **Email**: cjftns01@gmail.com
- **GitHub**: [github.com/pocodingwer](https://github.com/pocodingwer)
- **Blog**: [pocodingwer.github.io](https://pocodingwer.github.io/)
- **Instagram**: [@lim_cuck](https://www.instagram.com/lim_cuck)

---
