## Unique Paths 문제 설명

**Unique Paths** 문제는 로봇이 2D 격자판의 왼쪽 상단에서 오른쪽 하단까지 이동하는 경로의 수를 구하는 문제입니다. 로봇은 오직 오른쪽 또는 아래로만 이동할 수 있습니다. 주어진 격자판의 크기가 `m x n`일 때, 로봇이 목적지에 도달하는 모든 가능한 경로의 수를 찾는 것이 목표입니다.

예를 들어, `3 x 2` 크기의 격자판에서, 로봇은 3개의 서로 다른 경로를 통해 목적지에 도달할 수 있습니다.

### 사용 사례:

- **로봇 경로 탐색**: 로봇의 움직임을 계획하거나 최적화할 때 사용될 수 있습니다.
- **조합 최적화 문제**: 동적 프로그래밍을 이용하여 가능한 경로를 최적화하는 데 활용할 수 있습니다.
- **게임 개발**: 캐릭터나 오브젝트가 특정 경로를 따라 이동해야 하는 게임의 설계에 적용할 수 있습니다.

---

### JavaScript 예제 코드

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

// 테스트 케이스
console.log(uniquePaths(3, 2)); // 3
console.log(uniquePaths(7, 3)); // 28
```

이 JavaScript 코드는 동적 프로그래밍(DP)을 사용하여 격자판의 각 셀에 도달하는 경로의 수를 계산합니다. `dp[i][j]`는 `(i, j)` 셀에 도달하는 경로의 수를 나타냅니다. 로봇은 오직 위쪽과 왼쪽에서만 올 수 있으므로, 두 경로의 합으로 현재 셀의 값을 업데이트합니다.

---

### Rust 예제 코드

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

이 Rust 코드 또한 동적 프로그래밍을 사용하여 문제를 해결합니다. `dp` 배열은 각 셀에 도달하는 경로의 수를 저장하며, 왼쪽 또는 위쪽에서 오는 경로를 더하여 값을 업데이트합니다.

---

### 사용 사례:

- **경로 탐색 문제**: 로봇이나 물체가 격자판을 통해 이동하는 경로를 최적화할 때 사용됩니다.
- **최단 경로 계산**: 경로의 수를 통해 복잡한 문제에서 가능한 선택지들을 계산하고 최적의 경로를 찾는 데 활용됩니다.
