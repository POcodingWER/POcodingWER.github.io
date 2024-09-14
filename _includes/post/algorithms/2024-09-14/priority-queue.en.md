## Priority Queue?

A **priority queue** is a special type of queue in which each element is associated with a priority, and elements are dequeued based on their priority rather than just the order they were enqueued. Higher-priority elements are dequeued before lower-priority ones. If two elements have the same priority, they can be dequeued based on their insertion order (FIFO) or other rules depending on the implementation.

### Use Cases of Priority Queue:

1. **Dijkstra's Algorithm**: To find the shortest path in a graph.
2. **A\* Search Algorithm**: A pathfinding algorithm that uses a priority queue to explore nodes in the most promising order.
3. **Task Scheduling**: Used in operating systems to schedule tasks based on their priority.
4. **Event Simulation**: Events with higher priority (like emergencies) are processed before others.

### JavaScript Example (Using a Min-Heap):

JavaScript doesn't have a built-in priority queue, but it can be implemented using a binary heap.

```javascript
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  // Helper method to swap values
  swap(index1, index2) {
    [this.values[index1], this.values[index2]] = [
      this.values[index2],
      this.values[index1],
    ];
  }

  // Helper method to bubble up the values to maintain the heap property
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.swap(idx, parentIdx);
      idx = parentIdx;
    }
  }

  // Helper method to sink down the values to maintain the heap property
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swapIdx = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swapIdx === null && rightChild.priority < element.priority) ||
          (swapIdx !== null && rightChild.priority < leftChild.priority)
        ) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;
      this.swap(idx, swapIdx);
      idx = swapIdx;
    }
  }

  enqueue(value, priority) {
    this.values.push({ value, priority });
    this.bubbleUp();
  }

  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
}

// Usage
const pq = new PriorityQueue();
pq.enqueue("Clean the dishes", 2);
pq.enqueue("Do homework", 1);
pq.enqueue("Watch TV", 3);

console.log(pq.dequeue()); // { value: 'Do homework', priority: 1 }
console.log(pq.dequeue()); // { value: 'Clean the dishes', priority: 2 }
```

### Rust Example (Using `BinaryHeap`):

Rust provides a built-in priority queue called `BinaryHeap` in its standard library, but it works as a **max-heap** by default, meaning the largest element will be dequeued first. We can create a min-heap by using reverse order.

```rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;

#[derive(Debug, Eq, PartialEq)]
struct Task {
    priority: i32,
    description: String,
}

impl Ord for Task {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        other.priority.cmp(&self.priority)
    }
}

impl PartialOrd for Task {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

fn main() {
    let mut pq = BinaryHeap::new();

    pq.push(Task {
        priority: 2,
        description: String::from("Clean the dishes"),
    });
    pq.push(Task {
        priority: 1,
        description: String::from("Do homework"),
    });
    pq.push(Task {
        priority: 3,
        description: String::from("Watch TV"),
    });

    while let Some(task) = pq.pop() {
        println!("{:?}", task);
    }
}
```

**Explanation**:

- In Rust, `BinaryHeap` works as a max-heap by default, so tasks with higher priority are dequeued first.
- We define a custom `Task` struct and implement the `Ord`, `PartialOrd`, `Eq`, and `PartialEq` traits so that tasks are ordered by their priority.

### Summary:

- Priority queues are used in algorithms, scheduling, and simulations where prioritization is key.
- They can be implemented in JavaScript using a binary heap, and Rust offers a `BinaryHeap` for efficient priority queue management.
