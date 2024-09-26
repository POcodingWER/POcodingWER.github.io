## Hamming Distance?

**Explanation**:  
The Hamming Distance is the number of differing bits between two binary strings. It is used to measure how many bit positions differ between two equal-length binary strings. This concept is commonly applied in error detection, correction, and data transmission.

#### Use Cases:

- **Error Detection and Correction**: Hamming distance is used in detecting and correcting bit errors during data transmission. Using Hamming codes, errors can be corrected if the Hamming distance between two data points is 1 (i.e., only one bit is different).
- **Similarity Measurement**: Hamming distance can be used to measure the difference between two binary vectors, which is useful in applications like image processing or text similarity analysis.

---

### JavaScript Example

```javascript
function hammingDistance(x, y) {
  // XOR the two numbers to find differing bit positions
  let xor = x ^ y;
  let distance = 0;

  // Count the number of 1s in the XOR result to get the Hamming distance
  while (xor > 0) {
    distance += xor & 1; // Increment distance if the last bit is 1
    xor >>= 1; // Shift bits to the right
  }

  return distance;
}

// Example usage
console.log(hammingDistance(3, 1)); // Output: 1 (3: 011, 1: 001, Hamming distance: 1)
```

### Explanation:

- By XORing the two numbers `x` and `y`, we can find the positions where the bits differ.
- Then, by counting the number of 1s in the XOR result, we can calculate the Hamming distance. Each 1 represents a differing bit between the two numbers.

---

### Rust Example

```rust
fn hamming_distance(x: i32, y: i32) -> i32 {
    let mut xor = x ^ y;
    let mut distance = 0;

    while xor > 0 {
        distance += xor & 1;  // Increment distance if the last bit is 1
        xor >>= 1;            // Shift bits to the right
    }

    distance
}

fn main() {
    let x = 3;
    let y = 1;
    println!("{}", hamming_distance(x, y));  // Output: 1 (3: 011, 1: 001, Hamming distance: 1)
}
```

### Explanation:

- In Rust, similar to JavaScript, XOR is used to find the differing bit positions between two numbers.
- We use `xor & 1` to check if the last bit is 1, which indicates a differing bit, and increment the Hamming distance accordingly. We then shift the `xor` value to the right to check the next bit.

---

### Summary:

The Hamming Distance measures the number of differing bits between two binary values. It is primarily used in error detection and correction and plays a vital role in similarity measurement. By applying XOR between two values, we can find their differing bits and calculate the Hamming distance.
