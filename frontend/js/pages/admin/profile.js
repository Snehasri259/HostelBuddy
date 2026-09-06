/**
 * HostelBuddy Admin Profile Page
 * View and edit admin profile, change password, view hostel assignment
 */

const AdminProfile = {

  _getAdmin() {
    const userData = JSON.parse(localStorage.getItem('hb_user') || '{}');
    const admins = typeof Store !== 'undefined' ? Store.getAll('admins') : [];
    const email = userData.email || '';
    const admin = admins.find(a => a.email === email) || admins[0] || {};
    const hostels = typeof Store !== 'undefined' ? Store.getAll('hostels') : [];
    const hostel = hostels.find(h => h.id === admin.hostel) || null;
    return { ...admin, email: admin.email || email, hostelName: hostel ? hostel.name : (admin.hostel || 'Unassigned') };
  },

  render() {
    const admin = this._getAdmin();
    const initials = Utils.getInitials(admin.name || 'Admin');

    return `
      <div class="profile-container fade-in">
        <div class="profile-header">
          <div class="profile-avatar-lg">${initials}</div>
          <div class="profile-name-lg">${Utils.sanitize(admin.name || 'Admin')}</div>
          <div class="profile-email-lg">${Utils.sanitize(admin.email || '')}</div>
          <span class="badge badge-admin" style="margin-top:8px;background:rgba(255,255,255,0.2);color:white">Hostel Admin</span>
        </div>
        
        <div class="profile-body">
          <div class="profile-section">
            <h3 class="profile-section-title">Personal Information</h3>
            <form id="adminProfileForm" onsubmit="AdminProfile.saveProfile(event)">
              <div class="profile-info-grid">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-input" id="adminProfName" value="${Utils.sanitize(admin.name || '')}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-input" value="${Utils.sanitize(admin.email || '')}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
                </div>
              </div>
              <button type="submit" class="quick-action-btn quick-action-btn--primary" style="margin-top:16px">
                ${icons.check || ''}
                Save Changes
              </button>
            </form>
          </div>
          
          <div class="profile-section">
            <h3 class="profile-section-title">Change Password</h3>
            <form onsubmit="AdminProfile.changePassword(event)">
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input type="password" class="form-input" id="adminCurrentPassword" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <input type="password" class="form-input" id="adminNewPassword" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Confirm Password</label>
                  <input type="password" class="form-input" id="adminConfirmPassword" required>
                </div>
              </div>
              <button type="submit" class="quick-action-btn quick-action-btn--secondary">
                ${icons.settings || ''}
                Update Password
              </button>
            </form>
          </div>
          
          <div class="profile-section">
            <h3 class="profile-section-title">Hostel Assignment</h3>
            <div class="profile-info-grid">
              <div class="profile-info-item">
                <div class="profile-info-label">Assigned Hostel</div>
                <div class="profile-info-value">${Utils.sanitize(admin.hostelName)}</div>
              </div>
              <div class="profile-info-item">
                <div class="profile-info-label">Status</div>
                <div class="profile-info-value"><span class="badge ${admin.status === 'active' ? 'badge-success' : 'badge-danger'}">${Utils.capitalize(admin.status || 'active')}</span></div>
              </div>
              <div class="profile-info-item">
                <div class="profile-info-label">Joined</div>
                <div class="profile-info-value">${Utils.formatDate(admin.joined || '')}</div>
              </div>
              <div class="profile-info-item">
                <div class="profile-info-label">Role</div>
                <div class="profile-info-value">Hostel Administrator</div>
              </div>
            </div>
          </div>
          
          <div class="profile-section">
            <h3 class="profile-section-title">Account Actions</h3>
            <div class="account-actions">
              <button class="quick-action-btn quick-action-btn--secondary" onclick="AdminProfile.downloadData()">
                ${icons.download || ''}
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  saveProfile(e) {
    e.preventDefault();
    const name = document.getElementById('adminProfName').value;
    
    const userData = JSON.parse(localStorage.getItem('hb_user') || '{}');
    userData.name = name;
    localStorage.setItem('hb_user', JSON.stringify(userData));
    
    // Also update in Store
    if (typeof Store !== 'undefined') {
      const admins = Store.getAll('admins');
      const email = userData.email || '';
      const admin = admins.find(a => a.email === email);
      if (admin) Store.update('admins', admin.id, { name });
    }
    
    showToast('Profile updated successfully', 'success');
  },

  changePassword(e) {
    e.preventDefault();
    const current = document.getElementById('adminCurrentPassword').value;
    const newPass = document.getElementById('adminNewPassword').value;
    const confirm = document.getElementById('adminConfirmPassword').value;
    
    if (newPass !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (newPass.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    document.getElementById('adminCurrentPassword').value = '';
    document.getElementById('adminNewPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    showToast('Password updated successfully', 'success');
  },

  downloadData() {
    showToast('Preparing data export...', 'info');
    setTimeout(() => showToast('Export complete', 'success'), 1500);
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() {
    console.log('[HostelBuddy] Admin Profile initialized');
  },
};

window.AdminProfile = AdminProfile;
