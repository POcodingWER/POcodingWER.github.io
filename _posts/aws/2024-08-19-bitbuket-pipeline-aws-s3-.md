---
layout: post
title: "[AWS] Bitbucket pipeline / aws s3 Deploy"

subtitle: "파이프라인을 사용하여 aws s3 배포하자"

date: 2024-09-11 19:27:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/0911/2.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - AWS
tags:
  - AWS
  - s3
  - Cloud Front
  - bitbucket
  - pipeline
  - 비트버킷 파이프라인
---

# Bitbucket pipeline 이용하여 AWS S3에 배포하기

비트버킷 파이프라인을 사용하여 배포해봅시다.

## 1. 비트버킷 파이프라인으로 이동

![](/img/post/2024/0911/1.png)

## 2. 원하는 옵션 선택 나는 start pipeline 설정

![](/img/post/2024/0911/2.png)

## 3. Deploy React app to AWS S3

나는 nuxt.js 지만 csr 빌드여서 상관없음  
파일을복사하여 프로젝트 최상위치에 `bitbucket-pipelines.yml`명으로 저장하자

![](/img/post/2024/0911/3.png)

```yml
image: node:16

pipelines:
  default:
    - parallel:
        - step:
            name: Build and Test
            caches:
              - node
            script:
              - npm install
              # CI=true in default variables for Bitbucket Pipelines https://support.atlassian.com/bitbucket-cloud/docs/variables-in-pipelines/
              - npm test
        - step:
            name: Lint the node package
            script:
              # Run your linter of choice here
              - npm install eslint
              - npx eslint src
            caches:
              - node
  branches:
    master:
      - parallel:
          - step:
              name: Build and Test
              caches:
                - node
              script:
                - npm install
                # CI=true in default variables for Bitbucket Pipelines https://support.atlassian.com/bitbucket-cloud/docs/variables-in-pipelines/
                - npm test
                - npm run build
              artifacts:
                - build/**
          - step:
              name: Security Scan
              script:
                # Run a security scan for sensitive data.
                # See more security tools at https://bitbucket.org/product/features/pipelines/integrations?&category=security
                - pipe: atlassian/git-secrets-scan:0.5.1
      - step:
          name: Deploy to Production
          deployment: Production
          trigger: manual
          clone:
            enabled: false
          script:
            # sync your files to S3
            - pipe: atlassian/aws-s3-deploy:1.1.0
              variables:
                AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
                AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
                AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION
                S3_BUCKET: "my-bucket-name"
                LOCAL_PATH: "build"
            # triggering a distribution invalidation to refresh the CDN caches
            - pipe: atlassian/aws-cloudfront-invalidate:0.6.0
              variables:
                AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
                AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
                AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION
                DISTRIBUTION_ID: "123xyz"
```

## 4. yml 코드설명

### 1. `image: node:18.12.1`

- CI 환경에서 Node.js 18.12.1 버전을 사용하도록 지정합니다.

### 2. `pipelines: branches: main:`

- 파이프라인은 `main` 브랜치에서 실행됩니다. 즉, `main` 브랜치에 코드가 푸시될 때마다 이 파이프라인이 작동합니다.

### 3. `- step: name: Build`

- 첫 번째 스텝은 **빌드**입니다.
  - `caches: node` : Node.js 패키지(`node_modules`)를 캐싱하여 다음 빌드 시 설치 시간을 줄입니다.
  - `script` :
    - `yarn install` : 프로젝트에 필요한 패키지를 설치합니다.
    - `yarn build_prod` : 프로덕션 빌드를 실행합니다. (이 명령은 프로젝트 설정에 따라 빌드 결과물 생성)

### 4. `artifacts: dist/**`

- 빌드 결과물(예: `dist` 폴더 안의 모든 파일)을 아티팩트로 저장합니다. 이 결과물은 다음 스텝에서 사용됩니다.

### 5. `- step: name: Deploy`

- 두 번째 스텝은 **배포**입니다.
  [참조 https://bitbucket.org/atlassian/aws-s3-deploy/src/master/](https://bitbucket.org/atlassian/aws-s3-deploy/src/master/)
  - `pipe: atlassian/aws-s3-deploy:1.6.1` : Atlassian의 AWS S3 배포 파이프를 사용하여 빌드된 파일을 S3 버킷에 업로드합니다.
    - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `S3_BUCKET`, `LOCAL_PATH` : AWS 자격 증명과 관련된 변수들로, S3에 접근하기 위한 키와 버킷 정보 등이 포함됩니다.
  - `pipe: atlassian/aws-cloudfront-invalidate:0.10.1` : AWS CloudFront 캐시를 무효화하여 최신 배포가 반영되도록 합니다.
    - `DISTRIBUTION_ID` : CloudFront 배포 ID로, 캐시를 무효화할 CloudFront 배포를 지정합니다.

### 요약:

이 `.yml` 파일은 `main` 브랜치에 코드가 푸시되면, Node.js 프로젝트를 빌드한 후 결과물을 AWS S3에 업로드하고, CloudFront의 캐시를 무효화하는 파이프라인을 정의하고 있습니다.

## 5. AWS키 설정해주기

1.  경로
    Repository settings -> Repository variables
2.  repository에 환경변수를 key와 value를 Add 해준다.
    ![](/img/post/2024/0911/4.png)
3.  빌드 된다
    ![](/img/post/2024/0911/5.png)
