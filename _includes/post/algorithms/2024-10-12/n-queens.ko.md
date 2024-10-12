## N-Queens 문제

N-Queens 문제는 N × N 크기의 체스판 위에 N개의 퀸을 배치하는 문제입니다. 여기서 퀸은 같은 행, 같은 열, 또는 대각선 상에 다른 퀸이 있을 수 없습니다. 목표는 체스판 위에 모든 퀸이 서로 공격하지 않도록 배치하는 것입니다.

이 문제는 **백트래킹(Backtracking)** 알고리즘을 통해 해결할 수 있습니다. 퀸을 하나씩 배치하고, 현재 배치가 유효하지 않으면 다시 이전 단계로 돌아가서 다른 배치를 시도하는 방식으로 풀립니다.

#### 활용 사례:

- **조합 최적화 문제**: 다양한 문제에서 최적의 조합을 찾는 데 사용됩니다.
- **알고리즘 교육**: 백트래킹 기법을 익히기 위한 중요한 문제 중 하나입니다.
- **게임 인공지능**: 체스 등의 게임에서 적절한 움직임을 계획하는 데 사용할 수 있습니다.

---

### JavaScript 예제 코드

```javascript
function solveNQueens(n) {
  let solutions = [];
  let board = Array.from({ length: n }, () => Array(n).fill("."));

  function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === "Q") return false;
      if (col - (row - i) >= 0 && board[i][col - (row - i)] === "Q")
        return false;
      if (col + (row - i) < n && board[i][col + (row - i)] === "Q")
        return false;
    }
    return true;
  }

  function placeQueens(row) {
    if (row === n) {
      solutions.push(board.map((r) => r.join("")));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = "Q";
        placeQueens(row + 1);
        board[row][col] = ".";
      }
    }
  }

  placeQueens(0);
  return solutions;
}

// Test
console.log(solveNQueens(4));
```

이 JavaScript 코드는 백트래킹을 사용하여 N-Queens 문제를 해결합니다. `isSafe` 함수는 현재 위치에 퀸을 놓을 수 있는지 확인하고, `placeQueens` 함수는 모든 퀸을 배치할 때까지 재귀적으로 호출됩니다.

---

### Rust 예제 코드

```rust
fn is_safe(board: &Vec<Vec<char>>, row: usize, col: usize, n: usize) -> bool {
    for i in 0..row {
        if board[i][col] == 'Q' ||
           (col >= row - i && board[i][col - (row - i)] == 'Q') ||
           (col + row - i < n && board[i][col + (row - i)] == 'Q') {
            return false;
        }
    }
    true
}

fn solve_nqueens(n: usize) -> Vec<Vec<String>> {
    let mut solutions = Vec::new();
    let mut board = vec![vec!['.'; n]; n];

    fn place_queens(board: &mut Vec<Vec<char>>, row: usize, n: usize, solutions: &mut Vec<Vec<String>>) {
        if row == n {
            solutions.push(board.iter().map(|r| r.iter().collect()).collect());
            return;
        }
        for col in 0..n {
            if is_safe(board, row, col, n) {
                board[row][col] = 'Q';
                place_queens(board, row + 1, n, solutions);
                board[row][col] = '.';
            }
        }
    }

    place_queens(&mut board, 0, n, &mut solutions);
    solutions
}

fn main() {
    let solutions = solve_nqueens(4);
    for solution in solutions {
        for row in solution {
            println!("{}", row);
        }
        println!();
    }
}
```

이 Rust 코드는 JavaScript 코드와 동일한 로직을 따르며, N-Queens 문제를 해결합니다. `is_safe` 함수는 퀸을 놓을 수 있는지 확인하고, `place_queens` 함수는 백트래킹을 통해 모든 퀸을 배치합니다.

---

### 활용 사례:

- **조합 최적화 및 문제 해결**: 최적의 조합을 찾아야 하는 다양한 문제들에서 응용할 수 있습니다.
- **게임 개발**: 인공지능을 개발할 때 퀸이나 말과 같은 캐릭터의 경로를 계산하는 데 사용할 수 있습니다.
