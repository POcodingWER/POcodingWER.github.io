---
layout: post
title: "[Npm] package module 만들기"

subtitle: "prettier, eslint, CI 설정하고 프로젝트에 맞게 사용하자"

date: 2025-03-27 10:35:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/03/packages/npm.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - Npm
tags:
  - npm
  - package
  - module
  - prettier
  - eslint
  - CI
  - 패키지 모듈
  - 패키지 모듈 만들기
---

{% include post/projectManagement_contents.md %}

## 📦 NPM 패키지 모듈이란?

NPM(Node Package Manager)은 JavaScript 프로그래밍 언어를 위한 패키지 관리자로, Node.js의 기본 패키지 관리 시스템입니다. 패키지 모듈은 재사용 가능한 코드 조각으로, 다른 프로젝트에서 쉽게 가져와 사용할 수 있습니다.

## 🎯 패키지 모듈을 만드는 이유

- ♻️ **코드 재사용성 증가** - 한 번 작성하고 여러 프로젝트에서 활용
- 🔧 **유지보수 향상** - 중앙화된 코드 관리로 효율적인 업데이트
- ⚙️ **프로젝트 간 일관성 유지** - 동일한 규칙과 패턴 적용
- 👥 **팀 간 협업 개선** - 명확한 인터페이스와 문서화

## 🚀 NPM 패키지 모듈 만들기

### 1️⃣ 프로젝트 초기화

```bash
mkdir my-package
cd my-package
npm init -y
```

### 2️⃣ 필요한 개발 도구 설정

```bash
# TypeScript 설치
npm install typescript --save-dev

# ESLint 설치
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev

# Prettier 설치
npm install prettier --save-dev
```

### 3️⃣ 패키지 구조 설정

```
my-package/
├── src/               # 소스 코드
│   └── index.ts       # 진입점
├── dist/              # 컴파일된 코드
├── tests/             # 테스트 파일
├── .eslintrc.js       # ESLint 설정
├── .prettierrc        # Prettier 설정
├── tsconfig.json      # TypeScript 설정
├── package.json       # 패키지 메타데이터
└── README.md          # 문서
```

![폴더구조](/img/post/2025/03/packages/folder.png)

### 4️⃣ package.json 설정

```json
{
  "name": "@username/my-package",
  "version": "1.0.0",
  "description": "My awesome package",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "publishConfig": {
    //팀내 만들시 필요
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    //팀내만들시 레파지토리 연결필요
    "type": "git",
    "url": "https://github.com/@username/my-package.git"
  },
  "scripts": {
    "build": "tsc",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "prepublishOnly": "npm run lint && npm run build",
    "test": "jest"
  },
  "keywords": [],
  "author": "Your Name",
  "license": "MIT"
}
```

1.eslint package
![패키지 구조 예시](/img/post/2025/03/packages/package_1.png)
2.prettier package
![패키지 구조 예시](/img/post/2025/03/packages/prettier.png)

### 5️⃣ 코드 개발

`src/index.ts` 파일에 패키지 코드를 작성합니다.

```ts
//eslint index.js
module.exports = {
  env: {
    browser: true,
  },
  extends: ["airbnb-base", "prettier"],
  ignorePatterns: [".eslintrc.*", "*.config.js", "*.config.ts", "*.svg"],
  rules: {
    "no-empty": ["error", { allowEmptyCatch: true }],
    "arrow-body-style": ["error", "as-needed"],
    "import/prefer-default-export": "off",
    "no-underscore-dangle": ["error", { allowFunctionParams: false }],
    "id-length": "off",
    "no-shadow": ["off"],
    "import/no-absolute-path": "off",
    "import/extensions": [
      "error",
      "never",
      {
        svg: "ignorePackages",
        css: "ignorePackages",
        json: "ignorePackages",
      },
    ],
    "class-methods-use-this": "off",
    "no-use-before-define": [
      "error",
      {
        functions: true,
        classes: true,
        variables: false,
        allowNamedExports: false,
      },
    ],
  },
};
```

```ts
//prettier index.js
// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: "all",
  printWidth: 120,
};

module.exports = config;
```

### 6️⃣ 패키지 테스트

> 💡 **TIP**: 로컬에서 패키지를 테스트하여 실제 환경에서의 동작을 확인하세요!

```bash
# 현재 디렉토리를 로컬 패키지로 링크
npm link

# 다른 프로젝트에서 로컬 패키지 사용
cd ../my-other-project
npm link my-package
```

### 7️⃣ 패키지 배포 방법

#### NPM 레지스트리에 배포

```bash
# NPM 계정 로그인
npm login

# 패키지 배포
npm publish
```

#### GitHub Packages에 배포

> 🔐 **GitHub Packages**를 사용하면 개인 Git 저장소에 패키지를 배포할 수 있습니다.

##### 1. GitHub 인증 설정하기

