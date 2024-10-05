## Depth-First Search (DFS)?

Depth-First Search (DFS) is an algorithm used to traverse or search through graph or tree data structures. Starting from a selected node, DFS explores as far as possible along each branch before backtracking. It's typically implemented using a stack (or recursion), and is useful for exploring all nodes of a graph or finding paths.

#### **How DFS works**:

1. Start at a node, mark it as visited, and explore as deep as possible along its unvisited neighbors.
2. Once a dead-end is reached (i.e., no unvisited neighbors), backtrack to the previous node.
3. Continue this process until all nodes are visited.

#### **Applications**:

- **Pathfinding**: Finding a path in mazes, puzzles, or between two nodes in a graph.
- **Cycle detection**: Checking if a graph contains cycles.
- **Connected components**: Discovering all nodes that are connected in a graph.
- **Strongly connected components**: Identifying strongly connected components in directed graphs.

---

### **JavaScript Example Code for Depth-First Search**

```javascript
// Graph representation
const graph = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0],
  3: [1],
  4: [1, 5],
  5: [4],
};

function dfs(graph, start, visited = new Set()) {
  console.log(start); // Output the visited node
  visited.add(start); // Mark node as visited

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

// Run DFS
dfs(graph, 0); // Output: 0, 1, 3, 4, 5, 2
```

---

### **Rust Example Code for Depth-First Search**

```rust
use std::collections::HashSet;

// Graph representation
fn dfs(graph: &Vec<Vec<usize>>, start: usize, visited: &mut HashSet<usize>) {
    println!("{}", start); // Output the visited node
    visited.insert(start); // Mark node as visited

    for &neighbor in &graph[start] {
        if !visited.contains(&neighbor) {
            dfs(graph, neighbor, visited);
        }
    }
}

fn main() {
    // Adjacency list representation of the graph
    let graph = vec![
        vec![1, 2],    // Neighbors of node 0
        vec![0, 3, 4], // Neighbors of node 1
        vec![0],       // Neighbors of node 2
        vec![1],       // Neighbors of node 3
        vec![1, 5],    // Neighbors of node 4
        vec![4]        // Neighbors of node 5
    ];

    let mut visited = HashSet::new();
    dfs(&graph, 0, &mut visited); // Output: 0, 1, 3, 4, 5, 2
}
```

---

### Summary

Depth-First Search (DFS) is a fundamental algorithm for exploring graphs. It uses recursion or a stack to visit nodes deeply before backtracking, making it useful for pathfinding, detecting cycles, and solving a variety of graph traversal problems.
