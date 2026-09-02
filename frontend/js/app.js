/**
 * HostelBuddy — App Core
 * Hash-based SPA router, session management, navigation.
 */
const App = {
  _content: null,
  _currentPage: null,

  /* ---- Session helpers ---- */
  getUser()   { try { return JSON.parse(localStorage.getItem("hb_user")); } catch { return null; } },
  setUser(u)  { localStorage.setItem("hb_user", JSON.stringify(u)); },
  clearUser() { localStorage.removeItem("hb_user"); },
  isLoggedIn(){ return !!this.getUser(); },
  getRole()   { return this.getUser()?.role || null; },

  /* ---- Navigation ---- */
  navigateTo(page) { location.hash = page; },

  /* ---- Init ---- */
  initApp() {
    this._content = document.getElementById("app-content");
    Toast.init();
    window.addEventListener("hashchange", () => this._route());
    this._route();
  },

  _route() {
    const hash = location.hash.slice(1) || (this.isLoggedIn() ? (this.getRole() + "/dashboard") : "login");
    const [role, page] = hash.includes("/") ? hash.split("/") : [hash, "dashboard"];

    if (role === "login") { this._loadPage("login"); return; }
    if (!this.isLoggedIn()) { this.navigateTo("login"); return; }

    this._loadPage(role + "/" + page);
  },

  _loadPage(key) {
    const renderer = Pages[key];
    if (!renderer) { this._content.innerHTML = '<div class="container p-lg"><h2>Page not found</h2></div>'; return; }
    this._content.innerHTML = "";
    this._currentPage = key;
    renderer(this._content, key);
  }
};

/* ---- Pages registry ---- */
const Pages = {};

/* ---- Global showPage helper ---- */
function showPage(container, html) { container.innerHTML = html; }

window.App = App;
window.Pages = Pages;
window.showPage = showPage;

// Global showToast helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || document.body;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 300ms ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
window.showToast = showToast;
