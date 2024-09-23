## Shortest Common Supersequence (SCS)?

The **Shortest Common Supersequence (SCS)** is a problem in computer science where given two sequences, the task is to find the shortest sequence that contains both of them as subsequences. This sequence should include all the characters from both input sequences in the same relative order as in the original sequences.

#### Problem Definition:

Given two strings `X` and `Y`, the goal is to find the length and/or the actual string of the shortest sequence `S` such that both `X` and `Y` are subsequences of `S`.

### Example:

- Input: `X = "abac"`, `Y = "cab"`
- Output: Length of SCS: `5`, and one possible SCS string: `"cabac"`.

### Key Points:

1. The **supersequence** contains both input strings as subsequences.
2. The order of characters from both strings must be preserved.
3. If the two strings have common characters, those common characters appear only once in the result to minimize the length.

### Relationship with Longest Common Subsequence (LCS):

The length of the **Shortest Common Supersequence** can be derived from the length of the **Longest Common Subsequence (LCS)**. The formula is:
$ \text{Length of SCS} = \text{Length of X} + \text{Length of Y} - \text{Length of LCS}(X, Y) $

### Approach:

1. **Dynamic Programming**: To solve the problem efficiently, we can use dynamic programming to first calculate the LCS of the two strings and then use it to find the SCS.
2. **Recursive Solution**: Using a recursive approach to explore all possible supersequences and finding the shortest.

---

### Example in JavaScript

Here’s a JavaScript example to find the **length** of the Shortest Common Supersequence:

```javascript
function shortestCommonSupersequence(X, Y) {
  let m = X.length,
    n = Y.length;

  // Create a DP table for storing the LCS lengths
  let dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Fill the DP table using the LCS approach
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (X[i - 1] === Y[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Length of SCS
  return m + n - dp[m][n];
}

// Example usage:
let X = "abac";
let Y = "cab";
console.log(shortestCommonSupersequence(X, Y)); // Output: 5
```

### Explanation of the JavaScript Code:

1. We create a `dp` table to calculate the **Longest Common Subsequence (LCS)** length between `X` and `Y`.
2. Once we have the LCS length, we calculate the length of the **Shortest Common Supersequence** using the formula:
   $ \text{Length of SCS} = m + n - \text{LCS Length} $
   where `m` is the length of `X` and `n` is the length of `Y`.

---

### Example in Rust

Here’s how you can compute the **length** of the Shortest Common Supersequence in Rust:

```rust
fn shortest_common_supersequence(X: &str, Y: &str) -> usize {
    let m = X.len();
    let n = Y.len();

    // Create a DP table for storing LCS lengths
    let mut dp = vec![vec![0; n + 1]; m + 1];

    let X_chars: Vec<char> = X.chars().collect();
    let Y_chars: Vec<char> = Y.chars().collect();

    // Fill the DP table using LCS approach
    for i in 1..=m {
        for j in 1..=n {
            if X_chars[i - 1] == Y_chars[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j].max(dp[i][j - 1]);
            }
        }
    }

    // Length of SCS
    m + n - dp[m][n]
}

fn main() {
    let X = "abac";
    let Y = "cab";
    println!("{}", shortest_common_supersequence(X, Y));  // Output: 5
}
```

### Explanation of the Rust Code:

1. The dynamic programming approach is used to calculate the **Longest Common Subsequence (LCS)** between `X` and `Y`.
2. The length of the **Shortest Common Supersequence** is computed as `m + n - LCS_length`.

---

### Use Case of SCS:

- **Merging two versions** of a document, source code, or text where the order of operations needs to be maintained.
- **Gene sequence alignment** in bioinformatics, where two sequences of nucleotides are compared.
- **File system operations**, where changes from two different sources are merged while keeping the original sequence of operations.
