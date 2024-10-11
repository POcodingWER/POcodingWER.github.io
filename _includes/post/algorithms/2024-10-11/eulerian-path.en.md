## Eulerian Path ?

The **Eulerian Path** in graph theory is a path that visits every edge of a graph exactly once. If the path starts and ends at the same vertex while visiting every edge exactly once, it is called an **Eulerian Circuit**.

Conditions for the existence of an Eulerian Path:

1. All vertices must be connected.
2. An Eulerian Path exists if the graph has exactly 0 or 2 vertices with an odd degree (the number of edges connected to a vertex).
   - If there are exactly 2 vertices with an odd degree, the path starts at one and ends at the other.
   - If all vertices have an even degree, the path is an **Eulerian Circuit**.

### Use Cases:

- **Postal Route Optimization**: Optimizing routes to ensure every street is visited exactly once.
- **Network Maintenance**: Finding paths that visit every road or connection exactly once for maintenance.
- **Electrical Circuit Design**: Ensuring all connections in a circuit are tested or used exactly once.

---

### JavaScript Code Example

```javascript
// Function to find an Eulerian Path in a graph
function findEulerianPath(graph) {
  const degrees = new Array(graph.length).fill(0);
  let oddCount = 0,
    startNode = 0;

  // Calculate degrees of each vertex
  for (let u = 0; u < graph.length; u++) {
    for (let v of graph[u]) {
      degrees[u]++;
    }
    if (degrees[u] % 2 !== 0) {
      oddCount++;
      startNode = u;
    }
  }

  // Eulerian Path exists only if there are 0 or 2 odd degree vertices
  if (oddCount !== 0 && oddCount !== 2) {
    return "Eulerian Path does not exist";
  }

  // Use DFS to find Eulerian Path
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

// Example graph: [Vertices and their connections]
const graph = [
  [1, 2], // Vertex 0
  [0, 2, 3], // Vertex 1
  [0, 1], // Vertex 2
  [1, 4], // Vertex 3
  [3], // Vertex 4
];

const path = findEulerianPath(graph);
console.log("Eulerian Path:", path);
```

---

### Rust Code Example

```rust
use std::collections::HashMap;
use std::collections::VecDeque;

fn find_eulerian_path(graph: &mut HashMap<usize, VecDeque<usize>>) -> Vec<usize> {
    let mut degrees = vec![0; graph.len()];
    let mut odd_count = 0;
    let mut start_node = 0;

    // Calculate degrees of each vertex
    for (&u, adj) in graph.iter() {
        degrees[u] = adj.len();
        if degrees[u] % 2 != 0 {
            odd_count += 1;
            start_node = u;
        }
    }

    // Eulerian Path exists only if there are 0 or 2 odd degree vertices
    if odd_count != 0 && odd_count != 2 {
        return vec![]; // Eulerian Path does not exist
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

### Use Cases:

1. **Postal Route Optimization**: Finding a route to visit every street exactly once.
2. **Network Optimization**: Useful in circuits or communication networks to visit each connection exactly once.
3. **Graph Theory Research**: Used to analyze the structural properties of graphs.
