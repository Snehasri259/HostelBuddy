/**
 * HostelBuddy — Admin Dashboard Logic
 *
 * • Sidebar toggle (mobile)
 * • Approve / Reject application handlers with row state
 * • Table column sorting (name, hostel, date, status)
 * • Live search filtering
 * • Active navigation state
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     DOM references
     ------------------------------------------------------------------ */
  var sidebar = document.getElementById("sidebar");
  var sidebarOverlay = document.getElementById("sidebarOverlay");
  var hamburgerBtn = document.getElementById("hamburgerBtn");
  var applicationsBody = document.getElementById("applicationsBody");
  var applicationsTable = document.getElementById("applicationsTable");
  var searchInput = document.getElementById("searchInput");
  var totalAppsEl = document.getElementById("totalApps");
  var pendingReviewsEl = document.getElementById("pendingReviews");

  var allNavItems = document.querySelectorAll(
    ".nav-item[data-page], .bottomnav__item[data-page]"
  );

  /* ------------------------------------------------------------------
     Mock data — recent applications
     ------------------------------------------------------------------ */
  var applications = [
    { name: "Priya Patel",      hostel: "Girls Hostel", date: "2025-03-01", status: "pending" },
    { name: "Amit Kumar",       hostel: "Boys Hostel",  date: "2025-02-28", status: "pending" },
    { name: "Sneha Reddy",      hostel: "Girls Hostel", date: "2025-02-25", status: "approved" },
    { name: "Rahul Sharma",     hostel: "Boys Hostel",  date: "2025-02-22", status: "approved" },
    { name: "Deepa Nair",       hostel: "Girls Hostel", date: "2025-02-20", status: "rejected" },
  ];

  /* Track sort state */
  var currentSort = { column: null, direction: "asc" };

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  var statusLabels = {
    approved:  "Approved",
    rejected:  "Rejected",
    pending:   "Pending",
    allocated: "Allocated",
  };

  /**
   * Update the stat counters based on current data.
   */
  function updateStats() {
    var total = applications.length;
    var pending = applications.filter(function (a) { return a.status === "pending"; }).length;

    if (totalAppsEl)    totalAppsEl.textContent = total;
    if (pendingReviewsEl) pendingReviewsEl.textContent = pending;
  }

  /**
   * Format a date string to a human-friendly form.
   */
  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  /* ------------------------------------------------------------------
     Render the applications table
     ------------------------------------------------------------------ */
  function renderTable(data) {
    if (!applicationsBody) return;

    if (data.length === 0) {
      applicationsBody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;padding:32px 20px;color:#64748b;">No applications found.</td></tr>';
      return;
    }

    applicationsBody.innerHTML = data
      .map(function (app, i) {
        var rowClass = "";
        if (app.status === "approved") rowClass = " row-approved";
        if (app.status === "rejected") rowClass = " row-rejected";

        var actions = "";
        if (app.status === "pending") {
          actions =
            '<button class="btn-action btn-action--view" data-action="view" data-idx="' + i + '">View</button>' +
            '<button class="btn-action btn-action--approve" data-action="approve" data-idx="' + i + '">Approve</button>' +
            '<button class="btn-action btn-action--reject" data-action="reject" data-idx="' + i + '">Reject</button>';
        } else {
          actions = '<button class="btn-action btn-action--view" data-action="view" data-idx="' + i + '">View</button>';
        }

        return (
          '<tr class="' + rowClass + '">' +
            '<td><strong>' + app.name + '</strong></td>' +
            '<td>' + app.hostel + '</td>' +
            '<td>' + formatDate(app.date) + '</td>' +
            '<td><span class="badge badge--' + app.status + '">' +
              '<span class="badge__dot"></span>' +
              statusLabels[app.status] +
            '</span></td>' +
            '<td><div class="action-buttons">' + actions + '</div></td>' +
          '</tr>'
        );
      })
      .join("");

    attachRowHandlers();
  }

  /* ------------------------------------------------------------------
     Row action handlers (approve / reject / view)
     ------------------------------------------------------------------ */
  function attachRowHandlers() {
    applicationsBody.querySelectorAll("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-action");
        var idx = parseInt(btn.getAttribute("data-idx"), 10);
        var app = applications[idx];
        if (!app) return;

        if (action === "approve") {
          app.status = "approved";
          console.log(
            "%c✅ Admin%c Approved application for " + app.name,
            "color: #10b981; font-weight: bold",
            "color: inherit"
          );
        } else if (action === "reject") {
          app.status = "rejected";
          console.log(
            "%c❌ Admin%c Rejected application for " + app.name,
            "color: #ef4444; font-weight: bold",
            "color: inherit"
          );
        } else if (action === "view") {
          console.log(
            "%c📄 Admin%c View application for " + app.name,
            "color: #2563eb; font-weight: bold",
            "color: inherit"
          );
          alert("Viewing application for " + app.name + " (Mock)");
          return; /* Don't re-render for view */
        }

        updateStats();
        renderFiltered();
      });
    });
  }

  /* ------------------------------------------------------------------
     Table sorting
     ------------------------------------------------------------------ */
  function sortData(data, column, direction) {
    var sorted = data.slice();
    var dir = direction === "asc" ? 1 : -1;

    sorted.sort(function (a, b) {
      var valA = a[column] || "";
      var valB = b[column] || "";

      if (column === "date") {
        return (new Date(valA) - new Date(valB)) * dir;
      }
      return valA.localeCompare(valB) * dir;
    });

    return sorted;
  }

  function clearSortIndicators() {
    var ths = applicationsTable.querySelectorAll("th[data-sort]");
    ths.forEach(function (th) {
      th.classList.remove("sort-asc", "sort-desc");
    });
  }

  /* Attach sort click handlers to table headers */
  function initSorting() {
    var ths = applicationsTable.querySelectorAll("th[data-sort]");
    ths.forEach(function (th) {
      th.addEventListener("click", function () {
        var col = th.getAttribute("data-sort");

        /* Toggle direction */
        if (currentSort.column === col) {
          currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
        } else {
          currentSort.column = col;
          currentSort.direction = "asc";
        }

        clearSortIndicators();
        th.classList.add("sort-" + currentSort.direction);

        renderFiltered();
      });
    });
  }

  /* ------------------------------------------------------------------
     Search filtering
     ------------------------------------------------------------------ */
  function getFilteredData() {
    var query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    var data = applications;

    /* Apply search */
    if (query) {
      data = data.filter(function (app) {
        return (
          app.name.toLowerCase().indexOf(query) !== -1 ||
          app.hostel.toLowerCase().indexOf(query) !== -1 ||
          app.status.toLowerCase().indexOf(query) !== -1
        );
      });
    }

    /* Apply sort */
    if (currentSort.column) {
      data = sortData(data, currentSort.column, currentSort.direction);
    }

    return data;
  }

  function renderFiltered() {
    renderTable(getFilteredData());
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderFiltered);
  }

  /* ------------------------------------------------------------------
     Sidebar / mobile drawer
     ------------------------------------------------------------------ */
  function openSidebar() {
    sidebar.classList.add("is-open");
    sidebarOverlay.classList.add("is-open");
    sidebarOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    sidebarOverlay.classList.remove("is-open");
    sidebarOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  hamburgerBtn.addEventListener("click", openSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });

  /* ------------------------------------------------------------------
     Navigation active state
     ------------------------------------------------------------------ */
  allNavItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      var page = item.getAttribute("data-page");
      if (!page) return;

      allNavItems.forEach(function (el) {
        el.classList.toggle("active", el.getAttribute("data-page") === page);
      });

      if (window.innerWidth < 768) closeSidebar();

      console.log(
        "%c🧭 HostelBuddy Admin%c Navigated to: " + page,
        "color: #8b5cf6; font-weight: bold",
        "color: inherit"
      );
    });
  });

  /* ------------------------------------------------------------------
     Logout
     ------------------------------------------------------------------ */
  var sidebarLogout = document.getElementById("sidebarLogout");
  if (sidebarLogout) {
    sidebarLogout.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(
        "%c🔓 HostelBuddy Admin%c Logout triggered",
        "color: #ef4444; font-weight: bold",
        "color: inherit"
      );
      alert("Logged out! (Mock)");
    });
  }

  /* ------------------------------------------------------------------
     Quick action card handlers
     ------------------------------------------------------------------ */
  document.querySelectorAll(".action-card[data-action]").forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      var action = card.getAttribute("data-action");

      console.log(
        "%c⚡ HostelBuddy Admin%c Quick action: " + action,
        "color: #8b5cf6; font-weight: bold",
        "color: inherit"
      );

      alert("Quick action: " + action + " (Mock)");
    });
  });

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  updateStats();
  renderFiltered();
  initSorting();
})();
