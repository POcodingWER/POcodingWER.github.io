---
layout: post
title: "[Rust] study Control flow statement"
subtitle: "Rust 제어문 레스기릿"

date: 2024-08-19 09:59:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/why_rust.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true

tags:
  - rust
  - Control flow statement
  - 러스트
  - 제어문
---

> 참고문서  
> [ 《 Rust_Book 》 ](https://doc.rust-kr.org/)  
> [ 《 프로그래밍 언어 러스트를 배웁시다! 》 ](https://www.youtube.com/watch?v=W9DO6m8JSSs&list=PLfllocyHVgsSJf1zO6k6o3SX2mbZjAqYE)

<!-- > [ 《 Rust paly ground 》 ](https://tourofrust.com/chapter_1_ko.html) -->

## Rust Study Control flow statement

이번 장에서는 Rust의 기초적인 흐름 제어 방법에 대해 얘기해 봅시다.  
만약 여러분이 C 기반의 언어에 익숙하다면 마치 집에 온 것처럼 편안할 것이며 아마 한 두가지 정도의 놀랄 거리를 즐길 수 있을겁니다.

### 1. if/else if/else

Rust에서의 코드 분기는 놀랄게 없습니다.

조건문에 괄호가 없습니다! 괄호가 필요하긴 했던가요? 우리의 로직이 이제 멋지고 깔끔해 보입니다.

모든 일반적인 관계 연산자와 논리 연산자가 그대로 동작합니다: `==`, `!=`, `<`, `>`, `<=`, `>=`, `!`, `||`, `&&`.

```rust
fn main() {
    let x = 42;
    if x < 42 {
        println!("42보다 작다");
    } else if x == 42 {
        println!("42와 같다");
    } else {
        println!("42보다 크다");
    }
}
```

```cmd
$ 42와 같다
```

### 2. loop

무한 반복문이 필요하십니까?

Rust에서는 쉬운 일입니다.

`break`는 여러분이 준비되면 loop을 탈출하게 해줍니다.

`loop`에는 우리가 곧 알아볼 비밀이 한 가지 있습니다.

```rust
fn main() {
    let mut x = 0;
    loop {
        x += 1;
        if x == 42 {
            break;
        }
    }
    println!("{}", x);
}
```

```cmd
$ 42
```

### 3. while

`while`은 반복문에 조건을 간단히 넣을 수 있게 해줍니다.

조건의 평가결과가 `false`인 경우, 반복문은 종료됩니다.

```rust
fn main() {
    let mut x = 0;
    while x != 42 {
        x += 1;
    }
    println!("{}", x);
}
```

```cmd
$ 42
```

### 4. for

Rust의 `for` 반복문은 강력한 업그레이드입니다. 어떠한 표현이든지, 그로부터 평가된 반복자의 값을 반복합니다. 반복자란 무엇일까요? 반복자는 더 가진게 없을 때까지 "다음에 가진게 뭐야?" 라고 요청할 수 있는 객체입니다.

이건 앞으로 더 살펴볼겁니다. 그동안에는 일단 Rust가 정수의 배열을 생성하는 반복자를 만들기 쉽게 한다고만 알고 있읍시다.

`..` 연산자는 시작 숫자에서 끝 숫자 전까지의 숫자들을 생성하는 반복자를 만듭니다.

`..=` 연산자는 시작 숫자에서 끝 숫자까지의 숫자들을 생성하는 반복자를 만듭니다.

```rust
fn main() {
    for x in 0..5 {
        println!("{}", x);
    }

    for x in 0..=5 {
        println!("{}", x);
    }
}
```

```cmd
$ 0
$ 1
$ 2
$ 3
$ 4
$ 0
$ 1
$ 2
$ 3
$ 4
$ 5
```

### 5. match

switch 구문이 그리우십니까? Rust는 모든 가능한 조건의 값들을 대조하고 그 결과가 true인 경우 해당 코드 경로를 실행하는, 엄청나게 유용한 키워드를 갖고 있습니다. 앞으로의 장에서는 더 복잡한 데이터의 패턴을 대조하는 방법에 대해 얘기할 것입니다. 약속컨대, 기다린 보람이 있을겁니다.

`match`의 조건은 빠짐 없이 모든 케이스를 처리해야 합니다.

match와 분해의 조합은 현재까지 Rust에서 가장 흔하게 사용하는 패턴입니다.

```rust
fn main() {
    let x = 42;

    match x {
        0 => {
            println!("0 발견");
        }
        // 여러 개 값과 대조할 수 있다
        1 | 2 => {
            println!("1 또는 2 발견!");
        }
        // 범위로 대조할 수 있다
        3..=9 => {
            println!("3에서 9까지의 숫자 발견");
        }
        // 찾은 숫자를 변수에 바인딩할 수 있다
        matched_num @ 10..=100 => {
            println!("10에서 100까지의 숫자 {} 발견!", matched_num);
        }
        // 모든 케이스가 처리되지 않았을 경우 반드시 존재해야 하는 기본 match
        _ => {
            println!("뭔가 다른거 발견!");
        }
    }
}
```

```cmd
$ 10에서 100까지의 숫자 42 발견!
```

### 6. loop에서 값 리턴하기

`loop`에서 break과 동시에 값을 리턴할 수 있습니다.

```rust
fn main() {
    let mut x = 0;
    let v = loop {
        x += 1;
        if x == 13 {
            break "13 찾았다";
        }
    };
    println!("loop에서: {}", v);
}
```

```cmd
$ loop에서: 13 찾았다
```

### 7. 블록 표현에서 값 리턴하기

Rust에서 `if`, `match`, 함수, 그리고 범위 블록은 모두 고유의 값 리턴 방식을 갖고 있습니다.

`if`, `match`, 함수, 또는 범위 블록의 마지막 구문에 ';'가 없다면 Rust는 그 값을 블록의 리턴 값으로 간주합니다. 이는 새 변수에 할당할 값을 리턴하는 간단한 로직을 생성하는데 아주 좋은 방법입니다.

`if` 구문을 간단한 3항 연산자처럼 쓸 수도 있다는 점 눈여겨 보세요.

```rust
fn example() -> i32 {
    let x = 42;
    // Rust의 3항 연산 표현
    let v = if x < 42 { -1 } else { 1 };
    println!("if로부터: {}", v);

    let food = "햄버거";
    let result = match food {
        "핫도그" => "핫도그다",
        // 리턴문 하나 뿐이라면 중괄호는 필수가 아님
        _ => "핫도그가 아니다",
    };
    println!("음식 판별: {}", result);

    let v = {
        // 이 범위 블록은 함수 범위를 더럽히지 않고 값을 가져오게 해준다
        let a = 1;
        let b = 2;
        a + b
    };
    println!("block에서: {}", v);

    // Rust에서 함수 마지막에 값을 리턴하는 관용적 표현
    v + 4
}

fn main() {
    println!("function에서: {}", example());
}
```

```cmd
$ if로부터: 1
$ 음식 판별: 핫도그가 아니다
$ block에서: 3
$ function에서: 7
```

## 마무리

가장 기초적인 기능이었지만 Rust의 강력함을 맛보셨길 바랍니다.  
`for`와 `match`에 대해서는 이들을 활용할 지식을 더 얻게 됨에 따라 훨씬 더 자세히 살펴보도록 하겠습니다.  
다음 번에는 Rust의 기본 데이터 구조에 대해 레스기릿!.
