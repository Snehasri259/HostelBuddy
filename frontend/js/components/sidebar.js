/**
 * HostelBuddy Sidebar Navigation Component
 * Role-based navigation with collapse/expand functionality
 */

const Sidebar = {
  // Navigation items organized by role
  navItems: {
    student: [
      { icon: 'dashboard', label: 'Dashboard', hash: '#student/dashboard' },
      { icon: 'bed', label: 'Hostel Application', hash: '#student/application' },
      { icon: 'building', label: 'My Hostel', hash: '#student/myhostel' },
      { icon: 'complaint', label: 'Complaints', hash: '#student/complaints' },
      { icon: 'visitor', label: 'Visitors', hash: '#student/visitors' },
      { icon: 'announcement', label: 'Announcements', hash: '#student/announcements' },
      { icon: 'users', label: 'Profile', hash: '#student/profile' },
    ],
    admin: [
      { icon: 'dashboard', label: 'Dashboard', hash: '#admin/dashboard' },
      { icon: 'mail', label: 'Applications', hash: '#admin/applications' },
      { icon: 'bed', label: 'Room Allocation', hash: '#admin/allocation' },
      { icon: 'users', label: 'Students', hash: '#admin/students' },
      { icon: 'building', label: 'Rooms', hash: '#admin/rooms' },
      { icon: 'complaint', label: 'Complaints', hash: '#admin/complaints' },
      { icon: 'visitor', label: 'Visitors', hash: '#admin/visitors' },
      { icon: 'announcement', label: 'Announcements', hash: '#admin/announcements' },
      { icon: 'bar-chart', label: 'Reports', hash: '#admin/reports' },
    ],
    superadmin: [
      { icon: 'dashboard', label: 'Dashboard', hash: '#superadmin/dashboard' },
      { icon: 'building', label: 'Hostels', hash: '#superadmin/hostels' },
      { icon: 'users', label: 'Admins', hash: '#superadmin/admins' },
      { icon: 'users', label: 'Users', hash: '#superadmin/users' },
      { icon: 'bar-chart', label: 'Reports', hash: '#superadmin/reports' },
      { icon: 'settings', label: 'Settings', hash: '#superadmin/settings' },
    ],
  },

  /**
   * Render sidebar HTML based on user role
   */
  render(role, activePage) {
    const items = this.navItems[role] || this.navItems.student;
    const user = JSON.parse(localStorage.getItem('hb_user') || '{}');
    const isCollapsed = localStorage.getItem('hb_sidebar_collapsed') === 'true';
    
    const roleBadges = {
      student: { label: 'Student', class: 'badge-student' },
      admin: { label: 'Admin', class: 'badge-admin' },
      superadmin: { label: 'Super Admin', class: 'badge-superadmin' },
    };
    
    const badge = roleBadges[role] || roleBadges.student;
    const initials = Utils.getInitials(user.name || 'User');

    return `
      <aside class="sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}" id="sidebar">
        <!-- Logo -->
        <div class="sidebar-logo">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span class="logo-text">HostelBuddy</span>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <ul class="nav-list">
            ${items.map(item => `
              <li class="nav-item">
                <a href="${item.hash}" class="nav-link ${this.isActive(item.hash, activePage) ? 'active' : ''}" data-page="${item.hash.split('/').pop()}">
                  <span class="nav-icon">${icons[item.icon] || ''}</span>
                  <span class="nav-label">${item.label}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>

        <!-- User Section -->
        <div class="sidebar-user">
          <div class="user-info">
            <div class="avatar">${initials}</div>
            <div class="user-details">
              <span class="user-name">${Utils.sanitize(user.name || 'User')}</span>
              <span class="badge ${badge.class}">${badge.label}</span>
            </div>
          </div>
          <button class="logout-btn" onclick="Sidebar.logout()" title="Logout">
            <span class="nav-icon">${icons.logout}</span>
            <span class="nav-label">Logout</span>
          </button>
        </div>

        <!-- Collapse Toggle -->
        <button class="sidebar-toggle" onclick="Sidebar.toggle()" aria-label="Toggle sidebar">
          <span class="toggle-icon">${isCollapsed ? icons['chevron-right'] : icons['chevron-left']}</span>
        </button>
      </aside>

      <!-- Mobile Overlay -->
      <div class="sidebar-overlay" id="sidebarOverlay" onclick="Sidebar.closeMobile()"></div>
    `;
  },

  /**
   * Check if nav item is active
   */
  isActive(hash, activePage) {
    if (activePage) {
      return hash.includes(activePage);
    }
    return window.location.hash === hash;
  },

  /**
   * Toggle sidebar collapse
   */
  toggle() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const isCollapsed = sidebar.classList.toggle('sidebar--collapsed');
    localStorage.setItem('hb_sidebar_collapsed', isCollapsed);

    // Update toggle icon
    const toggleIcon = sidebar.querySelector('.toggle-icon');
    if (toggleIcon) {
      toggleIcon.innerHTML = isCollapsed ? icons['chevron-right'] : icons['chevron-left'];
    }
  },

  /**
   * Open sidebar on mobile
   */
  openMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) sidebar.classList.add('sidebar--mobile-open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  /**
   * Close sidebar on mobile
   */
  closeMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) sidebar.classList.remove('sidebar--mobile-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  /**
   * Set active page
   */
  setActivePage(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
  },

  /**
   * Logout handler
   */
  logout() {
    localStorage.removeItem('hb_user');
    sessionStorage.removeItem('hb_user');
    window.location.hash = '#login';
  },

  /**
   * Initialize sidebar event listeners
   */
  init() {
    // Close sidebar on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobile();
      }
    });

    // Close sidebar when clicking nav links on mobile
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.closeMobile();
        }
      });
    });
  },
};

// Make globally available
window.Sidebar = Sidebar;
