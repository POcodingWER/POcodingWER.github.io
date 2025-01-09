---
layout: post
title: "[React] ts 세팅 tsconfig.json tsconfig.app.json, tsconfig.node.json 멀까?"

subtitle: "ts setting 알고넘어가자"

date: 2024-11-12 12:54:29
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1112/ts.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - ts setting
  - ts 초기 세팅
  -
---

{% include post/react/contents.md %}

---

## 처음에 vite 세팅을 하고나면 최상이 경로에 tsconfig.json tsconfig.app.json tsconfig.node.json파일이 생성된다.

![](/img/post/2024/1112/ts.png)
3개가 생성되는데 뭐가 뭔지 모르겠다.
알고넘어가자

### 머하는지 파일??

- 📄 **tsconfig.json**  
  tsconfig.json 파일은 공통적인 설정을 정의하는 중요한 파일입니다. 주로 빌드 설정, 전역 옵션, 참조 파일 목록 등을 포함하고 있습니다.

- 📄 **tsconfig.app.json**  
  tsconfig.app.json 파일은 주로 브라우저와 관련된 옵션을 포함하고 있습니다. JSX 설정, 라이브러리, DOM 관련 옵션을 설정할 수 있습니다.

- 📄 **tsconfig.node.json**  
  tsconfig.node.json 파일은 Node.js와 관련된 옵션을 포함하고 있습니다.

| 파일명               | 설명                                                                                                       | 사용 목적                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `tsconfig.json`      | 프로젝트의 전반적인 공통 TypeScript 설정을 관리하는 기본 설정 파일                                         | 프로젝트 전체에 걸쳐 적용할 컴파일 옵션 설정 및 포함/제외 파일 설정 |
| `tsconfig.app.json`  | 애플리케이션 코드에 특정한 컴파일 옵션을 정의하는 파일. 보통 Angular나 대규모 TypeScript 프로젝트에서 사용 | 애플리케이션 소스 코드(`src` 폴더 등)만을 위한 컴파일 설정          |
| `tsconfig.node.json` | Node.js 환경에 특화된 컴파일 옵션을 정의하는 파일                                                          | 서버 측 코드와 같이 Node.js 환경에서 실행되는 코드에 맞춘 설정 적용 |

> tsconfig.json 전체설정하고  
> app.json, node.json 환경별 분리설정  
> app.json 에서는 브라우저 환경에 맞는 설정  
> node.json 에서는 Node.js 환경에 맞는 설정

## ts setting

