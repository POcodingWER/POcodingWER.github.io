## 크루스칼 알고리즘(Kruskal’s Algorithm)

**크루스칼 알고리즘(Kruskal's Algorithm)**은 최소 신장 트리(Minimum Spanning Tree, MST)를 찾기 위한 탐욕 알고리즘입니다. 그래프의 모든 정점을 최소 비용으로 연결하는 신장 트리를 구하는 것이 목적입니다. 탐욕 알고리즘은 매 단계에서 가장 작은 가중치를 가진 간선을 선택하여 진행하며, 사이클이 발생하지 않도록 주의합니다.

#### **크루스칼 알고리즘의 동작 원리**:

1. **모든 간선을 오름차순으로 정렬**: 그래프의 모든 간선을 가중치에 따라 오름차순으로 정렬합니다.
2. **간선 선택**: 가장 작은 가중치의 간선부터 하나씩 선택합니다.
3. **사이클 체크**: 선택한 간선이 사이클을 형성하지 않으면 해당 간선을 최소 신장 트리에 추가합니다. 사이클을 형성하면 해당 간선을 버립니다.
4. **종료**: 모든 정점이 연결될 때까지 위 과정을 반복합니다.

#### **어디에 사용하는가?**:

- **네트워크 연결**: 여러 컴퓨터나 네트워크 노드를 최소한의 비용으로 연결할 때 사용됩니다.
- **도로, 통신 인프라**: 도로나 통신망을 최소 비용으로 설계하는 문제에 적용될 수 있습니다.

---

### **JavaScript 크루스칼 알고리즘 예제**

```javascript
class UnionFind {
  constructor(size) {
    this.parent = Array(size)
      .fill()
      .map((_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX] += 1;
      }
    }
  }
}

function kruskalMST(graph, numVertices) {
  const edges = graph.sort((a, b) => a[2] - b[2]); // 간선을 가중치에 따라 정렬
  const uf = new UnionFind(numVertices);
  const mst = [];

  for (let [u, v, weight] of edges) {
    if (uf.find(u) !== uf.find(v)) {
      // 사이클이 없을 때
      uf.union(u, v); // 두 정점을 연결
      mst.push([u, v, weight]);
    }
  }

  return mst;
}

// 간선 (정점 1, 정점 2, 가중치)
const graph = [
  [0, 1, 10],
  [0, 2, 6],
  [0, 3, 5],
  [1, 3, 15],
  [2, 3, 4],
];

const mst = kruskalMST(graph, 4);
console.log(mst); // [[2, 3, 4], [0, 3, 5], [0, 1, 10]]
```

---

### **Rust 크루스칼 알고리즘 예제**

```rust
#[derive(Clone)]
struct Edge {
    u: usize,
    v: usize,
    weight: usize,
}

fn find(parent: &mut Vec<usize>, x: usize) -> usize {
    if parent[x] != x {
        parent[x] = find(parent, parent[x]);
    }
    parent[x]
}

fn union(parent: &mut Vec<usize>, rank: &mut Vec<usize>, x: usize, y: usize) {
    let root_x = find(parent, x);
    let root_y = find(parent, y);

    if root_x != root_y {
        if rank[root_x] > rank[root_y] {
            parent[root_y] = root_x;
        } else if rank[root_x] < rank[root_y] {
            parent[root_x] = root_y;
        } else {
            parent[root_y] = root_x;
            rank[root_x] += 1;
        }
    }
}

fn kruskal_mst(mut edges: Vec<Edge>, num_vertices: usize) -> Vec<Edge> {
    edges.sort_by(|a, b| a.weight.cmp(&b.weight)); // 간선을 가중치에 따라 정렬
    let mut parent: Vec<usize> = (0..num_vertices).collect();
    let mut rank = vec![0; num_vertices];
    let mut mst = Vec::new();

    for edge in edges {
        if find(&mut parent, edge.u) != find(&mut parent, edge.v) { // 사이클이 없을 때
            union(&mut parent, &mut rank, edge.u, edge.v); // 두 정점을 연결
            mst.push(edge);
        }
    }

    mst
}

fn main() {
    let edges = vec![
        Edge { u: 0, v: 1, weight: 10 },
        Edge { u: 0, v: 2, weight: 6 },
        Edge { u: 0, v: 3, weight: 5 },
        Edge { u: 1, v: 3, weight: 15 },
        Edge { u: 2, v: 3, weight: 4 },
    ];

    let mst = kruskal_mst(edges, 4);
    for edge in mst {
        println!("Edge: {} - {} with weight {}", edge.u, edge.v, edge.weight);
    }
}
```

---

### 요약

크루스칼 알고리즘은 그래프의 모든 정점을 최소 비용으로 연결하는 최소 신장 트리를 구하는 탐욕 알고리즘입니다. 네트워크 설계나 최소 비용으로 인프라를 연결하는 문제에 사용되며, 간선을 가중치에 따라 정렬한 후 사이클이 발생하지 않는 한 간선을 선택해나가는 방식으로 동작합니다.
