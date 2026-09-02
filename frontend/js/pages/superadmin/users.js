/**
 * HostelBuddy Super Admin User Management Page
 * View, filter, and manage all users
 */

const SuperAdminUsers = {
  currentFilter: 'all',
  searchQuery: '',
  users: [
    { id: 1, name: 'Ravi Kumar', email: 'ravi@uni.edu', role: 'student', status: 'active', joined: '2024-08-15' },
    { id: 2, name: 'Priya Singh', email: 'priya@uni.edu', role: 'student', status: 'active', joined: '2024-08-16' },
    { id: 3, name: 'Amit Patel', email: 'amit@uni.edu', role: 'student', status: 'active', joined: '2024-08-17' },
    { id: 4, name: 'Dr. Sharma', email: 'sharma@uni.edu', role: 'admin', status: 'active', joined: '2024-01-15' },
    { id: 5, name: 'Mr. Verma', email: 'verma@uni.edu', role: 'admin', status: 'active', joined: '2024-03-20' },
    { id: 6, name: 'Administrator', email: 'admin@uni.edu', role: 'superadmin', status: 'active', joined: '2023-01-01' },
    { id: 7, name: 'Neha Gupta', email: 'neha@uni.edu', role: 'student', status: 'inactive', joined: '2024-08-18' },
    { id: 8, name: 'Vikram Reddy', email: 'vikram@uni.edu', role: 'student', status: 'active', joined: '2024-08-19' },
  ],

  render() {
    const filtered = this.getFiltered();

    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.users || ''}
          User Management
        </h2>
      </div>
      
      <div class="filter-tabs fade-in stagger-1" style="margin-bottom:16px">
        ${['all', 'student', 'admin', 'superadmin'].map(f => `
          <button class="filter-tab ${this.currentFilter === f ? 'active' : ''}" onclick="SuperAdminUsers.filter('${f}')">
            ${f === 'all' ? 'All' : f === 'student' ? 'Students' : f === 'admin' ? 'Admins' : 'Super Admins'}
          </button>
        `).join('')}
      </div>
      
      <div class="filter-bar fade-in stagger-2" style="margin-bottom:16px">
        <div class="filter-group filter-group--search" style="flex:1">
          <div style="position:relative">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)">${icons.search || ''}</span>
            <input type="text" class="form-input" placeholder="Search by name or email..." style="padding-left:40px" oninput="SuperAdminUsers.search(this.value)">
          </div>
        </div>
      </div>
      
      <div class="data-table fade-in stagger-3" style="padding:0;overflow:hidden">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((u, i) => `
                <tr class="fade-in stagger-${Math.min(i + 1, 6)}">
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${Utils.getInitials(u.name)}</div>
                      <span style="font-weight:500">${Utils.sanitize(u.name)}</span>
                    </div>
                  </td>
                  <td style="font-size:0.85rem">${Utils.sanitize(u.email)}</td>
                  <td>
                    <span class="badge badge-${u.role === 'superadmin' ? 'warning' : u.role === 'admin' ? 'info' : 'success'}">
                      ${u.role === 'superadmin' ? 'Super Admin' : Utils.capitalize(u.role)}
                    </span>
                  </td>
                  <td><span class="badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}">${Utils.capitalize(u.status)}</span></td>
                  <td style="font-size:0.85rem">${Utils.formatDate(u.joined)}</td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 10px;font-size:0.75rem" onclick="SuperAdminUsers.viewUser(${u.id})">
                        ${icons.eye || ''}
                      </button>
                      <button class="btn-sm quick-action-btn quick-action-btn--danger" style="padding:6px 10px;font-size:0.75rem" onclick="SuperAdminUsers.toggleStatus(${u.id})">
                        ${icons.delete || ''}
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      ${this.renderDetailModal()}
    `;
  },

  getFiltered() {
    let result = this.users;
    if (this.currentFilter !== 'all') result = result.filter(u => u.role === this.currentFilter);
    if (this.searchQuery) {
      result = result.filter(u => u.name.toLowerCase().includes(this.searchQuery) || u.email.toLowerCase().includes(this.searchQuery));
    }
    return result;
  },

  filter(status) {
    this.currentFilter = status;
    this.refresh();
  },

  search(query) {
    this.searchQuery = query.toLowerCase();
    this.refresh();
  },

  renderDetailModal() {
    return `
      <div class="modal-overlay hidden" id="userDetailModal">
        <div class="modal" style="max-width:500px">
          <div class="modal-header">
            <h3>User Details</h3>
            <button class="modal-close" onclick="document.getElementById('userDetailModal').classList.add('hidden')">&times;</button>
          </div>
          <div class="modal-body" id="userDetailBody"></div>
        </div>
      </div>
    `;
  },

  viewUser(id) {
    const user = this.users.find(u => u.id === id);
    if (!user) return;
    const body = document.getElementById('userDetailBody');
    body.innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        <div class="avatar avatar-lg" style="margin:0 auto 12px">${Utils.getInitials(user.name)}</div>
        <h4 style="margin:0">${Utils.sanitize(user.name)}</h4>
        <p style="color:var(--text-secondary);margin:4px 0">${Utils.sanitize(user.email)}</p>
        <span class="badge badge-${user.role === 'superadmin' ? 'warning' : user.role === 'admin' ? 'info' : 'success'}">${user.role === 'superadmin' ? 'Super Admin' : Utils.capitalize(user.role)}</span>
      </div>
      <div class="profile-info-grid" style="grid-template-columns:1fr 1fr">
        <div class="profile-info-item"><div class="profile-info-label">Status</div><div class="profile-info-value">${Utils.capitalize(user.status)}</div></div>
        <div class="profile-info-item"><div class="profile-info-label">Joined</div><div class="profile-info-value">${Utils.formatDate(user.joined)}</div></div>
      </div>
    `;
    document.getElementById('userDetailModal').classList.remove('hidden');
  },

  toggleStatus(id) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active';
      this.refresh();
      showToast(`User ${user.status === 'active' ? 'activated' : 'deactivated'}`, 'info');
    }
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() { console.log('[HostelBuddy] Super Admin Users initialized'); },
};

window.SuperAdminUsers = SuperAdminUsers;
