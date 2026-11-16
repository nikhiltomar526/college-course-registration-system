# 📁 Files Guide - What Each File Does

## 🎯 Quick Navigation

Want to...
- **Get started?** → Open `index.html`
- **Learn quick overview?** → Read `START_HERE.md`
- **Prepare for viva?** → Read `QUICKSTART.md`
- **Understand DSA?** → Read `README.md`
- **Study architecture?** → Read `ARCHITECTURE.md`
- **See project summary?** → Read `PROJECT_SUMMARY.md`

---

## 📄 File-by-File Breakdown

### 🌐 Web Application Files

#### **index.html** (4 KB)
**What:** Main HTML page structure

**Contains:**
- Sidebar navigation
- Header with user info
- Main content area (dynamically filled)
- Toast notification container
- Script imports

**When to edit:** Only if you want to change page structure

**Key elements:**
- `<aside class="sidebar">` - Left navigation
- `<main class="main-wrapper">` - Content area
- Role switcher buttons
- Student dropdown
- Navigation menu

```html
<!-- Example structure -->
<aside class="sidebar">
  <h1>🎓 College Portal</h1>
  <nav>Dashboard, Courses, Registrations, Visualizer, Admin</nav>
</aside>
<main>
  <div class="main-content"><!-- Filled by JavaScript --></div>
</main>
```

**Don't touch if:** Application is working fine

---

#### **styles.css** (28 KB)
**What:** All styling for the portal

**Contains:**
- CSS variables (colors, fonts, spacing)
- Dark/light theme definitions
- Responsive design breakpoints
- Component styles (buttons, cards, tables)
- Animations & transitions

**Key sections:**
- `:root` - Light mode variables
- `body.dark-mode` - Dark mode variables
- `.sidebar` - Left panel styling
- `.kpi-grid`, `.courses-grid` - Layouts
- `.visualizer` - DSA visualizer styling
- Media queries for mobile

**To customize:**
- Colors: Edit CSS variables at top
- Spacing: Change `--spacing-*` values
- Fonts: Edit `--font-family`

**Examples:**
```css
:root {
  --accent-primary: #4CAF50;  /* Green */
  --bg-primary: #f8f9fa;      /* Light gray */
}

body.dark-mode {
  --accent-primary: #66BB6A;  /* Lighter green */
  --bg-primary: #0f1419;      /* Dark */
}
```

**Don't touch if:** Design looks good

---

### 🧠 Application Logic Files

#### **dsa.js** (16 KB) ⭐ MOST IMPORTANT FOR VIVA
**What:** Core Data Structures & Algorithms implementations

**Contains 7 Classes:**

1. **Node**
   - Base class for all linked structures
   - Properties: `data`, `next`

2. **CourseLinkedList**
   - Stores all courses
   - Methods: `insert()`, `findById()`, `toArray()`, `deleteById()`
   - Time: Insert O(n), Find O(n), Delete O(n)

3. **StudentLinkedList**
   - Stores enrolled students per course
   - Methods: `enroll()`, `removeStudent()`, `findStudent()`, `toArray()`
   - Time: Enroll O(1)*, Remove O(n), Find O(n)

4. **WaitlistQueue**
   - FIFO queue for waitlist
   - Methods: `enqueue()`, `dequeue()`, `peek()`, `toArray()`, `isEmpty()`
   - Time: All operations O(1)

5. **ActionHistoryStack**
   - LIFO stack for undo
   - Methods: `push()`, `pop()`, `peek()`, `toArray()`, `isEmpty()`
   - Time: All operations O(1)

6. **CourseBST + BSTNode**
   - Binary search tree for courses
   - Methods: `insert()`, `search()`, `inOrderTraversal()`, `delete()`
   - Time: Insert O(log n)*, Search O(log n)*, Delete O(log n)*

7. **StudentHashTable**
   - Hash table for student lookup
   - Methods: `insert()`, `find()`, `remove()`, `toArray()`
   - Time: All operations O(1)

**How to use:** Reference for explaining DSA to examiners

**Key point:** Every method has time complexity comments!

```javascript
// Example: Linked List enroll (O(1))
enroll(studentData) {
  const newNode = new Node(studentData);
  newNode.next = this.head;    // Point to current head
  this.head = newNode;          // New node becomes head
  this.size++;
  // Time: O(1) - constant operations
}
```

**Study this for viva:** Understand each class and operation

---

#### **app.js** (18 KB)
**What:** Business logic and state management

**Contains:**
- `RegistrationSystem` class
- All business rules enforcement
- Data coordination
- localStorage persistence

**Key Sections:**

1. **Constructor & Initialization**
   - Creates DSA structures
   - Loads or initializes demo data

2. **Course Management**
   - `addCourse()` - Add new course
   - `deleteCourse()` - Remove course
   - `updateCourseSeats()` - Edit capacity

3. **Enrollment Management** ⭐
   - `enrollStudent()` - Main enrollment logic with all checks
   - `dropCourse()` - Drop and trigger promotion
   - `joinWaitlist()` - Add to waitlist
   - `promoteFromWaitlist()` - Auto-promotion

