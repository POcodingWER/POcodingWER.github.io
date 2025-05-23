---
layout: post
title: "[AWS] s3 이미지,파일 덮어쓰기시 변경안됨"

subtitle: "Cloud Front 이미지 캐시 문제"

date: 2024-08-19 15:40:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/0819/cloud_front.png"
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
  - 아마존
  - 이미지 업로드
  - 이미지 업데이트
---

{% include post/aws_contents.md %}

## 원인 파악

이미지가 변경안되는 이슈가 4가지 정도있는데 1번은 당연히해보았고 2,3,4번 방법으로 해결해보자.

1. 브라우저 캐시(Cache) 문제:
   브라우저가 이전에 로드한 이미지를 캐시에 저장하고 있을 수 있습니다. 이 경우 브라우저는 S3에서 이미지를 다시 다운로드하지 않고 캐시에 저장된 이미지를 계속 보여줍니다. 브라우저 캐시를 지우거나, 강력 새로고침(Shift + F5 또는 Ctrl + Shift + R)을 시도해 보세요.

2. CloudFront 캐시 문제:
   만약 S3 버킷을 CloudFront와 함께 사용하고 있다면, CloudFront가 캐시된 버전의 이미지를 제공하고 있을 수 있습니다. 이 경우 캐시 무효화(Invalidation)를 수행하여 CloudFront 캐시를 업데이트할 수 있습니다.

3. 이미지 파일 이름 또는 URL 문제:
   파일 이름이 동일하지만 내용이 바뀐 경우, 브라우저나 CDN에서 이를 새로운 파일로 인식하지 않을 수 있습니다. 이미지 파일 이름을 바꿔서 업로드하거나 URL에 쿼리 파라미터를 추가하여 새 버전임을 명확히 할 수 있습니다.

4. S3 버킷 정책 또는 퍼미션 문제:
   파일이 올바르게 업로드되었지만, 퍼미션 설정이 제대로 되어 있지 않아 새 이미지에 접근할 수 없는 경우가 있을 수 있습니다. S3에서 파일이 올바르게 퍼블릭 또는 적절한 권한으로 설정되어 있는지 확인해 보세요.

## 해결 방안

1. AWS -> CloudFront에 들어간다.
1. 대체 도메인이 `해당 클라우드프론트` ID 클릭
1. 무효화 탭 클릭
1. 무효화 생성 버튼 클릭
   ![](/img/post/2024/0819/1.png){: #magnific}
1. 객체경로에 wildcard 입력 `\*` 전체경로
   ![](/img/post/2024/0819/2.png){: #magnific}

## 마무리

생각지도 않은 캐시가 문제되어 이미지 교체가 안되는 이슈가 발현되었는데 쉽게 해결할수있는 문제라 그나마 다행이네
