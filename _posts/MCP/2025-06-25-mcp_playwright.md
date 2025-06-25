---
layout: post
title: "[MCP] Playwright 사용해보기"

subtitle: "Playwright 사용해보고 테스트 해보기"

date: 2025-06-25 08:26:11

# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"
# header-style: text
catalog: true
header-mask: 0.4
header-img: "img/post/2025/04/test_environment.png"

# sitemap:
# changefreq: daily #스크랩 주기 daily | weekly | monthly
# priority: 1.0 # 스크랩 우선순위
# hidden: true

categories:
  - MCP

tags:
  - MCP
  - claude cursor mcp
  - mcp claude cursor
  - MCP 사용법
  - mcp 적용
  - cursor mcp 사용법
  - playwright
---

{% include post/mcp_contents.md %}

> MCP로 Claude에게 브라우저 조작 초능력을 부여해봅시다! 🎭

# Playwright MCP - Claude가 실제 브라우저를 조작하는 마법!

웹 개발자와 QA 엔지니어를 위한 궁극의 도구가 여기 있습니다! Playwright MCP는 Claude에게 실제 브라우저를 조작할 수 있는 초능력을 부여합니다. 이제 Claude가 직접 웹페이지를 클릭하고, 텍스트를 입력하고, 스크린샷을 찍고, 심지어 자동화 테스트 코드까지 생성할 수 있어요! ✨

## 🎯 Playwright MCP란?

Playwright MCP는 Microsoft의 Playwright 라이브러리를 Claude와 연결해주는 다리 역할을 합니다. 이를 통해 Claude는:

- **실제 브라우저 환경**에서 웹사이트를 테스트할 수 있어요
- **사람처럼** 웹페이지와 상호작용할 수 있어요
- **자동화 테스트 코드**를 실시간으로 생성할 수 있어요
- **시각적인 결과**를 스크린샷으로 확인할 수 있어요

## 🧰 주요 기능들

### 브라우저 조작 기능

| 기능                    | 설명                    | 사용 예시                       |
| ----------------------- | ----------------------- | ------------------------------- |
| `browser_navigate`      | 특정 URL로 이동         | 쇼핑몰 접속, 로그인 페이지 이동 |
| `browser_click`         | 페이지 요소 클릭        | 버튼 클릭, 링크 클릭            |
| `browser_type`          | 입력 필드에 텍스트 입력 | 검색어 입력, 폼 작성            |
| `browser_select_option` | 드롭다운에서 옵션 선택  | 카테고리 선택, 지역 선택        |
| `browser_drag`          | 드래그 앤 드롭 수행     | 파일 업로드, UI 재배치          |
| `browser_hover`         | 요소에 마우스 호버      | 툴팁 확인, 드롭다운 메뉴        |

### 분석 및 모니터링 기능

| 기능                       | 설명                      | 활용도                      |
| -------------------------- | ------------------------- | --------------------------- |
| `browser_snapshot`         | 페이지의 접근성 정보 캡처 | 페이지 구조 분석, 요소 찾기 |
| `browser_take_screenshot`  | 페이지 스크린샷 촬영      | 시각적 확인, 버그 리포트    |
| `browser_network_requests` | 네트워크 요청 목록 조회   | 성능 분석, API 호출 확인    |
| `browser_console_messages` | 콘솔 메시지 조회          | JavaScript 오류 확인        |
| `browser_wait_for`         | 특정 조건까지 대기        | 비동기 로딩 대기            |

### 고급 기능

| 기능                               | 설명                             | 장점                       |
| ---------------------------------- | -------------------------------- | -------------------------- |
| `browser_generate_playwright_test` | 수행한 작업을 테스트 코드로 생성 | 코드 자동 생성, 시간 절약  |
| `browser_handle_dialog`            | 브라우저 다이얼로그 처리         | alert, confirm 처리        |
| `browser_press_key`                | 키보드 키 입력                   | 단축키, 특수키 입력        |
| `browser_file_upload`              | 파일 업로드                      | 이미지, 문서 업로드 테스트 |

## 🧪 실제 테스트 결과

방금 직접 테스트해본 결과를 공유해드릴게요!

### 테스트 1: Google 검색 자동화 ✅

**시나리오**: Google에서 "Playwright 자동화 테스트" 검색

```
🎯 수행한 작업:
1. ✅ Google 홈페이지 접속 (https://google.com)
2. ✅ 페이지 구조 완벽 분석 (검색창, 버튼, 링크 등 모든 요소 인식)
3. ✅ 검색창에 "Playwright 자동화 테스트" 입력
4. ✅ Enter 키로 검색 실행
5. ✅ 검색 결과 페이지 완벽 분석 (10개 검색 결과, 관련 검색어, 페이지네이션 등)

🎉 결과: 완벽 성공! Claude가 실제 사람처럼 브라우저를 조작했어요.
```

