## N-Queens Problem

The N-Queens problem involves placing N queens on an N × N chessboard such that no two queens threaten each other. This means no two queens can be placed on the same row, column, or diagonal. The goal is to find all possible ways to place the queens on the board while satisfying these conditions.

This problem is typically solved using **backtracking**. The algorithm places queens one by one and backtracks if the current placement is invalid, trying another configuration until a solution is found.

#### Use cases:

- **Combinatorial optimization problems**: Useful in problems requiring optimal combinations of elements.
- **Algorithm education**: A classical problem to learn backtracking techniques.
- **Game AI**: Can be used in games like chess for planning optimal moves.

---

### JavaScript Example Code

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

This JavaScript code uses backtracking to solve the N-Queens problem. The `isSafe` function checks if the current position is valid for placing a queen, and the `placeQueens` function recursively places queens until all solutions are found.

---

### Rust Example Code

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

This Rust code follows the same logic as the JavaScript example and solves the N-Queens problem using backtracking. The `is_safe` function checks if a queen can be placed, and the `place_queens` function places queens recursively.

---

### Use Cases:

- **Combinatorial optimization**: Applied in problems where optimal arrangements or combinations are needed.
- **Game development**: Used in AI to calculate optimal moves, such as in chess.
