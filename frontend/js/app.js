/**
 * HostelBuddy — App Core
 *
 * NOTE: All routing is handled by the inline script in index.html.
 * This file only provides the global showToast() helper.
 * Do NOT add a hashchange listener here — index.html owns that.
 */

/* ---- Global showToast helper ---- */
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
