---
layout: post
title: "[React] React Query < useQuery | fetchQuery | useMutation > 사용법"

subtitle: "React Query를 사용해서 cashing 처리 하자"

date: 2025-08-01 09:13:45
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2025/08/reactQuery.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - React Query
  - useQuery
  - fetchQuery
  - useMutation
---

{% include post/react/contents.md %}

---

![](/img/post/2025/08/reactQuery.png)

## 1. React Query 기본 패턴

React Query는 서버 상태 관리를 위한 강력한 라이브러리로, 주로 세 가지 패턴으로 사용됩니다.

### useQuery

**GET 요청 (데이터 조회)** - 컴포넌트가 마운트될 때 자동으로 실행되는 **선언적** 데이터 fetching 방식입니다.

```typescript
// 🎮 게임 타입 정의
type PlayerClass = "WARRIOR" | "MAGE" | "ARCHER" | "ROGUE";

interface PlayerInventory {
  weapons: GameItem[];
  armor: GameItem[];
  potions: GameItem[];
  gold: number;
}

interface GameItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "potion";
  rarity: "common" | "rare" | "epic" | "legendary";
  level: number;
}

export const usePlayerInventory = (playerClass: PlayerClass) => {
  const playerInventory = useQuery({
    queryKey: ["playerInventory", playerClass],
    queryFn: async () => {
      // GET 요청: 플레이어 인벤토리 정보 조회
      const response = await getPlayerInventory(playerClass);
      return { ...response };
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
  });

  return {
    inventory: playerInventory.data,
    refetch: playerInventory.refetch,
  };
};
```

**특징:**

- 컴포넌트가 **마운트되면 자동 실행**
- **리액티브**하게 데이터 상태 관리 (loading, error, data)
- **캐싱**, **백그라운드 refetch** 등 자동 관리

### useMutation

**POST/PUT/DELETE (데이터 변경)** - 사용자 액션에 의해 수동으로 호출되는 **명령형** 데이터 변경 방식입니다.

```typescript
// 💰 아이템 구매 관련 타입
interface PurchaseResponse {
  success: boolean;
  newItem: GameItem;
  remainingGold: number;
  message: string;
}

export const usePurchaseItem = (playerClass: PlayerClass) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => purchaseGameItem(itemId), // POST 요청
    onSuccess: async () => {
      // 성공하면 관련 캐시 무효화 (fresh 데이터로 다시 가져오기)
      await queryClient.invalidateQueries({
        queryKey: ["playerInventory", playerClass],
      });
    },
  });
};
```

**사용법:**

```typescript
const purchaseItem = usePurchaseItem("WARRIOR");

const handlePurchase = (itemId: string) => {
  purchaseItem.mutate(itemId); // 수동으로 호출
};
```

### fetchQuery

**명령형 데이터 조회** - 필요한 시점에 **즉시** 데이터를 가져와야 할 때 사용하는 **명령형** 조회 방식입니다.

---

## 2. fetchQuery 상세 가이드

React Query의 `fetchQuery`는 주로 다음과 같은 상황에서 사용됩니다:

### 이벤트 핸들러에서 즉시 데이터 조회

```typescript
// ⚔️ 던전 & 파티 관련 타입
interface GameDungeon {
  id: string;
  name: string;
  difficulty: "easy" | "normal" | "hard" | "nightmare";
  minPartySize: number;
  maxPartySize: number;
  requiredLevel: number;
}

interface PartyMember {
  playerId: string;
  characterName: string;
  level: number;
  playerClass: PlayerClass;
  isOnline: boolean;
}

// 게임 예시 - 던전 입장 전 파티원 확인
const enterDungeon = useCallback(async (dungeon: GameDungeon) => {
  // 버튼 클릭 시 즉시 데이터가 필요한 경우
  const partyMembers = await queryClient.fetchQuery({
    queryKey: ["partyMembers", dungeon.id],
    queryFn: () => getPartyMembers(dungeon.id),
    staleTime: 1000 * 30,
  });

  // 데이터를 받아서 즉시 조건 분기 처리
  if (partyMembers.length >= dungeon.minPartySize) {
    navigate("/dungeon-entrance");
  }
}, []);
```

### 조건부 로직과 순차적 API 호출

```typescript
// 🏰 길드 관련 타입
interface Guild {
  id: string;
  name: string;
  type: "BASIC_GUILD" | "PREMIUM_GUILD" | "ELITE_GUILD";
  level: number;
  memberCount: number;
  maxMembers: number;
}

interface GuildRequirements {
  hasGuildPass: boolean;
  requiredLevel: number;
  requiredContribution: number;
}

// 길드 가입 조건 확인 후 다음 단계 결정
if (guild.type === "PREMIUM_GUILD") {
  const { hasGuildPass } = await queryClient.fetchQuery({
    queryKey: ["guildRequirements", guild.id],
    queryFn: () => getGuildRequirements(guild.id),
    staleTime: 1000 * 60 * 5,
  });

  if (!hasGuildPass) {
    navigate("/guild-requirements");
    return;
  }

  // 조건을 만족했으면 길드 멤버 정보 조회
  const guildData = await queryClient.fetchQuery({
    queryKey: ["guildMembers", guild.id],
    queryFn: () => getGuildMembers(guild.id),
  });
}
```

