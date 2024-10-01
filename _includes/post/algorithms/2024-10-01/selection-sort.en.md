## Selection Sort?

**Selection Sort** is a sorting algorithm that works by selecting the smallest (or largest) element from a list and placing it at the front of the unsorted portion. This process is repeated until the entire list is sorted. Selection sort is relatively simple and easy to understand.

#### **Time Complexity**:

- Worst and average case: **O(n^2)**
- Best case: **O(n^2)**

#### **Use Cases**:

- Selection sort is straightforward to implement and works efficiently with small datasets.
- It can be used in memory-constrained environments and when unstable sorting is required.

### **JavaScript Example Code**

```javascript
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i; // Set current position as the index of the minimum value

    // Find the index of the minimum value in the remaining array
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j; // Update the index of the new minimum value
      }
    }

    // Swap the current position with the minimum value's position
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr; // Return the sorted array
}

// Example usage
const array = [64, 25, 12, 22, 11];
console.log(selectionSort(array)); // Output: [11, 12, 22, 25, 64]
```

### **Rust Example Code**

```rust
fn selection_sort(arr: &mut Vec<i32>) {
    let n = arr.len();

    for i in 0..n - 1 {
        let mut min_index = i; // Set current position as the index of the minimum value

        // Find the index of the minimum value in the remaining array
        for j in (i + 1)..n {
            if arr[j] < arr[min_index] {
                min_index = j; // Update the index of the new minimum value
            }
        }

        // Swap the current position with the minimum value's position
        if min_index != i {
            arr.swap(i, min_index);
        }
    }
}

// Example usage
fn main() {
    let mut array = vec![64, 25, 12, 22, 11];
    selection_sort(&mut array);
    println!("{:?}", array); // Output: [11, 12, 22, 25, 64]
}
```

### **Summary**

Selection sort is a sorting algorithm that selects the smallest element from the list and places it at the front of the unsorted portion. It is simple to implement and easy to understand, but with a time complexity of O(n^2), it is inefficient for larger datasets. It is primarily used for small datasets or in environments with memory constraints.
