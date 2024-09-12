> A **hash table** is a data structure used to store key-value pairs. It uses a **hash function** to compute an index (called a hash) into an array of buckets or slots, from which the desired value can be found. The key aspect of a hash table is the hash function, which converts the key into an index in the array, allowing for near-constant time complexity (O(1)) for search, insert, and delete operations in the average case.

### Key Concepts of Hash Tables:

1. **Hash Function**: Converts a key into a hash, which is used as the index.
2. **Collisions**: Occur when two keys hash to the same index. Common strategies to handle this include:
   - **Chaining**: Each array index points to a list of key-value pairs.
   - **Open Addressing**: Searches for another index using a probing technique.
3. **Load Factor**: A measure of how full the hash table is, which helps decide when to resize the table.

### Use Cases:

- **Databases**: Used in indexing to allow quick lookups.
- **Caching**: Often used for fast access to previously computed or fetched data.
- **Symbol Tables**: Used by compilers and interpreters for storing variable names and function names.
- **Sets and Maps**: In programming languages like Python, JavaScript, Rust, etc., hash tables are the underlying data structure for sets and maps.

---

### Example: Hash Table in JavaScript

In JavaScript, you can implement a simple hash table class:

```javascript
class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }

  _hash(key) {
    let total = 0;
    let PRIME_NUMBER = 31; // Use a prime number for better distribution
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      let char = key[i];
      let value = char.charCodeAt(0) - 96;
      total = (total * PRIME_NUMBER + value) % this.keyMap.length;
    }
    return total;
  }

  set(key, value) {
    const index = this._hash(key);
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    this.keyMap[index].push([key, value]);
  }

  get(key) {
    const index = this._hash(key);
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          return this.keyMap[index][i][1];
        }
      }
    }
    return undefined;
  }
}

// Example usage:
const ht = new HashTable();
ht.set("hello", "world");
console.log(ht.get("hello")); // Output: world
```

---

### Example: Hash Table in Rust

Rust doesn't have a built-in hash table per se, but you can use the `HashMap` collection from the `std::collections` module. Here’s a simple example:

```rust
use std::collections::HashMap;

fn main() {
    let mut hash_table = HashMap::new();

    // Insert key-value pairs
    hash_table.insert("name", "Alice");
    hash_table.insert("age", "30");

    // Access values
    if let Some(name) = hash_table.get("name") {
        println!("Name: {}", name);
    }

    if let Some(age) = hash_table.get("age") {
        println!("Age: {}", age);
    }

    // Check if a key exists
    if !hash_table.contains_key("address") {
        println!("Address not found");
    }
}
```

In this Rust example, the `HashMap` is used to store key-value pairs and provides constant time average case access.
