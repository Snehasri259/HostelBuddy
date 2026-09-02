/**
 * HostelBuddy Admin Complaints Management Page
 * View, filter, and manage all complaints
 */

const AdminComplaints = {
  currentFilter: 'all',
  searchQuery: '',
  complaints: [
    { id: 1, student: 'Ravi Kumar', title: 'Broken ceiling fan', category: 'Maintenance', priority: 'medium', status: 'in_progress', date: new Date(Date.now() - 172800000), updated: new Date(Date.now() - 86400000) },
    { id: 2, student: 'Priya Singh', title: 'Water leakage in bathroom', category: 'Maintenance', priority: 'high', status: 'open', date: new Date(Date.now() - 43200000), updated: new Date(Date.now() - 43200000) },
    { id: 3, student: 'Amit Patel', title: 'Noise disturbance at night', category: 'Noise', priority: 'low', status: 'resolved', date: new Date(Date.now() - 604800000), updated: new Date(Date.now() - 518400000) },
    { id: 4, student: 'Neha Gupta', title: 'Dirty common area', category: 'Cleanliness', priority: 'medium', status: 'open', date: new Date(Date.now() - 259200000), updated: new Date(Date.now() - 259200000) },
    { id: 5, student: 'Vikram Reddy', title: 'Broken window lock', category: 'Maintenance', priority: 'low', status: 'resolved', date: new Date(Date.now() - 864000000), updated: new Date(Date.now() - 691200000) },
    { id: 6, student: 'Sneha Joshi', title: 'Security concern', category: 'Security', priority: 'high', status: 'open', date: new Date(Date.now() - 172800000), updated: new Date(Date.now() - 172800000) },
  ],

  render() {
    const filtered = this.getFiltered();
    const counts = this.getCounts();

    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.complaint || ''}
          Complaints Management
        </h2>
      </div>
      
      <div class="stats-row fade-in stagger-1" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
        <div class="stat-mini"><div class="stat-mini-label">Total</div><div class="stat-mini-value">${counts.all}</div></div>
        <div class="stat-mini stat-mini--warning"><div class="stat-mini-label">Open</div><div class="stat-mini-value">${counts.open}</div></div>
        <div class="stat-mini" style="border-left:3px solid var(--info)"><div class="stat-mini-label">In Progress</div><div class="stat-mini-value">${counts.in_progress}</div></div>
        <div class="stat-mini stat-mini--success"><div class="stat-mini-label">Resolved</div><div class="stat-mini-value">${counts.resolved}</div></div>
      </div>
      
      <div class="filter-tabs fade-in stagger-2" style="margin-bottom:16px">
        ${['all', 'open', 'in_progress', 'resolved'].map(f => `
          <button class="filter-tab ${this.currentFilter === f ? 'active' : ''}" onclick="AdminComplaints.filter('${f}')">
            ${f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : Utils.capitalize(f)}
          </button>
        `).join('')}
      </div>
      
      <div class="data-table fade-in stagger-3" style="padding:0;overflow:hidden">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((c, i) => `
                <tr class="fade-in stagger-${Math.min(i + 1, 6)}">
                  <td style="font-family:'JetBrains Mono',monospace;font-size:0.8rem">#${c.id}</td>
                  <td style="font-weight:500">${Utils.sanitize(c.student)}</td>
                  <td><span class="badge badge-${c.category === 'Maintenance' ? 'warning' : c.category === 'Security' ? 'danger' : 'info'}">${Utils.sanitize(c.category)}</span></td>
                  <td><span class="badge badge-${c.priority === 'high' ? 'danger' : c.priority === 'medium' ? 'warning' : 'success'}">${Utils.capitalize(c.priority)}</span></td>
                  <td><span class="badge ${Utils.getStatusColor(c.status)}">${c.status === 'in_progress' ? 'In Progress' : Utils.capitalize(c.status)}</span></td>
                  <td style="font-size:0.85rem">${Utils.formatDate(c.date)}</td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 10px;font-size:0.75rem" onclick="AdminComplaints.updateStatus(${c.id})">
                        ${icons.edit || ''}
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      ${this.renderUpdateModal()}
    `;
  },

  getFiltered() {
    let result = this.complaints;
    if (this.currentFilter !== 'all') result = result.filter(c => c.status === this.currentFilter);
    if (this.searchQuery) {
      result = result.filter(c => c.student.toLowerCase().includes(this.searchQuery) || c.title.toLowerCase().includes(this.searchQuery));
    }
    return result;
  },

  getCounts() {
    return {
      all: this.complaints.length,
      open: this.complaints.filter(c => c.status === 'open').length,
      in_progress: this.complaints.filter(c => c.status === 'in_progress').length,
      resolved: this.complaints.filter(c => c.status === 'resolved').length,
    };
  },

  filter(status) {
    this.currentFilter = status;
    this.refresh();
  },

  renderUpdateModal() {
    return `
      <div class="modal-overlay hidden" id="updateStatusModal">
        <div class="modal" style="max-width:400px">
          <div class="modal-header">
            <h3>Update Status</h3>
            <button class="modal-close" onclick="document.getElementById('updateStatusModal').classList.add('hidden')">&times;</button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="updateComplaintId">
            <div class="form-group">
              <label class="form-label">New Status</label>
              <select class="form-select" id="newStatus">
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border)">
              <button class="btn-secondary" onclick="document.getElementById('updateStatusModal').classList.add('hidden')">Cancel</button>
              <button class="quick-action-btn quick-action-btn--primary" onclick="AdminComplaints.saveStatus()">
                ${icons.check || ''} Save
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updateStatus(id) {
    const complaint = this.complaints.find(c => c.id === id);
    if (!complaint) return;
    document.getElementById('updateComplaintId').value = id;
    document.getElementById('newStatus').value = complaint.status;
    document.getElementById('updateStatusModal').classList.remove('hidden');
  },

  saveStatus() {
    const id = parseInt(document.getElementById('updateComplaintId').value);
    const status = document.getElementById('newStatus').value;
    const complaint = this.complaints.find(c => c.id === id);
    if (complaint) {
      complaint.status = status;
      complaint.updated = new Date();
    }
    document.getElementById('updateStatusModal').classList.add('hidden');
    this.refresh();
    showToast('Status updated successfully', 'success');
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() {
    console.log('[HostelBuddy] Admin Complaints initialized');
  },
};

window.AdminComplaints = AdminComplaints;
