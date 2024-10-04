## Radix Sort?

**기수 정렬(Radix Sort)**은 비교 기반이 아닌 정렬 알고리즘으로, 숫자를 자릿수별로 정렬합니다. 가장 낮은 자릿수(LSD) 또는 가장 높은 자릿수(MSD)부터 시작하여 각 자릿수의 값을 기준으로 그룹화합니다. 각 자릿수를 처리하기 위해 보통 **계수 정렬(Counting Sort)** 또는 **버킷 정렬(Bucket Sort)**을 하위 정렬로 사용합니다.

기수 정렬은 숫자의 자릿수가 데이터셋 크기에 비해 작을 때 효율적으로 작동합니다.

#### **시간 복잡도**:

- **시간 복잡도**: **O(d \* (n + b))**, 여기서:
  - **n**은 배열의 요소 수,
  - **d**는 가장 큰 숫자의 자릿수,
  - **b**는 숫자를 나타내기 위한 기수(일반적으로 10).
- **공간 복잡도**: **O(n + b)**.

#### **사용 사례**:

- 기수 정렬은 입력 데이터가 숫자로 구성되어 있고, 최대 값이 크지 않은 경우에 사용됩니다.
- 긴 전화번호, IP 주소 또는 큰 정수 배열을 정렬할 때 특히 유용합니다.

---

### **JavaScript 기수 정렬 예제 코드**

```javascript
function getMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function countingSort(arr, exp) {
  const output = new Array(arr.length).fill(0);
  const count = new Array(10).fill(0);

  // 각 자릿수의 발생 횟수를 셉니다.
  for (let i = 0; i < arr.length; i++) {
    let index = Math.floor(arr[i] / exp) % 10;
    count[index]++;
  }

  // 카운트 배열을 수정하여 실제 위치를 저장합니다.
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // 출력 배열을 만듭니다.
  for (let i = arr.length - 1; i >= 0; i--) {
    let index = Math.floor(arr[i] / exp) % 10;
    output[count[index] - 1] = arr[i];
    count[index]--;
  }

  // 출력 배열을 원본 배열에 복사합니다.
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
}

function radixSort(arr) {
  const max = getMax(arr);

  // 각 자릿수에 대해 계수 정렬을 적용합니다.
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(arr, exp);
  }

  return arr;
}

// 사용 예시
const array = [170, 45, 75, 90, 802, 24, 2, 66];
console.log(radixSort(array)); // 출력: [2, 24, 45, 66, 75, 90, 170, 802]
```

---

### **Rust 기수 정렬 예제 코드**

```rust
fn get_max(arr: &[i32]) -> i32 {
    *arr.iter().max().unwrap()
}

fn counting_sort(arr: &mut [i32], exp: i32) {
    let mut output = vec![0; arr.len()];
    let mut count = vec![0; 10];

    // 각 자릿수의 발생 횟수를 셉니다.
    for &num in arr.iter() {
        let index = (num / exp) % 10;
        count[index as usize] += 1;
    }

    // 카운트 배열을 수정하여 실제 위치를 저장합니다.
    for i in 1..10 {
        count[i] += count[i - 1];
    }

    // 출력 배열을 만듭니다.
    for &num in arr.iter().rev() {
        let index = (num / exp) % 10;
        output[count[index as usize] as usize - 1] = num;
        count[index as usize] -= 1;
    }

    // 출력 배열을 원본 배열에 복사합니다.
    arr.copy_from_slice(&output);
}

fn radix_sort(arr: &mut [i32]) {
    let max = get_max(arr);

    // 각 자릿수에 대해 계수 정렬을 적용합니다.
    let mut exp = 1;
    while max / exp > 0 {
        counting_sort(arr, exp);
        exp *= 10;
    }
}

fn main() {
    let mut array = [170, 45, 75, 90, 802, 24, 2, 66];
    radix_sort(&mut array);
    println!("{:?}", array); // 출력: [2, 24, 45, 66, 75, 90, 170, 802]
}
```

---

### 요약

**기수 정렬(Radix Sort)**은 숫자나 문자열을 대규모 데이터셋에서 자릿수별로 정렬할 수 있는 효율적인 정렬 알고리즘입니다. 자릿수 수에 비례하는 시간 복잡도를 가지므로 특정 경우에 비교 기반 알고리즘보다 더 빠르게 동작할 수 있습니다. 그러나 추가적인 메모리를 사용해야 하며, 데이터의 범위가 크지 않아야 효율적으로 사용될 수 있습니다.
