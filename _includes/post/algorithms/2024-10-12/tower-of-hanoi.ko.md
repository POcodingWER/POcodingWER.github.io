## 하노이의 탑

**하노이의 탑 (Tower of Hanoi)**는 고전적인 재귀적 문제로, 세 개의 기둥과 여러 개의 원반으로 이루어져 있습니다. 이 문제의 목표는 한 기둥에 쌓인 원반을 규칙을 지켜가며 다른 기둥으로 모두 옮기는 것입니다.

#### 규칙:

1. 한 번에 하나의 원반만 이동할 수 있다.
2. 더 큰 원반은 더 작은 원반 위에 놓을 수 없다.
3. 세 개의 기둥 중 하나를 사용하여 원반을 옮겨야 한다.

이 문제는 재귀 알고리즘의 대표적인 예이며, 재귀적 사고방식과 알고리즘의 효율성을 배우기 위한 문제로 많이 사용됩니다.

### 하노이의 탑 활용:

- **재귀 알고리즘 연습**: 재귀 호출의 개념과 이를 사용하는 문제 해결 방식을 이해하는 데 도움이 됩니다.
- **컴퓨터 과학 교육**: 알고리즘의 시간 복잡도 및 효율성을 설명하는 데 자주 사용됩니다.
- **퍼즐**: 논리 퍼즐로도 많이 알려져 있습니다.

---

### JavaScript 코드 예제

```javascript
function hanoi(n, from, to, aux) {
  if (n === 1) {
    console.log(`Move disk 1 from ${from} to ${to}`);
    return;
  }
  hanoi(n - 1, from, aux, to);
  console.log(`Move disk ${n} from ${from} to ${to}`);
  hanoi(n - 1, aux, to, from);
}

// 예제 실행: 3개의 원반을 A에서 C로 옮기기
hanoi(3, "A", "C", "B");
```

#### 출력 결과:

```
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C
```

---

### Rust 코드 예제

```rust
fn hanoi(n: i32, from: char, to: char, aux: char) {
    if n == 1 {
        println!("Move disk 1 from {} to {}", from, to);
        return;
    }
    hanoi(n - 1, from, aux, to);
    println!("Move disk {} from {} to {}", n, from, to);
    hanoi(n - 1, aux, to, from);
}

fn main() {
    // 예제 실행: 3개의 원반을 A에서 C로 옮기기
    hanoi(3, 'A', 'C', 'B');
}
```

#### Rust 출력 결과:

```
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C
```

### 하노이의 탑 활용 사례

- **재귀적 문제 해결 능력 향상**: 프로그래밍에서 재귀 함수의 이해와 응용을 높이는 데 유용합니다.
- **알고리즘 학습**: 시간 복잡도 분석 및 재귀 호출의 이해에 사용됩니다.

이 코드는 하노이의 탑 문제를 재귀적으로 해결하며, 각각의 원반 이동을 콘솔에 출력합니다.
