## Insertion Sort?

**Insertion Sort** is a sorting algorithm where each element of an array is compared one by one and inserted into its correct position. It works by maintaining a sorted portion of the array and inserting each new element into the correct position within that sorted portion. Insertion sort is intuitive and simple, making it very effective for sorting small arrays.

#### **Time Complexity**:

- Worst and average case: **O(n^2)**
- Best case (when the array is already sorted): **O(n)**

#### **Use Cases**:

- Insertion sort is efficient when the data is nearly sorted.
- It performs well on small datasets and is also good when elements are added incrementally to a list.

### **JavaScript Example Code**

```javascript
function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i]; // Element to be inserted
    let j = i - 1;

    // Move elements greater than key to one position ahead of their current position
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }

    arr[j + 1] = key; // Insert the element
  }
  return arr; // Return the sorted array
}

// Example usage
const array = [12, 11, 13, 5, 6];
console.log(insertionSort(array)); // Output: [5, 6, 11, 12, 13]
```

### **Rust Example Code**

```rust
fn insertion_sort(arr: &mut Vec<i32>) {
    let n = arr.len();

    for i in 1..n {
        let key = arr[i]; // Element to be inserted
        let mut j = i as i32 - 1;

        // Move elements greater than key to one position ahead of their current position
        while j >= 0 && arr[j as usize] > key {
            arr[(j + 1) as usize] = arr[j as usize];
            j -= 1;
        }

        arr[(j + 1) as usize] = key; // Insert the element
    }
}

// Example usage
fn main() {
    let mut array = vec![12, 11, 13, 5, 6];
    insertion_sort(&mut array);
    println!("{:?}", array); // Output: [5, 6, 11, 12, 13]
}
```

### **Summary**

Insertion Sort works by comparing each element of the array and inserting it into its correct position. It maintains the sorted portion of the array while inserting new elements, which makes it highly efficient for small arrays or nearly sorted data. However, it can be inefficient for larger datasets.
