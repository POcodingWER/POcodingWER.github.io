## Bubble Sort?

**Bubble Sort** is one of the simplest sorting algorithms, which works by comparing adjacent elements in a list. The algorithm repeatedly traverses the list, comparing each pair of adjacent elements and swapping them if they are in the wrong order. It is called "bubble sort" because the largest elements "bubble" to the end of the list.

#### **Time Complexity**:

- Worst and average case: **O(n^2)**
- Best case (already sorted): **O(n)**

#### **Use Cases**:

- Bubble sort is often used in educational contexts and for learning algorithms due to its simplicity.
- It can be used for small datasets, but it is inefficient for larger datasets.

### **JavaScript Example Code**

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;

  do {
    swapped = false; // Initialize
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Compare and swap adjacent elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true; // Record that a swap occurred
      }
    }
  } while (swapped); // Repeat if a swap occurred

  return arr; // Return the sorted array
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(array)); // Output: [11, 12, 22, 25, 34, 64, 90]
```

### **Rust Example Code**

```rust
fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    let mut swapped;

    loop {
        swapped = false; // Initialize
        for i in 0..n - 1 {
            if arr[i] > arr[i + 1] {
                // Compare and swap adjacent elements
                arr.swap(i, i + 1);
                swapped = true; // Record that a swap occurred
            }
        }
        if !swapped {
            break; // Exit if no swaps occurred
        }
    }
}

// Example usage
fn main() {
    let mut array = vec![64, 34, 25, 12, 22, 11, 90];
    bubble_sort(&mut array);
    println!("{:?}", array); // Output: [11, 12, 22, 25, 34, 64, 90]
}
```

### **Summary**

Bubble sort is a simple sorting algorithm that works by comparing and swapping adjacent elements. It is suitable for small datasets but is not efficient for larger datasets due to its quadratic time complexity.
