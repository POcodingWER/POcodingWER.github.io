## Integer Partition?

**Integer Partition** refers to the process of breaking down a positive integer into smaller non-negative integers, where the sum of those integers equals the original number. The order of the integers does not matter, but the number and composition of integers do.

For example:

- The integer partition of `4` would include:  
  `4`, `3 + 1`, `2 + 2`, `2 + 1 + 1`, `1 + 1 + 1 + 1`.

### Applications of Integer Partition

Integer partitions have several practical applications, particularly in:

- **Combinatorics:** Counting ways to arrange or combine items.
- **Number Theory:** Studying the properties of integers and their relations.
- **Cryptography:** In some encryption schemes and generating keys.
- **Quantum Physics:** Modeling particle states in certain quantum systems.
- **Dynamic Programming:** Used in problems involving subset sums or partitioning arrays.

### JavaScript Example

Here’s a simple implementation in JavaScript to generate all partitions of a given integer `n`:

```javascript
function partition(n) {
  const result = [];

  function _partition(n, max, prefix) {
    if (n === 0) {
      result.push(prefix);
      return;
    }
    for (let i = Math.min(max, n); i >= 1; i--) {
      _partition(n - i, i, [...prefix, i]);
    }
  }

  _partition(n, n, []);
  return result;
}

const number = 4;
console.log(partition(number));
```

### Explanation of the JavaScript Code

1. **`partition(n)`** is the main function to find partitions of `n`.
2. **`_partition(n, max, prefix)`** is a recursive helper function that explores different ways to partition `n` using integers less than or equal to `max`.
3. The result of partitioning `4` will give:

```javascript
[[4], [3, 1], [2, 2], [2, 1, 1], [1, 1, 1, 1]];
```

### Rust Example

Here’s a Rust implementation to generate integer partitions of a number `n`:

```rust
fn partition(n: usize) -> Vec<Vec<usize>> {
    let mut result = Vec::new();

    fn _partition(n: usize, max: usize, prefix: Vec<usize>, result: &mut Vec<Vec<usize>>) {
        if n == 0 {
            result.push(prefix);
            return;
        }
        for i in (1..=max).rev() {
            if i <= n {
                let mut new_prefix = prefix.clone();
                new_prefix.push(i);
                _partition(n - i, i, new_prefix, result);
            }
        }
    }

    _partition(n, n, Vec::new(), &mut result);
    result
}

fn main() {
    let number = 4;
    let partitions = partition(number);
    for part in partitions {
        println!("{:?}", part);
    }
}
```

### Explanation of the Rust Code

1. **`partition(n)`** is the main function that calls the recursive helper function `_partition`.
2. **`_partition(n, max, prefix, result)`** is the recursive function that explores partitions, appending valid partitions to the result.
3. Output for `4` will look like:

```rust
[4]
[3, 1]
[2, 2]
[2, 1, 1]
[1, 1, 1, 1]
```

### Summary

- **Integer Partition** is the process of decomposing an integer into sums of other integers.
- It is used in combinatorics, cryptography, dynamic programming, and physics.
- Both JavaScript and Rust examples illustrate how recursive approaches can be used to find all integer partitions of a given number.
