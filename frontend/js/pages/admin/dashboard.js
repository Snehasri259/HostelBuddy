/**
 * HostelBuddy Admin Dashboard
 * KPI cards, recent applications, quick actions, room occupancy
 */

const AdminDashboard = {
  // Mock data
  data: {
    stats: {
      totalApplications: 156,
      pendingReviews: 12,
      allocatedBeds: { used: 142, total: 200 },
      activeComplaints: 8,
      todayVisitors: 7,
      newAnnouncements: 3,
    },
    recentApplications: [
      { id: 1, name: 'Ravi Kumar', email: 'ravi@uni.edu', date: new Date(Date.now() - 7200000), hostel: 'Boys Hostel A', status: 'pending' },
      { id: 2, name: 'Priya Singh', email: 'priya@uni.edu', date: new Date(Date.now() - 86400000), hostel: 'Girls Hostel A', status: 'pending' },
      { id: 3, name: 'Amit Patel', email: 'amit@uni.edu', date: new Date(Date.now() - 172800000), hostel: 'Boys Hostel B', status: 'approved' },
      { id: 4, name: 'Neha Gupta', email: 'neha@uni.edu', date: new Date(Date.now() - 259200000), hostel: 'Girls Hostel B', status: 'approved' },
      { id: 5, name: 'Vikram Reddy', email: 'vikram@uni.edu', date: new Date(Date.now() - 345600000), hostel: 'Boys Hostel A', status: 'rejected' },
    ],
    blockOccupancy: [
      { name: 'Block A', total: 50, occupied: 45 },
      { name: 'Block B', total: 50, occupied: 42 },
      { name: 'Block C', total: 50, occupied: 38 },
      { name: 'Block D', total: 50, occupied: 17 },
    ],
  },

  render() {
    return `
      <div class="admin-dashboard">
        ${this.renderKPICards()}
        ${this.renderQuickActions()}
        <div class="admin-dashboard-grid">
          <div class="admin-main">
            ${this.renderRecentApplications()}
          </div>
          <div class="admin-sidebar">
            ${this.renderRoomOccupancy()}
          </div>
        </div>
      </div>
    `;
  },

  // ============================================
  // KPI CARDS
  // ============================================

  renderKPICards() {
    const { stats } = this.data;
    const occupancyPercent = Math.round((stats.allocatedBeds.used / stats.allocatedBeds.total) * 100);

    const cards = [
      {
        icon: 'mail',
        label: 'Total Applications',
        value: stats.totalApplications,
        trend: '+12% this week',
        trendUp: true,
        color: 'primary',
        sparkline: [20, 35, 28, 45, 38, 52, 48, 65, 58, 72],
      },
      {
        icon: 'clock',
        label: 'Pending Reviews',
        value: stats.pendingReviews,
        badge: stats.pendingReviews > 10 ? 'badge-warning' : null,
        color: 'warning',
        sparkline: [15, 12, 18, 14, 16, 12, 15, 13, 11, 12],
      },
      {
        icon: 'bed',
        label: 'Allocated Beds',
        value: `${stats.allocatedBeds.used}/${stats.allocatedBeds.total}`,
        progress: occupancyPercent,
        color: 'success',
        sparkline: [80, 82, 85, 83, 86, 88, 87, 89, 90, 91],
      },
      {
        icon: 'complaint',
        label: 'Active Complaints',
        value: stats.activeComplaints,
        badge: stats.activeComplaints > 5 ? 'badge-danger' : 'badge-success',
        badgeText: stats.activeComplaints > 5 ? 'Needs attention' : 'Under control',
        color: stats.activeComplaints > 5 ? 'danger' : 'success',
        sparkline: [8, 10, 7, 9, 11, 8, 7, 9, 8, 8],
      },
    ];

    const secondaryCards = [
      {
        icon: 'visitor',
        label: "Today's Visitors",
        value: stats.todayVisitors,
        color: 'info',
      },
      {
        icon: 'announcement',
        label: 'New Announcements',
        value: stats.newAnnouncements,
        color: 'primary',
      },
      {
        icon: 'building',
        label: 'Total Rooms',
        value: stats.allocatedBeds.total,
        color: 'success',
      },
    ];

    return `
      <div class="bento-grid--row1" style="margin-bottom:20px">
        ${cards.map((card, i) => `
          <div class="bento-card spotlight-card fade-in stagger-${i + 1}" data-spotlight>
            <div class="bento-card-header">
              <div class="bento-icon bento-icon--${card.color}">
                ${icons[card.icon] || ''}
              </div>
              ${card.trend ? `
                <div class="bento-trend ${card.trendUp ? 'bento-trend--up' : 'bento-trend--down'}">
                  ${card.trendUp ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>'} ${card.trend}
                </div>
              ` : ''}
              ${card.badge ? `<span class="badge ${card.badge}" style="margin-left:auto">${card.badgeText || ''}</span>` : ''}
            </div>
            <div class="bento-label">${card.label}</div>
            <div class="bento-value">${card.value}</div>
            ${card.progress !== undefined ? `
              <div class="progress" style="margin-top:12px">
                <div class="progress-fill" style="width:${card.progress}%"></div>
              </div>
            ` : ''}
            ${card.sparkline ? `
              <div class="sparkline" style="margin-top:12px">
                ${this.renderSparkline(card.sparkline, card.color)}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      
      <div class="bento-grid--row3" style="margin-bottom:24px">
        ${secondaryCards.map((card, i) => `
          <div class="bento-card fade-in stagger-${i + 5}" style="padding:20px">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="bento-icon bento-icon--${card.color}" style="width:40px;height:40px;margin-bottom:0">
                ${icons[card.icon] || ''}
              </div>
              <div>
                <div class="bento-label" style="margin-bottom:2px">${card.label}</div>
                <div class="bento-value" style="font-size:1.5rem">${card.value}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderSparkline(data, color) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 120;
    const height = 32;
    
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const colorMap = {
      primary: '#D97706',
      success: '#0D9488',
      warning: '#F59E0B',
      danger: '#DC2626',
      info: '#3B82F6',
    };

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:${height}px">
        <polyline points="${points}" fill="none" stroke="${colorMap[color] || colorMap.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  },

  // ============================================
  // QUICK ACTIONS
  // ============================================

  renderQuickActions() {
    const actions = [
      { icon: 'mail', label: 'Review Applications', href: '#admin/applications', primary: true },
      { icon: 'bed', label: 'Manage Rooms', href: '#admin/rooms', primary: false },
      { icon: 'announcement', label: 'Post Announcement', href: '#admin/announcements', primary: false },
      { icon: 'bar-chart', label: 'View Reports', href: '#admin/reports', primary: false },
    ];

    return `
      <div class="quick-actions fade-in stagger-4" style="margin-bottom:24px">
        ${actions.map(action => `
          <a href="${action.href}" class="quick-action-btn ${action.primary ? 'quick-action-btn--primary magnetic-btn ripple-btn' : 'quick-action-btn--secondary'}">
            ${icons[action.icon] || ''}
            ${action.label}
          </a>
        `).join('')}
      </div>
    `;
  },

  // ============================================
  // RECENT APPLICATIONS TABLE
  // ============================================

  renderRecentApplications() {
    return `
      <div class="card fade-in stagger-5" style="padding:0;overflow:hidden">
        <div class="data-table-header">
          <h3 class="data-table-title">Recent Applications</h3>
          <a href="#admin/applications" class="section-link">
            View All
            ${icons['chevron-right'] || ''}
          </a>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Applied</th>
                <th>Hostel</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.recentApplications.map((app, i) => `
                <tr class="fade-in stagger-${Math.min(i + 1, 6)}">
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${Utils.getInitials(app.name)}</div>
                      <div>
                        <div style="font-weight:600;font-size:0.9rem">${Utils.sanitize(app.name)}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted)">${Utils.sanitize(app.email)}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-size:0.85rem">${Utils.timeAgo(app.date)}</td>
                  <td style="font-size:0.85rem">${Utils.sanitize(app.hostel)}</td>
                  <td>
                    <span class="badge ${Utils.getStatusColor(app.status)}">${Utils.capitalize(app.status)}</span>
                  </td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn-sm quick-action-btn quick-action-btn--primary" style="padding:6px 12px;font-size:0.75rem" onclick="AdminDashboard.reviewApplication(${app.id})">
                        Review
                      </button>
                      <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 12px;font-size:0.75rem" onclick="AdminDashboard.viewApplication(${app.id})">
                        View
                      </button>
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

  // ============================================
  // ROOM OCCUPANCY OVERVIEW
  // ============================================

  renderRoomOccupancy() {
    return `
      <div class="card fade-in stagger-6" style="padding:20px">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px">
          ${icons['bar-chart'] || ''}
          Room Occupancy
        </h3>
        <div class="occupancy-grid">
          ${this.data.blockOccupancy.map(block => {
            const percent = Math.round((block.occupied / block.total) * 100);
            const status = percent >= 90 ? 'danger' : percent >= 70 ? 'warning' : 'success';
            return `
              <div class="occupancy-block">
                <div class="occupancy-header">
                  <span class="occupancy-name">${block.name}</span>
                  <span class="occupancy-count">${block.occupied}/${block.total}</span>
                </div>
                <div class="progress" style="height:6px">
                  <div class="progress-fill progress-fill--${status}" style="width:${percent}%"></div>
                </div>
                <div class="occupancy-percent">${percent}% occupied</div>
              </div>
            `;
          }).join('')}
        </div>
        <a href="#admin/rooms" class="section-link" style="margin-top:16px;display:flex;justify-content:center">
          Manage Rooms
          ${icons['chevron-right'] || ''}
        </a>
      </div>
    `;
  },

  // ============================================
  // ACTIONS
  // ============================================

  reviewApplication(id) {
    window.location.hash = '#admin/applications';
    setTimeout(() => {
      if (typeof AdminApplications !== 'undefined') {
        AdminApplications.viewApplication(id);
      }
    }, 100);
  },

  viewApplication(id) {
    const app = this.data.recentApplications.find(a => a.id === id);
    if (app) {
      showToast(`${app.name} - ${Utils.capitalize(app.status)}`, 'info');
    }
  },

  init() {
    // Initialize spotlight effects
    document.querySelectorAll('[data-spotlight]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });

    // Initialize magnetic effects
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      if (typeof Animations !== 'undefined') Animations.magneticEffect(btn);
    });

    console.log('[HostelBuddy] Admin Dashboard initialized');
  },
};

window.AdminDashboard = AdminDashboard;
