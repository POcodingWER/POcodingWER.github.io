## Interpolation Search?

**Interpolation Search** is a search algorithm used to find a specific value in a **sorted array**. It is similar to binary search but uses the distribution of values to locate the target more quickly. Instead of checking the middle of the array, interpolation search predicts where the target value might be based on its value and the values at the boundaries of the array, starting the search from that predicted position. This method is most effective when values are uniformly distributed.

#### **Time Complexity**:

- The average time complexity is **O(log log n)**, but in the worst case, it can be **O(n)**. This occurs when the values in the array are unevenly distributed.

#### **Use Cases**:

- **Uniformly Distributed Data**: The algorithm is most efficient when the data is uniformly distributed.
- **Sorted Arrays**: Interpolation search can only be applied to sorted arrays.
- **Predictable Value Positions**: It is useful when you expect the target value to be close to a certain position in the array.

---

### **JavaScript Example Code**

```javascript
function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    // Calculate the position using interpolation
    const pos =
      low +
      Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));

    if (arr[pos] === target) {
      return pos; // Return index if target value is found
    }

    if (arr[pos] < target) {
      low = pos + 1; // Search in the right half
    } else {
      high = pos - 1; // Search in the left half
    }
  }

  return -1; // Return -1 if target value is not found
}

// Example usage
const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const target = 70;
console.log(interpolationSearch(arr, target)); // Output: 6 (index of target 70)
```

#### **Explanation**:

- The `interpolationSearch` function searches for the `target` value in a sorted array `arr`.
- It calculates the expected position of the target within the array range and starts the search from that position.

---

### **Rust Example Code**

```rust
fn interpolation_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut low = 0;
    let mut high = arr.len() as i32 - 1;

    while low <= high && target >= arr[low as usize] && target <= arr[high as usize] {
        // Calculate the position using interpolation
        let pos = low + ((high - low) / (arr[high as usize] - arr[low as usize])) * (target - arr[low as usize]);

        if arr[pos as usize] == target {
            return Some(pos as usize); // Return index if target value is found
        }

        if arr[pos as usize] < target {
            low = pos + 1; // Search in the right half
        } else {
            high = pos - 1; // Search in the left half
        }
    }

    None // Return None if target value is not found
}

fn main() {
    let arr = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    let target = 70;

    match interpolation_search(&arr, target) {
        Some(index) => println!("Found at index: {}", index),
        None => println!("Not found"),
    }
}
```

#### **Explanation**:

- The `interpolation_search` function in Rust checks a sorted array `arr` for the `target` value.
- It calculates the expected position of the given value and starts the search from that position.

---

### **Summary**:

Interpolation Search is a search algorithm used to find a specific value in a **sorted array** that leverages the distribution of values to speed up the search process. This algorithm is very efficient for **uniformly distributed data** and has an average time complexity of **O(log log n)**.
