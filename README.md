# 🎓 College Course Registration Portal - DSA Practical

A **full-featured, modern university course registration portal** built with **pure HTML, CSS, and JavaScript** featuring **real Data Structures & Algorithms implementations** for educational purposes. No backend required—all data persists via `localStorage`.

## 📋 Project Overview

This portal demonstrates practical implementation of core DSA concepts while delivering a complete, production-like web application for college course registration. Perfect for explaining DSA logic during viva sessions with interactive visualizations.

### Key Features

✅ **Real DSA Implementation** - Singly Linked Lists, FIFO Queue, LIFO Stack, Binary Search Tree, Hash Table  
✅ **Zero Backend** - Pure client-side, runs directly via `index.html`  
✅ **Modern UI/UX** - Professional university portal design with dark/light theme  
✅ **Live DSA Visualizer** - Interactive diagrams showing data structure operations  
✅ **Full Business Logic** - Fee clearance, credit limits, waitlist management, auto-promotion  
✅ **Persistent Storage** - All data saved to localStorage  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

---

## 🗂️ Project Structure

```
college_registration_system/
│
├── index.html          # Main HTML structure
├── styles.css          # Modern responsive styling
├── dsa.js              # Core DSA implementations (LinkedList, Queue, Stack, BST, HashTable)
├── app.js              # Application logic & state management
├── ui.js               # UI controller & interaction logic
├── college_data.json   # (Optional) Pre-loaded data
└── README.md           # This file
```

### File Responsibilities

| File | Purpose | Key Classes |
|------|---------|-------------|
| **dsa.js** | Core Data Structures | `Node`, `CourseLinkedList`, `StudentLinkedList`, `WaitlistQueue`, `ActionHistoryStack`, `CourseBST`, `StudentHashTable` |
| **app.js** | Business Logic & State | `RegistrationSystem` (manages courses, students, enrollments, waitlists) |
| **ui.js** | UI & Interactions | `UIController` (handles views, rendering, event listeners) |
| **index.html** | Page Structure | Sidebar, header, content area, nav menu |
| **styles.css** | Visual Design | Responsive grid, dark/light themes, components |

---

## 🚀 Getting Started

### How to Run

1. **Open `index.html` directly** in any modern web browser
   - Chrome, Firefox, Safari, Edge (all modern versions)
   - No server required

2. **First Load** - Demo data automatically initializes:
   - 6 sample courses (DSA101, DBMS102, OS103, WEB104, AI105, MIS106)
   - 6 sample students (Arjun Kumar, Priya Sharma, etc.)
   - Pre-enrolled in some courses to show varied states

3. **Switch Roles** - Use the role buttons to toggle:
   - **Student View**: Browse courses, enroll, manage registrations
   - **Admin View**: Manage courses/students, edit capacities, reset data

4. **Explore Views** - Navigate using sidebar menu:
   - Dashboard → KPI cards + activity feed
   - Browse Courses → Search, filter, enroll/waitlist
   - My Registrations → View enrolled & waitlisted courses
   - DSA Visualizer → Interactive visualization of data structures
   - Admin Panel → Course & student management

---

## 🧠 DSA Implementations

### 1. **Singly Linked List** (`CourseLinkedList`, `StudentLinkedList`)

```
┌─────┐    ┌─────┐    ┌─────┐
│Node1│──→ │Node2│──→ │Node3│──→ NULL
└─────┘    └─────┘    └─────┘

Time Complexity:
- Insert at head: O(1) ✓
- Insert at end: O(n)
- Search: O(n)
- Delete: O(n)
```

**Use Case**: Store all courses and enrolled students per course
- Easy insertion of new students (insert at head for O(1))
- Sequential traversal for listing enrolled students

### 2. **FIFO Queue** (`WaitlistQueue`)

