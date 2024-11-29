---
layout: post
title: "[FRONT] BroadcastChannel 사용해서 같은 도메인 브라우저 간 통신하기"

subtitle: "tab과 tab 사이통신해보자"

date: 2024-11-29 11:45:51
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1129/broadcastchannel.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - FRONT
tags:
  - 간단예제
  - BroadcastChannel
  - BroadcastChannel example
  - 브로드캐스트 채널
  - 브로드캐스트 채널 예제
  - 탭과탭 사이 통신
  - 같은 도메인상 브라우저간 통신
---

{% include post/front_contents.md %}

> [참고문서 MDN](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)

## 이슈

appweb에서 작업하다보니 새로운 창을 띄우고 그 창에서 작업을 하는 경우가 있었다. 근데 창을 닫고 먼가 통신을해야되는데 자꾸 다른변수가 생겨서 어떻게 처리해야 될지 고민하다가 broadcastchannel을 사용해서 통신을 하기로 하였고 괜찮은거 같아 정리해보기로함.
오늘은 어떻게 사용하는지 콘솔창으로 설명하고 사용법을 정리해보기로함.

### **BroadcastChannel 설명**

`BroadcastChannel`은 브라우저의 여러 탭이나 iframe 간에 메시지를 주고받을 수 있도록 하는 API입니다. 같은 출처(Same-Origin)에 있는 다른 JavaScript 실행 환경 간에 실시간으로 데이터를 공유할 수 있습니다.

`BroadcastChannel`을 사용하면 애플리케이션의 여러 인스턴스 간 동기화, 알림 전송, 상태 업데이트 등의 작업을 효율적으로 처리할 수 있습니다.

---

### **주요 특징**

1. **양방향 통신 지원**: 메시지를 보내고 받을 수 있습니다.
2. **다중 탭/iframe 간 통신**: 브라우저 내에서 여러 탭이나 iframe이 동일한 이름의 채널을 사용해 통신 가능.
3. **같은 출처 제한**: 같은 도메인, 프로토콜, 포트를 공유하는 경우에만 동작.

---

### **예제 코드**

#### 1. **BroadcastChannel 생성**

```javascript
const channel = new BroadcastChannel("my_channel");
```

#### 2. **메시지 보내기**

```javascript
channel.postMessage("안녕하세요! BroadcastChannel을 통해 보낸 메시지입니다.");
```

#### 3. **메시지 받기**

```javascript
channel.onmessage = (event) => {
  console.log("받은 메시지:", event.data);
};
```

#### 4. **채널 닫기**

```javascript
channel.close();
```

---

### **완전한 예제: 두 개의 탭 간 메시지 송수신**

**A 탭 코드**:
초기세팅
```javascript
const channel = new BroadcastChannel("example_channel");

channel.onmessage = (event) => {
  console.log("A 탭에서 받은 메시지:", event.data);
};
```

**B 탭 코드**:
```javascript
const channel = new BroadcastChannel("example_channel");
channel.onmessage = (event) => {
  console.log("B 탭에서 받은 메시지:", event.data);
};
```
**실행코드**
```javascript
// A 탭에서 실행
channel.postMessage("B 탭, 잘 지내고 계신가요?");
// B 탭에서 실행
channel.postMessage("A 탭, 잘 지내고 계신가요?");
```
---
![](/img/post/2024/1129/broadcast.gif)

### **사용 사례**

1. **다중 탭 상태 동기화**: 로그인/로그아웃 상태 동기화.
2. **알림 전송**: 한 탭에서 발생한 이벤트를 다른 탭에 알림.
3. **캐시 업데이트 알림**: 서비스 워커를 활용해 캐시 갱신을 알림.

## 마무리
도메인만 같은 도메인으로 맞춰두면 알아서 왔다갔다 잘할수있어서 사용하기 어려움없을듯 
`BroadcastChannel`은 비교적 간단한 방식으로 브라우저 간 데이터를 교환할 수 있어 많은 프론트엔드 프로젝트에서 유용하게 활용할수있다. 😊