/**
 * HostelBuddy — Announcements Page Logic
 *
 * • Student / Admin view toggle
 * • Read More / Less expand toggle
 * • Create announcement form (publish + save draft)
 * • Pin / Unpin toggle
 * • Delete confirmation modal
 * • Admin table rendering
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

  var studentView = document.getElementById("studentView");
  var adminView = document.getElementById("adminView");
  var viewToggle = document.getElementById("viewToggle");
  var topbarTitle = document.getElementById("topbarTitle");
  var announcementsList = document.getElementById("announcementsList");
  var createAnnounceBtn = document.getElementById("createAnnounceBtn");

  /* Modals */
  var modalOverlay = document.getElementById("modalOverlay");
  var modalClose = document.getElementById("modalClose");
  var modalCancel = document.getElementById("modalCancel");
  var announceForm = document.getElementById("announceForm");
  var saveDraftBtn = document.getElementById("saveDraftBtn");

  var deleteOverlay = document.getElementById("deleteOverlay");
  var deleteClose = document.getElementById("deleteClose");
  var deleteCancelBtn = document.getElementById("deleteCancelBtn");
  var deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
  var deleteTarget = document.getElementById("deleteTarget");

  var adminBody = document.getElementById("adminBody");

  var allNavItems = document.querySelectorAll(
    ".nav-item[data-page], .bottomnav__item[data-page]"
  );

  /* ------------------------------------------------------------------
     Mock data
     ------------------------------------------------------------------ */
  var announcements = [
    {
      id: 1,
      title: "🔧 Water Supply Maintenance Notice",
      content: "There will be a scheduled water supply disruption on Saturday, March 8th from 8:00 AM to 2:00 PM due to pipeline maintenance. Please store sufficient water beforehand. We apologize for the inconvenience.\n\nAffected blocks: A, B, and C. Emergency water arrangements will be made available at the common area.",
      target: "all",
      pinned: true,
      date: "2025-03-01",
    },
    {
      id: 2,
      title: "📢 Annual Hostel Fest — March 15th",
      content: "We are excited to announce the Annual Hostel Festival on March 15th! Events include talent shows, sports tournaments, quiz competitions, and a cultural night.\n\nRegistration is open at the warden's office. Prizes worth ₹10,000! All students are encouraged to participate.",
      target: "all",
      pinned: true,
      date: "2025-02-25",
    },
    {
      id: 3,
      title: "🍽️ Mess Menu Update for March",
      content: "The mess committee has updated the menu for March. New additions include North Indian and South Indian special dishes on weekends.\n\nVegetarian and non-vegetarian options are available. Feedback forms are available at the mess entrance.",
      target: "boys",
      pinned: false,
      date: "2025-02-20",
    },
    {
      id: 4,
      title: "📶 Free WiFi Upgrade — Block A",
      content: "Block A WiFi has been upgraded to 100 Mbps. New SSID: HostelBuddy-BlockA. Password remains the same.\n\nIf you face any connectivity issues, please contact the IT helpdesk.",
      target: "boys",
      pinned: false,
      date: "2025-02-15",
    },
    {
      id: 5,
      title: "🏠 Guest Room Booking — New Policy",
      content: "Starting March 1st, guest room bookings must be made at least 48 hours in advance through the hostel office. A valid ID proof of the guest is mandatory.\n\nMaximum stay: 3 nights. Charges: ₹500/night.",
      target: "girls",
      pinned: false,
      date: "2025-02-10",
    },
  ];

  var nextId = 6;
  var deleteTargetId = null;
  var editTargetId = null;

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  var targetLabels = { all: "All Students", boys: "Boys Hostel", girls: "Girls Hostel" };

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function today() { return new Date().toISOString().split("T")[0]; }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ------------------------------------------------------------------
     Student view — render announcement cards
     ------------------------------------------------------------------ */
  function renderStudentCards() {
    /* Sort: pinned first, then by date desc */
    var sorted = announcements.slice().sort(function (a, b) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    announcementsList.innerHTML = sorted
      .map(function (ann) {
        var pinnedClass = ann.pinned ? " is-pinned" : "";
        var contentHtml = ann.content.split("\n").filter(function (l) { return l.trim(); })
          .map(function (l) { return "<p>" + escapeHtml(l) + "</p>"; }).join("");

        return (
          '<div class="announce-card' + pinnedClass + '" data-id="' + ann.id + '">' +
            '<div class="announce-card__header">' +
              '<h3 class="announce-card__title">' + escapeHtml(ann.title) + '</h3>' +
              (ann.pinned
                ? '<span class="badge--pinned">📌 Pinned</span>'
                : '') +
            '</div>' +
            '<div class="announce-card__meta">' +
              '<span class="announce-card__date">' + formatDate(ann.date) + '</span>' +
              '<span class="announce-card__target">' + targetLabels[ann.target] + '</span>' +
            '</div>' +
            '<div class="announce-card__content" id="content-' + ann.id + '">' +
              contentHtml +
            '</div>' +
            '<button class="announce-card__toggle" data-toggle="' + ann.id + '">' +
              'Read More' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>' +
            '</button>' +
          '</div>'
        );
      })
      .join("");

    attachReadMoreHandlers();
  }

  function attachReadMoreHandlers() {
    announcementsList.querySelectorAll("[data-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-toggle");
        var content = document.getElementById("content-" + id);
        if (!content) return;

        var isExpanded = content.classList.contains("is-expanded");
        content.classList.toggle("is-expanded", !isExpanded);
        btn.classList.toggle("is-expanded", !isExpanded);

        /* Update button text */
        var textNode = btn.childNodes[0];
        if (textNode) textNode.textContent = isExpanded ? "Read More" : "Read Less";
      });
    });
  }

  /* ------------------------------------------------------------------
     Admin view — render table
     ------------------------------------------------------------------ */
  function renderAdminTable() {
    var sorted = announcements.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    adminBody.innerHTML = sorted
      .map(function (ann) {
        return (
          '<tr>' +
            '<td><strong>' + escapeHtml(ann.title) + '</strong></td>' +
            '<td>' + targetLabels[ann.target] + '</td>' +
            '<td>' +
              '<button class="btn-table btn-table--pin' + (ann.pinned ? ' is-pinned' : '') + '" data-pin="' + ann.id + '">' +
                (ann.pinned ? '📌 Unpin' : '📌 Pin') +
              '</button>' +
            '</td>' +
            '<td>' + formatDate(ann.date) + '</td>' +
            '<td>' +
              '<div class="table-actions">' +
                '<button class="btn-table btn-table--edit" data-edit="' + ann.id + '">Edit</button>' +
                '<button class="btn-table btn-table--delete" data-delete="' + ann.id + '">Delete</button>' +
              '</div>' +
            '</td>' +
          '</tr>'
        );
      })
      .join("");

    attachAdminHandlers();
  }

  function attachAdminHandlers() {
    /* Pin / Unpin */
    adminBody.querySelectorAll("[data-pin]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = parseInt(btn.getAttribute("data-pin"), 10);
        togglePin(id);
      });
    });

    /* Edit */
    adminBody.querySelectorAll("[data-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = parseInt(btn.getAttribute("data-edit"), 10);
        openEditModal(id);
      });
    });

    /* Delete */
    adminBody.querySelectorAll("[data-delete]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = parseInt(btn.getAttribute("data-delete"), 10);
        openDeleteModal(id);
      });
    });
  }

  function togglePin(id) {
    for (var i = 0; i < announcements.length; i++) {
      if (announcements[i].id === id) {
        announcements[i].pinned = !announcements[i].pinned;
        break;
      }
    }
    renderAdminTable();
    renderStudentCards();
  }

  /* ------------------------------------------------------------------
     View toggle
     ------------------------------------------------------------------ */
  function switchView(view) {
    var isStudent = view === "student";
    studentView.hidden = !isStudent;
    adminView.hidden = isStudent;
    topbarTitle.textContent = isStudent ? "📢 Announcements" : "📢 Manage Announcements";

    viewToggle.querySelectorAll(".view-toggle__btn").forEach(function (btn) {
      btn.classList.toggle("view-toggle__btn--active", btn.getAttribute("data-view") === view);
    });

    if (isStudent) renderStudentCards();
    else renderAdminTable();
  }

  viewToggle.querySelectorAll(".view-toggle__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchView(btn.getAttribute("data-view"));
    });
  });

  /* ------------------------------------------------------------------
     Create / Edit modal
     ------------------------------------------------------------------ */
  function openCreateModal() {
    editTargetId = null;
    document.getElementById("modalTitle").textContent = "Create Announcement";
    announceForm.reset();
    document.getElementById("annPinned").checked = false;
    clearFormErrors();
    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(function () { document.getElementById("annTitle").focus(); }, 100);
  }

  function openEditModal(id) {
    var ann = announcements.find(function (a) { return a.id === id; });
    if (!ann) return;

    editTargetId = id;
    document.getElementById("modalTitle").textContent = "Edit Announcement";
    document.getElementById("annTitle").value = ann.title;
    document.getElementById("annContent").value = ann.content;
    document.getElementById("annTarget").value = ann.target;
    document.getElementById("annPinned").checked = ann.pinned;
    clearFormErrors();
    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
    announceForm.reset();
    clearFormErrors();
    editTargetId = null;
  }

  function clearFormErrors() {
    ["titleError", "contentError"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = "";
    });
  }

  createAnnounceBtn.addEventListener("click", openCreateModal);
  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", function (e) { if (e.target === modalOverlay) closeModal(); });

  announceForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handlePublish();
  });

  saveDraftBtn.addEventListener("click", function () {
    handlePublish(true);
  });

  function handlePublish(isDraft) {
    clearFormErrors();
    var title = document.getElementById("annTitle").value.trim();
    var content = document.getElementById("annContent").value.trim();
    var target = document.getElementById("annTarget").value;
    var pinned = document.getElementById("annPinned").checked;
    var hasErrors = false;

    if (!title) {
      document.getElementById("titleError").textContent = "Title is required.";
      hasErrors = true;
    }
    if (!content) {
      document.getElementById("contentError").textContent = "Content is required.";
      hasErrors = true;
    }
    if (hasErrors) return;

    if (editTargetId !== null) {
      /* Edit existing */
      for (var i = 0; i < announcements.length; i++) {
        if (announcements[i].id === editTargetId) {
          announcements[i].title = title;
          announcements[i].content = content;
          announcements[i].target = target;
          announcements[i].pinned = pinned;
          break;
        }
      }
      console.log(
        "%c📝 HostelBuddy%c Announcement updated: " + title,
        "color: #2563eb; font-weight: bold", "color: inherit"
      );
    } else {
      /* Create new */
      announcements.unshift({
        id: nextId++,
        title: title,
        content: content,
        target: target,
        pinned: pinned,
        date: today(),
      });
      console.log(
        "%c📝 HostelBuddy%c " + (isDraft ? "Draft saved" : "Published") + ": " + title,
        "color: #2563eb; font-weight: bold", "color: inherit"
      );
    }

    closeModal();
    renderAdminTable();
    renderStudentCards();
  }

  /* ------------------------------------------------------------------
     Delete confirmation modal
     ------------------------------------------------------------------ */
  function openDeleteModal(id) {
    var ann = announcements.find(function (a) { return a.id === id; });
    if (!ann) return;
    deleteTargetId = id;
    deleteTarget.textContent = ann.title;
    deleteOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeDeleteModal() {
    deleteOverlay.hidden = true;
    document.body.style.overflow = "";
    deleteTargetId = null;
  }

  deleteClose.addEventListener("click", closeDeleteModal);
  deleteCancelBtn.addEventListener("click", closeDeleteModal);
  deleteOverlay.addEventListener("click", function (e) { if (e.target === deleteOverlay) closeDeleteModal(); });

  deleteConfirmBtn.addEventListener("click", function () {
    if (deleteTargetId === null) return;

    announcements = announcements.filter(function (a) { return a.id !== deleteTargetId; });

    console.log(
      "%c🗑️ HostelBuddy%c Announcement deleted (id=" + deleteTargetId + ")",
      "color: #ef4444; font-weight: bold", "color: inherit"
    );

    closeDeleteModal();
    renderAdminTable();
    renderStudentCards();
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
    if (e.key === "Escape") {
      if (!deleteOverlay.hidden) closeDeleteModal();
      else if (!modalOverlay.hidden) closeModal();
      else closeSidebar();
    }
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
