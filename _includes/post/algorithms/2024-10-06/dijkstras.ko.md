## 다익스트라 알고리즘 (Dijkstra's Algorithm)

**다익스트라 알고리즘**은 그래프에서 한 정점에서 다른 모든 정점까지의 **최단 경로**를 찾는 알고리즘입니다. 주로 네트워크 경로 탐색, GPS 길 찾기, 소셜 네트워크 분석 등에서 사용됩니다. 이 알고리즘은 가중치가 있는 그래프에서 동작하며, 음의 가중치가 없는 경우에만 사용할 수 있습니다.

#### **알고리즘의 주요 동작 원리**:

1. **시작 정점 설정**: 시작 정점에서 자기 자신까지의 거리는 0으로, 나머지 정점까지의 거리는 무한대(∞)로 설정합니다.
2. **우선순위 큐 사용**: 거리가 짧은 정점부터 처리되도록 우선순위 큐를 사용하여 가장 짧은 거리를 가진 정점을 선택합니다.
3. **경로 업데이트**: 선택한 정점을 통해 다른 인접한 정점으로 가는 경로가 더 짧으면 그 경로로 거리를 업데이트합니다.
4. **반복**: 모든 정점이 방문될 때까지 위의 과정을 반복합니다.

#### **다익스트라 알고리즘의 사용 예시**

- **네트워크 라우팅**: 네트워크에서 데이터 패킷이 최단 시간에 도착하도록 경로를 찾는 데 사용됩니다.
- **GPS 내비게이션**: 차량이나 사람이 목적지까지 가는 최단 경로를 계산하는 데 활용됩니다.
- **소셜 네트워크 분석**: 특정 사용자들 사이의 최소 연결 경로를 분석할 때 사용됩니다.

---

### **JavaScript 예제 코드 (다익스트라 알고리즘)**

```javascript
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(vertex, priority) {
    this.queue.push({ vertex, priority });
    this.queue.sort((a, b) => a.priority - b.priority); // 우선순위에 따라 정렬
  }

  dequeue() {
    return this.queue.shift().vertex;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

function dijkstra(graph, start) {
  let distances = {};
  let pq = new PriorityQueue();

  // 모든 거리를 무한대로 설정, 시작 정점은 0
  for (let vertex in graph) {
    if (vertex === start) {
      distances[vertex] = 0;
      pq.enqueue(vertex, 0);
    } else {
      distances[vertex] = Infinity;
    }
  }

  // 우선순위 큐가 빌 때까지 반복
  while (!pq.isEmpty()) {
    let currentVertex = pq.dequeue();

    for (let neighbor in graph[currentVertex]) {
      let distance = graph[currentVertex][neighbor];
      let newDist = distances[currentVertex] + distance;

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.enqueue(neighbor, newDist);
      }
    }
  }

  return distances;
}

// 그래프 예시 (인접 리스트)
let graph = {
  A: { B: 1, C: 4 },
  B: { A: 1, C: 2, D: 5 },
  C: { A: 4, B: 2, D: 1 },
  D: { B: 5, C: 1 },
};

console.log(dijkstra(graph, "A")); // { A: 0, B: 1, C: 3, D: 4 }
```

---

### **Rust 예제 코드 (다익스트라 알고리즘)**

```rust
use std::collections::BinaryHeap;
use std::collections::HashMap;
use std::cmp::Ordering;
use std::usize;

#[derive(Copy, Clone, Eq, PartialEq)]
struct State {
    cost: usize,
    position: usize,
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.cmp(&self.cost)
    }
}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn dijkstra(adj_list: &Vec<Vec<(usize, usize)>>, start: usize) -> Vec<usize> {
    let mut dist: Vec<usize> = vec![usize::MAX; adj_list.len()];
    let mut heap = BinaryHeap::new();

    dist[start] = 0;
    heap.push(State { cost: 0, position: start });

    while let Some(State { cost, position }) = heap.pop() {
        if cost > dist[position] {
            continue;
        }

        for &(neighbor, weight) in &adj_list[position] {
            let next = State {
                cost: cost + weight,
                position: neighbor,
            };

            if next.cost < dist[neighbor] {
                dist[neighbor] = next.cost;
                heap.push(next);
            }
        }
    }

    dist
}

fn main() {
    let graph = vec![
        vec![(1, 1), (2, 4)], // A
        vec![(0, 1), (2, 2), (3, 5)], // B
        vec![(0, 4), (1, 2), (3, 1)], // C
        vec![(1, 5), (2, 1)], // D
    ];

    let start = 0; // 시작 정점 (A)
    let distances = dijkstra(&graph, start);

    println!("{:?}", distances); // 출력: [0, 1, 3, 4]
}
```

---

### 요약

- **다익스트라 알고리즘**은 네트워크, 경로 탐색, 데이터 전송 최적화 등에 사용되는 알고리즘입니다.
- 시작 정점에서 모든 다른 정점까지의 최단 경로를 구하는 데 사용되며, 음의 가중치가 없는 그래프에서만 적용 가능합니다.
