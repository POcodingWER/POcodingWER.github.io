---
layout: post
title: "[Blog] google indexing api 자동색인 처리해보자"

# subtitle: " "

date: 2024-10-30 21:05:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1030/1.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - Blog

tags:
  - 구글색인
  - 구글 자동색인
  - 사이트맵
  - 구글 색인
  - 구글 자동색인
  - 구글 색인 api
  - google indexing api
  - google indexing
  - robots
  - robots.txt
  - sitemap.xml
  - google search console
  - 구글 검색 콘솔
  - console cloud
  - google console cloud
---

{% include post/blog_contents.md %}

## 이슈

robots.txt사용하고 sitemap.xml 사용하는데 구글 색인이 안되는 이슈가 있었다. 아니무슨 150페이지가 다되어가는데 색인 완료된거는 20개도안되고 점점 화도나고 개빢쳐서 자동으로 돌려야겠다 생각해서 찾아봤는데 정보도없음 그냥 수동으로 색인요청하라는데 이건 쫌아니지 싶다. 그래서 대충 node.js로 자동색인 요청하는 api를 만들어서 돌려보았다.

## google indexing api 란?

구글의 **인덱싱 API**는 사이트에 새 콘텐츠가 추가되거나 기존 콘텐츠가 수정될 때 이를 구글에 바로 알리고 인덱싱을 요청할 수 있는 API입니다. 특히 구글에서는 인덱싱 API를 주로 **구인 게시판이나 라이브 이벤트 관련 페이지**와 같이 콘텐츠의 변경이 빈번하고 즉각적인 노출이 필요한 웹사이트에 사용하길 권장합니다. 이를 통해 구글 검색에 훨씬 빠르게 반영될 수 있는 장점이 있습니다.

### 인덱싱 API 사용 전 해야되는것들

1. **구글 서치 콘솔 설정**: 먼저, 사이트가 구글 서치 콘솔에 등록되어 있어야 합니다.
2. **API 사용 설정**: 구글 클라우드 플랫폼에서 프로젝트를 생성한 후, 인덱싱 API를 활성화합니다.
3. **서비스 계정 및 권한 설정**: 서비스 계정을 만들어 사이트에 대한 인덱싱 API 접근 권한을 부여합니다.
4. **API 호출**: 새 페이지 생성, 업데이트, 삭제와 같은 이벤트에 따라 API 요청을 보내면 됩니다. 이를 위해 HTTP POST 요청으로 URL을 전달합니다.

서치콘솔이랑 이것저럿은 되어있고 2번부터 하면되는데 다들 글읽는거 안좋아하니 사진으로 바로바로 넘겨가면서 진행함
참고로 일 200api호출만 무료로알고있습니다.

#### 1. 구글 서치 콘솔 설정

