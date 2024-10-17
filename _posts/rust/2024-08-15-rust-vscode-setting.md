---
layout: post
title: "[Rust] 공부전 vscode에 환경세팅 부터 해보자!"

# subtitle: " "

date: 2024-08-15 17:28:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/0815/1.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true

tags:
  - rust
  - rust 구축
  - rust setup
  - rust setting
  - 러스트
  - 러스트 설치
  - vs code
---

## vscode에 개발환경 구축

### 1. 프로젝트 디렉토리인 hello_rust로 이동한 후, code . 명령으로 Visual Studio Code를 실행합니다. code 다음에 . 을 추가해야 현재 경로의 디렉토리를 Visual Studio Code에서 열어서 보여주니 주의하세요.

```rust
$ cd hello_rust
$ code .
```

![https://blog.kakaocdn.net/dn/x8cO1/btryiFQrOiL/0ciVVKyWiZOJq9nWwkTnDK/img.png](https://blog.kakaocdn.net/dn/x8cO1/btryiFQrOiL/0ciVVKyWiZOJq9nWwkTnDK/img.png)

다음처럼 현재 디렉토리가 Visual Studio Code에서 보이게 됩니다.

![https://blog.kakaocdn.net/dn/b1pdFW/btrykAVp6KM/NWupcLhxt0RbfkIiWcG3r1/img.png](https://blog.kakaocdn.net/dn/b1pdFW/btrykAVp6KM/NWupcLhxt0RbfkIiWcG3r1/img.png)

### 2. src 디렉토리에 Rust 소스코드 파일  main.rs이 포함되어 있으며 간단히 터미널에 Hello, world! 를 출력하는 코드입니다.

![https://blog.kakaocdn.net/dn/KCfv4/btryiGojUgH/RkvxwZeNPwe0NcP0iamgY0/img.png](https://blog.kakaocdn.net/dn/KCfv4/btryiGojUgH/RkvxwZeNPwe0NcP0iamgY0/img.png)

### 3. Rust를 위해 준비된 확장을 설치해줘야 합니다. 왼쪽 바에서 확장 아이콘을 클릭합니다.

![https://blog.kakaocdn.net/dn/b9kdsJ/btryd2kT62J/lP0sPIUu4MTKCS9sdZswOk/img.png](https://blog.kakaocdn.net/dn/b9kdsJ/btryd2kT62J/lP0sPIUu4MTKCS9sdZswOk/img.png)

### 4. rust-analyzer와 CodeLLDB를 각각 검색한 후, 파란색 설치 버튼을 클릭하여 설치합니다.

![https://blog.kakaocdn.net/dn/yUbla/btrygZgCZlI/JN7owX5TypoxPniiSMYask/img.png](https://blog.kakaocdn.net/dn/yUbla/btrygZgCZlI/JN7owX5TypoxPniiSMYask/img.png)

![https://blog.kakaocdn.net/dn/bdfXdJ/btryiGV9gau/g9j9hIQxK4BLLKPVDPhAAK/img.png](https://blog.kakaocdn.net/dn/bdfXdJ/btryiGV9gau/g9j9hIQxK4BLLKPVDPhAAK/img.png)

### 5. src 디렉토리에 있는 main.rs를 선택한 후, 소스 코드 편집창을 한번 클릭한 후, 실행하기 위해 Ctrl + Shift + B를 누르고 보이는 메뉴에서 rust: cargo build를 클릭합니다.

![https://blog.kakaocdn.net/dn/YnrMV/btrydAPKdT9/GLswfi3SmQXqo3RbQkyqY1/img.png](https://blog.kakaocdn.net/dn/YnrMV/btrydAPKdT9/GLswfi3SmQXqo3RbQkyqY1/img.png)

### 6. 터미널에 다음처럼 빌드 관련 메시지가 보입니다.

![https://blog.kakaocdn.net/dn/be4jHe/btryigPV2v8/Z6tQOGEcFfSlcCkfPy1Cm0/img.png](https://blog.kakaocdn.net/dn/be4jHe/btryigPV2v8/Z6tQOGEcFfSlcCkfPy1Cm0/img.png)

### 7. 코드에 보이는 Run을 클릭하면 실행이 됩니다.

![https://blog.kakaocdn.net/dn/cj1A5j/btrygYPyxLT/XTC3WcnrZuVRBkAoNUJy4K/img.png](https://blog.kakaocdn.net/dn/cj1A5j/btrygYPyxLT/XTC3WcnrZuVRBkAoNUJy4K/img.png)

다음처럼 터미널에 실행결과인 Hello, world!가 보입니다.

![https://blog.kakaocdn.net/dn/lQa9t/btryguWrj65/jTyT2umHNcSsLG0SwA3nt1/img.png](https://blog.kakaocdn.net/dn/lQa9t/btryguWrj65/jTyT2umHNcSsLG0SwA3nt1/img.png)

이 방법은 반복적인 작업을 할때 불편하니 단축키를 등록하는 게 좋습니다.

### 8. 단축키 등록을 위해 메뉴에서 파일 > 기본 설정 > 바로 가기 키를 선택합니다.

![Untitled](/img/post/2024/0815/1.png)

### 9. 오른쪽 위에 보이는 빨간색 사각형으로 표시해둔 아이콘을 클릭합니다.

![https://blog.kakaocdn.net/dn/Jgme6/btryd3c1pxe/JhNRklQtVKm9fy4IcTMQx1/img.png](https://blog.kakaocdn.net/dn/Jgme6/btryd3c1pxe/JhNRklQtVKm9fy4IcTMQx1/img.png)

다음 내용을 추가하고 Ctrl + S를 눌러 저장합니다.

```rust
{ "key": "shift+cmd+r", "command": "workbench.action.tasks.runTask" }
```

![https://blog.kakaocdn.net/dn/NKLI3/btryiFv8PCP/U996H1QSKTpNzgk6kXXl9k/img.png](https://blog.kakaocdn.net/dn/NKLI3/btryiFv8PCP/U996H1QSKTpNzgk6kXXl9k/img.png)

### 10. Ctrl + Shift + R을 누르고 작업 구성을 선택합니다.

![https://blog.kakaocdn.net/dn/bc3WeC/btryd1lZMFY/suQdNF2OF5EFQoHIQXhJrK/img.png](https://blog.kakaocdn.net/dn/bc3WeC/btryd1lZMFY/suQdNF2OF5EFQoHIQXhJrK/img.png)

rust: cargo run을 선택합니다.

![https://blog.kakaocdn.net/dn/ctipCq/btrymjZXQ1E/n8j2evMB9o4EoM8EXREJK0/img.png](https://blog.kakaocdn.net/dn/ctipCq/btrymjZXQ1E/n8j2evMB9o4EoM8EXREJK0/img.png)

다시 Ctrl + Shift + R을 누르고 rust: cargo run을 선택하면 rust 프로그램이 실행됩니다.

![https://blog.kakaocdn.net/dn/V4rgT/btryd17kGqS/db31Dk64X2WGdwK1ork3E0/img.png](https://blog.kakaocdn.net/dn/V4rgT/btryd17kGqS/db31Dk64X2WGdwK1ork3E0/img.png)

이제 Ctrl + Shift + B 또는 Ctrl + Shift + R을 눌러 Rust 코드를 빌드하고

Ctrl + Shift + R를 눌러 Rust 코드를 실행할 수 있습니다.

### 11. 방금한 Ctrl + Shift + R를 눌러 추가한 결과는 현재 Rust 프로젝트의 .vscode/tasks.json 파일에 해당 설정을 추가하여 진행되므로 번거롭더라도 Rust 프로젝트를 생성할 때마다 해줘야 합니다.

더 좋은 방법을 알고 계신 분은 댓글로 남겨주세요. 포스트에 반영하도록 하겠습니다.

![https://blog.kakaocdn.net/dn/czJJJN/btrykgIU6N9/4nkjG7K8sJoKskfwhswNG1/img.png](https://blog.kakaocdn.net/dn/czJJJN/btrykgIU6N9/4nkjG7K8sJoKskfwhswNG1/img.png)

## 마무리

vs code에서 작업할수있게 환경세팅도 해보고 필요한 패키지도 설치해서 돌려보았는데 나쁘지 않은거 같다.
