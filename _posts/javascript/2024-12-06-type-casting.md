---
layout: post
title: "[JS] Js기초 형변환"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-06 13:22:58
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
  - js 형변환
  - js type casting
---

{% include post/js_contents.md %}

헤이~ JavaScript의 형변환에 대해 알아보자! 😎

### 1. 명시적 형변환 (이거 좀 멋있게 말한거임 ㅋㅋ)

그냥 우리가 직접 타입을 바꾸는거야!

```javascript
// 문자열로 바꾸기 (String 변환)
let num = 123;
let bool = true;

// String() 쓰기
console.log(String(num)); // "123" 짜잔!
console.log(String(bool)); // "true"

// toString() 쓰기 (이것도 똑같아)
console.log(num.toString()); // "123"

// 백틱(`)으로도 가능! (이게 젤 쉬움 ㅋ)
console.log(`${num}`); // "123"
```

### 2. 숫자로 바꾸기 (이게 좀 까다로워 😅)

```javascript
// Number() 쓰기
console.log(Number("123")); // 123 굿!
console.log(Number("abc")); // NaN (Not a Number ㅋㅋ 실패!)

// parseInt랑 parseFloat (얘네가 좀 더 똑똑해)
console.log(parseInt("123")); // 123
console.log(parseFloat("12.34")); // 12.34
console.log(parseInt("12.34")); // 12 (소수점은 버려버림 ㅋ)
console.log(parseInt("12px")); // 12 (숫자만 쏙 빼감 ㄷㄷ)

// + 연산자로도 됨 (근데 이건 좀 트릭키해)
console.log(+"123"); // 123
```

### 3. true/false로 바꾸기 (제일 쉬움!)

```javascript
// Boolean() 쓰기
console.log(Boolean(1)); // true (1은 true!)
console.log(Boolean(0)); // false (0은 false!)
console.log(Boolean("")); // false (빈문자열도 false!)
console.log(Boolean("hello")); // true (값이 있으면 true!)

// !! 쓰기 (개발자들이 자주 쓰는 꿀팁!)
console.log(!!"hello"); // true
console.log(!!""); // false
```

### 4. 자동 형변환 (JS가 몰래몰래 바꿔버림 😱)

```javascript
// 문자열이랑 더하기하면 다 문자열됨 ㅋㅋ
console.log("5" + 3); // "53" (숫자가 문자열이 됨)
console.log("5" + true); // "5true" (이것도 됨 ㄷㄷ)

// 빼기는 또 숫자로 변함 (이상하지않냐?)
console.log("5" - 3); // 2
console.log("10" / "2"); // 5
```

### 5. 실제로 이렇게 써보자!

```javascript
// 사용자가 입력한거 처리하기
function checkNumber(input) {
  const num = Number(input);

  if (isNaN(num)) {
    return "앗! 숫자가 아닌데요? 😅";
  }

  return `짜잔! ${num * 2}가 되었습니다! 🎉`;
}

console.log(checkNumber("123")); // "짜잔! 246가 되었습니다! 🎉"
console.log(checkNumber("abc")); // "앗! 숫자가 아닌데요? 😅"
```

### 주의할 점! (이거 중요해! 👀)

1. `===` 쓰는게 좋아!

```javascript
// == 쓰면 이상한 일이 일어남 ㅋㅋ
console.log(5 == "5"); // true (엥?)
console.log(5 === "5"); // false (이게 맞지!)
```

2. NaN 체크하기

```javascript
// 숫자가 아닌지 확인할 때
console.log(isNaN(Number("abc"))); // true (ㅇㅇ 숫자 아님!)
```

이렇게 형변환 마스터하면 코딩이 훨씬 재밌어질거야! 😎
뭐가 궁금하면 또 물어봐! 같이 코딩 마스터되자! 🚀
