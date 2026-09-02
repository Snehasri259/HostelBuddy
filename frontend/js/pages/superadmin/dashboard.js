/**
 * HostelBuddy — Super Admin Dashboard
 */
Pages["superadmin/dashboard"] = function(container) {
  renderSuperAdminSidebar("superadmin/dashboard");
  showPage(container, `
    <div class="sa-main">
      <div class="student-header"><h1>Super Admin Dashboard</h1><p>Welcome back, Administrator</p></div>
      <div id="sa-stats" class="mb-lg"></div>
      <div class="grid grid-2 gap-lg mb-lg">
        <div class="card">
          <h3 class="font-semibold mb-md">🏠 Boys Hostel</h3>
          <div class="flex justify-between text-sm mb-sm"><span>Occupancy</span><span class="font-bold">85%</span></div>
          <div class="progress-bar"><div class="progress-fill blue" style="width:85%;"></div></div>
          <p class="text-xs text-secondary mt-sm">153 / 180 rooms occupied</p>
        </div>
        <div class="card">
          <h3 class="font-semibold mb-md">🏠 Girls Hostel</h3>
          <div class="flex justify-between text-sm mb-sm"><span>Occupancy</span><span class="font-bold">85%</span></div>
          <div class="progress-bar"><div class="progress-fill green" style="width:85%;"></div></div>
          <p class="text-xs text-secondary mt-sm">119 / 140 rooms occupied</p>
        </div>
      </div>
      <div class="card">
        <h3 class="font-semibold mb-md">📋 Recent System Activity</h3>
        <div class="timeline">
          <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><h4>New admin registered — Dr. Mehta</h4><p>1 hour ago</p></div></div>
          <div class="timeline-item"><div class="timeline-dot green"></div><div class="timeline-content"><h4>Room block C updated — 5 rooms added</h4><p>3 hours ago</p></div></div>
          <div class="timeline-item"><div class="timeline-dot amber"></div><div class="timeline-content"><h4>System settings changed</h4><p>1 day ago</p></div></div>
          <div class="timeline-item"><div class="timeline-dot purple"></div><div class="timeline-content"><h4>Bulk room allocation completed</h4><p>2 days ago</p></div></div>
        </div>
      </div>
    </div>`);
  renderStatCard("sa-stats", [
    { icon: "👥", label: "Total Students", value: "450", color: "primary" },
    { icon: "👨‍💼", label: "Total Admins", value: "6", color: "purple" },
    { icon: "🛏️", label: "Total Rooms", value: "320", color: "success" },
    { icon: "📊", label: "Occupancy Rate", value: "85%", color: "amber" },
  ]);
};

/**
 * HostelBuddy — Super Admin Hostels
 */
Pages["superadmin/hostels"] = function(container) {
  renderSuperAdminSidebar("superadmin/hostels");
  showPage(container, `
    <div class="sa-main">
      <div class="flex justify-between items-center mb-lg"><div><h1>🏠 Hostel Management</h1><p class="text-secondary text-sm">Manage hostel buildings and blocks</p></div><button class="btn btn-primary" onclick="Toast.show('Add hostel coming soon','info')">+ Add Hostel</button></div>
      <div class="card"><div class="table-container"><table class="table"><thead><tr><th>Name</th><th>Total Rooms</th><th>Occupied</th><th>Available</th><th>Actions</th></tr></thead>
      <tbody><tr><td class="font-semibold">Boys Hostel</td><td>180</td><td>153</td><td>27</td><td class="table-actions"><button class="btn btn-sm btn-secondary">Edit</button></td></tr>
      <tr><td class="font-semibold">Girls Hostel</td><td>140</td><td>119</td><td>21</td><td class="table-actions"><button class="btn btn-sm btn-secondary">Edit</button></td></tr></tbody></table></div></div>
    </div>`);
};

/**
 * HostelBuddy — Super Admin Admins
 */
