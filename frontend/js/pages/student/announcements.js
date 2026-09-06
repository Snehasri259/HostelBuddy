/**
 * HostelBuddy Student Announcements Page
 * View announcements with expand/collapse and filtering
 */

const StudentAnnouncements = {
  expandedIds: new Set(),

  get announcements() {
    return Store.getAll('announcements').filter(a => a.status === 'published');
  },

  render() {
    const sorted = this.getSorted();

    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.announcement || ''}
          Announcements
        </h2>
      </div>
      
      <div class="announcements-list">
        ${sorted.map((a, i) => this.renderCard(a, i)).join('')}
      </div>
    `;
  },

  getSorted() {
    return [...this.announcements].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.date - a.date;
    });
  },

  renderCard(announcement, index) {
    const isExpanded = this.expandedIds.has(announcement.id);
    const categoryColors = {
      Important: 'danger',
      General: 'info',
      Event: 'success',
      Maintenance: 'warning',
    };

    return `
      <div class="announcement-card ${announcement.pinned ? 'announcement-card--pinned' : ''} fade-in stagger-${Math.min(index + 1, 6)}" style="margin-bottom:16px">
        ${announcement.pinned ? `
          <div class="announcement-pin">
            ${icons.pin || ''}
            Pinned
          </div>
        ` : ''}
        
        <div class="announcement-header">
          <div>
            <h3 class="announcement-title">${Utils.sanitize(announcement.title)}</h3>
            <div class="announcement-meta">
              <span class="badge badge-${categoryColors[announcement.category] || 'info'}">${Utils.sanitize(announcement.category)}</span>
              <span class="announcement-date">${Utils.formatDate(announcement.date)}</span>
              <span class="announcement-author">by ${Utils.sanitize(announcement.author)}</span>
            </div>
          </div>
        </div>
        
        <div class="announcement-content ${isExpanded ? 'expanded' : ''}" id="content-${announcement.id}">
          <p>${Utils.sanitize(announcement.content)}</p>
        </div>
        
        <div class="announcement-footer">
          <button class="announcement-expand" onclick="StudentAnnouncements.toggleExpand(${announcement.id})">
            ${isExpanded ? 'Show Less' : 'Read More'}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform:rotate(${isExpanded ? '180deg' : '0deg'});transition:transform 0.2s">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <span class="announcement-views">${icons.info || ''} ${announcement.views} views</span>
        </div>
      </div>
    `;
  },

  toggleExpand(id) {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
    this.refresh();
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = this.render();
      this.init();
    }
  },

  init() {
    console.log('[HostelBuddy] Student Announcements initialized');
  },
};

window.StudentAnnouncements = StudentAnnouncements;
