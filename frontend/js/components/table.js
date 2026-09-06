/**
 * HostelBuddy — Data Table
 */
function renderTable(containerId, columns, data, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let filteredData = [...data];
  let currentPage = 1;
  const pageSize = options.pageSize || 10;
  let sortCol = null, sortDir = "asc";

  function render() {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const pageData = filteredData.slice(start, start + pageSize);

    let html = "";
    if (options.searchable) {
      html += `<div class="flex justify-between items-center mb-md flex-wrap gap-sm">
        <span class="text-sm text-secondary">${filteredData.length} records</span>
        <input type="text" class="input" style="max-width:250px;" placeholder="Search…" id="${containerId}-search" />
      </div>`;
    }

    html += `<div class="table-container"><table class="table"><thead><tr>`;
    columns.forEach(col => {
      const sortable = col.sortable !== false ? ` style="cursor:pointer;" onclick="sortTable('${containerId}','${col.key}')"` : "";
      const arrow = sortCol === col.key ? (sortDir === "asc" ? " \u2191" : " \u2193") : "";
      html += `<th${sortable}>${col.label}${arrow}</th>`;
    });
    if (options.actions) html += `<th>Actions</th>`;
    html += `</tr></thead><tbody>`;

    if (pageData.length === 0) {
      html += `<tr><td colspan="${columns.length + (options.actions ? 1 : 0)}" class="empty-state">No data found</td></tr>`;
    } else {
      pageData.forEach((row, i) => {
        html += `<tr>`;
        columns.forEach(col => {
          const val = col.render ? col.render(row[col.key], row) : (row[col.key] || "");
          html += `<td>${val}</td>`;
        });
        if (options.actions) html += `<td class="table-actions">${options.actions(row, start + i)}</td>`;
        html += `</tr>`;
      });
    }
    html += `</tbody></table></div>`;

    /* Pagination */
    if (totalPages > 1) {
      html += `<div class="flex justify-between items-center mt-md text-sm">
        <span class="text-secondary">Page ${currentPage} of ${totalPages}</span>
        <div class="flex gap-sm">
          <button class="btn btn-sm btn-secondary" ${currentPage === 1 ? "disabled" : ""} onclick="paginateTable('${containerId}',-1)">← Prev</button>
          <button class="btn btn-sm btn-secondary" ${currentPage === totalPages ? "disabled" : ""} onclick="paginateTable('${containerId}',1)">Next →</button>
        </div>
      </div>`;
    }

    container.innerHTML = html;

    /* Search binding */
    if (options.searchable) {
      const searchInput = document.getElementById(containerId + "-search");
      if (searchInput) {
        searchInput.addEventListener("input", debounce((e) => {
          const q = e.target.value.toLowerCase();
          filteredData = data.filter(row => columns.some(col => String(row[col.key] || "").toLowerCase().includes(q)));
          currentPage = 1;
          render();
        }, 300));
      }
    }
  }

  /* Store render fn for external access */
  container._renderFn = render;
  render();
}

window._tableInstances = {};

function sortTable(containerId, col) {
  /* Simplified sort toggle */
  const container = document.getElementById(containerId);
  if (container?._renderFn) container._renderFn();
}

function paginateTable(containerId, delta) {
  const container = document.getElementById(containerId);
  if (container?._renderFn) container._renderFn();
}
