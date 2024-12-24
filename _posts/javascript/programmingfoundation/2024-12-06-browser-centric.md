---
layout: post
title: "[Programming Foundation] 브라우저 중심"

subtitle: "브라우저 중심 언어의 특징"

date: 2024-12-06 10:06:57
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
# header-img: "img/post/2024/1206/js.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - Foundation
tags:
  - 브라우저 중심
---

### 1. DOM (Document Object Model) 조작

```javascript
// DOM 요소 선택
const element = document.querySelector(".my-class");
const elements = document.querySelectorAll("div");

// DOM 요소 생성 및 수정
const div = document.createElement("div");
div.innerHTML = "<span>안녕하세요</span>";
div.classList.add("new-class");

// DOM에 요소 추가
document.body.appendChild(div);

// 스타일 변경
element.style.backgroundColor = "blue";
element.style.display = "none";
```

### 2. 이벤트 처리

```javascript
// 클릭 이벤트
button.addEventListener("click", (e) => {
  console.log("버튼 클릭됨!");
  e.preventDefault(); // 기본 동작 방지
});

// 폼 제출
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log(formData.get("username"));
});

// 키보드 이벤트
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
```

### 3. AJAX와 API 통신

```javascript
// Fetch API 사용
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("에러:", error));

// async/await 사용
async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("에러:", error);
  }
}
```

### 4. 브라우저 저장소

```javascript
// localStorage
localStorage.setItem("user", JSON.stringify({ name: "Kim" }));
const user = JSON.parse(localStorage.getItem("user"));

// sessionStorage
sessionStorage.setItem("token", "abc123");
const token = sessionStorage.getItem("token");

// Cookie
document.cookie =
  "username=John Doe; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";
```

### 5. 브라우저 API 활용

```javascript
// 위치 정보
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(`위도: ${position.coords.latitude}`);
    console.log(`경도: ${position.coords.longitude}`);
  },
  (error) => console.error(error)
);

// 알림
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    new Notification("안녕하세요!", {
      body: "새로운 메시지가 있습니다.",
    });
  }
});

// 히스토리 관리
window.history.pushState({ page: 1 }, "title", "/new-page");
window.history.back();
```

### 6. 웹 애니메이션

```javascript
// CSS 애니메이션
element.classList.add("animate");

// requestAnimationFrame
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 5;

  if (position < 300) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
```

### 7. 반응형 웹

```javascript
// 미디어 쿼리 감지
const mediaQuery = window.matchMedia("(max-width: 768px)");

mediaQuery.addListener((e) => {
  if (e.matches) {
    console.log("모바일 화면입니다");
  } else {
    console.log("데스크톱 화면입니다");
  }
});

// 화면 크기 변경 감지
window.addEventListener("resize", () => {
  console.log(`현재 화면 크기: ${window.innerWidth}px`);
});
```

### 8. 성능 최적화

```javascript
// 디바운싱
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 사용 예시
const handleSearch = debounce(() => {
  // API 호출 등의 무거운 작업
  console.log("검색 실행");
}, 500);

// 이벤트 위임
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    console.log("리스트 아이템 클릭:", e.target.textContent);
  }
});
```

이러한 브라우저 중심의 기능들은 웹 애플리케이션 개발에서 핵심적인 역할을 합니다. 특히 사용자 인터페이스와 상호작용, 데이터 관리, 성능 최적화 등에서 중요하게 활용됩니다.
