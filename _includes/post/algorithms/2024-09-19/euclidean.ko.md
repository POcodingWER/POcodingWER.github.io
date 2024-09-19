## Euclidean Algorithm?

**유클리드 알고리즘(Euclidean Algorithm)**은 두 정수의 **최대공약수(GCD)**를 찾는 효율적인 방법입니다. 두 수의 최대공약수는 두 수를 나머지 없이 나눌 수 있는 가장 큰 숫자입니다.

유클리드 알고리즘의 기본 아이디어는, 두 수 `a`와 `b`(단, `a > b`)의 최대공약수는 `b`와 `a % b`의 최대공약수와 같다는 것입니다. 이 알고리즘은 숫자 중 하나가 0이 될 때까지 재귀적으로 반복하며, 그 순간 다른 숫자가 최대공약수가 됩니다.

수학적으로, 알고리즘은 다음과 같이 표현할 수 있습니다:

- **gcd(a, b) = gcd(b, a % b)**, 단 **b = 0**일 때는 **gcd(a, 0) = a**

### 유클리드 알고리즘의 사용 사례

1. **암호학**: 두 수가 서로소(최대공약수가 1)가 되는지 확인하기 위해 RSA와 같은 키 생성 알고리즘에서 사용됩니다.
2. **컴퓨터 과학**: 이 알고리즘은 수론의 기본이며, 분수를 단순화하는 문제를 해결하는 데 도움을 줍니다.
3. **네트워킹**: 네트워킹 알고리즘, 예를 들어 오류 검출 코드 및 해시 함수에서 사용됩니다.
4. **기하학**: 유클리드 알고리즘은 가장 큰 공통 측정을 계산하는 데 사용되며, 비율 및 크기 조정에 적용됩니다.

### JavaScript에서 유클리드 알고리즘 예제

#### 반복적 접근

```javascript
const ZERO = 0;

function gcd(a, b) {
  while (b !== ZERO) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

console.log(gcd(56, 98)); // 14 출력
console.log(gcd(48, 18)); // 6 출력
```

#### 재귀적 접근

```javascript
const ZERO = 0;

function gcdRecursive(a, b) {
  if (b === ZERO) return a;
  return gcdRecursive(b, a % b);
}

console.log(gcdRecursive(56, 98)); // 14 출력
console.log(gcdRecursive(48, 18)); // 6 출력
```

### Rust에서 유클리드 알고리즘 예제

#### 반복적 접근

```rust
const ZERO: u32 = 0;

fn gcd(mut a: u32, mut b: u32) -> u32 {
    while b != ZERO {
        let remainder = a % b;
        a = b;
        b = remainder;
    }
    a
}

fn main() {
    println!("{}", gcd(56, 98));  // 14 출력
    println!("{}", gcd(48, 18));  // 6 출력
}
```

#### 재귀적 접근

```rust
const ZERO: u32 = 0;

fn gcd_recursive(a: u32, b: u32) -> u32 {
    if b == ZERO {
        return a;
    }
    gcd_recursive(b, a % b)
}

fn main() {
    println!("{}", gcd_recursive(56, 98));  // 14 출력
    println!("{}", gcd_recursive(48, 18));  // 6 출력
}
```

### 요약:

유클리드 알고리즘은 최대공약수를 구하는 강력한 도구로, 암호학, 컴퓨터 과학, 기하학 등 다양한 분야에서 사용됩니다. 이 알고리즘은 반복적 또는 재귀적으로 효율적으로 구현할 수 있으며, JavaScript와 Rust 모두 간단하게 구현 가능합니다.
