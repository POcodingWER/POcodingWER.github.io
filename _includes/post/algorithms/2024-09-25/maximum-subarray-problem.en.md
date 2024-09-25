## Maximum Subarray Problem?

**Description**:  
The maximum subarray problem involves finding the contiguous subarray within a given array that has the largest sum. This problem can be efficiently solved using **Kadane's Algorithm**, which operates in O(n) time complexity.

#### Use Cases:

- **Stock Trading**: Used to analyze stock price fluctuations over a period to find the interval that yields the maximum profit.
- **Climate Analysis**: Can be used to find the longest period of temperature increase or decrease by analyzing weather data.

---

### JavaScript

```javascript
function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

// Usage
const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArray(nums)); // Output: 6 (Subarray [4, -1, 2, 1] has the largest sum)
```

### Explanation:

- The function iterates through each element of the array, tracking the maximum sum of the subarray up to the current position.
- `maxEndingHere` records the maximum sum of the subarray ending at the current position, by taking either the current element or the sum of the previous subarray plus the current element, whichever is larger.
- `maxSoFar` tracks the largest sum found so far.

---

### Rust

```rust
fn max_sub_array(nums: Vec<i32>) -> i32 {
    let mut max_so_far = nums[0];
    let mut max_ending_here = nums[0];

    for &num in nums.iter().skip(1) {
        max_ending_here = i32::max(num, max_ending_here + num);
        max_so_far = i32::max(max_so_far, max_ending_here);
    }

    max_so_far
}

fn main() {
    let nums = vec![-2, 1, -3, 4, -1, 2, 1, -5, 4];
    println!("{}", max_sub_array(nums)); // Output: 6 (Subarray [4, -1, 2, 1] has the largest sum)
}
```

### Explanation:

- `nums.iter().skip(1)` skips the first element and starts iterating from the second element.
- `i32::max` is used to select the larger value between the current element and the sum of the previous maximum subarray plus the current element.
- Finally, `max_so_far` holds the largest sum found in the array.

---

### Summary:

The maximum subarray problem involves finding the contiguous subarray with the largest sum. Kadane's Algorithm solves this problem efficiently with a time complexity of O(n). This problem can be applied to real-world scenarios like stock trading or climate data analysis.
