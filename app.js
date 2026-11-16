/**
 * ===================================================================
 * APP.JS - University Portal Application Logic
 * ===================================================================
 * Manages authentication, courses, students, approvals, and data.
 * Uses DSA structures behind the scenes (hidden from UI).
 */

console.log('App.js is loading...');

class UniversityPortal {
  constructor() {
    // DSA Structures (hidden from UI)
    this.courseCatalog = new LinkedList();
    this.courseIndex = new BST();
    this.courseHashMap = new HashTable();
    
    this.studentList = new LinkedList();
    this.studentHashMap = new HashTable();
    
    this.enrollments = new Map();
    this.waitlists = new Map();
    this.pendingApprovals = new Queue();
    
    this.undoStack = new Stack();
    this.noticeBoard = [];
    this.activityLog = [];
    this.notifications = new Map(); // studentId -> notifications array

    this.currentUser = null;
    this.currentRole = null;

    this.loadFromStorage();
    if (this.courseHashMap.getSize() === 0) {
      this.initializeDemoData();
    }
  }

  // ========================================================================
  // AUTHENTICATION
  // ========================================================================
  login(userId, password, role) {
    if (role === 'student') {
      const student = this.studentHashMap.get(userId);
      if (student && student.password === password) {
        this.currentUser = student;
        this.currentRole = 'student';
        return { success: true, user: student };
      }
    } else if (role === 'admin') {
      if (userId === 'admin' && password === 'admin123') {
        this.currentUser = { userId: 'admin', name: 'Administrator' };
        this.currentRole = 'admin';
        return { success: true, user: this.currentUser };
      }
    }
    return { success: false, message: 'Invalid credentials' };
  }

  logout() {
    this.currentUser = null;
    this.currentRole = null;
  }

