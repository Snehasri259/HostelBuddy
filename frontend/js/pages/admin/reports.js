/**
 * HostelBuddy Reports Page
 * Occupancy, applications, complaints, and visitors reports
 */

const Reports = {
  currentReport: 'occupancy',

  render() {
    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons['bar-chart'] || ''}
          Reports
        </h2>
      </div>
      
      <div class="reports-grid fade-in stagger-1">
        ${this.renderReportTypeCard('occupancy', 'Occupancy Report', 'View room and bed occupancy statistics')}
        ${this.renderReportTypeCard('applications', 'Applications Report', 'Application trends and statistics')}
        ${this.renderReportTypeCard('complaints', 'Complaints Report', 'Complaint analysis and resolution times')}
        ${this.renderReportTypeCard('visitors', 'Visitors Report', 'Visitor frequency and patterns')}
      </div>
      
      <div class="report-content fade-in stagger-2" id="reportContent">
        ${this.renderReport()}
      </div>
    `;
  },

  renderReportTypeCard(type, title, desc) {
    return `
      <div class="report-type-card ${this.currentReport === type ? 'active' : ''}" onclick="Reports.switchReport('${type}')">
        <div class="report-type-icon">${icons[type === 'occupancy' ? 'bed' : type === 'applications' ? 'mail' : type === 'complaints' ? 'complaint' : 'visitor'] || ''}</div>
        <div class="report-type-title">${title}</div>
        <div class="report-type-desc">${desc}</div>
      </div>
    `;
  },

  renderReport() {
    switch (this.currentReport) {
      case 'occupancy': return this.renderOccupancyReport();
      case 'applications': return this.renderApplicationsReport();
      case 'complaints': return this.renderComplaintsReport();
      case 'visitors': return this.renderVisitorsReport();
      default: return '';
    }
  },

  renderOccupancyReport() {
    const data = [
      { name: 'Boys A', capacity: 200, occupied: 180 },
      { name: 'Boys B', capacity: 150, occupied: 112 },
      { name: 'Girls A', capacity: 180, occupied: 153 },
      { name: 'Girls B', capacity: 120, occupied: 72 },
    ];

    return `
      <div class="report-header">
        <h3 class="report-title">Occupancy Report</h3>
        <div class="report-actions">
          <button class="quick-action-btn quick-action-btn--secondary btn-sm" onclick="Reports.export('csv')">
            ${icons.download || ''} CSV
          </button>
          <button class="quick-action-btn quick-action-btn--secondary btn-sm" onclick="Reports.export('pdf')">
            ${icons.download || ''} PDF
          </button>
        </div>
      </div>
      
      <div class="report-chart">
        <div class="chart-bars">
          ${data.map(d => {
            const percent = Math.round((d.occupied / d.capacity) * 100);
            return `
              <div class="chart-bar-item">
                <div class="chart-bar-value">${percent}%</div>
                <div class="chart-bar" style="height:${percent * 1.8}px"></div>
                <div class="chart-bar-label">${d.name}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div class="table-container">
        <table class="table">
          <thead>
            <tr><th>Hostel</th><th>Capacity</th><th>Occupied</th><th>Available</th><th>Occupancy</th></tr>
          </thead>
          <tbody>
            ${data.map(d => `
              <tr>
                <td style="font-weight:500">${d.name}</td>
                <td>${d.capacity}</td>
                <td>${d.occupied}</td>
                <td>${d.capacity - d.occupied}</td>
                <td><span class="badge ${Math.round(d.occupied/d.capacity*100) >= 90 ? 'badge-danger' : 'badge-success'}">${Math.round(d.occupied/d.capacity*100)}%</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderApplicationsReport() {
    return `
      <div class="report-header">
        <h3 class="report-title">Applications Report</h3>
        <div class="report-actions">
          <button class="quick-action-btn quick-action-btn--secondary btn-sm" onclick="Reports.export('csv')">${icons.download || ''} CSV</button>
        </div>
      </div>
      <div class="report-chart">
        <div class="chart-bars">
          ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => {
            const val = [45, 52, 38, 65, 48, 72][i];
            return `<div class="chart-bar-item"><div class="chart-bar-value">${val}</div><div class="chart-bar" style="height:${val * 2.5}px"></div><div class="chart-bar-label">${m}</div></div>`;
          }).join('')}
        </div>
      </div>
      <div class="stats-row" style="grid-template-columns:repeat(3,1fr);gap:16px">
        <div class="stat-mini stat-mini--success"><div class="stat-mini-label">Approved</div><div class="stat-mini-value">142</div></div>
        <div class="stat-mini stat-mini--warning"><div class="stat-mini-label">Pending</div><div class="stat-mini-value">23</div></div>
        <div class="stat-mini"><div class="stat-mini-label">Rejected</div><div class="stat-mini-value" style="color:var(--danger)">15</div></div>
      </div>
    `;
  },

  renderComplaintsReport() {
    return `
      <div class="report-header">
        <h3 class="report-title">Complaints Report</h3>
        <div class="report-actions">
          <button class="quick-action-btn quick-action-btn--secondary btn-sm" onclick="Reports.export('csv')">${icons.download || ''} CSV</button>
        </div>
      </div>
      <div class="report-chart">
        <div class="chart-bars">
          ${[{ cat: 'Maintenance', val: 35 }, { cat: 'Cleanliness', val: 20 }, { cat: 'Noise', val: 15 }, { cat: 'Security', val: 8 }, { cat: 'Other', val: 5 }].map(d => `
            <div class="chart-bar-item"><div class="chart-bar-value">${d.val}</div><div class="chart-bar" style="height:${d.val * 4}px;background:linear-gradient(180deg,var(--warning),var(--danger))"></div><div class="chart-bar-label">${d.cat}</div></div>
          `).join('')}
        </div>
      </div>
      <div class="stats-row" style="grid-template-columns:repeat(3,1fr);gap:16px">
        <div class="stat-mini stat-mini--warning"><div class="stat-mini-label">Open</div><div class="stat-mini-value">18</div></div>
        <div class="stat-mini"><div class="stat-mini-label">In Progress</div><div class="stat-mini-value" style="color:var(--info)">12</div></div>
        <div class="stat-mini stat-mini--success"><div class="stat-mini-label">Resolved</div><div class="stat-mini-value">53</div></div>
      </div>
    `;
  },

  renderVisitorsReport() {
    return `
      <div class="report-header">
        <h3 class="report-title">Visitors Report</h3>
        <div class="report-actions">
          <button class="quick-action-btn quick-action-btn--secondary btn-sm" onclick="Reports.export('csv')">${icons.download || ''} CSV</button>
        </div>
      </div>
      <div class="report-chart">
        <div class="chart-bars">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
            const val = [12, 8, 15, 10, 18, 25, 20][i];
            return `<div class="chart-bar-item"><div class="chart-bar-value">${val}</div><div class="chart-bar" style="height:${val * 4}px;background:linear-gradient(180deg,var(--secondary),#0891B2)"></div><div class="chart-bar-label">${d}</div></div>`;
          }).join('')}
        </div>
      </div>
      <div class="stats-row" style="grid-template-columns:repeat(3,1fr);gap:16px">
        <div class="stat-mini stat-mini--success"><div class="stat-mini-label">Today</div><div class="stat-mini-value">7</div></div>
        <div class="stat-mini"><div class="stat-mini-label">This Week</div><div class="stat-mini-value">108</div></div>
        <div class="stat-mini"><div class="stat-mini-label">This Month</div><div class="stat-mini-value">425</div></div>
      </div>
    `;
  },

  switchReport(type) {
    this.currentReport = type;
    this.refresh();
  },

  export(format) {
    showToast(`Exporting report as ${format.toUpperCase()}...`, 'info');
    setTimeout(() => showToast('Export complete', 'success'), 1500);
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() { console.log('[HostelBuddy] Reports initialized'); },
};

window.Reports = Reports;
