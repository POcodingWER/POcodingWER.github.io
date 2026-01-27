---
layout: post
title: "[INTERVIEW] 프론트엔드 면접 완벽 준비"

subtitle: "JavaScript, TypeScript, React 핵심 면접 질문 총정리"

date: 2026-01-27 08:36:15
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1206/js.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - Interview
tags:
  - JavaScript 면접
  - TypeScript 면접
  - React 면접
  - 프론트엔드 면접
  - 기술 면접
  - 면접 준비
---

## 🔥 TypeScript 기초 면접 질문

### 1. **제네릭 (Generic)**

```typescript
// Q: 제네릭이 무엇이고 왜 사용하나요?
// A: 타입을 변수처럼 사용해서 재사용 가능한 코드 작성
// 장점: 타입 안정성 + 코드 재사용성

function identity<T>(arg: T): T {
  return arg;
}

// 실무 예시: API 응답 타입
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type UserResponse = ApiResponse<User>;
type ProductResponse = ApiResponse<Product>;
```

### 2. **타입 vs 인터페이스**

```typescript
// Q: type과 interface의 차이점은?
// A: 확장성, 선언 병합, 유니온 타입 지원 차이

// Interface - 확장 가능, 선언 병합 가능
interface User {
  name: string;
}
interface User {
  age: number; // 자동으로 병합됨
}

interface Admin extends User {
  role: string; // 확장 가능
}

// Type - 유니온 타입, 계산된 속성, 조건부 타입 가능
type Status = "loading" | "success" | "error";
type UserKeys = keyof User; // "name" | "age"

// 🔥 면접 팁: 객체 모양을 정의할 때는 interface,
// 유니온이나 복잡한 타입 조작은 type 사용!
```

### 3. **유틸리티 타입**

```typescript
// Q: Pick, Omit, Partial 등의 차이점은?
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserName = Pick<User, "name">; // { name: string }
type UserWithoutPassword = Omit<User, "password">; // 민감정보 제외
type PartialUser = Partial<User>; // 모든 속성이 optional
type RequiredUser = Required<Partial<User>>; // 모든 속성이 required

// 실무 활용 예시
type CreateUserRequest = Omit<User, "id">; // id 제외하고 생성
type UpdateUserRequest = Partial<Omit<User, "id">>; // id 제외하고 부분 업데이트
```

### 4. **타입 가드 (Type Guards)**

```typescript
// Q: 타입 가드란 무엇이고 언제 사용하나요?
// A: 런타임에서 타입을 좁혀나가는 기법

// 기본 타입 가드
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// 객체 타입 가드
interface Cat {
  meow(): void;
}
interface Dog {
  bark(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return "meow" in animal;
}

// 사용 예시
function handleAnimal(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow(); // TypeScript가 Cat으로 인식
  } else {
    animal.bark(); // TypeScript가 Dog로 인식
  }
}
```

## 🔥 JavaScript 기초 면접 질문

### 5. **호이스팅 (Hoisting)**

```javascript
// Q: 호이스팅이 무엇인가요?
// A: 변수/함수 선언이 스코프 최상단으로 끌어올려지는 현상

console.log(x); // undefined (not error)
var x = 5;

// 실제로는 이렇게 동작
var x;
console.log(x); // undefined
x = 5;

// 🔥 중요: let, const는 호이스팅되지만 TDZ(Temporal Dead Zone)에 있음
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// 함수 선언문 vs 함수 표현식
console.log(func1()); // "Hello" - 함수 선언문은 완전히 호이스팅
console.log(func2()); // TypeError - 변수만 호이스팅, 함수는 아직 할당 안됨

function func1() {
  return "Hello";
}

var func2 = function () {
  return "World";
};
```

### 6. **클로저 (Closure)**

