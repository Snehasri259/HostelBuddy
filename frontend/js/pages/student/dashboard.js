/**
 * HostelBuddy Student Dashboard
 * Welcome banner, stat cards, activity timeline, quick actions
 */

const StudentDashboard = {
  // Mock data
  data: {
    user: {
      name: 'Ravi Kumar',
      email: 'ravi@university.edu',
      phone: '9876543210',
      rollNo: 'CS2025001',
    },
    application: {
      status: 'approved',
      date: '2025-01-15',
    },
    room: {
      hostel: 'Boys Hostel A',
      block: 'B',
      floor: 2,
      room: 205,
      bed: 3,
    },
    stats: {
      complaints: 0,
      visitors: 1,
      announcements: 3,
    },
    recentActivity: [
      { icon: 'check-circle', type: 'success', text: 'Application approved by admin', time: new Date(Date.now() - 7200000) },
      { icon: 'building', type: 'info', text: 'Room allocated: Block B, Room 205', time: new Date(Date.now() - 86400000) },
      { icon: 'announcement', type: 'warning', text: 'New announcement: Hostel timings updated', time: new Date(Date.now() - 172800000) },
      { icon: 'bed', type: 'info', text: 'Application submitted for Boys Hostel', time: new Date(Date.now() - 604800000) },
    ],
    announcements: [
      { id: 1, title: 'Hostel Timings Updated', content: 'Please note that hostel gates will now close at 10 PM instead of 11 PM starting next week.', date: new Date(Date.now() - 86400000), pinned: true },
      { id: 2, title: 'Mess Menu Change', content: 'New mess menu for this semester has been uploaded. Check the notice board for details.', date: new Date(Date.now() - 259200000), pinned: false },
      { id: 3, title: 'Maintenance Schedule', content: 'Water supply will be disrupted on Saturday from 10 AM to 2 PM for pipe maintenance.', date: new Date(Date.now() - 432000000), pinned: false },
    ],
    roommates: [
      { name: 'Amit Singh', initials: 'AS' },
      { name: 'Rahul Verma', initials: 'RV' },
    ],
  },

  /**
   * Render the complete dashboard
   */
  render() {
    const user = JSON.parse(localStorage.getItem('hb_user') || '{}');
    const userName = user.name || this.data.user.name;
    
    return `
      <div class="dashboard-grid">
        <div class="dashboard-main">
          ${this.renderWelcomeBanner(userName)}
          ${this.renderQuickActions()}
          ${this.renderRecentActivity()}
          ${this.renderAnnouncementsPreview()}
        </div>
        <div class="dashboard-sidebar">
          ${this.renderStatCards()}
          ${this.renderHostelSummary()}
        </div>
      </div>
    `;
  },

  /**
   * Welcome Banner
   */
  renderWelcomeBanner(name) {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
      <div class="welcome-banner fade-in">
        <div class="welcome-content">
          <h1 class="welcome-title">
            Welcome back, ${Utils.sanitize(name)}!
            <span class="wave">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary)">
                <path d="M7 11l4-8 4 8"></path>
                <path d="M5 11h10"></path>
              </svg>
            </span>
          </h1>
          <p class="welcome-subtitle">Here's your hostel status</p>
          <div class="welcome-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${today}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Stat Cards - Sidebar Layout
   */
  renderStatCards() {
    const stats = [
      {
        icon: 'check-circle',
        label: 'Application Status',
        value: this.data.application.status === 'approved' ? 'Approved' : 'Pending',
        valueClass: 'bento-value--text',
        iconClass: this.data.application.status === 'approved' ? 'bento-icon--success' : 'bento-icon--warning',
        badge: this.data.application.status === 'approved' ? 'badge-success' : 'badge-warning',
        badgeText: this.data.application.status === 'approved' ? 'Active' : 'Review',
      },
      {
        icon: 'bed',
        label: 'Bed Assignment',
        value: this.data.room ? `${this.data.room.block}${this.data.room.room}` : 'Not Assigned',
        valueClass: 'bento-value--text',
        iconClass: 'bento-icon--primary',
        trend: this.data.room ? `${this.data.room.hostel}, Floor ${this.data.room.floor}` : null,
        trendClass: 'bento-trend--up',
      },
      {
        icon: 'complaint',
        label: 'Active Complaints',
        value: this.data.stats.complaints,
        iconClass: 'bento-icon--info',
        trend: this.data.stats.complaints === 0 ? 'All clear' : `${this.data.stats.complaints} pending`,
        trendClass: this.data.stats.complaints === 0 ? 'bento-trend--up' : 'bento-trend--down',
      },
      {
        icon: 'visitor',
        label: 'Upcoming Visitors',
        value: this.data.stats.visitors,
        iconClass: 'bento-icon--warning',
        trend: this.data.stats.visitors > 0 ? 'Expected today' : 'None scheduled',
        trendClass: 'bento-trend--up',
      },
      {
        icon: 'announcement',
        label: 'Unread Announcements',
        value: this.data.stats.announcements,
        iconClass: 'bento-icon--info',
        trend: 'New updates',
        trendClass: 'bento-trend--up',
      },
    ];

    return `
      <div class="stat-cards-stack">
        ${stats.map((stat, index) => `
          <div class="bento-card spotlight-card fade-in stagger-${index + 1}" data-spotlight>
            <div class="bento-icon ${stat.iconClass}">
              ${icons[stat.icon] || ''}
            </div>
            <div class="bento-label">${stat.label}</div>
            <div class="bento-value ${stat.valueClass || ''}">${stat.value}</div>
            ${stat.badge ? `<span class="badge ${stat.badge}" style="margin-top:8px">${stat.badgeText}</span>` : ''}
            ${stat.trend ? `<div class="bento-trend ${stat.trendClass}">${stat.trend}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Quick Actions
   */
  renderQuickActions() {
    const hasApplication = this.data.application.status === 'approved';
    
    return `
      <div class="quick-actions fade-in stagger-2">
        ${!hasApplication ? `
          <a href="#student/application" class="quick-action-btn quick-action-btn--primary magnetic-btn ripple-btn">
            ${icons.bed || ''}
            Apply for Hostel
          </a>
        ` : ''}
        <a href="#student/myhostel" class="quick-action-btn quick-action-btn--secondary">
          ${icons.building || ''}
          View My Room
        </a>
        <a href="#student/complaints" class="quick-action-btn quick-action-btn--secondary">
          ${icons.complaint || ''}
          Submit Complaint
        </a>
        <a href="#student/visitors" class="quick-action-btn quick-action-btn--secondary">
          ${icons.visitor || ''}
          Register Visitor
        </a>
      </div>
    `;
  },

  /**
   * Recent Activity Timeline
   */
  renderRecentActivity() {
    return `
      <div class="timeline-section fade-in stagger-3">
        <div class="section-header">
          <h2 class="section-title">Recent Activity</h2>
          <a href="#" class="section-link">
            View All
            ${icons['chevron-right'] || ''}
          </a>
        </div>
        <div class="timeline">
          ${this.data.recentActivity.map((item, index) => `
            <div class="timeline-item fade-in stagger-${index + 1}">
              <div class="timeline-dot timeline-dot--${item.type}"></div>
              <div class="timeline-content">
                <div class="timeline-icon bento-icon--${item.type}">
                  ${icons[item.icon] || ''}
                </div>
                <div class="timeline-text">
                  <div class="timeline-title">${Utils.sanitize(item.text)}</div>
                  <div class="timeline-time">${Utils.timeAgo(item.time)}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Announcements Preview
   */
  renderAnnouncementsPreview() {
    return `
      <div class="fade-in stagger-4">
        <div class="section-header">
          <h2 class="section-title">Latest Announcements</h2>
          <a href="#student/announcements" class="section-link">
            View All
            ${icons['chevron-right'] || ''}
          </a>
        </div>
        <div class="announcements-preview">
          ${this.data.announcements.slice(0, 3).map((item, index) => `
            <div class="announcement-card ${item.pinned ? 'announcement-card--pinned' : ''} fade-in stagger-${index + 1}">
              ${item.pinned ? `
                <div class="announcement-badge">
                  ${icons.pin || ''}
                  Pinned
                </div>
              ` : ''}
              <h3 class="announcement-title">${Utils.sanitize(item.title)}</h3>
              <p class="announcement-preview">${Utils.sanitize(item.content)}</p>
              <div class="announcement-date">${Utils.formatDate(item.date)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Hostel Summary Card
   */
  renderHostelSummary() {
    if (!this.data.room) return '';

    return `
      <div class="hostel-summary fade-in stagger-5">
        <div class="hostel-summary-header">
          <div class="hostel-summary-title">My Hostel</div>
          <div class="hostel-summary-subtitle">${Utils.sanitize(this.data.room.hostel)}</div>
        </div>
        <div class="hostel-summary-body">
          <div class="hostel-details">
            <div class="hostel-detail">
              <div class="hostel-detail-label">Block</div>
              <div class="hostel-detail-value">${this.data.room.block}</div>
            </div>
            <div class="hostel-detail">
              <div class="hostel-detail-label">Floor</div>
              <div class="hostel-detail-value">${this.data.room.floor}</div>
            </div>
            <div class="hostel-detail">
              <div class="hostel-detail-label">Room</div>
              <div class="hostel-detail-value">${this.data.room.room}</div>
            </div>
            <div class="hostel-detail">
              <div class="hostel-detail-label">Bed</div>
              <div class="hostel-detail-value">${this.data.room.bed}</div>
            </div>
          </div>
          
          ${this.data.roommates.length > 0 ? `
            <div class="roommates-section">
              <div class="roommates-title">Roommates</div>
              <div class="roommates-list">
                ${this.data.roommates.map(roommate => `
                  <div class="roommate-chip">
                    <div class="avatar">${roommate.initials}</div>
                    ${Utils.sanitize(roommate.name)}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Initialize spotlight effect on cards
   */
  initSpotlight() {
    document.querySelectorAll('[data-spotlight]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  },

  /**
   * Initialize page
   */
  init() {
    // Initialize spotlight effects
    this.initSpotlight();

    // Initialize magnetic effect on primary buttons
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      if (typeof Animations !== 'undefined') {
        Animations.magneticEffect(btn);
      }
    });

    // Initialize ripple effect
    document.querySelectorAll('.ripple-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (typeof Animations !== 'undefined') {
          Animations.rippleEffect(btn, e);
        }
      });
    });

    console.log('[HostelBuddy] Student Dashboard initialized');
  },
};

// Make globally available
window.StudentDashboard = StudentDashboard;
