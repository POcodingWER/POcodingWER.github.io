## Fisher–Yates 셔플?

**Fisher–Yates 셔플**(또는 **Knuth 셔플**)은 유한한 배열이나 리스트의 무작위 순열을 생성하는 알고리즘입니다. 이 알고리즘은 리스트를 역순으로 반복하며 각 요소를 자신 또는 앞에 있는 임의의 요소와 교환하는 방식으로 작동합니다.

이 알고리즘은 편향되지 않은 무작위 셔플을 보장하는데, 이는 배열의 모든 가능한 순열이 동일한 확률로 발생한다는 것을 의미합니다. 시간 복잡도는 $ O(n) $으로 매우 효율적입니다.

### Fisher–Yates 셔플의 단계

1. 배열의 마지막 요소부터 시작합니다.
2. 아직 섞이지 않은 배열의 부분에서 무작위로 요소를 선택합니다.
3. 현재 요소와 선택된 요소를 교환합니다.
4. 배열의 끝에서부터 처음까지 이 과정을 반복합니다.

### Fisher–Yates 셔플의 사용 사례

1. **카드 셔플**: 게임이나 시뮬레이션에서 카드 덱이나 아이템 셋을 섞는 데 널리 사용됩니다.
2. **무작위 샘플링**: 데이터를 샘플링하기 전에 섞어 편향 없이 선택할 수 있도록 하는 데 사용됩니다.
3. **무작위 알고리즘**: Monte Carlo 방식과 같이 무작위 셔플이 필요한 알고리즘에서 활용됩니다.
4. **엔터테인먼트와 게임**: 비디오 게임에서 행동이나 이벤트 목록을 섞는 데 자주 사용됩니다.

### JavaScript로 구현한 Fisher–Yates 셔플 예제

```javascript
function fisherYatesShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // 0에서 i까지 무작위 인덱스 생성
    const j = Math.floor(Math.random() * (i + 1));
    // i와 j의 요소를 교환
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 사용 예시
const array = [1, 2, 3, 4, 5, 6];
console.log(fisherYatesShuffle(array));
```

**설명**:

- 반복문은 마지막 인덱스(arr.length - 1)에서 첫 번째 인덱스(0)까지 순회합니다.
- 각 인덱스에 대해 0에서 $ i $까지 무작위 인덱스 $ j $를 선택하고, $ i $와 $ j $의 요소를 교환합니다.

### Rust로 구현한 Fisher–Yates 셔플 예제

Rust에서는 `rand` 크레이트를 사용하여 무작위 숫자를 생성합니다.

```toml
# Cargo.toml 파일에 추가
[dependencies]
rand = "0.8"
```

```rust
use rand::Rng;

fn fisher_yates_shuffle<T>(arr: &mut [T]) {
    let mut rng = rand::thread_rng();

    for i in (1..arr.len()).rev() {
        // 0에서 i까지 무작위 인덱스 생성
        let j = rng.gen_range(0..=i);
        // i와 j의 요소를 교환
        arr.swap(i, j);
    }
}

fn main() {
    let mut array = vec![1, 2, 3, 4, 5, 6];
    fisher_yates_shuffle(&mut array);
    println!("{:?}", array);
}
```

**설명**:

- `rand::thread_rng()`는 무작위 숫자 생성기를 만듭니다.
- `rng.gen_range(0..=i)`는 0에서 $ i $ 사이의 무작위 인덱스를 생성합니다.
- `arr.swap(i, j)` 함수는 인덱스 $ i $와 $ j $의 요소를 교환합니다.

### 요약:

**Fisher–Yates 셔플**은 무작위 순서를 생성하는 간단하고 효율적인 알고리즘입니다. 주로 카드나 배열을 섞을 때 사용되며, 모든 순열이 동일한 확률로 발생하도록 보장합니다. JavaScript와 Rust에서는 유사한 논리를 사용해 요소를 무작위로 교환함으로써 셔플을 구현할 수 있습니다.
