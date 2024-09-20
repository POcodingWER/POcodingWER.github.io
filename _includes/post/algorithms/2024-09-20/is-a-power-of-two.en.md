### What is "Power of Two"?

A number is called a **power of two** if it can be written as $2^n$ where $n$ is a non-negative integer. For example:

- $2^0 = 1$
- $2^1 = 2$
- $2^2 = 4$
- $2^3 = 8$
- $2^4 = 16$, and so on.

In binary form, a power of two has only one bit set to 1. For example:

- 1 in binary is `0001`
- 2 in binary is `0010`
- 4 in binary is `0100`
- 8 in binary is `1000`

### Use Cases of Checking Power of Two

1. **Memory Allocation**: Powers of two are often used in computing for allocating memory (e.g., 2KB, 4KB, 8KB).
2. **Hashing**: Hash table sizes are often set as powers of two to simplify modulo operations.
3. **Bit Manipulation**: Powers of two play a significant role in bitwise operations for optimizations.
4. **Data Structures**: In certain algorithms like heap-based data structures (like binary heaps), power of two sizes can simplify operations.
5. **Graphics and Video**: Power of two sizes are often required for textures in computer graphics.

### How to Check if a Number is a Power of Two?

There are multiple ways to check if a number is a power of two. The most efficient method involves bitwise manipulation.

#### Explanation of Bitwise Check:

For a number $n$, if $n$ is a power of two, then $n$ has exactly one bit set to 1 in its binary form. So, the expression `n & (n - 1)` will be zero if $n$ is a power of two, because subtracting 1 from $n$ flips all bits after the least significant 1 bit.

For example:

- $n = 8$ ($1000_2$), $n - 1 = 7$ ($0111_2$), and $n & (n - 1) = 0$
- $n = 6$ ($0110_2$), $n - 1 = 5$ ($0101_2$), and $n & (n - 1) \neq 0$

### JavaScript Example for Checking Power of Two

```javascript
function isPowerOfTwo(n) {
  // Power of two is greater than 0 and has only one bit set.
  return n > 0 && (n & (n - 1)) === 0;
}

console.log(isPowerOfTwo(1)); // true (2^0)
console.log(isPowerOfTwo(2)); // true (2^1)
console.log(isPowerOfTwo(3)); // false
console.log(isPowerOfTwo(4)); // true (2^2)
console.log(isPowerOfTwo(5)); // false
```

### Rust Example for Checking Power of Two

```rust
fn is_power_of_two(n: u32) -> bool {
    n > 0 && (n & (n - 1)) == 0
}

fn main() {
    println!("{}", is_power_of_two(1));  // true (2^0)
    println!("{}", is_power_of_two(2));  // true (2^1)
    println!("{}", is_power_of_two(3));  // false
    println!("{}", is_power_of_two(4));  // true (2^2)
    println!("{}", is_power_of_two(5));  // false
}
```

### Summary:

A **power of two** is any number that can be written as $2^n$ for some non-negative integer $n$. Checking if a number is a power of two is commonly used in memory management, hashing, and bit manipulation. The most efficient way to check this involves using bitwise operations. Both JavaScript and Rust offer simple implementations to verify if a number is a power of two using the expression `n & (n - 1) == 0`.
