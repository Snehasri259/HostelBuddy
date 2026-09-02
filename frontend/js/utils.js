/**
 * HostelBuddy — Utility Helpers
 */
function formatDate(date) {
  const d = new Date(date);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function formatTimeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}

function getStatusBadgeClass(status) {
  const map = {
    approved: "badge-success", active: "badge-success", resolved: "badge-success", available: "badge-success",
    pending: "badge-pending", "in-progress": "badge-info",
    rejected: "badge-danger", inactive: "badge-danger", occupied: "badge-danger",
    open: "badge-warning", high: "badge-danger", medium: "badge-warning", low: "badge-success",
  };
  return map[status] || "badge-pending";
}

function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePassword(pw) { return pw && pw.length >= 6; }

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

function generateId() { return Math.random().toString(36).slice(2, 10); }

function truncate(str, length = 50) {
  return str && str.length > length ? str.slice(0, length) + "…" : str;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
