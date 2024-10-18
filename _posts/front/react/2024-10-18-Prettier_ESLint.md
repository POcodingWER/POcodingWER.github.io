---
layout: post
title: "[React] Prettier, ESLint 세팅"

subtitle: "협업을 위한 코드 세팅 기준을 세워보자"

date: 2024-10-18 09:55:19
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1018/1018.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true

tags:
  - React
  - 리엑트
  - Prettier
  - ESLint
  - 프리티어
  - Prettier, ESLint
---

{% include post/react/contents.md %}

> 참고문서  
> [Prettier 공식홈페이지](https://prettier.io/)  
> [ESLint 공식홈페이지](https://eslint.org/)

## Prettier?

Prettier는 코드 포맷터입니다. 코드 스타일을 자동으로 정리하여 팀이나 개인 프로젝트에서 일관된 코드 형식을 유지할 수 있습니다. 예를 들어, 공백이나 들여쓰기, 세미콜론 등과 관련된 규칙을 자동으로 적용하여 가독성을 높입니다.

## ESLint?

ESLint는 코드에서 오류를 잡아주고, 특정한 코딩 규칙을 강제할 수 있게 도와주는 린팅(linting) 도구입니다. JavaScript 및 JSX 코드의 문제를 발견하고 수정하도록 제안해 줍니다. ESLint는 문법 오류 뿐만 아니라 Best Practice(최적의 코드 작성 방식)와 코드 일관성도 유지하도록 도와줍니다.

## Prettier 및 ESLint 설치 방법

#### 1. Prettier 설치

1. 터미널에서 다음 명령어를 실행하여 Prettier를 설치합니다:

   ```bash
   npm install --save-dev prettier
   ```

2. 설치 후, 프로젝트 루트(`package.json`파일이있는 위치)에 `.prettierrc` 파일을 생성하고 원하는 설정을 추가합니다.
   ![](/img/post/2024/1018/1.png)

   ```js
   //.prettierrc 세팅값
   {
     "arrowParens": "avoid", // 화살표 함수 괄호 사용 방식
     "bracketSpacing": false, // 객체 리터럴에서 괄호에 공백 삽입 여부
     "endOfLine": "auto", // EoF 방식, OS별로 처리 방식이 다름
     "htmlWhitespaceSensitivity": "css", // HTML 공백 감도 설정
     "jsxBracketSameLine": false, // JSX의 마지막 `>`를 다음 줄로 내릴지 여부
     "jsxSingleQuote": false, // JSX에 singe 쿼테이션 사용 여부
     "printWidth": 80, //  줄 바꿈 할 폭 길이
     "proseWrap": "preserve", // markdown 텍스트의 줄바꿈 방식 (v1.8.2)
     "quoteProps": "as-needed", // 객체 속성에 쿼테이션 적용 방식
     "semi": true, // 세미콜론 사용 여부
     "singleQuote": true, // single 쿼테이션 사용 여부
     "tabWidth": 2, // 탭 너비
     "trailingComma": "all", // 여러 줄을 사용할 때, 후행 콤마 사용 방식
     "useTabs": false, // 탭 사용 여부
     "vueIndentScriptAndStyle": true, // Vue 파일의 script와 style 태그의 들여쓰기 여부 (v1.19.0)
     "parser": "", // 사용할 parser를 지정, 자동으로 지정됨
     "filepath": "", // parser를 유추할 수 있는 파일을 지정
     "rangeStart": 0, // 포맷팅을 부분 적용할 파일의 시작 라인 지정
     "rangeEnd": Infinity, // 포맷팅 부분 적용할 파일의 끝 라인 지정,
     "requirePragma": false, // 파일 상단에 미리 정의된 주석을 작성하고 Pragma로 포맷팅 사용 여부 지정 (v1.8.0)
     "insertPragma": false, // 미리 정의된 @format marker의 사용 여부 (v1.8.0)
     "overrides": [
       {
         "files": "*.json",
         "options": {
           "printWidth": 200
         }
       }
     ] // 특정 파일별로 옵션을 다르게 지정함, ESLint 방식 사용
   }
   ```

3. VScode 설치
   마켓에서 검색후 설치
   ![](/img/post/2024/1018/2.png)

4. `command` + `shfit` + `p` 눌러서 `User Setting` 들어가서 원하는 대로설정하면됨
   ![](/img/post/2024/1018/3.png)
   ![](/img/post/2024/1018/4.png)

   ```js
   // JSON 세팅값
   {
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true // eslint가 파일이 저장될 때 자동수정
     },
     "editor.defaultFormatter": "esbenp.prettier-vscode", // 포매터로 프리티어를!
     "editor.formatOnSave": true // 포매터가 파일이 저장될 때 자동포맷을 허락한다.
   }
   ```

#### 2. ESLint 설치

ESLint를 설치하려면 다음 명령어를 실행합니다:

```bash
npm install --save-dev eslint
```

설치 후 ESLint를 설정하기 위해 다음 명령어를 실행하여 초기 설정을 완료합니다:

```bash
npx eslint --init
```

이 명령어는 몇 가지 질문을 통해 ESLint 설정 파일을 생성합니다.

#### 3. Prettier와 ESLint 함께 사용

Prettier와 ESLint를 함께 사용하기 위해 추가 패키지를 설치해야 합니다:

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

`eslint-config-prettier`는 Prettier와 ESLint의 충돌을 방지하고, `eslint-plugin-prettier`는 Prettier 규칙을 ESLint 내에서 실행하게 해줍니다.

그 후, ESLint 설정 파일인 `.eslintrc`에 다음과 같은 설정을 추가합니다:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "prettier/prettier": ["error", { "singleQuote": true, "semi": false }]
  }
}
```

이제 코드 작성 중 ESLint와 Prettier가 자동으로 코드를 검사하고, 포맷을 적용합니다.

### 사용 방법

- VSCode와 같은 에디터에서 `ESLint`와 `Prettier` 확장을 설치하여, 실시간으로 린팅 및 포맷팅을 적용할 수 있습니다.
- `package.json` 파일에 다음 스크립트를 추가하여 수동으로 실행할 수 있습니다:

```json
"scripts": {
  "lint": "eslint 'src/**/*.{js,jsx}'",
  "format": "prettier --write 'src/**/*.{js,jsx}'"
}
```

이제 `npm run lint`로 린트 작업을, `npm run format`으로 코드 포맷팅을 할 수 있습니다.
