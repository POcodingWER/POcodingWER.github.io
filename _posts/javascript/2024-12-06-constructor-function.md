---
layout: post
title: "[JS] Js중급 생성자함수"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-06 13:58:17
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
  - js constructor function
  - js 생성자함수
---

{% include post/js_contents.md %}

생성자 함수(Constructor Function)! 객체 찍어내는 공장 같은 거야! 🏭

### 1. 생성자 함수 기본

```javascript
// 생성자 함수는 대문자로 시작! (관례)
function Hero(name, power) {
  // this는 새로 생성될 객체를 가리킴
  this.name = name;
  this.power = power;
  this.hp = 100;

  this.attack = function () {
    console.log(`${this.name}의 공격! ${this.power} 데미지!`);
  };
}

// new 키워드로 객체 생성
let ironMan = new Hero("아이언맨", 95);
let spiderMan = new Hero("스파이더맨", 85);

ironMan.attack(); // "아이언맨의 공격! 95 데미지!"
spiderMan.attack(); // "스파이더맨의 공격! 85 데미지!"
```

### 2. 프로토타입으로 메서드 공유하기

```javascript
function Game(title) {
  this.title = title;
  this.level = 1;
}

// 프로토타입에 메서드 추가 (메모리 절약!)
Game.prototype.levelUp = function () {
  this.level++;
  console.log(`${this.title} 레벨업! 현재 레벨: ${this.level} 🎮`);
};

let mario = new Game("슈퍼마리오");
let zelda = new Game("젤다의 전설");

mario.levelUp(); // "슈퍼마리오 레벨업! 현재 레벨: 2 🎮"
zelda.levelUp(); // "젤다의 전설 레벨업! 현재 레벨: 2 🎮"
```

### 3. 생성자 함수 체크하기

```javascript
function Pet(name) {
  // new 없이 호출된 경우 체크
  if (!new.target) {
    return new Pet(name);
  }

  this.name = name;
}

// new 있든 없든 객체가 생성됨!
let dog1 = new Pet("멍멍이");
let dog2 = Pet("왈왈이"); // new 없어도 OK!

console.log(dog1.name); // "멍멍이"
console.log(dog2.name); // "왈왈이"
```

### 4. 프라이빗 변수 만들기 (클로저 활용)

```javascript
function BankAccount(initialBalance) {
  // 프라이빗 변수
  let balance = initialBalance;

  // 퍼블릭 메서드
  this.getBalance = function () {
    return balance;
  };

  this.deposit = function (amount) {
    balance += amount;
    console.log(`${amount}원 입금! 잔액: ${balance}원 💰`);
  };

  this.withdraw = function (amount) {
    if (balance >= amount) {
      balance -= amount;
      console.log(`${amount}원 출금! 잔액: ${balance}원 💸`);
    } else {
      console.log("잔액 부족! 😢");
    }
  };
}

let account = new BankAccount(1000);
account.deposit(500); // "500원 입금! 잔액: 1500원 💰"
account.withdraw(2000); // "잔액 부족! 😢"
console.log(account.balance); // undefined (프라이빗!)
```

### 5. 실전 예제: 게임 캐릭터 만들기!

```javascript
function Character(name, type) {
  // 기본 속성
  this.name = name;
  this.type = type;
  this.level = 1;
  this.hp = 100;
  this.mp = 50;

  // 스탯
  let stats = {
    strength: 10,
    agility: 10,
    intelligence: 10,
  };

  // 레벨업 시 스탯 증가
  this.levelUp = function () {
    this.level++;
    stats.strength += 2;
    stats.agility += 2;
    stats.intelligence += 2;

    console.log(`
            🎉 레벨업! 
            이름: ${this.name}
            레벨: ${this.level}
            힘: ${stats.strength}
            민첩: ${stats.agility}
            지능: ${stats.intelligence}
        `);
  };

  // 현재 스탯 확인
  this.showStats = function () {
    return stats;
  };
}

// 캐릭터 생성
let warrior = new Character("김전사", "전사");
let mage = new Character("박마법사", "마법사");

warrior.levelUp();
console.log(warrior.showStats());
```

### 꿀팁! 🍯

1. **생성자 함수 vs 클래스**

```javascript
// 생성자 함수
function Dog(name) {
  this.name = name;
}

// 클래스 (모던한 방식)
class Dog {
  constructor(name) {
    this.name = name;
  }
}
```

2. **팩토리 함수와 비교**

```javascript
// 팩토리 함수
function createHero(name) {
  return {
    name: name,
    sayHi() {
      console.log(`Hi, I'm ${this.name}`);
    },
  };
}

// 생성자 함수
function Hero(name) {
  this.name = name;
  this.sayHi = function () {
    console.log(`Hi, I'm ${this.name}`);
  };
}
```

3. **프로토타입 활용하기**

```javascript
function Animal(name) {
  this.name = name;
}

// 프로토타입에 메서드 추가
Animal.prototype.speak = function () {
  console.log(`${this.name} makes a sound`);
};

// 모든 인스턴스가 speak 메서드 공유!
let dog = new Animal("Dog");
let cat = new Animal("Cat");
```

이제 생성자 함수는 마스터! 객체 찍어내는 공장장이 된 거야! 🏭
