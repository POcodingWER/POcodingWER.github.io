## the Unique Paths Problem

The **Unique Paths** problem involves calculating the number of distinct paths a robot can take to move from the top-left corner to the bottom-right corner of a 2D grid. The robot can only move either to the right or downward at any point in time. Given a grid of size `m x n`, the goal is to find how many unique ways the robot can reach the destination.

For example, on a `3 x 2` grid, the robot can reach the destination via 3 distinct paths.

### Use Cases:

- **Robot path planning**: This problem can be used to plan or optimize the movement of robots.
- **Combinatorial optimization**: It can be used in dynamic programming to optimize and compute possible paths.
- **Game development**: It can be applied to design character or object movements along specific paths in games.

---

### JavaScript Example Code

```javascript
function uniquePaths(m, n) {
  const dp = Array(m)
    .fill()
    .map(() => Array(n).fill(1));

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}

// Test cases
console.log(uniquePaths(3, 2)); // 3
console.log(uniquePaths(7, 3)); // 28
```

This JavaScript code uses dynamic programming (DP) to calculate the number of ways to reach each cell in the grid. `dp[i][j]` represents the number of paths to reach the `(i, j)` cell. Since the robot can only move from above or from the left, the value of each cell is updated as the sum of the number of paths from these two directions.

---

### Rust Example Code

```rust
fn unique_paths(m: i32, n: i32) -> i32 {
    let m = m as usize;
    let n = n as usize;
    let mut dp = vec![vec![1; n]; m];

    for i in 1..m {
        for j in 1..n {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }

    dp[m - 1][n - 1]
}

fn main() {
    println!("{}", unique_paths(3, 2)); // 3
    println!("{}", unique_paths(7, 3)); // 28
}
```

This Rust code also uses dynamic programming to solve the problem. The `dp` array stores the number of paths to reach each cell, and the values are updated by summing the number of paths from the left and top.

---

### Use Cases:

- **Pathfinding problems**: Used to optimize the movement of robots or objects across grids.
- **Shortest path calculation**: Helps compute the number of possible paths in complex problems, aiding in finding the optimal path.
