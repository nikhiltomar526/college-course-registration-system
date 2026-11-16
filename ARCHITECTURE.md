# 🏗️ System Architecture & Design

## 📊 High-Level Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client-Side)                    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    UI Layer (ui.js)                      │   │
│  │  - Renders HTML components                              │   │
│  │  - Listens to user events                               │   │
│  │  - Updates DOM dynamically                              │   │
│  └────────────────────┬────────────────────────────────────┘   │
│                       │ (function calls)                        │
│                       ↓                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Business Logic Layer (app.js)              │   │
│  │  - RegistrationSystem class                             │   │
│  │  - Enrollment validation                                │   │
│  │  - Waitlist management                                  │   │
│  │  - Undo/redo operations                                 │   │
│  └────────────────────┬────────────────────────────────────┘   │
│                       │ (creates/uses)                          │
│                       ↓                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │        DSA Layer (dsa.js) - Core Data Structures        │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   Linked     │  │    Queue     │  │    Stack     │  │   │
│  │  │   Lists      │  │    (FIFO)    │  │    (LIFO)    │  │   │
│  │  │              │  │              │  │              │  │   │
│  │  │ - Course     │  │ - Waitlist   │  │ - Actions    │  │   │
│  │  │ - Students   │  │              │  │   History    │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────────────────────┐    │   │
│  │  │     BST      │  │    Hash Table               │    │   │
│  │  │              │  │                             │    │   │
│  │  │ - Course     │  │ - Fast Student Lookup       │    │   │
│  │  │   Lookup     │  │   (rollNumber → data)       │    │   │
│  │  │   (sorted)   │  │                             │    │   │
│  │  └──────────────┘  └──────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                       │ (persists)                              │
│                       ↓                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Storage Layer (browser localStorage)          │   │
│  │  - Persists all data as JSON                            │   │
│  │  - Survives page refresh                                │   │
│  │  - No server required                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Hierarchy

### 1. **UI Layer (ui.js)**

```
UIController
├── initEventListeners()
│   ├── Role switching (Student ↔ Admin)
│   ├── Navigation handling
│   ├── Theme toggle
│   └── Modal management
│
├── renderCurrentView()
│   ├── renderDashboard()
│   ├── renderCourses()
│   ├── renderRegistrations()
│   ├── renderVisualizer()
│   └── renderAdmin()
│
├── Event Handlers
│   ├── enrollCourse()
│   ├── dropCourse()
│   ├── undoLastAction()
│   ├── addNewCourse()
│   ├── toggleFeeStatus()
│   └── resetAllData()
│
├── Visualizer Methods
│   ├── renderLinkedListVisualization()
│   ├── renderQueueVisualization()
│   ├── renderStackVisualization()
│   ├── renderBSTVisualization()
│   └── renderComplexityChart()
│
└── Utilities
    ├── showToast()
    └── printRegistrationSlip()
```

### 2. **Business Logic Layer (app.js)**

```
RegistrationSystem
│
├── Data Structures (Initialize)
│   ├── courseList (CourseLinkedList)
│   ├── courseBST (CourseBST)
│   ├── studentIndex (StudentHashTable)
│   ├── actionHistory (ActionHistoryStack)
│   ├── courses (Map)
│   ├── students (Map)
│   ├── enrollments (Map<courseId, StudentLinkedList>)
│   ├── waitlists (Map<courseId, WaitlistQueue>)
│   └── activityFeed (Array)
│
├── Course Management
│   ├── addCourse()
│   ├── deleteCourse()
│   ├── updateCourseSeats()
│   └── getAllCourses()
│
├── Enrollment Management
│   ├── enrollStudent()
│   ├── dropCourse()
│   ├── joinWaitlist()
│   └── promoteFromWaitlist()
│
├── Student Management
│   ├── toggleFeeStatus()
│   ├── getStudentRegistrations()
│   └── getAllStudents()
│
├── Undo/Redo
│   └── undoLastAction()
│
├── Query & Analytics
│   ├── getCourseEnrolledStudents()
│   ├── getCourseWaitlistedStudents()
│   ├── getAnalytics()
│   └── getActivityFeed()
│
└── Persistence
    ├── saveToLocalStorage()
    ├── loadFromLocalStorage()
    └── resetAllData()
```

### 3. **DSA Layer (dsa.js)**

