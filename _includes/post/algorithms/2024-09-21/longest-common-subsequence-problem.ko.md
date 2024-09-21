## 최장 공통 부분 수열 문제(Longest Common Subsequence Problem)?

**최장 공통 부분 수열 (LCS)** 문제는 두 개의 수열에서 같은 순서로 나타나는 가장 긴 부분 수열을 찾는 문제입니다. 여기서 부분 수열은 다른 수열에서 일부 또는 아무 요소도 삭제하여 나머지 요소의 순서를 변경하지 않고 얻은 수열입니다.

예를 들어, 다음과 같은 두 수열이 주어졌을 때:

- 수열 1: "ABCBDAB"
- 수열 2: "BDCAB"

LCS는 "BCAB"로 길이는 4입니다.

### 최장 공통 부분 수열의 사용 사례

1. **생물정보학**: DNA, RNA 또는 단백질 서열을 비교하는 데 사용됩니다.
2. **텍스트 비교**: 파일 간의 변경 사항을 식별하는 데 유용합니다.
3. **데이터 비교**: 데이터 세트를 병합하거나 데이터 구조를 비교하는 데 적용될 수 있습니다.
4. **자연어 처리**: 텍스트 데이터의 유사성을 식별하는 데 도움이 됩니다.
5. **파일 비교 도구**: diff 도구와 같은 애플리케이션에서 파일 간의 차이를 찾는 데 사용됩니다.

### JavaScript로 구현한 최장 공통 부분 수열 예제

다음은 동적 프로그래밍을 사용한 LCS 문제의 JavaScript 구현입니다:

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// 사용 예시
const text1 = "ABCBDAB";
const text2 = "BDCAB";
console.log(longestCommonSubsequence(text1, text2)); // 출력: 4
```

**설명**:

- 2차원 배열 `dp`가 생성되어 서로 다른 부분 수열의 LCS 길이를 저장합니다. 알고리즘은 두 문자열을 반복하며 문자 일치 여부에 따라 `dp` 테이블을 업데이트합니다.

### Rust로 구현한 최장 공통 부분 수열 예제

Rust에서 LCS 문제를 구현하는 방법은 다음과 같습니다:

```rust
fn longest_common_subsequence(text1: &str, text2: &str) -> usize {
    let m = text1.len();
    let n = text2.len();
    let mut dp = vec![vec![0; n + 1]; m + 1];

    for i in 1..=m {
        for j in 1..=n {
            if text1.chars().nth(i - 1) == text2.chars().nth(j - 1) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j].max(dp[i][j - 1]);
            }
        }
    }

    dp[m][n]
}

fn main() {
    let text1 = "ABCBDAB";
    let text2 = "BDCAB";
    println!("{}", longest_common_subsequence(text1, text2)); // 출력: 4
}
```

**설명**:

- JavaScript 구현과 유사하게, 2차원 벡터 `dp`를 사용하여 LCS의 길이를 저장합니다. 함수는 두 문자열을 반복하며 `dp` 테이블을 업데이트합니다.

### 요약

**최장 공통 부분 수열** 문제는 생물정보학, 텍스트 비교, 데이터 분석 및 자연어 처리와 같은 다양한 분야에서 중요합니다. JavaScript와 Rust 구현 모두 동적 프로그래밍을 사용하여 두 수열 간의 LCS 길이를 효율적으로 계산합니다.
