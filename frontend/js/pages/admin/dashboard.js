/**
 * HostelBuddy — Admin Dashboard
 */
Pages["admin/dashboard"] = function(container) {
  const user = App.getUser();
  renderAdminSidebar("admin/dashboard");

  const applications = [
    { name: "Priya Patel", hostel: "Girls Hostel", date: "2025-03-01", status: "pending" },
    { name: "Amit Kumar", hostel: "Boys Hostel", date: "2025-02-28", status: "pending" },
    { name: "Sneha Reddy", hostel: "Girls Hostel", date: "2025-02-25", status: "approved" },
    { name: "Rahul Sharma", hostel: "Boys Hostel", date: "2025-02-22", status: "approved" },
    { name: "Deepa Nair", hostel: "Girls Hostel", date: "2025-02-20", status: "rejected" },
  ];

  showPage(container, `
    <div class="admin-main">
      <div class="student-header"><h1>Hostel Admin Dashboard</h1><p>Welcome, ${user?.name || "Admin"}</p></div>

      <div id="admin-stats" class="mb-lg"></div>

      <div class="card mb-lg">
        <div class="flex justify-between items-center mb-md"><h3 class="font-semibold">📋 Recent Applications</h3>
          <input type="text" class="input" style="max-width:250px;" placeholder="Search students…" id="adminSearch" /></div>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Student</th><th>Hostel</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="adminAppBody"></tbody>
          </table>
        </div>
      </div>

      <div><h3 class="font-semibold mb-md">⚡ Quick Actions</h3>
        <div class="grid grid-3 gap-md">
          <a href="#admin/applications" class="card" style="cursor:pointer;text-decoration:none;"><h4 class="font-semibold mb-sm">📋 Review Applications</h4><p class="text-sm text-secondary">${applications.filter(a=>a.status==="pending").length} pending</p></a>
          <a href="#admin/allocation" class="card" style="cursor:pointer;text-decoration:none;"><h4 class="font-semibold mb-sm">🛏️ Allocate Rooms</h4><p class="text-sm text-secondary">Assign rooms to students</p></a>
          <a href="#admin/reports" class="card" style="cursor:pointer;text-decoration:none;"><h4 class="font-semibold mb-sm">📈 View Reports</h4><p class="text-sm text-secondary">Analytics & occupancy</p></a>
        </div>
      </div>
    </div>`);

  renderStatCard("admin-stats", [
    { icon: "📋", label: "Total Applications", value: applications.length, color: "primary" },
    { icon: "⏳", label: "Pending Reviews", value: applications.filter(a=>a.status==="pending").length, color: "warning" },
    { icon: "🛏️", label: "Allocated Rooms", value: "142", color: "success" },
    { icon: "😤", label: "Active Complaints", value: "8", color: "danger" },
  ]);

  function renderApps() {
    const body = document.getElementById("adminAppBody");
    if (!body) return;
    body.innerHTML = applications.map((app, i) => `
      <tr style="${app.status==='approved'?'opacity:0.6;':''}${app.status==='rejected'?'opacity:0.4;text-decoration:line-through;':''}">
        <td class="font-semibold">${app.name}</td><td>${app.hostel}</td><td>${formatDate(app.date)}</td>
        <td><span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span></td>
        <td class="table-actions">${app.status==='pending' ? `<button class="btn btn-sm btn-success" onclick="handleAppAction(${i},'approved')">✓ Approve</button><button class="btn btn-sm btn-danger" onclick="handleAppAction(${i},'rejected')">✕ Reject</button>` : ""}</td>
      </tr>`).join("");
  }

  window.handleAppAction = (i, status) => {
    applications[i].status = status;
    renderApps();
    Toast.show(`Application ${status} for ${applications[i].name}`, status === "approved" ? "success" : "warning");
  };

  document.getElementById("adminSearch")?.addEventListener("input", debounce((e) => {
    const q = e.target.value.toLowerCase();
    const filtered = applications.filter(a => (a.name + a.hostel).toLowerCase().includes(q));
    const body = document.getElementById("adminAppBody");
    if (!body) return;
    body.innerHTML = filtered.map((app, i) => `
      <tr><td class="font-semibold">${app.name}</td><td>${app.hostel}</td><td>${formatDate(app.date)}</td>
      <td><span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span></td>
      <td class="table-actions">${app.status==='pending' ? `<button class="btn btn-sm btn-success" onclick="handleAppAction(${i},'approved')">✓ Approve</button><button class="btn btn-sm btn-danger" onclick="handleAppAction(${i},'rejected')">✕ Reject</button>` : ""}</td></tr>`).join("");
  }));

  renderApps();
};
