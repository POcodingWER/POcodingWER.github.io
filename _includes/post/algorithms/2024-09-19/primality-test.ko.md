## Primality Test?

**소수 판별(Primality Test)**은 주어진 숫자가 소수인지 여부를 결정하는 알고리즘입니다. 소수는 1과 자신을 제외한 양의 약수가 없는 자연수입니다.

예시:

- 소수: 2, 3, 5, 7, 11, 13, 17, ...
- 소수가 아닌 수: 4, 6, 8, 9, 10, 12, ...

`n`이 소수인지 확인하는 가장 간단한 방법은 1과 자기 자신 외에 다른 약수가 있는지 확인하는 것입니다. 이때 `n`의 제곱근까지 나누어 보아 약수가 없으면 해당 숫자는 소수입니다.

### 소수 판별의 사용 사례

1. **암호학**: 소수는 RSA와 같은 현대 암호화 알고리즘의 기반이 되며, 이는 큰 합성수를 소인수분해하는 것이 어렵다는 점에 의존합니다.
2. **수론(Number Theory)**: 소수는 수론에서 중요한 역할을 하며, 소수를 생성할 때 소수 판별 알고리즘이 필수적입니다.
3. **난수 생성**: 소수는 난수 생성 알고리즘에서 자주 사용됩니다.
4. **해싱과 검색**: 소수는 해시 함수 설계 및 효율적인 검색 알고리즘에서 유용합니다.

### JavaScript에서의 소수 판별 예제

#### 기본 소수 판별 (반복문)

```javascript
function isPrime(n) {
  if (n <= 1) return false;
  if (n === 2) return true; // 2는 유일한 짝수 소수
  if (n % 2 === 0) return false; // 짝수는 소수가 아님

  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

console.log(isPrime(11)); // true
console.log(isPrime(25)); // false
console.log(isPrime(29)); // true
```

### 최적화된 소수 판별 (JavaScript)

작은 소수들을 먼저 확인하는 몇 가지 최적화를 적용한 소수 판별입니다.

```javascript
function isPrimeOptimized(n) {
  if (n <= 1) return false;
  if (n <= 3) return true; // 2와 3은 소수
  if (n % 2 === 0 || n % 3 === 0) return false; // 2와 3으로 나누어 떨어지면 소수 아님

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

console.log(isPrimeOptimized(31)); // true
console.log(isPrimeOptimized(49)); // false
```

### Rust에서의 소수 판별 예제

#### 기본 소수 판별 (반복문)

```rust
fn is_prime(n: u32) -> bool {
    if n <= 1 {
        return false;
    }
    if n == 2 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }

    let limit = (n as f64).sqrt() as u32;
    for i in (3..=limit).step_by(2) {
        if n % i == 0 {
            return false;
        }
    }
    true
}

fn main() {
    println!("{}", is_prime(11));  // true
    println!("{}", is_prime(25));  // false
    println!("{}", is_prime(29));  // true
}
```

### 최적화된 소수 판별 (Rust)

여기서는 Rust에서 소수 판별을 조금 더 최적화한 방법입니다.

```rust
fn is_prime_optimized(n: u32) -> bool {
    if n <= 1 {
        return false;
    }
    if n <= 3 {
        return true;
    }
    if n % 2 == 0 || n % 3 == 0 {
        return false;
    }

    let mut i = 5;
    while i * i <= n {
        if n % i == 0 || n % (i + 2) == 0 {
            return false;
        }
        i += 6;
    }
    true
}

fn main() {
    println!("{}", is_prime_optimized(31));  // true
    println!("{}", is_prime_optimized(49));  // false
}
```

### 요약:

소수 판별은 암호학과 수론에서 필수적인 알고리즘으로, 숫자가 소수인지 여부를 1과 자신 외의 약수가 있는지 확인하여 판단합니다. JavaScript와 Rust는 소수 여부를 효율적으로 판단하기 위한 반복적 또는 최적화된 접근 방식을 제공합니다.
