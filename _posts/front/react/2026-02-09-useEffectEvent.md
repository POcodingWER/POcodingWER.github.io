---
layout: post
title: "[React] useEffectEvent로 해결하는 useEffect의 고질적 문제"

subtitle: "stale closure 문제를 우아하게 해결하는 새로운 Hook"

date: 2026-02-09 09:13:46
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2026/02/useEffectEvent.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - ReactGuide
tags:
  - React
  - useEffectEvent
  - useEffect
  - Hook
---

{% include post/react/contents.md %}

---

React 개발자라면 누구나 한 번쯤은 `useEffect`로 인한 버그를 경험해봤을 것입니다. 무한 루프, stale closure, 의존성 배열 관리의 어려움... 이러한 문제들이 React 애플리케이션의 가장 큰 버그 원인 중 하나였습니다.

하지만 React 팀이 드디어 이 문제에 대한 해답을 제시했습니다. 바로 `useEffectEvent`입니다.

## useEffect의 고질적인 문제점

### Stale Closure 문제

가장 흔히 마주치는 문제를 예시로 살펴보겠습니다:

```js
function MyUserInfo() {
  const [userName, setUserName] = useState("Bob");
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    let loggedInTime = 0;
    const interval = setInterval(() => {
      loggedInTime++;
      setLoginMessage(
        `${userName} has been logged in for ${loggedInTime} seconds`,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>{loginMessage}</div>
      <input
        value={userName}
        onChange={(evt) => setUserName(evt.target.value)}
      />
    </div>
  );
}
```

이 코드는 언뜻 보면 정상적으로 작동할 것 같지만, 사용자 이름을 변경해도 로그인 메시지는 여전히 "Bob"을 표시합니다. 이는 `useEffect` 내부의 클로저가 초기 `userName` 값을 "기억"하고 있기 때문입니다.

### 의존성 배열 추가의 부작용

이 문제를 해결하기 위해 `userName`을 의존성 배열에 추가하면:

```javascript
useEffect(() => {
  let loggedInTime = 0;
  const interval = setInterval(() => {
    loggedInTime++;
    setLoginMessage(
      `${userName} has been logged in for ${loggedInTime} seconds`,
    );
  }, 1000);
  return () => clearInterval(interval);
}, [userName]); // userName 추가
```

이제 사용자 이름은 정상적으로 업데이트되지만, 이름을 변경할 때마다 타이머가 리셋되어 로그인 시간이 다시 1초부터 시작됩니다.

## 기존 해결책: useRef

이전에는 이런 문제를 `useRef`로 해결했습니다:

```javascript
const nameRef = useRef(userName);
nameRef.current = userName;

useEffect(() => {
  let loggedInTime = 0;
  const interval = setInterval(() => {
    loggedInTime++;
    setLoginMessage(
      `${nameRef.current} has been logged in for ${loggedInTime} seconds`,
    );
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

이 방법은 작동하지만 코드가 복잡하고 직관적이지 않습니다.

## useEffectEvent: 우아한 해결책

`useEffectEvent`를 사용하면 이 문제를 훨씬 깔끔하게 해결할 수 있습니다:

```javascript
const getName = useEffectEvent(() => userName);

