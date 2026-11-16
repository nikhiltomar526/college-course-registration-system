/**
 * ===================================================================
 * UI.JS - User Interface & Interaction Logic (Part 1)
 * ===================================================================
 * Handles all UI rendering, navigation, and user interactions.
 */

// ========================================================================
// LOGIN HANDLING
// ========================================================================
function handleStudentLogin(event) {
  try {
    event.preventDefault();
    const rollNo = document.getElementById('studentRollNo').value;
    const password = document.getElementById('studentPassword').value;

    console.log('Login attempt:', { rollNo, role: 'student' });
    const result = portal.login(rollNo, password, 'student');
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, showing portal');
      showLoginPage(false);
      loadStudentPortal();
      navigateStudent('dashboard');
    } else {
      showLoginError('Invalid Roll No or Password');
    }
  } catch (error) {
    console.error('Login error:', error);
    showLoginError('Error: ' + error.message);
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;

  const result = portal.login(username, password, 'admin');
  if (result.success) {
    showLoginPage(false);
    loadAdminPortal();
    navigateAdmin('dashboard');
  } else {
    showLoginError('Invalid Username or Password');
  }
}

function showLoginPage(show) {
  document.getElementById('loginScreen').classList.toggle('active', show);
  if (show) {
    document.getElementById('studentPortal').style.display = 'none';
    document.getElementById('adminPortal').style.display = 'none';
  } else {
    // Don't change portal display here - let the loading functions handle it
  }
}

function showLoginError(message) {
  const errorDiv = document.getElementById('loginError');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => (errorDiv.style.display = 'none'), 3000);
}

function logout() {
  portal.logout();
  document.getElementById('studentPortal').style.display = 'none';
  document.getElementById('adminPortal').style.display = 'none';
  document.getElementById('studentLoginForm').reset();
  document.getElementById('adminLoginForm').reset();
  showLoginPage(true);
}

// ========================================================================
// LOGIN TABS
// ========================================================================
document.querySelectorAll('.login-tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const tab = this.dataset.tab;
    document.querySelectorAll('.login-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.login-tab-content').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(tab + 'LoginTab').classList.add('active');
  });
});

// ========================================================================
// THEME TOGGLE
// ========================================================================
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

// ========================================================================
// STUDENT PORTAL - LOADING & NAVIGATION
// ========================================================================
function loadStudentPortal() {
  try {
    console.log('loadStudentPortal() called');
    document.getElementById('studentPortal').style.display = 'grid';
    const student = portal.currentUser;
    document.getElementById('studentName').textContent = student.name;
    updateNotificationBadge();
    console.log('Student portal loaded successfully');
  } catch (error) {
    console.error('Error loading student portal:', error);
    showToast('Error loading portal: ' + error.message, 'error');
  }
}

function navigateStudent(page) {
  try {
    console.log('Navigating to page:', page);
    document.querySelectorAll('.student-portal .nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    const titles = {
      dashboard: '📊 Dashboard',
      courses: '📚 Course Catalog',
      mystatus: '📋 My Courses',
      timetable: '📅 My Timetable',
    };

    document.getElementById('pageTitle').textContent = titles[page] || 'Page';

    switch (page) {
      case 'dashboard':
        renderStudentDashboard();
        break;
      case 'courses':
        renderCatalog();
        break;
      case 'mystatus':
        renderMyStatus();
        break;
      case 'timetable':
        renderMyTimetable();
        break;
    }
    console.log('Navigation completed for page:', page);
  } catch (error) {
    console.error('Error navigating to page:', page, error);
    showToast('Error loading page: ' + error.message, 'error');
  }
}

