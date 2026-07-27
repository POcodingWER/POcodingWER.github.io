---
layout: post
title: "[DEVELOP] 반응형 디자인 이해하기 (Responsive Design)"

subtitle: "예제로 보는 반응형 디자인 사용법"

date: 2025-02-13 08:20:12
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/02/images.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - DEVELOP
tags:
  - responsive design
  - responsive design 이해
  - 반응형 디자인
  - 모바일 디자인
  - 데스크톱 디자인
  - 프레임워크
---

{% include post/develop_contents.md %}

![alt text](/img/post/2025/02/images.png){: width="735" height="500"}

## 📚 1장: 반응형 디자인 기초

#### 1️⃣ 뷰포트 설정

```html:example/viewport.html
<!-- 기본 뷰포트 설정 -->
<meta name="viewport"
      content="width=device-width,
               initial-scale=1,
               viewport-fit=cover">

<style>
/* 안전 영역 고려 (노치 디자인 등) */
.container {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 기본 반응형 컨테이너 */
.responsive-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
```

#### 2️⃣ 유동적 단위 사용

```css
:root {
  /* 기본 폰트 크기 설정 */
  font-size: 16px;
}

.fluid-text {
  /* rem: 루트 요소 기준 */
  font-size: 1.5rem;

  /* em: 부모 요소 기준 */
  margin-bottom: 1.5em;

  /* vw: 뷰포트 너비 기준 */
  font-size: calc(16px + 2vw);
}

.fluid-container {
  /* % : 부모 기준 비율 */
  width: 90%;
  max-width: 1200px;

  /* vw, vh: 뷰포트 기준 */
  min-height: 50vh;
  padding: 5vw;
}

/* clamp(): 최소, 선호, 최대 값 설정 */
.fluid-title {
  font-size: clamp(1.5rem, 5vw, 3rem);
  line-height: 1.2;
}
```

#### 3️⃣ 기본 미디어 쿼리

```css
/* 모바일 우선 접근법 */
.container {
  width: 100%;
  padding: 1rem;
}

/* 태블릿 */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }

  .title {
    font-size: 2rem;
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .title {
    font-size: 2.5rem;
  }
}

/* 다크 모드 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #121212;
    --text-color: #ffffff;
  }
}

/* 저전력 모드 */
@media (prefers-reduced-motion) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

#### 4️⃣ 기본 그리드 시스템

```css
.grid {
  /* 기본 그리드 설정 */
  display: grid;
  gap: 1rem;

  /* 자동 열 생성 */
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
}

/* 반응형 그리드 아이템 */
.grid-item {
  padding: 1rem;
  background: var(--item-bg);
  border-radius: 8px;

  /* 카드 비율 유지 */
  aspect-ratio: 16 / 9;

  /* 내용 정렬 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 그리드 영역 설정 */
@media (min-width: 768px) {
  .featured {
    grid-column: span 2;
    grid-row: span 2;
  }
}
```

### 🌟 1장 핵심 포인트

1. **뷰포트 기본**

   - 적절한 메타 태그 설정
   - 안전 영역 고려
   - 기기별 특성 이해

2. **유동적 단위**

   - rem/em 사용
   - vw/vh 활용
   - clamp() 함수

3. **미디어 쿼리**

   - 모바일 우선 접근
   - 주요 중단점 설정
   - 사용자 선호도 반영

4. **그리드 시스템**
   - 유연한 그리드
   - 자동 배치
   - 반응형 조정

## 📚 2장: 미디어 쿼리와 중단점

#### 1️⃣ 현대적인 미디어 쿼리

```css
/* 컨테이너 쿼리 */
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 1rem;
  }
}

/* 특성 쿼리 */
@media (hover: hover) {
  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

/* 디스플레이 특성 */
@media (dynamic-range: high) {
  .hero-image {
    display: hdr-image;
  }
}

/* 중첩 미디어 쿼리 */
@media (min-width: 768px) {
  @media (pointer: fine) {
    .menu-item {
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }
}
```

#### 2️⃣ 스마트한 중단점

```scss:example/breakpoints.scss
// 중단점 변수
$breakpoints: (
  'small': 320px,
  'medium': 768px,
  'large': 1024px,
  'xlarge': 1440px
);

// 믹스인 생성
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "Unknown breakpoint: #{$breakpoint}";
  }
}

