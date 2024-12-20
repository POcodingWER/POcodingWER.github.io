---
layout: post
title: "[JS] 문자열 메소드(String methods)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-20 13:27:42
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
  - js string methods
---

{% include post/js_contents.md %}

문자열 메소드! 텍스트를 다루는 필수 도구들이야! 📝

### 1. 기본적인 문자열 메소드

```javascript
const str = "Hello, World!";

// 길이
console.log(str.length); // 13

// 대소문자 변환
console.log(str.toUpperCase()); // "HELLO, WORLD!"
console.log(str.toLowerCase()); // "hello, world!"

// 문자 찾기
console.log(str.charAt(0)); // "H"
console.log(str.indexOf("o")); // 4
console.log(str.lastIndexOf("o")); // 7
console.log(str.includes("World")); // true

// 부분 문자열
console.log(str.substring(0, 5)); // "Hello"
console.log(str.slice(-6)); // "World!"
```

### 2. 문자열 변형 메소드

```javascript
// 공백 제거
const text = "   공백 제거   ";
console.log(text.trim()); // "공백 제거"
console.log(text.trimStart()); // "공백 제거   "
console.log(text.trimEnd()); // "   공백 제거"

// 문자열 반복
console.log("Ha".repeat(3)); // "HaHaHa"

// 문자열 채우기
console.log("5".padStart(3, "0")); // "005"
console.log("5".padEnd(3, "0")); // "500"

// 문자열 바꾸기
const str2 = "apple,banana,apple";
console.log(str2.replace("apple", "orange")); // "orange,banana,apple"
console.log(str2.replaceAll("apple", "orange")); // "orange,banana,orange"
```

### 3. 문자열 분할과 결합

```javascript
// 분할
const fruits = "apple,banana,orange";
console.log(fruits.split(",")); // ["apple", "banana", "orange"]
console.log(fruits.split("")); // ["a","p","p","l","e",",","b"...]

// 결합
const words = ["Hello", "World"];
console.log(words.join(" ")); // "Hello World"
console.log(words.join("-")); // "Hello-World"

// 문자열 템플릿
const name = "김코딩";
const age = 20;
console.log(`이름: ${name}, 나이: ${age}`); // "이름: 김코딩, 나이: 20"
```

### 4. 실전 활용 예제

```javascript
class StringUtils {
  // 이메일 유효성 검사
  static isValidEmail(email) {
    return email.includes("@") && email.includes(".");
  }

  // 전화번호 포맷팅
  static formatPhoneNumber(number) {
    const cleaned = number.replace(/\D/g, "");
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 비밀번호 마스킹
  static maskPassword(password) {
    return "*".repeat(password.length);
  }

  // 문자열 자르기 (말줄임표 추가)
  static truncate(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  }
}

// 사용 예시
console.log(StringUtils.isValidEmail("test@example.com")); // true
console.log(StringUtils.formatPhoneNumber("01012345678")); // "010-1234-5678"
console.log(StringUtils.maskPassword("password123")); // "***********"
console.log(StringUtils.truncate("긴 문장입니다", 5)); // "긴 문..."
```

### 5. 고급 문자열 처리

```javascript
class TextProcessor {
  // 단어 수 세기
  static countWords(text) {
    return text.trim().split(/\s+/).length;
  }

  // 특정 단어 출현 횟수
  static countOccurrences(text, word) {
    const regex = new RegExp(word, "gi");
    return (text.match(regex) || []).length;
  }

  // 케이스 변환
  static toCamelCase(text) {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  // URL 슬러그 생성
  static createSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

// 사용 예시
const text = "Hello World! Hello JavaScript!";
console.log(TextProcessor.countWords(text)); // 4
console.log(TextProcessor.countOccurrences(text, "hello")); // 2
console.log(TextProcessor.toCamelCase("hello-world")); // "helloWorld"
console.log(TextProcessor.createSlug("Hello World!")); // "hello-world"
```

### 6. 유용한 문자열 패턴

```javascript
class StringPatterns {
  // 첫 글자만 대문자로
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // 각 단어의 첫 글자를 대문자로
  static titleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => this.capitalize(word))
      .join(" ");
  }

  // 문자열 뒤집기
  static reverse(str) {
    return str.split("").reverse().join("");
  }

  // 랜덤 문자열 생성
  static generateRandom(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  }
}

// 사용 예시
console.log(StringPatterns.capitalize("hello")); // "Hello"
console.log(StringPatterns.titleCase("hello world")); // "Hello World"
console.log(StringPatterns.reverse("hello")); // "olleh"
console.log(StringPatterns.generateRandom(8)); // 랜덤 8자 문자열
```

### 꿀팁! 🍯

1. 성능 최적화

```javascript
// 문자열 연결할 때
// BAD
let result = "";
for (let i = 0; i < 1000; i++) {
    result += i;  // 매번 새 문자열 생성

// GOOD
const parts = [];
for (let i = 0; i < 1000; i++) {
    parts.push(i);
}
const result = parts.join("");  // 한 번에 연결
```

2. 정규식 활용

```javascript
// 문자열 검색/치환 시 정규식 활용
const text = "Hello123World456";

// 숫자만 추출
console.log(text.match(/\d+/g)); // ["123", "456"]

// 문자만 추출
console.log(text.match(/[a-zA-Z]+/g)); // ["Hello", "World"]
```

이제 문자열 메소드는 마스터! 😎
텍스트 처리가 필요한 어떤 상황에서도 자신있게 코딩할 수 있을 거야!
