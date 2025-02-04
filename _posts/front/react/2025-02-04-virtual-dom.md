---
layout: post
title: "[React] DOM이란 무엇이고? 가상 DOM이란 무엇인가?"

subtitle: "real DOM virtual DOM"

date: 2025-02-04 09:57:37
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/02/virtual_dom.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - DOM
  - virtual DOM
  - 가상 DOM
  - Diffing
  - Reconciliation
---

{% include post/react/contents.md %}

# 🌳 DOM과 Virtual DOM의 완벽 가이드

## 1. DOM (Document Object Model) 이해하기

### DOM이란?

DOM은 웹 페이지를 프로그래밍 언어가 이해할 수 있는 구조로 표현한 것이에요.

```html
<!-- 실제 HTML -->
<div class="app">
  <h1>안녕하세요</h1>
  <ul>
    <li>사과</li>
    <li>바나나</li>
  </ul>
</div>
```

이것이 트리 구조로 변환됩니다:

```
       div (class="app")
      /          \
    h1           ul
    |          /    \
"안녕하세요"   li     li
              |      |
            "사과"  "바나나"
```

### DOM의 문제점

1. **직접 조작의 비효율성**

   - DOM을 직접 수정할 때마다 브라우저는:
     - 레이아웃 계산 다시 하기
     - 리페인팅 (화면 다시 그리기)
     - 리플로우 (요소 위치와 기하학적 계산)

2. **성능 저하**

```javascript
// 비효율적인 DOM 조작의 예
for (let i = 0; i < 1000; i++) {
  document.body.innerHTML += `<div>${i}</div>`; // 매번 전체 리렌더링 발생! 😱
}
```

## 2. 🚀 Virtual DOM의 등장

### Virtual DOM이란?

- 실제 DOM의 가벼운 복사본
- JavaScript 객체 형태로 메모리에 존재
- 실제 DOM과 동일한 속성을 가지지만 실제로 화면을 그리는 능력은 없음

```javascript
// Virtual DOM의 객체 구조 예시
{
  type: 'div',
  props: {
    className: 'app',
    children: [
      {
        type: 'h1',
        props: {
          children: '안녕하세요'
        }
      },
      {
        type: 'ul',
        props: {
          children: [
            {
              type: 'li',
              props: {
                children: '사과'
              }
            },
            {
              type: 'li',
              props: {
                children: '바나나'
              }
            }
          ]
        }
      }
    ]
  }
}
```

## 3. 🔄 Diffing과 Reconciliation 프로세스

### 전체 과정

1. **상태 변경 발생**
2. **새로운 Virtual DOM 생성**
3. **Diffing 알고리즘으로 비교**
4. **Reconciliation으로 실제 DOM 업데이트**

### Diffing 알고리즘의 동작

```javascript
// 변경 전
<div className="before">
  <h1>안녕하세요</h1>
  <p>반갑습니다</p>
</div>

// 변경 후
<div className="after">
  <h1>안녕하세요</h1>
  <p>환영합니다</p>
</div>

// Diffing 결과
// 1. div의 className만 변경
// 2. h1은 변경 없음
// 3. p의 내용만 변경
```

### Reconciliation 규칙

1. **다른 타입의 엘리먼트**

   - 이전 트리를 완전히 버리고 새로운 트리 구축

2. **같은 타입의 DOM 엘리먼트**

   - 속성만 업데이트

3. **같은 타입의 컴포넌트**
   - 상태는 유지되고 props만 업데이트

```javascript
// 예시: 리스트 아이템 업데이트
// Before
<ul>
  <li key="1">첫번째</li>
  <li key="2">두번째</li>
</ul>

// After
<ul>
  <li key="2">두번째</li>
  <li key="1">첫번째</li>
</ul>

// key를 통해 순서만 변경되었다고 인식
// 전체 리렌더링 대신 위치만 변경
```

## 4. 🎯 최적화 전략

### 1. 적절한 key 사용

```javascript
// ❌ 나쁜 예
{
  items.map((item, index) => <Item key={index} />);
}

// ✅ 좋은 예
{
  items.map((item) => <Item key={item.id} />);
}
```

### 2. 불필요한 렌더링 방지

