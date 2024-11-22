---
layout: post
title: "[React] react에서 캐싱처리를 위한 react queryd와 indexDB 비교분석"

subtitle: "장점과 단점을 비교하여 캐싱처리를 위한 react queryd와 indexDB 비교분석"

date: 2024-11-22 13:25:56
# lastmod: 2024-08-14 10:10:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/2024/1122/react-query.gif"
#
# sitemap:
#   changefreq: daily #스크랩 주기  daily | weekly | monthly
#   priority: 1.0  # 스크랩 우선순위
# hidden: true
categories:
  - React Guide
tags:
  - React
  - react query
  - indexDB
  - react query 예제
  - react query 장점
  - indexDB 장점
  - react query 주의사항
  - indexDB 주의사항
  - react query 언제 사용하면 좋을까?
  - indexDB 언제 사용하면 좋을까?
---

{% include post/react/contents.md %}

## React Query와 IndexedDB 비교

다음은 **React Query**와 **IndexedDB**의 비교 내용을 저장 공간 관점까지 통합한 표입니다:

| 구분          | React Query                                                                                                                             | IndexedDB                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **설명**      | 서버 상태 관리 라이브러리로, 데이터 페칭, 캐싱, 동기화, 업데이트를 효율적으로 처리                                                      | 브라우저 내장 데이터베이스로, 대량의 구조화된 데이터를 클라이언트에서 저장 가능                                                                   |
| **장점**      | - 데이터 페칭과 상태 관리의 간편함<br>- 자동 캐싱 및 동기화<br>- 서버 데이터와 클라이언트 UI의 일관성 유지<br>- 빠른 데이터 액세스 속도 | - 비동기 API 제공으로 대용량 데이터 저장 가능<br>- 구조화된 데이터의 영구 저장<br>- 오프라인 모드 지원<br>- 브라우저를 닫아도 데이터 유지         |
| **단점**      | - 브라우저를 닫거나 새로고침 시 데이터 휘발<br>- 상태 관리 외 기능 부족<br>- 추가적인 네트워크 요청 발생 가능<br>- 메모리 용량 제한     | - 비교적 복잡한 API 사용법<br>- 트랜잭션 기반 데이터 작업의 복잡성<br>- 서버 동기화 기능 없음(직접 구현 필요)<br>- 도메인별 저장 용량 제한        |
| **저장 방식** | - 브라우저 메모리(RAM)에 임시 저장<br>- 데이터 초기화: 새로고침 시 리셋, 탭 종료 시 삭제<br>- 빠른 액세스 속도<br>- 메모리 용량 제한    | - 브라우저의 영구 저장소에 저장<br>- 데이터가 브라우저를 닫아도 유지<br>- 대량 데이터 저장 가능<br>- 도메인별 저장 용량 제한(일반적으로 50MB~2GB) |
| **사용 사례** | - 서버 데이터를 빈번히 가져오는 애플리케이션<br>- UI 상태 관리 중심의 클라이언트 애플리케이션                                           | - 대량의 클라이언트 데이터를 영구적으로 저장해야 하는 애플리케이션<br>- 오프라인 지원이 필요한 앱                                                 |
| **주요 특징** | - 쿼리 키 기반으로 데이터 관리<br>- React와 밀접하게 통합                                                                               | - 키-값 기반으로 구조화된 데이터 저장<br>- 브라우저 독립적인 API 제공                                                                             |

### 요약

- **React Query**는 휘발성이 높고 빠른 속도를 요구하는 경우 적합합니다.
- **IndexedDB**는 영구적인 목적으로 데이터를 저장하는 경우 적합합니다.

## 예제

폴더 구조 및 예제를 위한 준비사항

```text
src/
├── examples/
│   ├── ReactQueryExample.tsx
│   ├── CombinedExample.tsx
│   └── IndexedDBExample.tsx
├── App.tsx
├── App.css
├── main.tsx
├── index.css
└── vite-env.d.ts
```

