---
layout: post
title: "[JS] 상속, 프로토타입(Prototype)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-23 13:33:29
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
  - js prototype
---

{% include post/js_contents.md %}

자바스크립트의 상속과 프로토타입! 객체 지향 프로그래밍의 핵심이야! 🔗

### 1. 프로토타입 기본

```javascript
// 프로토타입 체인 기본
const animal = {
  eat: function () {
    console.log("먹는다");
  },
};

const dog = {
  bark: function () {
    console.log("멍멍!");
  },
};

// dog의 프로토타입을 animal로 설정
Object.setPrototypeOf(dog, animal);
// 또는
// dog.__proto__ = animal;

dog.bark(); // "멍멍!"
dog.eat(); // "먹는다"
```

### 2. 생성자 함수와 프로토타입

```javascript
// 생성자 함수
function Animal(name) {
  this.name = name;
}

// 프로토타입에 메서드 추가
Animal.prototype.eat = function () {
  console.log(`${this.name}이(가) 먹는다`);
};

function Dog(name, breed) {
  // Animal 생성자 호출
  Animal.call(this, name);
  this.breed = breed;
}

// Dog 프로토타입을 Animal 프로토타입을 상속받도록 설정
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Dog 프로토타입에 메서드 추가
Dog.prototype.bark = function () {
  console.log("멍멍!");
};

const myDog = new Dog("멍멍이", "진돗개");
myDog.eat(); // "멍멍이이(가) 먹는다"
myDog.bark(); // "멍멍!"
```

### 3. 클래스를 사용한 상속 (ES6+)

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(`${this.name}이(가) 먹는다`);
  }

  sleep() {
    console.log(`${this.name}이(가) 잔다`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 부모 클래스 생성자 호출
    this.breed = breed;
  }

  bark() {
    console.log("멍멍!");
  }

  // 메서드 오버라이딩
  eat() {
    super.eat(); // 부모 메서드 호출
    console.log("사료를 먹는다");
  }
}

const myDog = new Dog("멍멍이", "진돗개");
myDog.eat();
// "멍멍이이(가) 먹는다"
// "사료를 먹는다"
myDog.bark(); // "멍멍!"
```

### 4. 다중 상속과 믹스인

```javascript
// 믹스인 함수
const swimMixin = {
  swim() {
    console.log(`${this.name}이(가) 수영한다`);
  },
};

const flyMixin = {
  fly() {
    console.log(`${this.name}이(가) 날아간다`);
  },
};

class Bird extends Animal {
  constructor(name) {
    super(name);
    // 믹스인 적용
    Object.assign(this, flyMixin);
  }
}

class Duck extends Bird {
  constructor(name) {
    super(name);
    // 여러 믹스인 적용
    Object.assign(this, swimMixin);
  }
}

const duck = new Duck("도널드");
duck.eat(); // "도널드이(가) 먹는다"
duck.fly(); // "도널드이(가) 날아간다"
duck.swim(); // "도널드이(가) 수영한다"
```

### 5. 프로토타입 체인 탐색과 속성 검색

```javascript
class Vehicle {
  constructor(type) {
    this.type = type;
  }

  getType() {
    return this.type;
  }
}

class Car extends Vehicle {
  constructor(type, brand) {
    super(type);
    this.brand = brand;
  }
}

const myCar = new Car("sedan", "Toyota");

// 프로토타입 체인 확인
console.log(myCar.__proto__ === Car.prototype); // true
console.log(Car.prototype.__proto__ === Vehicle.prototype); // true
console.log(Vehicle.prototype.__proto__ === Object.prototype); // true

// 속성 존재 확인
console.log(myCar.hasOwnProperty("brand")); // true
console.log(myCar.hasOwnProperty("type")); // true
console.log(myCar.hasOwnProperty("getType")); // false
```

### 6. 실전 예제: 컴포넌트 상속

```javascript
class Component {
  constructor(name) {
    this.name = name;
    this.state = {};
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    throw new Error("render 메서드를 구현해야 합니다");
  }
}

class Button extends Component {
  constructor(name) {
    super(name);
    this.state = { clicked: false };
  }

  click() {
    this.setState({ clicked: true });
  }

  render() {
    console.log(
      `Button ${this.name} is ${this.state.clicked ? "clicked" : "not clicked"}`
    );
  }
}

const myButton = new Button("Submit");
myButton.render(); // "Button Submit is not clicked"
myButton.click(); // "Button Submit is clicked"
```

### 꿀팁! 🍯

1. 프로토타입 체인 최적화

```javascript
// BAD: 인스턴스마다 메서드 생성
class BadExample {
  constructor() {
    this.method = function () {
      console.log("비효율적");
    };
  }
}

// GOOD: 프로토타입에 메서드 정의
class GoodExample {
  method() {
    console.log("효율적");
  }
}
```

2. instanceof vs isPrototypeOf

```javascript
class Animal {}
class Dog extends Animal {}

const dog = new Dog();

// instanceof: 생성자 함수 확인
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true

// isPrototypeOf: 프로토타입 체인 확인
console.log(Dog.prototype.isPrototypeOf(dog)); // true
console.log(Animal.prototype.isPrototypeOf(dog)); // true
```

이제 상속과 프로토타입은 마스터! 😎
객체 지향 프로그래밍을 자유자재로 할 수 있을 거야!