```
        FRONT                    REAR
         ↓                        ↓
    ┌─────────────────────────┐
    │ S1 │ S2 │ S3 │ ... │ Sn │
    └─────────────────────────┘
     ↑
   dequeue()                  enqueue()
```

**Time Complexity**:
- `enqueue()`: O(1) - Add to rear
- `dequeue()`: O(1) - Remove from front
- `peek()`: O(1) - View front student

**Use Case**: Manage student waitlist with FIFO ordering
- When a student drops, front of queue automatically promoted
- Fair FIFO order ensures earliest-joined students get seats first

### 3. **LIFO Stack** (`ActionHistoryStack`)

```
        TOP
         ↓
    ┌──────────┐
    │ Action5  │  ← pop() returns this
    ├──────────┤
    │ Action4  │
    ├──────────┤
    │ Action3  │
    ├──────────┤
    │ Action2  │
    ├──────────┤
    │ Action1  │ (BOTTOM - oldest)
    └──────────┘
```

**Time Complexity**:
- `push()`: O(1) - Add to top
- `pop()`: O(1) - Remove from top
- `peek()`: O(1) - View top

**Use Case**: Undo/redo functionality
- Push every registration/drop action
- Pop to undo (reverse the operation)
- Max 50 actions stored to prevent memory bloat

### 4. **Binary Search Tree** (`CourseBST`)

```
                  DSA101
                  /     \
             DBMS102   WEB104
             /    \      /    \
          AI105  OS103 MIS106
```

**Time Complexity**:
- Insert: O(log n) average, O(n) worst
- Search: O(log n) average, O(n) worst
- In-order Traversal: O(n) → sorted by course code

**Use Case**: Fast course lookup by code, sorted course listings
- Binary search through course tree
- In-order traversal gives alphabetical course list

### 5. **Hash Table** (`StudentHashTable`)

```
Hash Table (rollNumber → StudentData)
┌─────────────────────────────────┐
│ 240101 → {name: Arjun, ...}     │  O(1) lookup
│ 240102 → {name: Priya, ...}     │
│ 240103 → {name: Raj, ...}       │
│ 240104 → {name: Neha, ...}      │
│ ...                             │
└─────────────────────────────────┘
```

**Time Complexity**:
- Insert: O(1) average
- Search: O(1) average
- Delete: O(1) average

**Use Case**: Fast student lookup by roll number
- Direct O(1) access instead of O(n) linked list search

---

## 💼 Business Logic

### Business Rules Enforced

1. **Duplicate Prevention** ❌
   - Student cannot register twice in same course
   - Checked before enrollment

2. **Credit Limit** 📚
   ```
   Max Credits per Semester = 20
   If (Student Credits + Course Credits) > 20 → Reject enrollment
   ```

3. **Fee Clearance** 💳
   ```
   If Fee Status = "Pending" → Cannot enroll
   Admin can toggle fee status
   ```

4. **Seat Availability** 🪑
   ```
   If Seats Available → Enroll to course
   Else → Add to waitlist
   ```

5. **Waitlist Auto-Promotion** ⬆️
   ```
   When student drops:
     1. Remove from enrolled list
     2. Course becomes OPEN
     3. Front of waitlist promoted
     4. Move to enrolled list
   ```

### Data Flow

```
┌─────────────────────────────────────────────┐
│          Student Enrollment Flow             │
└─────────────────────────────────────────────┘
                    ↓
        ┌─────────────────────────┐
        │ Validate Student & Course │
        └─────────────────────────┘
                    ↓
        ┌─────────────────────────┐
        │ Check Fee Clearance      │
        └─────────────────────────┘
                    ↓
        ┌─────────────────────────┐
        │ Check Credit Limit       │
        └─────────────────────────┘
                    ↓
        ┌─────────────────────────┐
        │ Check Duplicate          │
        └─────────────────────────┘
                    ↓
            ┌───────┴───────┐
            ↓               ↓
     ┌────────────┐  ┌────────────┐
     │ Seats FREE │  │ Seats FULL │
     └────────────┘  └────────────┘
            ↓               ↓
     ┌────────────┐  ┌────────────┐
     │ ENROLL     │  │ WAITLIST   │
     └────────────┘  └────────────┘
```

