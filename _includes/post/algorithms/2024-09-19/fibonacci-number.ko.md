## Fibonacci Number?

**피보나치 수열(Fibonacci sequence)**은 첫 두 숫자 이후의 각 숫자가 바로 앞 두 숫자의 합인 수열입니다. 수열은 0과 1로 시작하며, 다음과 같이 나열됩니다:

- **0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ...**

수학적으로 정의하면:

- **F(0) = 0**, **F(1) = 1**
- **F(n) = F(n-1) + F(n-2)** (n ≥ 2)

### 피보나치 수열의 사용 사례

1. **수학**: 피보나치 수는 수열, 급수, 황금비와 같은 다양한 수학적 개념에서 나타납니다.
2. **자연**: 피보나치 수는 나뭇잎의 배열, 나무의 가지치기, 조개 껍질의 나선형 패턴 등 자연에서 발견되는 패턴을 설명합니다.
3. **컴퓨터 과학**: 피보나치 수는 동적 프로그래밍, 재귀, 탐색/정렬 알고리즘과 관련된 문제에서 사용됩니다.
4. **금융 시장**: 피보나치 되돌림(Fibonacci retracement)은 트레이더들이 기술 분석에서 지지선과 저항선을 예측할 때 사용됩니다.

### JavaScript로 피보나치 구현

피보나치 수열은 반복(iterative) 방식과 재귀(recursive) 방식을 사용하여 계산할 수 있습니다.

#### 반복적 접근

```javascript
function fibonacciIterative(n) {
  let a = 0,
    b = 1,
    next;
  if (n === 0) return a;
  for (let i = 2; i <= n; i++) {
    next = a + b;
    a = b;
    b = next;
  }
  return b;
}

console.log(fibonacciIterative(6)); // 8 출력
console.log(fibonacciIterative(10)); // 55 출력
```

#### 재귀적 접근

```javascript
function fibonacciRecursive(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

console.log(fibonacciRecursive(6)); // 8 출력
console.log(fibonacciRecursive(10)); // 55 출력
```

### Rust로 피보나치 구현

Rust에서도 반복 방식과 재귀 방식을 통해 피보나치 수열을 구현할 수 있습니다.

#### 반복적 접근

```rust
fn fibonacci_iterative(n: u32) -> u32 {
    let mut a = 0;
    let mut b = 1;
    let mut next;

    if n == 0 {
        return a;
    }

    for _ in 2..=n {
        next = a + b;
        a = b;
        b = next;
    }
    b
}

fn main() {
    println!("{}", fibonacci_iterative(6));  // 8 출력
    println!("{}", fibonacci_iterative(10)); // 55 출력
}
```

#### 재귀적 접근

```rust
fn fibonacci_recursive(n: u32) -> u32 {
    if n == 0 {
        return 0;
    } else if n == 1 {
        return 1;
    }
    fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
}

fn main() {
    println!("{}", fibonacci_recursive(6));  // 8 출력
    println!("{}", fibonacci_recursive(10)); // 55 출력
}
```

### 요약:

피보나치 수열은 수학, 자연, 컴퓨터 과학에서 널리 사용되며, 특히 재귀와 동적 프로그래밍 문제를 해결하는 데 유용합니다. JavaScript와 Rust 모두 반복적 또는 재귀적인 방법을 사용하여 피보나치 수를 효율적으로 계산할 수 있습니다.
