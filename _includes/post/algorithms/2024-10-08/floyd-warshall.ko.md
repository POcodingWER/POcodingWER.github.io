## Floyd-Warshall Algorithm?

**Floyd-Warshall 알고리즘**은 모든 정점 쌍 간의 최단 경로를 찾는 알고리즘입니다. 이 알고리즘은 음의 가중치가 있는 그래프도 처리할 수 있지만, 음의 사이클(negative cycle)이 있는 경우에는 경로를 구할 수 없습니다. 기본 아이디어는 각 정점 간의 경로를 반복적으로 개선하여 최종적으로 최단 경로를 찾는 방식입니다.

#### **알고리즘의 동작 방식**:

1. **초기화**: 그래프의 모든 정점 쌍 사이의 최단 경로를 나타내는 행렬을 초기화합니다. 직접 연결된 간선은 간선의 가중치로, 직접 연결되지 않은 경로는 무한대로 설정합니다. 자기 자신과의 경로는 0으로 설정합니다.
2. **경로 업데이트**: 중간에 다른 정점을 거쳐 가는 경로가 더 짧은지 확인하며 최단 경로를 반복적으로 갱신합니다. `dist[i][j]`는 정점 `i`에서 정점 `j`로 가는 현재까지의 최단 경로를 의미합니다.
3. **결과**: 모든 정점 쌍 간의 최단 경로가 갱신되며, 결과적으로 `dist[i][j]`에 최단 경로의 거리가 저장됩니다.

#### **어디에 사용하는지**:

- **네트워크 라우팅**: 네트워크의 모든 노드 간의 최단 경로를 찾아 최적의 경로를 계산하는 데 사용됩니다.
- **지도 애플리케이션**: 여러 장소 간의 최단 경로를 계산하는 데 사용됩니다.
- **소셜 네트워크 분석**: 사용자 간의 관계나 연결성을 분석할 때 유용합니다.

---

### **JavaScript 예제 (Floyd-Warshall 알고리즘)**

```javascript
function floydWarshall(graph) {
  let dist = [];
  const V = graph.length;

  // Initialize the distance matrix
  for (let i = 0; i < V; i++) {
    dist[i] = [];
    for (let j = 0; j < V; j++) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (graph[i][j] !== 0) {
        dist[i][j] = graph[i][j];
      } else {
        dist[i][j] = Infinity;
      }
    }
  }

  // Update the distances based on intermediate vertices
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  return dist;
}

// Example graph represented as an adjacency matrix
const graph = [
  [0, 3, Infinity, 5],
  [2, 0, Infinity, 4],
  [Infinity, 1, 0, Infinity],
  [Infinity, Infinity, 2, 0],
];

console.log(floydWarshall(graph));
```

---

### **Rust 예제 (Floyd-Warshall 알고리즘)**

```rust
fn floyd_warshall(graph: &Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    let v = graph.len();
    let mut dist = graph.clone();

    for k in 0..v {
        for i in 0..v {
            for j in 0..v {
                if dist[i][j] > dist[i][k] + dist[k][j] {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    dist
}

fn main() {
    // Example graph represented as an adjacency matrix
    let graph = vec![
        vec![0, 3, i32::MAX, 5],
        vec![2, 0, i32::MAX, 4],
        vec![i32::MAX, 1, 0, i32::MAX],
        vec![i32::MAX, i32::MAX, 2, 0],
    ];

    let result = floyd_warshall(&graph);
    for row in result {
        println!("{:?}", row);
    }
}
```

### 요약:

- **Floyd-Warshall 알고리즘**은 모든 정점 쌍 간의 최단 경로를 찾는 효율적인 방법으로, 음의 가중치도 처리할 수 있습니다.
- 네트워크 라우팅, 지도 시스템 및 다양한 그래프 문제에서 사용됩니다.