- Tanstack Query v4부터는 @tanstack/react-query로 패키지명이 변경

```bash
npm install @tanstack/react-query
npm install axios
```

- static 모드를 꺼줘야 캐싱이 잘되고있는지 확인하기 쉬워집니다.

```tsx
// main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### 1. React Query 예제

버튼이 열고 닫히면서 api 관련 캐싱이 잘되고있는지를 체크하고 콘솔창에 출력되는 로그를 통해 확인할 수 있습니다.

```tsx
// App.tsx
import { useState } from "react";
import ReactQueryExample from "./examples/ReactQueryExample";

function App() {
  const [show, setShow] = useState(true);

  return (
    <div>
      <button onClick={() => setShow(!show)}>토글</button>
      {show && <ReactQueryExample />}
    </div>
  );
}

export default App;
```

```tsx
// ReactQueryExample.tsx
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();

function DataComponent() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      console.log("API 호출됨!");
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      return response.data;
    },
    staleTime: 5 * 1000, //데이터가 "신선"하다고 간주되는 시간 (5초)
    gcTime: 30 * 60 * 1000, // 캐시된 데이터가 메모리에 유지되는 시간 (30분) React Query v5부터 cacheTime -> gcTime변경
  });

  console.log("isFetching:", isFetching);

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {data?.map((item: any) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}

export default function ReactQueryExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataComponent />
    </QueryClientProvider>
  );
}
```

> 주석친 곳만 자세히 보면됩니다. staleTime신선하다고 간주되는 시간이고  
> gcTime(garbage collection)메모리에 유지되는시간입니다.

![](/img/post/2024/1122/react-query.gif)

메모리에는 30분동안 유지되고 5초동안 신선이 유지되어 위 예제 이미지처럼 5초에 한번씩 api 호출이 되는것을 확인할 수 있습니다.

### 2. IndexedDB 예제

```tsx
// App.tsx
import { useState } from "react";
import IndexedDBExample from "./examples/IndexedDBExample";

function App() {
  const [show, setShow] = useState(true);

  return (
    <div>
      <button onClick={() => setShow(!show)}>토글</button>
      {show && <IndexedDBExample />}
    </div>
  );
}

export default App;
```

```tsx
// IndexedDBExample.tsx
import { useState, useEffect } from "react";

const DB_NAME = "MyDatabase";
const STORE_NAME = "todos";
const REFRESH_TIME = 5 * 1000; //5초마다 리프레시

function IndexedDBExample() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      console.log("1. IndexedDB 초기화 시작");
      const db = await openDB();
      console.log("2. DB 연결 완료");
      const { data: cachedData, timestamp } = await getData(db);
      console.log(
        "3. 캐시된 데이터 확인:",
        cachedData.length ? "있음" : "없음"
      );

      const shouldRefresh = !timestamp || Date.now() - timestamp > REFRESH_TIME;
      console.log(
        "3-1. 데이터 리프레시 필요:",
        shouldRefresh ? "예" : "아니오"
      );

      if (cachedData.length === 0 || shouldRefresh) {
        try {
          console.log("4-1. 새로운 데이터 필요 - API 호출 시작");
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/todos"
          );
          const newData = await response.json();
          console.log("4-2. API 데이터 수신 완료");
          await saveData(db, newData);
          console.log("4-3. IndexedDB에 데이터 저장 완료");
          setData(newData);
        } catch (error) {
          console.error("4-4. 에러 발생:", error);
          if (cachedData.length > 0) {
            console.log("4-5. 에러 발생으로 캐시된 데이터 사용");
            setData(cachedData);
          }
        }
      } else {
        console.log("4-1. 신선한 캐시 데이터 사용");
        setData(cachedData);
      }
      setIsLoading(false);
      console.log("5. 로딩 완료");
    };

    initDB();
  }, []);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      console.log("2-1. DB 열기 시도");
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => {
        console.log("2-2. DB 열기 실패");
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log("2-2. DB 열기 성공");
        resolve(request.result);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        console.log("2-3. DB 업그레이드 필요");
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      };
    });
  };

  const getData = (
    db: IDBDatabase
  ): Promise<{ data: any[]; timestamp: number }> => {
    return new Promise((resolve, reject) => {
      console.log("3-1. 데이터 조회 시작");
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("todos-data");

      request.onerror = () => {
        console.log("3-2. 데이터 조회 실패");
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log("3-2. 데이터 조회 성공");
        resolve(request.result || { data: [], timestamp: 0 });
      };
    });
  };

  const saveData = (db: IDBDatabase, data: any[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log("4-3-1. 데이터 저장 시작");
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      store.put({
        id: "todos-data",
        data,
        timestamp: Date.now(),
      });

      transaction.oncomplete = () => {
        console.log("4-3-2. 데이터 저장 완료");
        resolve();
      };
      transaction.onerror = () => {
        console.log("4-3-3. 데이터 저장 실패");
        reject(transaction.error);
      };
    });
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}