// 사용 예시
.container {
  padding: 1rem;

  @include respond-to('medium') {
    padding: 2rem;
    max-width: 80%;
  }

  @include respond-to('large') {
    max-width: 1200px;
    margin: 0 auto;
  }
}

// 범위 쿼리
@mixin between($min, $max) {
  @media (min-width: map-get($breakpoints, $min)) and
         (max-width: map-get($breakpoints, $max)) {
    @content;
  }
}
```

#### 3️⃣ 고급 미디어 특성

```css
/* 화면 방향 */
@media (orientation: landscape) {
  .gallery {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 디스플레이 모드 */
@media (display-mode: fullscreen) {
  .nav-bar {
    display: none;
  }
}

/* 색상 구성 */
@media (color-gamut: p3) {
  :root {
    --brand-color: color(display-p3 0 0.5 1);
  }
}

/* 프린트 스타일 */
@media print {
  .no-print {
    display: none;
  }

  body {
    font-size: 12pt;
    line-height: 1.5;
  }

  a[href]::after {
    content: " (" attr(href) ")";
  }
}

/* 사용자 선호도 */
@media (prefers-reduced-transparency) {
  .glass-effect {
    backdrop-filter: none;
    background: var(--solid-bg);
  }
}
```

#### 4️⃣ 성능 최적화

```js
class MediaQueryOptimizer {
  constructor() {
    this.queries = new Map();
    this.setupPerformanceObserver();
  }

  // 미디어 쿼리 리스너 최적화
  optimizeListener(query, callback) {
    const mql = window.matchMedia(query);

    // 디바운스된 콜백
    const debouncedCallback = this.debounce(() => {
      callback(mql.matches);
    }, 150);

    // 리스너 등록
    mql.addListener(debouncedCallback);

    // 초기 상태 확인
    callback(mql.matches);

    return () => mql.removeListener(debouncedCallback);
  }

  // 성능 모니터링
  setupPerformanceObserver() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "layout-shift") {
          this.handleLayoutShift(entry);
        }
      }
    });

    observer.observe({ entryTypes: ["layout-shift"] });
  }

  // 레이아웃 변경 처리
  handleLayoutShift(entry) {
    if (entry.value > 0.1) {
      console.warn("Significant layout shift detected", {
        value: entry.value,
        elements: entry.sources,
      });
    }
  }
}
```

### 🌟 2장 핵심 포인트

1. **현대적 미디어 쿼리**

   - 컨테이너 쿼리
   - 특성 쿼리
   - 중첩 쿼리

2. **스마트한 중단점**

   - 의미있는 이름
   - 재사용 가능한 믹스인
   - 범위 쿼리

3. **고급 특성**

   - 화면 방향
   - 디스플레이 모드
   - 사용자 선호도

4. **성능 최적화**
   - 효율적인 리스너
   - 레이아웃 변경 감지
   - 디바운싱

## 📚 3장: 반응형 레이아웃 패턴

#### 1️⃣ 모던 CSS 그리드

```css
/* 자동 조절 그리드 */
.auto-grid {
  display: grid;
  gap: 1.5rem;

  /* 자동 맞춤 열 */
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
}

/* 영역 기반 레이아웃 */
.page-layout {
  display: grid;
  gap: 1rem;
  grid-template-areas:
    "header"
    "nav"
    "main"
    "sidebar"
    "footer";

  @media (min-width: 768px) {
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header  header"
      "nav     main"
      "sidebar main"
      "footer  footer";
  }
}

/* 그리드 아이템 배치 */
.header {
  grid-area: header;
}
.nav {
  grid-area: nav;
}
.main {
  grid-area: main;
}
.sidebar {
  grid-area: sidebar;
}
.footer {
  grid-area: footer;
}
```

#### 2️⃣ 플렉스박스 패턴

```css
/* 카드 래퍼 */
.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  /* 카드 크기 조절 */
  & > * {
    flex: 1 1 300px;
    max-width: calc(50% - 0.5rem);

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }
}

