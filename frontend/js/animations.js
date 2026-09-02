/**
 * HostelBuddy — Reusable Animation Functions
 *
 * Magnetic hover, click ripple, mouse-follow spotlight,
 * 3D tilt, stagger reveal on scroll, page transition overlay.
 */

const Animations = {

  /**
   * Magnetic hover effect — element follows cursor slightly.
   * @param {HTMLElement} element - The element to make magnetic.
   */
  magneticEffect(element) {
    if (!element) return;

    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    element.addEventListener("mouseleave", () => {
      /* Spring-like ease back to origin */
      element.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      element.style.transform = "translate(0, 0)";
      setTimeout(() => { element.style.transition = ""; }, 500);
    });
  },

  /**
   * Click ripple effect — expanding circle from click point.
   * @param {HTMLElement} element - The ripple container (needs position: relative; overflow: hidden).
   * @param {MouseEvent} event - The click event.
   */
  rippleEffect(element, event) {
    if (!element || !event) return;

    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    element.appendChild(ripple);

    /* Remove after animation completes */
    setTimeout(() => ripple.remove(), 600);
  },

  /**
   * Spotlight effect — mouse-follow radial gradient on cards.
   * @param {HTMLElement} container - Parent container with .spotlight-card children.
   */
  spotlightEffect(container) {
    if (!container) return;

    container.addEventListener("mousemove", (e) => {
      const cards = container.querySelectorAll(".spotlight-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", x + "px");
        card.style.setProperty("--mouse-y", y + "px");
      });
    });
  },

  /**
   * 3D tilt effect — element tilts toward cursor.
   * @param {HTMLElement} element - The element to tilt.
   * @param {number} [maxTilt=10] - Maximum tilt in degrees.
   */
  tiltEffect(element, maxTilt = 10) {
    if (!element) return;

    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * maxTilt;
      const rotateY = (x - 0.5) * maxTilt;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      element.style.boxShadow =
        `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0,0,0,0.15)`;
    });

    element.addEventListener("mouseleave", () => {
      /* Elastic ease back */
      element.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease";
      element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      element.style.boxShadow = "";
      setTimeout(() => { element.style.transition = ""; }, 500);
    });
  },

  /**
   * Stagger reveal — fade-in elements as they scroll into view.
   * @param {string} selector - CSS selector for elements to observe.
   * @param {string} [animationClass="fade-in"] - Class to add when visible.
   */
  staggerReveal(selector, animationClass = "fade-in") {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const index = parseInt(el.dataset.staggerIndex || "0", 10);
            const delay = Math.min(index * 0.1, 0.6); /* Cap at 600ms */

            el.style.animationDelay = delay + "s";
            el.classList.add(animationClass);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el, i) => {
      el.dataset.staggerIndex = i;
      observer.observe(el);
    });
  },

  /**
   * Page transition — slide overlay in, execute callback, slide out.
   * @param {Function} callback - Function to execute at the midpoint (usually to swap content).
   * @param {string} [color="var(--primary)"] - Overlay background color.
   */
  pageTransition(callback, color = "var(--primary)") {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999; background: ${color};
      transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
    `;
    document.body.appendChild(overlay);

    /* Slide in */
    requestAnimationFrame(() => {
      overlay.style.transform = "translateY(0)";
    });

    /* At midpoint: execute callback, then slide out */
    setTimeout(() => {
      if (typeof callback === "function") callback();

      overlay.style.transform = "translateY(-100%)";
      setTimeout(() => overlay.remove(), 500);
    }, 400);
  }
};

/* Export */
window.Animations = Animations;