### 테스트 2: 페이지 구조 분석 📊

Claude가 캡처한 Google 홈페이지 구조 (일부):

```yaml
# 접근성 스냅샷 결과
- search [ref=e38]:
    - generic [ref=e40]:
        - combobox "검색" [ref=e50] # 검색 입력창
        - button "Google 검색" [ref=e66] # 검색 버튼
        - button "I'm Feeling Lucky" [ref=e67] # 운수 버튼
- navigation [ref=e3]:
    - link "Gmail" [ref=e11]
    - link "이미지 검색" [ref=e13]
- contentinfo [ref=e79]:
    - link "광고" [ref=e83]
    - link "개인정보처리방침" [ref=e87]
```

**놀라운 점**:

- 페이지의 **모든 요소**를 정확히 인식
- 각 요소의 **접근성 정보**까지 상세하게 분석
- **참조 ID**를 통해 정확한 요소 타겟팅 가능

## ⚙️ 설정 방법

### 1. MCP 서버 설정

`mcp.json` 파일에 다음 설정을 추가하세요:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server@latest"]
    }
  }
}
```

### 2. Cursor에서 설정 (선택사항)

Cursor를 사용한다면 `.cursor-settings.json`에 추가:

```json
{
  "mcp": {
    "servers": {
      "playwright": {
        "command": "npx",
        "args": ["-y", "@executeautomation/playwright-mcp-server@latest"]
      }
    }
  }
}
```

### 3. 환경 변수 설정 (선택사항)

더 세밀한 제어를 원한다면:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server@latest"],
      "env": {
        "PLAYWRIGHT_BROWSER": "chromium",
        "PLAYWRIGHT_HEADLESS": "false",
        "PLAYWRIGHT_TIMEOUT": "30000"
      }
    }
  }
}
```

## 💡 실제 사용 시나리오

### 시나리오 1: E2E 테스트 자동화 🛒

```
🎯 상황: 온라인 쇼핑몰의 전체 구매 플로우 테스트

💬 요청: "우리 쇼핑몰에서 상품 검색부터 결제까지 전체 플로우를 테스트해줘."

🤖 Claude의 작업:
1. 홈페이지 접속 및 로딩 시간 측정
2. 검색창에 "무선 이어폰" 입력
3. 검색 결과에서 첫 번째 상품 클릭
4. 상품 상세 페이지에서 옵션 선택
5. 장바구니 추가 버튼 클릭
6. 장바구니 페이지로 이동
7. 결제하기 버튼 클릭
8. 각 단계별 스크린샷 촬영
9. 발견된 문제점 리포트 생성

📊 결과: 총 7단계 중 6단계 성공, 1개 UI 버그 발견!
```

### 시나리오 2: 반응형 디자인 테스트 📱

```
🎯 상황: 웹사이트가 다양한 화면 크기에서 잘 작동하는지 확인

💬 요청: "우리 웹사이트를 데스크톱, 태블릿, 모바일 크기로 테스트해줘."

🤖 Claude의 작업:
1. 브라우저 크기를 1920x1080 (데스크톱)으로 설정
2. 메인 페이지 스크린샷 촬영
3. 브라우저 크기를 768x1024 (태블릿)으로 변경
4. 동일 페이지 스크린샷 촬영
5. 브라우저 크기를 375x667 (모바일)으로 변경
6. 최종 스크린샷 촬영
7. 각 화면 크기별 레이아웃 분석 및 개선사항 제안

📱 결과: 모바일에서 메뉴 버튼이 너무 작아서 개선 필요!
```

### 시나리오 3: 자동화 테스트 코드 생성 ⚡

```
🎯 상황: 수동으로 테스트한 내용을 재사용 가능한 코드로 변환

💬 요청: "방금 테스트한 내용을 Playwright 테스트 코드로 만들어줘."

🤖 Claude가 생성한 코드:
```

```javascript
import { test, expect } from "@playwright/test";

test("구글 검색 자동화 테스트", async ({ page }) => {
  // 1. Google 홈페이지 접속
  await page.goto("https://www.google.com");

  // 2. 페이지 로딩 확인
  await expect(page).toHaveTitle(/Google/);

  // 3. 검색창에 텍스트 입력
  const searchBox = page.locator('[name="q"]');
  await searchBox.fill("Playwright 자동화 테스트");

  // 4. 엔터키로 검색 실행
  await searchBox.press("Enter");

  // 5. 검색 결과 페이지 로딩 대기
  await page.waitForSelector("#search");

  // 6. 검색 결과 존재 확인
  const searchResults = page.locator("#search .g");
  await expect(searchResults.first()).toBeVisible();

  // 7. 첫 번째 검색 결과 클릭
  await searchResults.first().locator("h3").click();

  // 8. 새 페이지 로딩 확인
  await page.waitForLoadState("networkidle");

  console.log("✅ 구글 검색 테스트 완료!");
});
```

