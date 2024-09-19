## Sieve of Eratosthenes?

**에라토스테네스의 체**는 주어진 수 `n`까지의 모든 소수를 찾는 효율적인 고대 알고리즘입니다. 이 알고리즘은 2부터 시작하여 각 소수의 배수를 반복적으로 지워나가면서 소수를 찾아냅니다. 모든 배수를 지운 후 남은 숫자들이 소수입니다.

#### 단계:

1. 2부터 `n`까지의 연속된 정수 목록을 만듭니다.
2. 첫 번째 숫자(2)부터 시작하여 그 배수를 모두 소수가 아니라고 표시합니다.
3. 다음 소수로 넘어가고, 그 배수도 같은 방식으로 처리합니다.
4. `n`의 제곱근까지 이 과정을 반복합니다.
5. 목록에서 지워지지 않은 숫자들은 소수입니다.

### 에라토스테네스의 체 사용 사례

1. **소수 생성**: 큰 범위에서 소수를 생성할 때 사용됩니다.
2. **암호학**: RSA와 같은 알고리즘에서 큰 소수를 생성할 때 사용됩니다.
3. **수학 연구**: 수론 문제 및 소수를 이용한 분석에 사용됩니다.
4. **경쟁 프로그래밍**: 이 알고리즘은 효율성이 뛰어나 경쟁 프로그래밍에서 자주 사용됩니다.

### 시간 복잡도:

에라토스테네스의 체의 시간 복잡도는 **O(n log log n)**으로, 매우 큰 범위에서 소수를 찾을 때도 효율적입니다.

### JavaScript에서의 에라토스테네스의 체 예제

```javascript
function sieveOfEratosthenes(n) {
  // 모든 항목을 true로 설정한 배열 "isPrime"을 만듭니다.
  let isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false; // 0과 1은 소수가 아닙니다.

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false; // i의 배수를 소수가 아니라고 표시합니다.
      }
    }
  }

  // 소수 목록을 수집합니다.
  let primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }
  return primes;
}

console.log(sieveOfEratosthenes(30)); // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] 출력
```

### Rust에서의 에라토스테네스의 체 예제

```rust
fn sieve_of_eratosthenes(n: usize) -> Vec<usize> {
    let mut is_prime = vec![true; n + 1];
    is_prime[0] = false;
    is_prime[1] = false;

    for i in 2..=((n as f64).sqrt() as usize) {
        if is_prime[i] {
            for j in (i * i..=n).step_by(i) {
                is_prime[j] = false;
            }
        }
    }

    let primes: Vec<usize> = (2..=n).filter(|&i| is_prime[i]).collect();
    primes
}

fn main() {
    let primes = sieve_of_eratosthenes(30);
    println!("{:?}", primes);  // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] 출력
}
```

### 요약:

**에라토스테네스의 체**는 주어진 수 `n`까지의 소수를 찾는 매우 효율적인 알고리즘입니다. 숫자를 나열하고 소수가 아닌 숫자들을 지우는 방식으로 작동합니다. 이 알고리즘은 암호학, 수론, 경쟁 프로그래밍 등에서 널리 사용되며, JavaScript와 Rust에서도 쉽게 구현할 수 있습니다.
