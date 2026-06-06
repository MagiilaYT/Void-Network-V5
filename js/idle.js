(function() {
    'use strict';

    window.VoidCompat = window.VoidCompat || {};

    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    var isWebKit = /AppleWebKit/.test(ua) && !/Chrome/.test(ua);
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    var isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    VoidCompat.device = {
        isIOS: isIOS,
        isSafari: isSafari,
        isWebKit: isWebKit,
        isMobile: isMobile,
        isStandalone: isStandalone,
        isIPad: /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
        isIPhone: /iPhone/.test(ua),
        isAndroid: /Android/.test(ua),
        iosVersion: (function() {
            var match = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
            return match ? parseFloat(match[1] + '.' + match[2]) : null;
        })(),
        safariVersion: (function() {
            var match = ua.match(/Version\/(\d+\.\d+)/);
            return match ? parseFloat(match[1]) : null;
        })()
    };

    VoidCompat.features = {
        serviceWorker: 'serviceWorker' in navigator,
        webSocket: 'WebSocket' in window,
        indexedDB: 'indexedDB' in window,
        localStorage: (function() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        })(),
        wasm: (function() {
            try {
                if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
                    var module = new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]));
                    return module instanceof WebAssembly.Module && new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
                }
            } catch (e) {}
            return false;
        })(),
        fetch: 'fetch' in window,
        promise: 'Promise' in window,
        broadcastChannel: 'BroadcastChannel' in window
    };

    VoidCompat.fixes = {
        applied: false,

        applyAll: function() {
            if (this.applied) return;
            this.applied = true;

            this.fixViewportHeight();
            this.fixServiceWorkerScope();
            this.fixWebSocketKeepalive();
            this.fixStorageQuota();
            this.fixScrollBehavior();
            this.fixInputZoom();
            this.fixTouchEvents();

            if (VoidCompat.device.isIOS) {
                this.fixIOSSpecific();
            }

            if (VoidCompat.device.isSafari) {
                this.fixSafariSpecific();
            }
        },

        fixViewportHeight: function() {
            var setVH = function() {
                var vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', vh + 'px');
                document.documentElement.style.setProperty('--real-vh', window.innerHeight + 'px');
            };

            setVH();
            window.addEventListener('resize', setVH);
            window.addEventListener('orientationchange', function() {
                setTimeout(setVH, 100);
            });
        },

        fixServiceWorkerScope: function() {
            if (!VoidCompat.features.serviceWorker) return;

            var originalRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
            navigator.serviceWorker.register = function(scriptURL, options) {
                options = options || {};

                if (!options.scope) {
                    options.scope = '/';
                }

                return originalRegister(scriptURL, options).then(function(registration) {
                    if (VoidCompat.device.isIOS || VoidCompat.device.isSafari) {
                        registration.update().catch(function() {});
                    }
                    return registration;
                }).catch(function(error) {
                    console.warn('Service Worker registration failed:', error);
                    throw error;
                });
            };
        },

        fixWebSocketKeepalive: function() {
            if (!VoidCompat.features.webSocket) return;
            if (!VoidCompat.device.isIOS && !VoidCompat.device.isSafari) return;

            var OriginalWebSocket = window.WebSocket;
            window.WebSocket = function(url, protocols) {
                var ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
                var pingInterval = null;

                ws.addEventListener('open', function() {
                    pingInterval = setInterval(function() {
                        if (ws.readyState === WebSocket.OPEN) {
                            try {
                                ws.send('');
                            } catch (e) {}
                        }
                    }, 25000);
                });

                var cleanup = function() {
                    if (pingInterval) {
                        clearInterval(pingInterval);
                        pingInterval = null;
                    }
                };

                ws.addEventListener('close', cleanup);
                ws.addEventListener('error', cleanup);

                return ws;
            };
            window.WebSocket.prototype = OriginalWebSocket.prototype;
            window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
            window.WebSocket.OPEN = OriginalWebSocket.OPEN;
            window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
            window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
        },

        fixStorageQuota: function() {
            if (!VoidCompat.device.isIOS && !VoidCompat.device.isSafari) return;

            if ('storage' in navigator && 'persist' in navigator.storage) {
                navigator.storage.persist().catch(function() {});
            }

            window.addEventListener('storage', function(e) {
                if (e.key === null) {
                    console.warn('Storage was cleared by the browser');
                }
            });
        },

        fixScrollBehavior: function() {
            if (!VoidCompat.device.isMobile) return;

            document.body.style.webkitOverflowScrolling = 'touch';
            document.body.style.overscrollBehavior = 'none';

            document.addEventListener('touchmove', function(e) {
                if (e.target.closest('iframe')) {
                    return;
                }
            }, { passive: true });
        },

        fixInputZoom: function() {
            if (!VoidCompat.device.isIOS) return;

            var inputs = document.querySelectorAll('input[type="text"], input[type="search"], input[type="email"], input[type="url"], textarea, select');
            inputs.forEach(function(input) {
                var computedStyle = window.getComputedStyle(input);
                var fontSize = parseFloat(computedStyle.fontSize);
                if (fontSize < 16) {
                    input.style.fontSize = '16px';
                }
            });

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            var newInputs = node.querySelectorAll ? node.querySelectorAll('input[type="text"], input[type="search"], input[type="email"], input[type="url"], textarea, select') : [];
                            newInputs.forEach(function(input) {
                                var computedStyle = window.getComputedStyle(input);
                                var fontSize = parseFloat(computedStyle.fontSize);
                                if (fontSize < 16) {
                                    input.style.fontSize = '16px';
                                }
                            });
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        },

        fixTouchEvents: function() {
            if (!VoidCompat.device.isMobile) return;

            document.addEventListener('touchstart', function() {}, { passive: true });

            var iframes = document.querySelectorAll('iframe');
            iframes.forEach(function(iframe) {
                iframe.setAttribute('scrolling', 'yes');
                iframe.style.webkitOverflowScrolling = 'touch';
            });
        },

        fixIOSSpecific: function() {
            if (VoidCompat.device.iosVersion && VoidCompat.device.iosVersion < 15) {
                var style = document.createElement('style');
                style.textContent = [
                    '.game-card, .app-card { -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }',
                    'body { -webkit-overflow-scrolling: touch; }',
                    'iframe { -webkit-overflow-scrolling: touch; }'
                ].join('\n');
                document.head.appendChild(style);
            }

            document.addEventListener('gesturestart', function(e) {
                if (e.target.tagName !== 'IMG') {
                    e.preventDefault();
                }
            });

            var lastTouchEnd = 0;
            document.addEventListener('touchend', function(e) {
                var now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
                        e.preventDefault();
                    }
                }
                lastTouchEnd = now;
            }, false);

            document.addEventListener('visibilitychange', function() {
                if (!document.hidden && navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({ type: 'wake' });
                }
            });
        },

        fixSafariSpecific: function() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(function(registration) {
                    setInterval(function() {
                        registration.update().catch(function() {});
                    }, 60000);
                }).catch(function() {});
            }

            window.addEventListener('pageshow', function(event) {
                if (event.persisted) {
                    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({ type: 'pageshow' });
                    }
                }
            });
        }
    };

    VoidCompat.proxy = {
        checkSupport: function() {
            var issues = [];

            if (!VoidCompat.features.serviceWorker) {
                issues.push('Service Workers not supported');
            }

            if (!VoidCompat.features.wasm) {
                issues.push('WebAssembly not supported');
            }

            if (!VoidCompat.features.webSocket) {
                issues.push('WebSocket not supported');
            }

            if (!VoidCompat.features.fetch) {
                issues.push('Fetch API not supported');
            }

            if (VoidCompat.device.isIOS && VoidCompat.device.iosVersion && VoidCompat.device.iosVersion < 14) {
                issues.push('iOS version too old (requires 14+)');
            }

            return {
                supported: issues.length === 0,
                issues: issues
            };
        },

        waitForServiceWorker: function(timeout) {
            timeout = timeout || 10000;

            return new Promise(function(resolve, reject) {
                if (!navigator.serviceWorker) {
                    reject(new Error('Service Workers not supported'));
                    return;
                }

                if (navigator.serviceWorker.controller) {
                    resolve(navigator.serviceWorker.controller);
                    return;
                }

                var timeoutId = setTimeout(function() {
                    reject(new Error('Service Worker activation timeout'));
                }, timeout);

                navigator.serviceWorker.ready.then(function(registration) {
                    clearTimeout(timeoutId);

                    if (registration.active) {
                        resolve(registration.active);
                    } else if (registration.installing || registration.waiting) {
                        var worker = registration.installing || registration.waiting;
                        worker.addEventListener('statechange', function() {
                            if (worker.state === 'activated') {
                                resolve(worker);
                            }
                        });
                    } else {
                        reject(new Error('No active service worker'));
                    }
                }).catch(reject);
            });
        },

        initWithRetry: function(initFn, maxRetries, delay) {
            maxRetries = maxRetries || 3;
            delay = delay || 1000;

            return new Promise(function(resolve, reject) {
                var attempts = 0;

                function attempt() {
                    attempts++;

                    initFn().then(resolve).catch(function(error) {
                        if (attempts < maxRetries) {
                            console.warn('Proxy init attempt ' + attempts + ' failed, retrying in ' + delay + 'ms');
                            setTimeout(attempt, delay);
                        } else {
                            reject(error);
                        }
                    });
                }

                attempt();
            });
        }
    };

    VoidCompat.ui = {
        getSafeAreaInsets: function() {
            var style = getComputedStyle(document.documentElement);
            return {
                top: parseInt(style.getPropertyValue('--safe-area-top') || '0', 10),
                bottom: parseInt(style.getPropertyValue('--safe-area-bottom') || '0', 10),
                left: parseInt(style.getPropertyValue('--safe-area-left') || '0', 10),
                right: parseInt(style.getPropertyValue('--safe-area-right') || '0', 10)
            };
        },

        getViewportHeight: function() {
            return window.innerHeight;
        },

        isKeyboardVisible: function() {
            if (!VoidCompat.device.isMobile) return false;

            var viewportHeight = window.innerHeight;
            var windowHeight = window.screen.height;

            return viewportHeight < windowHeight * 0.75;
        },

        onKeyboardChange: function(callback) {
            if (!VoidCompat.device.isMobile) return function() {};

            var lastHeight = window.innerHeight;

            var checkKeyboard = function() {
                var currentHeight = window.innerHeight;
                if (currentHeight !== lastHeight) {
                    var isVisible = currentHeight < lastHeight;
                    callback(isVisible, currentHeight);
                    lastHeight = currentHeight;
                }
            };

            window.addEventListener('resize', checkKeyboard);

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', checkKeyboard);
            }

            return function() {
                window.removeEventListener('resize', checkKeyboard);
                if (window.visualViewport) {
                    window.visualViewport.removeEventListener('resize', checkKeyboard);
                }
            };
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            VoidCompat.fixes.applyAll();
        });
    } else {
        VoidCompat.fixes.applyAll();
    }

    window.VoidCompat = VoidCompat;

})();

;
function downloadSave() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'void-save.json';
    a.click();
}

function uploadSave(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            for (var key in data) {
                localStorage.setItem(key, data[key]);
            }
            alert('Save loaded! Page will reload.');
            location.reload();
        } catch (err) {
            alert('Invalid save file!');
        }
    };
    reader.readAsText(file);
}

function initSaveCode() {
    var downloadBtn = document.getElementById('downloadSaveBtn');
    var uploadBtn = document.getElementById('uploadSaveBtn');
    var fileInput = document.getElementById('saveFileInput');
    var debugDiv = document.getElementById('debugInfo');

    if (debugDiv) {
        debugDiv.textContent = 'localStorage: ' + localStorage.length + ' items';
    }

    if (downloadBtn) {
        downloadBtn.onclick = downloadSave;
    }

    if (uploadBtn && fileInput) {
        uploadBtn.onclick = function() { fileInput.click(); };
        fileInput.onchange = function(e) {
            if (e.target.files[0]) {
                uploadSave(e.target.files[0]);
            }
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSaveCode);
} else {
    initSaveCode();
}

;
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

;
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