### 시나리오 4: 웹사이트 접근성 검사 ♿

```
🎯 상황: 웹사이트가 장애인 사용자도 잘 사용할 수 있는지 확인

💬 요청: "우리 웹사이트의 접근성을 체크해줘."

🤖 Claude의 분석:
✅ 좋은 점:
- 모든 이미지에 alt 태그 존재
- 적절한 heading 구조 사용
- 키보드 네비게이션 가능

❌ 개선 필요:
- 버튼과 배경의 색상 대비 부족 (3.2:1 → 4.5:1 필요)
- 폼 필드에 label 연결 누락
- focus indicator 스타일 부재

📋 개선 제안:
1. CSS에서 button 색상을 #0066cc로 변경
2. 모든 input에 proper label 연결
3. focus-visible 스타일 추가
```

## 🚀 고급 활용 팁

### 1. 조건부 대기 활용

```javascript
// 특정 텍스트가 나타날 때까지 대기
await page.waitForText("로딩 완료");

// 특정 요소가 사라질 때까지 대기
await page.waitForSelector(".loading-spinner", { state: "hidden" });

// 네트워크가 안정될 때까지 대기
await page.waitForLoadState("networkidle");
```

### 2. 다중 브라우저 테스트

```
💬 요청: "Chrome, Firefox, Safari에서 모두 테스트해줘."

🤖 Claude가 순차적으로:
1. Chromium 브라우저에서 테스트
2. Firefox 브라우저에서 동일한 테스트
3. WebKit (Safari) 브라우저에서 테스트
4. 브라우저별 차이점 리포트 생성
```

### 3. 성능 모니터링

```
🎯 요청: "페이지 로딩 중 네트워크 요청을 분석해줘."

📊 Claude의 분석 결과:
- 총 47개 네트워크 요청 발생
- 가장 느린 요청: large-image.jpg (2.3초)
- 불필요한 요청: old-analytics.js (더 이상 사용 안 함)
- 최적화 제안: 이미지 압축, 불필요한 스크립트 제거
```

## 🎁 Playwright MCP의 특별한 장점

### 1. **실시간 상호작용** 🔄

- Claude와 대화하면서 **실시간**으로 테스트 수행
- 중간에 **방향 수정**이나 **추가 테스트** 요청 가능
- **즉석에서** 다른 시나리오로 전환 가능

### 2. **시각적 확인** 👀

- 모든 작업의 **스크린샷** 자동 생성
- **비교 이미지**로 변경사항 추적
- **시각적 회귀 테스트** 가능

### 3. **자동 코드 생성** ⚡

- 수행한 모든 작업을 **Playwright 코드**로 변환
- **즉시 실행 가능**한 테스트 스위트 생성
- **CI/CD 파이프라인**에 바로 적용 가능

### 4. **다양한 브라우저 지원** 🌐

- **Chromium, Firefox, Safari** 모두 지원
- **헤드리스/헤드풀** 모드 모두 가능
- **모바일 에뮬레이션** 지원

### 5. **상세한 디버깅 정보** 🔍

- 각 단계별 **상세 로그**
- **네트워크 요청/응답** 분석
- **콘솔 에러** 자동 캡처

## 🔥 실무 활용 사례

### Case 1: 스타트업 QA 자동화

```
Before: 수동 테스트로 하루 8시간 소요
After: Claude + Playwright MCP로 30분만에 완료
결과: 1500% 효율성 향상! 🚀
```

### Case 2: 대규모 이커머스 회귀 테스트

```
Before: 100개 테스트 케이스 실행에 일주일 소요
After: Claude가 자동으로 테스트 스크립트 생성 후 병렬 실행
결과: 하루만에 완료, 신규 버그 15개 발견 🐛
```

### Case 3: 접근성 감사

```
Before: 접근성 전문가 고용 비용 월 500만원
After: Claude가 자동으로 접근성 검사 수행
결과: 비용 90% 절감, 더 자주 검사 가능 ♿
```

## 🎯 결론

Playwright MCP는 단순한 테스트 도구가 아닙니다. **Claude와 함께하는 웹 개발의 새로운 패러다임**이에요!

### 이런 분들께 강력 추천! 👍

- ✅ **웹 개발자**: 빠른 기능 테스트와 디버깅
- ✅ **QA 엔지니어**: 자동화 테스트 스크립트 생성
- ✅ **프로덕트 매니저**: 사용자 시나리오 검증
- ✅ **디자이너**: 반응형 디자인 테스트
- ✅ **스타트업**: 리소스 절약하면서 품질 확보

### 마지막 한마디 💬

"테스트는 이제 Claude에게 맡기고, 여러분은 더 창의적인 일에 집중하세요!"

지금 바로 Playwright MCP를 설정하고 웹 개발의 새로운 경험을 시작해보세요! 🚀✨
