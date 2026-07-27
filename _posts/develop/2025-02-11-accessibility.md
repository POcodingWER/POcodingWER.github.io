---
layout: post
title: "[DEVELOP] 예제로 이해하는 웹 접근성 (accessibility)"

subtitle: "예제로 보는 웹 접근성"

date: 2025-02-11 08:23:59
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/02/accessibility.webp"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - DEVELOP
tags:
  - accessibility
  - 웹 접근성
  - 웹 표준
  - 웹 표준 가이드
---

![alt text](/img/post/2025/02/accessibility.webp){: width="293" height="172"}

{% include post/develop_contents.md %}

## 📚 1장: 접근성 기본 이해하기

#### 1️⃣ 나쁜 웹사이트 vs 좋은 웹사이트

```html:example/bad-vs-good.html
<!-- 😱 접근성이 나쁜 예 -->
<div class="container">
  <div class="header">쇼핑몰</div>
  <div onclick="buyItem()" class="button" style="color: lightgray">
    <img src="cart.png"> 구매하기
  </div>
  <div class="small-text" style="font-size: 8px">
    상품 정보입니다
  </div>
</div>

<!-- 😊 접근성이 좋은 예 -->
<main>
  <h1>쇼핑몰</h1>
  <button
    onclick="buyItem()"
    aria-label="장바구니에 상품 담기"
    style="font-size: 16px">
    <img src="cart.png" alt="장바구니 아이콘">
    구매하기
  </button>
  <p style="font-size: 16px">
    상품 정보입니다
  </p>
</main>
```

#### 2️⃣ 접근성이 필요한 사용자들

1. **시각 장애**

```css
/* 저시력자를 위한 텍스트 스타일 */
.readable-text {
  /* 충분한 크기 */
  font-size: 16px;
  /* 높은 대비 */
  color: #000000;
  background-color: #ffffff;
  /* 가독성 좋은 폰트 */
  font-family: Arial, sans-serif;
  /* 적절한 줄간격 */
  line-height: 1.5;
}
```

2. **운동 장애**

```js
// 키보드 사용자를 위한 포커스 관리
const button = document.querySelector("button");

button.addEventListener("keydown", (event) => {
  // Enter 또는 Space 키로 버튼 활성화
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    button.click();
  }
});

// 포커스 표시를 위한 스타일
button.addEventListener("focus", () => {
  button.style.outline = "2px solid blue";
});
```

3. **청각 장애**

```html:example/audio.html
<!-- 영상에 자막 추가 -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <!-- 자막 제공 -->
  <track
    kind="captions"
    src="captions.vtt"
    srclang="ko"
    label="한국어 자막">
  <!-- 대체 텍스트 -->
  <p>이 영상은 상품 사용법을 설명합니다.</p>
</video>
```

#### 3️⃣ ARIA (Accessible Rich Internet Applications)

```html:example/aria.html
<!-- ARIA 레이블과 역할 사용 -->
<div
  role="alert"
  aria-live="polite"
  aria-label="알림 메시지">
  상품이 장바구니에 담겼습니다!
</div>

<button
  aria-expanded="false"
  aria-controls="menu-content">
  메뉴 펼치기
</button>

<div
  id="menu-content"
  role="menu"
  hidden>
  <div role="menuitem">상품 목록</div>
  <div role="menuitem">장바구니</div>
</div>
```

### 🌟 핵심 포인트

1. **접근성이란?**

   - 모든 사용자가 웹사이트를 이용할 수 있게 하는 것
   - 장애가 있는 사용자도 불편함 없이 사용

2. **주요 고려사항**

   - 의미있는 HTML 구조
   - 키보드 접근성
   - 충분한 색상 대비
   - 적절한 글자 크기
   - 대체 텍스트 제공

3. **도구 사용**
   - 스크린 리더 테스트
   - 키보드 탐색 테스트
   - 접근성 검사 도구

네! 2장 "의미있는 HTML 구조 만들기"를 설명해드리겠습니다!

## 📚 2장: 시맨틱 HTML (의미있는 HTML 구조)

#### 1️⃣ 기본 페이지 구조

