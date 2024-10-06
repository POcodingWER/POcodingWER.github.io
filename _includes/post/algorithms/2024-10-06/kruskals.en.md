## Explanation of Kruskal's Algorithm

**Kruskal’s Algorithm** is a greedy algorithm used to find the Minimum Spanning Tree (MST) of a graph. The goal is to connect all vertices with the least possible total edge weight. It achieves this by always selecting the smallest available edge and ensuring that no cycles are formed in the process.

#### **Steps of Kruskal's Algorithm**:

1. **Sort all edges**: Sort all the edges in the graph in ascending order based on their weights.
2. **Pick the smallest edge**: Pick the smallest edge and check if adding it will form a cycle.
3. **Cycle check**: If the edge does not form a cycle, include it in the Minimum Spanning Tree.
4. **Repeat**: Continue adding edges until all vertices are connected.

#### **Use cases**:

- **Network Design**: Used to connect various nodes (such as computers or routers) in a network with minimal cost.
- **Infrastructure**: Designing road networks or communication lines with minimum construction cost.

---

### **JavaScript Example of Kruskal's Algorithm**

```javascript
class UnionFind {
  constructor(size) {
    this.parent = Array(size)
      .fill()
      .map((_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX] += 1;
      }
    }
  }
}

function kruskalMST(graph, numVertices) {
  const edges = graph.sort((a, b) => a[2] - b[2]); // Sort edges by weight
  const uf = new UnionFind(numVertices);
  const mst = [];

  for (let [u, v, weight] of edges) {
    if (uf.find(u) !== uf.find(v)) {
      // No cycle
      uf.union(u, v); // Connect the vertices
      mst.push([u, v, weight]);
    }
  }

  return mst;
}

// Example usage
const graph = [
  [0, 1, 10],
  [0, 2, 6],
  [0, 3, 5],
  [1, 3, 15],
  [2, 3, 4],
];

const mst = kruskalMST(graph, 4);
console.log(mst); // [[2, 3, 4], [0, 3, 5], [0, 1, 10]]
```

---

### **Rust Example of Kruskal's Algorithm**

```rust
#[derive(Clone)]
struct Edge {
    u: usize,
    v: usize,
    weight: usize,
}

fn find(parent: &mut Vec<usize>, x: usize) -> usize {
    if parent[x] != x {
        parent[x] = find(parent, parent[x]);
    }
    parent[x]
}

fn union(parent: &mut Vec<usize>, rank: &mut Vec<usize>, x: usize, y: usize) {
    let root_x = find(parent, x);
    let root_y = find(parent, y);

    if root_x != root_y {
        if rank[root_x] > rank[root_y] {
            parent[root_y] = root_x;
        } else if rank[root_x] < rank[root_y] {
            parent[root_x] = root_y;
        } else {
            parent[root_y] = root_x;
            rank[root_x] += 1;
        }
    }
}

fn kruskal_mst(mut edges: Vec<Edge>, num_vertices: usize) -> Vec<Edge> {
    edges.sort_by(|a, b| a.weight.cmp(&b.weight)); // Sort edges by weight
    let mut parent: Vec<usize> = (0..num_vertices).collect();
    let mut rank = vec![0; num_vertices];
    let mut mst = Vec::new();

    for edge in edges {
        if find(&mut parent, edge.u) != find(&mut parent, edge.v) { // No cycle
            union(&mut parent, &mut rank, edge.u, edge.v); // Connect the vertices
            mst.push(edge);
        }
    }

    mst
}

fn main() {
    let edges = vec![
        Edge { u: 0, v: 1, weight: 10 },
        Edge { u: 0, v: 2, weight: 6 },
        Edge { u: 0, v: 3, weight: 5 },
        Edge { u: 1, v: 3, weight: 15 },
        Edge { u: 2, v: 3, weight: 4 },
    ];

    let mst = kruskal_mst(edges, 4);
    for edge in mst {
        println!("Edge: {} - {} with weight {}", edge.u, edge.v, edge.weight);
    }
}
```

---

### Summary

Kruskal's Algorithm is a greedy algorithm used to find the Minimum Spanning Tree, which connects all vertices in a graph with the least total edge weight. It is used in network design, road, and communication infrastructure planning. The algorithm works by sorting the edges by weight and selecting the smallest edges while avoiding cycles.
