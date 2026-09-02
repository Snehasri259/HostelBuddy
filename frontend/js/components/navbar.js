/**
 * HostelBuddy — Navbar (Top Bar) Component
 */
const Navbar = {
  render(config) {
    const { title = "HostelBuddy", subtitle = "", avatarText = "SA", viewToggle = null, onToggle } = config;
    const topbar = Utils.qs("#topbar");
    if (!topbar) return;

    const toggleHtml = viewToggle ? `
      <div class="view-toggle" id="viewToggle">
        <button class="view-toggle__btn ${viewToggle.current === "student" ? "view-toggle__btn--active" : ""}" data-view="student">Student</button>
        <button class="view-toggle__btn ${viewToggle.current === "admin" ? "view-toggle__btn--active" : ""}" data-view="admin">Admin</button>
      </div>` : "";

    topbar.innerHTML = `
      <div class="topbar__left">
        <button class="topbar__hamburger" id="hamburgerBtn" aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div class="topbar__title-group">
          <h2 class="topbar__title" id="topbarTitle">${title}</h2>
          ${subtitle ? `<span class="topbar__greeting">${subtitle}</span>` : ""}
        </div>
      </div>
      <div class="topbar__right">
        ${toggleHtml}
        <button class="topbar__icon-btn" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="topbar__badge">3</span>
        </button>
        <div class="topbar__avatar">${avatarText}</div>
      </div>`;

    Sidebar.init();

    if (viewToggle && onToggle) {
      Utils.qsa(".view-toggle__btn").forEach(btn => {
        btn.addEventListener("click", () => {
          Utils.qsa(".view-toggle__btn").forEach(b => b.classList.remove("view-toggle__btn--active"));
          btn.classList.add("view-toggle__btn--active");
          onToggle(btn.getAttribute("data-view"));
        });
      });
    }
  }
};

window.Navbar = Navbar;
