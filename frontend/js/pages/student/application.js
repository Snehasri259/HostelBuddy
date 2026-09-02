/**
 * HostelBuddy — Student Application Page
 */
Pages["student/application"] = function(container) {
  renderStudentSidebar("student/application");

  showPage(container, `
    <div class="student-main">
      <div class="student-header"><h1>📝 Hostel Application</h1><p>Submit a new hostel application or view previous ones</p></div>

      <div class="card mb-lg">
        <div class="card-header"><h3 class="font-semibold">New Application</h3></div>
        <form id="applicationForm">
          <div class="input-group">
            <label class="form-label">Hostel Selection <span class="text-danger">*</span></label>
            <select class="select" id="appHostel" required>
              <option value="" disabled selected>Choose a hostel…</option>
              <option value="boys">Boys Hostel</option>
              <option value="girls">Girls Hostel</option>
            </select>
          </div>
          <div class="input-group">
            <label class="form-label">Requirements / Preferences</label>
            <textarea class="textarea" id="appRequirements" placeholder="Ground floor preferred, near library if possible…" rows="4"></textarea>
            <span class="input-hint">Optional — any special requests</span>
          </div>
          <div class="input-group">
            <label class="form-label">ID Proof <span class="text-secondary">(optional)</span></label>
            <input type="file" class="input" accept=".pdf,.jpg,.png" />
          </div>
          <div class="flex justify-center"><button type="submit" class="btn btn-primary">Submit Application</button></div>
        </form>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="font-semibold">Previous Applications</h3></div>
        <div class="table-container">
          <table class="table">
            <thead><tr><th>Status</th><th>Applied Date</th><th>Hostel</th></tr></thead>
            <tbody>
              <tr><td><span class="badge badge-success">✅ Approved</span></td><td>Jan 15, 2025</td><td>Boys Hostel</td></tr>
              <tr><td><span class="badge badge-danger">❌ Rejected</span></td><td>Aug 20, 2024</td><td>Boys Hostel</td></tr>
              <tr><td><span class="badge badge-pending">⏳ Pending</span></td><td>Jun 10, 2024</td><td>Girls Hostel</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`);

  document.getElementById("applicationForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const hostel = document.getElementById("appHostel").value;
    if (!hostel) { Toast.show("Please select a hostel", "error"); return; }
    Toast.show("Application submitted successfully!", "success");
    e.target.reset();
  });
};
