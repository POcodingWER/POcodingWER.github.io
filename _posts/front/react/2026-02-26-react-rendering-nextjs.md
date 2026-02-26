---
layout: post
title: "[React] React 렌더링 원리 & Next.js 완전 정복"

subtitle: "Virtual DOM → Reconciliation → Fiber → CSR/SSR → Next.js"

date: 2026-02-26 10:00:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/02/virtual_dom.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - Virtual DOM
  - Reconciliation
  - Fiber
  - CSR
  - SSR
  - SSG
  - ISR
  - Next.js
---

{% include post/react/contents.md %}

---

> Virtual DOM → Reconciliation → Fiber → CSR/SSR → Next.js

---

## 1. Virtual DOM

**한 줄 요약**: 실제 DOM 건드리기 전에 메모리에서 미리 계산해서 바뀐 부분만 업데이트

#### 왜 필요하냐

```js
// 실제 DOM 조작은 이걸 전부 함
document.getElementById("title").textContent = "안녕";

// 1. DOM 트리 수정
// 2. 스타일 재계산
// 3. 레이아웃 재계산 (reflow)
// 4. 화면 다시 그리기 (repaint)
// 비용이 엄청 큼
```

#### 동작 방식

```
상태 변경 발생
     ↓
새로운 Virtual DOM 생성 (메모리에서, 빠름)
     ↓
이전 Virtual DOM이랑 비교 (diffing)
     ↓
바뀐 부분만 찾아냄
     ↓
실제 DOM은 바뀐 부분만 한 번에 업데이트
```

#### Virtual DOM vs SPA 차이

```
Virtual DOM = 바뀐 부분만 실제 DOM에 반영하는 기술
SPA         = 페이지 이동 없이 컴포넌트 교체하는 방식

// 같이 쓰이지만 다른 개념
SPA: /home → /profile 이동시 새로고침 없이 URL만 변경
Virtual DOM: 그 컴포넌트에서 바뀐 부분만 DOM 반영
```

---

## 2. Reconciliation (재조정)

**한 줄 요약**: Virtual DOM 두 개 비교해서 바뀐 부분 찾는 과정

#### 동작 흐름

```
setState 호출
     ↓
새로운 Virtual DOM 생성
     ↓
이전 Virtual DOM이랑 비교 (diffing)
     ↓
바뀐 부분만 실제 DOM 업데이트
```

#### 비교 규칙 3가지

**규칙 1. 타입이 다르면 통째로 교체**

```jsx
// div → span 으로 바뀌면
// 자식 포함 전부 날리고 새로 만듦
```

**규칙 2. 타입이 같으면 속성만 업데이트**

```jsx
// div는 유지하고 className만 변경
<div className="before" /> → <div className="after" />
```

**규칙 3. key로 식별**

```jsx
// key 없으면 순서 바뀔 때 전부 리렌더링 ❌
{
  items.map((item) => <Item item={item} />);
}

// key 있으면 같은 key면 재사용 ✅
{
  items.map((item) => <Item key={item.id} item={item} />);
}
```

#### key를 index로 쓰면 안 되는 이유

```jsx
// ❌ index 사용
{
  items.map((item, index) => <Item key={index} item={item} />);
}

// 앞에 아이템 추가되면
// 이전: [A(0), B(1), C(2)]
// 이후: [D(0), A(1), B(2), C(3)]
// 모든 index가 밀려서 전부 리렌더링
// input 같은 컴포넌트면 입력값도 초기화됨 ❌

// ✅ 고유 id 사용
{
  items.map((item) => <Item key={item.id} item={item} />);
}
```

#### 삽입 위치에 따른 차이

```
뒤에 삽입 → index 써도 괜찮음 (기존 key 유지)
앞/중간 삽입, 정렬, 삭제 → 반드시 유니크 id

그냥 항상 유니크 id 쓰는 게 맞음 ✅
```

---

## 3. Fiber

**한 줄 요약**: 렌더링 작업을 잘게 쪼개서 우선순위대로 처리하는 엔진

#### React 16 이전 문제

```
setState 호출
     ↓
Reconciliation 시작
     ↓
끝날 때까지 멈출 수 없음 ❌
     ↓
무거운 컴포넌트면 브라우저 멈춤
사용자 입력 안 받음, 애니메이션 끊김
```

#### Fiber가 해결한 것

```
작업을 잘게 쪼개서
조금 하고 → 브라우저한테 양보 → 또 조금 하고 → 양보
브라우저 멈추지 않음 ✅
```

#### 우선순위 개념

```
높은 우선순위: 사용자 입력 (타이핑, 클릭), 애니메이션
낮은 우선순위: 데이터 페칭 후 렌더링, 화면 밖 컴포넌트
```

#### useTransition - 언제 쓰냐

```jsx
// 탭 전환할 때 무거운 컴포넌트 마운트
const [isPending, startTransition] = useTransition();

<button
  onClick={() => {
    startTransition(() => setTab("heavy"));
    // 탭 버튼 클릭 반응은 즉시
    // 무거운 컴포넌트 렌더링은 여유될 때
  }}
>
  무거운 탭
</button>;

{
  isPending ? <Spinner /> : <HeavyComponent />;
}
```

