## Square Matrix In-Place Rotation

**In-place rotation of a square matrix** involves rotating a 2D square matrix (e.g., an image) 90 degrees clockwise or counterclockwise. "In-place" means that the rotation is performed within the matrix itself without using additional memory.

#### Rotation Rules:

- **Clockwise 90-degree rotation**: Swap elements within the matrix so that each element moves to its new rotated position.
- **Counterclockwise 90-degree rotation**: Perform the same swapping operation but in the reverse direction.

### Use cases:

- **Image Processing**: Used when rotating or transforming images represented as matrices.
- **Game Development**: Can be applied when rotating boards or maps in 2D games.

---

### JavaScript Example (90-degree Clockwise Rotation)

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

// Example: Rotating a 3x3 matrix
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(rotateMatrix(matrix));
```

#### Output:

```
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
```

---

### Rust Example (90-degree Clockwise Rotation)

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

#### Output:

```
[7, 4, 1]
[8, 5, 2]
[9, 6, 3]
```

### Use Cases:

- **Image Rotation**: Often used in digital image processing when rotating images or graphics.
- **Map or Board Rotation**: Applied in 2D board or map games to rotate directions or orientations.
