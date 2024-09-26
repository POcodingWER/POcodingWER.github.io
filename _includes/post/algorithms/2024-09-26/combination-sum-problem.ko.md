## 조합 합 문제 (Combination Sum Problem)?

**설명**:  
조합 합 문제는 주어진 배열 내의 숫자들을 사용하여 특정 목표값을 만들 수 있는 모든 조합을 찾는 문제입니다. 이 문제에서 각 숫자는 여러 번 사용할 수 있으며, 숫자의 순서는 중요하지 않습니다. 주로 백트래킹(Backtracking)을 통해 효율적으로 해결할 수 있습니다.

#### 사용 사례:

- **금액 맞추기**: 예를 들어, 주어진 동전들로 특정 금액을 맞추는 모든 가능한 방법을 찾는 문제에서 사용됩니다.
- **수학적 문제 해결**: 특정 값에 도달하는 여러 조합을 찾아야 하는 수학적 문제에 사용할 수 있습니다.

---

### JavaScript 예제

```javascript
function combinationSum(candidates, target) {
  const result = [];

  function backtrack(remaining, start, path) {
    if (remaining === 0) {
      result.push([...path]); // 남은 값이 0이 되면 조합을 결과에 추가
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] <= remaining) {
        path.push(candidates[i]); // 선택된 숫자를 추가
        backtrack(remaining - candidates[i], i, path); // 남은 값으로 재귀 호출
        path.pop(); // 백트래킹, 마지막에 추가된 값을 제거
      }
    }
  }

  backtrack(target, 0, []);
  return result;
}

// 사용 예시
const candidates = [2, 3, 6, 7];
const target = 7;
console.log(combinationSum(candidates, target));
// 출력: [[2, 2, 3], [7]]
```

### 설명:

- `backtrack` 함수는 남은 값을 추적하고, 가능한 숫자 조합을 찾습니다.
- 남은 값이 0이 되면 현재 조합이 올바른 해답임을 의미하며, 그 조합을 결과 배열에 추가합니다.
- 반복문을 통해 후보 숫자를 선택하고, 해당 숫자를 여러 번 사용할 수 있도록 계속 재귀적으로 호출합니다.

---

### Rust 예제

```rust
fn combination_sum(candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> {
    fn backtrack(
        result: &mut Vec<Vec<i32>>,
        candidates: &Vec<i32>,
        target: i32,
        mut path: Vec<i32>,
        start: usize,
    ) {
        if target == 0 {
            result.push(path.clone()); // 남은 값이 0이면 조합을 저장
            return;
        }

        for i in start..candidates.len() {
            if candidates[i] <= target {
                path.push(candidates[i]); // 현재 후보 숫자를 선택
                backtrack(result, candidates, target - candidates[i], path.clone(), i); // 재귀 호출
                path.pop(); // 백트래킹
            }
        }
    }

    let mut result = Vec::new();
    backtrack(&mut result, &candidates, target, Vec::new(), 0);
    result
}

fn main() {
    let candidates = vec![2, 3, 6, 7];
    let target = 7;
    let result = combination_sum(candidates, target);
    println!("{:?}", result); // 출력: [[2, 2, 3], [7]]
}
```

### 설명:

- Rust에서 `backtrack` 함수는 재귀적으로 호출되어 남은 값을 줄여 나가며, 올바른 조합을 찾습니다.
- `path`는 현재까지 선택된 숫자를 저장하며, 남은 값이 0이 되면 그 조합을 결과에 추가합니다.
- Rust의 `Vec` 자료구조를 사용하여 동적으로 결과를 저장하고 관리합니다.

---

### 요약:

조합 합 문제는 주어진 숫자들을 이용해 목표값을 만들 수 있는 모든 조합을 찾는 문제입니다. 백트래킹을 통해 가능한 모든 조합을 탐색하며, 이 문제는 동전 거슬러 주기, 특정 값 조합 찾기 등 다양한 최적화 문제에 적용될 수 있습니다.
