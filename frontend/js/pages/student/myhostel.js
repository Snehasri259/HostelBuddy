/**
 * HostelBuddy Student My Hostel Page
 * View allocated room details, roommates, and report issues
 */

const StudentMyHostel = {
  allocation: {
    status: 'approved', // pending, approved, rejected
    hostel: 'Boys Hostel A',
    block: 'B',
    floor: 2,
    room: 205,
    bed: 3,
    allocationDate: '2025-01-20',
    rejectReason: '',
  },

  roommates: [
    { name: 'Amit Singh', initials: 'AS', course: 'B.Tech CS', year: '3rd Year', bed: 1 },
    { name: 'Rahul Verma', initials: 'RV', course: 'B.Tech ECE', year: '3rd Year', bed: 2 },
  ],

  rules: [
    'Quiet hours: 10 PM - 6 AM',
    'No visitors allowed after 8 PM',
    'Keep your room clean and tidy',
    'Report any maintenance issues immediately',
    'No cooking in the rooms',
  ],

  render() {
    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.building || ''}
          My Hostel
        </h2>
        <span class="badge ${this.allocation.status === 'approved' ? 'badge-success' : this.allocation.status === 'pending' ? 'badge-warning' : 'badge-danger'}">
          ${Utils.capitalize(this.allocation.status)}
        </span>
      </div>
      
      ${this.renderStatusView()}
    `;
  },

  // ============================================
  // STATUS VIEWS
  // ============================================

  renderStatusView() {
    switch (this.allocation.status) {
      case 'pending': return this.renderPending();
      case 'approved': return this.renderApproved();
      case 'rejected': return this.renderRejected();
      default: return this.renderNoApplication();
    }
  },

  renderNoApplication() {
    return `
      <div class="form-card fade-in" style="text-align:center;padding:48px">
        <div class="empty-state">
          <div style="font-size:3rem;margin-bottom:16px;opacity:0.5">${icons.bed || ''}</div>
          <h3 style="margin-bottom:8px">No Application Found</h3>
          <p style="color:var(--text-secondary);margin-bottom:24px">You haven't applied for hostel accommodation yet</p>
          <a href="#student/application" class="quick-action-btn quick-action-btn--primary">
            ${icons.plus || ''}
            Apply Now
          </a>
        </div>
      </div>
    `;
  },

  renderPending() {
    return `
      <div class="form-card fade-in stagger-1">
        <div class="pending-state">
          <div class="pending-icon-large">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3>Your application is under review</h3>
          <p style="color:var(--text-secondary)">We'll notify you once a decision is made</p>
        </div>
        
        ${this.renderStatusTimeline()}
        
        <div style="text-align:center;margin-top:32px">
          <button class="quick-action-btn quick-action-btn--danger" onclick="StudentMyHostel.cancelApplication()">
            ${icons.x || ''}
            Cancel Application
          </button>
        </div>
      </div>
    `;
  },

  renderApproved() {
    return `
      <div class="allocation-card fade-in stagger-1">
        <div class="allocation-header">
          <div class="allocation-header-content">
            <div class="allocation-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <h3>Your Hostel Allocation</h3>
              <p>Allocated on ${Utils.formatDate(this.allocation.allocationDate)}</p>
            </div>
          </div>
        </div>
        
        <div class="allocation-body">
          <div class="allocation-details-grid">
            <div class="allocation-detail-card">
              <div class="allocation-detail-icon">${icons.building || ''}</div>
              <div class="allocation-detail-label">Hostel</div>
              <div class="allocation-detail-value">${Utils.sanitize(this.allocation.hostel)}</div>
            </div>
            <div class="allocation-detail-card">
              <div class="allocation-detail-icon">${icons.block || ''}</div>
              <div class="allocation-detail-label">Block</div>
              <div class="allocation-detail-value">${this.allocation.block}</div>
            </div>
            <div class="allocation-detail-card">
              <div class="allocation-detail-icon">${icons.floor || ''}</div>
              <div class="allocation-detail-label">Floor</div>
              <div class="allocation-detail-value">${this.allocation.floor}</div>
            </div>
            <div class="allocation-detail-card">
              <div class="allocation-detail-icon">${icons.room || ''}</div>
              <div class="allocation-detail-label">Room</div>
              <div class="allocation-detail-value">${this.allocation.room}</div>
            </div>
            <div class="allocation-detail-card">
              <div class="allocation-detail-icon">${icons.bed || ''}</div>
              <div class="allocation-detail-label">Bed</div>
              <div class="allocation-detail-value">${this.allocation.bed}</div>
            </div>
          </div>
          
          <div class="room-diagram-section">
            <h4>Room Layout</h4>
            ${this.renderRoomDiagram()}
          </div>
          
          ${this.renderRoommates()}
          
          <div class="allocation-actions">
            <button class="quick-action-btn quick-action-btn--secondary" onclick="StudentMyHostel.reportIssue()">
              ${icons.complaint || ''}
              Report Issue
            </button>
          </div>
        </div>
      </div>
      
      ${this.renderRules()}
    `;
  },

  renderRejected() {
    return `
      <div class="form-card fade-in stagger-1" style="text-align:center;padding:48px">
        <div class="rejected-state">
          <div class="rejected-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 style="margin-bottom:8px">Application Rejected</h3>
          <p style="color:var(--text-secondary);margin-bottom:24px">${Utils.sanitize(this.allocation.rejectReason) || 'Your application could not be approved at this time.'}</p>
          <a href="#student/application" class="quick-action-btn quick-action-btn--primary">
            ${icons.plus || ''}
            Apply Again
          </a>
        </div>
      </div>
    `;
  },

  // ============================================
  // STATUS TIMELINE
  // ============================================

  renderStatusTimeline() {
    const steps = [
      { label: 'Submitted', completed: true, time: 'Jan 15, 2025' },
      { label: 'Under Review', completed: false, current: true, time: 'In progress' },
      { label: 'Assignment', completed: false, time: 'Pending' },
    ];

    return `
      <div class="status-timeline">
        ${steps.map((step, i) => `
          <div class="status-timeline-item ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}">
            <div class="timeline-dot-wrapper">
              <div class="timeline-dot-inner">
                ${step.completed ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
              </div>
              ${i < steps.length - 1 ? '<div class="timeline-line"></div>' : ''}
            </div>
            <div class="timeline-content">
              <div class="timeline-label">${step.label}</div>
              <div class="timeline-time">${step.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ============================================
  // ROOM DIAGRAM
  // ============================================

  renderRoomDiagram() {
    const beds = [
      { num: 1, x: 20, y: 30, occupied: true, occupant: 'Amit Singh' },
      { num: 2, x: 120, y: 30, occupied: true, occupant: 'Rahul Verma' },
      { num: 3, x: 220, y: 30, occupied: true, occupant: 'You', isCurrent: true },
      { num: 4, x: 20, y: 120, occupied: false, occupant: '' },
    ];

    return `
      <div class="room-diagram">
        <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
          <!-- Room outline -->
          <rect x="10" y="10" width="300" height="180" rx="8" fill="var(--bg-secondary)" stroke="var(--border)" stroke-width="2"/>
          
          <!-- Door -->
          <rect x="140" y="170" width="40" height="20" fill="var(--card)" stroke="var(--border)" stroke-width="2"/>
          <text x="160" y="185" text-anchor="middle" font-size="10" fill="var(--text-muted)">Door</text>
          
          <!-- Window -->
          <rect x="130" y="10" width="60" height="10" fill="var(--info-light)" stroke="var(--info)" stroke-width="1"/>
          
          ${beds.map(bed => `
            <!-- Bed ${bed.num} -->
            <g class="bed-group ${bed.isCurrent ? 'current-bed' : ''}" transform="translate(${bed.x}, ${bed.y})">
              <rect width="80" height="60" rx="6" 
                fill="${bed.isCurrent ? 'var(--primary-light)' : bed.occupied ? 'var(--bg-secondary)' : 'rgba(16, 185, 129, 0.1)'}" 
                stroke="${bed.isCurrent ? 'var(--primary)' : bed.occupied ? 'var(--border)' : 'var(--secondary)'}" 
                stroke-width="${bed.isCurrent ? 3 : 2}"/>
              <rect x="10" y="5" width="60" height="25" rx="4" 
                fill="${bed.isCurrent ? 'var(--primary)' : bed.occupied ? 'var(--text-muted)' : 'var(--secondary)'}" 
                opacity="0.3"/>
              <text x="40" y="50" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">
                Bed ${bed.num}
              </text>
              ${bed.occupied ? `
                <text x="40" y="75" text-anchor="middle" font-size="9" fill="var(--text-muted)">
                  ${bed.isCurrent ? '(You)' : Utils.truncate(bed.occupant, 10)}
                </text>
              ` : `
                <text x="40" y="75" text-anchor="middle" font-size="9" fill="var(--secondary)">
                  Available
                </text>
              `}
            </g>
          `).join('')}
        </svg>
      </div>
    `;
  },

  // ============================================
  // ROOMMATES
  // ============================================

  renderRoommates() {
    if (this.roommates.length === 0) return '';

    return `
      <div class="roommates-section">
        <h4 class="roommates-title">
          ${icons.users || ''}
          Roommates
        </h4>
        <div class="roommates-list">
          ${this.roommates.map(r => `
            <div class="roommate-card">
              <div class="avatar">${r.initials}</div>
              <div class="roommate-info">
                <div class="roommate-name">${Utils.sanitize(r.name)}</div>
                <div class="roommate-detail">${Utils.sanitize(r.course)} - ${Utils.sanitize(r.year)}</div>
              </div>
              <div class="roommate-bed">Bed ${r.bed}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ============================================
  // RULES
  // ============================================

  renderRules() {
    return `
      <div class="card fade-in stagger-3" style="margin-top:24px">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px">
          ${icons.info || ''}
          Hostel Rules & Guidelines
        </h3>
        <ul class="rules-list">
          ${this.rules.map((rule, i) => `
            <li class="rule-item">
              <span class="rule-number">${i + 1}</span>
              <span class="rule-text">${Utils.sanitize(rule)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  // ============================================
  // ACTIONS
  // ============================================

  cancelApplication() {
    if (confirm('Are you sure you want to cancel your application? This action cannot be undone.')) {
      this.allocation.status = 'none';
      this.refresh();
      showToast('Application cancelled', 'info');
    }
  },

  reportIssue() {
    window.location.hash = '#student/complaints';
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = this.render();
      this.init();
    }
  },

  init() {
    // Initialize magnetic effects
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      if (typeof Animations !== 'undefined') Animations.magneticEffect(btn);
    });

    console.log('[HostelBuddy] My Hostel page initialized');
  },
};

window.StudentMyHostel = StudentMyHostel;
