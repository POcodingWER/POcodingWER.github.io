## Combination Sum Problem?

**Description**:  
The Combination Sum problem involves finding all possible combinations of numbers from a given array that sum up to a specific target. Each number can be used multiple times, and the order of the numbers does not matter. The problem is commonly solved using the backtracking approach.

#### Use Cases:

- **Coin Change Problem**: Finding all possible ways to make a specific amount using a set of coin denominations.
- **Mathematical Problem Solving**: Used to find different combinations of operations or values that sum to a target in mathematical or computational problems.

---

### JavaScript Example

```javascript
function combinationSum(candidates, target) {
  const result = [];

  function backtrack(remaining, start, path) {
    if (remaining === 0) {
      result.push([...path]); // When remaining becomes 0, add the combination to the result
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] <= remaining) {
        path.push(candidates[i]); // Choose the candidate
        backtrack(remaining - candidates[i], i, path); // Recur with reduced target
        path.pop(); // Backtrack, remove last choice
      }
    }
  }

  backtrack(target, 0, []);
  return result;
}

// Example usage
const candidates = [2, 3, 6, 7];
const target = 7;
console.log(combinationSum(candidates, target));
// Output: [[2, 2, 3], [7]]
```

### Explanation:

- The `backtrack` function tracks the remaining target and finds possible number combinations.
- If the remaining target becomes zero, it means the current combination is valid, so it gets added to the result array.
- The loop selects each candidate and recursively tries to build combinations using the same number multiple times.

---

### Rust Example

```rust
fn combination_sum(candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> {
    fn backtrack(
        result: &mut Vec<Vec<i32>>,
        candidates: &Vec<i32>,
        target: i32,
        mut path: Vec<i32>,
        start: usize,
    ) {
        if target == 0 {
            result.push(path.clone()); // If target is zero, save the combination
            return;
        }

        for i in start..candidates.len() {
            if candidates[i] <= target {
                path.push(candidates[i]); // Choose the current candidate
                backtrack(result, candidates, target - candidates[i], path.clone(), i); // Recur with reduced target
                path.pop(); // Backtrack
            }
        }
    }

    let mut result = Vec::new();
    backtrack(&mut result, &candidates, target, Vec::new(), 0);
    result
}

fn main() {
    let candidates = vec![2, 3, 6, 7];
    let target = 7;
    let result = combination_sum(candidates, target);
    println!("{:?}", result); // Output: [[2, 2, 3], [7]]
}
```

### Explanation:

- In Rust, the `backtrack` function is recursively called, reducing the target and finding valid combinations.
- The `path` vector tracks the current combination, and when the target reaches zero, the combination is added to the result.
- Rust uses the `Vec` data structure to dynamically store and manage the results.

---

### Summary:

The Combination Sum problem involves finding all possible combinations of numbers that sum up to a given target. Using backtracking, all possible combinations are explored. This problem has real-world applications such as coin change, finding combinations to meet a certain value, and other optimization problems.