```html:example/semantic-structure.html
<!-- 😱 나쁜 예: div 남용 -->
<div class="header">
  <div class="logo">로고</div>
  <div class="nav">
    <div class="nav-item">홈</div>
    <div class="nav-item">상품</div>
  </div>
</div>
<div class="main">
  <div class="title">환영합니다</div>
  <div class="content">내용...</div>
</div>
<div class="footer">푸터</div>

<!-- 😊 좋은 예: 시맨틱 태그 사용 -->
<header>
  <img src="logo.png" alt="회사 로고">
  <nav>
    <ul>
      <li><a href="/">홈</a></li>
      <li><a href="/products">상품</a></li>
    </ul>
  </nav>
</header>

<main>
  <h1>환영합니다</h1>
  <article>
    <h2>최신 상품</h2>
    <p>내용...</p>
  </article>
</main>

<footer>
  <p>저작권 © 2024</p>
</footer>
```

#### 2️⃣ 제목 구조 (Heading Structure)

```html:example/headings.html
<!-- 😱 나쁜 예: 잘못된 제목 구조 -->
<h1>웹사이트</h1>
<h3>첫 번째 섹션</h3>  <!-- h2를 건너뜀! -->
<h6>하위 섹션</h6>     <!-- 너무 급격한 레벨 변화 -->

<!-- 😊 좋은 예: 올바른 제목 구조 -->
<h1>웹사이트</h1>
<section>
  <h2>첫 번째 섹션</h2>
  <section>
    <h3>하위 섹션</h3>
    <p>내용...</p>
  </section>
</section>
```

#### 3️⃣ 목록과 탐색

```html:example/lists-navigation.html
<!-- 😱 나쁜 예: 의미 없는 구조 -->
<div class="menu">
  메뉴1
  메뉴2
  메뉴3
</div>

<!-- 😊 좋은 예: 시맨틱 목록 -->
<nav aria-label="메인 메뉴">
  <ul>
    <li><a href="#home">홈</a></li>
    <li><a href="#products">상품</a></li>
    <li><a href="#contact">연락처</a></li>
  </ul>
</nav>

<!-- 😊 정의 목록 사용 예 -->
<dl>
  <dt>상품명</dt>
  <dd>멋진 신발</dd>

  <dt>가격</dt>
  <dd>89,000원</dd>
</dl>
```

#### 4️⃣ 폼 구조

```html:example/forms.html
<!-- 😱 나쁜 예: 레이블 없는 폼 -->
<div class="form">
  <input type="text" placeholder="이름">
  <input type="email" placeholder="이메일">
  <div class="button">제출</div>
</div>

<!-- 😊 좋은 예: 접근성 있는 폼 -->
<form>
  <fieldset>
    <legend>회원 정보</legend>

    <div class="form-group">
      <label for="name">이름</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        aria-required="true">
    </div>

    <div class="form-group">
      <label for="email">이메일</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        aria-required="true">
    </div>

    <button type="submit">제출하기</button>
  </fieldset>
</form>
```

### 🌟 2장 핵심 포인트

1. **시맨틱 태그 사용하기**

   - `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
   - 의미에 맞는 태그 선택하기

2. **제목 레벨 지키기**

   - h1부터 순서대로 사용
   - 레벨 건너뛰기 금지

3. **목록 구조화**

   - `<ul>`, `<ol>`, `<dl>` 적절히 사용
   - 메뉴는 `<nav>` 안에 `<ul>` 사용

4. **폼 접근성**
   - 모든 입력창에 `<label>` 연결
   - `fieldset`과 `legend` 활용
   - 적절한 input type 사용

네! 3장 "키보드 접근성"을 설명해드리겠습니다! 키보드만으로도 웹사이트를 완벽하게 사용할 수 있게 만드는 방법을 알아볼게요.

## 📚 3장: 키보드 접근성

#### 1️⃣ 기본적인 키보드 탐색

```html:example/keyboard-navigation.html
<!-- 😱 나쁜 예: 키보드로 접근 불가능 -->
<div onclick="clickHandler()" class="button">
  클릭하세요
</div>

<!-- 😊 좋은 예: 키보드 접근 가능 -->
<button
  onclick="clickHandler()"
  tabindex="0">
  클릭하세요
</button>

<!-- 탭 순서 지정 예시 -->
<nav>
  <a href="/" tabindex="1">홈</a>
  <a href="/products" tabindex="2">제품</a>
  <a href="/contact" tabindex="3">연락처</a>
</nav>
```

#### 2️⃣ 포커스 관리

```js
// 모달 창 포커스 관리
class ModalFocus {
  constructor() {
    this.modal = document.querySelector(".modal");
    this.focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable =
      this.focusableElements[this.focusableElements.length - 1];
  }

