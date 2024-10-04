## Shell Sort?

**셸 정렬(Shell Sort)**은 삽입 정렬(Insertion Sort)의 개선된 버전으로, 멀리 떨어진 요소들끼리 비교하고 교환하는 방식으로 배열을 정렬하는 알고리즘입니다. 이 알고리즘은 점점 더 짧은 간격으로 요소들을 비교하면서 정렬해 나가다가 마지막 단계에서는 삽입 정렬을 수행하여 전체 배열을 정렬합니다. 간격을 줄여가며 정렬하기 때문에 최악의 경우에도 삽입 정렬보다 더 빠르게 동작할 수 있습니다.

#### **시간 복잡도**:

- 최악의 경우: **O(n²)** (하지만 특정 간격(gap) 시퀀스를 사용할 경우 더 빠를 수 있음)
- 평균적인 경우: **O(n log² n)** 정도로 동작할 수 있음

#### **사용 사례**:

- 크기가 크지 않은 배열에서 상대적으로 빠르고 간단한 정렬이 필요할 때 유용합니다.
- 삽입 정렬이 비효율적인 **큰 데이터셋**에서 효율적으로 사용될 수 있습니다.

### **JavaScript 셸 정렬 예제 코드**

```javascript
function shellSort(arr) {
  let n = arr.length;
  let gap = Math.floor(n / 2); // 초기 간격 설정

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;

      // 간격만큼 떨어진 요소들끼리 비교하여 교환
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2); // 간격을 줄여가며 다시 정렬
  }
  return arr;
}

// 사용 예시
const array = [12, 34, 54, 2, 3];
console.log(shellSort(array)); // 출력: [2, 3, 12, 34, 54]
```

### **Rust 셸 정렬 예제 코드**

```rust
fn shell_sort(arr: &mut [i32]) {
    let mut gap = arr.len() / 2; // 초기 간격 설정

    while gap > 0 {
        for i in gap..arr.len() {
            let temp = arr[i];
            let mut j = i;

            // 간격만큼 떨어진 요소들끼리 비교하여 교환
            while j >= gap && arr[j - gap] > temp {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
        gap /= 2; // 간격을 줄여가며 다시 정렬
    }
}

fn main() {
    let mut array = [12, 34, 54, 2, 3];
    shell_sort(&mut array);
    println!("{:?}", array); // 출력: [2, 3, 12, 34, 54]
}
```

### 요약

**셸 정렬(Shell Sort)**은 삽입 정렬보다 개선된 버전으로, 멀리 떨어진 요소들을 먼저 정렬하고 점점 간격을 줄여가며 배열을 정렬하는 방식입니다. 최악의 경우 **O(n²)**의 시간 복잡도를 가지지만, 삽입 정렬보다 일반적으로 더 빠릅니다. 작은 배열이나 중간 크기의 배열에서 비교적 간단하고 효율적으로 사용할 수 있습니다.
