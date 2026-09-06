/**
 * HostelBuddy Super Admin Settings Page
 * System configuration — reads from Store.settings
 */

const SuperAdminSettings = {

  _getSettings() {
    if (typeof Store !== 'undefined') {
      return Store.getAll('settings');
    }
    return {
      appName: 'HostelBuddy',
      contactEmail: 'admin@hostelbuddy.edu',
      academicYear: '2025-2026',
      applicationDeadline: '2026-03-31',
      maxBedsPerRoom: 4,
    };
  },

  notifications: { email: true, sms: false, push: true },

  render() {
    const s = this._getSettings();
    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.settings || ''}
          System Settings
        </h2>
      </div>
      
      <div class="settings-layout">
        <div class="settings-card fade-in stagger-1">
          <h3 class="settings-section-title">General Settings</h3>
          <div class="form-group">
            <label class="form-label">Application Name</label>
            <input type="text" class="form-input" id="settAppName" value="${Utils.sanitize(s.appName || '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Contact Email</label>
            <input type="email" class="form-input" id="settContactEmail" value="${Utils.sanitize(s.contactEmail || '')}" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Academic Year</label>
              <input type="text" class="form-input" id="settAcademicYear" value="${Utils.sanitize(s.academicYear || '')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Application Deadline</label>
              <input type="date" class="form-input" id="settDeadline" value="${s.applicationDeadline || ''}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Max Beds per Room</label>
            <select class="form-select" id="settMaxBeds">
              <option value="2" ${s.maxBedsPerRoom === 2 ? 'selected' : ''}>2</option>
              <option value="3" ${s.maxBedsPerRoom === 3 ? 'selected' : ''}>3</option>
              <option value="4" ${s.maxBedsPerRoom === 4 ? 'selected' : ''}>4</option>
              <option value="6" ${s.maxBedsPerRoom === 6 ? 'selected' : ''}>6</option>
            </select>
          </div>
        </div>
        
        <div class="settings-card fade-in stagger-2">
          <h3 class="settings-section-title">Notification Settings</h3>
          <div class="settings-toggles">
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Email Notifications</div>
                <div class="settings-toggle-desc">Send email alerts for important updates</div>
              </div>
              <div class="toggle ${this.notifications.email ? 'active' : ''}" onclick="SuperAdminSettings.toggleNotification('email', this)"></div>
            </div>
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">SMS Notifications</div>
                <div class="settings-toggle-desc">Send SMS for critical alerts</div>
              </div>
              <div class="toggle ${this.notifications.sms ? 'active' : ''}" onclick="SuperAdminSettings.toggleNotification('sms', this)"></div>
            </div>
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Push Notifications</div>
                <div class="settings-toggle-desc">Browser push notifications</div>
              </div>
              <div class="toggle ${this.notifications.push ? 'active' : ''}" onclick="SuperAdminSettings.toggleNotification('push', this)"></div>
            </div>
          </div>
        </div>
        
        <div class="settings-card fade-in stagger-3">
          <h3 class="settings-section-title">Data Management</h3>
          <div class="settings-actions">
            <button class="quick-action-btn quick-action-btn--secondary" onclick="SuperAdminSettings.exportData('csv')">
              ${icons.download || ''}
              Export as CSV
            </button>
            <button class="quick-action-btn quick-action-btn--danger" onclick="SuperAdminSettings.resetData()">
              ${icons.refresh || ''}
              Reset Demo Data
            </button>
          </div>
        </div>
        
        <div style="margin-top:24px">
          <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="SuperAdminSettings.saveFromForm()">
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

  saveFromForm() {
    const updates = {
      appName: document.getElementById('settAppName').value,
      contactEmail: document.getElementById('settContactEmail').value,
      academicYear: document.getElementById('settAcademicYear').value,
      applicationDeadline: document.getElementById('settDeadline').value,
      maxBedsPerRoom: parseInt(document.getElementById('settMaxBeds').value),
    };
    
    if (typeof Store !== 'undefined') {
      Store.update('settings', Store.getAll('settings').id || 'settings', updates);
    }
    
    showToast('Settings saved successfully', 'success');
  },

  exportData(format) {
    showToast('Exporting data as ' + format.toUpperCase() + '...', 'info');
    setTimeout(() => showToast('Export complete', 'success'), 1500);
  },

  resetData() {
    if (!confirm('Reset all data to defaults? This will clear all changes.')) return;
    if (typeof Store !== 'undefined') {
      Store.reset();
    }
    this.refresh();
    showToast('Data reset to defaults', 'info');
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      if (typeof Animations !== 'undefined') Animations.magneticEffect(btn);
    });
    console.log('[HostelBuddy] Super Admin Settings initialized');
  },
};

window.SuperAdminSettings = SuperAdminSettings;
