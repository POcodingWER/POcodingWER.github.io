## Eulerian Path?

**Eulerian Path**는 그래프 이론에서, 그래프의 모든 간선을 정확히 한 번씩만 통과하는 경로를 의미합니다. 만약 출발점과 도착점이 동일하고 모든 간선을 한 번씩만 지나는 경우, 이를 **Eulerian Circuit**(오일러 회로)라고 부릅니다.

**Eulerian Path**가 존재하기 위한 조건은:

1. 모든 정점은 연결되어 있어야 합니다.
2. 차수가 홀수인 정점이 2개이거나, 홀수 차수의 정점이 없으면 오일러 경로가 존재합니다.
   - 차수가 홀수인 정점이 2개면 그 두 정점이 출발점과 도착점이 됩니다.
   - 차수가 모두 짝수면 그 경로는 **Eulerian Circuit**입니다.

### 사용 사례:

- **우편 배달 경로 최적화**: 모든 길을 정확히 한 번씩만 지나도록 배달 경로를 최적화하는 경우.
- **도로 네트워크 관리**: 유지보수를 위해 모든 도로를 한 번씩만 통과하는 경로 찾기.
- **전기 회로**: 회로 내 모든 연결을 한 번씩만 점검하는 패턴을 설계하는 데 사용.

---

### JavaScript 코드 예제

```javascript
// 그래프의 모든 간선을 한 번씩만 통과하는 Eulerian Path를 찾는 함수
function findEulerianPath(graph) {
  const degrees = new Array(graph.length).fill(0);
  let oddCount = 0,
    startNode = 0;

  // 각 정점의 차수를 계산
  for (let u = 0; u < graph.length; u++) {
    for (let v of graph[u]) {
      degrees[u]++;
    }
    if (degrees[u] % 2 !== 0) {
      oddCount++;
      startNode = u;
    }
  }

  // 홀수 차수 정점이 0 또는 2개일 경우에만 Eulerian Path가 존재함
  if (oddCount !== 0 && oddCount !== 2) {
    return "Eulerian Path does not exist";
  }

  // DFS를 이용하여 Eulerian Path 찾기
  const result = [];
  function dfs(node) {
    while (graph[node].length > 0) {
      const nextNode = graph[node].pop();
      dfs(nextNode);
    }
    result.push(node);
  }

  dfs(startNode);
  return result.reverse();
}

// 예제 그래프: [정점1과 연결된 정점들]
const graph = [
  [1, 2], // 정점 0
  [0, 2, 3], // 정점 1
  [0, 1], // 정점 2
  [1, 4], // 정점 3
  [3], // 정점 4
];

const path = findEulerianPath(graph);
console.log("Eulerian Path:", path);
```

---

### Rust 코드 예제

```rust
use std::collections::HashMap;
use std::collections::VecDeque;

fn find_eulerian_path(graph: &mut HashMap<usize, VecDeque<usize>>) -> Vec<usize> {
    let mut degrees = vec![0; graph.len()];
    let mut odd_count = 0;
    let mut start_node = 0;

    // 각 정점의 차수를 계산
    for (&u, adj) in graph.iter() {
        degrees[u] = adj.len();
        if degrees[u] % 2 != 0 {
            odd_count += 1;
            start_node = u;
        }
    }

    // 홀수 차수 정점이 0 또는 2개일 경우에만 Eulerian Path가 존재함
    if odd_count != 0 && odd_count != 2 {
        return vec![]; // Eulerian Path가 존재하지 않음
    }

    let mut result = vec![];
    fn dfs(node: usize, graph: &mut HashMap<usize, VecDeque<usize>>, result: &mut Vec<usize>) {
        while let Some(next_node) = graph.get_mut(&node).unwrap().pop_front() {
            dfs(next_node, graph, result);
        }
        result.push(node);
    }

    dfs(start_node, graph, &mut result);
    result.reverse();
    result
}

fn main() {
    let mut graph = HashMap::new();
    graph.insert(0, VecDeque::from(vec![1, 2]));
    graph.insert(1, VecDeque::from(vec![0, 2, 3]));
    graph.insert(2, VecDeque::from(vec![0, 1]));
    graph.insert(3, VecDeque::from(vec![1, 4]));
    graph.insert(4, VecDeque::from(vec![3]));

    let path = find_eulerian_path(&mut graph);
    if path.is_empty() {
        println!("Eulerian Path does not exist");
    } else {
        println!("Eulerian Path: {:?}", path);
    }
}
```

### 사용 사례:

1. **우편 배달 경로 최적화**: 모든 길을 한 번씩만 지나가도록 경로를 구성하는 데 유용합니다.
2. **네트워크 최적화**: 전기 회로나 통신망에서 모든 연결을 한 번씩만 방문해야 할 때 사용합니다.
3. **그래프 이론 연구**: 그래프의 구조적 특성 분석에 활용됩니다.
