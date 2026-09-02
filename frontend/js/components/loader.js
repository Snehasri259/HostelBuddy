/**
 * HostelBuddy — Loader Component
 */
const Loader = {
  show(container) {
    if (!container) return;
    container.innerHTML = `
      <div style="display:flex;justify-content:center;padding:48px 0;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)"
             stroke-width="2.5" stroke-linecap="round">
          <path d="M12 2a10 10 0 0 1 10 10" style="animation: spin 0.7s linear infinite;" />
        </svg>
      </div>`;
  },

  hide(container) {
    const spinner = container?.querySelector("div[style*='flex']");
    if (spinner) spinner.remove();
  }
};

window.Loader = Loader;
