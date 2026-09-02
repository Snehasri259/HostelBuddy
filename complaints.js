/**
 * HostelBuddy — Complaints Page Logic
 *
 * • Student / Admin view toggle
 * • New complaint modal (open, close, submit)
 * • Complaint cards rendering (student view)
 * • Admin table with status updates & resolve
 * • Filter bar: status, category, search
 * • Sidebar toggle & nav state
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     DOM references
     ------------------------------------------------------------------ */
  var sidebar = document.getElementById("sidebar");
  var sidebarOverlay = document.getElementById("sidebarOverlay");
  var hamburgerBtn = document.getElementById("hamburgerBtn");

  /* View panels */
  var studentView = document.getElementById("studentView");
  var adminView = document.getElementById("adminView");
  var viewToggle = document.getElementById("viewToggle");
  var topbarTitle = document.getElementById("topbarTitle");

  /* Student view */
  var newComplaintBtn = document.getElementById("newComplaintBtn");
  var complaintCards = document.getElementById("complaintCards");

  /* Admin view */
  var filterStatus = document.getElementById("filterStatus");
  var filterCategory = document.getElementById("filterCategory");
  var filterSearch = document.getElementById("filterSearch");
  var adminBody = document.getElementById("adminBody");

  /* Modal */
  var modalOverlay = document.getElementById("modalOverlay");
  var modalClose = document.getElementById("modalClose");
  var modalCancel = document.getElementById("modalCancel");
  var complaintForm = document.getElementById("complaintForm");

  var allNavItems = document.querySelectorAll(
    ".nav-item[data-page], .bottomnav__item[data-page]"
  );

  /* ------------------------------------------------------------------
     Mock data
     ------------------------------------------------------------------ */
  var studentComplaints = [
    {
      id: "C001",
      subject: "Leaking tap in Room 102",
      category: "plumbing",
      description: "The bathroom tap has been leaking continuously for the past two days.",
      priority: "high",
      status: "open",
      date: "2025-03-01",
    },
    {
      id: "C002",
      subject: "Broken ceiling fan",
      category: "electrical",
      description: "The ceiling fan in my room is making a loud noise and not spinning properly.",
      priority: "medium",
      status: "in-progress",
      date: "2025-02-25",
    },
    {
      id: "C003",
      subject: "Cockroach infestation in kitchen",
      category: "cleanliness",
      description: "There are cockroaches in the kitchen area. Need pest control.",
      priority: "high",
      status: "open",
      date: "2025-02-20",
    },
    {
      id: "C004",
      subject: "Broken study chair",
      category: "furniture",
      description: "The chair at my study desk has a broken leg. It's unstable and unsafe.",
      priority: "low",
      status: "resolved",
      date: "2025-02-15",
    },
  ];

  var adminComplaints = [
    { id: "C001", student: "Ravi Kumar",    category: "plumbing",     subject: "Leaking tap in Room 102",        priority: "high",   status: "open" },
    { id: "C002", student: "Amit Kumar",    category: "electrical",   subject: "Broken ceiling fan",             priority: "medium", status: "in-progress" },
    { id: "C003", student: "Priya Patel",   category: "cleanliness",  subject: "Cockroach infestation",          priority: "high",   status: "open" },
    { id: "C004", student: "Ravi Kumar",    category: "furniture",    subject: "Broken study chair",             priority: "low",    status: "resolved" },
    { id: "C005", student: "Sneha Reddy",   category: "plumbing",     subject: "No hot water supply",            priority: "medium", status: "in-progress" },
    { id: "C006", student: "Deepa Nair",    category: "other",        subject: "WiFi not working in Block A",    priority: "high",   status: "open" },
    { id: "C007", student: "Rahul Sharma",  category: "cleanliness",  subject: "Bathroom not cleaned regularly", priority: "low",    status: "open" },
    { id: "C008", student: "Anjali Gupta",  category: "electrical",   subject: "Frequent power cuts in room",    priority: "medium", status: "resolved" },
  ];

  var nextId = 9;

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  var categoryLabels = {
    plumbing: "🔧 Plumbing",
    electrical: "⚡ Electrical",
    furniture: "🪑 Furniture",
    cleanliness: "🧹 Cleanliness",
    other: "📋 Other",
  };

  var statusLabels = {
    "open": "Open",
    "in-progress": "In Progress",
    "resolved": "Resolved",
  };

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function today() {
    return new Date().toISOString().split("T")[0];
  }

  /* ------------------------------------------------------------------
     Student view — render complaint cards
     ------------------------------------------------------------------ */
  function renderStudentCards() {
    complaintCards.innerHTML = studentComplaints
      .map(function (c) {
        return (
          '<div class="complaint-card">' +
            '<div class="complaint-card__header">' +
              '<h3 class="complaint-card__subject">' + c.subject + '</h3>' +
              '<span class="badge badge--' + c.status + '">' +
                '<span class="badge__dot"></span>' +
                statusLabels[c.status] +
              '</span>' +
            '</div>' +
            '<div class="complaint-card__meta">' +
              '<span class="complaint-card__category">' + categoryLabels[c.category] + '</span>' +
              '<span class="complaint-card__date">' + formatDate(c.date) + '</span>' +
            '</div>' +
            (c.description
              ? '<p class="complaint-card__desc">' + c.description + '</p>'
              : '') +
          '</div>'
        );
      })
      .join("");
  }

  /* ------------------------------------------------------------------
     Admin view — render table
     ------------------------------------------------------------------ */
  function getFilteredAdminData() {
    var status = filterStatus.value;
    var category = filterCategory.value;
    var query = filterSearch.value.trim().toLowerCase();

    return adminComplaints.filter(function (c) {
      if (status && c.status !== status) return false;
      if (category && c.category !== category) return false;
      if (query) {
        var hay = (c.student + " " + c.subject + " " + c.category).toLowerCase();
        if (hay.indexOf(query) === -1) return false;
      }
      return true;
    });
  }

  function renderAdminTable() {
    var data = getFilteredAdminData();

    if (data.length === 0) {
      adminBody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;padding:32px 20px;color:#64748b;">No complaints match your filters.</td></tr>';
      return;
    }

    adminBody.innerHTML = data
      .map(function (c) {
        var isResolved = c.status === "resolved";
        return (
          '<tr>' +
            '<td><strong>' + c.student + '</strong></td>' +
            '<td>' + categoryLabels[c.category] + '</td>' +
            '<td>' + c.subject + '</td>' +
            '<td><span class="badge badge--' + c.priority + '"><span class="badge__dot"></span>' + c.priority.charAt(0).toUpperCase() + c.priority.slice(1) + '</span></td>' +
            '<td>' +
              '<select class="table-status-select" data-id="' + c.id + '">' +
                '<option value="open"'        + (c.status === "open"        ? ' selected' : '') + '>Open</option>' +
                '<option value="in-progress"' + (c.status === "in-progress" ? ' selected' : '') + '>In Progress</option>' +
                '<option value="resolved"'    + (c.status === "resolved"    ? ' selected' : '') + '>Resolved</option>' +
              '</select>' +
            '</td>' +
            '<td>' +
              '<button class="btn-resolve" data-resolve="' + c.id + '"' +
              (isResolved ? ' disabled' : '') + '>Resolve</button>' +
            '</td>' +
          '</tr>'
        );
      })
      .join("");

    attachAdminHandlers();
  }

  function attachAdminHandlers() {
    /* Status change */
    adminBody.querySelectorAll(".table-status-select").forEach(function (sel) {
      sel.addEventListener("change", function () {
        var id = sel.getAttribute("data-id");
        var newStatus = sel.value;
        updateAdminComplaint(id, newStatus);
      });
    });

    /* Resolve button */
    adminBody.querySelectorAll("[data-resolve]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-resolve");
        updateAdminComplaint(id, "resolved");
      });
    });
  }

  function updateAdminComplaint(id, newStatus) {
    for (var i = 0; i < adminComplaints.length; i++) {
      if (adminComplaints[i].id === id) {
        adminComplaints[i].status = newStatus;
        break;
      }
    }

    /* Also update student complaints if matching id */
    for (var j = 0; j < studentComplaints.length; j++) {
      if (studentComplaints[j].id === id) {
        studentComplaints[j].status = newStatus;
        break;
      }
    }

    console.log(
      "%c📝 HostelBuddy%c Complaint " + id + " → " + statusLabels[newStatus],
      "color: #2563eb; font-weight: bold",
      "color: inherit"
    );

    renderAdminTable();
  }

  /* Filter listeners */
  if (filterStatus)    filterStatus.addEventListener("change", renderAdminTable);
  if (filterCategory)  filterCategory.addEventListener("change", renderAdminTable);
  if (filterSearch)    filterSearch.addEventListener("input", renderAdminTable);

  /* ------------------------------------------------------------------
     View toggle
     ------------------------------------------------------------------ */
  function switchView(view) {
    var isStudent = view === "student";
    studentView.hidden = !isStudent;
    adminView.hidden = isStudent;
    topbarTitle.textContent = isStudent ? "😤 Complaints" : "Complaints Management";

    viewToggle.querySelectorAll(".view-toggle__btn").forEach(function (btn) {
      btn.classList.toggle("view-toggle__btn--active", btn.getAttribute("data-view") === view);
    });

    if (isStudent) {
      renderStudentCards();
    } else {
      renderAdminTable();
    }
  }

  viewToggle.querySelectorAll(".view-toggle__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchView(btn.getAttribute("data-view"));
    });
  });

  /* ------------------------------------------------------------------
     Modal
     ------------------------------------------------------------------ */
  function openModal() {
    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    /* Focus first input */
    setTimeout(function () {
      document.getElementById("compCategory").focus();
    }, 100);
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
    complaintForm.reset();
    clearFormErrors();
  }

  newComplaintBtn.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);

  /* Close on overlay click */
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  /* Close on Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modalOverlay.hidden) closeModal();
  });

  /* ------------------------------------------------------------------
     Form validation
     ------------------------------------------------------------------ */
  function setFieldError(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function clearFormErrors() {
    ["categoryError", "subjectError", "priorityError"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = "";
    });
  }

  complaintForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFormErrors();

    var category = document.getElementById("compCategory").value;
    var subject = document.getElementById("compSubject").value.trim();
    var description = document.getElementById("compDesc").value.trim();
    var priority = complaintForm.querySelector('input[name="priority"]:checked');
    var hasErrors = false;

    if (!category) {
      setFieldError("categoryError", "Please select a category.");
      hasErrors = true;
    }

    if (!subject) {
      setFieldError("subjectError", "Please enter a subject.");
      hasErrors = true;
    }

    if (!priority) {
      setFieldError("priorityError", "Please select a priority.");
      hasErrors = true;
    }

    if (hasErrors) return;

    var newComplaint = {
      id: "C" + String(nextId++).padStart(3, "0"),
      subject: subject,
      category: category,
      description: description,
      priority: priority.value,
      status: "open",
      date: today(),
    };

    /* Add to both views */
    studentComplaints.unshift(newComplaint);
    adminComplaints.unshift({
      id: newComplaint.id,
      student: "Ravi Kumar",
      category: newComplaint.category,
      subject: newComplaint.subject,
      priority: newComplaint.priority,
      status: "open",
    });

    console.log(
      "%c📝 HostelBuddy%c New complaint: " + subject,
      "color: #2563eb; font-weight: bold",
      "color: inherit"
    );

    closeModal();
    renderStudentCards();
    renderAdminTable();
  });

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
    if (e.key === "Escape" && modalOverlay.hidden) closeSidebar();
  });

  /* ------------------------------------------------------------------
     Navigation active state
     ------------------------------------------------------------------ */
  allNavItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      var href = item.getAttribute("href");
      if (href && href !== "#") return;

      e.preventDefault();
      var page = item.getAttribute("data-page");
      if (!page) return;

      allNavItems.forEach(function (el) {
        el.classList.toggle("active", el.getAttribute("data-page") === page);
      });

      if (window.innerWidth < 768) closeSidebar();
    });
  });

  /* ------------------------------------------------------------------
     Logout
     ------------------------------------------------------------------ */
  var sidebarLogout = document.getElementById("sidebarLogout");
  if (sidebarLogout) {
    sidebarLogout.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Logged out! (Mock)");
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  renderStudentCards();
  renderAdminTable();
})();
