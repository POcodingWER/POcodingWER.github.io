## Traveling Salesman Problem (TSP)?

The **Traveling Salesman Problem (TSP)** is a problem that seeks the shortest possible route for a salesman to visit a set of cities exactly once and return to the starting city. It is one of the classic problems in combinatorial optimization and is known to be NP-hard, meaning that as the size of the problem grows, it becomes inefficient to explore all possible routes to find a solution.

#### Applications

- **Logistics and Delivery**: Finding the optimal route for shipping goods.
- **Travel Planning**: Determining the best route to visit multiple cities.
- **Circuit Design**: Optimization in electronic circuit layouts.

#### Problem Definition

- **Input**: A matrix representing the distances or costs between each pair of cities.
- **Output**: The minimum cost route and the corresponding path.

---

### JavaScript Example Code (Brute Force)

```javascript
function tsp(graph) {
  const n = graph.length;
  const visited = Array(n).fill(false);
  const minPath = { cost: Infinity, path: [] };

  function dfs(current, count, cost, path) {
    if (count === n && graph[current][0]) {
      if (cost + graph[current][0] < minPath.cost) {
        minPath.cost = cost + graph[current][0];
        minPath.path = [...path, 0];
      }
      return;
    }

    for (let next = 0; next < n; next++) {
      if (!visited[next] && graph[current][next]) {
        visited[next] = true;
        path.push(next);
        dfs(next, count + 1, cost + graph[current][next], path);
        visited[next] = false;
        path.pop();
      }
    }
  }

  visited[0] = true;
  dfs(0, 1, 0, [0]);
  return minPath;
}

// Example graph (distance matrix)
const graph = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0],
];

const result = tsp(graph);
console.log("Minimum Cost:", result.cost);
console.log("Path:", result.path);
```

---

### Rust Example Code (Brute Force)

```rust
fn tsp(graph: &Vec<Vec<i32>>) -> (i32, Vec<usize>) {
    let n = graph.len();
    let mut min_path = (i32::MAX, vec![]);

    fn dfs(
        current: usize,
        count: usize,
        cost: i32,
        path: &mut Vec<usize>,
        graph: &Vec<Vec<i32>>,
        min_path: &mut (i32, Vec<usize>),
    ) {
        let n = graph.len();

        if count == n && graph[current][0] != 0 {
            let total_cost = cost + graph[current][0];
            if total_cost < min_path.0 {
                min_path.0 = total_cost;
                min_path.1 = path.clone();
                min_path.1.push(0);
            }
            return;
        }

        for next in 0..n {
            if !path.contains(&next) && graph[current][next] != 0 {
                path.push(next);
                dfs(next, count + 1, cost + graph[current][next], path, graph, min_path);
                path.pop();
            }
        }
    }

    let mut path = vec![0];
    dfs(0, 1, 0, &mut path, graph, &mut min_path);
    min_path
}

fn main() {
    let graph = vec![
        vec![0, 10, 15, 20],
        vec![10, 0, 35, 25],
        vec![15, 35, 0, 30],
        vec![20, 25, 30, 0],
    ];

    let (cost, path) = tsp(&graph);
    println!("Minimum Cost: {}", cost);
    println!("Path: {:?}", path);
}
```

### Use Cases

- **Logistics**: Optimizing delivery routes to reduce costs.
- **Tourism**: Planning travel routes to save time and minimize expenses.

---

This code demonstrates how to solve the Traveling Salesman Problem (TSP) using a brute-force approach to find the minimum cost route.
