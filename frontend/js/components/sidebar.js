/**
 * HostelBuddy — Sidebar Navigation
 */
const NAV_ITEMS = {
  student: [
    { icon: "📊", label: "Dashboard", hash: "student/dashboard" },
    { icon: "📝", label: "Hostel Application", hash: "student/application" },
    { icon: "🏠", label: "My Hostel", hash: "student/myhostel" },
    { icon: "😤", label: "Complaints", hash: "student/complaints" },
    { icon: "👤", label: "Visitors", hash: "student/visitors" },
    { icon: "📢", label: "Announcements", hash: "student/announcements" },
    { icon: "👤", label: "Profile", hash: "student/profile" },
  ],
  admin: [
    { icon: "📊", label: "Dashboard", hash: "admin/dashboard" },
    { icon: "📋", label: "Applications", hash: "admin/applications" },
    { icon: "🛏️", label: "Room Allocation", hash: "admin/allocation" },
    { icon: "👥", label: "Students", hash: "admin/students" },
    { icon: "🚪", label: "Rooms", hash: "admin/rooms" },
    { icon: "😤", label: "Complaints", hash: "admin/complaints" },
    { icon: "👤", label: "Visitors", hash: "admin/visitors" },
    { icon: "📢", label: "Announcements", hash: "admin/announcements" },
    { icon: "📈", label: "Reports", hash: "admin/reports" },
  ],
  superadmin: [
    { icon: "📊", label: "Dashboard", hash: "superadmin/dashboard" },
    { icon: "🏠", label: "Hostel Management", hash: "superadmin/hostels" },
    { icon: "👨‍💼", label: "Admin Management", hash: "superadmin/admins" },
    { icon: "👥", label: "User Management", hash: "superadmin/users" },
    { icon: "📈", label: "Reports", hash: "superadmin/reports" },
    { icon: "⚙️", label: "Settings", hash: "superadmin/settings" },
  ],
};

const BOTTOM_NAV = [
  { icon: "📊", label: "Dashboard", hash: "student/dashboard" },
  { icon: "😤", label: "Complaints", hash: "student/complaints" },
  { icon: "📢", label: "Alerts", hash: "student/announcements" },
  { icon: "👤", label: "Profile", hash: "student/profile" },
];

function renderStudentSidebar(activeItem) {
  _renderSidebar(NAV_ITEMS.student, activeItem, "student-sidebar", "Student");
  renderBottomNav(activeItem);
}

function renderAdminSidebar(activeItem) {
  _renderSidebar(NAV_ITEMS.admin, activeItem, "admin-sidebar", "Admin");
  renderBottomNav(activeItem);
}

function renderSuperAdminSidebar(activeItem) {
  _renderSidebar(NAV_ITEMS.superadmin, activeItem, "sa-sidebar", "Super Admin");
  renderBottomNav(activeItem);
}

function _renderSidebar(items, activeItem, sidebarClass, roleLabel) {
  let sidebar = document.getElementById("sidebar-container");
  if (!sidebar) { sidebar = document.createElement("div"); sidebar.id = "sidebar-container"; document.body.prepend(sidebar); }

  const user = App.getUser();
  const initials = user ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U";
  const roleColor = roleLabel === "Super Admin" ? "var(--superadmin-color)" : roleLabel === "Admin" ? "var(--admin-color)" : "var(--student-color)";

  sidebar.innerHTML = `
    <aside class="${sidebarClass}" id="main-sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">🏠</span>
        <h2>HostelBuddy</h2>
        <span class="role-tag">${roleLabel}</span>
      </div>
      <nav class="sidebar-nav">
        ${items.map(item => `
          <a href="#${item.hash}" class="sidebar-item ${item.hash === activeItem ? "active" : ""}" data-hash="${item.hash}">
            <span class="icon">${item.icon}</span>
            <span class="label">${item.label}</span>
          </a>`).join("")}
      </nav>
      <div class="sidebar-footer">
        <a href="#" class="sidebar-item" onclick="event.preventDefault(); handleLogout();">
          <span class="icon">🚪</span><span class="label">Logout</span>
        </a>
      </div>
    </aside>`;

  /* Mobile toggle */
  let toggle = document.getElementById("mobile-menu-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.id = "mobile-menu-toggle";
    toggle.className = "btn btn-icon md:hidden";
    toggle.style.cssText = "position:fixed;top:12px;left:12px;z-index:150;display:none;";
    toggle.textContent = "☰";
    toggle.onclick = () => { sidebar.querySelector(".sidebar-class")?.classList.toggle("mobile-open"); };
    document.body.appendChild(toggle);
  }
}

function renderBottomNav(activeItem) {
  let bnav = document.getElementById("bottom-nav");
  if (!bnav) { bnav = document.createElement("nav"); bnav.id = "bottom-nav"; bnav.className = "bottom-nav"; document.body.appendChild(bnav); }
  bnav.innerHTML = BOTTOM_NAV.map(item => `
    <a href="#${item.hash}" class="bottom-nav-item ${item.hash === activeItem ? "active" : ""}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>`).join("");
}

function setupMobileSidebar(sidebarClass) {
  const toggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.getElementById("main-sidebar");
  if (toggle) toggle.style.display = window.innerWidth < 768 ? "flex" : "none";
  if (sidebar) {
    sidebar.classList.remove("mobile-open");
    /* Add overlay */
    let overlay = document.getElementById("sidebar-overlay");
    if (!overlay) { overlay = document.createElement("div"); overlay.id = "sidebar-overlay"; overlay.className = "sidebar-overlay"; document.body.appendChild(overlay); }
    overlay.onclick = () => sidebar.classList.remove("mobile-open");
  }
}
