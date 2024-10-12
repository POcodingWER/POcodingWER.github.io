## Tower of Hanoi

The **Tower of Hanoi** is a classic recursive problem involving three rods and several disks of different sizes. The objective of the problem is to move all the disks from one rod to another, following certain rules.

#### Rules:

1. Only one disk can be moved at a time.
2. A larger disk cannot be placed on top of a smaller disk.
3. You must use three rods to transfer the disks.

This problem is a famous example of recursive algorithms, teaching both recursive thinking and algorithm efficiency.

### Tower of Hanoi Usage:

- **Recursive Algorithm Practice**: It helps understand the concept of recursion and how to solve problems using recursive techniques.
- **Computer Science Education**: Often used to explain algorithmic time complexity and efficiency.
- **Puzzle**: It's also a well-known logic puzzle.

---

### JavaScript Example Code

```javascript
function hanoi(n, from, to, aux) {
  if (n === 1) {
    console.log(`Move disk 1 from ${from} to ${to}`);
    return;
  }
  hanoi(n - 1, from, aux, to);
  console.log(`Move disk ${n} from ${from} to ${to}`);
  hanoi(n - 1, aux, to, from);
}

// Example: Moving 3 disks from rod A to rod C
hanoi(3, "A", "C", "B");
```

#### Output:

```
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C
```

---

### Rust Example Code

```rust
fn hanoi(n: i32, from: char, to: char, aux: char) {
    if n == 1 {
        println!("Move disk 1 from {} to {}", from, to);
        return;
    }
    hanoi(n - 1, from, aux, to);
    println!("Move disk {} from {} to {}", n, from, to);
    hanoi(n - 1, aux, to, from);
}

fn main() {
    // Example: Moving 3 disks from rod A to rod C
    hanoi(3, 'A', 'C', 'B');
}
```

#### Rust Output:

```
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C
```

### Applications of Tower of Hanoi

- **Improving Recursive Problem Solving Skills**: It helps in mastering recursive functions in programming.
- **Algorithm Learning**: Often used for analyzing time complexity and understanding recursion.

The provided code solves the Tower of Hanoi problem recursively, printing each step of disk movement to the console.
