---
layout: post
title: "[FRONT] 인터섹션 옵저버로 인터섹션 여부 감지하기"

subtitle: "인터섹션 여부 감지하기"

date: 2024-11-12 09:57:51
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1112/observer.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - FRONT
tags:
  - front
  - 간단예제
  - 인터섹션 옵저버
  - IntersectionObserver
  - 인터섹션 옵저버 예제
  - IntersectionObserver example
---

> [참고문서 MDN](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)

## IntersectionObserver 란?

`Intersection Observer API`는 성능 문제를 해결하기 위해 2016년 4월 구글 개발자 페이지를 통해 소개된 API로, 브라우저의 뷰포트와 특정 요소가 겹치는지를 감지하는 기능을 제공합니다. 이를 통해 특정 요소가 사용자의 화면에 보이는지 여부를 효율적으로 구분할 수 있습니다.

이 API는 비동기적으로 실행되기 때문에, 요소의 변화를 감지하면서도 메인 스레드의 성능에 영향을 주지 않습니다. 즉, 스크롤과 같은 이벤트 기반 요소를 감지할 때 발생할 수 있는 렌더링 성능 저하나 불필요한 이벤트 호출 문제를 해결해 줍니다. 또한, `IntersectionObserverEntry`의 속성을 사용하여 요소의 위치를 확인할 수 있기 때문에 `getBoundingClientRect()`를 사용하는 것보다 리플로우(reflow) 현상을 줄이는 데 도움이 됩니다.

### Intersection Observer의 주요 사용 사례

MDN에서는 Intersection Observer를 다음과 같은 상황에서 활용할 수 있다고 설명하고 있습니다:

1. **페이지 스크롤 시 요소 감지**: 특정 요소가 스크롤을 통해 화면에 등장하거나 사라지는 순간을 감지할 수 있습니다.
2. **지연 로딩(Lazy Loading)**: 스크롤을 따라 화면에 표시될 때 이미지를 로드하거나, 콘텐츠를 로드하여 불필요한 리소스 로딩을 방지할 수 있습니다.
3. **무한 스크롤(Infinite Scroll)**: 사용자가 페이지를 스크롤할 때 더 많은 콘텐츠를 동적으로 로드하고 렌더링하여, 페이지를 넘기지 않고도 연속적인 콘텐츠를 제공할 수 있습니다.
4. **광고 노출도 분석**: 광고가 실제로 사용자에게 노출된 횟수를 추적하여 광고 수익 계산에 활용할 수 있습니다.
5. **조건부 애니메이션**: 요소가 사용자 화면에 보일 때만 애니메이션을 실행하는 등, 화면 내 요소의 가시성 여부에 따라 특정 동작을 수행할 수 있습니다.

`Intersection Observer API`는 웹 성능 최적화와 사용성 개선을 위한 중요한 도구로, 특히 스크롤 기반 인터랙션이나 콘텐츠 로딩을 최적화할 때 매우 유용합니다.

## 간단예제

{% raw %}

```jsx
import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          } else {
            entry.target.classList.remove("fade-in");
          }
        });
      },
      { threshold: 0.5 } // 10%가 보일 때 트리거
    );

    document.querySelectorAll(".box").forEach((box) => {
      observer.observe(box);
    });

    return () => {
      document.querySelectorAll(".box").forEach((box) => {
        observer.unobserve(box);
      });
    };
  }, []);

  return (
    <>
      <h1>Vite + React</h1>
      <div style={{ height: "100vh" }}>스크롤 해주세요</div>
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      ></div
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div
        className="box"
        style={{
          width: "400px",
          height: "400px",
          opacity: 0,
          backgroundColor: "white",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      <div style={{ height: "100vh" }}>더 스크롤 해주세요</div>
    </>
  );
}

export default App;
```

{% endraw %}

### 설명

![](/img/post/2024/1112/scroll.gif)

```jsx
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      } else {
        entry.target.classList.remove("fade-in");
      }
    });
  },
  { threshold: 0.5 } // 50%가 보일 때 트리거
);
```

> `threshold`를 입력해서 몇퍼센트가 보일 때 트리거 할지 설정할 수 있음
