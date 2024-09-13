### 데이터 구조에서 힙이란?

**힙(Heap)**은 **완전 이진 트리**로, 특정한 **힙 속성**을 만족하는 자료구조입니다. 힙 속성은 다음 두 가지로 나뉩니다:

1. **최대 힙(Max-Heap)**: 각 노드의 값이 자식 노드의 값보다 크거나 같아야 합니다. 즉, 가장 큰 값이 루트에 위치합니다.
2. **최소 힙(Min-Heap)**: 각 노드의 값이 자식 노드의 값보다 작거나 같아야 합니다. 즉, 가장 작은 값이 루트에 위치합니다.

#### 힙의 특징:

- 힙은 **우선순위 큐** 구현에 자주 사용됩니다. 이를 통해 가장 큰 값이나 가장 작은 값을 효율적으로 찾아낼 수 있습니다.
- 힙은 **완전 이진 트리**로, 마지막 레벨을 제외한 모든 레벨이 꽉 차 있으며, 마지막 레벨은 왼쪽부터 채워집니다.

### 힙의 주요 사용 사례:

1. **우선순위 큐**: 각 요소가 우선순위를 가지는 데이터를 효율적으로 관리할 때 사용됩니다. (예: 작업 스케줄링)
2. **힙 정렬**: 힙을 이용한 비교 기반의 정렬 알고리즘입니다.
3. **그래프 알고리즘**: 다익스트라 알고리즘 같은 경우 우선순위 큐(힙)를 사용합니다.
4. **메모리 관리**: 메모리 할당 및 가비지 컬렉션에 사용됩니다.
5. **K번째 큰/작은 값 찾기**: 힙을 사용하여 효율적으로 K번째 큰 값이나 작은 값을 찾을 수 있습니다.

### 자바스크립트 예제 (최소 힙):

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i1, i2) {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  insert(value) {
    this.heap.push(value);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.heap[index] < this.heap[this.getParentIndex(index)]
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  removeMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return min;
  }

  heapifyDown(index) {
    let smallest = index;
    const leftChild = this.getLeftChildIndex(index);
    const rightChild = this.getRightChildIndex(index);

    if (
      leftChild < this.heap.length &&
      this.heap[leftChild] < this.heap[smallest]
    ) {
      smallest = leftChild;
    }
    if (
      rightChild < this.heap.length &&
      this.heap[rightChild] < this.heap[smallest]
    ) {
      smallest = rightChild;
    }
    if (smallest !== index) {
      this.swap(smallest, index);
      this.heapifyDown(smallest);
    }
  }
}

// 사용 예시:
const minHeap = new MinHeap();
minHeap.insert(10);
minHeap.insert(20);
minHeap.insert(5);
console.log(minHeap.removeMin()); // 5
console.log(minHeap.removeMin()); // 10
```

### Rust 예제 (최소 힙):

```rust
use std::cmp::Ordering;

#[derive(Debug)]
struct MinHeap<T> {
    heap: Vec<T>,
}

impl<T: Ord> MinHeap<T> {
    fn new() -> Self {
        MinHeap { heap: Vec::new() }
    }

    fn insert(&mut self, value: T) {
        self.heap.push(value);
        self.heapify_up();
    }

    fn heapify_up(&mut self) {
        let mut index = self.heap.len() - 1;
        while index > 0 {
            let parent_index = (index - 1) / 2;
            if self.heap[parent_index].cmp(&self.heap[index]) == Ordering::Greater {
                self.heap.swap(parent_index, index);
                index = parent_index;
            } else {
                break;
            }
        }
    }

    fn remove_min(&mut self) -> Option<T> {
        if self.heap.is_empty() {
            return None;
        }
        if self.heap.len() == 1 {
            return self.heap.pop();
        }
        let min = self.heap.swap_remove(0);
        self.heapify_down(0);
        Some(min)
    }

    fn heapify_down(&mut self, mut index: usize) {
        let last_index = self.heap.len() - 1;
        loop {
            let left_child = 2 * index + 1;
            let right_child = 2 * index + 2;

            let mut smallest = index;

            if left_child <= last_index && self.heap[left_child].cmp(&self.heap[smallest]) == Ordering::Less {
                smallest = left_child;
            }

            if right_child <= last_index && self.heap[right_child].cmp(&self.heap[smallest]) == Ordering::Less {
                smallest = right_child;
            }

            if smallest == index {
                break;
            }

            self.heap.swap(smallest, index);
            index = smallest;
        }
    }
}

// 사용 예시:
fn main() {
    let mut min_heap = MinHeap::new();
    min_heap.insert(10);
    min_heap.insert(20);
    min_heap.insert(5);

    println!("{:?}", min_heap.remove_min());  // Some(5)
    println!("{:?}", min_heap.remove_min());  // Some(10)
}
```

이 예제들은 최소 힙을 구현하고 있으며, 삽입과 최소값 삭제 기능을 제공합니다. 힙은 우선순위 큐를 효율적으로 관리하고, 작업 스케줄링 및 정렬 알고리즘에 자주 사용됩니다.
