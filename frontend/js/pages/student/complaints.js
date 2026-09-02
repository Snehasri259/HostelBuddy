/**
 * HostelBuddy — Student Complaints Page
 */
Pages["student/complaints"] = function(container) {
  Navbar.render({ title: "😤 Complaints", avatarText: "R" });
  Sidebar.setActivePage("complaints");

  const complaints = [
    { subject: "Leaking tap in Room 102", category: "🔧 Plumbing", date: "2025-03-01", status: "open", description: "The bathroom tap has been leaking continuously for the past two days." },
    { subject: "Broken ceiling fan", category: "⚡ Electrical", date: "2025-02-25", status: "in-progress", description: "The ceiling fan is making a loud noise and not spinning properly." },
    { subject: "Cockroach infestation in kitchen", category: "🧹 Cleanliness", date: "2025-02-20", status: "open", description: "There are cockroaches in the kitchen area. Need pest control." },
    { subject: "Broken study chair", category: "🪑 Furniture", date: "2025-02-15", status: "resolved", description: "The chair at my study desk has a broken leg." },
  ];
  const statusLabels = { open: "Open", "in-progress": "In Progress", resolved: "Resolved" };

  container.innerHTML = `
    <div class="view-header"><div><h1 class="page-title">😤 Complaints</h1><p class="page-subtitle">Track and submit your hostel complaints</p></div><button class="btn btn--primary" id="newComplaintBtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> New Complaint</button></div>
    <div class="complaint-cards">${complaints.map(c => `
      <div class="complaint-card"><div class="complaint-card__header"><h3 class="complaint-card__subject">${c.subject}</h3><span class="badge badge--${c.status}"><span class="badge__dot"></span>${statusLabels[c.status]}</span></div>
      <div class="complaint-card__meta"><span class="complaint-card__category">${c.category}</span><span class="complaint-card__date">${Utils.formatDate(c.date)}</span></div>
      <p class="complaint-card__desc">${c.description}</p></div>`).join("")}</div>
    <div class="modal-overlay" id="complaintModal" hidden><div class="modal"><div class="modal__header"><h3 class="modal__title">New Complaint</h3><button class="modal__close" data-modal-close="complaintModal"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <form id="complaintForm" novalidate><div class="modal__body">
      <div class="form-group"><label class="form-label">Category <span class="required">*</span></label><select id="compCategory" class="form-select" required><option value="" disabled selected>Select…</option><option value="plumbing">🔧 Plumbing</option><option value="electrical">⚡ Electrical</option><option value="furniture">🪑 Furniture</option><option value="cleanliness">🧹 Cleanliness</option><option value="other">📋 Other</option></select></div>
      <div class="form-group"><label class="form-label">Subject <span class="required">*</span></label><input type="text" id="compSubject" class="form-input" placeholder="Brief description" required /></div>
      <div class="form-group"><label class="form-label">Description</label><textarea id="compDesc" class="form-textarea" rows="3" placeholder="More details…"></textarea></div>
      <div class="form-group"><label class="form-label">Priority <span class="required">*</span></label><div class="radio-group"><label class="radio-label"><input type="radio" name="priority" value="low" class="radio-input" /><span class="radio-custom"></span>🟢 Low</label><label class="radio-label"><input type="radio" name="priority" value="medium" class="radio-input" checked /><span class="radio-custom"></span>🟡 Medium</label><label class="radio-label"><input type="radio" name="priority" value="high" class="radio-input" /><span class="radio-custom"></span>🔴 High</label></div></div>
    </div><div class="modal__footer"><button type="button" class="btn btn--ghost" data-modal-close="complaintModal">Cancel</button><button type="submit" class="btn btn--primary">Submit</button></div></form></div></div>`;

  Utils.qs("#newComplaintBtn").addEventListener("click", () => Modal.open("complaintModal"));
  Modal.init();
  Utils.qs("#complaintForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const cat = Utils.qs("#compCategory").value, subj = Utils.qs("#compSubject").value.trim();
    if (!cat || !subj) { Toast.show("Please fill required fields.", "error"); return; }
    Toast.show("Complaint submitted!", "success");
    Modal.close("complaintModal");
    e.target.reset();
  });
  Sidebar.init();
};
