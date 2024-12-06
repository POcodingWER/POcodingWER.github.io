---
layout: post
title: "[Programming Foundation] 컴파일러 & 인터프리터"

subtitle: "컴파일러와 인터프리터의 차이점"

date: 2024-12-06 09:51:12
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
  - 컴파일러
  - 인터프리터
---

### 1. 컴파일러 언어

소스 코드 전체를 기계어로 한 번에 변환한 후 실행하는 방식입니다.

```cpp
// C++ 예시
#include <iostream>

int main() {
    std::cout << "Hello World"; // 이 코드는 바로 실행되지 않음
    return 0;
}
```

**실행 과정**

1. 소스코드 작성
2. 컴파일 (전체 코드를 기계어로 변환)
3. 실행 파일 생성
4. 프로그램 실행

**장점**

- 실행 속도가 빠름
- 컴파일 시점에 에러 검출
- 한번 컴파일하면 실행 파일만으로 동작

**단점**

- 개발 속도가 상대적으로 느림
- 플랫폼 의존적
- 컴파일 시간이 필요

### 2. 인터프리터 언어

소스 코드를 한 줄씩 읽어가며 바로 실행하는 방식입니다.

```javascript
// JavaScript 예시
console.log("첫 번째 줄"); // 즉시 실행
console.log("두 번째 줄"); // 이전 줄 실행 후 실행
```

**실행 과정**

1. 소스코드 작성
2. 한 줄씩 즉시 해석하여 실행
3. 별도의 실행 파일 없음

**장점**

- 즉시 실행 가능
- 플랫폼 독립적
- 개발 및 디버깅이 쉬움

**단점**

- 실행 속도가 상대적으로 느림
- 런타임 에러 가능성 높음

### 실제 동작 비교

**컴파일러 언어 (C++)**

```cpp
// 전체 코드를 먼저 컴파일
int main() {
    int x = 10;
    int y = 20;
    int result = x + y;  // 모든 코드가 기계어로 변환된 후 실행
    printf("%d", result);
    return 0;
}
```

**인터프리터 언어 (JavaScript)**

```javascript
// 한 줄씩 실행
let x = 10; // 1. 이 줄 실행
let y = 20; // 2. 이 줄 실행
let result = x + y; // 3. 이 줄 실행
console.log(result); // 4. 이 줄 실행
```

### 하이브리드 방식

현대의 많은 언어들은 두 가지 방식을 혼합하여 사용합니다.

**Java의 경우**

1. 소스코드(.java) → 바이트코드(.class) 컴파일
2. JVM이 바이트코드를 인터프리팅
3. 자주 사용되는 코드는 JIT 컴파일러가 기계어로 변환

**JavaScript의 V8 엔진**

1. 인터프리터로 코드 실행
2. 자주 실행되는 코드는 JIT 컴파일러로 최적화

### 언어별 분류

**컴파일러 언어**

- C
- C++
- Rust
- Go

**인터프리터 언어**

- JavaScript
- Python
- Ruby
- PHP

이러한 차이점을 이해하면 각 언어의 특성과 용도에 맞는 적절한 선택을 할 수 있습니다.
