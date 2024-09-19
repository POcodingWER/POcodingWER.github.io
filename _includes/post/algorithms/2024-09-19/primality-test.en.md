## Primality Test?

A **primality test** is an algorithm used to determine whether a given number is a prime number. A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

For example:

- Prime numbers: 2, 3, 5, 7, 11, 13, 17, ...
- Non-prime numbers: 4, 6, 8, 9, 10, 12, ...

The simplest approach to check if a number `n` is prime is to test whether it has any divisors other than 1 and itself. This is done by checking divisibility from 2 to the square root of `n`. If no divisors are found, the number is prime.

### Where is the Primality Test Used?

1. **Cryptography**: Primes are the foundation of modern encryption algorithms such as RSA, which relies on the difficulty of factoring large composite numbers.
2. **Number Theory**: Prime numbers play a key role in number theory, and primality tests are essential for generating prime numbers in mathematical research.
3. **Random Number Generation**: Prime numbers are often used in algorithms for generating pseudo-random numbers.
4. **Hashing and Searching**: Prime numbers are useful in designing hash functions and efficient searching algorithms.

### Example of Primality Test in JavaScript

#### Basic Primality Test (Iterative)

```javascript
function isPrime(n) {
  if (n <= 1) return false;
  if (n === 2) return true; // 2 is the only even prime number
  if (n % 2 === 0) return false; // Exclude other even numbers

  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

console.log(isPrime(11)); // true
console.log(isPrime(25)); // false
console.log(isPrime(29)); // true
```

### Optimized Primality Test (JS)

Here’s an optimized version of the primality test using a few more optimizations like checking small prime divisors first.

```javascript
function isPrimeOptimized(n) {
  if (n <= 1) return false;
  if (n <= 3) return true; // 2 and 3 are prime
  if (n % 2 === 0 || n % 3 === 0) return false; // Check divisibility by 2 and 3

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

console.log(isPrimeOptimized(31)); // true
console.log(isPrimeOptimized(49)); // false
```

### Example of Primality Test in Rust

#### Basic Primality Test (Iterative)

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

### Optimized Primality Test (Rust)

Here’s a slightly more optimized primality test in Rust.

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

### Summary:

A primality test is a fundamental algorithm used in fields such as cryptography and number theory. It determines whether a number is prime by checking if it has any divisors other than 1 and itself. JavaScript and Rust offer simple iterative or optimized approaches for efficiently determining if a number is prime.
