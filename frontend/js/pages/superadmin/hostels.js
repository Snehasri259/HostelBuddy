/**
 * HostelBuddy Super Admin Hostel Management Page
 * View, add, edit hostels
 */

const SuperAdminHostels = {
  hostels: [
    { id: 1, name: 'Boys Hostel A', type: 'boys', capacity: 200, occupied: 180, admin: 'Dr. Sharma', address: 'Block A, Main Campus' },
    { id: 2, name: 'Boys Hostel B', type: 'boys', capacity: 150, occupied: 112, admin: 'Mr. Verma', address: 'Block B, Main Campus' },
    { id: 3, name: 'Girls Hostel A', type: 'girls', capacity: 180, occupied: 153, admin: 'Mrs. Gupta', address: 'Block C, Main Campus' },
    { id: 4, name: 'Girls Hostel B', type: 'girls', capacity: 120, occupied: 72, admin: 'Ms. Joshi', address: 'Block D, Main Campus' },
  ],

  render() {
    return `
      <div class="section-header" style="margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.building || ''}
          Hostel Management
        </h2>
        <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="SuperAdminHostels.openAddModal()">
          ${icons.plus || ''}
          Add Hostel
        </button>
      </div>
      
      <div class="hostel-cards-grid">
        ${this.hostels.map((h, i) => this.renderCard(h, i)).join('')}
      </div>
      
      ${this.renderModal()}
    `;
  },

  renderCard(hostel, index) {
    const occupancy = Math.round((hostel.occupied / hostel.capacity) * 100);
    const statusClass = occupancy >= 90 ? 'danger' : occupancy >= 70 ? 'warning' : 'success';

    return `
      <div class="hostel-management-card fade-in stagger-${Math.min(index + 1, 6)}">
        <div class="hostel-card-header" style="background:linear-gradient(135deg,${hostel.type === 'boys' ? 'var(--primary),var(--primary-hover)' : 'var(--secondary),#0891B2'})">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <h3 style="font-size:1.125rem;font-weight:700;color:white;margin:0">${Utils.sanitize(hostel.name)}</h3>
              <p style="font-size:0.8rem;opacity:0.9;color:white;margin:4px 0 0">${Utils.sanitize(hostel.type === 'boys' ? 'Boys Hostel' : 'Girls Hostel')}</p>
            </div>
            <span class="badge badge-${statusClass}" style="background:rgba(255,255,255,0.2);color:white">${occupancy}% full</span>
          </div>
        </div>
        <div class="hostel-card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:var(--radius-md)">
              <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase">Capacity</div>
              <div style="font-size:1.125rem;font-weight:700;font-family:'JetBrains Mono',monospace">${hostel.capacity}</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--bg-secondary);border-radius:var(--radius-md)">
              <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase">Occupied</div>
              <div style="font-size:1.125rem;font-weight:700;font-family:'JetBrains Mono',monospace">${hostel.occupied}</div>
            </div>
          </div>
          <div class="progress" style="margin-bottom:12px">
            <div class="progress-fill progress-fill--${statusClass}" style="width:${occupancy}%"></div>
          </div>
          <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">
            <strong>Admin:</strong> ${Utils.sanitize(hostel.admin)}
          </div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">${Utils.sanitize(hostel.address)}</div>
          <div style="display:flex;gap:8px">
            <button class="quick-action-btn quick-action-btn--secondary btn-sm" onclick="SuperAdminHostels.edit(${hostel.id})">
              ${icons.edit || ''} Edit
            </button>
            <button class="quick-action-btn quick-action-btn--secondary btn-sm" onclick="window.location.hash='#admin/rooms'">
              ${icons.building || ''} View Rooms
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderModal() {
    return `
      <div class="modal-overlay hidden" id="hostelModal">
        <div class="modal" style="max-width:500px">
          <div class="modal-header">
            <h3 id="hostelModalTitle">Add Hostel</h3>
            <button class="modal-close" onclick="SuperAdminHostels.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="hostelForm" onsubmit="SuperAdminHostels.save(event)">
              <input type="hidden" id="editHostelId">
              <div class="form-group">
                <label class="form-label">Hostel Name</label>
                <input type="text" class="form-input" id="hostelName" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Type</label>
                  <select class="form-select" id="hostelType" required>
                    <option value="boys">Boys Hostel</option>
                    <option value="girls">Girls Hostel</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Capacity</label>
                  <input type="number" class="form-input" id="hostelCapacity" min="10" max="500" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Address</label>
                <input type="text" class="form-input" id="hostelAddress" required>
              </div>
              <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border)">
                <button type="button" class="btn-secondary" onclick="SuperAdminHostels.closeModal()">Cancel</button>
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
    document.getElementById('hostelModalTitle').textContent = 'Add Hostel';
    document.getElementById('editHostelId').value = '';
    document.getElementById('hostelForm').reset();
    document.getElementById('hostelModal').classList.remove('hidden');
  },

  edit(id) {
    const hostel = this.hostels.find(h => h.id === id);
    if (!hostel) return;
    document.getElementById('hostelModalTitle').textContent = 'Edit Hostel';
    document.getElementById('editHostelId').value = id;
    document.getElementById('hostelName').value = hostel.name;
    document.getElementById('hostelType').value = hostel.type;
    document.getElementById('hostelCapacity').value = hostel.capacity;
    document.getElementById('hostelAddress').value = hostel.address;
    document.getElementById('hostelModal').classList.remove('hidden');
  },

  save(e) {
    e.preventDefault();
    const editId = document.getElementById('editHostelId').value;
    const data = {
      name: document.getElementById('hostelName').value,
      type: document.getElementById('hostelType').value,
      capacity: parseInt(document.getElementById('hostelCapacity').value),
      address: document.getElementById('hostelAddress').value,
    };

    if (editId) {
      const hostel = this.hostels.find(h => h.id === parseInt(editId));
      if (hostel) Object.assign(hostel, data);
    } else {
      this.hostels.push({ id: Date.now(), ...data, occupied: 0, admin: 'Not assigned' });
    }

    this.closeModal();
    this.refresh();
    showToast('Hostel saved successfully', 'success');
  },

  closeModal() {
    document.getElementById('hostelModal')?.classList.add('hidden');
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() { console.log('[HostelBuddy] Super Admin Hostels initialized'); },
};

window.SuperAdminHostels = SuperAdminHostels;
