## Strongly Connected Components (SCC)?

**Strongly Connected Component(SCC)**는 방향성 그래프(Directed Graph)에서, 모든 정점들이 서로 도달 가능한 서브그래프(subgraph)를 말합니다. 즉, 한 정점에서 시작해서 다른 모든 정점에 도달할 수 있고, 그 반대 방향으로도 모든 정점에 도달할 수 있는 경우입니다. 이는 유향 그래프의 연결성을 분석하는 데 중요한 개념입니다.

SCC는 다양한 분야에서 사용됩니다:

1. **웹 크롤링**: 웹 페이지들이 서로 연결되어 있는 방식 분석.
2. **컴파일러**: 모듈 간의 종속성 분석.
3. **회로 설계**: 전자 회로의 연결성을 분석하는 데 사용.

SCC를 찾는 대표적인 알고리즘은 **Kosaraju's Algorithm**과 **Tarjan's Algorithm**입니다.

---

### JavaScript 예제 코드 (Kosaraju's Algorithm)

```javascript
// 깊이 우선 탐색 함수
function dfs(graph, v, visited, stack) {
  visited[v] = true;

  for (let i of graph[v]) {
    if (!visited[i]) {
      dfs(graph, i, visited, stack);
    }
  }
  stack.push(v);
}

// 역방향 깊이 우선 탐색
function reverseDfs(graph, v, visited, component) {
  visited[v] = true;
  component.push(v);

  for (let i of graph[v]) {
    if (!visited[i]) {
      reverseDfs(graph, i, visited, component);
    }
  }
}

// SCC를 찾는 함수 (Kosaraju's Algorithm)
function findSCC(graph) {
  let stack = [];
  let visited = new Array(graph.length).fill(false);

  // 1단계: 정방향 그래프에서 DFS
  for (let i = 0; i < graph.length; i++) {
    if (!visited[i]) {
      dfs(graph, i, visited, stack);
    }
  }

  // 그래프를 역전환
  let reverseGraph = Array.from(Array(graph.length), () => []);
  for (let v = 0; v < graph.length; v++) {
    for (let u of graph[v]) {
      reverseGraph[u].push(v);
    }
  }

  // 2단계: 역방향 그래프에서 DFS
  visited.fill(false);
  let sccList = [];

  while (stack.length) {
    let v = stack.pop();
    if (!visited[v]) {
      let component = [];
      reverseDfs(reverseGraph, v, visited, component);
      sccList.push(component);
    }
  }

  return sccList;
}

// 그래프 정의
const graph = [[1], [2], [0, 3], [4], [5], [3]];

const scc = findSCC(graph);
console.log("Strongly Connected Components:", scc);
```

---

### Rust 예제 코드 (Kosaraju's Algorithm)

```rust
fn dfs(v: usize, graph: &Vec<Vec<usize>>, visited: &mut Vec<bool>, stack: &mut Vec<usize>) {
    visited[v] = true;
    for &i in &graph[v] {
        if !visited[i] {
            dfs(i, graph, visited, stack);
        }
    }
    stack.push(v);
}

fn reverse_dfs(v: usize, reverse_graph: &Vec<Vec<usize>>, visited: &mut Vec<bool>, component: &mut Vec<usize>) {
    visited[v] = true;
    component.push(v);
    for &i in &reverse_graph[v] {
        if !visited[i] {
            reverse_dfs(i, reverse_graph, visited, component);
        }
    }
}

fn find_scc(graph: Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    let mut stack = Vec::new();
    let mut visited = vec![false; graph.len()];

    // 1단계: 정방향 그래프에서 DFS
    for v in 0..graph.len() {
        if !visited[v] {
            dfs(v, &graph, &mut visited, &mut stack);
        }
    }

    // 그래프를 역전환
    let mut reverse_graph = vec![Vec::new(); graph.len()];
    for v in 0..graph.len() {
        for &u in &graph[v] {
            reverse_graph[u].push(v);
        }
    }

    // 2단계: 역방향 그래프에서 DFS
    visited.fill(false);
    let mut scc_list = Vec::new();

    while let Some(v) = stack.pop() {
        if !visited[v] {
            let mut component = Vec::new();
            reverse_dfs(v, &reverse_graph, &mut visited, &mut component);
            scc_list.push(component);
        }
    }

    scc_list
}

fn main() {
    let graph = vec![
        vec![1],
        vec![2],
        vec![0, 3],
        vec![4],
        vec![5],
        vec![3]
    ];

    let scc = find_scc(graph);
    println!("Strongly Connected Components: {:?}", scc);
}
```

### 사용 예시:

- **웹 그래프 분석**: 여러 웹 페이지들이 상호 연결되어 있는지 분석.
- **프로그램 모듈 분석**: 코드의 모듈 간의 의존성을 파악하는 데 사용.
- **네트워크 분석**: 네트워크의 강한 연결 성분을 찾고, 끊기지 않는 서브네트워크를 분석.

---

이 코드는 Kosaraju의 알고리즘을 사용하여 Strongly Connected Components를 찾는 방법을 보여줍니다.
