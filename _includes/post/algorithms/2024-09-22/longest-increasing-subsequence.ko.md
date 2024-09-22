## 가장 긴 증가하는 부분 수열 (LIS)?

**가장 긴 증가하는 부분 수열 (LIS)**은 고전적인 컴퓨터 과학 문제입니다. 숫자 시퀀스가 주어졌을 때, 이 시퀀스에서 모든 요소가 엄격하게 증가하는 가장 긴 부분 수열을 찾는 것이 목표입니다.

**부분 수열**은 일부 또는 아무 요소도 삭제하지 않고, 나머지 요소들의 순서를 유지하여 다른 시퀀스로부터 도출할 수 있는 시퀀스입니다.

예를 들어, 배열 `[10, 22, 9, 33, 21, 50, 41, 60, 80]`에서, LIS는 `[10, 22, 33, 50, 60, 80]`이며, 길이는 `6`입니다.

### 문제 설명:

정수 배열이 주어졌을 때, 가장 긴 증가하는 부분 수열의 길이를 찾아야 합니다.

#### 주요 포인트:

1. 부분 수열은 연속적일 필요는 없습니다.
2. 원래 시퀀스에서 요소의 순서는 유지되어야 합니다.

#### 예시:

- 입력: `[3, 10, 2, 1, 20]`
- 출력: `3` (LIS는 `[3, 10, 20]`)

### 접근 방법:

이 문제는 여러 방법으로 해결할 수 있지만, 가장 효율적인 해결 방법은 시간 복잡도가 `O(n log n)`인 방식입니다.

#### 해결 단계:

1. **동적 프로그래밍 (O(n^2))**: 각 요소에서 끝나는 LIS의 길이를 저장하고 배열을 여러 번 반복하여 이 값을 업데이트합니다.
2. **이진 탐색 (O(n log n))**: 동적 프로그래밍과 이진 탐색을 결합하여 솔루션을 최적화합니다.

### JavaScript 예시

```javascript
// O(n log n) 접근 방식을 사용하여 LIS의 길이를 찾는 함수
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;

  const dp = []; // 증가하는 부분 수열을 저장할 배열

  for (let num of nums) {
    let left = 0;
    let right = dp.length;

    // 이진 탐색을 통해 삽입할 위치를 찾음
    while (left < right) {
      let mid = Math.floor((left + right) / 2);
      if (dp[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // left가 dp 길이와 같으면, num이 dp의 모든 요소보다 큼
    if (left < dp.length) {
      dp[left] = num;
    } else {
      dp.push(num);
    }
  }

  return dp.length;
}

// 예시 사용:
const arr = [10, 22, 9, 33, 21, 50, 41, 60, 80];
console.log(lengthOfLIS(arr)); // 출력: 6
```

### JavaScript 코드 설명:

1. 우리는 `dp` 배열을 유지하는데, 이 배열의 `dp[i]`는 길이 `i+1`의 증가하는 부분 수열의 마지막 요소 중 가장 작은 값을 저장합니다.
2. 입력 배열의 각 숫자에 대해, 이진 탐색을 사용하여 그 숫자가 `dp` 배열에 어디에 들어갈지를 결정합니다.
3. 숫자가 기존 부분 수열에 맞으면 값을 업데이트하고, 그렇지 않으면 배열 끝에 추가합니다.
4. 최종적으로 `dp` 배열의 길이가 가장 긴 증가하는 부분 수열의 길이가 됩니다.

### Rust 예시

```rust
use std::cmp::Ordering;

// O(n log n) 접근 방식을 사용하여 LIS의 길이를 찾는 함수
fn length_of_lis(nums: Vec<i32>) -> usize {
    let mut dp: Vec<i32> = Vec::new();

    for &num in &nums {
        let pos = dp.binary_search_by(|&x| {
            if x < num {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        }).unwrap_or_else(|x| x);

        if pos < dp.len() {
            dp[pos] = num;
        } else {
            dp.push(num);
        }
    }

    dp.len()
}

fn main() {
    let arr = vec![10, 22, 9, 33, 21, 50, 41, 60, 80];
    println!("{}", length_of_lis(arr));  // 출력: 6
}
```

### Rust 코드 설명:

1. 우리는 `binary_search_by` 메서드를 사용하여 `dp` 벡터에서 이진 탐색을 수행합니다.
2. `binary_search_by`의 결과는 현재 숫자가 `dp` 벡터에 어디에 삽입되어야 하는지를 알려줍니다.
3. 숫자가 기존 `dp` 요소를 대체할 수 있으면, 그 자리에 넣습니다. 그렇지 않으면 벡터 끝에 추가됩니다.
4. 최종적으로 `dp` 벡터의 길이는 가장 긴 증가하는 부분 수열의 길이가 됩니다.

### LIS의 사용 사례:

LIS는 다음과 같은 시퀀스나 정렬과 관련된 문제에서 사용할 수 있습니다:

- 특정 순서로 수행되어야 하는 작업 최적화.
- 시간 순서 데이터에서 패턴 찾기.
- 주식 가격 또는 성장 패턴 분석.
- 요소를 반복적으로 이동하여 배열을 정렬하는 데 필요한 최소한의 이동 수 계산.
