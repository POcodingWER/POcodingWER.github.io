## Bellman-Ford Algorithm?

The **Bellman-Ford algorithm** is used to find the shortest paths from a starting vertex to all other vertices in a graph. It can handle graphs with negative edge weights, which makes it more flexible than Dijkstra's algorithm. However, if a negative weight cycle exists (a cycle where the total weight is negative), the algorithm will report that no shortest path exists.

#### **How it works:**

1. **Initialization**: Set the distance to the starting vertex as 0 and the distances to all other vertices as infinity.
2. **Relax all edges**: Repeat the process of checking and updating the shortest paths (relaxing the edges) for (number of vertices - 1) times. For each edge (u, v), if the current known distance to `v` is greater than the distance to `u` plus the edge weight, update the distance to `v`.
3. **Detect negative weight cycles**: After relaxing all the edges, check for any negative weight cycles. If another shorter path is found after the (vertices - 1) relaxations, this means there is a negative weight cycle.

#### **Where it's used:**

- **Currency arbitrage**: In financial markets, Bellman-Ford can be used to detect arbitrage opportunities where a sequence of currency exchanges can lead to a profit (negative weight cycle detection).
- **Network routing**: In scenarios where edges (like network links) can have negative weights (e.g., delays or costs), Bellman-Ford can be used to find the shortest path in such networks.

---

### **JavaScript Example (Bellman-Ford Algorithm)**

```javascript
function bellmanFord(graph, V, start) {
  let distances = Array(V).fill(Infinity);
  distances[start] = 0;

  // Step 1: Relax all edges (V - 1) times
  for (let i = 0; i < V - 1; i++) {
    for (let [u, v, weight] of graph) {
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
      }
    }
  }

  // Step 2: Check for negative weight cycles
  for (let [u, v, weight] of graph) {
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      console.log("Negative weight cycle detected.");
      return;
    }
  }

  return distances;
}

// Example graph (edges with [source, target, weight])
let graph = [
  [0, 1, -1],
  [0, 2, 4],
  [1, 2, 3],
  [1, 3, 2],
  [1, 4, 2],
  [3, 2, 5],
  [3, 1, 1],
  [4, 3, -3],
];

let V = 5; // Number of vertices
let start = 0; // Starting vertex
console.log(bellmanFord(graph, V, start)); // Output: [0, -1, 2, -2, 1]
```

---

### **Rust Example (Bellman-Ford Algorithm)**

```rust
#[derive(Debug, Clone, Copy)]
struct Edge {
    u: usize, // Starting vertex
    v: usize, // Target vertex
    weight: isize, // Edge weight
}

fn bellman_ford(edges: &Vec<Edge>, v_count: usize, start: usize) -> Option<Vec<isize>> {
    let mut distances = vec![isize::MAX; v_count];
    distances[start] = 0;

    // Step 1: Relax all edges (v_count - 1) times
    for _ in 0..v_count - 1 {
        for &edge in edges.iter() {
            if distances[edge.u] != isize::MAX && distances[edge.u] + edge.weight < distances[edge.v] {
                distances[edge.v] = distances[edge.u] + edge.weight;
            }
        }
    }

    // Step 2: Check for negative weight cycles
    for &edge in edges.iter() {
        if distances[edge.u] != isize::MAX && distances[edge.u] + edge.weight < distances[edge.v] {
            println!("Negative weight cycle detected.");
            return None;
        }
    }

    Some(distances)
}

fn main() {
    let edges = vec![
        Edge { u: 0, v: 1, weight: -1 },
        Edge { u: 0, v: 2, weight: 4 },
        Edge { u: 1, v: 2, weight: 3 },
        Edge { u: 1, v: 3, weight: 2 },
        Edge { u: 1, v: 4, weight: 2 },
        Edge { u: 3, v: 2, weight: 5 },
        Edge { u: 3, v: 1, weight: 1 },
        Edge { u: 4, v: 3, weight: -3 },
    ];

    let v_count = 5; // Number of vertices
    let start = 0; // Starting vertex

    match bellman_ford(&edges, v_count, start) {
        Some(distances) => println!("{:?}", distances),
        None => println!("Negative weight cycle detected."),
    }
}
```

---

### Summary:

- **Bellman-Ford Algorithm** can find the shortest paths in graphs with negative edge weights.
- It's mainly used to detect negative weight cycles or when dealing with weighted graphs where edge weights can be negative, such as in financial applications or network routing scenarios.