---

## 🎨 UI Components

### Responsive Sidebar Navigation

- **Role Switcher** - Toggle between Student & Admin
- **Student Selector** - Pick which student to view as
- **Navigation Menu** - Dashboard, Courses, Registrations, Visualizer, Admin
- **Theme Toggle** - Dark/Light mode

### Main Sections

#### 1. **Dashboard**
- KPI Cards (Total Courses, Enrolled, Waitlisted, Occupancy %)
- Quick Action Buttons
- Live Activity Feed

#### 2. **Course Catalog**
- Search & Filter (by Department, Status)
- Course Cards with:
  - Course info & description
  - Seat progress bar
  - Waitlist count
  - Enroll/Waitlist button

#### 3. **My Registrations**
- Student Info Card (Name, Credits used, Fee Status)
- Enrolled Courses List with Drop button
- Waitlisted Courses List
- Print Registration Slip button

#### 4. **DSA Visualizer** ⭐ (Viva-Ready)
- **Tab 1: Linked Lists** - Visual diagram of enrolled students
- **Tab 2: Waitlist Queue** - FRONT→REAR visualization with code
- **Tab 3: Undo Stack** - TOP↓BOTTOM action history
- **Tab 4: Course BST** - Tree structure showing sorted courses
- **Tab 5: Complexity Analysis** - Time complexity table & growth chart

#### 5. **Admin Panel**
- Add New Course form
- Manage Courses table (edit seats, delete)
- Manage Students table (toggle fee status)
- System Actions (reset data)

---

## 🔍 DSA Visualizer (For Viva Presentation)

The **DSA Visualizer** tab is specifically designed to explain your implementation during viva:

### Visual Representations

1. **Linked List Node Flow**
   ```
   [240101: Arjun] → [240102: Priya] → [240104: Neha] → NULL
   
   Operation Code shown:
   - enrolledList.enroll(studentData)
   - Creates Node, sets next pointer, updates head
   - Time: O(1)
   ```

2. **Queue FIFO Order**
   ```
   FRONT [240105] [240106] [240107] REAR
   
   enqueue(): Add to REAR - O(1)
   dequeue(): Remove from FRONT - O(1)
   ```

3. **Stack LIFO History**
   ```
   TOP
   ├─ ENROLL (latest)
   ├─ DROP
   ├─ WAITLIST
   └─ ENROLL
   
   Undo reverses the operation
   ```

4. **BST Tree Diagram**
   - Shows parent-child relationships
   - Demonstrates in-order traversal (sorted)
   - Color-coded nodes for clarity

5. **Complexity Chart**
   - Table comparing all 5 DSA structures
   - Growth rate graph (O(1), O(log n), O(n), O(n²))
   - Use case explanations

---

## 💾 Local Storage Management

All data persists in browser localStorage under key `registrationSystem`:

```javascript
{
  courses: [{id, code, name, department, credits, totalSeats, enrolled, status, ...}],
  students: [{rollNumber, name, email, department, feeCleared, creditsEnrolled}],
  enrollments: [[courseId, [studentData1, studentData2, ...]], ...],
  waitlists: [[courseId, [waitlistedStudent1, ...]], ...],
  activityFeed: [{type, message, actor, timestamp}, ...]
}
```

**Auto-saved after every action** → No data loss on page refresh

---

## 🎯 How to Explain in Viva

### Suggested Viva Flow

1. **Start Dashboard**
   - Show KPI cards and activity feed
   - "This portal tracks all enrollments and waitlists in real-time"

2. **Show Course Enrollment**
   - Enroll a student in a full course
   - "Notice the student joins waitlist (FIFO queue) automatically"

