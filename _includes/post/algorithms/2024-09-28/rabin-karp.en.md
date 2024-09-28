## Rabin-Karp Algorithm?

The **Rabin-Karp algorithm** is an efficient, hash-based string searching algorithm used to find specific patterns within a string. The key idea behind the algorithm is to calculate and compare the **hash values** of the text and the pattern to efficiently locate the desired pattern.

#### **How it works**:

1. Compute the hash values of the pattern and the first part of the text.
2. Slide over the text one character at a time, updating the hash value for the next part of the text and comparing it with the pattern’s hash.
3. If the hash values match, perform an actual string comparison to confirm the pattern.
4. Handle potential hash collisions by verifying the actual characters when a hash match is found.

#### **Use Cases**:

- **String Searching**: Efficiently find short patterns in large texts.
- **Plagiarism Detection**: Quickly compare documents to check for similarities by hashing content.
- **DNA Sequence Analysis**: Used to identify specific patterns in gene sequences.

---

### **JavaScript Example: Rabin-Karp Algorithm**

```javascript
function rabinKarp(text, pattern) {
  const d = 256; // Number of characters in the input alphabet
  const q = 101; // A prime number to reduce hash collisions
  const m = pattern.length;
  const n = text.length;
  let p = 0; // Hash value for the pattern
  let t = 0; // Hash value for text
  let h = 1;

  // Calculate the value of h = pow(d, m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  // Calculate the initial hash values for the pattern and the first window of the text
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  // Slide the pattern over the text
  for (let i = 0; i <= n - m; i++) {
    // If hash values match, check the actual characters
    if (p === t) {
      let j = 0;
      for (j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          break;
        }
      }
      if (j === m) {
        console.log(`Pattern found at index ${i}`);
      }
    }

    // Calculate hash for next window
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) {
        t = t + q;
      }
    }
  }
}

// Usage example
const text = "GEEKS FOR GEEKS";
const pattern = "GEEK";
rabinKarp(text, pattern); // Output: Pattern found at index 0, 10
```

### **Explanation**:

- The `rabinKarp` function scans the text and searches for the pattern by computing hash values and comparing them.
- If hash values match, an actual string comparison is done to verify that the pattern exists at that position.

---

### **Rust Example: Rabin-Karp Algorithm**

```rust
fn rabin_karp(text: &str, pattern: &str) {
    let d: i32 = 256;
    let q: i32 = 101;
    let m = pattern.len();
    let n = text.len();
    let mut p: i32 = 0; // Hash value for pattern
    let mut t: i32 = 0; // Hash value for text
    let mut h: i32 = 1;

    // Calculate h = pow(d, m-1) % q
    for _ in 0..(m-1) {
        h = (h * d) % q;
    }

    // Calculate the initial hash values for the pattern and the first window of the text
    for i in 0..m {
        p = (d * p + pattern.as_bytes()[i] as i32) % q;
        t = (d * t + text.as_bytes()[i] as i32) % q;
    }

    // Slide the pattern over the text
    for i in 0..=(n - m) {
        // If hash values match, compare the actual strings
        if p == t {
            if &text[i..i+m] == pattern {
                println!("Pattern found at index {}", i);
            }
        }

        // Calculate the hash value for the next window
        if i < n - m {
            t = (d * (t - (text.as_bytes()[i] as i32 * h)) + text.as_bytes()[i + m] as i32) % q;
            if t < 0 {
                t = t + q;
            }
        }
    }
}

fn main() {
    let text = "GEEKS FOR GEEKS";
    let pattern = "GEEK";
    rabin_karp(text, pattern); // Output: Pattern found at index 0, 10
}
```

### **Explanation**:

- **Rust code** follows the same logic as the JavaScript code, computing the hash values of both the pattern and the text.
- When a hash match occurs, it performs a direct string comparison to confirm the pattern match.

---

### **Summary**:

The **Rabin-Karp algorithm** is an efficient method for searching for a pattern in a text using hash functions. It is particularly useful in scenarios where you need to search for multiple patterns or detect patterns in large bodies of text.
