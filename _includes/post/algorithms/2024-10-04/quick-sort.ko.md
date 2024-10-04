## Quick Sort?

**퀵 정렬(Quicksort)**은 분할 정복(Divide and Conquer) 알고리즘 중 하나로, 매우 효율적인 정렬 알고리즘 중 하나입니다. 기본 아이디어는 배열에서 피벗(pivot)을 하나 선택한 후, 피벗보다 작은 값들은 왼쪽 부분 배열로, 큰 값들은 오른쪽 부분 배열로 나눈 후 각각을 재귀적으로 정렬하는 방식입니다.

#### **시간 복잡도**:

- 최악의 경우: **O(n²)** (하지만 일반적으로 피벗 선택을 잘 하면 O(n log n))
- 평균적인 경우: **O(n log n)**

#### **사용 사례**:

- 대규모 데이터를 정렬할 때 자주 사용되며, 특히 메모리를 적게 사용하는 **제자리(in-place) 정렬**이 필요한 경우 유용합니다.
- **일반적인 정렬 알고리즘**으로 널리 사용되며, 다른 정렬 알고리즘보다 성능이 뛰어날 때가 많습니다.

### **JavaScript 퀵 정렬 예제 코드**

```javascript
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1]; // 피벗을 배열의 마지막 요소로 설정
  const left = [];
  const right = [];

  // 피벗을 기준으로 작은 값과 큰 값을 분리
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  // 재귀적으로 좌우 배열을 정렬한 후 피벗을 중간에 삽입
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 사용 예시
const array = [12, 4, 5, 6, 7, 3, 1, 15];
console.log(quickSort(array)); // 출력: [1, 3, 4, 5, 6, 7, 12, 15]
```

### **Rust 퀵 정렬 예제 코드**

```rust
fn quick_sort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }

    let pivot_index = partition(arr);
    let (left, right) = arr.split_at_mut(pivot_index);
    quick_sort(left);
    quick_sort(&mut right[1..]); // 피벗 이후의 요소들 정렬
}

fn partition(arr: &mut [i32]) -> usize {
    let pivot = arr[arr.len() - 1]; // 피벗을 마지막 요소로 선택
    let mut i = 0;

    for j in 0..arr.len() - 1 {
        if arr[j] < pivot {
            arr.swap(i, j);
            i += 1;
        }
    }

    arr.swap(i, arr.len() - 1); // 피벗을 중간에 삽입
    i
}

fn main() {
    let mut array = [12, 4, 5, 6, 7, 3, 1, 15];
    quick_sort(&mut array);
    println!("{:?}", array); // 출력: [1, 3, 4, 5, 6, 7, 12, 15]
}
```

### 요약

**퀵 정렬(Quicksort)**은 분할 정복을 사용하여 데이터를 정렬하는 알고리즘입니다. 일반적으로 O(n log n)의 성능을 보이며, 대규모 데이터 정렬 시 효율적입니다. 제자리 정렬로 메모리 사용량이 적고, 실제 응용 프로그램에서 매우 빠르게 동작하는 경우가 많습니다.
