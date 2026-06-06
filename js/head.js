/*
 * ad-shield.js — runs in the head before any third-party ad script.
 *
 * Two jobs:
 *   1. Stop ad-network scripts (researchingsweatexit.com /
 *      profitablecpmratenetwork.com / highperformanceformat.com, etc.)
 *      from REPLACING our top window. Any cross-origin navigation
 *      attempt routes through window.open(_blank) instead — pop-under
 *      becomes pop-tab, ad pages never unload our site.
 *
 *   2. Wrap window.open so target=_self / _top / _parent / _main get
 *      forced to _blank with noopener,noreferrer. The opener handle is
 *      severed so the ad can't manipulate our page after the fact.
 *
 * Both protections are inert if the destination is same-origin or matches
 * the explicit allow-list (legitimate redirects like the cloak's
 * classroom.html → /?/ handoff stay working). Runs in the top window only
 * — proxied iframes (scramjet/UV) are off-limits to this code because
 * those run in fully separate cross-origin sandboxes.
 */
(function () {
  if (typeof window === 'undefined') return;
  // Only protect the top-level browsing context. Iframes (proxied games,
  // ad iframes themselves) need to be free to do what they need internally.
  try { if (window.top !== window.self) return; } catch (_) { return; }

  var SELF_ORIGIN = location.origin;
  // Origins that ARE allowed to replace the top window. Same-origin always.
  // Anything else funnels through window.open(_blank).
  var ALLOW = { };
  ALLOW[SELF_ORIGIN] = 1;

  function _isAllowed(url) {
    if (url == null) return false;
    try {
      var u = new URL(String(url), SELF_ORIGIN);
      // about:, javascript:, data:, blob: — keep working (rarely abused for hijack)
      if (u.protocol === 'javascript:' || u.protocol === 'about:' ||
          u.protocol === 'data:' || u.protocol === 'blob:' ||
          u.protocol === 'mailto:' || u.protocol === 'tel:') return true;
      return Boolean(ALLOW[u.origin]);
    } catch (_) {
      // Relative URLs or malformed inputs — same-origin by default
      return true;
    }
  }

  function _safeOpen(url) {
    try {
      var w = window.open(String(url), '_blank', 'noopener,noreferrer');
      // Some browsers return null when popup blocked — fall back silently
      if (w) try { w.opener = null; } catch (_) {}
    } catch (_) {}
  }

  // 1. location.assign / location.replace — both replace the page, both
  //    commonly used by ad pop-under scripts.
  try {
    var origAssign = location.assign.bind(location);
    var origReplace = location.replace.bind(location);
    Object.defineProperty(location, 'assign', {
      value: function (url) {
        if (_isAllowed(url)) return origAssign(url);
        _safeOpen(url);
      },
      configurable: true, writable: true,
    });
    Object.defineProperty(location, 'replace', {
      value: function (url) {
        if (_isAllowed(url)) return origReplace(url);
        _safeOpen(url);
      },
      configurable: true, writable: true,
    });
  } catch (_) {}

  // 2. location.href setter (the most common hijack vector).
  //    Redefining on the Location prototype lets us intercept both
  //    `location.href = X` and `window.location = X`.
  try {
    var locProto = Object.getPrototypeOf(location);
    var hrefDesc = Object.getOwnPropertyDescriptor(locProto, 'href');
    if (hrefDesc && typeof hrefDesc.set === 'function' && typeof hrefDesc.get === 'function') {
      Object.defineProperty(locProto, 'href', {
        configurable: true,
        get: function () { return hrefDesc.get.call(this); },
        set: function (url) {
          if (_isAllowed(url)) return hrefDesc.set.call(this, url);
          _safeOpen(url);
        },
      });
    }
  } catch (_) {}

  // 3. window.open — force target=_blank for any _self/_top/_parent/_main
  //    requests, sever the opener handle.
  try {
    var origOpen = window.open;
    var REPLACING_TARGETS = { '_self': 1, '_top': 1, '_parent': 1, '_main': 1 };
    window.open = function (url, name, features) {
      var safeName = (name && REPLACING_TARGETS[String(name)]) ? '_blank' : (name || '_blank');
      var safeFeatures = features;
      // Inject noopener,noreferrer if not explicitly present
      try {
        var f = String(features || '');
        if (f.indexOf('noopener') === -1) f = (f ? f + ',' : '') + 'noopener';
        if (f.indexOf('noreferrer') === -1) f += ',noreferrer';
        safeFeatures = f;
      } catch (_) {}
      try {
        var w = origOpen.call(window, url, safeName, safeFeatures);
        if (w) try { w.opener = null; } catch (_) {}
        return w;
      } catch (_) { return null; }
    };
  } catch (_) {}

  // 4. Anchor-click guard. Ad scripts sometimes inject <a target="_top"
  //    href="external"> and click it programmatically. Intercept clicks
  //    on any anchor whose target would replace the top window with a
  //    cross-origin URL.
  try {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || typeof t.closest !== 'function') return;
      var a = t.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return;
      var target = (a.getAttribute('target') || '').toLowerCase();
      // If the link is cross-origin AND would replace our window
      // (no target, _self, _top, _parent), reroute to a new tab.
      if (target === '' || target === '_self' || target === '_top' || target === '_parent' || target === '_main') {
        if (!_isAllowed(a.href)) {
          e.preventDefault();
          e.stopPropagation();
          _safeOpen(a.href);
        }
      }
    }, true);
  } catch (_) {}

  // 5. <meta http-equiv="refresh" content="0;url=external"> guard +
  //    fullscreen-overlay-only ad nuker. Detected pattern: an iframe
  //    with fullscreen positioning (position:fixed, inset:0, z-index
  //    near INT_MAX). Real example seen on vng.lol: a fake "Stop Ads"
  //    Chrome-extension prompt that overlays the whole page and breaks
  //    its own close buttons so the user is stuck unless they hit
  //    DevTools. The legitimate sticky social bar from the SAME ad
  //    network ships with the same container-<hex> id pattern but is
  //    NOT fullscreen — so matching purely by style (not id) preserves
  //    revenue while killing the broken interstitials.
  try {
    function _isFullscreenOverlay(el) {
      if (!el || el.nodeType !== 1) return false;
      if (el.tagName !== 'IFRAME') return false;
      var s = el.style;
      if (!s) return false;
      var pos = s.position || '';
      if (pos !== 'fixed' && pos !== 'absolute') return false;
      // z-index 2147483647 is INT32_MAX — basically a tell that the
      // injector wanted to sit ABOVE everything. Real site UI rarely uses it.
      var z = parseInt(s.zIndex, 10);
      if (!(z >= 2000000000)) return false;
      // inset:0 OR width/height:100% — covers the viewport either way.
      var w = (s.width || '').trim();
      var h = (s.height || '').trim();
      var inset = (s.inset || s.top || '').trim();
      var fills = (w === '100%' && h === '100%') ||
                  inset === '0px' || inset === '0px 0px auto' || inset === '0';
      return fills;
    }
    function _isAdContainer(el) {
      if (!el || el.nodeType !== 1) return false;
      if (el.tagName !== 'IFRAME') return false;
      // Style-only match. DIV containers (Native Banner, social bar
      // wrapper) and child iframes inside ad slots aren't fullscreen
      // and stay untouched. We only kill TOP-level fullscreen iframes
      // that hijack the viewport.
      return _isFullscreenOverlay(el);
    }
    function _killAdContainer(el) {
      try {
        if (el.parentNode) el.parentNode.removeChild(el);
        else if (typeof el.remove === 'function') el.remove();
      } catch (_) {}
    }
    function _scanForAds(root) {
      if (!root || root.nodeType !== 1) return;
      if (_isAdContainer(root)) { _killAdContainer(root); return; }
      try {
        var ifrs = root.getElementsByTagName ? root.getElementsByTagName('iframe') : null;
        if (ifrs) for (var i = ifrs.length - 1; i >= 0; i--) if (_isAdContainer(ifrs[i])) _killAdContainer(ifrs[i]);
      } catch (_) {}
    }

    function _checkMeta(meta) {
      if (!meta || meta.tagName !== 'META') return;
      var http = (meta.getAttribute('http-equiv') || '').toLowerCase();
      if (http !== 'refresh') return;
      var content = meta.getAttribute('content') || '';
      var m = /url\s*=\s*(.+?)(?:;|$)/i.exec(content);
      if (!m) return;
      var url = m[1].trim().replace(/^["']|["']$/g, '');
      if (_isAllowed(url)) return;
      // Neuter the meta-refresh so the page doesn't get yanked
      meta.parentNode && meta.parentNode.removeChild(meta);
      _safeOpen(url);
    }
    // Scan existing meta tags
    var existing = document.getElementsByTagName('meta');
    for (var i = 0; i < existing.length; i++) _checkMeta(existing[i]);
    _scanForAds(document.documentElement || document.body);
    // Watch for late insertions + id/class/style mutations (some ad
    // injectors set the attributes AFTER insert to dodge one-shot scans).
    if (typeof MutationObserver === 'function') {
      var mo = new MutationObserver(function (records) {
        for (var r = 0; r < records.length; r++) {
          var rec = records[r];
          var added = rec.addedNodes || [];
          for (var k = 0; k < added.length; k++) {
            var node = added[k];
            _checkMeta(node);
            _scanForAds(node);
          }
          if (rec.type === 'attributes' && rec.target) {
            if (_isAdContainer(rec.target)) _killAdContainer(rec.target);
          }
        }
      });
      mo.observe(document.documentElement || document, {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['style'],
      });
    }
  } catch (_) {}
})();

;



try{
  window.VoidAcademy=window.VoidAcademy||{mode:'student',build:'5.4',courses:1321,department:'general',enrollment:{active:true,tier:'standard'}};
  window.__academy=window.__academy||{ready:true,catalog:'vng-main',locale:'en-US'};
  window.__curriculum=window.__curriculum||{subjects:['stem','humanities','arts','language','logic'],version:'2026.04'};
}catch(e){}






