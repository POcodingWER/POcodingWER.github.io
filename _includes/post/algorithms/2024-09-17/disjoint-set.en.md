### Disjoint Set?

The **Disjoint Set** (also known as **Union-Find** or **Merge-Find Set**) is a data structure that manages a collection of non-overlapping sets. It provides two main operations:

1. **Find**: Determines the set (or representative) that a particular element belongs to.
2. **Union**: Merges two sets into one.

This structure is very useful for dealing with **dynamic connectivity** problems, where we need to efficiently determine whether two elements are in the same set or belong to different sets.

### Components of Disjoint Set

1. **Parent Array**: Each element points to its parent, and if it points to itself, it's the representative (or root) of the set.
2. **Union by Rank**: When merging two sets, the smaller tree (rank-wise) is merged under the root of the larger tree to keep the structure balanced.
3. **Path Compression**: During the `find` operation, the path from each node to the root is flattened, which helps to speed up future `find` operations by reducing the tree's height.

### Use Cases

- **Connected Components in a Graph**: Determining if two vertices are in the same connected component.
- **Cycle Detection in a Graph**: Checking for cycles in an undirected graph.
- **Minimum Spanning Tree (Kruskal's Algorithm)**: To find the Minimum Spanning Tree (MST) of a graph efficiently.
- **Dynamic Connectivity Problems**: Tracking connected components in dynamic networks.

### Time Complexity

The Disjoint Set operations (find and union) have an almost constant time complexity of **O(α(n))**, where α(n) is the inverse Ackermann function, which grows extremely slowly.

---

### Disjoint Set in JavaScript

Here’s a JavaScript implementation of the Disjoint Set with path compression and union by rank:

```javascript
class DisjointSet {
  constructor(size) {
    this.parent = new Array(size);
    this.rank = new Array(size).fill(0);

    // Initialize each element to be its own parent
    for (let i = 0; i < size; i++) {
      this.parent[i] = i;
    }
  }

  // Find the root of the set that element 'x' belongs to with path compression
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  // Union by rank
  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX !== rootY) {
      // Union by rank: attach smaller tree under larger tree
      if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
    }
  }

  // Check if two elements are in the same set
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

// Usage Example:
let ds = new DisjointSet(5); // Create 5 disjoint sets (0 to 4)

ds.union(0, 1);
ds.union(1, 2);
console.log(ds.connected(0, 2)); // Output: true
console.log(ds.connected(0, 3)); // Output: false
ds.union(3, 4);
console.log(ds.connected(3, 4)); // Output: true
```

#### Explanation:

- The `find` method determines the root of a given element, applying path compression to flatten the tree for efficiency.
- The `union` method merges two sets, using rank to ensure that the smaller tree is always attached to the larger tree.
- `connected` checks whether two elements are in the same set.

---

### Disjoint Set in Rust

Here’s a Rust implementation of the Disjoint Set (Union-Find) with path compression and union by rank:

```rust
struct DisjointSet {
    parent: Vec<usize>,
    rank: Vec<usize>,
}

impl DisjointSet {
    // Initialize a new Disjoint Set with 'size' elements
    fn new(size: usize) -> DisjointSet {
        let mut parent = Vec::with_capacity(size);
        for i in 0..size {
            parent.push(i);
        }
        DisjointSet {
            parent,
            rank: vec![0; size],
        }
    }

    // Find the root of the set that element 'x' belongs to with path compression
    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            self.parent[x] = self.find(self.parent[x]);  // Path compression
        }
        self.parent[x]
    }

    // Union by rank
    fn union(&mut self, x: usize, y: usize) {
        let root_x = self.find(x);
        let root_y = self.find(y);

        if root_x != root_y {
            // Union by rank: attach smaller tree under larger tree
            if self.rank[root_x] > self.rank[root_y] {
                self.parent[root_y] = root_x;
            } else if self.rank[root_x] < self.rank[root_y] {
                self.parent[root_x] = root_y;
            } else {
                self.parent[root_y] = root_x;
                self.rank[root_x] += 1;
            }
        }
    }

    // Check if two elements are in the same set
    fn connected(&mut self, x: usize, y: usize) -> bool {
        self.find(x) == self.find(y)
    }
}

fn main() {
    let mut ds = DisjointSet::new(5);  // Create 5 disjoint sets (0 to 4)

    ds.union(0, 1);
    ds.union(1, 2);
    println!("{}", ds.connected(0, 2));  // Output: true
    println!("{}", ds.connected(0, 3));  // Output: false
    ds.union(3, 4);
    println!("{}", ds.connected(3, 4));  // Output: true
}
```

#### Explanation:

- `find` uses path compression to flatten the tree structure for more efficient future lookups.
- `union` merges two sets by attaching the smaller set under the larger set based on rank.
- The `connected` function checks if two elements are in the same set by comparing their root representatives.

---

### Key Points:

- **Disjoint Set** is an efficient data structure for managing and merging sets in dynamic environments.
- It is commonly used in graph-related algorithms like **Kruskal's Minimum Spanning Tree** and **Cycle Detection**.
- By using **path compression** and **union by rank**, Disjoint Set achieves nearly constant time complexity for find and union operations.
