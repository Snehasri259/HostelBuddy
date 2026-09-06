/**
 * HostelBuddy Admin Announcements Management Page
 * Create, edit, delete, and manage announcements
 */

const AdminAnnouncements = {
  currentFilter: 'all',

  get announcements() {
    return Store.getAll('announcements');
  },

  render() {
    return `
      <div class="section-header" style="margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.announcement || ''}
          Announcements Management
        </h2>
        <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="AdminAnnouncements.openCreateModal()">
          ${icons.plus || ''}
          Create Announcement
        </button>
      </div>
      
      <div class="data-table fade-in stagger-1" style="padding:0;overflow:hidden">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published</th>
                <th>Audience</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.announcements.map((a, i) => `
                <tr class="fade-in stagger-${Math.min(i + 1, 6)}">
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      ${a.pinned ? `<span style="color:var(--warning)">${icons.pin || ''}</span>` : ''}
                      <span style="font-weight:500">${Utils.sanitize(a.title)}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-${a.category === 'Important' ? 'danger' : a.category === 'Event' ? 'success' : a.category === 'Maintenance' ? 'warning' : 'info'}">${Utils.sanitize(a.category)}</span></td>
                  <td><span class="badge ${a.status === 'published' ? 'badge-success' : 'badge-warning'}">${Utils.capitalize(a.status)}</span></td>
                  <td style="font-size:0.85rem">${a.status === 'published' ? Utils.formatDate(a.date) : '-'}</td>
                  <td style="font-size:0.85rem">${Utils.sanitize(a.audience)}</td>
                  <td style="font-family:'JetBrains Mono',monospace;font-size:0.85rem">${a.views}</td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 10px;font-size:0.75rem" onclick="AdminAnnouncements.togglePin(${a.id})" title="${a.pinned ? 'Unpin' : 'Pin'}">
                        ${icons.pin || ''}
                      </button>
                      <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 10px;font-size:0.75rem" onclick="AdminAnnouncements.edit(${a.id})">
                        ${icons.edit || ''}
                      </button>
                      <button class="btn-sm quick-action-btn quick-action-btn--danger" style="padding:6px 10px;font-size:0.75rem" onclick="AdminAnnouncements.delete(${a.id})">
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
      
      ${this.renderCreateEditModal()}
    `;
  },

  renderCreateEditModal() {
    return `
      <div class="modal-overlay hidden" id="announcementModal">
        <div class="modal" style="max-width:600px">
          <div class="modal-header">
            <h3 id="announcementModalTitle">Create Announcement</h3>
            <button class="modal-close" onclick="AdminAnnouncements.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="announcementForm" onsubmit="AdminAnnouncements.save(event)">
              <input type="hidden" id="editAnnouncementId">
              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-input" id="annTitle" placeholder="Announcement title" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <select class="form-select" id="annCategory" required>
                    <option value="General">General</option>
                    <option value="Important">Important</option>
                    <option value="Event">Event</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Audience</label>
                  <select class="form-select" id="annAudience" required>
                    <option value="All Students">All Students</option>
                    <option value="Boys Hostel">Boys Hostel</option>
                    <option value="Girls Hostel">Girls Hostel</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Content</label>
                <textarea class="form-textarea" id="annContent" rows="6" placeholder="Write your announcement..." required></textarea>
              </div>
              <div class="form-group" style="display:flex;align-items:center;gap:12px">
                <label class="form-label" style="margin:0">Pin to top</label>
                <div class="toggle" id="annPinToggle" onclick="this.classList.toggle('active')"></div>
              </div>
              <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border)">
                <button type="button" class="btn-secondary" onclick="AdminAnnouncements.closeModal()">Cancel</button>
                <button type="button" class="quick-action-btn quick-action-btn--secondary" onclick="AdminAnnouncements.saveAsDraft()">Save Draft</button>
                <button type="submit" class="quick-action-btn quick-action-btn--primary">
                  ${icons.check || ''} Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  openCreateModal() {
    document.getElementById('announcementModalTitle').textContent = 'Create Announcement';
    document.getElementById('editAnnouncementId').value = '';
    document.getElementById('announcementForm').reset();
    document.getElementById('annPinToggle').classList.remove('active');
    document.getElementById('announcementModal').classList.remove('hidden');
  },

  edit(id) {
    const ann = this.announcements.find(a => a.id === id);
    if (!ann) return;
    document.getElementById('announcementModalTitle').textContent = 'Edit Announcement';
    document.getElementById('editAnnouncementId').value = id;
    document.getElementById('annTitle').value = ann.title;
    document.getElementById('annCategory').value = ann.category;
    document.getElementById('annAudience').value = ann.audience;
    document.getElementById('annContent').value = ann.content;
    if (ann.pinned) document.getElementById('annPinToggle').classList.add('active');
    else document.getElementById('annPinToggle').classList.remove('active');
    document.getElementById('announcementModal').classList.remove('hidden');
  },

  save(e) {
    e.preventDefault();
    this.saveAnnouncement('published');
  },

  saveAsDraft() {
    this.saveAnnouncement('draft');
  },

  saveAnnouncement(status) {
    const editId = document.getElementById('editAnnouncementId').value;
    const data = {
      title: document.getElementById('annTitle').value,
      category: document.getElementById('annCategory').value,
      audience: document.getElementById('annAudience').value,
      content: document.getElementById('annContent').value,
      pinned: document.getElementById('annPinToggle').classList.contains('active'),
      status,
    };

    if (editId) {
      Store.update('announcements', editId, data);
    } else {
      Store.add('announcements', {
        ...data,
        date: new Date().toISOString(),
        author: 'Admin',
        views: 0,
      });
    }

    this.closeModal();
    this.refresh();
    showToast(status === 'published' ? 'Announcement published' : 'Draft saved', 'success');
  },

  delete(id) {
    if (!confirm('Delete this announcement?')) return;
    Store.remove('announcements', id);
    this.refresh();
    showToast('Announcement deleted', 'info');
  },

  togglePin(id) {
    const ann = Store.getById('announcements', id);
    if (ann) { Store.update('announcements', id, { pinned: !ann.pinned }); this.refresh(); }
  },

  closeModal() {
    document.getElementById('announcementModal')?.classList.add('hidden');
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) { content.innerHTML = this.render(); this.init(); }
  },

  init() {
    console.log('[HostelBuddy] Admin Announcements initialized');
  },
};

window.AdminAnnouncements = AdminAnnouncements;
