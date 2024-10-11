## Hamiltonian Path ?

The **Hamiltonian Path** in graph theory is a path that visits each vertex of a graph exactly once. If this path forms a cycle, meaning it starts and ends at the same vertex, it is known as a **Hamiltonian Circuit** (or Cycle).

A Hamiltonian path does not necessarily exist in every graph, and finding whether such a path exists is an NP-complete problem, meaning it's computationally difficult to solve for larger graphs.

### Use cases:

- **Traveling Salesman Problem**: Finding the shortest route that visits several cities exactly once.
- **Puzzles and Games**: Solving puzzles where each position or vertex must be visited once.
- **Circuit Design**: Optimizing circuit designs where each node must be visited exactly once for efficiency.

---

### JavaScript Example Code

```javascript
// Helper function to check if all vertices are visited
function isVisitedAll(visited) {
  return visited.every(Boolean);
}

// Function to check if there exists a Hamiltonian Path in a graph
function hamiltonianPath(graph, visited, pos, path) {
  if (path.length === graph.length) {
    return true;
  }

  for (let v = 0; v < graph.length; v++) {
    if (graph[pos][v] === 1 && !visited[v]) {
      visited[v] = true;
      path.push(v);

      if (hamiltonianPath(graph, visited, v, path)) {
        return true;
      }

      visited[v] = false;
      path.pop();
    }
  }
  return false;
}

// Initialize graph as adjacency matrix
const graph = [
  [0, 1, 1, 0],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [0, 1, 1, 0],
];

let visited = Array(graph.length).fill(false);
let path = [];

visited[0] = true;
path.push(0);

if (hamiltonianPath(graph, visited, 0, path)) {
  console.log("Hamiltonian Path found:", path);
} else {
  console.log("No Hamiltonian Path exists.");
}
```

---

### Rust Example Code

```rust
fn hamiltonian_path(
    graph: &Vec<Vec<usize>>,
    visited: &mut Vec<bool>,
    pos: usize,
    path: &mut Vec<usize>,
) -> bool {
    if path.len() == graph.len() {
        return true;
    }

    for v in 0..graph.len() {
        if graph[pos][v] == 1 && !visited[v] {
            visited[v] = true;
            path.push(v);

            if hamiltonian_path(graph, visited, v, path) {
                return true;
            }

            visited[v] = false;
            path.pop();
        }
    }
    false
}

fn main() {
    let graph = vec![
        vec![0, 1, 1, 0],
        vec![1, 0, 1, 1],
        vec![1, 1, 0, 1],
        vec![0, 1, 1, 0],
    ];

    let mut visited = vec![false; graph.len()];
    let mut path = Vec::new();

    visited[0] = true;
    path.push(0);

    if hamiltonian_path(&graph, &mut visited, 0, &mut path) {
        println!("Hamiltonian Path found: {:?}", path);
    } else {
        println!("No Hamiltonian Path exists.");
    }
}
```

### Use Cases:

1. **Travel Optimization**: Finding the most efficient route where every city must be visited exactly once.
2. **Puzzle Solving**: Solving puzzles where each position needs to be visited once.
3. **Circuit Design**: Efficient circuit routing where each node is passed through once for optimization.
