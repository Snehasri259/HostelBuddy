/**
 * HostelBuddy — Theme Management
 *
 * Light / dark mode toggle with:
 * - localStorage persistence
 * - prefers-color-scheme auto-detection
 * - Smooth transition on toggle
 * - data-theme attribute on <html>
 */

const Theme = {
  STORAGE_KEY: "hb_theme",

  /**
   * Initialize theme on page load.
   * Priority: localStorage → OS preference → default (light)
   */
  initTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.applyTheme(saved);
      return;
    }

    /* Detect OS preference */
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.applyTheme(prefersDark ? "dark" : "light");
  },

  /**
   * Toggle between light and dark.
   * Adds a brief transition class so the switch feels smooth.
   */
  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";

    /* Temporarily enable transitions on all elements */
    document.documentElement.classList.add("theme-transitioning");
    this.applyTheme(next);
    localStorage.setItem(this.STORAGE_KEY, next);

    /* Remove transition class after animation completes */
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 350);
  },

  /**
   * Apply a theme value to the document.
   * @param {"light"|"dark"} theme
   */
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  },

  /**
   * Get the currently active theme.
   * @returns {"light"|"dark"}
   */
  getTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  },

  /**
   * Check if dark mode is active.
   * @returns {boolean}
   */
  isDark() {
    return this.getTheme() === "dark";
  }
};

/* ---- Auto-init on DOMContentLoaded ---- */
document.addEventListener("DOMContentLoaded", () => {
  Theme.initTheme();
});

/* ---- Smooth transition CSS (injected once) ---- */
(function injectTransitionStyle() {
  const style = document.createElement("style");
  style.textContent = `
    .theme-transitioning,
    .theme-transitioning *,
    .theme-transitioning *::before,
    .theme-transitioning *::after {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);
})();

/* Alias toggle = toggleTheme for navbar compatibility */
Theme.toggle = Theme.toggleTheme;

/* Export */
window.Theme = Theme;
