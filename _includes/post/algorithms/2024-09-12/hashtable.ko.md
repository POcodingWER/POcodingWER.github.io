> **해시 테이블**은 키-값 쌍을 저장하기 위해 사용되는 자료구조입니다. 해시 함수라는 것을 사용해 배열의 인덱스(해시)를 계산하며, 이를 통해 원하는 값을 찾습니다. 해시 테이블의 핵심은 해시 함수인데, 이 함수는 키를 배열의 인덱스로 변환하여 평균적으로 상수 시간(O(1)) 복잡도로 검색, 삽입, 삭제 작업을 처리할 수 있게 합니다.

### 해시 테이블의 주요 개념:

1. **해시 함수**: 키를 해시로 변환하여 인덱스로 사용.
2. **충돌**: 두 개의 키가 동일한 인덱스를 가리킬 때 발생. 이를 처리하는 일반적인 방법은:
   - **체이닝**: 배열의 각 인덱스가 키-값 쌍 목록을 가리킴.
   - **오픈 어드레싱**: 다른 인덱스를 탐색하는 기법을 사용.
3. **로드 팩터**: 해시 테이블이 얼마나 가득 찼는지를 측정하는 값이며, 이를 통해 테이블 크기를 조정할지 결정합니다.

### 사용 사례:

- **데이터베이스**: 인덱싱을 사용하여 빠른 조회를 지원.
- **캐싱**: 이전에 계산되거나 가져온 데이터를 빠르게 접근하기 위해 사용.
- **심볼 테이블**: 컴파일러나 인터프리터가 변수나 함수 이름을 저장할 때 사용.
- **집합(Set)과 맵(Map)**: Python, JavaScript, Rust 등 여러 프로그래밍 언어에서 집합과 맵의 기본 자료구조로 사용됩니다.

---

### 예시: JavaScript에서의 해시 테이블

JavaScript에서 간단한 해시 테이블 클래스를 구현할 수 있습니다:

```javascript
class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }

  _hash(key) {
    let total = 0;
    let PRIME_NUMBER = 31; // 더 나은 분포를 위해 소수 사용
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      let char = key[i];
      let value = char.charCodeAt(0) - 96;
      total = (total * PRIME_NUMBER + value) % this.keyMap.length;
    }
    return total;
  }

  set(key, value) {
    const index = this._hash(key);
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    this.keyMap[index].push([key, value]);
  }

  get(key) {
    const index = this._hash(key);
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          return this.keyMap[index][i][1];
        }
      }
    }
    return undefined;
  }
}

// 사용 예시:
const ht = new HashTable();
ht.set("hello", "world");
console.log(ht.get("hello")); // 출력: world
```

---

### 예시: Rust에서의 해시 테이블

Rust는 기본적으로 해시 테이블을 제공하지 않지만, `std::collections` 모듈의 `HashMap` 컬렉션을 사용할 수 있습니다. 간단한 예시는 다음과 같습니다:

```rust
use std::collections::HashMap;

fn main() {
    let mut hash_table = HashMap::new();

    // 키-값 쌍 삽입
    hash_table.insert("name", "Alice");
    hash_table.insert("age", "30");

    // 값 접근
    if let Some(name) = hash_table.get("name") {
        println!("Name: {}", name);
    }

    if let Some(age) = hash_table.get("age") {
        println!("Age: {}", age);
    }

    // 키 존재 여부 확인
    if !hash_table.contains_key("address") {
        println!("Address not found");
    }
}
```

이 Rust 예제에서는 `HashMap`을 사용하여 키-값 쌍을 저장하고, 상수 시간의 평균적인 검색 성능을 제공합니다.