  // 포커스 트랩 설정
  trapFocus(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    }
  }
}
```

#### 3️⃣ 키보드 단축키 구현

```js
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = {
      "Control+F": this.openSearch,
      "Control+H": this.goHome,
      Escape: this.closeModal,
    };

    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  handleKeyPress(event) {
    const key = this.getKeyCombo(event);

    if (this.shortcuts[key]) {
      event.preventDefault();
      this.shortcuts[key]();
    }
  }

  // 단축키 안내 표시
  showShortcutHelp() {
    return `
      <div class="shortcuts-help" role="dialog" aria-label="키보드 단축키 도움말">
        <h2>키보드 단축키</h2>
        <ul>
          <li>검색: Control + F</li>
          <li>홈으로: Control + H</li>
          <li>창 닫기: ESC</li>
        </ul>
      </div>
    `;
  }
}
```

#### 4️⃣ 스킵 네비게이션

```html:example/skip-navigation.html
<!-- 스킵 네비게이션 링크 -->
<div class="skip-links">
  <a href="#main-content" class="skip-link">
    메인 콘텐츠로 바로가기
  </a>
  <a href="#nav" class="skip-link">
    메뉴로 바로가기
  </a>
</div>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
  /* 포커스 받았을 때만 보이기 */
  &:focus {
    top: 0;
  }
}
</style>
```

#### 5️⃣ 포커스 스타일 커스터마이징

```css
/* 기본 포커스 스타일 */
:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* 마우스 사용자를 위한 포커스 스타일 숨기기 */
:focus:not(:focus-visible) {
  outline: none;
}

/* 키보드 사용자를 위한 포커스 스타일 */
:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
}

/* 특정 요소별 포커스 스타일 */
.custom-button:focus-visible {
  background-color: #e9ecef;
  border-color: #007bff;
  /* 애니메이션 효과 */
  transition: all 0.2s ease-in-out;
}
```

### 🌟 3장 핵심 포인트

1. **키보드 접근성 기본 규칙**

   - 모든 기능은 키보드로 사용 가능해야 함
   - 포커스 순서가 논리적이어야 함
   - 포커스 표시가 명확해야 함

2. **포커스 관리**

   - 모달창에서 포커스 트랩 구현
   - 적절한 tabindex 사용
   - 포커스 순서 최적화

3. **단축키 제공**

   - 주요 기능에 단축키 제공
   - 단축키 도움말 제공
   - 기존 브라우저 단축키와 충돌 방지

4. **스킵 네비게이션**
   - 반복되는 콘텐츠 건너뛰기
   - 주요 섹션으로 빠른 이동

네! 4장 "시각적 디자인과 접근성"을 설명해드리겠습니다! 모든 사용자가 편하게 볼 수 있는 디자인을 만드는 방법을 알아볼게요.

## 📚 4장: 시각적 디자인 접근성

#### 1️⃣ 색상 대비(Contrast)

```css
/* 😱 나쁜 예: 낮은 대비 */
.bad-contrast {
  color: #gray; /* 회색 텍스트 */
  background: #lightgray; /* 밝은 회색 배경 */
}

/* 😊 좋은 예: 충분한 대비 */
.good-contrast {
  /* 검정 텍스트 on 흰색 배경 (대비율 21:1) */
  color: #000000;
  background: #ffffff;
}

/* 링크 스타일 */
.accessible-link {
  /* 색상으로만 구분하지 않음 */
  color: #0066cc;
  text-decoration: underline;

  &:hover {
    color: #003366;
    text-decoration: none;
    border-bottom: 2px solid currentColor;
  }
}
```

#### 2️⃣ 글자 크기와 가독성

```css
/* 기본 타이포그래피 설정 */
:root {
  /* 기본 글자 크기 16px */
  font-size: 16px;
}

body {
  /* 가독성 좋은 폰트 스택 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, sans-serif;

  /* 줄 간격 */
  line-height: 1.5;

  /* 글자 간격 */
  letter-spacing: 0.02em;
}

/* 반응형 글자 크기 */
@media (max-width: 768px) {
  body {
    /* 모바일에서도 읽기 쉽게 */
    font-size: 1.1rem;
    line-height: 1.6;
  }
}

/* 큰 글자 모드 */
.large-text {
  font-size: 1.2rem;
  line-height: 1.8;
}
```

#### 3️⃣ 색맹을 위한 디자인

```css
/* 상태 표시에 색상과 아이콘 함께 사용 */
.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-success {
  color: #2e7d32;
  &::before {
    content: "✓";
  }
}

