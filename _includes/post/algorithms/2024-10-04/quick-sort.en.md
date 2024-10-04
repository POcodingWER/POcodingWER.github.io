## Quick Sort?

**Quicksort** is a divide-and-conquer algorithm that is one of the most efficient sorting algorithms. The main idea is to pick a "pivot" element from the array and partition the remaining elements into two sub-arrays: those less than the pivot and those greater than the pivot. Then, it recursively sorts the sub-arrays.

#### **Time Complexity**:

- Worst-case: **O(n²)** (but with good pivot selection, it generally performs at O(n log n))
- Average case: **O(n log n)**

#### **Use Cases**:

- Widely used for sorting large datasets.
- It is particularly useful when **in-place sorting** is needed, as it uses minimal extra memory.
- Quicksort is often faster than other algorithms in practice for general sorting tasks.

### **JavaScript Quicksort Example Code**

```javascript
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1]; // Choose the last element as the pivot
  const left = [];
  const right = [];

  // Partition the array into two halves
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  // Recursively sort both halves and merge them with the pivot
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// Example usage
const array = [12, 4, 5, 6, 7, 3, 1, 15];
console.log(quickSort(array)); // Output: [1, 3, 4, 5, 6, 7, 12, 15]
```

### **Rust Quicksort Example Code**

```rust
fn quick_sort(arr: &mut [i32]) {
    if arr.len() <= 1 {
        return;
    }

    let pivot_index = partition(arr);
    let (left, right) = arr.split_at_mut(pivot_index);
    quick_sort(left);
    quick_sort(&mut right[1..]); // Sort the elements after the pivot
}

fn partition(arr: &mut [i32]) -> usize {
    let pivot = arr[arr.len() - 1]; // Choose the last element as the pivot
    let mut i = 0;

    for j in 0..arr.len() - 1 {
        if arr[j] < pivot {
            arr.swap(i, j);
            i += 1;
        }
    }

    arr.swap(i, arr.len() - 1); // Place the pivot in its correct position
    i
}

fn main() {
    let mut array = [12, 4, 5, 6, 7, 3, 1, 15];
    quick_sort(&mut array);
    println!("{:?}", array); // Output: [1, 3, 4, 5, 6, 7, 12, 15]
}
```

### Summary

**Quicksort** is an efficient sorting algorithm that uses the divide-and-conquer approach. It has an average time complexity of O(n log n), making it suitable for large datasets. It is an **in-place** sorting algorithm, meaning it uses very little additional memory, and is widely used for general sorting tasks due to its speed and efficiency in practice.
