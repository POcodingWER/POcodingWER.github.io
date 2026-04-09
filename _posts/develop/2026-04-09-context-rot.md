---
layout: post
title: "[DEVELOP] Claude Code '컨텍스트 로트' 현상과 비용 80% 절감법"

subtitle: "Everything Claude Code 저장소의 settings.json 네 줄로 AI 성능 저하를 막고 비용을 줄이는 방법"

date: 2026-04-09 09:20:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/04/claude_code.png"

categories:
  - DEVELOP

tags:
  - Claude Code
  - Context Rot
  - 컨텍스트 로트
  - Everything Claude Code
  - AI 비용 절감
  - settings.json
  - MCP
  - Agent Shield
  - 메모리 학습
  - AI 코딩 도구
---

{% include post/develop_contents.md %}

> Claude Code를 오래 쓰면 AI가 점점 멍청해지는 경험, 해본 적 있으신가요? 이 현상을 **'컨텍스트 로트(Context Rot)'**라고 합니다. GitHub에서 **14만 7천 명**이 즐겨찾기한 **Everything Claude Code** 저장소가 이 문제의 해법을 제시합니다.
>
> - [GitHub - everything-claude-code](https://github.com/affaan-m/everything-claude-code)

---

## 컨텍스트 로트(Context Rot)란?

Claude Code를 오래 사용하다 보면, AI가 같은 실수를 반복하거나 분명히 알려준 규칙을 잊어버리는 순간이 옵니다. 크래시도 없고 에러 메시지도 없는데, **출력 품질이 서서히 무너지는 현상** — 이것이 바로 **컨텍스트 로트**입니다.

### 왜 발생하는가?

컨텍스트 로트의 원인은 크게 네 가지입니다.

| 원인                | 설명                                                         |
| ------------------- | ------------------------------------------------------------ |
| **어텐션 희석**     | 문맥이 길어질수록 중간 정보를 잘 기억하지 못함               |
| **명령 충돌**       | 누적된 지시문이 서로 모순되어 AI가 혼란에 빠짐               |
| **토큰 예산 압박**  | 불필요하게 커진 시작 파일이 실제 작업 토큰을 잡아먹음        |
| **관련성 미스매치** | 모든 파일이 매번 로드되어 작업과 무관한 정보까지 기억에 주입 |

### 자동차에 비유하면

AI의 **20만 토큰**이라는 연료 탱크를 가진 자동차를 상상해 보세요. 출발부터 트렁크에 짐을 가득 싣고 시작하면 연비가 떨어지고 핸들이 무거워지는 것처럼, AI도 불필요한 컨텍스트가 쌓이면 성능이 급격히 저하됩니다.

외국 가이드에서는 **한 파일이 2,000~3,000 토큰(한글 약 100단어)을 넘으면 점검 신호**로 보라고 권장합니다. CLAUDE.md 파일이 너무 두꺼운 것 자체가 AI를 멍청하게 만드는 원인이 될 수 있습니다.

---

## Everything Claude Code 저장소 소개

**Everything Claude Code**는 GitHub에서 **14만 7천 명**(147K)이 즐겨찾기한 저장소로, Anthropic x Forum Ventures 해커톤 우승자 **아판 무스타파(Affaan Mustafa)**가 10개월 이상 매일 다듬은 Claude Code 설정을 오픈소스로 공개한 프로젝트입니다. 단순한 설정 모음이 아니라, **에이전트 하네스 성능 최적화 시스템**으로 불립니다.

### 저장소 구성 요소 (v1.10.0 기준)

| 구성 요소                 | 수량  |
| ------------------------- | ----- |
| 전문 영역별 서브 에이전트 | 47개  |
| 워크플로우 스킬           | 181개 |
| 슬래시 명령어 (레거시)    | 79개  |
| 항상 따르는 룰(Rules)     | 34개  |
| MCP 서버 연동 설정        | 14개  |
| 지원 언어 생태계          | 12개+ |

### 품질과 호환성

- **1,282개**의 자동화 테스트를 통과, 커버리지 **98%**
- **170명 이상**의 컨트리뷰터가 참여한 커뮤니티 주도 프로젝트
- Claude Code뿐만 아니라 **Cursor, Codex(앱+CLI), OpenCode, Gemini CLI, Antigravity** 등 주요 AI 코딩 도구에서 동일 설정으로 동작

---

## 비용 80% 절감: settings.json 네 줄 설정법

홈 디렉토리의 `~/.claude/settings.json` 파일을 수정하는 것만으로 비용을 크게 절감할 수 있습니다.

### 1. 모델 변경 — Sonnet 사용

기본 모델인 **Opus** 대신 **Sonnet**으로 변경하면 약 **60%**의 비용을 절감할 수 있습니다. 코딩 작업의 80%는 Sonnet으로 충분하며, 복잡한 아키텍처 설계나 까다로운 디버깅 시에만 `/model opus` 명령으로 전환하면 됩니다.

### 2. 최대 생각 토큰 수(Max Thinking Tokens) 줄이기

`MAX_THINKING_TOKENS` 환경 변수를 기본값 **31,999**에서 **10,000**으로 줄입니다. AI가 답변 전에 머릿속으로 생각하는 분량으로, 대부분의 작업에서 이 정도면 충분합니다. 숨은 비용을 약 **70%** 줄일 수 있습니다.

### 3. 자동 압축 임계값(Auto-Compact) 낮추기

`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`를 기본값 **95%**에서 **50%**으로 내립니다. 컨텍스트 창의 절반이 차면 자동으로 압축이 시작되어, 긴 세션에서도 **품질 저하 없이** 작업을 이어갈 수 있습니다. 이 설정이 컨텍스트 로트를 직접적으로 방지하는 핵심입니다.

### 4. 서브 에이전트 모델 변경 — Haiku 사용

`CLAUDE_CODE_SUBAGENT_MODEL` 변수를 **Haiku**로 설정합니다. Claude Code 작업 시 보조 역할을 하는 서브 에이전트에 비싼 모델을 쓸 필요가 없습니다.

### 설정 예시

```json
// ~/.claude/settings.json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

### 누적 비용 절감 효과

네 가지 설정을 모두 적용하면 기본 설정 대비 **80% 이상의 비용 절감**이 가능합니다.

| 설정 항목                       | 기본값 | 권장값     | 절감 효과                    |
| ------------------------------- | ------ | ---------- | ---------------------------- |
| model                           | opus   | **sonnet** | ~60% 비용 절감               |
| MAX_THINKING_TOKENS             | 31,999 | **10,000** | ~70% 숨은 생각 비용 절감     |
| CLAUDE_AUTOCOMPACT_PCT_OVERRIDE | 95     | **50**     | 긴 세션에서 품질 유지        |
| CLAUDE_CODE_SUBAGENT_MODEL      | opus   | **haiku**  | 서브 에이전트 비용 대폭 절감 |

---

## 실전 활용 팁: 컨텍스트 다이어트

### /clear, /compact, /cost 명령어 활용

| 명령어     | 사용 시점                                | 효과                          |
| ---------- | ---------------------------------------- | ----------------------------- |
| `/clear`   | 무관한 작업 사이                         | 컨텍스트를 즉시 비움 (무료)   |
| `/compact` | 마일스톤 사이 (리서치 후 → 구현 시작 전) | 컨텍스트를 요약 압축          |
| `/cost`    | 세션 중 수시로                           | 현재까지의 토큰 소비량 모니터 |

**주의:** 구현 도중에 `/compact`를 사용하면 변수명, 파일 경로 등 중요한 정보를 잃어버릴 수 있습니다. Everything Claude Code의 **strategy-compact** 스킬은 적절한 시점에 `/compact`를 자동으로 제안해 줍니다.

**`/compact`를 써도 되는 시점:**

- 리서치/탐색이 끝나고, 구현을 시작하기 직전
- 하나의 마일스톤을 완료하고, 다음 마일스톤을 시작할 때
- 디버깅이 끝나고, 기능 구현으로 돌아갈 때
- 실패한 접근 방식을 포기하고, 새 방식을 시도할 때

### MCP 서버 사용량 관리

MCP 서버를 너무 많이 켜두면 각 서버가 도구 설명을 토큰으로 잡아먹어 **20만 토큰 창이 7만 토큰까지 줄어들 수 있습니다**.

| 권장 사항      | 기준          |
| -------------- | ------------- |
| 프로젝트당 MCP | **10개 이하** |
| 활성 도구 수   | **80개 이하** |

프로젝트별로 사용하지 않는 MCP를 비활성화하려면:

```json
// 프로젝트의 .claude/settings.json
{
  "disabledMcpServers": ["supabase", "railway", "vercel"]
}
```

---

## 메모리 학습 시스템 — Continuous Learning V2

14만 7천 명이 이 저장소를 즐겨찾기한 **진짜 이유**는 바로 이 **메모리 학습 시스템**입니다.

### 작동 방식

```
작업 관찰 (도구 호출 전후)
  └─ 반복 패턴 탐지
       └─ 인스팅트(Instinct) 단위로 저장 (신뢰도 0.3~0.9)
            └─ 관련 인스팅트 3개 이상 → /evolve 명령으로 스킬 모듈 승격
```

1. AI가 도구를 호출하기 **직전과 직후**에 작업을 100% 관찰하며 반복되는 패턴을 찾아냄
2. 찾아낸 패턴은 **인스팅트(Instinct)**라는 학습 단위로 저장되며, **0.3~0.9**의 신뢰도 점수가 부여
3. 관련 인스팅트가 **3개 이상** 모이면 `/evolve` 명령으로 자동으로 **재사용 가능한 스킬 모듈로 승격**

### 인스팅트 관리 명령어

| 명령어             | 역할                             |
| ------------------ | -------------------------------- |
| `/instinct-status` | 학습된 인스팅트와 신뢰도 확인    |
| `/instinct-export` | 인스팅트를 파일로 내보내기       |
| `/instinct-import` | 동료의 인스팅트 가져오기         |
| `/evolve`          | 관련 인스팅트를 스킬로 자동 승격 |
| `/prune`           | 만료된 인스팅트 정리 (30일 TTL)  |

### 팀 공유 기능

`/instinct-export`와 `/instinct-import` 기능을 통해 학습한 내용을 동료와 공유할 수 있습니다. 회사의 코딩 컨벤션이나 노하우를 AI가 기억하고, 신입 개발자에게 자연스럽게 전달하는 효과를 얻을 수 있습니다.

---

## 보안 스캐너 — Agent Shield

Claude Code 설정의 보안 취약점을 자동으로 검사하는 도구도 함께 제공됩니다. Anthropic 해커톤(Cerebral Valley x Anthropic, 2026년 2월)에서 탄생했으며, 1,282개 테스트와 102개 정적 분석 규칙으로 구성되어 있습니다.

### 설치 및 실행

```bash
# 빠른 스캔 (설치 없이 한 줄 실행)
npx ecc-agentshield scan

# 안전한 문제는 자동 수정
npx ecc-agentshield scan --fix

# 처음부터 안전한 설정 생성
npx ecc-agentshield init
```

### 검사 항목

CLAUDE.md, settings.json, MCP 설정, 훅, 에이전트 정의 등 Claude Code 설정 전체를 다섯 가지 카테고리로 검사합니다.

| 검사 항목        | 설명                                          |
| ---------------- | --------------------------------------------- |
| 시크릿 키 노출   | API 키, 토큰 등이 설정에 포함되어 있는지 확인 |
| 과도한 권한 설정 | 불필요하게 높은 권한이 설정되어 있는지 점검   |
| 훅 인젝션 취약점 | 훅을 통한 코드 주입 가능성 검사               |
| 위험한 MCP 서버  | 알려진 취약 서버 설정 감지                    |
| 에이전트 설정    | 에이전트 정의 파일의 보안 검토                |

### 레드 팀 / 블루 팀 검증

`--opus` 플래그를 사용하면 세 마리의 **Claude Opus 4.6** 에이전트가 적대적으로 검증을 수행합니다.

```bash
npx ecc-agentshield scan --opus --stream
```

```
레드 팀 에이전트  → 익스플로잇 체인(취약점 연쇄) 탐색
블루 팀 에이전트  → 방어 수단 평가
오디터 에이전트   → 양쪽 결과를 종합하여 우선순위 리스크 산정
```

단순한 패턴 매칭이 아니라 **적대적 추론(Adversarial Reasoning)**을 수행한다는 점이 핵심입니다. 출력 형식은 터미널(A~F 등급), JSON(CI 파이프라인용), Markdown, HTML을 지원하며, 치명적 발견 시 **exit code 2**를 반환하여 빌드 게이트로도 활용할 수 있습니다.

---

## 크로스 플랫폼 지원

Everything Claude Code는 Claude Code만을 위한 도구가 아닙니다. 주요 AI 코딩 도구 대부분에서 동작합니다.

| 도구           | 지원 수준 | 비고                                |
| -------------- | --------- | ----------------------------------- |
| Claude Code    | 네이티브  | 47 에이전트, 181 스킬, 79 명령어    |
| Cursor IDE     | 완전 지원 | DRY 어댑터 패턴으로 훅 재활용       |
| Codex (앱+CLI) | 1급 지원  | AGENTS.md 기반, 별도 config.toml    |
| OpenCode       | 완전 지원 | 12 에이전트, 37 스킬, 6 네이티브 툴 |
| Gemini CLI     | 실험적    | .gemini/GEMINI.md 기반              |
| Antigravity    | 통합 지원 | .agent/ 기반 플래튼드 룰            |

루트의 `AGENTS.md` 파일이 모든 도구가 공통으로 읽는 범용 파일 역할을 합니다.

---

## 시작 가이드 — 단계별 적용 방법

### Step 1. settings.json 네 줄 추가 (오늘 당장)

```json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

### Step 2. 플러그인 설치

```bash
/plugin marketplace add https://github.com/affaan-m/everything-claude-code
/plugin install ecc@ecc
```

### Step 3. 룰(Rules) 설치

플러그인만으로는 Rules가 배포되지 않으므로, 수동으로 설치해야 합니다.

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
npm install

# macOS/Linux — 전체 프로필 설치 (권장)
./install.sh --profile full

# 또는 필요한 언어만 선택 설치
./install.sh typescript       # python, golang, swift, php도 가능
```

Cursor 사용자라면 `--target cursor`를 추가합니다:

```bash
./install.sh --target cursor typescript
```

### 주의사항

- **181개 스킬을 한 번에 모두 설치하지 마세요.** 핵심 스킬부터 시작하여 필요할 때마다 추가하는 것이 좋습니다.
- 멀티 에이전트 명령어(`/multi-*`)는 별도의 런타임(`ccg-workflow`) 설치가 필요하므로, 처음에는 건너뛰어도 됩니다.

| 우선 순위  | 추천 스킬           | 역할                        |
| ---------- | ------------------- | --------------------------- |
| 1순위      | `search-first`      | 코드 검색 우선 전략         |
| 1순위      | `tdd-workflow`      | 테스트 주도 개발 워크플로우 |
| 1순위      | `strategy-compact`  | 적절한 시점에 /compact 제안 |
| 2순위      | `security-review`   | 보안 체크리스트             |
| 2순위      | `verification-loop` | 빌드·테스트·린트 자동 검증  |
| 3순위 이후 | 필요에 따라 추가    | -                           |

---

## 정리 — 적용 순서 요약

Claude Code가 멍청해지는 것은 사용자의 문제가 아니라, **컨텍스트 로트**라는 구조적 문제입니다.

| 순서 | 적용 항목                    | 난이도    | 효과                  |
| ---- | ---------------------------- | --------- | --------------------- |
| 1    | `settings.json` 네 줄 적용   | 즉시 가능 | 비용 80% 절감         |
| 2    | `strategy-compact` 스킬 사용 | 쉬움      | 컨텍스트 관리 자동화  |
| 3    | 메모리 학습 시스템 적용      | 보통      | AI가 팀의 패턴을 학습 |
| 4    | Agent Shield 보안 스캔       | 쉬움      | 설정 취약점 사전 제거 |

이 순서대로 적용하면, 다음 달 청구서와 Claude의 멍청함이 **모두 줄어들 것**입니다.

---

## 참고자료

| 분류               | 링크                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------- |
| GitHub 저장소      | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)    |
| 숏폼 가이드 (입문) | [The Shorthand Guide](https://x.com/affaanmustafa/status/2012378465664745795)            |
| 롱폼 가이드 (심화) | [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352)             |
| 보안 가이드        | [The Security Guide](https://x.com/affaanmustafa/status/2033263813387223421)             |
| 보안 스캐너 (npm)  | [Agent Shield (npx ecc-agentshield scan)](https://www.npmjs.com/package/ecc-agentshield) |
| Anthropic 공식     | [Claude Code 공식 문서](https://docs.anthropic.com/en/docs/claude-code)                  |
