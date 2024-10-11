## 외판원 문제 (Traveling Salesman Problem, TSP)?

**외판원 문제 (TSP)**는 주어진 도시 집합에서 각 도시를 한 번만 방문하고 다시 출발 도시로 돌아오는 최소 비용의 경로를 찾는 문제입니다. TSP는 조합 최적화 문제 중 하나로, NP-hard 문제로 알려져 있습니다. 즉, 문제의 크기가 커짐에 따라 가능한 모든 경로를 탐색하는 것이 비효율적이기 때문에 효율적인 해법을 찾는 것이 어렵습니다.

#### 사용 분야

- **물류와 배송**: 상품을 운송하는 최적 경로 찾기.
- **여행 계획**: 여러 도시를 방문할 때의 최적 경로 찾기.
- **회로 설계**: 전자 회로의 최적화.

#### 문제의 정의

- **입력**: 도시의 수와 각 도시 간의 거리 또는 비용을 나타내는 행렬.
- **출력**: 최소 비용 경로와 해당 경로.

---

### JavaScript 예제 코드 (완전 탐색)

```javascript
function tsp(graph) {
  const n = graph.length;
  const visited = Array(n).fill(false);
  const minPath = { cost: Infinity, path: [] };

  function dfs(current, count, cost, path) {
    if (count === n && graph[current][0]) {
      if (cost + graph[current][0] < minPath.cost) {
        minPath.cost = cost + graph[current][0];
        minPath.path = [...path, 0];
      }
      return;
    }

    for (let next = 0; next < n; next++) {
      if (!visited[next] && graph[current][next]) {
        visited[next] = true;
        path.push(next);
        dfs(next, count + 1, cost + graph[current][next], path);
        visited[next] = false;
        path.pop();
      }
    }
  }

  visited[0] = true;
  dfs(0, 1, 0, [0]);
  return minPath;
}

// 예시 그래프 (거리 행렬)
const graph = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0],
];

const result = tsp(graph);
console.log("최소 비용:", result.cost);
console.log("경로:", result.path);
```

---

### Rust 예제 코드 (완전 탐색)

```rust
fn tsp(graph: &Vec<Vec<i32>>) -> (i32, Vec<usize>) {
    let n = graph.len();
    let mut min_path = (i32::MAX, vec![]);

    fn dfs(
        current: usize,
        count: usize,
        cost: i32,
        path: &mut Vec<usize>,
        graph: &Vec<Vec<i32>>,
        min_path: &mut (i32, Vec<usize>),
    ) {
        let n = graph.len();

        if count == n && graph[current][0] != 0 {
            let total_cost = cost + graph[current][0];
            if total_cost < min_path.0 {
                min_path.0 = total_cost;
                min_path.1 = path.clone();
                min_path.1.push(0);
            }
            return;
        }

        for next in 0..n {
            if !path.contains(&next) && graph[current][next] != 0 {
                path.push(next);
                dfs(next, count + 1, cost + graph[current][next], path, graph, min_path);
                path.pop();
            }
        }
    }

    let mut path = vec![0];
    dfs(0, 1, 0, &mut path, graph, &mut min_path);
    min_path
}

fn main() {
    let graph = vec![
        vec![0, 10, 15, 20],
        vec![10, 0, 35, 25],
        vec![15, 35, 0, 30],
        vec![20, 25, 30, 0],
    ];

    let (cost, path) = tsp(&graph);
    println!("최소 비용: {}", cost);
    println!("경로: {:?}", path);
}
```

### 사용 예시

- **물류**: 상품 배송 경로를 최적화하여 비용 절감.
- **관광**: 관광 코스를 계획하여 시간을 절약하고 비용을 최소화.

---

이 코드는 외판원 문제(TSP)를 해결하기 위한 완전 탐색 방법을 사용하여 최소 비용 경로를 찾는 방법을 보여줍니다.
