/**
 * HostelBuddy — Student Dashboard Logic
 *
 * • Sidebar toggle (mobile)
 * • Active navigation state management
 * • Mock activity feed rendering
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     DOM references
     ------------------------------------------------------------------ */
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const activityList = document.getElementById("activityList");

  /* All clickable nav items (sidebar + bottom nav) */
  const allNavItems = document.querySelectorAll(
    ".nav-item[data-page], .bottomnav__item[data-page]"
  );

  /* ------------------------------------------------------------------
     Mock data
     ------------------------------------------------------------------ */

  /** Student profile */
  const student = {
    name: "Ravi",
    email: "ravi@hostelbuddy.dev",
    room: "Block A, Room 102",
    status: "Approved",
  };

  /** Recent activity feed */
  const activities = [
    {
      text: "Your application has been approved",
      time: "2 hours ago",
      dot: "green",
    },
    {
      text: "New announcement posted — Mess timings updated",
      time: "1 day ago",
      dot: "blue",
    },
    {
      text: "Room allocated: Block A, Room 102",
      time: "3 days ago",
      dot: "purple",
    },
  ];

  /* ------------------------------------------------------------------
     Render activity feed
     ------------------------------------------------------------------ */
  function renderActivity() {
    if (!activityList) return;

    if (activities.length === 0) {
      activityList.innerHTML =
        '<li class="activity-empty">No recent activity to show.</li>';
      return;
    }

    activityList.innerHTML = activities
      .map(
        (item) => `
      <li class="activity-item">
        <span class="activity-dot activity-dot--${item.dot}"></span>
        <div class="activity-body">
          <p class="activity-text">${item.text}</p>
          <p class="activity-time">${item.time}</p>
        </div>
      </li>`
      )
      .join("");
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

  /* Close on Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });

  /* ------------------------------------------------------------------
     Navigation — active state management
     ------------------------------------------------------------------ */

  /**
   * Update active classes on sidebar and bottom nav simultaneously.
   * @param {string} page - The data-page value to activate.
   */
  function setActivePage(page) {
    allNavItems.forEach(function (item) {
      const isActive = item.getAttribute("data-page") === page;
      item.classList.toggle("active", isActive);
    });
  }

  allNavItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      const page = item.getAttribute("data-page");
      if (!page) return;

      setActivePage(page);

      /* Close mobile sidebar after selection */
      if (window.innerWidth < 768) {
        closeSidebar();
      }

      /* Mock navigation — log selected page */
      console.log(
        "%c🧭 HostelBuddy%c Navigated to: " + page,
        "color: #2563eb; font-weight: bold",
        "color: inherit"
      );
    });
  });

  /* ------------------------------------------------------------------
     Logout handler
     ------------------------------------------------------------------ */
  var sidebarLogout = document.getElementById("sidebarLogout");
  if (sidebarLogout) {
    sidebarLogout.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(
        "%c🔓 HostelBuddy%c Logout triggered",
        "color: #ef4444; font-weight: bold",
        "color: inherit"
      );
      alert("Logged out! (Mock)");
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  renderActivity();
})();
