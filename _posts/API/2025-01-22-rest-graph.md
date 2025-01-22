---
layout: post
title: "[API] REST API vs GraphQL 차이"

subtitle: "graphql rest api 차이 (over-fetching & under-fetching) 💪🏻"

date: 2025-01-22 11:01:35
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/01/rest_vs_graph.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - API
tags:
  - API
  - GraphQL
  - REST API
  - graphql rest api 차이
  - graphql rest api 사용성비교
  - GraphQL vs REST
  - GraphQL 예제
  - GraphQL 장점
  - GraphQL 단점
  - GraphQL 특징
  - REST API 예제
  - REST API 장점
  - REST API 단점
  - REST API 특징
  - over-fetching
  - under-fetching
---

# 📊 비교 분석 REST API vs GraphQL

## 1. 특징 비교표

| 구분        | REST API                        | GraphQL                                |
| ----------- | ------------------------------- | -------------------------------------- |
| 엔드포인트  | 여러 엔드포인트 존재 (리소스별) | 단일 엔드포인트                        |
| 데이터 요청 | 고정된 데이터 구조              | 클라이언트가 필요한 데이터만 요청 가능 |
| 버전 관리   | URL에 버전 명시 (v1, v2)        | 스키마 진화로 버전 불필요              |
| 캐싱        | HTTP 캐싱 메커니즘 사용         | 클라이언트에서 직접 구현 필요          |
| 파일 전송   | 단순하고 직관적                 | 복잡하고 추가 설정 필요                |
| 실시간 기능 | WebSocket 별도 구현             | Subscription 기본 제공                 |
| 상태 코드   | HTTP 상태 코드 사용             | 항상 200 OK, 에러는 응답 내 포함       |
| 학습 곡선   | 상대적으로 낮음                 | 상대적으로 높음                        |

## 2. 장단점 비교표

#### REST API

| 장점                        | 단점                      |
| --------------------------- | ------------------------- |
| • HTTP 캐싱 기본 지원       | • Over-fetching 문제      |
| • 직관적인 리소스 중심 구조 | • Under-fetching 문제     |
| • 풍부한 생태계와 도구      | • 여러 번의 API 호출 필요 |
| • 브라우저 기본 지원        | • 엔드포인트 관리 복잡    |
| • 파일 업로드 용이          | • 유연성 부족             |
| • 낮은 진입 장벽            | • 버전 관리 필요          |

#### GraphQL

| 장점                        | 단점                      |
| --------------------------- | ------------------------- |
| • 필요한 데이터만 요청 가능 | • 캐싱 구현 복잡          |
| • 단일 요청으로 데이터 조회 | • 파일 업로드 처리 복잡   |
| • 강력한 타입 시스템        | • 높은 학습 곡선          |
| • 실시간 구독 기능 내장     | • 초기 설정 복잡          |
| • 버전 관리 불필요          | • 서버 부하 가능성        |
| • API 문서 자동 생성        | • 복잡한 쿼리 최적화 필요 |

## 3. 적합한 사용 케이스

`REST API 적합`

- 단순한 CRUD 작업
- 공개 API 제공
- 캐싱이 중요한 경우
- 파일 업로드가 많은 서비스
- 리소스 중심의 단순한 서비스

`GraphQL 적합`

- 복잡한 데이터 관계
- 모바일 애플리케이션
- 마이크로서비스 아키텍처
- 실시간 데이터 처리
- 빈번한 API 변경이 필요한 서비스
- 데이터 사용량 최적화가 중요한 경우

# 🔍 Over-fetching & Under-fetching으로 비교해보자

### Over-fetching이란?

필요한 데이터보다 더 많은 데이터를 서버로부터 받아오는 현상입니다.

사용자 프로필에서 이름만 필요한 상황을 가정해보겠습니다:

```javascript
// REST API 사용 시 (Over-fetching 발생)
GET /api/users/1

// 실제 응답 데이터 (필요 이상의 데이터를 받음)
{
  "id": 1,
  "name": "Chuck",           // 👈 실제로 필요한 데이터
  "email": "chuck@test.com", // 👈 불필요한 데이터
  "phone": "010-1234-5678",  // 👈 불필요한 데이터
  "address": "Seoul",        // 👈 불필요한 데이터
  "age": 20,                 // 👈 불필요한 데이터
  "gender": "male"           // 👈 불필요한 데이터
}

// GraphQL 사용 시 (Over-fetching 해결)
query {
  user(id: 1) {
    name  // 👈 필요한 데이터만 요청
  }
}

// GraphQL 응답
{
  "data": {
    "user": {
      "name": "Chuck"  // 필요한 데이터만 받음
    }
  }
}
```

### Under-fetching이란?

하나의 작업을 완료하기 위해 여러 번의 API 요청이 필요한 현상입니다.

사용자의 정보와 해당 사용자의 게시글, 팔로워 목록이 필요한 상황:

```javascript
// REST API 사용 시 (Under-fetching 발생)
// 필요한 데이터를 위해 3번의 API 호출 필요
GET /api/users/1         // 사용자 정보
GET /api/users/1/posts   // 사용자의 게시글
GET /api/users/1/followers // 사용자의 팔로워

// GraphQL 사용 시 (Under-fetching 해결)
// 한 번의 요청으로 모든 데이터 조회
query {
  user(id: 1) {
    name
    posts {
      title
      content
    }
    followers {
      name
    }
  }
}
```

