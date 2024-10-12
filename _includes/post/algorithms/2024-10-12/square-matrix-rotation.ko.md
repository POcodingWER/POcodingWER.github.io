## 제자리에서 정사각 행렬 회전 (Square Matrix In-Place Rotation)

**정사각 행렬의 제자리 회전**은 2D 정사각 행렬(예: 이미지)을 시계 방향이나 반시계 방향으로 90도 회전시키는 알고리즘입니다. 제자리에서 수행한다는 것은 추가 메모리를 사용하지 않고, 기존 행렬 안에서 회전을 완료한다는 의미입니다.

#### 회전의 규칙:

- 시계 방향으로 90도 회전 시: 행렬의 각 요소를 위치 교환하여 새로운 위치에 배치합니다.
- 반시계 방향으로 90도 회전 시: 시계 방향의 반대 방향으로 동일한 작업을 수행합니다.

### 사용 예:

- **이미지 처리**: 이미지를 행렬로 표현하여, 회전, 변형 등의 작업을 수행할 때 사용합니다.
- **게임 개발**: 2D 게임에서 보드나 맵을 회전할 때 행렬 회전이 활용될 수 있습니다.

---

### JavaScript 예제 코드 (시계 방향 90도 회전)

```javascript
function rotateMatrix(matrix) {
  const n = matrix.length;
  for (let i = 0; i < Math.floor(n / 2); i++) {
    for (let j = i; j < n - i - 1; j++) {
      let temp = matrix[i][j];
      matrix[i][j] = matrix[n - j - 1][i];
      matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1];
      matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1];
      matrix[j][n - i - 1] = temp;
    }
  }
  return matrix;
}

// 예제: 3x3 행렬 회전
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(rotateMatrix(matrix));
```

#### 출력:

```
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
```

---

### Rust 예제 코드 (시계 방향 90도 회전)

```rust
fn rotate_matrix(matrix: &mut Vec<Vec<i32>>) {
    let n = matrix.len();
    for i in 0..n / 2 {
        for j in i..n - i - 1 {
            let temp = matrix[i][j];
            matrix[i][j] = matrix[n - j - 1][i];
            matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1];
            matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1];
            matrix[j][n - i - 1] = temp;
        }
    }
}

fn main() {
    let mut matrix = vec![
        vec![1, 2, 3],
        vec![4, 5, 6],
        vec![7, 8, 9]
    ];

    rotate_matrix(&mut matrix);
    for row in &matrix {
        println!("{:?}", row);
    }
}
```

#### 출력:

```
[7, 4, 1]
[8, 5, 2]
[9, 6, 3]
```

### 사용처

- **이미지 회전**: 디지털 이미지나 그래픽을 회전시킬 때 제자리에서 2D 배열을 변형합니다.
- **지도나 보드 회전**: 2D 배열로 표현된 맵 또는 보드 게임에서 방향을 변경할 때 사용합니다.
