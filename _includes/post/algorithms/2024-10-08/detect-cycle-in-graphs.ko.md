## 그래프에서 사이클 탐지 (Detecting Cycles in Graphs)

그래프에서 사이클을 탐지하는 것은 여러 응용 프로그램에서 중요합니다. 예를 들어, 운영 체제의 교착 상태(Deadlock) 탐지, 종속성 그래프에서 무한 루프를 방지하거나, 네트워크 라우팅에서 불법 경로를 탐지하는 데 사용됩니다. 탐지 방식은 그래프의 종류(방향성 그래프 또는 무방향성 그래프)에 따라 달라집니다.

#### **방향성 그래프의 경우**:

방향성 그래프에서 사이클이 존재한다는 것은 깊이 우선 탐색(DFS) 도중 이전에 방문한 노드를 다시 방문할 수 있다는 뜻입니다.

#### **무방향성 그래프의 경우**:

무방향성 그래프에서 사이클이 존재한다는 것은 탐색 중 부모 노드가 아닌 다른 노드를 다시 방문하는 경우입니다.

### **사용 예시**:

- **교착 상태 탐지**: 운영 체제에서 프로세스 간의 자원 대기 사이클을 발견.
- **네트워크 분석**: 라우팅 루프 방지.
- **그래프 알고리즘**: 동적 프로그래밍 알고리즘 또는 종속성 관리 시스템에 사용.

---

### **JavaScript 예제 (방향성 그래프에서 사이클 탐지)**

깊이 우선 탐색(DFS)을 이용해 사이클을 탐지하는 방법입니다. 두 개의 배열을 사용합니다:

1. **visited[]**: 노드가 방문되었는지 여부를 기록.
2. **recStack[]**: 현재 재귀 호출 스택에 노드가 포함되어 있는지 여부를 기록.

```javascript
function detectCycleUtil(v, visited, recStack, graph) {
  if (recStack[v]) return true;
  if (visited[v]) return false;

  visited[v] = true;
  recStack[v] = true;

  for (let neighbor of graph[v]) {
    if (detectCycleUtil(neighbor, visited, recStack, graph)) {
      return true;
    }
  }

  recStack[v] = false;
  return false;
}

function detectCycle(graph) {
  let visited = Array(graph.length).fill(false);
  let recStack = Array(graph.length).fill(false);

  for (let i = 0; i < graph.length; i++) {
    if (detectCycleUtil(i, visited, recStack, graph)) {
      return true;
    }
  }
  return false;
}

// 예시 사용:
const graph = [
  [1], // 0번 노드가 1번 노드로 연결됨
  [2], // 1번 노드가 2번 노드로 연결됨
  [0], // 2번 노드가 0번 노드로 연결됨, 사이클 형성
];

console.log(detectCycle(graph)); // 결과: true (사이클이 있음)
```

---

### **Rust 예제 (방향성 그래프에서 사이클 탐지)**

```rust
fn detect_cycle_util(v: usize, visited: &mut Vec<bool>, rec_stack: &mut Vec<bool>, graph: &Vec<Vec<usize>>) -> bool {
    if rec_stack[v] {
        return true;
    }
    if visited[v] {
        return false;
    }

    visited[v] = true;
    rec_stack[v] = true;

    for &neighbor in &graph[v] {
        if detect_cycle_util(neighbor, visited, rec_stack, graph) {
            return true;
        }
    }

    rec_stack[v] = false;
    false
}

fn detect_cycle(graph: &Vec<Vec<usize>>) -> bool {
    let mut visited = vec![false; graph.len()];
    let mut rec_stack = vec![false; graph.len()];

    for v in 0..graph.len() {
        if detect_cycle_util(v, &mut visited, &mut rec_stack, &graph) {
            return true;
        }
    }

    false
}

fn main() {
    let graph = vec![
        vec![1],  // 0번 노드가 1번 노드로 연결됨
        vec![2],  // 1번 노드가 2번 노드로 연결됨
        vec![0],  // 2번 노드가 0번 노드로 연결됨, 사이클 형성
    ];

    println!("사이클 탐지: {}", detect_cycle(&graph));
}
```

### 설명:

- **JavaScript 및 Rust**: 두 언어 모두 깊이 우선 탐색(DFS)을 사용해 방향성 그래프에서 사이클을 탐지합니다. 핵심은 방문한 노드와 현재 경로(재귀 스택)를 추적하는 두 배열을 사용하는 것입니다.

### 사용 예시:

- **운영 체제**: 자원을 기다리는 프로세스 간의 교착 상태 탐지.
- **패키지 관리자**: 패키지 설치 시 순환 종속성을 방지.
- **네트워크 라우팅**: 라우팅 알고리즘에서 루프 방지.
