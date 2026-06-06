function showDisabledPopup(url) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: 'Poppins', Arial, sans-serif;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 25%, #200505 50%, #1a0a0a 75%, #000000 100%);
        color: white;
        padding: 30px;
        border-radius: 15px;
        border: 2px solid rgba(255, 0, 68, 0.3);
        text-align: center;
        max-width: 500px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;

    const heading = document.createElement('h2');
    heading.style.cssText = 'margin: 0 0 15px 0; color: #ff0044; font-size: 1.5rem;';
    heading.textContent = 'About:blank Disabled!';

    const para = document.createElement('p');
    para.style.cssText = 'margin: 0 0 20px 0; color: rgba(255, 255, 255, 0.8);';
    para.textContent = 'Go here to resume in your URL:';

    const link = document.createElement('a');
    link.href = url;
    link.style.cssText = 'color: #ff0044; text-decoration: none; font-weight: bold; word-break: break-all; border: 1px solid rgba(255, 0, 68, 0.3); padding: 10px; border-radius: 8px; display: inline-block; background: rgba(255, 0, 68, 0.1);';
    link.textContent = url;

    const br1 = document.createElement('br');
    const br2 = document.createElement('br');

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'background: linear-gradient(45deg, #ff0044, #fa1e4e); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: Poppins, Arial, sans-serif; font-weight: 500;';
    closeBtn.textContent = 'Close';
    closeBtn.onclick = function() { popup.remove(); };

    content.appendChild(heading);
    content.appendChild(para);
    content.appendChild(link);
    content.appendChild(br1);
    content.appendChild(br2);
    content.appendChild(closeBtn);

    popup.appendChild(content);
    document.body.appendChild(popup);
}

function activateCloaking() {
    console.log('Activating cloaking for:', window.location.href);
    // Always land in home.html — pointing the cover iframe at the current
    // page caused recursion (the cover iframe loaded a page that bundles
    // this script, which re-triggered activateCloaking()), and pointing
    // it at "/" hit the server's iframe handler which serves index.html
    // (the educational cover), not the real home.
    const iframeSrc = window.location.origin + '/home.html?embed=1';

    const iframeHtml = `
        <html>
            <head>
                <title> </title>
                <style>
                    body { margin: 0; padding: 0; overflow: hidden; }
                    iframe { border: none; width: 100vw; height: 100vh; display: block; }
                </style>
                <script>
                    window.onload = function() {
                        alert('Successfully opened in about:blank');
                    }
                </script>
            </head>
            <body>
                <iframe src="${iframeSrc}"></iframe>
            </body>
        </html>
    `;

    function attemptClose() {
        try {
            window.close();
            setTimeout(function() {
                if (!window.closed) {
                    try {
                        window.location.href = 'about:blank';
                    } catch (e) {
                        document.body.textContent = '';
                        const msg = document.createElement('div');
                        msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:Arial;color:#666;text-align:center;';
                        msg.textContent = 'Please close this tab manually';
                        document.body.appendChild(msg);
                    }
                }
            }, 500);
        } catch (e) {
            try {
                window.location.href = 'about:blank';
            } catch (err) {
                document.body.textContent = '';
                const msg = document.createElement('div');
                msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:Arial;color:#666;text-align:center;';
                msg.textContent = 'Please close this tab manually';
                document.body.appendChild(msg);
            }
        }
    }

    try {
        const newWindow = window.open('about:blank', '_blank');

        if (newWindow) {
            setTimeout(function() {
                try {
                    newWindow.document.open();
                    newWindow.document.write(iframeHtml);
                    newWindow.document.close();
                    newWindow.focus();
                    setTimeout(attemptClose, 200);
                } catch (e) {
                    newWindow.close();
                    alert('Make sure you allow all popups and redirects!');
                }
            }, 100);
        } else {
            alert('Make sure you allow all popups and redirects!');
        }
    } catch (e) {
        alert('Make sure you allow all popups and redirects!');
    }
}

// Guard: don't run inside an iframe. Without this, the cover window's
// iframe loads /home.html (or whatever currentUrl was) → that page bundles
// blank.js → flag still true → activateCloaking() fires again → another
// popup spawns → recursion until the browser blocks popups. Also skip
// when ?embed=1 — the cover sets that flag on the iframe URL so even
// future blank.js bundle changes can't trigger recursion.
function _vnBlankShouldRun() {
    try {
        if (window.top !== window.self) return false;
    } catch (e) { return false; }
    try {
        if (/[?&]embed=1\b/.test(location.search)) return false;
    } catch (e) {}
    return true;
}

window.addEventListener('storage', function(e) {
    if (e.key === 'voidCloakingEnabled') {
        if (e.newValue === null) {
            console.log('Cloaking disabled, showing popup');
            setTimeout(function() {
                showDisabledPopup(window.location.href);
            }, 500);
        }
    }
});

if (_vnBlankShouldRun() && localStorage.getItem('voidCloakingEnabled') === 'true') {
    activateCloaking();
}
