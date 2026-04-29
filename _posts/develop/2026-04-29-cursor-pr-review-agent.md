---
layout: post
title: "[DEVELOP] Cursor Agent로 PR 자동 리뷰 시스템 만들기 — Skill 기반 워크플로우 설계"

subtitle: "gh CLI + git worktree + Cursor Skill을 조합하여, 'PR 리뷰해줘' 한마디로 코드 분석부터 GitHub 인라인 코멘트까지 자동화한 과정"

date: 2026-04-29 08:12:10

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/04/pr_review.png"

categories:
  - DEVELOP

tags:
  - Cursor
  - AI Agent
  - PR Review
  - Code Review
  - GitHub
  - gh CLI
  - git worktree
  - Cursor Skill
  - 자동화
  - DevOps
---

{% include post/develop_contents.md %}

> PR 올라올 때마다 리뷰 요청하고, 기다리고, 컨텍스트 스위칭하고... 반복되는 코드 리뷰 과정이 번거로웠습니다. Cursor의 Agent Skill 기능을 활용해서 **"PR #123 리뷰해줘"** 한 마디로 코드 분석부터 GitHub에 인라인 코멘트 등록까지 자동으로 처리하는 시스템을 만들어봤습니다.

---

## 왜 만들었나

팀에서 PR 리뷰를 하다 보면 이런 패턴이 반복됩니다.

1. PR 알림이 옴
2. 브랜치 체크아웃 (현재 작업 stash하거나 커밋)
3. 코드 읽고 분석
4. GitHub에서 코멘트 작성
5. 다시 원래 브랜치로 돌아옴

특히 **2번이 문제**입니다. 내 작업 중인 브랜치를 건드려야 하니까 리뷰를 미루게 되고, 미루다 보면 PR이 쌓입니다.

이걸 해결하려면 두 가지가 필요했습니다.

- **현재 작업에 영향 없이** PR 코드를 볼 수 있는 방법 → `git worktree`
- **분석 + 코멘트 등록을 자동화**할 수 있는 도구 → Cursor Agent Skill

---

## 전체 구조

```
"PR #123 리뷰해줘"
       │
       ▼
┌─────────────────────────────┐
│  Step 0: 프로젝트 컨텍스트 로드  │  ← pr-review-context.md
├─────────────────────────────┤
│  Step 1: gh pr view/diff     │  ← PR 메타 정보 + 변경 파일 목록
├─────────────────────────────┤
│  Step 2: git worktree 생성    │  ← 현재 브랜치 유지한 채 PR 코드 확인
├─────────────────────────────┤
│  Step 3-4: diff + 파일 분석   │  ← 변경 코드 정밀 검토
├─────────────────────────────┤
│  Step 5: 리뷰 작성            │  ← Critical/Medium/Low 분류
├─────────────────────────────┤
│  Step 6: GitHub 코멘트 등록   │  ← 요약 리뷰 + 인라인 코멘트
└─────────────────────────────┘
```

---

## Step 0: Cursor Skill이란

Cursor의 Skill은 `.cursor/skills/` 디렉토리에 `SKILL.md` 파일을 두면, Agent가 특정 작업을 요청받았을 때 해당 파일의 워크플로우를 따라 실행하는 기능입니다.

```
.cursor/
  skills/pr-review/
    SKILL.md                  # 스킬 정의 (리뷰 워크플로우)
    pr-review-context.md      # 프로젝트별 컨텍스트
    scripts/
      stats.py                # 리뷰 통계 스크립트
    docs/
      SETUP.md                # 설정 가이드
```

`SKILL.md`의 frontmatter에 이름과 설명을 넣어두면, Cursor Agent가 사용자의 의도를 파악해서 자동으로 해당 스킬을 실행합니다.

```yaml
---
name: pr-review
description: >-
  GitHub PR을 리뷰하는 스킬. git worktree를 활용하여 현재 작업에 영향 없이 PR 코드를 분석하고
  Critical/Medium/Low 등급으로 분류된 리뷰를 제공한다.
---
```

---

## Step 1: 사전 준비 — gh CLI 인증

GitHub API를 사용하려면 `gh` CLI 인증이 필요합니다.

```bash
# macOS
brew install gh

# 인증
gh auth login
```

![gh auth login](/img/post/2026/04/pr_review.png)

터미널에서 `gh auth login`을 실행하면 인증 방식을 선택하게 됩니다. **HTTPS + 웹 브라우저 로그인**을 선택하면 일회성 코드가 표시됩니다.

![GitHub 디바이스 인증](/img/post/2026/04/pr_review2.png)

브라우저에서 코드를 입력하고 인증을 완료합니다.

![인증 완료](/img/post/2026/04/pr_review3.png)

