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
                '* { animation: none !important; transition: none !important; }',
                '.game-card, .app-card, .di-nav-item, .di-logo, .void-dynamic-island { transition: none !important; }',
                '.game-card:hover, .app-card:hover { transform: none !important; }',
                '*:not(html):not(body) { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }'
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
        // GENERIC edu-themed tab masks ONLY. Brand-name masks (IXL, Google
        // Classroom, Canvas, PowerSchool, BrainPOP) all matched Lightspeed
        // detectMasqueradeProxyRuntime regex /(ixl|khan\s*academy|classlink
        // |clever|schoology|canvas\s*lms)/i AND detectProxyBehavior CLOAK_TARGETS
        // — direct +30 hits. Replaced May 2026 with neutral student-portal
        // titles that don't impersonate any specific platform. Favicons use
        // data: URLs (no third-party brand asset reference).
        var _gFav = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiMxYTczZTgiLz48cGF0aCBkPSJNMzIgMTBMNTIgMjF2MjJMMzIgNTQgMTIgNDNWMjFMMzIgMTB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+';
        var masks = {
            portal:    { title: 'Student Portal',           favicon: _gFav },
            classes:   { title: 'My Classes',               favicon: _gFav },
            dashboard: { title: 'Dashboard',                favicon: _gFav },
            library:   { title: 'Online Library',           favicon: _gFav },
            assignments:{ title: 'Assignments',             favicon: _gFav },
            grades:    { title: 'Gradebook',                favicon: _gFav },
            schedule:  { title: 'Class Schedule',           favicon: _gFav },
            incognito: { title: '', favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' },
            custom:    { title: customTitle || '',          favicon: customFavicon || '' }
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
            
            try { if (window.top !== window) window.top.postMessage({type:'TAB_MASK_CHANGE'}, '*'); } catch(e){}
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
        
        try { if (window.top !== window) window.top.postMessage({type:'TAB_MASK_CHANGE'}, '*'); } catch(e){}
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

    
    
    
    
    
    function showTroubleshootingPopup() {  }
    
    
    
    try { localStorage.setItem('troubleshootingSeen', 'true'); } catch (e) {}

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
        
        
        
        
        
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
