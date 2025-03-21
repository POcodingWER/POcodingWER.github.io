---
layout: post
title: "[Rust] study Data types"
subtitle: "Rust 데이터 구조 자료형"

date: 2024-08-19 20:14:00
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
  - 데이터 구조 자료형
  - Data types
---

{% include post/rust_contents.md %}

> 참고문서  
> [ 《 Tour of Rust 》 ](https://tourofrust.com/chapter_3_ko.html)  
> [ 《 Rust_Book 》 ](https://doc.rust-kr.org/)  
> [ 《 프로그래밍 언어 러스트를 배웁시다! 》 ](https://www.youtube.com/watch?v=W9DO6m8JSSs&list=PLfllocyHVgsSJf1zO6k6o3SX2mbZjAqYE)

<!-- > [ 《 Rust paly ground 》 ](https://tourofrust.com/chapter_1_ko.html) -->

## Rust Study Data types

이번 장에서는 Rust에서 가장 기본적인 데이터 구조를 살펴보고, 그들의 메모리 내 표현 방식을 더 깊이 이해해 보겠습니다.  
Rust가 내부적으로 어떻게 작동하는지에 대해 얼마나 투명한지를 알아가는 과정이 즐거우실 거라 확신합니다.

### 1. 구조체

`struct`는 필드(field)들의 collection입니다.

field는 간단하게 데이터 구조에 연관된 데이터 값입니다. 이 값은 기본 자료형이나 데이터 구조일 수 있습니다.

이 정의는 메모리 상에 field들을 어떻게 배치할지에 대한 컴파일러의 청사진과도 같습니다.

```rust
struct SeaCreature {
    // String은 struct다
    animal_type: String,
    name: String,
    arms: i32,
    legs: i32,
    weapon: String,
}
```

### 2.메소드 호출하기

함수와 달리, 메소드는 특정 데이터 자료형과 연관된 함수입니다.

스태틱 메소드(static methods) - 자료형 그 자체에 속하는 메소드로서, `::` 연산자를 이용하여 호출함.

인스턴스 메소드(instance methods) - 자료형의 인스턴스에 속하는 메소드로서, `.` 연산자를 이용하여 호출함.

다가올 장에서 여러분만의 메소드를 만드는 법에 대해 살펴보겠습니다.

```rust
fn main() {
    // static method를 사용하여 String의 instance를 생성
    let s = String::from("Hello world!");
    // instance의 메소드를 사용
    println!("{}의 글자 수는 {}입니다.", s, s.len());
}
```

```cmd
$ Hello world!의 글자 수는 12입니다.
```

### 3.메모리

Rust 프로그램에는 데이터가 저장되는 세 가지의 메모리 영역이 있습니다:

- 데이터 메모리 **(data memory)** - 크기가 고정 되었으며 **static**한 데이터용. 프로그램의 텍스트를 생각해봅시다(예: "Hello World!"): 이 텍스트의 바이트들은 오직 한 곳에서만 읽히므로 이 영역에 저장될 수 있습니다. 이런 종류의 데이터는 컴파일러가 많은 최적화를 하며, 위치가 알려져 있고 고정되어 있기 때문에 일반적으로 사용하기에 매우 빠르다고 여깁니다.
- 스택 메모리 **(stack memory)** - 함수 내에서 변수로 선언되는 데이터용. 이 메모리의 위치는 함수 호출 동안에는 절대 변하지 않기 때문에 컴파일러가 코드를 최적화할 수 있으며, 이로 인해 접근하기에 매우 빠릅니다.
- 힙 메모리 **(heap memory)** - 애플리케이션이 실행되는 동안 생성되는 데이터용. 이 영역의 데이터는 추가하거나, 이동하거나, 제거하거나, 크기를 바꾸거나, 등을 할 수 있습니다. 이런 동적 속성 때문에 일반적으로 사용하기에 느리다고 여기지만, 훨씬 더 창의적인 메모리 사용이 가능합니다. 데이터가 이 영역에 추가되면 할당(allocation)이라고 부릅니다. 데이터가 이 영역에서 제거되면 해제(deallocation)라고 부릅니다.

### 4.메모리에 데이터 생성하기

코드에서 struct를 인스턴스화(instantiate) 하면 프로그램은 연관된 field 데이터들을 메모리 상에 나란히 생성합니다.

`StructName { ... }`.

와 같이 안에 모든 field 값을 지정함으로써 instantiate 합니다.

struct의 field 값들은 `.` 연산자를 통해 접근합니다.

이 예제의 메모리 상세:

- 큰따옴표 안의 텍스트는 읽기 전용 데이터이므로 (예: "ferris"), data memory 영역에 위치합니다.
- `String::from` 함수 호출은 `String` struct를 생성하며 stack에 SeaCreature의 field들과 나란히 위치시킵니다. String은 변경될 수 있는 텍스트를 의미하며 이는 다음에 의해 이루어집니다:
  1. 텍스트가 수정될 수 있도록 heap에 메모리를 생성
  1. 해당 메모리 위치에 대한 참조를 heap에 저장하고 이를 `String` struct에 저장 (앞으로 강의에서 더 자세히)
- 마지막으로 우리의 두 친구 Ferris와 Sarah는 우리 프로그램에서 언제나 고정된 위치를 가지는 자료 구조를 가지게 되었고, 따라서 stack에 위치하게 되었습니다.

```rust
struct SeaCreature {
    animal_type: String,
    name: String,
    arms: i32,
    legs: i32,
    weapon: String,
}

fn main() {
    // SeaCreature의 데이터는 stack에 있음
    let ferris = SeaCreature {
        // String struct도 stack에 있지만,
        // heap에 있는 데이터에 대한 참조를 갖고 있음
        animal_type: String::from("게"),
        name: String::from("Ferris"),
        arms: 2,
        legs: 4,
        weapon: String::from("집게"),
    };

    let sarah = SeaCreature {
        animal_type: String::from("문어"),
        name: String::from("Sarah"),
        arms: 8,
        legs: 0,
        weapon: String::from("없음"),
    };

    println!(
        "{}는 {}이다. {}개의 팔과, {}개의 다리와, {}를 무기로 갖고 있다.",
        ferris.name, ferris.animal_type, ferris.arms, ferris.legs, ferris.weapon
    );
    println!(
        "{}는 {}이다. {}개의 팔과, {}개의 다리를 갖고 있다. 무기는 없다..",
        sarah.name, sarah.animal_type, sarah.arms, sarah.legs
    );
}
```

```cmd
$ Ferris는 게이다. 2개의 팔과, 4개의 다리와, 집게를 무기로 갖고 있다.
$ Sarah는 문어이다. 8개의 팔과, 0개의 다리를 갖고 있다. 무기는 없다..
```

### 5.Tuple 같은 구조체

간결함을 위해, tuple처럼 사용되는 struct를 생성할 수 있습니다.

```rust
struct Location(i32, i32);

fn main() {
    // 이것도 여전히 stack에 있는 struct임
    let loc = Location(42, 32);
    println!("{}, {}", loc.0, loc.1);
}
```

```cmd
$ 42, 32
```

### 6.Unit 같은 구조체

struct에는 아무 field도 없어도 됩니다.

1장에서 얘기 했듯이 unit은 빈 tuple인 `()`의 또 다른 이름입니다. 이 때문에 이런 종류의 struct를 Unit 같은 이라고 부릅니다.

이런 유형의 struct는 거의 쓰이지 않습니다.

```rust
struct Marker;

fn main() {
    let _m = Marker;
}
```

### 7.열거형

열거형(enumeration)은 `enum` 키워드를 통해 몇 가지 태그된 원소의 값을 가질 수 있는 새로운 자료형을 생성할 수 있습니다.

`match`는 모든 가능한 enum 값을 빠짐없이 처리할 수 있도록 하여 퀄리티 있는 코드를 만드는데 강력한 도구가 되어줄 것입니다.

```rust
#![allow(dead_code)] // 이 줄은 컴파일러 경고를 방지해줌

enum Species {
    Crab,
    Octopus,
    Fish,
    Clam,
}

struct SeaCreature {
    species: Species,
    name: String,
    arms: i32,
    legs: i32,
    weapon: String,
}

fn main() {
    let ferris = SeaCreature {
        species: Species::Crab,
        name: String::from("Ferris"),
        arms: 2,
        legs: 4,
        weapon: String::from("claw"),
    };

    match ferris.species {
        Species::Crab => println!("{}는 게이다", ferris.name),
        Species::Octopus => println!("{}는 문어이다", ferris.name),
        Species::Fish => println!("{}는 물고기이다", ferris.name),
        Species::Clam => println!("{}는 조개이다", ferris.name),
    }
}
```

```cmd
$ Ferris는 게이다
```

### 8.열거형과 데이터

`enum`의 원소들은 C의 union처럼 동작할 수 있도록 한 개 이상의 자료형을 가질 수 있습니다.

`enum`이 `match`를 통해 패턴 일치될 때, 각각의 데이터 값에 변수명을 붙일 수 있습니다.

`enum`의 메모리 상세:

- enum 데이터 값은 가장 큰 원소의 메모리 크기와 같은 메모리 크기를 가집니다. 이는 가능한 모든 값이 동일한 메모리 공간에 들어갈 수 있게 해줍니다.
- 원소의 자료형(있는 경우)에 더하여, 각 원소는 무슨 태그에 해당하는지 나타내는 숫자값도 갖습니다.

다른 상세 정보:

- Rust의 `enum`은 tagged union으로도 알려져 있습니다.
- Rust가 대수적 자료형(algebraic types)을 갖고 있다고 할 때 이는 자료형을 조합하여 새 자료형을 만드는 것을 의미합니다.

```rust
#![allow(dead_code)] // 이 줄은 컴파일러 경고를 방지해줌

enum Species {
    Crab,
    Octopus,
    Fish,
    Clam,
}
enum PoisonType {
    Acidic,
    Painful,
    Lethal,
}
enum Size {
    Big,
    Small,
}
enum Weapon {
    Claw(i32, Size),
    Poison(PoisonType),
    None,
}

struct SeaCreature {
    species: Species,
    name: String,
    arms: i32,
    legs: i32,
    weapon: Weapon,
}

fn main() {
    // SeaCreature의 데이터는 stack에 있음
    let ferris = SeaCreature {
        // String struct도 stack에 있지만,
        // heap에 있는 데이터에 대한 참조를 갖고 있음
        species: Species::Crab,
        name: String::from("Ferris"),
        arms: 2,
        legs: 4,
        weapon: Weapon::Claw(2, Size::Small),
    };

    match ferris.species {
        Species::Crab => match ferris.weapon {
            Weapon::Claw(num_claws, size) => {
                let size_description = match size {
                    Size::Big => "큰",
                    Size::Small => "작은",
                };
                println!(
                    "ferris는 {}개의 {} 집게를 가진 게이다",
                    num_claws, size_description
                )
            }
            _ => println!("ferris는 다른 무기를 가진 게이다"),
        },
        _ => println!("ferris는 다른 동물이다"),
    }
}
```

```cmd
$ ferris는 2개의 작은 집게를 가진 게이다
```

## 마무리

신난다! 이제 우리는 아이디어를 코드로 표현할 수 있는 가장 기본적인 도구를 갖게 되었습니다.  
이제 Rust의 기본 기능이 어떻게 자료형들과 함께 조화롭고 간결하게 동작하는지 어렴풋이 보이길 바랍니다. 다음에는 자료형에 더 많은 표현의 유연함을 주는 개념인 제네릭(generics)에 대해 레스기릿!.
