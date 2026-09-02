/**
 * HostelBuddy — Card Helpers
 */
function renderStatCard(containerId, stats) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="grid grid-${Math.min(stats.length, 4)} gap-md">
    ${stats.map(s => `
      <div class="stat-card stat-card--${s.color || "primary"}">
        <div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>
        <div class="stat-icon">${s.icon}</div>
      </div>`).join("")}
  </div>`;
}