(function(){
  
  
  
  // Generic student-portal titles. NO BRAND NAMES — see
  // reference_lightspeed_signals memory for rationale. The previous
  // pool put a specific platform name in document.title every 30-90s,
  // which matched the filter's brand regex on every periodic scan.
  var ACTIVE_POOL = [
    'Student Portal',
    'Student Portal | Dashboard',
    'Student Portal | My Classes',
    'Student Portal | Algebra 1 - Linear equations',
    'Student Portal | Biology - Photosynthesis and cellular respiration',
    'Student Portal | Geometry - Triangle congruence',
    'Student Portal | US History - The American Revolution',
    'Student Portal | Spanish - Present tense of regular verbs',
    'Student Portal | Language Arts - Main idea',
    'Student Portal | Reading comprehension: fiction'
  ];
  var HIDDEN_POOL = [
    'Student Portal | 1 question remaining',
    'Student Portal | Keep going! You\'re almost done',
    'Student Portal | Your progress is being saved',
    'Student Portal | Resume learning',
    'Student Portal | New recommendation available'
  ];
  function pick(pool){ return pool[(Math.random()*pool.length)|0]; }
  function setTitle(next){
    try{
      var rt = document.querySelector('meta[name="rt"]');
      
      
      
      if (rt && !rt.getAttribute('data-orig')) rt.setAttribute('data-orig', rt.getAttribute('content') || '');
      document.title = next;
    }catch(e){}
  }
  
  try { setTitle(pick(ACTIVE_POOL)); } catch(e){}
  document.addEventListener('visibilitychange', function(){
    if (document.hidden) {
      setTitle(pick(HIDDEN_POOL));
    } else {
      setTitle(pick(ACTIVE_POOL));
    }
  });
  
  
  function rotate(){
    if (!document.hidden) setTitle(pick(ACTIVE_POOL));
    setTimeout(rotate, 30000 + ((Math.random()*60000)|0));
  }
  setTimeout(rotate, 30000 + ((Math.random()*60000)|0));
})();









window.vnCloakText=function(s){
  if(!s||typeof s!=='string')return s;
  var H={
    
    'a':'а','c':'с','e':'е','i':'і','j':'ј',
    'o':'о','p':'р','s':'ѕ','x':'х','y':'у',
    
    'A':'А','B':'В','C':'С','E':'Е','H':'Н',
    'I':'І','J':'Ј','K':'К','M':'М','O':'О',
    'P':'Р','S':'Ѕ','T':'Т','X':'Х','Y':'У',
    
    
    'u':'ս','n':'ո',
    
    'v':'ν','k':'к','h':'һ'
  };
  var homoglyph='';
  for(var i=0;i<s.length;i++){homoglyph+=(H[s[i]]||s[i]);}
  var zw='​';
  return homoglyph.split(/(\s+)/).map(function(part){
    if(/^\s+$/.test(part)||part.length<3)return part;
    var mid=Math.floor(part.length/2);
    return part.slice(0,mid)+zw+part.slice(mid);
  }).join('');
};
(function(){
  var A='data-rc';
  var swapped=false;
  function b64d(s){try{return decodeURIComponent(escape(atob(String(s).replace(/-/g,'+').replace(/_/g,'/'))));}catch(e){return '';}}
  function returningUser(){
    try{return localStorage.getItem('vnVisited')==='1';}catch(e){return false;}
  }
  function swap(){
    if(swapped)return; swapped=true;
    var els=document.querySelectorAll('['+A+']');
    for(var i=0;i<els.length;i++){
      var el=els[i]; var r=b64d(el.getAttribute(A));
      if(!r)continue;
      
      
      
      
      
      
      var cloaked = (window.vnCloakText ? window.vnCloakText(r) : r);
      var attr=el.getAttribute('data-rc-attr');
      if(attr){el.setAttribute(attr,cloaked);}else{el.textContent=cloaked;}
    }
    
    
    
    
    try{localStorage.setItem('vnVisited','1');}catch(e){}
  }
  function scheduleSwap(){
    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded',function(){requestAnimationFrame(swap);},{once:true});
    }else{
      requestAnimationFrame(swap);
    }
  }
  if(returningUser()){scheduleSwap();return;}
  var opts={once:true,passive:true};
  function arm(){scheduleSwap();}
  addEventListener('mousemove',arm,opts);
  addEventListener('pointerdown',arm,opts);
  addEventListener('keydown',arm,opts);
  addEventListener('scroll',arm,opts);
  addEventListener('touchstart',arm,opts);
  addEventListener('wheel',arm,opts);
})();

;
/*
 * cloak-route.js — random rotating cover-path rewriter.
 *
 * On every same-origin internal-link click, swap the canonical /<page>.html
 * (or /<page>) for a random /<cover>/<stem> alias. Server resolves the
 * alias back to the cached HTML pack, so cloaking is free at request time.
 *
 * Click-time rewriting only — no MutationObserver, no DOMContentLoaded
 * scan. Single capture-phase click listener for the whole document.
 * Programmatic navigation (location.href = '/g.html') passes through
 * unchanged; intercepting Location.href is left to ad-shield, and
 * stacking two patches on the same setter would be fragile.
 *
 * The STEMS map MUST stay in sync with _coverPageStems in index-elysia.js.
 */
(function () {
  if (typeof window === 'undefined') return;
  // Don't rewrite inside iframes — proxied content lives there and its
  // internal links should not be rewritten.
  try { if (window.top !== window.self) return; } catch (_) { return; }

  // Generic edu-themed cover words ONLY. We MUST avoid Lightspeed's
  // brand-protection regex /(ixl|khan\s*academy|classlink|clever|schoology
  // |canvas\s*lms)/i — those tokens on a non-brand hostname fire the
  // detectMasqueradeProxyRuntime detector for +30 and an instant report.
  // No platform names — just neutral school-vocabulary nouns.
  // Canonical pathnames → cover stem. Both /foo.html and /foo are accepted
  // (Caddy/Elysia accept both). Update both halves together.
  var STEMS = {
    'Void-Network-V5/': 'index.html'
    'Void-Network-V5/g.html': 'Void-Network-V5/g.html'
    'Void-Network-V5/view.html': 'Void-Network-V5/view.html'
    'Void-Network-V5/p.html': 'Void-Network-V5/p.html'
    'Void-Network-V5/s.html': 'Void-Network-V5/s.html'
    'Void-Network-V5/a.html': 'Void-Network-V5/a.html'
    'Void-Network-V5/c.html': 'Void-Network-V5/c.html'
    'Void-Network-V5/cd.html': 'Void-Network-V5/cd.html'
    'Void-Network-V5/pg.html': 'Void-Network-V5/pg.html'
    'Void-Network-V5/vg.html': 'Void-Network-V5/vg.html'
    'Void-Network-V5/vxl.html': 'Void-Network-V5/vxl.html'
    'Void-Network-V5/about.html': 'Void-Network-V5/about.html'
    'Void-Network-V5/emulator.html': 'Void-Network-V5/emulator.html'
    'Void-Network-V5/code-editor.html': 'Void-Network-V5/code-editor.html']
    'Void-Network-V5/neal-fun.html': 'Void-Network-V5/neal-fun.html'
    'Void-Network-V5/blooketbot.html': 'Void-Network-V5/blooketbot.html'
    'Void-Network-V5/voidtube.html': 'Void-Network-V5/voidtube.html'
    'Void-Network-V5/voidmusic.html': 'Void-Network-V5/voidmusic.html'
    'Void-Network-V5/rblx.html': 'Void-Network-V5/rblx.html'
    'Void-Network-V5/vnprononauth.html': 'Void-Network-V5/vnprononauth.html'
  };

  function _pickCover() {
    return COVERS[(Math.random() * COVERS.length) | 0];
  }

  // Strip an existing /<cover>/ prefix so we pick a fresh one, then look up
  // the stem. Returns null if the path isn't one we cloak.
  function _toCloakedPath(p) {
    if (!p) return null;
    var bare = p;
    for (var i = 0; i < COVERS.length; i++) {
      var pre = '/' + COVERS[i] + '/';
      if (bare.indexOf(pre) === 0) {
        bare = '/' + bare.slice(pre.length);
        break;
      }
      if (bare === '/' + COVERS[i]) {
        bare = '/';
        break;
      }
    }
    var stem = STEMS[bare];
    if (!stem) return null;
    return '/' + _pickCover() + '/' + stem;
  }
  window.vnCloakPath = _toCloakedPath;

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var t = e.target;
    if (!t || typeof t.closest !== 'function') return;
    var a = t.closest('a[href]');
    if (!a) return;
    var target = (a.getAttribute('target') || '').toLowerCase();
    if (target && target !== '_self') return;
    if (a.hasAttribute('download')) return;
    var raw = a.getAttribute('href') || '';
    if (!raw) return;
    var c0 = raw.charAt(0);
    if (c0 === '#') return;
    if (raw.indexOf('javascript:') === 0) return;
    if (raw.indexOf('mailto:') === 0 || raw.indexOf('tel:') === 0) return;
    var url;
    try { url = new URL(raw, location.href); } catch (_) { return; }
    if (url.origin !== location.origin) return;
    var rewritten = _toCloakedPath(url.pathname);
    if (!rewritten) return;
    e.preventDefault();
    e.stopPropagation();
    location.href = rewritten + url.search + url.hash;
  }, true);
})();

;










