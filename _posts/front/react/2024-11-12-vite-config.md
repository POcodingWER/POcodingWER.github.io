---
layout: post
title: "[React] vite config 설정하기"

subtitle: "vite config 설정하기"

date: 2024-11-12 13:14:29
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
  - vite config
  - vite 세팅
  - vite 절대경로세팅
  - tsconfigPaths
  - tsconfigPaths()
  - vite html 세팅
  - vite 환경변수 세팅
  - vite 환경변수 동적 세팅
  - createHtmlPlugin
  - createHtmlPlugin()
---

{% include post/react/contents.md %}

---

## 절대경로세팅 tsconfigPaths()

프로젝트의 상대 경로를 깔끔하게 바꿔주는 세팅.

> 참고 문서  
> [https://www.npmjs.com/package/vite-tsconfig-paths](https://www.npmjs.com/package/vite-tsconfig-paths)

### 1. 설치

```bash
npm install vite-tsconfig-paths --save-dev
```

`vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

### 결과

- 변경전

  ![](/img/post/2024/1112/path.png){: #magnific}

- 변경후

  ![](/img/post/2024/1112/path1.png){: #magnific}
  훨씬 깔끔해진 모습

## 환경변수를 html에 동적세팅 createHtmlPlugin()

프로젝트의 env를 동적으로 html에 넣어주는 세팅.
ex) g-tag 추적 코드 심기

> 참고 문서  
> [https://www.npmjs.com/package/vite-plugin-html](https://www.npmjs.com/package/vite-plugin-html)

### 문제

html에 환경변수없이 그냥 넣어주게되면 노출도 되고 위험요소도 많고 개발환경에 따라 계속바꾸기 어렵다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
    <!-- Google tag (gtag.js) -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=<%=키값노출!!!!!!!!!%>"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "<%=키값노출!!!!!!!!!%>");
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

알아내려고하면 다 알아낼수있지만 동적으로 쓰기위해 사용했다.

### 1. 설치

```bash
npm install vite-plugin-html --save-dev
```

```ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "/",
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            GTM_ID: env.VITE_APP_GTM_ID,
          },
        },
      }),
    ],
    publicDir: "public",
  };
});
```

환경변수별로 VITE_APP_GTM_ID 키값을 다르게해주면 빌드될 때 필요한 키값이 들어가 동적으로 세팅된다.

## 마무리

절대경로 설정은 모듈을 사용안하고 ts.config에서 설정하여 사용할수도있지만 모듈사용해서 깔끔하게 사용하고
env 환경변수를 동적으로 html에 세팅하는 방법은 플러그인을 사용해서 깔끔하게 사용할수있다.
