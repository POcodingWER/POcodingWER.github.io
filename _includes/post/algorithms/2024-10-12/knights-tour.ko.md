## Knight's Tour

**Knight's Tour** 문제는 체스판에서 체스의 나이트가 특정한 규칙에 따라 이동하며 모든 체스판의 칸을 정확히 한 번씩 방문하는 경로를 찾는 문제입니다. 나이트는 체스에서 L자 모양으로 이동하는 말로, 두 칸 이동한 후 직각으로 한 칸 이동하는 규칙에 따라 움직입니다.

### 문제의 목적

- 목표는 나이트가 한 번씩만 체스판의 모든 칸을 방문할 수 있는 경로를 찾는 것입니다.
- 이 문제는 **백트래킹(Backtracking)** 또는 **Warnsdorff’s Rule**과 같은 알고리즘을 사용하여 해결됩니다.

### 장점

- **경로 탐색 및 최적화**: 게임이나 경로 최적화 문제에서 활용할 수 있으며, 탐색 알고리즘 학습에 유용합니다.
- **수학적 흥미**: 그래프 이론 및 컴비네이터리얼 문제로 확장될 수 있어 수학적 접근 방식을 훈련할 수 있습니다.

### 단점

- **복잡성**: 큰 체스판에서는 해결하기 위한 계산량이 매우 커질 수 있습니다.
- **백트래킹 의존**: 여러 시도를 해야 하는 백트래킹 방식이 효율적이지 않을 수 있습니다.

---

### JavaScript 예제 코드

```javascript
const N = 8;
let board = Array.from({ length: N }, () => Array(N).fill(-1));

const movesX = [2, 1, -1, -2, -2, -1, 1, 2];
const movesY = [1, 2, 2, 1, -1, -2, -2, -1];

function isSafe(x, y, board) {
  return x >= 0 && x < N && y >= 0 && y < N && board[x][y] === -1;
}

function solveKnightTour(x, y, move, board) {
  if (move === N * N) return true;

  for (let i = 0; i < 8; i++) {
    const nextX = x + movesX[i];
    const nextY = y + movesY[i];

    if (isSafe(nextX, nextY, board)) {
      board[nextX][nextY] = move;
      if (solveKnightTour(nextX, nextY, move + 1, board)) {
        return true;
      } else {
        board[nextX][nextY] = -1; // 백트래킹
      }
    }
  }
  return false;
}

function knightTour() {
  board[0][0] = 0; // 시작 위치
  if (!solveKnightTour(0, 0, 1, board)) {
    console.log("해결할 수 없습니다.");
  } else {
    console.log(board);
  }
}

knightTour();
```

이 코드는 나이트의 투어를 백트래킹 알고리즘을 사용해 해결합니다. `solveKnightTour` 함수는 가능한 경로를 재귀적으로 탐색하고, 불가능하면 백트래킹을 수행합니다.

---

### Rust 예제 코드

```rust
const N: usize = 8;
let mut board = [[-1; N]; N];

let moves_x: [isize; 8] = [2, 1, -1, -2, -2, -1, 1, 2];
let moves_y: [isize; 8] = [1, 2, 2, 1, -1, -2, -2, -1];

fn is_safe(x: isize, y: isize, board: &[[i32; N]; N]) -> bool {
    x >= 0 && x < N as isize && y >= 0 && y < N as isize && board[x as usize][y as usize] == -1
}

fn solve_knight_tour(x: isize, y: isize, move_num: i32, board: &mut [[i32; N]; N]) -> bool {
    if move_num == (N * N) as i32 {
        return true;
    }

    for i in 0..8 {
        let next_x = x + moves_x[i];
        let next_y = y + moves_y[i];

        if is_safe(next_x, next_y, board) {
            board[next_x as usize][next_y as usize] = move_num;
            if solve_knight_tour(next_x, next_y, move_num + 1, board) {
                return true;
            } else {
                board[next_x as usize][next_y as usize] = -1; // 백트래킹
            }
        }
    }
    false
}

fn knight_tour() {
    board[0][0] = 0;
    if !solve_knight_tour(0, 0, 1, &mut board) {
        println!("해결할 수 없습니다.");
    } else {
        for row in board.iter() {
            for cell in row.iter() {
                print!("{:3} ", cell);
            }
            println!();
        }
    }
}

knight_tour();
```

이 Rust 코드도 같은 방식으로 작동하며, 재귀와 백트래킹을 사용하여 문제를 해결합니다.

---

### 사용 사례

- **경로 탐색 문제**: 게임 또는 로봇이 경로를 최적으로 탐색하는 데 사용됩니다.
- **그래프 이론 학습**: 노드 간의 관계와 경로 탐색 알고리즘을 학습하는 데 유용합니다.
