/**
 * HostelBuddy — Hostel Application Page Logic
 *
 * • Form validation (hostel selection required)
 * • File upload with drag-and-drop, preview, and remove
 * • Mock submission with loading state
 * • Application history table with status badges
 * • Sidebar / bottom-nav active state
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     DOM references
     ------------------------------------------------------------------ */
  var sidebar = document.getElementById("sidebar");
  var sidebarOverlay = document.getElementById("sidebarOverlay");
  var hamburgerBtn = document.getElementById("hamburgerBtn");

  var form = document.getElementById("applicationForm");
  var hostelSelect = document.getElementById("hostelSelect");
  var requirements = document.getElementById("requirements");
  var fileInput = document.getElementById("fileInput");
  var uploadArea = document.getElementById("uploadArea");
  var uploadContent = document.getElementById("uploadContent");
  var uploadPreview = document.getElementById("uploadPreview");
  var fileName = document.getElementById("fileName");
  var fileSize = document.getElementById("fileSize");
  var removeFile = document.getElementById("removeFile");
  var submitBtn = document.getElementById("submitBtn");
  var formAlert = document.getElementById("formAlert");

  var hostelError = document.getElementById("hostelError");
  var fileError = document.getElementById("fileError");

  var historyBody = document.getElementById("historyBody");

  var allNavItems = document.querySelectorAll(
    ".nav-item[data-page], .bottomnav__item[data-page]"
  );

  /* ------------------------------------------------------------------
     Mock data — application history
     ------------------------------------------------------------------ */
  var applications = [
    { status: "approved",  date: "2025-01-15", hostel: "Boys Hostel" },
    { status: "rejected",  date: "2024-08-20", hostel: "Boys Hostel" },
    { status: "pending",   date: "2024-06-10", hostel: "Girls Hostel" },
  ];

  /* ------------------------------------------------------------------
     Render application history
     ------------------------------------------------------------------ */
  function renderHistory() {
    if (!historyBody) return;

    var labelMap = {
      approved: "Approved",
      rejected: "Rejected",
      pending:  "Pending",
    };

    historyBody.innerHTML = applications
      .map(function (app) {
        return (
          '<tr>' +
            '<td><span class="badge badge--' + app.status + '">' +
              '<span class="badge__dot"></span>' +
              labelMap[app.status] +
            '</span></td>' +
            '<td>' + app.date + '</td>' +
            '<td>' + app.hostel + '</td>' +
            '<td><button class="btn btn--ghost" data-view="' + app.date + '">View</button></td>' +
          '</tr>'
        );
      })
      .join("");

    /* Attach view handlers */
    historyBody.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        console.log(
          "%c📄 HostelBuddy%c View application: " + btn.getAttribute("data-view"),
          "color: #2563eb; font-weight: bold",
          "color: inherit"
        );
        alert("Viewing application from " + btn.getAttribute("data-view") + " (Mock)");
      });
    });
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
      /* Allow default link navigation for cross-page links */
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
        "%c🧭 HostelBuddy%c Navigated to: " + page,
        "color: #2563eb; font-weight: bold",
        "color: inherit"
      );
    });
  });

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function setFieldError(input, errorEl, message) {
    input.classList.add("is-error");
    errorEl.textContent = message;
  }

  function clearFieldError(input, errorEl) {
    input.classList.remove("is-error");
    errorEl.textContent = "";
  }

  function showAlert(type, message) {
    formAlert.className = "form-alert form-alert--" + type;
    formAlert.textContent = message;
    formAlert.hidden = false;
  }

  function hideAlert() {
    formAlert.hidden = true;
    formAlert.textContent = "";
  }

  function setLoading(loading) {
    var textEl = submitBtn.querySelector(".btn__text");
    var spinnerEl = submitBtn.querySelector(".btn__spinner");

    if (loading) {
      submitBtn.classList.add("btn--loading");
      textEl.textContent = "Submitting…";
      spinnerEl.hidden = false;
    } else {
      submitBtn.classList.remove("btn--loading");
      textEl.textContent = "Submit Application";
      spinnerEl.hidden = true;
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    var k = 1024;
    var sizes = ["B", "KB", "MB", "GB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  /* ------------------------------------------------------------------
     File upload — show selected file
     ------------------------------------------------------------------ */
  function showFile(file) {
    if (!file) return;

    /* Validate size (5 MB) */
    if (file.size > 5 * 1024 * 1024) {
      fileError.textContent = "File must be under 5 MB.";
      uploadArea.classList.add("is-error");
      fileInput.value = "";
      return;
    }

    /* Validate type */
    var allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (allowed.indexOf(file.type) === -1) {
      fileError.textContent = "Only PDF, JPG, or PNG files are accepted.";
      uploadArea.classList.add("is-error");
      fileInput.value = "";
      return;
    }

    clearFileError();

    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    uploadContent.hidden = true;
    uploadPreview.hidden = false;
    uploadArea.style.pointerEvents = "none";
    fileInput.disabled = true;
  }

  function clearFileError() {
    fileError.textContent = "";
    uploadArea.classList.remove("is-error");
  }

  function resetUpload() {
    fileInput.value = "";
    fileInput.disabled = false;
    uploadContent.hidden = false;
    uploadPreview.hidden = true;
    uploadArea.style.pointerEvents = "";
    clearFileError();
  }

  /* File input change */
  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) {
      showFile(fileInput.files[0]);
    }
  });

  /* Remove button */
  if (removeFile) {
    removeFile.addEventListener("click", function (e) {
      e.stopPropagation();
      resetUpload();
    });
  }

  /* Drag and drop */
  uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadArea.classList.add("is-dragover");
  });

  uploadArea.addEventListener("dragleave", function () {
    uploadArea.classList.remove("is-dragover");
  });

  uploadArea.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadArea.classList.remove("is-dragover");

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      showFile(e.dataTransfer.files[0]);
    }
  });

  /* ------------------------------------------------------------------
     Clear errors on input
     ------------------------------------------------------------------ */
  hostelSelect.addEventListener("change", function () {
    clearFieldError(hostelSelect, hostelError);
    hideAlert();
  });

  requirements.addEventListener("input", function () {
    hideAlert();
  });

  /* ------------------------------------------------------------------
     Form submission
     ------------------------------------------------------------------ */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    hideAlert();
    clearFieldError(hostelSelect, hostelError);
    clearFileError();

    var hostel = hostelSelect.value;
    var hasErrors = false;

    /* Validate hostel selection */
    if (!hostel) {
      setFieldError(hostelSelect, hostelError, "Please select a hostel.");
      hasErrors = true;
    }

    if (hasErrors) return;

    /* Gather data */
    var data = {
      hostel: hostel,
      hostelLabel: hostelSelect.options[hostelSelect.selectedIndex].text,
      requirements: requirements.value.trim(),
      idProof: fileInput.files && fileInput.files[0] ? fileInput.files[0].name : null,
    };

    /* Mock submit */
    mockSubmit(data);
  });

  /**
   * Mock submission — simulates an API call.
   */
  function mockSubmit(data) {
    setLoading(true);

    console.group("📝 HostelBuddy — Application Submitted");
    console.log("Hostel      :", data.hostelLabel);
    console.log("Preferences :", data.requirements || "(none)");
    console.log("ID Proof    :", data.idProof || "(not uploaded)");
    console.log("Time        :", new Date().toLocaleString());
    console.groupEnd();

    setTimeout(function () {
      setLoading(false);
      showAlert(
        "success",
        "Your hostel application has been submitted successfully! You will be notified once it is reviewed."
      );

      /* Add to history (mock) */
      var today = new Date().toISOString().split("T")[0];
      applications.unshift({
        status: "pending",
        date: today,
        hostel: data.hostelLabel,
      });
      renderHistory();

      /* Reset form */
      hostelSelect.selectedIndex = 0;
      requirements.value = "";
      resetUpload();
    }, 1800);
  }

  /* ------------------------------------------------------------------
     Logout
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
  renderHistory();
})();
