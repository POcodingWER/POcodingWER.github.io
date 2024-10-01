## Selection Sort?

**선택 정렬**은 정렬 알고리즘 중 하나로, 리스트에서 가장 작은(또는 가장 큰) 요소를 선택하여 정렬되지 않은 부분의 가장 앞에 위치시키는 방식으로 작동합니다. 이 과정을 반복하면서 전체 리스트를 정렬합니다. 선택 정렬은 비교적 간단하고 이해하기 쉬운 알고리즘입니다.

#### **시간 복잡도**:

- 최악 및 평균 경우: **O(n^2)**
- 최선의 경우: **O(n^2)**

#### **사용 사례**:

- 선택 정렬은 구현이 간단하고 작은 데이터 세트에서 효율적으로 작동합니다.
- 메모리가 제한된 환경에서 사용될 수 있으며, 불안정한 정렬이 필요할 때 사용할 수 있습니다.

### **JavaScript 예제 코드**

```javascript
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i; // 현재 위치를 최소값의 인덱스로 설정

    // 남은 배열에서 최소값의 인덱스를 찾기
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j; // 새로운 최소값의 인덱스 업데이트
      }
    }

    // 현재 위치와 최소값의 위치 교환
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr; // 정렬된 배열 반환
}

// 예제 사용
const array = [64, 25, 12, 22, 11];
console.log(selectionSort(array)); // 출력: [11, 12, 22, 25, 64]
```

### **Rust 예제 코드**

```rust
fn selection_sort(arr: &mut Vec<i32>) {
    let n = arr.len();

    for i in 0..n - 1 {
        let mut min_index = i; // 현재 위치를 최소값의 인덱스로 설정

        // 남은 배열에서 최소값의 인덱스를 찾기
        for j in (i + 1)..n {
            if arr[j] < arr[min_index] {
                min_index = j; // 새로운 최소값의 인덱스 업데이트
            }
        }

        // 현재 위치와 최소값의 위치 교환
        if min_index != i {
            arr.swap(i, min_index);
        }
    }
}

// 예제 사용
fn main() {
    let mut array = vec![64, 25, 12, 22, 11];
    selection_sort(&mut array);
    println!("{:?}", array); // 출력: [11, 12, 22, 25, 64]
}
```

### **요약**

선택 정렬은 리스트에서 가장 작은 요소를 선택하여 정렬되지 않은 부분의 가장 앞에 위치시키는 방식으로 작동합니다. 구현이 간단하고 이해하기 쉬운 알고리즘이지만, 시간 복잡도가 O(n^2)로 비효율적이기 때문에 큰 데이터 세트에는 적합하지 않습니다. 주로 작은 데이터 세트나 메모리 제약이 있는 환경에서 사용됩니다.
