const swAllowedHostnames = ["localhost", "127.0.0.1"];

// BareMux SharedWorker source as an inline data: URL — same approach opium /
// TongSherbet ships. Avoids the /~r/2/worker.js fetch entirely (which both
// hides the bare-mux/worker.js URL pattern Lightspeed regexes for and
// eliminates one cold-start network round-trip).
//
// The placeholder `__VN_BMX_WORKER_DATA__` is rewritten by the server at
// startup to the base64-encoded cloaked worker.js bytes. If the rewrite
// somehow didn't run (placeholder still present), fall back to the /~r/2/
// URL so the proxy still works.
function _vnBmxWorker() {
  var p = "__VN_BMX_WORKER_DATA__";
  if (p.charAt(0) !== "_") return "data:application/javascript;base64," + p;
  return "/" + "~r/2/" + "worker.js" + "?v=2" + "20";
}

// bare-mux v2.1.7 (embedded inside scramjet's c.bundle.js AND inside the
// standalone /~r/2/ bundle AND inside uv's bundle.js) reads its SharedWorker
// path from localStorage['b-mx-path'] when the constructor isn't given one.
// Our register-sw.js passes the worker path to its OWN BareMuxConnection
// instance, but the scramjet client (loaded inside proxied iframes via
// $vnv5CL().loadAndHook()) constructs its own BareMuxConnection WITHOUT an
// argument — and falls back to localStorage. Same for any inline code that
// constructs a fresh BareMuxConnection.
//
// Set the localStorage key BEFORE any vendor bundle loads. Errors logged
// in errorors.txt:
//   "b-mx: got localStorage b-mx-path: undefined"
//   "Uncaught Error: Unable to get b-mx workerPath from localStorage."
// cascade into "$vn$prop is not defined" because scramjet client init
// throws before $vn$ globals get installed on the proxied page.
//
// Cloaked key is 'b-mx-path' (renamed from 'bare-mux-path' by Phase 1.8 +
// 1.9d cloak; both standalone and embedded bare-mux read this cloaked
// name now, see _baremuxCloakMap and the 'bare-mux'→'b-mx' substring entry
// added to _scramjetCloakMap in Phase 1.9d).
try {
  if (typeof localStorage !== 'undefined') {
    var _bp = _vnBmxWorker();
    // Cloaked keys ONLY. Lightspeed Live Intelligence scans every
    // localStorage key against /bare-mux-path/i and /^bare-mux/i — writing
    // the uncloaked 'bare-mux-path' name was a direct tier-1 hit that
    // fired detectBareMux for +30 on every page load. The previous
    // "belt-and-suspenders fallback" was burning the site.
    //
    //   b-mx-path  — what our cloaked bare-mux + UV bundle read
    //   BMPath     — what scramjet's locally-built embedded bare-mux reads
    //                (see scramjet.all.js: `a["BMPath"]=e` / `let e=a["BMPath"]`)
    localStorage.setItem('b-mx-path', _bp);
    localStorage.setItem('BMPath', _bp);
  }
} catch (_) {}


const _vnEmbedded = (function () {
  try {
    if (/[?&]embed=1\b/.test(location.search)) {
      try { sessionStorage.setItem('vn_embedded', '1'); } catch (_) {}
      return true;
    }
    return sessionStorage.getItem('vn_embedded') === '1';
  } catch (_) { return false; }
})();




// Strict shape check: must look like the BareMux module — a length-3 method
// (set-transport-style) AND a length-0 get-style method on the same class.
// Without this, the original scan matched random built-ins (e.g. WebGL,
// CSSStyleDeclaration.setProperty etc.) whose prototype methods happened
// to have length 3 — caching one of those as `__bmx` is what produced
// `connection[txKey] is not a function` since the resulting "connection"
// wasn't a BareMuxConnection at all.
function _looksLikeBMx(v) {
  if (!v || typeof v !== 'object') return false;
  if (v.BMxConn) return true;            // cloaked
  if (v.BareMuxConnection) return true;  // uncloaked fallback
  // Structural fallback — class with both set-style (len 3) AND get-style (len 0) method
  try {
    for (var m in v) {
      var fn = v[m];
      if (typeof fn !== 'function' || !fn.prototype) continue;
      var has3 = false, hasGet = false;
      var nms = Object.getOwnPropertyNames(fn.prototype);
      for (var j = 0; j < nms.length; j++) {
        if (nms[j] === 'constructor') continue;
        var pf = fn.prototype[nms[j]];
        if (typeof pf !== 'function') continue;
        if (pf.length === 3) has3 = true;
        else if (pf.length === 0 && /^get/.test(nms[j])) hasGet = true;
      }
      if (has3 && hasGet) return true;
    }
  } catch (_) {}
  return false;
}

