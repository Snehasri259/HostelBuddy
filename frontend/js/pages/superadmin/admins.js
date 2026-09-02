/**
 * HostelBuddy Super Admin Admin Management Page
 * View, add, manage hostel admins
 */

const SuperAdminAdmins = {
  admins: [
    { id: 1, name: 'Dr. Sharma', email: 'sharma@uni.edu', hostel: 'Boys Hostel A', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Mr. Verma', email: 'verma@uni.edu', hostel: 'Boys Hostel B', status: 'active', joinDate: '2024-03-20' },
    { id: 3, name: 'Mrs. Gupta', email: 'gupta@uni.edu', hostel: 'Girls Hostel A', status: 'active', joinDate: '2024-02-10' },
    { id: 4, name: 'Ms. Joshi', email: 'joshi@uni.edu', hostel: 'Girls Hostel B', status: 'active', joinDate: '2024-06-01' },
  ],

  render() {
    return `
      <div class="section-header" style="margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.users || ''}
          Admin Management
        </h2>
        <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="SuperAdminAdmins.openAddModal()">
          ${icons.plus || ''}
          Add Admin
        </button>
      </div>
      
      <div class="data-table fade-in stagger-1" style="padding:0;overflow:hidden">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned Hostel</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.admins.map((a, i) => `
                <tr class="fade-in stagger-${Math.min(i + 1, 6)}">
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${Utils.getInitials(a.name)}</div>
                      <span style="font-weight:500">${Utils.sanitize(a.name)}</span>
                    </div>
                  </td>
                  <td style="font-size:0.85rem">${Utils.sanitize(a.email)}</td>
                  <td><span class="badge badge-info">${Utils.sanitize(a.hostel)}</span></td>
                  <td><span class="badge ${a.status === 'active' ? 'badge-success' : 'badge-danger'}">${Utils.capitalize(a.status)}</span></td>
                  <td style="font-size:0.85rem">${Utils.formatDate(a.joinDate)}</td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 10px;font-size:0.75rem" onclick="SuperAdminAdmins.edit(${a.id})">
                        ${icons.edit || ''}
                      </button>
                      <button class="btn-sm quick-action-btn quick-action-btn--danger" style="padding:6px 10px;font-size:0.75rem" onclick="SuperAdminAdmins.toggleStatus(${a.id})">
                        ${icons.delete || ''}
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      ${this.renderModal()}
    `;
  },

  renderModal() {
    return `
      <div class="modal-overlay hidden" id="adminModal">
        <div class="modal" style="max-width:500px">
          <div class="modal-header">
            <h3 id="adminModalTitle">Add Admin</h3>
            <button class="modal-close" onclick="SuperAdminAdmins.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="adminForm" onsubmit="SuperAdminAdmins.save(event)">
              <input type="hidden" id="editAdminId">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="adminName" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="adminEmail" required>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" id="adminPassword" ${document.getElementById('editAdminId')?.value ? '' : 'required'}>
              </div>
              <div class="form-group">
                <label class="form-label">Assign Hostel</label>
                <select class="form-select" id="adminHostel" required>
                  <option value="">Select Hostel</option>
                  <option value="Boys Hostel A">Boys Hostel A</option>
                  <option value="Boys Hostel B">Boys Hostel B</option>
                  <option value="Girls Hostel A">Girls Hostel A</option>
                  <option value="Girls Hostel B">Girls Hostel B</option>
                </select>
              </div>
              <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border)">
                <button type="button" class="btn-secondary" onclick="SuperAdminAdmins.closeModal()">Cancel</button>
                <button type="submit" class="quick-action-btn quick-action-btn--primary">
                  ${icons.check || ''} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  openAddModal() {
    document.getElementById('adminModalTitle').textContent = 'Add Admin';
    document.getElementById('editAdminId').value = '';
    document.getElementById('adminForm').reset();
    document.getElementById('adminModal').classList.remove('hidden');
  },

  edit(id) {
    const admin = this.admins.find(a => a.id === id);
    if (!admin) return;
    document.getElementById('adminModalTitle').textContent = 'Edit Admin';
    document.getElementById('editAdminId').value = id;
    document.getElementById('adminName').value = admin.name;
    document.getElementById('adminEmail').value = admin.email;
    document.getElementById('adminHostel').value = admin.hostel;
    document.getElementById('adminModal').classList.remove('hidden');
  },

  save(e) {
    e.preventDefault();
    const editId = document.getElementById('editAdminId').value;
    const data = {
      name: document.getElementById('adminName').value,
      email: document.getElementById('adminEmail').value,
      hostel: document.getElementById('adminHostel').value,
    };

    if (editId) {
      const admin = this.admins.find(a => a.id === parseInt(editId));
      if (admin) Object.assign(admin, data);
    } else {
      this.admins.push({ id: Date.now(), ...data, status: 'active', joinDate: new Date().toISOString().split('T')[0] });
    }

    this.closeModal();
    this.refresh();
    showToast('Admin saved successfully', 'success');
  },

  toggleStatus(id) {
    const admin = this.admins.find(a => a.id === id);
    if (admin) {
      admin.status = admin.status === 'active' ? 'inactive' : 'active';
      this.refresh();
      showToast(`Admin ${admin.status === 'active' ? 'activated' : 'deactivated'}`, 'info');
    }
  },

  closeModal() {
    document.getElementById('adminModal')?.classList.add('hidden');
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() { console.log('[HostelBuddy] Super Admin Admins initialized'); },
};

window.SuperAdminAdmins = SuperAdminAdmins;
