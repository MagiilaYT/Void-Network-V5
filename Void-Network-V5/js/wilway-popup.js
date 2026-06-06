(function() {
  if (window.location.hostname !== 'ok.492105.xyz') return;
  if (localStorage.getItem('wilway_dismissed')) return;

  var css = document.createElement('style');
  css.textContent = `
    .wilway-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: wilwayFadeIn 0.3s ease;
    }
    @keyframes wilwayFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes wilwaySlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .wilway-modal {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      padding: 40px;
      max-width: 440px;
      width: 90%;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: wilwaySlideUp 0.35s ease;
    }
    .wilway-icon-wrap {
      width: 56px;
      height: 56px;
      background: #222;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .wilway-icon-wrap svg {
      width: 28px;
      height: 28px;
      stroke: #fff;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .wilway-modal h2 {
      color: #fff;
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 16px;
    }
    .wilway-modal p {
      color: #aaa;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 28px;
    }
    .wilway-modal p strong {
      color: #fff;
    }
    .wilway-btn-discord {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 0;
      background: #5865F2;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
      margin-bottom: 12px;
    }
    .wilway-btn-discord:hover {
      background: #4752C4;
    }
    .wilway-btn-discord svg {
      width: 20px;
      height: 20px;
      fill: #fff;
      flex-shrink: 0;
    }
    .wilway-btn-home {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 0;
      background: #222;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      border: 1px solid #333;
      border-radius: 10px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, border-color 0.2s;
    }
    .wilway-btn-home:hover {
      background: #2a2a2a;
      border-color: #444;
    }
    .wilway-btn-home svg {
      width: 18px;
      height: 18px;
      stroke: #fff;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;
  document.head.appendChild(css);

  var backdrop = document.createElement('div');
  backdrop.className = 'wilway-backdrop';
  backdrop.innerHTML = `
    <div class="wilway-modal">
      <div class="wilway-icon-wrap">
        <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <h2>Hello!</h2>
      <p>
        You may have used this website as <strong>Wilway</strong> in the past.
        It has now been migrated to <strong>Void Network</strong> via a partnership.
        Wilway is <strong>NOT</strong> shut down and is still fully functional.
        Their Discord server is linked below.
      </p>
      <a href="https://discord.gg/KQkz9em6wG" target="_blank" rel="noopener" class="wilway-btn-discord">
        <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z M8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>
        Wilway Discord Server
      </a>
      <button class="wilway-btn-home" id="wilwayHomeBtn">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Home
      </button>
    </div>
  `;
  document.body.appendChild(backdrop);

  document.getElementById('wilwayHomeBtn').addEventListener('click', function() {
    localStorage.setItem('wilway_dismissed', '1');
    window.location.href = '/index.html';
  });
})();
