## Integer Partition?

**자연수 분할**이란, 양의 자연수를 더 작은 자연수들의 합으로 나누는 것을 의미합니다. 이때 각 합이 되는 숫자들의 순서는 상관없으며, 구성되는 숫자의 개수와 조합이 중요합니다.

예를 들어:

- `4`의 자연수 분할은:  
  `4`, `3 + 1`, `2 + 2`, `2 + 1 + 1`, `1 + 1 + 1 + 1` 와 같습니다.

### 자연수 분할의 활용

자연수 분할은 여러 실용적인 응용이 있으며, 특히:

- **조합론 (Combinatorics):** 아이템을 배열하거나 결합하는 방법의 수를 계산.
- **자연수론 (Number Theory):** 자연수의 특성과 그 관계를 연구.
- **암호학 (Cryptography):** 일부 암호화 방식 및 키 생성에 사용.
- **양자 물리학 (Quantum Physics):** 양자 시스템에서 입자 상태를 모델링.
- **동적 계획법 (Dynamic Programming):** 부분 집합의 합이나 배열 분할 문제에 사용.

### JavaScript 예제

다음은 주어진 자연수 `n`의 모든 분할을 생성하는 간단한 JavaScript 구현입니다:

```javascript
function partition(n) {
  const result = [];

  function _partition(n, max, prefix) {
    if (n === 0) {
      result.push(prefix);
      return;
    }
    for (let i = Math.min(max, n); i >= 1; i--) {
      _partition(n - i, i, [...prefix, i]);
    }
  }

  _partition(n, n, []);
  return result;
}

const number = 4;
console.log(partition(number));
```

### JavaScript 코드 설명

1. **`partition(n)`**은 `n`의 분할을 찾는 메인 함수입니다.
2. **`_partition(n, max, prefix)`**는 재귀적으로 `n`을 분할하여 결과 배열에 저장하는 함수입니다.
3. `4`를 분할한 결과는:

```javascript
[[4], [3, 1], [2, 2], [2, 1, 1], [1, 1, 1, 1]];
```

### Rust 예제

다음은 `n`의 자연수 분할을 생성하는 Rust 구현입니다:

```rust
fn partition(n: usize) -> Vec<Vec<usize>> {
    let mut result = Vec::new();

    fn _partition(n: usize, max: usize, prefix: Vec<usize>, result: &mut Vec<Vec<usize>>) {
        if n == 0 {
            result.push(prefix);
            return;
        }
        for i in (1..=max).rev() {
            if i <= n {
                let mut new_prefix = prefix.clone();
                new_prefix.push(i);
                _partition(n - i, i, new_prefix, result);
            }
        }
    }

    _partition(n, n, Vec::new(), &mut result);
    result
}

fn main() {
    let number = 4;
    let partitions = partition(number);
    for part in partitions {
        println!("{:?}", part);
    }
}
```

### Rust 코드 설명

1. **`partition(n)`**은 재귀적 도우미 함수 `_partition`을 호출하는 메인 함수입니다.
2. **`_partition(n, max, prefix, result)`**는 유효한 분할을 결과 배열에 추가하면서 탐색하는 재귀 함수입니다.
3. `4`의 출력 결과는 다음과 같습니다:

```rust
[4]
[3, 1]
[2, 2]
[2, 1, 1]
[1, 1, 1, 1]
```

### 요약

- **자연수 분할**은 자연수를 다른 자연수들의 합으로 분해하는 과정입니다.
- 조합론, 암호학, 동적 계획법, 물리학 등 다양한 분야에서 활용됩니다.
- JavaScript와 Rust의 예시는 재귀적 방법을 사용하여 주어진 숫자의 모든 자연수 분할을 찾는 방법을 보여줍니다.
