---
layout: post
title: "[FRONT] DOM이벤트 버블링(Bubbling)과 캡처링(Capturing)"

subtitle: "DOM 이벤트 흐름을 이해해 보자"

date: 2024-12-24 14:55:59
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1224/bubbling_capturing.webp"
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

## 이벤트 버블링(Bubbling)과 캡처링(Capturing) 완벽 정리 🎯

### 1. HTML 구조

```html
<div id="할아버지">
  <div id="아버지">
    <button id="자식">클릭!</button>
  </div>
</div>
```

### 2. 이벤트 전달 순서

1. **캡처링** (할아버지 → 아버지 → 자식)

```javascript
// useCapture: true로 설정
할아버지.addEventListener(
  "click",
  () => {
    console.log("1. 할아버지가 먼저 캐치!");
  },
  true
);

아버지.addEventListener(
  "click",
  () => {
    console.log("2. 아버지가 그 다음 캐치!");
  },
  true
);

자식.addEventListener(
  "click",
  () => {
    console.log("3. 자식이 마지막으로 캐치!");
  },
  true
);
```

2. **버블링** (자식 → 아버지 → 할아버지)

```javascript
// useCapture 생략 (기본값: false)
자식.addEventListener("click", () => {
  console.log("4. 자식에서 시작!");
});

아버지.addEventListener("click", () => {
  console.log("5. 아버지로 올라감!");
});

할아버지.addEventListener("click", () => {
  console.log("6. 할아버지까지 도달!");
});
```

### 3. 실제 사용 예시

#### 1) 버블링 활용 (클릭 후 실행) 🔺

```html
<div id="쇼핑카트">
  <div class="상품">
    <span>상품1</span>
    <button class="삭제">❌</button>
    <button class="좋아요">👍</button>
  </div>
  <div class="상품">
    <span>상품2</span>
    <button class="삭제">❌</button>
    <button class="좋아요">👍</button>
  </div>
</div>
```

```javascript
// 버블링 활용: 클릭된 후에 동작 처리
쇼핑카트.addEventListener("click", (e) => {
  // 삭제 버튼 클릭시
  if (e.target.className === "삭제") {
    e.target.closest(".상품").remove();
    console.log("상품이 삭제되었습니다!");
  }

  // 좋아요 버튼 클릭시
  if (e.target.className === "좋아요") {
    e.target.textContent = "❤️";
    console.log("좋아요 처리되었습니다!");
  }
});
```

#### 2) 캡처링 활용 (클릭 전에 먼저 체크) 🔻

```html
<div id="회원전용">
  <div class="컨텐츠">
    <button class="구매버튼">VIP 상품 구매</button>
    <a href="/download" class="다운로드">파일 다운로드</a>
  </div>
</div>
```

```javascript
// 캡처링 활용: 클릭 전에 먼저 체크
회원전용.addEventListener(
  "click",
  (e) => {
    // VIP 회원 체크
    if (!isVipMember) {
      e.preventDefault(); // 기본 동작 중단
      e.stopPropagation(); // 이벤트 전파 중단
      alert("VIP 회원만 이용 가능합니다!");
      return;
    }

    // 로그인 체크
    if (!isLoggedIn) {
      e.preventDefault();
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
  },
  true
); // true로 설정하여 캡처링 단계에서 실행
```

### 4. 정리 ✨

1. **버블링 (자식 → 부모)**

   - 일반적인 이벤트 처리
   - 클릭 후 기능 실행할 때
   - 예: 삭제, 수정, 좋아요 등

2. **캡처링 (부모 → 자식)**
   - 권한/인증 체크
   - 클릭 전에 먼저 확인할 때
     - e.preventDefault(); // 기본 동작 중단
     - e.stopPropagation(); // 이벤트 전파 중단
   - 예: 로그인 체크, VIP 확인 등
