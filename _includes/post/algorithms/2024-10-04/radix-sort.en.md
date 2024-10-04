## Radix Sort?

**Radix Sort** is a non-comparative integer sorting algorithm that sorts numbers digit by digit, starting from either the least significant digit (LSD) or the most significant digit (MSD). It groups numbers based on the value of each digit, sorting one digit at a time. Radix Sort is often combined with **Counting Sort** or **Bucket Sort** as a subroutine to handle each digit's sorting.

Radix Sort is efficient for sorting large datasets of numbers where the number of digits in the numbers is small relative to the dataset size.

#### **Time Complexity**:

- **Time Complexity**: **O(d \* (n + b))**, where:
  - **n** is the number of elements in the array,
  - **d** is the number of digits in the largest number, and
  - **b** is the base for representing numbers (usually 10 for decimal numbers).
- **Space Complexity**: **O(n + b)**.

#### **Use Cases**:

- Radix Sort is used when the input consists of numbers, and the maximum value is not too large (to avoid a large number of digits).
- It is particularly useful for sorting integers or strings where each character or number can be considered as a digit (e.g., sorting long phone numbers, IP addresses, or large datasets of integers).

---

### **JavaScript Radix Sort Example Code**

```javascript
function getMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function countingSort(arr, exp) {
  const output = new Array(arr.length).fill(0);
  const count = new Array(10).fill(0);

  // Count occurrences of digits
  for (let i = 0; i < arr.length; i++) {
    let index = Math.floor(arr[i] / exp) % 10;
    count[index]++;
  }

  // Modify count array to store actual positions
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array
  for (let i = arr.length - 1; i >= 0; i--) {
    let index = Math.floor(arr[i] / exp) % 10;
    output[count[index] - 1] = arr[i];
    count[index]--;
  }

  // Copy output array to the original array
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
}

function radixSort(arr) {
  const max = getMax(arr);

  // Apply counting sort for every digit (1s, 10s, 100s, etc.)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(arr, exp);
  }

  return arr;
}

// Example usage
const array = [170, 45, 75, 90, 802, 24, 2, 66];
console.log(radixSort(array)); // Output: [2, 24, 45, 66, 75, 90, 170, 802]
```

---

### **Rust Radix Sort Example Code**

```rust
fn get_max(arr: &[i32]) -> i32 {
    *arr.iter().max().unwrap()
}

fn counting_sort(arr: &mut [i32], exp: i32) {
    let mut output = vec![0; arr.len()];
    let mut count = vec![0; 10];

    // Count occurrences of digits
    for &num in arr.iter() {
        let index = (num / exp) % 10;
        count[index as usize] += 1;
    }

    // Modify count array to store actual positions
    for i in 1..10 {
        count[i] += count[i - 1];
    }

    // Build the output array
    for &num in arr.iter().rev() {
        let index = (num / exp) % 10;
        output[count[index as usize] as usize - 1] = num;
        count[index as usize] -= 1;
    }

    // Copy the output array to the original array
    arr.copy_from_slice(&output);
}

fn radix_sort(arr: &mut [i32]) {
    let max = get_max(arr);

    // Apply counting sort for every digit (1s, 10s, 100s, etc.)
    let mut exp = 1;
    while max / exp > 0 {
        counting_sort(arr, exp);
        exp *= 10;
    }
}

fn main() {
    let mut array = [170, 45, 75, 90, 802, 24, 2, 66];
    radix_sort(&mut array);
    println!("{:?}", array); // Output: [2, 24, 45, 66, 75, 90, 170, 802]
}
```

---

### Summary

**Radix Sort** is a powerful sorting algorithm, particularly suited for sorting integers or strings in large datasets where the number of digits or characters is relatively small compared to the size of the dataset. Its time complexity is linear with respect to the number of digits in the input, making it more efficient than comparison-based algorithms in certain cases. However, it requires additional space for auxiliary arrays and is only efficient when the range of the data is small.