.status-error {
  color: #d32f2f;
  &::before {
    content: "✕";
  }
}

/* 차트나 그래프에서 패턴 사용 */
.chart-bar {
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}
```

#### 4️⃣ 동적 콘텐츠와 애니메이션

```css
/* 사용자 설정 존중 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 안전한 애니메이션 */
.safe-animation {
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
}

/* 깜빡임 주의 */
.flash-warning {
  animation: flash 1s;
  animation-iteration-count: 3;
}

/* 로딩 표시 */
.loading {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  &::after {
    content: " ";
    display: block;
    border-radius: 50%;
    border: 6px solid #000;
    border-color: #000 transparent;
    animation: loading 1.2s linear infinite;
  }
}
```

#### 5️⃣ 레이아웃과 여백

```css
/* 읽기 쉬운 레이아웃 */
.readable-layout {
  /* 최대 너비 제한 */
  max-width: 65ch;

  /* 여백 */
  padding: 1rem;
  margin: 0 auto;

  /* 단락 간격 */
  & > * + * {
    margin-top: 1.5em;
  }
}

/* 클릭/터치 영역 */
.clickable {
  /* 충분한 클릭 영역 */
  min-width: 44px;
  min-height: 44px;

  /* 터치 영역 간 간격 */
  margin: 0.5rem;

  /* 시각적 피드백 */
  &:active {
    transform: scale(0.98);
  }
}
```

### 🌟 4장 핵심 포인트

1. **색상 대비**

   - WCAG 기준 준수 (최소 4.5:1)
   - 색상만으로 정보 전달하지 않기
   - 링크는 밑줄 등으로 구분

2. **타이포그래피**

   - 충분한 글자 크기 (최소 16px)
   - 적절한 줄 간격
   - 가독성 좋은 폰트 선택

3. **색맹 고려**

   - 색상 외 다른 구분 방법 제공
   - 패턴/아이콘 활용
   - 색상 조합 테스트

4. **애니메이션**

   - 사용자 설정 존중
   - 과도한 움직임 피하기
   - 적절한 타이밍

5. **레이아웃**
   - 충분한 여백
   - 적절한 클릭 영역
   - 일관된 구조

## 📚 5장: 멀티미디어 접근성

#### 1️⃣ 이미지 접근성

```html:example/image-accessibility.html
<!-- 😱 나쁜 예: alt 없는 이미지 -->
<img src="logo.png">

<!-- 😊 좋은 예: 의미있는 대체 텍스트 -->
<img
  src="logo.png"
  alt="회사 로고 - 파란 나비 디자인"
>

<!-- 장식용 이미지 -->
<img
  src="decoration.png"
  alt=""
  role="presentation"
>

<!-- 복잡한 이미지 (차트/그래프) -->
<figure>
  <img
    src="sales-chart.png"
    alt="2023년 분기별 매출 그래프"
  >
  <figcaption>
    2023년 매출은 1분기 100만원, 2분기 150만원,
    3분기 200만원, 4분기 250만원으로 꾸준히 증가
  </figcaption>
</figure>
```

#### 2️⃣ 비디오 접근성

```html:example/video-accessibility.html
<!-- 자막과 설명이 있는 비디오 -->
<video controls>
  <source src="product-demo.mp4" type="video/mp4">

  <!-- 자막 트랙 -->
  <track
    kind="captions"
    src="captions.vtt"
    srclang="ko"
    label="한국어 자막"
    default
  >

  <!-- 오디오 설명 트랙 -->
  <track
    kind="descriptions"
    src="descriptions.vtt"
    srclang="ko"
    label="화면 해설"
  >

  <!-- 대체 텍스트 -->
  <p>
    이 비디오는 제품의 주요 기능을 설명합니다.
    텍스트 버전은 <a href="transcript.html">여기</a>에서
    확인하실 수 있습니다.
  </p>
</video>
```

#### 3️⃣ 오디오 접근성

```html:example/audio-accessibility.html
<!-- 오디오 콘텐츠 -->
<figure>
  <audio controls>
    <source src="podcast.mp3" type="audio/mpeg">
    <source src="podcast.ogg" type="audio/ogg">

    <!-- 대체 콘텐츠 -->
    <p>
      브라우저가 오디오를 지원하지 않습니다.
      <a href="podcast.mp3">오디오 파일 다운로드</a>
    </p>
  </audio>

  <!-- 대본 제공 -->
  <details>
    <summary>대본 보기</summary>
    <div class="transcript">
      안녕하세요, 오늘의 팟캐스트에서는...
    </div>
  </details>
