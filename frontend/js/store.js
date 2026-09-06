/**
 * HostelBuddy — Shared Data Store
 * Single source of truth for all application data.
 * All page modules read/write through this store.
 * Persisted in localStorage so data survives page refreshes.
 */

const Store = {
  STORAGE_KEY: 'hb_store',
  
  // Initialize or load from localStorage
  _data: null,

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try { this._data = JSON.parse(saved); } catch(e) { this._data = null; }
    }
    if (!this._data) {
      this._data = this.getDefaultData();
      this.save();
    }
    // Ensure new fields exist on old data
    const defaults = this.getDefaultData();
    for (const key of Object.keys(defaults)) {
      if (!this._data[key]) this._data[key] = defaults[key];
    }
  },

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._data));
  },

  // ============================================================
  // DEFAULT DATA
  // ============================================================
  getDefaultData() {
    const now = Date.now();
    const DAY = 86400000;

    // ---- Students (registered users) ----
    const students = [
      { id: 's1', name: 'Ravi Kumar', email: 'ravi@test.com', phone: '9876543210', dept: 'B.Tech CS', year: '3rd', gender: 'male', rollNo: 'CS2025001', joined: '2025-01-10' },
      { id: 's2', name: 'Amit Patel', email: 'amit@test.com', phone: '9876543211', dept: 'B.Tech ECE', year: '2nd', gender: 'male', rollNo: 'EC2025002', joined: '2025-01-11' },
      { id: 's3', name: 'Vikram Reddy', email: 'vikram@test.com', phone: '9876543212', dept: 'B.Tech ME', year: '4th', gender: 'male', rollNo: 'ME2025003', joined: '2025-01-12' },
      { id: 's4', name: 'Rahul Verma', email: 'rahul@test.com', phone: '9876543213', dept: 'B.Tech CS', year: '3rd', gender: 'male', rollNo: 'CS2025004', joined: '2025-01-13' },
      { id: 's5', name: 'Priya Singh', email: 'priya@test.com', phone: '9876543214', dept: 'B.Tech IT', year: '3rd', gender: 'female', rollNo: 'IT2025005', joined: '2025-01-14' },
      { id: 's6', name: 'Neha Gupta', email: 'neha@test.com', phone: '9876543215', dept: 'B.Tech CS', year: '2nd', gender: 'female', rollNo: 'CS2025006', joined: '2025-01-15' },
      { id: 's7', name: 'Suresh Nair', email: 'suresh@test.com', phone: '9876543216', dept: 'B.Tech EE', year: '3rd', gender: 'male', rollNo: 'EE2025007', joined: '2025-01-16' },
      { id: 's8', name: 'Karthik Iyer', email: 'karthik@test.com', phone: '9876543217', dept: 'B.Tech CS', year: '4th', gender: 'male', rollNo: 'CS2025008', joined: '2025-01-17' },
      { id: 's9', name: 'Sneha Joshi', email: 'sneha@test.com', phone: '9876543218', dept: 'B.Tech IT', year: '2nd', gender: 'female', rollNo: 'IT2025009', joined: '2025-01-18' },
      { id: 's10', name: 'Ananya Das', email: 'ananya@test.com', phone: '9876543219', dept: 'B.Tech ECE', year: '3rd', gender: 'female', rollNo: 'EC2025010', joined: '2025-01-19' },
      { id: 's11', name: 'Deepak Sharma', email: 'deepak@test.com', phone: '9876543220', dept: 'B.Tech CE', year: '2nd', gender: 'male', rollNo: 'CE2025011', joined: '2025-01-20' },
      { id: 's12', name: 'Meera Iyer', email: 'meera@test.com', phone: '9876543221', dept: 'B.Tech CS', year: '3rd', gender: 'female', rollNo: 'CS2025012', joined: '2025-01-21' },
    ];

    // ---- Admins ----
    const admins = [
      { id: 'a1', name: 'Dr. Sharma', email: 'admin@test.com', hostel: 'Boys Hostel A', status: 'active', joined: '2024-06-01' },
      { id: 'a2', name: 'Mrs. Gupta', email: 'admin-girls@test.com', hostel: 'Girls Hostel A', status: 'active', joined: '2024-06-15' },
      { id: 'a3', name: 'Mr. Verma', email: 'admin2@test.com', hostel: 'Boys Hostel B', status: 'active', joined: '2024-07-01' },
    ];

    // ---- Hostels ----
    const hostels = [
      { id: 'h1', name: 'Boys Hostel A', type: 'boys', capacity: 24, admin: 'a1', address: 'Block A, Main Campus', status: 'active' },
      { id: 'h2', name: 'Boys Hostel B', type: 'boys', capacity: 24, admin: 'a3', address: 'Block B, Main Campus', status: 'active' },
      { id: 'h3', name: 'Girls Hostel A', type: 'girls', capacity: 24, admin: 'a2', address: 'Block C, Main Campus', status: 'active' },
      { id: 'h4', name: 'Girls Hostel B', type: 'girls', capacity: 24, admin: null, address: 'Block D, Main Campus', status: 'active' },
    ];

    // ---- Rooms & Beds ----
    const rooms = [];
    const beds = [];
    const blocks = ['A', 'B'];
    
    hostels.forEach(hostel => {
      blocks.forEach(block => {
        for (let floor = 1; floor <= 3; floor++) {
          for (let roomNum = 1; roomNum <= 2; roomNum++) {
            const roomNumber = parseInt(`${floor}0${roomNum}`);
            const roomId = `r_${hostel.id}_${block}_${floor}_${roomNum}`;
            rooms.push({
              id: roomId,
              hostelId: hostel.id,
              block,
              floor,
              number: roomNumber,
              capacity: 4,
              status: 'available', // available, partial, full
            });
            for (let bedNum = 1; bedNum <= 4; bedNum++) {
              beds.push({
                id: `b_${roomId}_${bedNum}`,
                roomId,
                number: bedNum,
                status: 'available', // available, occupied
                studentId: null,
                allocationDate: null,
              });
            }
          }
        }
      });
    });

    // ---- Pre-allocate some beds (60% occupancy) ----
    const preAllocations = [
      { studentId: 's1', hostelId: 'h1', block: 'A', floor: 1, room: 1, bed: 1 },
      { studentId: 's2', hostelId: 'h1', block: 'A', floor: 1, room: 1, bed: 2 },
      { studentId: 's3', hostelId: 'h1', block: 'A', floor: 1, room: 1, bed: 3 },
      { studentId: 's4', hostelId: 'h1', block: 'A', floor: 1, room: 2, bed: 1 },
      { studentId: 's7', hostelId: 'h1', block: 'A', floor: 1, room: 2, bed: 2 },
      { studentId: 's8', hostelId: 'h1', block: 'A', floor: 2, room: 1, bed: 1 },
      { studentId: 's11', hostelId: 'h1', block: 'A', floor: 2, room: 1, bed: 2 },
      { studentId: 's5', hostelId: 'h3', block: 'A', floor: 1, room: 1, bed: 1 },
      { studentId: 's6', hostelId: 'h3', block: 'A', floor: 1, room: 1, bed: 2 },
      { studentId: 's9', hostelId: 'h3', block: 'A', floor: 2, room: 1, bed: 1 },
      { studentId: 's10', hostelId: 'h3', block: 'A', floor: 2, room: 1, bed: 2 },
      { studentId: 's12', hostelId: 'h3', block: 'A', floor: 2, room: 2, bed: 1 },
    ];

    preAllocations.forEach(alloc => {
      const room = rooms.find(r => r.hostelId === alloc.hostelId && r.block === alloc.block && r.floor === alloc.floor && r.number === parseInt(`${alloc.floor}0${alloc.room}`));
      if (room) {
        const bed = beds.find(b => b.roomId === room.id && b.number === alloc.bed);
        if (bed) {
          bed.status = 'occupied';
          bed.studentId = alloc.studentId;
          bed.allocationDate = new Date(now - 30 * DAY).toISOString().split('T')[0];
        }
      }
    });

    // Update room statuses
    this._updateRoomStatuses(rooms, beds);

    // ---- Applications ----
    const applications = [
      { id: 'app1', studentId: 's1', hostel: 'boys', status: 'approved', requirements: 'Ground floor preferred', guardianName: 'Suresh Kumar', guardianPhone: '9876543211', emergencyPhone: '9876543211', date: new Date(now - 45 * DAY).toISOString().split('T')[0], remarks: '' },
      { id: 'app2', studentId: 's5', hostel: 'girls', status: 'approved', requirements: 'Near mess hall', guardianName: 'Raj Singh', guardianPhone: '9876543222', emergencyPhone: '9876543222', date: new Date(now - 40 * DAY).toISOString().split('T')[0], remarks: '' },
      { id: 'app3', studentId: 's11', hostel: 'boys', status: 'pending', requirements: 'Top floor if available', guardianName: 'Prakash Sharma', guardianPhone: '9876543230', emergencyPhone: '9876543230', date: new Date(now - 5 * DAY).toISOString().split('T')[0], remarks: '' },
      { id: 'app4', studentId: 's12', hostel: 'girls', status: 'pending', requirements: 'Quiet floor preferred', guardianName: 'Ganesh Iyer', guardianPhone: '9876543231', emergencyPhone: '9876543231', date: new Date(now - 3 * DAY).toISOString().split('T')[0], remarks: '' },
    ];

    // ---- Complaints ----
    const complaints = [
      { id: 'c1', studentId: 's1', title: 'Broken ceiling fan', category: 'Maintenance', priority: 'medium', status: 'in_progress', description: 'The ceiling fan is making strange noises and sometimes stops working.', date: new Date(now - 10 * DAY).toISOString(), updated: new Date(now - 5 * DAY).toISOString(), responses: [{ author: 'Admin', text: 'We have noted your complaint. A technician will visit tomorrow.', date: new Date(now - 5 * DAY).toISOString() }] },
      { id: 'c2', studentId: 's2', title: 'Water leakage in bathroom', category: 'Maintenance', priority: 'high', status: 'open', description: 'Water leakage from the pipe under the sink. Safety hazard.', date: new Date(now - 2 * DAY).toISOString(), updated: new Date(now - 2 * DAY).toISOString(), responses: [] },
      { id: 'c3', studentId: 's5', title: 'Noise disturbance at night', category: 'Noise', priority: 'low', status: 'resolved', description: 'Adjacent room playing loud music after 11 PM.', date: new Date(now - 30 * DAY).toISOString(), updated: new Date(now - 25 * DAY).toISOString(), responses: [{ author: 'Admin', text: 'Warning issued to students. Issue resolved.', date: new Date(now - 25 * DAY).toISOString() }] },
      { id: 'c4', studentId: 's3', title: 'Dirty common area', category: 'Cleanliness', priority: 'medium', status: 'open', description: 'Common area on 2nd floor not cleaned properly.', date: new Date(now - 1 * DAY).toISOString(), updated: new Date(now - 1 * DAY).toISOString(), responses: [] },
      { id: 'c5', studentId: 's6', title: 'Security concern near entrance', category: 'Security', priority: 'high', status: 'open', description: 'Main entrance gate was left open past midnight.', date: new Date(now - 1 * DAY).toISOString(), updated: new Date(now - 1 * DAY).toISOString(), responses: [] },
    ];

    // ---- Visitors ----
    const visitors = [
      { id: 'v1', studentId: 's1', name: 'Rajesh Kumar', relation: 'Parent', phone: '9876543200', purpose: 'Family visit', date: new Date(now + 1 * DAY).toISOString().split('T')[0], time: '14:00', duration: '2 hours', status: 'approved' },
      { id: 'v2', studentId: 's1', name: 'Sunita Devi', relation: 'Parent', phone: '9876543201', purpose: 'Bring medicines', date: new Date(now - 1 * DAY).toISOString().split('T')[0], time: '10:00', duration: '1 hour', status: 'completed' },
      { id: 'v3', studentId: 's5', name: 'Priya Sharma', relation: 'Sibling', phone: '9876543202', purpose: 'Personal', date: new Date(now + 2 * DAY).toISOString().split('T')[0], time: '11:00', duration: '2 hours', status: 'pending' },
      { id: 'v4', studentId: 's2', name: 'Amit Verma', relation: 'Friend', phone: '9876543203', purpose: 'Study group', date: new Date(now - 3 * DAY).toISOString().split('T')[0], time: '15:00', duration: '3 hours', status: 'completed' },
      { id: 'v5', studentId: 's3', name: 'Vikram Singh', relation: 'Friend', phone: '9876543204', purpose: 'Project work', date: new Date(now - 5 * DAY).toISOString().split('T')[0], time: '16:00', duration: '2 hours', status: 'rejected' },
    ];

    // ---- Announcements ----
    const announcements = [
      { id: 'ann1', title: 'Hostel Timings Updated', category: 'Important', content: 'Hostel gates will now close at 10 PM instead of 11 PM starting next week. Students are expected to be inside before gate closes.', date: new Date(now - 1 * DAY).toISOString(), author: 'Dr. Sharma', pinned: true, status: 'published', views: 156, audience: 'All Students' },
      { id: 'ann2', title: 'Mess Menu Change', category: 'General', content: 'New mess menu for this semester has been uploaded. Check the notice board for details.', date: new Date(now - 3 * DAY).toISOString(), author: 'Mess Committee', pinned: false, status: 'published', views: 89, audience: 'All Students' },
      { id: 'ann3', title: 'Annual Sports Day', category: 'Event', content: 'Annual sports day will be held on February 15th. All students are encouraged to participate. Registration forms at admin office.', date: new Date(now - 5 * DAY).toISOString(), author: 'Sports Committee', pinned: false, status: 'published', views: 124, audience: 'All Students' },
      { id: 'ann4', title: 'Maintenance Schedule', category: 'Maintenance', content: 'Water supply will be disrupted Saturday 10 AM - 2 PM for pipe maintenance. Store water accordingly.', date: new Date(now - 7 * DAY).toISOString(), author: 'Maintenance Team', pinned: false, status: 'published', views: 203, audience: 'Boys Hostel' },
      { id: 'ann5', title: 'Room Inspection Notice', category: 'General', content: 'Room inspection next Monday. Keep your rooms clean and organized.', date: new Date(now - 0.5 * DAY).toISOString(), author: 'Admin', pinned: false, status: 'draft', views: 0, audience: 'Girls Hostel' },
    ];

    // ---- Settings ----
    const settings = {
      appName: 'HostelBuddy',
      contactEmail: 'admin@hostelbuddy.edu',
      academicYear: '2025-2026',
      applicationDeadline: '2026-03-31',
      maxBedsPerRoom: 4,
    };

    return { students, admins, hostels, rooms, beds, applications, complaints, visitors, announcements, settings, _nextId: 100 };
  },

  // ============================================================
  // ROOM STATUS HELPERS
  // ============================================================
  _updateRoomStatuses(rooms, beds) {
    rooms.forEach(room => {
      const roomBeds = beds.filter(b => b.roomId === room.id);
      const occupied = roomBeds.filter(b => b.status === 'occupied').length;
      if (occupied === 0) room.status = 'available';
      else if (occupied >= room.capacity) room.status = 'full';
      else room.status = 'partial';
    });
  },

  refreshRoomStatuses() {
    this._updateRoomStatuses(this._data.rooms, this._data.beds);
  },

  // ============================================================
  // GENERIC CRUD
  // ============================================================
  getAll(collection) {
    return this._data[collection] || [];
  },

  getById(collection, id) {
    return (this._data[collection] || []).find(item => item.id === id);
  },

  add(collection, item) {
    this._data._nextId++;
    const newItem = { id: 'gen_' + this._data._nextId, ...item };
    this._data[collection].push(newItem);
    this.save();
    return newItem;
  },

  update(collection, id, updates) {
    const items = this._data[collection] || [];
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    this.save();
    return items[idx];
  },

  remove(collection, id) {
    this._data[collection] = (this._data[collection] || []).filter(item => item.id !== id);
    this.save();
  },

  // ============================================================
  // APPLICATION WORKFLOW
  // ============================================================
  getApplicationByStudent(studentId) {
    return this._data.applications.find(a => a.studentId === studentId);
  },

  getStudentAllocations(studentId) {
    return this._data.beds
      .filter(b => b.studentId === studentId)
      .map(b => {
        const room = this._data.rooms.find(r => r.id === b.roomId);
        const hostel = room ? this._data.hostels.find(h => h.id === room.hostelId) : null;
        return { ...b, room, hostel };
      });
  },

  getRoommates(roomId, excludeStudentId) {
    return this._data.beds
      .filter(b => b.roomId === roomId && b.status === 'occupied' && b.studentId !== excludeStudentId)
      .map(b => {
        const student = this._data.students.find(s => s.id === b.studentId);
        return { bed: b.number, student };
      });
  },

  // ============================================================
  // ALLOCATION WORKFLOW (CRITICAL)
  // ============================================================
  allocateBed(studentId, bedId) {
    const bed = this._data.beds.find(b => b.id === bedId);
    if (!bed) return { success: false, error: 'Bed not found' };
    if (bed.status === 'occupied') return { success: false, error: 'Bed is already occupied' };

    // Check if student already has an allocation
    const existing = this._data.beds.find(b => b.studentId === studentId && b.status === 'occupied');
    if (existing) return { success: false, error: 'Student already has a room allocation' };

    bed.status = 'occupied';
    bed.studentId = studentId;
    bed.allocationDate = new Date().toISOString().split('T')[0];

    // Update application status
    const app = this._data.applications.find(a => a.studentId === studentId);
    if (app) {
      app.status = 'allocated';
    }

    // Update room status
    this.refreshRoomStatuses();
    this.save();
    return { success: true };
  },

  deallocateBed(bedId) {
    const bed = this._data.beds.find(b => b.id === bedId);
    if (!bed) return { success: false, error: 'Bed not found' };
    if (bed.status !== 'occupied') return { success: false, error: 'Bed is not occupied' };

    const studentId = bed.studentId;
    bed.status = 'available';
    bed.studentId = null;
    bed.allocationDate = null;

    // Update application status
    const app = this._data.applications.find(a => a.studentId === studentId);
    if (app) {
      app.status = 'approved'; // Back to approved, not allocated
    }

    this.refreshRoomStatuses();
    this.save();
    return { success: true };
  },

  getAvailableBeds(hostelId, block, floor) {
    return this._data.beds.filter(b => {
      if (b.status === 'occupied') return false;
      const room = this._data.rooms.find(r => r.id === b.roomId);
      if (!room) return false;
      if (hostelId && room.hostelId !== hostelId) return false;
      if (block && room.block !== block) return false;
      if (floor && room.floor !== floor) return false;
      return true;
    });
  },

  // ============================================================
  // DASHBOARD STATS
  // ============================================================
  getStats() {
    const totalStudents = this._data.students.length;
    const allocatedBeds = this._data.beds.filter(b => b.status === 'occupied').length;
    const totalBeds = this._data.beds.length;
    const pendingApplications = this._data.applications.filter(a => a.status === 'pending').length;
    const totalApplications = this._data.applications.length;
    const openComplaints = this._data.complaints.filter(c => c.status === 'open' || c.status === 'in_progress').length;
    const totalComplaints = this._data.complaints.length;
    const pendingVisitors = this._data.visitors.filter(v => v.status === 'pending').length;
    const totalVisitors = this._data.visitors.length;
    const publishedAnnouncements = this._data.announcements.filter(a => a.status === 'published').length;
    const boysStudents = this._data.students.filter(s => s.gender === 'male').length;
    const girlsStudents = this._data.students.filter(s => s.gender === 'female').length;

    const boysHostel = this._data.hostels.filter(h => h.type === 'boys');
    const girlsHostel = this._data.hostels.filter(h => h.type === 'girls');
    const boysCapacity = boysHostel.reduce((sum, h) => sum + h.capacity, 0);
    const girlsCapacity = girlsHostel.reduce((sum, h) => sum + h.capacity, 0);

    return {
      totalStudents, allocatedBeds, totalBeds, pendingApplications, totalApplications,
      openComplaints, totalComplaints, pendingVisitors, totalVisitors,
      publishedAnnouncements, boysStudents, girlsStudents,
      boysCapacity, girlsCapacity,
      occupancyPercent: totalBeds ? Math.round((allocatedBeds / totalBeds) * 100) : 0,
      boysOccupancy: boysCapacity ? Math.round(this._data.beds.filter(b => b.status === 'occupied' && this._data.rooms.find(r => r.id === b.roomId)?.hostelId && this._data.hostels.find(h => h.id === this._data.rooms.find(r => r.id === b.roomId).hostelId)?.type === 'boys').length / boysCapacity * 100) : 0,
      girlsOccupancy: girlsCapacity ? Math.round(this._data.beds.filter(b => b.status === 'occupied' && this._data.rooms.find(r => r.id === b.roomId)?.hostelId && this._data.hostels.find(h => h.id === this._data.rooms.find(r => r.id === b.roomId).hostelId)?.type === 'girls').length / girlsCapacity * 100) : 0,
    };
  },

  // ============================================================
  // RESET (for testing)
  // ============================================================
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._data = this.getDefaultData();
    this.save();
  },
};

// Auto-init on load
Store.init();
window.Store = Store;
