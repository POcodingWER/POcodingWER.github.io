---
layout: post
title: "[JS] 구조 분해 할당 (Destructuring assignment)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-20 13:43:42
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
  - js destructuring assignment
---

{% include post/js_contents.md %}

구조 분해 할당! 객체나 배열의 값을 쉽게 추출할 수 있는 문법이야! 📦

### 1. 배열 구조 분해

```javascript
// 기본적인 배열 구조 분해
const numbers = [1, 2, 3];
const [a, b, c] = numbers;
console.log(a, b, c); // 1, 2, 3

// 일부만 가져오기
const [first, , third] = numbers;
console.log(first, third); // 1, 3

// 나머지 요소 가져오기
const [head, ...tail] = numbers;
console.log(head, tail); // 1, [2, 3]

// 기본값 설정
const [x = 0, y = 0, z = 0, w = 0] = [1, 2];
console.log(x, y, z, w); // 1, 2, 0, 0

// 변수 교환하기
let a1 = 1,
  b1 = 2;
[a1, b1] = [b1, a1];
console.log(a1, b1); // 2, 1
```

### 2. 객체 구조 분해

```javascript
// 기본적인 객체 구조 분해
const user = {
  name: "김코딩",
  age: 20,
  email: "kim@test.com",
};

const { name, age } = user;
console.log(name, age); // "김코딩", 20

// 새로운 변수명으로 할당
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // "김코딩", 20

// 기본값 설정
const { name, age, gender = "남성" } = user;
console.log(gender); // "남성"

// 중첩된 객체 구조 분해
const student = {
  name: "박해커",
  scores: {
    math: 90,
    science: 85,
  },
};

const {
  name,
  scores: { math, science },
} = student;
console.log(math, science); // 90, 85
```

### 3. 함수 매개변수의 구조 분해

```javascript
// 객체 매개변수 구조 분해
function printUser({ name, age, email = "없음" }) {
  console.log(`이름: ${name}, 나이: ${age}, 이메일: ${email}`);
}

printUser({ name: "김코딩", age: 20 });
// "이름: 김코딩, 나이: 20, 이메일: 없음"

// 배열 매개변수 구조 분해
function getFirstTwo([first, second]) {
  return [first, second];
}

console.log(getFirstTwo([1, 2, 3, 4])); // [1, 2]

// 복잡한 객체의 특정 데이터만 추출
function processUser({ name, age, scores: { math = 0, science = 0 } = {} }) {
  return `${name}(${age}세) - 수학: ${math}, 과학: ${science}`;
}

const result = processUser({
  name: "김코딩",
  age: 20,
  scores: { math: 90 },
});
console.log(result); // "김코딩(20세) - 수학: 90, 과학: 0"
```

### 4. 실전 활용 예제

```javascript
class DataProcessor {
  // API 응답 데이터 처리
  static processResponse(response) {
    const {
      data: {
        user: { name, email },
        posts = [],
      },
      status,
    } = response;

    return {
      userName: name,
      userEmail: email,
      postCount: posts.length,
      isSuccess: status === 200,
    };
  }

  // 설정 객체 처리
  static processConfig({
    debug = false,
    timeout = 1000,
    endpoints: { api = "/api", auth = "/auth" } = {},
  } = {}) {
    return {
      isDebug: debug,
      timeoutMs: timeout,
      urls: { api, auth },
    };
  }
}

// 사용 예시
const response = {
  data: {
    user: {
      name: "김코딩",
      email: "kim@test.com",
    },
    posts: [
      { id: 1, title: "게시글1" },
      { id: 2, title: "게시글2" },
    ],
  },
  status: 200,
};

console.log(DataProcessor.processResponse(response));
console.log(DataProcessor.processConfig({ debug: true }));
```

### 5. 유용한 패턴들

```javascript
class Utils {
  // 객체에서 필요한 속성만 추출
  static pick(object, keys) {
    return keys.reduce((picked, key) => {
      const { [key]: value } = object;
      return value !== undefined ? { ...picked, [key]: value } : picked;
    }, {});
  }

  // 객체에서 특정 속성 제외
  static omit(object, keys) {
    const { ...rest } = object;
    keys.forEach((key) => delete rest[key]);
    return rest;
  }

  // 중첩 배열 평탄화
  static flatten(arr) {
    return arr.reduce((flat, item) => {
      const [first, ...rest] = Array.isArray(item)
        ? Utils.flatten(item)
        : [item];
      return [...flat, first, ...rest];
    }, []);
  }
}

// 사용 예시
const user = {
  name: "김코딩",
  age: 20,
  email: "kim@test.com",
  password: "1234",
};

console.log(Utils.pick(user, ["name", "email"]));
// { name: "김코딩", email: "kim@test.com" }

console.log(Utils.omit(user, ["password"]));
// { name: "김코딩", age: 20, email: "kim@test.com" }

console.log(Utils.flatten([1, [2, 3], [4, [5, 6]]]));
// [1, 2, 3, 4, 5, 6]
```

### 꿀팁! 🍯

1. 필수값 체크

```javascript
function required(param) {
  throw new Error(`${param} is required!`);
}

function createUser({ name = required("name"), age = required("age") } = {}) {
  return { name, age };
}

// createUser();  // Error: name is required!
// createUser({ name: "김코딩" });  // Error: age is required!
createUser({ name: "김코딩", age: 20 }); // OK
```

2. 동적 속성 이름

```javascript
const key = "name";
const value = "김코딩";

// 객체 생성 시 동적 속성
const user = {
  [key]: value,
};

// 구조 분해 시 동적 속성
const { [key]: userName } = user;
console.log(userName); // "김코딩"
```

이제 구조 분해 할당은 마스터! 😎
코드를 더 간결하고 읽기 쉽게 만들 수 있을 거야!
