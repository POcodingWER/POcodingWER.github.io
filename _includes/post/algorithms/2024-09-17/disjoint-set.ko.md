### Disjoint Set?

**분리 집합**(Disjoint Set, **유니언 파인드**라고도 불림)은 중복되지 않는 여러 개의 집합을 관리하는 자료구조입니다. 이 자료구조는 두 가지 주요 연산을 제공합니다:

1. **Find**: 특정 요소가 속한 집합(또는 대표자)을 찾습니다.
2. **Union**: 두 개의 집합을 하나로 합칩니다.

이 자료구조는 **동적 연결성** 문제를 해결할 때 매우 유용하며, 두 요소가 같은 집합에 속해 있는지 또는 다른 집합에 속해 있는지 효율적으로 판별할 수 있습니다.

### 분리 집합의 구성 요소

1. **부모 배열**: 각 요소는 자신의 부모를 가리키며, 자신을 가리킬 경우 그 요소는 집합의 대표자(또는 루트)입니다.
2. **랭크에 따른 Union**: 두 집합을 합칠 때, 더 작은 트리를 더 큰 트리 아래에 병합하여 구조의 균형을 유지합니다.
3. **경로 압축**: `find` 연산을 수행할 때, 각 노드에서 루트로 가는 경로를 평탄화하여 이후의 `find` 연산을 더 빠르게 처리합니다.

### 사용 사례

- **그래프의 연결된 컴포넌트 찾기**: 두 정점이 같은 연결 컴포넌트에 속해 있는지 판별.
- **그래프에서 사이클 감지**: 무향 그래프에서 사이클이 있는지 확인.
- **최소 신장 트리(크루스칼 알고리즘)**: 효율적으로 최소 신장 트리(MST)를 찾는 데 사용.
- **동적 연결 문제**: 동적인 네트워크에서 연결된 컴포넌트를 추적하는 문제.

### 시간 복잡도

분리 집합의 연산(Find와 Union)은 거의 상수 시간 복잡도인 **O(α(n))**을 가집니다. 여기서 α(n)은 매우 천천히 증가하는 역 아커만 함수입니다.

---

### JavaScript로 구현한 분리 집합

다음은 경로 압축과 랭크에 따른 유니언이 포함된 JavaScript 구현 예시입니다:

```javascript
class DisjointSet {
  constructor(size) {
    this.parent = new Array(size);
    this.rank = new Array(size).fill(0);

    // 각 요소가 자기 자신을 부모로 가지도록 초기화
    for (let i = 0; i < size; i++) {
      this.parent[i] = i;
    }
  }

  // 경로 압축을 사용해 'x'가 속한 집합의 루트를 찾음
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 경로 압축
    }
    return this.parent[x];
  }

  // 랭크에 따른 유니언
  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX !== rootY) {
      // 랭크에 따른 유니언: 작은 트리를 큰 트리 아래에 병합
      if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
    }
  }

  // 두 요소가 같은 집합에 속해 있는지 확인
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

// 사용 예시:
let ds = new DisjointSet(5); // 0부터 4까지 5개의 분리 집합 생성

ds.union(0, 1);
ds.union(1, 2);
console.log(ds.connected(0, 2)); // 출력: true
console.log(ds.connected(0, 3)); // 출력: false
ds.union(3, 4);
console.log(ds.connected(3, 4)); // 출력: true
```

#### 설명:

- `find` 메서드는 주어진 요소의 루트를 찾아 경로 압축을 적용해 트리를 평탄화합니다.
- `union` 메서드는 두 집합을 병합하며, 트리의 균형을 유지하기 위해 랭크를 사용합니다.
- `connected`는 두 요소가 같은 집합에 속해 있는지를 확인합니다.

---

### Rust로 구현한 분리 집합

다음은 경로 압축과 랭크에 따른 유니언이 포함된 Rust 구현 예시입니다:

```rust
struct DisjointSet {
    parent: Vec<usize>,
    rank: Vec<usize>,
}

impl DisjointSet {
    // 'size' 개의 요소를 가진 새로운 분리 집합 생성
    fn new(size: usize) -> DisjointSet {
        let mut parent = Vec::with_capacity(size);
        for i in 0..size {
            parent.push(i);
        }
        DisjointSet {
            parent,
            rank: vec![0; size],
        }
    }

    // 경로 압축을 사용해 'x'가 속한 집합의 루트를 찾음
    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            self.parent[x] = self.find(self.parent[x]);  // 경로 압축
        }
        self.parent[x]
    }

    // 랭크에 따른 유니언
    fn union(&mut self, x: usize, y: usize) {
        let root_x = self.find(x);
        let root_y = self.find(y);

        if root_x != root_y {
            // 랭크에 따른 유니언: 작은 트리를 큰 트리 아래에 병합
            if self.rank[root_x] > self.rank[root_y] {
                self.parent[root_y] = root_x;
            } else if self.rank[root_x] < self.rank[root_y] {
                self.parent[root_x] = root_y;
            } else {
                self.parent[root_y] = root_x;
                self.rank[root_x] += 1;
            }
        }
    }

    // 두 요소가 같은 집합에 속해 있는지 확인
    fn connected(&mut self, x: usize, y: usize) -> bool {
        self.find(x) == self.find(y)
    }
}

fn main() {
    let mut ds = DisjointSet::new(5);  // 0부터 4까지 5개의 분리 집합 생성

    ds.union(0, 1);
    ds.union(1, 2);
    println!("{}", ds.connected(0, 2));  // 출력: true
    println!("{}", ds.connected(0, 3));  // 출력: false
    ds.union(3, 4);
    println!("{}", ds.connected(3, 4));  // 출력: true
}
```

#### 설명:

- `find`는 경로 압축을 사용해 트리 구조를 평탄화하여 더 효율적인 탐색을 제공합니다.
- `union`은 랭크를 사용하여 더 작은 트리를 더 큰 트리 아래에 병합합니다.
- `connected` 함수는 두 요소가 같은 집합에 속해 있는지를 확인합니다.

---

### 핵심 요점:

- **분리 집합**은 동적인 환경에서 집합을 관리하고 병합하는 효율적인 자료구조입니다.
- **크루스칼의 최소 신장 트리**나 **사이클 감지**와 같은 그래프 관련 알고리즘에서 자주 사용됩니다.
- **경로 압축**과 **랭크에 따른 유니언**을 통해 `find`와 `union` 연산은 거의 상수 시간 복잡도를 달성합니다.
