---
layout: post
title: "[TS] TypeScript 심화 정리"

subtitle: "시니어로 올라가기 위한 TypeScript 핵심 개념"

date: 2026-02-26 09:01:10
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1112/ts.png"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - TypeScript
tags:
  - TypeScript
  - infer
  - Utility Types
  - Conditional Types
  - Discriminated Union
  - Template Literal Types
  - 타입 가드
---

{% include post/ts_contents.md %}

---

> 시니어로 올라가기 위한 TypeScript 핵심 개념

---

## 1. infer

**한 줄 요약**: 타입 구조 안에서 타입을 꺼내는 것

```ts
// Promise 안에서 타입 꺼내기
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type Result = Unwrap<Promise<string>>; // → string
type Result2 = Unwrap<string>; // → string (Promise 아니면 그냥 T)
```

```ts
// 함수 리턴 타입 꺼내기
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

async function fetchUser(): Promise<{ id: number; name: string }> {
  /* ... */
}

type UserData = MyReturnType<typeof fetchUser>;
// → Promise<{ id: number; name: string }>
```

**왜 any랑 다르냐**

- `any` = 타입 추적 포기, 뭐든 통과
- `infer` = 타입 분석해서 정확하게 유지

**직접 쓸 일은 거의 없지만** `ReturnType`, `Awaited` 같은 내장 유틸리티 타입들이 전부 `infer`로 만들어져 있음. 동작 원리 이해하는 게 목표.

---

## 2. Utility Types

#### Partial - 전부 선택으로

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UpdateUserForm = Partial<User>;
// → { id?: number; name?: string; email?: string }

// 내부 구현
type Partial<T> = {
  [K in keyof T]?: T[K];
};
```

#### Required - 전부 필수로

```ts
type RequiredUser = Required<Partial<User>>;
// → { id: number; name: string; email: string }

// 내부 구현
type Required<T> = {
  [K in keyof T]-?: T[K]; // -? 는 ? 제거
};
```

#### Pick - 원하는 것만 골라

```ts
type UserPreview = Pick<User, "id" | "name">;
// → { id: number; name: string }

// 내부 구현
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

#### Omit - 원하는 것만 빼

```ts
type UserWithoutEmail = Omit<User, "email">;
// → { id: number; name: string }
```

#### 실무 활용 패턴

```ts
type CreateUserForm = Omit<User, "id">; // id 없이 생성
type UpdateUserForm = Partial<Omit<User, "id">>; // id 없이 부분 수정
type UserPreview = Pick<User, "id" | "name">; // 일부만 표시

// User에 phone 추가되면 위 타입들 자동 반영 ✅
// ?:로 직접 만들면 전부 손으로 수정해야 함 ❌
```

---

## 3. keyof & in

#### keyof - 객체 타입의 키 뽑기

```ts
type UserKeys = keyof User;
// → "id" | "name" | "email"

// 활용
function getValue(obj: User, key: keyof User) {
  return obj[key];
}

getValue(user, "name"); // ✅
getValue(user, "없는키"); // ❌ 컴파일 에러
```

#### in - 키 하나씩 순회 (for문이랑 같은 개념)

```ts
type Partial<T> = {
  [K in keyof T]?: T[K];
  //  ^^^^^^^^^^
  //  keyof T로 키 뽑고
  //  in으로 하나씩 돌면서 ? 붙임
};
```

---

## 4. never

**한 줄 요약**: 절대 오면 안 됨. 아무것도 할당 불가

```ts
const a: never = "string"; // ❌
const b: never = 123; // ❌
const c: never = null; // ❌
const d: never = undefined; // ❌
```

#### 실무에서 케이스 누락 방지

```ts
type Status = "loading" | "success" | "error";

function handle(status: Status) {
  switch (status) {
    case "loading":
      return "로딩중";
    case "success":
      return "성공";
    case "error":
      return "에러";
    default:
      const check: never = status;
    // Status에 새 값 추가하고 case 빠뜨리면 여기서 에러 ✅
  }
}

// "pending" 추가하고 case 안 쓰면
// → "pending을 never에 할당할 수 없음" 에러
```

#### void vs never

```ts
void; // 리턴값 없음 (undefined 반환)
never; // 아예 끝까지 실행 안 됨 (에러 or 무한루프)

function throwError(msg: string): never {
  throw new Error(msg); // 절대 리턴 안 함
}
```

---

## 5. Conditional Types

#### 기본

```ts
T extends 뭔가 ? 참 : 거짓
```

