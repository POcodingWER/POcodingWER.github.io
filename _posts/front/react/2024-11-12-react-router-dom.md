---
layout: post
title: "[React] react-router-dom 알아보고 사용하자"

subtitle: "react-router-dom 왜 쓰는 걸까하는 의문이생겼음"

date: 2024-11-12 14:14:17
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1112/react-router-dom.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - react-router-dom
  - react-router-dom setting
  - routing
---

{% include post/react/contents.md %}

---

## 라우팅을 사용하는 이유는?

라우팅을 사용하는 이유는 주로 **단일 페이지 애플리케이션(SPA)**에서 페이지를 전환하고 관리하는 데 필요하기 때문입니다. SPA는 전체 페이지를 새로고침하지 않고도 URL 경로에 맞는 콘텐츠를 동적으로 로드합니다. 라우팅을 사용하지 않으면 다음과 같은 문제점이 발생할 수 있습니다:

1. **페이지 상태 관리**:

   - 라우팅을 사용하지 않으면 사용자가 다른 페이지로 이동할 때 애플리케이션의 상태를 관리하기 어렵습니다. 예를 들어, 사용자가 페이지 간 이동 시 URL이 변경되지 않으면 뒤로 가기 버튼을 누를 수 없거나, 북마크를 할 수 없게 됩니다.

2. **URL 관리**:

   - 웹 애플리케이션에서 URL은 매우 중요합니다. 라우팅을 사용하면 각 페이지에 고유한 URL을 할당할 수 있고, 이는 사용자 경험을 향상시키는 데 도움이 됩니다. 사용자는 특정 페이지를 북마크하거나 링크를 공유할 수 있습니다.

3. **SEO (검색 엔진 최적화)**:

   - 라우팅을 적절히 설정하면 각 페이지에 고유한 URL을 할당할 수 있어, 검색 엔진이 해당 페이지를 잘 인식하고 색인할 수 있습니다. 이는 SEO에 중요한 역할을 합니다. SPA에서는 일반적으로 클라이언트 사이드 렌더링(CSR)을 사용하므로, 서버 사이드 렌더링(SSR)과 결합한 라우팅을 사용하면 SEO를 최적화할 수 있습니다.

4. **사용자 경험**:

   - 라우팅은 사용자에게 직관적이고 자연스러운 내비게이션을 제공합니다. 사용자가 URL을 변경하여 특정 페이지로 이동할 수 있도록 하며, 페이지 전환 시 애니메이션이나 부드러운 전환 효과를 적용할 수 있습니다. 이를 통해 사용자 경험을 개선할 수 있습니다.

5. **상태 및 데이터 로딩**:
   - 라우팅을 사용하면 각 페이지가 독립적으로 데이터를 로드하고 상태를 유지할 수 있습니다. 예를 들어, `react-router-dom`에서는 `Route` 컴포넌트와 같은 방법으로 경로마다 특정 컴포넌트를 로드하고 데이터를 가져오는 방식으로 페이지를 관리할 수 있습니다.

결론적으로, 라우팅은 웹 애플리케이션에서 페이지 간 네비게이션, URL 관리, SEO, 사용자 경험을 개선하는 데 필수적인 역할을 합니다. SPA에서는 페이지를 전환할 때 새로고침 없이 동적으로 콘텐츠를 업데이트할 수 있게 도와주는 중요한 개념입니다.

## react-router 란??

| **라우터**        | **장점**                                                                                           | **단점**                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **BrowserRouter** | - URL이 깔끔하고 직관적임 <br> - SEO 최적화에 유리함 <br> - `history` API를 사용하여 히스토리 관리 | - 서버 설정이 필요함 (서버에서 URL 경로를 처리할 수 있어야 함) <br> - SPA에서 페이지 새로고침 시 서버 설정이 잘못되면 404 오류 발생 가능 |
| **HashRouter**    | - 서버 설정 없이 클라이언트 측에서 라우팅 처리 가능 <br> - URL이 간단하며 추가 설정이 필요 없음    | - URL에 해시(`#`)가 포함되어 SEO에 불리함 <br> - URL이 덜 직관적이고 사용자가 혼동할 수 있음                                             |
| **MemoryRouter**  | - 주소창에 URL 표시하지 않음 <br> - 서버 설정 없이 라우팅 가능 <br> - 테스트 환경에 적합           | - URL이 주소창에 표시되지 않음 <br> - 브라우저에서 새로고침 시 상태가 유지되지 않음                                                      |

이 표는 각 라우터의 장점과 단점을 간략하게 비교한 것입니다. 각 라우터는 특정 환경에 맞게 선택하여 사용하는 것이 좋습니다.

## react-router-dom

`react-router-dom`을 사용하는 이유는 여러 가지가 있습니다. 주로 다음과 같은 장점 때문에 많은 React 프로젝트에서 선택됩니다:

1. **넓은 커뮤니티와 지원**:

   - `react-router-dom`은 React에서 가장 널리 사용되는 라우팅 라이브러리로, 매우 큰 커뮤니티와 문서, 그리고 다양한 예제들이 존재합니다. 문제가 생겼을 때 해결책을 찾기가 쉽고, 관련된 리소스가 많아 개발이 수월합니다.

2. **유연하고 강력한 기능**:

   - `react-router-dom`은 기본적인 라우팅 외에도 `nested routes`, `dynamic routes`, `redirects`, `route protection` 등 다양한 기능을 제공합니다. 이로 인해 복잡한 SPA 애플리케이션에서 필요한 라우팅 로직을 쉽게 구현할 수 있습니다.