/* 스택/행 전환 */
.stack-row {
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

/* 중앙 정렬 히어로 */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;

  .content {
    max-width: 65ch;
  }
}

/* 사이드바 레이아웃 */
.sidebar-layout {
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  .sidebar {
    flex: 0 0 250px;
  }

  .content {
    flex: 1;
    min-width: 0; /* 오버플로우 방지 */
  }
}
```

#### 3️⃣ 복합 레이아웃 패턴

```css
/* 매거진 스타일 레이아웃 */
.magazine-layout {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(6, 1fr);

  .featured {
    grid-column: span 6;

    @media (min-width: 768px) {
      grid-column: span 4;
    }
  }

  .article {
    grid-column: span 6;

    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }
}

/* 마스터-디테일 패턴 */
.master-detail {
  display: grid;
  height: 100vh;

  @media (min-width: 768px) {
    grid-template-columns: 300px 1fr;
  }

  .master {
    overflow-y: auto;
    border-right: 1px solid var(--border-color);
  }

  .detail {
    overflow-y: auto;
    padding: 2rem;
  }
}

/* 홀리 그레일 레이아웃 */
.holy-grail {
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;

  @media (min-width: 768px) {
    grid-template-columns: 200px 1fr 200px;
    grid-template-areas:
      "header header header"
      "nav    main   aside"
      "footer footer footer";
  }
}
```

#### 4️⃣ 반응형 컴포넌트

```css
/* 반응형 내비게이션 */
.nav {
  --nav-height: 60px;

  @media (max-width: 768px) {
    .nav-links {
      position: fixed;
      top: var(--nav-height);
      left: 0;
      right: 0;
      background: var(--bg-color);
      transform: translateY(-100%);
      transition: transform 0.3s ease;

      &.active {
        transform: translateY(0);
      }
    }
  }
}

/* 반응형 테이블 */
.responsive-table {
  @media (max-width: 768px) {
    thead {
      display: none;
    }

    tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid var(--border-color);
    }

    td {
      display: grid;
      grid-template-columns: 120px 1fr;
      padding: 0.5rem;

      &::before {
        content: attr(data-label);
        font-weight: bold;
      }
    }
  }
}
```

### 🌟 3장 핵심 포인트

1. **그리드 시스템**

   - 자동 조절 그리드
   - 영역 기반 레이아웃
   - 복합 그리드 패턴

2. **플렉스박스 활용**

   - 유연한 카드 레이아웃
   - 스택/행 전환
   - 사이드바 패턴

3. **복합 레이아웃**

   - 매거진 스타일
   - 마스터-디테일
   - 홀리 그레일

4. **반응형 컴포넌트**
   - 내비게이션
   - 테이블
   - 카드

## 📚 4장: 반응형 타이포그래피와 이미지

#### 1️⃣ 반응형 타이포그래피

```css
/* 기본 타이포그래피 설정 */
:root {
  /* 기본 폰트 크기 */
  font-size: clamp(16px, 1vw + 16px, 20px);

  /* 타입 스케일 */
  --scale-ratio: 1.25;
  --h1: calc(var(--h2) * var(--scale-ratio));
  --h2: calc(var(--h3) * var(--scale-ratio));
  --h3: calc(var(--h4) * var(--scale-ratio));
  --h4: calc(var(--h5) * var(--scale-ratio));
  --h5: calc(var(--h6) * var(--scale-ratio));
  --h6: 1rem;
}

/* 유동적 제목 크기 */
h1 {
  font-size: var(--h1);
}
h2 {
  font-size: var(--h2);
}
h3 {
  font-size: var(--h3);
}
h4 {
  font-size: var(--h4);
}
h5 {
  font-size: var(--h5);
}
h6 {
  font-size: var(--h6);
}

