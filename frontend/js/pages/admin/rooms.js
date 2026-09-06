/**
 * HostelBuddy Admin Room Management Page
 * Room hierarchy, room cards, add/edit/delete rooms
 */

const AdminRooms = {
  rooms: [],
  expandedSections: new Set(),
  currentHostel: 'all',
  currentBlock: 'all',
  currentFloor: 'all',

  init() {
    this.generateRooms();
    this.expandedSections.add('boys');
    console.log('[HostelBuddy] Admin Rooms initialized');
  },

  generateRooms() {
    this.rooms = [];
    if (typeof Store !== 'undefined') {
      const storeRooms = Store.getAll('rooms');
      const storeBeds = Store.getAll('beds');
      const hostels = Store.getAll('hostels');
      const students = Store.getAll('students');
      storeRooms.forEach(room => {
        const hostel = hostels.find(h => h.id === room.hostelId);
        const roomBeds = storeBeds.filter(b => b.roomId === room.id);
        this.rooms.push({
          id: room.id,
          hostel: hostel ? (hostel.type === 'boys' ? 'boys' : 'girls') : 'boys',
          hostelName: hostel ? hostel.name : 'Unknown',
          block: room.block,
          floor: room.floor,
          number: room.number,
          beds: roomBeds.map(b => {
            const student = b.studentId ? students.find(s => s.id === b.studentId) : null;
            return { number: b.number, occupied: b.status === 'occupied', student: student ? student.name : null };
          }),
          totalBeds: room.capacity || 4,
          occupiedBeds: roomBeds.filter(b => b.status === 'occupied').length,
        });
      });
    } else {
      // Fallback: empty
      this.rooms = [];
    }
  },

  render() {
    const filteredRooms = this.getFilteredRooms();

    return `
      <div class="section-header" style="margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.building || ''}
          Rooms & Beds
        </h2>
        <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="AdminRooms.openAddRoomModal()">
          ${icons.plus || ''}
          Add Room
        </button>
      </div>
      
      ${this.renderFilters()}
      
      <div class="rooms-layout">
        <div class="rooms-hierarchy fade-in stagger-2">
          ${this.renderHierarchy()}
        </div>
        <div class="rooms-grid fade-in stagger-3">
          ${this.renderRoomCards(filteredRooms)}
        </div>
      </div>
      
      ${this.renderRoomDetailModal()}
      ${this.renderAddEditRoomModal()}
    `;
  },

  getFilteredRooms() {
    return this.rooms.filter(room => {
      if (this.currentHostel !== 'all' && room.hostel !== this.currentHostel) return false;
      if (this.currentBlock !== 'all' && room.block !== this.currentBlock) return false;
      if (this.currentFloor !== 'all' && room.floor !== parseInt(this.currentFloor)) return false;
      return true;
    });
  },

  // ============================================
  // FILTERS
  // ============================================

  renderFilters() {
    return `
      <div class="filter-bar fade-in stagger-1" style="margin-bottom:24px">
        <div class="filter-group">
          <label class="filter-label">Hostel</label>
          <select class="form-select" onchange="AdminRooms.setFilter('hostel', this.value)" style="min-width:140px">
            <option value="all">All Hostels</option>
            <option value="boys">Boys Hostel</option>
            <option value="girls">Girls Hostel</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Block</label>
          <select class="form-select" onchange="AdminRooms.setFilter('block', this.value)" style="min-width:120px">
            <option value="all">All Blocks</option>
            <option value="A">Block A</option>
            <option value="B">Block B</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Floor</label>
          <select class="form-select" onchange="AdminRooms.setFilter('floor', this.value)" style="min-width:120px">
            <option value="all">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
          </select>
        </div>
      </div>
    `;
  },

  setFilter(type, value) {
    if (type === 'hostel') this.currentHostel = value;
    if (type === 'block') this.currentBlock = value;
    if (type === 'floor') this.currentFloor = value;
    this.refresh();
  },

  // ============================================
  // HIERARCHY VIEW
  // ============================================

  renderHierarchy() {
    const hostels = [
      { id: 'boys', name: 'Boys Hostel', blocks: ['A', 'B'] },
      { id: 'girls', name: 'Girls Hostel', blocks: ['A', 'B'] },
    ];

    return `
      <div class="card" style="padding:16px">
        <h3 style="font-size:0.95rem;font-weight:600;margin-bottom:16px;color:var(--text-secondary)">Hierarchy</h3>
        <div class="hierarchy-tree">
          ${hostels.map(hostel => `
            <div class="hierarchy-item">
              <div class="hierarchy-toggle ${this.expandedSections.has(hostel.id) ? 'expanded' : ''}" onclick="AdminRooms.toggleSection('${hostel.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                <span class="hierarchy-label">${hostel.name}</span>
                <span class="hierarchy-count">${this.getRoomCount(hostel.id)} rooms</span>
              </div>
              ${this.expandedSections.has(hostel.id) ? `
                <div class="hierarchy-children">
                  ${hostel.blocks.map(block => `
                    <div class="hierarchy-item">
                      <div class="hierarchy-toggle ${this.expandedSections.has(`${hostel.id}-${block}`) ? 'expanded' : ''}" onclick="AdminRooms.toggleSection('${hostel.id}-${block}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <span class="hierarchy-label">Block ${block}</span>
                        <span class="hierarchy-count">${this.getRoomCount(hostel.id, block)} rooms</span>
                      </div>
                      ${this.expandedSections.has(`${hostel.id}-${block}`) ? `
                        <div class="hierarchy-children">
                          ${[1, 2, 3].map(floor => `
                            <div class="hierarchy-item">
                              <div class="hierarchy-toggle ${this.expandedSections.has(`${hostel.id}-${block}-${floor}`) ? 'expanded' : ''}" onclick="AdminRooms.toggleSection('${hostel.id}-${block}-${floor}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                <span class="hierarchy-label">Floor ${floor}</span>
                                <span class="hierarchy-count">${this.getRoomCount(hostel.id, block, floor)} rooms</span>
                              </div>
                              ${this.expandedSections.has(`${hostel.id}-${block}-${floor}`) ? `
                                <div class="hierarchy-children hierarchy-children--rooms">
                                  ${this.getRoomsForSection(hostel.id, block, floor).map(room => `
                                    <div class="hierarchy-room" onclick="AdminRooms.viewRoom('${room.id}')">
                                      <span class="hierarchy-room-number">${room.number}</span>
                                      <span class="hierarchy-room-status ${room.occupiedBeds === room.totalBeds ? 'full' : ''}">${room.occupiedBeds}/${room.totalBeds}</span>
                                    </div>
                                  `).join('')}
                                </div>
                              ` : ''}
                            </div>
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  toggleSection(id) {
    if (this.expandedSections.has(id)) {
      this.expandedSections.delete(id);
    } else {
      this.expandedSections.add(id);
    }
    this.refresh();
  },

  getRoomCount(hostel, block, floor) {
    return this.rooms.filter(r => {
      if (hostel && r.hostel !== hostel) return false;
      if (block && r.block !== block) return false;
      if (floor && r.floor !== floor) return false;
      return true;
    }).length;
  },

  getRoomsForSection(hostel, block, floor) {
    return this.rooms.filter(r => r.hostel === hostel && r.block === block && r.floor === floor);
  },

  // ============================================
  // ROOM CARDS GRID
  // ============================================

  renderRoomCards(rooms) {
    return `
      <div class="room-grid">
        ${rooms.slice(0, 20).map((room, i) => `
          <div class="room-card fade-in stagger-${Math.min(i + 1, 6)}" onclick="AdminRooms.viewRoom('${room.id}')">
            <div class="room-card-header">
              <div>
                <div class="room-card-number">${room.number}</div>
                <div class="room-card-location">${room.hostelName} - Block ${room.block}, Floor ${room.floor}</div>
              </div>
              <span class="badge ${room.occupiedBeds === room.totalBeds ? 'badge-danger' : room.occupiedBeds >= room.totalBeds - 1 ? 'badge-warning' : 'badge-success'}">
                ${room.occupiedBeds === room.totalBeds ? 'Full' : `${room.totalBeds - room.occupiedBeds} available`}
              </span>
            </div>
            <div class="room-card-body">
              <div class="bed-visual-grid">
                ${room.beds.map(bed => `
                  <div class="bed-visual ${bed.occupied ? 'bed-visual--occupied' : 'bed-visual--available'}">
                    ${bed.occupied ? `
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    ` : `
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    `}
                  </div>
                `).join('')}
              </div>
              <div class="room-card-footer">
                <span>${room.occupiedBeds}/${room.totalBeds} beds</span>
              </div>
            </div>
          </div>
        `).join('')}
        ${rooms.length > 20 ? `
          <div class="room-card room-card--more" style="display:flex;align-items:center;justify-content:center;min-height:160px">
            <span style="color:var(--text-secondary)">+${rooms.length - 20} more rooms</span>
          </div>
        ` : ''}
      </div>
    `;
  },

  // ============================================
  // ROOM DETAIL MODAL
  // ============================================

  renderRoomDetailModal() {
    return `
      <div class="modal-overlay hidden" id="roomDetailModal">
        <div class="modal" style="max-width:550px">
          <div class="modal-header">
            <h3 id="roomDetailTitle">Room Details</h3>
            <button class="modal-close" onclick="AdminRooms.closeModal('roomDetailModal')">&times;</button>
          </div>
          <div class="modal-body" id="roomDetailBody">
            <!-- Content loaded dynamically -->
          </div>
        </div>
      </div>
    `;
  },

  viewRoom(roomId) {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return;

    document.getElementById('roomDetailTitle').textContent = `Room ${room.number}`;
    
    const content = `
      <div style="text-align:center;margin-bottom:20px">
        <p style="color:var(--text-secondary)">${room.hostelName} - Block ${room.block}, Floor ${room.floor}</p>
        <span class="badge ${room.occupiedBeds === room.totalBeds ? 'badge-danger' : 'badge-success'}" style="margin-top:8px">
          ${room.occupiedBeds}/${room.totalBeds} beds occupied
        </span>
      </div>
      
      <div class="bed-detail-grid">
        ${room.beds.map(bed => `
          <div class="bed-detail-item ${bed.occupied ? 'bed-detail-item--occupied' : 'bed-detail-item--available'}">
            <div class="bed-detail-number">Bed ${bed.number}</div>
            ${bed.occupied ? `
              <div class="bed-detail-student">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                ${Utils.sanitize(bed.student)}
              </div>
              <button class="btn-sm quick-action-btn quick-action-btn--danger" style="margin-top:8px;padding:4px 10px;font-size:0.7rem" onclick="AdminRooms.deallocateBed('${roomId}', ${bed.number})">
                ${icons.delete || ''} Deallocate
              </button>
            ` : `
              <div class="bed-detail-status">Available</div>
            `}
          </div>
        `).join('')}
      </div>
      
      <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border);margin-top:20px">
        <button class="btn-secondary" onclick="AdminRooms.deleteRoom('${roomId}')">
          ${icons.delete || ''}
          Delete Room
        </button>
        <button class="quick-action-btn quick-action-btn--secondary" onclick="AdminRooms.closeModal('roomDetailModal'); AdminRooms.editRoom('${roomId}')">
          ${icons.edit || ''}
          Edit Room
        </button>
      </div>
    `;

    document.getElementById('roomDetailBody').innerHTML = content;
    document.getElementById('roomDetailModal').classList.remove('hidden');
  },

  // ============================================
  // ADD/EDIT ROOM MODAL
  // ============================================

  renderAddEditRoomModal() {
    return `
      <div class="modal-overlay hidden" id="addEditRoomModal">
        <div class="modal" style="max-width:450px">
          <div class="modal-header">
            <h3 id="addEditRoomTitle">Add Room</h3>
            <button class="modal-close" onclick="AdminRooms.closeModal('addEditRoomModal')">&times;</button>
          </div>
          <div class="modal-body">
            <form id="addEditRoomForm" onsubmit="AdminRooms.saveRoom(event)">
              <input type="hidden" id="editRoomId">
              <div class="form-group">
                <label class="form-label">Hostel</label>
                <select class="form-select" id="roomHostel" required>
                  <option value="">Select Hostel</option>
                  <option value="boys">Boys Hostel</option>
                  <option value="girls">Girls Hostel</option>
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Block</label>
                  <select class="form-select" id="roomBlock" required>
                    <option value="">Select</option>
                    <option value="A">Block A</option>
                    <option value="B">Block B</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Floor</label>
                  <select class="form-select" id="roomFloor" required>
                    <option value="">Select</option>
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Room Number</label>
                  <input type="number" class="form-input" id="roomNumber" min="101" max="305" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Number of Beds</label>
                  <select class="form-select" id="roomBeds" required>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4" selected>4 Beds</option>
                    <option value="6">6 Beds</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border);margin-top:16px">
                <button type="button" class="btn-secondary" onclick="AdminRooms.closeModal('addEditRoomModal')">Cancel</button>
                <button type="submit" class="quick-action-btn quick-action-btn--primary">
                  ${icons.check || ''}
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  openAddRoomModal() {
    document.getElementById('addEditRoomTitle').textContent = 'Add Room';
    document.getElementById('editRoomId').value = '';
    document.getElementById('addEditRoomForm').reset();
    document.getElementById('addEditRoomModal').classList.remove('hidden');
  },

  editRoom(roomId) {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return;

    document.getElementById('addEditRoomTitle').textContent = 'Edit Room';
    document.getElementById('editRoomId').value = roomId;
    document.getElementById('roomHostel').value = room.hostel;
    document.getElementById('roomBlock').value = room.block;
    document.getElementById('roomFloor').value = room.floor;
    document.getElementById('roomNumber').value = room.number;
    document.getElementById('roomBeds').value = room.totalBeds;
    document.getElementById('addEditRoomModal').classList.remove('hidden');
  },

  saveRoom(e) {
    e.preventDefault();
    const editId = document.getElementById('editRoomId').value;
    
    const roomData = {
      hostel: document.getElementById('roomHostel').value,
      hostelName: document.getElementById('roomHostel').value === 'boys' ? 'Boys Hostel' : 'Girls Hostel',
      block: document.getElementById('roomBlock').value,
      floor: parseInt(document.getElementById('roomFloor').value),
      number: parseInt(document.getElementById('roomNumber').value),
      totalBeds: parseInt(document.getElementById('roomBeds').value),
    };

    if (editId) {
      // Edit existing room
      const room = this.rooms.find(r => r.id === editId);
      if (room) {
        Object.assign(room, roomData);
        showToast('Room updated successfully', 'success');
      }
    } else {
      // Add new room
      const newRoom = {
        id: `${roomData.hostel}-${roomData.block}-${roomData.floor}-${Date.now()}`,
        ...roomData,
        beds: Array.from({ length: roomData.totalBeds }, (_, i) => ({
          number: i + 1,
          occupied: false,
          student: null,
        })),
        occupiedBeds: 0,
      };
      this.rooms.push(newRoom);
      showToast('Room added successfully', 'success');
    }

    this.closeModal('addEditRoomModal');
    this.refresh();
  },

  deleteRoom(roomId) {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) return;
    
    const room = this.rooms.find(r => r.id === roomId);
    if (room && room.occupiedBeds > 0) {
      showToast('Cannot delete room with occupied beds', 'error');
      return;
    }

    this.rooms = this.rooms.filter(r => r.id !== roomId);
    this.closeModal('roomDetailModal');
    this.refresh();
    showToast('Room deleted successfully', 'info');
  },

  deallocateBed(roomId, bedNumber) {
    if (!confirm('Are you sure you want to deallocate this bed?')) return;
    
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      const bed = room.beds.find(b => b.number === bedNumber);
      if (bed) {
        bed.occupied = false;
        bed.student = null;
        room.occupiedBeds--;
        this.viewRoom(roomId); // Refresh modal
        showToast('Bed deallocated successfully', 'info');
      }
    }
  },

  closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('hidden');
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = this.render();
      this.init();
    }
  },
};

window.AdminRooms = AdminRooms;
