## 최단 공통 슈퍼시퀀스 (SCS)?

**최단 공통 슈퍼시퀀스 (SCS)**는 컴퓨터 과학 문제로, 두 개의 시퀀스가 주어졌을 때, 이 두 시퀀스를 모두 부분 시퀀스로 포함하는 가장 짧은 시퀀스를 찾는 문제입니다. 이 시퀀스는 두 입력 시퀀스의 모든 문자를 원래 순서대로 포함해야 합니다.

#### 문제 정의:

두 문자열 `X`와 `Y`가 주어졌을 때, 두 문자열을 모두 부분 시퀀스로 포함하는 가장 짧은 시퀀스 `S`를 찾는 것이 목표입니다.

### 예시:

- 입력: `X = "abac"`, `Y = "cab"`
- 출력: 최단 공통 슈퍼시퀀스의 길이: `5`, 가능한 슈퍼시퀀스: `"cabac"`

### 주요 포인트:

1. **슈퍼시퀀스**는 두 입력 문자열을 모두 부분 시퀀스로 포함해야 합니다.
2. 두 문자열의 문자 순서는 반드시 유지되어야 합니다.
3. 두 문자열에 공통 문자가 있을 경우, 그 문자는 결과에서 한 번만 포함되어야 합니다.

### 최장 공통 부분 수열 (LCS)과의 관계:

**최단 공통 슈퍼시퀀스**의 길이는 **최장 공통 부분 수열 (LCS)**의 길이로부터 다음과 같이 계산할 수 있습니다:
$ \text{SCS의 길이} = \text{X의 길이} + \text{Y의 길이} - \text{LCS(X, Y)의 길이} $

### 접근 방법:

1. **동적 프로그래밍**: 이 문제를 효율적으로 해결하려면, 먼저 두 문자열의 LCS를 계산한 후, 이를 이용하여 SCS를 찾습니다.
2. **재귀적 해결**: 모든 가능한 슈퍼시퀀스를 탐색하고 가장 짧은 것을 찾는 재귀적 접근 방식도 사용할 수 있습니다.

---

### JavaScript 예시

다음은 **최단 공통 슈퍼시퀀스의 길이**를 찾는 JavaScript 코드입니다:

```javascript
function shortestCommonSupersequence(X, Y) {
  let m = X.length,
    n = Y.length;

  // LCS 길이를 저장할 DP 테이블 생성
  let dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // LCS 접근 방식을 사용하여 DP 테이블 채우기
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (X[i - 1] === Y[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // SCS의 길이
  return m + n - dp[m][n];
}

// 사용 예시:
let X = "abac";
let Y = "cab";
console.log(shortestCommonSupersequence(X, Y)); // 출력: 5
```

### JavaScript 코드 설명:

1. **LCS** 길이를 계산하기 위해 `dp` 테이블을 생성합니다.
2. LCS 길이를 구한 후, 다음 공식을 사용하여 **최단 공통 슈퍼시퀀스**의 길이를 계산합니다:
   $ \text{SCS의 길이} = m + n - \text{LCS 길이} $
   여기서 `m`은 `X`의 길이, `n`은 `Y`의 길이입니다.

---

### Rust 예시

다음은 Rust로 **최단 공통 슈퍼시퀀스의 길이**를 계산하는 코드입니다:

```rust
fn shortest_common_supersequence(X: &str, Y: &str) -> usize {
    let m = X.len();
    let n = Y.len();

    // LCS 길이를 저장할 DP 테이블 생성
    let mut dp = vec![vec![0; n + 1]; m + 1];

    let X_chars: Vec<char> = X.chars().collect();
    let Y_chars: Vec<char> = Y.chars().collect();

    // LCS 접근 방식을 사용하여 DP 테이블 채우기
    for i in 1..=m {
        for j in 1..=n {
            if X_chars[i - 1] == Y_chars[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j].max(dp[i][j - 1]);
            }
        }
    }

    // SCS의 길이
    m + n - dp[m][n]
}

fn main() {
    let X = "abac";
    let Y = "cab";
    println!("{}", shortest_common_supersequence(X, Y));  // 출력: 5
}
```

### Rust 코드 설명:

1. **동적 프로그래밍** 접근 방식을 사용하여 `dp` 테이블에 LCS 길이를 계산합니다.
2. LCS 길이를 이용해 최종적으로 **최단 공통 슈퍼시퀀스**의 길이를 계산합니다: `m + n - LCS 길이`.

---

### SCS의 사용 사례:

- **문서나 소스 코드의 두 버전**을 병합할 때, 순서를 유지하면서 두 버전의 변화를 모두 포함하는 최적화된 버전을 찾는 데 사용됩니다.
- **유전자 서열 정렬**과 같은 생명 정보학 문제에서 두 서열을 비교할 때 사용됩니다.
- **파일 시스템 작업**에서 두 개의 소스에서 발생한 변경 사항을 병합하면서 원래 작업 순서를 유지할 때 사용됩니다.
