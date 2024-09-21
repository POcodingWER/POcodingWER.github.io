## 순열(Permutations)?

**순열**은 순서가 중요한 원소의 다양한 배열을 말합니다. $ n $개의 원소로 이루어진 집합이 주어질 때, 가능한 순열의 수는 $ n! $ (n 팩토리얼)로 표현되며, 이는 1부터 $ n $까지의 모든 양의 정수의 곱을 나타냅니다.

예를 들어, 집합 $ S = \{1, 2, 3\} $의 순열은 다음과 같습니다:
$
P(S) = \{(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)\}
$

### 순열의 사용 사례

1. **조합 문제**: 순열은 좌석 배치나 경기 결과와 같은 배열을 계산하는 문제에서 사용됩니다.
2. **암호학**: 많은 암호화 알고리즘은 데이터를 숨기기 위해 순열 작업을 활용합니다.
3. **게임 개발**: 게임에서 가능한 모든 이동이나 구성을 생성하는 데 순열이 사용될 수 있습니다.
4. **유전학**: 생물정보학에서 DNA나 단백질의 서열을 분석하는 데 사용됩니다.
5. **최적화**: 작업 스케줄링이나 자원 할당과 같이 순서가 중요한 최적화 문제에서 사용됩니다.

### JavaScript로 구현한 순열 예제

배열의 모든 순열을 생성하는 JavaScript 함수는 다음과 같습니다:

```javascript
function permutations(arr) {
  if (arr.length === 0) return [[]];

  const firstElement = arr[0];
  const restElements = arr.slice(1);
  const permsWithoutFirst = permutations(restElements);

  const allPerms = [];
  for (const perm of permsWithoutFirst) {
    for (let i = 0; i <= perm.length; i++) {
      const permWithFirst = [
        ...perm.slice(0, i),
        firstElement,
        ...perm.slice(i),
      ];
      allPerms.push(permWithFirst);
    }
  }

  return allPerms;
}

// 사용 예시
const set = [1, 2, 3];
console.log(permutations(set));
```

**출력:**

```
[
  [1, 2, 3],
  [1, 3, 2],
  [2, 1, 3],
  [2, 3, 1],
  [3, 1, 2],
  [3, 2, 1]
]
```

**설명**:

- 이 함수는 재귀적으로 순열을 생성합니다. 첫 번째 요소를 가져오고 나머지 요소의 모든 순열을 찾은 다음, 첫 번째 요소를 각 순열의 가능한 위치에 삽입하여 새로운 순열을 생성합니다.

### Rust로 구현한 순열 예제

Rust에서는 재귀적이거나 반복적인 접근 방식을 사용할 수 있습니다. 다음은 간단한 재귀 구현입니다:

```rust
fn permutations<T: Clone>(arr: Vec<T>) -> Vec<Vec<T>> {
    if arr.is_empty() {
        return vec![vec![]];
    }

    let first_element = arr[0].clone();
    let rest_elements = &arr[1..];
    let perms_without_first = permutations(rest_elements.to_vec());

    let mut all_perms = Vec::new();
    for perm in perms_without_first {
        for i in 0..=perm.len() {
            let mut perm_with_first = perm.clone();
            perm_with_first.insert(i, first_element.clone());
            all_perms.push(perm_with_first);
        }
    }

    all_perms
}

fn main() {
    let set = vec![1, 2, 3];
    let result = permutations(set);

    for perm in result {
        println!("{:?}", perm);
    }
}
```

**설명**:

- JavaScript 구현과 유사하게 이 함수는 재귀적으로 순열을 생성합니다. 첫 번째 요소를 가져오고 나머지 요소의 순열에 삽입하여 새로운 순열을 생성합니다.

### 요약:

**순열**은 원소의 배열로, 순서가 중요하며 조합론, 암호학, 게임 개발, 유전학, 최적화 문제에 응용됩니다. JavaScript와 Rust 모두 재귀를 사용하여 순열을 생성할 수 있으며, 가능한 모든 배열을 포괄적으로 제공할 수 있습니다.