function _ctor(obj) {
  if (!obj) return null;
  if (obj.BMxConn) return obj.BMxConn;
  if (obj.BareMuxConnection) return obj.BareMuxConnection;
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

// Prefer the cloaked setTransport name directly. Generic scan was returning
// other length-3 methods (e.g. getInnerPort in some iteration orders) which
// then weren't actually the transport setter.
//
// String built at runtime to avoid putting the literal token in the source —
// Lightspeed signatures match on raw strings, and the cloaked bundle uses
// these short names instead of the original setTransport/BareMuxConnection.
function _methKey(inst, n) {
  if (!inst) return null;
  if (n === 3) {
    // Cloak renamed setTransport → setTrx in the served BareMux bundle.
    // setManualTransport is NOT renamed (the cloak's split() match doesn't
    // hit it because the substring 'setTransport' isn't inside the longer
    // name). Both have length 3 — prefer setTrx since it's the public API.
    var _k1 = 'set' + 'Tr' + 'x';
    if (typeof inst[_k1] === 'function') return _k1;
    var _k2 = 'set' + 'Manual' + 'Transport';
    if (typeof inst[_k2] === 'function') return _k2;
  }
  try {
    var p = Object.getPrototypeOf(inst);
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
      if (v && typeof v === 'object' && _looksLikeBMx(v)) {
        try { delete window[k]; } catch (_) {}
        return v;
      }
    }
  } catch (_) {}
  return null;
}

function _getTM() {
  try { if (window.__bmx && _looksLikeBMx(window.__bmx)) return window.__bmx; } catch (_) {}
  // Try direct globals first — BMx is the cloaked name we emit.
  try { if (window.BMx && _looksLikeBMx(window.BMx)) { window.__bmx = window.BMx; return window.BMx; } } catch (_) {}
  try { if (window.BareMux && _looksLikeBMx(window.BareMux)) { window.__bmx = window.BareMux; return window.BareMux; } } catch (_) {}
  // Fallback scan — but only accept candidates that pass the strict shape check.
  try {
    var keys = Object.getOwnPropertyNames(window);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k.charAt(0) === '_') continue;
      var v;
      try { v = window[k]; } catch (_) { continue; }
      if (_looksLikeBMx(v)) { window.__bmx = v; return v; }
    }
  } catch (_) {}
  return null;
}


function _regger() {
  try {
    var n = navigator;
    for (var p in n) {
      try { var v = n[p]; if (v && typeof v.register === 'function') return v; } catch (_) {}
    }
  } catch (_) {}
  return null;
}

(function primeTransport() {
  if (_vnEmbedded) return;
  try {
    var TM = _getTM();
    if (TM && !window.__vnConn) {
      var C = _ctor(TM);
      if (C) window.__vnConn = new C(_vnBmxWorker());
    }
  } catch (e) {}
})();

async function ensureTransportLoaded() {
  if (_getTM()) return;
  var before = Object.keys(window);
  await new Promise(function (resolve, reject) {
    var s = document.createElement("script");
    s.src = "/" + "~r/2/" + "index.js";
    s.onload = resolve;
    s.onerror = function () { reject(new Error("t2")); };
    document.head.appendChild(s);
  });
  try {
    var got = _captureVendor(before);
    if (got && !window.__bmx) window.__bmx = got;
  } catch (_) {}
}

