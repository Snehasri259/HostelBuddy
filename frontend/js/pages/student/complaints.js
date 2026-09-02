/**
 * HostelBuddy Student Complaints Page
 * View and submit complaints
 */

const StudentComplaints = {
  currentFilter: 'all',
  complaints: [
    { id: 1, title: 'Broken ceiling fan', category: 'Maintenance', priority: 'medium', status: 'in_progress', description: 'The ceiling fan in my room is making strange noises and sometimes stops working. It has been like this for 3 days.', date: new Date(Date.now() - 172800000), updated: new Date(Date.now() - 86400000), responses: [{ author: 'Admin', text: 'We have noted your complaint. A technician will visit tomorrow.', date: new Date(Date.now() - 86400000) }] },
    { id: 2, title: 'Water leakage in bathroom', category: 'Maintenance', priority: 'high', status: 'open', description: 'There is a water leakage from the pipe under the sink. The floor is getting wet and it is a safety hazard.', date: new Date(Date.now() - 43200000), updated: new Date(Date.now() - 43200000), responses: [] },
    { id: 3, title: 'Noise disturbance at night', category: 'Noise', priority: 'low', status: 'resolved', description: 'Students in the adjacent room are playing loud music after 11 PM consistently.', date: new Date(Date.now() - 604800000), updated: new Date(Date.now() - 518400000), responses: [{ author: 'Admin', text: 'Warning issued to the students. Please let us know if the issue persists.', date: new Date(Date.now() - 518400000) }] },
    { id: 4, title: 'Dirty common area', category: 'Cleanliness', priority: 'medium', status: 'open', description: 'The common area on 2nd floor is not being cleaned properly. There is accumulated dust and garbage.', date: new Date(Date.now() - 259200000), updated: new Date(Date.now() - 259200000), responses: [] },
    { id: 5, title: 'Broken window lock', category: 'Maintenance', priority: 'low', status: 'resolved', description: 'The lock on the window is broken and needs to be replaced. It was reported earlier but not fixed.', date: new Date(Date.now() - 864000000), updated: new Date(Date.now() - 691200000), responses: [{ author: 'Admin', text: 'Lock has been replaced. Sorry for the delay.', date: new Date(Date.now() - 691200000) }] },
  ],

  render() {
    const filtered = this.getFiltered();
    const counts = this.getCounts();

    return `
      <div class="section-header" style="margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.complaint || ''}
          My Complaints
        </h2>
        <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="StudentComplaints.openNewModal()">
          ${icons.plus || ''}
          New Complaint
        </button>
      </div>
      
      <div class="filter-tabs fade-in stagger-1" style="margin-bottom:20px">
        ${['all', 'open', 'in_progress', 'resolved'].map(f => `
          <button class="filter-tab ${this.currentFilter === f ? 'active' : ''}" onclick="StudentComplaints.filter('${f}')">
            ${f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : Utils.capitalize(f)}
            <span class="filter-tab-count">${counts[f]}</span>
          </button>
        `).join('')}
      </div>
      
      <div id="complaintsList">
        ${filtered.length > 0 ? filtered.map((c, i) => this.renderCard(c, i)).join('') : `
          <div class="empty-state fade-in">
            <div style="font-size:3rem;opacity:0.3;margin-bottom:16px">${icons.complaint || ''}</div>
            <p>No complaints found</p>
          </div>
        `}
      </div>
      
      ${this.renderNewModal()}
      ${this.renderDetailModal()}
    `;
  },

  renderCard(complaint, index) {
    return `
      <div class="complaint-card fade-in stagger-${Math.min(index + 1, 6)}">
        <div class="complaint-header">
          <div class="complaint-title-row">
            <h3 class="complaint-title">${Utils.sanitize(complaint.title)}</h3>
            <span class="badge badge-${complaint.category === 'Maintenance' ? 'warning' : complaint.category === 'Noise' ? 'info' : complaint.category === 'Cleanliness' ? 'success' : 'info'}">
              ${Utils.sanitize(complaint.category)}
            </span>
          </div>
          <span class="badge ${Utils.getStatusColor(complaint.status)}">${complaint.status === 'in_progress' ? 'In Progress' : Utils.capitalize(complaint.status)}</span>
        </div>
        
        <p class="complaint-description">${Utils.truncate(complaint.description, 120)}</p>
        
        <div class="complaint-meta">
          <span class="complaint-meta-item">
            ${icons.calendar || ''}
            ${Utils.formatDate(complaint.date)}
          </span>
          <span class="complaint-meta-item">
            ${icons.clock || ''}
            Updated ${Utils.timeAgo(complaint.updated)}
          </span>
          <span class="complaint-meta-item">
            Priority:
            <span class="badge badge-${complaint.priority === 'high' ? 'danger' : complaint.priority === 'medium' ? 'warning' : 'success'}" style="margin-left:4px">
              ${Utils.capitalize(complaint.priority)}
            </span>
          </span>
        </div>
        
        <button class="quick-action-btn quick-action-btn--secondary btn-sm" style="margin-top:12px" onclick="StudentComplaints.viewDetail(${complaint.id})">
          ${icons.eye || ''}
          View Details
        </button>
      </div>
    `;
  },

  getFiltered() {
    if (this.currentFilter === 'all') return this.complaints;
    return this.complaints.filter(c => c.status === this.currentFilter);
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

  // ============================================
  // NEW COMPLAINT MODAL
  // ============================================

  renderNewModal() {
    return `
      <div class="modal-overlay hidden" id="newComplaintModal">
        <div class="modal" style="max-width:550px">
          <div class="modal-header">
            <h3>New Complaint</h3>
            <button class="modal-close" onclick="StudentComplaints.closeModal('newComplaintModal')">&times;</button>
          </div>
          <div class="modal-body">
            <form id="newComplaintForm" onsubmit="StudentComplaints.submit(event)">
              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-input" id="compTitle" placeholder="Brief description of the issue" required>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" id="compCategory" required>
                  <option value="">Select category</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Noise">Noise</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <div class="textarea-container">
                  <textarea class="form-textarea" id="compDescription" rows="4" placeholder="Provide details..." required oninput="StudentComplaints.updateCharCount()"></textarea>
                  <span class="char-count" id="compCharCount">0/500</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Priority</label>
                <div class="radio-group">
                  <label class="radio-option">
                    <input type="radio" name="priority" value="low" required>
                    <span class="badge badge-success">Low</span>
                  </label>
                  <label class="radio-option active">
                    <input type="radio" name="priority" value="medium" checked>
                    <span class="badge badge-warning">Medium</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" name="priority" value="high">
                    <span class="badge badge-danger">High</span>
                  </label>
                </div>
              </div>
              <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border)">
                <button type="button" class="btn-secondary" onclick="StudentComplaints.closeModal('newComplaintModal')">Cancel</button>
                <button type="submit" class="quick-action-btn quick-action-btn--primary">
                  ${icons.check || ''}
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  openNewModal() {
    document.getElementById('newComplaintModal')?.classList.remove('hidden');
  },

  updateCharCount() {
    const textarea = document.getElementById('compDescription');
    const count = document.getElementById('compCharCount');
    if (textarea && count) {
      count.textContent = `${textarea.value.length}/500`;
    }
  },

  submit(e) {
    e.preventDefault();
    const priority = document.querySelector('input[name="priority"]:checked')?.value || 'medium';
    
    const newComplaint = {
      id: Date.now(),
      title: document.getElementById('compTitle').value,
      category: document.getElementById('compCategory').value,
      description: document.getElementById('compDescription').value,
      priority,
      status: 'open',
      date: new Date(),
      updated: new Date(),
      responses: [],
    };

    this.complaints.unshift(newComplaint);
    this.closeModal('newComplaintModal');
    document.getElementById('newComplaintForm').reset();
    this.refresh();
    showToast('Complaint submitted successfully', 'success');
  },

  // ============================================
  // DETAIL MODAL
  // ============================================

  renderDetailModal() {
    return `
      <div class="modal-overlay hidden" id="complaintDetailModal">
        <div class="modal" style="max-width:600px">
          <div class="modal-header">
            <h3>Complaint Details</h3>
            <button class="modal-close" onclick="StudentComplaints.closeModal('complaintDetailModal')">&times;</button>
          </div>
          <div class="modal-body" id="complaintDetailBody">
            <!-- Content loaded dynamically -->
          </div>
        </div>
      </div>
    `;
  },

  viewDetail(id) {
    const complaint = this.complaints.find(c => c.id === id);
    if (!complaint) return;

    const body = document.getElementById('complaintDetailBody');
    body.innerHTML = `
      <div class="complaint-detail">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
          <div>
            <h4 style="font-size:1.125rem;font-weight:600;margin-bottom:4px">${Utils.sanitize(complaint.title)}</h4>
            <div style="display:flex;gap:8px">
              <span class="badge badge-${complaint.category === 'Maintenance' ? 'warning' : 'info'}">${Utils.sanitize(complaint.category)}</span>
              <span class="badge ${Utils.getStatusColor(complaint.status)}">${complaint.status === 'in_progress' ? 'In Progress' : Utils.capitalize(complaint.status)}</span>
              <span class="badge badge-${complaint.priority === 'high' ? 'danger' : complaint.priority === 'medium' ? 'warning' : 'success'}">${Utils.capitalize(complaint.priority)}</span>
            </div>
          </div>
        </div>
        
        <div style="padding:16px;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:20px">
          <p style="color:var(--text);line-height:1.6">${Utils.sanitize(complaint.description)}</p>
        </div>
        
        <div style="display:flex;gap:16px;margin-bottom:20px;font-size:0.85rem;color:var(--text-secondary)">
          <span>Created: ${Utils.formatDate(complaint.date)}</span>
          <span>Updated: ${Utils.timeAgo(complaint.updated)}</span>
        </div>
        
        ${complaint.responses.length > 0 ? `
          <div style="margin-bottom:20px">
            <h5 style="font-size:0.9rem;font-weight:600;margin-bottom:12px">Admin Responses</h5>
            ${complaint.responses.map(r => `
              <div style="padding:12px;background:var(--primary-light);border-radius:var(--radius-md);margin-bottom:8px;border-left:3px solid var(--primary)">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                  <span style="font-weight:600;font-size:0.85rem">${Utils.sanitize(r.author)}</span>
                  <span style="font-size:0.75rem;color:var(--text-muted)">${Utils.timeAgo(r.date)}</span>
                </div>
                <p style="font-size:0.9rem;color:var(--text-secondary)">${Utils.sanitize(r.text)}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div style="padding-top:16px;border-top:1px solid var(--border)">
          <h5 style="font-size:0.9rem;font-weight:600;margin-bottom:8px">Add Comment</h5>
          <div style="display:flex;gap:8px">
            <input type="text" class="form-input" id="complaintComment" placeholder="Type your comment..." style="flex:1">
            <button class="quick-action-btn quick-action-btn--primary btn-sm" onclick="StudentComplaints.addComment(${complaint.id})">
              ${icons['arrow-left'] || ''} Send
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('complaintDetailModal').classList.remove('hidden');
  },

  addComment(id) {
    const input = document.getElementById('complaintComment');
    const text = input?.value.trim();
    if (!text) return;

    const complaint = this.complaints.find(c => c.id === id);
    if (complaint) {
      complaint.responses.push({
        author: 'You',
        text,
        date: new Date(),
      });
      complaint.updated = new Date();
      input.value = '';
      this.viewDetail(id);
      showToast('Comment added', 'success');
    }
  },

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('hidden');
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = this.render();
      this.init();
    }
  },

  init() {
    // Initialize radio buttons
    document.querySelectorAll('.radio-option input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.radio-option').forEach(o => o.classList.remove('active'));
        radio.closest('.radio-option').classList.add('active');
      });
    });

    console.log('[HostelBuddy] Student Complaints initialized');
  },
};

window.StudentComplaints = StudentComplaints;
