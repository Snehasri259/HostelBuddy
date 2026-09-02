/**
 * HostelBuddy — Toast Notifications
 */
const Toast = {
  _container: null,

  init() {
    this._container = document.createElement("div");
    this._container.className = "toast-container";
    document.body.appendChild(this._container);
  },

  show(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this._container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 300ms ease forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

window.Toast = Toast;
