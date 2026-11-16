/**
 * ===================================================================
 * DSA.JS - Hidden Data Structures Layer
 * ===================================================================
 * Core DSA implementations. Zero DSA terminology in UI.
 * All business logic runs through these structures.
 */

// ============================================================================
// NODE - Base node for linked structures
// ============================================================================
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// ============================================================================
// SINGLY LINKED LIST - Course Catalog & Student Enrollments
// ============================================================================
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  insert(data) {
    const node = new Node(data);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) current = current.next;
      current.next = node;
    }
    this.size++;
    return data;
  }

  findById(id) {
    let current = this.head;
    while (current) {
      if (current.data.id === id) return current.data;
      current = current.next;
    }
    return null;
  }

  findByProperty(prop, value) {
    let current = this.head;
    while (current) {
      if (current.data[prop] === value) return current.data;
      current = current.next;
    }
    return null;
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  deleteById(id) {
    if (!this.head) return false;
    if (this.head.data.id === id) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    let current = this.head;
    while (current.next) {
      if (current.next.data.id === id) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  remove(data) {
    if (!this.head) return false;
    if (this.head.data === data) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    let current = this.head;
    while (current.next) {
      if (current.next.data === data) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  getSize() {
    return this.size;
  }

  clear() {
    this.head = null;
    this.size = 0;
  }
}

// ============================================================================
// QUEUE (FIFO) - Waitlists & Pending Approvals
// ============================================================================
class Queue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  enqueue(data) {
    const node = new Node(data);
    if (!this.rear) {
      this.front = node;
      this.rear = node;
    } else {
      this.rear.next = node;
      this.rear = node;
    }
    this.size++;
  }

  dequeue() {
    if (!this.front) return null;
    const data = this.front.data;
    this.front = this.front.next;
    if (!this.front) this.rear = null;
    this.size--;
    return data;
  }

  peek() {
    return this.front ? this.front.data : null;
  }

  toArray() {
    const arr = [];
    let current = this.front;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  removeById(id) {
    if (!this.front) return null;
    if (this.front.data.id === id) {
      return this.dequeue();
    }
    let current = this.front;
    while (current.next) {
      if (current.next.data.id === id) {
        const data = current.next.data;
        current.next = current.next.next;
        if (!current.next) this.rear = current;
        this.size--;
        return data;
      }
      current = current.next;
    }
    return null;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }

  clear() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }
}

// ============================================================================
// STACK (LIFO) - Undo History
// ============================================================================
class Stack {
  constructor(maxSize = 50) {
    this.top = null;
    this.size = 0;
    this.maxSize = maxSize;
  }

  push(data) {
    const node = new Node(data);
    node.next = this.top;
    this.top = node;
    this.size++;

    if (this.size > this.maxSize) {
      let current = this.top;
      for (let i = 0; i < this.maxSize - 1; i++) {
        current = current.next;
      }
      current.next = null;
      this.size = this.maxSize;
    }
  }

  pop() {
    if (!this.top) return null;
    const data = this.top.data;
    this.top = this.top.next;
    this.size--;
    return data;
  }

  peek() {
    return this.top ? this.top.data : null;
  }

  toArray() {
    const arr = [];
    let current = this.top;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }

  clear() {
    this.top = null;
    this.size = 0;
  }
}

// ============================================================================
// BINARY SEARCH TREE - Course Catalog Indexing
// ============================================================================
class BSTNode {
  constructor(courseCode, data) {
    this.courseCode = courseCode;
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  insert(courseCode, data) {
    if (!this.root) {
      this.root = new BSTNode(courseCode, data);
      this.size++;
      return;
    }
    this._insertNode(this.root, courseCode, data);
  }

  _insertNode(node, courseCode, data) {
    if (courseCode < node.courseCode) {
      if (!node.left) {
        node.left = new BSTNode(courseCode, data);
        this.size++;
      } else {
        this._insertNode(node.left, courseCode, data);
      }
    } else if (courseCode > node.courseCode) {
      if (!node.right) {
        node.right = new BSTNode(courseCode, data);
        this.size++;
      } else {
        this._insertNode(node.right, courseCode, data);
      }
    }
  }

  search(courseCode) {
    return this._searchNode(this.root, courseCode);
  }

  _searchNode(node, courseCode) {
    if (!node) return null;
    if (courseCode === node.courseCode) return node.data;
    if (courseCode < node.courseCode) return this._searchNode(node.left, courseCode);
    return this._searchNode(node.right, courseCode);
  }

  inOrderTraversal() {
    const result = [];
    this._inOrder(this.root, result);
    return result;
  }

  _inOrder(node, result) {
    if (node) {
      this._inOrder(node.left, result);
      result.push(node.data);
      this._inOrder(node.right, result);
    }
  }

  getSize() {
    return this.size;
  }

  delete(courseCode) {
    this.root = this._deleteNode(this.root, courseCode);
  }

  _deleteNode(node, courseCode) {
    if (!node) return null;
    if (courseCode < node.courseCode) {
      node.left = this._deleteNode(node.left, courseCode);
    } else if (courseCode > node.courseCode) {
      node.right = this._deleteNode(node.right, courseCode);
    } else {
      if (!node.left && !node.right) {
        this.size--;
        return null;
      }
      if (!node.left) {
        this.size--;
        return node.right;
      }
      if (!node.right) {
        this.size--;
        return node.left;
      }
      let successor = node.right;
      while (successor.left) successor = successor.left;
      node.courseCode = successor.courseCode;
      node.data = successor.data;
      node.right = this._deleteNode(node.right, successor.courseCode);
    }
    return node;
  }

  clear() {
    this.root = null;
    this.size = 0;
  }
}

// ============================================================================
// HASH TABLE - Fast Student/Course Lookups
// ============================================================================
class HashTable {
  constructor() {
    this.table = {};
    this.size = 0;
  }

  set(key, value) {
    if (!this.table[key]) this.size++;
    this.table[key] = value;
  }

  get(key) {
    return this.table[key] || null;
  }

  has(key) {
    return key in this.table;
  }

  delete(key) {
    if (this.table[key]) {
      delete this.table[key];
      this.size--;
      return true;
    }
    return false;
  }

  values() {
    return Object.values(this.table);
  }

  keys() {
    return Object.keys(this.table);
  }

  getSize() {
    return this.size;
  }

  clear() {
    this.table = {};
    this.size = 0;
  }
}
