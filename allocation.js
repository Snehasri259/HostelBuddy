/**
 * HostelBuddy — Room Allocation Page Logic
 *
 * • Block → Floor → Room → Bed cascade dropdowns
 * • Dynamic bed availability display per room
 * • Bed selection highlighting
 * • Confirm-before-assign dialog
 * • Mock allocation submission & reject
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

  var blockSelect = document.getElementById("blockSelect");
  var floorSelect = document.getElementById("floorSelect");
  var roomSelect = document.getElementById("roomSelect");
  var bedSelect = document.getElementById("bedSelect");

  var bedsSection = document.getElementById("bedsSection");
  var bedsBody = document.getElementById("bedsBody");
  var assignBtn = document.getElementById("assignBtn");
  var rejectBtn = document.getElementById("rejectBtn");
  var allocForm = document.getElementById("allocForm");
  var alertBanner = document.getElementById("alertBanner");

  var allNavItems = document.querySelectorAll(
    ".nav-item[data-page], .bottomnav__item[data-page]"
  );

  /* ------------------------------------------------------------------
     Mock room/bed data
     Structure: { block: { floor: { room: [beds…] } } }
     Each bed: { id, type, occupied }
     ------------------------------------------------------------------ */
  var roomData = {
    A: {
      1: {
        "101": [
          { id: "A-1-101-B1", type: "Single",  occupied: false },
          { id: "A-1-101-B2", type: "Single",  occupied: true  },
          { id: "A-1-101-B3", type: "Double",  occupied: false },
          { id: "A-1-101-B4", type: "Double",  occupied: true  },
        ],
        "102": [
          { id: "A-1-102-B1", type: "Single",  occupied: false },
          { id: "A-1-102-B2", type: "Single",  occupied: false },
          { id: "A-1-102-B3", type: "Double",  occupied: true  },
          { id: "A-1-102-B4", type: "Double",  occupied: true  },
        ],
      },
      2: {
        "201": [
          { id: "A-2-201-B1", type: "Single",  occupied: true  },
          { id: "A-2-201-B2", type: "Single",  occupied: false },
          { id: "A-2-201-B3", type: "Double",  occupied: false },
          { id: "A-2-201-B4", type: "Double",  occupied: true  },
        ],
        "202": [
          { id: "A-2-202-B1", type: "Single",  occupied: false },
          { id: "A-2-202-B2", type: "Single",  occupied: true  },
          { id: "A-2-202-B3", type: "Double",  occupied: false },
          { id: "A-2-202-B4", type: "Double",  occupied: false },
        ],
      },
      3: {
        "301": [
          { id: "A-3-301-B1", type: "Single",  occupied: false },
          { id: "A-3-301-B2", type: "Single",  occupied: true  },
          { id: "A-3-301-B3", type: "Double",  occupied: false },
          { id: "A-3-301-B4", type: "Double",  occupied: false },
        ],
      },
    },
    B: {
      1: {
        "101": [
          { id: "B-1-101-B1", type: "Single",  occupied: false },
          { id: "B-1-101-B2", type: "Single",  occupied: false },
          { id: "B-1-101-B3", type: "Double",  occupied: true  },
          { id: "B-1-101-B4", type: "Double",  occupied: false },
        ],
        "102": [
          { id: "B-1-102-B1", type: "Single",  occupied: true  },
          { id: "B-1-102-B2", type: "Single",  occupied: true  },
          { id: "B-1-102-B3", type: "Double",  occupied: true  },
          { id: "B-1-102-B4", type: "Double",  occupied: false },
        ],
      },
      2: {
        "201": [
          { id: "B-2-201-B1", type: "Single",  occupied: false },
          { id: "B-2-201-B2", type: "Single",  occupied: true  },
          { id: "B-2-201-B3", type: "Double",  occupied: false },
          { id: "B-2-201-B4", type: "Double",  occupied: false },
        ],
      },
    },
    C: {
      1: {
        "101": [
          { id: "C-1-101-B1", type: "Single",  occupied: false },
          { id: "C-1-101-B2", type: "Single",  occupied: false },
          { id: "C-1-101-B3", type: "Double",  occupied: false },
          { id: "C-1-101-B4", type: "Double",  occupied: true  },
        ],
      },
    },
  };

  /* Track selected bed id */
  var selectedBedId = null;

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function populateSelect(select, options, placeholder) {
    select.innerHTML = "";
    var defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    defaultOpt.textContent = placeholder;
    select.appendChild(defaultOpt);

    options.forEach(function (val) {
      var opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      select.appendChild(opt);
    });

    select.disabled = false;
  }

  function resetSelect(select, placeholder) {
    select.innerHTML = "";
    var defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    defaultOpt.textContent = placeholder;
    select.appendChild(defaultOpt);
    select.disabled = true;
  }

  function showAlert(type, message) {
    alertBanner.className = "alert-banner alert-banner--" + type;
    alertBanner.textContent = message;
    alertBanner.hidden = false;
    /* Auto-hide after 5s */
    setTimeout(function () { alertBanner.hidden = true; }, 5000);
  }

  function hideAlert() { alertBanner.hidden = true; }

  /* ------------------------------------------------------------------
     Cascade: Block → Floor → Room → Bed
     ------------------------------------------------------------------ */
  blockSelect.addEventListener("change", function () {
    var block = blockSelect.value;
    resetSelect(floorSelect, "Select floor…");
    resetSelect(roomSelect, "Select room…");
    resetSelect(bedSelect, "Select bed…");
    bedsSection.hidden = true;
    selectedBedId = null;
    assignBtn.disabled = true;
    hideAlert();

    if (!block || !roomData[block]) return;

    var floors = Object.keys(roomData[block]).sort();
    populateSelect(floorSelect, floors, "Select floor…");
  });

  floorSelect.addEventListener("change", function () {
    var block = blockSelect.value;
    var floor = floorSelect.value;
    resetSelect(roomSelect, "Select room…");
    resetSelect(bedSelect, "Select bed…");
    bedsSection.hidden = true;
    selectedBedId = null;
    assignBtn.disabled = true;
    hideAlert();

    if (!block || !floor || !roomData[block] || !roomData[block][floor]) return;

    var rooms = Object.keys(roomData[block][floor]).sort();
    populateSelect(roomSelect, rooms, "Select room…");
  });

  roomSelect.addEventListener("change", function () {
    var block = blockSelect.value;
    var floor = floorSelect.value;
    var room = roomSelect.value;
    resetSelect(bedSelect, "Select bed…");
    bedsSection.hidden = true;
    selectedBedId = null;
    assignBtn.disabled = true;
    hideAlert();

    if (!block || !floor || !room) return;
    var beds = roomData[block][floor][room];
    if (!beds) return;

    /* Populate bed dropdown — only available beds */
    var available = beds.filter(function (b) { return !b.occupied; });
    if (available.length === 0) {
      resetSelect(bedSelect, "No beds available");
      bedSelect.disabled = true;
      renderBedsTable(beds);
      return;
    }

    populateSelect(bedSelect, available.map(function (b) { return b.id; }), "Select bed…");
    renderBedsTable(beds);
  });

  bedSelect.addEventListener("change", function () {
    selectedBedId = bedSelect.value;
    assignBtn.disabled = !selectedBedId;
    highlightSelectedBed();
  });

  /* ------------------------------------------------------------------
     Render available beds table
     ------------------------------------------------------------------ */
  function renderBedsTable(beds) {
    bedsSection.hidden = false;
    bedsBody.innerHTML = beds
      .map(function (bed) {
        var statusClass = bed.occupied ? "occupied" : "available";
        var rowClass = bed.occupied ? " bed-row--occupied" : "";
        var action = bed.occupied
          ? '<button class="btn-select-bed btn-select-bed--occupied" disabled>Occupied</button>'
          : '<button class="btn-select-bed btn-select-bed--available" data-bed="' + bed.id + '">Select</button>';

        return (
          '<tr class="' + rowClass + '">' +
            '<td><strong>' + bed.id + '</strong></td>' +
            '<td><span class="bed-status bed-status--' + statusClass + '">' +
              '<span class="bed-dot"></span>' +
              (bed.occupied ? "Occupied" : "Available") +
            '</span></td>' +
            '<td>' + bed.type + '</td>' +
            '<td>' + action + '</td>' +
          '</tr>'
        );
      })
      .join("");

    /* Attach select-bed handlers */
    bedsBody.querySelectorAll("[data-bed]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var bedId = btn.getAttribute("data-bed");
        selectedBedId = bedId;
        bedSelect.value = bedId;
        assignBtn.disabled = false;
        highlightSelectedBed();
      });
    });

    highlightSelectedBed();
  }

  function highlightSelectedBed() {
    bedsBody.querySelectorAll("[data-bed]").forEach(function (btn) {
      btn.classList.toggle("is-selected", btn.getAttribute("data-bed") === selectedBedId);
      if (btn.getAttribute("data-bed") === selectedBedId) {
        btn.textContent = "Selected ✓";
      } else {
        btn.textContent = "Select";
      }
    });
  }

  /* ------------------------------------------------------------------
     Form submit — confirm + mock allocation
     ------------------------------------------------------------------ */
  allocForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var block = blockSelect.value;
    var floor = floorSelect.value;
    var room = roomSelect.value;
    var bed = bedSelect.value;

    if (!block || !floor || !room || !bed) {
      showAlert("error", "Please complete all fields before assigning.");
      return;
    }

    var confirmed = window.confirm(
      "Assign bed " + bed + " in Block " + block + ", Floor " + floor + ", Room " + room + " to Ravi Kumar?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    mockAllocate(block, floor, room, bed);
  });

  function mockAllocate(block, floor, room, bed) {
    assignBtn.disabled = true;
    assignBtn.textContent = "Assigning…";

    console.group("✅ HostelBuddy — Room Allocation");
    console.log("Student  : Ravi Kumar");
    console.log("Block    :", block);
    console.log("Floor    :", floor);
    console.log("Room     :", room);
    console.log("Bed      :", bed);
    console.log("Time     :", new Date().toLocaleString());
    console.groupEnd();

    setTimeout(function () {
      /* Mark bed as occupied in mock data */
      if (roomData[block] && roomData[block][floor] && roomData[block][floor][room]) {
        var beds = roomData[block][floor][room];
        for (var i = 0; i < beds.length; i++) {
          if (beds[i].id === bed) {
            beds[i].occupied = true;
            break;
          }
        }
      }

      showAlert("success", "Bed " + bed + " has been successfully assigned to Ravi Kumar.");

      /* Reset form */
      blockSelect.selectedIndex = 0;
      resetSelect(floorSelect, "Select floor…");
      resetSelect(roomSelect, "Select room…");
      resetSelect(bedSelect, "Select bed…");
      bedsSection.hidden = true;
      selectedBedId = null;
      assignBtn.disabled = true;
      assignBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"' +
        ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="20 6 9 17 4 12" /></svg> Assign Bed';
    }, 1200);
  }

  /* ------------------------------------------------------------------
     Reject application
     ------------------------------------------------------------------ */
  rejectBtn.addEventListener("click", function () {
    var confirmed = window.confirm(
      "Are you sure you want to reject Ravi Kumar's hostel application?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    console.log(
      "%c❌ HostelBuddy Admin%c Rejected application for Ravi Kumar",
      "color: #ef4444; font-weight: bold",
      "color: inherit"
    );

    showAlert("error", "Ravi Kumar's application has been rejected.");
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
    if (e.key === "Escape") closeSidebar();
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
})();
