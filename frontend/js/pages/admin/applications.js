/**
 * HostelBuddy — Admin Applications Page
 */
Pages["admin/applications"] = function(container) {
  renderAdminSidebar("admin/applications");
  showPage(container, `
    <div class="admin-main">
      <div class="student-header"><h1>📋 Applications Management</h1><p>Review and manage student applications</p></div>
      <div class="card">
        <div class="table-container"><table class="table"><thead><tr><th>Student</th><th>Email</th><th>Hostel</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr><td class="font-semibold">Priya Patel</td><td>priya@hostelbuddy.dev</td><td>Girls Hostel</td><td>Mar 1, 2025</td><td><span class="badge badge-pending">pending</span></td><td class="table-actions"><button class="btn btn-sm btn-success" onclick="Toast.show('Approved!','success')">Approve</button><button class="btn btn-sm btn-danger" onclick="Toast.show('Rejected','warning')">Reject</button></td></tr>
          <tr><td class="font-semibold">Amit Kumar</td><td>amit@hostelbuddy.dev</td><td>Boys Hostel</td><td>Feb 28, 2025</td><td><span class="badge badge-pending">pending</span></td><td class="table-actions"><button class="btn btn-sm btn-success" onclick="Toast.show('Approved!','success')">Approve</button><button class="btn btn-sm btn-danger" onclick="Toast.show('Rejected','warning')">Reject</button></td></tr>
          <tr><td class="font-semibold">Sneha Reddy</td><td>sneha@hostelbuddy.dev</td><td>Girls Hostel</td><td>Feb 25, 2025</td><td><span class="badge badge-success">approved</span></td><td></td></tr>
          <tr><td class="font-semibold">Rahul Sharma</td><td>rahul@hostelbuddy.dev</td><td>Boys Hostel</td><td>Feb 22, 2025</td><td><span class="badge badge-success">approved</span></td><td></td></tr>
          <tr><td class="font-semibold">Deepa Nair</td><td>deepa@hostelbuddy.dev</td><td>Girls Hostel</td><td>Feb 20, 2025</td><td><span class="badge badge-danger">rejected</span></td><td></td></tr>
        </tbody></table></div>
      </div>
    </div>`);
};

/**
 * HostelBuddy — Admin Room Allocation
 */
Pages["admin/allocation"] = function(container) {
  renderAdminSidebar("admin/allocation");
  showPage(container, `
    <div class="admin-main">
      <div class="student-header"><h1>🛏️ Room Allocation</h1><p>Assign accommodation to approved students</p></div>
      <div class="allocation-grid">
        <div class="card">
          <h3 class="font-semibold mb-md">📋 Pending Applications</h3>
          <div class="flex flex-col gap-sm">
            <div class="card p-md" style="cursor:pointer;border:2px solid var(--primary);" onclick="selectStudent(this)">
              <p class="font-semibold">Ravi Kumar</p><p class="text-xs text-secondary">Applied: Jan 10, 2025</p><p class="text-xs text-secondary mt-sm">"Ground floor preferred"</p>
            </div>
            <div class="card p-md" style="cursor:pointer;" onclick="selectStudent(this)">
              <p class="font-semibold">Priya Patel</p><p class="text-xs text-secondary">Applied: Mar 1, 2025</p><p class="text-xs text-secondary mt-sm">"Near library"</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h3 class="font-semibold mb-md">🏠 Assign Accommodation</h3>
          <div id="selectedStudentInfo" class="text-sm text-secondary mb-md">Select a student from the left panel</div>
          <div class="input-group"><label class="form-label">Block</label><select class="select" id="allocBlock"><option>Block A</option><option>Block B</option><option>Block C</option></select></div>
          <div class="input-group"><label class="form-label">Floor</label><select class="select" id="allocFloor"><option>Floor 1</option><option>Floor 2</option><option>Floor 3</option></select></div>
          <div class="input-group"><label class="form-label">Room</label><select class="select" id="allocRoom"><option>Room 101</option><option>Room 102</option><option>Room 103</option></select></div>
          <h4 class="font-semibold mb-sm mt-md">Available Beds</h4>
          <div class="bed-selector">
            <div class="bed available" onclick="selectBed(this)"><div class="bed-id">B1</div><div class="bed-type">Single</div></div>
            <div class="bed occupied"><div class="bed-id">B2</div><div class="bed-type">Single</div></div>
            <div class="bed available" onclick="selectBed(this)"><div class="bed-id">B3</div><div class="bed-type">Double</div></div>
            <div class="bed occupied"><div class="bed-id">B4</div><div class="bed-type">Double</div></div>
          </div>
          <div class="flex gap-sm mt-lg"><button class="btn btn-success" onclick="Toast.show('Bed assigned!','success')">✅ Assign Bed</button><button class="btn btn-danger" onclick="Toast.show('Application rejected','warning')">✕ Reject</button></div>
        </div>
      </div>
    </div>`);
};

