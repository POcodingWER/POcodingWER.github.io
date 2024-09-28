## Longest Common Substring?

The **Longest Common Substring (LCS)** problem involves finding the longest common substring between two given strings. A **substring** is a contiguous sequence of characters within a string, meaning characters must appear consecutively without gaps.

#### **Use Cases**:

- **Genomic sequence comparison**: It is used to find common sequences in DNA or RNA between different organisms.
- **Document comparison**: Helpful in detecting the longest shared phrases between two documents.
- **Data deduplication**: Used to efficiently find duplicated data in large datasets.

---

### **JavaScript Example Code**

```javascript
function longestCommonSubstring(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  let maxLen = 0;
  let endIndex = 0;

  // Initialize DP table
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > maxLen) {
          maxLen = dp[i][j];
          endIndex = i - 1;
        }
      }
    }
  }

  // Return the longest common substring
  return str1.substring(endIndex - maxLen + 1, endIndex + 1);
}

// Usage example
const str1 = "ABABC";
const str2 = "BABC";
console.log(longestCommonSubstring(str1, str2)); // Output: "BABC"
```

#### **Explanation**:

- This code uses Dynamic Programming (DP) to find the longest common substring between two strings.
- `dp[i][j]` holds the length of the longest common substring between `str1[0..i-1]` and `str2[0..j-1]`.
- After computing the DP table, the code returns the substring that corresponds to the longest common substring.

---

### **Rust Example Code**

```rust
fn longest_common_substring(str1: &str, str2: &str) -> String {
    let m = str1.len();
    let n = str2.len();
    let mut max_len = 0;
    let mut end_index = 0;

    // Initialize DP table
    let mut dp = vec![vec![0; n + 1]; m + 1];
    let str1_bytes = str1.as_bytes();
    let str2_bytes = str2.as_bytes();

    for i in 1..=m {
        for j in 1..=n {
            if str1_bytes[i - 1] == str2_bytes[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if dp[i][j] > max_len {
                    max_len = dp[i][j];
                    end_index = i;
                }
            }
        }
    }

    // Return the longest common substring
    str1[(end_index - max_len)..end_index].to_string()
}

fn main() {
    let str1 = "ABABC";
    let str2 = "BABC";
    let result = longest_common_substring(str1, str2);
    println!("{}", result); // Output: "BABC"
}
```

#### **Explanation**:

- The **Rust implementation** follows the same logic as the JavaScript version using Dynamic Programming to find the longest common substring.
- `dp[i][j]` stores the length of the longest common substring at position `i` in `str1` and `j` in `str2`, and the code returns the longest common substring by using this table.

---

### **Summary**:

The Longest Common Substring problem is about finding the longest contiguous sequence of characters shared between two strings. It can be efficiently solved using Dynamic Programming. This algorithm is widely used in fields like genomic analysis, document comparison, and data deduplication.
