## Tree?

**트리(Tree)**는 노드가 간선으로 연결된 계층적 자료구조입니다. 트리는 효율적인 조직화와 계층적 관계를 표현할 수 있어 널리 사용되는 자료구조입니다.

#### 주요 특징:

1. **루트 노드**: 트리의 최상단 노드로, 탐색이 시작되는 곳입니다.
2. **부모 및 자식 노드**: 모든 노드는 하나의 부모를 가지며, 여러 자식을 가질 수 있습니다.
3. **리프 노드**: 자식이 없는 노드입니다.
4. **높이**: 루트에서 리프까지의 가장 긴 경로의 길이를 의미합니다.
5. **깊이**: 루트에서 특정 노드까지의 경로 길이를 의미합니다.

#### 트리의 종류:

- **이진 트리(Binary Tree)**: 각 노드는 최대 두 개의 자식(왼쪽과 오른쪽)을 가질 수 있습니다.
- **이진 탐색 트리(BST, Binary Search Tree)**: 이진 트리에서 각 노드의 왼쪽 서브트리는 그 노드보다 작은 값을, 오른쪽 서브트리는 그 노드보다 큰 값을 가집니다.
- **균형 트리(AVL, Red-Black)**: 효율적인 탐색과 삽입을 위해 트리의 높이를 균형 있게 유지하는 트리입니다.

#### 주요 연산:

- **삽입**: 트리에 노드를 추가합니다.
- **삭제**: 트리에서 노드를 제거합니다.
- **탐색**: 특정 값을 가진 노드를 찾습니다.
- **순회**: 트리의 모든 노드를 방문합니다. (깊이 우선 탐색(DFS) 또는 너비 우선 탐색(BFS))

#### 사용 사례:

- **계층적 데이터 표현**: 트리는 파일 시스템, 조직도, 분류 체계와 같은 계층적 구조를 나타내는 데 사용됩니다.
- **검색 및 정렬**: 이진 탐색 트리는 효율적인 검색, 삽입, 삭제 연산을 제공합니다.
- **수식 파싱**: 수식 트리는 컴파일러에서 산술 수식을 나타내는 데 사용됩니다.
- **라우팅 및 네트워크 관리**: 트리는 네트워크 시스템에서 통신 경로를 나타냅니다.

### JavaScript 예제 (이진 탐색 트리)

```js
class TreeNode {
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

  // 트리에 노드 삽입
  insert(value) {
    const newNode = new TreeNode(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this._insertNode(this.root, newNode);
    }
  }

  _insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  // 트리에서 값 검색
  search(value) {
    return this._searchNode(this.root, value);
  }

  _searchNode(node, value) {
    if (node === null) return false;
    if (value < node.value) return this._searchNode(node.left, value);
    else if (value > node.value) return this._searchNode(node.right, value);
    else return true;
  }

  // 중위 순회 (DFS)
  inOrderTraversal() {
    const result = [];
    this._inOrderTraversal(this.root, result);
    return result;
  }

  _inOrderTraversal(node, result) {
    if (node !== null) {
      this._inOrderTraversal(node.left, result);
      result.push(node.value);
      this._inOrderTraversal(node.right, result);
    }
  }
}

// 사용 예시:
const bst = new BinarySearchTree();
bst.insert(15);
bst.insert(10);
bst.insert(20);
bst.insert(8);
bst.insert(12);
console.log(bst.search(10)); // true
console.log(bst.search(25)); // false
console.log(bst.inOrderTraversal()); // [8, 10, 12, 15, 20]
```

### Rust 예제 (이진 탐색 트리)

```rust
#[derive(Debug)]
struct TreeNode {
    value: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

impl TreeNode {
    fn new(value: i32) -> Self {
        TreeNode {
            value,
            left: None,
            right: None,
        }
    }
}

struct BinarySearchTree {
    root: Option<Box<TreeNode>>,
}

impl BinarySearchTree {
    fn new() -> Self {
        BinarySearchTree { root: None }
    }

    // 트리에 노드 삽입
    fn insert(&mut self, value: i32) {
        let new_node = Box::new(TreeNode::new(value));
        if self.root.is_none() {
            self.root = Some(new_node);
        } else {
            Self::insert_node(self.root.as_mut().unwrap(), new_node);
        }
    }

    fn insert_node(node: &mut Box<TreeNode>, new_node: Box<TreeNode>) {
        if new_node.value < node.value {
            if node.left.is_none() {
                node.left = Some(new_node);
            } else {
                Self::insert_node(node.left.as_mut().unwrap(), new_node);
            }
        } else {
            if node.right.is_none() {
                node.right = Some(new_node);
            } else {
                Self::insert_node(node.right.as_mut().unwrap(), new_node);
            }
        }
    }

    // 트리에서 값 검색
    fn search(&self, value: i32) -> bool {
        Self::search_node(&self.root, value)
    }

    fn search_node(node: &Option<Box<TreeNode>>, value: i32) -> bool {
        if let Some(n) = node {
            if value < n.value {
                Self::search_node(&n.left, value)
            } else if value > n.value {
                Self::search_node(&n.right, value)
            } else {
                true
            }
        } else {
            false
        }
    }

    // 중위 순회 (DFS)
    fn in_order_traversal(&self) -> Vec<i32> {
        let mut result = Vec::new();
        Self::in_order_traverse_node(&self.root, &mut result);
        result
    }

    fn in_order_traverse_node(node: &Option<Box<TreeNode>>, result: &mut Vec<i32>) {
        if let Some(n) = node {
            Self::in_order_traverse_node(&n.left, result);
            result.push(n.value);
            Self::in_order_traverse_node(&n.right, result);
        }
    }
}

// 사용 예시:
fn main() {
    let mut bst = BinarySearchTree::new();
    bst.insert(15);
    bst.insert(10);
    bst.insert(20);
    bst.insert(8);
    bst.insert(12);
    println!("{}", bst.search(10)); // true
    println!("{}", bst.search(25)); // false
    println!("{:?}", bst.in_order_traversal()); // [8, 10, 12, 15, 20]
}
```

### 요약

트리는 계층적 구조를 효율적으로 표현하고 검색 연산을 수행하는 데 유용한 자료구조입니다. JavaScript와 Rust 예제에서 **이진 탐색 트리**의 삽입, 검색, 중위 순회와 같은 기본적인 연산을 구현하는 방법을 보여줍니다. 트리는 검색, 수식 파싱, 네트워크 관리와 같은 분야에서 널리 사용됩니다.