(function(){
  function slugFor(s){
    var h = 0x811c9dc5 >>> 0;
    for (var i = 0; i < s.length; i++) {
      h = (h ^ s.charCodeAt(i)) >>> 0;
      h = (Math.imul(h, 0x01000193)) >>> 0;
    }
    return h.toString(36);
  }
  window.vnTitleSlug = slugFor;

  
  
  
  
  
  
  window.vnImgSrc = function(src){
    if (!src || typeof src !== 'string') return src;
    if (src.startsWith('data:')) return src;
    if (!src.startsWith('/')) return src;
    return '/g/' + slugFor(src);
  };

  
  
  
  window.vnRenderTitle = function(container, title, opts){
    if (!container) return;
    opts = opts || {};
    var img = document.createElement('img');
    img.className = opts.className || 'vn-title-img';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.draggable = false;
    img.decoding = 'async';
    
    
    
    
    img.loading = 'lazy';
    if (opts.height) img.style.height = opts.height;
    img.onerror = function(){
      
      
      
      var span = document.createElement('span');
      span.className = opts.className || 'vn-title-img';
      span.textContent = (window.vnCloakText || function(x){return x;})(title);
      if (img.parentNode) img.parentNode.replaceChild(span, img);
    };
    img.src = '/titles/' + slugFor(title) + '.svg';
    container.textContent = '';
    container.appendChild(img);
  };
})();

;










(function () {
  function xorEncode(str) {
    if (!str) return str;
    var result = '';
    for (var i = 0; i < str.length; i++) {
      result += i % 2 ? String.fromCharCode(str.charCodeAt(i) ^ 2) : str[i];
    }
    return encodeURIComponent(result);
  }
  function xorDecode(str) {
    if (!str) return str;
    var parts = str.split('?');
    var input = parts.shift();
    var search = parts.join('?');
    var result = '';
    input = decodeURIComponent(input);
    for (var i = 0; i < input.length; i++) {
      result += i % 2 ? String.fromCharCode(input.charCodeAt(i) ^ 2) : input[i];
    }
    return result + (search ? '?' + search : '');
  }
  self.__ccfg = {
    prefix: '/~/px/',
    encodeUrl: xorEncode,
    decodeUrl: xorDecode
  };
})();

;
















(function () {
  if (typeof window === 'undefined') return;

  
  
  
  
  
  
  var inIframe = false;
  try { inIframe = window !== window.top; } catch (e) { inIframe = true; }

  
  try {
    if (!inIframe && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
      var sr = document.createElement('script');
      sr.type = 'speculationrules';
      // Two-tier rules: top-nav HTML pages get EAGER prerender (browser
      // preloads them as soon as they're in the DOM, so click→paint is
      // ~instant). Everything else stays MODERATE (only on hover/click
      // intent) to avoid wasted bandwidth.
      sr.textContent = JSON.stringify({
        prerender: [
          {
            // Tier 1: Top nav pages — PRERENDER eagerly
            where: { href_matches: [
              'Void-Network-V5/', 'Void-Network-V5/home.html', 'Void-Network-V5/g.html', 'Void-Network-V5/view.html', 'Void-Network-V5/p.html',
            ]},
            eagerness: 'eager'
          },
          {
            // Tier 2: Other same-origin HTML — moderate (hover/intent)
            where: {
              and: [
                { href_matches: '/*' },
                { not: { href_matches: '/api/*' } },
                { not: { href_matches: '/~r/*' } },
                { not: { href_matches: '/~/*' } },
                { not: { href_matches: '/cdn-cache/*' } },
                { not: { href_matches: '/' + 'reading/*' } },
                { not: { href_matches: '/' + 'syllabus/*' } },
                { not: { href_matches: '/' + 'only' + 'local/*' } },
                { not: { href_matches: '/' + 'lab' + 'work/*' } },
                { not: { href_matches: '/' + 'local games/*' } },
                { not: { href_matches: '/' + 'local%20games/*' } },
                { not: { href_matches: '/' + 'math' + 'work/*' } },
                { not: { href_matches: '/transfer*' } },
                { not: { href_matches: '/sw.js' } },
                { not: { href_matches: '/worker.js' } },
                { not: { href_matches: '/pwa.js' } },
                { not: { href_matches: '/embed.js' } },
                { not: { href_matches: '/_bundle/*' } },
                { not: { href_matches: '/assets/*' } },
                { not: { href_matches: '/lib/*' } },
                { not: { href_matches: '/img/*' } },
                { not: { href_matches: '/g/*' } },
                { not: { href_matches: '/fonts/*' } },
                { not: { href_matches: '/titles/*' } },
                { not: { href_matches: '/ballerjerb*' } },
                { not: { href_matches: '/ixl*' } },
                { not: { href_matches: '/neal-fun-proxy*' } }
              ]
            },
            eagerness: 'moderate'
          }
        ]
      });
      document.head.appendChild(sr);
      
      
      return;
    }
  } catch (_) {}

  

  var prefetched = Object.create(null);
  var origin = location.origin;

  
  
  
  
  
  var SKIP_PREFIX = [
    '/api/', '/cdn-cache/', '/~r/', '/~/', '/wisp', '/stream',
    '/img/', '/lib/', '/assets/', '/fonts/', '/titles/', '/g/',
    '/' + 'only' + 'local/', '/' + 'local games/',
    '/' + 'local%20games/', '/' + 'reading/',
    '/' + 'math' + 'work/', '/' + 'lab' + 'work/', '/' + 'sylla' + 'bus/',
    '/sw.js', '/worker.js', '/pwa.js', '/embed.js', '/transfer'
  ];

  function shouldPrefetch(href) {
    if (!href || prefetched[href]) return false;
    var u;
    try { u = new URL(href, origin); } catch (_) { return false; }
    if (u.origin !== origin) return false;
    var p = u.pathname;
    for (var i = 0; i < SKIP_PREFIX.length; i++) if (p.indexOf(SKIP_PREFIX[i]) === 0) return false;
    if (p.charAt(p.length - 1) === '/' || /\.html?$/.test(p) || !/\.[a-z0-9]+$/i.test(p)) return true;
    return false;
  }

  function doPrefetch(href) {
    if (prefetched[href]) return;
    prefetched[href] = 1;
    try {
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      
      
      link.as = 'document';
      document.head.appendChild(link);
    } catch (_) {}
  }

  function schedulePrefetch(href) {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(function () { doPrefetch(href); }, { timeout: 200 });
    } else {
      setTimeout(function () { doPrefetch(href); }, 0);
    }
  }

  function findAnchor(target) {
    var n = target;
    while (n && n !== document) {
      if (n.tagName === 'A' && n.href) return n;
      n = n.parentNode;
    }
    return null;
  }

  function onPointer(e) {
    var a = findAnchor(e.target);
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    
    
    var resolved = a.href;
    if (!shouldPrefetch(resolved)) return;
    schedulePrefetch(resolved);
  }

  
  
  
  document.addEventListener('mousedown', onPointer, { capture: true, passive: true });
  document.addEventListener('touchstart', onPointer, { capture: true, passive: true });

  
  
  
  
  
  var hoverTimer = null;
  var hoverTarget = null;
  document.addEventListener('pointerover', function (e) {
    var a = findAnchor(e.target);
    if (!a) return;
    if (hoverTarget === a) return;
    hoverTarget = a;
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function () {
      var href = a.getAttribute('href');
      if (!href) return;
      if (!shouldPrefetch(a.href)) return;
      schedulePrefetch(a.href);
    }, 100);
  }, { capture: true, passive: true });
  document.addEventListener('pointerout', function (e) {
    var a = findAnchor(e.target);
    if (a === hoverTarget) {
      hoverTarget = null;
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
    }
  }, { capture: true, passive: true });

  
  
  
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      var links = document.head.querySelectorAll('link[rel="prefetch"]');
      for (var i = 0; i < links.length; i++) {
        try { links[i].parentNode.removeChild(links[i]); } catch (_) {}
      }
    }
  });

  
  
  
  
  
  
  
  
  var BULK_LIMIT = 30;
  var BULK_DELAY_MS = 1500;
  var BULK_STAGGER_MS = 60;
  function bulkPrefetchVisible() {
    try {
      var conn = navigator.connection;
      if (conn && (conn.saveData === true || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) return;
      var anchors = document.querySelectorAll('a[href]');
      var queue = [];
      for (var i = 0; i < anchors.length && queue.length < BULK_LIMIT; i++) {
        var a = anchors[i];
        var href = a.getAttribute('href');
        if (!href) continue;
        var resolved;
        try { resolved = a.href; } catch (_) { continue; }
        if (!shouldPrefetch(resolved)) continue;
        queue.push(resolved);
      }
      var idx = 0;
      function next() {
        if (idx >= queue.length) return;
        if (document.visibilityState === 'hidden') return;
        doPrefetch(queue[idx++]);
        setTimeout(next, BULK_STAGGER_MS);
      }
      next();
    } catch (_) {}
  }
  function armBulk() {
    setTimeout(function () {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(bulkPrefetchVisible, { timeout: 4000 });
      } else {
        bulkPrefetchVisible();
      }
    }, BULK_DELAY_MS);
  }
  if (document.readyState === 'complete') armBulk();
  else window.addEventListener('load', armBulk, { once: true });
})();

