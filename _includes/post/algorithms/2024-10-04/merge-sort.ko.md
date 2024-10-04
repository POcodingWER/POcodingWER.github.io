## Merge Sort?

**병합 정렬(Merge Sort)**은 분할 정복(divide and conquer) 알고리즘의 대표적인 예로, 리스트를 재귀적으로 절반으로 나누어 각각을 정렬한 후 다시 병합하여 전체를 정렬하는 방식으로 작동합니다. 병합 정렬은 안정적인 정렬 알고리즘으로, 최악, 평균, 최선의 시간 복잡도가 모두 O(n log n)입니다.

#### **시간 복잡도**:

- 최악, 평균, 최선 경우: **O(n log n)**

#### **사용 사례**:

- **큰 배열을 정렬**할 때 적합하며, 특히 안정성을 요구하는 정렬에서 유용합니다.
- **외부 정렬(external sorting)**: 매우 큰 데이터셋을 디스크에서 가져와 처리해야 할 때, 데이터가 메모리에 모두 로드되지 않는 상황에서 사용됩니다.

### **JavaScript 병합 정렬 예제 코드**

```javascript
function merge(left, right) {
  let sortedArray = [];

  while (left.length && right.length) {
    if (left[0] < right[0]) {
      sortedArray.push(left.shift());
    } else {
      sortedArray.push(right.shift());
    }
  }

  return [...sortedArray, ...left, ...right];
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

// 사용 예시
const array = [12, 11, 13, 5, 6, 7];
console.log(mergeSort(array)); // 출력: [5, 6, 7, 11, 12, 13]
```

### **Rust 병합 정렬 예제 코드**

```rust
fn merge(left: Vec<i32>, right: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    let mut left = left.into_iter();
    let mut right = right.into_iter();
    let mut left_val = left.next();
    let mut right_val = right.next();

    while left_val.is_some() && right_val.is_some() {
        if left_val <= right_val {
            result.push(left_val.unwrap());
            left_val = left.next();
        } else {
            result.push(right_val.unwrap());
            right_val = right.next();
        }
    }

    // 남은 값 병합
    result.extend(left_val.into_iter().chain(left));
    result.extend(right_val.into_iter().chain(right));

    result
}

fn merge_sort(arr: Vec<i32>) -> Vec<i32> {
    if arr.len() <= 1 {
        return arr;
    }

    let mid = arr.len() / 2;
    let left = merge_sort(arr[..mid].to_vec());
    let right = merge_sort(arr[mid..].to_vec());

    merge(left, right)
}

fn main() {
    let array = vec![12, 11, 13, 5, 6, 7];
    let sorted_array = merge_sort(array);
    println!("{:?}", sorted_array); // 출력: [5, 6, 7, 11, 12, 13]
}
```

### 요약

**병합 정렬**은 분할 정복 기법을 사용하여 데이터를 정렬하는 알고리즘으로, 특히 대규모 데이터나 외부 정렬을 처리할 때 유용합니다. 병합 정렬은 안정적인 정렬 방식이며 O(n log n)의 시간 복잡도를 가집니다.
