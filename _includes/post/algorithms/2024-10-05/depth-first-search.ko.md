## Depth-First Search, DFS?

깊이 우선 탐색(DFS)은 그래프 또는 트리에서 한 노드에서 시작하여 가능한 한 깊이까지 탐색한 후, 더 이상 진행할 수 없으면 되돌아가면서 탐색하는 방법입니다. 주로 스택 자료구조(또는 재귀 호출)를 사용하여 구현되며, 그래프의 모든 노드를 방문하거나 경로를 찾을 때 많이 사용됩니다.

#### **DFS의 작동 방식**:

1. 시작 노드를 선택하고 그 노드를 방문합니다.
2. 현재 노드에서 갈 수 있는 미방문 이웃 노드를 선택하고 그 이웃으로 이동하여 방문합니다.
3. 더 이상 방문할 수 있는 이웃이 없으면 이전 노드로 되돌아갑니다.
4. 모든 노드를 방문할 때까지 이 과정을 반복합니다.

#### **사용 사례**:

- **경로 탐색**: 미로, 퍼즐 등에서 목표 지점까지의 경로를 찾는 데 사용.
- **사이클 탐지**: 그래프가 순환을 포함하는지 여부를 확인할 때 사용.
- **연결 요소 찾기**: 그래프에서 서로 연결된 모든 구성 요소를 찾는 데 유용.
- **강한 연결 요소 탐지**: 방향 그래프에서 강한 연결 요소를 탐색.

---

### **JavaScript 깊이 우선 탐색 예제 코드**

```javascript
// 그래프 표현
const graph = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0],
  3: [1],
  4: [1, 5],
  5: [4],
};

function dfs(graph, start, visited = new Set()) {
  console.log(start); // 방문한 노드 출력
  visited.add(start); // 노드를 방문으로 표시

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

// DFS 실행
dfs(graph, 0); // 출력: 0, 1, 3, 4, 5, 2
```

---

### **Rust 깊이 우선 탐색 예제 코드**

```rust
use std::collections::HashSet;

// 그래프 표현
fn dfs(graph: &Vec<Vec<usize>>, start: usize, visited: &mut HashSet<usize>) {
    println!("{}", start); // 방문한 노드 출력
    visited.insert(start); // 노드를 방문으로 표시

    for &neighbor in &graph[start] {
        if !visited.contains(&neighbor) {
            dfs(graph, neighbor, visited);
        }
    }
}

fn main() {
    // 인접 리스트로 그래프 표현
    let graph = vec![
        vec![1, 2],    // 0번 노드의 이웃
        vec![0, 3, 4], // 1번 노드의 이웃
        vec![0],       // 2번 노드의 이웃
        vec![1],       // 3번 노드의 이웃
        vec![1, 5],    // 4번 노드의 이웃
        vec![4]        // 5번 노드의 이웃
    ];

    let mut visited = HashSet::new();
    dfs(&graph, 0, &mut visited); // 출력: 0, 1, 3, 4, 5, 2
}
```

---

### 요약

깊이 우선 탐색(DFS)은 그래프 탐색에서 널리 사용되는 알고리즘입니다. 재귀나 스택을 사용해 노드를 깊이 우선으로 방문하며, 경로 탐색, 사이클 탐지 등 다양한 문제에서 활용됩니다.
