(function() {
    localStorage.removeItem('lowPerformanceMode');
    localStorage.removeItem('performanceModeSet');
    
    var allStyles = document.querySelectorAll('style');
    for (var i = 0; i < allStyles.length; i++) {
        var content = allStyles[i].textContent || '';
        if (content.indexOf('animation-duration:0.001ms') !== -1 || 
            content.indexOf('animation-duration: 0.001ms') !== -1) {
            allStyles[i].parentNode.removeChild(allStyles[i]);
        }
    }
    
    var oldPerfStyles = document.getElementById('performanceModeStyles');
    if (oldPerfStyles) oldPerfStyles.parentNode.removeChild(oldPerfStyles);
    
    var oldQualityStyles = document.getElementById('void-quality-override');
    if (oldQualityStyles) oldQualityStyles.parentNode.removeChild(oldQualityStyles);

    var VOID_THEMES = {
        'midnight-blue': { bgColor: '#0a0f1a', particleColor: '#4a8fff', elementColor: '#4a8fff' },
        'crimson':       { bgColor: '#1a0a0a', particleColor: '#ff4a4a', elementColor: '#ff4a4a' },
        'emerald':       { bgColor: '#0a1a0f', particleColor: '#4aff8f', elementColor: '#4aff8f' },
        'sunset':        { bgColor: '#1a120a', particleColor: '#ff8f4a', elementColor: '#ff8f4a' },
        'lavender':      { bgColor: '#140a1a', particleColor: '#b44aff', elementColor: '#b44aff' }
    };

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }

    function lighten(hex, amount) {
        var c = hexToRgb(hex);
        c.r = Math.min(255, c.r + amount);
        c.g = Math.min(255, c.g + amount);
        c.b = Math.min(255, c.b + amount);
        return '#' + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
    }

    function applyVoidTheme() {
        var existing = document.getElementById('void-theme-override');
        if (existing) existing.parentNode.removeChild(existing);

        var raw = localStorage.getItem('voidTheme');
        if (!raw) { window.VoidThemeColors = null; return; }

        var theme;
        try { theme = JSON.parse(raw); } catch (e) { window.VoidThemeColors = null; return; }
        if (!theme || theme.id === 'default') { window.VoidThemeColors = null; return; }

        var cfg = theme;
        if (theme.id !== 'custom' && VOID_THEMES[theme.id]) {
            cfg = VOID_THEMES[theme.id];
        }

        var bg = cfg.bgColor || '#050505';
        var accent = cfg.elementColor || '#ffffff';
        var particle = cfg.particleColor || '#ffffff';
        var accentRgb = hexToRgb(accent);
        var ar = accentRgb.r + ',' + accentRgb.g + ',' + accentRgb.b;

        window.VoidThemeColors = {
            particleColor: particle,
            particleImage: cfg.particleImage || '',
            bgColor: bg
        };

        var bgBase = bg;
        var bgElevated = lighten(bg, 8);
        var bgCard = lighten(bg, 12);
        var bgHover = lighten(bg, 18);

        var css = ':root {\n' +
            '  --matte-bg-base: ' + bgBase + ' !important;\n' +
            '  --matte-bg-elevated: ' + bgElevated + ' !important;\n' +
            '  --matte-bg-card: ' + bgCard + ' !important;\n' +
            '  --matte-bg-hover: ' + bgHover + ' !important;\n' +
            '  --matte-border-subtle: rgba(' + ar + ', 0.06) !important;\n' +
            '  --matte-border-default: rgba(' + ar + ', 0.1) !important;\n' +
            '  --matte-border-hover: rgba(' + ar + ', 0.18) !important;\n' +
            '  --void-accent: ' + accent + ';\n' +
            '  --void-accent-rgb: ' + ar + ';\n' +
            '}\n' +
            'body { background: ' + bgBase + ' !important; }\n' +
            '.toggle-switch.active { background: rgba(' + ar + ', 0.2) !important; border-color: rgba(' + ar + ', 0.3) !important; }\n' +
            '.btn.primary { color: ' + accent + ' !important; background: rgba(' + ar + ', 0.1) !important; border-color: rgba(' + ar + ', 0.25) !important; }\n' +
            '.btn.primary:hover { background: rgba(' + ar + ', 0.18) !important; border-color: rgba(' + ar + ', 0.4) !important; }\n' +
            '.setting-item { background: ' + bgCard + ' !important; border-color: rgba(' + ar + ', 0.06) !important; }\n' +
            '.setting-item:hover { background: ' + bgHover + ' !important; border-color: rgba(' + ar + ', 0.1) !important; }\n' +
            '.section-title { border-bottom-color: rgba(' + ar + ', 0.1) !important; }\n' +
            '.void-dynamic-island { background: rgba(' + hexToRgb(bgBase).r + ',' + hexToRgb(bgBase).g + ',' + hexToRgb(bgBase).b + ', 0.95) !important; border-color: rgba(' + ar + ', 0.08) !important; }\n' +
            '.void-dynamic-island:hover { background: rgba(' + hexToRgb(bgElevated).r + ',' + hexToRgb(bgElevated).g + ',' + hexToRgb(bgElevated).b + ', 0.98) !important; }\n' +
            '.di-item { background: rgba(' + ar + ', 0.04) !important; border-color: rgba(' + ar + ', 0.06) !important; }\n' +
            '.di-item:hover { background: rgba(' + ar + ', 0.1) !important; border-color: rgba(' + ar + ', 0.15) !important; }\n' +
            '.di-item.active { background: rgba(' + ar + ', 0.12) !important; border-color: rgba(' + ar + ', 0.2) !important; }\n' +
            '.di-divider { background: rgba(' + ar + ', 0.1) !important; }\n' +
            '::-webkit-scrollbar-thumb { background: rgba(' + ar + ', 0.15) !important; }\n' +
            '::-webkit-scrollbar-thumb:hover { background: rgba(' + ar + ', 0.25) !important; }\n' +
            '::-webkit-scrollbar-track { background: ' + bgBase + ' !important; }\n' +
            '.game-card, .app-card { background: ' + bgCard + ' !important; border-color: rgba(' + ar + ', 0.06) !important; }\n' +
            '.game-card:hover, .app-card:hover { background: ' + bgHover + ' !important; border-color: rgba(' + ar + ', 0.12) !important; }\n' +
            '.search-bar, input[type="text"], input[type="search"], textarea, select { background: ' + bgCard + ' !important; border-color: rgba(' + ar + ', 0.08) !important; }\n' +
            '.search-bar:focus, input[type="text"]:focus, input[type="search"]:focus, textarea:focus, select:focus { border-color: rgba(' + ar + ', 0.2) !important; background: ' + bgHover + ' !important; }\n' +
            '.user-id-text { color: ' + accent + ' !important; }\n' +
            '.quality-slider::-webkit-slider-thumb { background: ' + accent + ' !important; }\n' +
            '.quality-slider::-moz-range-thumb { background: ' + accent + ' !important; }\n';

        if (cfg.bgImage) {
            css += '#particles-js::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url("' + cfg.bgImage.replace(/"/g, '\\"') + '"); background-size: cover; background-position: center; opacity: 0.2; pointer-events: none; }\n';
        }

        var style = document.createElement('style');
        style.id = 'void-theme-override';
        style.textContent = css;
        document.head.appendChild(style);
    }

    applyVoidTheme();

    function applyQualitySettings() {
        var qualityLevel = parseInt(localStorage.getItem('qualityLevel') || '3');
        
        var existing = document.getElementById('void-quality-override');
        if (existing) existing.parentNode.removeChild(existing);
        
        if (qualityLevel === 3) {
            return;
        }
        
        var style = document.createElement('style');
        style.id = 'void-quality-override';
        
        if (qualityLevel === 0) {
            style.textContent = [
                '.particle, .particles, #particles-js, .particles-js-canvas-el { display: none !important; visibility: hidden !important; }',
                '*, *::before, *::after { animation: none !important; transition: none !important; }',
                '.game-card, .app-card, .di-nav-item, .di-logo, .void-dynamic-island { transition: none !important; }',
                '.game-card:hover, .app-card:hover { transform: none !important; }',
                '* { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }'
            ].join(' ');
        } else if (qualityLevel === 1) {
            style.textContent = [
                '.particle, .particles, #particles-js, .particles-js-canvas-el { display: none !important; visibility: hidden !important; }',
                '* { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }'
            ].join(' ');
        } else if (qualityLevel === 2) {
            style.textContent = '.particle, .particles, #particles-js, .particles-js-canvas-el { display: none !important; visibility: hidden !important; }';
        }
        
        document.head.appendChild(style);
    }

    function applyTabMask(maskType, customTitle, customFavicon) {
        var masks = {
            google: { title: 'Google', favicon: 'https://www.google.com/favicon.ico' },
            'google-classroom': { title: 'Home', favicon: 'https://ssl.gstatic.com/classroom/favicon.png' },
            canvas: { title: 'Dashboard', favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
            powerschool: { title: 'PowerSchool', favicon: 'https://www.powerschool.com/favicon.ico' },
            ixl: { title: 'IXL | Math, Language Arts, Science, Social Studies, and Spanish', favicon: 'https://www.ixl.com/favicon.ico' },
            brainpop: { title: 'BrainPOP', favicon: 'https://www.brainpop.com/favicon.ico' },
            incognito: { title: '', favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' },
            custom: { title: customTitle || '', favicon: customFavicon || '' }
        };
        var mask = masks[maskType];
        if (mask) {
            document.title = mask.title;
            var link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = mask.favicon;
            localStorage.setItem('tabMaskType', maskType);
            localStorage.setItem('tabMaskEnabled', 'true');
            if (maskType === 'custom') {
                localStorage.setItem('customTabTitle', customTitle || '');
                localStorage.setItem('customTabFavicon', customFavicon || '');
            }
        }
    }
    
    function setDefaultTab() {
        document.title = 'Not Found';
        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = 'https://lh7-rt.googleusercontent.com/formsz/AN7BsVDxUhMdM60YDd-DUWlRT3hcYIiAisx3L2uSQuXCcJe6o8wDZuKLLe6_u6rdAhXsZcVLCqcinbroAREncoyWF1zW4GooDPTXg7EChDrE2l1NFsMe7fUdtqcHSPFCXlZF5ZgLCjqeic3bzjdk9NeQZib8RxomY4qchrRkBg?key=yj4V8pHW144VjA9YlEbf1Q';
    }
    
    function checkAndApplyMask() {
        var tabMaskEnabled = localStorage.getItem('tabMaskEnabled') === 'true';
        var savedMaskType = localStorage.getItem('tabMaskType');
        
        if (tabMaskEnabled && savedMaskType) {
            if (savedMaskType === 'custom') {
                applyTabMask(savedMaskType, localStorage.getItem('customTabTitle'), localStorage.getItem('customTabFavicon'));
            } else {
                applyTabMask(savedMaskType);
            }
        } else {
            setDefaultTab();
        }
    }

    function showTroubleshootingPopup() {
        if (localStorage.getItem('troubleshootingSeen')) return;
        
        var path = window.location.pathname;
        if (path !== '/' && path !== '/index.html' && path !== '/g.html') return;
        
        var overlay = document.createElement('div');
        overlay.id = 'troubleshootPopupOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:999999;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);';
        
        var popup = document.createElement('div');
        popup.style.cssText = 'background:linear-gradient(135deg,rgba(30,30,30,0.98),rgba(20,20,20,0.98));border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:40px;max-width:480px;width:90%;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,0.5);';
        
        popup.innerHTML = '<div style="font-size:3rem;margin-bottom:15px;">⚠️</div><h2 style="color:#fff;font-size:1.6rem;margin-bottom:15px;font-weight:700;">Having Performance Issues?</h2><p style="color:rgba(255,255,255,0.8);font-size:1rem;line-height:1.6;margin-bottom:25px;">If the website feels slow, laggy, or takes forever to load, try these steps:</p><div style="text-align:left;background:rgba(0,0,0,0.3);border-radius:12px;padding:20px;margin-bottom:25px;"><p style="color:rgba(255,255,255,0.9);font-size:0.95rem;margin-bottom:12px;"><strong>1.</strong> Go to <strong>Settings</strong> and press <strong>Clear Cache</strong></p><p style="color:rgba(255,255,255,0.9);font-size:0.95rem;margin-bottom:12px;"><strong>2.</strong> Lower the <strong>Quality Level</strong> slider</p><p style="color:rgba(255,255,255,0.9);font-size:0.95rem;"><strong>3.</strong> If issues persist, try a different browser</p></div><button id="troubleshootDismissBtn" style="padding:14px 40px;background:linear-gradient(45deg,rgba(255,255,255,0.15),rgba(255,255,255,0.25));border:1px solid rgba(255,255,255,0.3);border-radius:12px;color:#fff;font-size:1rem;font-weight:600;cursor:pointer;font-family:Poppins,sans-serif;">Go to Settings</button><div style="margin-top:15px;font-size:0.8rem;color:rgba(255,255,255,0.4);">This message won\'t appear again</div>';
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        document.getElementById('troubleshootDismissBtn').addEventListener('click', function() {
            localStorage.setItem('troubleshootingSeen', 'true');
            window.location.href = '/s.html';
        });
    }

    window.VoidSettings = {
        getQualityLevel: function() {
            return parseInt(localStorage.getItem('qualityLevel') || '3');
        },
        setQualityLevel: function(level) {
            localStorage.setItem('qualityLevel', level.toString());
            if (level <= 2) {
                localStorage.setItem('particlesEnabled', 'false');
            }
        },
        applyTabMask: applyTabMask
    };

    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'TAB_MASK_CHANGE') {
            applyTabMask(event.data.mask, event.data.customTitle, event.data.customFavicon);
        }
    });

    function loadPanicKey() {
        if (localStorage.getItem('panicKeyEnabled') === 'true') {
            var s = document.createElement('script');
            s.src = '/assets/js/panic-key.js';
            document.head.appendChild(s);
        }
    }

    function init() {
        applyQualitySettings();
        checkAndApplyMask();
        loadPanicKey();
        setTimeout(showTroubleshootingPopup, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