  // ========================================================================
  // DEMO DATA INITIALIZATION
  // ========================================================================
  initializeDemoData() {
    // Create courses with time slots (for clash detection)
    const coursesData = [
      {
        id: 'CS101',
        code: 'CS101',
        name: 'Introduction to Programming',
        department: 'CS',
        credits: 3,
        totalSeats: 2,
        instructor: 'Dr. Sharma',
        schedule: { day: 'Mon,Wed', time: '10:00' },
        description: 'Fundamentals of programming',
        syllabus: {
          topics: ['Variables', 'Functions', 'Loops', 'Arrays'],
          prerequisites: 'None',
          faculty: 'Dr. Sharma',
          textbooks: 'Python Programming Basics'
        }
      },
      {
        id: 'CS102',
        code: 'CS102',
        name: 'Data Structures',
        department: 'CS',
        credits: 4,
        totalSeats: 2,
        instructor: 'Prof. Patel',
        schedule: { day: 'Mon,Wed', time: '10:00' }, // SAME TIME as CS101
        description: 'Linear and non-linear data structures',
        syllabus: {
          topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs'],
          prerequisites: 'CS101',
          faculty: 'Prof. Patel',
          textbooks: 'Data Structures and Algorithms'
        }
      },
      {
        id: 'IT201',
        code: 'IT201',
        name: 'Database Systems',
        department: 'IT',
        credits: 3,
        totalSeats: 3,
        instructor: 'Dr. Singh',
        schedule: { day: 'Tue,Thu', time: '14:00' },
        description: 'SQL and database design',
        syllabus: {
          topics: ['SQL Queries', 'Database Design', 'Normalization', 'Transactions'],
          prerequisites: 'None',
          faculty: 'Dr. Singh',
          textbooks: 'Database Management Systems'
        }
      },
      {
        id: 'CS103',
        code: 'CS103',
        name: 'Web Development',
        department: 'CS',
        credits: 3,
        totalSeats: 2,
        instructor: 'Prof. Khan',
        schedule: { day: 'Wed,Fri', time: '11:00' },
        description: 'HTML, CSS, JavaScript',
        syllabus: {
          topics: ['HTML Basics', 'CSS Styling', 'JavaScript DOM', 'React Basics'],
          prerequisites: 'CS101',
          faculty: 'Prof. Khan',
          textbooks: 'Web Development with Modern JavaScript'
        }
      },
      {
        id: 'MGMT301',
        code: 'MGMT301',
        name: 'Business Management',
        department: 'MGMT',
        credits: 2,
        totalSeats: 3,
        instructor: 'Prof. Joshi',
        schedule: { day: 'Thu,Fri', time: '09:00' },
        description: 'Organizational management',
        syllabus: {
          topics: ['Leadership', 'Strategic Planning', 'HR Management', 'Finance'],
          prerequisites: 'None',
          faculty: 'Prof. Joshi',
          textbooks: 'Management Principles'
        }
      },
      {
        id: 'IT202',
        code: 'IT202',
        name: 'Network Security',
        department: 'IT',
        credits: 3,
        totalSeats: 2,
        instructor: 'Dr. Gupta',
        schedule: { day: 'Tue,Thu', time: '15:00' },
        description: 'Cybersecurity fundamentals',
        syllabus: {
          topics: ['Encryption', 'Firewalls', 'VPN', 'Penetration Testing'],
          prerequisites: 'IT201',
          faculty: 'Dr. Gupta',
          textbooks: 'Network Security Essentials'
        }
      },
    ];

    coursesData.forEach(course => {
      this.addCourse(course);
    });

    // Create sample students
    const studentsData = [
      {
        rollNo: '240101',
        name: 'Arjun Kumar',
        email: 'arjun@university.edu',
        department: 'CS',
        password: 'student123',
        feeCleared: true,
        creditsEnrolled: 0,
        id: '240101',
      },
      {
        rollNo: '240102',
        name: 'Priya Sharma',
        email: 'priya@university.edu',
        department: 'IT',
        password: 'student123',
        feeCleared: false,
        creditsEnrolled: 0,
        id: '240102',
      },
      {
        rollNo: '240103',
        name: 'Raj Patel',
        email: 'raj@university.edu',
        department: 'CS',
        password: 'student123',
        feeCleared: true,
        creditsEnrolled: 0,
        id: '240103',
      },
      {
        rollNo: '240104',
        name: 'Neha Singh',
        email: 'neha@university.edu',
        department: 'MGMT',
        password: 'student123',
        feeCleared: true,
        creditsEnrolled: 0,
        id: '240104',
      },
      {
        rollNo: '240105',
        name: 'Vikram Gupta',
        email: 'vikram@university.edu',
        department: 'IT',
        password: 'student123',
        feeCleared: true,
        creditsEnrolled: 0,
        id: '240105',
      },
    ];

    studentsData.forEach(student => {
      this.studentList.insert(student);
      this.studentHashMap.set(student.rollNo, student);
      this.notifications.set(student.rollNo, []);
    });

    // Add pending approvals
    this.pendingApprovals.enqueue({
      id: 'REQ1',
      studentId: '240101',
      studentName: 'Arjun Kumar',
      courseId: 'CS101',
      courseName: 'Introduction to Programming',
      status: 'PENDING',
      requestDate: new Date().toLocaleString(),
    });

    this.pendingApprovals.enqueue({
      id: 'REQ2',
      studentId: '240103',
      studentName: 'Raj Patel',
      courseId: 'IT201',
      courseName: 'Database Systems',
      status: 'PENDING',
      requestDate: new Date().toLocaleString(),
    });

    // Add notices
    this.noticeBoard.unshift({
      id: 'N1',
      title: 'Fee Payment Deadline',
      message: 'All students must clear fees by November 30, 2024.',
      date: new Date().toLocaleString(),
    });

    this.noticeBoard.unshift({
      id: 'N2',
      title: 'Campus Maintenance',
      message: 'Campus will be closed on November 28 for maintenance.',
      date: new Date().toLocaleString(),
    });

    this.saveToStorage();
  }

  // ========================================================================
  // COURSE MANAGEMENT
  // ========================================================================
  addCourse(courseData) {
    const course = {
      ...courseData,
      enrolled: 0,
      status: 'OPEN',
    };

    this.courseCatalog.insert(course);
    this.courseIndex.insert(courseData.code, course);
    this.courseHashMap.set(courseData.id, course);
    
    this.enrollments.set(courseData.id, new LinkedList());
    this.waitlists.set(courseData.id, new Queue());

    this.addActivity(`Course ${courseData.code} added to catalog`);
    return course;
  }