// ========================================================================
// STUDENT DASHBOARD
// ========================================================================
function renderStudentDashboard() {
  const student = portal.currentUser;
  const courseStatus = portal.getStudentCourseStatus(student.rollNo);
  const notices = portal.getNotices(3);

  let html = `
    <div class="student-dashboard">
      <div class="profile-card">
        <h2>${student.name}</h2>
        <div class="profile-info">
          <p><strong>Roll No:</strong> ${student.rollNo}</p>
          <p><strong>Department:</strong> ${student.department}</p>
          <p><strong>Credits Enrolled:</strong> ${student.creditsEnrolled}/20</p>
        </div>
        <div class="credit-bar">
          <div class="credit-fill" style="width: ${(student.creditsEnrolled / 20) * 100}%"></div>
        </div>
        <div class="fee-status ${student.feeCleared ? 'cleared' : 'pending'}">
          Fee Status: ${student.feeCleared ? '✅ Cleared' : '❌ Pending'}
        </div>
      </div>

      <div class="status-summary">
        <div class="status-card approved">
          <div class="status-count">${courseStatus.approved.length}</div>
          <div class="status-label">Approved</div>
        </div>
        <div class="status-card waitlisted">
          <div class="status-count">${courseStatus.waitlisted.length}</div>
          <div class="status-label">Waitlisted</div>
        </div>
        <div class="status-card pending">
          <div class="status-count">${courseStatus.pending.length}</div>
          <div class="status-label">Pending</div>
        </div>
      </div>

      <div class="notices-section">
        <h3>📢 Campus Notices</h3>
        ${
          notices.length > 0
            ? notices
                .map(
                  notice => `
              <div class="notice-card">
                <h4>${notice.title}</h4>
                <p>${notice.message}</p>
                <small>${notice.date}</small>
              </div>
            `
                )
                .join('')
            : '<p>No notices</p>'
        }
      </div>
    </div>
  `;

  document.getElementById('studentContent').innerHTML = html;
}

