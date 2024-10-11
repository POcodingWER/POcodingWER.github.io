## Articulation Points?

**Articulation Points(단절점)**는 그래프 이론에서, 무방향 그래프에서 **해당 노드를 제거할 경우 그래프가 둘 이상의 컴포넌트로 분리되는 노드**를 의미합니다. 이는 그래프의 연결성을 유지하는 데 중요한 역할을 합니다. 이 개념은 네트워크 안정성 분석, 전기 회로 분석, 도로망 분석 등 여러 분야에서 사용됩니다.

**사용 예**:

1. **네트워크 연결성**: 네트워크의 취약점을 찾아 특정 노드가 제거되었을 때 네트워크가 분리될 수 있는지 확인.
2. **전기 회로**: 중요한 노드를 제거했을 때 회로의 흐름이 끊기는 지점을 찾아내는 데 사용.
3. **도로망 분석**: 중요한 교차로를 찾거나, 그 교차로가 없어졌을 때 교통망이 어떻게 영향을 받는지 분석.

---

### JavaScript 예제 코드

```javascript
// DFS를 사용하여 단절점을 찾는 함수
function articulationPointsUtil(u, visited, disc, low, parent, ap, graph) {
  let children = 0;
  visited[u] = true;
  disc[u] = low[u] = ++time;

  // 인접한 모든 정점을 순회
  for (let v of graph[u]) {
    if (!visited[v]) {
      children++;
      parent[v] = u;
      articulationPointsUtil(v, visited, disc, low, parent, ap, graph);

      // 자식 노드의 최소 도달 시간을 확인
      low[u] = Math.min(low[u], low[v]);

      // root가 아니고 자식이 다른 컴포넌트에 연결되지 않은 경우
      if (parent[u] == -1 && children > 1) ap[u] = true;
      if (parent[u] != -1 && low[v] >= disc[u]) ap[u] = true;
    } else if (v != parent[u]) {
      low[u] = Math.min(low[u], disc[v]);
    }
  }
}

// 그래프에서 단절점을 찾는 메인 함수
function findArticulationPoints(graph, V) {
  let visited = new Array(V).fill(false);
  let disc = new Array(V).fill(-1);
  let low = new Array(V).fill(-1);
  let parent = new Array(V).fill(-1);
  let ap = new Array(V).fill(false);

  for (let i = 0; i < V; i++) {
    if (!visited[i])
      articulationPointsUtil(i, visited, disc, low, parent, ap, graph);
  }

  for (let i = 0; i < V; i++) {
    if (ap[i]) console.log(`Articulation point: ${i}`);
  }
}

// 그래프 생성 및 단절점 찾기
let graph = [
  [1, 2], // Node 0
  [0, 2, 3], // Node 1
  [0, 1], // Node 2
  [1, 4], // Node 3
  [3], // Node 4
];
let V = graph.length;
findArticulationPoints(graph, V);
```

### Rust 예제 코드

```rust
use std::cmp;
use std::collections::HashSet;

// DFS를 사용하여 단절점을 찾는 함수
fn articulation_points_util(
    u: usize,
    visited: &mut Vec<bool>,
    disc: &mut Vec<i32>,
    low: &mut Vec<i32>,
    parent: &mut Vec<i32>,
    ap: &mut HashSet<usize>,
    graph: &Vec<Vec<usize>>,
    time: &mut i32,
) {
    let mut children = 0;
    visited[u] = true;
    *time += 1;
    disc[u] = *time;
    low[u] = *time;

    for &v in &graph[u] {
        if !visited[v] {
            children += 1;
            parent[v] = u as i32;
            articulation_points_util(v, visited, disc, low, parent, ap, graph, time);

            low[u] = cmp::min(low[u], low[v]);

            if parent[u] == -1 && children > 1 {
                ap.insert(u);
            }
            if parent[u] != -1 && low[v] >= disc[u] {
                ap.insert(u);
            }
        } else if v != parent[u] as usize {
            low[u] = cmp::min(low[u], disc[v]);
        }
    }
}

// 그래프에서 단절점을 찾는 메인 함수
fn find_articulation_points(graph: &Vec<Vec<usize>>, V: usize) {
    let mut visited = vec![false; V];
    let mut disc = vec![-1; V];
    let mut low = vec![-1; V];
    let mut parent = vec![-1; V];
    let mut ap = HashSet::new();
    let mut time = 0;

    for i in 0..V {
        if !visited[i] {
            articulation_points_util(i, &mut visited, &mut disc, &mut low, &mut parent, &mut ap, graph, &mut time);
        }
    }

    for &point in &ap {
        println!("Articulation point: {}", point);
    }
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
    find_articulation_points(&graph, V);
}
```

### **사용 사례**

- **네트워크 분석**: 컴퓨터 네트워크에서 중요한 노드를 식별하여 네트워크 내 취약성을 분석하는 데 사용됩니다.
- **인터넷 라우팅**: 중요한 인터넷 노드(라우터)가 실패했을 때, 통신이 어떻게 분리되는지 이해하는 데 활용됩니다.
- **사회 연결망 분석**: 사회 연결망에서 중추적인 역할을 하는 개인이나 그룹을 찾아내기 위해 사용됩니다.

Articulation Points는 시스템의 취약한 지점을 분석하고 중요한 노드를 식별하는 데 매우 유용한 개념입니다.
