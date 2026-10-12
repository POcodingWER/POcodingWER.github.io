---
layout: post
title: "[React] TanStack Start, 설치부터 Next.js 비교까지"

subtitle: "TanStack Router + Vite로 만드는 SSR. 서버 함수, 라우트별 렌더링, Next.js랑 뭐가 다른지"

date: 2026-10-12 09:10:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2026/10/tanstack_start_stack.webp"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - TanStack Start
  - TanStack Router
  - Vite
  - SSR
  - Next.js
---

{% include post/react/contents.md %}

---

> TanStack Router 위에 SSR이랑 서버 함수를 얹은 풀스택 React 프레임워크

이전 글에서 CSR / SSR / SSG / ISR을 Next.js 기준으로 정리했다. 이번 글은 그 다음 질문이다. **Next.js 말고, Vite로 SSR을 하려면 뭘 쓰면 되나.**

공식 문서 기준 TanStack Start는 아직 **Release Candidate**다. 기능은 갖춰졌고 API는 안정이라고 안내하지만, v1은 아니다. 예제 코드는 2026-10 문서 기준이다.

---

## 1. TanStack Start가 뭐냐

**한 줄 요약**: TanStack Router가 라우트를 맡고, Start가 서버 렌더링이랑 서버 함수를 붙인다. 빌드는 Vite 또는 Rsbuild.

```
TanStack Router
  라우트 트리, URL, loader, Link, pending, error boundary

TanStack Start
  SSR, streaming, server function, server route, middleware, 빌드
```

