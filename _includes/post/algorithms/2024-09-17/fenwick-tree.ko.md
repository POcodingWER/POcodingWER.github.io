## Fenwick Tree?

**Fenwick Tree**(또는 **Binary Indexed Tree**)는 배열의 값을 효율적으로 업데이트하고, 구간 합(prefix sum)을 빠르게 구할 수 있는 자료구조입니다. 이 자료구조는 다음과 같은 작업을 자주 해야 할 때 유용합니다:

1. **포인트 업데이트**: 배열의 특정 원소 값을 업데이트하는 작업.
2. **구간 합 쿼리**: 배열의 특정 위치까지의 합을 구하는 작업.

Fenwick Tree는 이러한 작업을 **O(log n)** 시간 복잡도로 수행할 수 있는데, 일반적인 배열에서 이 작업을 수행하면 **O(n)** 시간이 걸릴 수 있습니다.

### 사용 예시

- **누적 빈도 테이블**: 구간 합을 계산하는 데 사용.
- **구간 합 쿼리**: 배열에 대한 업데이트와 쿼리를 효율적으로 처리.
- **역전 횟수 세기**: 배열에서 역전된 요소 쌍의 개수를 계산할 때.
- **경쟁 프로그래밍**: Fenwick Tree는 경쟁 프로그래밍에서 구간 쿼리 및 업데이트 문제를 해결하는 데 자주 사용됩니다.

---

### Fenwick Tree 동작 방식

#### 구조:

- Fenwick Tree는 `bit[]`라는 배열에 저장되며, 여기서 `bit[i]`는 배열의 인덱스 `i`까지의 구간 합에 대한 정보를 포함합니다.
- 핵심 개념은 Fenwick Tree의 각 원소가 배열의 특정 부분 집합에 대한 합계를 나타낸다는 것입니다.

#### 작업:

1. **원소 업데이트**: 배열의 특정 원소 값을 업데이트할 때, 이 인덱스를 포함하는 모든 노드를 조정합니다.
2. **구간 합 쿼리**: 배열의 특정 위치까지의 합을 구하려면, 트리를 역방향으로 탐색하여 관련 노드들의 값을 더합니다.

---

### JavaScript

```javascript
class FenwickTree {
  constructor(size) {
    this.bit = new Array(size + 1).fill(0);
    this.size = size;
  }

  // 인덱스 `i`에 `value` 값을 더하는 업데이트
  update(i, value) {
    while (i <= this.size) {
      this.bit[i] += value;
      i += i & -i; // 다음 관련 노드로 이동
    }
  }

  // 1번 인덱스부터 `i`번 인덱스까지의 구간 합
  query(i) {
    let sum = 0;
    while (i > 0) {
      sum += this.bit[i];
      i -= i & -i; // 부모 노드로 이동
    }
    return sum;
  }

  // `l`부터 `r`까지의 구간 합
  rangeQuery(l, r) {
    return this.query(r) - this.query(l - 1);
  }
}

// 사용 예시:
let fenwick = new FenwickTree(10);
fenwick.update(3, 5);
fenwick.update(5, 2);
console.log(fenwick.rangeQuery(1, 5)); // 결과: 7
```

---

### Rust

```rust
struct FenwickTree {
    bit: Vec<i32>,
}

impl FenwickTree {
    // 주어진 크기의 Fenwick Tree 생성
    fn new(size: usize) -> FenwickTree {
        FenwickTree {
            bit: vec![0; size + 1],
        }
    }

    // 인덱스 `i`에 `value` 값을 더하는 업데이트
    fn update(&mut self, mut i: usize, value: i32) {
        while i < self.bit.len() {
            self.bit[i] += value;
            i += i & (!i + 1);  // 다음 관련 노드로 이동
        }
    }

    // 1번 인덱스부터 `i`번 인덱스까지의 구간 합
    fn query(&self, mut i: usize) -> i32 {
        let mut sum = 0;
        while i > 0 {
            sum += self.bit[i];
            i -= i & (!i + 1);  // 부모 노드로 이동
        }
        sum
    }

    // `l`부터 `r`까지의 구간 합
    fn range_query(&self, l: usize, r: usize) -> i32 {
        self.query(r) - self.query(l - 1)
    }
}

fn main() {
    let mut fenwick = FenwickTree::new(10);
    fenwick.update(3, 5);
    fenwick.update(5, 2);
    println!("{}", fenwick.range_query(1, 5));  // 결과: 7
}
```

---

### 핵심 요점:

- **Fenwick Tree**는 업데이트와 쿼리 작업을 로그 시간에 수행하여, 데이터셋에 대한 빈번한 수정 및 쿼리가 필요한 문제에 적합합니다.
- 같은 작업을 할 수 있는 세그먼트 트리 등 다른 자료구조에 비해 구현이 간단하지만, 더하기와 같은 역연산이 가능한 작업에만 사용 가능합니다.
