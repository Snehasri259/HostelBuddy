/**
 * HostelBuddy Admin Visitors Management Page
 * Approve, reject, and manage visitor entries
 */

const AdminVisitors = {
  currentFilter: 'all',
  visitors: [
    { id: 1, name: 'Rajesh Kumar', student: 'Ravi Kumar', relation: 'Parent', date: new Date(Date.now() + 86400000), time: '14:00', purpose: 'Family visit', status: 'approved' },
    { id: 2, name: 'Sunita Devi', student: 'Ravi Kumar', relation: 'Parent', date: new Date(Date.now() - 86400000), time: '10:00', purpose: 'Bring medicines', status: 'completed' },
    { id: 3, name: 'Amit Verma', student: 'Priya Singh', relation: 'Friend', date: new Date(Date.now() - 259200000), time: '15:00', purpose: 'Study group', status: 'completed' },
    { id: 4, name: 'Priya Sharma', student: 'Neha Gupta', relation: 'Sibling', date: new Date(Date.now() + 172800000), time: '11:00', purpose: 'Personal', status: 'pending' },
    { id: 5, name: 'Vikram Singh', student: 'Amit Patel', relation: 'Friend', date: new Date(Date.now() - 432000000), time: '16:00', purpose: 'Project work', status: 'rejected' },
    { id: 6, name: 'Meera Iyer', student: 'Sneha Joshi', relation: 'Parent', date: new Date(Date.now()), time: '09:00', purpose: 'Meet warden', status: 'completed' },
  ],

  render() {
    const filtered = this.getFiltered();
    const counts = this.getCounts();
    const today = new Date().toDateString();

    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.visitor || ''}
          Visitor Management
        </h2>
      </div>
      
      <div class="stats-row fade-in stagger-1" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
        <div class="stat-mini stat-mini--success"><div class="stat-mini-label">Today's Visitors</div><div class="stat-mini-value">${this.visitors.filter(v => new Date(v.date).toDateString() === today && v.status === 'completed').length}</div></div>
        <div class="stat-mini stat-mini--warning"><div class="stat-mini-label">Pending Approval</div><div class="stat-mini-value">${counts.pending}</div></div>
        <div class="stat-mini"><div class="stat-mini-label">This Week</div><div class="stat-mini-value">${this.visitors.filter(v => (Date.now() - new Date(v.date).getTime()) < 604800000).length}</div></div>
      </div>
      
      <div class="filter-tabs fade-in stagger-2" style="margin-bottom:16px">
        ${['all', 'pending', 'approved', 'completed', 'rejected'].map(f => `
          <button class="filter-tab ${this.currentFilter === f ? 'active' : ''}" onclick="AdminVisitors.filter('${f}')">
            ${f === 'all' ? 'All' : Utils.capitalize(f)}
          </button>
        `).join('')}
      </div>
      
      <div class="data-table fade-in stagger-3" style="padding:0;overflow:hidden">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Student</th>
                <th>Relation</th>
                <th>Date & Time</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((v, i) => `
                <tr class="fade-in stagger-${Math.min(i + 1, 6)}">
                  <td style="font-weight:500">${Utils.sanitize(v.name)}</td>
                  <td>${Utils.sanitize(v.student)}</td>
                  <td>${Utils.sanitize(v.relation)}</td>
                  <td style="font-size:0.85rem">${Utils.formatDate(v.date)} ${v.time}</td>
                  <td style="font-size:0.85rem">${Utils.sanitize(v.purpose)}</td>
                  <td><span class="badge ${Utils.getStatusColor(v.status)}">${Utils.capitalize(v.status)}</span></td>
                  <td>
                    <div style="display:flex;gap:6px">
                      ${v.status === 'pending' ? `
                        <button class="btn-sm quick-action-btn quick-action-btn--primary" style="padding:6px 10px;font-size:0.75rem" onclick="AdminVisitors.approve(${v.id})">
                          ${icons.check || ''}
                        </button>
                        <button class="btn-sm quick-action-btn quick-action-btn--danger" style="padding:6px 10px;font-size:0.75rem" onclick="AdminVisitors.reject(${v.id})">
                          ${icons.x || ''}
                        </button>
                      ` : v.status === 'approved' ? `
                        <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 10px;font-size:0.75rem" onclick="AdminVisitors.markComplete(${v.id})">
                          Complete
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getFiltered() {
    if (this.currentFilter === 'all') return this.visitors;
    return this.visitors.filter(v => v.status === this.currentFilter);
  },

  getCounts() {
    return {
      all: this.visitors.length,
      pending: this.visitors.filter(v => v.status === 'pending').length,
      approved: this.visitors.filter(v => v.status === 'approved').length,
      completed: this.visitors.filter(v => v.status === 'completed').length,
      rejected: this.visitors.filter(v => v.status === 'rejected').length,
    };
  },

  filter(status) {
    this.currentFilter = status;
    this.refresh();
  },

  approve(id) {
    const visitor = this.visitors.find(v => v.id === id);
    if (visitor) { visitor.status = 'approved'; this.refresh(); showToast('Visitor approved', 'success'); }
  },

  reject(id) {
    const visitor = this.visitors.find(v => v.id === id);
    if (visitor) { visitor.status = 'rejected'; this.refresh(); showToast('Visitor rejected', 'info'); }
  },

  markComplete(id) {
    const visitor = this.visitors.find(v => v.id === id);
    if (visitor) { visitor.status = 'completed'; this.refresh(); showToast('Visitor marked as completed', 'success'); }
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() {
    console.log('[HostelBuddy] Admin Visitors initialized');
  },
};

window.AdminVisitors = AdminVisitors;