### useQuery vs fetchQuery 차이점

#### useQuery (컴포넌트 훅)

```typescript
// 컴포넌트 렌더링 시 자동으로 실행
const { data, isLoading, error } = useQuery({
  queryKey: ["player", playerId],
  queryFn: () => getPlayerData(playerId),
});

// 컴포넌트가 마운트되면 자동으로 API 호출
// 로딩 상태, 에러 상태를 리액티브하게 관리
```

#### fetchQuery (명령형 호출)

```typescript
// 필요한 시점에 수동으로 실행
const handleClick = async () => {
  try {
    const playerData = await queryClient.fetchQuery({
      queryKey: ["player", playerId],
      queryFn: () => getPlayerData(playerId),
    });

    // 즉시 데이터 활용 가능
    console.log(playerData.characterName);
  } catch (error) {
    console.error("플레이어 데이터 로드 실패");
  }
};
```

### fetchQuery 주요 특징

#### 즉시 Promise 반환

```typescript
// await로 결과를 즉시 받을 수 있음
const result = await queryClient.fetchQuery({...});
```

#### 캐시 활용

```typescript
// 같은 queryKey로 이미 캐시된 데이터가 있으면 재사용
// staleTime 내에서는 네트워크 요청 없이 캐시 반환
```

#### 에러 처리

```typescript
const result = await queryClient
  .fetchQuery({...})
  .catch((error) => {
    // 에러 발생 시 처리
    showErrorModal();
    throw error; // 필요시 재throw
  });
```

### 직접 API 호출 vs fetchQuery

많은 개발자들이 고민하는 부분입니다. 언제 직접 API를 호출하고, 언제 fetchQuery를 사용해야 할까요?

#### 직접 API 호출

```typescript
const handleButtonClick = async () => {
  // 그냥 API 직접 호출
  const data = await getPlayerStats("WARRIOR");

  if (data.level >= 10) {
    navigate("/advanced-dungeon");
  }
};
```

#### fetchQuery 사용

```typescript
const handleButtonClick = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["playerStats", "WARRIOR"],
    queryFn: () => getPlayerStats("WARRIOR"),
  });

  if (data.level >= 10) {
    navigate("/advanced-dungeon");
  }
};
```

### fetchQuery를 사용하는 핵심 이유

#### 캐싱 효과

```typescript
// 시나리오: 사용자가 빠르게 버튼을 여러 번 클릭

// 직접 API 호출 - 매번 네트워크 요청
const onClick1 = () => getPlayerStats('WARRIOR'); // API 호출
const onClick2 = () => getPlayerStats('WARRIOR'); // 또 API 호출
const onClick3 = () => getPlayerStats('WARRIOR'); // 또 API 호출

// fetchQuery - 첫 번째만 API 호출, 나머지는 캐시
const onClick1 = () => queryClient.fetchQuery({...}); // API 호출
const onClick2 = () => queryClient.fetchQuery({...}); // 캐시에서 즉시 반환
const onClick3 = () => queryClient.fetchQuery({...}); // 캐시에서 즉시 반환
```

#### 데이터 일관성

```typescript
// useQuery로 화면에 표시 중
const { inventory } = usePlayerInventory("WARRIOR");

// 버튼 클릭 시 같은 데이터 필요
const handleClick = async () => {
  // fetchQuery 사용 - useQuery와 같은 캐시 공유
  const data = await queryClient.fetchQuery({
    queryKey: ["playerInventory", "WARRIOR"], // 같은 키!
    queryFn: () => getPlayerInventory("WARRIOR"),
  });

  // 만약 직접 API 호출하면 다른 결과가 나올 수 있음
};
```

#### 중복 요청 방지

```typescript
// 동시에 여러 곳에서 같은 데이터 요청하는 상황

// 직접 API 호출 - 3개의 네트워크 요청 발생
Promise.all([
  getPlayerStats('WARRIOR'),
  getPlayerStats('WARRIOR'),
  getPlayerStats('WARRIOR'),
]);

// fetchQuery - 1개의 네트워크 요청만 발생
Promise.all([
  queryClient.fetchQuery({queryKey: ['playerStats', 'WARRIOR'], ...}),
  queryClient.fetchQuery({queryKey: ['playerStats', 'WARRIOR'], ...}),
  queryClient.fetchQuery({queryKey: ['playerStats', 'WARRIOR'], ...}),
]);
```