[https://console.cloud.google.com/](https://console.cloud.google.com/)
api키 발급을위해 해야됨

1. 프로젝트부터 만들자
   ![](/img/post/2024/1030/1.png)
1. 새 프로젝트 클릭
   ![](/img/post/2024/1030/3.png)
1. 이름 입력 만들기
   ![](/img/post/2024/1030/4.png)
1. 햄버거 누르고 -> IAM 및 관리자 -> 서비스 계정 클릭
   ![](/img/post/2024/1030/5.png)
1. 서비스 계정 만들기
   ![](/img/post/2024/1030/2.png)
1. 이것저것 적고 완료
   ![](/img/post/2024/1030/6.png)
   ![](/img/post/2024/1030/7.png)
1. 키 만들기
   ![](/img/post/2024/1030/8.png)
1. 키 만들기 클릭 **파일이 만들어지는데 이거 키중요하니깐 꼭간직하고 잊어버리지말기**
   ![](/img/post/2024/1030/9.png)
   `**파일이 만들어지는데 이거 키중요하니깐 꼭간직하고 잊어버리지말기**`
1. indexing api 검색 후 활성화
   ![](/img/post/2024/1030/10.png)
   ![](/img/post/2024/1030/11.png)

#### 2.search console IAM등록

[구글 서치 콘솔 https://search.google.com/search-console](https://search.google.com/search-console)
search console 들어가서 IAM 아이디연결 하면 이제 api 사용할수있음

1. 설정 -> 사용자 및 권한 -> 사용자추가 -> 위에 1-6번에서만든 id넣어주고 (`만들때 소유주로만들어주셈`)
   ![](/img/post/2024/1030/12.png)

#### 3. api 호출

네, 처음부터 차근차근 진행해보겠습니다.

1. 먼저 프로젝트 폴더를 생성하고 초기화합니다:

```bash
mkdir openai-indexing-project
cd openai-indexing-project
```

2. npm 초기화 및 필요한 패키지 설치:

```bash
npm init -y
npm install google-auth-library axios xml2js
```

3. 필요한 폴더 구조 생성:

```bash
mkdir config
mkdir src
```

4. 각 파일 생성:

```bash
touch src/index.js
```

위의 명령어들을 실행하면 다음과 같은 구조가 만들어집니다:

```
openai-indexing-project/
├── node_modules/
├── package.json
├── package-lock.json
└── src/
    └── index.js
```

5. 벌써 프로젝트 구조가 완성 이제 코드 돌려보자

```js
const axios = require("axios");
const xml2js = require("xml2js");
async function getSitemapUrls() {
  try {
    const response = await axios.get(
      "https://pocodingwer.github.io/sitemap.xml"
    );
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    const urls = result.urlset.url.map((entry) => entry.loc[0]);

    console.log("사이트맵에서 발견된 URL 수:", urls.length);
    console.log("발견된 URL들:", urls);
    return urls;
  } catch (error) {
    console.error("사이트맵 파싱 에러:", error.message);
    return [];
  }
}

getSitemapUrls();
```

`$ node src/index.js`실행 ㄱㄱㄱ

![](/img/post/2024/1030/13.png)

6. 이제 구글 indexing api 호출하는 코드 작성해보자
   아까 다운받은 **키를 넣어서 new GoogleAuth** 생성자 호출하고 색인만들 url넣어주고 돌리자 `node src/index.js`

```js
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
const xml2js = require("xml2js");
const keyFilePath = "./blog-440204-9412cb3657bb.json";

// 색인 만들기
let apiLists = [
  "https://POcodingWER.github.io/react%20guide/2024/10/18/Prettier_ESLint/",
  "https://POcodingWER.github.io/react%20guide/2024/10/17/set-up/",
];
async function requestIndexing(apiLists) {
  const client = new GoogleAuth({
    keyFile: keyFilePath, // JSON 키 파일 경로
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const authClient = await client.getClient();
  const accessToken = await authClient.getAccessToken();

  for (const url of apiLists) {
    try {
      const response = await axios.post(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        {
          url, // 색인할 URL 입력
          type: "URL_UPDATED", // 색인 유형
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.token}`,
          },
        }
      );

      console.log("Response data:", response.data);
    } catch (error) {
      console.error(
        "Error:",
        url,
        error.response ? error.response.data : error.message
      );
    }
  }
}
requestIndexing(apiLists);
```

![](/img/post/2024/1030/14.png)

```bash
Response data: {
  urlNotificationMetadata: {
    url: 'https://POcodingWER.github.io/react%20guide/2024/10/18/Prettier_ESLint/'
  }
}
Response data: {
  urlNotificationMetadata: {
    url: 'https://POcodingWER.github.io/react%20guide/2024/10/17/set-up/'
  }
}
```

## 마무리

진짜 별거없는데 검색해도 안나오고 색인할때 수동으로 한번씩하는것도 개빡치고 빡치는것도 빡치는건데 답글보면 `요청일뿐!!` 이것도 개빡침 요청일뿐 안될수도있다고??? 그럼 개고생이자나 차후 지금 만든 js코드를 가지고 sitemap.xml에 있는 모든 url을 불러와서 색인 완료되었는지 코드도 만들고 색인이 안된 url만 뽑아서 다시 색인요청하는 방식으로 배치를 돌릴까 아니면 그냥 하루에 한번씩 서치콘솔 들어가서 확인후에 돌릴까 고민중이다. 색인요청도 겁나오래걸리는것같고 자동으로 돌리는것도 좋은것같다.

아그리고 마지막으로 하루200번이끝임 유의하셈
