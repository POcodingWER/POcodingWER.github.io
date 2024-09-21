## What is the Fisher–Yates Shuffle?

The **Fisher–Yates shuffle** (also known as the **Knuth shuffle**) is an algorithm for generating a random permutation of a finite sequence, typically an array or list. It works by iterating through the list in reverse order and swapping each element with a randomly selected element that comes before it (or with itself).

The algorithm guarantees an unbiased random shuffle, meaning each possible permutation of the list is equally likely. The time complexity is $ O(n) $, making it highly efficient for shuffling arrays.

### Steps in the Fisher–Yates Shuffle

1. Start at the last element of the array.
2. Randomly pick an element from the portion of the array that hasn’t been shuffled yet.
3. Swap the current element with the randomly selected element.
4. Repeat the process, moving from the end of the array to the beginning.

### Use Cases of Fisher–Yates Shuffle

1. **Shuffling Cards**: It’s widely used in games and simulations to shuffle a deck of cards or any set of items.
2. **Random Sampling**: Used in applications where you need to shuffle data before sampling, ensuring no bias in the selection process.
3. **Randomized Algorithms**: Many algorithms require random shuffling as part of their operations (e.g., Monte Carlo methods).
4. **Entertainment and Games**: Common in video games to shuffle lists of actions or events.

### JavaScript Example for Fisher–Yates Shuffle

```javascript
function fisherYatesShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at i and j
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Example usage
const array = [1, 2, 3, 4, 5, 6];
console.log(fisherYatesShuffle(array));
```

**Explanation**:

- The loop goes from the last index (arr.length - 1) to the first (index 0).
- For each index, it randomly selects an index $ j $ from 0 to $ i $, and swaps the elements at $ i $ and $ j $.

### Rust Example for Fisher–Yates Shuffle

In Rust, we can use the `rand` crate for random number generation.

```toml
# Add this to your Cargo.toml file
[dependencies]
rand = "0.8"
```

```rust
use rand::Rng;

fn fisher_yates_shuffle<T>(arr: &mut [T]) {
    let mut rng = rand::thread_rng();

    for i in (1..arr.len()).rev() {
        // Generate a random index from 0 to i
        let j = rng.gen_range(0..=i);
        // Swap elements at i and j
        arr.swap(i, j);
    }
}

fn main() {
    let mut array = vec![1, 2, 3, 4, 5, 6];
    fisher_yates_shuffle(&mut array);
    println!("{:?}", array);
}
```

**Explanation**:

- The `rand::thread_rng()` function creates a random number generator.
- The `rng.gen_range(0..=i)` generates a random index from 0 to $ i $.
- The `arr.swap(i, j)` function swaps the elements at indices $ i $ and $ j $.

### Summary:

The **Fisher–Yates shuffle** is a simple yet efficient algorithm for generating random permutations of a list, commonly used for shuffling cards, arrays, or any data where a random order is desired. Both JavaScript and Rust implementations follow a similar logic of iterating through the array and swapping elements with randomly selected ones to ensure all permutations are equally likely.
