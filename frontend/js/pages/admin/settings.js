/**
 * HostelBuddy Admin Settings Page
 * Hostel-specific preferences and notification settings
 */

const AdminSettings = {

  notifications: { email: true, sms: false, push: true },

  _getHostelInfo() {
    const userData = JSON.parse(localStorage.getItem('hb_user') || '{}');
    const admins = typeof Store !== 'undefined' ? Store.getAll('admins') : [];
    const email = userData.email || '';
    const admin = admins.find(a => a.email === email) || admins[0] || {};
    const hostels = typeof Store !== 'undefined' ? Store.getAll('hostels') : [];
    const hostel = hostels.find(h => h.id === admin.hostel) || null;
    return {
      adminName: admin.name || 'Admin',
      hostelName: hostel ? hostel.name : 'Unassigned',
      hostelType: hostel ? hostel.type : '',
      hostelAddress: hostel ? hostel.address : '',
      hostelId: admin.hostel || null,
    };
  },

  render() {
    const info = this._getHostelInfo();
    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.settings || ''}
          Hostel Settings
        </h2>
      </div>
      
      <div class="settings-layout">
        <div class="settings-card fade-in stagger-1">
          <h3 class="settings-section-title">Hostel Information</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label class="form-label">Hostel Name</label>
              <input type="text" class="form-input" value="${Utils.sanitize(info.hostelName)}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
            </div>
            <div class="form-group">
              <label class="form-label">Hostel Type</label>
              <input type="text" class="form-input" value="${info.hostelType ? Utils.capitalize(info.hostelType) + 's Hostel' : 'N/A'}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label class="form-label">Address</label>
              <input type="text" class="form-input" value="${Utils.sanitize(info.hostelAddress)}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
            </div>
          </div>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-top:8px">Hostel details are managed by the Super Admin. Contact them to update.</p>
        </div>
        
        <div class="settings-card fade-in stagger-2">
          <h3 class="settings-section-title">Notification Preferences</h3>
          <div class="settings-toggles">
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Email Notifications</div>
                <div class="settings-toggle-desc">Receive email alerts for new complaints and applications</div>
              </div>
              <div class="toggle ${this.notifications.email ? 'active' : ''}" onclick="AdminSettings.toggleNotification('email', this)"></div>
            </div>
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Visitor Alerts</div>
                <div class="settings-toggle-desc">Get notified when a visitor is registered</div>
              </div>
              <div class="toggle ${this.notifications.sms ? 'active' : ''}" onclick="AdminSettings.toggleNotification('sms', this)"></div>
            </div>
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Push Notifications</div>
                <div class="settings-toggle-desc">Browser push notifications for urgent matters</div>
              </div>
              <div class="toggle ${this.notifications.push ? 'active' : ''}" onclick="AdminSettings.toggleNotification('push', this)"></div>
            </div>
          </div>
        </div>
        
        <div class="settings-card fade-in stagger-3">
          <h3 class="settings-section-title">Display Preferences</h3>
          <div class="form-group">
            <label class="form-label">Default Complaint View</label>
            <select class="form-select" id="adminDefaultView">
              <option value="all">Show All Complaints</option>
              <option value="pending" selected>Show Pending First</option>
              <option value="open">Show Open Only</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Items Per Page</label>
            <select class="form-select" id="adminPageSize">
              <option value="10" selected>10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        
        <div class="settings-card fade-in stagger-4">
          <h3 class="settings-section-title">Data Management</h3>
          <div class="settings-actions">
            <button class="quick-action-btn quick-action-btn--secondary" onclick="AdminSettings.exportData('csv')">
              ${icons.download || ''}
              Export Hostel Data (CSV)
            </button>
            <button class="quick-action-btn quick-action-btn--secondary" onclick="AdminSettings.exportData('pdf')">
              ${icons.download || ''}
              Export Report (PDF)
            </button>
          </div>
        </div>
        
        <div style="margin-top:24px">
          <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="AdminSettings.saveSettings()">
            ${icons.check || ''}
            Save Settings
          </button>
        </div>
      </div>
    `;
  },

  toggleNotification(key, el) {
    this.notifications[key] = !this.notifications[key];
    el.classList.toggle('active');
  },

  saveSettings() {
    const prefs = {
      defaultView: document.getElementById('adminDefaultView').value,
      pageSize: parseInt(document.getElementById('adminPageSize').value),
    };
    localStorage.setItem('hb_admin_settings', JSON.stringify({ notifications: this.notifications, ...prefs }));
    showToast('Settings saved successfully', 'success');
  },

  exportData(format) {
    showToast('Exporting data as ' + format.toUpperCase() + '...', 'info');
    setTimeout(() => showToast('Export complete', 'success'), 1500);
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() {
    // Load saved settings
    try {
      const saved = JSON.parse(localStorage.getItem('hb_admin_settings') || '{}');
      if (saved.notifications) this.notifications = { ...this.notifications, ...saved.notifications };
      if (saved.defaultView) {
        const el = document.getElementById('adminDefaultView');
        if (el) el.value = saved.defaultView;
      }
      if (saved.pageSize) {
        const el = document.getElementById('adminPageSize');
        if (el) el.value = saved.pageSize;
      }
    } catch (e) { /* ignore */ }
    
    console.log('[HostelBuddy] Admin Settings initialized');
  },
};

window.AdminSettings = AdminSettings;
