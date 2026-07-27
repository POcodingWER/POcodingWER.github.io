---
layout: post
title: "[JS] Generator"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-23 13:52:24
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
  - js generator
---

{% include post/js_contents.md %}

Generator는 함수의 실행을 중간에 멈췄다가 다시 시작할 수 있는 특별한 함수야! 🎯

### 1. Generator 기본

```javascript
// Generator 함수 선언 (function* 사용)
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

// Generator 사용
const generator = numberGenerator();

console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { value: undefined, done: true }

// for...of로 사용
for (const num of numberGenerator()) {
  console.log(num); // 1, 2, 3
}
```

### 2. 값 전달하기

```javascript
function* twoWayGenerator() {
  const a = yield 1; // 첫 번째 next()의 반환값, 두 번째 next()의 인자
  console.log("a:", a);

  const b = yield 2; // 두 번째 next()의 반환값, 세 번째 next()의 인자
  console.log("b:", b);

  return 3; // 마지막 next()의 반환값
}

const gen = twoWayGenerator();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next("hello")); // { value: 2, done: false }, 출력: a: hello
console.log(gen.next("world")); // { value: 3, done: true }, 출력: b: world
```

### 3. 비동기 처리

```javascript
// Promise를 yield하는 Generator
function* fetchUserGenerator() {
  try {
    const user = yield fetch("https://api.example.com/user");
    const profile = yield fetch(`https://api.example.com/profile/${user.id}`);

    return profile;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Generator 실행기
function runGenerator(generator) {
  const gen = generator();

  function handle(result) {
    if (result.done) return Promise.resolve(result.value);

    return Promise.resolve(result.value)
      .then((res) => res.json())
      .then((data) => handle(gen.next(data)))
      .catch((error) => handle(gen.throw(error)));
  }

  return handle(gen.next());
}

// 사용
runGenerator(fetchUserGenerator)
  .then((profile) => console.log(profile))
  .catch((error) => console.error(error));
```

### 4. 이터레이터 구현

```javascript
class Collection {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  *[Symbol.iterator]() {
    for (const item of this.items) {
      yield item;
    }
  }
}

const collection = new Collection();
collection.add("A");
collection.add("B");
collection.add("C");

// for...of 사용 가능
for (const item of collection) {
  console.log(item); // "A", "B", "C"
}

// 전개 구문 사용 가능
console.log([...collection]); // ["A", "B", "C"]
```

### 5. 무한 시퀀스

```javascript
// 무한 피보나치 수열
function* fibonacci() {
  let prev = 0,
    curr = 1;

  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

// 처음 5개의 피보나치 수
const fib = fibonacci();
for (let i = 0; i < 5; i++) {
  console.log(fib.next().value); // 1, 1, 2, 3, 5
}

// 범위 생성기
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

// 범위 사용
for (const num of range(0, 10, 2)) {
  console.log(num); // 0, 2, 4, 6, 8, 10
}
```

### 6. 실전 예제: 페이지네이션

```javascript
class DataSource {
  constructor() {
    this.data = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
  }

  *paginate(pageSize = 10) {
    for (let i = 0; i < this.data.length; i += pageSize) {
      yield this.data.slice(i, i + pageSize);
    }
  }
}

// 사용 예시
const ds = new DataSource();
const paginator = ds.paginate(10);

// 첫 번째 페이지
console.log(paginator.next().value); // ["Item 1", ..., "Item 10"]

// 두 번째 페이지
console.log(paginator.next().value); // ["Item 11", ..., "Item 20"]

// 모든 페이지 순회
for (const page of ds.paginate(10)) {
  console.log("페이지:", page);
}
```

### 7. Generator 조합

```javascript
function* generateAlpha() {
  yield "A";
  yield "B";
  yield "C";
}

function* generateNum() {
  yield 1;
  yield 2;
  yield 3;
}

function* combined() {
  yield* generateAlpha(); // 다른 Generator 위임
  yield* generateNum();
}

// 사용
for (const value of combined()) {
  console.log(value); // A, B, C, 1, 2, 3
}
```

### 꿀팁! 🍯

1. Generator와 Promise 조합

```javascript
async function* asyncGenerator() {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();

  for (const item of data) {
    yield item;
  }
}

// 사용
async function processData() {
  for await (const item of asyncGenerator()) {
    console.log(item);
  }
}
```

2. 에러 처리

```javascript
function* errorGenerator() {
  try {
    yield 1;
    throw new Error("Something went wrong");
    yield 2; // 실행되지 않음
  } catch (error) {
    console.log("Error caught:", error.message);
    yield "Error handled";
  }
}

const gen = errorGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // 출력: Error caught: Something went wrong
// { value: 'Error handled', done: false }
```

이제 Generator는 마스터! 😎
복잡한 이터레이션과 비동기 처리를 우아하게 다룰 수 있을 거야!
