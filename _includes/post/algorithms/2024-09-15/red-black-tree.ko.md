## Red-Black Tree?

**Red-Black Tree**는 **자기 균형 이진 탐색 트리**의 일종으로, 각 노드에 "색상"(빨간색 또는 검은색)을 저장하는 추가 비트가 있습니다. 트리의 균형이 깨지지 않도록 하여, 삽입, 삭제, 탐색 연산을 **O(log n)**의 시간 복잡도로 수행할 수 있게 합니다. Red-Black 트리는 몇 가지 규칙을 통해 트리의 균형을 유지합니다.

#### Red-Black 트리의 규칙:

1. **모든 노드는 빨간색 또는 검은색입니다.**
2. **루트 노드는 항상 검은색입니다.**
3. **모든 리프 노드(널 노드)는 검은색입니다.**
4. **빨간색 노드는 빨간색 자식을 가질 수 없습니다** (연속으로 빨간 노드가 존재할 수 없음).
5. **어떤 노드에서 자손까지의 모든 경로는 동일한 수의 검은색 노드를 가지고 있어야 합니다.**

#### 연산:

- **삽입**: 새 노드를 삽입할 때, 새 노드는 항상 빨간색으로 시작합니다. 이때 규칙을 위반한 경우 색상 변경 또는 회전을 통해 규칙을 복원합니다.
- **삭제**: 삭제 후에도 규칙 위반이 발생할 수 있으며, 색상 변경과 회전을 통해 균형을 맞춥니다.

### Red-Black Tree의 사용 사례:

- **데이터베이스**: AVL 트리와 마찬가지로, 데이터베이스 인덱싱에 사용되어 검색과 업데이트 작업의 효율성을 유지합니다.
- **메모리 관리**: 리눅스 커널은 프로세스 스케줄링과 메모리 할당 관리를 위해 Red-Black 트리를 사용합니다.
- **언어 라이브러리**: 많은 프로그래밍 언어 라이브러리(C++ STL `map`과 `set` 등)에서 정렬된 맵과 세트를 구현하는 데 사용됩니다.
- **파일 시스템**: 파일 시스템에서 파일 인덱싱을 관리하는 데 Red-Black 트리가 사용됩니다.

### 예제 구현

#### 자바스크립트 예제

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.color = "RED"; // 새로운 노드는 기본적으로 빨간색
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.root = null;
  }

  // 왼쪽 회전
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

  // 오른쪽 회전
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

  // 삽입 후 균형을 맞추기 위한 수정
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

  // 값 삽입
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

// 사용 예시
const rbTree = new RedBlackTree();
rbTree.insert(10);
rbTree.insert(20);
rbTree.insert(30);
console.log(rbTree.root);
```

#### 러스트 예제

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
    parent: Option<*mut Node>,  // 간단히 하기 위해 사용
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

            // 회전 수행
            if let Some(ref mut root) = self.root {
                if root.as_mut() as *mut _ == node {
                    self.root = Some(right_child);
                }
            }

            // 포인터 재할당
            (*node).right = right_left;
            (*node).parent = Some(right_child.as_mut() as *mut _);
        }
    }

    fn right_rotate(&mut self, node: *mut Node) {
        unsafe {
            let left_child = (*node).left.take().unwrap();
            let left_right = left_child.right.take();

            // 회전 수행
            if let Some(ref mut root) = self.root {
                if root.as_mut() as *mut _ == node {
                    self.root = Some(left_child);
                }
            }

            // 포인터 재할당
            (*node).left = left_right;
            (*node).parent = Some(left_child.as_mut() as *mut _);
        }
    }

    fn insert(&mut self, value: i32) {
        let new_node = Box::new(Node::new(value, Color::Red));
        let mut node_ptr = &mut self.root;

        // 새 노드를 위한 적절한 위치 찾기
        while let Some(node) = node_ptr {
            if value < node.value {
                node_ptr = &mut node.left;
            } else {
                node_ptr = &mut node.right;
            }
        }

        // 새 노드 삽입
        *node_ptr = Some(new_node);

        // 균형 맞추기 위한 작업 (단순화를 위해 구현하지 않음)
    }
}

// 사용 예시
fn main() {
    let mut rb_tree = RedBlackTree::new();
    rb_tree.insert(10);
    rb_tree.insert(20);
    rb_tree.insert(30);
    println!("{:?}", rb_tree.root);
}
```

### 요약

**JavaScript** 및 **Rust** 구현에서, Red-Black Tree는 회전(왼쪽 및 오른쪽 회전)과 색상 조정을 통해 균형을 유지합니다. 이를 통해 삽입, 삭제, 탐색 연산을 효율적으로 수행할 수 있습니다.
