---
layout: post
title: "[JS] WeakMap WeakSet"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-20 13:24:17
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
  - js WeakMap
  - js WeakSet
---

{% include post/js_contents.md %}

WeakMap은 키가 반드시 객체여야 하고, 참조가 없어지면 가비지 컬렉션의 대상이 되는 특별한 맵이야! 🗑️

### 1. WeakMap 기본

```javascript
// WeakMap 생성
const weakMap = new WeakMap();

// 일반 객체를 키로 사용
let obj = { name: "테스트" };
weakMap.set(obj, "비밀 데이터");

console.log(weakMap.get(obj)); // "비밀 데이터"

// 원시값은 키로 사용할 수 없음!
weakMap.set("문자열", 123); // TypeError!
weakMap.set(123, "숫자"); // TypeError!
```

### 2. 가비지 컬렉션 동작

```javascript
let user = { name: "김코딩" };
const userInfo = new WeakMap();

// 사용자 정보 저장
userInfo.set(user, {
  lastLogin: new Date(),
  visits: 1,
});

// user 객체에 대한 참조가 사라지면
user = null;

// userInfo의 데이터도 자동으로 가비지 컬렉션됨
// (바로는 아니고, JS 엔진이 판단하는 적절한 시점에)
```

### 3. 프라이빗 데이터 관리

```javascript
const privateData = new WeakMap();

class User {
  constructor(name, age) {
    // 프라이빗 데이터 저장
    privateData.set(this, {
      name: name,
      age: age,
    });
  }

  getName() {
    return privateData.get(this).name;
  }

  getAge() {
    return privateData.get(this).age;
  }

  setAge(newAge) {
    privateData.get(this).age = newAge;
  }
}

const user = new User("김코딩", 20);
console.log(user.getName()); // "김코딩"
console.log(privateData.get(user)); // { name: "김코딩", age: 20 }
```

### 4. 캐시/메모이제이션

```javascript
const cache = new WeakMap();

function processUser(user) {
  // 이미 처리된 결과가 있는지 확인
  if (cache.has(user)) {
    console.log("캐시된 결과 사용!");
    return cache.get(user);
  }

  // 새로운 결과 계산
  const result = {
    processed: true,
    lastUpdate: new Date(),
  };

  // 결과를 캐시에 저장
  cache.set(user, result);
  return result;
}

let user = { id: 1, name: "박해커" };
processUser(user); // 계산 수행
processUser(user); // 캐시된 결과 사용

// user 객체가 없어지면 캐시도 자동 정리됨
user = null;
```

### 5. 이벤트 리스너 관리

```javascript
const listeners = new WeakMap();

class EventEmitter {
  constructor() {
    listeners.set(this, new Map());
  }

  on(event, callback) {
    let eventMap = listeners.get(this);
    if (!eventMap.has(event)) {
      eventMap.set(event, new Set());
    }
    eventMap.get(event).add(callback);
  }

  emit(event, data) {
    const callbacks = listeners.get(this).get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}

let emitter = new EventEmitter();
emitter.on("message", (data) => console.log(data));
emitter.emit("message", "안녕하세요!"); // "안녕하세요!"

// emitter가 사라지면 리스너도 자동으로 정리됨
emitter = null;
```

### WeakMap vs Map 비교 📊

```javascript
// 1. Map - 모든 타입의 키 사용 가능
const normalMap = new Map();
normalMap.set("문자열", 123);
normalMap.set(123, "숫자도 가능");

// 2. WeakMap - 객체만 키로 사용 가능
const weakMap = new WeakMap();
weakMap.set({ id: 1 }, "객체만 가능");
// weakMap.set("문자열", 123);  // 에러!

// 3. Map은 순회 가능
for (let [key, value] of normalMap) {
  console.log(key, value);
}

// 4. WeakMap은 순회 불가능
// for (let [key, value] of weakMap) {}  // 에러!
```

### 사용 시기 🤔

WeakMap은 이럴 때 사용하면 좋아:

1. 객체와 관련된 프라이빗 데이터 저장
2. 캐시나 메모이제이션 구현
3. 메모리 누수 방지가 필요할 때
4. 객체의 생명주기와 연관된 데이터 관리

```javascript
// 좋은 사용 예
const userSessions = new WeakMap();

function login(user) {
  userSessions.set(user, {
    loginTime: new Date(),
    token: Math.random().toString(36),
  });
}

// user 객체가 사라지면 세션 정보도 자동으로 정리됨!
```

이제 WeakMap은 마스터! 😎
메모리 관리가 중요한 상황에서 아주 유용하게 사용할 수 있어!