```javascript
// Q: 클로저란 무엇인가요?
// A: 함수가 선언될 때의 렉시컬 환경을 기억하는 것
// 외부 함수의 변수에 접근할 수 있는 내부 함수

function outer() {
  let count = 0;
  return function inner() {
    count++; // 외부 변수에 접근
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2 - count가 유지됨!

// 🔥 실무 활용: 모듈 패턴, 데이터 은닉
const calculator = (function () {
  let result = 0; // private 변수

  return {
    add: function (x) {
      result += x;
      return this;
    },
    multiply: function (x) {
      result *= x;
      return this;
    },
    getResult: function () {
      return result;
    },
  };
})();

calculator.add(5).multiply(2).getResult(); // 10

// 🚨 클로저 메모리 누수 주의점
function attachListeners() {
  let someData = new Array(1000000).fill("data");

  document.getElementById("button").onclick = function () {
    // someData가 계속 참조되어 메모리에서 해제되지 않음
    console.log("clicked");
  };
}
```

### 7. **this 바인딩**

```javascript
// Q: this가 무엇을 가리키는지 설명하세요
// A: 함수가 호출되는 방식에 따라 결정됨

const obj = {
  name: "Kim",
  getName: function () {
    return this.name; // obj를 가리킴 (메서드 호출)
  },
  getNameArrow: () => {
    return this.name; // 상위 스코프의 this (전역 또는 undefined)
  },
};

// 🔥 this 바인딩 4가지 규칙
// 1. 기본 바인딩 (전역)
function globalFunc() {
  console.log(this); // window (브라우저) 또는 global (Node.js)
}

// 2. 암시적 바인딩 (객체 메서드)
obj.getName(); // this = obj

// 3. 명시적 바인딩 (call, apply, bind)
const person = { name: "Lee" };
obj.getName.call(person); // this = person

// 4. new 바인딩 (생성자 함수)
function Person(name) {
  this.name = name; // this = 새로 생성된 객체
}

// 🚨 자주 실수하는 케이스
const btn = document.getElementById("btn");
btn.addEventListener("click", obj.getName); // this = btn (DOM 요소)

// 해결방법 1: 화살표 함수
btn.addEventListener("click", () => obj.getName());

// 해결방법 2: bind 사용
btn.addEventListener("click", obj.getName.bind(obj));
```

### 8. **Promise vs async/await**

```javascript
// Q: Promise와 async/await의 차이점은?
// A: Promise는 병렬 처리와 세밀한 에러 처리에 강점, async/await는 가독성에 강점

// 🔥 Promise 장점
// 1. 병렬 처리 최적화
Promise.all([fetch("/api/user"), fetch("/api/posts")]) // 동시 실행
  .then(([userRes, postsRes]) => {
    // 모든 요청 완료 후 실행
  });

Promise.race([fetch("/api/fast"), fetch("/api/slow")]) // 가장 빠른 것만
  .then((result) => console.log("첫 번째 완료"));

Promise.allSettled([...promises]) // 일부 실패해도 계속 진행
  .then((results) => {
    // 성공/실패 구분해서 처리
  });

// 2. 세밀한 에러 처리
fetch("/api/user")
  .then((response) => response.json())
  .catch((error) => {
    if (error.code === "NETWORK_ERROR") {
      return { fallback: true }; // 에러 복구
    }
    throw error; // 다른 에러는 재전파
  });

// 3. resolve/reject 직접 제어
new Promise((resolve, reject) => {
  if (condition) {
    resolve("성공");
  } else {
    reject(new Error("실패"));
  }
});

// 🔥 async/await 장점
// 1. 가독성 (동기 코드처럼 읽힘)
async function fetchData() {
  const user = await fetch("/api/user");
  const posts = await fetch("/api/posts");
  return { user, posts };
}

// 🚨 async/await 단점
// 1. 병렬 처리 실수하기 쉬움
async function slowCode() {
  const user = await fetch("/api/user"); // 1초 대기
  const posts = await fetch("/api/posts"); // 또 1초 대기 (총 2초)
}

// 2. 에러 처리가 단순함
async function simpleError() {
  try {
    const data = await fetch("/api");
  } catch (error) {
    // 모든 에러를 동일하게 처리
    console.error(error);
  }
}

// 🎯 언제 뭘 사용할까?
// Promise: 병렬 처리, 복잡한 에러 처리, 조건부 로직
// async/await: 단순한 순차 처리, 가독성 중요할 때
```

### 9. **이벤트 루프 (Event Loop)**

