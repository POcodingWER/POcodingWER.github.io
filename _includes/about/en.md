# Frontend Developer Who Also Designs AI Agent Harnesses 👋

**Started as a blockchain (Solidity) developer and within 4 years** led the framework migration and
monorepo transition of a B2C mobile platform running 10 services, achieving an
**88% AWS cost reduction (about $16,500 saved annually)** and a **60% loading speed improvement**.

## 🚀 Key Achievements

### 📊 Cost Optimization

- **88% total AWS cost reduction**: $1,500+ → $120/month (about $16,500 saved annually)
  - Phase 1 migration (SSR → CSR): **65% reduction**
  - Phase 2 CloudFront optimization: **76% additional reduction** ($500 → $120/month)
- **90% fewer CloudFront requests**: 12M → 1M requests/month
- **90% cache hit rate**, initial loading speed improved **60%** (3s → 1.2s)

### 🏗️ Architecture Design

- **Led Nuxt.js → React migration**: 10 core services, 10 months, 2-person team
- **Built a monorepo**: PNPM workspace + Turborepo cut CI build time by **80%**
- **Lambda@Edge + S3 progressive deployment**: page-level independent deployment pipelines

### 🛠 Operations & Automation

- **Resolved Bluetooth IoT failures**: connection failure rate down **80%**, customer inquiries down **90%**
- **Automated development processes**: **70%** less time on locale packs, **90%** less on terms updates
- **Operated an AI agent harness**: caught critical bugs in a 150-file, 8,000-line PR before review

## 💼 Career

### Frontend Developer

**September 2022 ~ Present**

Led technology transformation and optimization while operating 10 independent services at a campus-focused B2C mobile app company.

#### 1. Led the Nuxt.js → React Migration Project

**Jan 2025 ~ Nov 2025 (10 months)**

- Progressively migrated 10 core services (main, charging, conversion, laundry, point, ticket, etc.)
- Designed a progressive deployment strategy based on Lambda@Edge + S3
- Served as lead of a 2-person team

**Technical Decisions**

- Chose **Context API + React Query** over Redux
- Chose **Vite** as the bundler (10x faster HMR than Webpack)
- Chose **Lambda@Edge** for its low operating cost

**✅ Result**: 65% AWS cost reduction in phase 1, lower maintenance cost

#### 2. Built the Monorepo Architecture

- Built an integrated multi-service management system on PNPM workspace
- Designed shared UI libraries (`packages/ui`, `packages/styles`, `packages/utils`)
- Configured independent build/deployment pipelines per page
- Introduced Turborepo build caching

**✅ Result**: 80% shorter CI build time (full rebuild → only changed apps), 35% shorter deployment time, 25% smaller bundle size

#### 3. CloudFront Cache Optimization and Cost Reduction

**Jan 2025 ~ Nov 2025**

- Segmented CloudFront caching policies (separate strategies for HTML/CSS/JS)
- Optimized S3 static file compression (Brotli + Gzip) and CDN configuration
- Implemented dynamic routing with Lambda@Edge

**✅ Result**

- CloudFront cost down **76%** ($500 → $120/month)
- Total AWS cost down **88%** ($1,500+ → $120/month, about $16,500 saved annually)
  - Phase 1 (migration): 65% reduction via SSR → CSR
  - Phase 2 (optimization): 76% additional reduction via CloudFront tuning
- CloudFront requests down **90%** (12M → 1M/month)
- Loading speed improved **60%** (3s → 1.2s), **90%** cache hit rate

#### 4. Bluetooth IoT Incident Response and Monitoring System

**Apr 2025 ~ Jun 2025**

- Debugged washing machine Bluetooth connection failures for 2 months (40~50+ cases per day on average)
- Proposed and implemented Sentry error tracking
- Designed a detailed log collection structure in collaboration with app developers
- Analyzed error patterns → confirmed occurrence only on specific devices/OS versions → added timeout and retry logic

**✅ Result**: 65% faster incident response (2 hours → 40 minutes on average), 80% lower connection failure rate, 90% fewer customer inquiries

#### 5. Development Process Automation

**Jul 2023 ~ Aug 2024 (13 months)**

**Semi-automated locale pack system**

- Planners manage Korean/English translations in MS Excel → developers run a terminal command
- Node.js script converts Excel → JSON automatically
- Tech: Node.js, xlsx library, custom JSON conversion logic

**Terms update automation**

- Built a Notion → HTML automatic conversion system
- Script applies service CSS to the generated HTML automatically

**✅ Result**: 70% less time for locale pack updates, 90% less time for terms updates (30 minutes → 3 minutes), higher development productivity

#### 6. Domain Service Development

- **Charging/Payment**: integrated multiple payment methods including gift certificates and virtual accounts
- **Laundry**: built a washing machine control system integrated with Bluemeter (Bluetooth IoT) and app-web bridge communication
- **Games**: built real-time ranking systems for roulette and jump games
- **Ticketing**: built a musical/performance booking platform integrated with Clip

