---
layout: post
title: "[Algorithm] Data Structure - Linked list"

subtitle: "자료구조 연결리스트"

date: 2024-09-10 18:40:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/0910/linked-list.webp"

# hidden: true

tags:
  - algorithm
  - 알고리즘
  - Data Structure
  - 자료구조
  - Linked list
  - 연결리스트
---

> 참고 [《 생활 코딩 1》](https://opentutorials.org/module/1335/8821)

## Linked List?

Linked List(연결 리스트)는 데이터 구조 중 하나로, 각 요소(Node)가 데이터와 다음 요소에 대한 참조(포인터)를 가지고 있는 방식으로 구성됩니다. 배열과는 달리, 메모리 상에 연속적으로 저장되지 않으며, 동적으로 크기를 조정할 수 있는 장점이 있습니다. 연결 리스트는 크게 단순 연결 리스트(Singly Linked List), 이중 연결 리스트(Doubly Linked List), 원형 연결 리스트(Circular Linked List)로 나뉩니다.

### 1. 단순 연결 리스트 (Singly Linked List)

단순 연결 리스트는 각 노드가 **다음 노드**에 대한 참조만을 가지고 있습니다. 첫 번째 노드는 **head**라고 하며, 마지막 노드는 **null**을 가리킵니다.

### 2. 이중 연결 리스트 (Doubly Linked List)

이중 연결 리스트는 각 노드가 **이전 노드**와 **다음 노드**에 대한 참조를 가지고 있는 구조입니다. 양방향으로 탐색이 가능하다는 점이 단순 연결 리스트와의 차이점입니다.

### 3. 원형 연결 리스트 (Circular Linked List)

원형 연결 리스트는 마지막 노드가 다시 **첫 번째 노드**를 가리키는 방식으로 연결된 리스트입니다.

### 4. 코드구현

1. js

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null; // 다음 노드를 가리키는 참조
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null; // 첫 번째 노드 (head)
  }

  // 리스트의 끝에 노드 추가
  append(data) {
    const newNode = new Node(data);
    if (this.head === null) {
      this.head = newNode;
      return;
    }
    let current = this.head;
    while (current.next !== null) {
      current = current.next;
    }
    current.next = newNode;
  }

  // 리스트 출력
  printList() {
    let current = this.head;
    let result = "";
    while (current !== null) {
      result += current.data + " -> ";
      current = current.next;
    }
    result += "null";
    console.log(result);
  }
}

// 사용 예시
const linkedList = new SinglyLinkedList();
linkedList.append(1);
linkedList.append(2);
linkedList.append(3);
linkedList.printList(); // 출력: 1 -> 2 -> 3 -> null
```

2. rust

```rust
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
    data: i32,
    next: Option<Rc<RefCell<Node>>>,  // 다음 노드를 가리키는 참조
}

#[derive(Debug)]
struct SinglyLinkedList {
    head: Option<Rc<RefCell<Node>>>,  // 첫 번째 노드 (head)
}

impl SinglyLinkedList {
    fn new() -> Self {
        SinglyLinkedList { head: None }
    }

    // 리스트의 끝에 노드 추가
    fn append(&mut self, data: i32) {
        let new_node = Rc::new(RefCell::new(Node { data, next: None }));
        match self.head {
            Some(ref mut current) => {
                let mut last = current.clone();
                while let Some(ref next) = last.borrow().next {
                    last = next.clone();
                }
                last.borrow_mut().next = Some(new_node);
            }
            None => {
                self.head = Some(new_node);
            }
        }
    }

    // 리스트 출력
    fn print_list(&self) {
        let mut current = self.head.clone();
        while let Some(node) = current {
            print!("{} -> ", node.borrow().data);
            current = node.borrow().next.clone();
        }
        println!("None");
    }
}

fn main() {
    let mut linked_list = SinglyLinkedList::new();
    linked_list.append(1);
    linked_list.append(2);
    linked_list.append(3);
    linked_list.print_list();  // 출력: 1 -> 2 -> 3 -> None
}
```

### 설명

- **JavaScript 코드**에서는 클래스 기반으로 노드와 연결 리스트를 구현하였습니다. 각 노드는 `data`와 `next`를 가지고, `SinglyLinkedList` 클래스에서 `append` 메서드를 통해 노드를 추가하고, `printList` 메서드로 리스트를 출력합니다.
- **Rust 코드**에서는 `Rc`와 `RefCell`을 사용하여 가변 참조를 관리하면서 연결 리스트를 구현했습니다. Rust의 소유권 및 참조 규칙을 지키기 위해 `Rc`와 `RefCell`을 사용하여 노드 간 연결을 관리합니다.

두 언어 모두 동적으로 노드를 추가하고, 리스트를 출력하는 기능을 구현했습니다.