```javascript
// Q: 이벤트 루프가 무엇이고 어떻게 동작하나요?
// A: JavaScript의 비동기 처리 메커니즘

console.log("1"); // 동기

setTimeout(() => {
  console.log("2"); // 매크로 태스크
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // 마이크로 태스크
});

console.log("4"); // 동기

// 출력 순서: 1 → 4 → 3 → 2

// 🔥 실행 순서 우선순위
// 1. Call Stack (동기 코드)
// 2. Microtask Queue (Promise, queueMicrotask)
// 3. Macrotask Queue (setTimeout, setInterval, I/O)

// 복잡한 예시
async function complexExample() {
  console.log("A");

  setTimeout(() => console.log("B"), 0);

  await Promise.resolve();
  console.log("C");

  setTimeout(() => console.log("D"), 0);

  Promise.resolve().then(() => console.log("E"));

  console.log("F");
}

complexExample();
// 출력: A → C → F → E → B → D
```

## 🔥 React 기초 면접 질문

### 10. **useState vs useEffect**

```typescript
// Q: useState와 useEffect의 역할은?
// A: useState는 상태 관리, useEffect는 사이드 이펙트 처리

function Component() {
  const [count, setCount] = useState(0); // 상태 관리
  const [user, setUser] = useState<User | null>(null);

  // 마운트 시에만 실행 (componentDidMount)
  useEffect(() => {
    fetchUser().then(setUser);
  }, []); // 빈 배열

  // count 변경 시마다 실행 (componentDidUpdate)
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]); // 의존성 배열

  // 정리(cleanup) 함수 (componentWillUnmount)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer); // 정리 함수
  }, []);

  // 🚨 흔한 실수들
  // 1. 의존성 배열 누락
  useEffect(() => {
    // count를 사용하지만 의존성 배열에 없음 - 버그!
    console.log(count);
  }, []); // 잘못됨

  // 2. 무한 루프
  useEffect(() => {
    setCount(count + 1); // count가 변경되면 다시 실행됨
  }, [count]); // 무한 루프!

  return <div>{count}</div>;
}
```

### 11. **useCallback vs useMemo**

```typescript
// Q: useCallback과 useMemo의 차이점은?
// A: useCallback은 함수 메모이제이션, useMemo는 값 메모이제이션

interface Item {
  id: number;
  name: string;
  price: number;
}

function Component({ items, onItemClick }: { items: Item[], onItemClick: (id: number) => void }) {
  const [filter, setFilter] = useState('');

  // 🔥 useCallback - 함수 메모이제이션
  // 의존성이 변경되지 않으면 같은 함수 참조 반환
  const handleClick = useCallback((id: number) => {
    console.log("clicked", id);
    onItemClick(id);
  }, [onItemClick]); // onItemClick이 변경될 때만 새 함수 생성

  // 🔥 useMemo - 값 메모이제이션
  // 의존성이 변경되지 않으면 이전 계산 결과 반환
  const expensiveValue = useMemo(() => {
    console.log('계산 실행됨'); // 의존성 변경시에만 실행
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  // 필터링된 아이템들
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  // 🚨 잘못된 사용 예시
  const badCallback = useCallback(() => {
    // filter를 사용하지만 의존성 배열에 없음
    console.log(filter);
  }, []); // 버그! filter 변경이 반영되지 않음

  const badMemo = useMemo(() => {
    return items.length; // 간단한 계산은 메모이제이션 불필요
  }, [items]);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div>총 가격: {expensiveValue}</div>
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
}

// 🔥 언제 사용해야 할까?
// useCallback: 자식 컴포넌트에 props로 전달하는 함수
// useMemo: 복잡한 계산 결과, 자식 컴포넌트에 전달하는 객체/배열
```

### 12. **React 라이프사이클 완전 정리**

