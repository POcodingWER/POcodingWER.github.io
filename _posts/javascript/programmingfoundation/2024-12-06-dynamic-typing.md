---
layout: post
title: "[Programming Foundation] 동적 타이핑(Dynamic Typing)"

subtitle: "동적 타이핑"

date: 2024-12-06 10:03:58
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
# header-img: "img/post/2024/1206/js.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - Foundation
tags:
  - 동적 타이핑
---

### 동적 타이핑이란?

변수의 타입을 미리 선언하지 않고, 실행 시점에 할당된 값에 따라 자동으로 타입이 결정되는 것을 말합니다.

### 1. 기본 동적 타이핑

```javascript
// 변수 타입이 자동으로 결정됨
let value = 42; // number 타입
value = "Hello"; // string 타입으로 변경
value = true; // boolean 타입으로 변경
value = [1, 2, 3]; // array 타입으로 변경
value = null; // null
value = undefined; // undefined
value = { name: "Kim" }; // object 타입으로 변경

// 타입 확인
console.log(typeof value); // "object"
```

### 2. 타입 변환 예시

```javascript
// 자동 타입 변환 (암시적 변환)
let num = 123;
let str = "456";

console.log(num + str); // "123456" (문자열로 변환)
console.log(num - str); // -333 (숫자로 변환)
console.log("5" * "3"); // 15 (숫자로 변환)

// 명시적 타입 변환
let explicit = String(123); // "123"
let numberVal = Number("123"); // 123
let boolVal = Boolean(1); // true
```

### 3. 장단점

**장점:**

- 코드 작성이 빠르고 유연함
- 적은 양의 코드로 구현 가능
- 프로토타이핑에 유리

**단점:**

- 런타임 에러 발생 가능성 높음
- 타입 관련 버그 발견이 어려움
- 큰 프로젝트에서 유지보수가 어려울 수 있음

### 4. 실제 사용 예시와 주의사항

```javascript
// 1. 함수 매개변수
function processValue(value) {
  // 타입 체크가 필요할 수 있음
  if (typeof value === "number") {
    return value * 2;
  } else if (typeof value === "string") {
    return value.toUpperCase();
  }
  throw new Error("지원하지 않는 타입입니다.");
}

console.log(processValue(10)); // 20
console.log(processValue("hello")); // "HELLO"

// 2. 배열의 동적 타이핑
const mixedArray = [1, "two", { three: 3 }, [4, 5]];

// 3. 객체 속성의 동적 추가
const user = {
  name: "Kim",
};
user.age = 25; // 새로운 속성 동적 추가
user.sayHello = function () {
  // 메서드 동적 추가
  console.log(`Hello, ${this.name}!`);
};
```

### 5. 타입 안전성을 위한 방법

1. **타입 체크 함수 사용**

```javascript
function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

function isString(value) {
  return typeof value === "string";
}

// 사용 예시
function calculate(x, y) {
  if (!isNumber(x) || !isNumber(y)) {
    throw new Error("숫자만 입력 가능합니다.");
  }
  return x + y;
}
```

2. **TypeScript 사용**

```typescript
// TypeScript를 사용하면 정적 타입 체크 가능
let name: string = "Kim";
let age: number = 25;

interface User {
  name: string;
  age: number;
}

function greet(user: User) {
  console.log(`Hello, ${user.name}!`);
}
```

### 6. 모범 사례

1. **명시적 타입 변환 사용**

```javascript
// 좋은 예시
const userInput = "123";
const number = Number(userInput);

// 피해야 할 예시
const number = userInput * 1; // 암시적 변환
```

2. **타입 체크 습관화**

```javascript
function processUser(user) {
  // 타입과 필수 속성 체크
  if (typeof user !== "object" || user === null) {
    throw new Error("유효한 사용자 객체가 아닙니다.");
  }

  if (!user.hasOwnProperty("name")) {
    throw new Error("이름은 필수 속성입니다.");
  }

  // 처리 로직
  console.log(`처리중: ${user.name}`);
}
```

동적 타이핑은 JavaScript의 핵심 특징 중 하나이지만, 이로 인한 잠재적 문제를 방지하기 위해 적절한 타입 체크와 방어적 프로그래밍이 필요합니다.