```jsx
// 실시간 랭킹 + 애니메이션 동시에
startTransition(() => {
  setRanking(newRanking); // 랭킹 업데이트는 나중에
});
// 애니메이션은 끊기지 않음 ✅
```

#### 현실적인 사용 빈도

```
백엔드 API 잘 설계된 서비스 → 거의 쓸 일 없음
탭 전환, 복잡한 대시보드    → 가끔 씀

면접에서 중요한 이유
"React가 렌더링을 어떻게 최적화하는지" 설명할 수 있어야 시니어
```

#### React 18 Concurrent Mode랑 연결

```
Fiber 기반으로 우선순위 렌더링 가능해짐
useTransition, useDeferredValue 추가
사용자 경험 향상
```

---

## 4. CSR vs SSR

#### CSR (Client Side Rendering)

```
브라우저가 빈 HTML 받음
     ↓
JS 다운로드
     ↓
JS 실행
     ↓
화면 그림
```

```html
<!-- 서버에서 오는 HTML -->
<div id="root"></div>
<!-- 텅 빔 -->

<!-- JS 실행 후 -->
<div id="root">
  <header>...</header>
  <main>...</main>
  <!-- JS가 채워줌 -->
</div>
```

#### SSR (Server Side Rendering)

```
요청 들어옴
     ↓
서버에서 데이터 페칭 완료
     ↓
데이터 채워진 HTML 완성
     ↓
브라우저로 전송
     ↓
화면 바로 보임 (JS 없어도)
     ↓
JS 다운로드 & hydration
     ↓
인터랙션 가능
```

#### 지표 비교

```
FCP (첫 화면 보이는 시간)
CSR  → 느림 (JS 다 받아야 보임)
SSR  → 빠름 (HTML 받으면 바로 보임)

TTI (클릭 가능한 시간)
CSR  → FCP랑 거의 같음
SSR  → FCP보다 늦음 (hydration 필요)

SEO
CSR  → 불리 (크롤러가 빈 HTML 봄)
SSR  → 유리 (크롤러가 완성된 HTML 봄)

서버 비용
CSR  → 저렴 (S3 + CDN)
SSR  → 비쌈 (서버 계속 돌아야 함)
```

#### CORS

```
CSR (브라우저에서 API 호출)
브라우저 → API 서버 = CORS 발생 ❌

SSR/SSG (서버에서 API 호출)
서버 → API 서버 = CORS 없음 ✅
서버는 브라우저 보안 정책 적용 안 됨
```

---

## 5. Next.js 렌더링 4가지

#### 1. CSR

```jsx
"use client"; // 이거 써야 CSR

function Page() {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  return <div>{data?.name}</div>;
}

// 브라우저에서 JS 실행 후 데이터 fetch
// 개인화 데이터 (로그인 필요한 페이지)
```

#### 2. SSR

```jsx
// App Router - 기본값이 SSR
import { cookies } from "next/headers";

async function Page() {
  // 서버에서 토큰 읽어서 API 호출
  const token = cookies().get("token");
  const data = await fetch("/api/user", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", // 캐시 안 함
  });
  return <div>{data.name}</div>;
}

// 요청마다 서버에서 HTML 만듦
// 항상 최신 데이터
// 로그인한 유저 개인화 페이지에 적합
```

#### 3. SSG

```jsx
// revalidate 없거나 false
async function Page() {
  const data = await fetchPosts(); // 빌드할 때 한번만 실행
  return <div>{data.map(...)}</div>;
}

// 빌드 타임에 HTML 완성
// CDN에 올려서 서빙
// 데이터 바뀌면 재배포 필요
// 회사 소개, 이용약관, 404 페이지
```

#### 4. ISR

```jsx
export const revalidate = 60; // 60초마다 재생성

async function Page() {
  const data = await fetchPosts();
  return <div>{data.map(...)}</div>;
}

// 처음엔 SSG처럼 빠름
// 60초마다 백그라운드에서 새로 만듦
// API 실패해도 이전 HTML 유지 ✅
// 다음 revalidate 때 자동 재시도 ✅
```

#### revalidate 설정 한눈에

```jsx
export const revalidate = 0; // SSR (매 요청마다)
export const revalidate = false; // SSG (빌드때 한번)
export const revalidate = 60; // ISR (60초마다)
("use client"); // CSR
// 아무것도 없음                    // SSR (기본값)
```

#### fetch 레벨로도 설정 가능

```jsx
// 페이지 안에서 fetch마다 다르게
const posts = await fetch("/api/posts", {
  next: { revalidate: 60 }, // ISR
});
const user = await fetch("/api/user", {
  cache: "no-store", // SSR
});
const config = await fetch("/api/config", {
  cache: "force-cache", // SSG
});
```

---

## 6. SSG/ISR 빌드 & 캐시