```typescript
// Q: React의 라이프사이클 메서드들은?
// A: 클래스형과 함수형 컴포넌트로 나뉨

// 🔥 클래스형 컴포넌트 라이프사이클
class ClassComponent extends React.Component {
  // 1. 마운트 단계
  constructor(props) {
    super(props);
    this.state = { data: null };
    console.log('1. constructor - 컴포넌트 생성');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps - props로부터 state 도출');
    return null; // state 변경 없음
  }

  componentDidMount() {
    console.log('3. componentDidMount - DOM에 마운트 완료');
    // API 호출, 이벤트 리스너 등록
    this.fetchData();
  }

  // 2. 업데이트 단계
  shouldComponentUpdate(nextProps, nextState) {
    console.log('4. shouldComponentUpdate - 리렌더링 여부 결정');
    return true; // false면 렌더링 스킵
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('5. getSnapshotBeforeUpdate - DOM 업데이트 직전');
    return null; // snapshot 값 반환
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('6. componentDidUpdate - DOM 업데이트 완료');
    if (prevProps.userId !== this.props.userId) {
      this.fetchData(); // props 변경 시 재요청
    }
  }

  // 3. 언마운트 단계
  componentWillUnmount() {
    console.log('7. componentWillUnmount - 컴포넌트 제거 직전');
    // 이벤트 리스너 제거, 타이머 정리
    this.cleanup();
  }

  // 4. 에러 처리
  static getDerivedStateFromError(error) {
    console.log('8. getDerivedStateFromError - 에러 발생');
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('9. componentDidCatch - 에러 정보 로깅');
    // 에러 로깅 서비스에 전송
  }
}

// 🔥 함수형 컴포넌트 라이프사이클 (Hooks)
function FunctionComponent({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. componentDidMount
  useEffect(() => {
    console.log('마운트됨');
    fetchInitialData();

    return () => {
      console.log('언마운트됨'); // componentWillUnmount
    };
  }, []); // 빈 배열 = 마운트시에만

  // 2. componentDidUpdate (특정 값 변경)
  useEffect(() => {
    console.log('userId 변경됨');
    fetchUser(userId);
  }, [userId]); // userId 변경시에만

  // 3. componentDidUpdate (모든 렌더링)
  useEffect(() => {
    console.log('렌더링 완료');
  }); // 의존성 없음 = 매번

  // 4. shouldComponentUpdate 역할
  const MemoizedChild = React.memo(({ data }) => {
    return <div>{data}</div>;
  }, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data; // true면 리렌더링 스킵
  });

  // 5. getDerivedStateFromProps 역할
  const derivedValue = useMemo(() => {
    return computeExpensiveValue(props);
  }, [props]);

  // 6. Error Boundary (함수형에서는 불가능, 클래스형만 가능)
  // 대신 react-error-boundary 라이브러리 사용
}

// 🔥 최신 React 18 라이프사이클
function ModernComponent() {
  // useLayoutEffect - DOM 변경 후 동기적 실행
  useLayoutEffect(() => {
    console.log('DOM 변경 후 즉시 실행 (동기)');
    // 레이아웃 측정, DOM 조작
  }, []);

  // useInsertionEffect - CSS-in-JS 라이브러리용
  useInsertionEffect(() => {
    console.log('DOM 변경 전 실행');
    // 스타일 주입
  }, []);

  // useDeferredValue - 긴급하지 않은 업데이트 지연
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // useTransition - 업데이트 우선순위 조절
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      // 낮은 우선순위 업데이트
      setLargeList(newData);
    });
  };
}

// 🎯 라이프사이클 실행 순서
// 마운트: constructor → getDerivedStateFromProps → render → componentDidMount
// 업데이트: getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate
// 언마운트: componentWillUnmount
// 에러: getDerivedStateFromError → componentDidCatch
```

### 13. **React.memo와 최적화**

