## Rabin-Karp?

**Rabin-Karp 알고리즘**은 문자열에서 특정 패턴을 찾는 데 사용되는 효율적인 해시 기반 문자열 검색 알고리즘입니다. 이 알고리즘의 핵심은 **해시 함수**를 이용해 텍스트와 패턴의 해시 값을 계산하고, 이를 비교하여 패턴을 찾는 방식입니다.

#### **동작 방식**:

1. 패턴과 텍스트의 첫 번째 부분의 해시 값을 계산합니다.
2. 이후 텍스트의 다음 부분을 한 글자씩 이동하면서 해시 값을 업데이트하고, 패턴의 해시 값과 비교합니다.
3. 해시 값이 일치하는 경우, 문자열을 실제로 비교하여 패턴이 맞는지 확인합니다.
4. 해시 충돌이 발생할 수 있으므로, 해시 값이 일치할 때 실제로 문자열을 비교하는 단계가 필요합니다.

#### **사용 사례**:

- **문자열 검색**: 긴 텍스트에서 짧은 패턴을 효율적으로 검색하는 데 사용됩니다.
- **Plagiarism Detection(표절 검사)**: 해시 값을 사용해 두 문서가 비슷한지 빠르게 확인할 수 있습니다.
- **DNA 서열 분석**: 유전자 서열에서 특정 패턴을 찾는 데 사용될 수 있습니다.

---

### **JavaScript 예제 코드: Rabin-Karp 알고리즘**

```javascript
function rabinKarp(text, pattern) {
  const d = 256; // 알파벳 수
  const q = 101; // 소수 (해시 충돌을 줄이기 위해 사용)
  const m = pattern.length;
  const n = text.length;
  let p = 0; // 패턴의 해시 값
  let t = 0; // 텍스트의 해시 값
  let h = 1;

  // h의 값을 계산, h = pow(d, m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  // 패턴과 텍스트 첫 번째 윈도우의 해시 값을 계산
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  // 텍스트에서 패턴을 검색
  for (let i = 0; i <= n - m; i++) {
    // 해시 값이 같으면 실제 문자열을 비교
    if (p === t) {
      let j = 0;
      for (j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          break;
        }
      }
      if (j === m) {
        console.log(`Pattern found at index ${i}`);
      }
    }

    // 다음 윈도우의 해시 값을 계산
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) {
        t = t + q;
      }
    }
  }
}

// 사용 예시
const text = "GEEKS FOR GEEKS";
const pattern = "GEEK";
rabinKarp(text, pattern); // Output: Pattern found at index 0, 10
```

### **설명**:

- `rabinKarp` 함수는 텍스트에서 패턴을 검색하며, 각 윈도우의 해시 값을 계산하고 비교하여 일치하는 패턴을 찾습니다.
- 해시 충돌이 발생할 수 있으므로 해시 값이 동일할 때는 실제 문자열 비교를 수행합니다.

---

### **Rust 예제 코드: Rabin-Karp 알고리즘**

```rust
fn rabin_karp(text: &str, pattern: &str) {
    let d: i32 = 256;
    let q: i32 = 101;
    let m = pattern.len();
    let n = text.len();
    let mut p: i32 = 0; // 패턴의 해시 값
    let mut t: i32 = 0; // 텍스트의 해시 값
    let mut h: i32 = 1;

    // h = pow(d, m-1) % q 계산
    for _ in 0..(m-1) {
        h = (h * d) % q;
    }

    // 패턴과 텍스트의 첫 윈도우 해시 값 계산
    for i in 0..m {
        p = (d * p + pattern.as_bytes()[i] as i32) % q;
        t = (d * t + text.as_bytes()[i] as i32) % q;
    }

    // 텍스트에서 패턴을 검색
    for i in 0..=(n - m) {
        // 해시 값이 일치하면 실제로 문자열을 비교
        if p == t {
            if &text[i..i+m] == pattern {
                println!("Pattern found at index {}", i);
            }
        }

        // 다음 윈도우의 해시 값을 계산
        if i < n - m {
            t = (d * (t - (text.as_bytes()[i] as i32 * h)) + text.as_bytes()[i + m] as i32) % q;
            if t < 0 {
                t = t + q;
            }
        }
    }
}

fn main() {
    let text = "GEEKS FOR GEEKS";
    let pattern = "GEEK";
    rabin_karp(text, pattern); // Output: Pattern found at index 0, 10
}
```

### **설명**:

- **Rust 코드**는 JavaScript 코드와 동일한 논리를 따르며, 텍스트와 패턴의 해시 값을 계산하여 패턴을 검색합니다.
- 해시 값이 동일할 때는 실제로 패턴과 텍스트를 비교하여 패턴이 일치하는지 확인합니다.

---

### **요약**:

**Rabin-Karp 알고리즘**은 해시 함수를 사용하여 텍스트 내에서 특정 패턴을 찾는 효율적인 방법입니다. 특히, 여러 패턴을 검색하거나 매우 긴 텍스트에서 짧은 패턴을 찾는 경우 유용하게 사용됩니다.