// ========================================================================
// COURSE CATALOG WITH SYLLABUS
// ========================================================================
function renderCatalog() {
  const courses = portal.getAllCourses();

  let html = `
    <div class="catalog-section">
      <div class="catalog-filters">
        <input 
          type="text" 
          id="courseSearch" 
          class="search-box"
          placeholder="Search courses..."
          onkeyup="updateCatalog()"
        >
        <select id="deptFilter" class="filter-select" onchange="updateCatalog()">
          <option value="">All Departments</option>
          <option value="CS">Computer Science</option>
          <option value="IT">Information Technology</option>
          <option value="MGMT">Management</option>
        </select>
      </div>

      <div id="courseList" class="courses-grid">
  `;

  courses.forEach(course => {
    const enrolledList = portal.enrollments.get(course.id);
    const enrolled = enrolledList ? enrolledList.getSize() : 0;
    const status = course.status === 'FULL' ? 'Full' : 'Available';
    const statusClass = course.status === 'FULL' ? 'full' : 'available';

    html += `
      <div class="course-card">
        <div class="course-header">
          <h3>${course.code}</h3>
          <span class="course-status ${statusClass}">${status}</span>
        </div>
        <h4>${course.name}</h4>
        <p class="course-desc">${course.description}</p>
        <div class="course-meta">
          <span>👨‍🏫 ${course.instructor}</span>
          <span>📅 ${course.schedule.day} ${course.schedule.time}</span>
          <span>📚 ${course.credits} Credits</span>
        </div>
        <div class="seat-info">
          <div class="seat-bar">
            <div class="seat-fill" style="width: ${(enrolled / course.totalSeats) * 100}%"></div>
          </div>
          <span class="seat-text">${enrolled}/${course.totalSeats} Seats</span>
        </div>
        <div class="course-actions">
          <button class="btn-secondary btn-sm" onclick="viewSyllabus('${course.id}')">
            📖 Syllabus
          </button>
          <button class="apply-btn" onclick="applyCourse('${course.id}')">
            Apply
          </button>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  document.getElementById('studentContent').innerHTML = html;
}

function updateCatalog() {
  const search = document.getElementById('courseSearch').value.toLowerCase();
  const dept = document.getElementById('deptFilter').value;

  const courses = portal
    .getAllCourses()
    .filter(c => {
      const matchSearch =
        c.code.toLowerCase().includes(search) || c.name.toLowerCase().includes(search);
      const matchDept = !dept || c.department === dept;
      return matchSearch && matchDept;
    });

  let html = '';
  courses.forEach(course => {
    const enrolledList = portal.enrollments.get(course.id);
    const enrolled = enrolledList ? enrolledList.getSize() : 0;
    const status = course.status === 'FULL' ? 'Full' : 'Available';
    const statusClass = course.status === 'FULL' ? 'full' : 'available';

    html += `
      <div class="course-card">
        <div class="course-header">
          <h3>${course.code}</h3>
          <span class="course-status ${statusClass}">${status}</span>
        </div>
        <h4>${course.name}</h4>
        <p class="course-desc">${course.description}</p>
        <div class="course-meta">
          <span>👨‍🏫 ${course.instructor}</span>
          <span>📅 ${course.schedule.day} ${course.schedule.time}</span>
          <span>📚 ${course.credits} Credits</span>
        </div>
        <div class="seat-info">
          <div class="seat-bar">
            <div class="seat-fill" style="width: ${(enrolled / course.totalSeats) * 100}%"></div>
          </div>
          <span class="seat-text">${enrolled}/${course.totalSeats} Seats</span>
        </div>
        <div class="course-actions">
          <button class="btn-secondary btn-sm" onclick="viewSyllabus('${course.id}')">
            📖 Syllabus
          </button>
          <button class="apply-btn" onclick="applyCourse('${course.id}')">
            Apply
          </button>
        </div>
      </div>
    `;
  });

  document.getElementById('courseList').innerHTML = html;
}

// ========================================================================
// SYLLABUS MODAL
// ========================================================================
function viewSyllabus(courseId) {
  const course = portal.getCourseById(courseId);
  if (!course) return;

  const syllabus = course.syllabus || {};

  let html = `
    <div class="syllabus-content">
      <h3>${course.code} - ${course.name}</h3>
      <p class="syllabus-instructor"><strong>Faculty:</strong> ${syllabus.faculty || course.instructor}</p>
      <p><strong>Credits:</strong> ${course.credits} | <strong>Schedule:</strong> ${course.schedule.day} ${course.schedule.time}</p>

      <div class="syllabus-section">
        <h4>📚 Course Topics</h4>
        <ul>
          ${(syllabus.topics || []).map(topic => `<li>${topic}</li>`).join('')}
        </ul>
      </div>

      <div class="syllabus-section">
        <h4>📖 Textbooks</h4>
        <p>${syllabus.textbooks || 'To be announced'}</p>
      </div>

      <div class="syllabus-section">
        <h4>⚡ Prerequisites</h4>
        <p>${syllabus.prerequisites || 'None'}</p>
      </div>

      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        This syllabus is subject to change at the instructor's discretion.
      </p>
    </div>
  `;

  document.getElementById('syllabusBody').innerHTML = html;
  document.getElementById('syllabusCourseCode').textContent = course.code;
  document.getElementById('syllabusModal').classList.add('active');
}

function closeSyllabusModal() {
  document.getElementById('syllabusModal').classList.remove('active');
}

// ========================================================================
// COURSE APPLICATION WITH CLASH DETECTION
// ========================================================================
let pendingCourseId = null;

function applyCourse(courseId) {
  pendingCourseId = courseId;

  const clashResult = portal.checkClash(portal.currentUser.rollNo, courseId);
  if (clashResult.clash) {
    const conflictCourse = clashResult.conflictingCourse;
    const clashMessage = `
      This course has a timetable clash with <strong>${conflictCourse.code}</strong>
      <br>
      <strong>${conflictCourse.code}</strong>: ${conflictCourse.schedule.day} ${conflictCourse.schedule.time}
      <br><br>
      The new course is also scheduled for ${conflictCourse.schedule.day} ${conflictCourse.schedule.time}.
      <br><br>
      Do you still want to apply?
    `;

    document.getElementById('clashMessage').innerHTML = clashMessage;
    document.getElementById('clashModal').classList.add('active');
  } else {
    applyDespiteClash();
  }
}

function closeClashModal() {
  document.getElementById('clashModal').classList.remove('active');
  pendingCourseId = null;
}

function applyDespiteClash() {
  const result = portal.submitCourseRequest(portal.currentUser.rollNo, pendingCourseId, true);
  
  closeClashModal();

  if (result.success) {
    showToast('✅ Request submitted successfully!', 'success');
    portal.saveToStorage();
    renderCatalog();
  } else {
    showToast('❌ ' + result.message, 'error');
  }
}

// ========================================================================
// MY COURSES & TIMETABLE
// ========================================================================
function renderMyStatus() {
  const student = portal.currentUser;
  const courseStatus = portal.getStudentCourseStatus(student.rollNo);

  let html = `
    <div class="mystatus-section">
      <h2>My Courses</h2>

      <div class="courses-table-section">
        <h3>✅ Approved Courses (${courseStatus.approved.length})</h3>
        ${
          courseStatus.approved.length > 0
            ? `
          <table class="courses-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Credits</th>
                <th>Schedule</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${courseStatus.approved
                .map(
                  course => `
                <tr>
                  <td><strong>${course.code}</strong></td>
                  <td>${course.name}</td>
                  <td>${course.credits}</td>
                  <td>${course.schedule.day} ${course.schedule.time}</td>
                  <td>
                    <button class="action-btn drop-btn" onclick="dropCourse('${course.id}')">
                      Drop
                    </button>
                    <button class="action-btn print-btn" onclick="printSlip()">
                      Print
                    </button>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        `
            : '<p class="no-data">No approved courses</p>'
        }
      </div>

      <div class="courses-table-section">
        <h3>⏳ Waitlisted Courses (${courseStatus.waitlisted.length})</h3>
        ${
          courseStatus.waitlisted.length > 0
            ? `
          <table class="courses-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              ${courseStatus.waitlisted
                .map(
                  course => `
                <tr>
                  <td><strong>${course.code}</strong></td>
                  <td>${course.name}</td>
                  <td>#${course.position}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        `
            : '<p class="no-data">No waitlisted courses</p>'
        }
      </div>

      <div class="courses-table-section">
        <h3>⏳ Pending Approval (${courseStatus.pending.length})</h3>
        ${
          courseStatus.pending.length > 0
            ? `
          <table class="courses-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${courseStatus.pending
                .map(
                  course => `
                <tr>
                  <td><strong>${course.code}</strong></td>
                  <td>${course.name}</td>
                  <td><span class="badge pending">Pending</span></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        `
            : '<p class="no-data">No pending requests</p>'
        }
      </div>
    </div>
  `;

  document.getElementById('studentContent').innerHTML = html;
}

function renderMyTimetable() {
  const student = portal.currentUser;
  const courseStatus = portal.getStudentCourseStatus(student.rollNo);
  const approved = courseStatus.approved;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  let html = `
    <div class="timetable-section">
      <h2>My Weekly Timetable</h2>
      ${
        approved.length > 0
          ? `
        <div class="timetable">
          <table class="timetable-grid">
            <thead>
              <tr>
                <th>Time</th>
                ${days.map(d => `<th>${d}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${times
                .map(
                  time => `
                <tr>
                  <td class="time-slot"><strong>${time}</strong></td>
                  ${days
                    .map(day => {
                      const course = approved.find(c => 
                        c.schedule.day.includes(day) && c.schedule.time === time
                      );
                      return `
                        <td class="timetable-cell ${course ? 'occupied' : ''}">
                          ${
                            course
                              ? `
                              <div class="timetable-course">
                                <strong>${course.code}</strong>
                                <br>
                                ${course.name.substring(0, 20)}...
                              </div>
                            `
                              : ''
                          }
                        </td>
                      `;
                    })
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 20px;">
          <h3>Enrolled Courses</h3>
          ${approved
            .map(
              course => `
            <div class="timetable-course-info">
              <strong>${course.code}:</strong> ${course.name} | ${course.schedule.day} ${course.schedule.time}
            </div>
          `
            )
            .join('')}
        </div>
      `
          : '<p class="no-data">No approved courses. Your timetable will appear here once courses are approved.</p>'
      }
    </div>
  `;

  document.getElementById('studentContent').innerHTML = html;
}

function dropCourse(courseId) {
  if (confirm('Drop this course?')) {
    const result = portal.dropCourse(portal.currentUser.rollNo, courseId);
    if (result.success) {
      showToast('✅ Course dropped successfully!', 'success');
      portal.saveToStorage();
      renderMyStatus();
    } else {
      showToast('❌ Failed to drop course', 'error');
    }
  }
}

function printSlip() {
  const student = portal.currentUser;
  const courseStatus = portal.getStudentCourseStatus(student.rollNo);

  let html = `
    <div class="slip-content">
      <h2>Registration Slip</h2>
      <p><strong>Name:</strong> ${student.name}</p>
      <p><strong>Roll No:</strong> ${student.rollNo}</p>
      <p><strong>Department:</strong> ${student.department}</p>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>

      <h3>Enrolled Courses</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="border-bottom: 2px solid #ccc;">
            <th style="text-align: left; padding: 8px;">Code</th>
            <th style="text-align: left; padding: 8px;">Name</th>
            <th style="text-align: left; padding: 8px;">Credits</th>
          </tr>
        </thead>
        <tbody>
          ${courseStatus.approved
            .map(
              c => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px;">${c.code}</td>
              <td style="padding: 8px;">${c.name}</td>
              <td style="padding: 8px;">${c.credits}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <p style="margin-top: 15px;">
        <strong>Total Credits:</strong> ${courseStatus.approved.reduce((sum, c) => sum + c.credits, 0)}/20
      </p>
      <p><strong>Fee Status:</strong> ${student.feeCleared ? '✅ Cleared' : '❌ Pending'}</p>

      <p style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 12px; color: #666;">
        This is your official registration slip. Please keep it for your records.
      </p>
    </div>
  `;

  document.getElementById('slipBody').innerHTML = html;
  document.getElementById('slipModal').classList.add('active');
}

function closeSlipModal() {
  document.getElementById('slipModal').classList.remove('active');
}

// ========================================================================
// NOTIFICATIONS
// ========================================================================
function toggleNotifications() {
  const panel = document.getElementById('notificationPanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  if (panel.style.display === 'block') {
    renderNotifications();
  }
}

function renderNotifications() {
  const notifs = portal.getNotifications(portal.currentUser.rollNo);

  let html = '';
  if (notifs.length === 0) {
    html = '<p class="no-data">No notifications</p>';
  } else {
    notifs.forEach(notif => {
      html += `
        <div class="notification-item ${notif.read ? 'read' : 'unread'}">
          <p>${notif.message}</p>
          <small>${notif.timestamp}</small>
        </div>
      `;
    });
  }

  document.getElementById('notificationsList').innerHTML = html;
}

function updateNotificationBadge() {
  const count = portal.getUnreadCount(portal.currentUser.rollNo);
  const badge = document.getElementById('notificationBadge');
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

function markAllNotificationsRead() {
  portal.markAllNotificationsRead(portal.currentUser.rollNo);
  portal.saveToStorage();
  updateNotificationBadge();
  renderNotifications();
  showToast('✅ All notifications marked as read', 'success');
}

// ========================================================================
// ADMIN PORTAL
// ========================================================================
function loadAdminPortal() {
  document.getElementById('adminPortal').style.display = 'grid';
}

function navigateAdmin(page) {
  document.querySelectorAll('.admin-portal .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  const titles = {
    dashboard: '📊 Dashboard',
    approvals: '✅ Pending Approvals',
    courses: '📚 Manage Courses',
    students: '👥 Students',
    notices: '📢 Notices',
  };

  document.getElementById('adminPageTitle').textContent = titles[page] || 'Page';

  switch (page) {
    case 'dashboard':
      renderAdminDashboard();
      break;
    case 'approvals':
      renderApprovals();
      break;
    case 'courses':
      renderManageCourses();
      break;
    case 'students':
      renderStudents();
      break;
    case 'notices':
      renderAdminNotices();
      break;
  }
}

// ========================================================================
// ADMIN DASHBOARD
// ========================================================================
function renderAdminDashboard() {
  const dashboard = portal.getAdminDashboard();
  const activityLog = portal.getActivityLog(10);

  let html = `
    <div class="admin-dashboard">
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon">✅</div>
          <div class="kpi-content">
            <div class="kpi-value">${dashboard.pendingCount}</div>
            <div class="kpi-label">Pending Approvals</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">📚</div>
          <div class="kpi-content">
            <div class="kpi-value">${dashboard.totalCourses}</div>
            <div class="kpi-label">Total Courses</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">👥</div>
          <div class="kpi-content">
            <div class="kpi-value">${dashboard.totalEnrolled}</div>
            <div class="kpi-label">Enrolled Students</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">⏳</div>
          <div class="kpi-content">
            <div class="kpi-value">${dashboard.totalWaitlisted}</div>
            <div class="kpi-label">Waitlisted</div>
          </div>
        </div>
      </div>

      <div class="activity-section">
        <h3>Recent Activity</h3>
        <div class="activity-log">
          ${activityLog
            .map(
              activity => `
            <div class="activity-item">
              <span class="activity-time">${activity.timestamp}</span>
              <span class="activity-msg">${activity.message}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('adminContent').innerHTML = html;
}

// ========================================================================
// ADMIN APPROVALS
// ========================================================================
function renderApprovals() {
  const pending = portal.getPendingApprovals();

  let html = `
    <div class="approvals-section">
      <h2>Pending Course Requests (${pending.length})</h2>
      ${
        pending.length > 0
          ? `
        <table class="approvals-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll No</th>
              <th>Course</th>
              <th>Requested</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${pending
              .map(
                req => `
              <tr>
                <td>${req.studentName}</td>
                <td>${req.studentId}</td>
                <td>${req.courseName}</td>
                <td>${req.requestDate}</td>
                <td>
                  <button class="approve-btn" onclick="approveRequest('${req.id}')">Approve</button>
                  <button class="reject-btn" onclick="rejectRequest('${req.id}')">Reject</button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
          : '<p class="no-data">No pending requests</p>'
      }
    </div>
  `;

  document.getElementById('adminContent').innerHTML = html;
}

function approveRequest(requestId) {
  const result = portal.approveCourseRequest(requestId);
  if (result.success) {
    showToast('✅ Request approved!', 'success');
    portal.saveToStorage();
    renderApprovals();
    renderAdminDashboard();
  }
}

function rejectRequest(requestId) {
  const result = portal.rejectCourseRequest(requestId);
  if (result.success) {
    showToast('✅ Request rejected', 'success');
    portal.saveToStorage();
    renderApprovals();
    renderAdminDashboard();
  }
}

// Continue in next part...
// Will add: renderManageCourses, renderStudents, renderAdminNotices, undoLastAction, resetDemoData, showToast

// ========================================================================
// ADMIN MANAGE COURSES
// ========================================================================
function renderManageCourses() {
  const courses = portal.getAllCourses();

  let html = `
    <div class="manage-courses-section">
      <div class="add-course-form">
        <h3>Add New Course</h3>
        <div class="form-group">
          <input type="text" id="courseCode" placeholder="Course Code" class="form-input">
          <input type="text" id="courseName" placeholder="Course Name" class="form-input">
          <select id="courseDept" class="form-input">
            <option value="">Select Department</option>
            <option value="CS">Computer Science</option>
            <option value="IT">Information Technology</option>
            <option value="MGMT">Management</option>
          </select>
          <input type="number" id="courseCredits" placeholder="Credits" class="form-input" min="1" max="8">
          <input type="number" id="courseSeats" placeholder="Total Seats" class="form-input" min="1">
          <input type="text" id="courseInstructor" placeholder="Instructor" class="form-input">
          <input type="text" id="courseDays" placeholder="Days (e.g., Mon,Wed)" class="form-input">
          <input type="time" id="courseTime" class="form-input">
          <button onclick="addCourseForm()" class="submit-btn">Add Course</button>
        </div>
      </div>

      <h3>Courses</h3>
      <table class="courses-management-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Dept</th>
            <th>Schedule</th>
            <th>Enrolled/Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${courses
            .map(course => {
              const enrolledList = portal.enrollments.get(course.id);
              const enrolled = enrolledList.getSize();
              return `
            <tr>
              <td><strong>${course.code}</strong></td>
              <td>${course.name}</td>
              <td>${course.department}</td>
              <td>${course.schedule.day} ${course.schedule.time}</td>
              <td>${enrolled}/${course.totalSeats}</td>
              <td>
                <button class="view-btn" onclick="viewCourseRoster('${course.id}')">View</button>
                <button class="export-btn" onclick="exportRoster('${course.id}')">CSV</button>
                <button class="delete-btn" onclick="deleteCourseForm('${course.id}')">Delete</button>
              </td>
            </tr>
          `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('adminContent').innerHTML = html;
}

function addCourseForm() {
  const code = document.getElementById('courseCode').value;
  const name = document.getElementById('courseName').value;
  const dept = document.getElementById('courseDept').value;
  const credits = parseInt(document.getElementById('courseCredits').value);
  const seats = parseInt(document.getElementById('courseSeats').value);
  const instructor = document.getElementById('courseInstructor').value;
  const days = document.getElementById('courseDays').value;
  const time = document.getElementById('courseTime').value;

  if (!code || !name || !dept || !credits || !seats || !instructor || !days || !time) {
    showToast('❌ Please fill all fields', 'error');
    return;
  }

  portal.addCourse({
    id: code,
    code,
    name,
    department: dept,
    credits,
    totalSeats: seats,
    instructor,
    schedule: { day: days, time },
    description: 'Course description',
    syllabus: {
      topics: [],
      prerequisites: 'None',
      faculty: instructor,
      textbooks: 'TBD'
    }
  });

  showToast('✅ Course added successfully!', 'success');
  portal.saveToStorage();
  renderManageCourses();

  document.getElementById('courseCode').value = '';
  document.getElementById('courseName').value = '';
  document.getElementById('courseDept').value = '';
  document.getElementById('courseCredits').value = '';
  document.getElementById('courseSeats').value = '';
  document.getElementById('courseInstructor').value = '';
  document.getElementById('courseDays').value = '';
  document.getElementById('courseTime').value = '';
}

function deleteCourseForm(courseId) {
  if (confirm('Delete this course?')) {
    portal.deleteCourse(courseId);
    showToast('✅ Course deleted', 'success');
    portal.saveToStorage();
    renderManageCourses();
  }
}

function viewCourseRoster(courseId) {
  const roster = portal.getCourseRoster(courseId);

  let html = `
    <div class="roster-modal">
      <h3>${roster.course.code} - ${roster.course.name}</h3>

      <div class="roster-section">
        <h4>Enrolled Students (${roster.enrolled.length})</h4>
        ${
          roster.enrolled.length > 0
            ? `
          <ul class="roster-list">
            ${roster.enrolled
              .map(e => `<li>${e.studentName} (${e.studentId})</li>`)
              .join('')}
          </ul>
        `
            : '<p>No enrolled students</p>'
        }
      </div>

      <div class="roster-section">
        <h4>Waitlist (${roster.waitlist.length})</h4>
        ${
          roster.waitlist.length > 0
            ? `
          <ol class="roster-list">
            ${roster.waitlist
              .map(w => `<li>${w.studentName} (${w.studentId})</li>`)
              .join('')}
          </ol>
        `
            : '<p>No waitlisted students</p>'
        }
      </div>

      <button onclick="renderManageCourses()" class="close-btn">Close</button>
    </div>
  `;

  document.getElementById('adminContent').innerHTML = html;
}

function exportRoster(courseId) {
  const csv = portal.exportRosterCSV(courseId);
  const course = portal.getCourseById(courseId);
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', `${course.code}_roster_${new Date().getTime()}.csv`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  
  showToast('✅ Roster exported as CSV', 'success');
}

// ========================================================================
// ADMIN STUDENTS
// ========================================================================
function renderStudents() {
  const students = portal.getAllStudents();

  let html = `
    <div class="students-section">
      <table class="students-table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Fee Status</th>
            <th>Credits</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${students
            .map(
              student => `
            <tr>
              <td><strong>${student.rollNo}</strong></td>
              <td>${student.name}</td>
              <td>${student.department}</td>
              <td>
                <span class="badge ${student.feeCleared ? 'cleared' : 'pending'}">
                  ${student.feeCleared ? '✅ Cleared' : '❌ Pending'}
                </span>
              </td>
              <td>${student.creditsEnrolled}/20</td>
              <td>
                <button class="toggle-btn" onclick="toggleFeeStatus('${student.rollNo}')">
                  Toggle Fee
                </button>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('adminContent').innerHTML = html;
}

function toggleFeeStatus(studentId) {
  portal.toggleFeeStatus(studentId);
  showToast('✅ Fee status updated', 'success');
  portal.saveToStorage();
  renderStudents();
}

// ========================================================================
// ADMIN NOTICES
// ========================================================================
function renderAdminNotices() {
  const notices = portal.getNotices(100);

  let html = `
    <div class="notices-section full">
      <h2>Campus Notices</h2>
      
      <div class="add-notice-form">
        <h3>Post New Notice</h3>
        <input type="text" id="noticeTitle" placeholder="Title" class="notice-input">
        <textarea id="noticeMsg" placeholder="Message" class="notice-input"></textarea>
        <button onclick="addNotice()" class="submit-btn">Post Notice</button>
      </div>

      <h3 style="margin-top: 30px;">Existing Notices</h3>
      ${
        notices.length > 0
          ? notices
              .map(
                notice => `
            <div class="notice-card large">
              <div class="notice-header">
                <h4>${notice.title}</h4>
                <button class="delete-btn" onclick="deleteNotice('${notice.id}')">🗑️</button>
              </div>
              <p>${notice.message}</p>
              <small>${notice.date}</small>
            </div>
          `
              )
              .join('')
          : '<p>No notices</p>'
      }
    </div>
  `;

  document.getElementById('adminContent').innerHTML = html;
}

function addNotice() {
  const title = document.getElementById('noticeTitle').value;
  const msg = document.getElementById('noticeMsg').value;

  if (!title || !msg) {
    showToast('❌ Please fill all fields', 'error');
    return;
  }

  portal.addNotice(title, msg);
  showToast('✅ Notice posted!', 'success');
  portal.saveToStorage();

  document.getElementById('noticeTitle').value = '';
  document.getElementById('noticeMsg').value = '';
  renderAdminNotices();
}

function deleteNotice(noticeId) {
  if (confirm('Delete this notice?')) {
    portal.deleteNotice(noticeId);
    showToast('✅ Notice deleted', 'success');
    portal.saveToStorage();
    renderAdminNotices();
  }
}

// ========================================================================
// UTILITIES
// ========================================================================
function undoLastAction() {
  const result = portal.undoLastAction();
  if (result.success) {
    showToast('↩️ Action undone', 'success');
    portal.saveToStorage();
    if (portal.currentRole === 'student') {
      navigateStudent('dashboard');
    } else {
      navigateAdmin('dashboard');
    }
  } else {
    showToast('❌ No actions to undo', 'error');
  }
}

function resetDemoData() {
  if (confirm('Reset all demo data? This cannot be undone.')) {
    portal.resetData();
    showToast('✅ Demo data reset', 'success');
    location.reload();
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.getElementById('toastContainer').appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========================================================================
// INITIALIZATION
// ========================================================================
console.log('UI.js loaded');
console.log('Portal object:', typeof portal);

if (!portal) {
  console.error('CRITICAL: portal object not initialized!');
} else {
  console.log('Portal initialized successfully');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  showLoginPage(true);
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});