```javascript
// React.memo를 사용한 컴포넌트 최적화
const MemoizedComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>;
});
```

### 3. 상태 관리 최적화

```javascript
// ❌ 나쁜 예: 전체 객체를 상태로 관리
const [user, setUser] = useState({ name: "김철수", age: 25 });

// ✅ 좋은 예: 필요한 값만 상태로 관리
const [name, setName] = useState("김철수");
const [age, setAge] = useState(25);
```

## 5. 🎮 실제 동작 과정 시각화

1. **상태 변경**

   ```javascript
   setState({ text: "새로운 텍스트" });
   ```

2. **Virtual DOM 업데이트**

   ```javascript
   // 새로운 Virtual DOM 트리 생성
   newVirtualDOM = {
     type: "div",
     props: {
       children: "새로운 텍스트",
     },
   };
   ```

3. **Diffing**

   ```javascript
   // 변경된 부분 감지
   changes = {
     type: "UPDATE",
     path: ["props", "children"],
     value: "새로운 텍스트",
   };
   ```

4. **Reconciliation**

   ```javascript
   // 실제 DOM 업데이트
   document.querySelector("div").textContent = "새로운 텍스트";
   ```

### 1.루트 요소 유형에 따른 업데이트

![](/img/post/2025/02/diffing_1.gif)
버튼 클릭 시 상태를 변경할 때 요소와 부모가 다시 렌더링되는 방식에 주목하세요. 상태를 토글할 때 요소 유형 자체(에서 `section`로 `p`)를 변경하고, diffing 알고리즘에 따라 React는 이전 트리를 파쇄하고 변경된 요소의 루트/부모에서 새 트리를 만듭니다.

> 이제 동일한 요소 유형을 가진 비슷한 예를 살펴보겠습니다.

![](/img/post/2025/02/diffing_2.gif)
이 경우에는 요소 유형이 변경되지 않으므로 부모 요소가 아닌 요소만 다시 렌더링되는 것을 볼 수 있습니다( `<p>`로 유지됨 `<p>`).
이렇게 전체적인 과정이 이루어지며, React는 이 모든 과정을 자동으로 최적화하여 처리합니다! 🎉

### 2. prop key 기반 업데이트

![](/img/post/2025/02/diffing_3.gif)
목록 시작 부분에 새 항목을 추가할 때 모든 형제 목록 요소가 다시 렌더링되는 것을 주목하세요. 이는 `key prop을` 제공하지 않았기 때문에 Diffing이 발생하면 DOM nodes목록의 모든 요소가 업데이트되는 것처럼 보이기 때문입니다.

> 이제 prop을 사용하여 비슷한 예를 살펴보겠습니다 `key`.

![](/img/post/2025/02/diffing_4.gif)
여기에서는 각 항목에 고유한 ID를 부여했으므로 keyDiffing 중에 React가 각 요소를 구별할 수 있고 따라서 변경된 요소만 다시 렌더링합니다.

## 6.✏️ 요약

React는 이렇게 처리해요:

1. Virtual DOM에서 먼저 변경을 감지해요 (Diffing)
2. `<p>` 태그의 내용만 바뀐 것을 확인하고
3. 해당 부분만 실제 DOM에 업데이트해요 (Reconciliation)

### 🎯 이렇게 하면 뭐가 좋을까요?

1. **성능이 좋아져요**

   - 실제 DOM 조작을 최소화할 수 있어요
   - 브라우저가 덜 힘들어해요

2. **개발이 편해져요**

   - 마치 전체 페이지를 다시 그리는 것처럼 코드를 작성해도
   - React가 알아서 최적화해줘요

3. **사용자 경험이 좋아져요**
   - 화면 깜빡임이 줄어들어요
   - 더 부드러운 웹 경험을 제공할 수 있어요

### 💪 이제 우리가 할 일은?

Virtual DOM의 장점을 최대한 활용하려면:

- 컴포넌트 구조를 잘 설계하고
- 적절한 key 값을 사용하고
- 불필요한 렌더링을 방지하면 됩니다!

이렇게 하면 React와 Virtual DOM의 진정한 힘을 느낄 수 있을 거예요! 다 .
