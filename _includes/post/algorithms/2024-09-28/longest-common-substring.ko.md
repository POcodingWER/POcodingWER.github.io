## Longest Common Substring?

**Longest Common Substring (LCS)** 문제는 두 문자열 간에 가장 긴 공통 부분 문자열을 찾는 문제입니다. 이때, **부분 문자열**은 문자열에서 연속된 문자들로 이루어진 부분을 말하며, 중간에 문자가 생략될 수는 없습니다.

#### **어디에 사용되는지**:

- **유전자 서열 비교**: 유전자 서열 간에 공통된 서열을 찾을 때 유용합니다.
- **문서 비교**: 두 문서에서 가장 긴 중복된 구절을 찾는 데 사용됩니다.
- **데이터 중복 제거**: 큰 데이터 세트에서 중복 데이터를 효율적으로 찾는 데 유용합니다.

### **JavaScript 예제 코드**

```javascript
function longestCommonSubstring(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  let maxLen = 0;
  let endIndex = 0;

  // DP 테이블 초기화
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > maxLen) {
          maxLen = dp[i][j];
          endIndex = i - 1;
        }
      }
    }
  }

  // 가장 긴 공통 부분 문자열 반환
  return str1.substring(endIndex - maxLen + 1, endIndex + 1);
}

// 사용 예시
const str1 = "ABABC";
const str2 = "BABC";
console.log(longestCommonSubstring(str1, str2)); // 출력: "BABC"
```

#### **설명**:

- 이 코드는 동적 계획법(DP)을 사용하여 두 문자열 간에 가장 긴 공통 부분 문자열을 찾습니다.
- `dp[i][j]`는 `str1[0..i-1]`와 `str2[0..j-1]` 간의 가장 긴 공통 부분 문자열의 길이를 저장합니다.
- 최종적으로 가장 긴 공통 부분 문자열을 찾은 후, 해당 문자열을 반환합니다.

---

### **Rust 예제 코드**

```rust
fn longest_common_substring(str1: &str, str2: &str) -> String {
    let m = str1.len();
    let n = str2.len();
    let mut max_len = 0;
    let mut end_index = 0;

    // DP 테이블 초기화
    let mut dp = vec![vec![0; n + 1]; m + 1];
    let str1_bytes = str1.as_bytes();
    let str2_bytes = str2.as_bytes();

    for i in 1..=m {
        for j in 1..=n {
            if str1_bytes[i - 1] == str2_bytes[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if dp[i][j] > max_len {
                    max_len = dp[i][j];
                    end_index = i;
                }
            }
        }
    }

    // 가장 긴 공통 부분 문자열 반환
    str1[(end_index - max_len)..end_index].to_string()
}

fn main() {
    let str1 = "ABABC";
    let str2 = "BABC";
    let result = longest_common_substring(str1, str2);
    println!("{}", result); // 출력: "BABC"
}
```

#### **설명**:

- **Rust 코드**도 JavaScript 코드와 동일한 로직을 따릅니다. 동적 계획법을 사용하여 두 문자열 간에 가장 긴 공통 부분 문자열을 찾습니다.
- `dp[i][j]`는 현재 위치에서 가장 긴 공통 부분 문자열의 길이를 저장하며, 최종적으로 가장 긴 공통 부분 문자열을 반환합니다.

---

### **요약**:

Longest Common Substring 문제는 두 문자열에서 연속된 공통된 가장 긴 부분을 찾는 문제로, 동적 계획법(DP)을 사용하여 효율적으로 해결할 수 있습니다. 이 알고리즘은 유전자 서열 분석, 문서 비교, 데이터 중복 탐지와 같은 다양한 분야에서 응용될 수 있습니다.
