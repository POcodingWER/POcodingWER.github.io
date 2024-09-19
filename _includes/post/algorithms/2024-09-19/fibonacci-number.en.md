## Fibonacci Number?

The **Fibonacci sequence** is a series of numbers where each number (after the first two) is the sum of the two preceding ones. The sequence starts with 0 and 1, and it looks like this:

- **0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ...**

Mathematically, it can be defined as:

- **F(0) = 0**, **F(1) = 1**
- **F(n) = F(n-1) + F(n-2)** for **n ≥ 2**

### Where is the Fibonacci Sequence Used?

1. **Mathematics**: Fibonacci numbers appear in various mathematical concepts, including sequences, series, and golden ratio approximations.
2. **Nature**: Fibonacci numbers describe patterns found in nature, such as the arrangement of leaves, the branching of trees, and the spiral patterns of shells.
3. **Computer Science**: Fibonacci numbers are used in algorithms related to dynamic programming, recursion, and searching/sorting techniques.
4. **Financial Markets**: Fibonacci retracement levels are used by traders in technical analysis to predict support and resistance levels.

### Example of Fibonacci in JavaScript

You can calculate the Fibonacci sequence using both an iterative and a recursive approach.

#### Iterative Approach

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

console.log(fibonacciIterative(6)); // Outputs 8
console.log(fibonacciIterative(10)); // Outputs 55
```

#### Recursive Approach

```javascript
function fibonacciRecursive(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

console.log(fibonacciRecursive(6)); // Outputs 8
console.log(fibonacciRecursive(10)); // Outputs 55
```

### Example of Fibonacci in Rust

Similarly, in Rust, you can implement the Fibonacci sequence using both iterative and recursive methods.

#### Iterative Approach

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
    println!("{}", fibonacci_iterative(6));  // Outputs 8
    println!("{}", fibonacci_iterative(10)); // Outputs 55
}
```

#### Recursive Approach

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
    println!("{}", fibonacci_recursive(6));  // Outputs 8
    println!("{}", fibonacci_recursive(10)); // Outputs 55
}
```

### Summary:

The Fibonacci sequence is widely used in mathematics, nature, and computer science, especially for solving problems that require recursion and dynamic programming. Both JavaScript and Rust allow efficient calculation of Fibonacci numbers using iterative or recursive approaches, depending on performance requirements.