  deleteCourse(courseId) {
    const course = this.courseHashMap.get(courseId);
    if (!course) return { success: false };

    this.courseCatalog.deleteById(courseId);
    this.courseIndex.delete(course.code);
    this.courseHashMap.delete(courseId);
    this.enrollments.delete(courseId);
    this.waitlists.delete(courseId);

    this.addActivity(`Course ${course.code} deleted`);
    return { success: true };
  }

  getAllCourses() {
    return this.courseCatalog.toArray();
  }

  getCourseById(courseId) {
    return this.courseHashMap.get(courseId);
  }

  getCoursesByDepartment(dept) {
    return this.courseCatalog.toArray().filter(c => c.department === dept);
  }

  searchCourseByCode(code) {
    return this.courseIndex.search(code);
  }

  updateCourseSeats(courseId, newSeats) {
    const course = this.courseHashMap.get(courseId);
    if (!course) return { success: false };

    const oldSeats = course.totalSeats;
    course.totalSeats = newSeats;

    if (newSeats > oldSeats) {
      const diff = newSeats - oldSeats;
      for (let i = 0; i < diff; i++) {
        this._promoteFromWaitlist(courseId);
      }
    }

    this.addActivity(`${course.code} seat capacity updated to ${newSeats}`);
    return { success: true };
  }

  // ========================================================================
  // TIMETABLE CLASH DETECTION
  // ========================================================================
  checkClash(studentId, courseId) {
    const course = this.courseHashMap.get(courseId);
    const courseStatus = this.getStudentCourseStatus(studentId);
    
    const approvedCourses = courseStatus.approved;

    for (let approvedCourse of approvedCourses) {
      if (this._timesConflict(course.schedule, approvedCourse.schedule)) {
        return {
          clash: true,
          conflictingCourse: approvedCourse
        };
      }
    }

    return { clash: false };
  }

  _timesConflict(schedule1, schedule2) {
    if (!schedule1 || !schedule2) return false;
    
    const days1 = schedule1.day.split(',');
    const days2 = schedule2.day.split(',');
    
    const time1 = schedule1.time;
    const time2 = schedule2.time;

    const hasDayConflict = days1.some(d => days2.includes(d));
    const hasTimeConflict = time1 === time2;

    return hasDayConflict && hasTimeConflict;
  }

  // ========================================================================
  // ENROLLMENT & APPROVALS
  // ========================================================================
  submitCourseRequest(studentId, courseId, forceApply = false) {
    const student = this.studentHashMap.get(studentId);
    const course = this.courseHashMap.get(courseId);

    if (!student || !course) {
      return { success: false, message: 'Invalid student or course' };
    }

    if (!student.feeCleared) {
      return { success: false, message: 'Fee must be cleared' };
    }

    if (student.creditsEnrolled + course.credits > 20) {
      return { success: false, message: 'Exceeds 20 credit limit' };
    }

    const enrolledList = this.enrollments.get(courseId);
    if (enrolledList.findByProperty('studentId', studentId)) {
      return { success: false, message: 'Already enrolled' };
    }

    const waitlist = this.waitlists.get(courseId);
    if (waitlist.toArray().find(r => r.studentId === studentId)) {
      return { success: false, message: 'Already in waitlist' };
    }

    const request = {
      id: `REQ${Date.now()}`,
      studentId,
      studentName: student.name,
      courseId,
      courseName: course.name,
      status: 'PENDING',
      requestDate: new Date().toLocaleString(),
      forceApply
    };

    this.pendingApprovals.enqueue(request);
    this.undoStack.push({ action: 'REQUEST_SUBMITTED', request });

    this.addActivity(`${student.name} requested ${course.code}`);
    return { success: true, requestId: request.id };
  }