#### SSG 빌드 타이밍

```
npm run build 실행
     ↓
revalidate = false 페이지 발견
     ↓
그 자리에서 API 호출
     ↓
데이터 채워진 HTML 파일 생성
     ↓
S3 같은 곳에 배포
```

#### SSG 빌드 실패하면

```
빌드 실패 → 배포 자체 안 됨 ❌
기존 배포본 그대로 유지
```

```jsx
// 방어 코드 필수
async function Page() {
  const data = await fetch("/api/posts")
    .then((res) => res.json())
    .catch(() => []); // 에러나면 빈 배열로 fallback
  return <div>{data.map(...)}</div>;
}
```

#### ISR 캐시 이슈

```
EC2 재시작하면 캐시 날아감 ❌

해결책
1. Vercel → CDN에 자동 저장 ✅
2. Redis 캐시 서버 연결
3. S3에 캐시 저장

// CSR (S3+CloudFront)은 이 문제 없음
// EC2 없으니까
```

#### ISR vs SSG 선택 기준

```
데이터 절대 안 바뀜 + API 안정적 → SSG
데이터 가끔 바뀜 + API 불안정    → ISR (훨씬 안전)
데이터 자주 바뀜                  → SSR or CSR
```

---

## 7. 페이지 성격별 렌더링 선택

```
로그인 필요없는 페이지
메인 페이지    → ISR (1시간마다 갱신)
공지사항       → ISR
이벤트 페이지  → SSG
회사 소개      → SSG

로그인 필요한 페이지
마이페이지     → SSR or CSR
주문 내역      → SSR or CSR
대시보드       → SSR or CSR
```

---

## 8. 배포 플랫폼 비교

#### Vercel vs AWS Amplify

```
Vercel
✅ Next.js 만든 회사 (최적화 최고)
✅ Github 연결하면 자동 배포
✅ ISR 캐시 CDN 자동 관리
✅ 설정 거의 없음
❌ 팀원당 $20/월
❌ 트래픽 초과시 비용 폭발
❌ 한국 리전 없음

AWS Amplify
✅ AWS 인프라 이미 있으면 연동 쉬움
✅ 트래픽 많아도 선형 비용 (예측 가능)
✅ Github 연결하면 자동 배포 (Vercel이랑 거의 같음)
✅ 40% 더 저렴 (대규모)
❌ 일부 Next.js 기능 지원 늦음
❌ 예상치 못한 비용 나올 수 있음
```

#### 선택 기준

```
AWS 인프라 이미 쓰고 있음 → Amplify
Next.js 새 프로젝트 빠르게 → Vercel
소규모 / 사이드 프로젝트  → 둘 다 무료
```

---

## 9. 면접 핵심 답변

#### "Virtual DOM이 뭔가요?"

> "실제 DOM 조작 비용이 크기 때문에, 메모리에 가상 DOM을 만들어서 변경사항을 비교한 뒤 바뀐 부분만 실제 DOM에 반영하는 기술입니다."

#### "key를 index로 쓰면 안 되는 이유?"

> "Reconciliation이 key로 같은 컴포넌트를 식별하는데, index를 쓰면 앞/중간에 삽입할 때 key가 밀려서 전부 다른 컴포넌트로 인식합니다. input 같은 컴포넌트는 입력값도 초기화됩니다."

#### "React 18에서 뭐가 바뀌었나요?"

> "Concurrent Mode가 정식 출시되면서 Fiber 기반 우선순위 렌더링이 가능해졌습니다. useTransition, useDeferredValue가 추가되어 사용자 입력 같은 급한 작업과 무거운 렌더링을 분리할 수 있게 됐습니다."

#### "SSR→CSR 마이그레이션 왜 했나요?"

> "앱 웹뷰 서비스라 SEO가 필요없었고, SSR 서버 비용이 월 $1,000 이상이었습니다. CSR로 전환하면서 EC2를 제거하고 S3+CloudFront로 바꿔 비용을 88% 절감했고, CloudFront 캐싱으로 오히려 로딩 속도도 60% 개선됐습니다."

#### "Next.js에서 렌더링 어떻게 선택하나요?"

> "페이지 성격에 따라 다르게 가져갑니다. 개인화 데이터는 CSR, 자주 안 바뀌는 건 SSG, 주기적으로 바뀌는 건 ISR, 요청마다 달라지는 건 SSR을 씁니다."

---

## 핵심 요약

| 개념           | 한 줄 요약                                    |
| -------------- | --------------------------------------------- |
| Virtual DOM    | 메모리에서 미리 계산해서 바뀐 부분만 업데이트 |
| Reconciliation | Virtual DOM 비교해서 바뀐 부분 찾는 과정      |
| Fiber          | 렌더링 잘게 쪼개서 우선순위대로 처리          |
| CSR            | 브라우저가 다 함                              |
| SSR            | 요청마다 서버에서 HTML 만들어서 줌            |
| SSG            | 빌드때 미리 만들어놓음                        |
| ISR            | SSG인데 주기적으로 재생성                     |
