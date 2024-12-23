---
layout: post
title: "[JS] call / apply / bind"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-23 13:25:47
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
  - js call
  - js apply
  - js bind
---

{% include post/js_contents.md %}

call, apply, bind는 함수의 this 바인딩을 제어하는 메서드들이야! 🎯

### 1. call 메서드

```javascript
// 기본 사용법
function greet() {
  console.log(`안녕하세요, ${this.name}님!`);
}

const person = { name: "김코딩" };
greet.call(person); // "안녕하세요, 김코딩님!"

// 매개변수 전달
function introduce(age, occupation) {
  console.log(`저는 ${this.name}, ${age}살 ${occupation}입니다.`);
}

introduce.call(person, 20, "개발자");
// "저는 김코딩, 20살 개발자입니다."
```

### 2. apply 메서드

```javascript
// call과 비슷하지만 매개변수를 배열로 전달
function introduce(age, occupation) {
  console.log(`저는 ${this.name}, ${age}살 ${occupation}입니다.`);
}

const person = { name: "김코딩" };
introduce.apply(person, [20, "개발자"]);
// "저는 김코딩, 20살 개발자입니다."

// 배열 메서드 활용
const numbers = [5, 6, 2, 3, 7];

// Math.max는 this를 사용하지 않으므로 null 전달
const max = Math.max.apply(null, numbers); // 7
const min = Math.min.apply(null, numbers); // 2
```

### 3. bind 메서드

```javascript
// this를 영구적으로 바인딩
function greet() {
  console.log(`안녕하세요, ${this.name}님!`);
}

const person = { name: "김코딩" };
const boundGreet = greet.bind(person);

boundGreet(); // "안녕하세요, 김코딩님!"

// 부분 적용(Partial Application)
function multiply(a, b) {
  return a * b;
}

const multiplyByTwo = multiply.bind(null, 2);
console.log(multiplyByTwo(4)); // 8
```

### 4. 실전 활용 예제

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    // callback의 this를 현재 인스턴스로 바인딩
    const boundCallback = callback.bind(this);

    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(boundCallback);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback.apply(this, args);
      });
    }
  }
}

// 사용 예시
class Logger extends EventEmitter {
  log(message) {
    this.emit("log", message);
  }
}

const logger = new Logger();

logger.on("log", function (message) {
  console.log(`[${this.constructor.name}] ${message}`);
});

logger.log("테스트 메시지");
// "[Logger] 테스트 메시지"
```

### 5. 메서드 빌려쓰기 패턴

```javascript
const calculator = {
  numbers: [],

  sum() {
    return this.numbers.reduce((acc, num) => acc + num, 0);
  },

  avg() {
    return this.sum() / this.numbers.length;
  },
};

const mathSet = {
  numbers: [1, 2, 3, 4, 5],
};

// calculator의 메서드를 mathSet에서 사용
console.log(calculator.sum.call(mathSet)); // 15
console.log(calculator.avg.call(mathSet)); // 3

// Array 메서드 빌려쓰기
const arrayLike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
};

// Array.prototype.slice를 빌려써서 진짜 배열로 변환
const array = Array.prototype.slice.call(arrayLike);
console.log(array); // ['a', 'b', 'c']
```

### 6. 커스텀 바인딩 구현

```javascript
class Component {
  constructor(name) {
    this.name = name;

    // 메서드의 this 바인딩 유지
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(`${this.name} 클릭됨!`);
  }

  // 화살표 함수를 사용하면 자동으로 this가 바인딩됨
  handleHover = () => {
    console.log(`${this.name} 호버됨!`);
  };
}

const button = new Component("버튼");

// DOM 이벤트 리스너로 사용
const element = document.createElement("button");
element.addEventListener("click", button.handleClick);
element.addEventListener("mouseover", button.handleHover);
```

### 꿀팁! 🍯

1. call vs apply vs bind

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "김코딩" };

// call: 매개변수를 쉼표로 구분
greet.call(person, "안녕하세요", "!");

// apply: 매개변수를 배열로 전달
greet.apply(person, ["안녕하세요", "!"]);

// bind: 새로운 함수를 반환
const boundGreet = greet.bind(person, "안녕하세요");
boundGreet("!");
```

2. 성능 최적화

```javascript
// BAD: 매번 새로운 바인딩
element.addEventListener('click', function() {
    this.handleClick();
}.bind(this));

// GOOD: 미리 바인딩
constructor() {
    this.handleClick = this.handleClick.bind(this);
}
element.addEventListener('click', this.handleClick);

// BETTER: 화살표 함수 사용
handleClick = () => {
    // this가 자동으로 바인딩됨
};
```

이제 call, apply, bind는 마스터! 😎
this 바인딩을 자유자재로 다룰 수 있을 거야!
