## Articulation Points?

**Articulation Points** are nodes in an undirected graph that, when removed, cause the graph to split into two or more disconnected components. They play a critical role in maintaining the connectivity of a graph. This concept is widely used in network analysis, electrical circuits, road network analysis, and more.

**Use Cases:**

1. **Network Connectivity**: To find vulnerable points in a network that may cause disconnection if removed.
2. **Electrical Circuits**: To detect points in circuits that could cause circuit failure when removed.
3. **Road Network Analysis**: To identify important intersections or junctions that, when removed, disrupt traffic flow.

---

### JavaScript Example Code

```javascript
// Function to find articulation points using DFS
function articulationPointsUtil(u, visited, disc, low, parent, ap, graph) {
  let children = 0;
  visited[u] = true;
  disc[u] = low[u] = ++time;

  // Traverse all adjacent vertices
  for (let v of graph[u]) {
    if (!visited[v]) {
      children++;
      parent[v] = u;
      articulationPointsUtil(v, visited, disc, low, parent, ap, graph);

      // Check if the subtree rooted at v has a connection back to an ancestor of u
      low[u] = Math.min(low[u], low[v]);

      // If u is not root and low value of one of its children is more, u is an articulation point
      if (parent[u] == -1 && children > 1) ap[u] = true;
      if (parent[u] != -1 && low[v] >= disc[u]) ap[u] = true;
    } else if (v != parent[u]) {
      low[u] = Math.min(low[u], disc[v]);
    }
  }
}

// Main function to find all articulation points in the graph
function findArticulationPoints(graph, V) {
  let visited = new Array(V).fill(false);
  let disc = new Array(V).fill(-1);
  let low = new Array(V).fill(-1);
  let parent = new Array(V).fill(-1);
  let ap = new Array(V).fill(false);

  for (let i = 0; i < V; i++) {
    if (!visited[i])
      articulationPointsUtil(i, visited, disc, low, parent, ap, graph);
  }

  for (let i = 0; i < V; i++) {
    if (ap[i]) console.log(`Articulation point: ${i}`);
  }
}

// Graph creation and articulation point finding
let graph = [
  [1, 2], // Node 0
  [0, 2, 3], // Node 1
  [0, 1], // Node 2
  [1, 4], // Node 3
  [3], // Node 4
];
let V = graph.length;
findArticulationPoints(graph, V);
```

### Rust Example Code

```rust
use std::cmp;
use std::collections::HashSet;

// Function to find articulation points using DFS
fn articulation_points_util(
    u: usize,
    visited: &mut Vec<bool>,
    disc: &mut Vec<i32>,
    low: &mut Vec<i32>,
    parent: &mut Vec<i32>,
    ap: &mut HashSet<usize>,
    graph: &Vec<Vec<usize>>,
    time: &mut i32,
) {
    let mut children = 0;
    visited[u] = true;
    *time += 1;
    disc[u] = *time;
    low[u] = *time;

    for &v in &graph[u] {
        if !visited[v] {
            children += 1;
            parent[v] = u as i32;
            articulation_points_util(v, visited, disc, low, parent, ap, graph, time);

            low[u] = cmp::min(low[u], low[v]);

            if parent[u] == -1 && children > 1 {
                ap.insert(u);
            }
            if parent[u] != -1 && low[v] >= disc[u] {
                ap.insert(u);
            }
        } else if v != parent[u] as usize {
            low[u] = cmp::min(low[u], disc[v]);
        }
    }
}

// Main function to find articulation points in the graph
fn find_articulation_points(graph: &Vec<Vec<usize>>, V: usize) {
    let mut visited = vec![false; V];
    let mut disc = vec![-1; V];
    let mut low = vec![-1; V];
    let mut parent = vec![-1; V];
    let mut ap = HashSet::new();
    let mut time = 0;

    for i in 0..V {
        if !visited[i] {
            articulation_points_util(i, &mut visited, &mut disc, &mut low, &mut parent, &mut ap, graph, &mut time);
        }
    }

    for &point in &ap {
        println!("Articulation point: {}", point);
    }
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
    find_articulation_points(&graph, V);
}
```

### **Use Cases**

- **Network Analysis**: Used to analyze the vulnerability of a network by identifying critical nodes that, if removed, would split the network.
- **Internet Routing**: Helps identify key routers whose failure may cause parts of the internet to become disconnected.
- **Social Network Analysis**: Helps find key individuals or groups in social networks whose absence would lead to significant disconnection.

Articulation Points are a key concept for analyzing weak points in systems and identifying critical nodes.
