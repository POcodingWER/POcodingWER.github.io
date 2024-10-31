---
layout: post
title: "[Blog] 깃허브 댓글 utterances 사용법"

# subtitle: " "

date: 2024-08-10 11:00:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/utterances.png"

# hidden: true
categories:
  - Blog
tags:
  - git
  - github
  - utterances
  - comment
---

{% include post/blog_contents.md %}

## utterances??

utterances는 GitHub 문제를 기반으로 하는 가벼운 댓글 위젯이다. 블로그 댓글, 위키 페이지 등에 GitHub 문제(issues)를 사용할 수 있다.

1. 오픈 소스
2. 추적이나 광고가 없는 완전 무료입니다. 📡
3. 잠금이 없습니다. 데이터는 자신의 GitHub 문제에 안전하게 저장됩니다.
4. 다크 모드를 지원합니다.

## utterances 적용하기

### 1. 설치

> [《utterances 설치》](https://github.com/apps/utterances) 이슈페이지로 사용할

레파지토리가 없다면 새로 만들어야된다.
![](/img/post/2024/0810/1.png) 1.인스톨눌러서 진행
![](/img/post/2024/0810/2.png) 2.인스톨 눌러서

### 2. 설정

[《utterances 설정》](https://utteranc.es/)
![](/img/post/2024/0810/3.png)

1.  repo: 내깃허브 이슈에 쌓을레포지토리 설정 (ex.POcodingWER/utterances)
2.  Blog Post Issue Mapping 설정
3.  lable 설정
4.  Theme 색 선택
5.  Copy

```js
<script
  src="https://utteranc.es/client.js"
  repo="[ENTER REPO HERE]"
  issue-term="pathname"
  theme="gruvbox-dark"
  crossorigin="anonymous"
  async
></script>
```

### 3. 테스트

내 블로그 설정할 곳에 코드를 붙여넣으면 알아서 설정이 된다.
![](/img/post/2024/0810/4.png)
![](/img/post/2024/0810/5.png) 2.1에서 설정한 레파지토리에 이슈로 남아있는다.

### 4. 이메일 알림 설정

github 설정한(repository) setting -> email notifications
-> 이메일 설정하면 된다.
![](/img/post/2024/0810/6.png)

## 마무리

슬슬 블로그 형태를 맞춰가고있고 안해보던 기술을 붙이니깐 재미가 있다. <br/>
다음번에는 광고를 붙여봐야겠다.
