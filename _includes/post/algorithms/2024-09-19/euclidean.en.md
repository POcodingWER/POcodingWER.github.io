## Euclidean Algorithm?

The **Euclidean Algorithm** is an efficient method for finding the greatest common divisor (GCD) of two integers. The GCD of two numbers is the largest number that divides both of them without leaving a remainder.

The basic idea behind the Euclidean algorithm is that the GCD of two numbers `a` and `b` (where `a > b`) is the same as the GCD of `b` and `a % b`. The algorithm continues recursively until one of the numbers becomes 0, at which point the other number is the GCD.

Mathematically, the algorithm can be written as:

- **gcd(a, b) = gcd(b, a % b)**, until **b = 0**, then **gcd(a, 0) = a**

### Where is the Euclidean Algorithm Used?

1. **Cryptography**: It is used in key generation algorithms like RSA to ensure that two numbers are coprime (GCD is 1).
2. **Computer Science**: The algorithm is fundamental in number theory and helps solve problems like simplifying fractions.
3. **Networking**: It is used in networking algorithms like error detection codes and hash functions.
4. **Geometry**: Euclid's algorithm is used to compute the greatest common measure, which has applications in scaling and proportional reasoning.

### Example of Euclidean Algorithm in JavaScript

#### Iterative Approach

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

console.log(gcd(56, 98)); // Outputs 14
console.log(gcd(48, 18)); // Outputs 6
```

#### Recursive Approach

```javascript
const ZERO = 0;

function gcdRecursive(a, b) {
  if (b === ZERO) return a;
  return gcdRecursive(b, a % b);
}

console.log(gcdRecursive(56, 98)); // Outputs 14
console.log(gcdRecursive(48, 18)); // Outputs 6
```

### Example of Euclidean Algorithm in Rust

#### Iterative Approach

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
    println!("{}", gcd(56, 98));  // Outputs 14
    println!("{}", gcd(48, 18));  // Outputs 6
}
```

#### Recursive Approach

```rust
const ZERO: u32 = 0;

fn gcd_recursive(a: u32, b: u32) -> u32 {
    if b == ZERO {
        return a;
    }
    gcd_recursive(b, a % b)
}

fn main() {
    println!("{}", gcd_recursive(56, 98));  // Outputs 14
    println!("{}", gcd_recursive(48, 18));  // Outputs 6
}
```

### Summary:

The Euclidean algorithm is a powerful tool for finding the greatest common divisor (GCD) and is widely used in cryptography, computer science, and geometry. It can be implemented efficiently using either an iterative or recursive approach. Both JavaScript and Rust provide simple ways to implement this algorithm.
