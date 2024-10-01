## Interpolation Search?

**보간 탐색(Interpolation Search)**은 정렬된 배열에서 특정 값을 찾기 위한 탐색 알고리즘으로, 이진 탐색과 비슷하지만, 값의 분포를 활용하여 더 빠르게 탐색할 수 있습니다. 보간 탐색은 주어진 값이 배열의 어떤 위치에 있을지를 예측하여 그 위치에서 탐색을 시작합니다. 이 방식은 값이 균등하게 분포되어 있을 때 가장 효과적입니다.

#### **시간 복잡도**:

- 평균 시간 복잡도는 **O(log log n)**이지만, 최악의 경우 **O(n)**이 될 수 있습니다. 이는 배열의 값이 불균형하게 분포된 경우 발생합니다.

#### **사용 사례**:

- **균등하게 분포된 데이터**: 데이터가 균등하게 분포되어 있을 때 이 알고리즘이 가장 효율적입니다.
- **정렬된 배열**: 보간 탐색은 정렬된 배열에서만 사용할 수 있습니다.
- **데이터의 위치를 미리 예측할 수 있을 때**: 주어진 값이 배열의 특정 위치 근처에 있을 것으로 예상될 때 유용합니다.

---

### **JavaScript 예제 코드**

```javascript
function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    // 보간 계산
    const pos =
      low +
      Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));

    if (arr[pos] === target) {
      return pos; // 타겟 값을 찾은 경우 인덱스 반환
    }

    if (arr[pos] < target) {
      low = pos + 1; // 오른쪽 절반에서 탐색
    } else {
      high = pos - 1; // 왼쪽 절반에서 탐색
    }
  }

  return -1; // 타겟 값을 찾지 못한 경우
}

// 사용 예시
const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const target = 70;
console.log(interpolationSearch(arr, target)); // 6 (타겟 70의 인덱스)
```

#### **설명**:

- `interpolationSearch` 함수는 정렬된 배열 `arr`에서 값 `target`을 찾습니다.
- 배열의 범위 내에서 타겟 값의 예상 위치를 계산하여 그 위치에서 탐색을 시작합니다.

---

### **Rust 예제 코드**

```rust
fn interpolation_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut low = 0;
    let mut high = arr.len() as i32 - 1;

    while low <= high && target >= arr[low as usize] && target <= arr[high as usize] {
        // 보간 계산
        let pos = low + ((high - low) / (arr[high as usize] - arr[low as usize])) * (target - arr[low as usize]);

        if arr[pos as usize] == target {
            return Some(pos as usize); // 타겟 값을 찾은 경우 인덱스 반환
        }

        if arr[pos as usize] < target {
            low = pos + 1; // 오른쪽 절반에서 탐색
        } else {
            high = pos - 1; // 왼쪽 절반에서 탐색
        }
    }

    None // 타겟 값을 찾지 못한 경우
}

fn main() {
    let arr = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    let target = 70;

    match interpolation_search(&arr, target) {
        Some(index) => println!("Found at index: {}", index),
        None => println!("Not found"),
    }
}
```

#### **설명**:

- `interpolation_search` 함수는 Rust에서 정렬된 배열 `arr` 내의 값 `target`을 찾습니다.
- 주어진 값의 예상 위치를 계산하여 그 위치에서 탐색을 시작합니다.

---

### **요약**:

보간 탐색은 **정렬된 배열**에서 특정 값을 찾기 위한 탐색 알고리즘으로, 값의 분포를 활용하여 탐색 속도를 높입니다. 이 알고리즘은 **균등하게 분포된 데이터**에 대해 매우 효율적이며, 평균적으로 **O(log log n)**의 시간 복잡도를 가집니다.
