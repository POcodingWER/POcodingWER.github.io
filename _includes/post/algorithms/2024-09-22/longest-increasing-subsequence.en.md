## Longest Increasing Subsequence (LIS)?

The **Longest Increasing Subsequence (LIS)** is a classic computer science problem. Given a sequence of numbers, the goal is to find the longest subsequence such that all elements in this subsequence are in strictly increasing order.

A **subsequence** is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

For example, in the array `[10, 22, 9, 33, 21, 50, 41, 60, 80]`, the LIS is `[10, 22, 33, 50, 60, 80]` with a length of `6`.

### Problem Explanation:

You are given an array of integers, and you are required to find the length of the longest increasing subsequence.

#### Key Points:

1. The subsequence doesn’t need to be contiguous.
2. The order of the elements must remain the same as in the original sequence.

#### Examples:

- Input: `[3, 10, 2, 1, 20]`
- Output: `3` (The LIS is `[3, 10, 20]`)

### Approach:

The problem can be solved in multiple ways, but the most efficient solution has a time complexity of `O(n log n)`.

#### Steps to Solve:

1. **Dynamic Programming (O(n^2)):** This involves storing the length of the LIS ending at each element and iterating through the array multiple times to update this value.
2. **Binary Search (O(n log n)):** This optimizes the solution using a combination of dynamic programming and binary search.

### Example in JavaScript

```javascript
// Function to find the length of the LIS using O(n log n) approach
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;

  const dp = []; // Will store the increasing subsequence

  for (let num of nums) {
    let left = 0;
    let right = dp.length;

    // Binary search to find the insertion point
    while (left < right) {
      let mid = Math.floor((left + right) / 2);
      if (dp[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // If left equals dp.length, num is larger than any element in dp
    if (left < dp.length) {
      dp[left] = num;
    } else {
      dp.push(num);
    }
  }

  return dp.length;
}

// Example usage:
const arr = [10, 22, 9, 33, 21, 50, 41, 60, 80];
console.log(lengthOfLIS(arr)); // Output: 6
```

### Explanation of the JavaScript Code:

1. We maintain a `dp` array where `dp[i]` will store the smallest element that ends an increasing subsequence of length `i+1`.
2. For each number in the input array, we use binary search to determine where it would fit in the `dp` array.
3. If it fits in an existing subsequence, we update the existing value; otherwise, we append it to the array.
4. The length of the `dp` array at the end is the length of the longest increasing subsequence.

### Example in Rust

```rust
use std::cmp::Ordering;

// Function to find the length of the LIS using O(n log n) approach
fn length_of_lis(nums: Vec<i32>) -> usize {
    let mut dp: Vec<i32> = Vec::new();

    for &num in &nums {
        let pos = dp.binary_search_by(|&x| {
            if x < num {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        }).unwrap_or_else(|x| x);

        if pos < dp.len() {
            dp[pos] = num;
        } else {
            dp.push(num);
        }
    }

    dp.len()
}

fn main() {
    let arr = vec![10, 22, 9, 33, 21, 50, 41, 60, 80];
    println!("{}", length_of_lis(arr));  // Output: 6
}
```

### Explanation of the Rust Code:

1. We use the `binary_search_by` method to perform binary search in the `dp` vector.
2. The result from `binary_search_by` tells us where the current number should be inserted in the `dp` vector.
3. If the number can replace an existing element in `dp`, it does so. Otherwise, it's appended to the end of the vector.
4. The length of the `dp` vector at the end is the length of the longest increasing subsequence.

### Use Case of LIS:

LIS can be used in problems involving sequences or ordering, such as:

- Optimizing tasks that need to be performed in a specific order.
- Finding patterns in time series data.
- Analyzing or sorting stock prices or growth patterns.
- Determining the minimum number of moves to sort an array by repeatedly moving elements.
