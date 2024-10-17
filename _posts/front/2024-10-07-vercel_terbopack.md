---
layout: post
title: "[Bundler] Next.js 14 Turbopack Bundler 비교 분석 및 설치"

subtitle: "Turbopack 알아보고 Bundler 비교분석 next.js13 14 비교"

date: 2024-10-07 15:25:17
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1007/turbopack.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true

tags:
  - front
  - Vercel
  - 버셀
  - Turbopack
  - 터보팩
  - 터보팩 설치
  - Rust
  - JavaScript
  - Vite
  - Turbopack vs Vite
  - Webpack
  - Next.js 14 Turbopack setting
  - Next.js 13 Vs Next.js 14
  - Bundler
  - 번들러
---

> 참고 문서
>
> - [What Is Turbopack?](https://x-team.com/blog/what-is-turbopack)
> - [Introducing Turbopack: Rust-based successor to Webpack ↦](https://changelog.com/news/introducing-turbopack-rustbased-successor-to-webpack-MbJ0)

## Turbopack 이란?

**Turbopack**은 **Vercel**에서 개발한 **Rust** 기반의 새로운 번들러로, 특히 성능을 중요시하는 대규모 애플리케이션을 위해 설계되었습니다. **Webpack**의 창시자인 **Tobias Koppers**가 개발에 참여하였으며, **Next.js 13**에서 사용됩니다. Vercel은 **Turbopack**이 개발 환경에서 **Vite**보다 10배, **Webpack**보다 700배 빠르다고 주장합니다.

Turbopack의 특징은 다음과 같습니다:

1. **Rust 기반**: Rust는 안정성과 속도 면에서 매우 뛰어난 언어로, Vercel은 이 언어를 선택함으로써 번들링 속도를 크게 향상시켰습니다.
2. **Incremental Build**: 한 번 빌드된 코드를 저장하고, 필요할 때만 재빌드하는 방식입니다. 이는 특히 대규모 애플리케이션에서 빌드 시간을 크게 줄여줍니다.
3. **Lazy Bundling**: 필요한 부분만 번들링하여, 불필요한 리소스를 줄입니다.
4. **서버 사이드 및 클라이언트 사이드에서 모두 사용 가능**: React 서버 컴포넌트를 기본적으로 지원하며, TypeScript, JSX, CSS 등의 다양한 파일 형식도 처리할 수 있습니다.

## Turbopack vs Webpack vs Vite

다음은 **Turbopack**과 다른 주요 번들러들 (**Webpack**, **Vite**) 간의 비교와 함께 사용법에 대한 간략한 설명을 표로 정리한 것입니다. 이 표는 성능, 속도, 사용법 등을 쉽게 파악할 수 있도록 도와줍니다.

| **항목**          | **Turbopack**                                    | **Webpack**                                 | **Vite**                               |
| ----------------- | ------------------------------------------------ | ------------------------------------------- | -------------------------------------- |
| **언어**          | **Rust**                                         | **JavaScript**                              | **JavaScript**                         |
| **설계 목적**     | 대규모 애플리케이션을 위한 성능 최적화           | 범용 번들러 (복잡한 설정 가능)              | 빠른 개발 환경 제공, 간단한 설정       |
| **번들링 방식**   | Lazy Bundling (필요한 부분만 번들링)             | 모든 코드 번들링                            | ES 모듈 기반, 빠른 HMR 지원            |
| **속도 비교**     | Webpack보다 700배 빠름, Vite보다 10배 빠름       | 상대적으로 느림                             | 빠른 HMR 제공, 빌드 속도도 빠름        |
| **지원 파일**     | TypeScript, JSX, CSS, React Server Components    | 모든 파일 형식 지원                         | ES 모듈, TypeScript, JSX 지원          |
| **개발 환경**     | 빠른 핫 모듈 교체(HMR), Incremental Build        | 다양한 플러그인 지원, 다소 복잡한 설정 필요 | 즉각적인 코드 반영(HMR)                |
| **프로덕션 빌드** | 아직 알파 버전으로, 완전한 프로덕션 지원 준비 중 | 프로덕션 빌드에 최적화                      | 프로덕션 빌드도 빠르게 지원            |
| **기타 특징**     | 캐시 공유 가능, 팀원 간 빠른 협업 가능           | 플러그인 기반 확장성 뛰어남                 | 단순한 설정과 사용법, 빠른 초기화 속도 |

## 설치

#### 1. **Turbopack**

**Turbopack**을 **Next.js 14**에서 사용하는 방법은 매우 간단합니다. Turbopack은 기본적으로 Next.js 14와 통합되어 있으며, **Next.js 개발 환경**에서 사용됩니다. Turbopack은 빠른 코드 업데이트와 서버 시작 속도를 제공하여 개발 중에도 성능을 크게 향상시킵니다.

#### **Turbopack**

1. **Next.js 14 설치**
   Next.js 14을 설치하기 위해, 아래 명령어를 실행합니다:

   ```bash
   npm install next@latest react@latest react-dom@latest eslint-config-next@latest
   ```

2. **개발 서버 실행**
   다음 명령어로 개발 서버를 실행할 때, Turbopack이 자동으로 사용됩니다:

   ```bash
   next dev
   ```

3. **Turbopack 활성화 옵션**
   기본적으로 Turbopack은 자동으로 활성화되지만, 명령어를 명시적으로 사용할 수도 있습니다:

   ```bash
   next dev --turbo
   ```

4. **프로덕션 빌드**
   프로덕션 빌드는 여전히 Webpack을 사용하나, 차후 Turbopack이 더 성숙해지면 프로덕션에서도 사용 가능할 예정입니다. 현재는 개발 환경에서 빠른 번들링과 코드 변경을 위한 최적화가 이루어진 상태입니다.

#### 2. **Webpack**

- **설치**: `npm install --save-dev webpack webpack-cli`
- **설정**: `webpack.config.js` 파일을 생성해 사용자의 요구에 맞게 상세 설정을 해야 합니다.
- **사용 예시**:
  ```javascript
  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
  };
  ```

#### 3. **Vite**

- **설치**: `npm create vite@latest` 명령어로 프로젝트를 생성
- **설정**: 매우 간단한 설정으로 대부분의 경우 기본 설정만으로도 충분합니다.
- **사용 예시**:
  ```javascript
  import { defineConfig } from "vite";
  export default defineConfig({
    server: {
      port: 3000,
    },
  });
  ```

## Next.js 14 vs Next.js 13

Next.js 14에서는 Turbopack이 크게 개선되어 성능과 개발 경험이 대폭 향상됩니다. 이전 버전에 비해 Next.js 14의 Turbopack은 53.3% 더 빠른 로컬 서버 시작 및 빠른 새로 고침을 통해 94.7% 더 빠른 코드 업데이트를 제공합니다. 이는 특히 속도가 중요한 대규모 애플리케이션의 경우 개발 워크플로를 더욱 원활하게 만듭니다.

Next.js 14에서 Turbopack은 5,000개 이상의 통합 테스트를 통과하여 더욱 최적화되어 더욱 뛰어난 안정성과 성능을 보장합니다. 또한 React 19 및 Server Actions와 더 잘 통합되어 수동 API 경로 없이 캐싱, 서버 측 실행 및 동적 콘텐츠 처리에 대한 더 많은 제어를 제공합니다​.[What's New in Next.js 14?](https://plainenglish.io/blog/what-is-new-in-next-14)

Next.js 14 앱을 실행할 때 기본적으로 Turbopack을 사용할 수 있으며 next dev 명령에 포함되어 있습니다. 이 업데이트는 빠르고 안정적인 번들링 및 개발 새로 고침이 필요한 개발자에게 특히 유용합니다.
자세한 내용은 다음을 확인하세요[nextjs](https://nextjs.org/blog/next-14-2).

## 마무리

#### **next.13 vs next.14 Turbopack의 주요 기능 비교**

> [Next.js 14](https://www.expertlaravel.com/blog/nextjs-14-released-upgrade-guide-new-features)  
> [What's New in Next.js 14?](https://plainenglish.io/blog/what-is-new-in-next-14)

- **빠른 코드 업데이트**: 코드 변경 시 빠르게 반영되며, **Fast Refresh** 기능을 통해 화면 갱신이 매우 빠릅니다.
- **빠른 서버 시작**: 53.3% 더 빠른 서버 시작 속도를 제공하여 대규모 애플리케이션에서도 성능이 뛰어납니다.

#### **Bundler 비교**

- **Turbopack**은 대규모 애플리케이션에서 성능 최적화가 필요한 경우에 적합하며, 속도 면에서는 가장 뛰어나지만 아직 **알파 버전**으로, 완전한 프로덕션 환경에서는 **Webpack**이나 **Vite**를 사용하는 것이 안정적입니다.
- **Webpack**은 설정이 복잡하지만 플러그인과 설정 확장성이 뛰어나며, **Vite**는 설정이 간단하고 개발 환경에서 매우 빠른 속도를 제공합니다.
