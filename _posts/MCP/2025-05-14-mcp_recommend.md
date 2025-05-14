---
layout: post
title: "[MCP] 커서 mcp 추천 "

subtitle: "어떤 mcp 들을 사용하면 좋을지 추천!!"

date: 2025-05-14 08:10:31

# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"
# header-style: text
catalog: true
header-mask: 0.4
header-img: "img/post/2025/04/test_environment.png"

# sitemap:
# changefreq: daily #스크랩 주기 daily | weekly | monthly
# priority: 1.0 # 스크랩 우선순위
# hidden: true

categories:
  - MCP

tags:
  - MCP
  - claude cursor mcp
  - mcp claude cursor
  - MCP 사용법
  - mcp 적용
  - cursor mcp 사용법
  - Desktop Commander
  - Sequential Thinking
  - Context7
  - Sentry
  - Summarization
  - Exa
---

{% include post/mcp_contents.md %}

> MCP 도구로 Claude를 슈퍼파워 AI로 업그레이드해봅시다! 🚀

# 개발자를 위한 Claude MCP 추천 가이드

Claude는 훌륭한 AI 어시스턴트이지만, MCP(Model-Controller-Plugins)를 연결하면 그 능력이 몇 배로 강화됩니다! 이 글에서는 제가 직접 써보고 정말 유용했던 MCP들을 소개해 드릴게요. 여러분의 개발 생활을 한층 더 편리하게 만들어줄 마법 같은 도구들을 함께 살펴봅시다! ✨

## 1. Desktop Commander MCP - 당신의 컴퓨터를 Claude의 놀이터로! 🖥️

여러분의 컴퓨터를 Claude의 실험실로 바꿔주는 Desktop Commander! 이 마법 같은 도구는 Claude에게 파일 시스템과 터미널을 자유자재로 다룰 수 있는 초능력을 부여합니다.

### 이런 게 가능해요! ✅

- **터미널 마법사**: Claude가 직접 터미널 명령을 실행하고 프로세스를 관리해요
- **파일 탐험가**: 여러 파일을 한번에 읽고, 콘텐츠를 수정하고, 디렉토리를 검색할 수 있어요
- **코드 닌자**: ripgrep으로 코드베이스를 샅샅이 뒤져서 원하는 패턴을 찾아내요
- **텍스트 외과의사**: 필요한 부분만 정확하게 수정하는 '수술적' 코드 편집이 가능해요

### 주요 툴 목록 🧰

| 툴 이름           | 기능 설명                                         |
| ----------------- | ------------------------------------------------- |
| `execute_command` | 타임아웃 설정이 가능한 터미널 명령어 실행         |
| `read_output`     | 실행 중인 터미널 세션의 새로운 출력 읽기          |
| `read_file`       | 로컬 파일이나 URL에서 콘텐츠 읽기 (텍스트/이미지) |
| `write_file`      | 파일 내용 완전히 교체 (대규모 변경에 적합)        |
| `edit_block`      | 정밀한 텍스트 대체 기능 (작은 변경에 최적)        |
| `search_code`     | ripgrep으로 코드 패턴 검색                        |
| `list_directory`  | 디렉토리 내용 상세 목록 확인                      |
| `search_files`    | 파일 이름으로 검색                                |
| `get_file_info`   | 파일/디렉토리 메타데이터 조회                     |

### 왜 좋은지 한 줄 요약 💯

"코드 작성, 파일 검색, 터미널 명령 실행까지... Claude가 당신의 맥가이버가 됩니다!"

### mcp.json 설정 예시 ⚙️

```json
{
  "mcpServers": {
    "desktop-commander": {
      "command": "npx",
      "args": ["@wonderwhy-er/desktop-commander@latest"],
      "env": {
        "ALLOW_UNSAFE_COMMANDS": "false",
        "ALLOWED_DIRECTORIES": "['/Users/yourname/projects']"
      }
    }
  }
}
```

### 실제 사용 시나리오 📝

> "이 프로젝트의 모든 JS 파일에서 deprecated된 API 호출을 찾아서 최신 버전으로 업데이트해줘."

Claude: "찾았어요! 10개 파일에서 27개의 deprecated API 호출을 발견했습니다. 하나씩 수정할게요..."

> "홈 디렉토리에서 지난달에 수정된 모든 Python 파일을 찾아줘."

Claude: "검색 결과 ~/projects와 ~/work에서 23개의 파일을 찾았습니다. 어떤 파일을 볼까요?"

## 2. Sequential Thinking MCP - 복잡한 문제를 단계별로 해결하는 AI 브레인! 🧠

복잡한 문제를 마주했을 때 당황하지 마세요! Sequential Thinking MCP는 Claude를 체계적인 사고의 달인으로 변신시켜, 어려운 문제도 천천히 차근차근 해결해 나갑니다.

