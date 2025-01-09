---
layout: post
title: "[React] Context API"

subtitle: "context api 사용하여 컴포넌트 간의 데이터를 효율적으로 공유하기"

date: 2024-11-21 13:03:56
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1121/context.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - Context API
  - 리엑트 컨텍스트 API
  - 리엑트 컨텍스트 API 예제
---

{% include post/react/contents.md %}

---

## Context API?

Context API는 React에서 컴포넌트 간의 데이터를 효율적으로 공유하기 위해 제공되는 내장 기능입니다. 주로 컴포넌트 트리의 깊은 단계에 있는 컴포넌트로 데이터를 전달할 때 유용하며, prop drilling(여러 단계의 props 전달)을 피할 수 있도록 도와줍니다.

### 주요 개념

1. **Context 생성**  
   `React.createContext()`를 사용하여 Context를 생성합니다. 생성된 Context는 Provider와 Consumer라는 두 가지 주요 컴포넌트를 제공합니다.

2. **Provider**  
    Context의 데이터를 정의하고 하위 컴포넌트에 이를 전달합니다. `Provider`는 `value`라는 prop을 받아 이 값을 모든 하위 구독자(Consumer)에게 전달합니다.
   {% raw %}

   ```jsx
   const MyContext = React.createContext();

   function App() {
     return (
       <MyContext.Provider value={{ user: "Alice" }}>
         <MyComponent />
       </MyContext.Provider>
     );
   }
   ```

   {% endraw %}

3. **Consumer**  
   Provider로부터 전달된 데이터를 사용하는 방법 중 하나입니다. 하지만 요즘은 React에서 **useContext Hook**을 사용하는 것이 일반적입니다.

   ```jsx
   function MyComponent() {
     return (
       <MyContext.Consumer>
         {(value) => <div>User: {value.user}</div>}
       </MyContext.Consumer>
     );
   }
   ```

4. **useContext Hook**  
   Functional Component에서 Context를 간단하게 사용할 수 있도록 React 16.8 버전에서 도입된 Hook입니다.

   ```jsx
   import { useContext } from "react";

   function MyComponent() {
     const context = useContext(MyContext);
     return <div>User: {context.user}</div>;
   }
   ```

### Context API를 사용하는 이유

1. **Prop Drilling 방지**  
   데이터를 여러 단계의 컴포넌트를 거쳐 전달하지 않아도 되므로 코드가 간결해집니다.

2. **전역 상태 관리**  
   작은 규모의 애플리케이션에서 Redux나 Zustand 같은 별도의 상태 관리 라이브러리를 도입하지 않고도 전역 상태를 관리할 수 있습니다.

### 언제 Context API를 사용해야 할까?

- **전역 상태가 필요한 경우**  
  사용자 인증 정보, 테마 설정, 언어 설정 등 애플리케이션 전반에서 자주 사용되는 데이터를 관리할 때 적합합니다.

- 하지만 상태가 복잡해지거나 여러 Context를 동시에 사용할 경우 Redux, Zustand 같은 상태 관리 라이브러리가 더 나은 선택일 수 있습니다.

### 장점

- 간단하고 내장된 기능이므로 추가적인 라이브러리가 필요 없습니다.
- prop drilling 문제를 해결합니다.

### 단점

- Context를 남발하면 컴포넌트 재사용성이 떨어질 수 있습니다.
- Context 값이 변경되면 해당 Context를 구독하는 모든 컴포넌트가 다시 렌더링되므로 성능에 영향을 줄 수 있습니다.

위 내용을 바탕으로 프로젝트의 필요에 맞게 Context API를 도입해보세요! 😊

## 커스터마이징

프로젝트 구조

```text
프로젝트 루트/
├── src/
│ ├── App.context.tsx # 컨텍스트 및 프로바이더 정의
│ ├── App.tsx # 메인 앱 컴포넌트
│ ├── components/
│ │ └── AlertModal/
│ │ └── AlertModal.tsx # 알럿 모달 컴포넌트
│ └── pages/
│ └── home.tsx # 홈 페이지 컴포넌트
```

1. app.context.tsx 안에 프로바이더와 컨텍스를 생성하고 거기서 컨트롤할수있게 하면 전체 페이지내에서 사용가능하게 할수있다.

```tsx
import {
  createContext,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export const AppContext = createContext<{
  alertModal: {
    isOpen: boolean;
    title: string;
    message: string;
    confirm: () => void;
  };
  setAlertModal: Dispatch<
    SetStateAction<{
      isOpen: boolean;
      title: string;
      message: string;
      confirm: () => void;
    }>
  >;
}>({
  alertModal: {
    isOpen: false,
    title: "",
    message: "",
    confirm: () => {},
  },
  setAlertModal: () => {},
});

export const AppProvider = ({ children }: { children: JSX.Element }) => {
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirm: () => {},
  });

  const value = useMemo(
    () => ({ alertModal, setAlertModal }),
    [alertModal, setAlertModal]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

2. app.tsx 안에 프로바이더를 넣어주면 전체 페이지내에서 사용가능하게 할수있다.

```tsx
import { AppContext, AppProvider } from "@App.context";
import AlertModal from "@components/AlertModal/AlertModal";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

function AppLayout() {
  const { alertModal, commonModal } = useContext(AppContext);

  return (
    <div className="layout">
      <Outlet />
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        confirm={alertModal.confirm}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

export default App;
```

3. 컨텍스트를 사용하는 컴포넌트에서는 useContext를 사용하여 컨텍스트를 가져와 사용할수있다.

pages/home.tsx

```tsx
import { useContext } from "react";
import { AppContext } from "@App.context";

function Home() {
  const { alertModal, setAlertModal } = useContext(AppContext);
  return (
    <button
      onClick={() => {
        setAlertModal({
          isOpen: true,
          title: t("alert_equipmentInUse"),
          message: t("alert_useOtherEquipment"),
          confirm: () => {
            setAlertModal({
              isOpen: false,
              title: "title",
              message: "message",
              confirm: () => {},
            });
          },
        });
      }}
    >
      Home
    </button>
  );
}
```

필요한 페이에서 찾아서 호출해서 사용하면된다.

## 마무리

간단한예제를 사용하여 커스터마이징 해보았는데 usememo등등 사용해보면서 적용해보면 훨씬유용하게 사용할수있을거같음
그리고 page별로 나누어서 필요한 페이지에서 감싸서 사용하면 편리하게 사용할수있을거 같음