let _transportPromise = null;
async function setupTransport() {
  if (_transportPromise) return _transportPromise;
  _transportPromise = (async function () {
    await ensureTransportLoaded();
    var TM = _getTM();
    if (!TM) throw new Error("tf");
    var C = _ctor(TM);
    if (!C) throw new Error("nc");
    // If a previous primeTransport() got the wrong "TM" (built-in scan
    // false positive) and stashed a bad connection, throw it out and rebuild.
    var connection = window.__vnConn;
    if (connection) {
      // Sanity check: the connection's prototype must have a length-3
      // method we can call. Otherwise we trusted a built-in.
      var _ok = false;
      try {
        if (typeof connection.setTrx === 'function' ||
            typeof connection.setTransport === 'function' ||
            typeof connection.setManualTransport === 'function') _ok = true;
      } catch (_) {}
      if (!_ok) { try { delete window.__vnConn; } catch (_) {} connection = null; }
    }
    if (!connection) {
      connection = new C(_vnBmxWorker());
      window.__vnConn = connection;
    }
    var txKey = _methKey(connection, 3);
    if (!txKey || typeof connection[txKey] !== 'function') {
      throw new Error("no setTransport on connection (proto=" + (Object.getPrototypeOf(connection) && Object.getPrototypeOf(connection).constructor && Object.getPrototypeOf(connection).constructor.name) + ")");
    }
    window.__vnTxKey = txKey;
    var wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/" + "stream" + "/";
    
    
    
    
    var _txUrl;
    var _eng = 'std';
    try {
      _eng = localStorage.getItem('voidEngineMode') || 'std';
      var _tx = localStorage.getItem('vn_tx_' + _eng);
      if (_tx === 'r3')   _txUrl = "/" + "~r/3/" + "index.mjs";
      else if (_tx === 'r4') _txUrl = "/" + "~r/4/" + "index.mjs";
    } catch (_) {}
    // FORCE libcurl (r4) — the only transport that honors `proxy:` option
    // (verified in @mercuryworkshop/libcurl-transport: socks5h/socks4a/http).
    // @mercuryworkshop/epoxy-transport's option allow-list explicitly omits
    // proxy, so user pref r3 (epoxy) would silently break the Tor chain.
    // When we drop the proxy chain in the future, this can return to honoring
    // user pref.
    _txUrl = "/" + "~r/4/" + "index.mjs";
    window.__vnTxUrl = _txUrl;
    window.__vnWispUrl = wispUrl;
    // Robby-style chain: send every wisp stream THROUGH a SOCKS5 proxy
    // that the wisp server can reach on its own loopback. Tor is running
    // on the VPS at 127.0.0.1:40000 — when the browser's epoxy/libcurl
    // transport opens a wisp stream targeted at "127.0.0.1:40000", the
    // wisp server dials its own Tor SOCKS5, the browser then does a
    // SOCKS5 handshake INSIDE that stream, and the final TCP egress is
    // from a Tor exit node — giving us a clean IP that Google doesn't
    // bot-flag. The opium wispUrl swap is reverted (above) — we keep
    // using our own wisp now.
    await Promise.race([
      connection[txKey](_txUrl, [(function(){
        var _o = {};
        _o["wi" + "sp"] = wispUrl;
        return _o;
      })()]),
      new Promise(function (_, reject) { setTimeout(function () { reject(new Error('tt')); }, 15000); })
    ]);

    _vnPostBmxReady();
  })();
  _transportPromise.catch(function () { _transportPromise = null; });
  return _transportPromise;
}

// Notify all service workers that the bare-mux transport is now ready.
// Without this signal, sw-scram.js can call _sj.fetch() before the
// SharedWorker has any transport registered → "there are no bare clients"
// error, request fails. SWs listen for {type:'bmx-ready'} and gate
// their fetch handlers behind that flag.
function _vnPostBmxReady() {
  try {
    var msg = {};
    msg["typ" + "e"] = 'bm' + 'x-ready';
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      try { navigator.serviceWorker.controller.postMessage(msg); } catch (_) {}
    }
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      navigator.serviceWorker.getRegistrations().then(function (rs) {
        for (var i = 0; i < rs.length; i++) {
          try { rs[i].active && rs[i].active.postMessage(msg); } catch (_) {}
        }
      }).catch(function () {});
    }
  } catch (_) {}
}

