---
layout: post
title: "[INTERVIEW] 면접 준비하기"

subtitle: "React로 알아보는 PWA"

date: 2025-02-26 08: 32: 33

# lastmod: 2024-08-14 10: 10: 00
author: "lim.Chuck"
# header-style: text
catalog: true
header-mask: 0.4
header-img: "img/post/2025/02/pwa.webp"

# sitemap:
# changefreq: daily #스크랩 주기 daily | weekly | monthly
# priority: 1.0 # 스크랩 우선순위
# hidden: true

categories:
  - DEVELOP

tags:
  - PWA
  - PWA 이해
  - Progressive Web Apps
  - 프로그레시브 웹 앱
  - React로 알아보는 PWA
---

## 🤔 Q & A

### 상태관리

#### 1. Recoil을 사용할 때 주의할 점은 무엇인가요?

"Q": "Recoil을 사용할 때 주의할 점은 무엇인가요?",

"A":
✨ 전역 상태 관리의 필요성 검토

- 전역 상태 관리 도구이므로 실제로 전역으로 관리가 필요한 상태인지 신중하게 검토해야 합니다.

⚠️ 성능과 유지보수성 고려

- Recoil의 편리한 사용성으로 인해 불필요한 전역 상태를 남용하면 성능 저하와 유지보수의 어려움이 발생할 수 있습니다.

🔄 Context API와의 적절한 활용

- 단순히 props drilling을 피하기 위한 목적이라면 Context API 활용이 더 적합할 수 있으며, 실제 전역 상태 관리가 필요한 경우에만 Recoil을 사용하는 것이 좋습니다.

🚨 렌더링 최적화 주의

- Recoil은 Atom을 구독하는 방식으로 동작하여 상태 변경 시 구독 중인 모든 컴포넌트가 리렌더링될 수 있으므로, 불필요한 리렌더링을 방지하기 위한 최적화가 필요합니다.

🔍 디버깅과 테스트

- DevTools 활용과 상태 변화 추적이 중요하며, 테스트 작성 시 전역 상태에 대한 고려가 필요합니다.

#### 2. React 상태관리

"Q": "React 상태관리에 방법에 대해서 설명해주세요.",

"A": React 상태관리에는 여러 방법이 있습니다.

1. 내장 상태 관리

   - useState: 간단한 상태
   - useReducer: 복잡한 로직
   - Context: 전역 상태

2. 외부 라이브러리

   - Redux: 대규모 앱
   - Recoil: 유연한 상태 관리
   - Zustand: 간단한 전역 상태

3. 선택 기준
   - 프로젝트 규모
   - 팀 경험
   - 성능 요구사항

### api

#### 1. RESTful API를 설계할 때 고려사항은 무엇인가요?

"A":

1.  URI 설계 원칙

```plaintext
1) 리소스 중심의 설계
- 명사 사용, 동사 지양
좋은 예: /users, /posts
나쁜 예: /getUsers, /createPost

2) 계층 구조 표현
/users/{userId}/posts/{postId}

3) 소문자 사용 및 하이픈(-) 사용
좋은 예: /user-profiles
나쁜 예: /userProfiles, /user_profiles
```

2.  HTTP 메서드의 올바른 사용

```plaintext
GET: 리소스 조회
- /users (목록 조회)
- /users/{id} (단일 조회)

POST: 리소스 생성
- /users (새 사용자 생성)

PUT: 리소스 전체 수정
- /users/{id} (사용자 정보 전체 수정)

PATCH: 리소스 부분 수정
- /users/{id} (사용자 정보 일부 수정)

DELETE: 리소스 삭제
- /users/{id} (사용자 삭제)
```

3.  적절한 HTTP 상태 코드 사용

```typescript
// 성공 응답
200: OK (요청 성공)
201: Created (생성 성공)
204: No Content (성공했지만 응답 데이터 없음)

// 클라이언트 에러
400: Bad Request (잘못된 요청)
401: Unauthorized (인증 필요)
403: Forbidden (권한 없음)
404: Not Found (리소스 없음)
409: Conflict (리소스 충돌)

// 서버 에러
500: Internal Server Error (서버 에러)
503: Service Unavailable (서비스 사용 불가)
```

4.  버전 관리

```typescript
// URI 버전 관리
/api/1v / users / api / v2 / users;

// 헤더를 통한 버전 관리
Accept: application / vnd.company.api - v1 + json;
```

5.  페이지네이션, 필터링, 정렬

```typescript
// 페이지네이션
GET /users?page=1&size=10

// 필터링
GET /users?status=active&role=admin

// 정렬
GET /users?sort=name:asc,age:desc
```

6.  응답 데이터 구조 표준화

```typescript
// 성공 응답
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "홍길동"
  },
  "message": "사용자가 성공적으로 생성되었습니다",
  "timestamp": "2024-03-21T10:00:00Z"
}

// 에러 응답
{
  "status": "error",
  "code": "USER_NOT_FOUND",
  "message": "해당 사용자를 찾을 수 없습니다",
  "timestamp": "2024-03-21T10:00:00Z"
}
```

7.  HATEOAS 구현

```typescript
{
  "id": 1,
  "name": "홍길동",
  "_links": {
    "self": { "href": "/users/1" },
    "posts": { "href": "/users/1/posts" },
    "followers": { "href": "/users/1/followers" }
  }
}
```

8.  보안 고려사항

```typescript
// 인증/인가
- JWT 토큰 사용
- OAuth 2.0 구현
- HTTPS 사용 필수

// Rate Limiting
{
  "X-RateLimit-Limit": "100",
  "X-RateLimit-Remaining": "95",
  "X-RateLimit-Reset": "1615825200"
}
```

9.  문서화

```typescript
// Swagger/OpenAPI 사용
@ApiOperation({ summary: '사용자 조회' })
@ApiResponse({ status: 200, description: '성공' })
@Get('/users/:id')
async getUser(@Param('id') id: string) {
  // 구현
}
```

10. 캐싱 전략

```typescript
// HTTP 캐싱 헤더 설정
Cache-Control: max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
```

11. 에러 처리

```typescript
class ApiError extends Error {
  constructor(public statusCode: number, public code: string, message: string) {
    super(message);
  }
}

// 에러 처리 미들웨어
app.use((err: ApiError, req: Request, res: Response) => {
  res.status(err.statusCode).json({
    status: "error",
    code: err.code,
    message: err.message,
  });
});
```

12. 성능 최적화

```typescript
// 응답 압축
app.use(compression());

// 필요한 필드만 선택
GET /users?fields=id,name,email

// N+1 문제 해결
GET /users?include=posts,comments
```

이러한 고려사항들을 잘 반영하여 설계하면 확장 가능하고 유지보수가 용이한 RESTful API를 구축할 수 있습니다.
