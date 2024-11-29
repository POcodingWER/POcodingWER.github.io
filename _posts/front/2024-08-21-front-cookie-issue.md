---
layout: post
title: "[FRONT] Cookie Issue"

subtitle: "쿠키 이슈"

date: 2024-08-21 17:00:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/0821/cookie.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - Cookie
tags:
  - front
  - cookie
  - path
  - 쿠키 업데이트
  - 쿠키 자동저장
  - cookie isuue
---
{% include post/front_contents.md %}

> 쿠키로인한 이슈발생도있었고 시간 날려버린게 ~~개빡쳐서~~ 정리해둔다.

## ISUUE 발생!

로그인이 계속풀리거나. 토큰을 날리는데 계속 만료된토큰이라고 뜸...
원인을 찾다찾다가 못찾아서 백로그로 두다가

### Cookie 부터 알아보자

웹 쿠키(Web Cookie)는 웹사이트가 사용자의 브라우저에 저장하는 작은 데이터 파일입니다. 쿠키는 사용자가 특정 웹사이트를 방문할 때 생성되며, 이후 그 사이트를 다시 방문할 때 이전의 방문 정보를 기반으로 사용자에게 맞춤형 경험을 제공하는 데 사용됩니다.

쿠키의 주요 기능:

- 세션 관리: 로그인 상태를 유지하거나 쇼핑카트에 담긴 상품을 기억하는 등 사용자가 웹사이트에서 수행하는 작업을 추적합니다.
- 개인화: 사용자의 선호도를 기억하여 맞춤형 콘텐츠를 제공하거나, 사용자 이름을 기억해 환영 메시지를 띄우는 등 웹사이트 사용 경험을 개선합니다.
- 트래킹 및 분석: 웹사이트 방문자 수, 방문 패턴, 클릭 경로 등을 분석하여 마케팅 활동이나 웹사이트 성능을 최적화하는 데 사용됩니다.

쿠키의 유형:

- 세션 쿠키(Session Cookie): 웹사이트를 떠날 때나 브라우저를 닫을 때 삭제되는 쿠키입니다.
- 영구 쿠키(Persistent Cookie): 특정 기간 동안 유지되며, 이 기간이 지나기 전까지는 사용자가 웹사이트를 방문할 때마다 쿠키 정보를 사용합니다.
- 서드파티 쿠키(Third-party Cookie): 사용자가 방문한 웹사이트가 아닌 다른 도메인에서 생성한 쿠키로, 주로 광고 및 트래킹 목적에 사용됩니다.

웹 쿠키는 편리한 웹사이트 사용 경험을 제공하지만, 사용자의 개인정보를 추적하고 수집하는 데 사용될 수 있어 프라이버시 문제와 관련된 논란이 있습니다. 이 때문에 대부분의 웹사이트는 쿠키 사용에 대해 사용자 동의를 받도록 하고 있습니다.

### Cookie 생성

JavaScript를 사용하면 사용자의 브라우저에서 직접 쿠키를 생성하고 관리할 수 있다.

```js
// Function to set a cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
setCookie("username", "JohnDoe", 7);
```

function getCookie(name) {
let nameEQ = name + "=";
let ca = document.cookie.split(';');
for(let i = 0; i < ca.length; i++) {
let c = ca[i];
while (c.charAt(0) == ' ') c = c.substring(1, c.length);
if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
}
return null;
}

// Example usage:
let user = getCookie("username");
if (user) {
alert("Welcome again, " + user);
}

### Cookie 읽기

```js
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Example usage:let user = getCookie("username");
if (user) {
  alert("Welcome again, " + user);
}
```

### Cookie 옵션

- 만료: 쿠키가 만료되는 날짜를 지정합니다. 생략하면 쿠키는 세션이 끝날 때(브라우저가 닫힐 때) 만료됩니다.
- max-age: 쿠키가 만료될 때까지의 시간(초)을 지정합니다. 'expires'와 'max-age'가 모두 설정된 경우 'max-age'가 우선 적용됩니다.
- 경로: 쿠키가 유효한 사이트 내 경로를 정의합니다. 설정하지 않으면 기본값은 현재 경로입니다.
- 도메인: 쿠키가 유효한 도메인을 지정합니다. 설정하지 않으면 쿠키를 발행한 문서의 도메인에 대해 쿠키가 유효합니다.
- 보안: 쿠키가 보안 HTTPS 연결을 통해서만 전송되어야 함을 나타냅니다.
- httponly: 설정된 경우 쿠키는 JavaScript의 Document.cookie API에 액세스할 수 없습니다. 서버로만 전송됩니다.
- samesite: 크로스 사이트 요청과 함께 쿠키가 전송되는지 여부를 제어합니다. '엄격함', '느슨함' 또는 '없음'으로 설정할 수 있습니다.

### Cookie 삭제

1. 쿠키를 삭제하려면 expires 속성을 과거 날짜로 설정하면 됩니다.
1. 또는 value 값을 아무것도 없이 넣어줍니다.

```js
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

function eraseCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999;";
}
eraseCookie("username");
```

## 쿠키를 알아봤으니 ISUUE 해결해보자

쿠키 생성시 path 입력을 안했다. 중요한지 몰랐고 무슨 영향을 끼칠지 몰라서.
[jsdocs를](https://ko.javascript.info/cookie#ref-404) 보면 특별한 경우가 아니라면, path 옵션을 path=/같이 루트로 설정해 웹사이트의 모든 페이지에서 쿠키에 접근할 수 있도록 합시다.

### ISUUE 정리

1. 우리 서비스자체는 모바일 웹이다.
1. 다른 페이지를 갔다가 우리 페이지로 넘겨줄때 /fake 페이지로 넘겨줌

   - 모바일 웹이라 키패드인증 등을 걸쳐야하는데 fake page 들렸다가 (가상으로 키패드 인증 처리) -> 원하는 페이지로 넘겨줌

1. 그러다 보니 모르는 사이에 아래 이미지 처럼 경로가 잡혀버림
   ![](/img/post/2024/0821/1.png)
1. 웹이였으면 문제가 안될수도있을듯?

   - 모바일 웹 + 싱글페이지(vue)사용 이여서인지 처음 렌더 될때 말고는 url변경이 안된다.
   - url `www.domain/fake` 상태로 어느페이지를 가능
     - `www.domain/setting` 으로 가면 사실 path:`/fake` 쿠키는 쓸수없음
   - cookie를 읽을때 `/fake` 경로에 쿠키를 가져온다 여기까지도 괜찮음
   - `accessToken`이 만료되어 `refreshToken`로 새로운 `accessToken`저장은 (개발자 수정으로)`/`여기에 해버림
   - 로그인 계속풀리고 난리난리남 무한 api loop생성됨

1. path `/fake` 들어가야만 사용되었다면 문제없었을듯 근데 저 url 주소로 떨어지면 저기 쿠키값만 가져올수있음. 웹앱이나 싱글페이지 특성인듯

### 해결

1. `refreshToken` 받아올때 쿠기값 전부다 날려버리고 `path` 지정하여 `/`에 저장

## 마무리

머든지 모르면 문서에서 하라는데로하셈 나중에 피똥쌈
