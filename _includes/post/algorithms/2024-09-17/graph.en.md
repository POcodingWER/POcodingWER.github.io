## Graph ?

A **graph** is a non-linear data structure that consists of nodes (or vertices) and edges. Each edge connects two vertices and can be directed (having a direction) or undirected (no direction). Graphs are commonly used to represent networks like social networks, roadmaps, or computer networks.

#### Components of a Graph

1. **Vertices (Nodes)**: These represent entities or objects.
2. **Edges**: These represent the connections between vertices. Edges can be **directed** (one-way) or **undirected** (two-way).

Graphs can also be classified based on edge weights:

- **Weighted Graph**: Each edge has a weight (cost) associated with it.
- **Unweighted Graph**: All edges have equal weight.

---

### Use Cases of Graphs

1. **Social Networks**: Users as vertices, and connections (friendships) as edges.
2. **Road Networks**: Cities or intersections as vertices, roads as edges (with distances as weights in a weighted graph).
3. **Internet/Computer Networks**: Computers/routers as vertices, and network connections as edges.
4. **Dependency Graphs**: Represent dependencies between tasks (e.g., in a project).
5. **Recommendation Systems**: Products or items are vertices, with edges representing similarities between them.

---

### Graph Representation

Graphs can be represented in two common ways:

1. **Adjacency Matrix**: A 2D array where `matrix[i][j]` represents the presence (and possibly weight) of an edge between vertex `i` and vertex `j`.
2. **Adjacency List**: A list of lists (or map) where each index represents a vertex, and each entry contains a list of adjacent vertices (or edges).

---

### Graph Implementation in JavaScript

Here’s a simple implementation of a graph using an adjacency list in JavaScript:

```javascript
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  // Add a vertex to the graph
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  // Add an edge between two vertices (for undirected graph)
  addEdge(vertex1, vertex2) {
    this.adjacencyList.get(vertex1).push(vertex2);
    this.adjacencyList.get(vertex2).push(vertex1);
  }

  // Print the adjacency list
  printGraph() {
    for (let [vertex, edges] of this.adjacencyList) {
      console.log(`${vertex} -> ${edges.join(", ")}`);
    }
  }

  // Depth-First Search (DFS)
  dfs(start) {
    let visited = new Set();
    this._dfsHelper(start, visited);
  }

  _dfsHelper(vertex, visited) {
    if (visited.has(vertex)) return;

    visited.add(vertex);
    console.log(vertex);

    for (let neighbor of this.adjacencyList.get(vertex)) {
      this._dfsHelper(neighbor, visited);
    }
  }
}

// Example Usage
let graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "C");

graph.printGraph(); // Output: A -> B, C, B -> A, C, C -> A, B
graph.dfs("A"); // Output: A B C
```

#### Explanation:

- The graph is implemented using an adjacency list with `Map` in JavaScript.
- The `addVertex` method adds a new vertex to the graph.
- The `addEdge` method connects two vertices (for an undirected graph, it adds both directions).
- Depth-First Search (DFS) is implemented as a traversal algorithm.

---

### Graph Implementation in Rust

Below is a similar implementation of an undirected graph using an adjacency list in Rust:

```rust
use std::collections::{HashMap, HashSet};

struct Graph {
    adjacency_list: HashMap<String, Vec<String>>,
}

impl Graph {
    // Create a new graph
    fn new() -> Graph {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }

    // Add a vertex to the graph
    fn add_vertex(&mut self, vertex: String) {
        self.adjacency_list.entry(vertex).or_insert(Vec::new());
    }

    // Add an edge between two vertices (undirected)
    fn add_edge(&mut self, vertex1: String, vertex2: String) {
        self.adjacency_list.get_mut(&vertex1).unwrap().push(vertex2.clone());
        self.adjacency_list.get_mut(&vertex2).unwrap().push(vertex1.clone());
    }

    // Print the graph's adjacency list
    fn print_graph(&self) {
        for (vertex, edges) in &self.adjacency_list {
            println!("{} -> {:?}", vertex, edges);
        }
    }

    // Depth-First Search (DFS)
    fn dfs(&self, start: &String) {
        let mut visited = HashSet::new();
        self._dfs_helper(start, &mut visited);
    }

    fn _dfs_helper(&self, vertex: &String, visited: &mut HashSet<String>) {
        if visited.contains(vertex) {
            return;
        }

        visited.insert(vertex.clone());
        println!("{}", vertex);

        for neighbor in &self.adjacency_list[vertex] {
            self._dfs_helper(neighbor, visited);
        }
    }
}

fn main() {
    let mut graph = Graph::new();
    graph.add_vertex("A".to_string());
    graph.add_vertex("B".to_string());
    graph.add_vertex("C".to_string());

    graph.add_edge("A".to_string(), "B".to_string());
    graph.add_edge("A".to_string(), "C".to_string());
    graph.add_edge("B".to_string(), "C".to_string());

    graph.print_graph(); // Output: A -> ["B", "C"], B -> ["A", "C"], C -> ["A", "B"]
    graph.dfs(&"A".to_string());  // Output: A B C
}
```

#### Explanation:

- The graph is represented using a `HashMap` where each key is a vertex and the value is a list of its neighbors.
- The `add_vertex` method adds a vertex, and `add_edge` adds an undirected edge between two vertices.
- A simple DFS traversal is implemented using recursion.

---

### Key Points:

- A **graph** is a powerful structure used to model relationships or connections between objects.
- It is widely used in real-world applications such as networking, social graphs, and routing problems.
- Various algorithms, like **DFS**, **BFS**, **Dijkstra's**, and **Kruskal's**, are used with graphs to solve problems like shortest paths, connectivity, and more.
