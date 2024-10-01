## Jump Search?

**Jump Search** is a search algorithm that is more efficient than linear search but not as fast as binary search. It works only on **sorted arrays** and involves "jumping" ahead by a fixed step (typically the square root of the array size), then performing a linear search within a smaller range where the target might be found.

#### **Time Complexity**:

- The time complexity of Jump Search is **O(√n)**, where n is the size of the array. The optimal jump size is √n, making it faster than linear search, especially for large datasets.

#### **Use Cases**:

- **Sorted Arrays**: This algorithm is only applicable when the array or data set is sorted.
- **Medium-Sized Data**: It performs well when you want a more efficient search for medium-sized data where sorting is not an issue.
- **When Binary Search is Overkill**: If binary search cannot be applied due to some constraints, Jump Search provides a simpler alternative.

---

### **JavaScript Example Code**

```javascript
function jumpSearch(arr, target) {
  let length = arr.length;
  let step = Math.floor(Math.sqrt(length)); // Jump size: square root of the array length
  let prev = 0;

  // Jump until we find a block where the target may reside
  while (arr[Math.min(step, length) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(length));
    if (prev >= length) return -1; // Return -1 if target is not found
  }

  // Perform linear search within the identified block
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, length)) return -1; // Return -1 if not found
  }

  // If target is found
  if (arr[prev] === target) return prev;

  return -1; // Return -1 if target not found
}

// Example usage
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 9;
console.log(jumpSearch(arr, target)); // Output: 4 (index of value 9)
```

#### **Explanation**:

- The `jumpSearch` function searches for the `target` value in a sorted array `arr`.
- It "jumps" by the square root of the array size, and once it identifies a possible range, it performs a linear search within that range.

---

### **Rust Example Code**

```rust
use std::cmp;

fn jump_search(arr: &[i32], target: i32) -> Option<usize> {
    let length = arr.len();
    let step = (length as f64).sqrt() as usize; // Jump size
    let mut prev = 0;

    // Jump to find the block where the target may reside
    let mut current = step;
    while current < length && arr[current - 1] < target {
        prev = current;
        current += step;
        if current > length {
            current = length;
        }
    }

    // Perform linear search in the identified block
    for i in prev..cmp::min(current, length) {
        if arr[i] == target {
            return Some(i); // Return index if target is found
        }
    }

    None // Return None if target is not found
}

fn main() {
    let arr = [1, 3, 5, 7, 9, 11, 13, 15];
    let target = 9;

    match jump_search(&arr, target) {
        Some(index) => println!("Found at index: {}", index),
        None => println!("Not found"),
    }
}
```

#### **Explanation**:

- The `jump_search` function in Rust checks a sorted array `arr` to find the `target` value.
- It jumps by the square root of the array size, narrowing down the range where the value might be, and then performs a linear search within that range.
- If the value is found, it returns the index; if not, it returns `None`.

---

### **Summary**:

Jump Search is a search algorithm designed for sorted arrays with a time complexity of **O(√n)**. It provides an efficient alternative when linear search is too slow but binary search is either unavailable or overkill. It works by jumping ahead by a step size and then performing a linear search within a specific range. Both JavaScript and Rust can implement Jump Search using basic looping constructs.