## 실제 영향 비교

- ##### Over-fetching의 문제점

1. 불필요한 데이터 전송
   - 네트워크 대역폭 낭비
   - 모바일 데이터 사용량 증가
2. 서버 리소스 낭비
   - 불필요한 데이터 처리
   - 데이터베이스 쿼리 낭비

- ##### Under-fetching의 문제점

1. 네트워크 비용 증가
   - 여러 번의 HTTP 요청 필요
   - 각 요청마다 연결 비용 발생
2. 성능 저하
   - 여러 API를 순차적으로 호출
   - 전체 로딩 시간 증가

## 해결 방안 비교

### REST API

```javascript
// Over-fetching & Under-fetching 발생
async function getUserProfile(userId) {
  // 3번의 API 호출 필요 (Under-fetching)
  const user = await fetch(`/api/users/${userId}`);
  const posts = await fetch(`/api/users/${userId}/posts`);
  const followers = await fetch(`/api/users/${userId}/followers`);

  // 각 응답에는 필요 이상의 데이터 포함 (Over-fetching)
  return {
    user: await user.json(),
    posts: await posts.json(),
    followers: await followers.json(),
  };
}
```

### GraphQL

```graphql
# 한 번의 요청으로 필요한 데이터만 정확히 요청
query GetUserProfile($userId: ID!) {
  user(id: $userId) {
    name
    posts {
      title # 필요한 필드만
      content # 선택적으로 요청
    }
    followers {
      name # 필요한 데이터만
    }
  }
}
```

## 기존 REST API의 문제

```javascript
// 모바일 프로필 화면 (작은 화면)
// 불필요하게 많은 데이터를 받아옴
GET /api/users/1
{
  "id": 1,
  "name": "Chuck",
  "email": "chuck@test.com",
  "phone": "010-1234-5678",
  "address": "Seoul",
  "detailedInfo": "...", // 모바일에선 표시되지 않는 정보
  "preferences": {...},   // 불필요한 데이터
  "settings": {...}       // 불필요한 데이터
}
```

`GraphQL의 해결책`

```graphql
# 모바일용 최적화 쿼리
query GetMobileProfile($userId: ID!) {
  user(id: $userId) {
    name
    avatar # 모바일에 필요한
    bio # 데이터만 요청
  }
}
```

# REST API 사용이유 🎯

1.  단순한 CRUD 애플리케이션

```javascript
// REST API - 단순하고 직관적
GET /api/posts           // 목록 조회
POST /api/posts         // 생성
PUT /api/posts/1        // 수정
DELETE /api/posts/1     // 삭제

// GraphQL - 오히려 복잡
mutation {
  createPost(input: { title: "제목", content: "내용" }) {
    id
    title
    content
  }
}
```

2. 파일 업로드 처리

```javascript
// REST API - 간단한 파일 업로드
const formData = new FormData();
formData.append('file', file);

fetch('/api/upload', {
  method: 'POST',
  body: formData
});

// GraphQL - 복잡한 설정 필요
import { ReactNativeFile } from 'apollo-upload-client';

const file = new ReactNativeFile({
  uri: '...',
  type: 'image/jpeg',
  name: 'photo.jpg',
});

mutation($file: Upload!) {
  uploadFile(file: $file) {
    url
  }
}
```

3. 캐싱이 중요한 경우

```javascript
// REST API - 브라우저 기본 캐싱 활용
fetch("/api/posts/1", {
  headers: {
    "Cache-Control": "max-age=3600",
  },
});

// GraphQL - 복잡한 캐싱 로직 구현 필요
const client = new ApolloClient({
  cache: new InMemoryCache(),
  typePolicies: {
    Query: {
      fields: {
        posts: {
          merge(existing, incoming) {
            // 복잡한 캐싱 로직...
          },
        },
      },
    },
  },
});
```

4. 공개 API 제공 시

```javascript
// REST API - 이해하기 쉬운 엔드포인트
GET /api/v1/weather?city=seoul
GET /api/v1/products?category=electronics

// GraphQL - 러닝커브가 있는 쿼리 언어
query {
  weather(city: "seoul") {
    temperature
    humidity
  }
  products(category: "electronics") {
    name
    price
  }
}
```

5. 리소스 중심의 단순한 서비스

```javascript
// REST API - 리소스 구조가 명확
GET /api/books
GET /api/books/1
GET /api/books/1/reviews

// GraphQL - 과도한 설정이 될 수 있음
type Book {
  id: ID!
  title: String!
  author: String!
  reviews: [Review!]!
}

type Review {
  id: ID!
  content: String!
  rating: Int!
}
```

## 마무리 📌

와우! over-fetching & under-fetching 문제를 해결하는 마법같은 GraphQL! 🎩✨
하지만 GraphQL이 아무리 멋지고 훌륭해도~
이런 상황에서는 우리의 친근한 REST API가 더 찰떡이랍니다! 😎

- 단순한 CRUD 작업이 대부분인 경우
- 팀이 GraphQL에 익숙하지 않은 경우
- 빠른 개발과 배포가 필요한 경우
- 파일 업로드가 주요 기능인 경우
- 브라우저 캐싱을 적극 활용해야 하는 경우
- 공개 API를 제공해야 하는 경우

따라서 프로젝트의 특성과 요구사항을 잘 파악하여 적절한 기술을 선택하는 것이 중요합니다! 😊
