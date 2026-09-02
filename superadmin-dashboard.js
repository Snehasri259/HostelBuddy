/**
 * HostelBuddy — Super Admin Dashboard Logic
 *
 * • Data refresh simulation (button + auto-refresh)
 * • Progress bar entrance animations
 * • Timeline rendering with auto-scroll
 * • Periodic new-event injection
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
  var refreshBtn = document.getElementById("refreshBtn");
  var refreshIndicator = document.getElementById("refreshIndicator");
  var refreshText = document.getElementById("refreshText");
  var timeline = document.getElementById("timeline");

  var allNavItems = document.querySelectorAll(
    ".nav-item[data-page], .bottomnav__item[data-page]"
  );

  /* ------------------------------------------------------------------
     Mock data — system activity events
     ------------------------------------------------------------------ */
  var activityEvents = [
    { text: "New admin registered — Dr. Mehta",        time: "1 hour ago",  dot: "blue"   },
    { text: "Room block C updated — 5 rooms added",    time: "3 hours ago", dot: "green"  },
    { text: "System settings changed — check-in hours", time: "1 day ago",  dot: "amber"  },
    { text: "Bulk room allocation completed",           time: "2 days ago", dot: "purple" },
    { text: "Database backup completed successfully",   time: "3 days ago", dot: "green"  },
    { text: "New complaint policy enforced",            time: "4 days ago", dot: "red"    },
  ];

  /** Extra events to inject periodically for "live" feel */
  var injectableEvents = [
    { text: "Student account verified — Priya Sharma",  dot: "blue"   },
    { text: "Room 102-B2 freed — student transferred",  dot: "green"  },
    { text: "Announcement published — maintenance",     dot: "amber"  },
    { text: "Admin permissions updated for Block B",    dot: "purple" },
    { text: "New complaint filed — noise in Block A",    dot: "red"    },
    { text: "Visitor entry logged — Block C",            dot: "green"  },
    { text: "Hostel inspection scheduled",              dot: "blue"   },
    { text: "Fee payment received — ₹12,500",           dot: "green"  },
  ];

  var injectIndex = 0;

  /* ------------------------------------------------------------------
     Render timeline
     ------------------------------------------------------------------ */
  function renderTimeline() {
    if (!timeline) return;

    timeline.innerHTML = activityEvents
      .map(function (evt) {
        return (
          '<div class="timeline-item">' +
            '<div class="timeline-dot timeline-dot--' + evt.dot + '">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" ' +
                'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<polyline points="20 6 9 17 4 12" />' +
              '</svg>' +
            '</div>' +
            '<div class="timeline-body">' +
              '<p class="timeline-text">' + evt.text + '</p>' +
              '<p class="timeline-time">' + evt.time + '</p>' +
            '</div>' +
          '</div>'
        );
      })
      .join("");
  }

  /**
   * Inject a new event at the top of the timeline with animation.
   */
  function injectNewEvent() {
    var evt = injectableEvents[injectIndex % injectableEvents.length];
    injectIndex++;

    var now = new Date();
    var timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    var html =
      '<div class="timeline-item is-new">' +
        '<div class="timeline-dot timeline-dot--' + evt.dot + '">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" ' +
            'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="20 6 9 17 4 12" />' +
          '</svg>' +
        '</div>' +
        '<div class="timeline-body">' +
          '<p class="timeline-text">' + evt.text + '</p>' +
          '<p class="timeline-time">' + timeStr + '</p>' +
        '</div>' +
      '</div>';

    timeline.insertAdjacentHTML("afterbegin", html);

    /* Remove .is-new class after animation */
    var newItem = timeline.querySelector(".is-new");
    if (newItem) {
      setTimeout(function () { newItem.classList.remove("is-new"); }, 500);
    }

    /* Log */
    console.log(
      "%c⚡ Super Admin%c New event: " + evt.text,
      "color: #f59e0b; font-weight: bold",
      "color: inherit"
    );
  }

  /* ------------------------------------------------------------------
     Progress bar animations — animate to target on load
     ------------------------------------------------------------------ */
  function animateProgressBars() {
    var fills = document.querySelectorAll(".progress-bar__fill");
    fills.forEach(function (fill) {
      var target = fill.getAttribute("data-target");
      if (target) {
        /* Delay slightly for visual effect */
        setTimeout(function () {
          fill.style.width = target + "%";
        }, 200);
      }
    });
  }

  /* ------------------------------------------------------------------
     Data refresh simulation
     ------------------------------------------------------------------ */
  var lastRefresh = Date.now();

  function updateRefreshText() {
    var diff = Date.now() - lastRefresh;
    var seconds = Math.floor(diff / 1000);

    if (seconds < 5) {
      refreshText.textContent = "Just now";
    } else if (seconds < 60) {
      refreshText.textContent = seconds + "s ago";
    } else {
      var minutes = Math.floor(seconds / 60);
      refreshText.textContent = minutes + "m ago";
    }
  }

  function simulateRefresh() {
    if (refreshIndicator) refreshIndicator.classList.add("is-refreshing");

    console.log(
      "%c🔄 Super Admin%c Data refresh initiated",
      "color: #f59e0b; font-weight: bold",
      "color: inherit"
    );

    setTimeout(function () {
      lastRefresh = Date.now();
      updateRefreshText();

      if (refreshIndicator) refreshIndicator.classList.remove("is-refreshing");

      console.log(
        "%c✅ Super Admin%c Data refresh complete",
        "color: #10b981; font-weight: bold",
        "color: inherit"
      );
    }, 1200);
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", simulateRefresh);
  }

  /* Auto-update the "X ago" text */
  setInterval(updateRefreshText, 10000);

  /* Auto-refresh every 30 seconds */
  setInterval(function () {
    simulateRefresh();
  }, 30000);

  /* ------------------------------------------------------------------
     Auto-scroll timeline + periodic event injection
     ------------------------------------------------------------------ */
  setInterval(function () {
    injectNewEvent();
  }, 15000); /* New event every 15 seconds */

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
        "%c🧭 HostelBuddy Super Admin%c Navigated to: " + page,
        "color: #f59e0b; font-weight: bold",
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
        "%c🔓 HostelBuddy Super Admin%c Logout triggered",
        "color: #ef4444; font-weight: bold",
        "color: inherit"
      );
      alert("Logged out! (Mock)");
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  renderTimeline();
  animateProgressBars();
})();
