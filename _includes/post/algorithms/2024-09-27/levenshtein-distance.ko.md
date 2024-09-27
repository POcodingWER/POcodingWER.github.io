## 레벤슈타인 거리 (Levenshtein Distance)?

**설명**:  
레벤슈타인 거리는 두 문자열 사이에서 하나의 문자열을 다른 문자열로 변환하기 위해 필요한 최소 편집 횟수를 의미합니다. 여기서 편집 작업은 삽입(Insertion), 삭제(Deletion), 교체(Substitution) 세 가지로 이루어집니다. 이 거리는 문자열 유사도를 측정하는 데 자주 사용되며, 자연어 처리, 철자 교정, DNA 서열 분석 등에서 활용됩니다.

#### 사용 사례:

- **철자 교정**: 사용자가 입력한 단어와 올바른 단어 사이의 유사도를 측정하여 철자 오류를 교정하는 데 사용됩니다.
- **문자열 유사도**: 두 문자열 간의 유사도를 계산하는데 사용되며, 텍스트 비교, 데이터 중복 제거 등에 활용됩니다.
- **DNA 서열 분석**: 두 DNA 서열 간의 차이를 비교하여 진화적 거리 또는 돌연변이 수를 계산하는 데 사용됩니다.

---

### JavaScript 예제

```javascript
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;

  const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));

  // 초기화: 빈 문자열에 대해 변환 비용 설정
  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // 문자가 같으면 비용은 그대로
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // 삭제
          dp[i][j - 1] + 1, // 삽입
          dp[i - 1][j - 1] + 1
        ); // 교체
      }
    }
  }

  return dp[len1][len2];
}

// 사용 예시
console.log(levenshteinDistance("kitten", "sitting")); // 출력: 3
```

### 설명:

- `dp` 배열은 각 부분 문자열 간의 변환 비용을 저장합니다.
- 두 문자가 같으면 변환 비용이 증가하지 않으며, 다르면 삽입, 삭제, 교체 중 가장 적은 비용을 선택하여 비용을 계산합니다.
- 최종 결과는 문자열의 마지막 위치에서 변환에 필요한 최소 비용을 의미합니다.

---

### Rust 예제

```rust
fn levenshtein_distance(str1: &str, str2: &str) -> usize {
    let len1 = str1.len();
    let len2 = str2.len();

    let mut dp = vec![vec![0; len2 + 1]; len1 + 1];

    // 초기화: 빈 문자열에 대한 변환 비용 설정
    for i in 0..=len1 {
        dp[i][0] = i;
    }
    for j in 0..=len2 {
        dp[0][j] = j;
    }

    for i in 1..=len1 {
        for j in 1..=len2 {
            if str1.as_bytes()[i - 1] == str2.as_bytes()[j - 1] {
                dp[i][j] = dp[i - 1][j - 1]; // 문자가 같으면 비용은 그대로
            } else {
                dp[i][j] = std::cmp::min(
                    dp[i - 1][j] + 1, // 삭제
                    std::cmp::min(
                        dp[i][j - 1] + 1, // 삽입
                        dp[i - 1][j - 1] + 1 // 교체
                    )
                );
            }
        }
    }

    dp[len1][len2]
}

fn main() {
    let str1 = "kitten";
    let str2 = "sitting";
    println!("{}", levenshtein_distance(str1, str2)); // 출력: 3
}
```

### 설명:

- Rust 코드에서도 동일한 논리를 사용하여 동적 계획법(DP)을 통해 두 문자열 간의 레벤슈타인 거리를 계산합니다.
- `dp` 배열을 사용하여 각 부분 문자열 간의 변환 비용을 저장하고, 삽입, 삭제, 교체 중 가장 적은 비용을 선택하여 최소 편집 횟수를 계산합니다.

---

### 요약:

레벤슈타인 거리는 두 문자열 간의 변환에 필요한 최소 편집 횟수를 계산하는 알고리즘입니다. 삽입, 삭제, 교체라는 세 가지 연산을 통해 문자열을 변환할 수 있으며, 문자열 유사도 계산, 오류 교정, DNA 서열 분석 등에서 사용됩니다.
