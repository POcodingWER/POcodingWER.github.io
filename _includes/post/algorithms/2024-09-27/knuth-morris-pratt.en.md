## Explanation of the Knuth–Morris–Pratt (KMP)?

The **KMP algorithm** is a string searching algorithm that efficiently finds whether a pattern exists within a given text and, if so, where it occurs. The algorithm works by precomputing information about the pattern to avoid unnecessary comparisons, leveraging a data structure called the "prefix table."

#### **Key Concepts**:

1. **Prefix Table (Pi Table)**: The Pi table stores information about the longest proper prefix which is also a suffix in the pattern. This allows the algorithm to skip re-examining parts of the text and pattern that have already been matched.
2. **Time Complexity**: For a pattern of length `m` and a text of length `n`, the time complexity of KMP is **O(n + m)**. This is significantly faster than the brute-force O(n \* m) approach.

#### **Use Cases**:

- **Document Search**: Finding specific words or patterns within a large text document.
- **Bioinformatics**: Searching for patterns within DNA sequences.
- **Search Engines**: Locating documents that contain specific keywords or phrases.

---

### **JavaScript Example Code: KMP Algorithm**

```javascript
function buildPiTable(pattern) {
  const m = pattern.length;
  const pi = Array(m).fill(0);
  let j = 0;

  for (let i = 1; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) {
      j = pi[j - 1];
    }
    if (pattern[i] === pattern[j]) {
      j++;
    }
    pi[i] = j;
  }

  return pi;
}

function kmpSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const pi = buildPiTable(pattern);
  let j = 0;

  for (let i = 0; i < n; i++) {
    while (j > 0 && text[i] !== pattern[j]) {
      j = pi[j - 1];
    }
    if (text[i] === pattern[j]) {
      j++;
    }
    if (j === m) {
      console.log("Pattern found at index", i - m + 1);
      j = pi[j - 1];
    }
  }
}

// Example Usage
const text = "ABC ABCDAB ABCDABCDABDE";
const pattern = "ABCDABD";
kmpSearch(text, pattern); // Output: Pattern found at index 15
```

### **Explanation**:

1. **Pi Table**: It records the match information of the prefix and suffix of the pattern to optimize the search.
2. **KMP Search Function**: It compares the text and pattern, and when the pattern matches the text, the index where the match occurs is printed.

---

### **Rust Example Code: KMP Algorithm**

```rust
fn build_pi_table(pattern: &str) -> Vec<usize> {
    let m = pattern.len();
    let mut pi = vec![0; m];
    let mut j = 0;

    for i in 1..m {
        while j > 0 && pattern.as_bytes()[i] != pattern.as_bytes()[j] {
            j = pi[j - 1];
        }
        if pattern.as_bytes()[i] == pattern.as_bytes()[j] {
            j += 1;
        }
        pi[i] = j;
    }

    pi
}

fn kmp_search(text: &str, pattern: &str) {
    let n = text.len();
    let m = pattern.len();
    let pi = build_pi_table(pattern);
    let mut j = 0;

    for i in 0..n {
        while j > 0 && text.as_bytes()[i] != pattern.as_bytes()[j] {
            j = pi[j - 1];
        }
        if text.as_bytes()[i] == pattern.as_bytes()[j] {
            j += 1;
        }
        if j == m {
            println!("Pattern found at index {}", i - m + 1);
            j = pi[j - 1];
        }
    }
}

fn main() {
    let text = "ABC ABCDAB ABCDABCDABDE";
    let pattern = "ABCDABD";
    kmp_search(text, pattern);  // Output: Pattern found at index 15
}
```

### **Explanation**:

1. **Pi Table Creation**: In Rust, the `as_bytes()` function is used to convert the string into a byte array for comparison.
2. **KMP Search Function**: Using the Pi table, the function efficiently searches for the pattern in the text, outputting the index when a match is found.

---

### **Summary**:

The **KMP algorithm** is an efficient solution for pattern matching, used in various fields such as text comparison, DNA sequence search, and search engines. By using the prefix table (Pi table), it avoids redundant comparisons and improves performance, making it a key tool in scenarios requiring fast pattern detection.
