## Z 알고리즘?

**Z 알고리즘**은 문자열에서 특정 패턴을 찾거나 문자열 내에서 일치하는 부분을 빠르게 계산하는 효율적인 방법입니다. 주어진 문자열에서 각 접두사와 원래 문자열의 접두사와의 일치하는 길이를 저장하는 `Z 배열`을 기반으로 동작합니다.

#### **Z 배열이란?**

- Z 배열의 각 요소는 해당 인덱스에서 시작하는 부분 문자열이 원래 문자열의 처음부터 얼마나 긴 접두사와 일치하는지를 나타냅니다.
- 예를 들어, 문자열 `S = "abcababc"`에 대한 Z 배열은 `[8, 0, 0, 2, 0, 0, 3, 0]`입니다. 첫 번째 인덱스는 문자열 전체와 일치하므로 `8`, 네 번째 인덱스부터 `abc`와 일치하는 접두사 길이가 `2`임을 보여줍니다.

#### **사용 사례**

- **문자열 검색**: 긴 텍스트에서 짧은 패턴을 찾는 데 사용됩니다. KMP 알고리즘과 유사하지만, Z 알고리즘은 패턴을 별도로 전처리하지 않고, 패턴과 텍스트를 한 문자열로 합쳐 처리하는 방식으로 동작합니다.
- **생물 정보학**: DNA 서열에서 특정 서열 패턴을 검색하는 데 사용됩니다.
- **검색 엔진**: 패턴이 포함된 문서 검색에도 사용됩니다.

---

### **JavaScript 예제 코드: Z 알고리즘**

```javascript
function buildZArray(s) {
  const n = s.length;
  const Z = Array(n).fill(0);
  let l = 0,
    r = 0,
    k;

  for (let i = 1; i < n; i++) {
    if (i > r) {
      l = r = i;
      while (r < n && s[r] === s[r - l]) {
        r++;
      }
      Z[i] = r - l;
      r--;
    } else {
      k = i - l;
      if (Z[k] < r - i + 1) {
        Z[i] = Z[k];
      } else {
        l = i;
        while (r < n && s[r] === s[r - l]) {
          r++;
        }
        Z[i] = r - l;
        r--;
      }
    }
  }

  return Z;
}

function zSearch(text, pattern) {
  const concat = pattern + "$" + text;
  const Z = buildZArray(concat);
  const m = pattern.length;

  for (let i = 0; i < Z.length; i++) {
    if (Z[i] === m) {
      console.log("Pattern found at index", i - m - 1);
    }
  }
}

// 예제 사용
const text = "abcabcababcabc";
const pattern = "abc";
zSearch(text, pattern); // Output: Pattern found at index 0, 3, 6, 9
```

### **설명**:

1. **Z 배열 생성**: 주어진 문자열에 대해 Z 배열을 계산하여 각 인덱스에서 시작하는 부분 문자열이 원본 문자열의 접두사와 얼마나 일치하는지 계산합니다.
2. **패턴 검색**: 패턴과 텍스트를 합쳐서 처리한 뒤, Z 배열에서 패턴의 길이와 일치하는 값을 찾으면 해당 패턴이 텍스트 내에 존재함을 알 수 있습니다.

---

### **Rust 예제 코드: Z 알고리즘**

```rust
fn build_z_array(s: &str) -> Vec<usize> {
    let n = s.len();
    let mut z = vec![0; n];
    let s_bytes = s.as_bytes();
    let (mut l, mut r, mut k);

    for i in 1..n {
        if i > r {
            l = i;
            r = i;
            while r < n && s_bytes[r] == s_bytes[r - l] {
                r += 1;
            }
            z[i] = r - l;
            r -= 1;
        } else {
            k = i - l;
            if z[k] < r - i + 1 {
                z[i] = z[k];
            } else {
                l = i;
                while r < n && s_bytes[r] == s_bytes[r - l] {
                    r += 1;
                }
                z[i] = r - l;
                r -= 1;
            }
        }
    }

    z
}

fn z_search(text: &str, pattern: &str) {
    let concat = format!("{}${}", pattern, text);
    let z = build_z_array(&concat);
    let m = pattern.len();

    for i in 0..z.len() {
        if z[i] == m {
            println!("Pattern found at index {}", i - m - 1);
        }
    }
}

fn main() {
    let text = "abcabcababcabc";
    let pattern = "abc";
    z_search(text, pattern); // Output: Pattern found at index 0, 3, 6, 9
}
```

### **설명**:

1. **Z 배열 생성**: Rust에서는 문자열을 바이트 배열로 변환하여 각 인덱스에서 부분 문자열이 원본 문자열의 접두사와 얼마나 일치하는지 계산합니다.
2. **패턴 검색**: 패턴과 텍스트를 결합한 후, Z 배열을 생성하여 일치하는 패턴의 위치를 찾아 출력합니다.

---

### **요약**:

Z 알고리즘은 긴 텍스트 내에서 특정 패턴을 효율적으로 찾을 수 있는 알고리즘으로, Z 배열을 사용하여 텍스트와 패턴의 일치 정보를 빠르게 계산합니다. 이를 통해 검색 엔진, DNA 서열 검색 등 다양한 분야에서 패턴 검색을 최적화할 수 있습니다.