```typescript
// Q: React.memo는 언제 사용하나요?
// A: 불필요한 리렌더링을 방지하기 위해 사용

interface ChildProps {
  name: string;
  age: number;
  onClick: () => void;
}

// 🔥 React.memo로 메모이제이션
const Child = React.memo(({ name, age, onClick }: ChildProps) => {
  console.log('Child 렌더링됨');

  return (
    <div onClick={onClick}>
      {name} ({age}세)
    </div>
  );
});

// 커스텀 비교 함수
const ChildWithCustomCompare = React.memo(
  ({ name, age, onClick }: ChildProps) => {
    return <div onClick={onClick}>{name} ({age}세)</div>;
  },
  (prevProps, nextProps) => {
    // true 반환 시 리렌더링 스킵, false 반환 시 리렌더링
    return prevProps.name === nextProps.name &&
           prevProps.age === nextProps.age;
    // onClick은 비교하지 않음 (함수는 항상 다른 참조)
  }
);

function Parent() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'Kim', age: 25 });

  // 🚨 잘못된 예: 매번 새로운 함수 생성
  const handleClick = () => {
    console.log('clicked');
  };

  // 🔥 올바른 예: useCallback으로 함수 메모이제이션
  const handleClickMemo = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      {/* count 변경 시 Child도 리렌더링됨 (handleClick이 매번 새로 생성) */}
      <Child
        name={user.name}
        age={user.age}
        onClick={handleClick}
      />

      {/* count 변경 시 Child 리렌더링 안됨 (props가 동일) */}
      <Child
        name={user.name}
        age={user.age}
        onClick={handleClickMemo}
      />
    </div>
  );
}
```

## 🔥 실무 관련 질문

### 14. **이벤트 버블링/캡처링**

```javascript
// Q: 이벤트 전파 방식을 설명하세요
// A: 캡처링 → 타겟 → 버블링 순서로 전파

// HTML: <div id="parent"><div id="child">Click me</div></div>

// 🔥 이벤트 전파 3단계
// 1. 캡처링 단계: 루트에서 타겟으로
document.getElementById("parent").addEventListener(
  "click",
  () => {
    console.log("Parent 캡처링");
  },
  true,
); // true = 캡처링 단계에서 실행

// 2. 타겟 단계: 실제 클릭된 요소
document.getElementById("child").addEventListener("click", (e) => {
  console.log("Child 타겟");
  // e.stopPropagation(); // 버블링 중단
});

// 3. 버블링 단계: 타겟에서 루트로 (기본값)
document.getElementById("parent").addEventListener("click", () => {
  console.log("Parent 버블링");
}); // false = 버블링 단계에서 실행 (기본값)

// 클릭 시 출력 순서: Parent 캡처링 → Child 타겟 → Parent 버블링

// 🔥 실무 활용: 이벤트 위임 (Event Delegation)
document.getElementById("parent").addEventListener("click", (e) => {
  if (e.target.matches(".button")) {
    console.log("버튼 클릭됨:", e.target.textContent);
  }
});

// 동적으로 추가된 버튼들도 자동으로 이벤트 처리됨
const newButton = document.createElement("button");
newButton.className = "button";
newButton.textContent = "새 버튼";
document.getElementById("parent").appendChild(newButton);

// 🚨 주의사항
// preventDefault(): 기본 동작 막기 (링크 이동, 폼 제출 등)
// stopPropagation(): 이벤트 전파 막기
// stopImmediatePropagation(): 같은 요소의 다른 리스너도 막기
```

### 15. **얕은 복사 vs 깊은 복사**

```javascript
// Q: 얕은 복사와 깊은 복사의 차이점은?
// A: 중첩된 객체의 참조 복사 여부

const original = {
  a: 1,
  b: { c: 2, d: [3, 4] },
  e: new Date(),
  f: function () {
    return "hello";
  },
};

// 🔥 얕은 복사 방법들
const shallow1 = { ...original }; // 스프레드 연산자
const shallow2 = Object.assign({}, original); // Object.assign
const shallow3 = Object.create(original); // 프로토타입 체인

shallow1.a = 10; // ✅ 원본에 영향 없음
shallow1.b.c = 20; // ❌ 원본도 변경됨 (참조 공유)

console.log(original.b.c); // 20 - 변경됨!

// 🔥 깊은 복사 방법들
// 1. JSON 방식 (한계: 함수, Date, RegExp 등 손실)
const deep1 = JSON.parse(JSON.stringify(original));
// 문제: f 함수 사라짐, Date 객체가 문자열이 됨

// 2. structuredClone (최신 브라우저)
const deep2 = structuredClone(original);
// 장점: Date, RegExp, Map, Set 등 지원
// 단점: 함수는 여전히 복사 안됨

// 3. 재귀 함수로 직접 구현
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

// 4. Lodash 라이브러리
// const deep3 = _.cloneDeep(original);

// 🔥 실무 활용
// React에서 상태 업데이트 시
const [user, setUser] = useState({
  name: "Kim",
  address: { city: "Seoul", district: "Gangnam" },
});

// ❌ 잘못된 방법 (얕은 복사)
const updateUser = () => {
  user.address.city = "Busan"; // 직접 변경 - React가 감지 못함
  setUser(user);
};

// ✅ 올바른 방법 (새 객체 생성)
const updateUserCorrect = () => {
  setUser({
    ...user,
    address: {
      ...user.address,
      city: "Busan",
    },
  });
};

// 🔥 배열의 경우
const originalArray = [1, [2, 3], { a: 4 }];

// 얕은 복사
const shallowArray = [...originalArray];
shallowArray[1][0] = 99; // original도 변경됨

// 깊은 복사
const deepArray = JSON.parse(JSON.stringify(originalArray));
```