### 이런 게 가능해요! ✅

- **사고 경로 시각화**: 복잡한 문제를 단계별로 분해해서 명확하게 보여줘요
- **브레인스토밍 천재**: 다양한 접근법을 탐색하고 가장 좋은 방법을 찾아내요
- **유연한 사고 확장**: 필요하면 생각을 수정하고 새로운 접근법을 시도해요
- **가설-검증 마스터**: 해결책에 대한 가설을 세우고 검증하는 과정을 자연스럽게 보여줘요

### 주요 툴 목록 🧰

| 툴 이름              | 기능 설명                                                |
| -------------------- | -------------------------------------------------------- |
| `sequentialthinking` | 단계별 사고 과정 수행 (다양한 매개변수로 사고 흐름 제어) |

주요 매개변수:

- `thought`: 현재 생각 단계
- `thoughtNumber`: 현재 생각 번호
- `totalThoughts`: 필요한 총 생각 단계 예상
- `nextThoughtNeeded`: 다음 생각 단계 필요 여부
- `isRevision`: 이전 생각을 수정하는지 여부
- `revisesThought`: 수정 중인 생각 번호

### 왜 좋은지 한 줄 요약 💯

"수십 개의 포스트잇을 벽에 붙이고 연결선을 그리는 영화 속 천재 탐정처럼 사고할 수 있어요!"

### mcp.json 설정 예시 ⚙️

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@smithery-ai/server-sequential-thinking@latest"]
    }
  }
}
```

### 실제 사용 시나리오 📝

> "우리 쇼핑몰 앱의 장바구니 기능이 자주 버그가 발생해. 문제를 분석하고 해결책을 제안해줄래?"

Claude:

```
[사고 1/7] 먼저 장바구니 관련 주요 버그 패턴 파악
[사고 2/7] 사용자 행동과 버그 발생 상관관계 분석
...
[사고 7/7] 최종 해결책과 개선 방안 제시
```

> "마이크로서비스 아키텍처로 전환할 때 고려해야 할 사항은?"

Claude가 차근차근 구조적으로 생각을 발전시켜나가며 완벽한 전략을 세워줍니다!

## 3. Context7 MCP - 최신 라이브러리 지식을 Claude에게 주입! 📚

Context7은 Claude에게 최신 라이브러리 문서를 실시간으로 제공하는 "지식 주입기"예요. 더 이상 Claude가 "죄송해요, 제 지식이 오래되었네요"라고 말하지 않을 거예요!

### 이런 게 가능해요! ✅

- **최신 문서 주입**: 프롬프트에 `use context7`만 추가하면 최신 라이브러리 정보 자동 제공
- **토큰 절약 마법사**: 필요한 정보만 압축해서 제공하여 토큰 낭비 방지
- **환각 백신**: AI가 존재하지 않는 API를 만들어내는 환각 현상 방지
- **집중 학습**: 특정 주제나 기능에 집중된 문서만 선택적으로 제공 가능

### 주요 툴 목록 🧰

| 툴 이름              | 기능 설명                                 |
| -------------------- | ----------------------------------------- |
| `resolve-library-id` | 라이브러리 이름을 Context7 호환 ID로 변환 |
| `get-library-docs`   | 특정 라이브러리의 최신 문서 가져오기      |

### 왜 좋은지 한 줄 요약 💯

"Context7은 Claude의 '지식 포션'이에요 - 복용 즉시 최신 라이브러리 지식이 뇌에 쏙쏙!"

### mcp.json 설정 예시 ⚙️

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### 실제 사용 시나리오 📝

> "React 18의 useTransition 훅을 어떻게 사용하는지 알려줘. use context7"

Claude: "React 18의 최신 문서를 확인했습니다! useTransition은 UI를 차단하지 않고 상태 업데이트를 처리하는 훅입니다. 다음과 같이 사용해요..."

> "Next.js 14의 서버 액션에 대해 설명해줘. use context7 nextjs server-actions"

Claude가 정확한 최신 정보를 바탕으로 완벽한 설명과 예제 코드를 제공합니다!

## 4. Sentry MCP - 프로덕션 오류를 Claude와 함께 디버깅! 🐛

Sentry MCP는 Claude에게 실시간 오류 모니터링 능력을 부여합니다. 이제 프로덕션에서 발생한 버그를 Claude와 함께 해결해보세요!

### 이런 게 가능해요! ✅

- **에러 탐정**: 프로덕션 환경의 오류를 실시간으로 분석하고 원인 추적
- **성능 닥터**: 앱 성능 문제를 진단하고 처방전 제공
- **이슈 치료사**: Sentry의 AI 도구인 Seer를 사용해 자동으로 해결책 제안
- **릴리스 파수꾼**: 새 릴리스 후 발생하는 오류 패턴을 감시하고 보고

### 주요 툴 목록 🧰

| 툴 이름               | 기능 설명                                         |
| --------------------- | ------------------------------------------------- |
| `list_organizations`  | 사용 가능한 모든 Sentry 조직 목록 조회            |
| `list_projects`       | 조직 내 모든 프로젝트 목록 조회                   |
| `list_issues`         | Sentry 조직 내 모든 이슈 목록 조회 (필터링 가능)  |
| `search_errors`       | 고급 검색 구문으로 에러 검색                      |
| `get_issue_details`   | 스택 트레이스를 포함한 특정 이슈의 상세 정보 조회 |
| `begin_issue_fix`     | Seer를 사용한 이슈 원인 분석 및 해결책 제안       |
| `search_transactions` | 트랜잭션 데이터 검색 및 성능 분석                 |
| `list_releases`       | 프로젝트의 모든 릴리스 조회                       |

### 왜 좋은지 한 줄 요약 💯

"Claude가 프로덕션 문제의 '응급실 의사'가 되어 빠르게 진단하고 치료해줍니다!"

### mcp.json 설정 예시 ⚙️

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "mcp-sentry@latest"],
      "env": {
        "SENTRY_AUTH_TOKEN": "your-sentry-auth-token"
      }
    }
  }
}
```