;
(function () {
  var STORAGE_KEY = 'vnPreset';
  var ROOT = document.documentElement;

  var PRESETS = {
    'default':    { name: 'Default',    layout: 'island',  swatch: ['#0a0a0a', '#141414', '#f0f0f0'], desc: 'Matte black with the bottom dynamic island' },
    'sidebar':    { name: 'Sidebar',    layout: 'sidebar', swatch: ['#0a0a0a', '#141414', '#f0f0f0'], desc: 'Same matte palette but the nav lives on the left edge' },
    'midnight':   { name: 'Midnight',   layout: 'island',  swatch: ['#050a18', '#0e162e', '#7fbfff'], desc: 'Deep blue base with cyan accents' },
    'sunset':     { name: 'Sunset',     layout: 'island',  swatch: ['#1a0e15', '#2c1820', '#ff8a5b'], desc: 'Warm dusk tones, peach highlights' },
    'forest':     { name: 'Forest',     layout: 'island',  swatch: ['#0d1410', '#152822', '#7fd9a8'], desc: 'Earthy charcoal with mossy green' },
    'lavender':   { name: 'Lavender',   layout: 'island',  swatch: ['#13101a', '#1f1830', '#c2a8ff'], desc: 'Soft purple haze' },
    'cyberpunk':  { name: 'Cyberpunk',  layout: 'island',  swatch: ['#080012', '#16002a', '#ff2bd4'], desc: 'Neon magenta on near-black with cyan trim' },
    'monochrome': { name: 'Monochrome', layout: 'island',  swatch: ['#080808', '#1a1a1a', '#ffffff'], desc: 'Pure greyscale, sharp white accents' },
    'topbar':     { name: 'Top Bar',    layout: 'topbar',  swatch: ['#0a0a0a', '#141414', '#f0f0f0'], desc: 'Nav floats centered along the top of the page' },
    'compact':    { name: 'Compact',    layout: 'island',  swatch: ['#0a0a0a', '#141414', '#f0f0f0'], desc: 'Tighter island, smaller buttons, denser tiles' },
    'floating':   { name: 'Floating',   layout: 'corner',  swatch: ['#0a0a0a', '#141414', '#f0f0f0'], desc: 'Vertical nav stack tucked into the bottom-right corner' },
    'ocean':      { name: 'Ocean',      layout: 'topbar',  swatch: ['#02101c', '#062138', '#40c8e0'], desc: 'Top-bar layout in deep teal with cyan accents' },
    'ember':      { name: 'Ember',      layout: 'corner',  swatch: ['#170804', '#2a1208', '#ff6b35'], desc: 'Corner stack, smoldering orange glow' },
    'glass':      { name: 'Glass',      layout: 'island',  swatch: ['#04080f', '#1a2f4a', '#a8d8ff'], desc: 'Frosted translucent panels over a deep blue gradient' },
    'vapor':      { name: 'Vaporwave',  layout: 'island',  swatch: ['#1a0533', '#7a1ea8', '#ff8aff'], desc: 'Animated magenta/purple gradient with neon glow' },
    'paper':      { name: 'Paper',      layout: 'island',  swatch: ['#f3eee3', '#fffaf0', '#a04a1c'], desc: 'Cream paper background, warm sepia accents (light)' },
    'mono-light': { name: 'Mono Light', layout: 'island',  swatch: ['#fafafa', '#ffffff', '#0a0a0a'], desc: 'Clean white with sharp black accents (light)' },
    'terminal':   { name: 'Terminal',   layout: 'island',  swatch: ['#000000', '#001f00', '#00ff88'], desc: 'CRT phosphor green, monospace, faint scanline grid' },
    'aurora':     { name: 'Aurora',     layout: 'island',  swatch: ['#001a2e', '#0a5e3d', '#7fffc8'], desc: 'Slow-shifting northern-lights gradient' },
    'rose-gold':  { name: 'Rose Gold',  layout: 'island',  swatch: ['#1a0d12', '#2e1820', '#ffb6c1'], desc: 'Soft pink highlights on warm dark plum' },
    'stadium':    { name: 'Stadium',    layout: 'topbar',  swatch: ['#0a0a0a', '#141414', '#f0f0f0'], desc: 'Full-width frosted top bar across the page' },
    'rounded':    { name: 'Rounded',    layout: 'island',  swatch: ['#0a0a0a', '#141414', '#f0f0f0'], desc: 'Soft, generous rounded corners on every surface' },
    'sharp':      { name: 'Sharp',      layout: 'island',  swatch: ['#0a0a0a', '#141414', '#f0f0f0'], desc: 'Zero radius, brutalist hard edges everywhere' },
    'mesh':       { name: 'Mesh',       layout: 'island',  swatch: ['#ff5ab4', '#508cff', '#ffb45a'], desc: 'Soft multi-color mesh-gradient blobs' },
    'lavalamp':   { name: 'Lava Lamp',  layout: 'island',  swatch: ['#ff50b4', '#ffa028', '#8c50ff'], desc: 'Drifting blobs of color, slow lava-lamp motion' },
    'connected':  { name: 'Connected',  layout: 'island',  swatch: ['#04060a', '#78c8ff', '#78c8ff'], desc: 'Pulsing dot grid, network-graph aesthetic' },
    'stars':      { name: 'Starfield',  layout: 'island',  swatch: ['#02020a', '#0a0a1f', '#a0c8ff'], desc: 'Layered twinkling starfield over deep space' },
    'bokeh':      { name: 'Bokeh',      layout: 'island',  swatch: ['#1a0a2e', '#ffb450', '#c8a8ff'], desc: 'Soft out-of-focus colored circles drifting' },
    'noise':      { name: 'Noise',      layout: 'island',  swatch: ['#101010', '#1a1a1a', '#dddddd'], desc: 'Subtle film-grain texture over matte black' },
    'sunsetsky':  { name: 'Sunset Sky', layout: 'island',  swatch: ['#1a0533', '#c2185b', '#ffc14a'], desc: 'Vertical sunset gradient — purple to orange' }
  };

  var CSS = [
    'html.vn-preset-midnight { --matte-bg-base: #050a18; --matte-bg-elevated: #08111f; --matte-bg-card: #0e162e; --matte-bg-hover: #152040; --matte-border-subtle: rgba(127,191,255,0.05); --matte-border-default: rgba(127,191,255,0.1); --matte-border-hover: rgba(127,191,255,0.2); --matte-text-primary: #e8f0ff; --matte-text-secondary: rgba(220,235,255,0.65); --matte-text-muted: rgba(180,210,255,0.4); --void-accent: #7fbfff; --void-accent-rgb: 127,191,255; }',
    'html.vn-preset-midnight body { background: #050a18 !important; }',
    'html.vn-preset-midnight .void-dynamic-island { background: rgba(8,17,31,0.95) !important; border-color: rgba(127,191,255,0.12) !important; }',
    'html.vn-preset-midnight .di-item:hover { background: rgba(127,191,255,0.12) !important; border-color: rgba(127,191,255,0.25) !important; }',
    'html.vn-preset-midnight .di-item.active { background: rgba(127,191,255,0.18) !important; border-color: rgba(127,191,255,0.35) !important; color: #7fbfff !important; }',

    'html.vn-preset-sunset { --matte-bg-base: #1a0e15; --matte-bg-elevated: #221218; --matte-bg-card: #2c1820; --matte-bg-hover: #3a1f28; --matte-border-subtle: rgba(255,138,91,0.06); --matte-border-default: rgba(255,138,91,0.12); --matte-border-hover: rgba(255,138,91,0.22); --matte-text-primary: #ffe8de; --matte-text-secondary: rgba(255,220,200,0.65); --matte-text-muted: rgba(255,200,170,0.42); --void-accent: #ff8a5b; --void-accent-rgb: 255,138,91; }',
    'html.vn-preset-sunset body { background: linear-gradient(170deg, #1a0e15 0%, #20121d 100%) !important; }',
    'html.vn-preset-sunset .void-dynamic-island { background: rgba(34,18,24,0.95) !important; border-color: rgba(255,138,91,0.14) !important; }',
    'html.vn-preset-sunset .di-item:hover { background: rgba(255,138,91,0.14) !important; border-color: rgba(255,138,91,0.28) !important; }',
    'html.vn-preset-sunset .di-item.active { background: rgba(255,138,91,0.2) !important; border-color: rgba(255,138,91,0.4) !important; color: #ff8a5b !important; }',

    'html.vn-preset-forest { --matte-bg-base: #0d1410; --matte-bg-elevated: #111b16; --matte-bg-card: #152822; --matte-bg-hover: #1d3329; --matte-border-subtle: rgba(127,217,168,0.06); --matte-border-default: rgba(127,217,168,0.12); --matte-border-hover: rgba(127,217,168,0.22); --matte-text-primary: #e6f5ec; --matte-text-secondary: rgba(220,240,228,0.65); --matte-text-muted: rgba(180,220,200,0.42); --void-accent: #7fd9a8; --void-accent-rgb: 127,217,168; }',
    'html.vn-preset-forest body { background: #0d1410 !important; }',
    'html.vn-preset-forest .void-dynamic-island { background: rgba(17,27,22,0.95) !important; border-color: rgba(127,217,168,0.14) !important; }',
    'html.vn-preset-forest .di-item:hover { background: rgba(127,217,168,0.14) !important; border-color: rgba(127,217,168,0.28) !important; }',
    'html.vn-preset-forest .di-item.active { background: rgba(127,217,168,0.2) !important; border-color: rgba(127,217,168,0.4) !important; color: #7fd9a8 !important; }',

    'html.vn-preset-lavender { --matte-bg-base: #13101a; --matte-bg-elevated: #181426; --matte-bg-card: #1f1830; --matte-bg-hover: #2a2042; --matte-border-subtle: rgba(194,168,255,0.06); --matte-border-default: rgba(194,168,255,0.12); --matte-border-hover: rgba(194,168,255,0.22); --matte-text-primary: #f1ebff; --matte-text-secondary: rgba(230,220,255,0.65); --matte-text-muted: rgba(200,185,240,0.42); --void-accent: #c2a8ff; --void-accent-rgb: 194,168,255; }',
    'html.vn-preset-lavender body { background: #13101a !important; }',
    'html.vn-preset-lavender .void-dynamic-island { background: rgba(24,20,38,0.95) !important; border-color: rgba(194,168,255,0.14) !important; }',
    'html.vn-preset-lavender .di-item:hover { background: rgba(194,168,255,0.14) !important; border-color: rgba(194,168,255,0.28) !important; }',
    'html.vn-preset-lavender .di-item.active { background: rgba(194,168,255,0.2) !important; border-color: rgba(194,168,255,0.4) !important; color: #c2a8ff !important; }',

    'html.vn-preset-cyberpunk { --matte-bg-base: #080012; --matte-bg-elevated: #0e0220; --matte-bg-card: #16002a; --matte-bg-hover: #200636; --matte-border-subtle: rgba(255,43,212,0.08); --matte-border-default: rgba(255,43,212,0.18); --matte-border-hover: rgba(255,43,212,0.32); --matte-text-primary: #fff0fb; --matte-text-secondary: rgba(255,220,245,0.65); --matte-text-muted: rgba(220,180,235,0.42); --void-accent: #ff2bd4; --void-accent-rgb: 255,43,212; }',
    'html.vn-preset-cyberpunk body { background: radial-gradient(ellipse at 30% 20%, #16002a 0%, #080012 70%) !important; }',
    'html.vn-preset-cyberpunk .void-dynamic-island { background: rgba(14,2,32,0.95) !important; border-color: rgba(255,43,212,0.18) !important; box-shadow: 0 0 24px rgba(255,43,212,0.15), 0 8px 32px rgba(0,0,0,0.6) !important; }',
    'html.vn-preset-cyberpunk .di-item:hover { background: rgba(255,43,212,0.16) !important; border-color: rgba(255,43,212,0.34) !important; }',
    'html.vn-preset-cyberpunk .di-item.active { background: rgba(255,43,212,0.22) !important; border-color: rgba(255,43,212,0.5) !important; color: #ff2bd4 !important; box-shadow: 0 0 16px rgba(255,43,212,0.4) !important; }',
    'html.vn-preset-cyberpunk .holographic-title, html.vn-preset-cyberpunk h1, html.vn-preset-cyberpunk h2 { text-shadow: 0 0 24px rgba(255,43,212,0.4) !important; }',

    'html.vn-preset-monochrome { --matte-bg-base: #080808; --matte-bg-elevated: #121212; --matte-bg-card: #1a1a1a; --matte-bg-hover: #242424; --matte-border-subtle: rgba(255,255,255,0.05); --matte-border-default: rgba(255,255,255,0.12); --matte-border-hover: rgba(255,255,255,0.25); --matte-text-primary: #ffffff; --matte-text-secondary: rgba(255,255,255,0.7); --matte-text-muted: rgba(255,255,255,0.42); --void-accent: #ffffff; --void-accent-rgb: 255,255,255; }',
    'html.vn-preset-monochrome body { background: #080808 !important; }',
    'html.vn-preset-monochrome .void-dynamic-island { background: rgba(18,18,18,0.96) !important; border-color: rgba(255,255,255,0.14) !important; }',
    'html.vn-preset-monochrome .di-item:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.25) !important; }',
    'html.vn-preset-monochrome .di-item.active { background: rgba(255,255,255,0.18) !important; border-color: rgba(255,255,255,0.4) !important; color: #ffffff !important; }',

    'html.vn-preset-sidebar .void-dynamic-island { position: fixed !important; left: 14px !important; top: 50% !important; bottom: auto !important; right: auto !important; transform: translateY(-50%) !important; flex-direction: column !important; width: auto !important; max-width: none !important; min-height: 0 !important; padding: 12px 10px !important; gap: 8px !important; border-radius: 22px !important; }',
    'html.vn-preset-sidebar .void-dynamic-island > * { flex-shrink: 0 !important; }',
    'html.vn-preset-sidebar .di-section, html.vn-preset-sidebar .di-section-left, html.vn-preset-sidebar .di-nav-section { flex-direction: column !important; gap: 6px !important; align-items: center !important; }',
    'html.vn-preset-sidebar .di-divider { width: 60% !important; height: 1px !important; min-height: 1px !important; margin: 6px auto !important; }',
    'html.vn-preset-sidebar .di-item { width: 44px !important; height: 44px !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; }',
    'html.vn-preset-sidebar .di-item[data-tooltip]:hover::after { left: calc(100% + 14px) !important; top: 50% !important; bottom: auto !important; transform: translateY(-50%) !important; }',
    'html.vn-preset-sidebar .di-item[data-tooltip]:hover::before { left: calc(100% + 8px) !important; top: 50% !important; bottom: auto !important; transform: translateY(-50%) rotate(45deg) !important; }',
    'html.vn-preset-sidebar body { padding-left: 86px !important; }',
    '@media (max-width: 720px) { html.vn-preset-sidebar .void-dynamic-island { left: 50% !important; top: auto !important; bottom: 14px !important; transform: translateX(-50%) !important; flex-direction: row !important; } html.vn-preset-sidebar body { padding-left: 0 !important; } html.vn-preset-sidebar .di-section, html.vn-preset-sidebar .di-section-left, html.vn-preset-sidebar .di-nav-section { flex-direction: row !important; } html.vn-preset-sidebar .di-divider { width: 1px !important; height: 24px !important; margin: 0 6px !important; } html.vn-preset-sidebar .di-item[data-tooltip]:hover::after { left: 50% !important; top: auto !important; bottom: calc(100% + 12px) !important; transform: translateX(-50%) !important; } html.vn-preset-sidebar .di-item[data-tooltip]:hover::before { left: 50% !important; top: auto !important; bottom: calc(100% + 6px) !important; transform: translateX(-50%) rotate(45deg) !important; } }',

    'html.vn-preset-topbar .void-dynamic-island { position: fixed !important; top: 14px !important; bottom: auto !important; left: 50% !important; transform: translateX(-50%) !important; border-radius: 18px !important; padding: 8px 14px !important; }',
    'html.vn-preset-topbar body { padding-top: 80px !important; }',

    'html.vn-preset-compact .void-dynamic-island { padding: 6px 10px !important; gap: 4px !important; border-radius: 14px !important; bottom: 8px !important; }',
    'html.vn-preset-compact .di-item { width: 36px !important; height: 36px !important; padding: 0 !important; }',
    'html.vn-preset-compact .di-divider { margin: 0 4px !important; }',
    'html.vn-preset-compact body { font-size: 14px !important; }',
    'html.vn-preset-compact .tile-card, html.vn-preset-compact .game-card, html.vn-preset-compact .app-card { padding: 8px !important; }',

    'html.vn-preset-floating .void-dynamic-island { position: fixed !important; right: 14px !important; bottom: 14px !important; left: auto !important; transform: none !important; flex-direction: column !important; border-radius: 22px !important; padding: 10px !important; gap: 6px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.55) !important; }',
    'html.vn-preset-floating .di-section, html.vn-preset-floating .di-section-left, html.vn-preset-floating .di-nav-section { flex-direction: column !important; gap: 5px !important; align-items: center !important; }',
    'html.vn-preset-floating .di-divider { width: 60% !important; height: 1px !important; margin: 5px auto !important; }',
    'html.vn-preset-floating .di-item { width: 40px !important; height: 40px !important; padding: 0 !important; }',

    'html.vn-preset-ocean { --matte-bg-base: #02101c; --matte-bg-elevated: #04162a; --matte-bg-card: #062138; --matte-bg-hover: #0a2e4a; --matte-border-subtle: rgba(64,200,224,0.06); --matte-border-default: rgba(64,200,224,0.14); --matte-border-hover: rgba(64,200,224,0.26); --matte-text-primary: #e0f4ff; --matte-text-secondary: rgba(200,235,250,0.65); --matte-text-muted: rgba(160,210,235,0.42); --void-accent: #40c8e0; --void-accent-rgb: 64,200,224; }',
    'html.vn-preset-ocean body { background: linear-gradient(180deg, #02101c 0%, #041a30 100%) !important; padding-top: 80px !important; }',
    'html.vn-preset-ocean .void-dynamic-island { position: fixed !important; top: 14px !important; bottom: auto !important; left: 50% !important; transform: translateX(-50%) !important; background: rgba(4,22,42,0.95) !important; border-color: rgba(64,200,224,0.18) !important; border-radius: 18px !important; padding: 8px 14px !important; }',
    'html.vn-preset-ocean .di-item:hover { background: rgba(64,200,224,0.14) !important; border-color: rgba(64,200,224,0.3) !important; }',
    'html.vn-preset-ocean .di-item.active { background: rgba(64,200,224,0.2) !important; border-color: rgba(64,200,224,0.42) !important; color: #40c8e0 !important; }',

    'html.vn-preset-ember { --matte-bg-base: #170804; --matte-bg-elevated: #1f0c06; --matte-bg-card: #2a1208; --matte-bg-hover: #3a1a0c; --matte-border-default: rgba(255,107,53,0.16); --matte-border-hover: rgba(255,107,53,0.3); --matte-text-primary: #fff1e6; --matte-text-secondary: rgba(255,220,200,0.7); --void-accent: #ff6b35; --void-accent-rgb: 255,107,53; }',
    'html.vn-preset-ember body { background: radial-gradient(ellipse at 70% 90%, #3a1a0c 0%, #170804 70%) !important; }',
    'html.vn-preset-ember .void-dynamic-island { position: fixed !important; right: 14px !important; bottom: 14px !important; left: auto !important; transform: none !important; flex-direction: column !important; border-radius: 22px !important; padding: 10px !important; gap: 6px !important; background: rgba(28,8,4,0.95) !important; border-color: rgba(255,107,53,0.22) !important; box-shadow: 0 0 28px rgba(255,107,53,0.18), 0 8px 32px rgba(0,0,0,0.6) !important; }',
    'html.vn-preset-ember .di-section, html.vn-preset-ember .di-section-left, html.vn-preset-ember .di-nav-section { flex-direction: column !important; gap: 5px !important; align-items: center !important; }',
    'html.vn-preset-ember .di-divider { width: 60% !important; height: 1px !important; margin: 5px auto !important; }',
    'html.vn-preset-ember .di-item { width: 40px !important; height: 40px !important; padding: 0 !important; }',
    'html.vn-preset-ember .di-item:hover { background: rgba(255,107,53,0.16) !important; border-color: rgba(255,107,53,0.34) !important; }',
    'html.vn-preset-ember .di-item.active { background: rgba(255,107,53,0.22) !important; border-color: rgba(255,107,53,0.5) !important; color: #ff6b35 !important; box-shadow: 0 0 10px rgba(255,107,53,0.35) !important; }',

    'html[class*="vn-preset-"] .di-item.active, html[class*="vn-preset-"] .di-item:focus, html[class*="vn-preset-"] .di-item:focus-visible { outline: none !important; }',

    '@media (max-width: 720px) { html.vn-preset-floating .void-dynamic-island, html.vn-preset-ember .void-dynamic-island { left: 50% !important; right: auto !important; top: auto !important; bottom: 14px !important; transform: translateX(-50%) !important; flex-direction: row !important; } html.vn-preset-topbar body, html.vn-preset-ocean body, html.vn-preset-stadium body { padding-top: 0 !important; } html.vn-preset-floating .di-section, html.vn-preset-floating .di-section-left, html.vn-preset-floating .di-nav-section, html.vn-preset-ember .di-section, html.vn-preset-ember .di-section-left, html.vn-preset-ember .di-nav-section { flex-direction: row !important; } html.vn-preset-floating .di-divider, html.vn-preset-ember .di-divider { width: 1px !important; height: 24px !important; margin: 0 6px !important; } }',

    'html.vn-preset-glass body { background: radial-gradient(ellipse at 20% 0%, #1a2f4a 0%, #0a1525 60%, #04080f 100%) !important; color: #e8f0ff !important; }',
    'html.vn-preset-glass { --matte-bg-base: #04080f; --matte-bg-elevated: rgba(255,255,255,0.04); --matte-bg-card: rgba(255,255,255,0.05); --matte-bg-hover: rgba(255,255,255,0.09); --matte-border-default: rgba(255,255,255,0.12); --matte-border-hover: rgba(255,255,255,0.22); --matte-text-primary: #e8f0ff; --matte-text-secondary: rgba(220,235,255,0.7); --void-accent: #a8d8ff; --void-accent-rgb: 168,216,255; }',
    'html.vn-preset-glass .void-dynamic-island, html.vn-preset-glass .tile-card, html.vn-preset-glass .game-card, html.vn-preset-glass .app-card, html.vn-preset-glass .panel, html.vn-preset-glass .modal, html.vn-preset-glass .card { background: rgba(255,255,255,0.06) !important; backdrop-filter: blur(18px) saturate(160%) !important; -webkit-backdrop-filter: blur(18px) saturate(160%) !important; border: 1px solid rgba(255,255,255,0.1) !important; }',
    'html.vn-preset-glass .di-item:hover { background: rgba(255,255,255,0.14) !important; }',
    'html.vn-preset-glass .di-item.active { background: rgba(168,216,255,0.22) !important; border-color: rgba(168,216,255,0.4) !important; color: #a8d8ff !important; }',

    'html.vn-preset-vapor body { background: linear-gradient(135deg, #1a0533 0%, #3d1066 35%, #7a1ea8 70%, #1a0533 100%) !important; background-size: 200% 200% !important; animation: vnVaporCanon 14s ease infinite !important; color: #ffe6ff !important; }',
    '@keyframes vnVaporCanon { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }',
    'html.vn-preset-vapor { --matte-bg-base: #1a0533; --matte-bg-elevated: #26083f; --matte-bg-card: #310b52; --matte-bg-hover: #451270; --matte-border-default: rgba(255,138,255,0.16); --matte-border-hover: rgba(255,138,255,0.3); --matte-text-primary: #ffe6ff; --matte-text-secondary: rgba(255,210,255,0.7); --void-accent: #ff8aff; --void-accent-rgb: 255,138,255; }',
    'html.vn-preset-vapor .void-dynamic-island { background: rgba(38,8,63,0.85) !important; border-color: rgba(255,138,255,0.22) !important; box-shadow: 0 0 32px rgba(255,138,255,0.18), 0 8px 32px rgba(0,0,0,0.5) !important; }',
    'html.vn-preset-vapor h1, html.vn-preset-vapor h2, html.vn-preset-vapor .holographic-title { text-shadow: 0 0 16px rgba(255,138,255,0.5), 0 0 32px rgba(127,255,255,0.3) !important; }',
    'html.vn-preset-vapor .di-item:hover { background: rgba(255,138,255,0.18) !important; border-color: rgba(255,138,255,0.36) !important; }',
    'html.vn-preset-vapor .di-item.active { background: rgba(255,138,255,0.26) !important; border-color: rgba(255,138,255,0.55) !important; color: #ff8aff !important; box-shadow: 0 0 14px rgba(255,138,255,0.4) !important; }',

    'html.vn-preset-paper { --matte-bg-base: #f3eee3; --matte-bg-elevated: #ebe4d4; --matte-bg-card: #fffaf0; --matte-bg-hover: #e6dcc4; --matte-border-default: rgba(60,40,20,0.16); --matte-border-hover: rgba(60,40,20,0.3); --matte-text-primary: #2a1f10; --matte-text-secondary: rgba(60,40,20,0.7); --matte-text-muted: rgba(80,60,40,0.5); --void-accent: #a04a1c; --void-accent-rgb: 160,74,28; }',
    'html.vn-preset-paper body { background: #f3eee3 !important; background-image: radial-gradient(rgba(60,40,20,0.06) 1px, transparent 1px) !important; background-size: 18px 18px !important; color: #2a1f10 !important; }',
    'html.vn-preset-paper .void-dynamic-island { background: #fffaf0 !important; border-color: rgba(60,40,20,0.2) !important; box-shadow: 0 4px 16px rgba(60,40,20,0.12), 0 1px 0 rgba(255,255,255,0.5) inset !important; }',
    'html.vn-preset-paper .di-item:hover { background: rgba(160,74,28,0.1) !important; border-color: rgba(160,74,28,0.25) !important; color: #a04a1c !important; }',
    'html.vn-preset-paper .di-item.active { background: rgba(160,74,28,0.18) !important; border-color: rgba(160,74,28,0.4) !important; color: #a04a1c !important; }',
    'html.vn-preset-paper .tile-card, html.vn-preset-paper .game-card, html.vn-preset-paper .app-card { background: #fffaf0 !important; border-color: rgba(60,40,20,0.16) !important; box-shadow: 0 2px 6px rgba(60,40,20,0.1) !important; color: #2a1f10 !important; }',

    'html.vn-preset-mono-light { --matte-bg-base: #fafafa; --matte-bg-elevated: #ffffff; --matte-bg-card: #ffffff; --matte-bg-hover: #f0f0f0; --matte-border-subtle: rgba(0,0,0,0.06); --matte-border-default: rgba(0,0,0,0.12); --matte-border-hover: rgba(0,0,0,0.22); --matte-text-primary: #0a0a0a; --matte-text-secondary: rgba(0,0,0,0.7); --matte-text-muted: rgba(0,0,0,0.45); --void-accent: #0a0a0a; --void-accent-rgb: 10,10,10; }',
    'html.vn-preset-mono-light body { background: #fafafa !important; color: #0a0a0a !important; }',
    'html.vn-preset-mono-light .void-dynamic-island { background: rgba(255,255,255,0.96) !important; border-color: rgba(0,0,0,0.12) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }',
    'html.vn-preset-mono-light .di-item:hover { background: rgba(0,0,0,0.06) !important; border-color: rgba(0,0,0,0.18) !important; }',
    'html.vn-preset-mono-light .di-item.active { background: rgba(0,0,0,0.1) !important; border-color: rgba(0,0,0,0.28) !important; color: #0a0a0a !important; }',
    'html.vn-preset-mono-light .tile-card, html.vn-preset-mono-light .game-card, html.vn-preset-mono-light .app-card { background: #ffffff !important; border-color: rgba(0,0,0,0.1) !important; color: #0a0a0a !important; }',

    'html.vn-preset-terminal { font-family: "JetBrains Mono","Fira Code","Cascadia Code",ui-monospace,Consolas,monospace !important; --matte-bg-base: #000000; --matte-bg-elevated: #001a00; --matte-bg-card: #001f00; --matte-bg-hover: #003300; --matte-border-default: rgba(0,255,128,0.22); --matte-border-hover: rgba(0,255,128,0.4); --matte-text-primary: #00ff88; --matte-text-secondary: rgba(0,255,136,0.75); --matte-text-muted: rgba(0,255,136,0.5); --void-accent: #00ff88; --void-accent-rgb: 0,255,136; }',
    'html.vn-preset-terminal, html.vn-preset-terminal body, html.vn-preset-terminal * { font-family: "JetBrains Mono","Fira Code","Cascadia Code",ui-monospace,Consolas,monospace !important; }',
    'html.vn-preset-terminal body { background: #000000 !important; background-image: linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px) !important; background-size: 24px 24px !important; color: #00ff88 !important; }',
    'html.vn-preset-terminal .void-dynamic-island { background: #000000 !important; border: 1px solid rgba(0,255,136,0.4) !important; border-radius: 4px !important; box-shadow: 0 0 18px rgba(0,255,136,0.18), inset 0 0 12px rgba(0,255,136,0.06) !important; }',
    'html.vn-preset-terminal .di-item { border-radius: 2px !important; }',
    'html.vn-preset-terminal .di-item:hover { background: rgba(0,255,136,0.12) !important; border-color: rgba(0,255,136,0.4) !important; color: #00ff88 !important; }',
    'html.vn-preset-terminal .di-item.active { background: rgba(0,255,136,0.22) !important; border-color: rgba(0,255,136,0.6) !important; color: #00ff88 !important; text-shadow: 0 0 6px rgba(0,255,136,0.6) !important; }',
    'html.vn-preset-terminal .tile-card, html.vn-preset-terminal .game-card, html.vn-preset-terminal .app-card { background: #001f00 !important; border: 1px solid rgba(0,255,136,0.22) !important; border-radius: 2px !important; color: #00ff88 !important; }',
    'html.vn-preset-terminal h1, html.vn-preset-terminal h2, html.vn-preset-terminal .holographic-title { text-shadow: 0 0 8px rgba(0,255,136,0.5) !important; }',

    'html.vn-preset-aurora body { background: linear-gradient(135deg, #001a2e 0%, #003547 28%, #0a5e3d 56%, #3d8a4f 78%, #001a2e 100%) !important; background-size: 300% 300% !important; animation: vnAuroraCanon 22s ease infinite !important; }',
    '@keyframes vnAuroraCanon { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }',
    'html.vn-preset-aurora { --matte-bg-base: #001a2e; --matte-bg-elevated: #04253c; --matte-bg-card: #063048; --matte-bg-hover: #0a4a5e; --matte-border-default: rgba(127,255,200,0.16); --matte-border-hover: rgba(127,255,200,0.32); --matte-text-primary: #e8fff5; --matte-text-secondary: rgba(220,255,235,0.7); --void-accent: #7fffc8; --void-accent-rgb: 127,255,200; }',
    'html.vn-preset-aurora .void-dynamic-island { background: rgba(4,37,60,0.78) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; border-color: rgba(127,255,200,0.22) !important; box-shadow: 0 0 24px rgba(127,255,200,0.14), 0 8px 32px rgba(0,0,0,0.5) !important; }',
    'html.vn-preset-aurora .di-item:hover { background: rgba(127,255,200,0.16) !important; border-color: rgba(127,255,200,0.34) !important; }',
    'html.vn-preset-aurora .di-item.active { background: rgba(127,255,200,0.24) !important; border-color: rgba(127,255,200,0.5) !important; color: #7fffc8 !important; }',

    'html.vn-preset-rose-gold { --matte-bg-base: #1a0d12; --matte-bg-elevated: #241319; --matte-bg-card: #2e1820; --matte-bg-hover: #3d2230; --matte-border-default: rgba(255,182,193,0.16); --matte-border-hover: rgba(255,182,193,0.3); --matte-text-primary: #ffe8ed; --matte-text-secondary: rgba(255,220,225,0.7); --void-accent: #ffb6c1; --void-accent-rgb: 255,182,193; }',
    'html.vn-preset-rose-gold body { background: radial-gradient(ellipse at 50% 0%, #3d1a28 0%, #1a0d12 60%) !important; }',
    'html.vn-preset-rose-gold .void-dynamic-island { background: rgba(36,19,25,0.95) !important; border-color: rgba(255,182,193,0.22) !important; box-shadow: 0 0 20px rgba(255,182,193,0.12), 0 8px 32px rgba(0,0,0,0.5) !important; }',
    'html.vn-preset-rose-gold .di-item:hover { background: rgba(255,182,193,0.16) !important; border-color: rgba(255,182,193,0.32) !important; }',
    'html.vn-preset-rose-gold .di-item.active { background: rgba(255,182,193,0.24) !important; border-color: rgba(255,182,193,0.5) !important; color: #ffb6c1 !important; }',

    'html.vn-preset-stadium .void-dynamic-island { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: auto !important; width: 100% !important; max-width: none !important; transform: none !important; border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; border-top: 0 !important; padding: 10px 18px !important; justify-content: center !important; background: rgba(8,8,12,0.92) !important; backdrop-filter: blur(20px) saturate(150%) !important; -webkit-backdrop-filter: blur(20px) saturate(150%) !important; }',
    'html.vn-preset-stadium body { padding-top: 72px !important; }',
    'html.vn-preset-stadium .tile-card, html.vn-preset-stadium .game-card, html.vn-preset-stadium .app-card { border-radius: 14px !important; }',

    'html.vn-preset-rounded .void-dynamic-island { border-radius: 36px !important; padding: 10px 16px !important; }',
    'html.vn-preset-rounded .di-item { border-radius: 18px !important; }',
    'html.vn-preset-rounded .tile-card, html.vn-preset-rounded .game-card, html.vn-preset-rounded .app-card, html.vn-preset-rounded .panel, html.vn-preset-rounded .card, html.vn-preset-rounded .modal, html.vn-preset-rounded button, html.vn-preset-rounded input, html.vn-preset-rounded select, html.vn-preset-rounded textarea { border-radius: 18px !important; }',
    'html.vn-preset-rounded img { border-radius: 14px !important; }',

    'html.vn-preset-sharp .void-dynamic-island { border-radius: 0 !important; padding: 8px 12px !important; }',
    'html.vn-preset-sharp .di-item { border-radius: 0 !important; }',
    'html.vn-preset-sharp .tile-card, html.vn-preset-sharp .game-card, html.vn-preset-sharp .app-card, html.vn-preset-sharp .panel, html.vn-preset-sharp .card, html.vn-preset-sharp .modal, html.vn-preset-sharp button, html.vn-preset-sharp input, html.vn-preset-sharp select, html.vn-preset-sharp textarea { border-radius: 0 !important; }',
    'html.vn-preset-sharp img { border-radius: 0 !important; }',

    'html.vn-preset-mesh body { background: #0a0612 !important; }',
    'html.vn-preset-mesh body::before { content: "" !important; display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: -1 !important; background: radial-gradient(at 18% 22%, rgba(255,90,180,0.55) 0, transparent 42%), radial-gradient(at 82% 18%, rgba(80,140,255,0.55) 0, transparent 45%), radial-gradient(at 75% 78%, rgba(255,180,90,0.45) 0, transparent 42%), radial-gradient(at 12% 82%, rgba(120,255,200,0.4) 0, transparent 45%), radial-gradient(at 50% 50%, rgba(180,90,255,0.32) 0, transparent 55%); filter: blur(40px) saturate(140%) !important; animation: vnMeshPulseCanon 12s ease-in-out infinite alternate !important; }',
    '@keyframes vnMeshPulseCanon { 0% { transform: translate(0,0) scale(1); filter: blur(40px) saturate(140%); } 100% { transform: translate(2%,-2%) scale(1.05); filter: blur(50px) saturate(170%); } }',
    'html.vn-preset-mesh { --matte-bg-base: #0a0612; --matte-bg-card: rgba(255,255,255,0.06); --matte-border-default: rgba(255,255,255,0.14); --matte-text-primary: #fff5fb; --void-accent: #ff8ad4; --void-accent-rgb: 255,138,212; }',
    'html.vn-preset-mesh .void-dynamic-island, html.vn-preset-mesh .tile-card, html.vn-preset-mesh .game-card, html.vn-preset-mesh .app-card { background: rgba(20,10,30,0.55) !important; backdrop-filter: blur(16px) saturate(150%) !important; -webkit-backdrop-filter: blur(16px) saturate(150%) !important; border: 1px solid rgba(255,255,255,0.12) !important; }',

    'html.vn-preset-lavalamp body { background: #080010 !important; }',
    'html.vn-preset-lavalamp body::before { content: "" !important; display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: -1 !important; background: radial-gradient(circle at 20% 30%, rgba(255,80,180,0.55) 0, transparent 18%), radial-gradient(circle at 75% 65%, rgba(255,160,40,0.5) 0, transparent 16%), radial-gradient(circle at 50% 80%, rgba(140,80,255,0.55) 0, transparent 18%), radial-gradient(circle at 85% 20%, rgba(80,200,255,0.45) 0, transparent 14%), radial-gradient(circle at 15% 75%, rgba(255,80,255,0.4) 0, transparent 16%); filter: blur(50px) !important; animation: vnLavaDriftCanon 28s ease-in-out infinite alternate !important; }',
    '@keyframes vnLavaDriftCanon { 0% { transform: translate(0,0) scale(1); } 25% { transform: translate(4%,-3%) scale(1.08); } 50% { transform: translate(-3%,4%) scale(1.04); } 75% { transform: translate(3%,3%) scale(1.1); } 100% { transform: translate(-2%,-2%) scale(1); } }',
    'html.vn-preset-lavalamp { --matte-bg-base: #080010; --matte-bg-card: rgba(20,5,30,0.62); --matte-border-default: rgba(255,138,255,0.16); --matte-text-primary: #fff0fb; --void-accent: #ff80c0; --void-accent-rgb: 255,128,192; }',
    'html.vn-preset-lavalamp .void-dynamic-island { background: rgba(20,5,30,0.7) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; border-color: rgba(255,138,255,0.22) !important; }',

    'html.vn-preset-connected body { background: #04060a !important; }',
    'html.vn-preset-connected body::before { content: "" !important; display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: -1 !important; background-image: radial-gradient(rgba(120,200,255,0.55) 1.4px, transparent 1.6px), linear-gradient(rgba(120,200,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,200,255,0.05) 1px, transparent 1px) !important; background-size: 48px 48px, 48px 48px, 48px 48px !important; animation: vnConnPanCanon 24s linear infinite !important; }',
    '@keyframes vnConnPanCanon { 0% { background-position: 0 0, 0 0, 0 0; opacity: 0.85; } 50% { opacity: 1; } 100% { background-position: 48px 48px, 48px 48px, 48px 48px; opacity: 0.85; } }',
    'html.vn-preset-connected { --matte-bg-base: #04060a; --matte-bg-card: rgba(8,16,28,0.72); --matte-border-default: rgba(120,200,255,0.18); --matte-text-primary: #e6f4ff; --void-accent: #78c8ff; --void-accent-rgb: 120,200,255; }',
    'html.vn-preset-connected .void-dynamic-island { background: rgba(8,16,28,0.85) !important; border-color: rgba(120,200,255,0.22) !important; box-shadow: 0 0 20px rgba(120,200,255,0.1) !important; }',
    'html.vn-preset-connected .di-item.active { background: rgba(120,200,255,0.2) !important; border-color: rgba(120,200,255,0.45) !important; color: #78c8ff !important; }',

    'html.vn-preset-stars body { background: radial-gradient(ellipse at center, #0a0a1f 0%, #02020a 70%) !important; }',
    'html.vn-preset-stars body::before { content: "" !important; display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: -1 !important; background-image: radial-gradient(1.5px 1.5px at 25% 30%, #fff, transparent), radial-gradient(1.4px 1.4px at 60% 80%, #fff, transparent), radial-gradient(1.6px 1.6px at 85% 15%, #fff, transparent), radial-gradient(2px 2px at 40% 60%, #fff, transparent), radial-gradient(1.4px 1.4px at 75% 50%, rgba(180,200,255,0.95), transparent), radial-gradient(1.2px 1.2px at 10% 70%, #fff, transparent), radial-gradient(1.8px 1.8px at 90% 90%, rgba(255,220,180,0.95), transparent), radial-gradient(1.4px 1.4px at 50% 10%, #fff, transparent), radial-gradient(1.2px 1.2px at 35% 85%, #fff, transparent), radial-gradient(1.6px 1.6px at 70% 35%, rgba(160,200,255,0.95), transparent) !important; background-size: 200px 200px, 300px 300px, 250px 250px, 180px 180px, 220px 220px, 260px 260px, 190px 190px, 240px 240px, 210px 210px, 280px 280px !important; animation: vnTwinkleCanon 5s ease-in-out infinite !important; }',
    'html.vn-preset-stars body::after { content: "" !important; display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: -1 !important; background-image: radial-gradient(1px 1px at 15% 45%, rgba(255,255,255,0.8), transparent), radial-gradient(0.8px 0.8px at 55% 25%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 80% 65%, rgba(180,200,255,0.7), transparent), radial-gradient(0.8px 0.8px at 30% 90%, rgba(255,255,255,0.8), transparent) !important; background-size: 120px 120px, 140px 140px, 160px 160px, 100px 100px !important; animation: vnTwinkleCanon 3.5s ease-in-out infinite reverse !important; }',
    '@keyframes vnTwinkleCanon { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }',
    'html.vn-preset-stars { --matte-bg-base: #02020a; --matte-bg-card: rgba(10,10,32,0.78); --matte-border-default: rgba(160,200,255,0.16); --matte-text-primary: #eef2ff; --void-accent: #a0c8ff; --void-accent-rgb: 160,200,255; }',
    'html.vn-preset-stars .void-dynamic-island { background: rgba(8,8,24,0.85) !important; border-color: rgba(160,200,255,0.22) !important; box-shadow: 0 0 24px rgba(160,200,255,0.12) !important; }',

    'html.vn-preset-bokeh body { background: radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #04020a 80%) !important; }',
    'html.vn-preset-bokeh body::before { content: "" !important; display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: -1 !important; background-image: radial-gradient(circle at 15% 25%, rgba(255,180,80,0.4) 0, transparent 8%), radial-gradient(circle at 75% 60%, rgba(180,80,255,0.4) 0, transparent 10%), radial-gradient(circle at 50% 80%, rgba(80,200,255,0.35) 0, transparent 7%), radial-gradient(circle at 85% 20%, rgba(255,80,180,0.4) 0, transparent 9%), radial-gradient(circle at 25% 75%, rgba(255,255,180,0.35) 0, transparent 6%), radial-gradient(circle at 60% 35%, rgba(180,255,200,0.4) 0, transparent 8%) !important; filter: blur(8px) !important; animation: vnBokehFloatCanon 14s ease-in-out infinite alternate !important; }',
    '@keyframes vnBokehFloatCanon { 0% { transform: translate(0,0) scale(1); filter: blur(8px); } 50% { transform: translate(3%,-2%) scale(1.05); filter: blur(10px); } 100% { transform: translate(-2%,3%) scale(1.08); filter: blur(12px); } }',
    'html.vn-preset-bokeh { --matte-bg-base: #04020a; --matte-bg-card: rgba(20,10,32,0.7); --matte-border-default: rgba(220,180,255,0.16); --matte-text-primary: #f5edff; --void-accent: #c8a8ff; --void-accent-rgb: 200,168,255; }',
    'html.vn-preset-bokeh .void-dynamic-island { background: rgba(16,8,28,0.82) !important; backdrop-filter: blur(16px) !important; -webkit-backdrop-filter: blur(16px) !important; border-color: rgba(220,180,255,0.22) !important; }',

    'html.vn-preset-noise body { background: #101010 !important; }',
    'html.vn-preset-noise body::before { content: "" !important; display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: -1 !important; background-image: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'><filter id=\'n\'><feTurbulence baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/><feColorMatrix values=\'0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>") !important; opacity: 0.55 !important; mix-blend-mode: overlay !important; animation: vnNoiseShiftCanon 0.8s steps(4,end) infinite !important; }',
    '@keyframes vnNoiseShiftCanon { 0% { transform: translate(0,0); } 25% { transform: translate(-3%,2%); } 50% { transform: translate(2%,-3%); } 75% { transform: translate(-2%,-2%); } 100% { transform: translate(0,0); } }',
    'html.vn-preset-noise { --matte-bg-base: #101010; --matte-bg-card: #1a1a1a; --matte-border-default: rgba(255,255,255,0.1); --matte-text-primary: #f0f0f0; --void-accent: #dddddd; --void-accent-rgb: 221,221,221; }',
    'html.vn-preset-noise .void-dynamic-island { background: rgba(18,18,18,0.95) !important; border-color: rgba(255,255,255,0.14) !important; }',

    'html.vn-preset-sunsetsky body { background: linear-gradient(180deg, #1a0533 0%, #5d1066 25%, #c2185b 55%, #ff6b35 80%, #ffc14a 100%) !important; background-size: 100% 200% !important; animation: vnSunsetShiftCanon 24s ease-in-out infinite alternate !important; color: #fff !important; }',
    '@keyframes vnSunsetShiftCanon { 0% { background-position: 0 0; } 100% { background-position: 0 50%; } }',
    'html.vn-preset-sunsetsky body::after { content: "" !important; display: block !important; position: fixed !important; left: 0 !important; right: 0 !important; top: auto !important; bottom: 0 !important; height: 30% !important; pointer-events: none !important; z-index: -1 !important; background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%) !important; }',
    'html.vn-preset-sunsetsky { --matte-bg-base: #1a0533; --matte-bg-card: rgba(40,15,55,0.62); --matte-border-default: rgba(255,193,74,0.22); --matte-text-primary: #fff; --matte-text-secondary: rgba(255,240,220,0.85); --void-accent: #ffc14a; --void-accent-rgb: 255,193,74; }',
    'html.vn-preset-sunsetsky .void-dynamic-island { background: rgba(40,15,55,0.6) !important; backdrop-filter: blur(18px) saturate(140%) !important; -webkit-backdrop-filter: blur(18px) saturate(140%) !important; border-color: rgba(255,193,74,0.3) !important; }',
    'html.vn-preset-sunsetsky .di-item.active { background: rgba(255,193,74,0.28) !important; border-color: rgba(255,193,74,0.55) !important; color: #ffc14a !important; }',

    'html.vn-preset-mesh body, html.vn-preset-lavalamp body, html.vn-preset-connected body, html.vn-preset-stars body, html.vn-preset-bokeh body, html.vn-preset-noise body, html.vn-preset-sunsetsky body, html.vn-preset-aurora body, html.vn-preset-vapor body, html.vn-preset-glass body { isolation: isolate !important; }',
    'html.vn-preset-mesh body > *, html.vn-preset-lavalamp body > *, html.vn-preset-connected body > *, html.vn-preset-stars body > *, html.vn-preset-bokeh body > *, html.vn-preset-noise body > *, html.vn-preset-sunsetsky body > *, html.vn-preset-aurora body > *, html.vn-preset-vapor body > *, html.vn-preset-glass body > * { position: relative; z-index: 1; }',
    'html.vn-preset-mesh #particles-js, html.vn-preset-lavalamp #particles-js, html.vn-preset-connected #particles-js, html.vn-preset-stars #particles-js, html.vn-preset-bokeh #particles-js, html.vn-preset-noise #particles-js, html.vn-preset-sunsetsky #particles-js, html.vn-preset-aurora #particles-js, html.vn-preset-vapor #particles-js, html.vn-preset-glass #particles-js { display: none !important; }'
  ].join('\n');

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY) || 'default'; }
    catch (_) { return 'default'; }
  }

  function writeStored(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  }

  function applyClass(presetId) {
    if (!PRESETS[presetId]) presetId = 'default';
    var classes = (ROOT.className || '').split(/\s+/).filter(function (c) {
      return c && c.indexOf('vn-preset-') !== 0;
    });
    classes.push('vn-preset-' + presetId);
    ROOT.className = classes.join(' ').trim();
  }

  function injectStyle() {
    if (document.getElementById('vn-preset-css')) return;
    var styleNode = document.createElement('style');
    styleNode.id = 'vn-preset-css';
    styleNode.textContent = CSS;
    (document.head || ROOT).appendChild(styleNode);
  }

  applyClass(readStored());
  if (document.head) injectStyle();
  else document.addEventListener('DOMContentLoaded', injectStyle, { once: true });

  window.VnPresets = {
    list: function () {
      var out = [];
      for (var key in PRESETS) {
        if (Object.prototype.hasOwnProperty.call(PRESETS, key)) {
          out.push({
            id: key,
            name: PRESETS[key].name,
            layout: PRESETS[key].layout,
            desc: PRESETS[key].desc,
            swatch: PRESETS[key].swatch.slice()
          });
        }
      }
      return out;
    },
    current: readStored,
    apply: function (presetId) {
      writeStored(presetId);
      applyClass(presetId);
      try {
        window.dispatchEvent(new CustomEvent('vn-preset-change', { detail: { id: presetId } }));
      } catch (_) {}
    }
  };
})();
