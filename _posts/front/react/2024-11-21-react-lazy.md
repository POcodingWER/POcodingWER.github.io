---
layout: post
title: "[React] react lazy 지연로딩 예제"

subtitle: "react lazy 사용하여 컴포넌트 간의 데이터를 효율적으로 공유하기"

date: 2024-11-21 13:46:56
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1121/lazy.gif"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - React Guide
tags:
  - React
  - react lazy
  - 리엑트 지연로딩
  - 리엑트 지연로딩 예제
  - 리엑트 지연로딩 장점
  - 리엑트 지연로딩 주의사항
  - 리엑트 지연로딩 언제 사용하면 좋을까?
---

{% include post/react/contents.md %}

---

React의 **`React.lazy`**는 코드 스플리팅(Code Splitting)을 통해 애플리케이션의 성능을 최적화하기 위한 기능입니다. 컴포넌트를 미리 로드하지 않고 필요할 때 동적으로 불러올 수 있도록 도와줍니다. 이를 통해 초기 로딩 속도를 개선하고 사용자가 특정 페이지나 기능을 요청할 때만 관련 코드를 로드하게 됩니다.

---

### **기본 문법**

```jsx
const HeavyComponent = React.lazy(() => import("./components/HeavyComponent"));
```

`React.lazy`는 동적 `import()`를 사용해 비동기적으로 컴포넌트를 로드합니다. 이는 JavaScript의 **코드 스플리팅**을 구현하는 데 중요한 역할을 합니다.

---

### **사용 방법**

`React.lazy`를 사용할 때, Suspense 컴포넌트를 함께 사용해야 합니다. Suspense는 lazy 컴포넌트가 로드될 때까지 **로딩 상태를 표시**할 수 있는 fallback UI를 제공합니다.

```jsx
import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";

// 지연 로딩할 컴포넌트를 lazy로 import
const HeavyComponent = React.lazy(() => import("./components/HeavyComponent"));

function App() {
  const [showComponent, setShowComponent] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "20px",
      }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowComponent(!showComponent)}
        style={{
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        컴포넌트 {showComponent ? "숨기기" : "보이기"}
      </motion.button>

      <Suspense fallback={<div>로딩중...</div>}>
        {showComponent && <HeavyComponent />}
      </Suspense>
    </div>
  );
}

export default App;
```

![react lazy](/img/post/2024/1121/lazy.gif)
금방 로딩이 되어 크롬에서 네트워크속도를 낮추어 실행해보았음

- **`React.lazy()`**: 컴포넌트를 동적으로 가져오기 위한 함수.
- **`Suspense`**: lazy로 불러온 컴포넌트가 로드될 때 보여줄 fallback UI를 지정.

---

### **장점**

1. **초기 로딩 속도 개선**  
   필요한 코드만 로드하기 때문에 초기 번들 크기가 작아지고 로딩 시간이 줄어듭니다.

2. **코드 스플리팅 자동화**  
   Webpack과 같은 번들러가 `import()`를 감지하여 자동으로 코드 스플리팅을 수행합니다.

3. **사용자 경험 향상**  
   로딩 화면을 제공함으로써 사용자가 애플리케이션이 멈췄다고 느끼는 것을 방지합니다.

---

### **주의사항**

1. **서버 사이드 렌더링(SSR)**  
   React.lazy는 클라이언트 사이드 렌더링(CSR)에서만 동작합니다. 서버 사이드 렌더링 환경에서는 대체 로직이 필요합니다.

2. **Error Boundary 필요**  
   lazy로 로드하는 컴포넌트에서 오류가 발생할 경우 애플리케이션이 중단될 수 있으므로 **Error Boundary**를 설정하는 것이 좋습니다.

   ```jsx
   import React, { Suspense } from "react";

   const LazyComponent = React.lazy(() => import("./LazyComponent"));

   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false };
     }

     static getDerivedStateFromError(error) {
       return { hasError: true };
     }

     render() {
       if (this.state.hasError) {
         return <h1>Something went wrong.</h1>;
       }
       return this.props.children;
     }
   }

   function App() {
     return (
       <ErrorBoundary>
         <Suspense fallback={<div>Loading...</div>}>
           <LazyComponent />
         </Suspense>
       </ErrorBoundary>
     );
   }
   ```

3. **Fallback UI**  
   fallback UI를 지정하지 않으면 사용자에게 로딩 중이라는 피드백이 제공되지 않아 불편을 줄 수 있습니다.

---

### **언제 사용하면 좋을까?**

- **라우팅이 많은 애플리케이션**: 페이지 단위로 코드를 분리할 때 적합합니다.
- **대형 컴포넌트**: 자주 사용되지 않거나 초기 화면에 필요하지 않은 컴포넌트는 lazy 로드하는 것이 좋습니다.
- **모듈화된 라이브러리**: 특정 시점에만 필요한 외부 라이브러리의 로드에도 유용합니다.

---

`React.lazy`는 애플리케이션의 성능 최적화와 사용자 경험 개선에 강력한 도구입니다. 필요에 따라 활용해 보세요! 😊
