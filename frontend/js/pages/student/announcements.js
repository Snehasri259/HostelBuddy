/**
 * HostelBuddy — Student Announcements Page
 */
Pages["student/announcements"] = function(container) {
  Navbar.render({ title: "📢 Announcements", avatarText: "R" });
  Sidebar.setActivePage("announcements");

  const announcements = [
    { id: 1, title: "🔧 Water Supply Maintenance Notice", content: "There will be a scheduled water supply disruption on Saturday, March 8th from 8:00 AM to 2:00 PM due to pipeline maintenance. Please store sufficient water beforehand.", target: "All Students", pinned: true, date: "2025-03-01" },
    { id: 2, title: "📢 Annual Hostel Fest — March 15th", content: "We are excited to announce the Annual Hostel Festival on March 15th! Events include talent shows, sports tournaments, quiz competitions, and a cultural night.", target: "All Students", pinned: true, date: "2025-02-25" },
    { id: 3, title: "🍽️ Mess Menu Update for March", content: "The mess committee has updated the menu for March. New additions include North Indian and South Indian special dishes on weekends.", target: "Boys Hostel", pinned: false, date: "2025-02-20" },
    { id: 4, title: "📶 Free WiFi Upgrade — Block A", content: "Block A WiFi has been upgraded to 100 Mbps. New SSID: HostelBuddy-BlockA. Password remains the same.", target: "Boys Hostel", pinned: false, date: "2025-02-15" },
  ].sort((a, b) => b.pinned - a.pinned || new Date(b.date) - new Date(a.date));

  container.innerHTML = `
    <div class="view-header"><div><h1 class="page-title">📢 Announcements</h1><p class="page-subtitle">Stay updated with the latest hostel news</p></div></div>
    <div class="announcements-list">${announcements.map(ann => `
      <div class="announce-card ${ann.pinned ? 'is-pinned' : ''}">
        <div class="announce-card__header"><h3 class="announce-card__title">${ann.title}</h3>${ann.pinned ? '<span class="badge--pinned">📌 Pinned</span>' : ''}</div>
        <div class="announce-card__meta"><span class="announce-card__date">${Utils.formatDate(ann.date)}</span><span class="announce-card__target">${ann.target}</span></div>
        <div class="announce-card__content" id="ann-content-${ann.id}"><p>${ann.content}</p></div>
        <button class="announce-card__toggle" data-toggle="${ann.id}">Read More <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg></button>
      </div>`).join("")}</div>`;

  Utils.qsa("[data-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-toggle");
      const content = Utils.qs("#ann-content-" + id);
      if (!content) return;
      const expanded = content.classList.toggle("is-expanded");
      btn.classList.toggle("is-expanded", expanded);
      btn.childNodes[0].textContent = expanded ? "Read Less " : "Read More ";
    });
  });
  Sidebar.init();
};
