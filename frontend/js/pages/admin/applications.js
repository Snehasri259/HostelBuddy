/**
 * HostelBuddy Admin Applications Page
 * Manage, filter, approve/reject applications
 */

const AdminApplications = {
  currentFilter: 'all',
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 8,
  selectedIds: new Set(),

  applications: [
    { id: 1, name: 'Ravi Kumar', email: 'ravi@uni.edu', phone: '9876543210', date: new Date(Date.now() - 7200000), hostel: 'boys', requirements: 'Ground floor preferred, near library', guardian: { name: 'Suresh Kumar', phone: '9876543211' }, status: 'pending' },
    { id: 2, name: 'Priya Singh', email: 'priya@uni.edu', phone: '9876543220', date: new Date(Date.now() - 86400000), hostel: 'girls', requirements: 'Near mess hall', guardian: { name: 'Raj Singh', phone: '9876543221' }, status: 'pending' },
    { id: 3, name: 'Amit Patel', email: 'amit@uni.edu', phone: '9876543230', date: new Date(Date.now() - 172800000), hostel: 'boys', requirements: 'Top floor, corner room', guardian: { name: 'Mahesh Patel', phone: '9876543231' }, status: 'approved', allocation: { block: 'B', floor: 2, room: 205, bed: 3 } },
    { id: 4, name: 'Neha Gupta', email: 'neha@uni.edu', phone: '9876543240', date: new Date(Date.now() - 259200000), hostel: 'girls', requirements: 'Any floor', guardian: { name: 'Anil Gupta', phone: '9876543241' }, status: 'approved', allocation: { block: 'D', floor: 1, room: 102, bed: 1 } },
    { id: 5, name: 'Vikram Reddy', email: 'vikram@uni.edu', phone: '9876543250', date: new Date(Date.now() - 345600000), hostel: 'boys', requirements: 'AC room if available', guardian: { name: 'Srinivas Reddy', phone: '9876543251' }, status: 'rejected', rejectReason: 'AC rooms not available in requested hostel' },
    { id: 6, name: 'Sneha Joshi', email: 'sneha@uni.edu', phone: '9876543260', date: new Date(Date.now() - 432000000), hostel: 'girls', requirements: 'Near study room', guardian: { name: 'Vinay Joshi', phone: '9876543261' }, status: 'pending' },
    { id: 7, name: 'Rahul Verma', email: 'rahul@uni.edu', phone: '9876543270', date: new Date(Date.now() - 518400000), hostel: 'boys', requirements: 'Ground floor only', guardian: { name: 'Deepak Verma', phone: '9876543271' }, status: 'approved', allocation: { block: 'A', floor: 1, room: 101, bed: 2 } },
    { id: 8, name: 'Ananya Das', email: 'ananya@uni.edu', phone: '9876543280', date: new Date(Date.now() - 604800000), hostel: 'girls', requirements: 'None', guardian: { name: 'Prakash Das', phone: '9876543281' }, status: 'rejected', rejectReason: 'Hostel full for the requested term' },
    { id: 9, name: 'Karthik Nair', email: 'karthik@uni.edu', phone: '9876543290', date: new Date(Date.now() - 691200000), hostel: 'boys', requirements: 'Near gym', guardian: { name: 'Raman Nair', phone: '9876543291' }, status: 'pending' },
    { id: 10, name: 'Meera Iyer', email: 'meera@uni.edu', phone: '9876543300', date: new Date(Date.now() - 777600000), hostel: 'girls', requirements: 'Quiet floor preferred', guardian: { name: 'Ganesh Iyer', phone: '9876543301' }, status: 'pending' },
  ],

  render() {
    const filtered = this.getFilteredApplications();
    const paginated = this.getPaginated(filtered);
    const counts = this.getCounts();

    return `
      <div class="section-header" style="margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <h2 class="section-title" style="font-size:1.5rem">Applications</h2>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          ${this.renderFilterTabs(counts)}
        </div>
      </div>
      
      <div class="filter-bar fade-in stagger-1">
        <div class="filter-group filter-group--search">
          <div style="position:relative">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)">${icons.search || ''}</span>
            <input type="text" class="form-input" placeholder="Search by name or email..." style="padding-left:40px" oninput="AdminApplications.search(this.value)" value="${Utils.sanitize(this.searchQuery)}">
          </div>
        </div>
        <div class="filter-group">
          <select class="form-select" onchange="AdminApplications.sort(this.value)" style="min-width:160px">
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>
      
      <div class="applications-count fade-in stagger-2" style="margin-bottom:12px;font-size:0.85rem;color:var(--text-secondary)">
        ${filtered.length} application${filtered.length !== 1 ? 's' : ''} found
      </div>
      
      <div class="data-table fade-in stagger-3" style="padding:0;overflow:hidden">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th style="width:40px">
                  <label class="checkbox-label" style="margin:0">
                    <input type="checkbox" onchange="AdminApplications.toggleSelectAll(this.checked)">
                    <span class="custom-checkbox" style="width:16px;height:16px"></span>
                  </label>
                </th>
                <th>Student</th>
                <th>Applied</th>
                <th>Hostel</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${paginated.length > 0 ? paginated.map((app, i) => `
                <tr class="fade-in stagger-${Math.min(i + 1, 6)} ${this.selectedIds.has(app.id) ? 'row-selected' : ''}">
                  <td>
                    <label class="checkbox-label" style="margin:0">
                      <input type="checkbox" ${this.selectedIds.has(app.id) ? 'checked' : ''} onchange="AdminApplications.toggleSelect(${app.id}, this.checked)">
                      <span class="custom-checkbox" style="width:16px;height:16px"></span>
                    </label>
                  </td>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div class="avatar" style="width:36px;height:36px;font-size:0.7rem">${Utils.getInitials(app.name)}</div>
                      <div>
                        <div style="font-weight:600">${Utils.sanitize(app.name)}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted)">${Utils.sanitize(app.email)}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-size:0.85rem">${Utils.formatDate(app.date)}</td>
                  <td style="font-size:0.85rem">${app.hostel === 'boys' ? 'Boys Hostel' : 'Girls Hostel'}</td>
                  <td>
                    <span class="badge ${Utils.getStatusColor(app.status)}">${Utils.capitalize(app.status)}</span>
                  </td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 10px;font-size:0.75rem" onclick="AdminApplications.viewApplication(${app.id})">
                        ${icons.eye || ''}
                      </button>
                      ${app.status === 'pending' ? `
                        <button class="btn-sm quick-action-btn quick-action-btn--primary" style="padding:6px 10px;font-size:0.75rem" onclick="AdminApplications.approveApplication(${app.id})">
                          ${icons.check || ''}
                        </button>
                        <button class="btn-sm quick-action-btn quick-action-btn--danger" style="padding:6px 10px;font-size:0.75rem" onclick="AdminApplications.rejectApplication(${app.id})">
                          ${icons.x || ''}
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" class="empty-state" style="padding:48px">
                    <p>No applications found</p>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
      
      ${this.renderPagination(filtered.length)}
      ${this.renderBulkActions()}
      
      ${this.renderDetailModal()}
      ${this.renderAllocationModal()}
      ${this.renderRejectModal()}
    `;
  },

  // ============================================
  // FILTER TABS
  // ============================================

  renderFilterTabs(counts) {
    const tabs = [
      { key: 'all', label: 'All', count: counts.all },
      { key: 'pending', label: 'Pending', count: counts.pending },
      { key: 'approved', label: 'Approved', count: counts.approved },
      { key: 'rejected', label: 'Rejected', count: counts.rejected },
    ];

    return tabs.map(tab => `
      <button class="filter-tab ${this.currentFilter === tab.key ? 'active' : ''}" onclick="AdminApplications.filter('${tab.key}')">
        ${tab.label}
        <span class="filter-tab-count">${tab.count}</span>
      </button>
    `).join('');
  },

  getCounts() {
    return {
      all: this.applications.length,
      pending: this.applications.filter(a => a.status === 'pending').length,
      approved: this.applications.filter(a => a.status === 'approved').length,
      rejected: this.applications.filter(a => a.status === 'rejected').length,
    };
  },

  // ============================================
  // FILTERING & SEARCH
  // ============================================

  filter(status) {
    this.currentFilter = status;
    this.currentPage = 1;
    this.refresh();
  },

  search(query) {
    this.searchQuery = query.toLowerCase();
    this.currentPage = 1;
    this.refresh();
  },

  sort(value) {
    const [field, direction] = value.split('-');
    this.applications.sort((a, b) => {
      let comparison = 0;
      if (field === 'date') {
        comparison = a.date - b.date;
      } else if (field === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return direction === 'desc' ? -comparison : comparison;
    });
    this.refresh();
  },

  getFilteredApplications() {
    return this.applications.filter(app => {
      const matchesFilter = this.currentFilter === 'all' || app.status === this.currentFilter;
      const matchesSearch = !this.searchQuery || 
        app.name.toLowerCase().includes(this.searchQuery) ||
        app.email.toLowerCase().includes(this.searchQuery);
      return matchesFilter && matchesSearch;
    });
  },

  getPaginated(filtered) {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  },

  // ============================================
  // PAGINATION
  // ============================================

  renderPagination(total) {
    const totalPages = Math.ceil(total / this.itemsPerPage);
    if (totalPages <= 1) return '';

    return `
      <div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:8px;margin-top:20px">
        <button class="btn-sm quick-action-btn quick-action-btn--secondary" ${this.currentPage === 1 ? 'disabled' : ''} onclick="AdminApplications.goToPage(${this.currentPage - 1})">
          ${icons['chevron-left'] || ''}
        </button>
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
          <button class="pagination-btn ${page === this.currentPage ? 'active' : ''}" onclick="AdminApplications.goToPage(${page})">${page}</button>
        `).join('')}
        <button class="btn-sm quick-action-btn quick-action-btn--secondary" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="AdminApplications.goToPage(${this.currentPage + 1})">
          ${icons['chevron-right'] || ''}
        </button>
      </div>
    `;
  },

  goToPage(page) {
    this.currentPage = page;
    this.refresh();
  },

  // ============================================
  // BULK ACTIONS
  // ============================================

  renderBulkActions() {
    if (this.selectedIds.size === 0) return '';

    return `
      <div class="bulk-actions" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--card);padding:12px 20px;border-radius:var(--radius-full);box-shadow:var(--shadow-lg);border:1px solid var(--border);display:flex;align-items:center;gap:12px;z-index:100;animation:slideUp 0.3s ease">
        <span style="font-size:0.875rem;font-weight:600">${this.selectedIds.size} selected</span>
        <button class="btn-sm quick-action-btn quick-action-btn--primary" style="padding:8px 16px" onclick="AdminApplications.bulkApprove()">
          ${icons.check || ''} Approve All
        </button>
        <button class="btn-sm quick-action-btn quick-action-btn--danger" style="padding:8px 16px" onclick="AdminApplications.bulkReject()">
          ${icons.x || ''} Reject All
        </button>
        <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:8px 16px" onclick="AdminApplications.clearSelection()">Clear</button>
      </div>
    `;
  },

  toggleSelectAll(checked) {
    const filtered = this.getFilteredApplications();
    if (checked) {
      filtered.forEach(app => this.selectedIds.add(app.id));
    } else {
      this.selectedIds.clear();
    }
    this.refresh();
  },

  toggleSelect(id, checked) {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
    this.refresh();
  },

  clearSelection() {
    this.selectedIds.clear();
    this.refresh();
  },

  bulkApprove() {
    this.selectedIds.forEach(id => {
      const app = this.applications.find(a => a.id === id);
      if (app && app.status === 'pending') {
        app.status = 'approved';
      }
    });
    this.selectedIds.clear();
    this.refresh();
    showToast('Selected applications approved', 'success');
  },

  bulkReject() {
    this.selectedIds.forEach(id => {
      const app = this.applications.find(a => a.id === id);
      if (app && app.status === 'pending') {
        app.status = 'rejected';
      }
    });
    this.selectedIds.clear();
    this.refresh();
    showToast('Selected applications rejected', 'info');
  },

  // ============================================
  // MODALS
  // ============================================

  renderDetailModal() {
    return `
      <div class="modal-overlay hidden" id="detailModal">
        <div class="modal" style="max-width:600px">
          <div class="modal-header">
            <h3>Application Details</h3>
            <button class="modal-close" onclick="AdminApplications.closeModal('detailModal')">&times;</button>
          </div>
          <div class="modal-body" id="detailModalBody">
            <!-- Content loaded dynamically -->
          </div>
        </div>
      </div>
    `;
  },

  renderAllocationModal() {
    return `
      <div class="modal-overlay hidden" id="allocationModal">
        <div class="modal" style="max-width:500px">
          <div class="modal-header">
            <h3>Allocate Room</h3>
            <button class="modal-close" onclick="AdminApplications.closeModal('allocationModal')">&times;</button>
          </div>
          <div class="modal-body">
            <form id="allocationForm" onsubmit="AdminApplications.submitAllocation(event)">
              <input type="hidden" id="allocAppId">
              <div class="form-group">
                <label class="form-label">Block</label>
                <select class="form-select" id="allocBlock" required onchange="AdminApplications.updateFloors()">
                  <option value="">Select Block</option>
                  <option value="A">Block A (45/50 occupied)</option>
                  <option value="B">Block B (42/50 occupied)</option>
                  <option value="C">Block C (38/50 occupied)</option>
                  <option value="D">Block D (17/50 occupied)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Floor</label>
                <select class="form-select" id="allocFloor" required onchange="AdminApplications.updateRooms()">
                  <option value="">Select Floor</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Room</label>
                <select class="form-select" id="allocRoom" required onchange="AdminApplications.updateBeds()">
                  <option value="">Select Room</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Bed</label>
                <select class="form-select" id="allocBed" required>
                  <option value="">Select Bed</option>
                </select>
              </div>
              <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border);margin-top:16px">
                <button type="button" class="btn-secondary" onclick="AdminApplications.closeModal('allocationModal')">Cancel</button>
                <button type="submit" class="quick-action-btn quick-action-btn--primary">
                  ${icons.check || ''}
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  renderRejectModal() {
    return `
      <div class="modal-overlay hidden" id="rejectModal">
        <div class="modal" style="max-width:450px">
          <div class="modal-header">
            <h3>Reject Application</h3>
            <button class="modal-close" onclick="AdminApplications.closeModal('rejectModal')">&times;</button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="rejectAppId">
            <p style="margin-bottom:16px;color:var(--text-secondary)">Please provide a reason for rejecting this application:</p>
            <div class="form-group">
              <textarea class="form-textarea" id="rejectReason" rows="4" placeholder="Enter rejection reason..." required></textarea>
            </div>
            <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border)">
              <button class="btn-secondary" onclick="AdminApplications.closeModal('rejectModal')">Cancel</button>
              <button class="quick-action-btn quick-action-btn--danger" onclick="AdminApplications.confirmReject()">
                ${icons.x || ''}
                Reject Application
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ============================================
  // MODAL ACTIONS
  // ============================================

  viewApplication(id) {
    const app = this.applications.find(a => a.id === id);
    if (!app) return;

    const body = document.getElementById('detailModalBody');
    body.innerHTML = `
      <div class="application-detail">
        <div class="detail-section" style="margin-bottom:20px">
          <h4 style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:12px">Student Information</h4>
          <div class="profile-info-grid" style="grid-template-columns:1fr 1fr">
            <div class="profile-info-item">
              <div class="profile-info-label">Name</div>
              <div class="profile-info-value">${Utils.sanitize(app.name)}</div>
            </div>
            <div class="profile-info-item">
              <div class="profile-info-label">Email</div>
              <div class="profile-info-value">${Utils.sanitize(app.email)}</div>
            </div>
            <div class="profile-info-item">
              <div class="profile-info-label">Phone</div>
              <div class="profile-info-value">${Utils.sanitize(app.phone)}</div>
            </div>
            <div class="profile-info-item">
              <div class="profile-info-label">Applied</div>
              <div class="profile-info-value">${Utils.formatDate(app.date)}</div>
            </div>
          </div>
        </div>
        
        <div class="detail-section" style="margin-bottom:20px">
          <h4 style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:12px">Hostel Preference</h4>
          <div class="profile-info-grid" style="grid-template-columns:1fr 1fr">
            <div class="profile-info-item">
              <div class="profile-info-label">Hostel</div>
              <div class="profile-info-value">${app.hostel === 'boys' ? 'Boys Hostel' : 'Girls Hostel'}</div>
            </div>
            <div class="profile-info-item">
              <div class="profile-info-label">Status</div>
              <div class="profile-info-value"><span class="badge ${Utils.getStatusColor(app.status)}">${Utils.capitalize(app.status)}</span></div>
            </div>
          </div>
        </div>
        
        <div class="detail-section" style="margin-bottom:20px">
          <h4 style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:12px">Requirements</h4>
          <div style="padding:12px;background:var(--bg-secondary);border-radius:var(--radius-md);font-size:0.9rem;color:var(--text)">
            ${Utils.sanitize(app.requirements) || 'No specific requirements'}
          </div>
        </div>
        
        <div class="detail-section">
          <h4 style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:12px">Guardian Information</h4>
          <div class="profile-info-grid" style="grid-template-columns:1fr 1fr">
            <div class="profile-info-item">
              <div class="profile-info-label">Name</div>
              <div class="profile-info-value">${Utils.sanitize(app.guardian.name)}</div>
            </div>
            <div class="profile-info-item">
              <div class="profile-info-label">Phone</div>
              <div class="profile-info-value">${Utils.sanitize(app.guardian.phone)}</div>
            </div>
          </div>
        </div>
        
        ${app.status === 'approved' && app.allocation ? `
          <div class="detail-section" style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
            <h4 style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:12px">Allocation</h4>
            <div class="profile-info-grid" style="grid-template-columns:repeat(4,1fr)">
              <div class="profile-info-item" style="text-align:center">
                <div class="profile-info-label">Block</div>
                <div class="profile-info-value">${app.allocation.block}</div>
              </div>
              <div class="profile-info-item" style="text-align:center">
                <div class="profile-info-label">Floor</div>
                <div class="profile-info-value">${app.allocation.floor}</div>
              </div>
              <div class="profile-info-item" style="text-align:center">
                <div class="profile-info-label">Room</div>
                <div class="profile-info-value">${app.allocation.room}</div>
              </div>
              <div class="profile-info-item" style="text-align:center">
                <div class="profile-info-label">Bed</div>
                <div class="profile-info-value">${app.allocation.bed}</div>
              </div>
            </div>
          </div>
        ` : ''}
        
        ${app.status === 'rejected' && app.rejectReason ? `
          <div class="detail-section" style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
            <h4 style="font-size:0.85rem;font-weight:600;color:var(--danger);margin-bottom:8px">Rejection Reason</h4>
            <div style="padding:12px;background:var(--danger-light);border-radius:var(--radius-md);font-size:0.9rem;color:var(--danger)">
              ${Utils.sanitize(app.rejectReason)}
            </div>
          </div>
        ` : ''}
      </div>
      
      ${app.status === 'pending' ? `
        <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border);margin-top:20px">
          <button class="quick-action-btn quick-action-btn--danger" onclick="AdminApplications.closeModal('detailModal'); AdminApplications.rejectApplication(${app.id})">
            ${icons.x || ''}
            Reject
          </button>
          <button class="quick-action-btn quick-action-btn--primary" onclick="AdminApplications.closeModal('detailModal'); AdminApplications.approveApplication(${app.id})">
            ${icons.check || ''}
            Approve
          </button>
        </div>
      ` : ''}
    `;

    document.getElementById('detailModal').classList.remove('hidden');
  },

  approveApplication(id) {
    document.getElementById('allocAppId').value = id;
    document.getElementById('allocationForm').reset();
    document.getElementById('allocFloor').innerHTML = '<option value="">Select Floor</option>';
    document.getElementById('allocRoom').innerHTML = '<option value="">Select Room</option>';
    document.getElementById('allocBed').innerHTML = '<option value="">Select Bed</option>';
    document.getElementById('allocationModal').classList.remove('hidden');
  },

  rejectApplication(id) {
    document.getElementById('rejectAppId').value = id;
    document.getElementById('rejectReason').value = '';
    document.getElementById('rejectModal').classList.remove('hidden');
  },

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('hidden');
  },

  // ============================================
  // ALLOCATION CASCADE
  // ============================================

  updateFloors() {
    const block = document.getElementById('allocBlock').value;
    const floorSelect = document.getElementById('allocFloor');
    
    if (!block) {
      floorSelect.innerHTML = '<option value="">Select Floor</option>';
      return;
    }

    const floors = block === 'D' ? [1, 2] : [1, 2, 3];
    floorSelect.innerHTML = `
      <option value="">Select Floor</option>
      ${floors.map(f => `<option value="${f}">Floor ${f}</option>`).join('')}
    `;
  },

  updateRooms() {
    const block = document.getElementById('allocBlock').value;
    const floor = document.getElementById('allocFloor').value;
    const roomSelect = document.getElementById('allocRoom');
    
    if (!block || !floor) {
      roomSelect.innerHTML = '<option value="">Select Room</option>';
      return;
    }

    // Mock rooms
    const rooms = Array.from({ length: 5 }, (_, i) => parseInt(`${floor}0${i + 1}`));
    roomSelect.innerHTML = `
      <option value="">Select Room</option>
      ${rooms.map(r => `<option value="${r}">Room ${r}</option>`).join('')}
    `;
  },

  updateBeds() {
    const bedSelect = document.getElementById('allocBed');
    
    // Mock beds
    const beds = [1, 2, 3, 4];
    bedSelect.innerHTML = `
      <option value="">Select Bed</option>
      ${beds.map(b => `<option value="${b}">Bed ${b}</option>`).join('')}
    `;
  },

  submitAllocation(e) {
    e.preventDefault();
    const appId = parseInt(document.getElementById('allocAppId').value);
    const app = this.applications.find(a => a.id === appId);
    
    if (app) {
      app.status = 'approved';
      app.allocation = {
        block: document.getElementById('allocBlock').value,
        floor: parseInt(document.getElementById('allocFloor').value),
        room: parseInt(document.getElementById('allocRoom').value),
        bed: parseInt(document.getElementById('allocBed').value),
      };
    }

    this.closeModal('allocationModal');
    this.refresh();
    showToast('Application approved and room allocated', 'success');
  },

  confirmReject() {
    const appId = parseInt(document.getElementById('rejectAppId').value);
    const reason = document.getElementById('rejectReason').value.trim();
    
    if (!reason) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }

    const app = this.applications.find(a => a.id === appId);
    if (app) {
      app.status = 'rejected';
      app.rejectReason = reason;
    }

    this.closeModal('rejectModal');
    this.refresh();
    showToast('Application rejected', 'info');
  },

  // ============================================
  // REFRESH & INIT
  // ============================================

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = this.render();
      this.init();
    }
  },

  init() {
    this.selectedIds.clear();
    
    // Initialize magnetic effects
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      if (typeof Animations !== 'undefined') Animations.magneticEffect(btn);
    });

    console.log('[HostelBuddy] Admin Applications initialized');
  },
};

window.AdminApplications = AdminApplications;
