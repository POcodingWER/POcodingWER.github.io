---
layout: post
title: "[React] stagewise 사용법"

subtitle: "브라우저 창에서 stagewise ai 연동하기"

date: 2025-06-04 09:13:38
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/06/stagewise.gif"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - stagewise
  - stagewise 사용법
  - 스테이지위즈 사용법
  - 브라우저 창에서 AI 연동
  - AI-powered Code Editor
  - Eyesight for your AI-powered Code Editor
---

{% include post/react/contents.md %}

---

![](/img/post/2025/06/stagewise.gif){: width="720" height="405"}

# 위 이미지 처럼 브라우저에서 프롬프트를 사용해서 바로 변경할수 있는 에디터가 있음

## Stagewise란?

Stagewise는 브라우저에서 직접 AI 코드 에디터(Cursor, Github Copilot, Windsurf)와 상호작용할 수 있게 해주는 오픈소스 도구입니다. 주요 특징은 다음과 같습니다:

- 💬 DOM 요소에 직접 코멘트를 달 수 있음
- 🧠 실제 컨텍스트를 Windsurf에 전송
- ⚡ 파일을 수동으로 선택하는 시간 절약
- 30초 만에 설정 가능하고, 첫 프롬프트부터 바로 작동
- React, Next.js, Vue, Nuxt.js 등 주요 프레임워크 지원

## 지원하는 AI 에이전트

| **에이전트**    | **지원 여부** |
| --------------- | ------------- |
| Cursor          | ✅            |
| Windsurf        | ✅            |
| GitHub Copilot  | 🚧 개발 중    |
| 기타 에이전트들 | ❌            |

## 설치 방법

### VS Code 마켓플레이스에서 설치하기

1. VS Code 마켓플레이스에서 'stagewise' 검색
2. 현재 버전: v0.4.1
3. 설치 후 통계:
   - ⭐ Stars: 2.9k
   - 💬 Discord: 31명 온라인
   - 📦 크기: 1.1MB
   - 📅 마지막 업데이트: 2025-06-04
   - ⬇️ 다운로드: 31만 50회

#### 주요 기능

- AI 코드 에디터와 브라우저 연동
- 실시간 코드 수정 및 프리뷰
- 다양한 프레임워크 지원
- 커스텀 플러그인 시스템

#### 시스템 요구사항

- VS Code 버전: 1.60.0 이상
- Node.js 버전: 14.0.0 이상
- 지원 운영체제: Windows, macOS, Linux

### React 프로젝트에서 설치하기

1. 패키지 설치:

```bash
npm install @stagewise/toolbar-react
```

2. 메인 엔트리 파일(예: src/main.tsx)에 다음 코드 추가:

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import "./index.css";

// 메인 앱 렌더링
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// 툴바 설정
const toolbarConfig = {
  plugins: [], // 커스텀 플러그인 추가 가능
};

// 툴바 초기화
document.addEventListener("DOMContentLoaded", () => {
  const toolbarRoot = document.createElement("div");
  toolbarRoot.id = "stagewise-toolbar-root";
  document.body.appendChild(toolbarRoot);

  createRoot(toolbarRoot).render(
    <StrictMode>
      <StagewiseToolbar config={toolbarConfig} />
    </StrictMode>
  );
});
```

### Next.js 프로젝트에서 설치하기

1. 패키지 설치:

```bash
npm install @stagewise/toolbar-next
```

2. 루트 레이아웃 파일(src/app/layout.tsx)에 추가:

```typescript
import { StagewiseToolbar } from "@stagewise/toolbar-next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StagewiseToolbar
          config={{
            plugins: [], // 커스텀 플러그인 추가 가능
          }}
        />
        {children}
      </body>
    </html>
  );
}
```

## 주의사항

- 여러 Cursor 창이 열려있으면 툴바가 잘못된 창으로 프롬프트를 보낼 수 있습니다.
- Stagewise 사용 시에는 하나의 Cursor 창만 열어두는 것을 권장합니다.

## 커스텀 플러그인 만들기

플러그인을 통해 추가 기능을 구현할 수 있습니다:

```typescript
const stagewiseConfig = {
  plugins: [
    {
      name: "custom-plugin",
      description: "컴포넌트에 대한 추가 컨텍스트 제공",
      shortInfoForPrompt: () => {
        return "선택된 요소에 대한 컨텍스트 정보";
      },
      mcp: null,
      actions: [
        {
          name: "커스텀 액션",
          description: "커스텀 액션 예시",
          execute: () => {
            window.alert("커스텀 액션 실행!");
          },
        },
      ],
    },
  ],
};
```

## 라이선스

- AGPL-3.0 라이선스로 제공됩니다.
- 상업적 사용이나 엔터프라이즈 사용을 위해서는 별도 문의가 필요합니다.
- 문의: sales@stagewise.io

## 커뮤니티 및 지원

- Discord 커뮤니티 참여 가능
- GitHub Issues를 통한 개발 지원
- 버그 리포트 및 새로운 아이디어 제안 가능
