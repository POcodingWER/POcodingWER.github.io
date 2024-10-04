## Heap Sort?

**Heap Sort** is a sorting algorithm that uses the binary heap data structure. The algorithm starts by converting the given array into a max heap, where the largest value is at the root. It then repeatedly swaps the largest value with the last element in the array and reduces the size of the heap, continuing to reheapify the remaining elements. Heap Sort is a comparison-based algorithm that always runs in O(n log n) time complexity.

#### **Time Complexity**:

- Worst, Average, and Best Case: **O(n log n)**

#### **Use Cases**:

- Commonly used for sorting large datasets.
- Efficient in environments where memory usage is a concern (in-place sorting).

### **JavaScript Example Code for Heap Sort**

```javascript
function heapify(arr, n, i) {
  let largest = i; // Initialize largest as root
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // If left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  // If right child is larger than the largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // If largest is not root
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

function heapSort(arr) {
  const n = arr.length;

  // Build a max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements one by one from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

// Example usage
const array = [12, 11, 13, 5, 6, 7];
console.log(heapSort(array)); // Output: [5, 6, 7, 11, 12, 13]
```

### **Rust Example Code for Heap Sort**

```rust
fn heapify(arr: &mut [i32], n: usize, i: usize) {
    let mut largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    // If left child is larger than root
    if left < n && arr[left] > arr[largest] {
        largest = left;
    }

    // If right child is larger than the largest so far
    if right < n && arr[right] > arr[largest] {
        largest = right;
    }

    // If largest is not root
    if largest != i {
        arr.swap(i, largest);
        heapify(arr, n, largest);
    }
}

fn heap_sort(arr: &mut [i32]) {
    let n = arr.len();

    // Build max heap
    for i in (0..n / 2).rev() {
        heapify(arr, n, i);
    }

    // Extract elements from heap one by one
    for i in (1..n).rev() {
        arr.swap(0, i);
        heapify(arr, i, 0);
    }
}

fn main() {
    let mut array = [12, 11, 13, 5, 6, 7];
    heap_sort(&mut array);
    println!("{:?}", array); // Output: [5, 6, 7, 11, 12, 13]
}
```

### **Summary**

**Heap Sort** is an efficient sorting algorithm that uses the binary heap structure. It is particularly useful for sorting large datasets, offering O(n log n) time complexity consistently. The algorithm works well in memory-limited environments as it performs in-place sorting without the need for additional memory allocation.
