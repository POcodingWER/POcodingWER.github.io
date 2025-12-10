---
layout: post
title: "[AWS] CloudFront 비용 절감 정리 Origin Shield + Price Class"

subtitle: "실무에서 바로 써먹는 CloudFront 비용절감"

date: 2025-12-10 08:32:21
# lastmod: 2025-12-02 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/12/cloudfront-cache.png"

#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - AWS
tags:
  - AWS
  - CloudFront
  - CDN
  - Origin Shield
  - Price Class
  - 비용절감
  - 성능최적화
  - Regional Edge Cache
---

{% include post/aws_contents.md %}

## 문제 상황

### 비정상적인 비용 분포

![](/img/post/2025/12/cost1.png){: #magnific}

**한국에서만 서비스하는데 싱가포르에서 95% 이상의 비용이 발생하고 있습니다.**

- 서울: $0.55 (약 1%)
- 싱가포르: $49.17 (약 98%)
- 총 비용: $50.06

### 높은 캐시 히트율에도 불구한 비용 문제

![](/img/post/2025/12/cost3.png){: #magnific}

**캐시 히트율이 98% 이상인데도 왜 싱가포르 비용이 이렇게 높을까요?**

## 원인 분석

> 참조: [Amazon CloudFront Origin Shield](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html)

### CloudFront 3단계 캐싱 구조

```
사용자 → Edge Location → REC (Regional Edge Cache) → Origin
```

### 현재 상황 (Origin Shield 비활성화)

![](/img/post/2025/12/cost4.png){: #magnific}

```
서울 사용자 → 서울 Edge Location (캐시 미스 95%)
                        ↓
                 싱가포르 REC (Regional Edge Cache)
                        ↓
                   캐시 히트 → 응답
```

### 비용이 싱가포르에 집중되는 이유

#### 1. AWS의 글로벌 최적화 vs 현실

**AWS 본사의 생각:**

> "전 세계 최적화를 위해 Regional Edge Cache를 둬야지~"  
> "아시아는... 싱가포르에 REC 두면 되겠다!"

**현실 (한국 서비스):**

```
- S3 Origin: 서울 🇰🇷
- 사용자: 서울 🇰🇷
- CloudFront Edge: 서울 🇰🇷
- REC: 싱가포르 🇸🇬 ← ???

결과: 서울 → 싱가포르 → 서울 🤡
```

#### 2. AWS의 논리 vs 한국의 현실

**AWS의 글로벌 관점:**

- 베트남 사용자 → 싱가포르 REC → 서울 S3 (이해됨 ✅)
- 태국 사용자 → 싱가포르 REC → 서울 S3 (음... 🤔)
- **한국 사용자 → 싱가포르 REC → 서울 S3 (???)** 🤯

**한국 개발자의 반응:**

> "야 우리는 서울 → 서울인데 왜 싱가포르를 거침?"

**AWS의 대답:**

> "글로벌 최적화입니다 ㅎㅎ" 🤡

#### 3. REC 위치 문제의 핵심

- **싱가포르 REC**: 아시아 태평양 지역의 주요 Regional Edge Cache
- **서울 Edge**: 캐시 미스 시 자동으로 싱가포르 REC로 이동
- **문제**: 한국 내부 서비스임에도 불구하고 국제 구간을 경유

#### 4. 실제 비용 발생 구조

```
서울 Edge (5% 히트) → 서울 비용: $0.55 (1%)
서울 Edge → 싱가포르 REC (95% 트래픽) → 싱가포르 비용: $49.17 (98%)
```

**결과적으로:**

- 한국 → 한국 서비스인데 95% 비용이 싱가포르에서 발생 🤦‍♂️
- AWS: "아시아 전체를 봤을 때 싱가포르가 중심이니까~"
- 개발자: "우리는 한국만 쓰는데..." 😭

#### 5. 98% 히트율의 함정

- **전체 히트율**: Edge Location + REC 합쳐서 98%
- **Origin 요청**: 단 2%만 실제 Origin까지 도달
- **핵심 문제**: 95%의 트래픽이 비싼 싱가포르 REC를 경유

**이상한 점:**

- 캐시 히트율은 높음 ✅
- 성능도 괜찮음 ✅
- 하지만 비용은 폭탄 💸
- 이유: 불필요한 국제 구간 경유

## 해결책 1: Origin Shield 활성화

### Origin Shield란?

Origin Shield는 Origin 서버와 CloudFront Edge Location 사이의 **추가 캐싱 레이어**입니다.

### Origin Shield 활성화 후 구조

```
서울 사용자 → 서울 Edge Location → Origin Shield (서울) → Origin
```

**드디어 정상적인 구조! 🎉**

- 서울 → 서울 → 서울 (합리적!)
- 불필요한 싱가포르 경유 제거
- AWS: "아... 그럼 Origin Shield 쓰세요 ㅎㅎ" 💰

### 기대 효과

- ✅ 싱가포르 REC 경유 없음
- ✅ 서울 지역 내부에서 처리
- ✅ 싱가포르 비용 대폭 감소 (98% → 10-20%)
- ✅ 전체 비용 20-30% 절감 예상
- ✅ **드디어 상식적인 라우팅** 🙌

---

## 해결책 2: Price Class 최적화

### Price Class란?

CloudFront의 Price Class는 **어떤 지역의 Edge Location을 사용할지** 결정하는 설정입니다.

![](/img/post/2025/12/price_class.png){: #magnific}

### Price Class 옵션

#### 1. **Use all edge locations (best performance)**

- **모든 지역** Edge Location 사용
- **가장 비싼** 옵션 (Price Class All)
- 전 세계 최적 성능

#### 2. **Use North America, Europe, Asia, Middle East, and Africa**

- **북미, 유럽, 아시아, 중동, 아프리카** Edge Location 사용
- **중간** 비용 (Price Class 200)
- 대부분 지역에서 좋은 성능

#### 3. **Use only North America and Europe**

- **북미, 유럽만** Edge Location 사용
- **가장 저렴한** 옵션 (Price Class 100)
- 아시아 지역 성능 저하 가능

### 한국 서비스에 최적인 Price Class

**한국에서만 서비스한다면 "Use North America, Europe, Asia, Middle East, and Africa"를 권장합니다.**

#### 이유:

- ✅ 아시아 태평양 지역 포함 (서울, 도쿄, 싱가포르 등)
- ✅ 비싼 남미, 오세아니아 제외
- ✅ 성능 유지하면서 비용 절감
- ✅ "Use all edge locations" 대비 약 10-20% 비용 절감

### Price Class별 비용 영향

```
Use all edge locations: 모든 지역 → 높은 비용
Use North America, Europe, Asia, Middle East, and Africa: → 중간 비용 (권장)
Use only North America and Europe: → 낮은 비용 (아시아 성능 저하)
```

## 설정 방법

### 1. Origin Shield 설정

#### AWS Console에서 설정

1. **AWS CloudFront** → **배포** 선택
2. **Origins** → **편집** 클릭
3. **Origin Shield** 설정:
   - Enable Origin Shield: **예**
   - Origin Shield Region: **Asia Pacific (Seoul)**

![](/img/post/2025/12/cost2.png){: #magnific}

### 2. Price Class 설정

#### AWS Console에서 설정

![](/img/post/2025/12/price_class2.png){: #magnific}

1. **AWS CloudFront** → **배포** 선택
2. **일반** 탭 → **편집** 클릭
3. **Price Class** 설정:
   - **Use North America, Europe, Asia, Middle East, and Africa** 선택

#### 설정 후 적용

- 설정 변경 후 **배포** 클릭
- 전파 시간: 약 15-20분 소요

### 예상 비용 변화

#### Origin Shield만 적용 시

```
현재:
- 서울: $0.55 (1%)
- 싱가포르: $49.17 (98%)
- 총 비용: $50.06

Origin Shield 활성화 후:
- 서울: $35-40 (70-80%)
- 싱가포르: $5-10 (10-20%)
- 총 비용: $40-50
- 절감률: 약 20-30%
```

#### Origin Shield + Price Class (North America, Europe, Asia, Middle East, and Africa) 적용 시

```
최종 예상 비용:
- 서울: $28-32 (70-75%)
- 싱가포르: $4-8 (10-15%)
- 기타 지역: $2-5 (5-10%)
- 총 비용: $34-45
- 총 절감률: 약 30-40%
```

---

## 결론

### 권장 설정 조합

1. **Origin Shield**: 활성화 (Asia Pacific - Seoul)
2. **Price Class**: Use North America, Europe, Asia, Middle East, and Africa

### 기대 효과

- ✅ **비용 절감**: 30-40% 절감 ($50 → $35-45)
- ✅ **성능 유지**: 아시아 지역 최적 성능
- ✅ **Origin 부하 감소**: 중복 요청 제거
- ✅ **관리 효율성**: 단일 지역에서 캐시 관리

### 주의사항

- 설정 변경 후 15-20분 전파 시간 필요
- 첫 1-2일은 캐시 워밍업으로 일시적 비용 증가 가능
- 월 단위로 비용 모니터링 권장
