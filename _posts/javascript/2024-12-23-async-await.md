---
layout: post
title: "[JS] 비동기 처리(Async/Await)"

subtitle: "javaScript 기초를 탄탄하게 다져보자"

date: 2024-12-23 13:46:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1206/js.png"
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
  - js async/await
  - js 비동기 처리
---

{% include post/js_contents.md %}

async/await는 Promise를 더 쉽게 사용할 수 있게 해주는 문법이야! 😊

### 1. 기본 문법

```javascript
// Promise 방식
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: "김코딩" });
    }, 1000);
  });
}

// async/await 방식
async function getUser() {
  const user = await fetchUser();
  console.log(user); // {id: 1, name: "김코딩"}
}

getUser();
```

### 2. 에러 처리

```javascript
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("데이터 가져오기 실패:", error);
    throw error; // 에러 다시 던지기
  }
}

// 사용
async function main() {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (error) {
    console.error("메인 에러:", error);
  }
}
```

### 3. 병렬 처리

```javascript
// 순차 처리 (더 느림)
async function sequential() {
  const user = await fetchUser(1); // 1초
  const posts = await fetchPosts(1); // 1초
  const comments = await fetchComments(1); // 1초
  // 총 3초 소요

  return { user, posts, comments };
}

// 병렬 처리 (더 빠름)
async function parallel() {
  const userPromise = fetchUser(1);
  const postsPromise = fetchPosts(1);
  const commentsPromise = fetchComments(1);

  // 동시에 실행
  const [user, posts, comments] = await Promise.all([
    userPromise,
    postsPromise,
    commentsPromise,
  ]);
  // 총 1초 소요

  return { user, posts, comments };
}
```

### 4. 실전 예제: API 클래스

```javascript
class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const response = await fetch(this.baseURL + endpoint);
    if (!response.ok) throw new Error("API 호출 실패");
    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(this.baseURL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("API 호출 실패");
    return response.json();
  }
}

// 사용 예시
const api = new API("https://api.example.com");

async function getUserData(userId) {
  try {
    // 병렬로 데이터 가져오기
    const [user, posts] = await Promise.all([
      api.get(`/users/${userId}`),
      api.get(`/users/${userId}/posts`),
    ]);

    return { user, posts };
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
    throw error;
  }
}
```

### 5. 반복문에서의 사용

```javascript
// forEach와 async/await (작동하지 않음)
async function wrong() {
  const ids = [1, 2, 3];

  ids.forEach(async (id) => {
    // 주의: 이렇게 하면 안됨!
    const data = await fetchData(id);
    console.log(data);
  });

  console.log("완료"); // 데이터 로딩 전에 출력됨
}

// 올바른 방법 1: for...of
async function correct1() {
  const ids = [1, 2, 3];

  for (const id of ids) {
    const data = await fetchData(id);
    console.log(data);
  }

  console.log("완료"); // 모든 데이터 로딩 후 출력
}

// 올바른 방법 2: Promise.all
async function correct2() {
  const ids = [1, 2, 3];
  const promises = ids.map((id) => fetchData(id));

  const results = await Promise.all(promises);
  results.forEach((data) => console.log(data));

  console.log("완료");
}
```

### 6. 유용한 패턴들

```javascript
// 타임아웃 추가
async function fetchWithTimeout(timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("시간 초과!")), timeout);
  });

  try {
    const result = await Promise.race([fetchData(), timeoutPromise]);
    return result;
  } catch (error) {
    console.error("에러:", error);
    throw error;
  }
}

// 재시도 로직
async function fetchWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchData();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`재시도 ${i + 1}/${maxRetries}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
```

### 꿀팁! 🍯

1. async 함수는 항상 Promise를 반환

```javascript
async function example() {
  return 123;
}

// 위 함수는 아래와 동일
function example() {
  return Promise.resolve(123);
}
```

2. 화살표 함수에서 사용

```javascript
const fetchData = async () => {
  const response = await fetch("https://api.example.com/data");
  return response.json();
};

// 즉시 실행 함수
(async () => {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```

이제 async/await는 마스터! 😎
비동기 코드를 동기 코드처럼 깔끔하게 작성할 수 있을 거야!