3. **Drop & Auto-Promote**
   - Drop a student from enrolled list
   - "The first waitlisted student is immediately promoted (Queue FIFO)"

4. **Undo Action**
   - Click "Undo Last Action"
   - "The action is reversed using a Stack (LIFO) of history"

5. **Open DSA Visualizer**
   - Show each tab to explain structure
   - "Enrolled students stored in Linked List (O(1) insert at head)"
   - "Waitlist is a Queue (O(1) enqueue/dequeue)"
   - "Undo history is a Stack (O(1) push/pop)"
   - "Courses indexed by BST for O(log n) search"

6. **Admin Panel**
   - Edit seat capacity → triggers waitlist promotion
   - "Demonstrates business logic coordination"

7. **Complexity Analysis**
   - Point to the Complexity tab
   - Explain why each structure was chosen
   - Compare with alternatives (why not LinkedList for everything?)

---

## 🧪 Testing Scenarios

### Test Case 1: Waitlist to Enrollment
```
1. Full course (2/2 seats)
2. Student A joins waitlist → Position 1
3. Drop enrolled student → Seat opens
4. Student A auto-promoted to enrolled
Verify: No manual refresh needed
```

### Test Case 2: Credit Limit
```
1. Enrolled in 18 credit courses
2. Try to enroll 4-credit course
3. Should fail with "Exceeds 20 credit limit"
4. Enroll 2-credit course → Success
Verify: Business logic enforced
```

### Test Case 3: Fee Clearance
```
1. Select student with pending fee
2. Try to enroll → Fails with "Fee not cleared"
3. Admin toggles fee cleared
4. Try again → Success
Verify: Fee validation works
```

### Test Case 4: Duplicate Prevention
```
1. Enroll in DSA101
2. Try to enroll again in DSA101
3. Should fail with "Already enrolled"
Verify: Duplicate check works
```

### Test Case 5: Undo Functionality
```
1. Enroll in course
2. Click "Undo Last Action"
3. Should be removed from enrollment
4. Credits recalculated
Verify: Stack-based undo works
```

### Test Case 6: Data Persistence
```
1. Enroll in courses
2. Refresh page (F5)
3. Check My Registrations
4. Should show same enrollments
Verify: localStorage working
```

---

## 🎓 Educational Highlights for Viva

### Why This Architecture?

1. **Singly Linked List for Enrollments** ✓
   - O(1) insertion (insert at head)
   - Sequential iteration for listing
   - Low memory overhead

2. **Queue for Waitlist** ✓
   - FIFO ensures fairness
   - O(1) all operations
   - Natural fit for queueing problem

3. **Stack for Undo** ✓
   - LIFO reverses operations naturally
   - O(1) push/pop
   - Simple undo logic

4. **BST for Courses** ✓
   - Fast O(log n) lookup by code
   - In-order traversal gives sorted list
   - Scalable (better than linear list search)

5. **Hash Table for Students** ✓
   - O(1) lookup by roll number
   - Avoids O(n) linked list search
   - Industry standard for fast access

### Potential Interview Questions

**Q: Why not just use Arrays?**  
A: This demonstrates core DSA concepts. Arrays would be O(n) for insertion and deletion; our linked lists are O(1) at head.

**Q: What if the BST becomes unbalanced?**  
A: In production, we'd use AVL Tree or Red-Black Tree for guaranteed O(log n). This is simplified for clarity.

**Q: How does waitlist promotion work?**  
A: Queue FIFO - when a seat opens, dequeue() front student and move to enrollments. O(1) operation.

**Q: How do you handle concurrent enrollments?**  
A: Browser localStorage is single-threaded. In production backend, would use locks/transactions.

**Q: Why is auto-promotion instant?**  
A: Demonstrating real-time system. Queue operation is O(1), so it's efficient.

---

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎨 Theme Support

- **Light Mode** (Default)
  - Clean, professional look
  - High contrast
  - Easy on the eyes

