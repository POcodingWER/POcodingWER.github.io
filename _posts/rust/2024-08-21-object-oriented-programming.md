---
layout: post
title: "[Rust] study Object Oriented Programming"
subtitle: "Rust 객체 지향 프로그래밍"

date: 2024-08-21 09:43:00
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
  - 텍스트
  - text
---

{% include post/rust_contents.md %}

> 참고문서  
> [ 《 Tour of Rust 》 ](https://tourofrust.com/chapter_7_ko.html)  
> [ 《 Rust_Book 》 ](https://doc.rust-kr.org/)  
> [ 《 프로그래밍 언어 러스트를 배웁시다! 》 ](https://www.youtube.com/watch?v=W9DO6m8JSSs&list=PLfllocyHVgsSJf1zO6k6o3SX2mbZjAqYE)

## 객체 지향 프로그래밍

함수로 아이디어를 표현하는 것은 동작과 데이터를 나타내는 입증된 방식입니다 (C에서 수십 년 간 쓰였습니다!). 역사적으로, 컴퓨터 과학에서는 데이터에 대한 다른 유용한 표현 집합 및 추상화 방법을 찾아왔습니다. 그 중 한 방법인 객체 지향 프로그래밍(OOP)은 익숙하실겁니다. 이번 장에서는 함수를 넘어 Rust 프로그래밍 언어를 살펴 보겠습니다.

### 1. OOP란 무엇인가?

객체 지향 프로그래밍은 대충 다음과 같은 상징적 특징을 가진 프로그래밍 언어를 뜻합니다:

- 캡슐화 (encapsulation) - 객체라 불리는 단일 유형의 개념적 단위에 데이터와 함수를 연결지음.
- 추상화 (abstraction) - 데이터와 함수를 숨겨 객체의 상세 구현 사항을 알기 어렵게 함.
- 다형성 (polymorphism) - 다른 기능적 관점에서 객체와 상호작용하는 능력.
- 상속 (inheritance) - 다른 객체로부터 데이터와 동작을 상속받는 능력.

### 2. Rust는 OOP가 아니다

Rust에서는 어떠한 방법으로도 데이터와 동작의 상속이 불가능합니다.

- struct는 부모 struct로부터 field를 상속받을 수 없습니다.
- struct는 부모 struct로부터 함수를 상속받을 수 없습니다.

어쨌거나, Rust는 여러가지 프로그래밍 언어 기능을 구현하고 있으므로, 이런 기능이 부족한 것을 신경쓰실 필요는 없습니다.

### 3. 메소드 캡슐화 하기

Rust는 함수(메소드라고도 하는)가 연결된 struct인 객체라는 개념을 지원합니다.

모든 메소드의 첫번째 매개변수는 메소드 호출과 연관된 인스턴스에 대한 참조여야 합니다 (예: `instanceOfObj.foo()`). Rust에서는 다음을 사용합니다:

- `&self` - 인스턴스에 대한 immutable한 참조.
- `&mut self` - 인스턴스에 대한 mutable한 참조.

메소드는 `impl` 키워드를 쓰는 구현 블록 안에 정의합니다:

    impl MyStruct {
        ...
        fn foo(&self) {
        ...
        }
    }

```rust
struct SeaCreature {
    noise: String,
}

impl SeaCreature {
    fn get_sound(&self) -> &str {
        &self.noise
    }
}

fn main() {
    let creature = SeaCreature {
        noise: String::from("blub"),
    };
    println!("{}", creature.get_sound());
}
```

```cmd
$ blub
```

### 4. 선택적 노출을 통한 추상화

Rust는 객체의 내부 동작을 숨길 수 있습니다.

기본적으로, filed와 메소드들은 그들이 속한 module에서만 접근 가능합니다.

`pub` 키워드는 struct의 field와 메소드를 module 밖으로 노출시켜 줍니다.

```rust
struct SeaCreature {
    pub name: String,
    noise: String,
}

impl SeaCreature {
    pub fn get_sound(&self) -> &str {
        &self.noise
    }
}

fn main() {
    let creature = SeaCreature {
        name: String::from("Ferris"),
        noise: String::from("blub"),
    };
    println!("{}", creature.get_sound());
}
```

```cmd
$ blub
```

### 5. 다형성과 Trait

Rust는 trait으로 다형성을 지원합니다. trait은 메소드의 집합을 struct 자료형에 연결할 수 있게 해줍니다.

먼저 trait 안에 메소드 원형을 정의합니다:

    trait MyTrait {
        fn foo(&self);
        ...
    }

struct가 trait을 구현할 때, 실제 자료형이 무엇인지 알지 못하더라도 그 trait 자료형을 통해 간접적으로 struct와 상호작용할 수 있도록 (예: `&dyn MyTrait`) 협약을 맺게 됩니다.

struct의 구현된 trait 메소드들은 구현 블록 안에 정의됩니다:

    impl MyTrait for MyStruct {
        fn foo(&self) {
            ...
        }
        ...
    }

```rust
struct SeaCreature {
    pub name: String,
    noise: String,
}

impl SeaCreature {
    pub fn get_sound(&self) -> &str {
        &self.noise
    }
}

trait NoiseMaker {
    fn make_noise(&self);
}

impl NoiseMaker for SeaCreature {
    fn make_noise(&self) {
        println!("{}", &self.get_sound());
    }
}

fn main() {
    let creature = SeaCreature {
        name: String::from("Ferris"),
        noise: String::from("blub"),
    };
    creature.make_noise();
}
```

```cmd
$ blub
```

### 6. Trait에 구현된 메소드

trait에 메소드를 구현해 넣을 수 있습니다.

함수가 struct 내부의 field에 직접 접근할 수는 없지만, trait 구현체들 사이에서 동작을 공유할 때 유용하게 쓰입니다.

```rust
struct SeaCreature {
    pub name: String,
    noise: String,
}

impl SeaCreature {
    pub fn get_sound(&self) -> &str {
        &self.noise
    }
}

trait NoiseMaker {
    fn make_noise(&self);

    fn make_alot_of_noise(&self){
        self.make_noise();
        self.make_noise();
        self.make_noise();
    }
}

impl NoiseMaker for SeaCreature {
    fn make_noise(&self) {
        println!("{}", &self.get_sound());
    }
}

fn main() {
    let creature = SeaCreature {
        name: String::from("Ferris"),
        noise: String::from("blub"),
    };
    creature.make_alot_of_noise();
}
```

```cmd
$ blub
$ blub
$ blub
```

### 7. Trait 상속

trait은 다른 trait의 메소드들을 상속 받을 수 있습니다.

```rust
struct SeaCreature {
    pub name: String,
    noise: String,
}

impl SeaCreature {
    pub fn get_sound(&self) -> &str {
        &self.noise
    }
}

trait NoiseMaker {
    fn make_noise(&self);
}

trait LoudNoiseMaker: NoiseMaker {
    fn make_alot_of_noise(&self) {
        self.make_noise();
        self.make_noise();
        self.make_noise();
    }
}

impl NoiseMaker for SeaCreature {
    fn make_noise(&self) {
        println!("{}", &self.get_sound());
    }
}

impl LoudNoiseMaker for SeaCreature {}

fn main() {
    let creature = SeaCreature {
        name: String::from("Ferris"),
        noise: String::from("blub"),
    };
    creature.make_alot_of_noise();
}
```

```cmd
$ blub
$ blub
$ blub
```

### 8. 동적 vs 정적 디스패치

메소드는 다음의 두 가지 방식으로 실행됩니다:

- 정적 디스패치 (static dispatch) - 인스턴스의 자료형을 알고 있는 경우, 어떤 함수룰 호출해야 하는지 정확히 알고 있습니다.
- 동적 디스패치 (dynamic dispatch) - 인스턴스의 자료형을 모르는 경우, 올바른 함수를 호출할 방법을 찾아야 합니다.

trait 자료형인 `&dyn MyTrait`은 동적 디스패치를 통해 객체의 인스턴스들을 간접적으로 작동시킬 수 있게 해줍니다.

동적 디스패치를 사용할 경우, Rust에서는 사람들이 알 수 있도록 trait 자료형 앞에 `dyn`을 붙일 것을 권고합니다.

메모리 상세:

- 동적 디스패치는 실제 함수 호출을 위한 포인터 추적으로 인해 조금 느릴 수 있습니다.

```rust
struct SeaCreature {
    pub name: String,
    noise: String,
}

impl SeaCreature {
    pub fn get_sound(&self) -> &str {
        &self.noise
    }
}

trait NoiseMaker {
    fn make_noise(&self);
}

impl NoiseMaker for SeaCreature {
    fn make_noise(&self) {
        println!("{}", &self.get_sound());
    }
}

fn static_make_noise(creature: &SeaCreature) {
    // 실제 자료형을 압니다
    creature.make_noise();
}

fn dynamic_make_noise(noise_maker: &dyn NoiseMaker) {
    // 실제 자료형을 모릅니다
    noise_maker.make_noise();
}

fn main() {
    let creature = SeaCreature {
        name: String::from("Ferris"),
        noise: String::from("blub"),
    };
    static_make_noise(&creature);
    dynamic_make_noise(&creature);
}
```

```cmd
$ blub
$ blub
```

### 9. Trait 객체

객체의 인스턴스를 `&dyn MyTrait` 자료형을 가진 매개변수로 넘길 때, 이를 trait 객체라고 부릅니다.

trait 객체는 인스턴스의 올바른 메소드를 간접적으로 호출할 수 있게 해줍니다. trait 객체는 인스턴스에 대한 포인터와 인스턴스 메소드들에 대한 함수 포인터 목록을 갖고있는 struct입니다.

메모리 상세:

- 이런 함수 목록을 C++에서는 vtable이라고 합니다.

### 10. 크기를 알 수 없는 데이터 다루기

trait을 다른 struct에 저장하는 것도 흥미로운 도전과제입니다. trait은 원본 struct를 알기 어렵게 하느라 원래 크기 또한 알기 어렵게 합니다. Rust에서 크기를 알 수 없는 값이 struct에 저장될 때는 다음의 두 가지 방법으로 처리됩니다:

- generics - 매개변수의 자료형을 효과적으로 활용하여 알려진 자료형 및 크기의 struct/함수를 생성합니다.
- indirection - 인스턴스를 heap에 올림으로써 실제 자료형의 크기 걱정 없이 그 포인터만 저장할 수 있는 간접적인 방법을 제공합니다. 또 다른 방법도 있습니다!

### 11. Generic 함수

Rust의 generic은 trait과 함께 작동합니다. 매개변수 자료형 `T`를 정의할 때 해당 인자가 어떤 trait을 구현해야 하는지 나열함으로써 인자에 어떤 자료형을 쓸 수 있는지 제한할 수 있습니다.

아래 예제에서 `T` 자료형은 `Foo` trait을 반드시 구현해야 합니다:

    fn my_function<T>(foo: T)
    where
        T:Foo
    {
        ...
    }

generic을 이용하면 컴파일 시 자료형과 크기를 알 수 있는 정적 자료형의 함수가 만들어지며, 따라서 정적 디스패치와 함께 크기가 정해진 값으로 저장할 수 있게 됩니다.

```rust
struct SeaCreature {
    pub name: String,
    noise: String,
}

impl SeaCreature {
    pub fn get_sound(&self) -> &str {
        &self.noise
    }
}

trait NoiseMaker {
    fn make_noise(&self);
}

impl NoiseMaker for SeaCreature {
    fn make_noise(&self) {
        println!("{}", &self.get_sound());
    }
}

fn generic_make_noise<T>(creature: &T)
where
    T: NoiseMaker,
{
    // 컴파일 타임에 실제 자료형을 알게 됩니다
    creature.make_noise();
}

fn main() {
    let creature = SeaCreature {
        name: String::from("Ferris"),
        noise: String::from("blub"),
    };
    generic_make_noise(&creature);
}
```

```cmd
$ blub
```

### 12. Generic 함수 줄여쓰기

trait으로 제한한 generic은 다음과 같이 줄여쓸 수 있습니다:

    fn my_function(foo: impl Foo) {
        ...
    }

이는 다음과 동일한 의미입니다:

    fn my_function<T>(foo: T)
        where
            T:Foo
        {
            ...
    }

```rust
struct SeaCreature {
    pub name: String,
    noise: String,
}

impl SeaCreature {
    pub fn get_sound(&self) -> &str {
        &self.noise
    }
}

trait NoiseMaker {
    fn make_noise(&self);
}

impl NoiseMaker for SeaCreature {
    fn make_noise(&self) {
        println!("{}", &self.get_sound());
    }
}

fn generic_make_noise(creature: &impl NoiseMaker) {
    // 컴파일 타임에 실제 자료형을 알게 됩니다
    creature.make_noise();
}

fn main() {
    let creature = SeaCreature {
        name: String::from("Ferris"),
        noise: String::from("blub"),
    };
    generic_make_noise(&creature);
}
```

```cmd
$ blub
```

### 13. Box

`Box`는 stack에 있는 데이터를 heap으로 옮길 수 있게 해주는 데이터 구조입니다.

`Box`는 smart pointer로도 알려진 struct이며 heap에 있는 데이터를 가리키는 포인터를 들고 있습니다.

`Box`는 크기가 알려져 있는 struct이므로 (왜냐하면 그저 포인터만 들고 있으므로) field의 크기를 알아야 하는 struct에 뭔가의 참조를 저장할 때 종종 사용됩니다.

`Box`는 어디서나 사용될 정도로 흔합니다:

`Box::new(Foo { ... })`

```rust
struct SeaCreature {
    pub name: String,
    noise: String,
}

impl SeaCreature {
    pub fn get_sound(&self) -> &str {
        &self.noise
    }
}

trait NoiseMaker {
    fn make_noise(&self);
}

impl NoiseMaker for SeaCreature {
    fn make_noise(&self) {
        println!("{}", &self.get_sound());
    }
}

struct Ocean {
    animals: Vec<Box<dyn NoiseMaker>>,
}

fn main() {
    let ferris = SeaCreature {
        name: String::from("Ferris"),
        noise: String::from("blub"),
    };
    let sarah = SeaCreature {
        name: String::from("Sarah"),
        noise: String::from("swish"),
    };
    let ocean = Ocean {
        animals: vec![Box::new(ferris), Box::new(sarah)],
    };
    for a in ocean.animals.iter() {
        a.make_noise();
    }
}
```

```cmd
$ blub
$ swish
```

### 14. Generic 구조체 다시 보기

generic struct는 trait으로 제한된 매개변수 자료형을 가질 수도 있습니다.

    struct MyStruct<T>
    where
        T: MyTrait
    {
        foo: T
        ...
    }

매개변수 자료형은 generic structure의 구현 블록 안에 표시합니다:

    impl<T> MyStruct<T> {
        ...
    }

## 마무리

`struct`안에 바라볼때는 `&self`
번 장에서는 Box를 통해 `smart pointer`에 대해 어렴풋이 살펴 보았습니다. 다음 장에서는 `smart pointer`가 다른 특수한 메모리 상황에서 어떤 도움을 줄 수 있는지 알아보도록 하겠습니다.
