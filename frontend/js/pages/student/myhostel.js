/**
 * HostelBuddy — Student My Hostel Page
 */
Pages["student/myhostel"] = function(container) {
  renderStudentSidebar("student/myhostel");
  showPage(container, `
    <div class="student-main">
      <div class="student-header"><h1>🏠 My Hostel</h1><p>Your current hostel details</p></div>
      <div class="card" style="max-width:600px;">
        <div class="flex items-center gap-lg mb-lg" style="padding-bottom:16px;border-bottom:1px solid var(--border);">
          <div class="avatar avatar-lg">RK</div>
          <div><h2 class="font-bold">Ravi Kumar</h2><p class="text-secondary text-sm">ravi@hostelbuddy.dev</p></div>
        </div>
        <div class="grid grid-3 gap-md">
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;letter-spacing:0.05em;">Block</p><p class="font-semibold">Block A</p></div>
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Room</p><p class="font-semibold">Room 102</p></div>
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Bed</p><p class="font-semibold">B1 (Single)</p></div>
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Floor</p><p class="font-semibold">1st Floor</p></div>
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Status</p><p class="font-semibold" style="color:var(--success);">Allocated ✅</p></div>
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Since</p><p class="font-semibold">Jan 15, 2025</p></div>
        </div>
      </div>
    </div>`);
};

/**
 * HostelBuddy — Student Complaints Page
 */
Pages["student/complaints"] = function(container) {
  renderStudentSidebar("student/complaints");

  const complaints = [
    { subject: "Leaking tap in Room 102", category: "🔧 Plumbing", date: "2025-03-01", priority: "high", status: "open" },
    { subject: "Broken ceiling fan", category: "⚡ Electrical", date: "2025-02-25", priority: "medium", status: "in-progress" },
    { subject: "Cockroach infestation", category: "🧹 Cleanliness", date: "2025-02-20", priority: "high", status: "open" },
    { subject: "Broken study chair", category: "🪑 Furniture", date: "2025-02-15", priority: "low", status: "resolved" },
  ];
  const statusLabels = { open: "Open", "in-progress": "In Progress", resolved: "Resolved" };

  showPage(container, `
    <div class="student-main">
      <div class="flex justify-between items-center mb-lg flex-wrap gap-md">
        <div><h1>😤 Complaints</h1><p class="text-secondary text-sm">Track and submit complaints</p></div>
        <button class="btn btn-primary" onclick="openComplaintModal()">+ New Complaint</button>
      </div>
      <div class="grid gap-md" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr));">
        ${complaints.map(c => `
          <div class="card complaint-card priority-${c.priority}">
            <div class="flex justify-between items-start mb-sm"><h3 class="font-semibold">${c.subject}</h3><span class="badge ${getStatusBadgeClass(c.status)}">${statusLabels[c.status]}</span></div>
            <div class="flex gap-sm mb-sm flex-wrap"><span class="badge badge-info">${c.category}</span><span class="text-xs text-secondary">${formatDate(c.date)}</span></div>
          </div>`).join("")}
      </div>
    </div>`);
};

function openComplaintModal() {
  openModal("New Complaint", `
    <form id="complaintForm">
      <div class="input-group"><label class="form-label">Category <span class="text-danger">*</span></label>
        <select class="select" required><option value="" disabled selected>Select…</option><option>🔧 Plumbing</option><option>⚡ Electrical</option><option>🪑 Furniture</option><option>🧹 Cleanliness</option><option>📋 Other</option></select></div>
      <div class="input-group"><label class="form-label">Subject <span class="text-danger">*</span></label><input type="text" class="input" placeholder="Brief description" required /></div>
      <div class="input-group"><label class="form-label">Description</label><textarea class="textarea" rows="3" placeholder="More details…"></textarea></div>
      <div class="input-group"><label class="form-label">Priority</label>
        <div class="flex gap-md"><label class="flex items-center gap-sm"><input type="radio" name="priority" value="low" /> 🟢 Low</label><label class="flex items-center gap-sm"><input type="radio" name="priority" value="medium" checked /> 🟡 Medium</label><label class="flex items-center gap-sm"><input type="radio" name="priority" value="high" /> 🔴 High</label></div></div>
    </form>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitComplaint()">Submit</button>`);
}

