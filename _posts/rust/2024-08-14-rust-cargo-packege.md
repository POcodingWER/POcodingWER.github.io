---
layout: post
title: "[Rust] Hello Cargo"

# subtitle: " "

date: 2024-08-14 14:03:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/0814/2.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - RustStudy
tags:
  - cargo
  - rust
  - 러스트
---

{% include post/rust_contents.md %}

> 참고문서 <br/> [ 《 한국 러스트 사용자 그룹 》 ](https://rust-kr.org/pages/install/) <br/> [ 《 Rust_Book 》 ](https://doc.rust-kr.org/) <br/> [ 《 Rust란 무엇인가 》 ](https://learn.microsoft.com/ko-kr/training/paths/rust-first-steps/)

## Cargo

카고 (Cargo) 는 러스타시안이라면 대부분 사용하는 러스트 빌드 시스템 및 패키지 매니저입니다. 이 도구는 코드 빌드나, 코드 작성에 필요한 외부 라이브러리를 다운로드할 때나, 라이브러리를 제작할 때 겪는 귀찮은 일들을 상당수 줄여주는 편리한 도구입니다. (앞으로 외부 라이브러리는 의존성 (dependency) 이라고 지칭하겠습니다.)

앞에서 [rust 설치](/ruststudy/2024/08/14/rust-setup/)를 마쳤을경우 이미 카고가 설치되어있습니다.

##### 1. Cargo 설치 확인

```cmd
$ cargo --version
```

##### 2. Cargo 프로젝트 생성하기

```cmd
$ cargo new hello_cargo
$ cd hello_cargo

$ cargo build
	Finished dev [unoptimized + debuginfo] target(s) in 0.00s

$ cargo run 또는
$ cargo r
	Finished dev [unoptimized + debuginfo] target(s) in 0.00s
	Running `target/debug/hello_cargo`
	Hello, world!
```

![생성된 파일목록](/img/post/2024/0814/2.png)

<span style="font-size:80%">
cargo run을 사용하면 cargo build 실행 후 바이너리 경로를 입력해서 실행하는 것보다 편리하므로, 대부분의 개발자들이 cargo run을 이용합니다.
</span>

##### 3. Cargo 명령어

```cmd
$ cargo check
  Checking hello_cargo v0.1.0 (file:///projects/hello_cargo)
  Finished dev [unoptimized + debuginfo] target(s) in 0.32 secs
```

- `cargo new`로 새 프로젝트를 생성할 수 있습니다.
- `cargo build` 명령으로 프로젝트를 빌드할 수 있습니다.
- `cargo run` 명령어는 한 번에 프로젝트를 빌드하고 실행할 수 있습니다.
- `cargo check` 명령으로 바이너리를 생성하지 않고 프로젝트의 에러를 체크할 수 있습니다.
- 빌드로 만들어진 파일은 작성한 소스 코드와 뒤섞이지 않도록 target/debug 디렉터리에 저장됩니다.
  {: .notice}

## 마무리

- `rustup` 으로 최신 stable 버전 러스트를 설치하기
- 러스트를 새 버전으로 업데이트하기
- 로컬 설치된 문서 열어보기
- 직접 `rustc`를 사용해 ‘Hello, world!’ 프로그램을 작성하고 실행해 보기
- 일반적인 카고의 사용법으로 프로젝트를 생성하고 실행하기
  시작이 반이다!
