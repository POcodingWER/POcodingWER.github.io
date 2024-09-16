## Segment Tree?

A **Segment Tree** is a data structure used for answering range queries efficiently, especially in cases where updates to the elements within the range are frequent. It allows us to perform both updates and queries in logarithmic time, making it useful in many algorithmic scenarios.

### Key Operations of Segment Tree:

1. **Build the Tree**: Build the segment tree from an array.
2. **Range Query**: Retrieve some function of a range of elements (like sum, min, max, etc.).
3. **Point Update**: Update a specific element in the array, with the tree automatically adjusting to reflect this change.

### Structure:

- A segment tree is a binary tree where each node represents a segment (or range) of the array.
- The root represents the entire array, and each child node represents a half of its parent's segment.

### Usage:

- **Range Sum Queries**: Efficiently query the sum of elements within a range.
- **Range Minimum/Maximum Queries**: Find the minimum/maximum element in a range.
- **Dynamic Programming**: Sometimes segment trees are used in optimization problems where segments or ranges need to be queried or updated repeatedly.

### Time Complexity:

- **Query and Update**: O(log n), where n is the number of elements in the array.

---

### JavaScript Example (Sum Segment Tree):

```javascript
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(2 * this.n);
    this.build(arr);
  }

  // Build the tree from the array
  build(arr) {
    for (let i = 0; i < this.n; i++) {
      this.tree[this.n + i] = arr[i];
    }
    for (let i = this.n - 1; i > 0; --i) {
      this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];
    }
  }

  // Update the value at position p
  update(p, value) {
    p += this.n;
    this.tree[p] = value;
    while (p > 1) {
      p >>= 1;
      this.tree[p] = this.tree[2 * p] + this.tree[2 * p + 1];
    }
  }

  // Query the sum in the range [l, r)
  query(l, r) {
    l += this.n;
    r += this.n;
    let sum = 0;
    while (l < r) {
      if (l & 1) {
        sum += this.tree[l++];
      }
      if (r & 1) {
        sum += this.tree[--r];
      }
      l >>= 1;
      r >>= 1;
    }
    return sum;
  }
}

// Usage example
const arr = [1, 2, 3, 4, 5];
const segTree = new SegmentTree(arr);

console.log(segTree.query(1, 4)); // Sum from index 1 to 3 => 9
segTree.update(2, 10); // Update index 2 to value 10
console.log(segTree.query(1, 4)); // Sum from index 1 to 3 => 16
```

---

### Rust Example (Sum Segment Tree):

```rust
struct SegmentTree {
    n: usize,
    tree: Vec<i32>,
}

impl SegmentTree {
    fn new(arr: Vec<i32>) -> SegmentTree {
        let n = arr.len();
        let mut tree = vec![0; 2 * n];
        let mut seg_tree = SegmentTree { n, tree };
        seg_tree.build(arr);
        seg_tree
    }

    // Build the tree from the array
    fn build(&mut self, arr: Vec<i32>) {
        for i in 0..self.n {
            self.tree[self.n + i] = arr[i];
        }
        for i in (1..self.n).rev() {
            self.tree[i] = self.tree[i * 2] + self.tree[i * 2 + 1];
        }
    }

    // Update the value at position p
    fn update(&mut self, mut p: usize, value: i32) {
        p += self.n;
        self.tree[p] = value;
        while p > 1 {
            p /= 2;
            self.tree[p] = self.tree[2 * p] + self.tree[2 * p + 1];
        }
    }

    // Query the sum in the range [l, r)
    fn query(&self, mut l: usize, mut r: usize) -> i32 {
        l += self.n;
        r += self.n;
        let mut sum = 0;
        while l < r {
            if l % 2 == 1 {
                sum += self.tree[l];
                l += 1;
            }
            if r % 2 == 1 {
                r -= 1;
                sum += self.tree[r];
            }
            l /= 2;
            r /= 2;
        }
        sum
    }
}

fn main() {
    let arr = vec![1, 2, 3, 4, 5];
    let mut seg_tree = SegmentTree::new(arr);

    println!("{}", seg_tree.query(1, 4)); // Sum from index 1 to 3 => 9
    seg_tree.update(2, 10); // Update index 2 to value 10
    println!("{}", seg_tree.query(1, 4)); // Sum from index 1 to 3 => 16
}
```

In both examples, the segment tree efficiently performs range sum queries and point updates, demonstrating its utility in cases where arrays are frequently updated or queried.
