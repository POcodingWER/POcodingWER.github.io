---
layout: post
title: "[React] 스타일 라이브러리 styled-components stitches 비교"

subtitle: "styled-components stitches 비교 예제"

date: 2025-03-21 09:57:37
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/03/react_css_library.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - styled-components
  - stitches
  - 라이브러리
  - 비교
  - 예제
---

{% include post/react/contents.md %}

# 🎨 styled-components vs Stitches: CSS-in-JS 라이브러리 비교

React 생태계에서 인기 있는 두 가지 CSS-in-JS 솔루션인 styled-components와 Stitches를 비교해보겠습니다. 이 두 라이브러리는 컴포넌트 기반 스타일링을 제공하지만, 접근 방식과 특징에서 중요한 차이가 있습니다.

## 📊 기본 특성 비교

| 특성                   | styled-components   | Stitches                    |
| ---------------------- | ------------------- | --------------------------- |
| **📦 번들 크기**       | 약 12-15KB (gzip)   | 약 5-8KB (gzip)             |
| **⚡ 성능**            | 런타임 기반         | 사전 계산 가능한 원자적 CSS |
| **🎯 동적 스타일링**   | 런타임에 props 기반 | 변형(variants) 기반         |
| **🔍 TypeScript 지원** | 기본 지원           | 고급 타입 추론과 자동완성   |
| **🛠️ 테마 시스템**     | ThemeProvider       | createStitches 구성         |
| **📚 생태계 성숙도**   | 매우 성숙함         | 비교적 새로움               |
| **🚀 SSR 지원**        | 별도 설정 필요      | 기본 지원                   |
| **🎭 개발 경험**       | 자유로운 표현       | 구조화된 접근법             |

## 💻 기본 사용 예제 비교

### styled-components 예제

```jsx
import styled from "styled-components";

// 기본 스타일링
const Button = styled.button`
  background: ${(props) => (props.primary ? "blue" : "white")};
  color: ${(props) => (props.primary ? "white" : "blue")};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid blue;
  border-radius: 3px;
`;

// 컴포넌트 확장
const BigButton = styled(Button)`
  font-size: 1.5em;
  padding: 0.5em 1.5em;
`;

function App() {
  return (
    <div>
      <Button>기본 버튼</Button>
      <Button primary>주요 버튼</Button>
      <BigButton>큰 버튼</BigButton>
    </div>
  );
}
```

### Stitches 예제

```jsx
import { styled, createStitches } from "@stitches/react";

// 테마 및 유틸리티 설정
const { css, theme } = createStitches({
  theme: {
    colors: {
      primary: "blue",
      text: "white",
    },
    space: {
      1: "0.25em",
      2: "0.5em",
      3: "1em",
    },
    fontSizes: {
      1: "1em",
      2: "1.5em",
    },
  },
});

// 스타일 정의
const Button = styled("button", {
  margin: "$3",
  padding: "$1 $3",
  fontSize: "$1",
  borderRadius: "3px",
  border: "2px solid blue",

  // 변형(variants) 정의
  variants: {
    variant: {
      primary: {
        background: "$primary",
        color: "$text",
      },
      secondary: {
        background: "white",
        color: "$primary",
      },
    },
    size: {
      normal: {},
      big: {
        fontSize: "$2",
        padding: "$2 $3",
      },
    },
  },

  // 기본값 설정
  defaultVariants: {
    variant: "secondary",
    size: "normal",
  },
});

function App() {
  return (
    <div>
      <Button>기본 버튼</Button>
      <Button variant="primary">주요 버튼</Button>
      <Button size="big">큰 버튼</Button>
      <Button variant="primary" size="big">
        큰 주요 버튼
      </Button>
    </div>
  );
}
```

## 🔑 주요 차이점 설명

### 1. 스타일링 접근법

**styled-components**:

- 템플릿 리터럴을 사용한 CSS 작성
- props에 기반한 동적 스타일링이 직관적
- CSS-like 문법으로 전환이 쉬움

**Stitches**:

- 객체 기반 스타일 정의
- 사전 정의된 변형(variants) 시스템
- 성능에 최적화된 접근법

### 2. 성능 특성

**styled-components**:

- 런타임에 CSS 생성
- 컴포넌트가 렌더링될 때마다 props 평가

**Stitches**:

- 가능한 대부분의 CSS를 빌드 시간에 생성
- 원자적 CSS 클래스 생성으로 CSS 중복 감소
- 런타임 오버헤드 감소

### 3. 개발자 경험

**styled-components**:

- 넓은 커뮤니티와 많은 예제
- 직관적인 API
- 대부분의 React 프로젝트에서 쉽게 통합

**Stitches**:

- 강력한 TypeScript 통합
- 변형 시스템을 통한 구조화된 디자인 시스템
- 테마 토큰의 자동완성

## 📱 고급 기능 비교 예제

### styled-components: 글로벌 스타일과 테마

```jsx
import { createGlobalStyle, ThemeProvider } from "styled-components";
import styled from "styled-components";

// 글로벌 스타일
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans KR', sans-serif;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
  }
`;

