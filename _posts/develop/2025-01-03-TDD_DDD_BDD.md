---
layout: post
title: "[DEVELOP]  DDD, TDD, BDD"

subtitle: " DDD, TDD, BDD에 대해 이해해 보자"

date: 2025-01-03 08:02:35
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/01/tdd_ddd_bdd.jpg"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - DEVELOP
tags:
  - DDD
  - TDD
  - BDD
---

{% include post/develop_contents.md %}

## DDD (Domain Driven Design, 도메인 주도 설계)

### DDD란?

비즈니스 도메인(업무 영역)을 중심으로 설계하는 개발 방법론입니다. 쉽게 말해서, "실제 업무를 하는 사람들의 언어와 관점으로 시스템을 설계하는 것"입니다.

[도메인이 헷갈린다면?](/front/2025/01/03/url_domain/)

### 실생활 예시로 이해하기

쇼핑몰을 만든다고 가정해보겠습니다:

1. **전통적인 방식**

   - 데이터베이스 중심: 상품테이블, 주문테이블, 회원테이블...
   - 기술 중심적 용어 사용

2. **DDD 방식**
   - 비즈니스 중심: 상품(Product), 장바구니(Cart), 주문(Order)...
   - 실제 쇼핑몰 운영자가 사용하는 용어 사용

### 주요 구성요소

1. **유비쿼터스 언어(Ubiquitous Language)**

   - 개발자와 실무자가 같은 용어를 사용
   - 예: "장바구니에 담기" (개발자와 고객 모두 이해 가능)

2. **바운디드 컨텍스트(Bounded Context)**

   - 각 도메인의 경계를 명확히 구분
   - 예: 상품관리, 주문관리, 배송관리는 서로 다른 컨텍스트

3. **도메인 모델(Domain Model)**
   - 비즈니스 규칙과 로직을 담은 객체
   - 예: 상품(Product)은 재고(stock)가 0이면 주문 불가

### 장점

- 비즈니스 요구사항을 더 정확하게 구현
- 실무자와 개발자 간 소통이 원활
- 시스템 확장과 유지보수가 쉬움

### 단점

- 초기 설계에 많은 시간이 필요
- 도메인에 대한 깊은 이해가 필요
- 작은 프로젝트에는 과할 수 있음

### 적합한 상황

- 복잡한 비즈니스 로직이 있는 프로젝트
- 장기적으로 발전할 대규모 프로젝트
- 도메인 전문가와 긴밀한 협업이 가능한 환경

## TDD (Test Driven Development, 테스트 주도 개발)

### TDD란?

테스트 주도 개발(TDD)은 실제 코드를 작성하기 전에 테스트 코드를 먼저 작성하는 개발 방법론입니다. 쉽게 말해서, "계획을 먼저 세우고 집을 짓는 것"과 비슷한 개념이라고 할 수 있습니다.

### 진행 방식

1. **Red** (실패하는 테스트 작성)

   - 원하는 기능에 대한 테스트를 먼저 작성합니다
   - 당연히 아직 기능이 없으므로 테스트는 실패합니다

2. **Green** (테스트 통과하는 코드 작성)

   - 테스트를 통과할 수 있는 최소한의 코드를 작성합니다
   - 이때는 코드의 품질보다 테스트 통과가 우선입니다

3. **Refactor** (코드 개선)
   - 중복을 제거하고 코드를 깔끔하게 정리합니다
   - 테스트가 여전히 통과하는지 확인합니다

### 실생활 예시로 이해하기

마치 요리 레시피를 만드는 것과 비슷합니다:

1. 먼저 "이 음식은 이런 맛이어야 해"라고 기준을 정합니다 (테스트 작성)
2. 실제로 요리를 만듭니다 (코드 작성)
3. 맛을 보고 기준에 맞는지 확인합니다 (테스트 실행)
4. 필요하다면 레시피를 개선합니다 (리팩토링)

### 장점

- 버그를 미리 발견할 수 있습니다
- 코드에 대한 자신감이 생깁니다
- 코드의 품질이 향상됩니다
- 나중에 코드를 수정하기 쉬워집니다

### 단점

- 처음에는 개발 속도가 느립니다
- 테스트 작성에 시간이 추가로 필요합니다
- 팀 전체가 TDD를 이해하고 있어야 합니다

### 적합한 상황

