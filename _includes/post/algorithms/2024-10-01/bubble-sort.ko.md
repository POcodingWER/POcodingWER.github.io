## Bubble Sort?

**버블 정렬**은 가장 간단한 정렬 알고리즘 중 하나로, 인접한 요소들을 비교하여 정렬하는 방식입니다. 이 알고리즘은 리스트를 반복적으로 순회하면서 인접한 두 요소를 비교하여 순서가 맞지 않으면 서로 교환하는 방식으로 동작합니다. 가장 큰 요소가 리스트의 끝으로 "버블"처럼 떠오르는 모습 때문에 이 이름이 붙었습니다.

#### **시간 복잡도**:

- 최악 및 평균 경우: **O(n^2)**
- 최선의 경우(이미 정렬된 경우): **O(n)**

#### **사용 사례**:

- 버블 정렬은 구현이 간단하므로 교육용 및 알고리즘 학습에서 자주 사용됩니다.
- 작은 데이터 세트에서 사용할 수 있지만, 효율성이 떨어지기 때문에 큰 데이터 세트에는 적합하지 않습니다.

### **JavaScript 예제 코드**

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;

  do {
    swapped = false; // 초기화
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // 인접한 두 요소 비교 및 교환
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true; // 교환이 발생했음을 기록
      }
    }
  } while (swapped); // 교환이 발생한 경우 반복

  return arr; // 정렬된 배열 반환
}

// 예제 사용
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(array)); // 출력: [11, 12, 22, 25, 34, 64, 90]
```

### **Rust 예제 코드**

```rust
fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    let mut swapped;

    loop {
        swapped = false; // 초기화
        for i in 0..n - 1 {
            if arr[i] > arr[i + 1] {
                // 인접한 두 요소 비교 및 교환
                arr.swap(i, i + 1);
                swapped = true; // 교환이 발생했음을 기록
            }
        }
        if !swapped {
            break; // 더 이상 교환이 없으면 종료
        }
    }
}

// 예제 사용
fn main() {
    let mut array = vec![64, 34, 25, 12, 22, 11, 90];
    bubble_sort(&mut array);
    println!("{:?}", array); // 출력: [11, 12, 22, 25, 34, 64, 90]
}
```

### **요약**

버블 정렬은 간단한 정렬 알고리즘으로, 인접한 요소를 비교하여 교환하는 방식으로 동작합니다. 작은 데이터 세트에서 사용하기 적합하지만, 더 효율적인 정렬 알고리즘이 많이 있으므로 큰 데이터 세트에는 적합하지 않습니다.
