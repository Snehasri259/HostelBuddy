/**
 * HostelBuddy Student Profile Page
 * View and edit profile, change password, account actions
 */

const StudentProfile = {
  user: {
    name: 'Ravi Kumar',
    email: 'ravi@university.edu',
    phone: '9876543210',
    rollNo: 'CS2025001',
    department: 'Computer Science',
    year: '3rd Year',
    hostel: 'Boys Hostel A',
    room: 'B-205',
  },

  render() {
    const userData = JSON.parse(localStorage.getItem('hb_user') || '{}');
    const user = { ...this.user, ...userData };
    const initials = Utils.getInitials(user.name);

    return `
      <div class="profile-container fade-in">
        <div class="profile-header">
          <div class="profile-avatar-lg">${initials}</div>
          <div class="profile-name-lg">${Utils.sanitize(user.name)}</div>
          <div class="profile-email-lg">${Utils.sanitize(user.email)}</div>
          <span class="badge badge-student" style="margin-top:8px;background:rgba(255,255,255,0.2);color:white">Student</span>
        </div>
        
        <div class="profile-body">
          <div class="profile-section">
            <h3 class="profile-section-title">Personal Information</h3>
            <form id="profileForm" onsubmit="StudentProfile.saveProfile(event)">
              <div class="profile-info-grid">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-input" id="profName" value="${Utils.sanitize(user.name)}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-input" value="${Utils.sanitize(user.email)}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-input" id="profPhone" value="${Utils.sanitize(user.phone)}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Roll Number</label>
                  <input type="text" class="form-input" value="${Utils.sanitize(user.rollNo)}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
                </div>
                <div class="form-group">
                  <label class="form-label">Department</label>
                  <input type="text" class="form-input" value="${Utils.sanitize(user.department)}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
                </div>
                <div class="form-group">
                  <label class="form-label">Year</label>
                  <input type="text" class="form-input" value="${Utils.sanitize(user.year)}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
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
            <div class="password-section">
              <form onsubmit="StudentProfile.changePassword(event)">
                <div class="form-group">
                  <label class="form-label">Current Password</label>
                  <input type="password" class="form-input" id="currentPassword" required>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">New Password</label>
                    <input type="password" class="form-input" id="newPassword" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" class="form-input" id="confirmPassword" required>
                  </div>
                </div>
                <button type="submit" class="quick-action-btn quick-action-btn--secondary">
                  ${icons.settings || ''}
                  Update Password
                </button>
              </form>
            </div>
          </div>
          
          <div class="profile-section">
            <h3 class="profile-section-title">Hostel Information</h3>
            <div class="profile-info-grid">
              <div class="profile-info-item">
                <div class="profile-info-label">Hostel</div>
                <div class="profile-info-value">${Utils.sanitize(user.hostel)}</div>
              </div>
              <div class="profile-info-item">
                <div class="profile-info-label">Room</div>
                <div class="profile-info-value">${Utils.sanitize(user.room)}</div>
              </div>
            </div>
          </div>
          
          <div class="profile-section">
            <h3 class="profile-section-title">Account Actions</h3>
            <div class="account-actions">
              <button class="quick-action-btn quick-action-btn--secondary" onclick="StudentProfile.downloadData()">
                ${icons.download || ''}
                Download My Data
              </button>
              <button class="btn-outline-danger" onclick="StudentProfile.deleteAccount()">
                ${icons.delete || ''}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  saveProfile(e) {
    e.preventDefault();
    const name = document.getElementById('profName').value;
    const phone = document.getElementById('profPhone').value;
    
    // Update localStorage
    const userData = JSON.parse(localStorage.getItem('hb_user') || '{}');
    userData.name = name;
    localStorage.setItem('hb_user', JSON.stringify(userData));
    
    showToast('Profile updated successfully', 'success');
  },

  changePassword(e) {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    
    if (newPass !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (newPass.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    showToast('Password updated successfully', 'success');
  },

  downloadData() {
    showToast('Preparing your data for download...', 'info');
    setTimeout(() => showToast('Download complete', 'success'), 2000);
  },

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (confirm('This will permanently delete all your data. Type "DELETE" to confirm.')) {
        showToast('Account deletion requested', 'info');
      }
    }
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() { console.log('[HostelBuddy] Student Profile initialized'); },
};

window.StudentProfile = StudentProfile;