- 장기적으로 유지보수가 필요한 프로젝트
- 품질이 중요한 프로젝트
- 버그가 치명적인 영향을 미치는 프로젝트

## BDD (Behavior Driven Development, 행동 주도 개발)

### BDD란?

사용자의 행동을 중심으로 개발하는 방법론입니다. "사용자가 이렇게 행동할 때 이런 일이 벌어져야 해"라는 시나리오를 먼저 작성하고 개발합니다.

### 실생활 예시

넷플릭스 앱의 "영화 재생" 기능:

```text
시나리오: 사용자가 영화를 재생할 때
Given (전제조건)
  - 사용자가 로그인되어 있고
  - 구독이 유효하고
  - 인터넷이 연결되어 있다면

When (행동)
  - 사용자가 재생 버튼을 클릭했을 때

Then (결과)
  - 영화가 재생되어야 하고
  - 화질은 인터넷 속도에 맞게 조절되고
  - 시청 기록이 저장되어야 함
```

### TDD와의 차이점

1. **TDD**: 개발자 관점의 테스트 (코드 레벨)
2. **BDD**: 사용자 관점의 테스트 (행동 레벨)

### 장점

- 비개발자도 이해하기 쉬움
- 요구사항을 놓치지 않음
- 테스트가 문서 역할을 함
- 팀 간 소통이 원활

### 단점

- 시나리오 작성에 시간이 많이 듦
- 모든 상황을 시나리오로 작성하기 어려움
- 팀원 모두가 BDD를 이해해야 함

## 결론

- **DDD**: 비즈니스 도메인 중심의 설계로 실무에 가까운 개발

  - 예: 도메인별로 서버 분리
    > [음악 스트리밍 서비스]
    >
    > 1.  재생 도메인 서버 (play-service)
    >
    > - 주소: play.music.com
    > - 기능: 음악 재생, 일시정지, 다음곡
    > - 독립적인 DB: 재생 이력, 현재 재생목록
    >
    > 2.  플레이리스트 도메인 서버 (playlist-service)
    >
    > - 주소: playlist.music.com
    > - 기능: 플레이리스트 CRUD
    > - 독립적인 DB: 플레이리스트 정보
    >
    > 3.  결제 도메인 서버 (payment-service)
    >
    > - 주소: payment.music.com
    > - 기능: 결제, 구독 관리
    > - 독립적인 DB: 결제 내역, 구독 정보

- **TDD**: 테스트를 먼저 작성하여 안정적인 코드 개발
  - 예: 블록체인 스마트컨트렉트 테스트 코드작성 (코드 하나하나 작성함 )
- **BDD**: 사용자 행동 중심의 개발로 요구사항 정확히 구현

TDD 예시 (개발자 관점)

```javascript
// 로그인 함수 테스트
describe("login 함수", () => {
  test("비밀번호가 8자리 미만이면 에러를 반환한다", () => {
    const result = validatePassword("123");
    expect(result).toBe(false);
  });

  test("이메일 형식이 아니면 에러를 반환한다", () => {
    const result = validateEmail("wrongemail");
    expect(result).toBe(false);
  });
});
```

BDD 예시 (사용자 관점)

```javascript
// 로그인 기능 테스트
describe("로그인 페이지에서", () => {
  it("사용자가 올바르지 않은 비밀번호를 입력하면", () => {
    // Given (상황)
    const loginPage = new LoginPage();

    // When (행동)
    loginPage.enterEmail("user@test.com");
    loginPage.enterPassword("123");
    loginPage.clickLoginButton();

    // Then (결과)
    expect(loginPage).toShowError("비밀번호는 8자리 이상이어야 합니다");
    expect(loginPage).toStayOnLoginPage();
  });
});
```

주요 차이점:

1. **관점의 차이**

   - TDD: 함수가 제대로 작동하는가?
   - BDD: 사용자가 이 기능을 사용할 때 어떻게 동작해야 하는가?

2. **언어의 차이**

   - TDD: validatePassword, expect(result).toBe(false)
   - BDD: "사용자가 로그인할 때", "에러 메시지가 보여야 한다"

3. **테스트 범위**
   - TDD: 개별 함수/메소드 단위
   - BDD: 전체적인 기능/시나리오 단위

즉, BDD는 TDD의 개념을 사용자 경험 중심으로 확장한 것이라고 볼 수 있습니다!
