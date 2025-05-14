---
layout: post
title: "[FRONT] Story book설치 및 사용하기"

subtitle: "스토리북을 적용해보자"

date: 2024-10-04 15:25:17
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1004/storybook-benner.jpeg"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - StoryBook
tags:
  - front
  - UI
  - UX
  - story-book
  - storybook
  - 스토리북 설치
  - 스토리북
  - React stroybook
---

{% include post/front_contents.md %}

> 스토리북을 사용하여 ui 작업 효율을 높여보자 <br/>
> 참고문서 <br/> [ 《 storybook 》 ](https://rust-kr.org/pages/install/)

**스토리북(Storybook)**은 UI 구성 요소를 독립적으로 개발하고 테스트할 수 있는 오픈 소스 도구입니다. 주로 React, Vue, Angular와 같은 프론트엔드 프레임워크와 함께 사용되며, 개발자가 UI 컴포넌트를 시각적으로 문서화하고, 개발 및 테스트를 쉽게 할 수 있도록 도와줍니다. 스토리북을 사용하면 컴포넌트를 다양한 상태와 조합으로 표시할 수 있으며, 팀원들과 쉽게 공유할 수 있는 환경을 제공합니다.

## 설치 방법

1. **Node.js 설치**: 스토리북을 사용하기 위해 Node.js가 설치되어 있어야 됨. [Node.js 공식 웹사이트](https://nodejs.org/)에서 최신 버전을 다운로드하여 설치하세요.

2. **프로젝트 생성**:

   ```bash
   npx create-react-app my-app
   cd my-app
   ```

3. **스토리북 설치**:
   다음 명령어를 사용하여 스토리북을 설치합니다.

   ```bash
   npx sb init
   ```

4. **스토리북 실행**:
   설치가 완료되면, 스토리북을 실행하여 UI 컴포넌트를 확인할 수 있습니다.

   ```bash
   npm run storybook
   ```

5. **브라우저에서 확인**: 스토리북이 실행되면, 브라우저에서 `http://localhost:6006`에 접속하여 UI 구성 요소를 확인할 수 있습니다.

이렇게 스토리북을 설치하고 실행하여 UI 컴포넌트를 개발할 수 있습니다. 추가적인 구성 및 플러그인 설치는 공식 문서를 참고하시면 됩니다.

## 세팅 Setting

#### Storybook 설정

`.storybook/preview.tsx`에서 story에 적용될 공통 스타일, viewport, i18n 등을 설정

```tsx
// 폰트, 기본 css import
import '../src/styles/font.scss';
import '../src/styles/index.scss';
const preview: Preview = {
  ...
}
```

#### Layout 설정

> [ 《 Layout 》 ](https://storybook.js.org/docs/configure/story-layout/)

스토리북 화면에서 스토리가 보여지는 방식을 설정합니다.

- centered : 화면의 정중앙에 위치
- fullscreen : 화면 크기만큼 가로 세로 꽉 채움
- padded(default) : 패딩이 적용됨

```tsx
//.storybook/preview.tsx

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
  },
};
```

#### Viewport 설정

> [ 《 Viewport 》 ](https://storybook.js.org/docs/essentials/viewport)

viewport를 프로젝트에 맞게 설정합니다.

defaultViewprot 는 story를 볼때 사용할 기본 viewport를 설정합니다.
viewports에 정의된 key 값과 반드시 매칭되야 합니다.

```tsx
//.storybook/preview.tsx

const preview: Preview = {
  parameters: {
    viewport: {
      // 👇 viewport 설정할 디바이스 값 정의
      viewports: {
        SmallMobile: {
          name: "320 x 568",
          styles: {
            width: "320px",
            height: "568px",
          },
          type: "mobile",
        },
        Mobile: {
          name: "360 x 740",
          styles: {
            width: "360px",
            height: "740px",
          },
          type: "mobile",
        },
        LargeMobile: {
          name: "414 x 896",
          styles: {
            width: "414px",
            height: "896px",
          },
          type: "mobile",
        },
      },
      defaultViewport: "Mobile",
    },
  },
};
```

#### i18n 설정

> [ 《 i18n 》 ](https://storybook.js.org/docs/essentials/viewport)

i18n 기본 설정 및 export

1. 사용할 언어팩 설정 및 i18n 기본 설정

   ```ts
   // i18n/index.ts

   import i18n from "i18next";
   import { initReactI18next } from "react-i18next";

   import en from "./locales/en.json";
   import ko from "./locales/ko.json";

   const resources = {
     en: {
       translation: en,
     },
     ko: {
       translation: ko,
     },
   };

   i18n.use(initReactI18next).init({
     resources,
     lng: "ko",
     fallbackLng: "ko",
     interpolation: {
       escapeValue: false,
     },
   });

   export default i18n;
   ```

1. storybook에 i18n 적용

   ```tsx
   //.storybook/preview.tsx

   import { I18nextProvider } from 'react-i18next';
   import i18n from '../src/i18n';


   const preview: Preview = {
   ...
   }

   export default preview;


   // 👇 i18Provider로 story 감싸기
   const withI18next = (Story: any, context: any) => {
   const { locale } = context.globals;

   // 👇 메뉴에서 선택한 언어가 바뀔 때 바뀐 언어로 적용
   useEffect(() => {
      i18n.changeLanguage(locale);
   }, [locale]);

   return (
      <Suspense fallback={<div>loading translations...</div>}>
         <I18nextProvider i18n={i18n}>
         <Story />
         </I18nextProvider>
      </Suspense>
   );
   };

   export const decorators = [withI18next];

   // 👇 storybook 툴바에 언어 변경 메뉴 생성
   export const globalTypes = {
   locale: {
      name: 'Locale', // 메뉴 이름
      description: 'Internationalization locale', // 메뉴 설명
      toolbar: {
         icon: 'globe',
         items: [
         { value: 'en', title: 'English' },
         { value: 'ko', title: 'Korean' },
         ],
      },
   },
   };
   ```

#### router 설정

> [ 《 router 》 ](https://stackoverflow.com/questions/58909666/storybook-w-react-router-you-should-not-use-link-outside-router)  
> [《 memoryrouter 》](https://reactrouter.com/en/main/router-components/memory-router)  
> [《 decorators 》](https://storybook.js.org/docs/writing-stories/decorators?renderer=vue)

story를 작성하는 컴포넌트에 `useNavigation` , `useLocation` 같은 router 관련 기능을 사용한다면 추가 설정이 필요합니다.

```tsx
//.storybook/preview.tsx

import type { Preview } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const preview: Preview = {
  ...
};

// 👇 decorator를 사용해 MemoryRouter로 Story를 감싸기
export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={['/']}>
      <Story />
    </MemoryRouter>
  ),
];

export default preview;
```

#### env 설정

> [《 env 》](https://storybook.js.org/docs/api/main-config/main-config-env)

커스텀 storybook 환경 변수를 정의할 수 있습니다.

실제 application에서 사용하는 환경 변수의 값과 storybook에서 사용하는 환경 변수의 값이 다를 때 이를 활용할 수 있습니다.

```ts
//.storybook/main.ts

import type { StorybookConfig } from '@storybook/react-vite';

// 👇 이미지 base url 환경변수 값 수정
const config: StorybookConfig = {
 ...,
  env: (config) => ({
    ...config,
    VITE_APP_IMAGE_BASE_URL: '/images',
  }),
};

export default config;
```

## 사용 Using

#### 컴포넌트 story 작성

> [《 컴포넌트 story 》](https://storybook.js.org/docs/get-started/whats-a-story)

story 작성을 위해 UI와 로직을 분리해 UI 컴포넌트로 설계해야 합니다.  
UI 컴포넌트에 필요한 데이터는 props로 전달해야 합니다.

```tsx
//CustomBtn.tsx
import React, { ReactNode } from "react";
import { Button } from "@nextui-org/react";
import {
  color,
  radius,
  size,
  spinnerPlacement,
  variant,
} from "@/types/TypeCommon";

interface ButtonProps {
  children?: ReactNode;
  isDisabled?: boolean;
  size?: size;
  radius?: radius;
  color?: color;
  variant?: variant;
  isLoading?: boolean;
  fullWidth?: boolean;
  spinnerPlacement?: spinnerPlacement;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const CustomBtn = (props: ButtonProps) => {
  return (
    <Button
      className={props.className}
      isDisabled={props.isDisabled}
      color={props.color || "secondary"}
      size={props.size}
      radius={props.radius}
      variant={props.variant}
      isLoading={props.isLoading}
      fullWidth={props.fullWidth}
      spinnerPlacement={props.spinnerPlacement}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};
```

story metadata를 작성합니다.
story별로 컴포넌트에 props로 전달되는 데이터의 값을 args 객체 안에 추가합니다

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CustomBtn } from "../CustomBtn";

const meta = {
  title: "Example/Button",
  component: CustomBtn,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof CustomBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Button",
  },
};
```

![](/img/post/2024/1004/storybook.png){: #magnific}

추가한 항목과 `Primary` `Secondary` `Large` `Small` 항목에 나타나며
`Docs`에서 커스텀할수있습니다.

#### 페이지 story 작성

> [《 컴포넌트 story 》](https://storybook.js.org/docs/api/csf#custom-render-functions)

render 함수를 사용해 페이지 story에서 렌더링할 화면을 구성함

```tsx
//Home.stories.tsx

import type { Meta, StoryObj } from "@storybook/react";
import { Layout } from "./Layout";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// This story uses a render function to fully control how the component renders.
export const Example: Story = {
  render: () => (
    <Layout>
      <header>
        <h1>Example</h1>
      </header>
      <article>
        <MyComponent />
      </article>
    </Layout>
  ),
};
```
