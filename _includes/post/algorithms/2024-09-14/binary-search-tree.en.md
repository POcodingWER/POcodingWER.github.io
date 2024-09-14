## **Binary Search Tree (BST) Overview**

A **Binary Search Tree (BST)** is a type of binary tree where each node follows the following properties:

1. **Left Subtree**: The left subtree of a node contains only nodes with keys **less than** the node’s key.
2. **Right Subtree**: The right subtree of a node contains only nodes with keys **greater than** the node’s key.
3. **No Duplicate Nodes**: There are no duplicate nodes, i.e., all nodes have unique values.

BST allows efficient searching, insertion, and deletion operations. The average time complexity of these operations is **O(log n)**, but in the worst case (unbalanced tree), it could degrade to **O(n)**.

### **Where Binary Search Tree is Used?**

BSTs are widely used in scenarios where sorted data needs to be stored and where fast search, insertion, and deletion are required. Some common use cases include:

- **Databases**: Implementing indexes for fast data retrieval.
- **Searching algorithms**: Faster searching in comparison to linear structures.
- **Symbol Tables**: In compilers or interpreters.
- **Priority Queues**: When combined with heap-like structures.
- **Autocomplete and Prefix Trees**: In search engines and word prediction.

---

### **Binary Search Tree Example in JavaScript**

Here’s an implementation of a BST in JavaScript:

```js
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Insert a node into the BST
  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else if (value > current.value) {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      } else {
        // Value already exists
        return this;
      }
    }
  }

  // Search for a node with a given value
  search(value) {
    let current = this.root;

    while (current !== null) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        return current; // Value found
      }
    }

    return null; // Value not found
  }
}

// Example usage:
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(20);
bst.insert(15);

console.log(bst.search(15)); // Node with value 15
console.log(bst.search(100)); // null (value not found)
```

---

### **Binary Search Tree Example in Rust**

Here’s a similar implementation in Rust:

```rust
#[derive(Debug)]
struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

impl Node {
    fn new(value: i32) -> Node {
        Node {
            value,
            left: None,
            right: None,
        }
    }
}

struct BinarySearchTree {
    root: Option<Box<Node>>,
}

impl BinarySearchTree {
    fn new() -> BinarySearchTree {
        BinarySearchTree { root: None }
    }

    fn insert(&mut self, value: i32) {
        self.root = Self::insert_recursive(self.root.take(), value);
    }

    fn insert_recursive(node: Option<Box<Node>>, value: i32) -> Option<Box<Node>> {
        match node {
            Some(mut n) => {
                if value < n.value {
                    n.left = Self::insert_recursive(n.left.take(), value);
                } else if value > n.value {
                    n.right = Self::insert_recursive(n.right.take(), value);
                }
                Some(n)
            }
            None => Some(Box::new(Node::new(value))),
        }
    }

    fn search(&self, value: i32) -> bool {
        Self::search_recursive(&self.root, value)
    }

    fn search_recursive(node: &Option<Box<Node>>, value: i32) -> bool {
        match node {
            Some(n) => {
                if value == n.value {
                    true
                } else if value < n.value {
                    Self::search_recursive(&n.left, value)
                } else {
                    Self::search_recursive(&n.right, value)
                }
            }
            None => false,
        }
    }
}

fn main() {
    let mut bst = BinarySearchTree::new();
    bst.insert(10);
    bst.insert(5);
    bst.insert(20);
    bst.insert(15);

    println!("Is 15 present? {}", bst.search(15)); // true
    println!("Is 100 present? {}", bst.search(100)); // false
}
```

---

### **Conclusion**

A **Binary Search Tree** is a fundamental data structure for efficiently managing sorted data. It’s used in various systems, from databases to compilers, and its main advantages lie in its quick lookup and update times. Both JavaScript and Rust offer powerful tools for implementing BSTs, demonstrating the versatility of the structure across different programming languages.