### 언제 뭘 사용할까?

#### 직접 API 호출이 나은 경우

```typescript
// 1. 일회성이고 캐시가 필요 없는 경우
const sendChatMessage = async () => {
  await postChatMessage(message); // 직접 호출
};

// 2. 게임 로그 전송처럼 항상 새로운 요청이어야 하는 경우
const submitGameResult = async () => {
  await postGameResult(gameData); // 직접 호출
};
```

#### fetchQuery가 나은 경우

```typescript
// 1. useQuery와 같은 데이터를 사용하는 경우
const { data } = useQuery({queryKey: ['player'], ...}); // 화면 표시용

const handleAction = async () => {
  const playerData = await queryClient.fetchQuery({
    queryKey: ['player'], // 같은 데이터!
    queryFn: getPlayerData,
  });
};

// 2. 여러 번 호출될 가능성이 있는 경우
// 3. 성능이 중요한 경우
```

---

## 3. 실전 활용 가이드

### 실제 사용 사례

#### 조건부 네비게이션

```typescript
const enterRaidBattle = async () => {
  // 1. 먼저 플레이어 정보 확인
  const playerInfo = await queryClient.fetchQuery({
    queryKey: ["player"],
    queryFn: getPlayerData,
  });

  // 2. 조건에 따라 다른 페이지로 이동
  if (playerInfo.level >= 50) {
    navigate("/raid-battle");
  } else {
    navigate("/level-up-guide");
  }
};
```

#### 순차적 API 호출

```typescript
const startQuestChain = async () => {
  // 1단계: 퀴스트 전제조건 확인
  const questProgress = await queryClient.fetchQuery({
    queryKey: ["questProgress", questId],
    queryFn: () => getQuestProgress(questId),
  });

  if (!questProgress.prerequisitesMet) {
    alert("전제 퀴스트를 먼저 완료해주세요!");
    return;
  }

  // 2단계: 필요한 아이템 확인
  const requiredItems = await queryClient.fetchQuery({
    queryKey: ["requiredItems", questId],
    queryFn: () => getRequiredItems(questId),
  });

  // 3단계: 퀴스트 시작
  navigate("/quest-start", { state: { questProgress, requiredItems } });
};
```

### 패턴별 비교 정리

|              | useQuery                 | useMutation           | fetchQuery         |
| ------------ | ------------------------ | --------------------- | ------------------ |
| **언제**     | 자동 (컴포넌트 마운트)   | 수동 (사용자 액션)    | 수동 (필요한 시점) |
| **목적**     | 데이터 구독              | 데이터 변경           | 일회성 조회        |
| **반환**     | `{data, loading, error}` | `{mutate, isLoading}` | `Promise<data>`    |
| **상태관리** | 리액티브                 | 리액티브              | 없음 (일회성)      |

### 사용 가이드라인

✅ **fetchQuery 사용하는 경우:**

- 버튼 클릭, 폼 제출 등 **이벤트 핸들러**에서
- **조건부 로직**에 따라 API 호출이 필요할 때
- **순차적 API 호출**이 필요할 때
- 컴포넌트 **외부**에서 데이터가 필요할 때

❌ **fetchQuery 사용하지 않는 경우:**

- 컴포넌트 렌더링 시 자동으로 데이터가 필요한 경우 → `useQuery` 사용
- 로딩/에러 상태를 UI에 반영해야 하는 경우 → `useQuery` 사용

### 결론

**fetchQuery는 "지금 당장 이 데이터가 필요해!"라는 상황에서 사용**합니다.

게임 개발에서는 주로 **던전 입장 전 자격 검증**이나 **퀴스트 진행 조건 확인** 등에 fetchQuery를 활용할 수 있으며, 이미 React Query를 사용 중이라면 **직접 API 호출보다 fetchQuery를 사용하는 것이 캐싱과 성능 면에서 더 효율적**입니다.

---

## 🎮 게임 예제 요약

이 포스트에서 사용한 게임 예제들을 정리하면:

**📊 데이터 조회 (useQuery):**

- 플레이어 인벤토리 정보
- 캐릭터 스탯과 장비
- 자동으로 업데이트되는 게임 상태

**⚡ 데이터 변경 (useMutation):**

- 아이템 구매/판매
- 캐릭터 업그레이드
- 길드 가입/탈퇴

**🎯 즉시 조회 (fetchQuery):**

- 던전 입장 전 파티원 확인
- 퀘스트 수행 조건 검증
- 길드 가입 자격 확인

이런 게임 시나리오들이 **React Query의 각 패턴을 언제 사용해야 하는지** 이해하는 데 도움이 되길 바랍니다! 🚀
