## Detecting Cycles in Graphs?

Cycle detection in a graph is important for many applications, such as detecting deadlocks in operating systems, preventing infinite loops in dependency graphs, and detecting illegal paths in network routing. Depending on the type of graph (directed or undirected), the approach to detecting cycles may vary.

#### **For Directed Graphs**:

A cycle exists in a directed graph if we can reach a vertex that we’ve already visited earlier in the same depth-first traversal.

#### **For Undirected Graphs**:

A cycle exists in an undirected graph if a vertex is revisited during traversal, and it is not the parent vertex.

### **Usage Scenarios**:

- **Deadlock Detection**: In operating systems, cycle detection can identify circular waits among processes for resources.
- **Network Analysis**: Preventing routing loops.
- **Graph Algorithms**: Used in dynamic programming algorithms or dependency management systems (like package managers).

---

### **JavaScript Example (Detecting Cycle in Directed Graph)**

We will use a **Depth-First Search (DFS)** approach to detect a cycle in a directed graph. We maintain two arrays:

1. **visited[]**: Marks if a node has been visited.
2. **recStack[]**: To check if a node is part of the current recursion stack (part of the current path being explored).

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

// Example usage:
const graph = [
  [1], // Node 0 has an edge to 1
  [2], // Node 1 has an edge to 2
  [0], // Node 2 has an edge to 0, forms a cycle
];

console.log(detectCycle(graph)); // Output: true (there's a cycle)
```

---

### **Rust Example (Detecting Cycle in Directed Graph)**

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
        vec![1],  // Node 0 has an edge to 1
        vec![2],  // Node 1 has an edge to 2
        vec![0],  // Node 2 has an edge to 0, forms a cycle
    ];

    println!("Cycle detected: {}", detect_cycle(&graph));
}
```

### Explanation:

- **JavaScript and Rust**: Both examples implement cycle detection in a directed graph using DFS. The key is maintaining two arrays: one to check if a node has been visited, and the other to keep track of the current path (recursion stack).

### Usage:

- **Operating Systems**: To detect deadlocks among processes waiting for resources.
- **Package Managers**: To avoid circular dependencies in package installations.
- **Network Routing**: To prevent loops in routing algorithms.
