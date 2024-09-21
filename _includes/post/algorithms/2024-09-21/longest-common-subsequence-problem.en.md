## Longest Common Subsequence Problem?

The **Longest Common Subsequence (LCS)** problem involves finding the longest subsequence that appears in the same order in two sequences but not necessarily consecutively. A subsequence is a sequence derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

For example, given two sequences:

- Sequence 1: "ABCBDAB"
- Sequence 2: "BDCAB"

The LCS is "BCAB" with a length of 4.

### Use Cases of the Longest Common Subsequence

1. **Bioinformatics**: Used to compare DNA, RNA, or protein sequences.
2. **Text Comparison**: Useful in version control systems to identify changes between files.
3. **Data Comparison**: Can be applied in merging datasets or comparing data structures.
4. **Natural Language Processing**: Helpful in identifying similarities in text data.
5. **File Comparison Tools**: Utilized in applications like diff tools to find differences between files.

### JavaScript Example for Longest Common Subsequence

Here’s a JavaScript implementation of the LCS problem using dynamic programming:

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Example usage
const text1 = "ABCBDAB";
const text2 = "BDCAB";
console.log(longestCommonSubsequence(text1, text2)); // Output: 4
```

**Explanation**:

- A 2D array `dp` is created to store the lengths of LCS for different substrings. The algorithm iterates through both strings, updating the `dp` table based on whether characters match or not.

### Rust Example for Longest Common Subsequence

Here’s how you can implement the LCS problem in Rust:

```rust
fn longest_common_subsequence(text1: &str, text2: &str) -> usize {
    let m = text1.len();
    let n = text2.len();
    let mut dp = vec![vec![0; n + 1]; m + 1];

    for i in 1..=m {
        for j in 1..=n {
            if text1.chars().nth(i - 1) == text2.chars().nth(j - 1) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j].max(dp[i][j - 1]);
            }
        }
    }

    dp[m][n]
}

fn main() {
    let text1 = "ABCBDAB";
    let text2 = "BDCAB";
    println!("{}", longest_common_subsequence(text1, text2)); // Output: 4
}
```

**Explanation**:

- Similar to the JavaScript implementation, a 2D vector `dp` is used to store the lengths of LCS. The function iterates through both strings, updating the `dp` table accordingly.

### Summary

The **Longest Common Subsequence** problem is essential in various fields such as bioinformatics, text comparison, data analysis, and natural language processing. Both JavaScript and Rust implementations utilize dynamic programming to efficiently compute the length of the LCS between two sequences.
