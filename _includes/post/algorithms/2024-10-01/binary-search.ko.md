## Binary Search?

**이진 탐색(Binary Search)**은 **정렬된 배열**에서 값을 효율적으로 찾기 위한 알고리즘입니다. 이진 탐색은 배열을 절반으로 나누어 타겟 값이 어느 절반에 있는지 결정하고, 그 절반에서 다시 절반으로 나누는 과정을 반복합니다. 이 방식으로 탐색 범위를 빠르게 좁힐 수 있어 **O(log n)**의 시간 복잡도를 가집니다.

#### **사용 사례**:

- **정렬된 데이터**: 이진 탐색은 반드시 데이터가 정렬되어 있어야 합니다.
- **대규모 데이터**: 큰 데이터 세트에서 빠르게 검색해야 할 때 매우 유용합니다.
- **효율적인 탐색 필요**: 선형 탐색(Linear Search)의 O(n) 시간 복잡도에 비해 훨씬 효율적이므로, 성능을 최적화할 때 자주 사용됩니다.

---

### **JavaScript 예제 코드**

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // 타겟 값을 찾은 경우 인덱스 반환
    } else if (arr[mid] < target) {
      left = mid + 1; // 오른쪽 절반에서 탐색
    } else {
      right = mid - 1; // 왼쪽 절반에서 탐색
    }
  }

  return -1; // 타겟 값을 찾지 못한 경우
}

// 사용 예시
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 9;
console.log(binarySearch(arr, target)); // 4 (타겟 9의 인덱스)
```

#### **설명**:

- `binarySearch` 함수는 정렬된 배열 `arr`에서 값 `target`을 찾습니다.
- 배열을 절반으로 나누어 탐색하며, 중간값과 타겟 값을 비교한 후 오른쪽 또는 왼쪽 절반에서 다시 탐색합니다.

---

### **Rust 예제 코드**

```rust
fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len() as i32 - 1;

    while left <= right {
        let mid = left + (right - left) / 2;

        if arr[mid as usize] == target {
            return Some(mid as usize); // 타겟 값을 찾은 경우 인덱스 반환
        } else if arr[mid as usize] < target {
            left = mid + 1; // 오른쪽 절반에서 탐색
        } else {
            right = mid - 1; // 왼쪽 절반에서 탐색
        }
    }

    None // 타겟 값을 찾지 못한 경우
}

fn main() {
    let arr = [1, 3, 5, 7, 9, 11, 13, 15];
    let target = 9;

    match binary_search(&arr, target) {
        Some(index) => println!("Found at index: {}", index),
        None => println!("Not found"),
    }
}
```

#### **설명**:

- `binary_search` 함수는 Rust에서 정렬된 배열 `arr` 내의 값 `target`을 찾습니다.
- 배열을 절반으로 나누고, 타겟 값이 중간값보다 큰지 작은지에 따라 탐색 범위를 좁혀가며 값을 찾습니다.

---

### **요약**:

이진 탐색은 **정렬된 배열**에서 값의 위치를 찾는 매우 효율적인 알고리즘으로, **O(log n)**의 시간 복잡도를 가집니다. 정렬된 데이터를 빠르게 검색할 수 있어 대규모 데이터 세트에서 유용하며, 효율적인 탐색이 필요한 경우에 많이 사용됩니다.
