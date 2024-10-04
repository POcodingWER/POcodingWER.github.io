## Counting Sort?

**카운팅 정렬(Counting Sort)**은 비교 기반이 아닌 정렬 알고리즘으로, 정수나 정수로 표현할 수 있는 데이터를 정렬하는 데 사용됩니다. 이 알고리즘은 입력 배열의 각 고유 요소의 발생 빈도를 세고, 이를 기반으로 각 요소를 출력 배열의 정확한 위치에 배치하는 방식으로 작동합니다. 고유 값들의 빈도를 저장하는 **카운트 배열**을 생성하고, 이를 사용해 요소들의 위치를 계산하여 정렬합니다.

카운팅 정렬은 입력 값들의 범위가 주어진 값의 개수보다 크게 차이가 나지 않을 때 효율적으로 작동합니다.

#### **시간 복잡도**:

- **시간 복잡도**: **O(n + k)**, 여기서 **n**은 입력 배열의 요소 수, **k**는 입력 값들의 범위(최댓값과 최솟값의 차이)
- **공간 복잡도**: **O(k)**, 여기서 **k**는 입력 값의 범위입니다.

#### **사용 사례**:

- **카운팅 정렬**은 입력 값이 알려진 범위 내에 속하는 비음수 정수일 때 사용됩니다.
- 주로 **배열 기반 정렬**에서, **기수 정렬(radix sort)**와 같은 다른 알고리즘에서 하위 정렬로 사용되기도 하며, 점수, 나이, 투표 수 등을 정렬할 때 효과적입니다.

### **JavaScript 카운팅 정렬 예제 코드**

```javascript
function countingSort(arr, maxVal) {
  let count = new Array(maxVal + 1).fill(0);
  let sortedArr = [];

  // 각 요소의 발생 횟수를 셉니다.
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }

  // 정렬된 배열을 만듭니다.
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      sortedArr.push(i);
      count[i]--;
    }
  }

  return sortedArr;
}

// 사용 예시
const array = [4, 2, 2, 8, 3, 3, 1];
console.log(countingSort(array, 8)); // 출력: [1, 2, 2, 3, 3, 4, 8]
```

### **Rust 카운팅 정렬 예제 코드**

```rust
fn counting_sort(arr: &mut [usize], max_val: usize) -> Vec<usize> {
    let mut count = vec![0; max_val + 1]; // 카운트 배열 초기화
    let mut sorted_arr = Vec::new(); // 결과 배열 초기화

    // 각 요소의 발생 횟수를 셉니다.
    for &num in arr.iter() {
        count[num] += 1;
    }

    // 정렬된 배열을 만듭니다.
    for (num, &c) in count.iter().enumerate() {
        for _ in 0..c {
            sorted_arr.push(num);
        }
    }

    sorted_arr
}

fn main() {
    let mut array = [4, 2, 2, 8, 3, 3, 1];
    let sorted_array = counting_sort(&mut array, 8);
    println!("{:?}", sorted_array); // 출력: [1, 2, 2, 3, 3, 4, 8]
}
```

### 요약

**카운팅 정렬(Counting Sort)**은 입력 값의 범위가 작을 때 효율적인 정렬 알고리즘입니다. 시간 복잡도는 **O(n + k)**로, 특히 정수 배열을 다룰 때 비교 기반 정렬 알고리즘보다 더 빠르게 동작할 수 있습니다. 다만, 추가적인 메모리를 사용해야 하므로 범위가 큰 값들에 대해서는 사용하기 어렵습니다.
