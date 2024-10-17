---
layout: post
title: "[Rust] Hello Rust"

# subtitle: " "

date: 2024-08-14 10:00:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/0814/1.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - Rust study
tags:
  - rust
  - rust 구축
  - rust setup
  - rust setting
  - 러스트
  - 러스트 설치
---

> 참고문서 <br/> [ 《 한국 러스트 사용자 그룹 》 ](https://rust-kr.org/pages/install/) <br/> [ 《 Rust_Book 》 ](https://rinthel.github.io/rust-lang-book-ko/) <br/> [ 《 Rust란 무엇인가 》 ](https://learn.microsoft.com/ko-kr/training/paths/rust-first-steps/)

## hello rust

한 때 공부하다가 업무하다보니 놓친 rust 다시 시작하려고한다.<Br/>
rust 설치부터 사용법까지 쭉쭉 달려보자

### 1. 설치

- 설치

  ```cmd
  # curl 설치
  $ curl https://sh.rustup.rs -sSf | sh

  # brew 설치
  $ brew install rust
  ```

  설치가 완료 문구와함께 설치가 된거를 확인할수있다.

  ```cmd
  Rust is installed now. Great!
  ```

- rust 설치확인

  ```cmd
  $ rustc --version
  $ rustc -V
  ```

### 2. 업데이트 | 제거하기

- 업데이트

  ```cmd
  #설치
  $ rustup update

  # 제거
  $ rustup self uninstall
  ```

### 3. hello rust 출력해보기

- 폴더 및 러스트 파일생성

  ```cmd
  # 프로젝트파일생성
  $ mkdir 폴더명
  # 파일생성
  $ echo > main.rs
  ```

- rust 출력 함수를 만들어준다

  ```rust
  fn main(){
      println!("Hello, Rust");
  }
  ```

- 빌드후 실행
  ```cmd
  $ rustc main.rs
  # 빌드가 완성되면
  $ ./main
  Hello, Rust!
  ```

## 마무리

다음 시간에는 rust npm 같은 패키지 모듈 관리해 주는 cargo를 사용해보겠습니다.
