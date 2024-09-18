## Factorial?

The **factorial** of a non-negative integer `n`, denoted as `n!`, is the product of all positive integers less than or equal to `n`. Mathematically, it is defined as:

- **n! = n × (n - 1) × (n - 2) × ... × 1**
- Special case: **0! = 1** by definition.

For example:

- 3! = 3 × 2 × 1 = 6
- 5! = 5 × 4 × 3 × 2 × 1 = 120

### Where is Factorial Used?

Factorials are used in various fields:

1. **Combinatorics**: To calculate permutations and combinations.
2. **Probability**: Used in probability theory and distributions like the binomial and Poisson distributions.
3. **Mathematics**: Factorials are often used in calculus, algebra, and series expansions (e.g., Taylor series).
4. **Computer Science**: Algorithms and puzzles like recursion and dynamic programming often use factorials.

### Example of Factorial in JavaScript

Here's how you can implement the factorial function both iteratively and recursively in JavaScript.

#### Iterative Approach

```javascript
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

console.log(factorialIterative(5)); // Outputs 120
console.log(factorialIterative(0)); // Outputs 1
```

#### Recursive Approach

```javascript
function factorialRecursive(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorialRecursive(n - 1);
}

console.log(factorialRecursive(5)); // Outputs 120
console.log(factorialRecursive(0)); // Outputs 1
```

### Example of Factorial in Rust

Similarly, here’s how you can implement factorial in Rust using both iterative and recursive approaches.

#### Iterative Approach

```rust
fn factorial_iterative(n: u32) -> u32 {
    let mut result = 1;
    for i in 2..=n {
        result *= i;
    }
    result
}

fn main() {
    println!("{}", factorial_iterative(5)); // Outputs 120
    println!("{}", factorial_iterative(0)); // Outputs 1
}
```

#### Recursive Approach

```rust
fn factorial_recursive(n: u32) -> u32 {
    if n == 0 {
        return 1;
    }
    n * factorial_recursive(n - 1)
}

fn main() {
    println!("{}", factorial_recursive(5)); // Outputs 120
    println!("{}", factorial_recursive(0)); // Outputs 1
}
```

### Summary:

Factorial is a simple yet powerful mathematical concept used in many areas such as combinatorics, probability, and various algorithms. Both JavaScript and Rust provide the ability to compute factorials efficiently using iterative or recursive methods.
