## Hamiltonian Path?

**해밀토니안 경로**(Hamiltonian Path)는 그래프 이론에서, 그래프의 모든 정점을 정확히 한 번씩만 방문하는 경로를 의미합니다. 만약 경로가 첫 번째 정점과 마지막 정점을 동일하게 연결한다면, 이를 **해밀토니안 순환**(Hamiltonian Circuit 또는 Cycle)이라고 부릅니다.

그래프에서 해밀토니안 경로가 반드시 존재하는 것은 아니며, 일반적인 해밀토니안 경로의 존재 여부는 NP-완전 문제입니다. 즉, 해밀토니안 경로가 있는지 확인하는 것은 매우 복잡한 문제일 수 있습니다.

### 사용 사례:

- **여행자 문제**: 여러 도시를 한 번씩만 방문하여 최단 경로를 찾는 문제에서 활용.
- **퍼즐 및 게임**: 퍼즐을 풀기 위해 모든 정점을 한 번씩만 방문하는 문제에서 사용.
- **회로 설계**: 모든 노드를 한 번씩만 방문하여 최적의 회로를 구성하는 문제에 적용.

---

### JavaScript 코드 예시

```javascript
// Helper function to check if all vertices are visited
function isVisitedAll(visited) {
  return visited.every(Boolean);
}

// Function to check if there exists a Hamiltonian Path in a graph
function hamiltonianPath(graph, visited, pos, path) {
  if (path.length === graph.length) {
    return true;
  }

  for (let v = 0; v < graph.length; v++) {
    if (graph[pos][v] === 1 && !visited[v]) {
      visited[v] = true;
      path.push(v);

      if (hamiltonianPath(graph, visited, v, path)) {
        return true;
      }

      visited[v] = false;
      path.pop();
    }
  }
  return false;
}

// Initialize graph as adjacency matrix
const graph = [
  [0, 1, 1, 0],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [0, 1, 1, 0],
];

let visited = Array(graph.length).fill(false);
let path = [];

visited[0] = true;
path.push(0);

if (hamiltonianPath(graph, visited, 0, path)) {
  console.log("Hamiltonian Path found:", path);
} else {
  console.log("No Hamiltonian Path exists.");
}
```

---

### Rust 코드 예시

```rust
fn hamiltonian_path(
    graph: &Vec<Vec<usize>>,
    visited: &mut Vec<bool>,
    pos: usize,
    path: &mut Vec<usize>,
) -> bool {
    if path.len() == graph.len() {
        return true;
    }

    for v in 0..graph.len() {
        if graph[pos][v] == 1 && !visited[v] {
            visited[v] = true;
            path.push(v);

            if hamiltonian_path(graph, visited, v, path) {
                return true;
            }

            visited[v] = false;
            path.pop();
        }
    }
    false
}

fn main() {
    let graph = vec![
        vec![0, 1, 1, 0],
        vec![1, 0, 1, 1],
        vec![1, 1, 0, 1],
        vec![0, 1, 1, 0],
    ];

    let mut visited = vec![false; graph.len()];
    let mut path = Vec::new();

    visited[0] = true;
    path.push(0);

    if hamiltonian_path(&graph, &mut visited, 0, &mut path) {
        println!("Hamiltonian Path found: {:?}", path);
    } else {
        println!("No Hamiltonian Path exists.");
    }
}
```

### 사용 사례:

1. **여행 문제 최적화**: 여러 도시를 방문하는 최적 경로를 찾을 때.
2. **퍼즐 게임**: 퍼즐에서 모든 위치를 한 번씩만 방문하는 문제 해결.
3. **회로 설계**: 복잡한 회로에서 모든 노드를 한 번씩만 거쳐 효율적으로 설계하는 문제 해결.
