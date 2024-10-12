## Jump Game?

The **Jump Game** is a problem where you're given an array representing the maximum range you can jump from each position, and the task is to determine whether you can reach the last index starting from the first one. Each element in the array represents how far you can jump from that position.

For example, given the array `[2, 3, 1, 1, 4]`, starting from the first position, you can jump up to two steps. The goal is to check if it's possible to reach the last index of the array.

### Use Cases:

- **Game Development**: Calculating if a character can reach the end of a platform based on their jump capability.
- **Dynamic Programming Problems**: Often used to solve optimization problems, like finding the minimum number of jumps or paths.

---

### JavaScript Example Code

```javascript
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) {
      return false; // If current index can't be reached, return false
    }
    maxReach = Math.max(maxReach, i + nums[i]); // Update the maximum range
  }
  return true; // Return true if last index can be reached
}

// Test case
let nums = [2, 3, 1, 1, 4];
console.log(canJump(nums)); // true
```

In this JavaScript code, the function `canJump` determines whether it's possible to reach the last index of the array `nums`. It keeps track of the furthest position you can reach and checks if the current index is within this range.

---

### Rust Example Code

```rust
fn can_jump(nums: Vec<i32>) -> bool {
    let mut max_reach = 0;
    for i in 0..nums.len() {
        if i > max_reach {
            return false; // If current index can't be reached, return false
        }
        max_reach = std::cmp::max(max_reach, i + nums[i] as usize); // Update the maximum range
    }
    true // Return true if last index can be reached
}

fn main() {
    let nums = vec![2, 3, 1, 1, 4];
    println!("{}", can_jump(nums)); // true
}
```

This Rust code follows the same logic as the JavaScript code. It iterates through the array, updating the maximum reachable index, and checks if the current index is beyond that reach.

### Use Cases:

- **Game Development**: This can be used to check if a character or object can reach the goal based on their jump capabilities.
- **Path Optimization**: It helps to determine if a target can be reached with the given jump constraints, optimizing for the minimum number of jumps or the best path.
