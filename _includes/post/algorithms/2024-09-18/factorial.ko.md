## Factorial?

**팩토리얼(Factorial)**은 음이 아닌 정수 `n`의 팩토리얼을 `n!`으로 표기하며, 이는 `n`보다 작거나 같은 모든 양의 정수의 곱입니다. 수학적으로는 다음과 같이 정의됩니다:

- **n! = n × (n - 1) × (n - 2) × ... × 1**
- 특수한 경우: **0! = 1**으로 정의됩니다.

예시:

- 3! = 3 × 2 × 1 = 6
- 5! = 5 × 4 × 3 × 2 × 1 = 120

### 팩토리얼의 사용 사례

팩토리얼은 다양한 분야에서 사용됩니다:

1. **조합론(Combinatorics)**: 순열과 조합을 계산할 때 사용.
2. **확률(Probability)**: 확률 이론과 이항 분포, 포아송 분포 등에서 사용.
3. **수학(Mathematics)**: 미적분학, 대수학, 급수 전개(Taylor 급수 등)에서 자주 사용.
4. **컴퓨터 과학(Computer Science)**: 재귀, 동적 프로그래밍 같은 알고리즘과 퍼즐에서 활용.

### JavaScript로 팩토리얼 구현

JavaScript에서 팩토리얼 함수를 반복(iterative) 방식과 재귀(recursive) 방식으로 구현할 수 있습니다.

#### 반복적 접근

```javascript
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

console.log(factorialIterative(5)); // 120 출력
console.log(factorialIterative(0)); // 1 출력
```

#### 재귀적 접근

```javascript
function factorialRecursive(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorialRecursive(n - 1);
}

console.log(factorialRecursive(5)); // 120 출력
console.log(factorialRecursive(0)); // 1 출력
```

### Rust로 팩토리얼 구현

Rust에서도 반복 방식과 재귀 방식으로 팩토리얼을 구현할 수 있습니다.

#### 반복적 접근

```rust
fn factorial_iterative(n: u32) -> u32 {
    let mut result = 1;
    for i in 2..=n {
        result *= i;
    }
    result
}

fn main() {
    println!("{}", factorial_iterative(5)); // 120 출력
    println!("{}", factorial_iterative(0)); // 1 출력
}
```

#### 재귀적 접근

```rust
fn factorial_recursive(n: u32) -> u32 {
    if n == 0 {
        return 1;
    }
    n * factorial_recursive(n - 1)
}

fn main() {
    println!("{}", factorial_recursive(5)); // 120 출력
    println!("{}", factorial_recursive(0)); // 1 출력
}
```

### 요약:

팩토리얼은 조합론, 확률, 다양한 알고리즘 등 많은 분야에서 사용되는 단순하지만 강력한 수학적 개념입니다. JavaScript와 Rust 모두 반복적 또는 재귀적인 방법을 통해 효율적으로 팩토리얼을 계산할 수 있습니다.
