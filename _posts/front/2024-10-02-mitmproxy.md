---
layout: post
title: "[FRONT] Man in the Middle Proxy 설치하기"

subtitle: "mitmproxy"

date: 2024-10-02 15:23:57
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1002/mimt.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true

tags:
  - front
  - mitmproxy
  - Man in the Middle
  - mitmproxy android
  - mitmproxy ios
  - mitmproxy설치
  - 안드로이드 proxy 설정
  - ios proxy 설정
---

> 일하다보니 모바일 앱에서 발생하는 api를 직관적으로 볼수가없어서 mitmproxy 컴퓨터랑 -> 모바일 앱에서 확인필요하여 설치하고 사용법좀 익혀보려함

# mitmproxy란?

mitmproxy는 **중간자 공격(Man-In-The-Middle, MITM)**을 수행할 수 있도록 해주는 오픈 소스 HTTP(S) 프록시 도구입니다. 이를 통해 네트워크 트래픽을 가로채고, 분석하며 수정할 수 있습니다. 주로 웹 개발, 보안 분석, 네트워크 디버깅, 그리고 트래픽 모니터링에 사용됩니다. 이제 mitmproxy의 주요 개념과 기능을 단계별로 자세히 설명하겠습니다.

### 1. MITM 공격의 기본 개념

MITM 공격은 통신하는 두 당사자 사이에 공격자가 끼어들어 트래픽을 가로채는 행위를 의미합니다. 공격자는 중간에서 데이터를 가로채고, 변조하거나 재전송할 수 있습니다. mitmproxy는 이러한 MITM 공격을 시뮬레이션하고 트래픽을 분석할 수 있는 도구로 사용됩니다.

### 2. mitmproxy의 주요 구성 요소

- **mitmproxy**: 기본 CLI 인터페이스로, 터미널에서 트래픽을 실시간으로 보고 수정할 수 있습니다.
- **mitmweb**: 웹 기반 인터페이스로, 그래픽 UI를 통해 트래픽을 쉽게 분석하고 조작할 수 있습니다.
- **mitmdump**: 자동화 및 스크립팅에 주로 사용되는 커맨드 라인 도구로, 트래픽을 파일에 기록하거나 특정 스크립트와 함께 사용됩니다.

### 3. 작동 원리

1. **프록시 설정**: 사용자는 브라우저나 장치의 네트워크 설정에서 프록시를 mitmproxy로 설정합니다.
2. **인증서 설치**: HTTPS 트래픽을 가로채려면 클라이언트가 mitmproxy의 인증서를 신뢰하도록 설정해야 합니다. 이를 통해 암호화된 HTTPS 트래픽도 복호화하여 확인할 수 있습니다.
3. **트래픽 가로채기**: 프록시 서버 역할을 하며, 클라이언트와 서버 사이의 모든 트래픽을 가로채어 분석할 수 있습니다.
4. **트래픽 수정**: 가로챈 데이터를 사용자가 원하는 대로 수정하거나 스크립트를 사용해 자동화할 수 있습니다.

### 4. mitmproxy의 주요 기능

- **실시간 트래픽 가로채기**: HTTP/HTTPS 트래픽을 실시간으로 볼 수 있습니다.
- **트래픽 변조**: 요청이나 응답을 수정하거나 새로운 데이터를 삽입할 수 있습니다.
- **스크립트 작성**: Python 스크립트를 작성하여 트래픽을 자동으로 분석하고 변조할 수 있습니다.
- **로그 및 기록**: mitmdump를 통해 트래픽을 기록하고 나중에 분석할 수 있습니다.
- **SSL/TLS 트래픽 분석**: 인증서를 설정하여 암호화된 트래픽을 복호화하고 분석할 수 있습니다.

### 5. mitmproxy 사용 방법

1. **설치**: mitmproxy는 파이썬을 통해 설치 가능합니다.
   ```bash
   $ brew install mitmproxy
   ```
2. **프록시 실행**: 기본 터미널 인터페이스로 실행하려면 다음 명령어를 사용합니다.
   ```bash
   $ mitmproxy
   ```
3. **트래픽 분석**: 브라우저나 장치에서 mitmproxy를 프록시 서버로 설정하고 웹 트래픽을 분석합니다.
4. **스크립트 사용**: Python 스크립트를 사용하여 트래픽을 조작할 수 있습니다.

### 6. 활용 사례

- **보안 테스트**: 웹 애플리케이션의 취약점을 분석하고 테스트할 수 있습니다.
- **API 디버깅**: 클라이언트와 서버 간의 API 호출을 분석하고 응답을 검토할 수 있습니다.
- **광고 차단**: 웹 페이지에서 특정 광고나 추적기를 제거하기 위한 스크립트를 작성할 수 있습니다.

