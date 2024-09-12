## Queue vs. Stack Comparison

| Feature         | Queue (FIFO)                         | Stack (LIFO)                 |
| --------------- | ------------------------------------ | ---------------------------- |
| Data Handling   | First In First Out (FIFO)            | Last In First Out (LIFO)     |
| Insertion Point | Rear                                 | Top                          |
| Removal Point   | Front                                | Top                          |
| Main Operations | `enqueue(add)`<br>`dequeue(remove)`  | `push(add)`<br>`pop(remove)` |
| Use Cases       | Queue processing, print job ordering | Function call stack, undo    |

## Queue and Stack Use Cases

1. **Queue**
   - **Process Management**: In operating systems, queues are used to handle processes or tasks sequentially, such as in CPU scheduling.
   - **Network Packet Processing**: Queues are used to process network packets in the order they arrive.
   - **Printer Job Management**: Queues are used to handle multiple print jobs in sequential order.
2. **Stack**
   - **Function Call Stack**: When a function is called in a program, a stack is used to return the functions in reverse order.
   - **Text Editor**: The `undo` feature in text editors uses a stack to reverse recent actions in order.
   - **Expression Evaluation**: Stacks are used to calculate expressions in Reverse Polish Notation (RPN).

## Queue?

A **Queue** is a data structure that follows the **First In First Out (FIFO)** principle, meaning that the first data entered is the first to be removed. Queues are useful for handling tasks like **waiting lines** or **job queues**.

The basic operations of a queue are as follows:

1. **enqueue(add)**: Adds data to the rear of the queue.
2. **dequeue(remove)**: Removes data from the front of the queue.
3. **peek/front**: Checks the data at the front of the queue without removing it.
4. **isEmpty**: Checks whether the queue is empty.

#### JavaScript

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  // Add data
  enqueue(element) {
    this.items.push(element);
  }

  // Remove data
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty.";
    }
    return this.items.shift(); // Remove the first element
  }

  // Check the front element of the queue
  front() {
    if (this.isEmpty()) {
      return "Queue is empty.";
    }
    return this.items[0];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Check the size of the queue
  size() {
    return this.items.length;
  }
}

// Example usage
let queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
console.log(queue.front()); // 10
console.log(queue.dequeue()); // 10
console.log(queue.front()); // 20
```

#### Rust

```rust
struct Queue<T> {
    items: Vec<T>,  // Vector using a generic type
}

impl<T> Queue<T> {
    // Initialize queue
    fn new() -> Self {
        Queue { items: Vec::new() }
    }

    // Add data
    fn enqueue(&mut self, item: T) {
        self.items.push(item);
    }

    // Remove data
    fn dequeue(&mut self) -> Option<T> {
        if self.is_empty() {
            None
        } else {
            Some(self.items.remove(0))  // Remove the first element
        }
    }

    // Check the front element of the queue
    fn front(&self) -> Option<&T> {
        self.items.first()
    }

    // Check if the queue is empty
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    // Check the size of the queue
    fn size(&self) -> usize {
        self.items.len()
    }
}

fn main() {
    let mut queue = Queue::new();
    queue.enqueue(10);
    queue.enqueue(20);
    println!("{:?}", queue.front());  // Some(10)
    println!("{:?}", queue.dequeue());  // Some(10)
    println!("{:?}", queue.front());  // Some(20)
}
```

The examples above show how to implement a queue in both JavaScript and Rust. Despite the syntactical differences, the underlying behavior of the queue remains the same.

## Stack?

A **Stack** is a data structure that follows the **Last In First Out (LIFO)** principle, meaning that the last data entered is the first to be removed. Stacks are often used in scenarios like **piles of books** or **function call stacks**.

The basic operations of a stack are as follows:

1. **push(add)**: Adds data to the top of the stack.
2. **pop(remove)**: Removes data from the top of the stack.
3. **peek/top**: Checks the data at the top of the stack without removing it.
4. **isEmpty**: Checks whether the stack is empty.

#### JavaScript

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  // Add data
  push(element) {
    this.items.push(element);
  }

  // Remove data
  pop() {
    if (this.isEmpty()) {
      return "Stack is empty.";
    }
    return this.items.pop(); // Remove the last element
  }

  // Check the top element of the stack
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty.";
    }
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Check the size of the stack
  size() {
    return this.items.length;
  }
}

// Example usage
let stack = new Stack();
stack.push(10);
stack.push(20);
console.log(stack.peek()); // 20
console.log(stack.pop()); // 20
console.log(stack.peek()); // 10
```

#### Rust

```rust
struct Stack<T> {
    items: Vec<T>,  // Vector using a generic type
}

impl<T> Stack<T> {
    // Initialize stack
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    // Add data
    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    // Remove data
    fn pop(&mut self) -> Option<T> {
        self.items.pop()  // Remove the last element
    }

    // Check the top element of the stack
    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    // Check if the stack is empty
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    // Check the size of the stack
    fn size(&self) -> usize {
        self.items.len()
    }
}

fn main() {
    let mut stack = Stack::new();
    stack.push(10);
    stack.push(20);
    println!("{:?}", stack.peek());  // Some(20)
    println!("{:?}", stack.pop());  // Some(20)
    println!("{:?}", stack.peek());  // Some(10)
}
```

In this example, both JavaScript and Rust implementations of the stack are shown. Both languages use **arrays** or **vectors** to easily implement the LIFO behavior of a stack.
