## Bridges in Graphs

A **Bridge** in a graph is an edge that, when removed, causes the graph to become disconnected or split into multiple components. Bridges are important for identifying critical connections in a network, and their removal could disrupt the structure or flow of the system.

### Use Cases:

1. **Network Security**: Identifying critical links in a network that need to be monitored or fortified to prevent a breakdown in connectivity.
2. **Transportation Systems**: Finding roads in a road network that, if removed, would cause certain areas to become inaccessible.
3. **Internet Network Management**: Detecting the most important connections in a communication network, where the failure of these links could cause significant disruptions.

---

### JavaScript Code Example

```javascript
// Utility function for finding Bridges using DFS
function bridgeUtil(u, visited, disc, low, parent, graph, bridges) {
  let children = 0;
  visited[u] = true;
  disc[u] = low[u] = ++time;

  // Explore all adjacent vertices
  for (let v of graph[u]) {
    if (!visited[v]) {
      parent[v] = u;
      children++;
      bridgeUtil(v, visited, disc, low, parent, graph, bridges);

      // Check if the subtree can connect to one of its ancestors
      low[u] = Math.min(low[u], low[v]);

      // If low value of the adjacent is greater, it is a Bridge
      if (low[v] > disc[u]) {
        bridges.push([u, v]);
      }
    } else if (v != parent[u]) {
      low[u] = Math.min(low[u], disc[v]);
    }
  }
}

// Main function to find Bridges
function findBridges(graph, V) {
  let visited = new Array(V).fill(false);
  let disc = new Array(V).fill(-1);
  let low = new Array(V).fill(-1);
  let parent = new Array(V).fill(-1);
  let bridges = [];

  for (let i = 0; i < V; i++) {
    if (!visited[i]) {
      bridgeUtil(i, visited, disc, low, parent, graph, bridges);
    }
  }

  return bridges;
}

// Example graph and finding Bridges
let graph = [
  [1, 2], // Node 0
  [0, 2, 3], // Node 1
  [0, 1], // Node 2
  [1, 4], // Node 3
  [3], // Node 4
];
let V = graph.length;
let bridges = findBridges(graph, V);
console.log("Bridges in the graph: ", bridges);
```

---

### Rust Code Example

```rust
use std::cmp;
use std::collections::HashSet;

// Utility function for finding Bridges using DFS
fn bridge_util(
    u: usize,
    visited: &mut Vec<bool>,
    disc: &mut Vec<i32>,
    low: &mut Vec<i32>,
    parent: &mut Vec<i32>,
    graph: &Vec<Vec<usize>>,
    bridges: &mut Vec<(usize, usize)>,
    time: &mut i32,
) {
    visited[u] = true;
    *time += 1;
    disc[u] = *time;
    low[u] = *time;

    for &v in &graph[u] {
        if !visited[v] {
            parent[v] = u as i32;
            bridge_util(v, visited, disc, low, parent, graph, bridges, time);

            low[u] = cmp::min(low[u], low[v]);

            if low[v] > disc[u] {
                bridges.push((u, v));
            }
        } else if v != parent[u] as usize {
            low[u] = cmp::min(low[u], disc[v]);
        }
    }
}

// Main function to find Bridges
fn find_bridges(graph: &Vec<Vec<usize>>, V: usize) -> Vec<(usize, usize)> {
    let mut visited = vec![false; V];
    let mut disc = vec![-1; V];
    let mut low = vec![-1; V];
    let mut parent = vec![-1; V];
    let mut bridges = vec![];
    let mut time = 0;

    for i in 0..V {
        if !visited[i] {
            bridge_util(i, &mut visited, &mut disc, &mut low, &mut parent, &graph, &mut bridges, &mut time);
        }
    }

    bridges
}

fn main() {
    let graph = vec![
        vec![1, 2],    // Node 0
        vec![0, 2, 3], // Node 1
        vec![0, 1],    // Node 2
        vec![1, 4],    // Node 3
        vec![3],       // Node 4
    ];
    let V = graph.len();
    let bridges = find_bridges(&graph, V);
    println!("Bridges in the graph: {:?}", bridges);
}
```

### Use Cases:

- **Network Management**: Find Bridges to enhance network stability and prevent partitioning in case of failures.
- **Transportation Networks**: Detect critical roads or links in transportation systems to plan alternative routes in case of disruption.
- **Communication Networks**: Identify critical communication lines that need reinforcement to ensure continuous service during outages.

Bridges are essential for analyzing the structural integrity of a graph or network and can be used to pinpoint vulnerabilities.
