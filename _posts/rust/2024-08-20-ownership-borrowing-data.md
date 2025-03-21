---
layout: post
title: "[Rust] study Ownership & Borrowing Data"
subtitle: "Rust 소유권과 데이터 대여"

date: 2024-08-20 13:43:00
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
  - Borrowing Data
  - 소유권과 데이터 대여
---

{% include post/rust_contents.md %}

> 참고문서  
> [ 《 Tour of Rust 》 ](https://tourofrust.com/chapter_5_ko.html)  
> [ 《 Rust_Book 》 ](https://doc.rust-kr.org/)  
> [ 《 프로그래밍 언어 러스트를 배웁시다! 》 ](https://www.youtube.com/watch?v=W9DO6m8JSSs&list=PLfllocyHVgsSJf1zO6k6o3SX2mbZjAqYE)

<!-- > [ 《 Rust paly ground 》 ](https://tourofrust.com/chapter_1_ko.html) -->

## Rust Study Ownership & Borrowing Data

Rust는 메모리 관리에 있어 다른 프로그래밍 언어에 비해 독특한 패러다임을 갖고 있습니다.
이제 컴파일러의 동작과 검증방식에 대해 차근차근 살펴볼 예정입니다. 중요한 것은, 앞으로 나올 규칙들은 여러분의 삶을 힘들게 하려고 존재하는게 아니라, 코드의 오류를 줄여주기 위한 것이란 점입니다!

### 1. 소유권

자료형을 인스턴스화 하여 변수명에 할당(`binding`)하는 행위는 Rust 컴파일러가 전체 생명주기(`lifetime`)동안 검증할 메모리 리소스를 생성하는 것입니다. 할당된 변수는 리소스의 소유자(`owner`)라고 불립니다.

```rust
struct Foo {
    x: i32,
}

fn main() {
    // struct를 인스턴스화 하고 변수에 bind하여
    // 메모리 리소스를 생성함
    let foo = Foo { x: 42 };
    // foo가 owner임
}
```

### 2. 범위 기반 리소스 관리

Rust는 범위(scope)가 끝나는 곳에서 리소스를 소멸하고 할당 해제합니다.

이 소멸과 할당 해제를 의미하는 용어로 **drop**을 사용합니다.

메모리 상세:

- Rust에는 가비지 컬렉션이 없습니다.
- 이는 C++에서는 Resource Acquisition Is Initialization ( RAII ) 라고 부릅니다.

```rust
struct Foo {
    x: i32,
}

fn main() {
    let foo_a = Foo { x: 42 };
    let foo_b = Foo { x: 13 };

    println!("{}", foo_a.x);

    println!("{}", foo_b.x);
    // foo_b가 여기서 drop 됩니다
    // foo_a가 여기서 drop 됩니다
}
```

```cmd
$ 42
$ 13
```

### 3. Dropping은 계층적이다

struct가 drop 될 때는, struct 자신이 제일 먼저 drop 되고, 이후에 그 자식들이 각각 drop 되고, 등의 순서로 처리됩니다.

메모리 상세:

- Rust에서는 메모리를 자동으로 해제함으로써 메모리 누수가 덜 일어나도록 합니다.
- 메모리 리소스는 단 한 번 drop 될 수 있습니다.

```rust
struct Bar {
    x: i32,
}

struct Foo {
    bar: Bar,
}

fn main() {
    let foo = Foo { bar: Bar { x: 42 } };
    println!("{}", foo.bar.x);
    // foo가 먼저 drop 되고
    // 그 다음에 foo.bar가 drop 됩니다
}
```

```cmd
$ 42
```

### 4. 소유권 이전

owner가 함수의 인자로 전달되면, ownership은 그 함수의 매개변수로 이동(move)됩니다.

`move` 이후에는 원래 함수에 있던 변수는 더 이상 사용할 수 없습니다.

메모리 상세:

- `move` 중에는 owner 값의 stack 메모리가 함수 호출의 매개변수 stack 메모리로 복사됩니다.

```rust
struct Foo {
    x: i32,
}

fn do_something(f: Foo) {
    println!("{}", f.x);
    // f가 여기서 drop 됩니다
}

fn main() {
    let foo = Foo { x: 42 };
    // foo가 do_something으로 move 됩니다
    do_something(foo);
    // foo는 더 이상 사용할 수 없습니다
}
```

```cmd
$ 42
```

### 5. 소유권 리턴하기

ownership은 함수에서도 리턴될 수 있습니다.

```rust
struct Foo {
    x: i32,
}

fn do_something() -> Foo {
    Foo { x: 42 }
    // ownership이 밖으로 move 됩니다
}

fn main() {
    let foo = do_something();
    // foo가 owner가 되었습니다
    // 함수의 scope 끝에 도달했기 때문에 foo는 drop 됩니다
}
```

### 6. 참조로 소유권 대여하기

`&` 연산자를 통해 참조로 리소스에 대한 접근권한을 대여할 수 있습니다.

참조도 다른 리소스와 마찬가지로 drop 됩니다.

```rust
struct Foo {
    x: i32,
}

fn main() {
    let foo = Foo { x: 42 };
    let f = &foo;
    println!("{}", f.x);
    // f는 여기서 drop 됩니다
    // foo는 여기서 drop 됩니다
}
```

```cmd
$ 42
```

### 7. 참조로 변경 가능한 소유권 대여하기

`&mut` 연산자를 통해 리소스에 대한 mutable한 접근 권한도 대여할 수 있습니다.

리소스의 owner는 mutable하게 대여된 상태에서는 move 되거나 변경될 수 없습니다.

메모리 상세:

- Rust는 데이터 경합의 가능성 때문에 소유된 값을 변경하는 방법이 여러 개 생기는 것을 방지합니다.

```rust
struct Foo {
    x: i32,
}

fn do_something(f: Foo) {
    println!("{}", f.x);
    // f는 여기서 drop 됩니다
}

fn main() {
    let mut foo = Foo { x: 42 };
    let f = &mut foo;

    // FAILURE: do_something(foo) 은 실패할 것입니다
    // 왜냐하면 foo는 mutable하게 borrow된 상태에서는 move될 수 없기 때문입니다

    // FAILURE: foo.x = 13; 는 여기서 실패할 것입니다
    // 왜냐하면 foo는 mutable하게 borrow된 상태에서는 변경할 수 없기 때문입니다

    f.x = 13;
    // f는 이 시점 이후 더 이상 사용되지 않기 때문에 여기서 drop 됩니다

    println!("{}", foo.x);

    // 모든 mutable 참조가 drop 되었으므로 이제 문제 없이 동작합니다
    foo.x = 7;

    // foo의 ownership을 함수로 move 합니다
    do_something(foo);
}
```

```cmd
$ 13
$ 7
```

### 8. 역참조

`&mut` 참조를 이용해 `*` 연산자로 owner의 값을 설정할 수 있습니다.

`*`연산자로 own된 값의 복사본도 가져올 수 있습니다 (복사 가능한 경우만 - 복사 가능한 자료형에 대해서는 이후에 설명하겠습니다).

```rust
fn main() {
    let mut foo = 42;
    let f = &mut foo;
    let bar = *f; // owner의 값의 복사본을 가져옴
    *f = 13; // 참조의 owner의 값을 설정함
    println!("{}", bar);
    println!("{}", foo);
}
```

```cmd
$ 42
$ 13
```

### 9. 대여한 데이터 전달하기

Rust의 참조 규칙은 다음과 같이 요약될 수 있습니다:

- Rust는 단 하나의 mutable한 참조 또는 여러개의 non-mutable 참조만 허용하며, 둘 다는 안됨.
- 참조는 그 owner보다 더 오래 살 수 없음.
  이는 보통 함수로 참조를 넘겨줄 때에는 문제가 되지 않습니다.

메모리 상세:

- 첫 번째 참조 규칙은 데이터 경합을 방지합니다. 데이터 경합이 뭐냐구요? 데이터 경합은 데이터를 읽는 행위가 동시에 데이터를 쓰는 이의 존재로 인해 동기화가 어긋날 가능성이 있을 때 일어납니다. 이는 멀티쓰레드 프로그래밍에서 종종 발생합니다.
- 두 번째 참조 규칙은 존재하지 않는 데이터를 바라보는 잘못된 참조를 사용하는 것을 방지합니다 (이를 C에서는 허상 포인터(dangling pointers)라고 부릅니다).

```rust
struct Foo {
    x: i32,
}

fn do_something(f: &mut Foo) {
    f.x += 1;
    // mutable 참조 f는 여기서 drop 됩니다
}

fn main() {
    let mut foo = Foo { x: 42 };
    do_something(&mut foo);
    // 모든 mutable 참조가 do_something 함수 내에서 drop 되므로,
    // 하나 더 생성할 수 있습니다.
    do_something(&mut foo);
    // foo는 여기서 drop 됩니다
}
```

### 10. 참조의 참조

참조는 심지어 참조에도 사용될 수 있습니다.

```rust
struct Foo {
    x: i32,
}

fn do_something(a: &Foo) -> &i32 {
    return &a.x;
}

fn main() {
    let mut foo = Foo { x: 42 };
    let x = &mut foo.x;
    *x = 13;
    // 여기서 x가 drop 되어 non-mutable 참조를 생성할 수 있습니다
    let y = do_something(&foo);
    println!("{}", y);
    // y는 여기서 drop 됩니다
    // foo는 여기서 drop 됩니다
}
```

```cmd
$ 13
```

### 11. 명시적인 생명주기

Rust 코드에서 항상 볼 수 있는 것은 아니지만, 컴파일러는 모든 변수의 lifetime을 이해하며 참조가 절대로 그 owner보다 더 오래 존재하지 못하도록 검증을 시도합니다.

함수에서는 어떤 매개변수와 리턴 값이 서로 같은 lifetime을 공유하는지 식별할 수 있도록 심볼로 표시하여 명시적으로 생명주기를 지정할 수 있습니다.

lifetime 지정자는 언제나 `'`로 시작합니다. (예: `'a`, `'b`, `'c`)

```rust
struct Foo {
    x: i32,
}

// 매개변수 foo와 리턴 값은 동일한 lifetime을 공유함
fn do_something<'a>(foo: &'a Foo) -> &'a i32 {
    return &foo.x;
}

fn main() {
    let mut foo = Foo { x: 42 };
    let x = &mut foo.x;
    *x = 13;
    // x가 여기서 drop 되어, non-mutable 참조를 생성할 수 있음
    let y = do_something(&foo);
    println!("{}", y);
    // y는 여기서 drop 됨
    // foo는 여기서 drop 됨
}
```

```cmd
$ 13
```

### 12. 여러 개의 생명주기

lifetime 지정자는 컴파일러가 스스로 함수 매개변수들의 lifetime을 판별하지 못하는 경우, 이를 명시적으로 지정할 수 있게 도와줍니다.

```rust
struct Foo {
    x: i32,
}

// foo_b와 리턴 값은 동일한 lifetime을 공유함
// foo_a는 무관한 lifetime을 가짐
fn do_something<'a, 'b>(foo_a: &'a Foo, foo_b: &'b Foo) -> &'b i32 {
    println!("{}", foo_a.x);
    println!("{}", foo_b.x);
    return &foo_b.x;
}

fn main() {
    let foo_a = Foo { x: 42 };
    let foo_b = Foo { x: 12 };
    let x = do_something(&foo_a, &foo_b);
    // 여기 이후에는 foo_b의 lifetime만 존재하므로 foo_a만 drop 됨
    println!("{}", x);
    // 여기서 x가 drop 됨
    // 여기서 foo_b가 drop 됨
}
```

```cmd
$ 42
$ 12
$ 12
```

### 13. 정적인 생명주기

static 변수는 컴파일 타임에 생성되어 프로그램의 시작부터 끝까지 존재하는 메모리 리소스입니다. 이들은 명시적으로 자료형을 지정해 주어야 합니다.

static lifetime은 프로그램이 끝날 때까지 무한정 유지되는 메모리 리소스입니다. 이 정의에 따르면, 어떤 static lifetime의 리소스는 런타임에 생성될 수도 있다는 점 알아두세요.

static lifetime을 가진 리소스는 `'static`이라는 특별한 lifetime 지정자를 갖습니다.

`'static`한 리소스는 절대 drop 되지 않습니다.

만약 static lifetime을 가진 리소스가 참조를 포함하는 경우, 그들도 모두 `'static`이어야 합니다 (그 이하의 것들은 충분히 오래 살아남지 못합니다).

메모리 상세:

- static 변수는 어느 누구에 의해서든 전역적으로 접근 가능하기 때문에, 이를 변경하는 것은 데이터 경합을 유발하는, 본질적으로 위험한 행위입니다. 전역 데이터에 대한 내용은 이후에 얘기하도록 하겠습니다.
- Rust에서는 `unsafe { ... }` 블록을 이용하여 특정 동작에 대해 컴파일러가 메모리 검사를 하지 않도록 할 수 있습니다. 생각 없이 R̸͉̟͈͔̄͛̾̇͜U̶͓͖͋̅Ṡ̴͉͇̃̉̀T̵̻̻͔̟͉́͆Ơ̷̥̟̳̓͝N̶̨̼̹̲͛Ö̵̝͉̖̏̾̔M̶̡̠̺̠̐͜Î̷̛͓̣̃̐̏C̸̥̤̭̏͛̎͜O̶̧͚͖͔̊͗̇͠N̸͇̰̏̏̽̃에 대해 이야기 하지 않도록 합시다.

```rust
static PI: f64 = 3.1415;

fn main() {
    // static 변수는 함수 scope 안에도 넣을 수 있습니다
    static mut SECRET: &'static str = "swordfish";

    // string 값들은 'static lifetime을 갖습니다
    let msg: &'static str = "Hello World!";
    let p: &'static f64 = &PI;
    println!("{} {}", msg, p);

    // 일부 규칙은 깰 수 있으나, 반드시 명시적으로 해야 합니다
    unsafe {
        // SECRET에 string 값을 설정할 수 있는데, 이 값 역시 'static이기 때문입니다
        SECRET = "abracadabra";
        println!("{}", SECRET);
    }
}
```

```cmd
$ Hello World! 3.1415
$ abracadabra
```

### 14. 데이터 자료형의 생명주기

함수와 마찬가지로, 데이터 자료형의 구성원들도 lifetime 지정자로 지정할 수 있습니다.

Rust는 참조가 품고 있는 데이터 구조가 참조가 가리키는 owner보다 절대 오래 살아남지 못하도록 검증합니다.

아무 것도 아닌 것을 가리키는 참조를 들고 다니는 struct란 있을 수 없습니다!

```rust
struct Foo<'a> {
    i:&'a i32
}

fn main() {
    let x = 42;
    let foo = Foo {
        i: &x
    };
    println!("{}",foo.i);
}
```

```cmd
$ 42
```

## 마무리

한번 `Ownership`을 넘겨주던 뺏기면 다시 실행은 불가 하지만 `&`사용하여 빌려주거나 할수있다.  
`&mut` 또한 변경가능한 `Ownership`넘겨줄수있따.

- 의도하지 않은 리소스 변경
- 리소스를 깜빡하고 소멸하지 않음
- 리소스를 실수로 두 번 소멸함
- 리소스가 소멸된 뒤에 사용함
- 다른 곳에서 읽고 있는 리소스에 쓰기를 하여 데이터 경합을 일으킴
- 컴파일러가 보증할 수 없는 코드가 뻔히 보임

다음 에는 Rust가 어떻게 텍스트를 다루는지 보면서 이런 지식들을 적용해볼 예정.
