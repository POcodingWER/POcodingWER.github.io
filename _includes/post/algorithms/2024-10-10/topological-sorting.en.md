## Topological Sorting

Topological sorting is a way to **arrange vertices in a directed acyclic graph (DAG)** in a linear order, such that for every directed edge `u -> v`, vertex `u` comes before vertex `v`. It ensures that precedence relationships between vertices (or tasks) are preserved.

**Key Characteristics**:

- Used for **directed acyclic graphs (DAG)**.
- Commonly applied to problems where tasks have dependencies, like **task scheduling**, **course prerequisites**, or **process execution**.

---

### **JavaScript Example Code**

```javascript
// Function to perform topological sorting using DFS
function topologicalSortUtil(v, visited, stack, graph) {
  visited[v] = true;

  // Visit all the adjacent vertices
  for (let i = 0; i < graph[v].length; i++) {
    const adjacent = graph[v][i];
    if (!visited[adjacent]) {
      topologicalSortUtil(adjacent, visited, stack, graph);
    }
  }

  // Push the current node to the stack after visiting all its adjacent nodes
  stack.push(v);
}

// Main function to perform topological sorting
function topologicalSort(graph) {
  const stack = [];
  const visited = new Array(graph.length).fill(false);

  // Perform the sort for each unvisited vertex
  for (let i = 0; i < graph.length; i++) {
    if (!visited[i]) {
      topologicalSortUtil(i, visited, stack, graph);
    }
  }

  // Print the topological order by reversing the stack
  while (stack.length) {
    console.log(stack.pop() + " ");
  }
}

// Graph representation (DAG)
const graph = [
  [2, 3], // Node 0 -> Nodes 2, 3
  [3], // Node 1 -> Node 3
  [3], // Node 2 -> Node 3
  [], // Node 3 has no outgoing edges
];

topologicalSort(graph);
```

### **Rust Example Code**

```rust
use std::collections::VecDeque;

// Function to perform DFS for topological sorting
fn topological_sort_util(v: usize, visited: &mut Vec<bool>, stack: &mut VecDeque<usize>, graph: &Vec<Vec<usize>>) {
    visited[v] = true;

    // Visit all adjacent vertices
    for &adj in &graph[v] {
        if !visited[adj] {
            topological_sort_util(adj, visited, stack, graph);
        }
    }

    // Push the vertex to the stack once all its adjacent vertices are visited
    stack.push_front(v);
}

// Main function for topological sorting
fn topological_sort(graph: &Vec<Vec<usize>>) -> Vec<usize> {
    let mut stack = VecDeque::new();
    let mut visited = vec![false; graph.len()];

    // Call DFS for each unvisited vertex
    for i in 0..graph.len() {
        if !visited[i] {
            topological_sort_util(i, &mut visited, &mut stack, graph);
        }
    }

    // Convert the stack into a vector to return the topological order
    stack.into_iter().collect()
}

fn main() {
    // Define a directed acyclic graph (DAG)
    let graph = vec![
        vec![2, 3],    // Node 0 -> Nodes 2, 3
        vec![3],       // Node 1 -> Node 3
        vec![3],       // Node 2 -> Node 3
        vec![]         // Node 3 has no outgoing edges
    ];

    let result = topological_sort(&graph);
    for node in result {
        print!("{} ", node);
    }
}
```

### Use Cases:

- **Task Scheduling**: When tasks have dependencies, topological sorting helps determine the order in which tasks should be completed.
- **Compiler Optimization**: Compilers analyze variable and function dependencies to determine the order of code execution.
- **Course Prerequisites**: In education, topological sorting can help determine the sequence of courses to be taken based on prerequisite dependencies.

Topological sorting is essential when you need to organize tasks with dependencies into a valid sequence for execution.
