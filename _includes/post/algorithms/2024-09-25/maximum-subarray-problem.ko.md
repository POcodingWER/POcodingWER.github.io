## 최대 부분 배열 문제 (Maximum Subarray Problem)?

**설명**:  
최대 부분 배열 문제는 배열 내에서 연속된 부분 배열 중 합이 가장 큰 부분 배열을 찾는 문제입니다. 이 문제는 **Kadane's Algorithm**이라는 알고리즘을 사용해 효율적으로 해결할 수 있습니다. 이 알고리즘의 시간 복잡도는 O(n)으로 매우 효율적입니다.

#### 사용 사례:

- **주식 거래**: 특정 기간 동안 주식의 가격 변동을 분석하여 가장 큰 이익을 얻을 수 있는 구간을 찾을 때 사용할 수 있습니다.
- **기후 분석**: 날씨 데이터를 분석해 가장 긴 기간 동안의 온도 상승 또는 하락 구간을 찾는 데 사용될 수 있습니다.

---

### JavaScript

```javascript
function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

// 사용 예시
const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArray(nums)); // 출력: 6 (부분 배열 [4, -1, 2, 1]의 합)
```

### 설명:

- 배열의 각 요소를 차례대로 순회하면서 현재까지의 최대 부분 배열 합을 추적합니다.
- `maxEndingHere`는 현재 위치까지의 부분 배열의 최대 합을 기록하며, 현재 요소와 이전 합에 현재 요소를 더한 값 중 더 큰 값을 선택합니다.
- `maxSoFar`는 전체 배열에서의 최대 부분 배열 합을 기록합니다.

---

### Rust

```rust
fn max_sub_array(nums: Vec<i32>) -> i32 {
    let mut max_so_far = nums[0];
    let mut max_ending_here = nums[0];

    for &num in nums.iter().skip(1) {
        max_ending_here = i32::max(num, max_ending_here + num);
        max_so_far = i32::max(max_so_far, max_ending_here);
    }

    max_so_far
}

fn main() {
    let nums = vec![-2, 1, -3, 4, -1, 2, 1, -5, 4];
    println!("{}", max_sub_array(nums)); // 출력: 6 (부분 배열 [4, -1, 2, 1]의 합)
}
```

### 설명:

- `nums.iter().skip(1)`은 첫 번째 요소를 건너뛰고 두 번째 요소부터 순회하는 방법입니다.
- `i32::max`는 현재 값과 `max_ending_here + num` 중 더 큰 값을 선택해 최대 부분 배열 합을 갱신합니다.
- 최종적으로 `max_so_far`에는 최대 부분 배열의 합이 저장됩니다.

---

### 요약:

최대 부분 배열 문제는 연속된 부분 배열의 합 중에서 가장 큰 값을 찾는 문제입니다. Kadane's Algorithm을 사용하면 O(n)의 시간 복잡도로 매우 효율적으로 해결할 수 있습니다. 이 문제는 주식 거래, 기후 데이터 분석 등 여러 실제 문제에 적용될 수 있습니다.
