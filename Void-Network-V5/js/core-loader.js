









(async function () {
    try {
        if (/[?&]embed=1\b/.test(location.search)) {
            try { sessionStorage.setItem('vn_embedded', '1'); } catch (_) {}
            return;
        }
        if (sessionStorage.getItem('vn_embedded') === '1') return;
    } catch (_) {}
    if (window.__vnCoreLoaded) return;
    window.__vnCoreLoaded = true;

    
    
    function _txCtor(obj) {
        if (!obj) return null;
        try {
            var fb = null;
            for (var m in obj) {
                var fn = obj[m];
                if (typeof fn !== 'function') continue;
                try {
                    var proto = fn.prototype;
                    if (proto) {
                        var names = Object.getOwnPropertyNames(proto);
                        for (var i = 0; i < names.length; i++) {
                            var pk = names[i];
                            if (pk === 'constructor') continue;
                            var pf = proto[pk];
                            if (typeof pf === 'function' && pf.length === 3) return fn;
                        }
                    }
                } catch (_) {}
                if (!fb) fb = fn;
            }
            return fb;
        } catch (_) {}
        return null;
    }

    
    function _methodByArity(instance, n) {
        try {
            var p = Object.getPrototypeOf(instance);
            if (p) {
                var nms = Object.getOwnPropertyNames(p);
                for (var i = 0; i < nms.length; i++) {
                    var k = nms[i];
                    if (k === 'constructor') continue;
                    var fn = p[k];
                    if (typeof fn === 'function' && fn.length === n) return k;
                }
            }
        } catch (_) {}
        return null;
    }

    
    function _captureVendor(beforeKeys) {
        try {
            var now = Object.keys(window);
            for (var i = 0; i < now.length; i++) {
                var k = now[i];
                if (beforeKeys.indexOf(k) !== -1) continue;
                var v = window[k];
                if (v && typeof v === 'object') {
                    for (var m in v) {
                        if (typeof v[m] === 'function') {
                            try { delete window[k]; } catch (_) {}
                            return v;
                        }
                    }
                }
            }
        } catch (_) {}
        return null;
    }

    
    function _findLoader() {
        try {
            var ks = Object.getOwnPropertyNames(window);
            for (var i = 0; i < ks.length; i++) {
                var k = ks[i];
                if (k.charAt(0) !== '$') continue;
                var v = window[k];
                if (typeof v === 'function' && v.length === 0) return { key: k, fn: v };
            }
        } catch (_) {}
        return null;
    }

    
    
    function _regger() {
        try {
            var n = navigator;
            for (var p in n) {
                try {
                    var v = n[p];
                    if (v && typeof v.register === 'function') return v;
                } catch (_) {}
            }
        } catch (_) {}
        return null;
    }

    function _getTM() {
        try { if (window.__bmx) return window.__bmx; } catch (_) {}
        return null;
    }

    try {
        
        if (!_getTM()) {
            var beforeKeys = Object.keys(window);
            await new Promise(function (res, rej) {
                var s = document.createElement("script");
                s.src = "/" + "~r/2/" + "index.js";
                s.onload = res;
                s.onerror = function () { rej(new Error("t2")); };
                document.head.appendChild(s);
            });
            try {
                var captured = _captureVendor(beforeKeys);
                if (captured) window.__bmx = captured;
            } catch (_) {}
        }

        
        var loader = _findLoader();
        if (!loader) {
            await new Promise(function (res, rej) {
                var s = document.createElement("script");
                s.src = "/" + "~r/1/" + "core.js";
                s.onload = res;
                s.onerror = function () { rej(new Error("t1")); };
                document.head.appendChild(s);
            });
            loader = _findLoader();
        }

        
        var TM = _getTM();
        var Ctor = _txCtor(TM);
        if (!Ctor) throw new Error('no-ctor');
        var connection = new Ctor("/" + "~r/2/" + "worker.js" + "?v=2" + "20");

        
        var txKey = _methodByArity(connection, 3);
        // Use our in-house wisp; chain TCP through Tor SOCKS5 on VPS loopback.
        var wispUrl = window.__vnWispUrl || ((location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/stream/");
        window.__vnWispUrl = wispUrl;
        
        
        
        
        
        
        
        
        
        
        var _rp = location.pathname;
        
        
        
        
        // libcurl (r4) connects straight through wisp. WARP egress is now done
        // server-side in wisp-bun.mjs (every wisp target socket is routed
        // through 127.0.0.1:40000), so NO browser-side proxy: option — the old
        // socks5h-to-loopback-through-a-wisp-stream path failed with curl code 7.
        var _txUrl = "/" + "~r/4/" + "index.mjs";
        await Promise.race([
            connection[txKey](_txUrl, [(function(){
                var _o = {};
                _o["wi" + "sp"] = wispUrl;
                return _o;
            })()]),
            new Promise(function (_, rej) { setTimeout(function () { rej(new Error('txt')); }, 15000); })
        ]);
        if (!window.__vnConn) window.__vnConn = connection;
        if (!window.__vnTxKey) window.__vnTxKey = txKey;
        
        
        window.__vnTxUrl = _txUrl;

        
        
        
        
        
        
        
        
        try {
            var _warmWs = new WebSocket(wispUrl);
            _warmWs.addEventListener('open', function () {
                try { _warmWs.close(1000, 'warmup'); } catch (_) {}
            }, { once: true });
            _warmWs.addEventListener('error', function () {}, { once: true });
        } catch (_) {}

        
        
        var exp = loader.fn();
        var CtrlCtor = null;
        for (var ck in exp) {
            var cfn = exp[ck];
            if (typeof cfn === 'function' && cfn.prototype) { CtrlCtor = cfn; break; }
        }
        if (!CtrlCtor) throw new Error('no-ctrl');

        
        var _R1 = "/" + "~r/1/";
        var _wasm = _R1 + "c." + "wasm";
        var _all  = _R1 + "c." + "bundle.js";
        var _sync = _R1 + "c." + "sync.js";
        var _px   = "/" + "~r/" + "p/";

        window.__engine = new CtrlCtor({
            prefix: _px,
            globals: {
                wrapfn: "$vn$wrap", wrappropertybase: "$vn__", wrappropertyfn: "$vn$prop",
                cleanrestfn: "$vn$clean", importfn: "$vn$import", rewritefn: "$vn$rewrite",
                metafn: "$vn$meta", setrealmfn: "$vn$setrealm", pushsourcemapfn: "$vn$pushsourcemap",
                trysetfn: "$vn$tryset", templocid: "$vn$temploc", tempunusedid: "$vn$tempunused"
            },
            files: { wasm: _wasm, all: _all, sync: _sync },
            flags: {
                serviceworkers: false,
                syncxhr: false,
                strictRewrites: false,
                rewriterLogs: false,
                captureErrors: false,
                cleanErrors: false,
                scramitize: false,
                sourcemaps: false,
                destructureRewrites: false,
                interceptDownloads: false,
                allowInvalidJs: true
            }
        });

        
        
        var SW = _regger();
        if (SW) {
            
            var initKey = _methodByArity(window.__engine, 0);
            if (initKey) await window.__engine[initKey]();
            var _SW_URL = "/" + "pwa.js";
            var reg = await SW.register(_SW_URL);
            if (reg.installing) {
                await Promise.race([
                    new Promise(function (res, rej) {
                        reg.installing.addEventListener('statechange', function (e) {
                            if (e.target.state === 'activated') res();
                            else if (e.target.state === 'redundant') rej(new Error('r'));
                        });
                    }),
                    new Promise(function (_, rej) { setTimeout(function () { rej(new Error('swt')); }, 10000); })
                ]);
            }
        }

        
        
        
        window.__engineInit = true;
        window.__engineReady = true;

        
        try {
            delete window[loader.key];
            delete window['$' + 'scram' + 'jetLoad' + 'Worker'];
        } catch (_) {}
    } catch (e) {}
})();
