---
layout: post
title: "[AWS] CloudFront 캐시 완벽 가이드 - X-Cache 헤더와 HTTP 상태 코드"

subtitle: "실무에서 바로 써먹는 CloudFront 캐시 최적화 전략"

date: 2025-12-02 08:31:20
# lastmod: 2025-12-02 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/12/cloudfront-cache.png"

#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - AWS
tags:
  - CloudFront
  - Cache
  - X-Cache
  - HTTP Status Code
  - CDN
  - ETag
  - 성능최적화
---

{% include post/aws_contents.md %}

## 🚀 CloudFront 캐시 기본 개념

![](/img/post/2025/12/cloudfront-cache.png){: #magnific}

Amazon CloudFront는 AWS의 글로벌 CDN 서비스로, 전 세계 엣지 로케이션에서 콘텐츠를 캐싱하여 빠른 응답 속도를 제공합니다.

## 📊 X-Cache 헤더로 캐시 상태 파악하기

CloudFront는 `X-Cache` 헤더를 통해 현재 요청이 어떻게 처리되었는지 알려줍니다.

### ✅ Cache Hit 상태

#### `Hit from cloudfront` - 완벽한 캐시 히트

```http
X-Cache: Hit from cloudfront
X-Amz-Cf-Pop: ICN54-C1
```

- 🎯 **의미**: 엣지에서 바로 제공 (가장 이상적)
- ⚡ **속도**: 10-50ms (매우 빠름)
- 🔄 **오리진 접근**: 없음

#### `RefreshHit from cloudfront` - 재검증 후 히트

```http
X-Cache: RefreshHit from cloudfront
X-Amz-Cf-Pop: ICN54-C1
```

- 🎯 **의미**: 캐시 유효성 검사 후 기존 캐시 사용
- ⚡ **속도**: 빠름 (조건부 요청만)
- 🔄 **오리진 접근**: 조건부 요청 (`If-None-Match`)

### ❌ Cache Miss 상태

#### `Miss from cloudfront` - 캐시 미스

```http
X-Cache: Miss from cloudfront
X-Amz-Cf-Pop: ICN54-C1
```

- 🎯 **의미**: 캐시에 없어서 오리진에서 새로 가져옴
- ⚡ **속도**: 느림 (오리진 서버 응답 시간에 의존)
- 🔄 **오리진 접근**: 전체 콘텐츠 요청

## 🔢 HTTP 상태 코드와 캐시 관계

### 200 OK - 성공 응답

```http
HTTP/1.1 200 OK
X-Cache: Hit from cloudfront
Cache-Control: max-age=3600
```

- 새로운 콘텐츠 또는 캐시된 콘텐츠 제공
- `Cache-Control` 헤더에 따라 캐싱 정책 결정

### 304 Not Modified - 캐시 재사용

```http
HTTP/1.1 304 Not Modified
X-Cache: RefreshHit from cloudfront
ETag: "abc123"
```

- 클라이언트의 캐시된 버전이 여전히 유효
- 대역폭 절약 및 빠른 응답

## 🎬 실제 캐시 동작 시나리오

### 시나리오 1: 첫 방문 (Cold Cache)

```http
요청: GET /api/data.json
응답: HTTP/1.1 200 OK
      X-Cache: Miss from cloudfront
      {"data": "example"}
```

### 시나리오 2: 재방문 (Warm Cache)

```http
요청: GET /api/data.json
응답: HTTP/1.1 200 OK
      X-Cache: Hit from cloudfront
      {"data": "example"}
```

### 시나리오 3: 캐시 만료 후 재검증

```http
요청: GET /api/data.json
CloudFront → 오리진: If-None-Match: "abc123"
오리진 응답: HTTP/1.1 304 Not Modified
최종 응답: HTTP/1.1 200 OK
          X-Cache: RefreshHit from cloudfront
```

## 🏷️ ETag를 활용한 스마트 캐싱

ETag는 리소스 버전을 식별하는 고유 식별자로, 효율적인 캐시 검증을 가능하게 합니다.

### ETag 생성 방법

#### 1. 콘텐츠 해시 기반

```javascript
const crypto = require("crypto");

function generateETag(content) {
  const hash = crypto
    .createHash("md5")
    .update(JSON.stringify(content))
    .digest("hex");
  return `"${hash}"`;
}

app.get("/api/data", (req, res) => {
  const data = getData();
  const etag = generateETag(data);

  res.set("ETag", etag);
  res.set("Cache-Control", "public, max-age=300");

  if (req.get("If-None-Match") === etag) {
    return res.status(304).end();
  }

  res.json(data);
});
```

#### 2. 파일 기반 ETag

```javascript
function generateFileETag(filePath) {
  const stats = fs.statSync(filePath);
  return `"${stats.mtime.getTime()}-${stats.size}"`;
}
```

### ETag 동작 플로우

```
1. 초기 요청
   브라우저 → CloudFront → 오리진
   ← ETag: "v1" ← 200 OK + 데이터

2. 캐시된 요청
   브라우저 → CloudFront (캐시 히트)
   ← 200 OK (캐시된 데이터)

3. 캐시 만료 후
   CloudFront → 오리진 (If-None-Match: "v1")

   변경 없음: ← 304 Not Modified
   변경 있음: ← ETag: "v2" + 새 데이터
```

## ⚙️ 캐시 최적화 전략

### 1. 콘텐츠 타입별 Cache-Control 설정

```http
# 정적 리소스 (이미지, CSS, JS)
Cache-Control: public, max-age=31536000, immutable

# API 응답 (자주 변경)
Cache-Control: public, max-age=300

# 사용자별 데이터
Cache-Control: private, no-cache
```

### 2. 캐시 키 최적화

```javascript
const cacheKey = {
  domain: "example.cloudfront.net",
  path: "/api/users",
  queryString: "id=123", // 필요한 것만 포함
  headers: ["Accept-Language"], // 최소한으로
};
```

### 3. 캐시 무효화 전략

```javascript
// 버전 기반
const assetUrl = `/assets/app.js?v=${buildVersion}`;

// 해시 기반 파일명
const filename = `app.${contentHash}.js`;
```

## 📈 모니터링 및 디버깅

### 주요 확인 헤더

```javascript
const importantHeaders = [
  "X-Cache", // 캐시 상태
  "X-Amz-Cf-Pop", // 엣지 로케이션
  "Cache-Control", // 캐시 정책
  "ETag", // 리소스 버전
  "Age", // 캐시된 시간
];
```

### 캐시 히트율 계산

```javascript
const cacheHitRate = (cacheHits / totalRequests) * 100;
console.log(`캐시 히트율: ${cacheHitRate}%`);
```

## 🎯 핵심 포인트 정리

| 상태        | X-Cache                      | HTTP 코드 | 의미                     |
| ----------- | ---------------------------- | --------- | ------------------------ |
| 캐시 히트   | `Hit from cloudfront`        | 200       | 엣지에서 바로 제공       |
| 재검증 히트 | `RefreshHit from cloudfront` | 200       | 유효성 검사 후 캐시 사용 |
| 캐시 미스   | `Miss from cloudfront`       | 200       | 오리진에서 새로 가져옴   |
| 재검증      | `RefreshHit from cloudfront` | 304       | 캐시가 여전히 유효       |

## 💡 실무 팁

1. **X-Cache 헤더 모니터링**: 캐시 히트율을 지속적으로 확인
2. **ETag 활용**: 304 응답으로 대역폭 절약
3. **적절한 TTL 설정**: 콘텐츠 특성에 맞는 캐시 시간 설정
4. **캐시 키 최적화**: 불필요한 파라미터 제거로 히트율 향상

CloudFront 캐시를 제대로 이해하고 활용하면 웹 애플리케이션의 성능을 크게 향상시킬 수 있습니다! 🚀