WeakSet도 WeakMap과 비슷해! 객체만 저장할 수 있고, 참조가 없어지면 자동으로 가비지 컬렉션 돼! 🗑️

### 1. WeakSet 기본

```javascript
// WeakSet 생성
const weakSet = new WeakSet();

// 객체만 추가 가능
let obj = { name: "테스트" };
weakSet.add(obj);

// 원시값은 추가 불가!
weakSet.add(123); // TypeError!
weakSet.add("문자열"); // TypeError!

// 객체 존재 여부 확인
console.log(weakSet.has(obj)); // true

// obj 참조가 사라지면 WeakSet에서도 자동 삭제
obj = null;
```

### 2. 방문자 추적 예제

```javascript
const visited = new WeakSet();

class Page {
  constructor(title) {
    this.title = title;
  }

  visit() {
    if (visited.has(this)) {
      console.log(`재방문: ${this.title}`);
    } else {
      visited.add(this);
      console.log(`첫 방문: ${this.title}`);
    }
  }
}

let page1 = new Page("홈페이지");
page1.visit(); // "첫 방문: 홈페이지"
page1.visit(); // "재방문: 홈페이지"

// page1이 null이 되면 visited에서도 자동 삭제
page1 = null;
```

### 3. 중복 방지 사용 예제

```javascript
const processed = new WeakSet();

class Task {
  constructor(name) {
    this.name = name;
  }

  process() {
    if (processed.has(this)) {
      console.log(`${this.name}: 이미 처리됨!`);
      return;
    }

    console.log(`${this.name} 처리 중...`);
    // 처리 로직...

    processed.add(this);
    console.log(`${this.name} 처리 완료!`);
  }
}

const task = new Task("데이터 분석");
task.process(); // "데이터 분석 처리 중..." -> "처리 완료!"
task.process(); // "데이터 분석: 이미 처리됨!"
```

### 4. WeakSet vs Set 비교

```javascript
// 1. Set - 모든 타입의 값 저장 가능
const normalSet = new Set();
normalSet.add(1);
normalSet.add("문자열");
normalSet.add({ id: 1 });

// 2. WeakSet - 객체만 저장 가능
const weakSet = new WeakSet();
weakSet.add({ id: 1 });
// weakSet.add(1);  // 에러!

// 3. Set은 순회 가능
for (let item of normalSet) {
  console.log(item);
}

// 4. WeakSet은 순회 불가능
// for (let item of weakSet) {}  // 에러!

// 5. Set은 크기 확인 가능
console.log(normalSet.size); // 3

// 6. WeakSet은 크기 확인 불가
// console.log(weakSet.size);  // undefined
```

### 5. 실전 예제: 이벤트 한 번만 실행하기

```javascript
const executedHandlers = new WeakSet();

class EventManager {
  constructor() {
    this.handlers = [];
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  executeOnce(handler, ...args) {
    if (!executedHandlers.has(handler)) {
      handler(...args);
      executedHandlers.add(handler);
    } else {
      console.log("이미 실행된 핸들러입니다!");
    }
  }
}

const manager = new EventManager();
const handler = {
  handle: (data) => console.log(`처리: ${data}`),
};

manager.executeOnce(handler, "테스트1"); // "처리: 테스트1"
manager.executeOnce(handler, "테스트2"); // "이미 실행된 핸들러입니다!"
```

### 사용 시기 🤔

WeakSet은 이럴 때 사용하면 좋아:

1. 객체의 중복 실행 방지
2. 객체 방문 여부 추적
3. 임시 객체 플래그 설정
4. 메모리 누수 방지가 필요할 때

```javascript
// 실제 사용 예: DOM 요소 처리 추적
const processedElements = new WeakSet();

function processElement(element) {
  if (processedElements.has(element)) {
    console.log("이미 처리된 요소입니다.");
    return;
  }

  // 요소 처리 로직...
  processedElements.add(element);
}

// DOM 요소가 삭제되면 WeakSet에서도 자동으로 정리됨!
```

### WeakSet vs WeakMap 비교 📊

1. WeakSet

   - 객체만 저장
   - 값만 저장 (키-값 쌍 없음)
   - has, add, delete 메서드만 제공

2. WeakMap
   - 객체를 키로 사용
   - 키-값 쌍 저장
   - get, set, has, delete 메서드 제공

```javascript
// WeakSet 예제
const visitedPages = new WeakSet();
visitedPages.add(pageObj);

// WeakMap 예제
const pageData = new WeakMap();
pageData.set(pageObj, { visits: 1 });
```

이제 WeakSet도 마스터! 😎
객체 관련 플래그나 상태를 추적할 때 아주 유용하게 사용할 수 있어!
