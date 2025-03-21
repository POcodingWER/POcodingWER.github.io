---
layout: post
title: "[Rust] study Project Organization and Structure"
subtitle: "Rust 프로젝트 구성과 구조"

date: 2024-08-23 13:12:00
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
  - Project Organization and Structure
  - 프로젝트 구성과 구조
---

{% include post/rust_contents.md %}

> 참고문서  
> [ 《 Tour of Rust 》 ](https://tourofrust.com/chapter_9_ko.html)  
> [ 《 Rust_Book 》 ](https://doc.rust-kr.org/)  
> [ 《 프로그래밍 언어 러스트를 배웁시다! 》 ](https://www.youtube.com/watch?v=W9DO6m8JSSs&list=PLfllocyHVgsSJf1zO6k6o3SX2mbZjAqYE)  
> [ 《 rust module 》 ](https://crates.io)

## 프로젝트 구성과 구조

지금까지의 모든 예제 코드는 단일 파일이었습니다. 어떻게 하면 우리의 코드를 더 잘 구성하고 다른 사람과 공유할 수 있을지 얘기해 봅시다!

### 1. 모듈

모든 Rust 프로그램이나 라이브러리(library)는 크레이트(crate)입니다.

모든 crate는 모듈(module)의 계층구조로 이루어져 있습니다.

모든 crate에는 최상위(root) module이 있습니다.

module에는 전역변수, 함수, struct, trait, 또는 다른 module까지도 포함될 수 있습니다!

Rust에서는 파일과 module 트리 계층구조 간의 1:1 대응은 없습니다. module의 트리 구조는 코드로 직접 작성해야 합니다.

### 2. 프로그램 작성하기

프로그램은 `main.rs`라 불리는 파일에 root module을 갖고 있습니다.

### 3. 라이브러리 작성하기

library는 `lib.rs`라 불리는 파일에 root module을 갖고 있습니다.

### 4. 다른 모듈과 크레이트 참조하기

module 내의 항목은 전체 module 경로인 `std::f64::consts::PI`를 이용해 참조할 수 있습니다.

더 간단한 방법은 use 키워드를 사용하는 것입니다. 이를 이용하면 module에서 쓰고자 하는 특정 항목을 전체 경로를 쓰지 않고도 코드 어디에서든 사용할 수 있습니다. 예를 들어, `use std::f64::consts::PI`를 쓰면 main 함수에서 `PI`만으로 사용할 수 있습니다.

**std**는 유용한 데이터 구조 및 OS와 상호작용할 수 있는 함수로 가득한 표준 라이브러리 **(standard library)**의 crate입니다.

커뮤니티에서 작성한 crate들의 검색 가능 목록을 [https://crates.io](https://crates.io)에서 확인하실 수 있습니다.

```rust
use std::f64::consts::PI;

fn main() {
    println!("놀이터에 오신 것을 환영합니다!");
    println!("{} 한 조각 먹고 싶군요!", PI);
}
```

```cmd
$ 놀이터에 오신 것을 환영합니다!
$ 3.141592653589793 한 조각 먹고 싶군요!
```

### 5. 여러 개의 항목을 참조하기

복수의 항목을 하나의 module 경로로 참조하고 싶다면 이렇게 하면 됩니다:

`use std::f64::consts::{PI,TAU}`
Ferris는 TAU를 먹지 않습니다. PI만 먹어요.

### 6. 모듈 작성하기

코드를 생각할 때 보통은 디렉토리로 구성된 파일구조를 떠올립니다. Rust는 여러분의 파일 구조에 가깝게 module을 만들 수 있게 해줍니다.

Rust에서 module을 선언하는 데에는 두 가지 방법이 있습니다. 예를 들어 `foo` module은 다음과 같이 나타낼 수 있습니다:

- `foo.rs`라는 이름의 파일
- `foo`라는 이름의 디렉토리에 들어있는 파일 `mod.rs`

### 7. 모듈 계층구조

한 module은 다른 module에 의존할 수 있습니다. module과 하위모듈(sub-module) 사이에 관계를 지어주려면, 부모 module에 다음과 같은 코드를 작성합니다:

`mod foo;`
위 선언은 `foo.rs` 파일이나 `foo/mod.rs` 파일을 찾아 이 scope 내의 `foo` module안에 그 내용물을 삽입합니다.

### 8. 인라인 모듈

sub-module은 module의 코드 내에 직접 치환(inline)될 수 있습니다.

inline module의 가장 흔한 용도는 단위 테스트를 만들 때입니다. Rust가 테스트에 쓰일 때에만 존재하는 inline module을 만들어 봅시다!

```rust
// 이 macro는 Rust가 테스트 모드가 아닐 경우
// 이 inline module을 제거합니다.
#[cfg(test)]
mod tests {
    // 부모 module에 즉시 접근이 가능하지 않다는 데에 주의하세요.
    // 반드시 명시적으로 써줘야 합니다.
    use super::*;

    ... tests go here ...
}
```

### 9. 내부 모듈 참조하기

Rust에서는 `use` 경로에 사용할 수 있는 몇 가지 키워드를 통해 원하는 module을 빠르게 가져다 쓸 수 있습니다:

- `crate` - root module
- `super` - 현재 module의 부모 module
- `self` - 현재 module

### 10. 내보내기

기본적으로 module의 구성원들은 외부에서 접근이 불가능합니다 (그 자식 module에게까지도!). `pub` 키워드를 사용하면 module의 구성원들을 접근 가능하게 할 수 있습니다.

기본적으로 crate의 구성원들도 외부에서 접근이 불가능합니다. crate의 root module (`lib.rs` 또는 `main.rs`)에 `pub`을 표시하면 구성원들을 접근 가능하게 할 수 있습니다.

### 11. 구조체 가시성

함수와 마찬가지로, structure도 module 외부로 무엇을 노출할지를 `pub`을 사용해 선언할 수 있습니다.

```rust
// SeaCreature struct는 우리 module 외부에서도 사용 가능합니다
pub struct SeaCreature {
    pub animal_type: String,
    pub name: String,
    pub arms: i32,
    pub legs: i32,
    // 우리의 무기는 비밀로 남겨둡시다
    weapon: String,
}
```

### 12. 전주곡 (Prelude)

`use`로 가져오지도 않았는데 어떻게 어디서나 `Vec`나 `Box`를 쓸 수 있는지 궁금하실지도 모르겠습니다. 이는 standard library의 `prelude` module 덕분입니다.

Rust의 standard library에서는 `std::prelude::*`로 내보내기 된 모든 것들이 어디에서든 자동으로 사용 가능하다는 점을 알아두십시오. `Vec`와 `Box`가 바로 이런 경우이며, 다른 것들(Option, Copy, 기타 등등)도 마찬가지입니다.

### 13. 여러분만의 Prelude

standard library의 prelude로 인해, 흔히들 library마다 고유의 prelude module을 만들어 library 사용을 위해 필요한 가장 흔한 데이터 구조들을 모두 가져오는 시작점으로 쓰곤 합니다 (예:` use my_library::prelude::*`). standard library와 달리 프로그램이나 library에서 자동으로 쓸 수 있는 것은 아니지만, library 사용자들이 어디서부터 시작할지 도움을 줄 좋은 습관입니다.

Ferris가 말하길, "좋은 rustacean이 되어, 좋은 prelude로 게 친구를 도와주세요!"

## 마무리

`pub`을 사용해서 모듈 불러서 쓰셈

이제 여러분의 소매 속에는 Rust 프로그램과 library를 만드는 데에 쓸 몇 가지 재주가 생겼습니다. 이걸 모두 기억하려고 하지 마세요. 여러분의 library가 커져감에 따라, 또 다른 사람들이 사용함에 따라, 각 단계에서 뭐가 가장 좋은 방법인지 알게 될 것입니다.

자료: [Guidelines For Writing Rust APIs](https://rust-lang.github.io/api-guidelines/)
