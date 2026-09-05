/**
 * HostelBuddy — Super Admin Reports Page
 * Delegates to the shared Reports module in admin/reports.js
 */

const SuperAdminReports = {
  render() {
    // Delegate to the shared Reports component
    return Reports.render();
  },
  init() {
    if (Reports.init) Reports.init();
  }
};

window.SuperAdminReports = SuperAdminReports;