</figure>
```

#### 4️⃣ 미디어 컨트롤

```js
class AccessibleMediaPlayer {
  constructor(mediaElement) {
    this.media = mediaElement;
    this.initializeControls();
  }

  initializeControls() {
    const controls = `
      <div class="media-controls" role="region"
           aria-label="미디어 컨트롤">
        <button
          class="play-pause"
          aria-label="재생"
          onclick="this.togglePlay()">
          ▶
        </button>

        <div class="volume-control">
          <button
            aria-label="음량 조절"
            onclick="this.toggleMute()">
            🔊
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value="100"
            aria-label="음량"
            onchange="this.setVolume(this.value)">
        </div>

        <div class="progress-bar" role="slider"
             aria-label="재생 진행률">
          <!-- 진행바 구현 -->
        </div>
      </div>
    `;

    // 컨트롤 추가
    this.media.insertAdjacentHTML("afterend", controls);
  }
}
```

#### 5️⃣ 자동 재생 제어

```js
class AutoplayManager {
  constructor() {
    this.checkUserPreferences();
  }

  checkUserPreferences() {
    // 시스템 설정 확인
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // 자동 재생 설정
    this.shouldAutoplay = !reducedMotion.matches;

    // 사용자 설정 저장값 확인
    const savedPreference = localStorage.getItem("autoplay");
    if (savedPreference !== null) {
      this.shouldAutoplay = savedPreference === "true";
    }
  }

  // 자동 재생 설정 UI
  createPreferenceUI() {
    return `
      <div class="autoplay-settings">
        <label>
          <input
            type="checkbox"
            ${this.shouldAutoplay ? "checked" : ""}
            onchange="this.updateAutoplayPreference(this.checked)">
          비디오 자동 재생
        </label>
        <p class="help-text">
          자동 재생을 끄면 배터리 사용량을 줄일 수 있습니다.
        </p>
      </div>
    `;
  }
}
```

### 🌟 5장 핵심 포인트

1. **이미지 접근성**

   - 모든 의미있는 이미지에 alt 텍스트 제공
   - 복잡한 이미지는 자세한 설명 추가
   - 장식용 이미지는 alt=""

2. **비디오 접근성**

   - 자막 필수 제공
   - 오디오 설명 추가
   - 대본 제공

3. **오디오 접근성**

   - 대본이나 텍스트 버전 제공
   - 명확한 컨트롤
   - 음량 조절 가능

4. **미디어 컨트롤**

   - 키보드로 조작 가능
   - 충분히 큰 컨트롤 버튼
   - 명확한 레이블

5. **자동 재생**
   - 사용자 설정 존중
   - 쉽게 끄고 켤 수 있는 옵션
   - 시스템 설정 반영

네! 마지막 6장 "접근성 테스트와 평가"를 설명해드리겠습니다! 우리가 만든 웹사이트가 정말 접근성이 좋은지 확인하는 방법을 알아볼게요.

## 📚 6장: 접근성 테스트와 평가

#### 1️⃣ 자동화된 테스트

```js
// Jest와 Axe-core를 사용한 접근성 테스트
describe("접근성 테스트", () => {
  it("메인 페이지 접근성 검사", async () => {
    // 페이지 로드
    document.body.innerHTML = `
      <main>
        <h1>웹사이트 제목</h1>
        <nav>
          <ul>
            <li><a href="/">홈</a></li>
          </ul>
        </nav>
      </main>
    `;

    // axe-core로 검사
    const results = await axe.run(document.body);
    expect(results.violations).toHaveLength(0);
  });
});

