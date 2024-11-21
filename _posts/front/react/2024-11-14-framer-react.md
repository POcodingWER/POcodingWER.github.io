---
layout: post
title: "[React] Framer React 사용해보기"

subtitle: "Framer React"

date: 2024-11-14 09:08:38
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1114/1.gif"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
liquid: false
categories:
  - React Guide
tags:
  - React
  - Framer React
  - 프레이머 리엑트
  - 프레이머 리엑트 예제
  - 리엑트 애니메이션 예제
  - 리엑트 애니메이션 라이브러리
---

{% include post/react/contents.md %}

---

## Framer React?

Framer React는 Framer라는 디자인 및 프로토타이핑 툴과 React 라이브러리를 통합하여 인터랙티브 웹 인터페이스를 구축하는 데 유용한 개발 도구입니다. Framer는 일반적으로 디자이너와 개발자들이 인터랙티브하고 모션이 포함된 UI 프로토타입을 제작하는 데 많이 사용되며, Framer React를 통해 리액트 기반의 코드로 쉽게 전환할 수 있어 개발 과정이 원활해집니다.
CSS 애니메이션과 Framer React에서 사용하는 JavaScript 기반 애니메이션은 각각의 처리 방식과 성능에 차이가 있습니다. 이를 비교하여 설명드리겠습니다.

### CSS 애니메이션

CSS 애니메이션은 **GPU 가속**을 활용하는 방식으로, 주로 **transform**이나 **opacity**와 같은 속성에 사용될 때 GPU에서 처리가 되어 애니메이션이 부드럽게 실행됩니다. CSS 애니메이션은 브라우저에서 최적화되어 있기 때문에 가볍고 성능이 우수하며, 복잡하지 않은 UI에 적합합니다. 특히 모바일 디바이스에서 성능 면에서 유리한 점이 많습니다.

- **장점**: CPU 사용량이 적고 GPU 가속으로 부드럽게 동작함. 단순 애니메이션에 적합하며, 코드도 간단.
- **단점**: 복잡한 시퀀스나 제어가 필요할 때는 JavaScript만큼 유연하지 않으며, 인터랙션이 제한적.

### Framer React (JavaScript 기반 애니메이션)

Framer React는 **JavaScript와 React**를 기반으로 하여 **Framer Motion**과 같은 라이브러리를 통해 애니메이션을 제어합니다. JavaScript 기반 애니메이션은 복잡한 시퀀스와 상태 제어가 가능하며, 다양한 이벤트와 조건에 반응하는 애니메이션을 구현할 수 있습니다. JavaScript를 사용하면 애니메이션 로직을 세밀하게 커스터마이징할 수 있어서 복잡한 UI와 상호작용이 많은 애니메이션에 적합합니다.

- **장점**: 이벤트나 상태 변화에 반응하는 복잡한 애니메이션을 쉽게 구현할 수 있으며, 조건에 따라 애니메이션을 세밀하게 조정할 수 있음.
- **단점**: JavaScript 실행 시 CPU를 사용하기 때문에 복잡한 애니메이션이 많을 경우 성능 저하가 발생할 수 있음. CSS에 비해 상대적으로 성능 최적화가 어려움.

### 요약

CSS 애니메이션은 성능 면에서 효율적이고, 단순한 애니메이션에는 훌륭한 선택입니다. 반면에 Framer React는 JavaScript를 기반으로 한 애니메이션 제어로 더 높은 유연성을 제공하지만 성능 최적화가 중요해집니다. 프로젝트의 요구 사항에 따라 두 방식을 적절히 선택하는 것이 좋습니다. 예를 들어, 간단한 애니메이션은 CSS로 구현하고, 복잡한 상호작용이 필요한 애니메이션은 Framer React를 활용하는 식으로 혼합하여 사용하는 방법이 유용할 수 있습니다.

## 예제

### 1.설치

```bash
npm install framer-motion
```

### 2. 예제 코드

> 참조 문서  
> [https://egghead.io/lessons/react-link-complex-animations-together-with-variants-from-framer-motion](https://egghead.io/lessons/react-link-complex-animations-together-with-variants-from-framer-motion) > {% raw %}

```jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [isMoved, setIsMoved] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <motion.div
        animate={{ x: isMoved ? 200 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: 100,
          height: 100,
          backgroundColor: "blue",
        }}
        onClick={() => setIsMoved(!isMoved)}
      />
    </div>
  );
}

export default App;
```

{% endraw %}

![](/img/post/2024/1114/1.gif)
`motion.div`를 사용하여 애니메이션을 정의합니다. `animate` 속성에서 `x` 값을 설정해 isMoved 상태에 따라 위치가 변경되도록 하고, `transition`으로 애니메이션의 지속 시간을 설정합니다. 사각형을 클릭하면 위치가 변경되는 애니메이션을 볼 수 있음.
사용후기는 너무 만족 우선은 `css`보다 쉬운거같다 `motion.div` 생성후에 좌표값등을 설정해주면 애니메이션이 자동으로 실행된다.

## 마무리

아직 많이 사용해보지 않아서 더 많은 예제를 찾아보고 프로젝트에 적용해보자
