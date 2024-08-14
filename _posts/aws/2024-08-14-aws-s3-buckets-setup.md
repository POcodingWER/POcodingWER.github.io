---
layout: post
title: "떠먹여주는 [AWS] s3 buckets 만들기"

subtitle: "보고따라하기만해도 s3버킷 완성"

date: 2024-08-14 16:00:00
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/0814/8.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true

tags:
  - AWS
  - s3
  - buckets
  - 아마존
  - 버킷
  - s3 bukets
  - 이미지 업로드
  - 인프라
  - 인프라 구축
  - infura
  - route 53
  - 호스팅 서비스
  - Hosting
---

> 프로젝트 진행하다 csr변경 으로 이것 저것 변경 되면서 이미지도 버킷으로 변경하기로 하였다. <br/>
> 인프라는 잘모르지만 작성하면서 공부겸 히스토리 쌓기!<br/> > [ aws 기능 https://aws.amazon.com/ko/s3/features/](https://aws.amazon.com/ko/s3/features/)참고하여 사용하면 좋겠다.

#### 1. 버킷생성

1. 버킷생성
   ![](/img/post/0814/3.png) <span style="font-size:80%">버킷 만들기 go!</span>
2. 버킷이름 보통 사용할 도메인으로 작성하면좋다<br/>
   ex) {{subdomian}}.pocodingwer.github.io
   ![](/img/post/0814/4.png)
3. 엑세스 차단 설정을 다풀어준다.
   ![](/img/post/0814/5.png)
4. 나머지는 그대로 진행하면 된다.

#### 2. 버킷정책 수립

해당버킷 > 권환 > 버킷정책 > 편집 순으로 들어간다.
![](/img/post/0814/6.png)
![](/img/post/0814/7.png)
정책생서기로 들어가거나 [여기 주소](https://awspolicygen.s3.amazonaws.com/policygen.html)들어가서 정책을 세우면된다.

- Select Type of Policy 에서 S3 Bucket Policy를 선택
  - 정책 타입/ 버킷 정책
- effect 정책 적용 허용
- Principal에 \* 입력
  - \*전체
- Actions에 Get Object, Put Object 체크
  - 버킷에 수행할 액션
- Amazon Resource Name (ARN) 에 위에서 복사한 ARN을 입력한 후 /\_ 입력 ex) arn:aws:s3:::버킷이름
  - 버킷에 어떤 리소스를 적용할지
- Add Statement 클릭
  ![](/img/post/0814/8.png)
  ![](/img/post/0814/9.png)
  이거복사해서 붙여넣기후 저장

**참고**[ IAM JSON 정책 ](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html) IAM JSON 정책 요소: 조건 연산자

```json
{
  "Version": "2012-10-17", // Bucket Policy의 문법이 언제 날짜 기준으로 확정된 문법을 사용하는지 → 2008-10-17 버전 후 2012-10-17 버전이 있는데, 그 뒤로는 업데이트가 안됐음
  "Id": "S3PolicyId1", // Bucket Policy의 고유 아이디, 자동으로 부여되는 경우가 많음
  "Statement": [
    {
      "Sid": "IPAllow", // 각 Statement의 고유 아이디. 무슨 역할을 하는 policy인가
      "Effect": "Allow", // 버킷에 대한 명령을 허락(allow)하거나 거부(deny). 특정 사용자에 대해 명령을 제한하거나, 허용하는 식으로 사용
      "Principal": { "AWS": "arn:aws:iam::spark323:user/spark" }, // Bucket Policy의 적용대상 (spark323 아이디의 유저에 대해서)
      "Action": [
        // Bucket Policy에서 허용한 Action
        "s3:GetObject", // 객체 가져오는 행동
        "s3:GetBucketLocation", // 버켓 위치를 확인하는 행동
        "s3:ListBucket" // 버켓 리스트를 확인하는 행동
      ],
      "Resource": "arn:aws:s3:::bucketname/*", // 대상이 대는 Bucket에 대한 명세
      "Condition": {
        // 어떤 조건 하에
        "NotIpAddress": {
          // 이 IP비허용
          "aws:SourceIp": "1.1.1.1/32"
        },
        "IpAddress": {
          // 이 IP허용
          "aws:SourceIp": ["192.168.1.1", "192.168.1.2/32"]
        }
      }
    }
  ]
}
```

#### 3. 정적 웹 사이트 호스팅

해당버킷 > 속성 > `맨 아래` 정적 웹 사이트 호스팅> 편집 순으로 들어간다.

1. 편집으로들어가서
   ![](/img/post/0814/10.png)
2. 첫진입으로 만날 html 설정해준다
   ![](/img/post/0814/11.png)

#### 4. s3에 도메인(Route 53)연동

Route 53 > 호스팅영역 > 해당 호스팅 클릭> 편집 순으로 들어간다.

1. 레코드생성 클릭
   ![](/img/post/0814/13.png)
2. 다입력후 엔드포인트 입력란을 보면 리소스를 찾을수없다고나온다.
   1-2에<a href="#1-버킷생성" >ex) {{subdomian}}.pocodingwer.github.io</a> 예제처럼설정을하고 레코드이름이 똑같아야 s3찾을수있다.
   ![](/img/post/0814/14.png)
3. 다시 제대로입력후 확인해보면 엔드포인트를 찾을수 있다.
   ![](/img/post/0814/15.png)
4. 레코드 추가후 subdomain 설정된 주소로 들어가면 정적인 페이지가 나오는걸 확인할수잇따.

## 마무리

너무 기본적인 s3와 Route 53 기본 세팅을 해보았는데;; 생각보다 어렵지는 않았지만
해야될게 많은걸 새삼느꼈다.
