## Bit Manipulation?

**Bit Manipulation** involves the direct manipulation of bits within binary data. This technique allows you to perform operations like setting, clearing, toggling, and checking specific bits of a number, typically using bitwise operators.

### Common Bitwise Operators:

- `AND (&)`: Used to clear bits or to check if both corresponding bits of two operands are 1.
- `OR (|)`: Used to set bits (if either operand bit is 1, the result is 1).
- `XOR (^)`: Used to toggle bits (if bits are different, the result is 1).
- `NOT (~)`: Used to invert all bits (0 becomes 1, 1 becomes 0).
- `Left Shift (<<)`: Shifts bits to the left, adding zeros to the right.
- `Right Shift (>>)`: Shifts bits to the right, discarding bits on the right.

### Common Use Cases for Bit Manipulation:

1. **Performance optimization**: Bitwise operations are faster and require less memory.
2. **Flags and Bitmasking**: Often used for storing multiple Boolean values efficiently.
3. **Encryption**: Bit manipulation is a core part of cryptographic algorithms.
4. **Low-level programming**: Useful when interacting directly with hardware, file formats, or network protocols.

### Example of Bit Manipulation in JavaScript

```javascript
// Check if a number is odd or even using the AND operator
function isEven(num) {
  return (num & 1) === 0;
}

console.log(isEven(4)); // true
console.log(isEven(7)); // false

// Toggle a specific bit (e.g., toggle the 2nd bit)
function toggleBit(num, position) {
  return num ^ (1 << position);
}

let number = 5; // 0101 in binary
console.log(toggleBit(number, 1)); // Outputs 7 (0111 in binary)
```

### Example of Bit Manipulation in Rust

```rust
// Check if a number is odd or even using the AND operator
fn is_even(num: u32) -> bool {
    (num & 1) == 0
}

fn main() {
    println!("{}", is_even(4)); // true
    println!("{}", is_even(7)); // false

    // Toggle a specific bit (e.g., toggle the 2nd bit)
    let number: u32 = 5; // 0101 in binary
    let toggled = number ^ (1 << 1);
    println!("{}", toggled); // Outputs 7 (0111 in binary)
}
```

### Summary:

Bit manipulation is widely used for efficient memory usage and fast computation, especially in system-level programming and performance-critical applications. Both JavaScript and Rust provide bitwise operators, allowing you to handle low-level binary operations directly.