```
Node (Base Class)
└── data
└── next

CourseLinkedList
├── head
├── size
├── insert(courseData)              [O(n)]
├── findById(courseId)              [O(n)]
├── toArray()                       [O(n)]
├── deleteById(courseId)            [O(n)]
└── getSize()                       [O(1)]

StudentLinkedList
├── head
├── size
├── enroll(studentData)             [O(1)] ← Insert at head
├── removeStudent(rollNumber)       [O(n)]
├── findStudent(rollNumber)         [O(n)]
├── toArray()                       [O(n)]
└── getSize()                       [O(1)]

WaitlistQueue (FIFO)
├── front
├── rear
├── size
├── enqueue(studentData)            [O(1)]
├── dequeue()                       [O(1)]
├── peek()                          [O(1)]
├── toArray()                       [O(n)]
├── isEmpty()                       [O(1)]
├── getSize()                       [O(1)]
└── clear()                         [O(1)]

ActionHistoryStack (LIFO)
├── top
├── size
├── maxSize = 50
├── push(action)                    [O(1)]
├── pop()                           [O(1)]
├── peek()                          [O(1)]
├── toArray()                       [O(n)]
├── isEmpty()                       [O(1)]
├── getSize()                       [O(1)]
└── clear()                         [O(1)]

BSTNode
├── courseCode
├── courseData
├── left
└── right

CourseBST
├── root
├── size
├── insert(courseCode, courseData)  [O(log n)]*
├── search(courseCode)              [O(log n)]*
├── inOrderTraversal()              [O(n)]
├── getSize()                       [O(1)]
└── delete(courseCode)              [O(log n)]*
    *Average case; O(n) worst case

StudentHashTable
├── table {}
├── size
├── insert(rollNumber, studentData) [O(1)]*
├── find(rollNumber)                [O(1)]*
├── remove(rollNumber)              [O(1)]*
├── toArray()                       [O(n)]
├── getSize()                       [O(1)]
└── clear()                         [O(1)]
    *Average case
```

---

## 🔄 Data Flow Diagram

### Enrollment Process

```
User clicks "Enroll"
    ↓
enrollCourse() [ui.js]
    ↓
registrationSystem.enrollStudent(rollNumber, courseId) [app.js]
    ↓
    ├─ Validate student exists
    ├─ Validate course exists
    ├─ Check feeCleared ─────→ ❌ Reject if false
    ├─ Check creditLimit ────→ ❌ Reject if exceeded
    ├─ Check duplicate ──────→ ❌ Reject if already enrolled
    │
    └─ Check seat availability
        ├─ IF seats available
        │   ├─ enrolledList.enroll() [StudentLinkedList - O(1)]
        │   ├─ course.enrolled++
        │   ├─ student.creditsEnrolled += credits
        │   ├─ actionHistory.push() [Stack - O(1)]
        │   ├─ addActivity()
        │   └─ Return { success: true }
        │
        └─ IF seats FULL
            ├─ waitlist.enqueue() [Queue - O(1)]
            ├─ actionHistory.push() [Stack - O(1)]
            ├─ addActivity()
            └─ Return { success: true }
                ↓
        saveToLocalStorage()
                ↓
        renderCourses() [UI updated]
                ↓
        showToast() [User notified]
```

### Drop & Auto-Promotion Process

```
User clicks "Drop"
    ↓
dropCourse() [ui.js]
    ↓
registrationSystem.dropCourse(rollNumber, courseId) [app.js]
    ├─ enrolledList.removeStudent() [O(n)]
    ├─ course.enrolled--
    ├─ student.creditsEnrolled -= credits
    ├─ course.status = "OPEN"
    │
    └─ IF waitlist has students
        └─ promoteFromWaitlist(courseId)
            ├─ promoted = waitlist.dequeue() [Queue FIFO - O(1)]
            ├─ enrolledList.enroll(promoted) [O(1)]
            ├─ course.enrolled++
            ├─ IF course now FULL
            │   └─ course.status = "FULL"
            └─ addActivity()
                ↓
        actionHistory.push()
                ↓
        saveToLocalStorage()
                ↓
        renderRegistrations()
                ↓
        showToast()
```

### Undo Last Action Process

```
User clicks "Undo Last Action"
    ↓
undoLastAction() [ui.js]
    ↓
action = actionHistory.pop() [Stack LIFO - O(1)]
    ↓
Switch on action.type:
    ├─ ENROLL  → dropCourse(action.rollNumber, action.courseId)
    ├─ DROP    → enrollStudent(action.rollNumber, action.courseId)
    └─ WAITLIST → remove from waitlist
            ↓
    saveToLocalStorage()
            ↓
    renderCurrentView()
            ↓
    showToast()
```

---

## 💾 Data Structures & Relationships

