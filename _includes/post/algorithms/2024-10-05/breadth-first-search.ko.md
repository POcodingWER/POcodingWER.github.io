## Breadth-First Search (BFS)?

**너비 우선 탐색(Breadth-First Search, BFS)**는 그래프 또는 트리에서 탐색을 할 때 사용하는 알고리즘 중 하나입니다. BFS는 시작 노드에서 가까운 노드부터 차례대로 탐색하는 방식으로, 깊이보다 넓이를 우선적으로 탐색합니다. 이때 큐(Queue) 자료구조를 사용하여 탐색을 진행합니다.

#### **BFS의 작동 방식**:

1. 시작 노드를 큐에 추가하고 방문 처리를 합니다.
2. 큐에서 노드를 꺼내 이웃 노드를 차례대로 큐에 추가하며 방문합니다.
3. 더 이상 큐에 노드가 없을 때까지 이 과정을 반복합니다.

#### **사용 사례**:

- **최단 경로 찾기**: BFS는 모든 간선의 가중치가 같을 때 최단 경로를 찾는 데 사용됩니다.
- **레벨 탐색**: 그래프에서 같은 거리의 노드들을 한 번에 탐색할 때 유용합니다.
- **그래프의 연결 여부 확인**: 그래프가 연결되어 있는지 확인하는 데에도 사용됩니다.

---

### **JavaScript 너비 우선 탐색 예제 코드**

```javascript
// 그래프 표현 (인접 리스트)
const graph = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 5],
  5: [2, 4],
};

function bfs(graph, start) {
  let queue = [start]; // 큐 생성 및 시작 노드 삽입
  let visited = new Set(); // 방문한 노드 저장
  visited.add(start); // 시작 노드를 방문 처리

  while (queue.length > 0) {
    let node = queue.shift(); // 큐에서 노드 꺼내기
    console.log(node); // 방문한 노드 출력

    // 인접 노드 탐색
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        // 미방문 노드인 경우
        queue.push(neighbor); // 큐에 추가
        visited.add(neighbor); // 방문 처리
      }
    }
  }
}

// BFS 실행
bfs(graph, 0); // 출력: 0, 1, 2, 3, 4, 5
```

---

### **Rust 너비 우선 탐색 예제 코드**

```rust
use std::collections::{HashSet, VecDeque};

// BFS 함수
fn bfs(graph: &Vec<Vec<usize>>, start: usize) {
    let mut queue = VecDeque::new(); // 큐 생성
    let mut visited = HashSet::new(); // 방문한 노드 저장
    queue.push_back(start); // 시작 노드 큐에 삽입
    visited.insert(start); // 시작 노드를 방문 처리

    while let Some(node) = queue.pop_front() {
        println!("{}", node); // 방문한 노드 출력

        // 인접 노드 탐색
        for &neighbor in &graph[node] {
            if !visited.contains(&neighbor) { // 미방문 노드인 경우
                queue.push_back(neighbor); // 큐에 추가
                visited.insert(neighbor); // 방문 처리
            }
        }
    }
}

fn main() {
    // 그래프 인접 리스트로 표현
    let graph = vec![
        vec![1, 2],    // 0번 노드의 이웃
        vec![0, 3, 4], // 1번 노드의 이웃
        vec![0, 5],    // 2번 노드의 이웃
        vec![1],       // 3번 노드의 이웃
        vec![1, 5],    // 4번 노드의 이웃
        vec![2, 4]     // 5번 노드의 이웃
    ];

    bfs(&graph, 0); // 출력: 0, 1, 2, 3, 4, 5
}
```

---

### 요약

너비 우선 탐색(BFS)은 그래프나 트리에서 탐색할 때, 깊이보다는 넓이 우선으로 노드를 탐색하는 알고리즘입니다. BFS는 큐를 사용하여 가까운 노드부터 탐색하며, 주로 최단 경로 탐색, 그래프의 연결 여부 확인 등에 사용됩니다.