function submitComplaint() { Toast.show("Complaint submitted!", "success"); closeModal(); }

/**
 * HostelBuddy — Student Visitors Page
 */
Pages["student/visitors"] = function(container) {
  renderStudentSidebar("student/visitors");
  showPage(container, `
    <div class="student-main">
      <div class="flex justify-between items-center mb-lg"><div><h1>👤 Visitors</h1><p class="text-secondary text-sm">Manage visitor entries</p></div><button class="btn btn-primary" onclick="Toast.show('Visitor registration coming soon','info')">+ Register Visitor</button></div>
      <div class="card empty-state">No visitors registered yet.</div>
    </div>`);
};

/**
 * HostelBuddy — Student Announcements Page
 */
Pages["student/announcements"] = function(container) {
  renderStudentSidebar("student/announcements");

  const announcements = [
    { id: 1, title: "🔧 Water Supply Maintenance", content: "Scheduled water supply disruption on Saturday, March 8th from 8:00 AM to 2:00 PM.", pinned: true, date: "2025-03-01" },
    { id: 2, title: "📢 Annual Hostel Fest — March 15th", content: "Talent shows, sports tournaments, quiz competitions, and a cultural night!", pinned: true, date: "2025-02-25" },
    { id: 3, title: "🍽️ Mess Menu Update for March", content: "New North Indian and South Indian special dishes on weekends.", pinned: false, date: "2025-02-20" },
    { id: 4, title: "📶 WiFi Upgrade — Block A", content: "Block A WiFi upgraded to 100 Mbps. New SSID: HostelBuddy-BlockA.", pinned: false, date: "2025-02-15" },
  ];

  showPage(container, `
    <div class="student-main">
      <div class="student-header"><h1>📢 Announcements</h1><p>Stay updated with the latest hostel news</p></div>
      <div class="flex flex-col gap-md">
        ${announcements.map(a => `
          <div class="card announcement-card ${a.pinned ? 'pinned' : ''}">
            <div class="flex justify-between items-start mb-sm">
              <h3 class="font-semibold">${a.title}</h3>
              ${a.pinned ? '<span class="badge badge-warning">📌 Pinned</span>' : ''}
            </div>
            <p class="text-xs text-secondary mb-sm">${formatDate(a.date)}</p>
            <div class="announcement-content" id="ann-${a.id}"><p class="text-sm text-secondary">${a.content}</p></div>
            <span class="announcement-expand" onclick="toggleAnnouncement(${a.id})">Read More ▾</span>
          </div>`).join("")}
      </div>
    </div>`);
};

function toggleAnnouncement(id) {
  const el = document.getElementById("ann-" + id);
  if (el) el.classList.toggle("expanded");
}

/**
 * HostelBuddy — Student Profile Page
 */
Pages["student/profile"] = function(container) {
  renderStudentSidebar("student/profile");
  const user = App.getUser();
  showPage(container, `
    <div class="student-main">
      <div class="student-header"><h1>👤 Profile</h1><p>Your account details</p></div>
      <div class="card" style="max-width:600px;">
        <div class="flex items-center gap-lg mb-lg" style="padding-bottom:16px;border-bottom:1px solid var(--border);">
          <div class="avatar avatar-lg">RK</div>
          <div><h2 class="font-bold">${user?.name || "Student"}</h2><p class="text-secondary text-sm">${user?.email || "student@hostelbuddy.dev"}</p></div>
        </div>
        <div class="grid grid-2 gap-md">
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Role</p><p class="font-semibold">Student</p></div>
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Hostel</p><p class="font-semibold">Boys Hostel</p></div>
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Phone</p><p class="font-semibold">+91 98765 43210</p></div>
          <div><p class="text-xs text-secondary font-semibold" style="text-transform:uppercase;">Joined</p><p class="font-semibold">Jan 10, 2025</p></div>
        </div>
        <div class="card-footer"><button class="btn btn-outline" onclick="Toast.show('Edit profile coming soon','info')">Edit Profile</button></div>
      </div>
    </div>`);
};
