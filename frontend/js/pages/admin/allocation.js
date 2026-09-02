/**
 * HostelBuddy — Admin Allocation Page
 */
Pages["admin/allocation"] = function(container) {
  Navbar.render({ title: "Room Allocation", avatarText: "DS" });
  Sidebar.setActivePage("allocation");

  const roomData = { A: { 1: { "101": [{id:"A-1-101-B1",type:"Single",occupied:false},{id:"A-1-101-B2",type:"Single",occupied:true},{id:"A-1-101-B3",type:"Double",occupied:false},{id:"A-1-101-B4",type:"Double",occupied:true}], "102": [{id:"A-1-102-B1",type:"Single",occupied:false},{id:"A-1-102-B2",type:"Single",occupied:false},{id:"A-1-102-B3",type:"Double",occupied:true},{id:"A-1-102-B4",type:"Double",occupied:true}] } } };

  container.innerHTML = `
    <div class="page-header"><h1 class="page-title">🛏️ Room Allocation</h1><p class="page-subtitle">Assign accommodation to approved students</p></div>
    <div id="allocAlert" class="alert-banner" role="alert" hidden></div>
    <div class="alloc-grid">
      <div class="card"><div class="card__header"><h3 class="section-title" style="padding:0;margin:0;">📋 Pending Allocation</h3><span class="badge badge--pending"><span class="badge__dot"></span>Pending</span></div>
        <div class="student-info"><div class="student-avatar">RK</div><div><h2 class="student-name">Ravi Kumar</h2><p class="student-email">ravi.kumar@university.edu</p></div></div>
        <div class="info-grid"><div><span class="info-label">Application Date</span><p class="info-value">Jan 10, 2025</p></div><div><span class="info-label">Hostel</span><p class="info-value">Boys Hostel</p></div><div class="info-item--full"><span class="info-label">Requirements</span><p class="info-value" style="font-style:italic;color:var(--color-text-secondary);">"Ground floor preferred"</p></div></div>
      </div>
      <div class="card"><h3 class="section-title" style="padding:0;margin-bottom:20px;">🏠 Assign Accommodation</h3>
        <form id="allocForm" novalidate>
          <div class="form-group"><label class="form-label">Block <span class="required">*</span></label><select id="blockSelect" class="form-select" required><option value="" disabled selected>Select block…</option><option value="A">Block A</option><option value="B">Block B</option><option value="C">Block C</option></select></div>
          <div class="form-group"><label class="form-label">Floor <span class="required">*</span></label><select id="floorSelect" class="form-select" disabled><option value="" disabled selected>Select floor…</option></select></div>
          <div class="form-group"><label class="form-label">Room <span class="required">*</span></label><select id="roomSelect" class="form-select" disabled><option value="" disabled selected>Select room…</option></select></div>
          <div class="form-group"><label class="form-label">Bed <span class="required">*</span></label><select id="bedSelect" class="form-select" disabled><option value="" disabled selected>Select bed…</option></select></div>
          <div id="bedsSection" hidden><h4 style="font-size:var(--text-sm);font-weight:600;margin-bottom:10px;">Available Beds</h4><div class="table-wrap"><table class="beds-table"><thead><tr><th>Bed ID</th><th>Status</th><th>Type</th></tr></thead><tbody id="bedsBody"></tbody></table></div></div>
          <div style="display:flex;gap:12px;margin-top:20px;justify-content:flex-end;"><button type="button" class="btn btn--ghost" style="color:var(--color-danger);border:1px solid #fecaca;" onclick="Toast.show('Application rejected.','warning')">Reject</button><button type="submit" class="btn btn--success" id="assignBtn" disabled>✅ Assign Bed</button></div>
        </form>
      </div>
    </div>`;

  const populate = (sel, opts, placeholder) => { sel.innerHTML = `<option value="" disabled selected>${placeholder}</option>` + opts.map(o => `<option value="${o}">${o}</option>`).join(""); sel.disabled = false; };
  const reset = (sel, ph) => { sel.innerHTML = `<option value="" disabled selected>${ph}</option>`; sel.disabled = true; };

  Utils.qs("#blockSelect").addEventListener("change", () => {
    const block = Utils.qs("#blockSelect").value;
    reset(Utils.qs("#floorSelect"), "Select floor…"); reset(Utils.qs("#roomSelect"), "Select room…"); reset(Utils.qs("#bedSelect"), "Select bed…");
    Utils.qs("#bedsSection").hidden = true; Utils.qs("#assignBtn").disabled = true;
    if (roomData[block]) populate(Utils.qs("#floorSelect"), Object.keys(roomData[block]).sort(), "Select floor…");
  });
  Utils.qs("#floorSelect").addEventListener("change", () => {
    const block = Utils.qs("#blockSelect").value, floor = Utils.qs("#floorSelect").value;
    reset(Utils.qs("#roomSelect"), "Select room…"); reset(Utils.qs("#bedSelect"), "Select bed…");
    Utils.qs("#bedsSection").hidden = true; Utils.qs("#assignBtn").disabled = true;
    if (roomData[block]?.[floor]) populate(Utils.qs("#roomSelect"), Object.keys(roomData[block][floor]).sort(), "Select room…");
  });
  Utils.qs("#roomSelect").addEventListener("change", () => {
    const beds = roomData[Utils.qs("#blockSelect").value]?.[Utils.qs("#floorSelect").value]?.[Utils.qs("#roomSelect").value];
    reset(Utils.qs("#bedSelect"), "Select bed…"); Utils.qs("#bedsSection").hidden = true; Utils.qs("#assignBtn").disabled = true;
    if (!beds) return;
    const avail = beds.filter(b => !b.occupied);
    if (avail.length) populate(Utils.qs("#bedSelect"), avail.map(b => b.id), "Select bed…");
    Utils.qs("#bedsSection").hidden = false;
    Utils.qs("#bedsBody").innerHTML = beds.map(b => `<tr style="${b.occupied?'opacity:0.5;':''}"><td><strong>${b.id}</strong></td><td><span class="bed-status bed-status--${b.occupied?'occupied':'available'}"><span class="bed-dot"></span>${b.occupied?'Occupied':'Available'}</span></td><td>${b.type}</td></tr>`).join("");
  });
  Utils.qs("#bedSelect").addEventListener("change", () => { Utils.qs("#assignBtn").disabled = !Utils.qs("#bedSelect").value; });
  Utils.qs("#allocForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const bed = Utils.qs("#bedSelect").value;
    if (!bed) { Toast.show("Please select a bed.", "error"); return; }
    if (!confirm(`Assign bed ${bed} to Ravi Kumar?`)) return;
    Toast.show(`Bed ${bed} assigned successfully!`, "success");
  });
  Sidebar.init();
};
