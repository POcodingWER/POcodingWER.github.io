---
layout: post
title: "[FRONT] URL과 Domain 정확히 이해하자 (url구조)"

subtitle: "URL과 Domain에 대해 이해해 보자"

date: 2025-01-03 08:30:35
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/01/url.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - FRONT
tags:
  - 간단예제
  - 이벤트 버블링
  - 이벤트 캡처링
  - bubbling
  - capturing
---

{% include post/front_contents.md %}

## URL이란?

URL은 웹에서 특정 페이지나 리소스를 찾아갈 수 있는 주소입니다. 쉽게 말해서 웹사이트를 찾아가는 도로명 주소라고 생각하면 됩니다.

## URL의 구성요소

아래 URL을 예시로 살펴보겠습니다:

![](/img/post/2025/01/url.png){: #magnific}

각 부분을 하나씩 살펴볼까요?

1. **프로토콜 (http://)**

   - 웹사이트에 접속하는 방법을 알려주는 규칙
   - http는 일반 접속 방법
   - https는 보안이 강화된 접속 방법

2. **도메인 (music.naver.com)**

   - 웹사이트의 주소
   - IP 주소(숫자)를 사람이 기억하기 쉬운 이름으로 바꾼 것
   - 예: music.naver.com, www.youtube.com

3. **경로 (/listen/top100.nhn)**

   - 웹사이트 안에서 특정 페이지의 위치
   - 폴더나 파일 경로를 나타냄
   - 예: /listen, /search, /login

4. **매개변수 (?domain=OVERSEA&duration=1h)**

   - 추가 정보를 전달하는 부분
   - ? 로 시작하고 키=값 형태로 작성
   - 여러 개는 & 로 구분
   - 예시에서는 해외음악(OVERSEA)을 1시간(1h) 동안 보여주는 설정

5. **프래그먼트 (#content)**
   - 페이지의 특정 부분을 가리킴
   - `# 뒤에 위치`
   - 예시에서는 content 영역으로 바로 이동

## 도메인의 구조

도메인은 다음과 같이 구성됩니다:

```
blog.naver.com
  ↓    ↓   ↓
  3차  2차  1차
```

1. **1차 도메인 (.com)**

   - 가장 뒤에 있는 부분
   - .com, .net, .org, .kr 등
   - 용도나 국가를 나타냄

2. **2차 도메인 (naver)**

   - 실제 서비스/회사 이름
   - 예: google, naver, daum

3. **3차 도메인 (blog)**
   - 추가로 붙는 서비스 이름
   - 예: mail, blog, news

## 실제 사용 예시

1. **일반적인 웹사이트 접속**

```
https://www.google.com
```

2. **검색 결과 페이지**

```
https://www.google.com/search?q=날씨
```

3. **로그인 페이지**

```
https://www.naver.com/login
```

## 정리

- URL은 웹페이지의 주소입니다
- 프로토콜, 도메인, 경로, 매개변수, 프래그먼트로 구성됩니다
- 도메인은 IP 주소를 사람이 이해하기 쉽게 만든 이름입니다

이제 주소창에 있는 URL이 어떤 의미인지 이해하실 수 있죠? 😊