1. GitHub에서 Personal Access Token(PAT) 생성:

   - GitHub 계정 → Settings → Developer settings → Personal access tokens → Generate new token
   - 권한 선택: `read:packages`, `write:packages`, `delete:packages`, `repo`
   - 생성된 토큰을 안전한 곳에 복사해두세요!

![토큰 생성](/img/post/2025/03/packages/token.png)

2. npm에 GitHub 인증 설정하기:

   ```bash
   # 명령줄에서 로그인하기
   npm login --registry=https://npm.pkg.github.com

   # Username: GitHub 사용자명
   # Password: 방금 생성한 Personal Access Token
   # Email: GitHub 이메일
   ```

![npm login](/img/post/2025/03/packages/login.png)

3. 1,2번 또는 `.npmrc` 파일에 직접 인증 정보 추가:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   @USERNAME:registry=https://npm.pkg.github.com
   ```

##### 2. 패키지 설정

1. `.npmrc` 파일 생성:

   ```
   @USERNAME:registry=https://npm.pkg.github.com
   ```

2. `package.json` 수정:
   ```json
   {
     "name": "@username/my-package",
     "publishConfig": {
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```

##### 3. 배포:

```bash
npm publish
```

> ⚠️ **주의**: GitHub Packages에 배포된 패키지는 저장소 이름과 일치해야 합니다. 예를 들어, 저장소가 `username/my-repo`라면 패키지 이름은 `@username/my-repo`여야 합니다.

![npm publish](/img/post/2025/03/packages/publish.png)
![npm publish](/img/post/2025/03/packages/complete.png)

##### 4. 패키지 다운 확인

새로 생성한 패키지를 다른 프로젝트에서 설치하고 사용하는 방법을 확인해 보겠습니다.

1. 테스트용 새 프로젝트 생성:

   ```bash
   mkdir test-project
   cd test-project
   npm init -y
   ```

2. 패키지 설치:

   ```bash
   # GitHub Packages에서 설치하는 경우
   npm install @POcodingWER/eslint-config-lfe

   # 또는 특정 버전 지정
   npm install @POcodingWER/eslint-config-lfe@1.0.1
   ```

3. 패키지가 설치되었는지 확인:

   ```bash
   # package.json 확인
   cat package.json

   # node_modules 디렉토리 확인
   ls node_modules/@POcodingWER
   ```

4. 설치된 패키지 사용:

   ```javascript
   // .eslintrc.js 파일 생성
   module.exports = {
     extends: ["@POcodingWER/eslint-config-lfe"],
     // 리액트 프로젝트의 경우
     // extends: ['@POcodingWER/eslint-config-lfe/react'],
     // 타입스크립트 프로젝트의 경우
     // extends: ['@POcodingWER/eslint-config-lfe/typescript'],
   };
   ```

5. 정상 작동 확인:

   ```bash
   # ESLint 설치 (패키지의 peer dependency)
   npm install eslint --save-dev

   # ESLint 실행
   npx eslint .
   ```

> ⚠️ **GitHub Packages를 사용할 경우 주의사항**: `.npmrc` 파일을 생성하여 인증 정보를 설정해야 합니다.
>
> ```
> @POcodingWER:registry=https://npm.pkg.github.com
> //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
> ```

이제 생성한 패키지가 다른 프로젝트에서 정상적으로 사용되고 있는지 확인했습니다.

![패키지 다운 확인](/img/post/2025/03/packages/install.png)

## 🔄 패키지 모듈 관리 도구 비교

|   도구   | 장점                                                        | 단점                                         | 사용 시나리오                                              |
| :------: | :---------------------------------------------------------- | :------------------------------------------- | :--------------------------------------------------------- |
| **npm**  | • 기본 도구<br>• 넓은 생태계<br>• 사용 편의성               | • 의존성 트리 복잡<br>• 설치 속도 느림       | • 기본 프로젝트<br>• 간단한 애플리케이션                   |
| **Yarn** | • 병렬 설치<br>• 빠른 속도<br>• 캐싱 기능 향상              | • 추가 도구 필요<br>• npm과 호환성 이슈 가능 | • 대규모 프로젝트<br>• 성능이 중요한 경우                  |
| **pnpm** | • 디스크 공간 효율적<br>• 빠른 설치<br>• 깔끔한 의존성 구조 | • 호환성 이슈 가능성<br>• 학습 곡선          | • 모노레포<br>• 대규모 프로젝트<br>• 디스크 공간 제약 환경 |

## 🎁 결론

자체 패키지 모듈을 만들면 코드 재사용성과 프로젝트 관리 효율성이 크게 향상됩니다. NPM이나 GitHub Packages를 통해 패키지를 배포하여 팀 내 또는 공개적으로 공유할 수 있습니다. 프로젝트 규모와 요구사항에 따라 적절한 패키지 관리자를 선택하여 개발 워크플로우를 최적화하세요.