/* 본문 텍스트 최적화 */
.content {
  /* 가독성 최적화 */
  max-width: 65ch;
  line-height: 1.6;

  /* 유동적 여백 */
  padding: clamp(1rem, 5vw, 3rem);

  /* 단락 간격 */
  p + p {
    margin-top: 1.5em;
  }
}
```

#### 2️⃣ 반응형 이미지

```html:example/responsive-images.html
<!-- 기본 반응형 이미지 -->
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w"
  sizes="
    (max-width: 400px) 100vw,
    (max-width: 800px) 80vw,
    1200px"
  alt="설명"
  loading="lazy"
>

<!-- 아트 디렉션 -->
<picture>
  <!-- 모바일용 세로 이미지 -->
  <source
    media="(max-width: 767px)"
    srcset="mobile.jpg">

  <!-- 태블릿용 이미지 -->
  <source
    media="(max-width: 1024px)"
    srcset="tablet.jpg">

  <!-- 데스크톱용 이미지 -->
  <img
    src="desktop.jpg"
    alt="설명">
</picture>

<style>
.responsive-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}
</style>
```

#### 3️⃣ 배경 이미지 최적화

```css
/* 반응형 배경 이미지 */
.hero {
  min-height: 60vh;
  background-image: url("mobile.jpg");
  background-size: cover;
  background-position: center;

  /* 태블릿 */
  @media (min-width: 768px) {
    background-image: url("tablet.jpg");
  }

  /* 데스크톱 */
  @media (min-width: 1024px) {
    background-image: url("desktop.jpg");
  }

  /* 레티나 디스플레이 */
  @media (min-resolution: 2dppx) {
    background-image: url("desktop@2x.jpg");
  }
}

/* 다중 배경 */
.parallax-section {
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("background.jpg");
  background-attachment: fixed;
  background-size: cover;

  @media (hover: none) {
    /* 모바일에서는 parallax 비활성화 */
    background-attachment: scroll;
  }
}
```

#### 4️⃣ SVG 최적화

```html:example/svg-optimization.html
<!-- 반응형 SVG -->
<svg
  viewBox="0 0 100 100"
  class="responsive-icon"
>
  <!-- SVG 내용 -->
</svg>

<style>
.responsive-icon {
  width: clamp(2rem, 5vw, 4rem);
  height: auto;
  fill: currentColor;
}

/* SVG 스프라이트 */
.icon-system {
  display: none; /* 스프라이트 숨기기 */
}

.icon {
  width: 24px;
  height: 24px;

  @media (min-width: 768px) {
    width: 32px;
    height: 32px;
  }
}

/* SVG 애니메이션 */
.animated-icon {
  transform-origin: center;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  @media (prefers-reduced-motion) {
    transition: none;
  }
}
</style>
```

### 🌟 4장 핵심 포인트

1. **반응형 타이포그래피**

   - 유동적 폰트 크기
   - 타입 스케일
   - 가독성 최적화

2. **반응형 이미지**

   - srcset과 sizes
   - 아트 디렉션
   - 지연 로딩

3. **배경 이미지**

   - 미디어 쿼리 활용
   - 레티나 대응
   - 다중 배경

4. **SVG 최적화**
   - 반응형 아이콘
   - 스프라이트 시스템
   - 접근성 고려

## 📚 5장: 반응형 사용자 경험

#### 1️⃣ 테마 시스템

```css
/* 테마 변수 정의 */
:root {
  /* 라이트 모드 기본값 */
  --bg-primary: #ffffff;
  --text-primary: #333333;
  --accent-color: #0066cc;
}

/* 다크 모드 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #121212;
    --text-primary: #ffffff;
    --accent-color: #66b3ff;
  }
}

/* 테마 전환 애니메이션 */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;

  @media (prefers-reduced-motion) {
    transition: none;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --accent-color: #0000ff;
  }
}
```

#### 2️⃣ 접근성 최적화

```html:example/accessibility.html
<!-- 접근성 고려한 내비게이션 -->
<nav role="navigation" aria-label="메인 메뉴">
  <button
    class="menu-toggle"
    aria-expanded="false"
    aria-controls="main-menu">
    <span class="sr-only">메뉴</span>
    <span class="icon"></span>
  </button>

  <ul id="main-menu" class="nav-menu">
    <!-- 메뉴 아이템 -->
  </ul>
