## Heap Sort?

**힙 정렬(Heap Sort)**은 이진 힙(binary heap) 자료 구조를 사용한 정렬 알고리즘입니다. 먼저 주어진 배열을 최대 힙(Max-Heap)으로 변환한 후, 가장 큰 값을 배열의 끝으로 보내고 나머지 힙을 다시 정렬하는 과정을 반복하여 정렬을 수행합니다. 힙 정렬은 비교 기반의 정렬 알고리즘이며, 항상 O(n log n)의 시간 복잡도를 가집니다.

#### **시간 복잡도**:

- 최악, 평균, 최선 경우: **O(n log n)**

#### **사용 사례**:

- 대규모 데이터 집합을 정렬할 때 주로 사용됩니다.
- 메모리 사용이 제한된 환경에서도 효과적으로 사용될 수 있습니다. (인플레이스 정렬)

### **JavaScript 힙 정렬 예제 코드**

```javascript
function heapify(arr, n, i) {
  let largest = i; // 루트를 가장 큰 값으로 설정
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // 왼쪽 자식이 루트보다 크다면
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  // 오른쪽 자식이 현재 가장 큰 값보다 크다면
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // 가장 큰 값이 루트가 아니라면 교체
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    // 재귀적으로 힙을 정렬
    heapify(arr, n, largest);
  }
}

function heapSort(arr) {
  const n = arr.length;

  // 최대 힙 생성
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 하나씩 요소를 힙에서 꺼내 배열의 끝으로 이동
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

// 사용 예시
const array = [12, 11, 13, 5, 6, 7];
console.log(heapSort(array)); // 출력: [5, 6, 7, 11, 12, 13]
```

### **Rust 힙 정렬 예제 코드**

```rust
fn heapify(arr: &mut [i32], n: usize, i: usize) {
    let mut largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    // 왼쪽 자식이 루트보다 크다면
    if left < n && arr[left] > arr[largest] {
        largest = left;
    }

    // 오른쪽 자식이 현재 가장 큰 값보다 크다면
    if right < n && arr[right] > arr[largest] {
        largest = right;
    }

    // 가장 큰 값이 루트가 아니라면 교체
    if largest != i {
        arr.swap(i, largest);
        heapify(arr, n, largest);
    }
}

fn heap_sort(arr: &mut [i32]) {
    let n = arr.len();

    // 최대 힙 생성
    for i in (0..n / 2).rev() {
        heapify(arr, n, i);
    }

    // 하나씩 요소를 힙에서 꺼내 배열의 끝으로 이동
    for i in (1..n).rev() {
        arr.swap(0, i);
        heapify(arr, i, 0);
    }
}

fn main() {
    let mut array = [12, 11, 13, 5, 6, 7];
    heap_sort(&mut array);
    println!("{:?}", array); // 출력: [5, 6, 7, 11, 12, 13]
}
```

### 요약

**힙 정렬**은 이진 힙 구조를 이용한 효율적인 정렬 알고리즘으로, 대규모 데이터 집합을 처리할 때 성능이 우수하며, O(n log n)의 시간 복잡도를 가집니다. 주로 메모리 효율이 중요한 환경에서 사용되며, 정렬 과정에서 추가적인 메모리 할당 없이 인플레이스(in-place) 정렬을 지원합니다.