Pages["superadmin/admins"] = function(container) {
  renderSuperAdminSidebar("superadmin/admins");
  showPage(container, `
    <div class="sa-main">
      <div class="flex justify-between items-center mb-lg"><div><h1>👨‍💼 Admin Management</h1><p class="text-secondary text-sm">Manage hostel administrators</p></div><button class="btn btn-primary" onclick="Toast.show('Add admin coming soon','info')">+ Add Admin</button></div>
      <div class="card"><div class="table-container"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Hostel</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody><tr><td class="font-semibold">Dr. Sharma</td><td>sharma@hostelbuddy.dev</td><td>Boys Hostel</td><td><span class="badge badge-success">Active</span></td><td class="table-actions"><button class="btn btn-sm btn-secondary">Edit</button></td></tr>
      <tr><td class="font-semibold">Dr. Mehta</td><td>mehta@hostelbuddy.dev</td><td>Girls Hostel</td><td><span class="badge badge-success">Active</span></td><td class="table-actions"><button class="btn btn-sm btn-secondary">Edit</button></td></tr></tbody></table></div></div>
    </div>`);
};

/**
 * HostelBuddy — Super Admin Users
 */
Pages["superadmin/users"] = function(container) {
  renderSuperAdminSidebar("superadmin/users");
  showPage(container, `
    <div class="sa-main">
      <div class="student-header"><h1>👥 User Management</h1><p>Manage all system users</p></div>
      <div id="sa-users-stats" class="mb-lg"></div>
      <div class="card"><div class="table-container"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
      <tbody><tr><td class="font-semibold">Ravi Kumar</td><td>ravi@hostelbuddy.dev</td><td><span class="badge badge-student">Student</span></td><td><span class="badge badge-success">Active</span></td><td>Jan 10, 2025</td><td><button class="btn btn-sm btn-secondary">Edit</button></td></tr>
      <tr><td class="font-semibold">Dr. Sharma</td><td>sharma@hostelbuddy.dev</td><td><span class="badge badge-admin">Admin</span></td><td><span class="badge badge-success">Active</span></td><td>Dec 1, 2024</td><td><button class="btn btn-sm btn-secondary">Edit</button></td></tr></tbody></table></div></div>
    </div>`);
  renderStatCard("sa-users-stats", [
    { icon: "🎓", label: "Students", value: "450", color: "primary" },
    { icon: "👨‍💼", label: "Admins", value: "6", color: "purple" },
    { icon: "👑", label: "Super Admin", value: "1", color: "amber" },
  ]);
};

/**
 * HostelBuddy — Super Admin Reports
 */
Pages["superadmin/reports"] = function(container) {
  renderSuperAdminSidebar("superadmin/reports");
  showPage(container, `
    <div class="sa-main">
      <div class="student-header"><h1>📈 Reports</h1><p>System-wide analytics and reports</p></div>
      <div class="card mb-lg"><h3 class="font-semibold mb-md">Overall Occupancy</h3><div class="flex justify-between text-sm mb-sm"><span>Total</span><span class="font-bold">85%</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:85%;"></div></div><p class="text-xs text-secondary mt-sm">272 / 320 rooms occupied</p></div>
      <div class="grid grid-2 gap-lg">
        <div class="card"><h3 class="font-semibold mb-md">Boys Hostel</h3><div class="progress-bar"><div class="progress-fill blue" style="width:85%;"></div></div><p class="text-xs text-secondary mt-sm">153 / 180 rooms</p></div>
        <div class="card"><h3 class="font-semibold mb-md">Girls Hostel</h3><div class="progress-bar"><div class="progress-fill green" style="width:85%;"></div></div><p class="text-xs text-secondary mt-sm">119 / 140 rooms</p></div>
      </div>
    </div>`);
};

/**
 * HostelBuddy — Super Admin Settings
 */
Pages["superadmin/settings"] = function(container) {
  renderSuperAdminSidebar("superadmin/settings");
  showPage(container, `
    <div class="sa-main">
      <div class="student-header"><h1>⚙️ Settings</h1><p>System configuration</p></div>
      <div class="card" style="max-width:600px;">
        <h3 class="font-semibold mb-md">General Settings</h3>
        <div class="input-group"><label class="form-label">Institution Name</label><input type="text" class="input" value="State University" /></div>
        <div class="input-group"><label class="form-label">Check-in Time</label><input type="time" class="input" value="22:00" /></div>
        <div class="input-group"><label class="form-label">Check-out Time</label><input type="time" class="input" value="06:00" /></div>
        <div class="input-group"><label class="form-label">Max Guest Stay (nights)</label><input type="number" class="input" value="3" /></div>
        <button class="btn btn-primary" onclick="Toast.show('Settings saved!','success')">Save Settings</button>
      </div>
    </div>`);
};
