## AVL 트리?

**AVL 트리**는 **자기 균형 이진 탐색 트리**(BST)의 한 유형으로, **Adelson-Velsky와 Landis**에 의해 고안되었습니다. AVL 트리에서, 어떤 노드의 왼쪽 및 오른쪽 서브트리의 높이 차이(이를 **균형 인수**라고 합니다)가 **최대 1**입니다. 노드 삽입 또는 삭제 중에 어느 노드의 균형 인수가 1보다 크면, 트리는 자동으로 **회전**을 수행하여 균형을 회복합니다.

#### AVL 트리의 주요 연산:

1. **삽입**: 새로운 노드가 삽입될 때, 트리가 불균형해질 수 있습니다. 트리는 다음 네 가지 회전을 수행하여 균형을 맞춥니다:
   - 왼쪽 회전
   - 오른쪽 회전
   - 왼쪽-오른쪽 회전
   - 오른쪽-왼쪽 회전
2. **삭제**: 노드를 삭제한 후에도 트리가 불균형해질 수 있으며, 회전을 사용하여 균형을 복원합니다.
3. **탐색**: 탐색 연산은 이진 탐색 트리와 동일하며, 트리가 균형을 유지하기 때문에 **O(log n)**의 시간 복잡도를 가집니다.

### AVL 트리의 사용 사례:

- **데이터베이스**: AVL 트리는 데이터베이스 인덱싱에서 사용되어 삽입, 삭제, 탐색 같은 연산의 시간 복잡도가 **O(log n)** 이내로 유지되도록 합니다.
- **메모리 할당**: 메모리 할당 시스템에서 AVL 트리는 자유 메모리 블록을 저장하는 데 사용됩니다.
- **파일 시스템**: 일부 파일 시스템은 디렉토리 구조를 균형 있게 유지하기 위해 AVL 트리를 사용합니다.
- **게임 개발**: 게임 개발에서 대규모 데이터 집합을 검색하거나 충돌을 감지하는 데 도움이 됩니다.

### 예제 구현

#### 자바스크립트(JavaScript) 예제

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

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    return x;
  }

  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    return y;
  }

  insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value) {
      node.left = this.insert(node.left, value);
    } else if (value > node.value) {
      node.right = this.insert(node.right, value);
    } else {
      return node; // 중복을 허용하지 않음
    }

    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    const balance = this.getBalance(node);

    if (balance > 1 && value < node.left.value) {
      return this.rightRotate(node);
    }

    if (balance < -1 && value > node.right.value) {
      return this.leftRotate(node);
    }

    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }

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

const avl = new AVLTree();
avl.insertValue(10);
avl.insertValue(20);
avl.insertValue(30);
console.log(avl.root);
```

#### 러스트(Rust) 예제

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

    fn height(node: &Option<Box<Node>>) -> i32 {
        match node {
            Some(n) => n.height,
            None => 0,
        }
    }

    fn get_balance(node: &Option<Box<Node>>) -> i32 {
        if let Some(n) = node {
            Self::height(&n.left) - Self::height(&n.right)
        } else {
            0
        }
    }

    fn right_rotate(y: Box<Node>) -> Box<Node> {
        let mut x = y.left.unwrap();
        let t2 = x.right.take();

        x.right = Some(y);
        x.right.as_mut().unwrap().left = t2;

        x.right.as_mut().unwrap().height = max(Self::height(&x.right.as_ref().unwrap().left), Self::height(&x.right.as_ref().unwrap().right)) + 1;
        x.height = max(Self::height(&x.left), Self::height(&x.right)) + 1;

        x
    }

    fn left_rotate(x: Box<Node>) -> Box<Node> {
        let mut y = x.right.unwrap();
        let t2 = y.left.take();

        y.left = Some(x);
        y.left.as_mut().unwrap().right = t2;

        y.left.as_mut().unwrap().height = max(Self::height(&y.left.as_ref().unwrap().left), Self::height(&y.left.as_ref().unwrap().right)) + 1;
        y.height = max(Self::height(&y.left), Self::height(&y.right)) + 1;

        y
    }

    fn insert(node: Option<Box<Node>>, value: i32) -> Option<Box<Node>> {
        let mut node = if let Some(mut n) = node {
            if value < n.value {
                n.left = Self::insert(n.left.take(), value);
            } else if value > n.value {
                n.right = Self::insert(n.right.take(), value);
            } else {
                return Some(n); // 중복을 허용하지 않음
            }

            n.height = max(Self::height(&n.left), Self::height(&n.right)) + 1;
            Some(n)
        } else {
            Some(Box::new(Node::new(value)))
        };

        let balance = Self::get_balance(&node);

        if balance > 1 && value < node.as_ref().unwrap().left.as_ref().unwrap().value {
            return Some(Self::right_rotate(node.unwrap()));
        }

        if balance < -1 && value > node.as_ref().unwrap().right.as_ref().unwrap().value {
            return Some(Self::left_rotate(node.unwrap()));
        }

        if balance > 1 && value > node.as_ref().unwrap().left.as_ref().unwrap().value {
            node.as_mut().unwrap().left = Some(Self::left_rotate(node.unwrap().left.unwrap()));
            return Some(Self::right_rotate(node.unwrap()));
        }

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

fn main() {
    let mut avl = AVLTree::new();
    avl.insert_value(10);
    avl.insert_value(20);
    avl.insert_value(30);
    println!("{:?}", avl.root);
}
```

이 예제들은 AVL 트리가 삽입 중에 어떻게 회전을 통해 스스로 균형을 맞추는지 JavaScript와 Rust로 보여줍니다.
