(function() {
    if (window.location.protocol === 'http:') {
        const style = document.createElement('style');
        style.textContent = `
            .http-warning-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .http-warning-content {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                max-width: 450px;
                backdrop-filter: blur(20px);
            }
            .http-warning-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                stroke: #ff4444;
                filter: drop-shadow(0 0 15px rgba(255, 68, 68, 0.5));
            }
            .http-warning-title {
                color: #fff;
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 30px;
                line-height: 1.5;
            }
            .http-fix-btn {
                padding: 15px 40px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                font-family: inherit;
            }
            .http-fix-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.4);
                transform: translateY(-2px);
                box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
            }
            .http-loader {
                display: none;
                width: 50px;
                height: 50px;
                margin: 0 auto;
                stroke: #fff;
                animation: spin 1s linear infinite;
            }
            .http-loader.show {
                display: block;
            }
            .http-loader-text {
                display: none;
                color: rgba(255, 255, 255, 0.6);
                font-size: 13px;
                margin-top: 20px;
                line-height: 1.6;
                max-width: 350px;
                margin-left: auto;
                margin-right: auto;
            }
            .http-loader-text.show {
                display: block;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.className = 'http-warning-overlay';
        overlay.innerHTML = `
            <div class="http-warning-content">
                <svg xmlns="http://www.w3.org/2000/svg" class="http-warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" x2="12" y1="8" y2="12"/>
                    <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <div class="http-warning-title">
                    Warning Void Network can not be used with http:// !!!
                </div>
                <button class="http-fix-btn" id="httpFixBtn">Fix</button>
                <svg xmlns="http://www.w3.org/2000/svg" class="http-loader" id="httpLoader" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <div class="http-loader-text" id="httpLoaderText">
                    Pretty soon the website will say something along the lines of "Not responding" IF this happens after a couple of seconds just reload your page
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('httpFixBtn').addEventListener('click', function() {
            this.style.display = 'none';
            document.getElementById('httpLoader').classList.add('show');
            document.getElementById('httpLoaderText').classList.add('show');
            const httpsUrl = window.location.href.replace('http://', 'https://');
            window.location.replace(httpsUrl);
        });
    }
})();
