/**
 * HostelBuddy — Admin Rooms Page
 */
Pages["admin/rooms"] = function(container) {
  Navbar.render({ title: "Rooms", avatarText: "DS" });
  Sidebar.setActivePage("rooms");
  container.innerHTML = `
    <div class="page-header"><h1 class="page-title">🚪 Rooms</h1><p class="page-subtitle">Manage hostel rooms and occupancy</p></div>
    <section class="stats stats--4">
      ${Card.stat("320", "Total Rooms", '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/></svg>', "stat-card__icon--blue") }
      ${Card.stat("272", "Occupied", '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>', "stat-card__icon--green") }
      ${Card.stat("48", "Available", '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>', "stat-card__icon--amber") }
      ${Card.stat("85%", "Occupancy", '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/></svg>', "stat-card__icon--purple") }
    </section>`;
  Sidebar.init();
};

/**
 * HostelBuddy — Admin Students Page
 */
Pages["admin/students"] = function(container) {
  Navbar.render({ title: "Students", avatarText: "DS" });
  Sidebar.setActivePage("students");
  container.innerHTML = `
    <div class="page-header"><h1 class="page-title">👥 Students</h1><p class="page-subtitle">All registered hostel students</p></div>
    <section class="card table-section"><div class="table-wrap"><table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Hostel</th><th>Room</th><th>Status</th></tr></thead>
    <tbody><tr><td><strong>Ravi Kumar</strong></td><td>ravi@hostelbuddy.dev</td><td>Boys Hostel</td><td>Block A, 102</td><td><span class="badge badge--approved"><span class="badge__dot"></span>Active</span></td></tr>
    <tr><td><strong>Priya Patel</strong></td><td>priya@hostelbuddy.dev</td><td>Girls Hostel</td><td>Block B, 205</td><td><span class="badge badge--approved"><span class="badge__dot"></span>Active</span></td></tr>
    <tr><td><strong>Amit Kumar</strong></td><td>amit@hostelbuddy.dev</td><td>Boys Hostel</td><td>Block A, 104</td><td><span class="badge badge--pending"><span class="badge__dot"></span>Pending</span></td></tr></tbody></table></div></section>`;
  Sidebar.init();
};

/**
 * HostelBuddy — Admin Complaints Page
 */
Pages["admin/complaints"] = function(container) {
  Navbar.render({ title: "Complaints Management", avatarText: "DS" });
  Sidebar.setActivePage("complaints");
  container.innerHTML = `
    <div class="view-header"><div><h1 class="page-title">Complaints Management</h1><p class="page-subtitle">Review and manage student complaints</p></div></div>
    <div class="filter-bar">
      <div class="filter-bar__group"><label class="filter-label">Status</label><select class="filter-select"><option value="">All Statuses</option><option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option></select></div>
      <div class="filter-bar__group"><label class="filter-label">Category</label><select class="filter-select"><option value="">All Categories</option><option value="plumbing">Plumbing</option><option value="electrical">Electrical</option><option value="furniture">Furniture</option><option value="cleanliness">Cleanliness</option></select></div>
      <div class="filter-bar__group filter-bar__group--search"><label class="filter-label">Search</label><div class="filter-search"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" class="filter-search__input" placeholder="Search…" /></div></div>
    </div>
    <section class="card table-section"><div class="table-wrap"><table class="admin-table"><thead><tr><th>Student</th><th>Category</th><th>Subject</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody><tr><td><strong>Ravi Kumar</strong></td><td>🔧 Plumbing</td><td>Leaking tap</td><td><span class="badge badge--high"><span class="badge__dot"></span>High</span></td><td><span class="badge badge--open"><span class="badge__dot"></span>Open</span></td><td><button class="btn btn--sm btn--success" onclick="Toast.show('Complaint resolved!','success')">Resolve</button></td></tr>
    <tr><td><strong>Amit Kumar</strong></td><td>⚡ Electrical</td><td>Broken fan</td><td><span class="badge badge--medium"><span class="badge__dot"></span>Medium</span></td><td><span class="badge badge--in-progress"><span class="badge__dot"></span>In Progress</span></td><td><button class="btn btn--sm btn--success" onclick="Toast.show('Complaint resolved!','success')">Resolve</button></td></tr>
    <tr><td><strong>Priya Patel</strong></td><td>🧹 Cleanliness</td><td>Cockroaches</td><td><span class="badge badge--high"><span class="badge__dot"></span>High</span></td><td><span class="badge badge--open"><span class="badge__dot"></span>Open</span></td><td><button class="btn btn--sm btn--success" onclick="Toast.show('Complaint resolved!','success')">Resolve</button></td></tr></tbody></table></div></section>`;
  Sidebar.init();
};