- **Dark Mode**
  - Accessible for low-light environments
  - Reduced eye strain
  - Toggle via moon icon in header

---

## 📝 Code Examples

### Enrolling a Student

```javascript
// In app.js - RegistrationSystem
enrollStudent(rollNumber, courseId) {
  const student = this.students.get(rollNumber);
  const course = this.courses.get(courseId);
  
  // Validation
  if (!student.feeCleared) return { success: false };
  if (student.creditsEnrolled + course.credits > 20) return { success: false };
  
  const enrolledList = this.enrollments.get(courseId);
  if (enrolledList.findStudent(rollNumber)) return { success: false };
  
  // Enrollment or Waitlist
  if (course.enrolled < course.totalSeats) {
    enrolledList.enroll({rollNumber, name: student.name, enrolledAt: ...});
    course.enrolled++;
    student.creditsEnrolled += course.credits;
    this.actionHistory.push({type: 'ENROLL', courseId, rollNumber, ...});
    return { success: true };
  } else {
    this.waitlists.get(courseId).enqueue({rollNumber, name: student.name, ...});
    this.actionHistory.push({type: 'WAITLIST', courseId, rollNumber, ...});
    return { success: true };
  }
}
```

### Auto-Promoting from Waitlist

```javascript
promoteFromWaitlist(courseId) {
  const waitlist = this.waitlists.get(courseId);
  const course = this.courses.get(courseId);
  
  if (waitlist.isEmpty() || course.enrolled >= course.totalSeats) return;
  
  // FIFO: dequeue from front (O(1))
  const promoted = waitlist.dequeue();
  
  // Add to enrollment (O(1))
  const enrolledList = this.enrollments.get(courseId);
  enrolledList.enroll(promoted);
  course.enrolled++;
  
  if (course.enrolled === course.totalSeats) {
    course.status = "FULL";
  }
  
  this.addActivity('PROMOTED', `${promoted.name} promoted from waitlist`, promoted.rollNumber);
}
```

### Undo Functionality

```javascript
undoLastAction() {
  const action = this.actionHistory.pop(); // O(1)
  
  switch (action.type) {
    case 'ENROLL':
      this.dropCourse(action.rollNumber, action.courseId);
      break;
    case 'DROP':
      this.enrollStudent(action.rollNumber, action.courseId);
      break;
    case 'WAITLIST':
      // Remove from waitlist
      break;
  }
  
  return { success: true };
}
```

---

## 🚀 Future Enhancements

1. **Add Backend** (Node.js/Express)
   - Replace localStorage with database
   - Multi-user concurrency handling
   - Authentication & authorization

2. **Advanced DSA**
   - Implement AVL Tree for balanced BST
   - Graph algorithms for prerequisite courses
   - Heap for priority-based waitlist

3. **More Features**
   - Course prerequisites
   - Email notifications
   - Course reviews & ratings
   - Schedule conflict detection

4. **Performance Optimization**
   - Index by multiple attributes
   - Caching frequently accessed data
   - Pagination for large datasets

---

## 📄 License

Free to use for educational purposes. Built for DSA Practical viva preparation.

---

## 👨‍💻 Author Notes

This project was designed to:
- ✅ Implement real DSA structures (not theoretical)
- ✅ Demonstrate practical applications
- ✅ Be easily explainable during viva
- ✅ Look professional and impressive
- ✅ Run without any backend or server

**Key Teaching Points**:
1. Linked Lists for sequential access (O(1) insert at head)
2. Queues for fair ordering (FIFO)
3. Stacks for reversible operations (LIFO)
4. BST for efficient searching (O(log n))
5. Hash Tables for direct access (O(1))

Perfect for explaining "Why does this company use this data structure?" in technical interviews!

---

**Happy Viva! 🎓**

For questions or improvements, refer to the code comments which explain every DSA operation's time complexity.