```
┌────────────────────────────────────┐
│         REGISTRATION SYSTEM         │
└────────────────────────────────────┘
               │
       ┌───────┼────────────────┬──────────┐
       ↓       ↓                ↓          ↓
   ┌───────────────────┐  ┌──────────────────────┐
   │ COURSES           │  │ STUDENTS             │
   ├───────────────────┤  ├──────────────────────┤
   │ Map<id → Course>  │  │ Map<rollNumber→Stud> │
   │                   │  │                      │
   │ Also in:          │  │ Also in:             │
   │ - CourseLinkedList│  │ - StudentHashTable   │
   │ - CourseBST       │  │                      │
   └─────────┬─────────┘  └──────────────────────┘
             │
       ┌─────┴────────────────────────┐
       ↓                              ↓
   ┌─────────────────────┐    ┌──────────────────┐
   │ ENROLLMENTS         │    │ WAITLISTS        │
   ├─────────────────────┤    ├──────────────────┤
   │ Map<courseId →      │    │ Map<courseId →   │
   │ StudentLinkedList>  │    │ WaitlistQueue>   │
   │                     │    │                  │
   │ Each LinkedList:    │    │ Each Queue:      │
   │ - head: first node  │    │ - front: first   │
   │ - next: chain       │    │ - rear: last     │
   │ - O(1) insert       │    │ - O(1) enqueue   │
   │ - O(n) search       │    │ - O(1) dequeue   │
   └─────────────────────┘    └──────────────────┘
             │
             │ (When dropping)
             └─→ UNDO STACK
                ├─────────────────────┐
                │ ActionHistoryStack  │
                ├─────────────────────┤
                │ - top: most recent  │
                │ - chain downward    │
                │ - O(1) push/pop     │
                │ - Max 50 actions    │
                └─────────────────────┘
```

---

## 🎯 Key Design Decisions

### 1. Why Linked Lists for Enrollments?

**Pros:**
- O(1) insertion at head (new students)
- Sequential access for iteration
- Easy removal if we track node

**Cons:**
- O(n) search requires traversal

**Trade-off:** We rarely need to search; we mostly insert at head and iterate. Perfect fit.

---

### 2. Why Queue for Waitlist?

**Pros:**
- FIFO fairness (first come, first served)
- O(1) enqueue/dequeue
- Natural fit for waiting problem

**Cons:**
- Can't access middle easily

**Trade-off:** We only care about front and rear. Queue is ideal.

---

### 3. Why Stack for Undo?

**Pros:**
- LIFO naturally reverses operations
- O(1) push/pop
- Simple to implement

**Cons:**
- Can't redo (only undo)

**Trade-off:** For this application, redo isn't needed. Stack is elegant.

---

### 4. Why BST for Courses?

**Pros:**
- O(log n) search by course code
- In-order traversal gives sorted list
- Scalable for many courses

**Cons:**
- Can become unbalanced (O(n) search)
- Need to maintain balance (AVL/RB-Tree)

**Trade-off:** Acceptable for educational demo. In production would use AVL Tree.

---

### 5. Why Hash Table for Students?

**Pros:**
- O(1) lookup by roll number
- Direct access (no traversal)
- Industry standard

**Cons:**
- Hash collisions possible
- Can't traverse in order

**Trade-off:** We need fast lookup; ordering not important. Hash Table wins.

---

## 🔐 Business Logic Rules

```
┌─ Student Enrollment Flow ─────────────────────┐
│                                               │
│  1. AUTHENTICATION                           │
│     └─ Student valid? → YES/NO               │
│                                               │
│  2. COURSE VALIDATION                         │
│     └─ Course valid? → YES/NO                │
│                                               │
│  3. FEE CLEARANCE CHECK ⭐                   │
│     └─ student.feeCleared? → YES/NO          │
│         (Admin can toggle)                    │
│                                               │
│  4. CREDIT LIMIT CHECK ⭐                    │
│     └─ (creditsEnrolled + courseCredits)    │
│         ≤ 20? → YES/NO                       │
│                                               │
│  5. DUPLICATE CHECK                          │
│     └─ Already enrolled? → YES/NO            │
│         (Search LinkedList O(n))             │
│                                               │
│  6. SEAT AVAILABILITY CHECK                  │
│     ├─ IF seats > enrolled:                  │
│     │   └─ ENROLL                            │
│     │       └─ Add to LinkedList (O(1))     │
│     │       └─ Increment enrolled            │
│     │       └─ Increment creditsEnrolled     │
│     │       └─ Update course status          │
│     │                                         │
│     └─ ELSE (seats == enrolled):             │
│         └─ WAITLIST                          │
│             └─ Enqueue to Queue (O(1))      │
│             └─ Position = current size + 1   │
│                                               │
│  7. RECORD ACTION                            │
│     └─ actionHistory.push(action)            │
│        (Stack O(1))                          │
│                                               │
│  8. LOG ACTIVITY                             │
│     └─ addActivity(type, message, actor)    │
│                                               │
│  9. PERSIST DATA                             │
│     └─ saveToLocalStorage()                  │
│                                               │
│  10. NOTIFY USER                             │
│      └─ showToast(message)                   │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 📈 Complexity Analysis Summary

### Time Complexities

| Operation | Data Structure | Time | Notes |
|-----------|-----------------|------|-------|
| **Enroll** | LinkedList | O(1)* | Insert at head |
| **Enroll** | BST (find) | O(log n) | Find course code |
| **Search Student** | Hash Table | O(1) | Direct access |
| **Drop** | LinkedList | O(n) | Must traverse to find |
| **Waitlist** | Queue | O(1) | FIFO operations |
| **Undo** | Stack | O(1)* | Pop from top |
| **Get Courses** | LinkedList | O(n) | Traverse all |
| **Sort Courses** | BST (in-order) | O(n) | In-order traversal |

*\* Not counting inner operations like removing from waitlist*

### Space Complexities

| Structure | Space | Notes |
|-----------|-------|-------|
| CourseLinkedList | O(n) | n = # courses |
| StudentLinkedList | O(e) | e = # enrolled per course |
| WaitlistQueue | O(w) | w = # waitlisted |
| ActionHistoryStack | O(min(a, 50)) | a = # actions, max 50 |
| CourseBST | O(n) | n = # courses |
| StudentHashTable | O(s) | s = # students |
| **Total** | **O(n+e+w+s)** | Linear in data size |

---

## 🧪 Testing Strategy

### Unit Tests (Conceptual)

```javascript
// DSA Tests
test("LinkedList insert at head O(1)", () => {
  const list = new StudentLinkedList();
  list.enroll({rollNumber: "240101", name: "Test"});
  assert.equal(list.head.data.rollNumber, "240101");
  assert.equal(list.getSize(), 1);
});

