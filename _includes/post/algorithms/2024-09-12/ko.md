## Queue 와 Stack 비교

| 특성             | 큐(Queue)                          | 스택(Stack)                    |
| ---------------- | ---------------------------------- | ------------------------------ |
| 데이터 처리 방식 | 선입선출(FIFO)                     | 후입선출(LIFO)                 |
| 삽입 위치        | 뒤(Rear)                           | 위(Top)                        |
| 삭제 위치        | 앞(Front)                          | 위(Top)                        |
| 주요 연산        | `enqueue(삽입)`<br>`dequeue(삭제)` | `push(삽입)`<br>`pop(삭제)`    |
| 사용 사례        | 대기열 처리, 프린터 작업 순서      | 함수 호출 스택, 되돌리기(Undo) |

## Queue 와 Stack 사용 사례

1. **큐(Queue)**
   - **프로세스 관리**: 운영체제에서 CPU 스케줄링을 할 때, 작업이나 프로세스를 순차적으로 처리하기 위해 큐를 사용합니다.
   - **네트워크 패킷 처리**: 네트워크에서 패킷이 들어오는 순서대로 처리할 때 큐를 사용합니다.
   - **프린터 작업 관리**: 여러 개의 인쇄 작업을 순차적으로 처리하기 위해 큐가 사용됩니다.
2. **스택(Stack)**
   - **함수 호출 스택**: 프로그램에서 함수가 호출될 때 호출된 순서대로 반환하는 방식으로 사용됩니다.
   - **문서 편집기**: 텍스트 편집기에서 `되돌리기(Undo)` 기능은 스택을 이용하여 최근 작업을 역순으로 되돌립니다.
   - **수식 계산**: 컴퓨터에서 후위 표기법(Reverse Polish Notation)으로 수식을 계산할 때 스택이 사용됩니다.

## Queue?

큐(Queue)는 **선입선출(FIFO, First In First Out)** 방식의 자료 구조로, 먼저 들어간 데이터가 먼저 나오는 구조입니다. 큐는 주로 **줄을 서는 상황**이나 **작업 대기열**을 처리할 때 유용하게 사용됩니다.

큐의 기본적인 동작은 아래와 같습니다:

1. **enqueue(삽입)**: 큐의 뒤쪽에 데이터를 추가하는 작업.
2. **dequeue(제거)**: 큐의 앞쪽에서 데이터를 제거하는 작업.
3. **peek/front**: 큐의 앞쪽에 있는 데이터를 제거하지 않고 확인하는 작업.
4. **isEmpty**: 큐가 비어 있는지 확인하는 작업.

#### javascript

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  // 데이터 추가
  enqueue(element) {
    this.items.push(element);
  }

  // 데이터 제거
  dequeue() {
    if (this.isEmpty()) {
      return "큐가 비어있습니다.";
    }
    return this.items.shift(); // 첫 번째 요소 제거
  }

  // 큐의 앞쪽 요소 확인
  front() {
    if (this.isEmpty()) {
      return "큐가 비어있습니다.";
    }
    return this.items[0];
  }

  // 큐가 비었는지 확인
  isEmpty() {
    return this.items.length === 0;
  }

  // 큐의 크기 확인
  size() {
    return this.items.length;
  }
}

// 사용 예시
let queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
console.log(queue.front()); // 10
console.log(queue.dequeue()); // 10
console.log(queue.front()); // 20
```

#### Rust

```rust
struct Queue<T> {
    items: Vec<T>,  // 제네릭 타입을 이용한 벡터
}

impl<T> Queue<T> {
    // 큐 초기화
    fn new() -> Self {
        Queue { items: Vec::new() }
    }

    // 데이터 추가
    fn enqueue(&mut self, item: T) {
        self.items.push(item);
    }

    // 데이터 제거
    fn dequeue(&mut self) -> Option<T> {
        if self.is_empty() {
            None
        } else {
            Some(self.items.remove(0))  // 첫 번째 요소 제거
        }
    }

    // 큐의 앞쪽 요소 확인
    fn front(&self) -> Option<&T> {
        self.items.first()
    }

    // 큐가 비었는지 확인
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    // 큐의 크기 확인
    fn size(&self) -> usize {
        self.items.len()
    }
}

fn main() {
    let mut queue = Queue::new();
    queue.enqueue(10);
    queue.enqueue(20);
    println!("{:?}", queue.front());  // Some(10)
    println!("{:?}", queue.dequeue());  // Some(10)
    println!("{:?}", queue.front());  // Some(20)
}
```

자바스크립트와 Rust에서 각각 큐를 구현하는 방법을 위와 같이 작성할 수 있습니다. 두 언어의 문법 차이에도 불구하고, 큐의 동작 원리는 동일합니다.

## Stack?

스택(Stack)은 **후입선출(LIFO, Last In First Out)** 방식의 자료 구조입니다. 즉, 가장 마지막에 들어간 데이터가 가장 먼저 나오는 구조입니다. 스택은 **쌓인 책**이나 **함수 호출 스택** 등에서 많이 사용됩니다.

스택의 기본적인 동작은 아래와 같습니다:

1. **push(삽입)**: 스택의 맨 위에 데이터를 추가하는 작업.
2. **pop(제거)**: 스택의 맨 위에서 데이터를 제거하는 작업.
3. **peek/top**: 스택의 맨 위에 있는 데이터를 제거하지 않고 확인하는 작업.
4. **isEmpty**: 스택이 비어 있는지 확인하는 작업.

#### javascript

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  // 데이터 추가
  push(element) {
    this.items.push(element);
  }

  // 데이터 제거
  pop() {
    if (this.isEmpty()) {
      return "스택이 비어있습니다.";
    }
    return this.items.pop(); // 마지막 요소 제거
  }

  // 스택의 맨 위 요소 확인
  peek() {
    if (this.isEmpty()) {
      return "스택이 비어있습니다.";
    }
    return this.items[this.items.length - 1];
  }

  // 스택이 비었는지 확인
  isEmpty() {
    return this.items.length === 0;
  }

  // 스택의 크기 확인
  size() {
    return this.items.length;
  }
}

// 사용 예시
let stack = new Stack();
stack.push(10);
stack.push(20);
console.log(stack.peek()); // 20
console.log(stack.pop()); // 20
console.log(stack.peek()); // 10
```

#### Rust

```rust
struct Stack<T> {
    items: Vec<T>,  // 제네릭 타입을 이용한 벡터
}

impl<T> Stack<T> {
    // 스택 초기화
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    // 데이터 추가
    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    // 데이터 제거
    fn pop(&mut self) -> Option<T> {
        self.items.pop()  // 마지막 요소 제거
    }

    // 스택의 맨 위 요소 확인
    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    // 스택이 비었는지 확인
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    // 스택의 크기 확인
    fn size(&self) -> usize {
        self.items.len()
    }
}

fn main() {
    let mut stack = Stack::new();
    stack.push(10);
    stack.push(20);
    println!("{:?}", stack.peek());  // Some(20)
    println!("{:?}", stack.pop());  // Some(20)
    println!("{:?}", stack.peek());  // Some(10)
}
```

위 예제에서는 자바스크립트와 Rust에서 각각 스택을 구현하는 방법을 보여주었습니다. 두 언어 모두 **벡터** 또는 **배열**을 사용하여 스택의 LIFO 동작을 쉽게 구현할 수 있습니다.
