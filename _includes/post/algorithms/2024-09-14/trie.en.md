## Trie?

A **Trie** (also known as a **Prefix Tree**) is a specialized data structure used to store a collection of strings. It's particularly efficient for searching strings that share common prefixes.

#### Structure

A Trie is composed of nodes where:

- Each node represents a character.
- Each path down the tree represents a string or a prefix of strings.
- The root node is typically an empty node, and each subsequent node represents the next character of a string.
- A special "end of word" marker may be used to denote that a path forms a valid word.

#### Key Operations

- **Insert**: Add a word to the Trie.
- **Search**: Check if a word exists in the Trie.
- **Prefix Search**: Find all words in the Trie that start with a given prefix.

The **time complexity** of searching and inserting in a Trie is O(m), where `m` is the length of the word being inserted or searched. This makes it efficient for prefix-based queries, especially when dealing with large datasets such as dictionaries, autocomplete systems, or IP routing.

### Use Cases

- **Autocomplete**: A Trie can quickly find all words starting with a prefix, which is useful for implementing autocomplete features.
- **Spell Checking**: Can be used to suggest words based on an input's prefix.
- **IP Routing**: Helps in matching network addresses with prefixes in routing tables.
- **DNA Sequencing**: Used to store and search for sequences of DNA bases.

### JavaScript Example

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

  // Insert a word into the Trie
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

  // Search for a word in the Trie
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

  // Search for words that start with a prefix
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

// Example usage:
const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple")); // true
console.log(trie.search("app")); // false
console.log(trie.startsWith("app")); // true
trie.insert("app");
console.log(trie.search("app")); // true
```

### Rust Example

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

    // Insert a word into the Trie
    fn insert(&mut self, word: &str) {
        let mut node = &mut self.root;
        for c in word.chars() {
            node = node.children.entry(c).or_insert(TrieNode::new());
        }
        node.is_end_of_word = true;
    }

    // Search for a word in the Trie
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

    // Search for words that start with a prefix
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

// Example usage:
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

### Summary

Tries are a powerful data structure for managing strings and performing efficient prefix-based operations. The examples provided in both JavaScript and Rust show basic functionality such as insertion, searching for a word, and prefix matching.
