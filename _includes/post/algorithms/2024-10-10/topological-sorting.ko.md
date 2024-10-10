## 토폴로지 정렬 (Topological Sorting)

토폴로지 정렬(Topological Sorting)은 **유향 비순환 그래프(DAG, Directed Acyclic Graph)**에서 **정점들을 순서대로 나열하는 방법**입니다. 이 정렬 방식은 그래프의 간선이 `u -> v`일 때, 항상 정렬 순서에서 `u`가 `v`보다 앞에 나오는 것을 보장합니다. 즉, 그래프의 선행 관계를 유지하면서 모든 노드를 나열하는 것입니다.

**주요 특징**:

- 유향 그래프에서 사용되며, 사이클이 없는 그래프에서만 동작합니다.
- **프로세스 간의 의존성**을 표현하거나, **과목 수강 순서**와 같은 **우선순위가 있는 작업**을 나열할 때 사용됩니다.

---

### **JavaScript 예제 코드**

```javascript
// 위상 정렬을 수행하는 함수 (깊이 우선 탐색 방식)
function topologicalSortUtil(v, visited, stack, graph) {
  visited[v] = true;

  // 현재 노드의 모든 인접 노드를 탐색
  for (let i = 0; i < graph[v].length; i++) {
    const adjacent = graph[v][i];
    if (!visited[adjacent]) {
      topologicalSortUtil(adjacent, visited, stack, graph);
    }
  }

  // 탐색이 완료된 노드를 스택에 삽입
  stack.push(v);
}

// 그래프에 대한 위상 정렬 함수
function topologicalSort(graph) {
  const stack = [];
  const visited = new Array(graph.length).fill(false);

  // 모든 노드에 대해 위상 정렬 수행
  for (let i = 0; i < graph.length; i++) {
    if (!visited[i]) {
      topologicalSortUtil(i, visited, stack, graph);
    }
  }

  // 스택에서 요소를 역순으로 출력하여 위상 정렬 순서 얻기
  while (stack.length) {
    console.log(stack.pop() + " ");
  }
}

// 그래프 정의 (유향 비순환 그래프)
const graph = [
  [2, 3], // 노드 0에서 2, 3으로 가는 간선
  [3], // 노드 1에서 3으로 가는 간선
  [3], // 노드 2에서 3으로 가는 간선
  [], // 노드 3은 종착점
];

topologicalSort(graph);
```

### **Rust 예제 코드**

```rust
use std::collections::VecDeque;

// 깊이 우선 탐색을 수행하여 위상 정렬 순서를 계산하는 함수
fn topological_sort_util(v: usize, visited: &mut Vec<bool>, stack: &mut VecDeque<usize>, graph: &Vec<Vec<usize>>) {
    visited[v] = true;

    // 현재 노드의 인접한 노드들을 모두 탐색
    for &adj in &graph[v] {
        if !visited[adj] {
            topological_sort_util(adj, visited, stack, graph);
        }
    }

    // 스택에 노드를 삽입 (후입선출 방식)
    stack.push_front(v);
}

// 위상 정렬을 수행하는 함수
fn topological_sort(graph: &Vec<Vec<usize>>) -> Vec<usize> {
    let mut stack = VecDeque::new();
    let mut visited = vec![false; graph.len()];

    // 각 노드에 대해 DFS를 수행
    for i in 0..graph.len() {
        if !visited[i] {
            topological_sort_util(i, &mut visited, &mut stack, graph);
        }
    }

    // 스택에 저장된 위상 정렬 순서를 벡터로 반환
    stack.into_iter().collect()
}

fn main() {
    // 그래프 정의 (유향 비순환 그래프)
    let graph = vec![
        vec![2, 3],    // 노드 0에서 2, 3으로 가는 간선
        vec![3],       // 노드 1에서 3으로 가는 간선
        vec![3],       // 노드 2에서 3으로 가는 간선
        vec![]         // 노드 3은 종착점
    ];

    let result = topological_sort(&graph);
    for node in result {
        print!("{} ", node);
    }
}
```

### 사용처:

- **작업 스케줄링**: 여러 작업 간의 의존 관계가 있는 프로젝트에서 각 작업을 어떤 순서로 해야 할지를 결정할 때 유용합니다.
- **컴파일러 최적화**: 컴파일러는 코드가 실행되기 전에 변수나 함수의 의존성을 분석하고, 어떤 순서로 코드를 실행해야 할지를 결정할 때 사용합니다.
- **수강 과목 결정**: 학문의 이수 조건이 있을 때, 어떤 과목을 먼저 들어야 할지 정하는데 유용합니다.

토폴로지 정렬은 의존 관계가 존재하는 여러 작업을 적절한 순서로 배치해야 할 때 필수적으로 사용됩니다.