인증이 완료되면 `gh` CLI로 PR 조회, 코멘트 등록 등 모든 GitHub 작업이 가능해집니다.

```bash
# 인증 상태 확인
gh auth status
```

---

## Step 2: 프로젝트 컨텍스트 설정

리뷰 품질을 높이려면 Agent가 프로젝트를 이해해야 합니다. `pr-review-context.md`에 기술 스택, 폴더 구조, 팀 컨벤션을 정의합니다.

```markdown
# 프로젝트 컨텍스트

## 기술 스택

- Vite + React + TypeScript
- pnpm workspace (모노레포)
- TanStack Query — 서버 상태 관리
- SCSS 모듈 (.module.scss) — 스타일링

## 팀 컨벤션

- TypeScript strict 모드, any 타입 절대 금지
- 함수형 컴포넌트 + Hooks 패턴
- Early return 패턴 적극 활용
- SCSS 모듈에서 BEM-like 네이밍

## 리뷰 시 참고

- Styled Components → SCSS 모듈 마이그레이션 진행 중
- WebBridge 유틸리티 변경 시 네이티브 앱 영향도 확인 필요
```

이 파일이 있으면 Agent가 **"이 프로젝트에서는 Styled Components 대신 SCSS 모듈을 써야 한다"** 같은 팀 규칙을 알고 리뷰합니다. 실제로 Styled Components를 사용한 코드가 PR에 포함되면 Medium 이슈로 잡아냅니다.

---

## Step 3: git worktree로 현재 작업 보호

이 스킬의 핵심 설계 중 하나입니다. 리뷰를 위해 브랜치를 바꿀 필요가 없습니다.

```bash
# 현재 브랜치 확인
git branch --show-current  # → develop

# PR 브랜치가 다르면 worktree 생성
git fetch origin
git worktree add ../metaclub-v2-web-pr123 feature/some-feature
```

`git worktree`는 하나의 저장소에서 **여러 브랜치를 동시에 체크아웃**할 수 있게 해줍니다. 현재 `develop`에서 작업 중이어도, PR 브랜치의 코드를 별도 디렉토리에서 바로 확인할 수 있습니다.

Agent가 이 로직을 자동으로 판단합니다.

- 현재 브랜치 ≠ PR 브랜치 → worktree 생성
- 현재 브랜치 = PR 브랜치 → worktree 불필요, 바로 리뷰

---

## Step 4: 리뷰 체크리스트와 심각도 기준

Agent가 검토하는 항목은 4가지 카테고리로 나뉩니다.

| 카테고리       | 검토 항목                                                   |
| -------------- | ----------------------------------------------------------- |
| **정확성**     | 로직 오류, 누락된 에러 핸들링, 비동기 처리 누락, API 불일치 |
| **일관성**     | 기존 패턴 불일치, 네이밍 컨벤션 위반, 중복 정의, dead code  |
| **유지보수성** | 과도한 복잡도, 매직 넘버, 함수 크기, 의도 불명 코드         |
| **보안/성능**  | XSS, 불필요한 API 호출, 메모리 누수 가능성                  |

발견된 이슈는 심각도별로 분류됩니다.

| 등급              | 기준                              | 예시                          |
| ----------------- | --------------------------------- | ----------------------------- |
| **Critical/High** | 버그, 데이터 손실, 기능 장애 유발 | 누락된 await, 잘못된 API 호출 |
| **Medium**        | 유지보수 비용 증가, 잠재적 문제   | dead code, 하드코딩 중복      |
| **Low/Style**     | 코드 품질, 컨벤션                 | 네이밍, 타입 캐스팅           |

---

## Step 5: 하이브리드 코멘트 등록

리뷰 결과는 **요약 리뷰 + 인라인 코멘트** 두 가지로 나뉘어 GitHub에 등록됩니다.

### 요약 리뷰 (전체 코멘트)

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews \
  --method POST \
  -f body="리뷰 요약 내용" \
  -f event="COMMENT"  # 또는 REQUEST_CHANGES
```

- Critical/High 이슈가 있으면 → `REQUEST_CHANGES`
- 없으면 → `COMMENT`

### 인라인 코멘트 (라인별 상세)

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
  --method POST \
  -f body="[Cursor Review] **Medium** 이슈 제목" \
  -f commit_id="HEAD_SHA" \
  -f path="src/components/Example.tsx" \
  -F line=42 \
  -f side="RIGHT"
```

diff의 정확한 라인에 코멘트가 달리기 때문에, 코드를 보면서 바로 이슈를 확인할 수 있습니다.

모든 코멘트에는 `[Cursor Review]` 태그가 붙어서 AI 리뷰임을 명확히 합니다.

---

## Step 6: 실제 리뷰 결과

실제 PR에 대해 리뷰를 돌려보면 이런 결과가 나옵니다.