  approveCourseRequest(requestId) {
    const request = this.pendingApprovals.removeById(requestId);
    if (!request) return { success: false };

    const student = this.studentHashMap.get(request.studentId);
    const course = this.courseHashMap.get(request.courseId);

    if (!student || !course) return { success: false };

    if (course.enrolled < course.totalSeats) {
      const enrolledList = this.enrollments.get(course.id);
      enrolledList.insert({
        studentId: student.rollNo,
        studentName: student.name,
        enrollDate: new Date().toLocaleString(),
      });

      course.enrolled++;
      student.creditsEnrolled += course.credits;
      if (course.enrolled === course.totalSeats) {
        course.status = 'FULL';
      }

      this.undoStack.push({ action: 'APPROVED_ENROLLED', request });
      this.addNotification(student.rollNo, `✅ Approved for ${course.code}`);
      this.addActivity(`${student.name} approved and enrolled in ${course.code}`);
    } else {
      const waitlist = this.waitlists.get(course.id);
      waitlist.enqueue({
        studentId: student.rollNo,
        studentName: student.name,
        waitlistDate: new Date().toLocaleString(),
      });

      this.undoStack.push({ action: 'APPROVED_WAITLISTED', request });
      this.addNotification(student.rollNo, `⏳ Waitlisted for ${course.code}`);
      this.addActivity(`${student.name} approved (waitlisted) for ${course.code}`);
    }

    this.saveToStorage();
    return { success: true };
  }

  rejectCourseRequest(requestId) {
    const request = this.pendingApprovals.removeById(requestId);
    if (!request) return { success: false };

    const student = this.studentHashMap.get(request.studentId);
    const course = this.courseHashMap.get(request.courseId);

    this.undoStack.push({ action: 'REJECTED', request });
    this.addNotification(student?.rollNo, `❌ Request rejected for ${course?.code}`);
    this.addActivity(`${student?.name}'s request for ${course?.code} rejected`);

    this.saveToStorage();
    return { success: true };
  }

  dropCourse(studentId, courseId) {
    const student = this.studentHashMap.get(studentId);
    const course = this.courseHashMap.get(courseId);

    if (!student || !course) return { success: false };

    const enrolledList = this.enrollments.get(courseId);
    const enrollment = enrolledList.toArray().find(e => e.studentId === studentId);

    if (!enrollment) return { success: false };

    enrolledList.remove(enrollment);
    course.enrolled--;
    student.creditsEnrolled -= course.credits;

    if (course.enrolled < course.totalSeats) {
      course.status = 'OPEN';
      this._promoteFromWaitlist(courseId);
    }

    this.undoStack.push({ action: 'DROPPED', studentId, courseId });
    this.addActivity(`${student.name} dropped ${course.code}`);

    this.saveToStorage();
    return { success: true };
  }

  _promoteFromWaitlist(courseId) {
    const waitlist = this.waitlists.get(courseId);
    const course = this.courseHashMap.get(courseId);

    if (waitlist.isEmpty() || course.enrolled >= course.totalSeats) return;

    const promoted = waitlist.dequeue();
    const enrolledList = this.enrollments.get(courseId);
    enrolledList.insert(promoted);
    course.enrolled++;

    if (course.enrolled === course.totalSeats) {
      course.status = 'FULL';
    }

    this.addNotification(promoted.studentId, `⬆️ Promoted to ${course.code}`);
    this.addActivity(`${promoted.studentName} promoted from waitlist in ${course.code}`);
  }

  // ========================================================================
  // STUDENT COURSE STATUS
  // ========================================================================
  getStudentCourseStatus(studentId) {
    const approved = [];
    const waitlisted = [];
    const pending = [];

    this.enrollments.forEach((enrolledList, courseId) => {
      const course = this.courseHashMap.get(courseId);
      if (enrolledList.toArray().find(e => e.studentId === studentId)) {
        approved.push({
          ...course,
          status: 'APPROVED',
          enrollDate: new Date().toLocaleString(),
        });
      }
    });

    this.waitlists.forEach((waitlist, courseId) => {
      const course = this.courseHashMap.get(courseId);
      const item = waitlist.toArray().find(w => w.studentId === studentId);
      if (item) {
        const position = waitlist.toArray().indexOf(item) + 1;
        waitlisted.push({
          ...course,
          status: 'WAITLISTED',
          position,
        });
      }
    });

    this.pendingApprovals.toArray().forEach(req => {
      if (req.studentId === studentId) {
        pending.push({
          id: req.courseId,
          code: req.courseName.split(' - ')[0] || 'Course',
          name: req.courseName,
          status: 'PENDING_APPROVAL',
          requestDate: req.requestDate,
        });
      }
    });

    return { approved, waitlisted, pending };
  }