### 16. **디바운스/쓰로틀**

```javascript
// Q: 디바운스와 쓰로틀의 차이점은?
// A: 함수 호출 빈도를 제한하는 기법

// 🔥 디바운스: 마지막 호출 후 일정 시간 대기
// 연속된 호출을 하나로 그룹화 (검색 자동완성에 적합)
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // 이전 타이머 취소
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 🔥 쓰로틀: 일정 시간 간격으로만 실행
// 정해진 간격으로 함수 실행 (스크롤 이벤트에 적합)
function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// 🔥 실무 활용 예시

// 1. 검색 자동완성 (디바운스)
const searchInput = document.getElementById("search");
const debouncedSearch = debounce(async (query) => {
  if (query.length > 2) {
    const results = await fetch(`/api/search?q=${query}`);
    // 검색 결과 표시
  }
}, 300); // 300ms 후 실행

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value);
});

// 2. 스크롤 이벤트 (쓰로틀)
const throttledScroll = throttle(() => {
  const scrollY = window.scrollY;
  // 스크롤 위치에 따른 처리
  if (scrollY > 100) {
    document.body.classList.add("scrolled");
  }
}, 100); // 100ms마다 실행

window.addEventListener("scroll", throttledScroll);

// 3. 윈도우 리사이즈 (디바운스)
const debouncedResize = debounce(() => {
  // 리사이즈 완료 후 레이아웃 재계산
  calculateLayout();
}, 250);

window.addEventListener("resize", debouncedResize);

// 🔥 React에서 사용하기
function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // useCallback과 함께 사용
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length > 2) {
        const response = await fetch(`/api/search?q=${searchQuery}`);
        const data = await response.json();
        setResults(data);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어 입력..."
      />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

// 🔥 고급 버전: 즉시 실행 옵션
function debounceAdvanced(func, delay, immediate = false) {
  let timeoutId;
  return function (...args) {
    const callNow = immediate && !timeoutId;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func.apply(this, args);
    }, delay);

    if (callNow) func.apply(this, args);
  };
}

// 취소 가능한 디바운스
function debounceWithCancel(func, delay) {
  let timeoutId;

  const debounced = function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };

  debounced.cancel = function () {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
}
```

### 17. **웹 성능 최적화**

