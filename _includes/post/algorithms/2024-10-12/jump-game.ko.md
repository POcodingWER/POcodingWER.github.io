## Jump Game?

**Jump Game**는 배열 내에서 이동할 수 있는 최대 범위가 주어진 상황에서 마지막 인덱스에 도달할 수 있는지 여부를 확인하는 문제입니다. 배열의 각 요소는 그 위치에서 몇 칸까지 점프할 수 있는지를 나타냅니다.

예를 들어, 배열 `[2, 3, 1, 1, 4]`가 주어지면 첫 번째 위치에서 최대 두 칸까지 점프할 수 있습니다. 목표는 배열의 첫 번째 인덱스에서 시작해서 마지막 인덱스에 도달할 수 있는지 여부를 판단하는 것입니다.

### 사용 사례:

- **게임 개발**: 플랫폼에서 점프할 수 있는 범위를 계산하는 경우, 캐릭터가 끝까지 도달할 수 있는지 여부를 결정하는 데 사용됩니다.
- **동적 계획법 문제**: 최적화 문제에서 자주 사용되며, 점프의 최소 횟수나 가능한 경로를 찾을 때 사용됩니다.

---

### JavaScript 예제 코드

```javascript
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) {
      return false; // 현재 인덱스에 도달할 수 없으면 false
    }
    maxReach = Math.max(maxReach, i + nums[i]); // 점프할 수 있는 최대 범위 갱신
  }
  return true; // 마지막 인덱스에 도달 가능
}

// 테스트 케이스
let nums = [2, 3, 1, 1, 4];
console.log(canJump(nums)); // true
```

이 코드는 배열 `nums`에서 시작하여 마지막 인덱스까지 도달할 수 있는지 여부를 판단합니다. 각 인덱스에서 이동할 수 있는 최대 범위를 계산하고, 현재 위치에서 해당 범위 내에 도달할 수 있는지 여부를 체크합니다.

---

### Rust 예제 코드

```rust
fn can_jump(nums: Vec<i32>) -> bool {
    let mut max_reach = 0;
    for i in 0..nums.len() {
        if i > max_reach {
            return false; // 현재 인덱스에 도달할 수 없으면 false
        }
        max_reach = std::cmp::max(max_reach, i + nums[i] as usize); // 점프할 수 있는 최대 범위 갱신
    }
    true // 마지막 인덱스에 도달 가능
}

fn main() {
    let nums = vec![2, 3, 1, 1, 4];
    println!("{}", can_jump(nums)); // true
}
```

이 Rust 코드는 JavaScript 코드와 동일한 논리를 따릅니다. 각 인덱스에서 점프할 수 있는 최대 범위를 계산하여 마지막 인덱스에 도달할 수 있는지 판단합니다.

### 사용 예시:

- **게임 개발**: 캐릭터나 물체가 특정 위치까지 도달할 수 있는지 여부를 결정하는 데 사용됩니다.
- **경로 최적화**: 주어진 점프 범위 내에서 최소한의 점프로 목표 지점에 도달할 수 있는지 계산하는 데 사용됩니다.
