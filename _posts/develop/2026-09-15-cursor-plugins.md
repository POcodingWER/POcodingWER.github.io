---
layout: post
title: "[DEVELOP] Cursor Plugin — .cursor를 패키지로 배포하는 공식 방법"

subtitle: "npm이 아니라 플러그인입니다. homepage·repository는 메타데이터고, hooks는 에이전트 루프에 스크립트를 거는 기능입니다. 공식 레퍼런스를 한국어로 풀어 읽습니다."

date: 2026-09-15 09:30:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/04/claude_code.webp"

categories:
  - DEVELOP

tags:
  - Cursor
  - Cursor Plugin
  - Cursor Rules
  - Cursor Skill
  - Hooks
  - MCP
  - Agent Plugins
  - 에이전트 하네스
  - 마켓플레이스
---

{% include post/develop_contents.md %}

> 프로젝트 `.cursor`를 npm 패키지로 올리고 싶었다. Cursor는 `node_modules`를 설정으로 읽지 않는다. 공식 배포 단위는 **Plugin**이다. 이 글은 [Plugins reference](https://cursor.com/docs/reference/plugins)를 기준으로, 문서에만 있고 평소 `.cursor`에는 안 보이던 `homepage`, `repository`, `hooks`까지 한국어로 정리한 노트다.

원문: [cursor.com/docs/reference/plugins](https://cursor.com/docs/reference/plugins)  
템플릿: [github.com/cursor/plugin-template](https://github.com/cursor/plugin-template)

---

## 한 줄 요약

`.cursor/rules`, `.cursor/skills`, `.cursor/mcp.json`은 **이 레포에서만** 먹힌다. 여러 레포에 같은 규칙·스킬·MCP를 뿌리고 싶으면 폴더를 npm에 넣는 게 아니라, Cursor가 인식하는 **플러그인 디렉터리**로 묶는다.

플러그인은 rules, skills, agents, commands, MCP, hooks를 한 묶음으로 배포하는 패키지다. VS Code extension과 비슷한 역할이지만, 런타임은 에디터 UI가 아니라 **에이전트 행동**이다.

---

## 포맷이 두 개다

Cursor는 매니페스트 **위치**로 포맷을 구분한다.

| 포맷 | 매니페스트 | 실어 나를 수 있는 것 |
| :-- | :-- | :-- |
| [Agent Plugins](https://agent-plugins.org) (공개 표준) | 루트 `plugin.json` | Skills, MCP |
| Cursor Plugins | `.cursor-plugin/plugin.json` | Skills, MCP, **rules, agents, commands, hooks, variables** |

Agent Plugins 스펙을 지키면 Cursor에서도 로드된다. 다만 `mcp.json`의 `${PLUGIN_ROOT}`, `${PLUGIN_DATA}`는 Cursor가 치환하지 않는다. 플러그인 설치 경로는 `${CURSOR_PLUGIN_ROOT}`(또는 `${CLAUDE_PLUGIN_ROOT}`)를 쓴다.

팀이 쓰는 코딩 규칙(`.mdc`)까지 같이 배포하려면 **Cursor Plugin**이 맞다. 스킬+MCP만 다른 도구와 공유하려면 Agent Plugin도 후보가 된다.

### Agent Plugin 구조

```text
my-plugin/
├── plugin.json            # 필수
├── skills/
│   └── code-reviewer/
│       └── SKILL.md
└── mcp.json
```

### Cursor Plugin 구조

```text
my-plugin/
├── .cursor-plugin/
│   └── plugin.json        # 필수
├── rules/
│   ├── coding-standards.mdc
│   └── review-checklist.mdc
├── skills/
│   └── code-reviewer/
│       └── SKILL.md
├── agents/
│   └── security-reviewer.md
├── commands/
│   └── deploy.md
├── hooks/
│   └── hooks.json
├── mcp.json
├── assets/
│   └── logo.svg
├── scripts/
│   └── format-code.py
└── README.md
```

프로젝트 `.cursor`와 거의 같다. 차이는 루트에 `.cursor-plugin/plugin.json`이 생기고, **이 레포에서만 쓰는 로그·시크릿·조직 고유 값은 빼는** 점이다.

---

## plugin.json — 필수와 선택

필수 필드는 `name` 하나다. 소문자 kebab-case, 영숫자·하이픈·점. 처음과 끝은 영숫자. 예: `my-plugin`, `prompts.chat`.

나머지 필드는 두 덩어리다.

1. **마켓플레이스 메타데이터** — 사람이 읽고, 검색하고, 링크로 가는 값
2. **컴포넌트 경로** — Cursor가 실제로 로드하는 파일 위치

### 메타데이터: homepage, repository는 “기능”이 아니다

문서에 `homepage`, `repository`가 있어서 뭔가 런타임 훅이 있을 것처럼 보이지만, **npm의 `package.json`과 같다.** 플러그인이 동작하는 방식은 바꾸지 않는다.

| 필드 | 타입 | 하는 일 |
| :-- | :-- | :-- |
| `description` | string | 한 줄 설명 |
| `version` | string | semver (`1.0.0`) |
| `author` | object | `name` 필수, `email` 선택 |
| `homepage` | string | **문서/소개 사이트 URL.** 마켓 카드에서 “홈페이지로” 링크 |
| `repository` | string | **소스 Git URL.** 이슈·PR·코드 보러 가는 링크 |
| `license` | string | `MIT` 같은 SPDX |
| `keywords` | array | 검색·분류 태그 |
| `logo` | string | 로고. 상대경로 권장 (`assets/logo.svg`) |

`homepage`와 `repository`를 헷갈리면 이렇게 나누면 된다.

- `repository`: 이 플러그인 **코드가 있는 곳**
- `homepage`: 설치 가이드, 팀 위키, 랜딩 페이지처럼 **사람이 읽는 곳**

로고 상대경로는 GitHub `raw.githubusercontent.com`으로 풀린다. 예: `acme/plugins` 커밋 `abc123`의 `assets/logo.svg` →

```text
https://raw.githubusercontent.com/acme/plugins/abc123/my-plugin/assets/logo.svg
```

절대 URL도 된다. 시크릿은 여기 넣지 않는다.

### 컴포넌트 경로: 폴더를 안 쓰면 기본 위치를 스캔한다

| 필드 | 타입 | 의미 |
| :-- | :-- | :-- |
| `rules` | string 또는 배열 | 룰 파일/디렉터리 |
| `agents` | string 또는 배열 | 에이전트 정의 |
| `skills` | string 또는 배열 | 스킬 디렉터리 |
| `commands` | string 또는 배열 | 커맨드 파일 |
| `hooks` | string 또는 object | hooks 설정 **경로**이거나 **인라인 JSON** |
| `mcpServers` | string, object, 배열 | MCP 설정. 있으면 기본 `mcp.json` 탐색을 **덮어씀** |
| `variables` | object | 시크릿 **이름**만 선언하는 JSON Schema |

매니페스트에 `skills`를 안 쓰면 `skills/` 아래 `SKILL.md`가 있는 폴더를 자동 탐색한다. **한 번 필드를 쓰면 그 경로만 보고 기본 폴더는 안 본다.** `"skills": "./my-skills/"`이면 루트 `skills/`는 무시된다.

기본 탐색:

| 컴포넌트 | 기본 위치 | 찾는 방법 |
| :-- | :-- | :-- |
| Skills | `skills/` | `SKILL.md`가 있는 하위 폴더 |
| Rules | `rules/` | `.md`, `.mdc`, `.markdown` |
| Agents | `agents/` | 위와 같음 |
| Commands | `commands/` | 위 + `.txt` |
| Hooks | `hooks/hooks.json` | 이벤트 이름 파싱 |
| MCP | `mcp.json` | 서버 엔트리 |
| Root Skill | 루트 `SKILL.md` | `skills/`도 없고 매니페스트 `skills`도 없을 때만 단일 스킬 플러그인 |

예시 매니페스트:

```json
{
  "name": "enterprise-plugin",
  "version": "1.2.0",
  "description": "Enterprise development tools with security scanning and compliance checks",
  "author": {
    "name": "ACME DevTools",
    "email": "devtools@acme.com"
  },
  "homepage": "https://docs.example.com/cursor-plugin",
  "repository": "https://github.com/acme/cursor-plugins",
  "keywords": ["enterprise", "security", "compliance"],
  "logo": "assets/logo.svg"
}
```

`homepage`/`repository`가 없어도 플러그인은 동작한다. 마켓에 올릴 때 사람용 링크가 비는 것뿐이다.

---

## Variables — 시크릿은 레포에 안 넣는다

`variables`는 API 토큰 같은 **값**이 아니라 **이름과 스키마**다. 실제 값은 대시보드 **Plugins → Configure**에서 팀 관리자가 넣는다.

플러그인 설정에는 `${VAR}`만 둔다. 셸의 `${env:...}`가 아니다.

```json
{
  "name": "example-plugin",
  "variables": {
    "type": "object",
    "properties": {
      "API_TOKEN": {
        "type": "string",
        "title": "API token",
        "description": "Bearer token for the example HTTP MCP"
      }
    },
    "required": ["API_TOKEN"]
  }
}
```

```json
{
  "mcpServers": {
    "example-api": {
      "url": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

최상위는 `{ "type": "object", "properties": { ... } }`여야 한다. 허용 키워드가 고정돼 있다: `type`, `title`, `description`, `default`, `enum`, `const`, `properties`, `required`, `items`, 길이·숫자 제약 일부.

플러그인이 관리하는 MCP 설정은 대시보드에서 **읽기 전용**이다. 토큰을 바꾸려면 Configure의 변수만 바꾼다.

---

## Rules / Skills / Agents / Commands

프로젝트 `.cursor`와 파일 형식이 같다. 플러그인은 그걸 **설치 가능한 단위로 옮긴 것**이다.

**Rules** — `rules/*.mdc`. 프론트매터: `description`, `alwaysApply`, `globs`.

**Skills** — `skills/<name>/SKILL.md`. `name`, `description`. 에이전트가 “언제 이 워크플로를 쓸지” 고르는 문장이다.

**Agents** — `agents/*.md`. 커스텀 에이전트 페르소나. 예: 보안 리뷰만 하는 리뷰어.

**Commands** — `commands/*.md` 등. 에이전트가 실행하는 고정 액션 설명. “스테이징 배포”처럼 단계가 정해진 작업.

자세한 필드 설명은 원문과 [Rules](https://cursor.com/docs/rules), [Skills](https://cursor.com/docs/skills) 문서를 보면 된다. 이 글에서는 플러그인에만 있는 **hooks**를 길게 본다.

---

## Hooks — 플러그인에서 제일 낯선 기능

룰은 프롬프트다. 스킬은 워크플로 문서다. **Hooks는 프로세스다.**

에이전트 루프의 특정 시점에 스크립트를 띄운다. stdio로 JSON을 주고받는다. 관찰만 할 수도 있고, 위험한 명령을 막을 수도 있고, 파일 저장 후 포맷터를 돌릴 수도 있다.

정의 위치는 세 곳이다.

- 프로젝트: `.cursor/hooks.json`
- 유저: `~/.cursor/hooks.json`
- 플러그인: `hooks/hooks.json` 또는 매니페스트 `hooks` 인라인

플러그인 쪽 예:

```json
{
  "hooks": {
    "afterFileEdit": [
      {
        "command": "./scripts/format-code.sh"
      }
    ],
    "beforeShellExecution": [
      {
        "command": "./scripts/validate-shell.sh",
        "matcher": "rm|curl|wget"
      }
    ],
    "sessionEnd": [
      {
        "command": "./scripts/audit.sh"
      }
    ]
  }
}
```

`matcher`는 그 이벤트 중 **일부만** 거르는 필터다. 위 예는 셸에 `rm`, `curl`, `wget`이 있을 때만 검증 스크립트를 탄다.

### 이벤트 세 종류

**Agent** (채팅/에이전트 세션)

| 이벤트 | 언제 |
| :-- | :-- |
| `sessionStart` / `sessionEnd` | 세션 시작·끝. 컨텍스트 주입, 감사 로그 |
| `preToolUse` / `postToolUse` / `postToolUseFailure` | 도구 호출 전후. 모든 툴 |
| `subagentStart` / `subagentStop` | Task 서브에이전트 생명주기 |
| `beforeShellExecution` / `afterShellExecution` | 셸 명령 게이트 |
| `beforeMCPExecution` / `afterMCPExecution` | MCP 도구 게이트 |
| `beforeReadFile` / `afterFileEdit` | 파일 읽기·수정 |
| `beforeSubmitPrompt` | 프롬프트 제출 전 검증 |
| `preCompact` | 컨텍스트 압축 직전 |
| `stop` | 에이전트 종료 |
| `afterAgentResponse` / `afterAgentThought` | 응답·사고 추적 |

**Tab** (인라인 자동완성)

- `beforeTabFileRead`
- `afterTabFileEdit`

에이전트와 Tab을 나눈 이유: Tab은 사용자 확인 없이 파일을 만진다. 정책을 다르게 걸 수 있다.

**앱 수명**

- `workspaceOpen` — 워크스페이스를 열거나 폴더가 바뀔 때. 현재 워크스페이스용 **추가 플러그인 경로**를 돌려줄 수 있다.

실무에서 바로 쓸 만한 조합:

- `afterFileEdit` → prettier / eslint --fix
- `beforeShellExecution` → `rm -rf`, DB write, 프로덕션 curl 차단
- `sessionStart` → 팀 공지, 브랜치 이름, 금지 경로를 컨텍스트로 주입
- `beforeReadFile` → 시크릿 파일 읽기 거부

상세 프로토콜은 [Hooks](https://cursor.com/docs/hooks) 문서가 길다. 플러그인 레퍼런스는 “hooks.json을 플러그인에 실을 수 있다”는 선언이고, 동작 명세는 그쪽이다.

Cloud Agent는 프로젝트 `.cursor/hooks.json`은 가져가지만, `~/.cursor/hooks.json`은 홈 디렉터리가 없어서 안 탄다. `sessionStart`/`Tab`/`workspaceOpen` 일부는 클라우드에서 빠진다. 팀 공용 가드는 **플러그인 또는 레포 hooks**에 넣는 편이 맞다.

---

## MCP를 플러그인에 실을 때

두 포맷 모두 플러그인 루트 `mcp.json`을 쓴다.

Cursor Plugin은 `command` 또는 `url`로 트랜스포트를 추론한다. 경로를 커스텀하거나 인라인으로 넣으려면 매니페스트 `mcpServers`를 쓴다. 그 필드를 쓰는 순간 기본 `mcp.json` 탐색은 덮인다.

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${POSTGRES_URL}"
      }
    }
  }
}
```

`${POSTGRES_URL}`은 위에서 말한 plugin variable이다. `plugin.json`의 `variables`에 이름을 선언하고, 값은 대시보드에서 넣는다.

Agent Plugin 예:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "code-review": {
      "type": "stdio",
      "command": "./bin/code-review",
      "cwd": "${CURSOR_PLUGIN_ROOT}"
    }
  }
}
```

`${CURSOR_PLUGIN_ROOT}`는 `command`, `args`, `env`, `cwd`에서 플러그인 설치 경로로 치환된다.

---

## 한 레포에 플러그인 여러 개 — marketplace.json

팀 플러그인을 레포 하나에 모을 수 있다. 루트 `.cursor-plugin/marketplace.json`이 목록이다. 파일 전체 10MB 제한.

```json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Your Org",
    "email": "plugins@yourorg.com"
  },
  "metadata": {
    "description": "A collection of developer tool plugins"
  },
  "plugins": [
    {
      "name": "plugin-one",
      "source": "plugin-one",
      "description": "First plugin"
    },
    {
      "name": "plugin-two",
      "source": "plugin-two",
      "description": "Second plugin"
    }
  ]
}
```

필수: `name`, `owner`, `plugins`.  
`metadata.pluginRoot`는 모든 `source` 앞에 붙는 접두 경로다.

엔트리에도 `homepage`, `repository`가 다시 나온다. 플러그인 단위 링크다. `plugin.json`과 마켓 엔트리가 둘 다 있으면 **마켓 엔트리가 이긴다.** `variables`도 같다. 값은 `plugin.json`에 두고, 덮어쓸 일 있을 때만 마켓 엔트리에 적는 게 덜 헷갈린다.

`source: "my-plugin"`이면:

1. `my-plugin/.cursor-plugin/plugin.json`을 찾는다
2. 있으면 마켓 엔트리와 머지 (엔트리 우선)
3. `my-plugin/` 안에서 컴포넌트 탐색

```text
my-plugins/
├── .cursor-plugin/
│   └── marketplace.json
├── eslint-rules/
│   ├── .cursor-plugin/
│   │   └── plugin.json
│   └── rules/
│       ├── prefer-const.mdc
│       └── no-any.mdc
├── docker/
│   ├── .cursor-plugin/
│   │   └── plugin.json
│   ├── skills/
│   │   └── containerize-app/
│   │       └── SKILL.md
│   └── mcp.json
└── README.md
```

룰만 있는 플러그인과 스킬+MCP 플러그인을 한 마켓에서 나눠 설치할 수 있다.

---

## 마켓에 제출

Cursor 팀이 리뷰한다.

1. 루트 `plugin.json` 또는 `.cursor-plugin/plugin.json`
2. **공개** Git 레포에 푸시. 로고는 커밋하는 쪽이 안전하다
3. [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)에 레포 URL

체크리스트에서 자주 빠질 것:

- `name`은 전역에서 유일해야 한다
- 매니페스트 경로는 상대경로만. `..`와 절대경로 금지
- `mcp.json`의 `${VAR}`는 전부 `variables`에 선언
- 멀티 플러그인이면 루트 `marketplace.json`과 플러그인 이름 중복 없음
- 로컬에서 한 번 로드해 볼 것

사내만 쓸 거면 퍼블릭 마켓이 필수는 아니다. Git에 플러그인 레포를 두고 팀 설치로도 된다. 공식 제출은 “남들이 검색해서 깔게”일 때다.

---

## `.cursor`를 옮길 때 뭐를 빼나

플러그인은 **여러 레포에서 재사용할 행동**이다. 한 프로젝트의 이력·시크릿·로컬 취향은 그대로 둔다.

| 넣어도 됨 | 빼는 편이 나음 |
| :-- | :-- |
| 공통 코딩 룰 | 에이전트 작업 로그, 로컬 캐시 |
| 스킬 워크플로 (`SKILL.md`, scripts) | 그 레포 아키텍처만 아는 컨텍스트 문서 |
| MCP 서버 정의 + `variables` | 토큰, org slug를 파일에 하드코딩 |
| hooks (포맷, 위험 명령 가드) | 개인 `~/.cursor` 취향 |

한 서비스 레포만 쓰면 지금처럼 `.cursor`를 커밋하는 게 제일 단순하다. 웹·앱·서버에 같은 룰을 깔 때부터 플러그인이 이득이다.

npm `postinstall`로 `.cursor`에 복사하는 우회는 여전히 가능하다. Cursor가 그 패키지를 플러그인으로 인식하지는 않는다.

---

## 참고

- [Plugins reference](https://cursor.com/docs/reference/plugins)
- [Hooks](https://cursor.com/docs/hooks)
- [Rules](https://cursor.com/docs/rules)
- [Skills](https://cursor.com/docs/skills)
- [MCP](https://cursor.com/docs/mcp)
- [Agent Plugins](https://agent-plugins.org)
- [plugin-template](https://github.com/cursor/plugin-template)
- 이 블로그: [에이전트 하네스 실무](/develop/2026/09/01/agent-harness-in-practice/)