```json
{
  "compilerOptions": {
    /* 기본 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "incremental": true /* 증분 컴파일 활성화 */,
    "target": "es5" /* ECMAScript 목표 버전 설정: 'ES3'(기본), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    "module": "esnext" /* 생성될 모듈 코드 설정: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ] /* 컴파일 과정에 사용될 라이브러리 파일 설정 */,
    "allowJs": true /* JavaScript 파일 컴파일 허용 */,
    "checkJs": true /* .js 파일 오류 리포트 설정 */,
    "jsx": "react" /* 생성될 JSX 코드 설정: 'preserve', 'react-native', or 'react'. */,
    "declaration": true /* '.d.ts' 파일 생성 설정 */,
    "declarationMap": true /* 해당하는 각 '.d.ts'파일에 대한 소스 맵 생성 */,
    "sourceMap": true /* 소스맵 '.map' 파일 생성 설정 */,
    "outFile": "./" /* 복수 파일을 묶어 하나의 파일로 출력 설정 */,
    "outDir": "./dist" /* 출력될 디렉토리 설정 */,
    "rootDir": "./" /* 입력 파일들의 루트 디렉토리 설정. --outDir 옵션을 사용해 출력 디렉토리 설정이 가능 */,
    "composite": true /* 프로젝트 컴파일 활성화 */,
    "tsBuildInfoFile": "./" /* 증분 컴파일 정보를 저장할 파일 지정 */,
    "removeComments": true /* 출력 시, 주석 제거 설정 */,
    "noEmit": true /* 출력 방출(emit) 유무 설정 */,
    "importHelpers": true /* 'tslib'로부터 헬퍼를 호출할 지 설정 */,
    "downlevelIteration": true /* 'ES5' 혹은 'ES3' 타겟 설정 시 Iterables 'for-of', 'spread', 'destructuring' 완벽 지원 설정 */,
    "isolatedModules": true /* 각 파일을 별도 모듈로 변환 ('ts.transpileModule'과 유사) */,

    /* 엄격한 유형 검사 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "strict": true /* 모든 엄격한 유형 검사 옵션 활성화 */,
    "noImplicitAny": true /* 명시적이지 않은 'any' 유형으로 표현식 및 선언 사용 시 오류 발생 */,
    "strictNullChecks": true /* 엄격한 null 검사 사용 */,
    "strictFunctionTypes": true /* 엄격한 함수 유형 검사 사용 */,
    "strictBindCallApply": true /* 엄격한 'bind', 'call', 'apply' 함수 메서드 사용 */,
    "strictPropertyInitialization": true /* 클래스에서 속성 초기화 엄격 검사 사용 */,
    "noImplicitThis": true /* 명시적이지 않은 'any'유형으로 'this' 표현식 사용 시 오류 발생 */,
    "alwaysStrict": true /* 엄격모드에서 구문 분석 후, 각 소스 파일에 "use strict" 코드를 출력 */,

    /* 추가 검사 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "noUnusedLocals": true /* 사용되지 않은 로컬이 있을 경우, 오류로 보고 */,
    "noUnusedParameters": true /* 사용되지 않은 매개변수가 있을 경우, 오류로 보고 */,
    "noImplicitReturns": true /* 함수가 값을 반환하지 않을 경우, 오류로 보고 */,
    "noFallthroughCasesInSwitch": true /* switch 문 오류 유형에 대한 오류 보고 */,
    "noUncheckedIndexedAccess": true /* 인덱스 시그니처 결과에 'undefined' 포함 */,

    /* 모듈 분석 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "moduleResolution": "node" /* 모듈 분석 방법 설정: 'node' (Node.js) 또는 'classic' (TypeScript pre-1.6). */,
    "baseUrl": "./" /* 절대 경로 모듈이 아닌, 모듈이 기본적으로 위치한 디렉토리 설정 (예: './modules-name') */,
    "paths": {} /* 'baseUrl'을 기준으로 상대 위치로 가져오기를 다시 매핑하는 항목 설정 */,
    "rootDirs": [] /* 런타임 시 프로젝트 구조를 나타내는 로트 디렉토리 목록 */,
    "typeRoots": [] /* 유형 정의를 포함할 디렉토리 목록 */,
    "types": [] /* 컴파일 시 포함될 유형 선언 파일 입력 */,
    "allowSyntheticDefaultImports": true /* 기본 출력(default export)이 없는 모듈로부터 기본 호출을 허용 (이 코드는 단지 유형 검사만 수행) */,
    "esModuleInterop": true /* 모든 가져오기에 대한 네임스페이스 객체 생성을 통해 CommonJS와 ES 모듈 간의 상호 운용성을 제공. 'allowSyntheticDefaultImports' 암시 */,
    "preserveSymlinks": true /* symlinks 실제 경로로 결정하지 않음 */,
    "allowUmdGlobalAccess": true /* 모듈에서 UMD 글로벌에 접근 허용 */,

    /* 소스맵 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "sourceRoot": "./" /* 디버거(debugger)가 소스 위치 대신 TypeScript 파일을 찾을 위치 설정 */,
    "mapRoot": "./" /* 디버거가 생성된 위치 대신 맵 파일을 찾을 위치 설정 */,
    "inlineSourceMap": true /* 하나의 인라인 소스맵을 내보내도록 설정 */,
    "inlineSources": true /* 하나의 파일 안에 소스와 소스 코드를 함께 내보내도록 설정. '--inlineSourceMap' 또는 '--sourceMap' 설정이 필요 */,

    /* 실험적인 기능 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "experimentalDecorators": true /* ES7 데코레이터(decorators) 실험 기능 지원 설정 */,
    "emitDecoratorMetadata": true /* 데코레이터를 위한 유형 메타데이터 방출 실험 기능 지원 설정 */,

    /* 고급 옵션
     * ------------------------------------------------------------------------------------------------------------------------------------------------ */
    "skipLibCheck": true /* 선언 파일 유형 검사 스킵 */,
    "forceConsistentCasingInFileNames": true /* 동일한 파일에 대한 일관되지 않은 케이스 참조를 허용하지 않음 */
  }
}
```

