## Bellman-Ford Algorithm?

**Bellman-Ford 알고리즘**은 주어진 시작 정점에서 다른 모든 정점으로의 최단 경로를 찾는 알고리즘입니다. 이 알고리즘은 가중치가 음수인 간선을 허용하지만, 음수 가중치 사이클이 있는 경우 최단 경로를 계산할 수 없다는 점을 알려줍니다. 다익스트라 알고리즘과 달리 음수 간선도 처리할 수 있지만, 다익스트라에 비해 느린 편입니다.

#### **작동 방식**

1. **초기화**: 시작 정점의 거리를 0으로 설정하고, 나머지 정점들의 거리는 무한대로 설정합니다.
2. **간선 반복 검사**: (정점 수 - 1)번 반복하면서 모든 간선에 대해 더 짧은 경로를 발견하면 해당 경로로 거리를 업데이트합니다.
3. **음수 사이클 검사**: 마지막으로 한 번 더 모든 간선을 확인해, 음수 사이클이 있는지 확인합니다. 만약 더 짧은 경로가 발견되면, 음수 사이클이 존재한다는 의미입니다.

#### **어디에 사용하는지**

- **금융 시스템**에서 **환율 차익 거래** 문제에서 음수 사이클이 발생하는지를 탐지할 때 사용됩니다.
- **네트워크 라우팅**에서 가중치가 음수인 간선이 포함된 경우에도 최단 경로를 찾기 위해 사용됩니다.

---

### **JavaScript 예제 코드 (Bellman-Ford 알고리즘)**

```javascript
function bellmanFord(graph, V, start) {
  let distances = Array(V).fill(Infinity);
  distances[start] = 0;

  // Step 1: 반복적으로 간선을 탐색하면서 최단 경로를 찾음
  for (let i = 0; i < V - 1; i++) {
    for (let [u, v, weight] of graph) {
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
      }
    }
  }

  // Step 2: 음수 사이클이 있는지 확인
  for (let [u, v, weight] of graph) {
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      console.log("음수 사이클이 존재합니다.");
      return;
    }
  }

  return distances;
}

// 예제 그래프 (간선 u -> v 가중치)
let graph = [
  [0, 1, -1],
  [0, 2, 4],
  [1, 2, 3],
  [1, 3, 2],
  [1, 4, 2],
  [3, 2, 5],
  [3, 1, 1],
  [4, 3, -3],
];

let V = 5; // 정점 수
let start = 0; // 시작 정점
console.log(bellmanFord(graph, V, start)); // 결과: [0, -1, 2, -2, 1]
```

---

### **Rust 예제 코드 (Bellman-Ford 알고리즘)**

```rust
#[derive(Debug, Clone, Copy)]
struct Edge {
    u: usize, // 출발 정점
    v: usize, // 도착 정점
    weight: isize, // 간선 가중치
}

fn bellman_ford(edges: &Vec<Edge>, v_count: usize, start: usize) -> Option<Vec<isize>> {
    let mut distances = vec![isize::MAX; v_count];
    distances[start] = 0;

    // Step 1: 간선 (V - 1)번 반복
    for _ in 0..v_count - 1 {
        for &edge in edges.iter() {
            if distances[edge.u] != isize::MAX && distances[edge.u] + edge.weight < distances[edge.v] {
                distances[edge.v] = distances[edge.u] + edge.weight;
            }
        }
    }

    // Step 2: 음수 사이클 체크
    for &edge in edges.iter() {
        if distances[edge.u] != isize::MAX && distances[edge.u] + edge.weight < distances[edge.v] {
            println!("음수 사이클이 존재합니다.");
            return None;
        }
    }

    Some(distances)
}

fn main() {
    let edges = vec![
        Edge { u: 0, v: 1, weight: -1 },
        Edge { u: 0, v: 2, weight: 4 },
        Edge { u: 1, v: 2, weight: 3 },
        Edge { u: 1, v: 3, weight: 2 },
        Edge { u: 1, v: 4, weight: 2 },
        Edge { u: 3, v: 2, weight: 5 },
        Edge { u: 3, v: 1, weight: 1 },
        Edge { u: 4, v: 3, weight: -3 },
    ];

    let v_count = 5; // 정점 수
    let start = 0; // 시작 정점

    match bellman_ford(&edges, v_count, start) {
        Some(distances) => println!("{:?}", distances),
        None => println!("음수 사이클이 탐지되었습니다."),
    }
}
```

---

### 요약:

- **Bellman-Ford 알고리즘**은 가중치가 음수인 그래프에서도 사용할 수 있는 최단 경로 탐색 알고리즘입니다.
- 이 알고리즘은 주로 음수 사이클을 탐지하거나, 가중치가 음수인 상황에서 최단 경로를 계산해야 하는 문제에서 활용됩니다.
