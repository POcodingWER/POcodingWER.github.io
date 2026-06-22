---
layout: post
title: "[IDE] VS Code / Cursor 에디터 설정 정리"

subtitle: "Prettier, Inlay Hints, Git 등 실제 사용 중인 settings.json"

date: 2026-06-22 10:00:00
author: "lim.Chuck"

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1025/setting.png"

categories:
  - IDE
tags:
  - vscode
  - cursor
  - editor 설정
  - prettier
  - inlay hints
  - settings.json
---

> VS Code에서 쓰던 설정을 Cursor로 그대로 옮겨 쓰고 있다.  
> 기능별로 왜 이렇게 설정했는지 정리하고, 전체 `settings.json`도 함께 남긴다.

## 설정 파일 위치

`⌘` + `⇧` + `P` → **Preferences: Open User Settings (JSON)**

Cursor도 VS Code와 동일한 경로·형식을 사용한다.

---

## 1. 코드 포맷팅 (Prettier)

| 설정                       | 값                       | 왜?                                                                                           |
| -------------------------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| `editor.formatOnSave`      | `true`                   | 저장할 때마다 포맷을 맞춰서 수동 정리 시간을 줄인다.                                          |
| `editor.defaultFormatter`  | `esbenp.prettier-vscode` | 기본 포맷터를 Prettier로 통일한다.                                                            |
| `prettier.useEditorConfig` | `false`                  | `.editorconfig`와 Prettier 규칙이 충돌할 때 Prettier 설정을 우선한다.                         |
| `prettier.withNodeModules` | `true`                   | `node_modules` 안 파일도 필요할 때 포맷할 수 있게 한다. (보통은 드물지만 디버깅·패치 시 유용) |

### 언어별 포맷터

| 언어                        | 포맷터                                | 왜?                                                                       |
| --------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| JavaScript, TypeScript, Vue | Prettier                              | 팀/개인 프로젝트 코드 스타일을 하나로 맞춘다.                             |
| JSON                        | `vscode.json-language-features`       | VS Code 내장 JSON 포맷터가 구조 정렬에 안정적이다.                        |
| HTML                        | `vscode.html-language-features`       | HTML 태그 들여쓰기·정렬을 내장 포맷터에 맡긴다.                           |
| JavaScript React (JSX)      | `vscode.typescript-language-features` | JSX 구조 정리는 TS Language Service가 더 자연스럽게 처리하는 경우가 있다. |
| Rust                        | `rust-lang.rust-analyzer`             | Rust 공식 권장 포맷터(`rustfmt`)와 연동된다.                              |

---

## 2. Inlay Hints (타입·파라미터 힌트)

에디터 안에 회색 글씨로 타입, 파라미터 이름 등을 표시해 주는 기능이다.

| 설정                         | 값                | 왜?                                                                  |
| ---------------------------- | ----------------- | -------------------------------------------------------------------- |
| `editor.inlayHints.enabled`  | `onUnlessPressed` | 평소엔 켜 두고, `Option`(Mac) / `Alt`(Win) 누르면 잠깐 숨길 수 있다. |
| `editor.inlayHints.padding`  | `false`           | 힌트 주변 여백을 줄여 코드가 덜 벌어지게 한다.                       |
| `editor.inlayHints.fontSize` | `0`               | `0`은 에디터 기본 글꼴 크기를 그대로 쓴다는 뜻이다.                  |

### TypeScript

| 설정                                                     | 값           | 왜?                                                                                                   |
| -------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| `typescript.inlayHints.parameterNames.enabled`           | `"literals"` | 리터럴 인자(`foo(1, true)`)에만 파라미터 이름을 보여 준다. 변수 넘길 때는 코드가 지저분해지지 않는다. |
| `typescript.inlayHints.parameterTypes.enabled`           | `true`       | 함수 인자 타입을 바로 확인할 수 있다.                                                                 |
| `typescript.inlayHints.propertyDeclarationTypes.enabled` | `true`       | `const x = ...` 처럼 타입 추론 결과를 필드 선언 옆에 보여 준다.                                       |
| `typescript.inlayHints.enumMemberValues.enabled`         | `true`       | enum 멤버의 실제 값을 함께 표시한다.                                                                  |

### JavaScript

| 설정                                                     | 값      | 왜?                                                              |
| -------------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| `javascript.inlayHints.parameterNames.enabled`           | `"all"` | JS는 타입 정보가 없어서 파라미터 이름 힌트를 더 적극적으로 켠다. |
| `javascript.inlayHints.parameterTypes.enabled`           | `true`  | JSDoc 기반 타입 추론 결과를 인자 옆에 표시한다.                  |
| `javascript.inlayHints.propertyDeclarationTypes.enabled` | `true`  | TS와 동일하게 추론된 타입을 확인한다.                            |
| `javascript.inlayHints.enumMemberValues.enabled`         | `true`  | enum 멤버 값을 바로 볼 수 있다.                                  |

> `functionLikeReturnTypes`, `variableTypes` 힌트는 정보는 많지만 화면이 복잡해져서 꺼 둔 상태다.

---

## 3. Git / Diff

| 설정                              | 값      | 왜?                                                                                    |
| --------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `git.confirmSync`                 | `false` | push/pull sync 전 확인 팝업을 생략한다. 자주 sync하는 환경에서 클릭 한 번 줄인다.      |
| `git.ignoreRebaseWarning`         | `true`  | rebase 관련 경고를 반복해서 보지 않는다. rebase 흐름에 익숙할 때 사용한다.             |
| `diffEditor.ignoreTrimWhitespace` | `false` | diff에서 **공백 차이도 표시**한다. trailing space, indent 변경을 놓치지 않기 위함이다. |

---

## 4. TypeScript / 검색

