## Z Algorithm Explanation?

The **Z Algorithm** is an efficient string searching algorithm used to find a pattern within a text or calculate matching prefixes quickly. It works by constructing a `Z array`, which stores the length of the longest substring starting from each position in the string that matches the prefix of the string.

#### **What is the Z Array?**

- The Z array contains the length of the longest substring starting from each index that matches the prefix of the original string.
- For example, for the string `S = "abcababc"`, the Z array would be `[8, 0, 0, 2, 0, 0, 3, 0]`. The first index is 8 because the whole string matches itself, and at the fourth index, the substring matches the prefix `abc` with length 2.

#### **Use Cases**:

- **String Search**: Used to find short patterns within large texts efficiently. Unlike the KMP algorithm, the Z algorithm processes the pattern and text in one combined string.
- **Bioinformatics**: Used to search for specific patterns within DNA sequences.
- **Search Engines**: Helps find documents containing certain patterns or keywords.

---

### **JavaScript Example Code: Z Algorithm**

```javascript
function buildZArray(s) {
  const n = s.length;
  const Z = Array(n).fill(0);
  let l = 0,
    r = 0,
    k;

  for (let i = 1; i < n; i++) {
    if (i > r) {
      l = r = i;
      while (r < n && s[r] === s[r - l]) {
        r++;
      }
      Z[i] = r - l;
      r--;
    } else {
      k = i - l;
      if (Z[k] < r - i + 1) {
        Z[i] = Z[k];
      } else {
        l = i;
        while (r < n && s[r] === s[r - l]) {
          r++;
        }
        Z[i] = r - l;
        r--;
      }
    }
  }

  return Z;
}

function zSearch(text, pattern) {
  const concat = pattern + "$" + text;
  const Z = buildZArray(concat);
  const m = pattern.length;

  for (let i = 0; i < Z.length; i++) {
    if (Z[i] === m) {
      console.log("Pattern found at index", i - m - 1);
    }
  }
}

// Example Usage
const text = "abcabcababcabc";
const pattern = "abc";
zSearch(text, pattern); // Output: Pattern found at index 0, 3, 6, 9
```

### **Explanation**:

1. **Building the Z Array**: The Z array is calculated for the combined string of pattern and text. It calculates how much of the substring starting from each index matches the prefix.
2. **Pattern Search**: The concatenated string is processed, and wherever the Z array matches the length of the pattern, a match is found in the original text.

---

### **Rust Example Code: Z Algorithm**

```rust
fn build_z_array(s: &str) -> Vec<usize> {
    let n = s.len();
    let mut z = vec![0; n];
    let s_bytes = s.as_bytes();
    let (mut l, mut r, mut k);

    for i in 1..n {
        if i > r {
            l = i;
            r = i;
            while r < n && s_bytes[r] == s_bytes[r - l] {
                r += 1;
            }
            z[i] = r - l;
            r -= 1;
        } else {
            k = i - l;
            if z[k] < r - i + 1 {
                z[i] = z[k];
            } else {
                l = i;
                while r < n && s_bytes[r] == s_bytes[r - l] {
                    r += 1;
                }
                z[i] = r - l;
                r -= 1;
            }
        }
    }

    z
}

fn z_search(text: &str, pattern: &str) {
    let concat = format!("{}${}", pattern, text);
    let z = build_z_array(&concat);
    let m = pattern.len();

    for i in 0..z.len() {
        if z[i] == m {
            println!("Pattern found at index {}", i - m - 1);
        }
    }
}

fn main() {
    let text = "abcabcababcabc";
    let pattern = "abc";
    z_search(text, pattern); // Output: Pattern found at index 0, 3, 6, 9
}
```

### **Explanation**:

1. **Building the Z Array**: In Rust, we convert the string to a byte array and calculate the Z array based on the prefix match of each substring.
2. **Pattern Search**: The concatenated string (pattern + text) is used to search for the pattern in the text by finding matches in the Z array.

---

### **Summary**:

The **Z algorithm** is a highly efficient algorithm used to search for patterns within a text by leveraging the Z array. This method is useful in a variety of fields, such as search engines, DNA sequence matching, and text processing, where pattern recognition is critical.
