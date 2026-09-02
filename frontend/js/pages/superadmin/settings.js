/**
 * HostelBuddy Super Admin Settings Page
 * System configuration and preferences
 */

const SuperAdminSettings = {
  settings: {
    appName: 'HostelBuddy',
    contactEmail: 'admin@hostelbuddy.edu',
    academicYear: '2024-2025',
    applicationDeadline: '2025-02-28',
    maxBedsPerRoom: 4,
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },

  render() {
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
          <form id="settingsForm" onsubmit="SuperAdminSettings.save(event)">
            <div class="form-group">
              <label class="form-label">Application Name</label>
              <input type="text" class="form-input" id="settAppName" value="${Utils.sanitize(this.settings.appName)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Contact Email</label>
              <input type="email" class="form-input" id="settContactEmail" value="${Utils.sanitize(this.settings.contactEmail)}" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Academic Year</label>
                <input type="text" class="form-input" id="settAcademicYear" value="${Utils.sanitize(this.settings.academicYear)}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Application Deadline</label>
                <input type="date" class="form-input" id="settDeadline" value="${this.settings.applicationDeadline}" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Max Beds per Room</label>
              <select class="form-select" id="settMaxBeds">
                <option value="2" ${this.settings.maxBedsPerRoom === 2 ? 'selected' : ''}>2</option>
                <option value="3" ${this.settings.maxBedsPerRoom === 3 ? 'selected' : ''}>3</option>
                <option value="4" ${this.settings.maxBedsPerRoom === 4 ? 'selected' : ''}>4</option>
                <option value="6" ${this.settings.maxBedsPerRoom === 6 ? 'selected' : ''}>6</option>
              </select>
            </div>
          </form>
        </div>
        
        <div class="settings-card fade-in stagger-2">
          <h3 class="settings-section-title">Notification Settings</h3>
          <div class="settings-toggles">
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Email Notifications</div>
                <div class="settings-toggle-desc">Send email alerts for important updates</div>
              </div>
              <div class="toggle ${this.settings.notifications.email ? 'active' : ''}" onclick="SuperAdminSettings.toggleNotification('email', this)"></div>
            </div>
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">SMS Notifications</div>
                <div class="settings-toggle-desc">Send SMS for critical alerts</div>
              </div>
              <div class="toggle ${this.settings.notifications.sms ? 'active' : ''}" onclick="SuperAdminSettings.toggleNotification('sms', this)"></div>
            </div>
            <div class="settings-toggle-row">
              <div>
                <div class="settings-toggle-label">Push Notifications</div>
                <div class="settings-toggle-desc">Browser push notifications</div>
              </div>
              <div class="toggle ${this.settings.notifications.push ? 'active' : ''}" onclick="SuperAdminSettings.toggleNotification('push', this)"></div>
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
            <button class="quick-action-btn quick-action-btn--secondary" onclick="SuperAdminSettings.exportData('pdf')">
              ${icons.download || ''}
              Export as PDF
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
    this.settings.notifications[key] = !this.settings.notifications[key];
    el.classList.toggle('active');
  },

  saveFromForm() {
    this.settings.appName = document.getElementById('settAppName').value;
    this.settings.contactEmail = document.getElementById('settContactEmail').value;
    this.settings.academicYear = document.getElementById('settAcademicYear').value;
    this.settings.applicationDeadline = document.getElementById('settDeadline').value;
    this.settings.maxBedsPerRoom = parseInt(document.getElementById('settMaxBeds').value);
    
    showToast('Settings saved successfully', 'success');
  },

  exportData(format) {
    showToast(`Exporting data as ${format.toUpperCase()}...`, 'info');
    setTimeout(() => showToast('Export complete', 'success'), 1500);
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
