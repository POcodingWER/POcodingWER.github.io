## Strongly Connected Components (SCC)?

A **Strongly Connected Component (SCC)** in a directed graph is a subgraph where every vertex is reachable from every other vertex. In other words, for any vertex in the subgraph, you can travel to any other vertex and back. This concept is crucial when analyzing the connectivity of directed graphs.

SCCs are used in several domains:

1. **Web Crawling**: Analyzing how web pages are linked to each other.
2. **Compilers**: Analyzing module dependencies in programming.
3. **Circuit Design**: Identifying the connectivity of electronic components in a circuit.

The most common algorithms to find SCCs are **Kosaraju's Algorithm** and **Tarjan's Algorithm**.

---

### JavaScript Example (Kosaraju's Algorithm)

```javascript
// Depth-First Search function
function dfs(graph, v, visited, stack) {
  visited[v] = true;

  for (let i of graph[v]) {
    if (!visited[i]) {
      dfs(graph, i, visited, stack);
    }
  }
  stack.push(v);
}

// Reverse DFS
function reverseDfs(graph, v, visited, component) {
  visited[v] = true;
  component.push(v);

  for (let i of graph[v]) {
    if (!visited[i]) {
      reverseDfs(graph, i, visited, component);
    }
  }
}

// Function to find SCCs using Kosaraju's Algorithm
function findSCC(graph) {
  let stack = [];
  let visited = new Array(graph.length).fill(false);

  // Step 1: Perform DFS on the original graph
  for (let i = 0; i < graph.length; i++) {
    if (!visited[i]) {
      dfs(graph, i, visited, stack);
    }
  }

  // Step 2: Reverse the graph
  let reverseGraph = Array.from(Array(graph.length), () => []);
  for (let v = 0; v < graph.length; v++) {
    for (let u of graph[v]) {
      reverseGraph[u].push(v);
    }
  }

  // Step 3: Perform DFS on the reversed graph
  visited.fill(false);
  let sccList = [];

  while (stack.length) {
    let v = stack.pop();
    if (!visited[v]) {
      let component = [];
      reverseDfs(reverseGraph, v, visited, component);
      sccList.push(component);
    }
  }

  return sccList;
}

// Example graph definition
const graph = [[1], [2], [0, 3], [4], [5], [3]];

const scc = findSCC(graph);
console.log("Strongly Connected Components:", scc);
```

---

### Rust Example (Kosaraju's Algorithm)

```rust
fn dfs(v: usize, graph: &Vec<Vec<usize>>, visited: &mut Vec<bool>, stack: &mut Vec<usize>) {
    visited[v] = true;
    for &i in &graph[v] {
        if !visited[i] {
            dfs(i, graph, visited, stack);
        }
    }
    stack.push(v);
}

fn reverse_dfs(v: usize, reverse_graph: &Vec<Vec<usize>>, visited: &mut Vec<bool>, component: &mut Vec<usize>) {
    visited[v] = true;
    component.push(v);
    for &i in &reverse_graph[v] {
        if !visited[i] {
            reverse_dfs(i, reverse_graph, visited, component);
        }
    }
}

fn find_scc(graph: Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    let mut stack = Vec::new();
    let mut visited = vec![false; graph.len()];

    // Step 1: Perform DFS on the original graph
    for v in 0..graph.len() {
        if !visited[v] {
            dfs(v, &graph, &mut visited, &mut stack);
        }
    }

    // Step 2: Reverse the graph
    let mut reverse_graph = vec![Vec::new(); graph.len()];
    for v in 0..graph.len() {
        for &u in &graph[v] {
            reverse_graph[u].push(v);
        }
    }

    // Step 3: Perform DFS on the reversed graph
    visited.fill(false);
    let mut scc_list = Vec::new();

    while let Some(v) = stack.pop() {
        if !visited[v] {
            let mut component = Vec::new();
            reverse_dfs(v, &reverse_graph, &mut visited, &mut component);
            scc_list.push(component);
        }
    }

    scc_list
}

fn main() {
    let graph = vec![
        vec![1],
        vec![2],
        vec![0, 3],
        vec![4],
        vec![5],
        vec![3]
    ];

    let scc = find_scc(graph);
    println!("Strongly Connected Components: {:?}", scc);
}
```

### Usage Examples:

- **Web Graph Analysis**: Finding how different web pages link to each other.
- **Program Module Analysis**: Detecting dependency cycles between program modules.
- **Network Analysis**: Identifying strongly connected regions in a network.

---

This code demonstrates how to find Strongly Connected Components (SCCs) using Kosaraju's algorithm.
