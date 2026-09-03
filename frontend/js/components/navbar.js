/**
 * HostelBuddy Top Navbar Component
 * Contains search, notifications, theme toggle, and user menu
 */

const Navbar = {
  /**
   * Render navbar HTML
   */
  render(pageTitle, user) {
    const userData = user || JSON.parse(localStorage.getItem('hb_user') || '{}');
    const initials = Utils.getInitials(userData.name || 'User');
    const notifications = this.getNotifications();

    return `
      <header class="navbar" id="navbar">
        <!-- Left Section -->
        <div class="navbar-left">
          <button class="navbar-hamburger" onclick="Sidebar.openMobile()" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 class="navbar-title">${Utils.sanitize(pageTitle)}</h1>
        </div>

        <!-- Center Section - Search -->
        <div class="navbar-center">
          <div class="navbar-search glass-panel">
            <span class="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input type="text" placeholder="Search..." class="search-input" id="globalSearch">
          </div>
        </div>

        <!-- Right Section -->
        <div class="navbar-right">
          <!-- Notifications -->
          <button class="navbar-icon-btn notification-icon" onclick="Navbar.toggleNotifications()" aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            ${notifications.length > 0 ? `<span class="notification-dot">${notifications.length}</span>` : ''}
          </button>

          <!-- Theme Toggle -->
          <button class="navbar-icon-btn" onclick="Theme.toggle()" aria-label="Toggle theme">
            <svg class="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>

          <!-- User Dropdown -->
          <div class="navbar-user" id="userDropdown">
            <button class="navbar-avatar" onclick="Navbar.toggleDropdown()" aria-label="User menu">
              <div class="avatar">${initials}</div>
            </button>
            
            <div class="user-dropdown" id="userDropdownMenu">
              <div class="dropdown-header">
                <div class="avatar avatar-lg">${initials}</div>
                <div class="dropdown-user-info">
                  <span class="dropdown-name">${Utils.sanitize(userData.name || 'User')}</span>
                  <span class="dropdown-email">${Utils.sanitize(userData.email || '')}</span>
                  <span class="badge badge-${userData.role === 'superadmin' ? 'warning' : userData.role === 'admin' ? 'info' : 'success'}">
                    ${Utils.capitalize(userData.role || 'student')}
                  </span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <a href="#${userData.role || 'student'}/profile" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </a>
              ${userData.role === 'admin' || userData.role === 'superadmin' ? `
                <a href="#${userData.role}/settings" class="dropdown-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Settings
                </a>
              ` : ''}
              <div class="dropdown-divider"></div>
              <button class="dropdown-item dropdown-item--danger" onclick="Navbar.logout()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Notifications Panel -->
      <div class="notifications-panel" id="notificationsPanel">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button onclick="Navbar.clearNotifications()" class="notifications-clear">Clear all</button>
        </div>
        <div class="notifications-list">
          ${notifications.length > 0 ? notifications.map(n => `
            <div class="notification-item ${n.read ? '' : 'unread'}">
              <span class="notification-icon-${n.type}">${this.getNotificationIcon(n.type)}</span>
              <div class="notification-content">
                <p class="notification-text">${Utils.sanitize(n.message)}</p>
                <span class="notification-time">${Utils.timeAgo(n.time)}</span>
              </div>
            </div>
          `).join('') : '<div class="notifications-empty">No notifications</div>'}
        </div>
      </div>
    `;
  },

  /**
   * Get mock notifications
   */
  getNotifications() {
    const stored = localStorage.getItem('hb_notifications');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default notifications
    const defaults = [
      { id: 1, type: 'success', message: 'Your application has been approved', time: new Date(Date.now() - 7200000), read: false },
      { id: 2, type: 'info', message: 'New announcement posted', time: new Date(Date.now() - 86400000), read: false },
      { id: 3, type: 'warning', message: 'Room allocation deadline approaching', time: new Date(Date.now() - 172800000), read: true },
    ];
    
    localStorage.setItem('hb_notifications', JSON.stringify(defaults));
    return defaults;
  },

  /**
   * Get notification icon by type
   */
  getNotificationIcon(type) {
    const fallbacks = {
      success: icons['check-circle'] || '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      info: icons['info'] || '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      warning: icons['alert-triangle'] || '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      error: icons['x-circle'] || '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    };
    return fallbacks[type] || fallbacks.info;
  },

  /**
   * Toggle notifications panel
   */
  toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    const dropdown = document.getElementById('userDropdownMenu');
    
    // Close user dropdown if open
    if (dropdown) dropdown.classList.remove('active');
    
    if (panel) {
      panel.classList.toggle('active');
    }
  },

  /**
   * Clear all notifications
   */
  clearNotifications() {
    localStorage.setItem('hb_notifications', '[]');
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
      const list = panel.querySelector('.notifications-list');
      if (list) {
        list.innerHTML = '<div class="notifications-empty">No notifications</div>';
      }
    }
    // Update badge
    const dot = document.querySelector('.notification-dot');
    if (dot) dot.remove();
  },

  /**
   * Toggle user dropdown
   */
  toggleDropdown() {
    const dropdown = document.getElementById('userDropdownMenu');
    const notifications = document.getElementById('notificationsPanel');
    
    // Close notifications if open
    if (notifications) notifications.classList.remove('active');
    
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  },

  /**
   * Close all dropdowns
   */
  closeDropdowns() {
    const dropdown = document.getElementById('userDropdownMenu');
    const notifications = document.getElementById('notificationsPanel');
    
    if (dropdown) dropdown.classList.remove('active');
    if (notifications) notifications.classList.remove('active');
  },

  /**
   * Logout handler
   */
  logout() {
    localStorage.removeItem('hb_user');
    sessionStorage.removeItem('hb_user');
    window.location.hash = '#login';
    window.location.reload();
  },

  /**
   * Initialize navbar event listeners
   */
  init() {
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      const userDropdown = document.getElementById('userDropdown');
      const notificationsPanel = document.getElementById('notificationsPanel');
      
      if (userDropdown && !userDropdown.contains(e.target)) {
        const dropdown = document.getElementById('userDropdownMenu');
        if (dropdown) dropdown.classList.remove('active');
      }
      
      if (notificationsPanel && !notificationsPanel.contains(e.target)) {
        notificationsPanel.classList.remove('active');
      }
    });

    // Close dropdowns on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdowns();
      }
    });

    // Theme icon visibility
    this.updateThemeIcons();
    document.addEventListener('themeChanged', () => this.updateThemeIcons());
  },

  /**
   * Update theme toggle icons
   */
  updateThemeIcons() {
    const theme = document.documentElement.getAttribute('data-theme');
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  },
};

// Make globally available
window.Navbar = Navbar;