  // ========================================================================
  // STUDENT MANAGEMENT
  // ========================================================================
  toggleFeeStatus(studentId) {
    const student = this.studentHashMap.get(studentId);
    if (!student) return { success: false };

    student.feeCleared = !student.feeCleared;
    this.undoStack.push({
      action: 'FEE_TOGGLED',
      studentId,
      oldStatus: !student.feeCleared,
    });

    this.addActivity(`Fee status toggled for ${student.name}`);
    this.saveToStorage();
    return { success: true };
  }

  getAllStudents() {
    return this.studentList.toArray();
  }

  getStudentById(studentId) {
    return this.studentHashMap.get(studentId);
  }

  // ========================================================================
  // NOTIFICATIONS
  // ========================================================================
  addNotification(studentId, message) {
    if (!this.notifications.has(studentId)) {
      this.notifications.set(studentId, []);
    }
    
    const notifs = this.notifications.get(studentId);
    notifs.unshift({
      id: `NOTIF${Date.now()}`,
      message,
      read: false,
      timestamp: new Date().toLocaleString(),
    });

    // Keep only last 50
    if (notifs.length > 50) {
      notifs.pop();
    }
  }

  getNotifications(studentId) {
    return this.notifications.get(studentId) || [];
  }

  markNotificationRead(studentId, notificationId) {
    const notifs = this.notifications.get(studentId) || [];
    const notif = notifs.find(n => n.id === notificationId);
    if (notif) notif.read = true;
  }

  markAllNotificationsRead(studentId) {
    const notifs = this.notifications.get(studentId) || [];
    notifs.forEach(n => n.read = true);
  }

  getUnreadCount(studentId) {
    const notifs = this.notifications.get(studentId) || [];
    return notifs.filter(n => !n.read).length;
  }

  // ========================================================================
  // ADMIN DASHBOARD
  // ========================================================================
  getAdminDashboard() {
    return {
      pendingCount: this.pendingApprovals.getSize(),
      totalCourses: this.courseHashMap.getSize(),
      totalEnrolled: Array.from(this.enrollments.values()).reduce(
        (sum, list) => sum + list.getSize(),
        0
      ),
      totalWaitlisted: Array.from(this.waitlists.values()).reduce(
        (sum, queue) => sum + queue.getSize(),
        0
      ),
    };
  }

  getPendingApprovals() {
    return this.pendingApprovals.toArray();
  }

  getCourseRoster(courseId) {
    const course = this.courseHashMap.get(courseId);
    const enrolledList = this.enrollments.get(courseId);
    const waitlist = this.waitlists.get(courseId);

    return {
      course,
      enrolled: enrolledList.toArray(),
      waitlist: waitlist.toArray(),
    };
  }

  exportRosterCSV(courseId) {
    const roster = this.getCourseRoster(courseId);
    const course = roster.course;
    
    let csv = `Course: ${course.code} - ${course.name}\n`;
    csv += `Date Exported: ${new Date().toLocaleString()}\n\n`;
    
    csv += `Enrolled Students (${roster.enrolled.length})\n`;
    csv += `Student ID,Student Name,Enrollment Date\n`;
    roster.enrolled.forEach(e => {
      csv += `${e.studentId},${e.studentName},${e.enrollDate}\n`;
    });
    
    csv += `\nWaitlisted Students (${roster.waitlist.length})\n`;
    csv += `Student ID,Student Name,Waitlist Position\n`;
    roster.waitlist.forEach((w, index) => {
      csv += `${w.studentId},${w.studentName},${index + 1}\n`;
    });

    return csv;
  }