/**
 * HostelBuddy — Admin Visitors Page
 */
Pages["admin/visitors"] = function(container) {
  Navbar.render({ title: "Visitors", avatarText: "DS" });
  Sidebar.setActivePage("visitors");
  container.innerHTML = `
    <div class="page-header"><h1 class="page-title">👤 Visitors</h1><p class="page-subtitle">Manage visitor entries</p></div>
    <section class="card table-section"><div class="table-wrap"><table class="admin-table"><thead><tr><th>Visitor Name</th><th>Student</th><th>Date</th><th>Purpose</th></tr></thead>
    <tbody><tr><td>Suresh Kumar</td><td>Ravi Kumar</td><td>Mar 1, 2025</td><td>Family visit</td></tr>
    <tr><td>Meena Devi</td><td>Priya Patel</td><td>Feb 28, 2025</td><td>Parent meeting</td></tr></tbody></table></div></section>`;
  Sidebar.init();
};

/**
 * HostelBuddy — Admin Announcements Page
 */
Pages["admin/announcements"] = function(container) {
  Navbar.render({ title: "📢 Manage Announcements", avatarText: "DS" });
  Sidebar.setActivePage("announcements");
  container.innerHTML = `
    <div class="view-header"><div><h1 class="page-title">📢 Manage Announcements</h1><p class="page-subtitle">Create and manage hostel announcements</p></div>
    <button class="btn btn--primary" onclick="Toast.show('Announcement created!','success')">Create Announcement</button></div>
    <section class="card table-section"><div class="table-wrap"><table class="admin-table"><thead><tr><th>Title</th><th>Target</th><th>Date</th><th>Actions</th></tr></thead>
    <tbody><tr><td><strong>🔧 Water Supply Maintenance</strong></td><td>All Students</td><td>Mar 1, 2025</td><td><div class="action-buttons"><button class="btn-action btn-action--view">Edit</button><button class="btn-action btn-action--reject">Delete</button></div></td></tr>
    <tr><td><strong>📢 Annual Hostel Fest</strong></td><td>All Students</td><td>Feb 25, 2025</td><td><div class="action-buttons"><button class="btn-action btn-action--view">Edit</button><button class="btn-action btn-action--reject">Delete</button></div></td></tr></tbody></table></div></section>`;
  Sidebar.init();
};

/**
 * HostelBuddy — Admin Reports Page
 */
Pages["admin/reports"] = function(container) {
  Navbar.render({ title: "Reports", avatarText: "DS" });
  Sidebar.setActivePage("reports");
  container.innerHTML = `
    <div class="page-header"><h1 class="page-title">📈 Reports</h1><p class="page-subtitle">Hostel analytics and occupancy reports</p></div>
    <div class="stats stats--4">
      ${Card.stat("85%", "Occupancy Rate", '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/></svg>', "stat-card__icon--blue") }
      ${Card.stat("156", "Total Applications", '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12"/></svg>', "stat-card__icon--green") }
      ${Card.stat("23", "Open Complaints", '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>', "stat-card__icon--amber") }
    </div>
    <div class="card" style="margin-top:24px;"><h3 class="section-title" style="padding:0;margin-bottom:16px;">Boys Hostel</h3>${Card.progress(85, "progress-bar__fill--blue")}<p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-top:8px;">153 / 180 rooms occupied</p></div>
    <div class="card" style="margin-top:16px;"><h3 class="section-title" style="padding:0;margin-bottom:16px;">Girls Hostel</h3>${Card.progress(85, "progress-bar__fill--pink")}<p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-top:8px;">119 / 140 rooms occupied</p></div>`;
  Card.animateProgress();
  Sidebar.init();
};
