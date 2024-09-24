## 배낭 문제 (Knapsack Problem)?

**배낭 문제**는 제한된 용량의 배낭에 다양한 무게와 가치가 있는 물건들을 넣어 최대 가치를 얻는 문제입니다. 배낭 문제는 최적화 문제 중 하나로, 다양한 변형들이 존재하며 실제로 여러 가지 분야에 응용될 수 있습니다. 대표적으로 세 가지 배낭 문제가 있습니다:

1. **0/1 배낭 문제 (0/1 Knapsack Problem)**: 각 물건을 넣거나 안 넣는 방식으로, 부분적으로 나눠서 넣을 수는 없습니다.
2. **분할 배낭 문제 (Fractional Knapsack Problem)**: 물건을 부분적으로 나누어 넣을 수 있습니다.
3. **무제한 배낭 문제 (Unbounded Knapsack Problem)**: 같은 물건을 여러 번 선택할 수 있습니다.

---

## 1. 0/1 배낭 문제 (0/1 Knapsack Problem)

**설명**: 각 아이템을 선택할지 말지를 결정합니다. 부분적으로 나눌 수 없으며, 선택된 아이템들의 총 무게가 배낭의 용량을 넘지 않도록 하면서 총 가치를 최대화하는 것이 목표입니다.

#### 사용 사례:

- **프로젝트 선택**: 특정 자원을 넘지 않으면서 최대 이익을 내기 위한 프로젝트 선택.
- **투자 계획**: 한정된 자본 내에서 최대 수익을 얻기 위한 투자 조합 선택.

### 0/1 배낭 문제 JavaScript 예제

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

// 사용 예시
const weights = [10, 20, 30];
const values = [60, 100, 120];
const capacity = 50;

console.log(knapsack(weights, values, capacity)); // 출력: 220
```

### 0/1 배낭 문제 Rust 예제

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

    println!("{}", knapsack(&weights, &values, capacity)); // 출력: 220
}
```

---

## 2. 분할 배낭 문제 (Fractional Knapsack Problem)

**설명**: 물건을 부분적으로 나누어 넣을 수 있습니다. 물건을 분할할 수 있기 때문에 탐욕 알고리즘으로 해결할 수 있으며, 각 물건의 가치 대비 무게 비율이 높은 순서대로 선택하여 배낭을 채워나가는 방식입니다.

#### 사용 사례:

- **주식 매매**: 주식을 부분적으로 팔아서 이익을 극대화하는 문제.
- **자원 할당**: 자원을 부분적으로 사용할 수 있을 때, 최적의 분배 방법을 찾는 문제.

### 분할 배낭 문제 JavaScript 예제

```javascript
function fractionalKnapsack(weights, values, capacity) {
  const items = values.map((value, i) => ({
    weight: weights[i],
    value: value,
    ratio: value / weights[i],
  }));

  // 가치 대비 무게 비율 순으로 정렬
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

// 사용 예시
const weights = [10, 20, 30];
const values = [60, 100, 120];
const capacity = 50;

console.log(fractionalKnapsack(weights, values, capacity)); // 출력: 240
```

### 분할 배낭 문제 Rust 예제

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

    // 가치 대비 무게 비율 순으로 정렬
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

    println!("{}", fractional_knapsack(&weights, &values, capacity)); // 출력: 240
}
```

---

## 3. 무제한 배낭 문제 (Unbounded Knapsack Problem)

**설명**: 물건을 여러 번 선택할 수 있습니다. 즉, 같은 물건을 여러 번 사용할 수 있으며, 배낭의 용량 내에서 최대 가치를 얻는 것이 목표입니다. 동적 프로그래밍을 통해 해결할 수 있습니다.

#### 사용 사례:

- **동전 교환 문제**: 특정 금액을 만들기 위한 최적의 동전 조합을 찾는 문제.
- **무제한 자원 할당**: 같은 자원을 여러 번 사용할 수 있을 때 최적의 할당 방법을 찾는 문제.

### 무제한 배낭 문제 JavaScript 예제

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

// 사용 예시
const weights = [2, 3, 4];
const values = [4, 5, 6];
const capacity = 8;

console.log(unboundedKnapsack(weights, values, capacity)); // 출력: 12
```

### 무제한 배낭 문제 Rust 예제

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

    println!("{}", unbounded_knapsack(&weights, &values, capacity)); // 출력: 12
}
```

---

## 요약

1. **0/1 배낭 문제**: 물건을 넣거나 넣지 않는 문제로, 물건을 나눠서 넣을 수 없습니다.
2. **분할 배낭 문제**: 물건을 나눠서 넣을 수 있으며, 가치 대비 무게 비율이 높은 물건부터 선택합니다.
3. **무제한 배낭 문제**: 같은 물건을 여러 번 선택할 수 있으며, 동적 프로그래밍을 사용하여 최대 가치를 구합니다