```javascript
// Q: 웹 성능 최적화 방법들을 설명하세요

// 🔥 1. 이미지 최적화
// - WebP, AVIF 포맷 사용
// - 적절한 크기로 리사이징
// - 지연 로딩 (Lazy Loading)
const lazyImages = document.querySelectorAll("img[data-src]");
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove("lazy");
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach((img) => imageObserver.observe(img));

// 🔥 2. 코드 스플리팅 (React)
// 동적 import로 필요한 시점에 로드
const LazyComponent = React.lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// 🔥 3. 메모이제이션 패턴
const cache = new Map();

function expensiveCalculation(input) {
  if (cache.has(input)) {
    return cache.get(input); // 캐시된 결과 반환
  }

  // 복잡한 계산
  const result = heavyComputation(input);
  cache.set(input, result);
  return result;
}

// 🔥 4. Virtual Scrolling (대량 데이터)
function VirtualList({ items, itemHeight = 50 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 400;

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length,
  );

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div
        style={{
          height: items.length * itemHeight,
          position: "relative",
          width: "100%",
        }}
      >
        {visibleItems.map((item, i) => {
          const itemIndex = startIndex + i;
          return (
            <div
              key={item.id ?? itemIndex}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: itemIndex * itemHeight,
                height: itemHeight,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 🔥 5. Web Workers (무거운 작업 분리)
// main.js
const worker = new Worker("worker.js");
worker.postMessage({ data: largeDataSet });
worker.onmessage = (e) => {
  console.log("결과:", e.data);
};

// worker.js
self.onmessage = function (e) {
  const result = processLargeData(e.data.data);
  self.postMessage(result);
};

// 🔥 6. 리소스 힌트
// HTML head에 추가
// <link rel="preload" href="critical.css" as="style">
// <link rel="prefetch" href="next-page.js">
// <link rel="preconnect" href="https://api.example.com">
```

### 18. **보안 관련 질문**

```javascript
// Q: 프론트엔드에서 주의해야 할 보안 이슈들은?

// 🔥 1. XSS (Cross-Site Scripting) 방지
// 사용자 입력을 그대로 HTML에 삽입하지 말 것
const userInput = '<script>alert("XSS")</script>';

// ❌ 위험한 방법
document.innerHTML = userInput;

// ✅ 안전한 방법
document.textContent = userInput; // 텍스트로만 처리
// 또는 DOMPurify 라이브러리 사용

// React에서는 기본적으로 XSS 방지됨
function Component({ userContent }) {
  return <div>{userContent}</div>; // 자동으로 이스케이프됨

  // ❌ 위험: dangerouslySetInnerHTML 사용 시
  return <div dangerouslySetInnerHTML={{ __html: userContent }} />;
}

// 🔥 2. CSRF (Cross-Site Request Forgery) 방지
// CSRF 토큰 사용
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch("/api/transfer", {
  method: "POST",
  headers: {
    "X-CSRF-Token": csrfToken,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ amount: 1000 }),
});

// 🔥 3. 민감한 정보 보호
// ❌ 로컬 스토리지에 민감 정보 저장 금지
localStorage.setItem("password", "secret123"); // 절대 금지!
localStorage.setItem("accessToken", "token"); // 위험함

// ✅ HttpOnly 쿠키 사용 (서버에서 설정)
// Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict

// 🔥 4. Content Security Policy (CSP)
// HTML head에 추가
// <meta http-equiv="Content-Security-Policy"
//       content="default-src 'self'; script-src 'self' 'unsafe-inline';">

// 🔥 5. 입력 검증
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
```

### 19. **브라우저 호환성**

```javascript
// Q: 브라우저 호환성을 어떻게 처리하나요?

// 🔥 1. Feature Detection
if ('IntersectionObserver' in window) {
  // IntersectionObserver 사용
  const observer = new IntersectionObserver(callback);
} else {
  // 폴백 방법 사용
  window.addEventListener('scroll', throttledScrollHandler);
}

// 🔥 2. Polyfill 사용
// Promise polyfill for IE
if (!window.Promise) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js';
  document.head.appendChild(script);
}

// 🔥 3. CSS 호환성
// CSS에서 fallback 제공
.button {
  background-color: #007bff; /* 기본값 */
  background-color: var(--primary-color, #007bff); /* CSS 변수 지원 시 */
}

// CSS Grid fallback
.grid-container {
  display: flex; /* 기본값 */
  flex-wrap: wrap;
}

@supports (display: grid) {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

// 🔥 4. Babel 설정 (.babelrc)
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      },
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}

// 🔥 5. 점진적 향상 (Progressive Enhancement)
// 기본 기능부터 구현 후 고급 기능 추가
function enhanceForm() {
  const form = document.getElementById('myForm');

  // 기본: 일반 폼 제출
  form.addEventListener('submit', function(e) {
    // 기본 검증
    if (!validateForm()) {
      e.preventDefault();
      return;
    }
  });

  // 향상: AJAX 제출 (지원 시)
  if (window.fetch) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitFormAjax();
    });
  }
}
```
