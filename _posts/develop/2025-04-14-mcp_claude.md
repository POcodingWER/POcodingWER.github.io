---
layout: post
title: "[DEVELOP] Claude/ Cursor MCP적용하고 사용하기 "

subtitle: "MCP 적용예제"

date: 2025-04-14 08:32:33

# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"
# header-style: text
catalog: true
header-mask: 0.4
header-img: "img/post/2025/04/MCP.png"

# sitemap:
# changefreq: daily #스크랩 주기 daily | weekly | monthly
# priority: 1.0 # 스크랩 우선순위
# hidden: true

categories:
  - DEVELOP

tags:
  - MCP
  - AI
  - LLM
  - Claude
  - Cursor
  - MCP 사용법
  - 개발자도구
  - AI통합
  - 로컬시스템
  - 자동화
---

{% include post/develop_contents.md %}

> [참고자료 https://modelcontextprotocol.io/quickstart/user](https://modelcontextprotocol.io/quickstart/user)

# 🚀 Claude와 Cursor에 MCP 적용하기: AI 파워업 가이드!

## 들어가며 🌟

MCP(Model Context Protocol)는 마치 AI와 로컬 시스템 사이의 만능 통역사와 같습니다! Claude나 Cursor 같은 AI 도구들이 여러분의 로컬 파일시스템과 자유롭게 대화할 수 있게 해주는 마법 같은 기술이죠. 이 글에서는 이 마법 같은 도구를 여러분의 개발 환경에 적용하는 방법을 알아보겠습니다.

## 🤖 Claude 설치하기

먼저 우리의 AI 친구 Claude를 데스크톱에 초대해볼까요?
[클로드 다운로드(https://claude.ai/download)](https://claude.ai/download)

### 📋 설치 체크리스트

- 🍎 macOS 10.15 이상
- 🪟 Windows 10 이상
- 💾 최소 4GB RAM
- 🌐 안정적인 인터넷 연결

## 🎮 Claude에 MCP 적용하기

마치 게임 콘솔의 설정을 조정하듯, Claude에 MCP를 적용해봅시다!

1. **설정 들어가기** 🎯

   - Claude -> 설정 (`cmd`+`,`)
     ![](/img/post/2025/04/mcp_setting.png)

2. **개발자 모드 활성화** 🛠

   - 개발자 -> 설정편집
     ![](/img/post/2025/04/mcp_setting2.png)

3. **마법의 설정 코드 입력** ✨
   ![](/img/post/2025/04/mcp_setting3.png)

   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-filesystem",
           "/Users/username/Desktop",
           "/Users/username/Downloads"
         ]
       }
     }
   }
   ```

   > 🔍 `username`은 여러분의 실제 사용자 이름으로 바꿔주세요!

4. **새로고침으로 마법 완성** 🎩

   - Claude를 재시작하면... 짜잔! MCP가 활성화됩니다.
     ![](/img/post/2025/04/mcp_setting4.png)

5. **파일 만들기**
   - 클로드에 명령 입력하시면
   - ![](/img/post/2025/04/mcp_setting5.png)
   - ![](/img/post/2025/04/mcp_setting6.png)

## 🎯 Cursor에 MCP 적용하기

Cursor도 똑같이 마법의 힘을 부여받을 수 있습니다!

1. **설정 찾기** 🔍

   - 오른쪽 상단의 설정 -> MCP
     ![](/img/post/2025/04/mcp_setting7.png)

2. **새로운 서버 추가하기** ➕
   - "add new global MCP server" 클릭
   - Claude와 동일한 설정 코드 사용

## 🎓 MCP의 놀라운 능력

MCP는 마치 AI와 로컬 시스템 사이의 만능 통역사처럼 작동합니다:

### 🌈 주요 능력치

1. **연결의 마법사** 🔮

   - 시스템 간 완벽한 통신 관리
   - 도구 호출과 결과 전달의 달인

2. **만능 도구 상자** 🧰

   - 다양한 도구 목록 관리
   - AI와의 원활한 소통
   - 결과물 완벽 전달

3. **작동 매커니즘** ⚙️

   ```
   [호스트 시스템] ↔️ [MCP 클라이언트] ↔️ [MCP 서버] ↔️ [AI 도구들]

   ```

### 🎮 실제 플레이 방식

1. 사용자가 명령 입력
2. MCP가 도구 목록 확인
3. AI가 최적의 도구 선택
4. 도구 실행 및 결과 수집
5. AI의 멋진 응답 전달

## 🎉 마무리

MCP는 AI 세계와 로컬 시스템을 이어주는 마법의 다리입니다! [Smithery.ai](https://smithery.ai/)와 [MCP.so](https://mcp.so/) 같은 MCP 특화 사이트들을 통해 더 많은 마법을 배워보세요.

### 🚀 미래의 가능성

- 🛠 나만의 MCP 서버 제작
- 🔧 새로운 도구 개발
- 🏢 기업 환경 최적화
- 🔒 보안 강화

MCP의 [클라이언트] ↔️ [서버] 구조를 마스터하면서, AI의 무한한 가능성을 여러분의 개발 환경에서 마음껏 펼쳐보세요! ✨
