---
layout: post
title: "[JS] setTimeout / setInterval"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-23 13:17:37
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1206/js.webp"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - JavaScript
tags:
  - js 기초
  - js 문법
  - js 기초 문법
  - js setTimeout
  - js setInterval
---

{% include post/js_contents.md %}

setTimeout과 setInterval! 비동기 작업을 처리하는 타이머 함수들이야! ⏰

### 1. setTimeout 기본

```javascript
// 기본 사용법
setTimeout(() => {
  console.log("3초 후 실행!");
}, 3000); // 3000ms = 3초

// clearTimeout으로 취소
const timerId = setTimeout(() => {
  console.log("이 메시지는 보이지 않을 거예요!");
}, 1000);

clearTimeout(timerId); // 타이머 취소

// 매개변수 전달
setTimeout(
  (name, age) => {
    console.log(`${name}님은 ${age}살입니다.`);
  },
  2000,
  "김코딩",
  20
);
```

### 2. setInterval 기본

```javascript
// 기본 사용법
setInterval(() => {
  console.log("1초마다 실행!");
}, 1000);

// clearInterval로 중지
const countDown = (count) => {
  const intervalId = setInterval(() => {
    console.log(count);
    count--;

    if (count < 0) {
      clearInterval(intervalId);
      console.log("카운트다운 종료!");
    }
  }, 1000);
};

countDown(5); // 5, 4, 3, 2, 1, "카운트다운 종료!"
```

### 3. 실전 활용 예제

```javascript
class Timer {
  constructor() {
    this.timers = new Map();
  }

  // 일정 시간 후 한 번 실행
  runLater(name, delay, callback) {
    const timerId = setTimeout(() => {
      callback();
      this.timers.delete(name);
    }, delay);

    this.timers.set(name, timerId);
  }

  // 주기적으로 실행
  runInterval(name, interval, callback) {
    const timerId = setInterval(callback, interval);
    this.timers.set(name, timerId);
  }

  // 특정 타이머 중지
  stop(name) {
    if (this.timers.has(name)) {
      clearTimeout(this.timers.get(name));
      clearInterval(this.timers.get(name));
      this.timers.delete(name);
      return true;
    }
    return false;
  }

  // 모든 타이머 중지
  stopAll() {
    this.timers.forEach((timerId) => {
      clearTimeout(timerId);
      clearInterval(timerId);
    });
    this.timers.clear();
  }
}

// 사용 예시
const timer = new Timer();

// setTimeout 예제
timer.runLater("greeting", 2000, () => {
  console.log("안녕하세요!");
});

// setInterval 예제
timer.runInterval("counter", 1000, () => {
  console.log("매초 실행!");
});

// 3초 후 특정 타이머 중지
setTimeout(() => {
  timer.stop("counter");
  console.log("카운터 중지!");
}, 3000);
```

### 4. 애니메이션 구현

```javascript
class Animator {
  static animate(element, property, start, end, duration) {
    const startTime = performance.now();
    const change = end - start;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 현재 값 계산
      const current = start + change * progress;
      element.style[property] = `${current}px`;

      // 애니메이션 계속
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  static fadeIn(element, duration = 1000) {
    element.style.opacity = "0";
    element.style.display = "block";

    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      element.style.opacity = progress;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
}

// 사용 예시
const box = document.querySelector(".box");
Animator.animate(box, "left", 0, 300, 1000); // 왼쪽으로 300px 이동
Animator.fadeIn(box, 2000); // 2초동안 페이드인
```

### 5. 디바운스와 쓰로틀

```javascript
class EventController {
  // 디바운스: 마지막 호출 후 일정 시간이 지나면 실행
  static debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  // 쓰로틀: 일정 시간 간격으로만 실행
  static throttle(func, limit) {
    let inThrottle;

    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;

        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
}

// 사용 예시
const handleSearch = EventController.debounce((text) => {
  console.log(`검색어: ${text}`);
}, 500);

const handleScroll = EventController.throttle(() => {
  console.log("스크롤 이벤트 처리");
}, 1000);

// 이벤트 리스너에 적용
input.addEventListener("input", (e) => handleSearch(e.target.value));
window.addEventListener("scroll", handleScroll);
```

### 꿀팁! 🍯

1. 성능 최적화

```javascript
// BAD: 중첩된 setTimeout
setTimeout(() => {
  setTimeout(() => {
    setTimeout(() => {
      console.log("콜백 지옥!");
    }, 1000);
  }, 1000);
}, 1000);

// GOOD: Promise 사용
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function betterWay() {
  await delay(1000);
  console.log("1초 후");
  await delay(1000);
  console.log("2초 후");
  await delay(1000);
  console.log("3초 후");
}
```

2. 메모리 누수 방지

```javascript
class TimerManager {
  constructor() {
    this.timers = new Set();
  }

  setTimeout(callback, delay) {
    const timerId = setTimeout(() => {
      callback();
      this.timers.delete(timerId);
    }, delay);

    this.timers.add(timerId);
    return timerId;
  }

  clearAll() {
    this.timers.forEach(clearTimeout);
    this.timers.clear();
  }
}

// 컴포넌트 언마운트 시
timerManager.clearAll();
```

이제 타이머 함수들은 마스터! 😎
비동기 작업과 애니메이션을 자유자재로 다룰 수 있을 거야!