#### 중첩 패턴

```ts
type TypeName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : "object";

type A = TypeName<string>; // → "string"
type B = TypeName<number>; // → "number"
```

#### 분산 조건부 타입

```ts
type IsString<T> = T extends string ? true : false;

type C = IsString<string | number>;
// → true | false
// 유니온이면 하나씩 다 검사해서 합침
```

#### NonNullable

```ts
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null | undefined>;
// → string
// null, undefined는 never로 바꿔서 제거
```

---

## 6. Template Literal Types

**한 줄 요약**: 문자열 타입 조합

```ts
type Direction = "left" | "right" | "top" | "bottom";
type Property = "margin" | "padding";

type CSSProperty = `${Property}-${Direction}`;
// → "margin-left" | "margin-right" | ... 8개 자동 생성
```

#### 실무 활용

```ts
// 이벤트 핸들러 자동 생성
type EventName = "click" | "focus" | "blur";
type Handler = `on${Capitalize<EventName>}`;
// → "onClick" | "onFocus" | "onBlur"

// React Query queryKey 오타 방지
type QueryKey = "user" | "product" | "order";
type QueryKeyList = `${QueryKey}List`;
// → "userList" | "productList" | "orderList"

const { data } = useQuery({
  queryKey: [QueryKeyList], // 오타나면 바로 에러 ✅
});
```

---

## 7. Mapped Types 커스텀

```ts
// 모든 값을 string으로
type Stringify<T> = {
  [K in keyof T]: string;
};

// 폼 에러 타입 자동 생성
type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface LoginForm {
  email: string;
  password: string;
}

type LoginFormErrors = FormErrors<LoginForm>;
// → { email?: string; password?: string }
// LoginForm 바뀌면 자동 반영 ✅

// 읽기 전용
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

---

## 8. 타입 설계 패턴

#### Discriminated Union (제일 중요)

```ts
// ❌ 이렇게 하면 망함
interface Response {
  data?: User;
  error?: string;
  loading?: boolean;
  // data 있을 때 error도 있을 수 있음
}

// ✅ 이렇게 해야 함
type Response =
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: string };

// React Query랑 활용
function UserCard(props: Response) {
  if (props.status === "loading") return <Spinner />;
  if (props.status === "error") return <Error msg={props.error} />;
  return <div>{props.data.name}</div>; // 여기서 data는 반드시 User ✅
}
```

#### 필수/선택 분리

```ts
type RequiredFilter = Required<Pick<Filter, "page" | "limit">>;
type OptionalFilter = Partial<Pick<Filter, "search" | "status">>;
type UserFilter = RequiredFilter & OptionalFilter;

// page, limit 필수 / search, status 선택
```

#### 타입 가드

```ts
type Admin = { role: "admin"; permissions: string[] };
type User = { role: "user"; name: string };
type Member = Admin | User;

function isAdmin(member: Member): member is Admin {
  return member.role === "admin";
}

function handle(member: Member) {
  if (isAdmin(member)) {
    console.log(member.permissions); // ✅ Admin으로 좁혀짐
  } else {
    console.log(member.name); // ✅ User로 좁혀짐
  }
}
```

---

## 9. React + TypeScript

#### 컴포넌트 타입

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  children: React.ReactNode;
}
// button 기본 속성 전부 자동으로 받음 ✅
```

#### Generic 컴포넌트

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

#### Hook 타입

```ts
function useUser(id: number) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  return [user, error, setUser] as const;
  // as const 없으면 타입 추론 망가짐 ❌
}
```

#### 이벤트 타입 치트시트

```ts
onChange  → React.ChangeEvent<HTMLInputElement>
onSubmit → React.FormEvent<HTMLFormElement>
onClick  → React.MouseEvent<HTMLButtonElement>
onKeyDown → React.KeyboardEvent<HTMLInputElement>
```

---

## 핵심 요약

| 개념                | 한 줄 요약                    |
| ------------------- | ----------------------------- |
| `infer`             | 타입 구조 안에서 꺼내는 것    |
| `never`             | 절대 오면 안 됨               |
| `keyof`             | 객체 타입의 키 뽑기           |
| `in`                | 키 하나씩 순회                |
| `Partial`           | 전부 선택으로                 |
| `Pick/Omit`         | 골라서 쓰기                   |
| Conditional Types   | 타입의 if-else                |
| Template Literal    | 문자열 타입 조합              |
| Discriminated Union | 불가능한 상태를 타입으로 막기 |

---
