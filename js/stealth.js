(function() {
    'use strict';

    var STEALTH_KEY = 'voidStealth';

    function getConfig() {
        try {
            return JSON.parse(localStorage.getItem(STEALTH_KEY)) || {};
        } catch (e) { return {}; }
    }

    function saveConfig(cfg) {
        localStorage.setItem(STEALTH_KEY, JSON.stringify(cfg));
    }

    var cfg = getConfig();

    
    
    
    
    if (cfg.autoHide) {
        var originalTitle = document.title;
        var originalFavicon = '';
        var linkEl = document.querySelector("link[rel~='icon']");
        if (linkEl) originalFavicon = linkEl.href;

        var hideOverlay = null;

        
        var fakePageHtml = '<div style="text-align:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#3c4043;max-width:600px;padding:20px;">' +
            '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiMxYTczZTgiLz48cGF0aCBkPSJNMzIgMTBMNTIgMjF2MjJMMzIgNTQgMTIgNDNWMjFMMzIgMTB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+" style="width:48px;height:48px;margin-bottom:16px;" alt="">' +
            '<h1 style="font-size:1.375rem;font-weight:400;margin-bottom:8px;color:#202124;">Student Portal</h1>' +
            '<p style="color:#5f6368;font-size:0.875rem;">Loading your classes...</p>' +
            '<div style="width:200px;height:4px;background:#e8eaed;border-radius:2px;margin:20px auto;overflow:hidden;">' +
            '<div style="width:40%;height:100%;background:#1a73e8;border-radius:2px;animation:gcLoad 1.5s ease infinite;"></div></div></div>';

        function createHideOverlay() {
            if (hideOverlay) return;
            hideOverlay = document.createElement('div');
            hideOverlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#fff;display:flex;align-items:center;justify-content:center;';

            var style = document.createElement('style');
            style.textContent = '@keyframes gcLoad{0%{margin-left:0}50%{margin-left:60%}100%{margin-left:0}}';
            hideOverlay.appendChild(style);

            var content = document.createElement('div');
            content.innerHTML = fakePageHtml;
            hideOverlay.appendChild(content);
            document.body.appendChild(hideOverlay);
        }

        function removeHideOverlay() {
            if (hideOverlay && hideOverlay.parentNode) {
                hideOverlay.parentNode.removeChild(hideOverlay);
                hideOverlay = null;
            }
        }

        function restoreTab() {
            var maskEnabled = localStorage.getItem('tabMaskEnabled') === 'true';
            if (maskEnabled && window.VoidSettings && window.VoidSettings.applyTabMask) {
                var maskType = localStorage.getItem('tabMaskType');
                if (maskType) {
                    window.VoidSettings.applyTabMask(maskType, localStorage.getItem('customTabTitle'), localStorage.getItem('customTabFavicon'));
                    return;
                }
            }
            
            document.title = 'Not Found';
            var link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = 'https://lh7-rt.googleusercontent.com/formsz/AN7BsVDxUhMdM60YDd-DUWlRT3hcYIiAisx3L2uSQuXCcJe6o8wDZuKLLe6_u6rdAhXsZcVLCqcinbroAREncoyWF1zW4GooDPTXg7EChDrE2l1NFsMe7fUdtqcHSPFCXlZF5ZgLCjqeic3bzjdk9NeQZib8RxomY4qchrRkBg?key=yj4V8pHW144VjA9YlEbf1Q';
        }

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                createHideOverlay();
                document.title = cfg.autoHideTitle || 'Student Portal';
                var link = document.querySelector("link[rel~='icon']");
                if (link) link.href = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiMxYTczZTgiLz48cGF0aCBkPSJNMzIgMTBMNTIgMjF2MjJMMzIgNTQgMTIgNDNWMjFMMzIgMTB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+';
            } else {
                removeHideOverlay();
                restoreTab();
            }
        });

        
        window.addEventListener('blur', function() {
            createHideOverlay();
            document.title = cfg.autoHideTitle || 'Student Portal';
        });
        window.addEventListener('focus', function() {
            if (!document.hidden) {
                removeHideOverlay();
                restoreTab();
            }
        });
    }

    
    
    
    if (cfg.idleCloak) {
        var idleTimeout = (cfg.idleCloakMinutes || 2) * 60 * 1000;
        var idleTimer = null;
        var idleCloaked = false;
        var idleOverlay = null;

        var idleFakeHtml = '<div style="text-align:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#3c4043;max-width:600px;padding:20px;">' +
            '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiMxYTczZTgiLz48cGF0aCBkPSJNMzIgMTBMNTIgMjF2MjJMMzIgNTQgMTIgNDNWMjFMMzIgMTB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+" style="width:48px;height:48px;margin-bottom:16px;" alt="">' +
            '<h1 style="font-size:1.375rem;font-weight:400;margin-bottom:8px;color:#202124;">Student Portal</h1>' +
            '<p style="color:#5f6368;font-size:0.875rem;">Session timed out. Click anywhere to continue.</p></div>';

        function activateIdleCloak() {
            if (idleCloaked) return;
            idleCloaked = true;
            idleOverlay = document.createElement('div');
            idleOverlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;';
            var content = document.createElement('div');
            content.innerHTML = idleFakeHtml;
            idleOverlay.appendChild(content);
            idleOverlay.addEventListener('click', deactivateIdleCloak);
            document.body.appendChild(idleOverlay);
            document.title = 'Student Portal';
            var link = document.querySelector("link[rel~='icon']");
            if (link) link.href = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiMxYTczZTgiLz48cGF0aCBkPSJNMzIgMTBMNTIgMjF2MjJMMzIgNTQgMTIgNDNWMjFMMzIgMTB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+';
        }

        function deactivateIdleCloak() {
            if (!idleCloaked) return;
            idleCloaked = false;
            if (idleOverlay && idleOverlay.parentNode) {
                idleOverlay.parentNode.removeChild(idleOverlay);
                idleOverlay = null;
            }
            var maskEnabled = localStorage.getItem('tabMaskEnabled') === 'true';
            if (maskEnabled && window.VoidSettings) {
                var maskType = localStorage.getItem('tabMaskType');
                if (maskType) window.VoidSettings.applyTabMask(maskType, localStorage.getItem('customTabTitle'), localStorage.getItem('customTabFavicon'));
            } else {
                
                document.title = 'Not Found';
                var link = document.querySelector("link[rel~='icon']");
                if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
                link.href = 'https://lh7-rt.googleusercontent.com/formsz/AN7BsVDxUhMdM60YDd-DUWlRT3hcYIiAisx3L2uSQuXCcJe6o8wDZuKLLe6_u6rdAhXsZcVLCqcinbroAREncoyWF1zW4GooDPTXg7EChDrE2l1NFsMe7fUdtqcHSPFCXlZF5ZgLCjqeic3bzjdk9NeQZib8RxomY4qchrRkBg?key=yj4V8pHW144VjA9YlEbf1Q';
            }
            resetIdleTimer();
        }

        function resetIdleTimer() {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(activateIdleCloak, idleTimeout);
        }

        ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'].forEach(function(evt) {
            document.addEventListener(evt, resetIdleTimer, { passive: true });
        });
        resetIdleTimer();
    }

    
    
    
    window.VoidStealthDetections = { detected: [], count: 0, tips: {} };

    function detectExtensions() {
        var detected = [];
        var tips = {};

        
        if (document.querySelector('[class*="goguardian"]') ||
            document.querySelector('#__ggFrame') ||
            document.querySelector('#__ggg_overlay') ||
            document.querySelector('iframe[src*="goguardian"]') ||
            document.querySelector('[data-goguardian]')) {
            detected.push('GoGuardian');
            tips['GoGuardian'] = 'Enable Tab Freeze Decoy and Force-Close Resistance. Use about:blank cloaking.';
        }

        
        if (document.querySelector('[class*="hapara"]') ||
            document.querySelector('#hapara-popup') ||
            document.querySelector('div[data-hapara]') ||
            document.querySelector('[class*="h-control"]') ||
            document.querySelector('iframe[src*="hapara"]')) {
            detected.push('Hapara');
            tips['Hapara'] = 'Enable Screen Feed Poisoning to show a fake page to the teacher dashboard. Use blob URL cloaking.';
        }

        
        if (document.querySelector('[class*="securly"]') ||
            document.querySelector('#securly-overlay') ||
            document.querySelector('iframe[src*="securly"]') ||
            document.querySelector('[data-securly]')) {
            detected.push('Securly');
            tips['Securly'] = 'Securly uses DNS filtering. The site proxy bypasses this. Enable auto-hide for extra protection.';
        }

        
        if (document.querySelector('[class*="lightspeed"]') ||
            document.querySelector('[class*="ls-smart-agent"]') ||
            document.querySelector('iframe[src*="lightspeed"]') ||
            document.querySelector('[class*="relay-"]')) {
            detected.push('Lightspeed');
            tips['Lightspeed'] = 'Lightspeed monitors screen and browser activity. Enable auto-hide and anti-screenshot.';
        }

        
        if (document.querySelector('[class*="bark-"]') ||
            document.querySelector('[data-bark]')) {
            detected.push('Bark');
            tips['Bark'] = 'Bark monitors for keywords and content. Tab masking and auto-hide help avoid detection.';
        }

        
        if (document.querySelector('[class*="gaggle"]') ||
            document.querySelector('[data-gaggle]')) {
            detected.push('Gaggle');
            tips['Gaggle'] = 'Gaggle scans content and screenshots. Enable anti-screenshot and auto-hide.';
        }

        
        if (document.querySelector('[class*="blocksi"]') ||
            document.querySelector('iframe[src*="blocksi"]')) {
            detected.push('Blocksi');
            tips['Blocksi'] = 'Blocksi filters by category. The proxy should bypass it. Use blob cloaking for extra safety.';
        }

        
        if (document.querySelector('[class*="umbrella"]') ||
            document.querySelector('[class*="opendns"]')) {
            detected.push('Cisco Umbrella');
            tips['Cisco Umbrella'] = 'Umbrella uses DNS filtering. The site proxy routes around it. No extra action needed.';
        }

        
        if (document.querySelector('[class*="contentkeeper"]') ||
            document.querySelector('[class*="ck-auth"]')) {
            detected.push('ContentKeeper');
            tips['ContentKeeper'] = 'ContentKeeper does deep packet inspection. Use HTTPS proxy and blob cloaking.';
        }

        
        if (document.querySelector('[class*="iboss"]') ||
            document.querySelector('iframe[src*="iboss"]')) {
            detected.push('iBoss');
            tips['iBoss'] = 'iBoss uses cloud proxy filtering. The site proxy should work. Enable stealth features for screenshots.';
        }

        
        if (document.querySelector('[class*="fortinet"]') ||
            document.querySelector('[class*="fortiguard"]')) {
            detected.push('Fortinet');
            tips['Fortinet'] = 'Fortinet blocks by category. Proxy bypasses the filter. Enable tab masking.';
        }

        
        if (document.querySelector('[class*="smoothwall"]')) {
            detected.push('Smoothwall');
            tips['Smoothwall'] = 'Smoothwall is a network filter. Proxy bypasses it. Enable auto-hide for screen monitoring.';
        }

        window.VoidStealthDetections = {
            detected: detected,
            count: detected.length,
            tips: tips,
            timestamp: Date.now()
        };

        return detected;
    }

    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(detectExtensions, 500);
        });
    } else {
        setTimeout(detectExtensions, 500);
    }

    
    
    
    
    
    if (cfg.tabFreezeDecoy) {
        var freezeTitle = cfg.tabFreezeTitle || 'Student Portal';
        var freezeInterval = setInterval(function() {
            
            if (!document.hidden) {
                var maskEnabled = localStorage.getItem('tabMaskEnabled') === 'true';
                if (maskEnabled) {
                    
                } else {
                    document.title = freezeTitle;
                }
            }
        }, 200);
    }

    
    
    
    
    if (cfg.messageInterception) {
        var origPostMessage = window.postMessage.bind(window);
        var blockedOrigins = ['goguardian', 'hapara', 'securly', 'lightspeed', 'relay'];

        window.addEventListener('message', function(e) {
            if (!e.origin) return;
            var origin = e.origin.toLowerCase();
            for (var i = 0; i < blockedOrigins.length; i++) {
                if (origin.indexOf(blockedOrigins[i]) !== -1) {
                    e.stopImmediatePropagation();
                    return;
                }
            }
        }, true);
    }

    
    
    
    
    
    if (cfg.forceCloseResist) {
        window.addEventListener('beforeunload', function(e) {
            
            if (!window._voidUserNav) {
                try {
                    var win = window.open('about:blank', '_blank');
                    if (win) {
                        win.document.write('<!DOCTYPE html><html><head><title>Student Portal</title>' +
                            '<link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiMxYTczZTgiLz48cGF0aCBkPSJNMzIgMTBMNTIgMjF2MjJMMzIgNTQgMTIgNDNWMjFMMzIgMTB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+">' +
                            '</head><body style="margin:0;overflow:hidden;">' +
                            '<iframe src="' + window.location.origin + '/home.html?embed=1" style="width:100vw;height:100vh;border:none;"></iframe>' +
                            '</body></html>');
                        win.document.close();
                    }
                } catch (err) {}
            }
        });

        
        document.addEventListener('click', function(e) {
            var a = e.target.closest('a');
            if (a && a.href) window._voidUserNav = true;
            setTimeout(function() { window._voidUserNav = false; }, 100);
        });
    }

    
    
    
    
    
    if (cfg.screenFeedPoison) {
        var poisonOverlay = document.createElement('div');
        poisonOverlay.id = 'void-hapara-poison';
        poisonOverlay.style.cssText = 'position:fixed;inset:0;z-index:999990;pointer-events:none;background:transparent;';
        poisonOverlay.innerHTML = '<div style="position:absolute;inset:0;background:#fff;opacity:0.001;pointer-events:none;">' +
            '<div style="padding:60px 80px;font-family:\'Docs\',Arial,sans-serif;">' +
            '<div style="font-size:28px;color:#202124;margin-bottom:30px;">Untitled document</div>' +
            '<div style="width:100%;height:1px;background:#dadce0;margin-bottom:20px;"></div>' +
            '<div style="font-size:14px;color:#202124;line-height:1.8;">' +
            'The quick brown fox jumps over the lazy dog. ' +
            'This is a standard document for class notes. ' +
            'Please review the assignment instructions carefully.</div></div></div>';

        function addPoisonOverlay() {
            if (!document.getElementById('void-hapara-poison')) {
                document.body.appendChild(poisonOverlay);
            }
        }

        if (document.body) addPoisonOverlay();
        else document.addEventListener('DOMContentLoaded', addPoisonOverlay);
    }

    
    
    
    
    if (cfg.printScreenTrap) {
        var psOverlay = null;

        function flashFakePage() {
            if (psOverlay) return;
            psOverlay = document.createElement('div');
            psOverlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#fff;display:flex;align-items:center;justify-content:center;';
            psOverlay.innerHTML = '<div style="text-align:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#3c4043;">' +
                '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTAiIGZpbGw9IiMxYTczZTgiLz48cGF0aCBkPSJNMzIgMTBMNTIgMjF2MjJMMzIgNTQgMTIgNDNWMjFMMzIgMTB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+" style="width:48px;height:48px;margin-bottom:16px;" alt="">' +
                '<h1 style="font-size:1.375rem;font-weight:400;color:#202124;">Student Portal</h1>' +
                '<p style="color:#5f6368;font-size:0.875rem;">Welcome back!</p></div>';
            document.body.appendChild(psOverlay);

            setTimeout(function() {
                if (psOverlay && psOverlay.parentNode) {
                    psOverlay.parentNode.removeChild(psOverlay);
                    psOverlay = null;
                }
            }, 500);
        }

        document.addEventListener('keyup', function(e) {
            if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
                flashFakePage();
            }
        }, true);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
                flashFakePage();
            }
        }, true);
    }

    
    
    
    
    
    
    
    if (cfg.historyFlood) {
        // Generic-edu paths only — see reference_lightspeed_signals memory
        // for the rationale. Brand-name paths used to live here and got
        // pushed into the URL bar via pushState, which was firing the
        // filter's brand-mismatch detector tier-1.
        var eduUrls = [
            '/portal/home',
            '/portal/dashboard',
            '/portal/assignments',
            '/portal/calendar',
            '/portal/library',
            '/portal/messages',
            '/courses/algebra/chapter-3',
            '/courses/biology/lab-notes',
            '/courses/english/essay-draft',
            '/courses/history/world-war-ii',
            '/courses/spanish/vocabulary',
            '/courses/computer-science/intro',
            '/library/digital/articles',
            '/library/reference/dictionary',
            '/library/reference/encyclopedia',
            '/study/flashcards/biology',
            '/study/flashcards/spanish',
            '/study/practice/algebra',
            '/study/practice/grammar',
            '/lessons/reading/chapter-7',
            '/lessons/writing/persuasive-essay',
            '/lessons/math/quadratic-equations',
            '/lessons/science/photosynthesis',
            '/assignments/due-this-week',
            '/assignments/completed',
            '/gradebook/current-term',
            '/notebook/notes',
            '/schedule/period-1',
            '/schedule/period-2',
            '/calendar/month-view',
            '/profile/account',
            '/profile/preferences',
            '/help/getting-started',
            '/help/faq'
        ];

        var eduPaths = eduUrls.map(function(u) { return '/' + u.replace('https://', ''); });

        
        function floodPushState() {
            var realUrl = window.location.pathname + window.location.search + window.location.hash;
            var count = 15 + Math.floor(Math.random() * 10); 
            for (var i = 0; i < count; i++) {
                var path = eduPaths[Math.floor(Math.random() * eduPaths.length)];
                try { window.history.pushState({}, '', path); } catch (e) {}
            }
            try { window.history.pushState({}, '', realUrl); } catch (e) {}
        }

        
        
        
        var floodWindow = null;

        function floodWithPopup() {
            
            var batch = eduUrls.slice().sort(function() { return Math.random() - 0.5; });
            var batchSize = 8 + Math.floor(Math.random() * 8); 
            batch = batch.slice(0, batchSize);

            var idx = 0;
            function nextNav() {
                if (idx >= batch.length) {
                    
                    setTimeout(function() {
                        try { if (floodWindow && !floodWindow.closed) floodWindow.close(); } catch (e) {}
                        floodWindow = null;
                    }, 2000);
                    return;
                }

                try {
                    
                    if (!floodWindow || floodWindow.closed) {
                        floodWindow = window.open(batch[idx], '_blank_flood', 'width=1,height=1,left=-9999,top=-9999,menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=no');
                        if (!floodWindow) return; 
                    } else {
                        floodWindow.location.href = batch[idx];
                    }
                    
                    try { floodWindow.blur(); } catch (e2) {}
                    window.focus();
                } catch (e) {}

                idx++;
                
                setTimeout(nextNav, 1000 + Math.floor(Math.random() * 2000));
            }
            nextNav();
        }

        
        floodPushState();

        
        
        var popupFloodStarted = false;
        function startPopupFlood() {
            if (popupFloodStarted) return;
            popupFloodStarted = true;
            
            document.removeEventListener('click', startPopupFlood, true);
            document.removeEventListener('keydown', startPopupFlood, true);
            document.removeEventListener('touchstart', startPopupFlood, true);

            
            floodWithPopup();

            
            setInterval(function() {
                floodPushState();
                floodWithPopup();
            }, 45000);
        }

        
        document.addEventListener('click', startPopupFlood, true);
        document.addEventListener('keydown', startPopupFlood, true);
        document.addEventListener('touchstart', startPopupFlood, true);

        
        setInterval(floodPushState, 30000);
    }

    
    
    
    if (cfg.disableRightClick) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    }

    if (cfg.disableKeyShortcuts) {
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
                (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
                (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
                e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    
    
    
    if (cfg.antiScreenshot) {
        var ssStyle = document.createElement('style');
        ssStyle.id = 'void-anti-ss';
        ssStyle.textContent = '';
        document.head.appendChild(ssStyle);

        window.addEventListener('blur', function() {
            ssStyle.textContent = 'body > *:not([style*="z-index:999999"]) { filter: blur(20px) !important; transition: filter 0.15s ease !important; }';
        });
        window.addEventListener('focus', function() {
            ssStyle.textContent = '';
        });
    }

    
    
    
    
    if (cfg.domainRotation) {
        var mirrors = [];
        try { mirrors = JSON.parse(localStorage.getItem('voidMirrors')) || []; } catch (e) {}

        if (mirrors.length > 0) {
            
            fetch('/api/ping', { method: 'HEAD', cache: 'no-store' })
                .catch(function() {
                    
                    var current = window.location.hostname;
                    for (var m = 0; m < mirrors.length; m++) {
                        if (mirrors[m] !== current) {
                            window.location.href = window.location.protocol + '//' + mirrors[m] + window.location.pathname;
                            break;
                        }
                    }
                });
        }
    }

    
    
    
    window.VoidStealth = {
        getConfig: getConfig,
        saveConfig: saveConfig,
        detectExtensions: detectExtensions,
        features: [
            'autoHide', 'idleCloak', 'antiScreenshot', 'printScreenTrap',
            'historyFlood', 'disableRightClick', 'disableKeyShortcuts',
            'tabFreezeDecoy', 'messageInterception', 'forceCloseResist',
            'screenFeedPoison'
        ],
        enableMaxStealth: function() {
            saveConfig({
                autoHide: true,
                autoHideTitle: 'Student Portal',
                idleCloak: true,
                idleCloakMinutes: 2,
                extensionDetect: true,
                historyFlood: true,
                disableRightClick: true,
                disableKeyShortcuts: true,
                antiScreenshot: true,
                printScreenTrap: true,
                tabFreezeDecoy: true,
                tabFreezeTitle: 'Student Portal',
                messageInterception: true,
                forceCloseResist: true,
                screenFeedPoison: true
            });
            location.reload();
        },
        disableAll: function() {
            localStorage.removeItem(STEALTH_KEY);
            location.reload();
        }
    };
})();