### 실제 사용 시나리오 📝

> "어제 배포 후에 사용자들이 결제 페이지에서 오류가 발생한다고 신고했어. 무슨 일이 있나 확인해줘."

Claude: "Sentry에서 24개의 'Payment Gateway Timeout' 오류를 발견했습니다. 주요 원인은 결제 API 요청에 새로운 필수 파라미터가 누락된 것으로 보입니다. 다음과 같이 수정하는 것을 제안합니다..."

> "우리 앱에서 가장 느린 API 엔드포인트를 찾아서 최적화 방안을 제안해줘."

Claude가 Sentry의 트랜잭션 데이터를 분석하여 성능 병목 현상을 파악하고 해결책을 제시합니다!

## 5. Summarization MCP - 정보 과부하에서 구해주는 요약 마법사! 📝

대용량 데이터 앞에서 Claude가 멈추지 않도록! Summarization MCP는 방대한 텍스트, 코드, 명령어 출력을 지능적으로 요약해 컨텍스트를 효율적으로 관리합니다.

### 이런 게 가능해요! ✅

- **명령어 요약사**: 긴 명령어 출력을 핵심만 쏙쏙 뽑아 정리
- **코드 압축기**: 큰 코드 파일을 핵심 구조와 중요 부분만 간결하게 요약
- **디렉토리 내비게이터**: 복잡한 디렉토리 구조를 한눈에 이해할 수 있게 정리
- **텍스트 압축 전문가**: 어떤 텍스트든 중요한 정보는 보존하면서 간결하게 요약

### 주요 툴 목록 🧰

| 툴 이름               | 기능 설명                                 |
| --------------------- | ----------------------------------------- |
| `summarize_command`   | 명령어 실행 결과를 간결하게 요약          |
| `summarize_files`     | 파일 내용을 기술적 정확성을 유지하며 요약 |
| `summarize_directory` | 디렉토리 구조의 명확한 개요 제공          |
| `summarize_text`      | 임의의 텍스트 내용 요약                   |
| `get_full_content`    | 특정 요약 ID에 대한 전체 내용 검색        |

### 왜 좋은지 한 줄 요약 💯

"수천 줄의 코드와 로그가 '이것만 알면 됩니다!'라는 핵심 요약으로 변신합니다!"

### mcp.json 설정 예시 ⚙️

```json
{
  "mcpServers": {
    "summarization": {
      "command": "npx",
      "args": ["-y", "mcp-summarization-functions@latest"],
      "env": {
        "PROVIDER": "ANTHROPIC",
        "MODEL_ID": "claude-3-5-sonnet-20241022"
      }
    }
  }
}
```

### 실제 사용 시나리오 📝

> "이 백엔드 프로젝트의 구조를 분석해서 주요 컴포넌트와 데이터 흐름을 설명해줘."

Claude: "대규모 코드베이스를 요약했습니다! 이 프로젝트는 3개의 주요 레이어(API, 서비스, 저장소)로 구성되어 있으며, 핵심 데이터 흐름은 다음과 같습니다..."

> "이 로그 파일에서 발생한 주요 오류 패턴을 분석해줘."

Claude가 방대한 로그 파일을 스마트하게 요약하여 패턴과 문제점을 명확하게 보여줍니다!

## 6. Exa MCP - Claude에게 인터넷 검색 능력을 선물! 🌐

