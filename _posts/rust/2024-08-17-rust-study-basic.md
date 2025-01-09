---
layout: post
title: "[Rust] study basic"
subtitle: "Rust 기초 레스기릿"

date: 2024-08-18 23:00:00
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
categories:
  - RustStudy
tags:
  - rust
  - 러스트
  - 변수
  - 기초
---

> 참고문서  
> [ 《 Tour of Rust 》 ](https://tourofrust.com/chapter_1_ko.html)  
> [ 《 Rust_Book 》 ](https://doc.rust-kr.org/)  
> [ 《 프로그래밍 언어 러스트를 배웁시다! 》 ](https://www.youtube.com/watch?v=W9DO6m8JSSs&list=PLfllocyHVgsSJf1zO6k6o3SX2mbZjAqYE)

<!-- > [ 《 Rust paly ground 》 ](https://tourofrust.com/chapter_1_ko.html) -->

## Rust Study Basic

### 1. 변수

변수는 let 키워드를 사용해 선언됩니다.  
값을 할당할 때, Rust는 99% 확률로 여러분의 변수의 자료형을 유추할 수 있습니다. 유추가 불가능한 경우, 여러분의 변수 선언에 자료형을 추가해도 됩니다.  
동일한 이름의 변수에 여러번 값을 할당할 수 있다는걸 알아차리셨나요?  
이는 변수 숨김(variable shadowing)이라 불리며, 자료형도 변경할 수 있습니다.  
변수 이름은 언제나 `snake_case` 형태로 짓습니다.

```Rust
fn main() {
    // rust가 x의 자료형을 유추합니다
    let x = 13;
    println!("{}", x);

    // 자료형을 명시적으로 지정할 수도 있습니다
    let x: f64 = 3.14159;
    println!("{}", x);

    // 선언 후 나중에 초기화도 가능하지만, 보통 그렇게 하진 않습니다
    let x;
    x = 0;
    println!("{}", x);
}
```

```cmd
$ 13
$ 3.14159
$ 0
```

### 2. 변수의 값 변경하기

Rust는 어떤 변수가 변경 가능한지에 대해 굉장히 주의합니다. 값에는 다음의 두 가지가 있습니다:  
변경 가능(mutable) - 컴파일러가 변수에 값이 씌어지고 읽혀지는 것을 허용함  
변경 불가(immutable) - 컴파일러가 변수의 값이 읽히는 것만 허용함  
변경 가능(mutable)한 값은 mut 키워드로 표시합니다.  
이 개념에 대해서는 나중에 더 얘기하겠지만, 일단은 이 키워드를 눈여겨 봅시다.

```rust
fn main() {
    let mut x = 42;
    println!("{}", x);
    x = 13;
    println!("{}", x);
}
```

```cmd
$ 42
$ 13
```

### 3. 기본 자료형

Rust에는 다양하지만 익숙한 자료형들이 있습니다:

- 부울 값 - 참/거짓 값을 나타내는 `bool`
- 부호가 없는 정수형 - 양의 정수를 나타내는 `u8` `u16` `u32` `u64` `u128`
- 부호가 있는 정수형 - 양/음의 정수를 나타내는 `u8` `u16` `u32` `u64` `u128`
- 포인터 사이즈 정수 - 메모리에 있는 값들의 인덱스와 크기를 나타내는 `usize` `isize`
- 부동 소수점 - `f32` `f64`
- 튜플(tuple) - stack에 있는 값들의 고정된 순서를 전달하기 위한 `(값, 값, ...)`
- 배열(array) - 컴파일 타임에 정해진 길이를 갖는 유사한 원소들의 모음(collection)인 `[값, 값, ...]`
- 슬라이스(slice) - 런타임에 길이가 정해지는 유사한 원소들의 collection
- `str`(문자열 slice) - 런타임에 길이가 정해지는 텍스트

텍스트는 다른 익숙한 언어에서보다 복잡한데, 이는 Rust가 시스템 프로그래밍 언어이며 여러분이 지금까지 익숙하지 않았을 메모리 문제에 신경쓰기 때문입니다. 이에 대해서는 나중에 더 자세히 다루겠습니다.

숫자형 자료형들은 숫자 뒤에 자료형 이름을 붙여 명시적으로 지정할 수 있습니다 (예: `13u32`, `2u8`).

```rust
fn main() {
    let x = 12; // 기본적으로 i32
    let a = 12u8;
    let b = 4.3; // 기본적으로 f64
    let c = 4.3f32;
    let bv = true;
    let t = (13, false);
    let sentence = "hello world!";
    println!(
        "{} {} {} {} {} {} {} {}",
        x, a, b, c, bv, t.0, t.1, sentence
    );
}

```

```cmd
$ 12 12 4.3 4.3 true 13 false hello world!
```

### 4.기본 자료형 변환

Rust에서는 숫자형 자료형을 쓸 때 명시적으로 써야 합니다. 생각 없이 `u8`을 `u32`에 쓴다거나 하면 오류가 발생합니다.

다행히도 Rust에서는 as 키워드를 사용해 숫자형 자료형을 매우 쉽게 변환할 수 있습니다.

```rust
fn main() {
    let a = 13u8;
    let b = 7u32;
    let c = a as u32 + b;
    println!("{}", c);

    let t = true;
    println!("{}", t as u8);
}
```

```cmd
$ 20
$ 1
```

### 5.상수

상수는 우리의 코드 내에서 여러번 사용되는 공통 값을 효과적으로 지정할 수 있게 해줍니다. 사용될 때 값이 복사되는 변수와 달리, 상수는 컴파일 타임에 텍스트 지정자를 직접 값으로 대체합니다.

변수와 달리, 상수는 반드시 명시적으로 자료형을 지정해야 합니다.

상수의 이름은 언제나 `SCREAMING_SNAKE_CASE` 형태로 짓습니다.

```rust
const PI: f32 = 3.14159;

fn main() {
    println!(
        "아무 재료 없이 애플 {}를 만들려면, 먼저 우주를 만들어야 한다.",
        PI
    );
}
```

```cmd
$ 아무 재료 없이 애플 3.14159를 만들려면, 먼저 우주를 만들어야 한다.
```

### 6.배열

배열(array)은 고정된 길이로 된 모두 같은 자료형의 자료를 가진 collection입니다.

array의 자료형은 `[T;N]`로 표현하며, 여기서 T는 원소의 자료형, N은 컴파일 타임에 주어지는 고정된 길이입니다.

각각의 원소는 `[x]` 연산자로 가져올 수 있는데, 여기서 x는 여러분이 원하는 원소의 (0에서부터 시작하는) usize 형의 인덱스입니다.

```rust
fn main() {
    let nums: [i32; 3] = [1, 2, 3];
    println!("{:?}", nums);
    println!("{}", nums[1]);
}
```

```cmd
$ [1, 2, 3]
$ 2
```

### 7.함수

함수는 0개 또는 그 이상의 인자를 가집니다.

이 예제에서 add 함수는 i32 (32비트 길이의 부호가 있는 정수형) 자료형의 인자 2개를 받습니다.

함수의 이름은 언제나 snake_case 형태로 짓습니다.

```rust
fn add(x: i32, y: i32) -> i32 {
    return x + y;
}

fn main() {
    println!("{}", add(42, 13));
}
```

```cmd
$ 55
```

### 8.여러개의 리턴 값

함수는 튜플(tuple)을 리턴함으로써 여러개의 값을 리턴할 수 있습니다.

tuple의 원소는 인덱스 숫자를 통해 참조할 수 있습니다.

Rust는 데이터 구조의 일부분을 편하게 추출할 수 있도록 해주는 다양한 형태의 분해(destructuring) 방법을 지원합니다. 잘 지켜보세요!

```rust
fn swap(x: i32, y: i32) -> (i32, i32) {
    return (y, x);
}

fn main() {
    // 리턴 값의 튜플을 리턴
    let result = swap(123, 321);
    println!("{} {}", result.0, result.1);

    // 튜플을 두 변수명으로 분해
    let (a, b) = swap(result.0, result.1);
    println!("{} {}", a, b);
}
```

```cmd
$ 321 123
$ 123 321
```

### 9.아무것도 리턴하지 않기

함수에 리턴형을 지정하지 않은 경우 빈 tuple을 리턴하는데, 이는 unit이라고도 합니다.

빈 tuple은 `()`로 표현합니다.

`()`를 사용하는 경우는 드물지만, 뭔지 알아두는 것이 좋을 정도로 꽤 자주 마주치게 될겁니다.

```rust
 fn make_nothing() -> () {
    return ();
}

// 리턴 자료형은 ()로 암시
fn make_nothing2() {
    // 리턴할 것이 지정되지 않으면 이 함수는 ()를 리턴함
}

fn main() {
    let a = make_nothing();
    let b = make_nothing2();

    // 아무 것도 없는 것은 출력하기 힘들기 때문에
    // a와 b의 디버그 문자열을 출력한다
    println!("The value of a: {:?}", a);
    println!("The value of b: {:?}", b);
}
```

```cmd
$ The value of a: ()
$ The value of b: ()
```

## 마무리

rust /js

|      |                 JS                 |                   Rust                   |
| :--- | :--------------------------------: | :--------------------------------------: |
| 상수 |               const                |                   let                    |
| 변수 |                let                 |                 let mut                  |
| 배열 |                 []                 |       [i32; 3] 배열개수를 정해야됨       |
| 함수 | () => {}, function name(params) {} | fn main() {println!("{}", add(42, 13));} |
| 출력 |           console.log()            |                println!()                |

우리는 Rust 컴파일러가 어떻게 생각을 하는지 들여다 보았습니다. Rust는 시스템 프로그래밍 언어로서 메모리 내 값들의 크기와, 값들이 변경 가능한지 아닌지, 그리고 계산식이 의도한 대로인지를 매우 조심히 따져봅니다.

다음에는 우리의 오랜 친구인 `if` 조건문과 `for` 반복문에 대해 레스기릿 해보겠다..
