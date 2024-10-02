## Insertion Sort?

**삽입 정렬(Insertion Sort)**은 정렬 알고리즘 중 하나로, 배열의 각 요소를 차례로 비교하며 자신이 위치할 올바른 자리에 삽입하는 방식으로 작동합니다. 이미 정렬된 배열 부분을 유지하면서 새로운 요소를 올바른 위치에 삽입하는 방식입니다. 삽입 정렬은 직관적이고 간단하여 작은 배열을 정렬할 때 매우 효과적입니다.

#### **시간 복잡도**:

- 최악 및 평균 경우: **O(n^2)**
- 최선의 경우 (이미 정렬된 배열): **O(n)**

#### **사용 사례**:

- 데이터가 거의 정렬되어 있을 때 삽입 정렬이 효율적입니다.
- 작은 데이터 세트에서 빠르게 작동하며, 데이터가 점진적으로 추가되는 상황에서 사용하기 좋습니다.

### **JavaScript 예제 코드**

```javascript
function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i]; // 현재 삽입할 요소
    let j = i - 1;

    // 현재 요소보다 큰 요소를 오른쪽으로 이동
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }

    arr[j + 1] = key; // 요소 삽입
  }
  return arr; // 정렬된 배열 반환
}

// 예제 사용
const array = [12, 11, 13, 5, 6];
console.log(insertionSort(array)); // 출력: [5, 6, 11, 12, 13]
```

### **Rust 예제 코드**

```rust
fn insertion_sort(arr: &mut Vec<i32>) {
    let n = arr.len();

    for i in 1..n {
        let key = arr[i]; // 현재 삽입할 요소
        let mut j = i as i32 - 1;

        // 현재 요소보다 큰 요소를 오른쪽으로 이동
        while j >= 0 && arr[j as usize] > key {
            arr[(j + 1) as usize] = arr[j as usize];
            j -= 1;
        }

        arr[(j + 1) as usize] = key; // 요소 삽입
    }
}

// 예제 사용
fn main() {
    let mut array = vec![12, 11, 13, 5, 6];
    insertion_sort(&mut array);
    println!("{:?}", array); // 출력: [5, 6, 11, 12, 13]
}
```

### **요약**

삽입 정렬은 배열의 요소를 차례로 비교하여 적절한 위치에 삽입하는 방식으로 작동합니다. 이미 정렬된 부분을 유지하면서 새 요소를 삽입하기 때문에, 거의 정렬된 데이터나 작은 배열을 처리할 때 매우 효율적입니다. 하지만 큰 데이터 세트에 대해서는 비효율적일 수 있습니다.
