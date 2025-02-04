---
layout: post
title: "[JS] 클로저(Closure) 생성자함수 (new Function) 비교"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2025-02-04 09:35:59
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
  - js 클로저
  - js 생성자함수
  - js 클로저 생성자함수
  - js Closure
  - new Function
---

{% include post/js_contents.md %}

### 1. 일반 함수로 클로저 만들기

```javascript
function createCounter() {
  let count = 0; // private 변수처럼 동작

  return {
    increase: function () {
      return ++count;
    },
    decrease: function () {
      return --count;
    },
    getCount: function () {
      return count;
    },
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1.getCount()); // 0
counter1.increase(); // 1
console.log(counter2.getCount()); // 0 (독립적인 스코프)
```

### 2. new 생성자 함수로 만들기

```javascript
function Counter() {
  let count = 0; // private 변수처럼 동작

  this.increase = function () {
    return ++count;
  };

  this.decrease = function () {
    return --count;
  };

  this.getCount = function () {
    return count;
  };
}

const counter1 = new Counter();
const counter2 = new Counter();

console.log(counter1.getCount()); // 0
counter1.increase(); // 1
console.log(counter2.getCount()); // 0 (독립적인 스코프)
```

### 주요 차이점

1. **this 바인딩**

```javascript
// 일반 함수
function createCounter() {
  let count = 0;
  return {
    increase() {
      return ++count;
    },
  };
}

// new 생성자 함수
function Counter() {
  let count = 0;
  this.increase = function () {
    return ++count;
  };
}

// this 바인딩 차이 확인
const counter1 = createCounter();
const counter2 = new Counter();

console.log(counter1.constructor); // Object
console.log(counter2.constructor); // Counter
```

2. **프로토타입 체인**

```javascript
function Counter() {
  let count = 0;
  this.increase = function () {
    return ++count;
  };
}

// 프로토타입에 메서드 추가 가능
Counter.prototype.sayHello = function () {
  console.log("Hello!");
};

const counter = new Counter();
counter.sayHello(); // "Hello!" 출력

// 일반 함수는 프로토타입 체인 사용 불가
const regularCounter = createCounter();
// regularCounter.sayHello(); // Error!
```

3. **메모리 사용**

```javascript
// 프로토타입을 이용한 메모리 효율적인 방법
function CounterEfficient() {
    let count = 0;
    this.getCount = function() { return count; };
}

// 공통 메서드는 프로토타입에 정의
CounterEfficient.prototype.increase = function() {
    return ++this.getCount();
};

const counter1 = new CounterEfficient();
const counter2 = new CounterEfficient();
// increase 메서드는 프로토타입에서 공유됨
```

### 정리

1. **일반 함수 클로저의 장점**

- 더 간단하고 직관적
- 객체 리터럴을 반환하므로 구현이 명확
- private 데이터 캡슐화가 자연스러움

2. **new 생성자 함수의 장점**

- 프로토타입을 통한 메서드 공유 가능
- instanceof 연산자 사용 가능
- 생성자 함수임을 명확히 알 수 있음
- this를 통한 확장성이 좋음

3. **사용 시기**

- 단순한 클로저가 필요할 때 → 일반 함수
- 인스턴스 생성과 프로토타입 상속이 필요할 때 → new 생성자 함수
- 메모리 효율성이 중요할 때 → new 생성자 함수 + 프로토타입
