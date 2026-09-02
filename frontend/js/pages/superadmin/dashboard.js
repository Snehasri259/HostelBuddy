/**
 * HostelBuddy Super Admin Dashboard
 * System-wide KPIs, charts, and activity feed
 */

const SuperAdminDashboard = {
  data: {
    stats: {
      totalStudents: 450,
      totalHostels: 4,
      totalRooms: 320,
      occupancyRate: 85,
      activeComplaints: 12,
      systemHealth: 98,
    },
    recentActivity: [
      { text: 'New admin registered: Dr. Sharma', time: new Date(Date.now() - 3600000), type: 'success' },
      { text: 'Room Block C updated', time: new Date(Date.now() - 10800000), type: 'info' },
      { text: 'System settings changed', time: new Date(Date.now() - 86400000), type: 'warning' },
      { text: 'Database backup completed', time: new Date(Date.now() - 172800000), type: 'success' },
      { text: 'New hostel added: Girls Hostel B', time: new Date(Date.now() - 259200000), type: 'info' },
    ],
  },

  render() {
    const { stats } = this.data;
    
    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.dashboard || ''}
          Super Admin Dashboard
        </h2>
      </div>
      
      <div class="bento-grid--row1" style="margin-bottom:20px">
        ${this.renderKPICard('users', 'Total Students', stats.totalStudents, '+8% this month', 'success')}
        ${this.renderKPICard('building', 'Total Hostels', stats.totalHostels, '2 boys, 2 girls', 'info')}
        ${this.renderKPICard('bed', 'Rooms', `${stats.totalRooms}`, `${stats.occupancyRate}% occupancy`, 'primary')}
        ${this.renderKPICard('complaint', 'Active Complaints', stats.activeComplaints, stats.activeComplaints > 10 ? 'Needs attention' : 'Under control', stats.activeComplaints > 10 ? 'danger' : 'success')}
      </div>
      
      <div class="bento-grid--row2" style="margin-bottom:24px">
        <div class="bento-card fade-in stagger-5">
          <div class="bento-icon bento-icon--success" style="width:40px;height:40px;margin-bottom:12px">
            ${icons['check-circle'] || ''}
          </div>
          <div class="bento-label">System Health</div>
          <div class="bento-value">${stats.systemHealth}%</div>
          <div class="progress" style="margin-top:12px">
            <div class="progress-fill progress-fill--success" style="width:${stats.systemHealth}%"></div>
          </div>
        </div>
        <div class="bento-card fade-in stagger-6">
          <div class="bento-icon bento-icon--primary" style="width:40px;height:40px;margin-bottom:12px">
            ${icons['bar-chart'] || ''}
          </div>
          <div class="bento-label">Applications This Month</div>
          <div class="bento-value">89</div>
          <div class="bento-trend bento-trend--up">↑ 12% from last month</div>
        </div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 360px;gap:24px">
        <div>
          ${this.renderOccupancyChart()}
        </div>
        <div>
          ${this.renderActivityFeed()}
        </div>
      </div>
      
      ${this.renderQuickActions()}
    `;
  },

  renderKPICard(icon, label, value, trend, color) {
    return `
      <div class="bento-card spotlight-card fade-in stagger-${Math.floor(Math.random() * 4) + 1}" data-spotlight>
        <div class="bento-card-header">
          <div class="bento-icon bento-icon--${color}">${icons[icon] || ''}</div>
        </div>
        <div class="bento-label">${label}</div>
        <div class="bento-value">${value}</div>
        <div class="bento-trend bento-trend--up" style="margin-top:8px">${trend}</div>
      </div>
    `;
  },

  renderOccupancyChart() {
    const hostels = [
      { name: 'Boys A', occupancy: 90 },
      { name: 'Boys B', occupancy: 75 },
      { name: 'Girls A', occupancy: 85 },
      { name: 'Girls B', occupancy: 60 },
    ];

    return `
      <div class="card fade-in stagger-5" style="padding:20px">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:20px">Occupancy by Hostel</h3>
        <div style="display:flex;align-items:flex-end;gap:16px;height:180px;padding:0 20px">
          ${hostels.map(h => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px">
              <span style="font-size:0.75rem;font-weight:600;color:var(--text)">${h.occupancy}%</span>
              <div style="width:100%;background:linear-gradient(180deg,var(--primary) 0%,var(--primary-hover) 100%);border-radius:var(--radius-sm) var(--radius-sm) 0 0;height:${h.occupancy * 1.5}px;transition:height 0.5s ease"></div>
              <span style="font-size:0.75rem;color:var(--text-muted)">${h.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderActivityFeed() {
    return `
      <div class="card fade-in stagger-6" style="padding:20px">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:16px">Recent Activity</h3>
        <div class="activity-feed">
          ${this.data.recentActivity.map((item, i) => `
            <div class="activity-item" style="display:flex;gap:12px;padding:12px 0;${i < this.data.recentActivity.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
              <div class="activity-dot activity-dot--${item.type}" style="width:8px;height:8px;border-radius:50%;background:var(--${item.type === 'success' ? 'secondary' : item.type === 'warning' ? 'warning' : 'info'});margin-top:6px;flex-shrink:0"></div>
              <div>
                <div style="font-size:0.875rem;color:var(--text)">${item.text}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">${Utils.timeAgo(item.time)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderQuickActions() {
    return `
      <div class="quick-actions fade-in" style="margin-top:24px">
        <a href="#superadmin/hostels" class="quick-action-btn quick-action-btn--primary magnetic-btn">
          ${icons.building || ''}
          Manage Hostels
        </a>
        <a href="#superadmin/reports" class="quick-action-btn quick-action-btn--secondary">
          ${icons['bar-chart'] || ''}
          View Reports
        </a>
      </div>
    `;
  },

  init() {
    document.querySelectorAll('[data-spotlight]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
    console.log('[HostelBuddy] Super Admin Dashboard initialized');
  },
};

window.SuperAdminDashboard = SuperAdminDashboard;
