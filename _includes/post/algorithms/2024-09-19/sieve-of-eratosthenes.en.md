## Sieve of Eratosthenes?

The **Sieve of Eratosthenes** is an ancient and efficient algorithm used to find all prime numbers up to a given limit `n`. It works by iteratively marking the multiples of each prime number starting from 2. The numbers that remain unmarked after all multiples have been marked are prime numbers.

#### Steps:

1. Create a list of consecutive integers from 2 to `n`.
2. Start with the first number (2), mark all of its multiples as non-prime.
3. Move to the next unmarked number (which is prime) and mark all its multiples.
4. Repeat the process until you've processed all numbers up to the square root of `n`.
5. The remaining unmarked numbers in the list are prime.

### Use Cases of the Sieve of Eratosthenes

1. **Prime Number Generation**: It is used to generate prime numbers up to a large limit.
2. **Cryptography**: In algorithms like RSA, large prime numbers are needed for key generation.
3. **Mathematical Research**: Used in number theory problems and analysis involving prime numbers.
4. **Competitive Programming**: The algorithm is widely used in competitive programming due to its efficiency.

### Time Complexity:

The time complexity of the Sieve of Eratosthenes is **O(n log log n)**, which is very efficient for finding primes in a large range.

### Example of Sieve of Eratosthenes in JavaScript

```javascript
function sieveOfEratosthenes(n) {
  // Create an array "isPrime" with all entries set to true initially.
  let isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false; // 0 and 1 are not prime

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false; // Mark multiples of i as non-prime
      }
    }
  }

  // Collect all prime numbers
  let primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }
  return primes;
}

console.log(sieveOfEratosthenes(30)); // Outputs [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

### Example of Sieve of Eratosthenes in Rust

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
    println!("{:?}", primes);  // Outputs [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
}
```

### Summary:

The **Sieve of Eratosthenes** is a highly efficient algorithm for finding all prime numbers up to a given limit `n`. It works by marking non-prime numbers in a list and leaving the primes unmarked. This algorithm is widely used in cryptography, number theory, and competitive programming due to its efficiency and simplicity. Both JavaScript and Rust provide clean implementations for generating prime numbers using this sieve method.