Exa MCP는 Claude에게 실시간 웹 검색 능력을 부여합니다. 이제 Claude는 최신 정보, 연구 자료, 기업 정보 등을 직접 찾아볼 수 있어요!

### 이런 게 가능해요! ✅

- **구글 대리인**: 최적화된 웹 검색으로 필요한 정보를 정확히 찾아와요
- **학술 조교**: 최신 연구 논문과 학술 자료 검색에 특화된 기능 제공
- **기업 분석가**: 기업 웹사이트를 크롤링하여 비즈니스 정보 수집
- **GitHub 탐험가**: 오픈소스 프로젝트, 이슈, 계정 정보 검색 지원

### 주요 툴 목록 🧰

| 툴 이름                 | 기능 설명                        |
| ----------------------- | -------------------------------- |
| `web_search_exa`        | 최적화된 결과의 웹 검색 수행     |
| `research_paper_search` | 학술 논문과 연구 콘텐츠 검색     |
| `company_research`      | 기업 정보 수집 및 분석           |
| `crawling`              | 특정 URL에서 콘텐츠 추출         |
| `competitor_finder`     | 경쟁사 식별 및 정보 수집         |
| `github_search`         | GitHub 저장소, 이슈, 계정 검색   |
| `wikipedia_search_exa`  | Wikipedia 기사 검색 및 정보 추출 |

### 왜 좋은지 한 줄 요약 💯

"Claude가 인터넷 서핑을 대신 해주는 개인 비서로 변신합니다!"

### mcp.json 설정 예시 ⚙️

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": [
        "exa-mcp-server",
        "--tools=web_search_exa,research_paper_search,company_research"
      ],
      "env": {
        "EXA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 실제 사용 시나리오 📝

> "최근 React 상태 관리 트렌드에 대해 조사해줘. Redux 대신 어떤 대안들이 인기를 얻고 있지?"

Claude: "최신 웹 검색 결과에 따르면, React Query, Zustand, Jotai, Recoil이 Redux의 대안으로 주목받고 있습니다. 특히 Zustand는 단순함과 성능으로 인기를 얻고 있으며..."

> "인공지능 윤리에 관한 최신 학술 논문을 찾아줘."

Claude가 연구 논문 데이터베이스를 검색하여 최신 AI 윤리 연구 동향을 요약해 드립니다!

---

## 🎯 MCP 통합 설정 예시: 모든 툴을 한번에!

모든 MCP를 한 파일로 관리하고 싶다면 다음과 같이 mcp.json 파일을 구성할 수 있습니다:

```json
{
  "mcpServers": {
    "desktop-commander": {
      "command": "npx",
      "args": ["@wonderwhy-er/desktop-commander@latest"],
      "env": {
        "ALLOWED_DIRECTORIES": "['/Users/yourname/projects']"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@smithery-ai/server-sequential-thinking@latest"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "mcp-sentry@latest"],
      "env": {
        "SENTRY_AUTH_TOKEN": "your-sentry-auth-token"
      }
    },
    "summarization": {
      "command": "npx",
      "args": ["-y", "mcp-summarization-functions@latest"],
      "env": {
        "PROVIDER": "ANTHROPIC",
        "MODEL_ID": "claude-3-5-sonnet-20241022"
      }
    },
    "exa": {
      "command": "npx",
      "args": [
        "exa-mcp-server",
        "--tools=web_search_exa,research_paper_search,company_research"
      ],
      "env": {
        "EXA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

이 파일을 Claude Desktop 설정 디렉토리에 저장하거나 Cursor에서 관련 설정에 추가하면 됩니다.

## 🚀 일상 개발을 위한 추천 조합

일상적인 개발 작업을 위한 완벽한 조합을 소개합니다:

1. **Desktop Commander** - 파일 시스템과 터미널을 마음대로!
2. **Context7** - 최신 라이브러리 지식으로 무장!
3. **Exa** - 최신 웹 정보로 항상 업데이트!

이 세 가지만 있으면 대부분의 개발 작업을 훨씬 효율적으로 처리할 수 있어요. 특별한 상황에는 다음을 추가하세요:

- **복잡한 알고리즘 설계할 때**: Sequential Thinking
- **프로덕션 문제 해결할 때**: Sentry
- **대규모 코드베이스 작업할 때**: Summarization

## 🎁 마무리

이제 여러분은 Claude를 강력한 개발 도우미로 변신시킬 준비가 되었습니다! MCP는 단순한 플러그인이 아니라, AI의 능력을 몇 배로 확장하는 마법 같은 도구입니다.

어떤 MCP가 가장 유용할지는 여러분의 개발 스타일과 필요에 따라 다를 수 있어요. 하나씩 시도해보고 여러분만의 최강 조합을 찾아보세요!

개발하는 재미가 두 배로 늘어날 거예요! 😉✌️
