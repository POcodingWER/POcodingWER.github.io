## Knuth–Morris–Pratt(KMP)?

**KMP 알고리즘**은 문자열 검색 알고리즘으로, 주어진 문자열 내에서 특정 패턴이 존재하는지, 또는 어디에 존재하는지를 효율적으로 찾는 방법입니다. 이 알고리즘은 패턴의 부분 일치 정보를 미리 계산하여 불필요한 비교를 피하는 방식으로 동작합니다.

#### **알고리즘의 핵심 개념**:

1. **Prefix Table (Pi 배열)**: 패턴의 접두사와 접미사의 일치 여부를 계산하여 저장하는 배열입니다. 이 배열을 활용해 비교 중에 겹치는 부분을 다시 비교하지 않도록 최적화합니다.
2. **시간 복잡도**: 패턴의 길이가 `m`이고 텍스트의 길이가 `n`일 때, KMP 알고리즘의 시간 복잡도는 **O(n + m)**입니다. 이는 브루트포스 방식의 O(n \* m)보다 훨씬 빠릅니다.

#### **사용 사례**:

- **문서 검색**: 긴 텍스트에서 특정 단어나 패턴을 찾을 때
- **생물 정보학**: DNA 서열에서 특정 서열 패턴을 검색할 때
- **검색 엔진**: 키워드가 포함된 문서를 검색하는 데 활용

---

### **JavaScript 예제 **

```javascript
function buildPiTable(pattern) {
  const m = pattern.length;
  const pi = Array(m).fill(0);
  let j = 0;

  for (let i = 1; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) {
      j = pi[j - 1];
    }
    if (pattern[i] === pattern[j]) {
      j++;
    }
    pi[i] = j;
  }

  return pi;
}

function kmpSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const pi = buildPiTable(pattern);
  let j = 0;

  for (let i = 0; i < n; i++) {
    while (j > 0 && text[i] !== pattern[j]) {
      j = pi[j - 1];
    }
    if (text[i] === pattern[j]) {
      j++;
    }
    if (j === m) {
      console.log("Pattern found at index", i - m + 1);
      j = pi[j - 1];
    }
  }
}

// 예제 사용
const text = "ABC ABCDAB ABCDABCDABDE";
const pattern = "ABCDABD";
kmpSearch(text, pattern); // Output: Pattern found at index 15
```

### **설명**:

1. **Pi 테이블**은 패턴의 접두사와 접미사의 일치 여부를 기록합니다. 이를 통해 패턴을 효율적으로 검색할 수 있습니다.
2. **KMP 검색 함수**는 텍스트와 패턴을 비교하며, 일치하는 부분을 찾았을 때 패턴이 끝까지 일치하면 해당 위치를 출력합니다.

---

### **Rust 예제 코드**

```rust
fn build_pi_table(pattern: &str) -> Vec<usize> {
    let m = pattern.len();
    let mut pi = vec![0; m];
    let mut j = 0;

    for i in 1..m {
        while j > 0 && pattern.as_bytes()[i] != pattern.as_bytes()[j] {
            j = pi[j - 1];
        }
        if pattern.as_bytes()[i] == pattern.as_bytes()[j] {
            j += 1;
        }
        pi[i] = j;
    }

    pi
}

fn kmp_search(text: &str, pattern: &str) {
    let n = text.len();
    let m = pattern.len();
    let pi = build_pi_table(pattern);
    let mut j = 0;

    for i in 0..n {
        while j > 0 && text.as_bytes()[i] != pattern.as_bytes()[j] {
            j = pi[j - 1];
        }
        if text.as_bytes()[i] == pattern.as_bytes()[j] {
            j += 1;
        }
        if j == m {
            println!("Pattern found at index {}", i - m + 1);
            j = pi[j - 1];
        }
    }
}

fn main() {
    let text = "ABC ABCDAB ABCDABCDABDE";
    let pattern = "ABCDABD";
    kmp_search(text, pattern);  // Output: Pattern found at index 15
}
```

### **설명**:

1. **Pi 테이블 생성**: Rust에서는 `as_bytes()`로 문자열을 바이트 배열로 변환하여, 각 문자를 비교하며 Pi 테이블을 생성합니다.
2. **KMP 검색 함수**: Pi 테이블을 활용하여 패턴을 검색하며, 일치하는 부분이 있으면 그 위치를 출력합니다.

---

### **요약**:

KMP 알고리즘은 패턴 검색에서 매우 효율적인 방법으로, 접두사와 접미사 일치 정보를 사용하여 불필요한 비교를 줄입니다. 긴 텍스트에서 특정 패턴을 빠르게 검색할 수 있는 장점이 있어 여러 분야에서 사용됩니다.