window.selectStudent = (el) => {
  document.querySelectorAll(".allocation-grid .card:first-child .card").forEach(c => c.style.border = "2px solid var(--border)");
  el.style.border = "2px solid var(--primary)";
  document.getElementById("selectedStudentInfo").innerHTML = `<strong>Ravi Kumar</strong> — Boys Hostel, Ground floor preferred`;
};

window.selectBed = (el) => {
  document.querySelectorAll(".bed").forEach(b => b.classList.remove("selected"));
  el.classList.add("selected");
};

/**
 * HostelBuddy — Admin Rooms Page
 */
Pages["admin/rooms"] = function(container) {
  renderAdminSidebar("admin/rooms");
  showPage(container, `
    <div class="admin-main">
      <div class="student-header"><h1>🚪 Rooms</h1><p>Manage hostel rooms and occupancy</p></div>
      <div id="admin-rooms-stats" class="mb-lg"></div>
      <div class="card"><h3 class="font-semibold mb-md">Room Overview</h3>
        <div class="grid grid-4 gap-md">
          ${["A-101","A-102","A-103","A-104","B-201","B-202","B-203","B-204"].map(r => `
            <div class="card p-md text-center"><p class="font-bold">${r}</p><p class="text-xs text-secondary">${Math.random()>0.5?"🟢 2 beds free":"🔴 Full"}</p></div>`).join("")}
        </div>
      </div>
    </div>`);
  renderStatCard("admin-rooms-stats", [
    { icon: "🚪", label: "Total Rooms", value: "320", color: "primary" },
    { icon: "🟢", label: "Available", value: "48", color: "success" },
    { icon: "🔴", label: "Occupied", value: "272", color: "danger" },
  ]);
};

/**
 * HostelBuddy — Admin Students Page
 */
Pages["admin/students"] = function(container) {
  renderAdminSidebar("admin/students");
  showPage(container, `
    <div class="admin-main">
      <div class="student-header"><h1>👥 Students</h1><p>All registered hostel students</p></div>
      <div class="card">
        <div class="table-container"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Hostel</th><th>Room</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td class="font-semibold">Ravi Kumar</td><td>ravi@hostelbuddy.dev</td><td>Boys Hostel</td><td>Block A, 102</td><td><span class="badge badge-success">Active</span></td></tr>
          <tr><td class="font-semibold">Priya Patel</td><td>priya@hostelbuddy.dev</td><td>Girls Hostel</td><td>Block B, 205</td><td><span class="badge badge-success">Active</span></td></tr>
          <tr><td class="font-semibold">Amit Kumar</td><td>amit@hostelbuddy.dev</td><td>Boys Hostel</td><td>Block A, 104</td><td><span class="badge badge-pending">Pending</span></td></tr>
        </tbody></table></div>
      </div>
    </div>`);
};

/**
 * HostelBuddy — Admin Complaints Page
 */
Pages["admin/complaints"] = function(container) {
  renderAdminSidebar("admin/complaints");
  showPage(container, `
    <div class="admin-main">
      <div class="student-header"><h1>😤 Complaints Management</h1><p>Review and manage student complaints</p></div>
      <div class="filter-bar">
        <div class="filter-group"><label class="filter-label">Status</label><select class="select" style="max-width:150px;"><option>All</option><option>Open</option><option>In Progress</option><option>Resolved</option></select></div>
        <div class="filter-group"><label class="filter-label">Category</label><select class="select" style="max-width:150px;"><option>All</option><option>Plumbing</option><option>Electrical</option><option>Furniture</option><option>Cleanliness</option></select></div>
      </div>
      <div class="card"><div class="table-container"><table class="table"><thead><tr><th>Student</th><th>Category</th><th>Subject</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        <tr><td class="font-semibold">Ravi Kumar</td><td>🔧 Plumbing</td><td>Leaking tap</td><td><span class="badge badge-danger">High</span></td><td><span class="badge badge-warning">Open</span></td><td><button class="btn btn-sm btn-success" onclick="Toast.show('Resolved!','success')">Resolve</button></td></tr>
        <tr><td class="font-semibold">Amit Kumar</td><td>⚡ Electrical</td><td>Broken fan</td><td><span class="badge badge-warning">Medium</span></td><td><span class="badge badge-info">In Progress</span></td><td><button class="btn btn-sm btn-success" onclick="Toast.show('Resolved!','success')">Resolve</button></td></tr>
        <tr><td class="font-semibold">Priya Patel</td><td>🧹 Cleanliness</td><td>Cockroaches</td><td><span class="badge badge-danger">High</span></td><td><span class="badge badge-warning">Open</span></td><td><button class="btn btn-sm btn-success" onclick="Toast.show('Resolved!','success')">Resolve</button></td></tr>
      </tbody></table></div></div>
    </div>`);
};

