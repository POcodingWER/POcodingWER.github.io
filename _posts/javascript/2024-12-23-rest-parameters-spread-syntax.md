---
layout: post
title: "[JS] 나머지 매개변수, 전개 구문(Rest parameters, Spread syntax)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-23 13:12:17
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1206/js.webp"
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
  - js Rest parameters
  - js Spread syntax
---

{% include post/js_contents.md %}

나머지 매개변수(...)와 전개 구문(...)! 비슷해 보이지만 다르게 사용되는 강력한 문법이야! 🚀

### 1. 나머지 매개변수 (Rest Parameters)

```javascript
// 기본적인 나머지 매개변수
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// 일반 매개변수와 함께 사용
function printUserInfo(name, age, ...hobbies) {
  console.log(`이름: ${name}`);
  console.log(`나이: ${age}`);
  console.log(`취미: ${hobbies.join(", ")}`);
}

printUserInfo("김코딩", 20, "게임", "독서", "운동");
// 이름: 김코딩
// 나이: 20
// 취미: 게임, 독서, 운동
```

### 2. 전개 구문 (Spread Syntax)

```javascript
// 배열 전개
const numbers = [1, 2, 3];
const moreNumbers = [...numbers, 4, 5]; // [1, 2, 3, 4, 5]

// 배열 합치기
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4]

// 객체 전개
const user = {
  name: "김코딩",
  age: 20,
};

const userWithEmail = {
  ...user,
  email: "kim@test.com",
};

// 객체 합치기 (후자 우선)
const defaults = { theme: "light", lang: "kr" };
const custom = { theme: "dark" };
const settings = { ...defaults, ...custom };
// { theme: "dark", lang: "kr" }
```

### 3. 실전 활용 예제

```javascript
class DataHandler {
  // 여러 개의 필터 조건 처리
  static filterItems(items, ...filters) {
    return items.filter((item) => filters.every((filter) => filter(item)));
  }

  // 객체 병합과 업데이트
  static updateConfig(baseConfig, ...updates) {
    return Object.assign({}, baseConfig, ...updates);
  }

  // 배열 조작 유틸리티
  static arrayUtils = {
    // 배열 요소 삽입
    insert(arr, index, ...elements) {
      return [...arr.slice(0, index), ...elements, ...arr.slice(index)];
    },

    // 중복 제거
    unique(...arrays) {
      return [...new Set([].concat(...arrays))];
    },
  };
}

// 사용 예시
const numbers = [1, 2, 3, 4, 5, 6];
const isEven = (num) => num % 2 === 0;
const isGreaterThan3 = (num) => num > 3;

console.log(DataHandler.filterItems(numbers, isEven, isGreaterThan3));
// [4, 6]

const baseConfig = { debug: false, theme: "light" };
const update1 = { theme: "dark" };
const update2 = { debug: true };

console.log(DataHandler.updateConfig(baseConfig, update1, update2));
// { debug: true, theme: "dark" }

const arr = [1, 2, 3];
console.log(DataHandler.arrayUtils.insert(arr, 1, "a", "b"));
// [1, 'a', 'b', 2, 3]

console.log(DataHandler.arrayUtils.unique([1, 2], [2, 3], [3, 4]));
// [1, 2, 3, 4]
```

### 4. 함수형 프로그래밍 활용

```javascript
class FunctionalUtils {
  // 커링과 부분 적용
  static partial(fn, ...args) {
    return (...moreArgs) => fn(...args, ...moreArgs);
  }

  // 파이프라인 (함수 합성)
  static pipe(...fns) {
    return (x) => fns.reduce((v, fn) => fn(v), x);
  }

  // 여러 함수 조합
  static compose(...fns) {
    return (x) => fns.reduceRight((v, fn) => fn(v), x);
  }
}

// 사용 예시
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const addFive = FunctionalUtils.partial(add, 5);
console.log(addFive(3)); // 8

const pipeline = FunctionalUtils.pipe(
  (x) => x + 1,
  (x) => x * 2,
  (x) => `결과: ${x}`
);
console.log(pipeline(5)); // "결과: 12"
```

### 5. 클래스와 함께 사용

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 이벤트 리스너 등록
  on(event, ...listeners) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(...listeners);
  }

  // 이벤트 발생
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => {
        listener(...args);
      });
    }
  }
}

// 사용 예시
const emitter = new EventEmitter();

emitter.on(
  "userLogin",
  (user) => console.log(`${user} 로그인!`),
  (user) => console.log(`${user}의 로그인 시간 기록`)
);

emitter.emit("userLogin", "김코딩");
// "김코딩 로그인!"
// "김코딩의 로그인 시간 기록"
```

### 꿀팁! 🍯

1. 배열 복사와 수정

```javascript
// 배열의 특정 위치에 요소 추가
const insert = (arr, index, ...items) => [
  ...arr.slice(0, index),
  ...items,
  ...arr.slice(index),
];

// 배열의 특정 위치의 요소 제거
const remove = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];

const numbers = [1, 2, 3, 4];
console.log(insert(numbers, 2, "a", "b")); // [1, 2, 'a', 'b', 3, 4]
console.log(remove(numbers, 1)); // [1, 3, 4]
```

2. 객체 복사와 수정

```javascript
// 특정 속성 제외하고 복사
const omit = (obj, ...keys) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

const user = {
  name: "김코딩",
  age: 20,
  password: "1234",
};

console.log(omit(user, "password"));
// { name: "김코딩", age: 20 }
```

이제 나머지 매개변수와 전개 구문은 마스터! 😎
코드를 더 유연하고 간결하게 작성할 수 있을 거야!