3. **React와의 높은 호환성**:

   - `react-router-dom`은 React의 상태와 라이프사이클에 잘 맞게 설계되어 있어, React 애플리케이션의 흐름에 자연스럽게 통합됩니다. React 컴포넌트와 쉽게 연동되며, 다른 라이브러리들과도 호환이 좋습니다.

4. **파일 기반 라우팅이 아닌 구조적인 라우팅**:

   - `react-router-dom`은 컴포넌트 기반 라우팅을 제공합니다. 이는 복잡한 애플리케이션에서 라우팅을 보다 세밀하게 제어하고 관리할 수 있게 해줍니다. 예를 들어, 각 페이지 컴포넌트를 동적으로 로드하거나 조건에 따라 라우팅을 처리할 수 있습니다.

5. **문서화와 예제**:
   - `react-router-dom`의 공식 문서와 튜토리얼이 잘 정리되어 있어, 처음 시작하는 개발자부터 고급 사용자까지 쉽게 접근할 수 있습니다. 또한, 다양한 예제들이 있어 실무에 바로 적용할 수 있는 방법들을 배울 수 있습니다.

물론, `Next.js`나 `Wouter`와 같은 다른 라우팅 방식도 각기 장점이 있지만, `react-router-dom`은 여전히 그 유연성과 확장성 덕분에 많은 React 프로젝트에서 표준으로 사용되고 있습니다. 다른 라이브러리를 사용하는 것도 좋은 선택이 될 수 있지만, `react-router-dom`은 대부분의 경우 충분히 강력하고 유용한 선택입니다.

### 1. `react-router-dom` 설치하기

먼저 프로젝트에 `react-router-dom`을 설치해야 합니다. 터미널에서 다음 명령어를 실행하여 설치합니다:

```bash
npm install react-router-dom
```

### 2. 기본 사용법

#### 1) `BrowserRouter`로 애플리케이션 감싸기

라우터를 사용하려면 `BrowserRouter`로 애플리케이션을 감싸야 합니다. 이 컴포넌트는 라우팅 시스템의 기본 설정을 제공합니다. 보통 `index.js` 또는 `App.js` 파일에서 설정합니다.

```js
// index.js 또는 App.js
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```

#### 2) `Route`와 `Routes`로 페이지 설정하기

`Route` 컴포넌트를 사용하여 특정 경로(`path`)에 어떤 컴포넌트를 렌더링할지 설정합니다. `Routes` 컴포넌트는 여러 `Route`를 포함하는 컨테이너 역할을 합니다.

```js
// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import About from "./About";
import NotFound from "./NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
```

위 코드에서:

- `/` 경로로 접근하면 `Home` 컴포넌트가 렌더링됩니다.
- `/about` 경로로 접근하면 `About` 컴포넌트가 렌더링됩니다.
- 경로가 일치하지 않으면 `NotFound` 컴포넌트가 렌더링됩니다. (404 페이지)

#### 3) `Link`로 내비게이션 추가하기

`Link` 컴포넌트를 사용하여 페이지 간 이동을 할 수 있습니다. `a` 태그처럼 보이지만, 페이지를 새로고침하지 않고 라우팅을 처리합니다.

```js
// Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
```

`Link` 컴포넌트를 사용하면 브라우저가 전체 페이지를 새로고침하지 않고, 라우팅을 처리하면서 해당 경로로 이동합니다.

### 3. 추가적인 기능들

#### 1) `useNavigate`로 프로그래밍적으로 네비게이션 하기

`useNavigate` 훅을 사용하면 코드에서 직접 라우팅을 제어할 수 있습니다. 예를 들어, 버튼 클릭 시 특정 경로로 이동하고 싶을 때 유용합니다.

```js
// Example.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Example() {
  const navigate = useNavigate();

  const goToAbout = () => {
    navigate("/about");
  };

  return (
    <div>
      <button onClick={goToAbout}>Go to About Page</button>
    </div>
  );
}

export default Example;
```

#### 2) `useParams`로 동적 경로 처리하기

동적 경로를 처리하려면 `useParams` 훅을 사용하여 URL에서 변수를 추출할 수 있습니다.

```js
// User.js
import React from "react";
import { useParams } from "react-router-dom";

function User() {
  const { userId } = useParams(); // URL에서 userId를 추출

  return <div>User ID: {userId}</div>;
}

export default User;
```

```js
// App.js
<Route path="/user/:userId" element={<User />} />
```

위와 같이 설정하면 `/user/123`와 같은 URL에서 `userId`를 추출하여 해당 사용자 정보를 표시할 수 있습니다.

### 4. `react-router-dom`의 주요 컴포넌트 정리

- `BrowserRouter`: 애플리케이션을 라우팅 기능으로 감싸는 컴포넌트
- `Routes`: 여러 개의 `Route`를 감싸는 컨테이너 컴포넌트
- `Route`: 특정 경로와 해당 경로에 표시될 컴포넌트를 정의
- `Link`: 페이지 간 이동을 위한 컴포넌트
- `useNavigate`: 프로그래밍적으로 네비게이션을 제어하는 훅
- `useParams`: URL 경로에서 파라미터를 추출하는 훅

위의 내용을 참고하여 `react-router-dom`을 이용한 라우팅을 설정하면, 페이지 전환 및 내비게이션을 손쉽게 구현할 수 있습니다.

## 마무리

`react-router-dom`은 SPA에서 페이지 전환을 관리하고, URL을 제어하며, 사용자 경험을 향상시키는 데 필수적인 도구입니다. 이를 통해 라우팅을 효율적으로 구현하고, 각 페이지 간의 내비게이션을 간편하게 처리할 수 있습니다. 라우팅을 사용하면 SEO를 개선할 수 있으며, URL을 통해 특정 페이지에 접근하거나 링크를 공유하는 등의 기능을 쉽게 구현할 수 있습니다.
