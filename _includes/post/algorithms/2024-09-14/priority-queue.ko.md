## Priority Queue?

**우선순위 큐(Priority Queue)**는 각 요소가 우선순위와 연관된 특별한 형태의 큐입니다. 일반 큐는 먼저 들어온 요소가 먼저 나가지만, 우선순위 큐에서는 우선순위가 높은 요소가 먼저 dequeued(제거)됩니다. 동일한 우선순위를 가진 두 요소가 있을 경우, 삽입 순서(FIFO)에 따라 제거되거나 구현 방식에 따라 다른 규칙이 적용될 수 있습니다.

### 우선순위 큐의 사용 사례:

1. **다익스트라 알고리즘(Dijkstra's Algorithm)**: 그래프에서 최단 경로를 찾는 데 사용됩니다.
2. **A* 탐색 알고리즘(A* Search Algorithm)**: 가장 유망한 순서대로 노드를 탐색하기 위해 우선순위 큐를 사용합니다.
3. **작업 스케줄링(Task Scheduling)**: 운영체제에서 작업을 우선순위에 따라 스케줄링하는 데 사용됩니다.
4. **이벤트 시뮬레이션(Event Simulation)**: 우선순위가 높은 이벤트(예: 긴급 상황)를 먼저 처리합니다.

### JavaScript 예제 (Min-Heap 사용):

JavaScript에는 내장된 우선순위 큐가 없지만, 이진 힙을 사용하여 구현할 수 있습니다.

```javascript
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  // 값을 교환하는 헬퍼 메서드
  swap(index1, index2) {
    [this.values[index1], this.values[index2]] = [
      this.values[index2],
      this.values[index1],
    ];
  }

  // 힙 속성을 유지하기 위해 값을 위로 올리는 헬퍼 메서드
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.swap(idx, parentIdx);
      idx = parentIdx;
    }
  }

  // 힙 속성을 유지하기 위해 값을 아래로 내리는 헬퍼 메서드
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swapIdx = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swapIdx === null && rightChild.priority < element.priority) ||
          (swapIdx !== null && rightChild.priority < leftChild.priority)
        ) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;
      this.swap(idx, swapIdx);
      idx = swapIdx;
    }
  }

  enqueue(value, priority) {
    this.values.push({ value, priority });
    this.bubbleUp();
  }

  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
}

// 사용 예시
const pq = new PriorityQueue();
pq.enqueue("설거지하기", 2);
pq.enqueue("숙제하기", 1);
pq.enqueue("TV 보기", 3);

console.log(pq.dequeue()); // { value: '숙제하기', priority: 1 }
console.log(pq.dequeue()); // { value: '설거지하기', priority: 2 }
```

### Rust 예제 (`BinaryHeap` 사용):

Rust는 표준 라이브러리에 `BinaryHeap`이라는 내장 우선순위 큐를 제공하지만, 기본적으로 **최대 힙(max-heap)**으로 작동하여 가장 큰 요소가 먼저 제거됩니다. 최소 힙(min-heap)을 만들기 위해서는 역순을 사용할 수 있습니다.

```rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;

#[derive(Debug, Eq, PartialEq)]
struct Task {
    priority: i32,
    description: String,
}

// 우선순위를 기준으로 정렬하기 위해 Ord 트레이트 구현
impl Ord for Task {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        other.priority.cmp(&self.priority)
    }
}

impl PartialOrd for Task {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

fn main() {
    let mut pq = BinaryHeap::new();

    pq.push(Task {
        priority: 2,
        description: String::from("설거지하기"),
    });
    pq.push(Task {
        priority: 1,
        description: String::from("숙제하기"),
    });
    pq.push(Task {
        priority: 3,
        description: String::from("TV 보기"),
    });

    while let Some(task) = pq.pop() {
        println!("{:?}", task);
    }
}
```

**설명**:

- Rust의 `BinaryHeap`은 기본적으로 최대 힙으로 작동하므로, 우선순위가 높은 작업이 먼저 제거됩니다.
- `Task` 구조체를 정의하고 `Ord`, `PartialOrd`, `Eq`, `PartialEq` 트레이트를 구현하여 작업이 우선순위에 따라 정렬되도록 합니다.

### 요약:

- 우선순위 큐는 알고리즘, 스케줄링, 시뮬레이션 등 우선순위가 중요한 상황에서 사용됩니다.
- JavaScript에서는 이진 힙을 사용하여 우선순위 큐를 구현할 수 있으며, Rust는 효율적인 우선순위 큐 관리를 위해 `BinaryHeap`을 제공합니다.
