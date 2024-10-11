## Bridges in Graph

**Bridge(다리)**는 그래프 내의 간선(edge) 중 하나로, 이 간선을 제거하면 그래프가 둘 이상의 부분으로 분리됩니다. Bridge는 네트워크의 취약한 연결을 찾아내는 데 매우 유용합니다. 즉, 네트워크에서 끊기면 전체 연결이 망가지는 중요한 연결을 찾아내는 데 사용됩니다.

### 사용 사례:

1. **네트워크 보안**: 네트워크에서 가장 중요한 연결(간선)을 찾아서 그 연결을 보강하거나 감시하는 데 사용할 수 있습니다.
2. **교통 시스템**: 도로 네트워크에서 특정 도로(간선)가 없어지면 시스템이 분리되는 경우 그 도로가 Bridge로 간주될 수 있습니다.
3. **인터넷 망 관리**: 네트워크에서 특정 링크가 없어지면 네트워크가 분리될 수 있으므로, 이를 찾아내어 네트워크 관리를 할 수 있습니다.

---

### JavaScript 코드 예제

```javascript
// Bridge 찾기 위한 DFS 보조 함수
function bridgeUtil(u, visited, disc, low, parent, graph, bridges) {
  let children = 0;
  visited[u] = true;
  disc[u] = low[u] = ++time;

  // 모든 인접 정점을 탐색
  for (let v of graph[u]) {
    if (!visited[v]) {
      parent[v] = u;
      children++;
      bridgeUtil(v, visited, disc, low, parent, graph, bridges);

      // 자식 트리가 조상으로 돌아갈 수 있는지 체크
      low[u] = Math.min(low[u], low[v]);

      // low 값이 더 크면 Bridge
      if (low[v] > disc[u]) {
        bridges.push([u, v]);
      }
    } else if (v != parent[u]) {
      low[u] = Math.min(low[u], disc[v]);
    }
  }
}

// Bridge 찾기 위한 메인 함수
function findBridges(graph, V) {
  let visited = new Array(V).fill(false);
  let disc = new Array(V).fill(-1);
  let low = new Array(V).fill(-1);
  let parent = new Array(V).fill(-1);
  let bridges = [];

  for (let i = 0; i < V; i++) {
    if (!visited[i]) {
      bridgeUtil(i, visited, disc, low, parent, graph, bridges);
    }
  }

  return bridges;
}

// 그래프 정의 및 Bridge 찾기
let graph = [
  [1, 2], // Node 0
  [0, 2, 3], // Node 1
  [0, 1], // Node 2
  [1, 4], // Node 3
  [3], // Node 4
];
let V = graph.length;
let bridges = findBridges(graph, V);
console.log("Bridges in the graph: ", bridges);
```

---

### Rust 코드 예제

```rust
use std::cmp;
use std::collections::HashSet;

// Bridge 찾기 위한 DFS 보조 함수
fn bridge_util(
    u: usize,
    visited: &mut Vec<bool>,
    disc: &mut Vec<i32>,
    low: &mut Vec<i32>,
    parent: &mut Vec<i32>,
    graph: &Vec<Vec<usize>>,
    bridges: &mut Vec<(usize, usize)>,
    time: &mut i32,
) {
    visited[u] = true;
    *time += 1;
    disc[u] = *time;
    low[u] = *time;

    for &v in &graph[u] {
        if !visited[v] {
            parent[v] = u as i32;
            bridge_util(v, visited, disc, low, parent, graph, bridges, time);

            low[u] = cmp::min(low[u], low[v]);

            if low[v] > disc[u] {
                bridges.push((u, v));
            }
        } else if v != parent[u] as usize {
            low[u] = cmp::min(low[u], disc[v]);
        }
    }
}

// Bridge 찾기 위한 메인 함수
fn find_bridges(graph: &Vec<Vec<usize>>, V: usize) -> Vec<(usize, usize)> {
    let mut visited = vec![false; V];
    let mut disc = vec![-1; V];
    let mut low = vec![-1; V];
    let mut parent = vec![-1; V];
    let mut bridges = vec![];
    let mut time = 0;

    for i in 0..V {
        if !visited[i] {
            bridge_util(i, &mut visited, &mut disc, &mut low, &mut parent, &graph, &mut bridges, &mut time);
        }
    }

    bridges
}

fn main() {
    let graph = vec![
        vec![1, 2],    // Node 0
        vec![0, 2, 3], // Node 1
        vec![0, 1],    // Node 2
        vec![1, 4],    // Node 3
        vec![3],       // Node 4
    ];
    let V = graph.len();
    let bridges = find_bridges(&graph, V);
    println!("Bridges in the graph: {:?}", bridges);
}
```

### **사용 사례**

- **네트워크 관리**: 네트워크에서 Bridge를 찾아서 네트워크의 안정성을 강화하거나, 네트워크 분리 문제를 방지할 수 있습니다.
- **교통망 분석**: 특정 도로가 없어졌을 때 교통망의 일부가 분리될 수 있으므로, 그 도로가 Bridge인지 분석하여 대체 경로를 설정할 수 있습니다.
- **통신 네트워크**: 주요 통신 라인을 찾아 그 라인의 안정성을 보장하고, 사고 발생 시 빠른 대응이 가능하도록 사용할 수 있습니다.

Bridges는 그래프의 중요한 연결성을 분석하는데 필수적이며, 네트워크의 취약점을 찾아내는 데 활용됩니다.
