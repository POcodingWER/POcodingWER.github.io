## Floyd-Warshall Algorithm?

The **Floyd-Warshall Algorithm** is used to find the shortest paths between all pairs of vertices in a graph. This algorithm can handle graphs with negative edge weights, but it cannot handle graphs with negative weight cycles. The core idea is to incrementally improve the shortest path between every pair of vertices by considering each vertex as an intermediate point in the path.

#### **How the algorithm works**:

1. **Initialization**: Initialize a matrix where the value at `dist[i][j]` represents the shortest path from vertex `i` to vertex `j`. Direct paths are set to the weight of the edge, and non-direct paths are initialized to infinity. Paths from a vertex to itself are set to zero.
2. **Update paths**: For every pair of vertices, check if there is a shorter path through an intermediate vertex. If so, update the shortest path.
3. **Final result**: After the algorithm completes, the `dist[i][j]` values will contain the shortest paths between all pairs of vertices.

#### **Where it's used**:

- **Network Routing**: Used to find the shortest paths between nodes in a network.
- **Map Applications**: Used to calculate the shortest distances between multiple locations.
- **Social Network Analysis**: Useful for analyzing relationships and shortest connections between users.

---

### **JavaScript Example (Floyd-Warshall Algorithm)**

```javascript
function floydWarshall(graph) {
  let dist = [];
  const V = graph.length;

  // Initialize the distance matrix
  for (let i = 0; i < V; i++) {
    dist[i] = [];
    for (let j = 0; j < V; j++) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (graph[i][j] !== 0) {
        dist[i][j] = graph[i][j];
      } else {
        dist[i][j] = Infinity;
      }
    }
  }

  // Update the distances based on intermediate vertices
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  return dist;
}

// Example graph represented as an adjacency matrix
const graph = [
  [0, 3, Infinity, 5],
  [2, 0, Infinity, 4],
  [Infinity, 1, 0, Infinity],
  [Infinity, Infinity, 2, 0],
];

console.log(floydWarshall(graph));
```

---

### **Rust Example (Floyd-Warshall Algorithm)**

```rust
fn floyd_warshall(graph: &Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    let v = graph.len();
    let mut dist = graph.clone();

    for k in 0..v {
        for i in 0..v {
            for j in 0..v {
                if dist[i][j] > dist[i][k] + dist[k][j] {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    dist
}

fn main() {
    // Example graph represented as an adjacency matrix
    let graph = vec![
        vec![0, 3, i32::MAX, 5],
        vec![2, 0, i32::MAX, 4],
        vec![i32::MAX, 1, 0, i32::MAX],
        vec![i32::MAX, i32::MAX, 2, 0],
    ];

    let result = floyd_warshall(&graph);
    for row in result {
        println!("{:?}", row);
    }
}
```

### Summary:

- **Floyd-Warshall Algorithm** efficiently finds the shortest paths between all pairs of vertices.
- It is widely used in **network routing**, **mapping systems**, and various graph-related problems.
