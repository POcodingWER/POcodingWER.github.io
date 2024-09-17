### Bloom Filter?

**블룸 필터**는 집합에 원소가 포함되어 있는지를 테스트하기 위해 사용되는 확률적 자료 구조입니다. 공간 효율성이 매우 뛰어나지만, 몇 가지 단점도 존재합니다: **거짓 긍정(false positives)**이 발생할 수 있는데, 이는 원소가 집합에 속하지 않지만 속한다고 잘못 판단할 수 있음을 의미합니다. 하지만 **거짓 부정(false negatives)**, 즉 원소가 집합에 속함에도 불구하고 속하지 않는다고 판단하는 일은 발생하지 않습니다.

### 주요 특징

1. **확률적 성질**: 원소가 "집합에 속할 가능성이 있음" 또는 "집합에 절대 속하지 않음"을 판단할 수 있습니다.
2. **공간 효율성**: 해시 집합 등 전통적인 자료 구조에 비해, 블룸 필터는 많은 원소를 저장할 때 훨씬 적은 공간을 필요로 합니다.
3. **거짓 긍정**: 확률적 성질 때문에 가끔 원소가 집합에 속하지 않음에도 불구하고 속한다고 잘못 판단할 수 있습니다. 거짓 긍정의 확률은 필터 크기와 추가된 원소의 수에 따라 달라집니다.

### 작동 원리

1. **비트 배열**: 블룸 필터는 길이가 `m`인 비트 배열로 구성되며, 처음에는 0으로 초기화됩니다.
2. **해시 함수**: `k`개의 독립적인 해시 함수를 사용하여 각 해시 함수는 원소를 `m`개의 배열 위치 중 하나에 균등하게 매핑합니다.
3. **삽입**: 원소를 삽입할 때, 원소는 `k`개의 해시 함수로 해시되고, 그에 대응하는 배열의 비트들이 1로 설정됩니다.
4. **조회**: 원소가 집합에 속하는지 확인하려면, `k`개의 해시 함수로 원소를 해시합니다. 배열에서 해당하는 모든 비트가 1로 설정되어 있으면, 그 원소는 "속할 가능성 있음"을 나타냅니다. 하나라도 0인 비트가 있으면, 그 원소는 절대 집합에 속하지 않음을 나타냅니다.

### 사용 사례

- **데이터베이스와 캐싱**: 캐시나 데이터베이스에서 원소가 존재할 가능성을 빠르게 확인하여 비싼 조회를 피할 수 있습니다.
- **네트워크 시스템**: URL 필터링, 스팸 감지 등에 사용됩니다.
- **분산 시스템**: 분산 데이터베이스에서 원소가 존재하는지 빠르게 확인한 후 더 비싼 작업을 수행하기 전에 사용할 수 있습니다.

### 시간 및 공간 복잡도

- **삽입 및 조회** 연산은 모두 O(k)입니다. 여기서 `k`는 해시 함수의 개수입니다. `k`가 작기 때문에 이는 상수 시간 연산입니다.
- **공간 복잡도**는 O(m)이며, `m`은 비트 배열의 크기입니다. 블룸 필터는 매우 공간 효율적입니다.

---

### JavaScript

```javascript
class BloomFilter {
  constructor(size, numHashFunctions) {
    this.size = size;
    this.numHashFunctions = numHashFunctions;
    this.bitArray = new Array(size).fill(0);
  }

  // 시드 값을 기반으로 한 간단한 해시 함수
  hash(item, seed) {
    let hashValue = 0;
    for (let i = 0; i < item.length; i++) {
      hashValue = (hashValue * seed + item.charCodeAt(i)) % this.size;
    }
    return hashValue;
  }

  // 블룸 필터에 항목을 추가
  add(item) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const hashIndex = this.hash(item, i + 1);
      this.bitArray[hashIndex] = 1;
    }
  }

  // 항목이 집합에 속하는지 확인
  contains(item) {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const hashIndex = this.hash(item, i + 1);
      if (this.bitArray[hashIndex] === 0) {
        return false; // 집합에 절대 속하지 않음
      }
    }
    return true; // 집합에 속할 가능성 있음
  }
}

// 사용 예시:
const bloom = new BloomFilter(100, 3);
bloom.add("apple");
bloom.add("banana");

console.log(bloom.contains("apple")); // 출력: true (집합에 속할 가능성 있음)
console.log(bloom.contains("grape")); // 출력: false (집합에 절대 속하지 않음)
```

#### 설명:

- `hash` 함수는 시드 값을 기반으로 해시 값을 생성합니다.
- `add`는 해시 함수들을 사용해 다수의 위치에 비트를 설정하여 원소를 필터에 추가합니다.
- `contains`는 해당하는 비트들이 설정되어 있는지 확인하여 원소가 집합에 속할 가능성을 판단합니다.

---

### Rust

```rust
struct BloomFilter {
    bit_array: Vec<bool>,
    size: usize,
    num_hash_functions: usize,
}

impl BloomFilter {
    // 새로운 블룸 필터 생성
    fn new(size: usize, num_hash_functions: usize) -> BloomFilter {
        BloomFilter {
            bit_array: vec![false; size],
            size,
            num_hash_functions,
        }
    }

    // 시드 값을 사용한 간단한 해시 함수
    fn hash(&self, item: &str, seed: usize) -> usize {
        let mut hash_value = 0;
        for byte in item.bytes() {
            hash_value = (hash_value * seed + byte as usize) % self.size;
        }
        hash_value
    }

    // 블룸 필터에 항목 추가
    fn add(&mut self, item: &str) {
        for i in 0..self.num_hash_functions {
            let hash_index = self.hash(item, i + 1);
            self.bit_array[hash_index] = true;
        }
    }

    // 항목이 집합에 속하는지 확인
    fn contains(&self, item: &str) -> bool {
        for i in 0..self.num_hash_functions {
            let hash_index = self.hash(item, i + 1);
            if !self.bit_array[hash_index] {
                return false;  // 집합에 절대 속하지 않음
            }
        }
        true  // 집합에 속할 가능성 있음
    }
}

fn main() {
    let mut bloom = BloomFilter::new(100, 3);
    bloom.add("apple");
    bloom.add("banana");

    println!("{}", bloom.contains("apple"));  // 출력: true (집합에 속할 가능성 있음)
    println!("{}", bloom.contains("grape"));  // 출력: false (집합에 절대 속하지 않음)
}
```

#### 설명:

- `hash` 함수는 시드 값을 사용하여 해시 값을 계산합니다.
- `add` 함수는 원소를 추가할 때, 여러 위치의 비트를 설정합니다.
- `contains` 함수는 원소가 집합에 속할 가능성이 있는지 확인하기 위해 모든 관련된 비트들이 설정되어 있는지 검사합니다.

---

### 주요 요점:

- **블룸 필터**는 **공간 효율적**인 확률적 자료 구조로, 거짓 부정 없이 거짓 긍정이 발생할 수 있습니다.
- 많은 원소가 포함된 집합에서 원소가 포함되어 있는지 빠르고 효율적으로 확인해야 할 때 (예: 데이터베이스, 네트워크 필터링) 사용됩니다.
- JavaScript와 Rust의 예제는 해시 함수와 비트 배열을 사용하여 블룸 필터를 구성하는 방법을 보여줍니다.