TypeScript의 `compilerOptions`에 설정할 수 있는 주요 옵션 값 전체를 표로 정리했습니다.

| 옵션                           | 설명                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `target`                       | 컴파일 결과물의 JavaScript 버전 지정 (`ES3`, `ES5`, `ES6/ES2015`, `ES2016`, `ES2017`, `ESNext` 등) |
| `module`                       | 모듈 시스템 설정 (`commonjs`, `amd`, `system`, `umd`, `es6/es2015`, `none` 등)                     |
| `lib`                          | 사용할 JavaScript 표준 라이브러리 설정 (`ES5`, `ES6`, `DOM`, `ESNext` 등)                          |
| `allowJs`                      | JavaScript 파일의 컴파일 허용 여부 (`true`/`false`)                                                |
| `checkJs`                      | JavaScript 파일에 타입 오류 검사를 수행할지 여부                                                   |
| `jsx`                          | JSX 구문 지원 설정 (`preserve`, `react`, `react-jsx`, `react-jsxdev`, `react-native`)              |
| `declaration`                  | 타입 정의 파일(`.d.ts`) 생성 여부 (`true`/`false`)                                                 |
| `sourceMap`                    | 디버깅을 위한 소스맵 파일 생성 여부 (`true`/`false`)                                               |
| `outFile`                      | 모든 컴파일 결과를 하나의 파일로 병합하여 출력할 파일 경로 지정                                    |
| `outDir`                       | 컴파일된 JavaScript 파일을 저장할 디렉토리 경로                                                    |
| `rootDir`                      | 컴파일 대상 TypeScript 파일들의 루트 디렉토리 지정                                                 |
| `strict`                       | 엄격한 타입 검사 모드 활성화 (`true`/`false`)                                                      |
| `strictNullChecks`             | `null` 및 `undefined` 값에 대한 엄격한 검사 여부 (`true`/`false`)                                  |
| `noImplicitAny`                | 암시적으로 `any` 타입이 되는 것을 방지 (`true`/`false`)                                            |
| `noImplicitThis`               | 암시적으로 `this` 타입을 `any`로 사용하는 것을 방지                                                |
| `alwaysStrict`                 | 엄격 모드 코드로 컴파일(`"use strict"` 추가)                                                       |
| `esModuleInterop`              | CommonJS와 ES6 모듈 간의 호환성 지원 설정                                                          |
| `allowSyntheticDefaultImports` | 기본 내보내기(import default) 지원 여부                                                            |
| `skipLibCheck`                 | 의존성 라이브러리의 타입 검사를 건너뛸지 여부                                                      |
| `incremental`                  | 증분 컴파일 활성화 (`true`/`false`), 컴파일 시간 단축                                              |
| `experimentalDecorators`       | 데코레이터 기능 활성화 (`true`/`false`)                                                            |
| `emitDecoratorMetadata`        | 데코레이터의 메타데이터를 포함하도록 설정 (`true`/`false`)                                         |
| `moduleResolution`             | 모듈을 해석하는 방식 지정 (`node`, `classic`)                                                      |
| `resolveJsonModule`            | JSON 파일을 `import`할 수 있도록 허용                                                              |
| `baseUrl`                      | 모듈 해석의 기본 경로 설정                                                                         |
| `paths`                        | 모듈 경로 별칭 설정                                                                                |
| `typeRoots`                    | 타입 정의 파일이 위치한 디렉토리 경로 지정                                                         |
| `types`                        | 포함할 타입 정의 파일 지정                                                                         |
| `removeComments`               | 컴파일된 결과물에서 주석 제거 (`true`/`false`)                                                     |
| `preserveConstEnums`           | const 열거형을 유지 (`true`/`false`)                                                               |
| `isolatedModules`              | 각 파일을 개별 모듈로 처리하여 컴파일 (`true`/`false`)                                             |

이 표는 TypeScript 프로젝트에서 `compilerOptions`의 다양한 설정 값을 요약한 것입니다. 이 옵션들은 코드 스타일과 프로젝트 요구에 맞게 조정하여 사용할 수 있습니다.

## 마무리

알고 사용해야되고 잘사용하자