// Listen for tx-reconnect from any SW. The SW sends this when it detects
// "no bare clients" — i.e., the SharedWorker dropped its transport
// (BareMux GCs it after page nav or idle). Re-call setTrx on the existing
// connection, then re-post bmx-ready so the SW retry can fire.
//
// Gated with `_reconnecting` to avoid stacking re-setups when many failed
// fetches fire in a burst (a stale page can issue dozens of fetches per
// second). Same pattern as view.html's tx-reconnect handler — duplicated
// here so any page that loads register-sw.js (p.html etc.) gets it too.
try {
  if (navigator.serviceWorker) {
    var _reconnecting = false;
    navigator.serviceWorker.addEventListener('message', function (event) {
      if (!event.data || event.data.type !== 'tx-reconnect' || _reconnecting) return;
      _reconnecting = true;
      try {
        var conn = window.__vnConn;
        var txKey = window.__vnTxKey;
        var txUrl = window.__vnTxUrl || ("/" + "~r/3/" + "index.mjs");
        if (!conn || !txKey || typeof conn[txKey] !== 'function') {
          _reconnecting = false;
          return;
        }
        // Reconnect with the same Tor SOCKS5 chain as initial setup.
        var wispUrl = window.__vnWispUrl || ((location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/stream/");
        Promise.race([
          conn[txKey](txUrl, [(function(){
            var _o = {};
            _o["wi" + "sp"] = wispUrl;
            return _o;
          })()]),
          new Promise(function (_, reject) { setTimeout(function () { reject(new Error('rt')); }, 8000); })
        ]).then(function () {
          _reconnecting = false;
          _vnPostBmxReady();
        }).catch(function () {
          _reconnecting = false;
        });
      } catch (_) { _reconnecting = false; }
    });
  }
} catch (_) {}

async function registerSW() {
  if (_vnEmbedded) return;
  if (location.protocol !== "https:" && !swAllowedHostnames.includes(location.hostname)) {
    throw new Error("https needed");
  }
  var SW = _regger();
  if (!SW) throw new Error("no sw container");
  var transportPromise = setupTransport();
  
  
  
  
  
  if (!SW.controller) {
    try {
      var reg = await SW.register("/" + "pwa.js", { updateViaCache: "none" });
      var pending = reg.installing || reg.waiting;
      if (pending) {
        await new Promise(function (resolve, reject) {
          pending.addEventListener("statechange", function (e) {
            if (e.target.state === "activated") resolve();
            else if (e.target.state === "redundant") reject(new Error("sw redundant"));
          });
        });
      }
    } catch (e) {
      throw new Error("sw register failed: " + (e && e.message));
    }
  }
  await Promise.race([
    SW.ready,
    new Promise(function (_, reject) { setTimeout(function () { reject(new Error("sw ready timeout")); }, 8000); })
  ]);
  await transportPromise;

  // The narrow-scope SWs (/sw-uv.js → /~/  and  /sw-scram.js → /~r/p/) must
  // be AWAITED to activation, not fire-and-forget. If they're still installing
  // when the page sets `iframe.src = "/~/px/..."`, the browser sees a SW
  // registration at the most-specific scope that isn't active yet — and
  // routes the request to the network instead of the active root SW. Result:
  // server 404, no proxy. Awaiting activation here closes that window.
  async function _vnRegScoped(swUrl, scope) {
    try {
      var reg = await SW.register(swUrl, { scope: scope, updateViaCache: "none" });
      var pending = reg && (reg.installing || reg.waiting);
      if (pending) {
        await new Promise(function (resolve) {
          var done = false;
          pending.addEventListener("statechange", function (e) {
            if (done) return;
            var st = e.target.state;
            if (st === "activated" || st === "redundant") { done = true; resolve(); }
          });
          setTimeout(function () { if (!done) { done = true; resolve(); } }, 4000);
        });
      }
    } catch (_) {}
  }
  await Promise.all([
    _vnRegScoped("/" + "sw-uv.js",    "/" + "~/"),
    _vnRegScoped("/" + "sw-scram.js", "/" + "~r/p/"),
  ]);
}
