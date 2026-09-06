/**
 * HostelBuddy Student Visitors Page
 * View and register visitors
 */

const StudentVisitors = {
  currentFilter: 'all',

  get visitors() {
    const user = JSON.parse(localStorage.getItem('hb_user') || '{}');
    return Store.getAll('visitors').filter(v => v.studentId === user.id);
  },

  render() {
    const filtered = this.getFiltered();
    const counts = this.getCounts();

    return `
      <div class="section-header" style="margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.visitor || ''}
          My Visitors
        </h2>
        <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="StudentVisitors.openRegisterModal()">
          ${icons.plus || ''}
          Register Visitor
        </button>
      </div>
      
      <div class="filter-tabs fade-in stagger-1" style="margin-bottom:20px">
        ${['all', 'pending', 'approved', 'completed', 'rejected'].map(f => `
          <button class="filter-tab ${this.currentFilter === f ? 'active' : ''}" onclick="StudentVisitors.filter('${f}')">
            ${f === 'all' ? 'All' : Utils.capitalize(f)}
            <span class="filter-tab-count">${counts[f]}</span>
          </button>
        `).join('')}
      </div>
      
      <div class="visitor-cards-grid fade-in stagger-2">
        ${filtered.length > 0 ? filtered.map((v, i) => this.renderCard(v, i)).join('') : `
          <div class="empty-state" style="grid-column:1/-1">
            <div style="font-size:3rem;opacity:0.3;margin-bottom:16px">${icons.visitor || ''}</div>
            <p>No visitors found</p>
          </div>
        `}
      </div>
      
      ${this.renderRegisterModal()}
    `;
  },

  renderCard(visitor, index) {
    const statusColors = {
      pending: 'warning',
      approved: 'success',
      completed: 'info',
      rejected: 'danger',
    };

    return `
      <div class="visitor-card fade-in stagger-${Math.min(index + 1, 6)}">
        <div class="visitor-avatar">
          <div class="avatar">${Utils.getInitials(visitor.name)}</div>
        </div>
        <div class="visitor-info">
          <div class="visitor-name">${Utils.sanitize(visitor.name)}</div>
          <div class="visitor-relation">${Utils.sanitize(visitor.relation)}</div>
        </div>
        <div class="visitor-details">
          <div class="visitor-detail">
            ${icons.calendar || ''}
            <span>${Utils.formatDate(visitor.date)}</span>
          </div>
          <div class="visitor-detail">
            ${icons.clock || ''}
            <span>${visitor.time}</span>
          </div>
          <div class="visitor-detail">
            ${icons.info || ''}
            <span>${Utils.sanitize(visitor.purpose)}</span>
          </div>
        </div>
        <div class="visitor-status">
          <span class="badge badge-${statusColors[visitor.status]}">${Utils.capitalize(visitor.status)}</span>
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

  // ============================================
  // REGISTER MODAL
  // ============================================

  renderRegisterModal() {
    return `
      <div class="modal-overlay hidden" id="registerVisitorModal">
        <div class="modal" style="max-width:500px">
          <div class="modal-header">
            <h3>Register Visitor</h3>
            <button class="modal-close" onclick="StudentVisitors.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="visitorForm" onsubmit="VisitorForm.submit(event)">
              <div class="form-group">
                <label class="form-label">Visitor Name</label>
                <input type="text" class="form-input" id="visitorName" placeholder="Full name" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Relationship</label>
                  <select class="form-select" id="visitorRelation" required>
                    <option value="">Select</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-input" id="visitorPhone" placeholder="10-digit number" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Purpose</label>
                <input type="text" class="form-input" id="visitorPurpose" placeholder="Reason for visit" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Visit Date</label>
                  <input type="date" class="form-input" id="visitorDate" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Visit Time</label>
                  <input type="time" class="form-input" id="visitorTime" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Expected Duration</label>
                <select class="form-select" id="visitorDuration" required>
                  <option value="">Select</option>
                  <option value="30 min">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="Half day">Half day</option>
                </select>
              </div>
              <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border)">
                <button type="button" class="btn-secondary" onclick="StudentVisitors.closeModal()">Cancel</button>
                <button type="submit" class="quick-action-btn quick-action-btn--primary">
                  ${icons.check || ''}
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  openRegisterModal() {
    document.getElementById('registerVisitorModal')?.classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('registerVisitorModal')?.classList.add('hidden');
    document.getElementById('visitorForm')?.reset();
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = this.render();
      this.init();
    }
  },

  init() {
    console.log('[HostelBuddy] Student Visitors initialized');
  },
};

// Visitor Form Handler
const VisitorForm = {
  submit(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('hb_user') || '{}');
    
    Store.add('visitors', {
      studentId: user.id,
      name: document.getElementById('visitorName').value,
      relation: document.getElementById('visitorRelation').value,
      phone: document.getElementById('visitorPhone').value,
      purpose: document.getElementById('visitorPurpose').value,
      date: document.getElementById('visitorDate').value,
      time: document.getElementById('visitorTime').value,
      duration: document.getElementById('visitorDuration').value,
      status: 'pending',
    });

    StudentVisitors.closeModal();
    StudentVisitors.refresh();
    showToast('Visitor registered, pending approval', 'success');
  },
};

window.StudentVisitors = StudentVisitors;
window.VisitorForm = VisitorForm;
