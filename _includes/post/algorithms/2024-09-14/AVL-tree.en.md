## AVL Tree?

An **AVL tree** is a type of **self-balancing binary search tree** (BST), named after its inventors **Adelson-Velsky and Landis**. In an AVL tree, the difference between heights of the left and right subtrees (called the **balance factor**) of any node is at most **1**. If at any time during insertion or deletion of nodes, the balance factor of any node becomes more than 1, the tree automatically adjusts itself by performing **rotations** to restore balance.

#### Operations in AVL Tree:

1. **Insertion**: When a new node is inserted, the AVL tree may become unbalanced. The tree will perform one of four rotations to rebalance:
   - Left rotation
   - Right rotation
   - Left-Right rotation
   - Right-Left rotation
2. **Deletion**: Similar to insertion, after deleting a node, the tree may become unbalanced, and rotations are used to restore balance.
3. **Searching**: The search operation is the same as in a binary search tree, with time complexity **O(log n)** due to its balanced nature.

### Where is AVL Tree used?

- **Databases**: AVL trees are used in database indexing to maintain balanced search trees, ensuring that the time complexity of operations like insertion, deletion, and search remains **O(log n)**.
- **Memory Allocation**: They are used in memory allocation systems to store free memory blocks.
- **File Systems**: Some file systems use AVL trees to maintain balanced directory structures.
- **In Game Development**: AVL trees help in collision detection and searching large datasets.

### Example Implementations

#### JavaScript Example

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  // Utility to get the height of the tree
  getHeight(node) {
    return node ? node.height : 0;
  }

  // Utility to get the balance factor of a node
  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // Right rotation
  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    return x;
  }

  // Left rotation
  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    return y;
  }

  // Insertion
  insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value) {
      node.left = this.insert(node.left, value);
    } else if (value > node.value) {
      node.right = this.insert(node.right, value);
    } else {
      return node; // No duplicates allowed
    }

    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    const balance = this.getBalance(node);

    // Left Left Case
    if (balance > 1 && value < node.left.value) {
      return this.rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right.value) {
      return this.leftRotate(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  insertValue(value) {
    this.root = this.insert(this.root, value);
  }
}

// Usage example:
const avl = new AVLTree();
avl.insertValue(10);
avl.insertValue(20);
avl.insertValue(30);
console.log(avl.root);
```

#### Rust Example

```rust
use std::cmp::max;

#[derive(Debug)]
struct Node {
    value: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
    height: i32,
}

impl Node {
    fn new(value: i32) -> Self {
        Node {
            value,
            left: None,
            right: None,
            height: 1,
        }
    }
}

struct AVLTree {
    root: Option<Box<Node>>,
}

impl AVLTree {
    fn new() -> Self {
        AVLTree { root: None }
    }

    // Get height of node
    fn height(node: &Option<Box<Node>>) -> i32 {
        match node {
            Some(n) => n.height,
            None => 0,
        }
    }

    // Get balance factor
    fn get_balance(node: &Option<Box<Node>>) -> i32 {
        if let Some(n) = node {
            Self::height(&n.left) - Self::height(&n.right)
        } else {
            0
        }
    }

    // Right rotation
    fn right_rotate(y: Box<Node>) -> Box<Node> {
        let mut x = y.left.unwrap();
        let t2 = x.right.take();

        x.right = Some(y);
        x.right.as_mut().unwrap().left = t2;

        x.right.as_mut().unwrap().height = max(Self::height(&x.right.as_ref().unwrap().left), Self::height(&x.right.as_ref().unwrap().right)) + 1;
        x.height = max(Self::height(&x.left), Self::height(&x.right)) + 1;

        x
    }

    // Left rotation
    fn left_rotate(x: Box<Node>) -> Box<Node> {
        let mut y = x.right.unwrap();
        let t2 = y.left.take();

        y.left = Some(x);
        y.left.as_mut().unwrap().right = t2;

        y.left.as_mut().unwrap().height = max(Self::height(&y.left.as_ref().unwrap().left), Self::height(&y.left.as_ref().unwrap().right)) + 1;
        y.height = max(Self::height(&y.left), Self::height(&y.right)) + 1;

        y
    }

    // Insert a value into the AVL tree
    fn insert(node: Option<Box<Node>>, value: i32) -> Option<Box<Node>> {
        let mut node = if let Some(mut n) = node {
            if value < n.value {
                n.left = Self::insert(n.left.take(), value);
            } else if value > n.value {
                n.right = Self::insert(n.right.take(), value);
            } else {
                return Some(n); // No duplicates allowed
            }

            n.height = max(Self::height(&n.left), Self::height(&n.right)) + 1;
            Some(n)
        } else {
            Some(Box::new(Node::new(value)))
        };

        let balance = Self::get_balance(&node);

        // Left Left Case
        if balance > 1 && value < node.as_ref().unwrap().left.as_ref().unwrap().value {
            return Some(Self::right_rotate(node.unwrap()));
        }

        // Right Right Case
        if balance < -1 && value > node.as_ref().unwrap().right.as_ref().unwrap().value {
            return Some(Self::left_rotate(node.unwrap()));
        }

        // Left Right Case
        if balance > 1 && value > node.as_ref().unwrap().left.as_ref().unwrap().value {
            node.as_mut().unwrap().left = Some(Self::left_rotate(node.unwrap().left.unwrap()));
            return Some(Self::right_rotate(node.unwrap()));
        }

        // Right Left Case
        if balance < -1 && value < node.as_ref().unwrap().right.as_ref().unwrap().value {
            node.as_mut().unwrap().right = Some(Self::right_rotate(node.unwrap().right.unwrap()));
            return Some(Self::left_rotate(node.unwrap()));
        }

        node
    }

    fn insert_value(&mut self, value: i32) {
        self.root = Self::insert(self.root.take(), value);
    }
}

// Usage example:
fn main() {
    let mut avl = AVLTree::new();
    avl.insert_value(10);
    avl.insert_value(20);
    avl.insert_value(30);
    println!("{:?}", avl.root);
}
```

These examples demonstrate how an AVL tree balances itself during insertions using rotations in JavaScript and Rust.