/**
 * HostelBuddy — Admin Visitors Page
 */
Pages["admin/visitors"] = function(container) {
  renderAdminSidebar("admin/visitors");
  showPage(container, `
    <div class="admin-main">
      <div class="student-header"><h1>👤 Visitors</h1><p>Manage visitor entries</p></div>
      <div class="card"><div class="table-container"><table class="table"><thead><tr><th>Visitor</th><th>Student</th><th>Date</th><th>Purpose</th><th>Status</th></tr></thead>
      <tbody><tr><td>Suresh Kumar</td><td>Ravi Kumar</td><td>Mar 1, 2025</td><td>Family visit</td><td><span class="badge badge-success">Checked In</span></td></tr>
      <tr><td>Meena Devi</td><td>Priya Patel</td><td>Feb 28, 2025</td><td>Parent meeting</td><td><span class="badge badge-pending">Pending</span></td></tr></tbody></table></div></div>
    </div>`);
};

/**
 * HostelBuddy — Admin Announcements Page
 */
Pages["admin/announcements"] = function(container) {
  renderAdminSidebar("admin/announcements");
  showPage(container, `
    <div class="admin-main">
      <div class="flex justify-between items-center mb-lg"><div><h1>📢 Manage Announcements</h1><p class="text-secondary text-sm">Create and manage hostel announcements</p></div><button class="btn btn-primary" onclick="openAnnouncementModal()">+ Create Announcement</button></div>
      <div class="card"><div class="table-container"><table class="table"><thead><tr><th>Title</th><th>Target</th><th>Date</th><th>Pinned</th><th>Actions</th></tr></thead>
      <tbody>
        <tr><td class="font-semibold">🔧 Water Supply Maintenance</td><td>All Students</td><td>Mar 1, 2025</td><td><span class="badge badge-warning">📌</span></td><td class="table-actions"><button class="btn btn-sm btn-secondary">Edit</button><button class="btn btn-sm btn-danger">Delete</button></td></tr>
        <tr><td class="font-semibold">📢 Annual Hostel Fest</td><td>All Students</td><td>Feb 25, 2025</td><td><span class="badge badge-warning">📌</span></td><td class="table-actions"><button class="btn btn-sm btn-secondary">Edit</button><button class="btn btn-sm btn-danger">Delete</button></td></tr>
      </tbody></table></div></div>
    </div>`);
};

window.openAnnouncementModal = () => {
  openModal("Create Announcement", `
    <div class="input-group"><label class="form-label">Title</label><input type="text" class="input" placeholder="Announcement title" /></div>
    <div class="input-group"><label class="form-label">Content</label><textarea class="textarea" rows="4" placeholder="Write your announcement…"></textarea></div>
    <div class="input-group"><label class="form-label">Target</label><select class="select"><option>All Students</option><option>Boys Hostel</option><option>Girls Hostel</option></select></div>
    <div class="input-group"><label class="flex items-center gap-sm"><input type="checkbox" /> 📌 Pin to top</label></div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="Toast.show('Announcement created!','success');closeModal();">Publish</button>`);
};

/**
 * HostelBuddy — Admin Reports Page
 */
Pages["admin/reports"] = function(container) {
  renderAdminSidebar("admin/reports");
  showPage(container, `
    <div class="admin-main">
      <div class="student-header"><h1>📈 Reports</h1><p>Hostel analytics and occupancy reports</p></div>
      <div id="admin-reports-stats" class="mb-lg"></div>
      <div class="card mb-lg"><h3 class="font-semibold mb-md">Boys Hostel Occupancy</h3><div class="progress-bar"><div class="progress-fill blue" style="width:85%;"></div></div><p class="text-sm text-secondary mt-sm">153 / 180 rooms occupied (85%)</p></div>
      <div class="card"><h3 class="font-semibold mb-md">Girls Hostel Occupancy</h3><div class="progress-bar"><div class="progress-fill purple" style="width:85%;"></div></div><p class="text-sm text-secondary mt-sm">119 / 140 rooms occupied (85%)</p></div>
    </div>`);
  renderStatCard("admin-reports-stats", [
    { icon: "📈", label: "Occupancy Rate", value: "85%", color: "primary" },
    { icon: "📋", label: "Total Applications", value: "156", color: "success" },
    { icon: "😤", label: "Open Complaints", value: "23", color: "warning" },
  ]);
};