// Lighthouse CI 설정
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.9 }],
      },
    },
  },
};
```

#### 2️⃣ 수동 테스트 체크리스트

```html:example/manual-checklist.html
<div class="accessibility-checklist">
  <h2>접근성 체크리스트</h2>

  <!-- 키보드 탐색 -->
  <section>
    <h3>키보드 접근성</h3>
    <ul>
      <li>
        <label>
          <input type="checkbox">
          모든 기능을 키보드로 사용할 수 있나요?
        </label>
      </li>
      <li>
        <label>
          <input type="checkbox">
          포커스가 시각적으로 명확한가요?
        </label>
      </li>
      <li>
        <label>
          <input type="checkbox">
          포커스 순서가 논리적인가요?
        </label>
      </li>
    </ul>
  </section>

  <!-- 스크린리더 -->
  <section>
    <h3>스크린리더 호환성</h3>
    <ul>
      <li>
        <label>
          <input type="checkbox">
          모든 이미지에 대체 텍스트가 있나요?
        </label>
      </li>
      <li>
        <label>
          <input type="checkbox">
          제목 구조가 올바른가요?
        </label>
      </li>
    </ul>
  </section>
</div>
```

#### 3️⃣ 사용자 테스트

```js
class AccessibilityUserTest {
  constructor() {
    this.tasks = [
      {
        id: 1,
        title: "회원가입 완료하기",
        steps: ["홈페이지 접속", "회원가입 버튼 찾기", "양식 작성", "제출하기"],
        success_criteria: "계정이 성공적으로 생성됨",
      },
      {
        id: 2,
        title: "상품 검색하고 장바구니에 담기",
        steps: ["검색창 찾기", "검색어 입력", "상품 선택", "장바구니 담기"],
        success_criteria: "상품이 장바구니에 추가됨",
      },
    ];
  }

  // 테스트 결과 기록
  recordTestResult(taskId, user, success, feedback) {
    return {
      taskId,
      user,
      timestamp: new Date(),
      success,
      feedback,
      device: {
        screenReader: user.usesScreenReader,
        browser: user.browser,
        assistiveTech: user.assistiveTechnology,
      },
    };
  }
}
```

#### 4️⃣ 모니터링과 보고

```js
class AccessibilityMonitor {
  constructor() {
    this.metrics = {
      automated: {
        lighthouse: null,
        axeCore: null,
      },
      manual: {
        keyboardTests: [],
        screenReaderTests: [],
      },
      userFeedback: [],
    };
  }

  // 접근성 보고서 생성
  generateReport() {
    return {
      summary: this.generateSummary(),
      details: this.metrics,
      recommendations: this.generateRecommendations(),
      timestamp: new Date(),
    };
  }

  // 개선 추천사항 생성
  generateRecommendations() {
    const issues = this.analyzeIssues();
    return issues.map((issue) => ({
      priority: issue.severity,
      description: issue.description,
      howToFix: issue.solution,
      wcagCriteria: issue.wcagReference,
    }));
  }

  // 대시보드 UI
  createDashboard() {
    return `
      <div class="accessibility-dashboard">
        <h2>접근성 현황</h2>

        <div class="score-overview">
          <div class="score">
            <h3>전체 점수</h3>
            <div class="big-number">${this.calculateOverallScore()}%</div>
          </div>
        </div>

        <div class="issues-summary">
          <h3>주요 이슈</h3>
          <ul>
            ${this.getTopIssues()
              .map(
                (issue) => `
              <li class="issue-item ${issue.severity}">
                ${issue.description}
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      </div>
    `;
  }
}
```

### 🌟 6장 핵심 포인트

1. **자동화된 테스트**

   - Lighthouse 사용
   - axe-core 통합
   - CI/CD 파이프라인에 포함

2. **수동 테스트**

   - 체크리스트 작성
   - 키보드 테스트
   - 스크린리더 테스트

3. **사용자 테스트**

   - 다양한 사용자 그룹 포함
   - 실제 시나리오 테스트
   - 피드백 수집

4. **지속적인 모니터링**
   - 정기적인 검사
   - 이슈 추적
   - 개선사항 기록

## 🎯 마무리!! 웹 접근성의 핵심 포인트

1. **모두가 사용할 수 있게**

   - 키보드로도 사용 가능하게
   - 스크린리더 지원
   - 글자 크기/색상 조절 가능

2. **의미있는 HTML 구조**

   - 시맨틱 태그 사용
   - 제목 순서 지키기
   - alt 텍스트 제공

3. **보기 편한 디자인**

   - 충분한 색상 대비
   - 읽기 쉬운 글자 크기
   - 여백과 간격 충분히

4. **멀티미디어 지원**
   - 이미지에 설명 추가
   - 영상에 자막 제공
   - 소리에 대체 텍스트

쉽게 말해서 "모든 사람이 불편함 없이 사용할 수 있게 만들자!" 라는 마인드로 개발하면 됩니다! 👍
