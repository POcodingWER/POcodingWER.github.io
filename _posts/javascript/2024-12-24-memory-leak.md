---
layout: post
title: "[JS] 메모리 릭(Memory Leak)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-24 14:48:59
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1206/js.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - JavaScript
tags:
  - js 기초
  - js 문법
  - js 기초 문법
  - js memory leak
  - js memory leak 방지
  - js 메모리 누수
---

{% include post/js_contents.md %}

# 메모리 릭(Memory Leak) 총정리 🔍

### 1. 메모리 릭이란?

프로그램에서 더 이상 필요하지 않은 메모리가 해제되지 않고 계속 남아있는 현상입니다.

### 2. 주요 발생 원인 ⚠️

1. **이벤트 리스너 미제거**

   ```javascript
   // 나쁜 예시
   element.addEventListener("click", handler);
   // 제거 안함

   // 좋은 예시
   element.addEventListener("click", handler);
   element.removeEventListener("click", handler);
   ```

2. **타이머 함수 미정리**

   ```javascript
   // 나쁜 예시
   setInterval(() => {
     // 작업
   }, 1000);

   // 좋은 예시
   const intervalId = setInterval(() => {
     // 작업
   }, 1000);
   clearInterval(intervalId); // 필요없을 때 정리
   ```

3. **불필요한 데이터 보관**

   ```javascript
   // 나쁜 예시
   const dataStore = [];
   function addData() {
     dataStore.push(newData); // 계속 쌓기만 함
   }

   // 좋은 예시
   function addData() {
     dataStore.push(newData);
     if (dataStore.length > 1000) {
       dataStore.splice(0, 100); // 오래된 데이터 정리
     }
   }
   ```

### 3. 메모리 관리 방법 ✅

1. **컴포넌트 정리**

   ```javascript
   // React 예시
   useEffect(() => {
     const timer = setInterval(() => {}, 1000);

     // 정리 함수
     return () => {
       clearInterval(timer);
     };
   }, []);
   ```

2. **이벤트 관리**

   ```javascript
   class EventManager {
     setup() {
       this.handler = this.handleEvent.bind(this);
       document.addEventListener("click", this.handler);
     }

     cleanup() {
       document.removeEventListener("click", this.handler);
     }
   }
   ```

### 4. 주의사항 🚨

1. 컴포넌트나 페이지 이동 시 정리함수 호출하기
2. 큰 데이터는 사용 후 즉시 정리하기
3. 전역 변수 사용 최소화하기
4. 이벤트 리스너는 반드시 제거하기
5. setInterval/setTimeout 사용 후 정리하기

### 5. 메모리 릭 탐지 방법 🔎

1. Chrome DevTools - Memory 탭 사용
2. Performance 모니터링
3. 개발 도구의 메모리 사용량 관찰

### 6. 좋은 코드 구조 예시

```javascript
class DataManager {
  constructor() {
    this.data = [];
    this.timers = [];
  }

  start() {
    const timer = setInterval(() => {
      this.data.push(newData);
    }, 1000);
    this.timers.push(timer);
  }

  cleanup() {
    // 타이머 정리
    this.timers.forEach((timer) => clearInterval(timer));
    this.timers = [];

    // 데이터 정리
    this.data = [];
  }
}
```

이렇게 메모리를 잘 관리하면 프로그램의 성능과 안정성을 높일 수 있습니다! 😊
