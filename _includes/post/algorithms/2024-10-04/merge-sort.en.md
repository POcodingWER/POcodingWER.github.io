## Merge Sort?

**Merge Sort** is a classic example of the divide-and-conquer algorithm. It works by recursively splitting the array into halves, sorting each half, and then merging them back together in a sorted manner. Merge Sort is a stable sorting algorithm, with a time complexity of O(n log n) in the worst, average, and best cases.

#### **Time Complexity**:

- Worst, Average, and Best Case: **O(n log n)**

#### **Use Cases**:

- Ideal for sorting **large datasets**, especially when stability is required.
- **External Sorting**: Useful when handling data that is too large to fit into memory and needs to be sorted from disk.

### **JavaScript Example Code for Merge Sort**

```javascript
function merge(left, right) {
  let sortedArray = [];

  while (left.length && right.length) {
    if (left[0] < right[0]) {
      sortedArray.push(left.shift());
    } else {
      sortedArray.push(right.shift());
    }
  }

  return [...sortedArray, ...left, ...right];
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

// Example usage
const array = [12, 11, 13, 5, 6, 7];
console.log(mergeSort(array)); // Output: [5, 6, 7, 11, 12, 13]
```

### **Rust Example Code for Merge Sort**

```rust
fn merge(left: Vec<i32>, right: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    let mut left = left.into_iter();
    let mut right = right.into_iter();
    let mut left_val = left.next();
    let mut right_val = right.next();

    while left_val.is_some() && right_val.is_some() {
        if left_val <= right_val {
            result.push(left_val.unwrap());
            left_val = left.next();
        } else {
            result.push(right_val.unwrap());
            right_val = right.next();
        }
    }

    // Merge remaining values
    result.extend(left_val.into_iter().chain(left));
    result.extend(right_val.into_iter().chain(right));

    result
}

fn merge_sort(arr: Vec<i32>) -> Vec<i32> {
    if arr.len() <= 1 {
        return arr;
    }

    let mid = arr.len() / 2;
    let left = merge_sort(arr[..mid].to_vec());
    let right = merge_sort(arr[mid..].to_vec());

    merge(left, right)
}

fn main() {
    let array = vec![12, 11, 13, 5, 6, 7];
    let sorted_array = merge_sort(array);
    println!("{:?}", sorted_array); // Output: [5, 6, 7, 11, 12, 13]
}
```

### Summary

**Merge Sort** is a sorting algorithm that uses the divide-and-conquer technique to sort data. It's particularly useful for large datasets or for external sorting when data can't fit entirely into memory. Merge Sort guarantees a time complexity of O(n log n) and is a stable sorting method.
