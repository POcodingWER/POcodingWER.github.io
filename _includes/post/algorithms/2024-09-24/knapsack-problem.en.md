## Knapsack Problem?

The **Knapsack Problem** is a classic optimization problem where you need to maximize the value of items placed in a knapsack with a weight limit. There are three main variants of the knapsack problem:

1. **0/1 Knapsack Problem**: Each item can either be included or excluded, with no partial item selections.
2. **Fractional Knapsack Problem**: Items can be split, meaning partial amounts of an item can be taken.
3. **Unbounded Knapsack Problem**: You can include an unlimited number of the same item.

---

## 1. 0/1 Knapsack Problem

**Description**: In this variant, you must decide whether to include each item in the knapsack. You cannot take a fraction of an item; it's all or nothing.

#### Use Cases:

- **Project Selection**: Choosing projects under a budget constraint to maximize profit.
- **Investment Planning**: Selecting investments to maximize return under a limited budget.

### 0/1 Knapsack Problem JavaScript Example

```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}

// Usage example
const weights = [10, 20, 30];
const values = [60, 100, 120];
const capacity = 50;

console.log(knapsack(weights, values, capacity)); // Output: 220
```

### 0/1 Knapsack Problem Rust Example

```rust
fn knapsack(weights: &[usize], values: &[usize], capacity: usize) -> usize {
    let n = weights.len();
    let mut dp = vec![vec![0; capacity + 1]; n + 1];

    for i in 1..=n {
        for w in 0..=capacity {
            if weights[i - 1] <= w {
                dp[i][w] = dp[i][w].max(dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    dp[n][capacity]
}

fn main() {
    let weights = vec![10, 20, 30];
    let values = vec![60, 100, 120];
    let capacity = 50;

    println!("{}", knapsack(&weights, &values, capacity)); // Output: 220
}
```

---

## 2. Fractional Knapsack Problem

**Description**: In this problem, you can take fractions of an item. The problem is solvable using a greedy algorithm where you pick items based on their value-to-weight ratio.

#### Use Cases:

- **Stock Trading**: Selling partial amounts of stocks to maximize profit.
- **Resource Allocation**: Allocating divisible resources in an optimal way.

### Fractional Knapsack Problem JavaScript Example

```javascript
function fractionalKnapsack(weights, values, capacity) {
  const items = values.map((value, i) => ({
    weight: weights[i],
    value: value,
    ratio: value / weights[i],
  }));

  // Sort items by value-to-weight ratio in descending order
  items.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  for (let i = 0; i < items.length; i++) {
    if (capacity === 0) break;

    if (items[i].weight <= capacity) {
      totalValue += items[i].value;
      capacity -= items[i].weight;
    } else {
      totalValue += items[i].value * (capacity / items[i].weight);
      capacity = 0;
    }
  }

  return totalValue;
}

// Usage example
const weights = [10, 20, 30];
const values = [60, 100, 120];
const capacity = 50;

console.log(fractionalKnapsack(weights, values, capacity)); // Output: 240
```

### Fractional Knapsack Problem Rust Example

```rust
#[derive(Debug)]
struct Item {
    weight: f64,
    value: f64,
}

fn fractional_knapsack(weights: &[f64], values: &[f64], capacity: f64) -> f64 {
    let mut items: Vec<Item> = weights.iter().zip(values.iter())
        .map(|(&w, &v)| Item { weight: w, value: v })
        .collect();

    // Sort items by value-to-weight ratio in descending order
    items.sort_by(|a, b| (b.value / b.weight).partial_cmp(&(a.value / a.weight)).unwrap());

    let mut total_value = 0.0;
    let mut remaining_capacity = capacity;

    for item in items {
        if remaining_capacity == 0.0 {
            break;
        }

        if item.weight <= remaining_capacity {
            total_value += item.value;
            remaining_capacity -= item.weight;
        } else {
            total_value += item.value * (remaining_capacity / item.weight);
            remaining_capacity = 0.0;
        }
    }

    total_value
}

fn main() {
    let weights = vec![10.0, 20.0, 30.0];
    let values = vec![60.0, 100.0, 120.0];
    let capacity = 50.0;

    println!("{}", fractional_knapsack(&weights, &values, capacity)); // Output: 240
}
```

---

## 3. Unbounded Knapsack Problem

**Description**: In this problem, you can take an unlimited number of the same item. You need to maximize the value while staying within the knapsack's weight capacity.

#### Use Cases:

- **Coin Change Problem**: Determining the minimum number of coins needed to make a given amount.
- **Resource Allocation**: Optimally allocating reusable resources.

### Unbounded Knapsack Problem JavaScript Example

```javascript
function unboundedKnapsack(weights, values, capacity) {
  const dp = Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    for (let w = weights[i]; w <= capacity; w++) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }

  return dp[capacity];
}

// Usage example
const weights = [2, 3, 4];
const values = [4, 5, 6];
const capacity = 8;

console.log(unboundedKnapsack(weights, values, capacity)); // Output: 12
```

### Unbounded Knapsack Problem Rust Example

```rust
fn unbounded_knapsack(weights: &[usize], values: &[usize], capacity: usize) -> usize {
    let mut dp = vec![0; capacity + 1];

    for i in 0..weights.len() {
        for w in weights[i]..=capacity {
            dp[w] = dp[w].max(dp[w - weights[i]] + values[i]);
        }
    }

    dp[capacity]
}

fn main() {
    let weights = vec![2, 3, 4];
    let values = vec![4, 5, 6];
    let capacity = 8;

    println!("{}", unbounded_knapsack(&weights, &values, capacity)); // Output: 12
}
```

---

### Summary

1. **0/1 Knapsack Problem**: You must decide whether to include or exclude items without splitting them.
2. **Fractional Knapsack Problem**: Items can be split, and you can take fractions of items based on their value-to-weight ratio.
3. **Unbounded Knapsack Problem**: You can include an unlimited number of the same item, using dynamic programming to maximize value.

These problems are commonly used in resource allocation, investment planning, and similar optimization scenarios.
