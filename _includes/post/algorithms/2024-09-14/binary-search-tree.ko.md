## **이진 탐색 트리(BST) 개요**

**이진 탐색 트리(BST)**는 다음과 같은 속성을 따르는 이진 트리의 일종입니다:

1. **왼쪽 서브트리**: 노드의 왼쪽 서브트리는 노드의 키보다 **작은** 키를 가진 노드만 포함합니다.
2. **오른쪽 서브트리**: 노드의 오른쪽 서브트리는 노드의 키보다 **큰** 키를 가진 노드만 포함합니다.
3. **중복 노드 없음**: 모든 노드는 고유한 값을 가지며, 중복된 값이 없습니다.

BST는 효율적인 검색, 삽입, 삭제 연산을 제공합니다. 이러한 연산의 평균 시간 복잡도는 **O(log n)**이며, 최악의 경우(트리가 균형을 이루지 않을 때)에는 **O(n)**이 될 수 있습니다.

### **이진 탐색 트리의 사용 사례**

BST는 정렬된 데이터를 저장해야 하거나 빠른 검색, 삽입, 삭제가 필요한 상황에서 널리 사용됩니다. 일반적인 사용 사례는 다음과 같습니다:

- **데이터베이스**: 빠른 데이터 검색을 위한 인덱스 구현.
- **검색 알고리즘**: 선형 구조에 비해 더 빠른 검색을 가능하게 함.
- **심볼 테이블**: 컴파일러나 인터프리터에서 사용.
- **우선순위 큐**: 힙 구조와 함께 사용될 수 있음.
- **자동 완성 및 접두사 트리**: 검색 엔진 및 단어 예측 기능에 활용.

---

### **JavaScript로 구현한 이진 탐색 트리 예제**

JavaScript에서 구현한 이진 탐색 트리 예제는 다음과 같습니다:

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

  // BST에 노드를 삽입하는 메소드
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
        // 이미 값이 존재하는 경우
        return this;
      }
    }
  }

  // 주어진 값이 있는지 탐색하는 메소드
  search(value) {
    let current = this.root;

    while (current !== null) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        return current; // 값을 찾은 경우
      }
    }

    return null; // 값을 찾지 못한 경우
  }
}

// 사용 예시:
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(20);
bst.insert(15);

console.log(bst.search(15)); // 값이 15인 노드
console.log(bst.search(100)); // null (값을 찾지 못함)
```

---

### **Rust로 구현한 이진 탐색 트리 예제**

Rust에서 구현한 이진 탐색 트리 예제는 다음과 같습니다:

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

    println!("15이 있는가? {}", bst.search(15)); // true
    println!("100이 있는가? {}", bst.search(100)); // false
}
```

---

### **결론**

**이진 탐색 트리(BST)**는 정렬된 데이터를 효율적으로 관리할 수 있는 기본적인 자료구조입니다. 다양한 시스템에서 빠른 검색과 업데이트 시간이 중요한 경우 널리 사용되며, JavaScript와 Rust와 같은 언어에서도 쉽게 구현할 수 있습니다.
