## Jump Search?

**점프 탐색(Jump Search)**는 선형 탐색(Linear Search)보다 효율적이지만 이진 탐색(Binary Search)만큼 빠르지 않은 중간 정도의 탐색 알고리즘입니다. 점프 탐색은 **정렬된 배열**에서만 작동하며, 일정한 크기(일반적으로 배열의 크기의 제곱근)를 점프하여 탐색을 수행한 후, 원하는 값이 있을 가능성이 있는 범위에서 선형 탐색을 실행합니다.

#### **점프 탐색의 시간 복잡도**:

- **O(√n)**로, 배열의 크기가 n일 때, 최적의 점프 크기는 √n입니다. 이는 선형 탐색보다 빠르며, 특히 데이터가 큰 경우 유리합니다.

#### **사용 사례**:

- **정렬된 배열**에서 값을 찾을 때 적합합니다.
- **중간 규모의 데이터**에서 성능을 최적화하고 싶을 때 사용됩니다.
- **데이터의 크기가 크지만 이진 탐색을 적용하기 어려운 경우**: 점프 탐색은 더 간단한 계산을 사용하므로 이진 탐색 대신 사용할 수 있습니다.

---

### **JavaScript 예제 코드**

```javascript
function jumpSearch(arr, target) {
  let length = arr.length;
  let step = Math.floor(Math.sqrt(length)); // 점프 크기: 배열 길이의 제곱근
  let prev = 0;

  // 타겟이 포함될 범위까지 점프
  while (arr[Math.min(step, length) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(length));
    if (prev >= length) return -1; // 범위를 벗어나면 -1 반환
  }

  // 타겟 값이 있을 가능성이 있는 범위에서 선형 탐색
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, length)) return -1; // 값이 없을 경우
  }

  // 타겟 값을 찾은 경우
  if (arr[prev] === target) return prev;

  return -1; // 값이 없을 경우
}

// 사용 예시
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 9;
console.log(jumpSearch(arr, target)); // 4 (타겟 9의 인덱스)
```

#### **설명**:

- `jumpSearch` 함수는 정렬된 배열 `arr`에서 값 `target`을 찾습니다.
- 배열의 길이의 제곱근만큼 점프하며, 값을 찾을 가능성이 있는 범위가 나오면 선형 탐색을 통해 값을 찾습니다.

---

### **Rust 예제 코드**

```rust
use std::cmp;

fn jump_search(arr: &[i32], target: i32) -> Option<usize> {
    let length = arr.len();
    let step = (length as f64).sqrt() as usize; // 점프 크기
    let mut prev = 0;

    // 타겟이 있을 가능성이 있는 범위까지 점프
    let mut current = step;
    while current < length && arr[current - 1] < target {
        prev = current;
        current += step;
        if current > length {
            current = length;
        }
    }

    // 타겟이 있을 범위에서 선형 탐색
    for i in prev..cmp::min(current, length) {
        if arr[i] == target {
            return Some(i); // 값이 있는 경우 인덱스 반환
        }
    }

    None // 값이 없을 경우
}

fn main() {
    let arr = [1, 3, 5, 7, 9, 11, 13, 15];
    let target = 9;

    match jump_search(&arr, target) {
        Some(index) => println!("Found at index: {}", index),
        None => println!("Not found"),
    }
}
```

#### **설명**:

- `jump_search` 함수는 Rust에서 정렬된 배열 `arr` 내의 값 `target`을 찾습니다.
- 먼저 배열의 크기의 제곱근만큼 점프하면서 범위를 좁혀 나가고, 이후 타겟이 있을 가능성이 있는 범위에서 선형 탐색을 실행합니다.
- 배열에서 타겟 값을 찾으면 인덱스를 반환하고, 값이 없으면 `None`을 반환합니다.

---

### **요약**:

점프 탐색은 정렬된 배열에서만 사용할 수 있는 탐색 알고리즘으로, **O(√n)**의 시간 복잡도를 가집니다. 이는 데이터가 큰 경우에 유리하며, 특히 이진 탐색을 사용할 수 없는 상황에서 선형 탐색보다 효율적입니다.