#### 7. Design System and Collaboration Culture

- Built a Figma design token system (style-dictionary)
- Introduced Storybook → documented design tokens and key components
- Proposed and ran weekly technical sharing sessions

**✅ Result**: improved design-development collaboration efficiency

#### 8. AI Agent Harness Design and Operation

- **Authored project context documents**: architecture, per-app domain responsibilities, shared package impact scope, agent behavior rules, and task completion checklists
- **Designed agent constraint rules**: no refactoring outside the requested scope, mandatory justification for new abstractions, explicit listing of affected apps when shared packages change — preventing review cost from unnecessary over-engineering
- **Established per-task manual toggling for MCP (Sentry/Figma)**: limited always-connected servers to 2~4 to manage the token budget
- **Built a GitHub PR review automation skill**: Critical/Medium/Low severity classification, automatic summary and inline comments, review log storage and statistics

**✅ Result**

- Detected and fixed critical bugs that humans easily miss in a 150-file, 8,000-line PR through AI review
- Recorded and accumulated reasons for rejected review comments → built a system that keeps improving review standards so the same issues are not repeated
- Refined Sentry error data (removed noisy alerts, tagged user identifiers on core features) to narrow the investigation scope for root cause analysis

#### Tech Stack

React, TypeScript, Vite, React Query, Nuxt.js, Vue.js, PNPM workspace, Turborepo,
AWS (Lambda@Edge, S3, CloudFront), Sentry, Storybook, style-dictionary, Node.js

---

### Blockchain Developer & NFT Projects

**June 2022 ~ September 2022 (3 months)**

Through experience in Solidity-based smart contract development and NFT minting platform construction, I gained a **deep understanding of blockchain technology and the Web3 ecosystem**. I later transitioned to frontend development to deliver value to a broader user base.

**Key Projects**

- **Delica NFT Minting Platform**: Solidity smart contract design and React-based frontend implementation
- **Bellygom NFT Project**: Ethereum-based NFT issuance system development

**Tech Stack**: Solidity, Web3.js, Ethereum, React, ethers.js

## 💻 Tech Stack

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

## 🎯 Strengths

### 1. Development Measured in Cost and Performance

I don't stop at shipping features — I deliver measurable outcomes such as 88% AWS cost reduction, 90% fewer requests, and 60% faster loading.

### 2. Architecture Design and Technical Decision-Making

I design structures that fit the scale of the service — monorepos, progressive migrations, page-level independent deployment — and document why each choice was made.

### 3. Turning Repetitive Work into Systems

I convert manual, repetitive work such as locale pack updates, terms updates, and PR reviews into scripts and AI agent workflows.

### 4. Problem-Solving That Goes All the Way

For hard-to-reproduce problems like the 2-month Bluetooth communication issue, I rebuild the logging design itself to find the root cause.

## 📚 Tech Blog

Consistently documenting problems encountered in practice and their resolution processes.

### AWS · Frontend

- **CloudFront Cache Optimization**: [Read More](https://pocodingwer.github.io/aws/2025/12/02/cloudfront_cache/)
- **CloudFront Cost Reduction**: [Read More](https://pocodingwer.github.io/aws/2025/12/10/cloudfront_cost_savings/)
- **Cookie Security Complete Guide**: [Read More](https://pocodingwer.github.io/front/2025/08/07/cookie/)
- **React Query Usage Guide**: [Read More](https://pocodingwer.github.io/reactguide/2025/08/01/reactQuery/)

### MCP · AI Agent

I submitted [Find Parking!](https://playmcp.kakao.com/mcp/68948413827338498) to Kakao's **Agentic Player 10** competition. The MCP is publicly available on PlayMCP, and the preliminary application has been completed.

- **Find Parking! Development Retrospective**: [Read More](https://pocodingwer.github.io/mcp/2026/07/10/find-parking-mcp-dev-history/) — Node.js MCP server, deployment to KC, and competition review
- **Cursor MCP OAuth Authentication**: [Read More](https://pocodingwer.github.io/mcp/2026/07/14/cursor-mcp-oauth/) — Figma/Sentry login and token storage in Cursor
- **MCP Series**: [Read More](https://pocodingwer.github.io/mcp/2026/03/19/mcp_recommend3/) — From stdio/SSE to Remote MCP

👉 [View Full Blog](https://pocodingwer.github.io/)

## 📬 Contact

- **Email**: cjftns01@gmail.com
- **GitHub**: [github.com/pocodingwer](https://github.com/pocodingwer)
- **Blog**: [pocodingwer.github.io](https://pocodingwer.github.io/)
- **Instagram**: [@lim_cuck](https://www.instagram.com/lim_cuck)

---
