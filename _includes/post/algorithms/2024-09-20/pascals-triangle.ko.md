### 파스칼의 삼각형이란?

**파스칼의 삼각형**은 위에 있는 두 숫자의 합으로 배열된 삼각형 구조입니다. 파스칼의 삼각형은 다음과 같은 모습으로 시작합니다:

```
       1
      1 1
     1 2 1
    1 3 3 1
   1 4 6 4 1
  1 5 10 10 5 1
```

이 삼각형의 각 숫자는 **이항 계수**를 나타냅니다. 파스칼의 삼각형에서 $n$번째 행은 $(a + b)^n$의 전개에서 계수 역할을 하며, 이를 조합으로 계산할 수 있습니다:
$
nCk = \frac{n!}{k!(n-k)!}
$
여기서 $nCk$는 $n$번째 행에서 $k$번째 위치의 값을 의미합니다.

### 파스칼의 삼각형 사용 사례

1. **이항 정리**: 파스칼의 삼각형은 이항 정리의 계수를 계산하는 데 사용됩니다.
2. **조합**: 조합론에서, 주어진 집합에서 요소를 선택하는 방법의 수를 계산할 때 유용합니다.
3. **확률**: 확률 이론에서 사건이 발생할 수 있는 방법의 수를 계산할 때 사용됩니다.
4. **프랙탈**: 파스칼의 삼각형을 2로 나눈 나머지로 표현하면 시에르핀스키 삼각형과 같은 프랙탈 패턴을 보입니다.
5. **동적 프로그래밍**: 이전 결과를 기반으로 새로운 값을 계산하는 최적화 문제에서 사용됩니다.

### 파스칼의 삼각형 구현 방법

파스칼의 삼각형은 간단한 중첩 반복문을 사용하여 구현할 수 있습니다. 각 행은 1로 시작하고 끝나며, 중간 값은 위에 있는 두 값을 더하여 계산합니다.

### JavaScript에서 파스칼의 삼각형 구현

```javascript
function generatePascalTriangle(numRows) {
  const triangle = [];

  for (let i = 0; i < numRows; i++) {
    triangle[i] = [];
    triangle[i][0] = 1; // 첫 번째 요소는 항상 1
    triangle[i][i] = 1; // 마지막 요소도 항상 1

    for (let j = 1; j < i; j++) {
      // 값은 위 두 값의 합으로 계산
      triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
    }
  }

  return triangle;
}

// 예제 출력
console.log(generatePascalTriangle(5));
```

**출력:**

```
[
  [1],
  [1, 1],
  [1, 2, 1],
  [1, 3, 3, 1],
  [1, 4, 6, 4, 1]
]
```

### Rust에서 파스칼의 삼각형 구현

```rust
fn generate_pascal_triangle(num_rows: usize) -> Vec<Vec<u32>> {
    let mut triangle = vec![vec![1]; num_rows];

    for i in 1..num_rows {
        let mut row = vec![1; i + 1];

        for j in 1..i {
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }

        triangle[i] = row;
    }

    triangle
}

fn main() {
    let triangle = generate_pascal_triangle(5);

    for row in triangle {
        println!("{:?}", row);
    }
}
```

**출력:**

```
[1]
[1, 1]
[1, 2, 1]
[1, 3, 3, 1]
[1, 4, 6, 4, 1]
```

### 요약:

**파스칼의 삼각형**은 조합론과 이항 정리에 중요한 역할을 하는 수학적 도구입니다. 각 숫자는 이항 계수이며, 조합과 확률 문제에서 많이 사용됩니다. 파스칼의 삼각형은 JavaScript와 Rust에서 간단히 구현할 수 있으며, 이를 통해 다양한 수학적 문제를 해결할 수 있습니다.
