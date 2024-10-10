## 프림 알고리즘 (Prim's Algorithm)

프림 알고리즘은 **최소 신장 트리 (Minimum Spanning Tree, MST)** 를 구하는 방법 중 하나입니다. 주어진 가중치가 있는 무방향 그래프에서 모든 노드를 연결하는 가장 짧은 경로 집합을 찾는 데 사용됩니다. MST는 실제 네트워크에서 비용을 최소화하는 연결망을 만드는 데 매우 유용합니다.

#### **알고리즘 설명**:

1. 주어진 그래프에서 임의의 노드를 선택해 시작합니다.
2. 선택된 노드에서 인접한 모든 간선 중 가장 작은 가중치의 간선을 선택해 연결합니다.
3. 연결된 새로운 노드를 포함하여, 다시 인접한 모든 간선 중 가장 작은 가중치의 간선을 선택해 트리에 추가합니다.
4. 이 과정을 모든 노드가 연결될 때까지 반복합니다.

프림 알고리즘은 주로 네트워크 설계, 전기 회로, 도로 연결 시스템과 같은 최소한의 비용으로 연결해야 하는 다양한 실제 문제에서 사용됩니다.

---

### **JavaScript 예제**

```javascript
function primMST(graph) {
  const key = new Array(graph.length).fill(Infinity); // 각 노드의 최소 가중치 저장
  const parent = new Array(graph.length).fill(-1); // 각 노드의 부모 노드 저장
  const inMST = new Array(graph.length).fill(false); // MST에 포함 여부

  key[0] = 0; // 시작 노드의 가중치는 0
  for (let count = 0; count < graph.length - 1; count++) {
    let minKey = Infinity,
      u = -1;

    // 최소 가중치의 노드를 선택
    for (let v = 0; v < graph.length; v++) {
      if (!inMST[v] && key[v] < minKey) {
        minKey = key[v];
        u = v;
      }
    }

    inMST[u] = true; // 선택된 노드를 MST에 포함

    // 선택된 노드와 인접한 노드의 가중치를 업데이트
    for (let v = 0; v < graph.length; v++) {
      if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
        key[v] = graph[u][v];
        parent[v] = u;
      }
    }
  }

  // 결과 출력
  for (let i = 1; i < graph.length; i++) {
    console.log(`${parent[i]} - ${i} \t${graph[i][parent[i]]}`);
  }
}

// 예시 그래프 (인접 행렬)
const graph = [
  [0, 2, 0, 6, 0],
  [2, 0, 3, 8, 5],
  [0, 3, 0, 0, 7],
  [6, 8, 0, 0, 9],
  [0, 5, 7, 9, 0],
];

primMST(graph);
```

---

### **Rust 예제**

```rust
use std::cmp::Ordering;
use std::collections::BinaryHeap;

#[derive(Copy, Clone, Eq, PartialEq)]
struct Edge {
    weight: usize,
    node: usize,
}

impl Ord for Edge {
    fn cmp(&self, other: &Self) -> Ordering {
        other.weight.cmp(&self.weight) // 최소 힙으로 사용하기 위해 역순으로 정렬
    }
}

impl PartialOrd for Edge {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn prim_mst(graph: &Vec<Vec<(usize, usize)>>, start: usize) {
    let mut in_mst = vec![false; graph.len()];
    let mut min_heap = BinaryHeap::new();

    min_heap.push(Edge { weight: 0, node: start });

    while let Some(Edge { weight, node }) = min_heap.pop() {
        if in_mst[node] {
            continue;
        }
        in_mst[node] = true;

        println!("선택된 간선: {} (가중치: {})", node, weight);

        for &(neighbor, edge_weight) in &graph[node] {
            if !in_mst[neighbor] {
                min_heap.push(Edge {
                    weight: edge_weight,
                    node: neighbor,
                });
            }
        }
    }
}

fn main() {
    let graph = vec![
        vec![(1, 2), (3, 6)],    // 0번 노드와 연결된 노드들
        vec![(0, 2), (2, 3), (3, 8), (4, 5)], // 1번 노드와 연결된 노드들
        vec![(1, 3), (4, 7)],    // 2번 노드와 연결된 노드들
        vec![(0, 6), (1, 8), (4, 9)], // 3번 노드와 연결된 노드들
        vec![(1, 5), (2, 7), (3, 9)] // 4번 노드와 연결된 노드들
    ];

    prim_mst(&graph, 0);
}
```

### 설명:

- **JavaScript**에서는 인접 행렬을 사용하여 그래프를 표현하고, 각 노드의 최소 가중치를 관리합니다.
- **Rust**에서는 이진 힙을 사용하여 간선의 가중치에 따라 노드를 선택하는 방식으로 최소 신장 트리를 구합니다.

### 사용 예시:

- **네트워크 설계**: 여러 도시를 최소한의 비용으로 연결하는 도로 또는 통신망 설계.
- **전력망 설계**: 최소 비용으로 전기망을 연결.
- **컴퓨터 그래픽**: 그래프 기반의 도형 처리.

프림 알고리즘은 연결된 그래프에서 비용이 최소인 트리를 찾는 문제에서 매우 유용하게 사용됩니다.
