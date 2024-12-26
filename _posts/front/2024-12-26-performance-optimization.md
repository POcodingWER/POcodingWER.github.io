---
layout: post
title: "[FRONT] 웹 성능 최적화 완벽 가이드"

subtitle: "웹 성능 최적화 디바운싱(Debouncing)과 쓰로틀링(Throttling)"

date: 2024-12-26 09:50:25
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1226/xss_csrf.png"
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
  - 디바운싱
  - 쓰로틀링
  - 레이지 로딩
  - 코드 분할
  - 캐싱 전략
  - 렌더링 최적화
---

{% include post/front_contents.md %}

# 웹 성능 최적화 완벽 가이드 🚀

### 1. 디바운싱(Debouncing)과 쓰로틀링(Throttling)

#### 디바운싱: 마지막 호출 후 일정 시간 지난 뒤 실행

```javascript
// 디바운싱 함수
function 디바운스(함수, 대기시간) {
  let 타이머;
  return function (...args) {
    clearTimeout(타이머); // 이전 타이머 취소
    타이머 = setTimeout(() => {
      함수.apply(this, args);
    }, 대기시간);
  };
}

// 사용 예시
const 검색실행 = 디바운스((검색어) => {
  // API 호출
  검색하기(검색어);
}, 500); // 0.5초 대기
```

#### 쓰로틀링: 일정 시간 동안 한 번만 실행

```javascript
function 쓰로틀(함수, 제한시간) {
  let 실행가능 = true;
  return function (...args) {
    if (!실행가능) return;
    실행가능 = false;
    함수.apply(this, args);
    setTimeout(() => {
      실행가능 = true;
    }, 제한시간);
  };
}

// 사용 예시
const 스크롤처리 = 쓰로틀(() => {
  // 스크롤 이벤트 처리
  화면업데이트();
}, 100); // 0.1초마다 최대 한번 실행
```

### 2. 이미지 최적화

#### 레이지 로딩 (Lazy Loading)

```html
<!-- 이미지 레이지 로딩 -->
<img
  src="placeholder.jpg"
  data-src="실제이미지.jpg"
  loading="lazy"
  alt="상품 이미지"
/>
```

```javascript
// 레이지 로딩 구현
const 이미지관찰자 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // 실제 이미지 로드
    }
  });
});

// 모든 이미지에 관찰자 적용
document
  .querySelectorAll("img[data-src]")
  .forEach((img) => 이미지관찰자.observe(img));
```

### 3. 코드 분할 (Code Splitting)

#### 동적 임포트

```javascript
// 기존 방식 (❌)
import { 큰기능 } from "./큰기능";

// 동적 임포트 방식 (✅)
버튼.addEventListener("click", async () => {
  const { 큰기능 } = await import("./큰기능");
  큰기능();
});
```

### 4. 캐싱 전략

#### 브라우저 캐싱

```javascript
// 서비스 워커를 이용한 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["/", "/styles.css", "/app.js"]);
    })
  );
});

// 캐시된 리소스 사용
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### 5. 렌더링 최적화

#### 리플로우(Reflow) 최소화

```javascript
// 나쁜 예시 (❌)
const box = document.getElementById("box");
box.style.width = "100px";
box.style.height = "100px";
box.style.margin = "10px";

// 좋은 예시 (✅)
const box = document.getElementById("box");
box.classList.add("box-style"); // CSS 클래스 사용
```

#### 가상 스크롤 (Virtual Scroll)

```javascript
class 가상스크롤 {
  constructor(컨테이너, 아이템높이) {
    this.컨테이너 = 컨테이너;
    this.아이템높이 = 아이템높이;
  }

  render(데이터목록) {
    const 시작인덱스 = Math.floor(this.컨테이너.scrollTop / this.아이템높이);
    const 보이는아이템수 = Math.ceil(
      this.컨테이너.clientHeight / this.아이템높이
    );

    // 보이는 부분만 렌더링
    const 보여질아이템 = 데이터목록.slice(
      시작인덱스,
      시작인덱스 + 보이는아이템수
    );
    this.업데이트화면(보여질아이템);
  }
}
```

### 6. 실제 적용 예시

#### 최적화된 무한 스크롤

```javascript
class 최적화된리스트 {
  constructor() {
    // 디바운스된 스크롤 핸들러
    this.스크롤처리 = 디바운스(this.데이터로드, 200);

    // 레이지 로딩 설정
    this.이미지관찰자 = new IntersectionObserver(this.이미지로드);
  }

  async 데이터로드() {
    const 새데이터 = await fetch("/api/items");
    this.가상스크롤렌더(새데이터);
  }

  이미지로드(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        this.이미지관찰자.unobserve(img);
      }
    });
  }
}
```

### 7. 성능 체크리스트 ✅

1. **이벤트 최적화**

   - 디바운싱/쓰로틀링 적용
   - 이벤트 위임 사용

2. **리소스 최적화**

   - 이미지 레이지 로딩
   - 코드 분할
   - 적절한 캐싱 전략

3. **렌더링 최적화**

   - 리플로우 최소화
   - 가상 스크롤 적용
   - CSS 애니메이션 사용

4. **측정 및 모니터링**
   - Performance API 활용
   - 개발자 도구 성능 탭 확인
   - 사용자 경험 메트릭 추적

이러한 최적화 기법들을 적절히 적용하면 웹 애플리케이션의 성능을 크게 향상시킬 수 있습니다! 😊
