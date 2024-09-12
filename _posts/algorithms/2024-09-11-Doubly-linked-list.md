---
layout: post
title: "[Algorithm] Data Structure - Doubly linked list
"

subtitle: "자료구조 이중연결리스트"

date: 2024-09-11 09:44:00
author: "lim.Chuck"

# header-style: text

catalog: true
header-mask: 0.4
header-img: "img/post/0911/doubly-linked-list.jpg"

# hidden: true

tags:
  - algorithm
  - 알고리즘
  - Data Structure
  - 자료구조
  - Doubly linked list
  - 이중연결리스트
---

> 참고 [《 생활 코딩 1》](https://opentutorials.org/module/1335/8821)

## Doubly linked list?

이중 연결 리스트(Doubly Linked List)는 각 노드가 두 개의 포인터(또는 참조)를 가지는 연결 리스트입니다. 하나는 다음 노드를 가리키고, 다른 하나는 이전 노드를 가리킵니다. 이로 인해 리스트를 양방향으로 순회할 수 있게 됩니다.

### 이중 연결 리스트의 특징:

- 각 노드가 `다음(next)`과 `이전(prev)` 포인터를 가짐.
- 양방향으로 리스트 순회가 가능함.
- 삽입 및 삭제 연산이 단일 연결 리스트보다 유연함.

1. JavaScript

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // 리스트의 끝에 노드 추가
  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  // 리스트의 값을 출력
  print() {
    let current = this.head;
    while (current) {
      console.log(current.value);
      current = current.next;
    }
  }
}

const list = new DoublyLinkedList();
list.append(1);
list.append(2);
list.append(3);
list.print(); // 1, 2, 3
```

2. Rust 예시

```rust
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
    value: i32,
    prev: Option<Rc<RefCell<Node>>>,
    next: Option<Rc<RefCell<Node>>>,
}

#[derive(Debug)]
struct DoublyLinkedList {
    head: Option<Rc<RefCell<Node>>>,
    tail: Option<Rc<RefCell<Node>>>,
}

impl DoublyLinkedList {
    fn new() -> Self {
        DoublyLinkedList {
            head: None,
            tail: None,
        }
    }

    fn append(&mut self, value: i32) {
        let new_node = Rc::new(RefCell::new(Node {
            value,
            prev: None,
            next: None,
        }));

        match self.tail.take() {
            Some(old_tail) => {
                old_tail.borrow_mut().next = Some(new_node.clone());
                new_node.borrow_mut().prev = Some(old_tail);
                self.tail = Some(new_node);
            }
            None => {
                self.head = Some(new_node.clone());
                self.tail = Some(new_node);
            }
        }
    }

    fn print(&self) {
        let mut current = self.head.clone();
        while let Some(node) = current {
            print!("{} ", node.borrow().value);
            current = node.borrow().next.clone();
        }
        println!();
    }
}

fn main() {
    let mut list = DoublyLinkedList::new();
    list.append(1);
    list.append(2);
    list.append(3);
    list.print();  // 1 2 3
}
```

이처럼 JavaScript와 Rust에서 이중 연결 리스트를 구현하여 양방향 순회와 노드 관리가 가능합니다.