// 테마 정의
const lightTheme = {
  background: "#ffffff",
  text: "#333333",
  primary: "#0070f3",
};

const darkTheme = {
  background: "#1a1a1a",
  text: "#f7f7f7",
  primary: "#3694ff",
};

// 테마에 의존하는 컴포넌트
const Card = styled.div`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <button onClick={() => setIsDarkMode(!isDarkMode)}>테마 전환</button>
      <Card>
        <h2>스타일된 카드</h2>
        <p>테마에 따라 스타일이 변경됩니다.</p>
      </Card>
    </ThemeProvider>
  );
}
```

### Stitches: 테마 및 유틸리티

```jsx
import { createStitches } from "@stitches/react";
import { useState } from "react";

// 스티치 설정
const { styled, createTheme, getCssText, globalCss } = createStitches({
  theme: {
    colors: {
      background: "#ffffff",
      text: "#333333",
      primary: "#0070f3",
      secondary: "#ff4081",
    },
    space: {
      1: "4px",
      2: "8px",
      3: "16px",
      4: "32px",
    },
    radii: {
      small: "4px",
      medium: "8px",
      large: "16px",
    },
    shadows: {
      small: "0 2px 4px rgba(0,0,0,0.1)",
      medium: "0 4px 8px rgba(0,0,0,0.1)",
    },
  },
  utils: {
    // 유틸리티 함수 정의
    marginX: (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
    paddingX: (value) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingY: (value) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
});

// 다크 테마 정의
const darkTheme = createTheme({
  colors: {
    background: "#1a1a1a",
    text: "#f7f7f7",
    primary: "#3694ff",
    secondary: "#ff6b9d",
  },
});

// 글로벌 스타일
const globalStyles = globalCss({
  "body, html": {
    margin: 0,
    padding: 0,
    fontFamily: "'Noto Sans KR', sans-serif",
    backgroundColor: "$background",
    color: "$text",
  },
});

// 컴포넌트 정의
const Card = styled("div", {
  backgroundColor: "$background",
  color: "$text",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "$medium",
  padding: "$3",
  boxShadow: "$small",

  // 변형(variants) 정의
  variants: {
    type: {
      elevated: {
        boxShadow: "$medium",
      },
      flat: {
        boxShadow: "none",
      },
    },
    size: {
      small: {
        paddingX: "$2",
        paddingY: "$1",
      },
      large: {
        paddingX: "$4",
        paddingY: "$3",
      },
    },
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  globalStyles();

  return (
    <div className={isDarkMode ? darkTheme : ""}>
      <button onClick={() => setIsDarkMode(!isDarkMode)}>테마 전환</button>
      <Card type="elevated">
        <h2>기본 카드</h2>
        <p>테마에 따라 스타일이 변경됩니다.</p>
      </Card>
      <Card type="flat" size="large">
        <h2>큰 플랫 카드</h2>
        <p>다양한 변형을 조합할 수 있습니다.</p>
      </Card>
    </div>
  );
}
```

## ⚖️ 장단점 요약

| 특성     | styled-components                                                                                                                                          | Stitches                                                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **장점** | 🌐 넓은 커뮤니티와 생태계<br>📚 풍부한 학습 자료와 예제<br>🧩 React Native 지원<br>🎨 CSS와 유사한 문법으로 친숙함<br>🔄 props를 통한 유연한 동적 스타일링 | ⚡ 뛰어난 런타임 성능<br>📦 작은 번들 크기<br>💪 강력한 TypeScript 통합<br>🧱 변형 시스템을 통한 일관된 디자인 시스템<br>🛠️ 테마 토큰과 유틸리티 함수                  |
| **단점** | 🐢 런타임 오버헤드로 인한 성능 제약<br>🏗️ 대규모 앱에서 번들 크기 증가<br>🔧 SSR 설정이 복잡할 수 있음<br>🧵 타입 안전성이 제한적                          | 🌱 상대적으로 작은 커뮤니티와 생태계<br>📊 객체 기반 API가 CSS 개발자에게 덜 직관적<br>🧪 네이티브 지원 부족<br>🔄 동적 스타일링이 styled-components만큼 유연하지 않음 |

## 🎯 용도별 추천

| 사용 사례                  | 추천 라이브러리   | 이유                             |
| -------------------------- | ----------------- | -------------------------------- |
| **대규모 엔터프라이즈 앱** | Stitches          | 성능 최적화와 디자인 시스템 통합 |
| **빠른 프로토타이핑**      | styled-components | 간편한 API와 친숙한 문법         |
| **디자인 시스템 개발**     | Stitches          | 변형과 테마 시스템의 강력한 지원 |
| **타입스크립트 프로젝트**  | Stitches          | 향상된 타입 안전성과 개발자 경험 |
| **소규모 팀/프로젝트**     | styled-components | 낮은 학습 곡선과 풍부한 자료     |

CSS-in-JS 라이브러리를 선택할 때는 프로젝트 요구사항, 팀의 익숙함, 성능 고려사항을 종합적으로 평가하는 것이 중요합니다. styled-components는 더 성숙하고 직관적인 반면, Stitches는 성능과 타입 안전성에 초점을 맞춘 현대적인 대안을 제공합니다.