| 설정                                         | 값         | 왜?                                                                                   |
| -------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `typescript.updateImportsOnFileMove.enabled` | `"always"` | 파일 이름·경로를 바꿀 때 import 경로를 자동으로 수정한다. 수동 수정 실수를 줄인다.    |
| `search.seedOnFocus`                         | `true`     | 검색창에 포커스할 때 이전 검색어를 유지한다.                                          |
| `search.seedWithNearestWord`                 | `true`     | 검색창을 열면 커서 아래 단어를 초기 검색어로 넣는다. 변수/함수명 바로 찾을 때 편하다. |

---

## 5. 확장 프로그램 관련

| 설정                                           | 값                            | 왜?                                                        |
| ---------------------------------------------- | ----------------------------- | ---------------------------------------------------------- |
| `svelte.plugin.svelte.note-new-transformation` | `false`                       | Svelte 새 변환 알림 팝업을 끈다.                           |
| `liveServer.settings.donotShowInfoMsg`         | `true`                        | Live Server 시작 시 안내 메시지를 숨긴다.                  |
| `grunt.autoDetect`                             | `"on"`                        | Gruntfile이 있으면 자동으로 task를 감지한다.               |
| `prisma.showPrismaDataPlatformNotification`    | `false`                       | Prisma Data Platform 홍보 알림을 끈다.                     |
| `security.promptForLocalFileProtocolHandling`  | `false`                       | `file://` 프로토콜 처리 확인 팝업을 줄인다.                |
| `cSpell.userWords`                             | `["Receptionagree", "scarb"]` | 프로젝트 전용 단어를 사전에 등록해 스펠체크 오탐을 줄인다. |

---

## 6. UI / 기타

| 설정                           | 값                   | 왜?                                                             |
| ------------------------------ | -------------------- | --------------------------------------------------------------- |
| `workbench.colorTheme`         | `"Default Dark+"`    | 기본 다크 테마. 익숙하고 확장 호환성이 좋다.                    |
| `window.autoDetectColorScheme` | `false`              | OS 라이트/다크 자동 전환을 끈다. 항상 다크 테마를 유지한다.     |
| `workbench.editorAssociations` | `"*.jar": "default"` | JAR 파일을 기본 에디터로 연다.                                  |
| `php.validate.executablePath`  | `""`                 | PHP 검증 경로 미지정. PHP 미사용 시 기본값 유지.                |
| `editor.codeActionsOnSave`     | `{}`                 | 저장 시 자동 fix(eslint --fix 등)는 프로젝트별로 따로 관리한다. |

---

## 전체 settings.json

아래는 **개인 정보를 제거**하고 정리한 버전이다.

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "git.confirmSync": false,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "svelte.plugin.svelte.note-new-transformation": false,
  "liveServer.settings.donotShowInfoMsg": true,
  "grunt.autoDetect": "on",
  "workbench.editorAssociations": {
    "*.jar": "default"
  },
  "php.validate.executablePath": "",
  "workbench.colorTheme": "Default Dark+",
  "atlascode.jira.enabled": true,
  "atlascode.bitbucket.enabled": true,
  "atlascode.jira.jqlList": [],
  "git.ignoreRebaseWarning": true,
  "diffEditor.ignoreTrimWhitespace": false,
  "editor.codeActionsOnSave": {},
  "prettier.useEditorConfig": false,
  "prettier.withNodeModules": true,
  "prisma.showPrismaDataPlatformNotification": false,
  // "prettier.bracketSameLine": true,
  // "prettier.requireConfig": true
  "typescript.inlayHints.enumMemberValues.enabled": true,
  // "typescript.inlayHints.functionLikeReturnTypes.enabled": true,
  "typescript.inlayHints.parameterNames.enabled": "literals",
  "typescript.inlayHints.parameterTypes.enabled": true,
  "typescript.inlayHints.propertyDeclarationTypes.enabled": true,
  // "typescript.inlayHints.variableTypes.enabled": true,
  "javascript.inlayHints.parameterNames.enabled": "all",
  "javascript.inlayHints.enumMemberValues.enabled": true,
  // "javascript.inlayHints.functionLikeReturnTypes.enabled": true,
  "javascript.inlayHints.parameterTypes.enabled": true,
  "javascript.inlayHints.propertyDeclarationTypes.enabled": true,
  // "javascript.inlayHints.variableTypes.enabled": true,
  "editor.inlayHints.enabled": "onUnlessPressed",
  "editor.inlayHints.padding": false,
  "editor.inlayHints.fontSize": 0,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "atlascode.bitbucket.issues.createJiraEnabled": false,
  "cSpell.userWords": ["Receptionagree", "scarb"],
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  "security.promptForLocalFileProtocolHandling": false,
  "window.autoDetectColorScheme": false,
  "atlascode.jira.lastCreatePreSelectedValues": {},
  "typescript.updateImportsOnFileMove.enabled": "always",
  "search.seedOnFocus": true,
  "search.seedWithNearestWord": true
}
```

---

## 마무리

- **포맷팅**: Prettier + 저장 시 자동 포맷으로 코드 스타일 고민을 줄였다.
- **Inlay Hints**: 타입·파라미터 정보를 에디터 안에서 바로 확인한다.
- **Git/Diff**: 자주 쓰는 작업의 확인 팝업을 줄이고, 공백 diff는 놓치지 않게 했다.

Cursor는 VS Code 설정을 그대로 가져올 수 있어서, 위 JSON을 User Settings에 붙여 넣으면 거의 동일한 환경을 재현할 수 있다.

Prettier 상세 설정은 [Prettier, ESLint 세팅](/reactguide/2024/10/18/Prettier_ESLint/) 글도 함께 참고하면 된다.