useEffect(() => {
  let loggedInTime = 0;
  const interval = setInterval(() => {
    loggedInTime++;
    setLoginMessage(
      `${getName()} has been logged in for ${loggedInTime} seconds`,
    );
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

`useEffectEvent`로 생성된 함수는 절대 stale하지 않으며, 의존성 배열에 추가할 필요도 없습니다.

## 더 나은 패턴: 관심사 분리

`useEffectEvent`를 사용하면 로직을 더 명확하게 분리할 수 있습니다:

```javascript
const onTick = useEffectEvent((tick) =>
  setLoginMessage(`${userName} has been logged in for ${tick} seconds`),
);

useEffect(() => {
  let ticks = 0;
  const interval = setInterval(() => onTick(++ticks), 1000);
  return () => clearInterval(interval);
}, []);
```

이제 `useEffect`는 순수하게 타이머 로직만 담당하고, 상태 관련 로직은 `useEffectEvent`에서 처리합니다.

## 커스텀 Hook으로 재사용성 높이기

이 패턴을 커스텀 Hook으로 만들면 재사용성이 높아집니다:

```javascript
function useInterval(onTick, timeout = 1000) {
  const onTickEvent = useEffectEvent(onTick);

  useEffect(() => {
    let ticks = 0;
    const interval = setInterval(() => onTickEvent(++ticks), timeout);
    return () => clearInterval(interval);
  }, [timeout]);
}

// 사용법
function MyComponent() {
  const [userName, setUserName] = useState("Bob");
  const [loginMessage, setLoginMessage] = useState("");

  useInterval((tick) => {
    setLoginMessage(`${userName} has been logged in for ${tick} seconds`);
  });

  return (
    <div>
      <div>{loginMessage}</div>
      <input
        value={userName}
        onChange={(evt) => setUserName(evt.target.value)}
      />
    </div>
  );
}
```

## useEffectEvent의 핵심 장점

### 1. 의존성 배열에서 상태 제거

`useEffectEvent`를 사용하면 상태를 의존성 배열에서 제거할 수 있어 `useEffect`가 더 안정적이 됩니다.

### 2. Stale Closure 문제 해결

항상 최신 값에 접근할 수 있어 stale closure 문제가 발생하지 않습니다.

### 3. 코드 가독성 향상

`useRef`를 사용한 복잡한 패턴 대신 직관적인 함수 호출로 문제를 해결할 수 있습니다.

### 4. 관심사 분리

Effect 로직과 상태 로직을 명확하게 분리할 수 있습니다.

## 실제 사용 사례

### API 호출과 상태 업데이트

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useEffectEvent(async (id) => {
    setLoading(true);
    try {
      const userData = await api.getUser(id);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  return <div>{loading ? "Loading..." : user?.name}</div>;
}
```

### 이벤트 리스너와 상태 동기화

```javascript
function WindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [theme, setTheme] = useState("light");

  const handleResize = useEffectEvent(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    // theme 상태도 함께 사용 가능
    console.log(`Resized in ${theme} theme`);
  });

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <p>
        Size: {size.width} x {size.height}
      </p>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## 주의사항과 베스트 프랙티스

### 1. useEffectEvent는 Effect 내부에서만 호출

`useEffectEvent`로 생성된 함수는 반드시 Effect 내부에서만 호출해야 합니다.

```javascript
// ❌ 잘못된 사용
const handleClick = useEffectEvent(() => {
  // some logic
});

return <button onClick={handleClick}>Click</button>;

// ✅ 올바른 사용
const handleClick = useEffectEvent(() => {
  // some logic
});

useEffect(() => {
  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, []);
```

### 2. 과도한 사용 지양

모든 함수를 `useEffectEvent`로 감쌀 필요는 없습니다. 정말 필요한 경우에만 사용하세요.

### 3. 디버깅 고려

`useEffectEvent` 함수는 디버깅이 어려울 수 있으므로, 복잡한 로직은 별도 함수로 분리하는 것을 고려하세요.

## 마무리

`useEffectEvent`는 React의 오랜 숙제였던 `useEffect` 관련 문제들을 우아하게 해결해주는 강력한 도구입니다. Cloudflare와 같은 대형 서비스에서도 겪었던 `useEffect` 관련 버그들을 예방할 수 있게 해줍니다.

React 19.2에서 정식으로 사용할 수 있으니, 여러분의 프로젝트에서도 적극 활용해보시기 바랍니다. 더 안정적이고 유지보수하기 쉬운 React 애플리케이션을 만드는 데 큰 도움이 될 것입니다.

---

**참고 자료:**

- [React has finally solved its biggest problem: The joys of useEffectEvent - LogRocket Blog](https://blog.logrocket.com/react-has-finally-solved-its-biggest-problem-useeffectevent/)
- [React 19.2 Documentation](https://react.dev/reference/react/useEffectEvent)