이처럼 mitmproxy는 네트워크 보안 및 디버깅에 매우 강력한 도구입니다.

## 설치 방법

[공식페이지 https://mitmproxy.org](https://mitmproxy.org)

```bash
# 설치
$ brew install mitmproxy
# 설치 확인
$ mitmproxy --version
# web inter face
$ mitmweb --listen-port 8080
# console intert face
$ mitmproxy --listen-port 8080
```

### 프록시 설정 및 HTTPS처리

mac에서는 “네트워크 환경설정 > Wi-Fi > 고급 > 프락시 > 보안 웹 프락시(HTTPS)” 를 통해 접근하여 아래 이미지처럼 설정합시다.
![](/img/post/2024/1002/wifi-setting.png)
또는!! 명령어로가능

```bash
#HTTP
$ networksetup -setwebproxy 'Wi-Fi' localhost 8080
#HTTPS
$ networksetup -setsecurewebproxy 'Wi-Fi' localhost 8080
```

설정후 api 날려보면 확인가능하다
![](/img/post/2024/1002/api-req.png)

HTTPS에 관한 처리진행해야됨  
많은 웹 사이트는 HTTP 보다는 HTTPS로 접근하게 됩니다. HTTPS를 이용하여 접근한 경우 보안에 관련된 요소가 적용되니 mitmproxy를 설치하고 난 후 다음과 같이 인증서를 PC에 등록해야됨.
pem 키는 `mitmproxy` 설치할 때 자동으로 같이 설치됨 아래 명령어로 키체인에 등록해주면됩니다.

```bash
# 인증서 등록
$ sudo security add-trusted-cert -d -p ssl -p basic -k /Library/Keychains/System.keychain ~/.mitmproxy/mitmproxy-ca-cert.pem
```

![](/img/post/2024/1002/keychain.png)

```bash
# 삭제
$ brew uninstall mitmproxy
# 인증서 삭제
$ sudo security delete-certificate -c mitmproxy
# 프록시 설정 끄기
$ networksetup -setwebproxystate "Wi-Fi" off
$ networksetup -setsecurewebproxystate "Wi-Fi" off
```

### 핸드폰 라우터 설정

1. 설정 -> wifi -> 사용하는와이파이 -> 프록시설정

```bash
# ip 확인
$ ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'
```

![](/img/post/2024/1002/wifi-router.jpeg){: width="200" height="100"}

1. [mitm.it](mitm.it)접속해서 기기에맞는 다운받으면됨 위이미지처럼 안보이면 wifi라우터설정이 잘못된경우
   ![](/img/post/2024/1002/success.jpeg){: width="200" height="100"}
1. - iOS의 경우 (10.3 이후)
     일반 → VPN 및 기기관리
     mitmproxy 프로파일 설치
     설정 → 일반 → 정보 → 인증서 신뢰 설정
     루트 인증서 전체 신뢰 활성화에 mitmproxy 인증서 ✅

   - Android의 경우 (삼성 android 7 이후의 설정 앱 기준으로 설명)
     설정 → 잠금화면 및 보안 → 기타 보안 설정 → 디바이스에 저장된 인증서 설치
     파일 선택 후 패턴이나 추가 보안 매체로 확인 후, 인증서 이름을 기입하고, VPN 및 앱 선택
     안드로이드 7 (누가) 이상에서 안되는 이슈가 있음 링크

1. 설정 -> 보안 및 개인정보 보호 -> 기타 보안 설정 -> 기기에 저장된 인증서 설치 -> CA인증서 ->계속설치 -> mitmproxy-ca-cert.cer 설치

## 이슈

안드로이드 7에 도입된 네트워크 보안 구성([Network Security Configuration](https://developer.android.com/privacy-and-security/security-config?hl=ko))과 앱 개발자가 인증서 고정([certificate pinning](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning#what-is-pinning))을 사용하여 중간자 공격(MITM: Man In The Middle)을 막으려는 노력으로 인해 안드로이드 앱내 HTTPS 데이터 패킷을 프록시 서버를 이용해 모니터링 하기가 쉽지가 않아졌다.

안드로이드는 앱자체에서 mitmproxy 막는거같다 그냥 웹으로 들어가서 확인해보면 잘되는데 앱에서 자체적으로 블락이 걸린다.

이슈가 해결될수도있으니 구독하셈 [https://github.com/mitmproxy/mitmproxy/issues/2054](https://github.com/mitmproxy/mitmproxy/issues/2054)
다른방법이 있나 확인후 업데이트 처리하겟음!