![TanStack Router, Start, Vite가 쌓인 구조](/img/post/2026/10/tanstack_start_stack.webp){: #magnific width="1280" height="720"}

Vite만 있으면 개발 서버랑 번들은 된다. SSR에 필요한 나머지는 직접 연결해야 한다.

```
직접 짜야 하는 것
  서버 엔트리
  renderToPipeableStream
  URL에 맞는 라우트
  loader 데이터 직렬화
  hydration
  서버 코드가 브라우저 번들에 안 들어가게 분리
  배포용 서버
```

Start는 이 연결을 프레임워크로 제공한다. React와 Solid를 지원한다. 이 글은 React 기준이다.

SPA만 만들 거면 Start까지 올 필요가 없다. TanStack Router만 써도 된다. SEO나 첫 HTML이 필요할 때 Start를 붙인다.

---

## 2. 왜 쓰냐

빌드가 느려서 Next.js를 버리는 도구는 아니다.

개발 서버 시작이랑 HMR은 Vite라서 빠르게 느껴질 수 있다. 프로덕션 빌드가 항상 더 빠른 건 아니다. Next.js도 Turbopack을 쓴다. 페이지가 느린 이유는 보통 DB, 캐시, 번들 크기지 번들러 이름이 아니다.

Start를 고르는 이유는 이쪽에 가깝다.

```
검색 파라미터까지 타입으로 관리하고 싶을 때
loader로 데이터 로딩을 명시하고 싶을 때
서버에서 도는 함수를 createServerFn으로 눈에 보이게 두고 싶을 때
Vite 프로젝트, TanStack Query 쪽 생태계를 유지하고 싶을 때
Vercel 한곳에 묶이지 않고 Cloudflare, Netlify, Node로 배포하고 싶을 때
```

기본 모델은 **클라이언트 컴포넌트 + 서버 함수**다. React Server Components는 실험 기능이다. Next.js App Router처럼 서버 컴포넌트가 기본인 구조로 보면 안 된다.

---

## 3. 설치

예전 `npm create @tanstack/start@latest`는 `@tanstack/create-start`를 타고, 이 패키지는 deprecated다. 지금은 TanStack CLI를 쓴다.

```bash
npx @tanstack/cli@latest create
```

패키지 매니저, React/Solid, Tailwind, ESLint 같은 추가 기능을 물어본다. 프롬프트 없이 최소 프로젝트만 만들 때는 이렇게 한다.

```bash
npx @tanstack/cli@latest create my-app --framework React --package-manager npm --blank -y
cd my-app
npm run dev
```

`--blank`는 라우트 하나짜리 최소 앱이다. 기본 템플릿 UI, Tailwind, 예제 페이지를 뺀다. SSR이 없는 SPA만 필요하면 `--router-only`다. 그건 Start가 아니다.

돌아가는 코드를 먼저 보고 싶으면 공식 basic 예제를 받는다.

```bash
npx gitpick TanStack/router/tree/main/examples/react/start-basic start-basic
cd start-basic
npm install
npm run dev
```

CLI가 만들어 주는 Vite 설정은 이 모양이다. React 플러그인은 Start 플러그인 **뒤**에 둔다.

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tanstackStart(), viteReact()],
});
```

---

## 4. 폴더가 이렇게 생긴다

```
src/
├── routes/
│   ├── __root.tsx          # html, head, body. 모든 페이지의 껍데기
│   ├── index.tsx           # /
│   └── posts/
│       └── $postId.tsx     # /posts/:postId
├── router.tsx              # createRouter, routeTree 연결
└── routeTree.gen.ts        # 파일 라우트를 보고 CLI/플러그인이 생성
```

`routeTree.gen.ts`는 직접 고치지 않는다. `src/routes`에 파일을 만들면 경로 문자열이 따라 갱신된다.

`__root.tsx`가 문서 전체를 소유한다. Next.js는 이 껍데기를 프레임워크가 많이 들고 있다. Start는 `<html>`을 라우트에서 직접 쓴다.

```tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
```

파일 이름과 URL은 이렇게 대응한다.

| URL              | 파일                           |
| ---------------- | ------------------------------ |
| `/`              | `src/routes/index.tsx`         |
| `/about`         | `src/routes/about.tsx`         |
| `/posts`         | `src/routes/posts/index.tsx`   |
| `/posts/:postId` | `src/routes/posts/$postId.tsx` |
| `/rest/*`        | `src/routes/rest/$.tsx`        |

---

## 5. 페이지부터 서버 함수까지

### 그냥 페이지

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <h1>안녕</h1>;
}
```

`createFileRoute`에 넘기는 경로 문자열은 플러그인이 파일 위치에 맞춰 관리한다. 파일을 옮기면 따라 바뀐다.

### 주소에서 데이터 읽기

```tsx
// src/routes/posts/$postId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getPost = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    // 이 함수 본체는 서버에서만 실행된다
    return { id: data.id, title: "SSR이란" };
  });

export const Route = createFileRoute("/posts/$postId")({
  loader: ({ params }) => getPost({ data: { id: params.postId } }),
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  return <h1>{post.title}</h1>;
}
```

여기서 많이 헷갈리는 지점이 있다. **loader는 서버 전용이 아니다.**

```
첫 접속 (주소창, 새로고침)
  loader가 서버에서 실행된다

이후 <Link> 이동
  같은 loader가 브라우저에서 다시 실행된다
  getPost() 호출은 이때 fetch로 바뀌어 서버 함수를 친다
```

그래서 loader 안에 `process.env.SECRET`을 직접 읽으면 브라우저 번들로 새어 나갈 수 있다. 비밀키, DB, 파일 시스템은 `createServerFn` 안이나 `.server.ts`에 둔다.

```tsx
// 이렇게 두면 안 된다
export const Route = createFileRoute("/posts")({
  loader: () => {
    const key = process.env.SECRET; // 클라이언트 번들에 들어갈 수 있음
    return fetch(`/api/posts?key=${key}`);
  },
});
```

서버 함수는 앱 안에서 부르는 RPC다. 빌드가 클라이언트 쪽 구현을 fetch 스텁으로 바꾼다. 함수를 정적 import 하는 건 안전하다. `await import(...)`로 동적 import 하면 번들러가 경계를 놓칠 수 있다.

### 앱 밖에서도 부르는 API

웹훅이나 공개 API처럼 HTTP 계약이 필요하면 server route를 쓴다. 파일은 같은 `src/routes`에 두고, `server.handlers`를 붙인다.

```tsx
// src/routes/api/posts.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/posts")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json([{ id: "1", title: "안녕" }]);
      },
    },
  },
});
```

```
createServerFn     이 앱의 loader, 컴포넌트, 클릭 핸들러가 호출
server route       외부 클라이언트, 웹훅, 공개 HTTP
```

![앱 안 호출은 createServerFn, 외부 HTTP는 server route](/img/post/2026/10/tanstack_start_server_boundary.webp){: #magnific width="1280" height="720"}

페이지 loader에서 자기 API로 `fetch("/api/posts")` 하지 않는다. SSR 때랑 클라이언트 이동 때 기준 주소가 달라서 잘 깨진다. 앱이 쓸 데이터는 서버 함수를 직접 호출한다.

### 라우트마다 SSR 끄고 켜기

기본값은 `ssr: true`다. 바꾸려면 라우트에 `ssr`을 준다.

```tsx
export const Route = createFileRoute("/posts/$postId")({
  ssr: "data-only",
  loader: ({ params }) => getPost({ data: { id: params.postId } }),
  component: PostPage, // 이 컴포넌트는 브라우저에서만 그려진다
});
```

| 값            | 서버가 하는 일                       | 화면                         |
| ------------- | ------------------------------------ | ---------------------------- |
| `true`        | loader 실행 + 컴포넌트를 HTML로 그림 | 첫 HTML에 마크업이 있음      |
| `"data-only"` | loader 데이터만 준비해서 보냄        | 컴포넌트는 브라우저에서 그림 |
| `false`       | 그 라우트는 서버에서 그리지 않음     | 브라우저에서만 그림          |

![ssr true는 HTML까지 서버, data-only는 데이터만 서버, false는 브라우저만](/img/post/2026/10/tanstack_start_ssr_modes.webp){: #magnific width="1280" height="720"}

자식 라우트는 부모보다 **더 서버를 덜 쓰는 쪽**으로만 바꿀 수 있다. 부모가 `true`면 자식은 `data-only`나 `false`가 가능하다. 부모가 `false`인데 자식만 `true`로 되돌리는 건 안 된다.

대시보드처럼 SEO가 필요 없는 화면은 `false`나 `data-only`, 글 페이지는 `true`로 나누면 된다.

---

## 6. 요청이 지나가는 순서

주소창에 `/posts/1`을 쳤을 때다.

```
브라우저 요청
    ↓
서버가 라우트 트리에서 /posts/$postId 를 찾음
    ↓
loader 실행
    ↓
getPost()는 서버 함수라 서버에서 DB/비밀키를 읽음
    ↓
React가 HTML을 만듦 (ssr: true 일 때)
    ↓
브라우저가 HTML을 먼저 그림
    ↓
hydration. 그다음부터는 같은 라우트 트리를 브라우저가 조작
    ↓
<Link>로 /posts/2 이동
    ↓
전체 새로고침 없이 loader만 다시 실행
    ↓
getPost()는 이번엔 네트워크 RPC
```

![주소창 진입은 서버 loader와 HTML, Link 이동은 RPC](/img/post/2026/10/tanstack_start_request_flow.webp){: #magnific width="1280" height="720"}

Virtual DOM이랑 Fiber는 브라우저가 트리를 그리는 층이다. Start는 그 위에 "첫 응답을 서버에서 만들지"를 정하는 층이다.

---

## 7. Next.js랑 나란히 보면

|                      | Next.js (App Router)                | TanStack Start                                                      |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| 라우팅               | `app/` 파일 기반                    | `src/routes` 파일 기반. 검색 파라미터 검증이 라우터에 들어 있음     |
| 화면의 기본          | Server Component                    | 클라이언트 컴포넌트. RSC는 실험                                     |
| 데이터 로딩          | async 컴포넌트, `fetch` 캐시        | `loader` + `createServerFn`                                         |
| 서버에서만 도는 변경 | Server Actions (`"use server"`)     | `createServerFn({ method: "POST" })`                                |
| 외부 HTTP API        | Route Handler (`route.ts`)          | `server.handlers`                                                   |
| 문서 껍데기          | 프레임워크가 많이 소유              | `__root`에서 `<html>`을 직접 작성                                   |
| 렌더링 단위          | 페이지, 레이아웃, `fetch` 캐시      | 라우트 `ssr` 옵션                                                   |
| 빌드                 | Turbopack, webpack                  | Vite 또는 Rsbuild                                                   |
| 배포                 | Vercel에 맞춰져 있고 다른 곳도 가능 | Cloudflare, Netlify, Node 등. 배포 설정을 바꿔도 라우트 코드는 유지 |
| 상태                 | 안정, 자료와 채용 시장이 큼         | RC. API 안정으로 안내, v1 전                                        |

이전 글의 렌더링 모드를 그대로 옮기면 이렇게 대응된다. **이름이 같다고 동작까지 같지는 않다.**

```
Next.js                         TanStack Start
------------------------------------------------------------
아무것도 없음 / SSR             ssr: true
"use client" 중심 CSR           ssr: false
fetch cache: "no-store"         요청마다 loader + server function
revalidate = false (SSG)        빌드 때 결과를 고정하는 static server function
revalidate = 60 (ISR)           같은 스위치는 없음
```

Next.js ISR은 `revalidate = 60` 하나로 "처음엔 정적 HTML, 60초 뒤 백그라운드 재생성"이 된다. Start에는 그 한 줄이 없다. 응답 캐시는 `Cache-Control` 헤더로 두고, 빌드 타임 고정이 필요하면 static server function을 쓴다. 개인화된 응답에 `Cache-Control: public`을 주면 다른 사용자 데이터가 캐시로 섞인다. 로그인 데이터는 `private` 또는 `no-store`다.

---

## 8. 그래서 뭘 고르면 되나

```
Next.js
  Server Component, Server Actions를 기본으로 쓰고 싶다
  Vercel 배포와 ISR이 중요하다
  검색하면 나오는 자료, 채용 공고, 운영 사례가 필요하다

TanStack Start
  라우트, 검색 파라미터, loader를 타입으로 묶고 싶다
  서버 함수 경계가 코드에 보이는 게 편하다
  Vite랑 TanStack Query를 이미 쓰고 있다
  배포 대상을 Node 한곳으로 고정하고 싶지 않다

TanStack Router만
  SEO도 첫 HTML도 필요 없는 SPA
```

사이드 프로젝트로 Start를 깔아 보는 건 충분하다. 이미 Next.js로 굴러가는 서비스를 "빌드가 더 빨라질 것 같아서" 옮기는 이유는 약하다. 옮겨야 하는 이유는 라우터 타입, loader, 서버 경계, 배포 방식 쪽이다.

---

## 9. 헷갈리기 쉬운 것

1. loader는 서버 전용이 아니다. 첫 요청은 서버, 클라이언트 이동은 브라우저.
2. 비밀값은 `createServerFn` 안에 둔다. 파일 맨 위 `process.env`는 클라이언트 번들에 들어갈 수 있고, Workers 계열에선 요청 전에 읽혀 `undefined`가 되기도 한다.
3. 앱이 쓸 데이터는 server route로 우회하지 않고 server function을 직접 호출한다.
4. RSC가 기본이 아니다.
5. RC다. 문서의 설치 명령이 예전 `create @tanstack/start`로 남아 있는 페이지가 있을 수 있다. 현재 권장은 `npx @tanstack/cli@latest create`다.

---

## 핵심 요약

| 개념             | 한 줄                                                  |
| ---------------- | ------------------------------------------------------ |
| Vite             | 개발 서버와 번들. SSR 앱 구조 자체는 아님              |
| TanStack Router  | 타입 있는 라우트, loader, 검색 파라미터                |
| TanStack Start   | 그 라우트 트리에 SSR이랑 서버 함수를 붙인 프레임워크   |
| createServerFn   | 앱 안에서 부르는 타입 있는 서버 호출                   |
| server route     | 밖에서 HTTP로 치는 엔드포인트                          |
| ssr: true        | 첫 HTML까지 서버가 그림                                |
| ssr: "data-only" | 데이터만 서버, 화면은 브라우저                         |
| ssr: false       | 그 라우트는 브라우저에서만 그림                        |
| Next.js와의 차이 | 서버 컴포넌트 기본이 아니라, loader와 서버 함수가 중심 |
