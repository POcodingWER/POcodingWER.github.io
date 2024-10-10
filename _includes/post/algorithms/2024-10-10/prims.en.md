## Prim's Algorithm

Prim's Algorithm is a way to find the **Minimum Spanning Tree (MST)**. In a given weighted, undirected graph, it helps to find the shortest set of edges that connects all nodes. MST is useful in real-world scenarios where you need to connect networks at the minimum possible cost.

#### **Algorithm Explanation**:

1. Start from any node in the graph.
2. From the selected node, pick the edge with the smallest weight to connect to an adjacent node.
3. Include the new node and repeat the process by selecting the smallest weight edge among all adjacent edges.
4. Repeat this until all nodes are connected.

Prim's algorithm is particularly useful in real-world problems like designing networks, electrical circuits, or road connections that minimize costs.

---

### **JavaScript Example**

```javascript
function primMST(graph) {
  const key = new Array(graph.length).fill(Infinity); // Store the minimum weights
  const parent = new Array(graph.length).fill(-1); // Store parent nodes
  const inMST = new Array(graph.length).fill(false); // Tracks if the node is in the MST

  key[0] = 0; // Start from the first node
  for (let count = 0; count < graph.length - 1; count++) {
    let minKey = Infinity,
      u = -1;

    // Select the node with the smallest weight
    for (let v = 0; v < graph.length; v++) {
      if (!inMST[v] && key[v] < minKey) {
        minKey = key[v];
        u = v;
      }
    }

    inMST[u] = true; // Add the selected node to MST

    // Update adjacent nodes with new minimum weight
    for (let v = 0; v < graph.length; v++) {
      if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
        key[v] = graph[u][v];
        parent[v] = u;
      }
    }
  }

  // Output the MST
  for (let i = 1; i < graph.length; i++) {
    console.log(`${parent[i]} - ${i} \t${graph[i][parent[i]]}`);
  }
}

// Sample graph (adjacency matrix)
const graph = [
  [0, 2, 0, 6, 0],
  [2, 0, 3, 8, 5],
  [0, 3, 0, 0, 7],
  [6, 8, 0, 0, 9],
  [0, 5, 7, 9, 0],
];

primMST(graph);
```

---

### **Rust Example**

```rust
use std::cmp::Ordering;
use std::collections::BinaryHeap;

#[derive(Copy, Clone, Eq, PartialEq)]
struct Edge {
    weight: usize,
    node: usize,
}

impl Ord for Edge {
    fn cmp(&self, other: &Self) -> Ordering {
        other.weight.cmp(&self.weight) // Reverse ordering for minimum heap
    }
}

impl PartialOrd for Edge {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn prim_mst(graph: &Vec<Vec<(usize, usize)>>, start: usize) {
    let mut in_mst = vec![false; graph.len()];
    let mut min_heap = BinaryHeap::new();

    min_heap.push(Edge { weight: 0, node: start });

    while let Some(Edge { weight, node }) = min_heap.pop() {
        if in_mst[node] {
            continue;
        }
        in_mst[node] = true;

        println!("Selected Edge: {} (Weight: {})", node, weight);

        for &(neighbor, edge_weight) in &graph[node] {
            if !in_mst[neighbor] {
                min_heap.push(Edge {
                    weight: edge_weight,
                    node: neighbor,
                });
            }
        }
    }
}

fn main() {
    let graph = vec![
        vec![(1, 2), (3, 6)],    // Connections from node 0
        vec![(0, 2), (2, 3), (3, 8), (4, 5)], // Connections from node 1
        vec![(1, 3), (4, 7)],    // Connections from node 2
        vec![(0, 6), (1, 8), (4, 9)], // Connections from node 3
        vec![(1, 5), (2, 7), (3, 9)] // Connections from node 4
    ];

    prim_mst(&graph, 0);
}
```

### Explanation:

- **JavaScript** uses an adjacency matrix to represent the graph and manages minimum weights for each node.
- **Rust** uses a binary heap to maintain the minimum weight and processes nodes based on the lowest weight edge.

### Usage:

- **Network Design**: Optimizing the cost to connect multiple cities with roads or communication networks.
- **Electrical Grid Design**: Connecting multiple stations with minimum wiring cost.
- **Computer Graphics**: Graph-based shape processing.

Prim's Algorithm is widely used in scenarios where you need to find the minimum cost to connect all parts of a system.
