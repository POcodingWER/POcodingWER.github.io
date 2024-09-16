## Segment Tree?

**세그먼트 트리(Segment Tree)**는 구간 쿼리를 효율적으로 처리하는 자료 구조입니다. 특히 배열 내 요소들에 대한 업데이트가 빈번하게 발생하는 경우 유용합니다. 세그먼트 트리는 업데이트와 쿼리 모두 로그 시간에 처리할 수 있어, 알고리즘 문제에서 많이 사용됩니다.

### 세그먼트 트리의 주요 연산:

1. **트리 생성**: 배열로부터 세그먼트 트리를 생성합니다.
2. **구간 쿼리**: 특정 구간 내의 요소들에 대한 함수(예: 합, 최소값, 최대값 등)를 구합니다.
3. **점 업데이트**: 배열의 특정 요소를 업데이트하고, 트리가 자동으로 이 변경을 반영합니다.

### 구조:

- 세그먼트 트리는 이진 트리로, 각 노드는 배열의 구간을 나타냅니다.
- 루트는 배열 전체를 나타내며, 자식 노드는 부모 구간의 절반을 나타냅니다.

### 사용 사례:

- **구간 합 쿼리**: 특정 구간의 요소 합을 빠르게 계산할 수 있습니다.
- **구간 최소/최대 쿼리**: 특정 구간의 최소 또는 최대 값을 찾을 수 있습니다.
- **동적 프로그래밍**: 세그먼트 트리는 구간이나 범위를 자주 쿼리 또는 업데이트해야 하는 최적화 문제에서 사용됩니다.

### 시간 복잡도:

- **쿼리와 업데이트**: O(log n), 여기서 n은 배열의 요소 개수입니다.

---

### JavaScript 예제 (구간 합 트리):

```javascript
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(2 * this.n);
    this.build(arr);
  }

  // 트리를 배열로부터 생성
  build(arr) {
    for (let i = 0; i < this.n; i++) {
      this.tree[this.n + i] = arr[i];
    }
    for (let i = this.n - 1; i > 0; --i) {
      this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];
    }
  }

  // 특정 위치 p의 값을 업데이트
  update(p, value) {
    p += this.n;
    this.tree[p] = value;
    while (p > 1) {
      p >>= 1;
      this.tree[p] = this.tree[2 * p] + this.tree[2 * p + 1];
    }
  }

  // 구간 [l, r)의 합을 쿼리
  query(l, r) {
    l += this.n;
    r += this.n;
    let sum = 0;
    while (l < r) {
      if (l & 1) {
        sum += this.tree[l++];
      }
      if (r & 1) {
        sum += this.tree[--r];
      }
      l >>= 1;
      r >>= 1;
    }
    return sum;
  }
}

// 사용 예시
const arr = [1, 2, 3, 4, 5];
const segTree = new SegmentTree(arr);

console.log(segTree.query(1, 4)); // 인덱스 1부터 3까지 합 => 9
segTree.update(2, 10); // 인덱스 2의 값을 10으로 업데이트
console.log(segTree.query(1, 4)); // 인덱스 1부터 3까지 합 => 16
```

---

### Rust 예제 (구간 합 트리):

```rust
struct SegmentTree {
    n: usize,
    tree: Vec<i32>,
}

impl SegmentTree {
    fn new(arr: Vec<i32>) -> SegmentTree {
        let n = arr.len();
        let mut tree = vec![0; 2 * n];
        let mut seg_tree = SegmentTree { n, tree };
        seg_tree.build(arr);
        seg_tree
    }

    // 트리를 배열로부터 생성
    fn build(&mut self, arr: Vec<i32>) {
        for i in 0..self.n {
            self.tree[self.n + i] = arr[i];
        }
        for i in (1..self.n).rev() {
            self.tree[i] = self.tree[i * 2] + self.tree[i * 2 + 1];
        }
    }

    // 특정 위치 p의 값을 업데이트
    fn update(&mut self, mut p: usize, value: i32) {
        p += self.n;
        self.tree[p] = value;
        while p > 1 {
            p /= 2;
            self.tree[p] = self.tree[2 * p] + self.tree[2 * p + 1];
        }
    }

    // 구간 [l, r)의 합을 쿼리
    fn query(&self, mut l: usize, mut r: usize) -> i32 {
        l += self.n;
        r += self.n;
        let mut sum = 0;
        while l < r {
            if l % 2 == 1 {
                sum += self.tree[l];
                l += 1;
            }
            if r % 2 == 1 {
                r -= 1;
                sum += self.tree[r];
            }
            l /= 2;
            r /= 2;
        }
        sum
    }
}

fn main() {
    let arr = vec![1, 2, 3, 4, 5];
    let mut seg_tree = SegmentTree::new(arr);

    println!("{}", seg_tree.query(1, 4)); // 인덱스 1부터 3까지 합 => 9
    seg_tree.update(2, 10); // 인덱스 2의 값을 10으로 업데이트
    println!("{}", seg_tree.query(1, 4)); // 인덱스 1부터 3까지 합 => 16
}
```

두 예제에서 세그먼트 트리는 구간 합 쿼리 및 점 업데이트를 효율적으로 수행하며, 배열을 자주 업데이트하거나 쿼리해야 하는 경우에 매우 유용한 자료 구조임을 보여줍니다.
