---
layout: post
title: "[React] useCallback 사용법"

subtitle: "useCallback 사용법"

date: 2024-10-31 13:41:29
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1017/SWC.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - useCallback
  - react useCallback
  - 유즈콜백 사용법
  - useCallback 사용법
  - useCallback 사용법 예제
  - useCallback 예제
---

{% include post/react/contents.md %}

---

`useCallback`는 React의 훅 중 하나로, 메모이제이션된 콜백 함수를 반환하는 역할을 합니다. `useCallback`을 활용하면 컴포넌트가 불필요하게 재렌더링되지 않도록 최적화할 수 있어 성능 향상에 유용합니다.

### 언제 `useCallback`을 사용해야 할까요?

- **함수 재생성 방지**: 컴포넌트가 재렌더링될 때마다 함수들이 새로 생성되는데, 이는 성능에 영향을 줄 수 있습니다. 특히, 자식 컴포넌트에 콜백 함수를 props로 전달할 때 `useCallback`을 사용하면 재생성을 막을 수 있습니다.
- **비용이 큰 연산 방지**: 특정 함수가 실행될 때 많은 연산을 한다면, `useCallback`을 통해 필요할 때만 해당 함수를 다시 생성하여 리소스 사용을 줄일 수 있습니다.
- **의존성 배열 사용**: `useCallback`은 의존성 배열을 사용하여, 배열 안에 정의된 값이 변경될 때만 함수를 다시 생성합니다.

### 코드 예제

- useCallback 사용하지않을때 렌더링

  ![](/img/post/2024/1031/1.gif){: #magnific}

```jsx
import React, { useState, useCallback, ChangeEvent } from "react";

// 자식 컴포넌트 추가
const TextInput = React.memo(
  ({
    value,
    onChange,
  }: {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  }) => {
    console.log("3.TextInput 컴포넌트 렌더링");
    return <input type="text" value={value} onChange={onChange} />;
  }
);

function Counter() {
  console.log("2.Counter 컴포넌트 렌더링");
  const [count, setCount] = useState < number > 0;
  const [text, setText] = useState < string > "";
  const addCount = () => {
    console.log("1. addCount 호출");
    setCount((prev) => prev + 1);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handleChange 호출");
    setText(e.target.value);
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={addCount}>Increment</button>
      <TextInput value={text} onChange={handleChange} />
    </div>
  );
}

export default Counter;
```

`addCount()` 호출하는데 컴포넌트가 렌더링되는 것을 볼수있음 그러면서 input에 입력하는 것도 렌더링되는 것을 볼수있음 불필요하게 같이 렌더링됨

- useCallback 사용

  ![](/img/post/2024/1031/2.gif){: #magnific}

```jsx
import React, { useState, useCallback, ChangeEvent } from "react";

// 자식 컴포넌트 추가
const TextInput = React.memo(
  ({
    value,
    onChange,
  }: {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  }) => {
    console.log("3.TextInput 컴포넌트 렌더링");
    return <input type="text" value={value} onChange={onChange} />;
  }
);

function Counter() {
  console.log("2.Counter 컴포넌트 렌더링");
  const [count, setCount] = useState < number > 0;
  const [text, setText] = useState < string > "";
  const addCount = () => {
    console.log("1. addCount 호출");
    setCount((prev) => prev + 1);
  };
  // useCallback 사용
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handleChange 호출");
    setText(e.target.value);
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={addCount}>Increment</button>
      <TextInput value={text} onChange={handleChange} />
    </div>
  );
}

export default Counter;
```

불필요한 렌더링이 없어져서 최적화에 좋음

네, useCallback을 사용하지 않은 버전과 사용한 버전을 비교하여 다시 작성해드리겠습니다.

```jsx:_posts/front/react/2024-10-31-useCallback.md
// useCallback 사용하지 않은 버전
function Counter() {
  // ... 기존 코드 ...

  const addCount = () => {
    console.log("1. addCount 호출");
    setCount((prev) => prev + 1);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handleChange 호출");
    setText(e.target.value);
  };

  // ... 기존 코드 ...
}

// useCallback을 사용한 버전
function Counter() {
  // ... 기존 코드 ...

  const addCount = useCallback(() => {
    console.log("1. addCount 호출");
    setCount((prev) => prev + 1);
  }, []); // 의존성 배열이 비어있으므로 컴포넌트가 마운트될 때만 함수 생성

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    console.log("handleChange 호출");
    setText(e.target.value);
  }, []); // 의존성 배열이 비어있으므로 컴포넌트가 마운트될 때만 함수 생성

  // ... 기존 코드 ...
}
```

### 주요 변경사항 설명:

1. **addCount 함수**:

   - 변경 전: 컴포넌트가 리렌더링될 때마다 새로운 함수가 생성됨
   - 변경 후: useCallback으로 메모이제이션되어 컴포넌트가 마운트될 때만 함수가 생성됨

2. **handleChange 함수**:
   - 변경 전: text가 변경될 때마다 새로운 함수가 생성됨
   - 변경 후: useCallback으로 메모이제이션되어 컴포넌트가 마운트될 때만 함수가 생성됨

이러한 변경으로 인해:

- 불필요한 함수 재생성이 방지됨
- TextInput 컴포넌트의 불필요한 리렌더링이 방지됨
- 전반적인 성능이 최적화됨

### 요약

1. **useCallback을 사용하는 경우**: 특정 함수가 자식 컴포넌트에 props로 전달되거나, 자주 호출되며 재생성 비용이 큰 경우.
2. **의존성 관리**: `useCallback`의 두 번째 인수로 의존성 배열을 전달하여, 필요한 경우에만 함수가 재생성되도록 합니다.
