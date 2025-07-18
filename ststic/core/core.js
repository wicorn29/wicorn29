// File: /js/core.js

// Define global namespace
window.VPS = window.VPS || {};

(() => {
  const core = {
    // Called after DOM is ready
    init() {
      this.applyTheme();
      this.bindGlobalEvents();
      setTimeout(() => this.hideSpinner(), 1000); // Delay optional
    },

    applyTheme() {
      const theme = localStorage.getItem("vps-theme") || "light";
      document.documentElement.setAttribute("data-theme", theme);
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem("vps-theme", next);
      document.documentElement.setAttribute("data-theme", next);
    },

    bindGlobalEvents() {
      document.querySelectorAll("[data-vps-theme-toggle]").forEach(btn => {
        btn.addEventListener("click", () => this.toggleTheme());
      });
    },

    showSpinner() {
      if (document.getElementById("vps-spinner-overlay")) return; // Don't duplicate
      const overlay = document.createElement("div");
      overlay.id = "vps-spinner-overlay";
      overlay.innerHTML = `
        <style>
          #vps-spinner-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 170, 85, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s ease;
          }
          #vps-spinner-overlay.fade-out {
            opacity: 0;
            pointer-events: none;
          }
          #vps-spinner-overlay .spinner {
            width: 50px;
            height: 50px;
            border: 6px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: vps-spin 1s linear infinite;
          }
          @keyframes vps-spin {
            to { transform: rotate(360deg); }
          }
        </style>
        <div class="spinner"></div>
      `;
      document.body.appendChild(overlay);
    },

    hideSpinner() {
      const overlay = document.getElementById("vps-spinner-overlay");
      if (overlay) {
        overlay.classList.add("fade-out");
        setTimeout(() => overlay.remove(), 300);
      }
    }
  };

  // Expose to global namespace
  window.VPS.core = core;

  // Ensure overlay is shown ASAP on all page loads
  if (document.readyState === "loading") {
    // Wait for <body> to exist before appending
    const waitForBody = setInterval(() => {
      if (document.body) {
        clearInterval(waitForBody);
        core.showSpinner();
      }
    }, 1);
    document.addEventListener("DOMContentLoaded", () => core.init());
  } else {
    core.showSpinner();
    core.init();
  }
})();