  // ========================================================================
  // UNDO FUNCTIONALITY
  // ========================================================================
  undoLastAction() {
    const action = this.undoStack.pop();
    if (!action) return { success: false };

    this.addActivity(`Action undone`);
    this.saveToStorage();
    return { success: true };
  }

  // ========================================================================
  // NOTICE BOARD
  // ========================================================================
  addNotice(title, message) {
    const notice = {
      id: `N${Date.now()}`,
      title,
      message,
      date: new Date().toLocaleString(),
    };
    this.noticeBoard.unshift(notice);
    this.addActivity(`New notice: ${title}`);
    return notice;
  }

  deleteNotice(noticeId) {
    const index = this.noticeBoard.findIndex(n => n.id === noticeId);
    if (index !== -1) {
      this.noticeBoard.splice(index, 1);
      this.addActivity(`Notice deleted`);
      return { success: true };
    }
    return { success: false };
  }

  getNotices(limit = 5) {
    return this.noticeBoard.slice(0, limit);
  }

  // ========================================================================
  // ACTIVITY LOGGING
  // ========================================================================
  addActivity(message) {
    this.activityLog.unshift({
      message,
      timestamp: new Date().toLocaleString(),
    });
    if (this.activityLog.length > 100) {
      this.activityLog.pop();
    }
  }

  getActivityLog(limit = 20) {
    return this.activityLog.slice(0, limit);
  }

  // ========================================================================
  // PERSISTENCE
  // ========================================================================
  saveToStorage() {
    const data = {
      courses: this.courseCatalog.toArray(),
      students: this.studentList.toArray(),
      enrollments: Array.from(this.enrollments.entries()).map(([courseId, list]) => [
        courseId,
        list.toArray(),
      ]),
      waitlists: Array.from(this.waitlists.entries()).map(([courseId, queue]) => [
        courseId,
        queue.toArray(),
      ]),
      pendingApprovals: this.pendingApprovals.toArray(),
      noticeBoard: this.noticeBoard,
      activityLog: this.activityLog,
      notifications: Array.from(this.notifications.entries()),
    };
    localStorage.setItem('universityPortal', JSON.stringify(data));
  }

  loadFromStorage() {
    const saved = localStorage.getItem('universityPortal');
    if (!saved) return;

    const data = JSON.parse(saved);

    if (data.courses) {
      data.courses.forEach(course => {
        this.addCourse(course);
      });
    }

    if (data.students) {
      data.students.forEach(student => {
        this.studentList.insert(student);
        this.studentHashMap.set(student.rollNo, student);
        this.notifications.set(student.rollNo, []);
      });
    }

    if (data.enrollments) {
      data.enrollments.forEach(([courseId, students]) => {
        const list = new LinkedList();
        students.forEach(s => list.insert(s));
        this.enrollments.set(courseId, list);
      });
    }

    if (data.waitlists) {
      data.waitlists.forEach(([courseId, students]) => {
        const queue = new Queue();
        students.forEach(s => queue.enqueue(s));
        this.waitlists.set(courseId, queue);
      });
    }

    if (data.pendingApprovals) {
      data.pendingApprovals.forEach(req => {
        this.pendingApprovals.enqueue(req);
      });
    }

    if (data.noticeBoard) {
      this.noticeBoard = data.noticeBoard;
    }

    if (data.activityLog) {
      this.activityLog = data.activityLog;
    }

    if (data.notifications) {
      data.notifications.forEach(([studentId, notifs]) => {
        this.notifications.set(studentId, notifs);
      });
    }
  }

  resetData() {
    localStorage.removeItem('universityPortal');
    this.courseCatalog.clear();
    this.courseIndex.clear();
    this.courseHashMap.clear();
    this.studentList.clear();
    this.studentHashMap.clear();
    this.enrollments.clear();
    this.waitlists.clear();
    this.pendingApprovals.clear();
    this.undoStack.clear();
    this.noticeBoard = [];
    this.activityLog = [];
    this.notifications.clear();
    this.initializeDemoData();
  }
}

// Global instance
const portal = new UniversityPortal();

console.log('Portal instance created successfully', typeof portal);
