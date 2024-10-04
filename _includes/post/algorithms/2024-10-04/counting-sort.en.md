## Counting Sort?

**Counting Sort** is a non-comparative sorting algorithm used to sort integers or objects that can be mapped to integers. The algorithm counts the occurrences of each unique element in the input array and uses this information to place each element at the correct position in the output array. It works by creating a **count array** that stores the frequency of each unique value. The count array is then transformed to represent the position of each element in the sorted array.

Counting Sort is efficient when the range of input values is not significantly larger than the number of elements in the array, making it suitable for datasets where the elements fall within a known, relatively small range.

#### **Time Complexity**:

- **Time Complexity**: **O(n + k)**, where **n** is the number of elements in the input array, and **k** is the range of the input values (difference between the maximum and minimum value).
- **Space Complexity**: **O(k)**, where **k** is the range of the input.

#### **Use Cases**:

- **Counting Sort** is used when the input consists of non-negative integers within a known range.
- It is commonly used in **distribution sort** techniques, **radix sort**, and when integer sorting is required for small ranges of values (e.g., sorting grades, ages, or votes).

### **JavaScript Counting Sort Example Code**

```javascript
function countingSort(arr, maxVal) {
  let count = new Array(maxVal + 1).fill(0);
  let sortedArr = [];

  // Count the occurrences of each element
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }

  // Build the sorted array
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      sortedArr.push(i);
      count[i]--;
    }
  }

  return sortedArr;
}

// Example usage
const array = [4, 2, 2, 8, 3, 3, 1];
console.log(countingSort(array, 8)); // Output: [1, 2, 2, 3, 3, 4, 8]
```

### **Rust Counting Sort Example Code**

```rust
fn counting_sort(arr: &mut [usize], max_val: usize) -> Vec<usize> {
    let mut count = vec![0; max_val + 1]; // Initialize count array
    let mut sorted_arr = Vec::new(); // Initialize result array

    // Count occurrences of each element
    for &num in arr.iter() {
        count[num] += 1;
    }

    // Build the sorted array
    for (num, &c) in count.iter().enumerate() {
        for _ in 0..c {
            sorted_arr.push(num);
        }
    }

    sorted_arr
}

fn main() {
    let mut array = [4, 2, 2, 8, 3, 3, 1];
    let sorted_array = counting_sort(&mut array, 8);
    println!("{:?}", sorted_array); // Output: [1, 2, 2, 3, 3, 4, 8]
}
```

### Summary

**Counting Sort** is a highly efficient algorithm for sorting integers when the range of the input values is known and limited. It has a linear time complexity of **O(n + k)**, making it faster than comparison-based algorithms like merge sort or quicksort for specific use cases. However, it is not a general-purpose sorting algorithm since it requires additional memory proportional to the range of input values, so it is best used when the input size is large and the value range is small.
