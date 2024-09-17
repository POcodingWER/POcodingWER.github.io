## Graph?

**그래프**는 정점(또는 노드)과 간선으로 이루어진 비선형 자료구조입니다. 각 간선은 두 개의 정점을 연결하며, 방향이 있을 수도(유방향 그래프) 없을 수도(무방향 그래프) 있습니다. 그래프는 소셜 네트워크, 도로 지도, 컴퓨터 네트워크 같은 네트워크를 표현할 때 자주 사용됩니다.

#### 그래프의 구성 요소

1. **정점(노드)**: 객체나 개체를 나타냅니다.
2. **간선**: 정점 간의 연결을 나타내며, 간선은 **유방향** 또는 **무방향**일 수 있습니다.

그래프는 간선의 가중치 여부에 따라 다음과 같이 나뉩니다:

- **가중치 그래프**: 각 간선에 가중치(비용)가 있습니다.
- **비가중치 그래프**: 모든 간선의 가중치가 동일합니다.

---

### 그래프의 사용 예시

1. **소셜 네트워크**: 사용자들을 정점으로, 사용자 간의 관계(친구)를 간선으로 나타냅니다.
2. **도로망**: 도시나 교차로를 정점으로, 도로를 간선으로 나타냅니다 (거리를 가중치로 할 수 있음).
3. **인터넷/컴퓨터 네트워크**: 컴퓨터나 라우터를 정점으로, 네트워크 연결을 간선으로 나타냅니다.
4. **의존성 그래프**: 작업 간의 의존성을 나타낼 때 사용합니다 (예: 프로젝트에서의 작업 흐름).
5. **추천 시스템**: 제품이나 항목을 정점으로, 유사성을 간선으로 나타냅니다.

---

### 그래프 표현 방법

그래프는 두 가지 일반적인 방식으로 표현됩니다:

1. **인접 행렬**: 2D 배열로, `matrix[i][j]`는 정점 `i`와 정점 `j` 사이에 간선이 있는지를 나타냅니다 (가중치가 있을 경우 가중치를 나타냄).
2. **인접 리스트**: 리스트의 리스트(또는 맵)로, 각 인덱스는 정점을 나타내고, 그 정점과 연결된 정점들의 리스트를 포함합니다.

---

### JavaScript로 구현한 그래프

다음은 JavaScript로 인접 리스트를 사용해 구현한 간단한 그래프 예시입니다:

```javascript
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  // 그래프에 정점 추가
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  // 두 정점 간에 간선 추가 (무방향 그래프)
  addEdge(vertex1, vertex2) {
    this.adjacencyList.get(vertex1).push(vertex2);
    this.adjacencyList.get(vertex2).push(vertex1);
  }

  // 인접 리스트 출력
  printGraph() {
    for (let [vertex, edges] of this.adjacencyList) {
      console.log(`${vertex} -> ${edges.join(", ")}`);
    }
  }

  // 깊이 우선 탐색(DFS)
  dfs(start) {
    let visited = new Set();
    this._dfsHelper(start, visited);
  }

  _dfsHelper(vertex, visited) {
    if (visited.has(vertex)) return;

    visited.add(vertex);
    console.log(vertex);

    for (let neighbor of this.adjacencyList.get(vertex)) {
      this._dfsHelper(neighbor, visited);
    }
  }
}

// 사용 예시
let graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "C");

graph.printGraph(); // 출력: A -> B, C, B -> A, C, C -> A, B
graph.dfs("A"); // 출력: A B C
```

#### 설명:

- 그래프는 JavaScript의 `Map`을 사용하여 인접 리스트로 구현되었습니다.
- `addVertex` 메서드는 그래프에 새 정점을 추가합니다.
- `addEdge` 메서드는 두 정점을 연결합니다(무방향 그래프의 경우 두 방향 모두 추가).
- 깊이 우선 탐색(DFS)을 재귀적으로 구현했습니다.

---

### Rust로 구현한 그래프

다음은 Rust에서 인접 리스트를 사용해 구현한 무방향 그래프 예시입니다:

```rust
use std::collections::{HashMap, HashSet};

struct Graph {
    adjacency_list: HashMap<String, Vec<String>>,
}

impl Graph {
    // 새로운 그래프 생성
    fn new() -> Graph {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }

    // 그래프에 정점 추가
    fn add_vertex(&mut self, vertex: String) {
        self.adjacency_list.entry(vertex).or_insert(Vec::new());
    }

    // 두 정점 간에 간선 추가 (무방향 그래프)
    fn add_edge(&mut self, vertex1: String, vertex2: String) {
        self.adjacency_list.get_mut(&vertex1).unwrap().push(vertex2.clone());
        self.adjacency_list.get_mut(&vertex2).unwrap().push(vertex1.clone());
    }

    // 인접 리스트 출력
    fn print_graph(&self) {
        for (vertex, edges) in &self.adjacency_list {
            println!("{} -> {:?}", vertex, edges);
        }
    }

    // 깊이 우선 탐색(DFS)
    fn dfs(&self, start: &String) {
        let mut visited = HashSet::new();
        self._dfs_helper(start, &mut visited);
    }

    fn _dfs_helper(&self, vertex: &String, visited: &mut HashSet<String>) {
        if visited.contains(vertex) {
            return;
        }

        visited.insert(vertex.clone());
        println!("{}", vertex);

        for neighbor in &self.adjacency_list[vertex] {
            self._dfs_helper(neighbor, visited);
        }
    }
}

fn main() {
    let mut graph = Graph::new();
    graph.add_vertex("A".to_string());
    graph.add_vertex("B".to_string());
    graph.add_vertex("C".to_string());

    graph.add_edge("A".to_string(), "B".to_string());
    graph.add_edge("A".to_string(), "C".to_string());
    graph.add_edge("B".to_string(), "C".to_string());

    graph.print_graph(); // 출력: A -> ["B", "C"], B -> ["A", "C"], C -> ["A", "B"]
    graph.dfs(&"A".to_string());  // 출력: A B C
}
```

#### 설명:

- 그래프는 `HashMap`을 사용하여 인접 리스트로 구현되었습니다. 각 정점은 키로, 연결된 정점들의 리스트는 값으로 저장됩니다.
- `add_vertex` 메서드는 새 정점을 추가하고, `add_edge` 메서드는 두 정점 간에 무방향 간선을 추가합니다.
- DFS 탐색은 재귀를 통해 간단하게 구현되었습니다.

---

### 핵심 요점:

- **그래프**는 객체 간의 관계 또는 연결을 모델링하는 강력한 자료구조입니다.
- 소셜 네트워크, 네트워크 경로, 경로 문제 해결 등 현실 세계의 많은 문제에 널리 사용됩니다.
- **DFS**, **BFS**, **다익스트라**, **크루스칼** 등 다양한 알고리즘을 그래프에서 사용하여 최단 경로, 연결성 등을 해결할 수 있습니다.
