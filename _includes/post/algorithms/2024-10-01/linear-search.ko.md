## Linear Search?

**Linear Search(선형 탐색)**은 가장 기본적인 탐색 알고리즘 중 하나로, 배열이나 리스트 같은 자료 구조에서 원하는 값을 찾을 때 첫 번째 요소부터 마지막 요소까지 순차적으로 비교하는 방식입니다. 이 알고리즘은 **O(n)**의 시간 복잡도를 가지며, 데이터가 정렬되지 않은 경우에 사용됩니다.

#### **사용 사례**:

- **작은 데이터셋**: 데이터의 양이 적고, 성능 최적화가 크게 중요하지 않을 때 유용합니다.
- **정렬되지 않은 데이터**: 데이터가 정렬되지 않았을 때는 이진 탐색처럼 더 복잡한 알고리즘을 사용할 수 없으므로 선형 탐색이 필요합니다.
- **찾는 값이 있는 위치가 랜덤할 때**: 데이터가 특정 패턴 없이 분포되어 있으면 선형 탐색이 적합합니다.

---

### **JavaScript 예제 코드**

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // 값이 있으면 인덱스 반환
    }
  }
  return -1; // 값이 없으면 -1 반환
}

// 사용 예시
const arr = [3, 5, 1, 9, 2];
const target = 9;
const result = linearSearch(arr, target);
console.log(result); // 3 (값 9의 인덱스)
```

#### **설명**:

- `linearSearch` 함수는 배열 `arr`에서 값 `target`을 찾습니다.
- 배열의 첫 번째 요소부터 마지막 요소까지 순차적으로 확인하며, 값이 일치하면 해당 인덱스를 반환합니다. 값이 없으면 `-1`을 반환합니다.

---

### **Rust 예제 코드**

```rust
fn linear_search(arr: &[i32], target: i32) -> Option<usize> {
    for (index, &item) in arr.iter().enumerate() {
        if item == target {
            return Some(index); // 값이 있으면 인덱스 반환
        }
    }
    None // 값이 없으면 None 반환
}

fn main() {
    let arr = [3, 5, 1, 9, 2];
    let target = 9;
    match linear_search(&arr, target) {
        Some(index) => println!("Found at index: {}", index),
        None => println!("Not found"),
    }
}
```

#### **설명**:

- `linear_search` 함수는 Rust에서 배열 `arr` 내의 값 `target`을 찾습니다.
- `iter().enumerate()`를 사용하여 배열의 각 요소와 그 인덱스를 확인하며, 값이 일치하면 인덱스를 반환하고, 값이 없으면 `None`을 반환합니다.

---

### **요약**:

**Linear Search**는 배열이나 리스트에서 첫 번째 요소부터 순차적으로 값을 탐색하는 간단한 알고리즘입니다. 정렬되지 않은 데이터나 데이터 크기가 작을 때 주로 사용됩니다. JavaScript와 Rust에서는 각각 `for` 루프와 `iter().enumerate()`로 손쉽게 구현할 수 있습니다.