![리뷰 요약 결과](/img/post/2026/04/pr_review4.png)

이 PR에서는 Critical 이슈 없이 Medium 4건, Low 2건이 발견되었습니다. Medium에서 잡힌 것들을 보면:

- **Styled Components 사용** — 팀 컨벤션에서 SCSS 모듈로 전환 중인데 새 코드에서 사용
- **로직 중복** — 비슷한 패턴이 반복되는 코드
- **테스트 날짜 하드코딩** — 하드코딩된 날짜 값
- **로딩 UX** — 로딩 상태 처리 미흡

프로젝트 컨텍스트에 "Styled Components는 deprecated"라고 명시해뒀더니, 정확하게 잡아낸 것을 볼 수 있습니다.

---

## 리뷰 로그와 통계

리뷰가 끝나면 로그를 **삼중 저장**합니다.

| 저장소                                          | 용도                          |
| ----------------------------------------------- | ----------------------------- |
| `.cursor/pr-review-logs/reviews.jsonl`          | 프로젝트별 팀 공유 (git 추적) |
| `~/.cursor/skills/pr-review/logs/reviews.jsonl` | 전체 통합 지표 (개인 로컬)    |
| PR 코멘트                                       | GitHub에 수용률 기록          |

```json
{
  "reviewId": "pr-123",
  "date": "2026-04-29",
  "repo": "metaclub-v2-web",
  "author": "developer",
  "issues": { "critical": 0, "medium": 4, "low": 2 },
  "accepted": 5,
  "rejected": 1,
  "rejectedReasons": ["의도된 설계"]
}
```

이 데이터가 쌓이면 **리뷰 수용률**을 추적할 수 있습니다. AI 리뷰의 실제 유용성을 수치로 확인할 수 있죠.

```bash
# 프로젝트 리뷰 통계
리뷰 통계 보여줘

# 전체 프로젝트 통합 통계
전체 리뷰 통계 보여줘
```

---

## SKILL.md 작성 팁

직접 만들면서 느낀 Cursor Skill 작성 팁입니다.

### 1. 단계를 명확하게 나누기

Agent가 순서대로 따라갈 수 있도록 Step 1, 2, 3... 으로 명확하게 나눕니다. 각 단계에서 실행할 명령어까지 구체적으로 적어두면 Agent가 혼동 없이 실행합니다.

### 2. 조건 분기를 명시하기

"현재 브랜치가 PR 브랜치와 같으면 A, 다르면 B"처럼 상황별 분기를 명확하게 적어둡니다. Agent는 조건문을 잘 따릅니다.

### 3. 출력 포맷을 정해두기

리뷰 결과의 마크다운 템플릿을 SKILL.md에 넣어두면, 매번 일관된 포맷으로 리뷰가 나옵니다.

### 4. 프로젝트 컨텍스트 분리

기술 스택이나 컨벤션은 별도 파일(`pr-review-context.md`)로 분리하면, 다른 프로젝트에 스킬을 재사용할 때 컨텍스트 파일만 바꾸면 됩니다.

---

## 한계와 향후 개선

### 현재 한계

- **개인 gh auth 기반**: 코멘트가 내 계정으로 달림. 팀원들이 AI 리뷰인지 내 리뷰인지 헷갈릴 수 있음 → `[Cursor Review]` 태그로 구분
- **대규모 PR**: 변경 파일이 30개 이상이면 컨텍스트 윈도우 한계에 부딪힐 수 있음
- **수동 트리거**: "PR 리뷰해줘"를 직접 입력해야 함

### 향후 개선 방향

- **GitHub App 봇 전환**: Organization 수준에서 봇 계정으로 코멘트 등록
- **자동 트리거**: PR 생성/업데이트 시 GitHub Webhook으로 자동 리뷰 실행
- **리뷰 품질 피드백**: 수용률 데이터를 기반으로 리뷰 기준 자동 조정

---

## 마무리

Cursor Skill을 활용한 PR 리뷰 자동화는 생각보다 실용적이었습니다. 완벽한 리뷰를 대체하는 건 아니지만, **반복적인 패턴 위반이나 컨벤션 이슈를 사전에 걸러주는 1차 필터** 역할을 잘 해냅니다.

특히 좋았던 점은:

- **git worktree 덕분에 작업 흐름이 끊기지 않음**
- **프로젝트 컨텍스트를 이해하고 팀 규칙 기반으로 리뷰**
- **GitHub 인라인 코멘트로 바로 확인 가능**
- **리뷰 로그 축적으로 수용률 추적 가능**

"사람이 봐야 할 중요한 리뷰"에 집중할 수 있도록, 기계적인 검토는 Agent에게 맡기는 것. 그게 이 스킬의 목표였고, 꽤 만족스러운 결과를 얻었습니다.
