---
layout: post
title: "[React] child 컴포넌트에서 함수호출하기"

subtitle: "vue Vnode처럼 react 사용해보기"

date: 2024-10-22 13:32:29
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

tags:
  - React Vnode
  - component function
  - 컴포넌트 함수호출
  - React Refs
  - ref
  - forwardRef
  - useImperativeHandle
  - childRef.current
---

{% include post/react/contents.md %}

---

## 이슈

컴포넌트에서 함수를 만들고 사용할수있을까하는 의문이 생겼음 방법은다양하겠지만 context랑 provider사용할수도있고? 필자는 vue처럼 ref적용후 끌어와서 쓰고싶어졌음

### 사용방법

1. Child구성 요소를 .으로 묶습니다 `forwardRef`.
1. `useImperativeHandle`자식에 있는 후크를 사용하여 .에 함수를 추가합니다 Child.
1. ref를 사용하여 부모에서 자식 함수를 호출합니다. ( 예: childRef.current.childFunction()

```js
//app.js
import { forwardRef, useImperativeHandle, useRef } from "react";

const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    childFunction1() {
      console.log("child function 1 called");
    },
    childFunction2() {
      console.log("child function 2 called");
    },
  }));

  return (
    <div>
      <h2>child content</h2>
    </div>
  );
});

export default function Parent() {
  const childRef = useRef(null);

  const handleClick = () => {
    childRef.current.childFunction1();

    childRef.current.childFunction2();
  };

  return (
    <div>
      <Child ref={childRef} />

      <h2>parent content</h2>

      <button onClick={handleClick}>Call child functions</button>
    </div>
  );
}
```

너무쉽다.

## 마무리

쉽게쓸수있고 컴포넌트 안에서만 사용한다면 좋은 훅일수있다고 생각한다
