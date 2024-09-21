## 멱집합(Power Set)이란?

**멱집합**은 주어진 집합 $ S $의 모든 부분 집합으로 구성된 집합입니다. 여기에는 공집합과 집합 $ S $ 자체도 포함됩니다. 만약 집합 $ S $가 $ n $개의 원소를 가지고 있다면, $ S $의 멱집합은 $ 2^n $개의 부분 집합을 가집니다. 이는 각 원소가 부분 집합에 포함되거나 제외될 수 있기 때문입니다.

예를 들어, $ S = \{1, 2\} $일 때, 멱집합 $ P(S) $는 다음과 같습니다:
$
P(S) = \{\{\}, \{1\}, \{2\}, \{1, 2\}\}
$

### 멱집합의 사용 사례

1. **조합론**: 멱집합은 주어진 집합의 모든 가능한 조합을 탐색하는 데 사용됩니다.
2. **데이터 분석**: 특성 선택(feature selection)에서 멱집합을 사용하여 특성 부분 집합의 모든 조합을 탐색할 수 있습니다.
3. **그래프 이론**: 멱집합은 정점 또는 간선의 모든 가능한 부분 집합을 생성하는 데 사용됩니다.
4. **기계 학습**: 결정 트리와 같은 알고리즘에서 모든 가능한 특성 집합을 탐색하는 데 사용됩니다.
5. **부분 집합 문제**: 멱집합은 배낭 문제(knapsack problem)와 같이 부분 집합과 관련된 문제에서 중요합니다.

### JavaScript로 구현한 멱집합 예제

배열의 멱집합을 생성하는 JavaScript 함수는 다음과 같습니다:

```javascript
function powerSet(arr) {
  const result = [[]]; // 공집합으로 시작

  for (const element of arr) {
    const length = result.length;
    for (let i = 0; i < length; i++) {
      // 각 요소에 대해 기존 부분 집합에 요소를 추가하여 새로운 부분 집합 생성
      result.push([...result[i], element]);
    }
  }

  return result;
}

// 사용 예시
const set = [1, 2, 3];
console.log(powerSet(set));
```

**출력:**

```
[
  [],         [1],
  [2],        [1, 2],
  [3],        [1, 3],
  [2, 3],     [1, 2, 3]
]
```

**설명**:

- 공집합으로 시작합니다.
- 배열의 각 요소에 대해 기존 부분 집합을 반복하고, 각 부분 집합에 요소를 추가하여 새로운 부분 집합을 생성합니다.

### Rust로 구현한 멱집합 예제

Rust에서는 재귀 로직이나 비트wise 표현을 사용하여 멱집합을 생성할 수 있습니다.

```rust
fn power_set<T: Clone>(set: Vec<T>) -> Vec<Vec<T>> {
    let mut result = vec![vec![]];  // 공집합으로 시작

    for element in set {
        let mut new_subsets = Vec::new();
        for subset in &result {
            let mut new_subset = subset.clone();
            new_subset.push(element.clone());
            new_subsets.push(new_subset);
        }
        result.extend(new_subsets);
    }

    result
}

fn main() {
    let set = vec![1, 2, 3];
    let result = power_set(set);

    for subset in result {
        println!("{:?}", subset);
    }
}
```

**설명**:

- 공집합으로 초기화합니다.
- 입력 집합의 각 요소에 대해 현재 요소를 기존 부분 집합에 추가하여 새로운 부분 집합을 생성합니다.

### 요약:

**멱집합**은 주어진 집합의 모든 가능한 부분 집합으로, $ n $ 크기의 집합에 대해 $ 2^n $개의 부분 집합을 포함합니다. 이는 조합론, 데이터 분석, 그래프 이론, 알고리즘에서 중요한 응용 프로그램을 가지고 있습니다. JavaScript와 Rust 모두 요소를 반복하고 기존 집합을 기반으로 새로운 부분 집합을 구성하여 멱집합을 생성할 수 있습니다.
