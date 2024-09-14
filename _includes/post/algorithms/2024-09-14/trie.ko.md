## Trie?

**트라이**는 문자열의 집합을 저장하는 데 사용되는 특수한 자료구조입니다. 특히 공통된 접두사를 공유하는 문자열을 검색하는 데 매우 효율적입니다.

#### 구조

트라이는 노드로 구성되며, 각 노드는 문자를 나타냅니다.

- 각 노드는 하나의 문자를 나타내며, 트리의 경로는 문자열 또는 문자열의 접두사를 나타냅니다.
- 루트 노드는 일반적으로 빈 노드이고, 그 다음 각 노드는 문자열의 다음 문자를 나타냅니다.
- 경로가 유효한 단어를 형성하는지를 나타내기 위해 특별한 "단어의 끝" 표시를 사용할 수 있습니다.

#### 주요 연산

- **삽입**: 트라이에 단어를 추가합니다.
- **검색**: 트라이에 단어가 존재하는지 확인합니다.
- **접두사 검색**: 주어진 접두사로 시작하는 모든 단어를 찾습니다.

검색과 삽입의 **시간 복잡도**는 O(m)이며, 여기서 `m`은 삽입하거나 검색하려는 단어의 길이입니다. 이는 접두사 기반 쿼리를 처리할 때 매우 효율적이며, 특히 사전, 자동완성 시스템 또는 IP 라우팅과 같은 대규모 데이터 세트에서 유용합니다.

### 사용 사례

- **자동완성**: 트라이는 접두사로 시작하는 모든 단어를 빠르게 찾을 수 있어 자동완성 기능을 구현하는 데 유용합니다.
- **맞춤법 검사**: 입력된 접두사를 기준으로 단어를 제안하는 데 사용할 수 있습니다.
- **IP 라우팅**: 라우팅 테이블에서 접두사와 네트워크 주소를 일치시키는 데 도움이 됩니다.
- **DNA 서열 분석**: DNA 염기 서열을 저장하고 검색하는 데 사용할 수 있습니다.

### JavaScript 예제

```js
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // 단어를 트라이에 삽입
  insert(word) {
    let currentNode = this.root;
    for (let char of word) {
      if (!currentNode.children[char]) {
        currentNode.children[char] = new TrieNode();
      }
      currentNode = currentNode.children[char];
    }
    currentNode.isEndOfWord = true;
  }

  // 트라이에서 단어 검색
  search(word) {
    let currentNode = this.root;
    for (let char of word) {
      if (!currentNode.children[char]) {
        return false;
      }
      currentNode = currentNode.children[char];
    }
    return currentNode.isEndOfWord;
  }

  // 주어진 접두사로 시작하는 단어가 있는지 확인
  startsWith(prefix) {
    let currentNode = this.root;
    for (let char of prefix) {
      if (!currentNode.children[char]) {
        return false;
      }
      currentNode = currentNode.children[char];
    }
    return true;
  }
}

// 사용 예시:
const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple")); // true
console.log(trie.search("app")); // false
console.log(trie.startsWith("app")); // true
trie.insert("app");
console.log(trie.search("app")); // true
```

### Rust 예제

```rust
use std::collections::HashMap;

#[derive(Default)]
struct TrieNode {
    children: HashMap<char, TrieNode>,
    is_end_of_word: bool,
}

impl TrieNode {
    fn new() -> Self {
        TrieNode {
            children: HashMap::new(),
            is_end_of_word: false,
        }
    }
}

struct Trie {
    root: TrieNode,
}

impl Trie {
    fn new() -> Self {
        Trie {
            root: TrieNode::new(),
        }
    }

    // 단어를 트라이에 삽입
    fn insert(&mut self, word: &str) {
        let mut node = &mut self.root;
        for c in word.chars() {
            node = node.children.entry(c).or_insert(TrieNode::new());
        }
        node.is_end_of_word = true;
    }

    // 트라이에서 단어 검색
    fn search(&self, word: &str) -> bool {
        let mut node = &self.root;
        for c in word.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return false,
            }
        }
        node.is_end_of_word
    }

    // 주어진 접두사로 시작하는 단어가 있는지 확인
    fn starts_with(&self, prefix: &str) -> bool {
        let mut node = &self.root;
        for c in prefix.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return false,
            }
        }
        true
    }
}

// 사용 예시:
fn main() {
    let mut trie = Trie::new();
    trie.insert("apple");
    println!("{}", trie.search("apple")); // true
    println!("{}", trie.search("app"));   // false
    println!("{}", trie.starts_with("app")); // true
    trie.insert("app");
    println!("{}", trie.search("app"));   // true
}
```

### 요약

트라이는 문자열을 관리하고 접두사 기반 연산을 효율적으로 수행하는 강력한 자료구조입니다. JavaScript와 Rust 예제에서 삽입, 단어 검색, 접두사 매칭과 같은 기본 기능을 구현하는 방법을 보여줍니다.
