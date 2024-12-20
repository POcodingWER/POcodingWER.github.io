---
layout: post
title: "[JS] 객체 메소드(Object methods), 계산된 프로퍼티(Computed property)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-20 12:58:17
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
  - js object methods
  - js computed property
---

{% include post/js_contents.md %}

객체 메소드와 계산된 프로퍼티를 알아보자! 🎯

### 1. 객체 메소드의 기본

```javascript
// 객체 메소드를 만드는 여러 방법
const person = {
  name: "김코딩",

  // 1. 메소드 단축 구문 (추천!)
  sayHi() {
    console.log("안녕하세요!");
  },

  // 2. 전통적인 방법
  sayBye: function () {
    console.log("안녕히가세요!");
  },

  // 3. 화살표 함수
  greet: () => {
    console.log("반갑습니다!");
  },
};

person.sayHi(); // "안녕하세요!"
person.sayBye(); // "안녕히가세요!"
person.greet(); // "반갑습니다!"
```

### 2. 계산된 프로퍼티

```javascript
const key = "name";
const value = "김코딩";

// 1. 기본적인 계산된 프로퍼티
const user = {
  [key]: value, // name: "김코딩"
};

// 2. 복잡한 표현식도 가능
const prefix = "user";
const userInfo = {
  [`${prefix}_id`]: 1234,
  [`${prefix}_name`]: "박해커",
  [`${prefix}_age`]: 20,
};

console.log(userInfo.user_id); // 1234
console.log(userInfo.user_name); // "박해커"
```

### 3. this를 사용하는 메소드

```javascript
const game = {
  title: "슈퍼마리오",
  level: 1,

  // this로 자신의 프로퍼티 접근
  showInfo() {
    console.log(`게임: ${this.title}, 레벨: ${this.level}`);
  },

  // 레벨업 메소드
  levelUp() {
    this.level++;
    console.log(`레벨 업! 현재 레벨: ${this.level}`);
  },
};

game.showInfo(); // "게임: 슈퍼마리오, 레벨: 1"
game.levelUp(); // "레벨 업! 현재 레벨: 2"
```

### 4. 동적으로 메소드와 프로퍼티 추가하기

```javascript
const calculator = {
  result: 0,
};

// 동적으로 메소드 추가
calculator.add = function (num) {
  this.result += num;
  return this;
};

// 계산된 프로퍼티로 메소드 추가
const operations = {
  subtract: "sub",
  multiply: "mul",
};

calculator[operations.subtract] = function (num) {
  this.result -= num;
  return this;
};

// 메소드 체이닝
calculator.add(5).sub(2);
console.log(calculator.result); // 3
```

### 5. 실전 예제: 게임 캐릭터

```javascript
const createCharacter = (name) => {
  return {
    name,
    level: 1,
    hp: 100,
    mp: 50,

    // 상태 표시 메소드
    [`show${name}Status`]() {
      // 계산된 프로퍼티로 메소드 이름 생성
      console.log(`
                캐릭터: ${this.name}
                레벨: ${this.level}
                HP: ${"❤️".repeat(this.hp / 20)}
                MP: ${"💙".repeat(this.mp / 10)}
            `);
    },

    // 스킬 사용 메소드
    useSkill(skillName) {
      const skills = {
        파이어볼: 30,
        아이스빔: 25,
        힐링: 20,
      };

      if (this.mp >= skills[skillName]) {
        this.mp -= skills[skillName];
        console.log(`${this.name}의 ${skillName} 사용! (MP: ${this.mp})`);
        return true;
      }

      console.log("MP가 부족합니다! 😢");
      return false;
    },
  };
};

const wizard = createCharacter("마법사");
wizard.showMagicianStatus(); // 계산된 프로퍼티로 만든 메소드 호출
/*
    캐릭터: 마법사
    레벨: 1
    HP: ❤️❤️❤️❤️❤️
    MP: 💙💙💙💙💙
*/

wizard.useSkill("파이어볼");
/*
    캐릭터: 마법사
    레벨: 1
    HP: ❤️❤️❤️❤️❤️
    MP: 💙💙
*/

// 상태 다시 확인
wizard.showMagicianStatus();
/*
    캐릭터: 마법사
    레벨: 1
    HP: ❤️❤️❤️❤️❤️
    MP: 💙💙
*/

// MP 부족할 때
wizard.useSkill("파이어볼"); // "MP가 부족합니다! 😢"
```

### 꿀팁! 🍯

1. 메소드 이름 규칙

```javascript
const api = {
  // 동사+명사 형태 추천
  getData() {
    /* ... */
  },
  updateUser() {
    /* ... */
  },
  deletePost() {
    /* ... */
  },

  // 불리언 값은 is, has 등으로 시작
  isValid() {
    /* ... */
  },
  hasPermission() {
    /* ... */
  },
};
```

2. 계산된 프로퍼티 활용

```javascript
const fields = ["id", "name", "age"];
const values = [1, "김코딩", 20];

// 객체 생성을 동적으로!
const user = fields.reduce((obj, field, i) => {
  obj[field] = values[i];
  return obj;
}, {});

console.log(user); // { id: 1, name: '김코딩', age: 20 }
```

이제 객체 메소드와 계산된 프로퍼티는 마스터! 😎
동적이고 유연한 객체를 만들 수 있게 됐어!
