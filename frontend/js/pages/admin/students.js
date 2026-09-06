/**
 * HostelBuddy — Admin Students Page
 * View and manage all students
 */

const AdminStudents = {
  filteredData: [],
  searchTerm: '',
  filterHostel: 'all',

  _loadFromStore() {
    if (typeof Store === 'undefined') return [];
    const students = Store.getAll('students');
    const beds = Store.getAll('beds');
    const rooms = Store.getAll('rooms');
    const hostels = Store.getAll('hostels');
    return students.map(s => {
      const bed = beds.find(b => b.studentId === s.id && b.status === 'occupied');
      let hostelName = '', roomInfo = '-';
      if (bed) {
        const room = rooms.find(r => r.id === bed.roomId);
        if (room) {
          const hostel = hostels.find(h => h.id === room.hostelId);
          hostelName = hostel ? hostel.name : '';
          roomInfo = 'Block ' + room.block + ', Room ' + room.number;
        }
      }
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        dept: s.dept,
        year: s.year,
        hostel: hostelName,
        room: roomInfo,
        status: 'active',
        joined: s.joined,
      };
    });
  },

  render() {
    this.data = this._loadFromStore();
    this.filteredData = [...this.data];
    return `
      <div class="page-header">
        <div>
          <h2 class="page-title">Students</h2>
          <p class="page-subtitle">Manage all registered students</p>
        </div>
      </div>

      <div class="students-stats bento-grid">
        <div class="bento-card spotlight-card">
          <div class="bento-icon" style="background: var(--primary-light); color: var(--primary);">
            ${icons.users}
          </div>
          <div class="bento-content">
            <span class="bento-value">${this.data.length}</span>
            <span class="bento-label">Total Students</span>
          </div>
        </div>
        <div class="bento-card spotlight-card">
          <div class="bento-icon" style="background: var(--success-light); color: var(--success);">
            ${icons.check}
          </div>
          <div class="bento-content">
            <span class="bento-value">${this.data.filter(s => s.status === 'active').length}</span>
            <span class="bento-label">Active</span>
          </div>
        </div>
        <div class="bento-card spotlight-card">
          <div class="bento-icon" style="background: var(--danger-light); color: var(--danger);">
            ${icons.x}
          </div>
          <div class="bento-content">
            <span class="bento-value">${this.data.filter(s => s.status === 'inactive').length}</span>
            <span class="bento-label">Inactive</span>
          </div>
        </div>
        <div class="bento-card spotlight-card">
          <div class="bento-icon" style="background: var(--info-light); color: var(--info);">
            ${icons.building}
          </div>
          <div class="bento-content">
            <span class="bento-value">${this.data.filter(s => s.hostel.includes('Boys')).length}</span>
            <span class="bento-label">Boys Hostel</span>
          </div>
        </div>
      </div>

      <div class="filter-bar">
        <div class="filter-tabs">
          <button class="filter-tab active" onclick="AdminStudents.filterByHostel('all')">All</button>
          <button class="filter-tab" onclick="AdminStudents.filterByHostel('boys')">Boys Hostel</button>
          <button class="filter-tab" onclick="AdminStudents.filterByHostel('girls')">Girls Hostel</button>
        </div>
        <div class="search-box">
          <span class="search-icon">${icons.search || ''}</span>
          <input type="text" placeholder="Search students..." class="search-input" oninput="AdminStudents.search(this.value)">
        </div>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Department</th>
              <th>Year</th>
              <th>Hostel</th>
              <th>Room</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="studentsTableBody">
            ${this.renderRows()}
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <span class="text-secondary" id="studentCount">${this.filteredData.length} students found</span>
      </div>
    `;
  },

  renderRows() {
    if (this.filteredData.length === 0) {
      return `<tr><td colspan="7" class="empty-state"><div class="empty-icon">${icons.users}</div><p>No students found</p></td></tr>`;
    }
    return this.filteredData.map(student => {
      const initials = Utils.getInitials(student.name);
      const statusClass = student.status === 'active' ? 'badge-success' : 'badge-danger';
      return `
        <tr>
          <td>
            <div class="student-cell">
              <div class="avatar avatar-sm">${initials}</div>
              <div>
                <div class="student-name">${Utils.sanitize(student.name)}</div>
                <div class="text-secondary text-sm">${Utils.sanitize(student.email)}</div>
              </div>
            </div>
          </td>
          <td>${Utils.sanitize(student.dept)}</td>
          <td>${student.year}</td>
          <td>${Utils.sanitize(student.hostel)}</td>
          <td>${Utils.sanitize(student.room)}</td>
          <td><span class="badge ${statusClass}">${Utils.capitalize(student.status)}</span></td>
          <td>
            <button class="btn btn-sm btn-ghost" onclick="AdminStudents.viewStudent(${student.id})" title="View">
              ${icons.eye}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  search(term) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  },

  filterByHostel(hostel) {
    this.filterHostel = hostel;
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    this.applyFilters();
  },

  applyFilters() {
    this.filteredData = this.data.filter(student => {
      const matchesSearch = !this.searchTerm ||
        student.name.toLowerCase().includes(this.searchTerm) ||
        student.email.toLowerCase().includes(this.searchTerm) ||
        student.dept.toLowerCase().includes(this.searchTerm);
      const matchesHostel = this.filterHostel === 'all' ||
        (this.filterHostel === 'boys' && student.hostel.includes('Boys')) ||
        (this.filterHostel === 'girls' && student.hostel.includes('Girls'));
      return matchesSearch && matchesHostel;
    });

    const tbody = document.getElementById('studentsTableBody');
    if (tbody) tbody.innerHTML = this.renderRows();
    const count = document.getElementById('studentCount');
    if (count) count.textContent = this.filteredData.length + ' students found';
  },

  viewStudent(id) {
    const student = this.data.find(s => s.id === id);
    if (!student) return;
    const initials = Utils.getInitials(student.name);
    openModal('Student Details', `
      <div class="student-detail">
        <div class="student-detail-header">
          <div class="avatar avatar-lg">${initials}</div>
          <div>
            <h3>${Utils.sanitize(student.name)}</h3>
            <p class="text-secondary">${Utils.sanitize(student.email)}</p>
            <span class="badge ${student.status === 'active' ? 'badge-success' : 'badge-danger'}">${Utils.capitalize(student.status)}</span>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Phone</span><span>${Utils.sanitize(student.phone)}</span></div>
          <div class="detail-item"><span class="detail-label">Department</span><span>${Utils.sanitize(student.dept)}</span></div>
          <div class="detail-item"><span class="detail-label">Year</span><span>${student.year}</span></div>
          <div class="detail-item"><span class="detail-label">Hostel</span><span>${Utils.sanitize(student.hostel)}</span></div>
          <div class="detail-item"><span class="detail-label">Room</span><span>${Utils.sanitize(student.room)}</span></div>
          <div class="detail-item"><span class="detail-label">Joined</span><span>${Utils.formatDate(student.joined)}</span></div>
        </div>
      </div>
    `);
  },

  init() {
    // Initialize spotlight effects
    document.querySelectorAll('.spotlight-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }
};

window.AdminStudents = AdminStudents;
