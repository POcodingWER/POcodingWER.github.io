---
layout: post
title: "[JS] Js기초 연산자"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-06 13:26:54
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
  - js 연산자
  - js operators
---

{% include post/js_contents.md %}

좋았어! 그럼 이번엔 JavaScript의 연산자에 대해 알아볼까? 😎

### 1. 산술 연산자 (수학시간이야! 📚)

```javascript
// 기본적인 계산들
let a = 10;
let b = 3;

console.log(a + b); // 13 (더하기)
console.log(a - b); // 7 (빼기)
console.log(a * b); // 30 (곱하기)
console.log(a / b); // 3.333... (나누기)
console.log(a % b); // 1 (나머지, 10을 3으로 나누면 1이 남아!)

// 증감 연산자 (이건 좀 웃긴데?)
let count = 0;
count++; // 1 증가 (이러면 1됨)
count--; // 1 감소 (다시 0됨 ㅋㅋ)

// 제곱 (이것도 있어!)
console.log(2 ** 3); // 8 (2의 3제곱)
```

### 2. 비교 연산자 (누가 더 큰지 대결! 🥊)

```javascript
let x = 5;
let y = "5";

// 크기 비교
console.log(x > 3); // true (5가 3보다 크니까 당연히!)
console.log(x < 3); // false (5가 3보다 작을리가~)
console.log(x >= 5); // true (5는 5랑 같으니까 true!)

// 등호 비교 (여기서 실수하면 큰일남 😱)
console.log(x == y); // true (타입은 달라도 값이 같으면 true)
console.log(x === y); // false (타입까지 같아야 true인데 다르자나!)

// 다름을 비교
console.log(x != y); // false (값만 비교하면 같음)
console.log(x !== y); // true (타입까지 비교하면 다름!)
```

### 3. 논리 연산자 (참거짓 판단하기! 🤔)

```javascript
let 배고픔 = true;
let 돈있음 = true;

// AND 연산자 (&&)
console.log(배고픔 && 돈있음); // true (둘 다 true니까!)
// 해석: 배고프고 돈도 있으면 밥 먹으러 가자!

// OR 연산자 (||)
console.log(배고픔 || 돈있음); // true (하나만 true여도 true!)
// 해석: 배고프거나 돈이 있으면 뭐라도 먹자!

// NOT 연산자 (!)
console.log(!배고픔); // false (배고픔의 반대, 배불러!)
```

### 4. 할당 연산자 (줄임말 쓰기! ✍️)

```javascript
let score = 10;

// 이렇게 쓰는거랑
score = score + 5;

// 이렇게 쓰는게 같아!
score += 5; // 더 짧고 쿨하지 않냐? 😎

// 다른 것들도 될까?
score -= 3; // 빼기도 됨!
score *= 2; // 곱하기도 됨!
score /= 2; // 나누기도 됨!
```

### 5. 실제로 이렇게 써보자! 🎮

```javascript
// 게임 점수 계산하기
function calculateGameScore(kills, deaths) {
  let score = 0;

  // 킬 점수 계산 (킬당 100점!)
  score += kills * 100;

  // 데스 감점 (데스당 50점 감점...)
  score -= deaths * 50;

  // 0점 이하면 그냥 0점 주자...
  return score > 0 ? score : 0;
}

console.log(calculateGameScore(10, 5));
// 750점! (킬 1000점 - 데스 250점 = 750점)
```

### 꿀팁! 🍯

1. `===` 쓰는게 좋다니까! (진짜루다가!)

```javascript
// 이렇게 하면 버그 날 수 있어...
if (1 == "1") {
  // true가 되버림 ㅠ
  console.log("이러면 안돼!");
}

// 이렇게 하자!
if (1 === "1") {
  // false가 됨 (안전!)
  console.log("이게 맞지!");
}
```

2. 논리 연산자로 코드 줄이기

```javascript
// 이렇게 길게 쓰는 대신
let name;
if (user && user.name) {
  name = user.name;
} else {
  name = "무명";
}

// 이렇게 쓸 수 있어! (멋있지 않냐?)
let name = (user && user.name) || "무명";
```

재밌지 않아? 이제 연산자는 마스터했다고 봐도 되겠어! 😎
