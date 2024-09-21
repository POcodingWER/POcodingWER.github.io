## 조합(Combinations)?

**조합**은 더 큰 집합에서 항목을 선택할 때 선택의 순서가 중요하지 않은 경우를 말합니다. $ n $개의 항목 중 $ r $개의 항목을 선택할 때 가능한 조합의 수는 $ C(n, r) $로 표시되며, 다음과 같은 공식을 사용하여 계산됩니다:

$
C(n, r) = \frac{n!}{r!(n - r)!}
$

예를 들어, 집합 $ S = \{1, 2, 3\} $의 2개 요소 조합은 다음과 같습니다:
$
C(S, 2) = \{\{1, 2\}, \{1, 3\}, \{2, 3\}\}
$

### 조합의 사용 사례

1. **복권 및 도박**: 다양한 숫자의 조합에 따라 당첨 확률을 계산하는 데 사용됩니다.
2. **음식 및 메뉴 선택**: 메뉴에서 요리 세트를 선택할 때, 순서가 중요하지 않은 경우입니다.
3. **팀 구성**: 팀원 배열이 중요하지 않은 큰 그룹에서 팀을 구성하는 경우.
4. **데이터 분석**: 통계 모델링에서 특성이나 변수를 선택할 때 사용됩니다.
5. **조합 최적화**: 특정 제약 조건 하에서 최적 조합을 찾아야 하는 문제에서 사용됩니다.

### JavaScript로 구현한 조합 예제

다음은 주어진 배열에서 특정 길이의 모든 조합을 생성하는 JavaScript 함수입니다:

```javascript
function combinations(arr, r) {
  const result = [];

  const backtrack = (start, current) => {
    if (current.length === r) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  };

  backtrack(0, []);
  return result;
}

// 사용 예시
const set = [1, 2, 3, 4];
const r = 2;
console.log(combinations(set, r));
```

**출력:**

```
[
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4]
]
```

**설명**:

- 이 함수는 백트래킹 접근 방식을 사용하여 조합을 생성합니다. 요소를 추가하여 현재 조합이 원하는 길이에 도달할 때까지 재귀적으로 빌드합니다.

### Rust로 구현한 조합 예제

Rust에서도 유사한 백트래킹 접근 방식을 사용하여 조합을 생성할 수 있습니다:

```rust
fn combinations<T: Clone>(arr: &[T], r: usize) -> Vec<Vec<T>> {
    let mut result = Vec::new();
    let mut current = Vec::new();

    fn backtrack<T: Clone>(arr: &[T], r: usize, start: usize, current: &mut Vec<T>, result: &mut Vec<Vec<T>>) {
        if current.len() == r {
            result.push(current.clone());
            return;
        }
        for i in start..arr.len() {
            current.push(arr[i].clone());
            backtrack(arr, r, i + 1, current, result);
            current.pop();
        }
    }

    backtrack(arr, r, 0, &mut current, &mut result);
    result
}

fn main() {
    let set = vec![1, 2, 3, 4];
    let r = 2;
    let result = combinations(&set, r);

    for combo in result {
        println!("{:?}", combo);
    }
}
```

**설명**:

- 이 Rust 함수는 JavaScript 구현과 유사한 방식으로 조합을 생성하는 백트래킹 함수를 정의합니다. 지정된 길이의 유효한 조합을 수집합니다.

### 요약:

**조합**은 순서가 중요하지 않은 큰 집합에서의 선택을 나타내며, 복권, 음식 선택, 팀 구성, 데이터 분석, 최적화 문제와 같은 분야에서 응용됩니다. JavaScript와 Rust 모두 백트래킹 방식을 사용하여 조합을 효율적으로 생성할 수 있으며, 원하는 크기의 모든 가능한 선택을 제공합니다.