export default IndexedDBExample;
```

코드가 많이 길어서 console.log 로그를 추가하였습니다.

![](/img/post/2024/1122/index1.gif)

> `REFRESH_TIME`넣어 5초마다 리프레시 되는것을 확인하였고 캐시된 데이터가 있으면 캐시된 데이터를 사용하는것을 확인

![](/img/post/2024/1122/index2.gif)

> React Query 예제와 다른점은 영구적으로 데이터가 남아있기때문에 indexDB를 삭제하지않으면 새로고침을하더라도 api호출이 되는것을 방지할수있습니다.

### 3. 같이사용하기

```tsx
// App.tsx
import { useState } from "react";
import IndexedDBExample from "./examples/IndexedDBExample";

function App() {
  const [show, setShow] = useState(true);

  return (
    <div>
      <button onClick={() => setShow(!show)}>토글</button>
      {show && <IndexedDBExample />}
    </div>
  );
}

export default App;
```

```tsx
// CombinedExample.tsx
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const DB_NAME = "MyDatabase";
const STORE_NAME = "todos";
const queryClient = new QueryClient();

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function TodoComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      // IndexedDB에서 확인
      const cachedData = await getFromIndexedDB();
      if (cachedData) {
        return cachedData;
      }

      // API 호출
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const newData = await response.json();

      // IndexedDB에 저장
      await saveToIndexedDB(newData);
      return newData;
    },
    staleTime: 5 * 1000, // 5초
    gcTime: 30 * 1000, // 30초
  });

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {data?.map((item: Todo) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}

const getFromIndexedDB = (): Promise<Todo[] | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const dataRequest = store.get("todos-data");

      dataRequest.onerror = () => reject(dataRequest.error);
      dataRequest.onsuccess = () => {
        const result = dataRequest.result;
        resolve(result?.data || null);
      };
    };
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

const saveToIndexedDB = (data: Todo[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      store.put({
        id: "todos-data",
        data,
        timestamp: Date.now(),
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
  });
};

export default function CombinedExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoComponent />
    </QueryClientProvider>
  );
}
```

> 두예제릴 합쳐서 사용하는 방법 새로고침을할때마다 react query는 실행되지만 페이지이동이나 시간안에 다시돌아오면 호출자체를 막아버림 indexDB에 데이터가있으면 가져와서사용 같이사용해도 좋을것처럼 보여짐

## 마무리

프로그래밍 언어여서 그런지 내가생각하는 언어는 아다르고 어다르지만 돌아돌아 똑같은 형식으로 쓸수있다. 이처럼 방식에 차이가 있을뿐이지 활용을 어떻게 할지 어떻게 사용하면 좋을지를 고민하여 보다 좋은 코드로 활용하면 좋을것같다
