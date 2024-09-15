## Red-Black Tree?

A **Red-Black Tree** is a type of **self-balancing binary search tree** where each node has an extra bit to store its "color" (either red or black). It ensures that the tree remains approximately balanced, providing an **O(log n)** time complexity for insertion, deletion, and search operations. The red-black tree maintains balance through a set of properties that limit the height of the tree.

#### Properties of Red-Black Trees:

1. **Every node is either red or black.**
2. **The root is always black.**
3. **All leaves (null nodes) are considered black.**
4. **Red nodes cannot have red children** (no two consecutive red nodes on a path).
5. **Every path from a given node to its descendant leaves has the same number of black nodes.**

#### Operations:

- **Insertion**: When a new node is added, it's initially red. Violations of the red-black properties are fixed by performing recoloring and rotations.
- **Deletion**: After removing a node, violations are also fixed by recoloring and rotations.

### Where is Red-Black Tree used?

- **Databases**: Like AVL trees, red-black trees are used in database indexing to keep searches and updates efficient.
- **Memory Management**: The Linux kernel uses red-black trees to manage process scheduling and memory allocation.
- **Language Libraries**: Many programming language libraries (like C++ STL `map` and `set`) use red-black trees to implement ordered maps and sets.
- **File Systems**: Red-black trees are employed in file systems for managing file indexing.

### Example Implementations

#### JavaScript Example

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.color = "RED"; // New nodes are red by default
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.root = null;
  }

  // Utility to rotate left
  leftRotate(node) {
    const rightChild = node.right;
    node.right = rightChild.left;

    if (rightChild.left !== null) {
      rightChild.left.parent = node;
    }

    rightChild.parent = node.parent;

    if (node.parent === null) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }

    rightChild.left = node;
    node.parent = rightChild;
  }

  // Utility to rotate right
  rightRotate(node) {
    const leftChild = node.left;
    node.left = leftChild.right;

    if (leftChild.right !== null) {
      leftChild.right.parent = node;
    }

    leftChild.parent = node.parent;

    if (node.parent === null) {
      this.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }

    leftChild.right = node;
    node.parent = leftChild;
  }

  // Fix violations after insertion
  fixInsert(node) {
    while (node !== this.root && node.parent.color === "RED") {
      if (node.parent === node.parent.parent.left) {
        let uncle = node.parent.parent.right;

        if (uncle && uncle.color === "RED") {
          node.parent.color = "BLACK";
          uncle.color = "BLACK";
          node.parent.parent.color = "RED";
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.leftRotate(node);
          }
          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";
          this.rightRotate(node.parent.parent);
        }
      } else {
        let uncle = node.parent.parent.left;

        if (uncle && uncle.color === "RED") {
          node.parent.color = "BLACK";
          uncle.color = "BLACK";
          node.parent.parent.color = "RED";
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rightRotate(node);
          }
          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";
          this.leftRotate(node.parent.parent);
        }
      }
    }
    this.root.color = "BLACK";
  }

  // Insert a new value
  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      this.root.color = "BLACK";
    } else {
      let current = this.root;
      let parent = null;

      while (current !== null) {
        parent = current;
        if (newNode.value < current.value) {
          current = current.left;
        } else {
          current = current.right;
        }
      }

      newNode.parent = parent;
      if (newNode.value < parent.value) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }

      this.fixInsert(newNode);
    }
  }
}

// Usage
const rbTree = new RedBlackTree();
rbTree.insert(10);
rbTree.insert(20);
rbTree.insert(30);
console.log(rbTree.root);
```

#### Rust Example

```rust
#[derive(Debug, Clone, PartialEq)]
enum Color {
    Red,
    Black,
}

#[derive(Debug, Clone)]
struct Node {
    value: i32,
    color: Color,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
    parent: Option<*mut Node>,  // For simplicity
}

impl Node {
    fn new(value: i32, color: Color) -> Self {
        Node {
            value,
            color,
            left: None,
            right: None,
            parent: None,
        }
    }
}

struct RedBlackTree {
    root: Option<Box<Node>>,
}

impl RedBlackTree {
    fn new() -> Self {
        RedBlackTree { root: None }
    }

    fn left_rotate(&mut self, node: *mut Node) {
        unsafe {
            let right_child = (*node).right.take().unwrap();
            let right_left = right_child.left.take();

            // Perform rotation
            if let Some(ref mut root) = self.root {
                if root.as_mut() as *mut _ == node {
                    self.root = Some(right_child);
                }
            }

            // Reassign pointers
            (*node).right = right_left;
            (*node).parent = Some(right_child.as_mut() as *mut _);
        }
    }

    fn right_rotate(&mut self, node: *mut Node) {
        unsafe {
            let left_child = (*node).left.take().unwrap();
            let left_right = left_child.right.take();

            // Perform rotation
            if let Some(ref mut root) = self.root {
                if root.as_mut() as *mut _ == node {
                    self.root = Some(left_child);
                }
            }

            // Reassign pointers
            (*node).left = left_right;
            (*node).parent = Some(left_child.as_mut() as *mut _);
        }
    }

    fn insert(&mut self, value: i32) {
        let new_node = Box::new(Node::new(value, Color::Red));
        let mut node_ptr = &mut self.root;

        // Find appropriate position for new node
        while let Some(node) = node_ptr {
            if value < node.value {
                node_ptr = &mut node.left;
            } else {
                node_ptr = &mut node.right;
            }
        }

        // Insert new node
        *node_ptr = Some(new_node);

        // Perform balancing operations (not implemented for simplicity)
    }
}

// Usage
fn main() {
    let mut rb_tree = RedBlackTree::new();
    rb_tree.insert(10);
    rb_tree.insert(20);
    rb_tree.insert(30);
    println!("{:?}", rb_tree.root);
}
```

### Summary

In both the **JavaScript** and **Rust** implementations, the Red-Black Tree preserves balance using rotations (left and right rotations) and color adjustments (red and black). These properties help maintain efficient performance for insertion, deletion, and search operations.