</nav>

<style>
/* 키보드 포커스 스타일 */
:focus-visible {
  outline: 3px solid var(--accent-color);
  outline-offset: 2px;
}

/* 스킵 내비게이션 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: var(--accent-color);
  color: white;
  z-index: 100;

  &:focus {
    top: 0;
  }
}

/* 보조 기술용 숨김 텍스트 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
```

#### 3️⃣ 상호작용 패턴

```css
/* 터치 최적화 */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;

  @media (pointer: fine) {
    min-width: 32px;
    min-height: 32px;
    padding: 8px;
  }
}

/* 호버 효과 */
.card {
  transition: transform 0.2s;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
    }
  }
}

/* 제스처 인터랙션 */
.swipeable {
  touch-action: pan-y pinch-zoom;
  user-select: none;

  @media (pointer: coarse) {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }
}
```

#### 4️⃣ UI 패턴 최적화

```js
class ResponsiveUI {
  constructor() {
    this.setupIntersectionObserver();
    this.setupResizeObserver();
    this.initializePatterns();
  }

  // 지연 로딩 설정
  setupIntersectionObserver() {
    const options = {
      rootMargin: "50px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadContent(entry.target);
        }
      });
    }, options);

    document
      .querySelectorAll("[data-lazy]")
      .forEach((el) => observer.observe(el));
  }

  // 요소 크기 모니터링
  setupResizeObserver() {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.handleResize(entry);
      });
    });

    document
      .querySelectorAll("[data-responsive]")
      .forEach((el) => observer.observe(el));
  }

  // UI 패턴 초기화
  initializePatterns() {
    // 무한 스크롤
    this.initInfiniteScroll();

    // 반응형 모달
    this.initResponsiveModal();

    // 적응형 내비게이션
    this.initAdaptiveNav();
  }
}
```

### 🌟 5장 핵심 포인트

1. **테마 시스템**

   - 다크/라이트 모드
   - 색상 대비
   - 애니메이션 제어

2. **접근성**

   - ARIA 속성
   - 키보드 내비게이션
   - 스크린 리더 지원

3. **상호작용**

   - 터치 최적화
   - 호버 상태
   - 제스처 지원

4. **UI 패턴**
   - 지연 로딩
   - 반응형 컴포넌트
   - 성능 최적화

## 📚 6장: 고급 반응형 기법

#### 1️⃣ 국제화(i18n) 대응

```css
/* RTL(Right-to-Left) 지원 */
:root {
  --start: left;
  --end: right;
}

/* RTL 언어 지원 */
[dir="rtl"] {
  --start: right;
  --end: left;
}

.nav-item {
  margin-inline-start: 1rem;
  padding-inline-end: 1rem;
  border-inline-end: 1px solid var(--border-color);
}

/* 다국어 폰트 시스템 */
:lang(ko) {
  word-break: keep-all;
  line-height: 1.8;
}

:lang(ja) {
  font-family: "Hiragino Kaku Gothic Pro", sans-serif;
}

:lang(ar) {
  font-family: "Arabic UI Text", sans-serif;
  line-height: 1.6;
}

/* 유동적 레이아웃 */
.multilingual-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 2rem;
}
```

#### 2️⃣ 고급 미디어 기능

```css
/* HDR 콘텐츠 지원 */
@media (dynamic-range: high) {
  .hdr-image {
    content: url("image-hdr.jpg");
  }
}

/* 색 영역 최적화 */
@media (color-gamut: p3) {
  :root {
    --brand-red: color(display-p3 1 0 0);
    --brand-green: color(display-p3 0 1 0);
    --brand-blue: color(display-p3 0 0 1);
  }
}

/* 디스플레이 모드 대응 */
@media (display-mode: standalone) {
  .browser-only {
    display: none;
  }
}