test("Queue FIFO order", () => {
  const q = new WaitlistQueue();
  q.enqueue({rollNumber: "S1"});
  q.enqueue({rollNumber: "S2"});
  assert.equal(q.dequeue().rollNumber, "S1");
  assert.equal(q.dequeue().rollNumber, "S2");
});

test("Stack LIFO order", () => {
  const stack = new ActionHistoryStack();
  stack.push({type: "ENROLL"});
  stack.push({type: "DROP"});
  assert.equal(stack.pop().type, "DROP");
  assert.equal(stack.pop().type, "ENROLL");
});

// Business Logic Tests
test("Enrollment with fee not cleared fails", () => {
  const result = system.enrollStudent("240103", "DSA101");
  assert.equal(result.success, false);
  assert.includes(result.message, "Fee");
});

test("Enrollment exceeding 20 credits fails", () => {
  // Setup: enroll in 20-credit courses
  const result = system.enrollStudent("240101", "AI105");
  assert.equal(result.success, false);
  assert.includes(result.message, "credit");
});

test("Auto-promotion on drop", () => {
  system.enrollStudent("240101", "DSA101"); // enroll in full course
  system.enrollStudent("240102", "DSA101"); // joins waitlist
  system.dropCourse("240101", "DSA101");     // drop
  // Verify 240102 now enrolled
  assert.equal(enrolledList.findStudent("240102") !== null, true);
});
```

### Integration Tests (Manual)

```
1. Full workflow: Enroll → Waitlist → Drop → Promote
2. Multiple students: Different credit limits
3. Fee status: Toggle and re-enroll
4. Undo chain: Multiple actions undone
5. Data persistence: Refresh page, verify data
```

---

## 🚀 Performance Considerations

### Current Bottlenecks

1. **Drop Operation** - O(n) to find student in LinkedList
   - Solution: Use doubly-linked list with node reference

2. **Unbalanced BST** - Can degrade to O(n)
   - Solution: Use AVL Tree for guaranteed O(log n)

3. **Duplicate Check** - O(n) search in LinkedList
   - Solution: Use Set<rollNumber> for O(1) lookup

### Optimization Opportunities

```javascript
// Current: O(n) search in LinkedList
enrolledList.findStudent(rollNumber);  // O(n)

// Optimized: O(1) Set lookup
const enrolled = new Set<rollNumber>();
enrolled.has(rollNumber);  // O(1)

// Trade-off: Extra memory for Set, but faster lookups
```

---

## 📚 Learning Outcomes

After explaining this system, you'll have demonstrated:

1. ✅ Practical LinkedList implementation (not just theory)
2. ✅ Queue application (waitlist fairness)
3. ✅ Stack application (undo functionality)
4. ✅ BST for efficient searching
5. ✅ Hash Table for O(1) access
6. ✅ Integration of multiple DSA structures
7. ✅ Business logic enforcement
8. ✅ UI/UX design with modern frameworks
9. ✅ Persistence & state management
10. ✅ Scalability considerations

Perfect for demonstrating DSA mastery in interviews or vivas! 🎓

---

*For detailed code explanations, see dsa.js, app.js, and ui.js comments*
