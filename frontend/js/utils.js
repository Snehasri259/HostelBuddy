/**
 * HostelBuddy Utility Functions
 * Helper functions for date formatting, validation, and common operations
 */

const Utils = {
  /**
   * Format date as "Jan 15, 2025"
   */
  formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  /**
   * Format datetime as "Jan 15, 2025, 2:30 PM"
   */
  formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Time ago format: "2 hours ago", "3 days ago"
   */
  timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
  },

  /**
   * Truncate text with ellipsis
   */
  truncate(str, length = 100) {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  /**
   * Debounce function calls
   */
  debounce(fn, delay = 300) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Throttle function calls
   */
  throttle(fn, limit = 100) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  },

  /**
   * Validate email format
   */
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Validate password (min 6 chars, has number and letter)
   */
  validatePassword(password) {
    if (!password || password.length < 6) return false;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    return hasNumber && hasLetter;
  },

  /**
   * Basic HTML sanitization
   */
  sanitize(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Get status badge class
   */
  getStatusColor(status) {
    const statusMap = {
      approved: 'badge-success',
      active: 'badge-success',
      resolved: 'badge-success',
      available: 'badge-success',
      pending: 'badge-warning',
      in_progress: 'badge-info',
      'in-progress': 'badge-info',
      open: 'badge-info',
      rejected: 'badge-danger',
      inactive: 'badge-danger',
      occupied: 'badge-danger',
      closed: 'badge-danger',
    };
    return statusMap[status?.toLowerCase()] || 'badge-info';
  },

  /**
   * Get initials from name
   */
  getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  },

  /**
   * Capitalize first letter
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Format number with commas
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Calculate percentage
   */
  calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  },

  /**
   * Get random color from predefined palette
   */
  getRandomColor() {
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#0D9488'];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  /**
   * Sleep/delay helper
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

// Export for use
window.Utils = Utils;