4. **Undo Functionality**
   - `undoLastAction()` - Reverse last operation

5. **Student Management**
   - `toggleFeeStatus()` - Toggle fee clearance
   - `getStudentRegistrations()` - Get enrolled & waitlisted

6. **Analytics**
   - `getAnalytics()` - Calculate KPIs
   - `getActivityFeed()` - Get activity log

7. **Persistence**
   - `saveToLocalStorage()` - Save all data
   - `loadFromLocalStorage()` - Load saved data
   - `resetAllData()` - Reset to demo

**How to use:** Reference for explaining business logic

**Example - Enrollment Flow:**
```javascript
enrollStudent(rollNumber, courseId) {
  // 1. Validate student & course
  // 2. Check fee clearance
  // 3. Check credit limit
  // 4. Check not already enrolled
  // 5. Check seats available
  //    → Enroll OR
  //    → Join waitlist
  // 6. Record action (Stack)
  // 7. Add activity (Feed)
  // 8. Return result
}
```

**Study this for viva:** Understand business rules & flow

---

#### **ui.js** (32 KB)
**What:** User interface controller and interaction handling

**Contains:**
- `UIController` class
- All view rendering methods
- Event listeners
- User interactions
- Modal/popup handling

**Key Methods:**

1. **Initialization & Events**
   - `initEventListeners()` - Setup all listeners
   - `switchRole()` - Toggle student/admin
   - `switchView()` - Change current page

2. **View Rendering** (6 views)
   - `renderDashboard()` - KPI cards + feed
   - `renderCourses()` - Course catalog
   - `renderRegistrations()` - My courses
   - `renderAdmin()` - Admin panel
   - `renderVisualizer()` - DSA visualizer
   - `renderCurrentView()` - Route handler

3. **DSA Visualizer Tabs** ⭐
   - `renderLinkedListVisualization()` - Tab 1
   - `renderQueueVisualization()` - Tab 2
   - `renderStackVisualization()` - Tab 3
   - `renderBSTVisualization()` - Tab 4
   - `renderComplexityChart()` - Tab 5

4. **User Actions**
   - `enrollCourse()` - Handle enrollment click
   - `dropCourse()` - Handle drop click
   - `undoLastAction()` - Handle undo click
   - `addNewCourse()` - Handle admin form

5. **Utilities**
   - `showToast()` - Show notification
   - `printRegistrationSlip()` - Print receipt
   - `switchVisualizerTab()` - Tab switching

**How to use:** Reference for explaining UI flow

**Example - Render Courses View:**
```javascript
renderCourses() {
  // 1. Get all courses
  // 2. Apply filters (dept, status, search)
  // 3. Create HTML for each course card
  // 4. Add buttons (Enroll/Waitlist)
  // 5. Insert into DOM
}
```

**For viva:** Understand how views are constructed

---

### 📚 Documentation Files

#### **START_HERE.md** (2 KB) 📍 START READING HERE
**Purpose:** Quick start guide for beginners

**Sections:**
- ⚡ Quick Start (30 seconds)
- 📖 Documentation Guide (what to read)
- 🚀 First Steps (5 steps to explore)
- 🎯 For Your Viva (5-minute demo)
- 🧠 DSA Explained Simply (brief explanations)

**Read this:** Before everything else!

**Reading time:** 5 minutes

---

#### **QUICKSTART.md** (8 KB)
**Purpose:** Demo preparation and quick reference

**Sections:**
- Quick start
- First look UI
- 5-minute tour
- Testing checklist
- Demo data reference
- Quick tips
- Troubleshooting
- Viva script template

**Read this:** To prepare your viva demo

**Reading time:** 10 minutes

---

#### **README.md** (25 KB) 📖 COMPREHENSIVE GUIDE
**Purpose:** Complete project documentation

**Sections:**
- Project overview
- Feature list (with details)
- DSA implementations (with diagrams)
- Business logic rules
- UI components breakdown
- Time complexity analysis
- Testing scenarios
- Viva explanation guide
- Future enhancements

**Read this:** For deep understanding

**Reading time:** 30 minutes

---

#### **ARCHITECTURE.md** (20 KB)
**Purpose:** System design and technical deep-dive

**Sections:**
- High-level architecture diagram
- Component hierarchy
- Data structures details
- Data flow diagrams
- Relationships & mapping
- Design decisions
- Business logic rules
- Performance analysis
- Testing strategy
- Learning outcomes

**Read this:** For technical depth

**Reading time:** 25 minutes

---

#### **PROJECT_SUMMARY.md** (15 KB)
**Purpose:** Overview and viva preparation

**Sections:**
- What's been built
- Deliverables list
- Key features
- Getting started
- Demo data
- DSA explanations
- Business logic
- Viva script
- File statistics
- Testing scenarios

**Read this:** For overview

**Reading time:** 20 minutes

---

#### **FILES_GUIDE.md** (This File)
**Purpose:** Navigate and understand each file