/* 접힌 디스플레이 대응 */
@media (spanning: single-fold-vertical) {
  .foldable-layout {
    grid-template-columns: 1fr 1fr;
    gap: env(fold-width);
  }
}
```

#### 3️⃣ 멀티스크린 최적화

```js
class MultiScreenManager {
  constructor() {
    this.initializeScreenAPI();
    this.setupPresentationAPI();
    this.handleWindowPlacement();
  }

  // 멀티스크린 API 초기화
  async initializeScreenAPI() {
    if ("getScreenDetails" in window) {
      try {
        const screenDetails = await window.getScreenDetails();
        this.handleMultipleScreens(screenDetails.screens);
      } catch (error) {
        console.log("Screen API not available");
      }
    }
  }

  // 프레젠테이션 모드
  setupPresentationAPI() {
    if ("PresentationRequest" in window) {
      const request = new PresentationRequest(["presentation.html"]);

      request.addEventListener("connectionavailable", (event) => {
        this.handlePresentationConnection(event.connection);
      });
    }
  }

  // 윈도우 배치
  async handleWindowPlacement() {
    if ("getScreenDetails" in window) {
      const screenDetails = await window.getScreenDetails();

      // 최적의 화면 선택
      const preferredScreen = screenDetails.screens.find(
        (screen) => screen.isPrimary
      );

      if (preferredScreen) {
        this.optimizeForScreen(preferredScreen);
      }
    }
  }
}
```

#### 4️⃣ 고급 성능 최적화

```js
class AdvancedOptimization {
  constructor() {
    this.setupIntersectionObserver();
    this.initializeResources();
    this.handleNetworkChanges();
  }

  // 리소스 최적화
  initializeResources() {
    // 중요도 힌트
    this.setResourceHints();

    // 조건부 로딩
    this.setupConditionalLoading();
  }

  // 리소스 힌트 설정
  setResourceHints() {
    // 프리로드 중요 리소스
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = "critical-image.jpg";
    document.head.appendChild(preloadLink);

    // 프리페치 향후 리소스
    const prefetchLink = document.createElement("link");
    prefetchLink.rel = "prefetch";
    prefetchLink.href = "next-page.html";
    document.head.appendChild(prefetchLink);
  }

  // 네트워크 상태 처리
  handleNetworkChanges() {
    if ("connection" in navigator) {
      navigator.connection.addEventListener("change", () => {
        this.adaptToNetworkConditions(navigator.connection);
      });
    }
  }
}
```

### 🌟 6장 핵심 포인트

1. **국제화 대응**

   - RTL 레이아웃 지원
   - 다국어 타이포그래피
   - 문화적 최적화

2. **고급 미디어 기능**

   - HDR 콘텐츠
   - 넓은 색 영역
   - 폴더블 디바이스

3. **멀티스크린**

   - 스크린 API
   - 프레젠테이션 모드
   - 윈도우 배치

4. **성능 최적화**
   - 리소스 힌트
   - 조건부 로딩
   - 네트워크 대응

## 🎯 마무리!! 고급 반응형 기법의 핵심 포인트

1. **국제화는 필수**

   - RTL 언어 지원하기
   - 문화별 최적화하기
   - 다국어 폰트 관리하기
   - 유연한 레이아웃 만들기

2. **새로운 미디어 기능 활용**

   - HDR 디스플레이 지원
   - 넓은 색 영역 활용
   - 폴더블/듀얼 스크린 대응
   - 다양한 디스플레이 모드 처리

3. **멀티스크린 경험**

   - 스크린 API 활용
   - 프레젠테이션 모드 지원
   - 창 배치 최적화
   - 동기화된 경험 제공

4. **고급 성능 관리**
   - 리소스 힌트 활용
   - 네트워크 대응
   - 조건부 로딩 구현
   - 지속적인 모니터링

쉽게 말해서 "더 넓은 사용자층을 위해, 더 새로운 기술로, 더 나은 경험을 제공하자!" 라는 마인드로 개발하면 됩니다! 👍
