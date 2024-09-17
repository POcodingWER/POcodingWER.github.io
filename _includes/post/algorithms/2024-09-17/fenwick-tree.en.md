## Fenwick Tree?

A **Fenwick Tree** (also known as a **Binary Indexed Tree**) is a data structure that allows efficient updates and prefix sum queries on an array of numbers. It is particularly useful when we need to frequently perform the following operations:

1. **Point Update**: Update a single element in the array.
2. **Prefix Sum Query**: Compute the sum of elements from the start of the array to a given index.

The Fenwick Tree provides these operations in **O(log n)** time, which is faster than a simple array where these operations might take **O(n)** time.

### Use Cases

- **Cumulative Frequency Tables**: Calculating prefix sums.
- **Range Sum Queries**: Efficient queries and updates on an array.
- **Inversion Counting**: Counting the number of inversions in an array.
- **Competitive Programming**: Fenwick trees are commonly used in contests for range queries and updates.

---

### How the Fenwick Tree Works

#### Structure:

- The tree is stored as an array `bit[]` where `bit[i]` contains information about the prefix sum of elements up to index `i`.
- The key observation is that each element of the Fenwick Tree represents the sum of a subset of the array’s elements.

#### Operations:

1. **Update an Element**: To update an element, adjust the values of the nodes that cover this index.
2. **Prefix Sum Query**: To get the sum of elements up to index `i`, traverse the tree backwards and sum the values stored at relevant nodes.

---

### Fenwick Tree in JavaScript

```javascript
class FenwickTree {
  constructor(size) {
    this.bit = new Array(size + 1).fill(0);
    this.size = size;
  }

  // Update the value at index `i` by `value`
  update(i, value) {
    while (i <= this.size) {
      this.bit[i] += value;
      i += i & -i; // Move to the next responsible node
    }
  }

  // Get the prefix sum from 1 to `i`
  query(i) {
    let sum = 0;
    while (i > 0) {
      sum += this.bit[i];
      i -= i & -i; // Move to the parent node
    }
    return sum;
  }

  // Range query sum from l to r
  rangeQuery(l, r) {
    return this.query(r) - this.query(l - 1);
  }
}

// Example usage:
let fenwick = new FenwickTree(10);
fenwick.update(3, 5);
fenwick.update(5, 2);
console.log(fenwick.rangeQuery(1, 5)); // Output: 7
```

---

### Fenwick Tree in Rust

```rust
struct FenwickTree {
    bit: Vec<i32>,
}

impl FenwickTree {
    // Create a new Fenwick Tree with a given size
    fn new(size: usize) -> FenwickTree {
        FenwickTree {
            bit: vec![0; size + 1],
        }
    }

    // Update the value at index `i` by `value`
    fn update(&mut self, mut i: usize, value: i32) {
        while i < self.bit.len() {
            self.bit[i] += value;
            i += i & (!i + 1);  // Move to the next responsible node
        }
    }

    // Get the prefix sum from 1 to `i`
    fn query(&self, mut i: usize) -> i32 {
        let mut sum = 0;
        while i > 0 {
            sum += self.bit[i];
            i -= i & (!i + 1);  // Move to the parent node
        }
        sum
    }

    // Range query sum from l to r
    fn range_query(&self, l: usize, r: usize) -> i32 {
        self.query(r) - self.query(l - 1)
    }
}

fn main() {
    let mut fenwick = FenwickTree::new(10);
    fenwick.update(3, 5);
    fenwick.update(5, 2);
    println!("{}", fenwick.range_query(1, 5));  // Output: 7
}
```

---

### Key Points:

- The **Fenwick Tree** enables efficient update and query operations in logarithmic time, making it suitable for problems that involve frequent modifications and queries on a dataset.
- It's simpler to implement than other data structures that achieve the same goals, like segment trees, but with some limitations (it only works with operations that have inverses, like sum).
