---
layout: post
title: "[JS] 배열 메소드(Array methods)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-20 13:33:42
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
  - js array methods
---

{% include post/js_contents.md %}

배열 메소드! 데이터를 다루는 가장 강력한 도구들이야! 🛠️

### 1. 기본적인 배열 메소드

```javascript
const arr = [1, 2, 3, 4, 5];

// 배열 끝 조작
arr.push(6); // 끝에 추가
arr.pop(); // 끝에서 제거

// 배열 앞 조작
arr.unshift(0); // 앞에 추가
arr.shift(); // 앞에서 제거

// 배열 일부 가져오기
arr.slice(1, 3); // [2, 3] (인덱스 1부터 3 전까지)

// 배열 일부 수정/삭제/추가
arr.splice(1, 2, "a", "b"); // 인덱스 1부터 2개 제거하고 'a', 'b' 추가

// 배열 합치기
const arr2 = [6, 7];
const newArr = arr.concat(arr2); // [1, 2, 3, 4, 5, 6, 7]
```

### 2. 배열 탐색 메소드

```javascript
const fruits = ["apple", "banana", "orange", "apple"];

// 요소 찾기
fruits.indexOf("apple"); // 0 (앞에서부터)
fruits.lastIndexOf("apple"); // 3 (뒤에서부터)
fruits.includes("banana"); // true

// 조건으로 찾기
const numbers = [1, 2, 3, 4, 5];

// 조건에 맞는 첫 요소
const found = numbers.find((num) => num > 3); // 4

// 조건에 맞는 첫 요소의 인덱스
const foundIndex = numbers.findIndex((num) => num > 3); // 3

// 조건을 만족하는지 확인
const hasEven = numbers.some((num) => num % 2 === 0); // true
const allEven = numbers.every((num) => num % 2 === 0); // false
```

### 3. 배열 변형 메소드

```javascript
const numbers = [1, 2, 3, 4, 5];

// map: 각 요소를 변환
const doubled = numbers.map((num) => num * 2); // [2, 4, 6, 8, 10]

// filter: 조건에 맞는 요소만 선택
const evens = numbers.filter((num) => num % 2 === 0); // [2, 4]

// reduce: 값을 하나로 축소
const sum = numbers.reduce((acc, cur) => acc + cur, 0); // 15

// flatMap: map 후 평탄화
const pairs = numbers.flatMap((num) => [num, num * 2]);
// [1, 2, 2, 4, 3, 6, 4, 8, 5, 10]

// 정렬
const sorted = [...numbers].sort((a, b) => b - a); // 내림차순
```

### 4. 실전 활용 예제

```javascript
class ArrayUtils {
  // 중복 제거
  static removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  // 배열 섞기
  static shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  // 배열 그룹화
  static groupBy(arr, key) {
    return arr.reduce((groups, item) => {
      const value = item[key];
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  }

  // 배열 청크 분할
  static chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, (i + 1) * size)
    );
  }
}

// 사용 예시
const numbers = [1, 2, 2, 3, 3, 4];
console.log(ArrayUtils.removeDuplicates(numbers)); // [1, 2, 3, 4]

const cards = ["♠A", "♥K", "♣Q", "♦J"];
console.log(ArrayUtils.shuffle(cards)); // 무작위 순서

const users = [
  { name: "Kim", age: 20 },
  { name: "Lee", age: 20 },
  { name: "Park", age: 30 },
];
console.log(ArrayUtils.groupBy(users, "age"));
// { '20': [{name: "Kim"...}, {name: "Lee"...}], '30': [{name: "Park"...}] }

const nums = [1, 2, 3, 4, 5, 6, 7];
console.log(ArrayUtils.chunk(nums, 3)); // [[1,2,3], [4,5,6], [7]]
```

### 5. 고급 배열 처리

```javascript
class DataProcessor {
  // 평균 계산
  static average(arr) {
    return arr.reduce((sum, num) => sum + num, 0) / arr.length;
  }

  // 중앙값 찾기
  static median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  // 빈도수 계산
  static frequency(arr) {
    return arr.reduce((freq, item) => {
      freq[item] = (freq[item] || 0) + 1;
      return freq;
    }, {});
  }

  // 배열 차이 찾기
  static difference(arr1, arr2) {
    return arr1.filter((item) => !arr2.includes(item));
  }
}

// 사용 예시
const scores = [85, 90, 92, 88, 85];
console.log(DataProcessor.average(scores)); // 88
console.log(DataProcessor.median(scores)); // 88
console.log(DataProcessor.frequency(scores)); // { '85': 2, '88': 1, '90': 1, '92': 1 }
console.log(DataProcessor.difference([1, 2, 3], [2, 3, 4])); // [1]
```

### 6. 체이닝 패턴

```javascript
class ArrayChain {
  constructor(arr) {
    this.arr = arr;
  }

  map(fn) {
    this.arr = this.arr.map(fn);
    return this;
  }

  filter(fn) {
    this.arr = this.arr.filter(fn);
    return this;
  }

  sort(fn) {
    this.arr = [...this.arr].sort(fn);
    return this;
  }

  value() {
    return this.arr;
  }
}

// 사용 예시
const result = new ArrayChain([1, 2, 3, 4, 5])
  .map((x) => x * 2) // [2, 4, 6, 8, 10]
  .filter((x) => x > 5) // [6, 8, 10]
  .sort((a, b) => b - a) // [10, 8, 6]
  .value();

console.log(result); // [10, 8, 6]
```

### 꿀팁! 🍯

1. 성능 최적화

```javascript
// 큰 배열에서 요소 찾기
const bigArray = [
  /* 많은 데이터 */
];

// BAD
const found = bigArray.filter((x) => x.id === 5)[0];

// GOOD
const found = bigArray.find((x) => x.id === 5);
```

2. 배열 복사

```javascript
// 얕은 복사
const copy1 = [...original];
const copy2 = original.slice();

// 깊은 복사
const deepCopy = JSON.parse(JSON.stringify(original));
```

이제 배열 메소드는 마스터! 😎
데이터 처리가 필요한 어떤 상황에서도 자신있게 코딩할 수 있을 거야!