**Sections:**
- Quick navigation
- File-by-file breakdown
- What each file contains
- How to use each file
- When to edit/study

**Read this:** To understand the structure

**Reading time:** 10 minutes

---

### 🔧 Utility Files

#### **college_data.json** (Already in workspace)
**What:** Optional pre-loaded data file

**Note:** Not used in current implementation (data loads via code), but can be extended for advanced features

---

#### **college_registration.py** (Already in workspace)
**What:** Previous Python implementation

**Note:** Replaced by this HTML/CSS/JS version. Kept for reference.

---

## 🎯 Reading Path for Viva

### Quick Path (30 minutes)
1. ✅ START_HERE.md (5 min)
2. ✅ QUICKSTART.md (10 min)
3. ✅ Open index.html and explore (15 min)

### Thorough Path (90 minutes)
1. ✅ START_HERE.md (5 min)
2. ✅ QUICKSTART.md (10 min)
3. ✅ PROJECT_SUMMARY.md (15 min)
4. ✅ README.md (30 min)
5. ✅ dsa.js code review (20 min)
6. ✅ Open index.html and test (10 min)

### Deep Dive Path (2 hours)
1. ✅ All documentation above (90 min)
2. ✅ ARCHITECTURE.md (20 min)
3. ✅ Review all code files (20 min)
4. ✅ Test all scenarios (10 min)

---

## 🧪 Code Study Path

### For Understanding DSA
1. Read: README.md "DSA Implementations" section
2. Read: dsa.js - each class
3. Study: Time complexity comments in dsa.js
4. Reference: ARCHITECTURE.md "Data Structures" section

### For Understanding Business Logic
1. Read: README.md "Business Rules" section
2. Read: app.js - RegistrationSystem class
3. Study: enrollStudent() method flow
4. Test: QUICKSTART.md test scenarios

### For Understanding UI
1. Read: QUICKSTART.md "5-Minute Tour"
2. Open: index.html in browser
3. Read: ui.js - renderDashboard(), renderCourses()
4. Play: Click through all views

---

## 📊 File Relationships

```
index.html
    ↓ imports
    ├── dsa.js (Define data structures)
    ├── app.js (Create RegistrationSystem)
    └── ui.js (Create UIController)
         ↓
    Both use: styles.css (for HTML styling)
    
app.js
    ↓ creates instances
    └── All DSA classes from dsa.js
         ├── CourseLinkedList
         ├── StudentLinkedList
         ├── WaitlistQueue
         ├── ActionHistoryStack
         ├── CourseBST
         └── StudentHashTable

ui.js
    ↓ calls methods from
    └── app.js (RegistrationSystem methods)
         ↓
    Which uses
    └── dsa.js (DSA structures)
```

---

## 🔍 Where to Find Things

### "Where is X?"

**Enroll a student?**
→ app.js → `enrollStudent()` method

**Show enrolled students?**
→ ui.js → `renderRegistrations()` method

**Define Queue?**
→ dsa.js → `WaitlistQueue` class

**Get courses list?**
→ app.js → `getAllCourses()` method

**Handle course filter?**
→ ui.js → `renderCourses()` method

**Show DSA Visualizer?**
→ ui.js → `renderVisualizer()` method

**Style the dashboard?**
→ styles.css → `.dashboard` class

**Color scheme?**
→ styles.css → `:root` variables

**Business rules?**
→ app.js → `enrollStudent()` validation

---

## ✅ Before Your Viva

- [ ] Open index.html ✓
- [ ] Read START_HERE.md ✓
- [ ] Read QUICKSTART.md ✓
- [ ] Explore portal ✓
- [ ] Review dsa.js ✓
- [ ] Understand business logic ✓
- [ ] Practice viva script ✓
- [ ] Test demo scenarios ✓

---

## 📞 Quick Reference

**"What file has...?"**

| What | File | Location |
|------|------|----------|
| HTML structure | index.html | Root tags |
| Styling | styles.css | CSS rules |
| Linked List | dsa.js | `class LinkedList` |
| Queue | dsa.js | `class WaitlistQueue` |
| Stack | dsa.js | `class ActionHistoryStack` |
| Enrollment logic | app.js | `enrollStudent()` |
| UI rendering | ui.js | `render*()` methods |
| DSA explanation | README.md | Section 2 |
| Demo guide | QUICKSTART.md | Full file |
| Architecture | ARCHITECTURE.md | Full file |

---

## 💡 Tips

1. **For Quick Understanding:** Read START_HERE.md first
2. **For Code Details:** Check dsa.js comments
3. **For Demo:** Follow QUICKSTART.md sequence
4. **For Viva:** Study ARCHITECTURE.md
5. **For Overview:** Read PROJECT_SUMMARY.md

---

## 🎓 You're Ready!

Every file serves a purpose:
- 📁 Web files make it work
- 💻 Code files implement DSA
- 📖 Doc files explain everything

Start with **START_HERE.md**, then **open index.html**.

**Good luck! 🚀**

---

*File Guide Generated: November 2026*
*For: College Registration Portal DSA Practical Viva*
