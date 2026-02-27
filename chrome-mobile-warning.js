(function() {
    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|OPR|Brave|Samsung/i.test(ua);
    
    if (isMobile && isChrome) {
        if (document.getElementById('chrome-mobile-warning')) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'chrome-mobile-warning';
        overlay.innerHTML = `
            <style>
                #chrome-mobile-warning {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
                    padding: 1rem;
                }
                .cmw-popup {
                    background: rgba(30, 30, 30, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 24px;
                    padding: 2rem;
                    max-width: 380px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                .cmw-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 1.5rem;
                    background: rgba(255, 80, 80, 0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cmw-icon svg {
                    width: 32px;
                    height: 32px;
                    stroke: #ff5555;
                }
                .cmw-title {
                    color: #f5f5f5;
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }
                .cmw-message {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }
                .cmw-browser {
                    color: #ff5555;
                    font-weight: 600;
                }
                .cmw-recommend {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.85rem;
                    margin-bottom: 1.5rem;
                }
                .cmw-recommend svg {
                    width: 16px;
                    height: 16px;
                    stroke: rgba(255, 255, 255, 0.5);
                }
                .cmw-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    padding: 0.9rem 1.8rem;
                    color: #f5f5f5;
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .cmw-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.25);
                }
            </style>
            <div class="cmw-popup">
                <div class="cmw-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <div class="cmw-title">Unsupported Browser</div>
                <div class="cmw-message">
                    <span class="cmw-browser">Google Chrome</span> is not supported on mobile devices. Please switch to <strong>Safari</strong> or another browser for the best experience.
                </div>
                <div class="cmw-recommend">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Switch browsers for full functionality
                </div>
                <button class="cmw-btn" id="cmw-dismiss">Continue Anyway</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        document.getElementById('cmw-dismiss').addEventListener('click', function() {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            setTimeout(function() { overlay.remove(); }, 300);
        });
    }
})();
