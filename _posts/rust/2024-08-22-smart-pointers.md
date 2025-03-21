---
layout: post
title: "[Rust] study Smart Pointers"
subtitle: "Rust 스마트 포인터"

date: 2024-08-22 13:12:00
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
  - Smart Pointers
  - 스마트 포인터
---

{% include post/rust_contents.md %}

> 참고문서  
> [ 《 Tour of Rust 》 ](https://tourofrust.com/chapter_8_ko.html)  
> [ 《 Rust_Book 》 ](https://doc.rust-kr.org/)  
> [ 《 프로그래밍 언어 러스트를 배웁시다! 》 ](https://www.youtube.com/watch?v=W9DO6m8JSSs&list=PLfllocyHVgsSJf1zO6k6o3SX2mbZjAqYE)

## 스마트 포인터

이번 장에서는 smart pointer에 대해 명확하고 쉽게 이해해 보겠습니다. 가장 저수준의 메모리를 다룰 수 있게 해주는 자료 구조에 대해 알아봅시다.

Ferris가 말합니다: "이번 장을 짧게 한 번 읽고서 저수준 메모리 관리 코드를 짜지 못한다고 해도 거기에 압도되지 마세요. 이번 장은 주로 유용한 도구들의 소개와 함께 그들의 동작 방식을 가볍게 살펴보기 위함이니까요!"

### 1. 참조 다시 보기

참조는 근본적으로 메모리 상의 어떤 바이트들의 시작 위치를 가리키는 숫자일 뿐입니다. 참조의 유일한 용도는 특정 자료형의 데이터가 어디에 존재하는지에 대한 개념을 나타내는 것입니다. 일반 숫자와의 차이점은 Rust에서 참조가 가리키는 값보다 더 오래 살지 않도록 lifetime을 검증한다는 것입니다 (안그러면 그걸 사용했을 때 오류가 날 것입니다!).

### 2. 원시 포인터

참조는 더 원시적인 자료형인 raw pointer로 변환될 수 있습니다. raw pointer는 숫자와 마찬가지로 거의 제한 없이 여기저기 복사하고 이동할 수 있습니다. Rust는 raw pointer가 가리키는 메모리 위치의 유효성을 보증하지 않습니다.

raw pointer에는 두 종류가 있습니다:

- `*const` T - 자료형 T의 데이터를 가리키는 절대 변경되지 않는 raw pointer.
- `*mut` T - 자료형 T의 데이터를 가리키는 변경될 수 있는 raw pointer.
  raw pointer는 숫자와 상호 변환이 가능합니다 (예: `usize`).

raw pointer는 unsafe한 코드의 데이터에 접근할 수 있습니다 (이에 대해서는 뒤에 다루겠습니다).

메모리 상세:

- Rust에서의 참조는 사용 방법에 있어서 C의 pointer와 매우 유사하나, 저장되는 방식이나 다른 함수에 전달되는 부분에 있어 훨씬 많은 컴파일 타임의 제약을 받습니다.
- Rust에서의 raw pointer는 복사하고 전달하고 심지어 pointer 연산을 할 수 있는 숫자 자료형으로 변환할 수도 있다는 점에서 C의 pointer와 유사합니다.

```rust
fn main() {
    let a = 42;
    let memory_location = &a as *const i32 as usize;
    println!("데이터는 여기 있습니다: {}", memory_location);
}
```

```cmd
$ 데이터는 여기 있습니다: 140724479452332
```

### 3. 역참조

참조 (i.e. `&i32`)를 통해 참조되는 데이터를 접근/변경하는 과정을 역참조라고 합니다.

참조로 데이터에 접근/변경하는 데에는 다음의 두 가지 방법이 있습니다:

변수 할당 중에 참조되는 데이터에 접근.

- 참조되는 데이터의 field나 메소드에 접근.
- Rust에는 이를 가능케 하는 강력한 연산자가 있습니다.

### 4. \* 연산자

`*` 연산자는 참조를 역참조 하는 명시적인 방법입니다.

    let a: i32 = 42;
    let ref_ref_ref_a: &&&i32 = &&&a;
    let ref_a: &i32 = **ref_ref_ref_a;
    let b: i32 = *ref_a;

메모리 상세:

i32는 `Copy` trait을 구현하는 기본 자료형이기 때문에, stack에 있는 변수 `a`의 바이트들은 변수 `b`의 바이트들로 복사됩니다.

```rust
fn main() {
    let a: i32 = 42;
    let ref_ref_ref_a: &&&i32 = &&&a;
    let ref_a: &i32 = **ref_ref_ref_a;
    let b: i32 = *ref_a;
    println!("{}", b)
}
```

```cmd
$ 42
```

### 5. `.`연산자

`.` 연산자는 참조의 field와 메소드에 접근하는 데에 쓰입니다. 이건 좀 더 미묘하게 동작합니다.

    let f = Foo { value: 42 };
    let ref_ref_ref_f = &&&f;
    println!("{}", ref_ref_ref_f.value);

아니, 왜 `ref_ref_ref_f` 앞에 `***`을 안넣어도 되는거죠? 그건 바로 `.` 연산자가 참조 열을 자동으로 역참조 했기 때문입니다. 저 마지막 줄은 컴파일러에 의해 자동적으로 다음과 같이 바뀌게 됩니다:

    println!("{}", (\*\*\*ref_ref_ref_f).value);

```rust
struct Foo {
    value: i32
}

fn main() {
    let f = Foo { value: 42 };
    let ref_ref_ref_f = &&&f;
    println!("{}", ref_ref_ref_f.value);
}
```

```cmd
$ 42
```

### 6. 스마트 포인터

`&` 연산자로 이미 존재하는 데이터의 참조를 생성하는 기능과 더불어, Rust에서는 smart pointer라 불리는 참조 같은 struct를 생성하는 기능을 제공합니다.

고수준에서 보자면 참조는 다른 자료형에 대한 접근을 제공하는 자료형이라고 볼 수 있습니다. smart pointer가 일반적인 참조와 다른 점은, 프로그래머가 작성하는 내부 로직에 기반해 작동한다는 것입니다. 여러분(프로그래머)이 바로 smart한 부분을 담당하는 겁니다.

일반적으로 smart pointer는 struct가 `*`와 `.` 연산자로 역참조될 때 무슨 일이 발생할지 지정하기 위해 `Deref`, `DerefMut`, 그리고 `Drop` trait을 구현합니다.

```rust
use std::ops::Deref;
struct TattleTell<T> {
    value: T,
}
impl<T> Deref for TattleTell<T> {
    type Target = T;
    fn deref(&self) -> &T {
        println!("{} was used!", std::any::type_name::<T>());
        &self.value
    }
}
fn main() {
    let foo = TattleTell {
        value: "secret message",
    };
    // foo가 `len` 함수를 위해 자동참조된 후
    // 여기서 역참조가 즉시 일어납니다
    println!("{}", foo.len());
}
```

```cmd
$ &str was used!
$ 14
```

### 7. 위험한 스마트 코드

smart pointer는 unsafe한 코드를 꽤 자주 쓰는 경향이 있습니다. 앞서 말했듯이, smart pointer는 Rust에서 가장 저수준의 메모리를 다루기 위한 일반적인 도구입니다.

뭐가 unsafe한 코드일까요? unsafe한 코드는 Rust 컴파일러가 보증할 수 없는 몇 가지 기능이 있다는 예외사항을 제외하고는 일반적인 코드와 완전히 똑같이 동작합니다.

unsafe한 코드의 주기능은 raw pointer를 역참조하는 것입니다. 이는 raw pointer를 메모리 상의 위치에 가져다 놓고 "데이터 구조가 여깄다!"고 선언한 뒤 사용할 수 있는 데이터 표현으로 변환하는 것을 의미합니다 (i.e. `*const u8`을 `u8`로). Rust에는 메모리에 쓰여지는 모든 바이트의 의미를 추적하는 방법은 없습니다. Rust는 raw pointer로 쓰이는 임의의 숫자에 무엇이 존재하는지 보증할 수 없기 때문에, 역참조를 `unsafe { ... }` 블록 안에 넣습니다.

smart pointer는 raw pointer를 역참조하는데 널리 쓰이지만, 그 기능은 잘 입증 되었습니다.

```rust
fn main() {
    let a: [u8; 4] = [86, 14, 73, 64];
    // 이게 원시 pointer입니다.
    // 무언가의 메모리 주소를 숫자로 가져오는 것은 완전히 안전한 일입니다
    let pointer_a = &a as *const u8 as usize;
    println!("데이터 메모리 주소: {}", pointer_a);
    // 숫자를 원시 pointer로, 다시 f32로 변환하는 것 역시
    // 안전한 일입니다.
    let pointer_b = pointer_a as *const f32;
    let b = unsafe {
        // 이건 unsafe한데,
        // 컴파일러에게 우리의 pointer가 유효한 f32라고 가정하고
        // 그 값을 변수 b로 역참조 하라고 하고 있기 때문입니다.
        // Rust는 이런 가정이 참인지 검증할 방법이 없습니다.
        *pointer_b
    };
    println!("맹세하건대 이건 파이다! {}", b);
}
```

```cmd
$ 데이터 메모리 주소: 140727625604796
$ 맹세하건대 이건 파이다! 3.1415
```

### 8. 익숙한 친구들

이미 본 적 있는 `Vec<T>`나 `String` 같은 smart pointer를 생각해 봅시다.

`Vec<T>`는 바이트들의 메모리 영역을 소유하는 smart pointer입니다. Rust 컴파일러는 이 바이트들에 뭐가 존재하는지 모릅니다. smart pointer는 관리하는 메모리 영역에서 내용물을 꺼내기 위해 자기가 뭘 의미하는지 해석하고, 데이터 구조가 그 바이트들 내 어디에서 시작하고 끝나는지 추적하며, 마지막으로 raw pointer를 데이터 구조로, 또 쓰기 편한 멋지고 깔끔한 인터페이스로 역참조 합니다. (e.g.` my_vec[3]`)

유사하게, `String`은 바이트들의 메모리 영역을 추적하며, 쓰여지는 내용물이 언제나 유효한 `utf-8`이도록 프로그램적으로 제한하며, 그 메모리 영역을 `&str` 자료형으로 역참조할 수 있도록 도와줍니다.

이 데이터 구조들 둘 다, 자기 할 일을 하기 위해 raw pointer에 대한 unsafe한 역참조를 사용합니다.

메모리 상세:

- Rust는 C의 `malloc`에 상응하는 [alloc](https://doc.rust-lang.org/std/alloc/fn.alloc.html)과 관리할 메모리 영역을 가져오기 위한 [Layout](https://doc.rust-lang.org/std/alloc/struct.Layout.html)을 갖고 있습니다.

```rust
use std::alloc::{alloc, Layout};
use std::ops::Deref;

struct Pie {
    secret_recipe: usize,
}

impl Pie {
    fn new() -> Self {
        // 4 바이트를 요청해 봅시다
        let layout = Layout::from_size_align(4, 1).unwrap();

        unsafe {
            // 메모리 위치를 숫자로 할당하고 저장합니다
            let ptr = alloc(layout) as *mut u8;
            // pointer 연산을 사용해 u8 값 몇 개를 메모리에 써봅시다
            ptr.write(86);
            ptr.add(1).write(14);
            ptr.add(2).write(73);
            ptr.add(3).write(64);

            Pie {
                secret_recipe: ptr as usize,
            }
        }
    }
}
impl Deref for Pie {
    type Target = f32;
    fn deref(&self) -> &f32 {
        // secret_recipe pointer를 f32 raw pointer로 변환합니다
        let pointer = self.secret_recipe as *const f32;
        // 역참조 하여 &f32 값으로 리턴합니다
        unsafe { &*pointer }
    }
}
fn main() {
    let p = Pie::new();
    // Pie struct의 smart pointer를 역참조 하여
    // "파이를 만듭니다"
    println!("{:?}", *p);
}
```

```cmd
$ 3.1415
```

### 9. 힙에 할당된 메모리

`Box`는 데이터를 stack에서 heap으로 옮길 수 있게 해주는 smart pointer입니다.

이를 역참조하면 마치 원래 자료형이었던 것처럼 heap에 할당된 데이터를 편하게 쓸 수 있습니다.

```rust
struct Pie;

impl Pie {
    fn eat(&self) {
        println!("heap에 있으니 더 맛있습니다!")
    }
}

fn main() {
    let heap_pie = Box::new(Pie);
    heap_pie.eat();
}
```

```cmd
heap에 있으니 더 맛있습니다!
```

### 10. 실패할 수 있는 메인 다시 보기

Rust 코드에는 많고도 많은 오류 표현 방법이 있지만, 그 중에도 standard library에는 오류를 설명하기 위한 범용 trait인 `std::error::Error`가 있습니다.

smart pointer인 `Box`를 사용하면 `Box<dyn std::error::Error>`를 오류 리턴 시 공통된 자료형으로 사용할 수 있는데, 이는 오류를 heap에 전파하고 특정한 자료형을 몰라도 고수준에서 상호작용할 수 있도록 해주기 때문입니다.

Tour of Rust 초반에 `main`은 오류를 리턴할 수 있다고 배웠습니다. 이제 우리는 오류의 데이터 구조가 Rust의 일반적인 `Error` trait을 구현하는 한, 프로그램에서 발생할 수 있는 거의 모든 종류의 오류를 설명할 수 있는 자료형을 리턴할 수 있습니다.

    fn main() -> Result<(), Box<dyn std::error:Error>>

```rust
use core::fmt::Display;
use std::error::Error;

struct Pie;

#[derive(Debug)]
struct NotFreshError;

impl Display for NotFreshError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "이 파이는 신선하지 않군요!")
    }
}

impl Error for NotFreshError {}

impl Pie {
    fn eat(&self) -> Result<(), Box<dyn Error>> {
        Err(Box::new(NotFreshError))
    }
}

fn main() -> Result<(), Box<dyn Error>> {
    let heap_pie = Box::new(Pie);
    heap_pie.eat()?;
    Ok(())
}
```

### 11. 참조 카운팅

`Rc`는 stack에 있는 데이터를 heap으로 옮겨주는 smart pointer입니다. 이는 heap에 놓인 데이터를 immutable하게 대여하는 기능을 가진 다른 `Rc` smart pointer들을 복제할 수 있게 해줍니다.

마지막 smart pointer가 drop 될 때에만 heap에 있는 데이터가 할당 해제됩니다.

```rust
use std::rc::Rc;

struct Pie;

impl Pie {
    fn eat(&self) {
        println!("heap에 있으니 더 맛있습니다!")
    }
}

fn main() {
    let heap_pie = Rc::new(Pie);
    let heap_pie2 = heap_pie.clone();
    let heap_pie3 = heap_pie2.clone();

    heap_pie3.eat();
    heap_pie2.eat();
    heap_pie.eat();

    // 모든 참조 카운트 smart pointer가 여기서 drop 됩니다
    // heap 데이터인 Pie가 드디어 할당 해제됩니다
}
```

```cmd
$ heap에 있으니 더 맛있습니다!
$ heap에 있으니 더 맛있습니다!
$ heap에 있으니 더 맛있습니다!
```

### 12. 접근 공유하기

`RefCell`은 보통 smart pointer가 보유하는 컨테이너 데이터 구조로서, 데이터를 가져오거나 안에 있는 것에 대한 mutable 또는 immutable한 참조를 대여할 수 있게 해줍니다. 데이터를 대여할 때, Rust는 런타임에 다음의 메모리 안전 규칙을 적용하여 남용을 방지합니다:

단 하나의 mutable한 참조 또는 여러개의 immutable한 참조만 허용하며, 둘 다는 안됨!.

이 규칙을 어기면 `RefCell`은 panic을 일으킵니다.

```rust
use std::cell::RefCell;

struct Pie {
    slices: u8,
}

impl Pie {
    fn eat(&mut self) {
        println!("heap에 있으니 더 맛있습니다!");
        self.slices -= 1;
    }
}

fn main() {
    // RefCell은 런타임에 메모리 안전성을 검증합니다
    // 주의: pie_cell은 mut가 아닙니다!
    let pie_cell = RefCell::new(Pie { slices: 8 });

    {
        // 그렇지만 mutable 참조를 대여할 수 있습니다!
        let mut mut_ref_pie = pie_cell.borrow_mut();
        mut_ref_pie.eat();
        mut_ref_pie.eat();

        // mut_ref_pie는 scope의 마지막에 drop 됩니다
    }

    // 이제 mutable 참조가 drop 되고 나면 immutable하게 대여할 수 있습니다
    let ref_pie = pie_cell.borrow();
    println!("{} 조각 남았습니다", ref_pie.slices);
}
```

```cmd
$ heap에 있으니 더 맛있습니다!
$ heap에 있으니 더 맛있습니다!
$ 6 조각 남았습니다
```

### 13. 쓰레드 간에 공유하기

`Mutex`는 보통 smart pointer가 보유하는 컨테이너 데이터 구조로서, 데이터를 가져오거나 내부 데이터에 대한 mutable 또는 immutable한 참조를 대여할 수 있게 해줍니다. 이는 잠긴 대여를 통해 운영체제가 동시에 오직 하나의 CPU만 데이터에 접근 가능하도록 하고, 원래 쓰레드가 끝날 때까지 다른 쓰레드들을 막음으로써 대여가 남용되는 것을 방지합니다.

멀티쓰레드는 Tour of Rust의 범위를 벗어나지만, `Mutex`는 여러 개의 CPU 쓰레드가 같은 데이터에 접근하는 것을 조율하는 근본적인 부분입니다.

특별한 smart pointer인 `Arc`도 있는데, 쓰레드-안전성을 가진 참조 카운트 증가 방식을 사용한다는 것을 제외하고는 `Rc`와 동일합니다. 이는 동일한 `Mutex`에 다수의 참조를 가질 때 종종 사용되곤 합니다.

```rust
use std::sync::Mutex;

struct Pie;

impl Pie {
    fn eat(&self) {
        println!("지금은 오직 나만이 파이를 먹는다!");
    }
}

fn main() {
    let mutex_pie = Mutex::new(Pie);
    // 파이에 대한 잠겨있는 immutable한 참조를 빌려봅시다
    // lock은 실패할 수도 있기 때문에 그 결과는 unwrap 해야합니다
    let ref_pie = mutex_pie.lock().unwrap();
    ref_pie.eat();
    // 잠긴 참조는 여기서 drop 되며, mutex로 보호되는 값은 다른 이에 의해 쓰일 수 있습니다
}
```

```cmd
$ 지금은 오직 나만이 파이를 먹는다!
```

### 14. 스마트 포인터 조합하기

smart pointer는 한계가 있는 것처럼 보이지만, 조합해서 사용하면 매우 강력해질 수 있습니다.

`Rc<Vec<Foo>>` - heap에 있는 immutable한 데이터 구조의 동일한 vector를 대여할 수 있는 복수의 smart pointer를 복제할 수 있게 해줍니다.

`Rc<RefCell<Foo>>` - 복수의 smart pointer가 동일한 Foo struct를 mutable/immutable하게 대여할 수 있게 해줍니다.

`Arc<Mutex<Foo>>` - 복수의 smart pointer가 임시의 mutable/immutable한 대여를 CPU 쓰레드 독점 방식으로 잠글 수 있게 해줍니다.

메모리 상세:

- 이런 조합이 많이 포함된 주제를 확인할 수 있을겁니다. 내부 데이터를 변경하기 위해 immutable한 데이터 유형(복수의 smart pointer가 소유할 수 있음)을 사용합니다. 이를 Rust에서는 "내부 가변성" 패턴이라고 합니다. 이는 Rust의 컴파일 타임 체크와 동일 수준의 안전성으로 런타임의 메모리 사용 규칙을 변경할 수 있는 패턴입니다.

```rust
use std::cell::RefCell;
use std::rc::Rc;

struct Pie {
    slices: u8,
}

impl Pie {
    fn eat_slice(&mut self, name: &str) {
        println!("{}가 한 조각 먹었습니다!", name);
        self.slices -= 1;
    }
}

struct SeaCreature {
    name: String,
    pie: Rc<RefCell<Pie>>,
}

impl SeaCreature {
    fn eat(&self) {
        // mutable 대여를 위해 파이에 대한 smart pointer를 사용
        let mut p = self.pie.borrow_mut();
        // 한 입 먹자!
        p.eat_slice(&self.name);
    }
}

fn main() {
    let pie = Rc::new(RefCell::new(Pie { slices: 8 }));
    // ferris와 sarah에겐 파이에 대한 smart pointer의 복제가 주어집니다
    let ferris = SeaCreature {
        name: String::from("ferris"),
        pie: pie.clone(),
    };
    let sarah = SeaCreature {
        name: String::from("sarah"),
        pie: pie.clone(),
    };
    ferris.eat();
    sarah.eat();

    let p = pie.borrow();
    println!("{} 조각 남았습니다", p.slices);
}
```

```cmd
$ ferris가 한 조각 먹었습니다!
$ sarah가 한 조각 먹었습니다!
$ 6 조각 남았습니다
```

## 마무리

smart pointer는 Rust 프로그래밍의 관용구로서 매우 일반적인 메모리 사용 패턴들도 다시 만들 필요 없게 해줍니다. 이들만 있으면 어려운 도전도 해결할 준비가 된 것입니다! 이제 Rust의 기초를 다졌으니, 더 큰 프로젝트를 만드는 방법에 대해 조금 얘기해 봅시다. 9장에서는 한 페이지짜리 코드에서 벗어날 수 있습니다.
