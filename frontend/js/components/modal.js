/**
 * HostelBuddy — Modal
 */
let _modalResolve = null;

function openModal(title, content, actions = "") {
  let overlay = document.getElementById("app-modal-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "app-modal-overlay";
    overlay.className = "modal-overlay";
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header"><h3>${title}</h3><button class="modal-close" onclick="closeModal()"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
      <div class="modal-body">${content}</div>
      ${actions ? `<div class="modal-footer">${actions}</div>` : ""}
    </div>`;
  overlay.classList.remove("hidden");
  document.addEventListener("keydown", _escHandler);
}

function closeModal() {
  const overlay = document.getElementById("app-modal-overlay");
  if (overlay) overlay.classList.add("hidden");
  document.removeEventListener("keydown", _escHandler);
  if (_modalResolve) { _modalResolve(false); _modalResolve = null; }
}

function confirmModal(title, message) {
  return new Promise((resolve) => {
    _modalResolve = resolve;
    openModal(title, `<p>${message}</p>`,
      `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
       <button class="btn btn-danger" onclick="_confirmResolve(true)">Confirm</button>`);
  });
}

function _escHandler(e) { if (e.key === "Escape") closeModal(); }
window._confirmResolve = (v) => { closeModal(); if (_modalResolve) { _modalResolve(v); _modalResolve = null; } };

// Export for use
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmModal = confirmModal;
