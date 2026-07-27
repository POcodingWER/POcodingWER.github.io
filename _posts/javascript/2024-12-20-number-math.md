---
layout: post
title: "[JS] 숫자, 수학 method (Number, Math)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-20 13:27:42
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
  - js Number
  - js Math
---

{% include post/js_contents.md %}

WeakMap은 키가 반드시 객체여야 하고, 참조가 없어지면 가비지 컬렉션의 대상이 되는 특별한 맵이야! 🗑️

Number와 Math 객체! 숫자를 다루는 필수 도구들이야! 🔢

### 1. Number 객체의 주요 기능

```javascript
// 1. 숫자 변환
Number("123"); // 123
Number("abc"); // NaN
Number(true); // 1
Number(false); // 0

// 2. 특수 값들
console.log(Number.MAX_VALUE); // 1.7976931348623157e+308
console.log(Number.MIN_VALUE); // 5e-324
console.log(Number.POSITIVE_INFINITY); // Infinity
console.log(Number.NEGATIVE_INFINITY); // -Infinity
console.log(Number.NaN); // NaN

// 3. 숫자 검사
Number.isInteger(5); // true
Number.isInteger(5.5); // false
Number.isNaN("abc"); // false
Number.isFinite(Infinity); // false

// 4. 소수점 자리수 지정
const num = 123.456789;
num.toFixed(2); // "123.46"
num.toPrecision(4); // "123.5"
```

### 2. Math 객체의 주요 기능

```javascript
// 1. 기본 수학 연산
Math.abs(-5); // 5 (절대값)
Math.round(4.7); // 5 (반올림)
Math.ceil(4.3); // 5 (올림)
Math.floor(4.7); // 4 (내림)
Math.trunc(4.7); // 4 (소수점 제거)

// 2. 최대/최소값
Math.max(1, 5, 3); // 5
Math.min(1, 5, 3); // 1

// 3. 거듭제곱과 제곱근
Math.pow(2, 3); // 8 (2의 3승)
Math.sqrt(9); // 3 (제곱근)
Math.cbrt(27); // 3 (세제곱근)

// 4. 랜덤 숫자
Math.random(); // 0 이상 1 미만의 랜덤 숫자
```

### 3. 실전 활용 예제

```javascript
// 1. 특정 범위의 랜덤 정수 생성
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 주사위 굴리기
console.log(getRandomInt(1, 6)); // 1~6 사이의 랜덤 숫자

// 2. 소수점 다루기
function formatMoney(amount) {
  return Number(amount).toFixed(2);
}

console.log(formatMoney(123.4567)); // "123.46"

// 3. 각도와 라디안 변환
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

console.log(Math.sin(degreesToRadians(90))); // 1
```

### 4. 게임 개발 예제

```javascript
class GameMath {
  // 데미지 계산 (기본 데미지 ± 20%)
  static calculateDamage(baseDamage) {
    const variation = 0.2; // 20% 변동
    const multiplier = 1 + (Math.random() * variation * 2 - variation);
    return Math.round(baseDamage * multiplier);
  }

  // 치명타 확률 계산 (20%)
  static isCritical() {
    return Math.random() < 0.2;
  }

  // 거리 계산 (피타고라스)
  static getDistance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  // 각도 계산
  static getAngle(x1, y1, x2, y2) {
    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  }
}

// 사용 예시
console.log(GameMath.calculateDamage(100)); // 80~120 사이의 값
console.log(GameMath.isCritical()); // true 또는 false
console.log(GameMath.getDistance(0, 0, 3, 4)); // 5
console.log(GameMath.getAngle(0, 0, 1, 1)); // 45
```

### 5. 유용한 수학 함수들

```javascript
class MathUtils {
  // 숫자 범위 제한
  static clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  // 선형 보간
  static lerp(start, end, t) {
    return start + (end - start) * t;
  }

  // 퍼센트 계산
  static percentage(value, total) {
    return Math.round((value / total) * 100);
  }

  // 소수점 반올림 (자릿수 지정)
  static roundTo(num, decimals) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(num * multiplier) / multiplier;
  }
}

// 사용 예시
console.log(MathUtils.clamp(150, 0, 100)); // 100
console.log(MathUtils.lerp(0, 100, 0.5)); // 50
console.log(MathUtils.percentage(75, 200)); // 38
console.log(MathUtils.roundTo(3.14159, 2)); // 3.14
```

### 꿀팁! 🍯

1. 금융 계산시 주의점

```javascript
// 부동소수점 오차 주의!
0.1 + 0.2; // 0.30000000000000004

// 해결방법: 정수로 변환 후 계산
function addMoney(a, b) {
  return (a * 100 + b * 100) / 100;
}

console.log(addMoney(0.1, 0.2)); // 0.3
```

2. 성능 최적화

```javascript
// Math.floor vs ~~
// ~~ 가 더 빠르지만 가독성이 떨어짐
console.log(Math.floor(5.7)); // 5
console.log(~~5.7); // 5

// Math.pow vs **
// ** 연산자가 더 최신이고 가독성이 좋음
console.log(Math.pow(2, 3)); // 8
console.log(2 ** 3); // 8
```

이제 Number와 Math는 마스터! 😎
수학적 계산이 필요한 어떤 상황에서도 자신있게 코딩할 수 있을 거야!
