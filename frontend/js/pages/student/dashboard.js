/**
 * HostelBuddy — Student Dashboard
 */
Pages["student/dashboard"] = function(container) {
  const user = App.getUser();
  renderStudentSidebar("student/dashboard");

  showPage(container, `
    <div class="student-main">
      <div class="student-header">
        <h1>Welcome back, ${user?.name || "Student"}! 👋</h1>
        <p>Here's your hostel status</p>
      </div>

      <div id="stat-cards" class="mb-lg"></div>

      <div class="grid grid-2 gap-lg">
        <div class="card">
          <div class="card-header"><h3 class="font-semibold">📋 Recent Activity</h3></div>
          <div class="card-body">
            <div class="flex flex-col gap-md">
              <div class="flex items-center gap-md p-sm" style="border-left:3px solid var(--success);">
                <div><p class="font-semibold text-sm">Application approved</p><p class="text-xs text-secondary">2 hours ago</p></div>
              </div>
              <div class="flex items-center gap-md p-sm" style="border-left:3px solid var(--primary);">
                <div><p class="font-semibold text-sm">New announcement posted</p><p class="text-xs text-secondary">1 day ago</p></div>
              </div>
              <div class="flex items-center gap-md p-sm" style="border-left:3px solid var(--admin-color);">
                <div><p class="font-semibold text-sm">Room allocated: Block A, Room 102</p><p class="text-xs text-secondary">3 days ago</p></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h3 class="font-semibold">⚡ Quick Actions</h3></div>
          <div class="card-body flex flex-col gap-sm">
            <a href="#student/application" class="btn btn-outline w-full" style="justify-content:flex-start;">📝 Hostel Application</a>
            <a href="#student/myhostel" class="btn btn-outline w-full" style="justify-content:flex-start;">🏠 My Hostel</a>
            <a href="#student/complaints" class="btn btn-outline w-full" style="justify-content:flex-start;">😤 Complaints</a>
            <a href="#student/announcements" class="btn btn-outline w-full" style="justify-content:flex-start;">📢 Announcements</a>
          </div>
        </div>
      </div>
    </div>`);

  renderStatCard("stat-cards", [
    { icon: "✅", label: "Application Status", value: "Approved", color: "success" },
    { icon: "⚠️", label: "Pending Alerts", value: "2", color: "warning" },
    { icon: "😤", label: "Active Complaints", value: "0", color: "info" },
  ]);
};
