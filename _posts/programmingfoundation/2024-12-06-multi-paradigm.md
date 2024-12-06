---
layout: post
title: "[Programming Foundation] 멀티 패러다임"

subtitle: "멀티 패러다임 언어의 특징"

date: 2024-12-06 09:56:12
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
  - 멀티 패러다임
---

### 멀티 패러다임이란?

하나의 프로그래밍 언어에서 여러 가지 프로그래밍 방식을 지원하는 것을 말합니다. JavaScript는 대표적인 멀티 패러다임 언어입니다.

### 1. 객체지향 프로그래밍 (OOP) Object-Oriented Programming

객체를 기반으로 프로그램을 구조화하는 패러다임입니다.

```javascript
// 클래스 기반 객체지향
class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
    this.speed = 0;
  }

  accelerate() {
    this.speed += 10;
    console.log(`현재 속도: ${this.speed}km/h`);
  }

  brake() {
    this.speed = Math.max(0, this.speed - 10);
    console.log(`현재 속도: ${this.speed}km/h`);
  }
}

const myCar = new Car("현대", "소나타");
myCar.accelerate(); // 현재 속도: 10km/h
```

### 2. 함수형 프로그래밍 (FP) Functional Programming

순수 함수와 불변성을 강조하는 패러다임입니다.

```javascript
// 함수형 프로그래밍 예시
const numbers = [1, 2, 3, 4, 5];

// 순수 함수 사용
const double = (x) => x * 2;
const isEven = (x) => x % 2 === 0;

// 데이터 변환
const result = numbers
  .map(double) // [2, 4, 6, 8, 10]
  .filter(isEven) // [2, 4, 6, 8, 10]
  .reduce((a, b) => a + b, 0); // 30

// 함수 합성
const compose = (f, g) => (x) => f(g(x));
const addOne = (x) => x + 1;
const multiplyTwo = (x) => x * 2;
const addOneThenMultiply = compose(multiplyTwo, addOne);
```

### 3. 절차적 프로그래밍

순차적으로 실행되는 명령어들의 모음입니다.

```javascript
// 절차적 프로그래밍 예시
let total = 0;
let count = 0;

// 순차적인 처리
for (let i = 1; i <= 100; i++) {
  if (i % 2 === 0) {
    total += i;
    count++;
  }
}

console.log(`짝수의 합: ${total}`);
console.log(`짝수의 개수: ${count}`);
```

### 실제 활용 예시 (패러다임 혼합)

```javascript
// 쇼핑몰 시스템 예시
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // 객체지향적 방식
  addItem(item) {
    this.items.push(item);
  }

  // 함수형 프로그래밍 방식
  calculateTotal() {
    return this.items
      .map((item) => item.price)
      .reduce((sum, price) => sum + price, 0);
  }

  // 절차적 프로그래밍 방식
  printReceipt() {
    let total = 0;
    console.log("=== 영수증 ===");

    for (let item of this.items) {
      console.log(`${item.name}: ${item.price}원`);
      total += item.price;
    }

    console.log(`합계: ${total}원`);
  }
}

// 사용 예시
const cart = new ShoppingCart();
cart.addItem({ name: "노트북", price: 1000000 });
cart.addItem({ name: "마우스", price: 50000 });

console.log(`총액: ${cart.calculateTotal()}원`);
cart.printReceipt();
```

### 각 패러다임의 장단점

1. **객체지향 프로그래밍**

   - 장점: 코드 재사용성, 유지보수 용이
   - 단점: 복잡한 설계가 필요할 수 있음

2. **함수형 프로그래밍**

   - 장점: 예측 가능한 결과, 테스트 용이
   - 단점: 학습 곡선이 높을 수 있음

3. **절차적 프로그래밍**
   - 장점: 단순하고 직관적
   - 단점: 코드 재사용성이 낮음

### 사용 시 고려사항

1. **프로젝트 특성에 맞는 패러다임 선택**

   - 작은 프로젝트: 절차적 프로그래밍
   - 큰 규모의 애플리케이션: 객체지향
   - 데이터 처리: 함수형 프로그래밍

2. **팀의 역량과 선호도 고려**

   - 팀원들의 익숙한 패러다임 고려
   - 유지보수성 고려

3. **일관성 유지**
   - 선택한 패러다임을 일관되게 사용
   - 필요한 경우 패러다임 혼합 사용

이러한 멀티 패러다임의 특성을 잘 활용하면, 상황에 가장 적합한 프로그래밍 방식을 선택하여 효율적인 개발이 가능합니다.
