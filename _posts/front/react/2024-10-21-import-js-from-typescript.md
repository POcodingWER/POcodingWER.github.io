---
layout: post
title: "[React] Javascript 파일을 Typescript Import해보자"

subtitle: "js 모듈파일을 ts로 사용하기"

date: 2024-10-21 09:57:08
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1017/SWC.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true

tags:
  - front
  - Compiler
  - 컴파일러
  - SWC
  - Speedy Web Compiler
---

{% include post/react/contents.md %}

---

## 이슈

js로 작성된 파일을 Import해야되는 상황이 생겼다. js로 바로 Import하면 될줄알았는데 역시 안되었다. 잘 정리해서 공유!

### npm library 설치할떄

```bash
npm install @types/[filename]
```

npm으로 외부 라이브러리를 가져올 때는 쉽게 @types를 붙이면 node_modules/@types에 d.ts 파일이 생성됩니다.

예를 들어 qrcode.js를 npm으로 가져온다고 했을 때, qrcode와 함께 @types/qrcode를 install 합니다.

### npm library install

- 해당 js파일에 module.export를 추가합니다.
- d.ts 파일을 만듭니다.
- Typescript에서 호출합니다.

다음 예제를 통해 사용법을 익혀보겠습니다. js 파일을 만들고

```js
//test.js

function test1() {
  return test2("테스트코드 1");
}

function test2(str) {
  return "테스트코드 2" + str;
}

module.exports = {
  test1,
  test2,
};
```

다음은 `d.ts`파일 만들어서 적용

```ts
//test.d.ts 이름이꼭 Test일필요는없음
import "./test.js";

declare function test1(): string;
declare function test2(str): string;
```

사용필요한곳에서 import해서 작용하면됩니다.
**import 할 때는 d.ts 경로**를 입력하면 됩니다.

```tsx
import * as temp from './test';

ngOnInit(){
  console.log(temp.test1(), temp.test2('this.is test'));
}
```
