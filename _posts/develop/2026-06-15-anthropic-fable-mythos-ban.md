---
layout: post
title: "[DEVELOP] Claude Fable 5·Mythos 5 전면 중단 — 출시 3일 만에 꺼진 AI"

subtitle: "수출통제, 탈옥 논란, Amazon 보고까지 — 개발자가 알아야 할 사건 정리"

date: 2026-06-15 10:00:00

author: "lim.Chuck"
catalog: true
header-mask: 0.4
header-img: "img/post/2026/06/fable_mythos_ban.png"

categories:
  - DEVELOP

tags:
  - Anthropic
  - Claude
  - Fable 5
  - Mythos 5
  - AI 모델
  - 수출통제
  - Jailbreak
  - 사이버보안
  - Amazon
  - AI 규제
---

{% include post/develop_contents.md %}

> 2026년 6월 9일 공개된 Anthropic 최상위 AI 모델 **Claude Fable 5**와 **Claude Mythos 5**가 출시 3일 만에 전 세계 사용자에게 차단되었습니다. 미국 정부의 수출통제 명령이 촉발했고, 그 배경에는 Fable 5 탈옥(jailbreak) 논란과 Amazon의 백악관 보고가 얽혀 있습니다.
>
> - [Anthropic 공식 성명](https://www.anthropic.com/news/fable-mythos-access)
> - [Anthropic Fable/Mythos 출시 발표](https://www.anthropic.com/news/claude-fable-5-mythos-5)
> - [Axios - How Amazon and the White House ended Anthropic's Fable](https://www.axios.com/2026/06/13/anthropic-amazon-white-house)
> - [CNBC - Anthropic disables Fable 5, Mythos 5 on government directive](https://www.cnbc.com/2026/06/12/anthropic-disables-access-to-fable-5-and-mythos-5-to-comply-with-government-directive.html)

---

## 사건 개요 — 출시 72시간 만에 전면 중단

![](/img/post/2026/06/fable_mythos_ban.png){: #magnific}

2026년 6월 9일, Anthropic은 **Mythos-class** 최상위 모델인 **Claude Fable 5**와 **Claude Mythos 5**를 공개했습니다. Opus보다 한 단계 위 성능 티어로, 코딩·추론·사이버보안 분야에서 업계 최고 수준의 능력을 자랑합니다.

그런데 6월 12일 금요일 밤, 미국 정부가 **국가안보 수출통제 지시**를 내렸고 Anthropic은 **전 세계 모든 사용자**의 Fable 5·Mythos 5 접근을 차단했습니다.

```
6월 9일   Fable 5 · Mythos 5 공개
6월 12일  Amazon CEO가 백악관에 보안 우려 보고
6월 13일  정부, 90분 내리라는 통보 → 수출통제 지시서 발송
6월 13일  전 세계 사용자 접근 차단 (약 밤 10시)
```

**Claude Opus, Sonnet, Haiku 등 다른 모델은 영향 없음.** Fable/Mythos만 중단되었습니다.

![](/img/post/2026/06/fable_timeline.png){: #magnific}

---

## Fable 5와 Mythos 5 — 뭐가 다른가

두 모델은 **같은 기반 모델**이지만, 안전장치 적용 여부가 다릅니다.

| 모델 | API ID | 공개 범위 | 안전장치 |
| ---- | ------ | --------- | -------- |
| **Fable 5** | `claude-fable-5` | 일반 공개 (API, Bedrock, Vertex AI 등) | 사이버보안·생물학 등 고위험 질문 차단, 차단 시 Opus 4.8로 폴백 |
| **Mythos 5** | `claude-mythos-5` | Project Glasswing 파트너만 | 일부 안전장치 해제 |

![](/img/post/2026/06/fable_vs_mythos.png){: #magnific}

### Mythos-class란?

Anthropic이 정의한 **Opus 위 성능 티어**입니다.

- 4월: Mythos Preview (제한 공개, Project Glasswing)
- 6월 9일: Fable 5 (안전장치 적용, 대중 공개) + Mythos 5 (안전장치 일부 해제, 제한 공개)

### 왜 사이버보안이 문제인가

Mythos 5는 **세계 최강 수준의 사이버보안 역량**을 갖춘 모델입니다. 소프트웨어 취약점 탐지, 코드 분석, 보안 감사 등 **방어 목적**으로는 강력하지만, 같은 능력이 **공격 목적**으로 전환될 수 있다는 우려가 있었습니다.

Anthropic은 출시 전 미국 정부, 영국 AISI(AI Safety Institute), 민간 레드팀 등과 **수천 시간**의 안전 테스트를 진행했다고 밝혔습니다.

### 가격

| 항목 | 가격 |
| ---- | ---- |
| Input | $10 / 1M tokens |
| Output | $50 / 1M tokens |
| Context | 1M tokens (기본) |
| Max output | 128K tokens |

Mythos Preview 대비 **절반 이하** 가격으로 제공되었습니다.

---

## 왜 막혔나 — 정부의 공식 사유

6월 12일 오후 5시 21분(ET), 미국 상무장관 Howard Lutnick이 Anthropic CEO Dario Amodei에게 **수출통제 지시서**를 발송했습니다.

### 지시 내용

> Fable 5와 Mythos 5에 대한 **모든 외국인**의 접근을 중단할 것.
> 대상: 미국 내·외 모든 외국인, **Anthropic 외국인 직원 포함**.

정부가 제시한 근거는 **국가안보 권한(national security authorities)** 이었으나, 공문에는 **구체적인 기술적 세부사항이 포함되지 않았습니다.** Anthropic은 구두로만 "Fable 5 탈옥(jailbreak) 가능성"이 전달되었다고 밝혔습니다.

### 탈옥이란

AI 모델의 **안전장치(safeguard)를 우회**하여, 원래 차단되도록 설계된 응답을 끌어내는 기법입니다.

```
정상 요청: "이 시스템을 해킹하는 방법 알려줘"
  → Fable 5: ❌ 차단 → Opus 4.8로 폴백

탈옥 성공 시: Mythos 5 수준의 사이버 역량에 접근 가능
  → 취약점 분석, 공격 코드 생성 등
```

![](/img/post/2026/06/jailbreak_concept.png){: #magnific}

---

## 탈옥의 실체 — 정말 심각했나

여러 보도와 Anthropic 성명을 종합하면, 이번에 문제 삼아진 탈옥 기법은 다음과 같습니다.

> **"특정 코드베이스를 읽고 소프트웨어 결함을 찾아 고쳐 달라"**고 요청하는 프롬프트 시리즈

### Anthropic의 반박

| 정부 주장 | Anthropic 반박 |
| --------- | -------------- |
| Fable 5 탈옥으로 사이버 역량 노출 | 탈옥은 **좁고 비범용적(non-universal)** — 특정 시나리오에서만 동작 |
| 국가안보 위협 | 발견된 취약점은 **이미 알려진 사소한 것** |
| Fable만의 문제 | **GPT-5.5 등 다른 공개 모델**도 탈옥 없이 비슷한 결과 가능 |
| 유해한 결과 발생 | **유해한 결과를 낳은 사례 없음** |

Anthropic은 출시 당시부터 **"완벽한 탈옥 방어는 현재 불가능"**하다고 공개적으로 밝혔고, 대신 **다층 방어(defense in depth)** 전략을 채택했습니다.

```
다층 방어 전략:
  1. 탈옥을 좁게 만들거나 비용을 크게 함
  2. 30일 고객 데이터 보존으로 탈옥 연구·대응
  3. 모니터링으로 성공적 공격을 빠르게 탐지·차단
```

**범용 탈옥(universal jailbreak)** — 안전장치를 광범위하게 무력화하는 방법 — 은 수천 시간의 레드팀 테스트에서도 발견되지 않았다고 Anthropic은 주장합니다.

---

## 왜 외국인만 막으라 했는데 전 세계가 막혔나

이 부분이 개발자 입장에서 이해하기 중요한 포인트입니다.

```
정부 지시: "외국인 접근 금지"
     ↓
문제: API/서비스에서 사용자 국적을 실시간 검증 불가
     (VPN, 미확인 신원, 글로벌 SaaS 구조)
     ↓
Anthropic 판단: 외국인만 차단하면 수출통제 위반 리스크
     ↓
결과: 전 세계 모든 사용자에게 비활성화
```

즉 **"전 세계 차단"은 정부가 직접 "모두 막아라"고 한 것이 아니라**, 수출통제 준수를 위한 **기술적·법적 부작용**입니다. AWS Bedrock, Vertex AI 등 클라우드 파트너 고객도 포함됩니다.

![](/img/post/2026/06/global_ban_flow.png){: #magnific}

---

## 사건의 전개 — Amazon이 등장하다

단순한 기술 이슈를 넘어는 부분이 여기서 시작됩니다.

### 타임라인 (상세)

| 시점 | 내용 |
| ---- | ---- |
| **6월 12일 (목) 밤** | Amazon CEO Andy Jassy가 재무장관 Scott Bessent 등 백악관 고위 인사에게 Fable 5 보안 우려 보고 |
| **6월 12~13일** | 최소 5개 이상의 다른 회사도 정부 관계자에게 연락 ([Axios](https://www.axios.com/2026/06/13/anthropic-amazon-white-house)) |
| **6월 13일 오후 1시** | 정부가 Anthropic에 **90분 안에 모델을 내리라**는 통보 (위협 내용 미공개) |
| **6월 13일 오후** | Amodei와 Anthropic 임원, 정부와 협의 — 탈옥이 단순하고 다른 모델도 가능하다고 설명 |
| **6월 13일 오후 5:21** | 상무장관 Lutnick, 수출통제 지시서 발송 |
| **6월 13일 밤 ~10시** | 전 세계 사용자 Fable/Mythos 접근 차단 |

### Amazon의 역할

Amazon은 Anthropic의 **최대 투자자**이자 **AWS Bedrock 호스팅 파트너**입니다. 동시에 Amazon 보안 연구원이 Fable 5 탈옥을 시연하고 CEO가 백악관에 직접 보고했습니다.

백악관 과학 자문 David Sacks는 X에서 보고자를 **"Anthropic과 미국 정부 모두의 신뢰할 수 있는 파트너"**라고 묘사했으며, 여러 매체가 이를 Amazon으로 특정했습니다.

```
갈등 구도:

  정부: "취약점을 고치거나 모델을 내려라"
    → Amodei 거부

  정부: 수출통제 지시서로 강제 조치

  Anthropic: "이 정도 탈옥으로 상용 모델을 회수하는 건 과하다"
```

**투자자이자 파트너인 Amazon이 경쟁 모델 차단에 관여**했다는 **이해상충(conflict of interest)** 논란도 보도되고 있습니다.

![](/img/post/2026/06/amazon_conflict.png){: #magnific}

---

## 더 큰 맥락 — Anthropic vs 트럼프 행정부

이번 사건은 갑자기 터진 것이 아닙니다. Anthropic과 미국 정부 사이의 갈등이 수개월간 이어져 왔습니다.

### 선행 사건

| 시기 | 내용 |
| ---- | ---- |
| **2026년 3월** | Anthropic, 군사용 AI를 **국내 감시·자율 살상 무기**에 쓰는 것 거부 |
| **2026년 3월** | 펜타곤, Anthropic을 **공급망 위험(supply chain risk)** 으로 지정 |
| **2026년 3월** | 트럼프, 연방기관의 Anthropic 제품 사용 전면 중단 명령 |
| **2026년 3월 27일** | 연방법원, 위 조치에 **임시 금지명령** (소송 진행 중) |
| **2026년** | OpenAI, 펜타곤과 계약 체결 — Anthropic을 대체 |

Fable 차단은 **AI 안전·수출통제** 이슈이면서 동시에 **정부와 Anthropic 간 권력 다툼**의 연장선으로도 읽힙니다.

---

## 개발자에게 미치는 영향

### 지금 당장

| 항목 | 상태 |
| ---- | ---- |
| Fable 5 (`claude-fable-5`) | ❌ 전면 중단 |
| Mythos 5 (`claude-mythos-5`) | ❌ 전면 중단 |
| Opus / Sonnet / Haiku | ✅ 정상 |
| Claude Code | ✅ 정상 (Fable/Mythos 미사용) |
| AWS Bedrock Fable/Mythos | ❌ 중단 |

### Fable 5를 쓰던 개발자라면

Fable 5는 **고난도 추론, 장기 에이전트 작업, 대규모 코드 분석**에 최적화된 모델이었습니다. 중단 이후에는 **Opus 4.8**이 가장 가까운 대안이지만, Mythos-class 수준의 성능 차이는 존재합니다.

```javascript
// Fable 5 사용 예시 (현재 불가)
const response = await anthropic.messages.create({
  model: "claude-fable-5",  // ❌ 현재 사용 불가
  max_tokens: 8192,
  messages: [{ role: "user", content: "이 코드베이스의 보안 취약점을 분석해줘" }],
});

// 대안: Opus 4.8
const response = await anthropic.messages.create({
  model: "claude-opus-4-20250514",  // ✅ 사용 가능
  max_tokens: 8192,
  messages: [{ role: "user", content: "이 코드베이스의 보안 취약점을 분석해줘" }],
});
```

### 앞으로 주목할 점

Axios에 따르면, 미국 정부는 **영구 차단이 아니라** "국가안보 체계가 강화될 때까지" 잠금 상태를 원하며, **수 주 내** 해제 가능성도 언급되었습니다. Anthropic도 "오해이며, 가능한 한 빨리 접근을 복구하겠다"고 밝혔습니다.

---

## 이번 사건의 의미 — 업계에 남긴 선례

여러 매체가 공통으로 짚는 포인트입니다.

### 1. 정부가 상용 AI 모델 배포를 직접 중단시킨 최초 사례

이전까지 AI 규제는 주로 **칩 수출 통제(Nvidia, AMD)** 나 **정책 가이드라인** 수준이었습니다. 이번에는 **이미 배포된 상용 모델**을 수출통제로 끌어내린 것입니다.

### 2. 좁은 탈옥이 회수 사유가 될 수 있다

범용 탈옥이 아닌 **특정 시나리오에서만 동작하는 비범용 탈옥**이 모델 회수의 근거가 되었다는 점에서, **모든 프론티어 AI 회사에 새로운 기준**이 될 수 있습니다.

Anthropic의 경고:

> "이 기준이 업계 전체에 적용되면, 모든 프론티어 모델 제공자의 신규 모델 배포가 사실상 멈출 것이다."

### 3. EU 등 해외의 기술 격차 우려

EU에는 Fable/Mythos급 사이버 AI를 대체할 **자국 프론티어 모델이 없다**는 우려가 제기되고 있습니다. Mistral이 가장 가까운 유럽 경쟁자이지만, 사이버보안 역량 면에서 다른 수준으로 평가됩니다.

### 4. 투자자 = 규제자?

Amazon이 투자자이면서 동시에 탈옥을 발견하고 정부에 보고한 구조는, AI 산업에서 **투자-규제-경쟁이 어떻게 얽히는지** 보여주는 사례입니다.

---

## Anthropic의 입장 (요약)

[공식 성명](https://www.anthropic.com/news/fable-mythos-access) 핵심:

- Fable은 업계 최강 수준의 안전장치를 갖췄고, 출시 전 수천 시간의 레드팀 테스트를 거침
- 이번 탈옥은 **유해한 결과를 낳지 않았고**, 다른 모델도 할 수 있는 수준
- 정부 조치는 **투명하고 기술 사실에 기반한 절차가 아님**
- 법적 지시에 **준수**하되, **이견을 공개적으로 표명**
- **접근 복구를 위해 노력 중**

---

## 마무리

Claude Fable 5와 Mythos 5의 전면 중단은 **AI 역사상 전례 없는 사건**입니다. 출시 3일 만에 세계 최강 AI 모델이 꺼진 배경에는 탈옥 논란, 수출통제, Amazon의 백악관 보고, 그리고 수개월간 이어진 Anthropic-정부 갈등이 복합적으로 작용했습니다.

개발자 입장에서는 당장 Fable/Mythos를 쓸 수 없지만, Opus·Sonnet 등 기존 모델은 정상이고 복구 가능성도 열려 있습니다. 다만 이번 사건이 남긴 **"좁은 탈옥도 모델 회수 사유가 될 수 있다"**는 선례는, 앞으로 AI 모델을 API로 사용하는 모든 개발자가 주목해야 할 변화입니다.

---

## 참고자료

| 분류 | 링크 |
| ---- | ---- |
| 공식 | [Anthropic - Fable/Mythos 접근 중단 성명](https://www.anthropic.com/news/fable-mythos-access) |
| 공식 | [Anthropic - Fable 5 · Mythos 5 출시 발표](https://www.anthropic.com/news/claude-fable-5-mythos-5) |
| 공식 | [Claude API Docs - Fable/Mythos 소개](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5) |
| 뉴스 | [Axios - How Amazon and the White House ended Anthropic's Fable](https://www.axios.com/2026/06/13/anthropic-amazon-white-house) |
| 뉴스 | [CNBC - Anthropic disables Fable 5, Mythos 5 on government directive](https://www.cnbc.com/2026/06/12/anthropic-disables-access-to-fable-5-and-mythos-5-to-comply-with-government-directive.html) |
| 뉴스 | [Time - Anthropic Pulls Its Most Powerful AI Models After U.S. Bars Foreign Access](https://time.com/article/2026/06/13/anthropic-fable-mythos-ban-US-security/) |
| 뉴스 | [Engadget - Anthropic Blocks All Customers' Access To Fable 5 And Mythos 5](https://www.engadget.com/2193656/anthropic-blocks-access-fable-5-mythos-5/) |
| 뉴스 | [Nextgov - Anthropic suspends top AI models after U.S. export control order](https://www.nextgov.com/artificial-intelligence/2026/06/anthropic-suspends-top-ai-models-after-us-export-control-order/414173/) |
| 뉴스 | [Al Jazeera - US asks Anthropic to block global access to top AI models](https://www.aljazeera.com/news/2026/6/14/us-asks-anthropic-to-block-global-access-to-top-ai-models-why-it-matters) |
| 분석 | [Security Affairs - Washington Pulled the Plug on Fable 5 and Mythos 5](https://securityaffairs.com/193579/ai/washington-pulled-the-plug-on-anthropic-fable-5-and-mythos-5-models.html) |
| 분석 | [TechTimes - Amazon Triggered Claude Fable 5 Shutdown](https://www.techtimes.com/articles/318350/20260614/amazon-triggered-claude-fable-5-shutdown-investor-cloud-host-now-regulator.htm) |
