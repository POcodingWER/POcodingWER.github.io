## Dijkstra's Algorithm

**Dijkstra's Algorithm** is used to find the shortest path from a starting vertex to all other vertices in a weighted graph. It is commonly applied in network routing, GPS navigation, and social network analysis. The algorithm works on graphs with non-negative weights.

#### **How the algorithm works:**

1. **Set the starting vertex**: The distance from the start vertex to itself is 0, and the distances to all other vertices are set to infinity (∞).
2. **Use a priority queue**: A priority queue is used to select the vertex with the smallest distance first.
3. **Update paths**: For each neighboring vertex, update the shortest distance if a shorter path is found through the current vertex.
4. **Repeat**: Continue until all vertices have been visited.

#### **Where to use Dijkstra's Algorithm**

- **Network Routing**: Finding the fastest path for data packets through a network.
- **GPS Navigation**: Calculating the shortest route for a vehicle or pedestrian.
- **Social Network Analysis**: Finding the minimum connection path between users.

---

### **JavaScript Example Code (Dijkstra's Algorithm)**

```javascript
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(vertex, priority) {
    this.queue.push({ vertex, priority });
    this.queue.sort((a, b) => a.priority - b.priority); // Sort by priority
  }

  dequeue() {
    return this.queue.shift().vertex;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

function dijkstra(graph, start) {
  let distances = {};
  let pq = new PriorityQueue();

  // Set distances to infinity, except for the start vertex
  for (let vertex in graph) {
    if (vertex === start) {
      distances[vertex] = 0;
      pq.enqueue(vertex, 0);
    } else {
      distances[vertex] = Infinity;
    }
  }

  // Process the priority queue
  while (!pq.isEmpty()) {
    let currentVertex = pq.dequeue();

    for (let neighbor in graph[currentVertex]) {
      let distance = graph[currentVertex][neighbor];
      let newDist = distances[currentVertex] + distance;

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.enqueue(neighbor, newDist);
      }
    }
  }

  return distances;
}

// Example graph (adjacency list)
let graph = {
  A: { B: 1, C: 4 },
  B: { A: 1, C: 2, D: 5 },
  C: { A: 4, B: 2, D: 1 },
  D: { B: 5, C: 1 },
};

console.log(dijkstra(graph, "A")); // { A: 0, B: 1, C: 3, D: 4 }
```

---

### **Rust Example Code (Dijkstra's Algorithm)**

```rust
use std::collections::BinaryHeap;
use std::collections::HashMap;
use std::cmp::Ordering;
use std::usize;

#[derive(Copy, Clone, Eq, PartialEq)]
struct State {
    cost: usize,
    position: usize,
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.cmp(&self.cost)
    }
}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn dijkstra(adj_list: &Vec<Vec<(usize, usize)>>, start: usize) -> Vec<usize> {
    let mut dist: Vec<usize> = vec![usize::MAX; adj_list.len()];
    let mut heap = BinaryHeap::new();

    dist[start] = 0;
    heap.push(State { cost: 0, position: start });

    while let Some(State { cost, position }) = heap.pop() {
        if cost > dist[position] {
            continue;
        }

        for &(neighbor, weight) in &adj_list[position] {
            let next = State {
                cost: cost + weight,
                position: neighbor,
            };

            if next.cost < dist[neighbor]) {
                dist[neighbor] = next.cost;
                heap.push(next);
            }
        }
    }

    dist
}

fn main() {
    let graph = vec![
        vec![(1, 1), (2, 4)], // A
        vec![(0, 1), (2, 2), (3, 5)], // B
        vec![(0, 4), (1, 2), (3, 1)], // C
        vec![(1, 5), (2, 1)], // D
    ];

    let start = 0; // Starting vertex (A)
    let distances = dijkstra(&graph, start);

    println!("{:?}", distances); // Output: [0, 1, 3, 4]
}
```

---

### Summary:

- **Dijkstra's Algorithm** is useful for network routing, pathfinding, and analyzing minimum connections in networks.
- It works on graphs with non-negative weights and finds the shortest path from a single source to all other vertices.
