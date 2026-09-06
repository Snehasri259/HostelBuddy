/**
 * HostelBuddy Admin Room Allocation Page
 * Visual room map, allocation table, and bed allocation
 */

const AdminAllocation = {
  allocations: [],

  _loadFromStore() {
    if (typeof Store === 'undefined') return;
    const beds = Store.getAll('beds');
    const students = Store.getAll('students');
    const rooms = Store.getAll('rooms');
    const hostels = Store.getAll('hostels');
    this.allocations = beds.filter(b => b.status === 'occupied').map(b => {
      const room = rooms.find(r => r.id === b.roomId);
      const hostel = room ? hostels.find(h => h.id === room.hostelId) : null;
      const student = students.find(s => s.id === b.studentId);
      return {
        id: b.id,
        studentId: b.studentId,
        studentName: student ? student.name : 'Unknown',
        hostel: hostel ? (hostel.type === 'boys' ? 'boys' : 'girls') : 'boys',
        block: room ? room.block : 'A',
        floor: room ? room.floor : 1,
        room: room ? room.number : 101,
        bed: b.number,
        date: b.allocationDate || '2025-01-20',
      };
    });
  },

  _generateRoomsFromStore() {
    if (typeof Store === 'undefined') return;
    this.rooms = [];
    const storeRooms = Store.getAll('rooms');
    const storeBeds = Store.getAll('beds');
    const hostels = Store.getAll('hostels');

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
        beds: roomBeds.map(b => ({
          number: b.number,
          occupied: b.status === 'occupied',
          allocation: b.studentId ? { studentName: (Store.getById('students', b.studentId) || {}).name || 'Unknown', date: b.allocationDate } : null,
        })),
        totalBeds: room.capacity || 4,
        occupiedBeds: roomBeds.filter(b => b.status === 'occupied').length,
      });
    });
  },

  rooms: [],
  currentHostel: 'all',
  currentBlock: 'all',
  currentFloor: 'all',
  selectedRoom: null,

  init() {
    this._loadFromStore();
    this._generateRoomsFromStore();
    console.log('[HostelBuddy] Admin Allocation initialized');
  },

  generateRooms() {
    this.rooms = [];
    const hostels = [
      { id: 'boys', name: 'Boys Hostel', blocks: ['A', 'B'] },
      { id: 'girls', name: 'Girls Hostel', blocks: ['A', 'B'] },
    ];

    hostels.forEach(hostel => {
      hostel.blocks.forEach(block => {
        for (let floor = 1; floor <= 3; floor++) {
          for (let room = 1; room <= 5; room++) {
            const roomNum = parseInt(`${floor}0${room}`);
            const beds = Array.from({ length: 4 }, (_, i) => {
              const allocation = this.allocations.find(
                a => a.hostel === hostel.id && a.block === block && 
                     a.floor === floor && a.room === roomNum && a.bed === i + 1
              );
              return {
                number: i + 1,
                occupied: !!allocation,
                allocation: allocation || null,
              };
            });

            this.rooms.push({
              id: `${hostel.id}-${block}-${floor}-${room}`,
              hostel: hostel.id,
              hostelName: hostel.name,
              block,
              floor,
              number: roomNum,
              beds,
              totalBeds: 4,
              occupiedBeds: beds.filter(b => b.occupied).length,
            });
          }
        }
      });
    });
  },

  render() {
    const stats = this.getStats();
    const filteredRooms = this.getFilteredRooms();

    return `
      <div class="section-header" style="margin-bottom:24px;flex-wrap:wrap;gap:16px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.bed || ''}
          Room Allocation
        </h2>
        <button class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="AdminAllocation.openAllocateModal()">
          ${icons.plus || ''}
          Allocate New
        </button>
      </div>
      
      <div class="allocation-stats fade-in stagger-1" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
        <div class="stat-mini">
          <div class="stat-mini-label">Total Beds</div>
          <div class="stat-mini-value">${stats.total}</div>
        </div>
        <div class="stat-mini stat-mini--success">
          <div class="stat-mini-label">Available</div>
          <div class="stat-mini-value">${stats.available}</div>
        </div>
        <div class="stat-mini stat-mini--warning">
          <div class="stat-mini-label">Occupied</div>
          <div class="stat-mini-value">${stats.occupied}</div>
        </div>
      </div>
      
      ${this.renderFilters()}
      ${this.renderRoomMap(filteredRooms)}
      ${this.renderAllocationTable()}
      ${this.renderAllocateModal()}
    `;
  },

  getStats() {
    const total = this.rooms.reduce((sum, r) => sum + r.totalBeds, 0);
    const occupied = this.allocations.length;
    return { total, occupied, available: total - occupied };
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
      <div class="filter-bar fade-in stagger-2" style="margin-bottom:24px">
        <div class="filter-group">
          <label class="filter-label">Hostel</label>
          <select class="form-select" onchange="AdminAllocation.setFilter('hostel', this.value)" style="min-width:140px">
            <option value="all">All Hostels</option>
            <option value="boys">Boys Hostel</option>
            <option value="girls">Girls Hostel</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Block</label>
          <select class="form-select" onchange="AdminAllocation.setFilter('block', this.value)" style="min-width:120px">
            <option value="all">All Blocks</option>
            <option value="A">Block A</option>
            <option value="B">Block B</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Floor</label>
          <select class="form-select" onchange="AdminAllocation.setFilter('floor', this.value)" style="min-width:120px">
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
  // VISUAL ROOM MAP
  // ============================================

  renderRoomMap(rooms) {
    // Group rooms by hostel, block, floor
    const grouped = {};
    rooms.forEach(room => {
      const key = `${room.hostelName} - Block ${room.block} - Floor ${room.floor}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(room);
    });

    return `
      <div class="card fade-in stagger-3" style="margin-bottom:24px;padding:20px">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px">
          ${icons.building || ''}
          Room Map
        </h3>
        <div class="room-map-grid">
          ${Object.entries(grouped).map(([section, sectionRooms]) => `
            <div class="room-map-section">
              <div class="room-map-section-title">${section}</div>
              <div class="room-map-rooms">
                ${sectionRooms.map(room => `
                  <div class="room-map-card ${this.getRoomStatusClass(room)}" onclick="AdminAllocation.viewRoom('${room.id}')">
                    <div class="room-map-number">${room.number}</div>
                    <div class="room-map-beds">
                      ${room.beds.map(bed => `
                        <div class="bed-icon ${bed.occupied ? 'bed-icon--occupied' : 'bed-icon--empty'}"></div>
                      `).join('')}
                    </div>
                    <div class="room-map-status">${room.occupiedBeds}/${room.totalBeds}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  getRoomStatusClass(room) {
    if (room.occupiedBeds === room.totalBeds) return 'room-map-card--full';
    if (room.occupiedBeds >= room.totalBeds - 1) return 'room-map-card--almost';
    return 'room-map-card--available';
  },

  // ============================================
  // ALLOCATION TABLE
  // ============================================

  renderAllocationTable() {
    return `
      <div class="data-table fade-in stagger-4" style="padding:0;overflow:hidden">
        <div class="data-table-header">
          <h3 class="data-table-title">Current Allocations (${this.allocations.length})</h3>
          <div style="position:relative">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)">${icons.search || ''}</span>
            <input type="text" class="form-input" placeholder="Search student..." style="padding-left:40px;min-width:200px" oninput="AdminAllocation.searchAllocations(this.value)">
          </div>
        </div>
        <div class="table-container">
          <table class="table" id="allocationTable">
            <thead>
              <tr>
                <th>Student</th>
                <th>Location</th>
                <th>Bed</th>
                <th>Allocated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.allocations.map((alloc, i) => `
                <tr class="fade-in stagger-${Math.min(i + 1, 6)}">
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div class="avatar" style="width:32px;height:32px;font-size:0.7rem">${Utils.getInitials(alloc.studentName)}</div>
                      <span style="font-weight:500">${Utils.sanitize(alloc.studentName)}</span>
                    </div>
                  </td>
                  <td>
                    <span style="font-family:'JetBrains Mono',monospace;font-size:0.85rem">
                      ${alloc.hostel === 'boys' ? 'Boys' : 'Girls'} - ${alloc.block}${alloc.room}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-success">Bed ${alloc.bed}</span>
                  </td>
                  <td style="font-size:0.85rem;color:var(--text-secondary)">${Utils.formatDate(alloc.date)}</td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn-sm quick-action-btn quick-action-btn--secondary" style="padding:6px 10px;font-size:0.75rem" onclick="AdminAllocation.viewAllocation(${alloc.id})">
                        ${icons.eye || ''}
                      </button>
                      <button class="btn-sm quick-action-btn quick-action-btn--danger" style="padding:6px 10px;font-size:0.75rem" onclick="AdminAllocation.deallocateBed(${alloc.id})">
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
    `;
  },

  searchAllocations(query) {
    const rows = document.querySelectorAll('#allocationTable tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    });
  },

  // ============================================
  // ALLOCATE MODAL
  // ============================================

  renderAllocateModal() {
    return `
      <div class="modal-overlay hidden" id="allocateModal">
        <div class="modal" style="max-width:550px">
          <div class="modal-header">
            <h3>Allocate Bed</h3>
            <button class="modal-close" onclick="AdminAllocation.closeAllocateModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="allocateForm" onsubmit="AdminAllocation.submitAllocation(event)">
              <div class="form-group">
                <label class="form-label">Select Student</label>
                <select class="form-select" id="allocStudent" required>
                  <option value="">Choose a student</option>
                  <option value="1">Ravi Kumar (ravi@uni.edu)</option>
                  <option value="2">Priya Singh (priya@uni.edu)</option>
                  <option value="3">Amit Patel (amit@uni.edu)</option>
                  <option value="4">Neha Gupta (neha@uni.edu)</option>
                  <option value="5">Vikram Reddy (vikram@uni.edu)</option>
                </select>
              </div>
              
              <div class="form-divider">
                <span>Select Location</span>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Hostel</label>
                  <select class="form-select" id="allocHostel" required onchange="AdminAllocation.updateAllocBlocks()">
                    <option value="">Select Hostel</option>
                    <option value="boys">Boys Hostel</option>
                    <option value="girls">Girls Hostel</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Block</label>
                  <select class="form-select" id="allocBlock" required onchange="AdminAllocation.updateAllocFloors()">
                    <option value="">Select Block</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Floor</label>
                  <select class="form-select" id="allocFloor" required onchange="AdminAllocation.updateAllocRooms()">
                    <option value="">Select Floor</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Room</label>
                  <select class="form-select" id="allocRoom" required onchange="AdminAllocation.updateAllocBeds()">
                    <option value="">Select Room</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Bed</label>
                <select class="form-select" id="allocBed" required onchange="AdminAllocation.updateBedPreview()">
                  <option value="">Select Bed</option>
                </select>
              </div>
              
              <div class="bed-preview" id="bedPreview" style="display:none">
                <div class="bed-preview-grid">
                  <div class="bed-preview-item" id="bedPreview1">1</div>
                  <div class="bed-preview-item" id="bedPreview2">2</div>
                  <div class="bed-preview-item" id="bedPreview3">3</div>
                  <div class="bed-preview-item" id="bedPreview4">4</div>
                </div>
              </div>
              
              <div class="modal-footer" style="padding:16px 0 0;border-top:1px solid var(--border);margin-top:16px">
                <button type="button" class="btn-secondary" onclick="AdminAllocation.closeAllocateModal()">Cancel</button>
                <button type="submit" class="quick-action-btn quick-action-btn--primary">
                  ${icons.check || ''}
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  openAllocateModal() {
    document.getElementById('allocateModal')?.classList.remove('hidden');
  },

  closeAllocateModal() {
    document.getElementById('allocateModal')?.classList.add('hidden');
    document.getElementById('allocateForm')?.reset();
    document.getElementById('bedPreview').style.display = 'none';
  },

  updateAllocBlocks() {
    const hostel = document.getElementById('allocHostel').value;
    const blockSelect = document.getElementById('allocBlock');
    
    if (!hostel) {
      blockSelect.innerHTML = '<option value="">Select Block</option>';
      return;
    }

    const blocks = ['A', 'B'];
    blockSelect.innerHTML = `
      <option value="">Select Block</option>
      ${blocks.map(b => `<option value="${b}">Block ${b}</option>`).join('')}
    `;
  },

  updateAllocFloors() {
    const floorSelect = document.getElementById('allocFloor');
    floorSelect.innerHTML = `
      <option value="">Select Floor</option>
      <option value="1">Floor 1</option>
      <option value="2">Floor 2</option>
      <option value="3">Floor 3</option>
    `;
  },

  updateAllocRooms() {
    const floor = document.getElementById('allocFloor').value;
    const roomSelect = document.getElementById('allocRoom');
    
    if (!floor) {
      roomSelect.innerHTML = '<option value="">Select Room</option>';
      return;
    }

    const rooms = Array.from({ length: 5 }, (_, i) => parseInt(`${floor}0${i + 1}`));
    roomSelect.innerHTML = `
      <option value="">Select Room</option>
      ${rooms.map(r => `<option value="${r}">Room ${r}</option>`).join('')}
    `;
  },

  updateAllocBeds() {
    const hostel = document.getElementById('allocHostel').value;
    const block = document.getElementById('allocBlock').value;
    const floor = document.getElementById('allocFloor').value;
    const room = document.getElementById('allocRoom').value;
    const bedSelect = document.getElementById('allocBed');
    
    if (!hostel || !block || !floor || !room) {
      bedSelect.innerHTML = '<option value="">Select Bed</option>';
      return;
    }

    const roomData = this.rooms.find(
      r => r.hostel === hostel && r.block === block && 
           r.floor === parseInt(floor) && r.number === parseInt(room)
    );

    if (!roomData) {
      bedSelect.innerHTML = '<option value="">Select Bed</option>';
      return;
    }

    const available = roomData.beds.filter(b => !b.occupied);
    bedSelect.innerHTML = `
      <option value="">Select Bed (${available.length} available)</option>
      ${available.map(b => `<option value="${b.number}">Bed ${b.number}</option>`).join('')}
    `;

    // Show bed preview
    this.renderBedPreview(roomData);
  },

  renderBedPreview(roomData) {
    const preview = document.getElementById('bedPreview');
    preview.style.display = 'block';
    
    roomData.beds.forEach(bed => {
      const el = document.getElementById(`bedPreview${bed.number}`);
      if (el) {
        el.className = `bed-preview-item ${bed.occupied ? 'bed-preview-item--occupied' : 'bed-preview-item--available'}`;
      }
    });
  },

  updateBedPreview() {
    const bedNum = document.getElementById('allocBed').value;
    document.querySelectorAll('.bed-preview-item').forEach(el => {
      el.classList.remove('bed-preview-item--selected');
    });
    if (bedNum) {
      document.getElementById(`bedPreview${bedNum}`)?.classList.add('bed-preview-item--selected');
    }
  },

  submitAllocation(e) {
    e.preventDefault();
    const studentId = document.getElementById('allocStudent').value;
    const bedId = document.getElementById('allocBed').value;
    const hostel = document.getElementById('allocHostel').value;
    const block = document.getElementById('allocBlock').value;
    const floor = parseInt(document.getElementById('allocFloor').value);
    const roomNum = parseInt(document.getElementById('allocRoom').value);

    if (!studentId || !bedId || !hostel || !block || !floor || !roomNum) {
      showToast('Please fill all fields', 'error');
      return;
    }

    if (typeof Store !== 'undefined') {
      // Find the actual bed ID from Store
      const hostelType = hostel === 'boys' ? 'boys' : 'girls';
      const hostels = Store.getAll('hostels');
      const hostelObj = hostels.find(h => h.type === hostelType);
      if (!hostelObj) { showToast('Hostel not found', 'error'); return; }
      const room = Store.getAll('rooms').find(r => r.hostelId === hostelObj.id && r.block === block && r.floor === floor && r.number === roomNum);
      if (!room) { showToast('Room not found', 'error'); return; }
      const bed = Store.getAll('beds').find(b => b.roomId === room.id && b.number === parseInt(bedId));
      if (!bed) { showToast('Bed not found', 'error'); return; }

      const result = Store.allocateBed(studentId, bed.id);
      if (result.success) {
        this._loadFromStore();
        this._generateRoomsFromStore();
        this.closeAllocateModal();
        this.refresh();
        showToast('Bed allocated successfully', 'success');
      } else {
        showToast(result.error, 'error');
      }
    } else {
      showToast('Store not available', 'error');
    }
  },

  // ============================================
  // ACTIONS
  // ============================================

  viewAllocation(id) {
    const alloc = this.allocations.find(a => a.id === id);
    if (alloc) {
      showToast(`${alloc.studentName} - ${alloc.hostel === 'boys' ? 'Boys' : 'Girls'} ${alloc.block}${alloc.room}, Bed ${alloc.bed}`, 'info');
    }
  },

  deallocateBed(id) {
    if (!confirm('Are you sure you want to deallocate this bed?')) return;

    if (typeof Store !== 'undefined') {
      const result = Store.deallocateBed(id);
      if (result.success) {
        this._loadFromStore();
        this._generateRoomsFromStore();
        this.refresh();
        showToast('Bed deallocated successfully', 'info');
      } else {
        showToast(result.error, 'error');
      }
    } else {
      this.allocations = this.allocations.filter(a => a.id !== id);
      this.refresh();
      showToast('Bed deallocated successfully', 'info');
    }
  },

  viewRoom(roomId) {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return;

    const content = `
      <div style="text-align:center;margin-bottom:20px">
        <h4 style="font-size:1.25rem;font-weight:700;font-family:'JetBrains Mono',monospace">${room.number}</h4>
        <p style="color:var(--text-secondary);font-size:0.9rem">${room.hostelName} - Block ${room.block}, Floor ${room.floor}</p>
      </div>
      <div class="bed-detail-grid">
        ${room.beds.map(bed => `
          <div class="bed-detail-item ${bed.occupied ? 'bed-detail-item--occupied' : 'bed-detail-item--available'}">
            <div class="bed-detail-number">Bed ${bed.number}</div>
            ${bed.occupied ? `
              <div class="bed-detail-student">${Utils.sanitize(bed.allocation.studentName)}</div>
              <div class="bed-detail-date">${Utils.formatDate(bed.allocation.date)}</div>
            ` : `
              <div class="bed-detail-status">Available</div>
            `}
          </div>
        `).join('')}
      </div>
    `;

    this.showRoomModal(content);
  },

  showRoomModal(content) {
    let modal = document.getElementById('roomDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'roomDetailModal';
      modal.className = 'modal-overlay hidden';
      modal.innerHTML = `
        <div class="modal" style="max-width:500px">
          <div class="modal-header">
            <h3>Room Details</h3>
            <button class="modal-close" onclick="document.getElementById('roomDetailModal').classList.add('hidden')">&times;</button>
          </div>
          <div class="modal-body" id="roomDetailBody"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    document.getElementById('roomDetailBody').innerHTML = content;
    modal.classList.remove('hidden');
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = this.render();
      this.init();
    }
  },
};

window.AdminAllocation = AdminAllocation;
