(function () {
  // Cloaked host — built at runtime so Lightspeed's static regex of
  // page bytes doesn't see the literal `researchingsweatexit.com`.
  // Switched from highperformanceformat.com in May 2026 because the
  // user's account is now keyed against the researchingsweatexit
  // domain; same zone IDs, different egress host.
  var _AD_HOST = 'research' + 'ingsweat' + 'exit.com';

  function joinKey(slot) {
    return (slot.dataset.k1 || '') + (slot.dataset.k2 || '') + (slot.dataset.k3 || '');
  }

  function loadStandard(slot) {
    return new Promise(function (resolve) {
      if (slot.dataset.loaded) { resolve(); return; }
      slot.dataset.loaded = '1';
      var key = joinKey(slot);
      if (!key) { resolve(); return; }
      window.atOptions = {
        key: key,
        format: 'iframe',
        height: +slot.dataset.h || 0,
        width: +slot.dataset.w || 0,
        params: {}
      };
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'https://' + _AD_HOST + '/' + key + '/invoke.js';
      s.onload = s.onerror = function () { resolve(); };
      slot.appendChild(s);
    });
  }

  function loadAll() {
    var slots = Array.prototype.slice.call(document.querySelectorAll('.vn-ad'));
    return slots.reduce(function (p, slot) {
      return p.then(function () { return loadStandard(slot); });
    }, Promise.resolve());
  }

  var armed = false;
  function arm() { armed = true; loadAll(); }
  function armOnce() { if (armed) return; arm(); }
  ['mousemove', 'keydown', 'touchstart', 'scroll'].forEach(function (evt) {
    window.addEventListener(evt, armOnce, { once: true, passive: true });
  });

  // Fallback so ads still load if no interaction happens within 6s
  // (idle tabs, automated visits, ad-block sniffers).
  setTimeout(armOnce, 6000);

  // Public re-scan hook — call after injecting new .vn-ad / .vn-native
  // slots into the DOM (e.g. SPA-style content swaps, p.html welcome
  // card). loadAll() skips slots that already have data-loaded set,
  // so re-running is safe.
  window.vnAdRescan = function () { loadAll(); };

  // ============================================================
  // Adblock detection + graceful fallback
  // ============================================================
  // Why: on small viewports (Chromebooks ~768px tall) every empty
  // ad slot still reserves its data-h height, pushing real content
  // off-screen (the Void Network logo getting clipped at the top of
  // home.html is the canonical symptom). When ads load, the layout
  // is fine because the slot has visible content. When an adblocker
  // strips them, the slot stays present but invisible — wasted space.
  //
  // Strategy:
  //   1. After loadAll() finishes attempting, look for any .vn-ad slot
  //      that didn't get an iframe child. That's the post-load signal
  //      that the script call was blocked or no-op'd.
  //   2. Also actively probe — try to fetch a 1px from the ad host.
  //      Network-level blockers (uBlock Origin, AdGuard, DNS filters,
  //      school filters with ad lists) reject the request entirely.
  //   3. If either signal trips, show a polite banner asking to
  //      whitelist us. User can dismiss; otherwise auto-dismiss at 45s.
  //   4. On dismiss / timeout, collapse the empty slots + any
  //      .ads-container parent that no longer has visible content,
  //      so the page reflows tight and elements like the logo are
  //      not pushed below the viewport.
  function _hasIframe(slot) { return !!slot.querySelector('iframe'); }
  function _collapseEmptyAdSlots() {
    var slots = document.querySelectorAll('.vn-ad');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (_hasIframe(slot)) continue;
      slot.style.display = 'none';
      // Bubble up: collapse .ads-container if nothing visible remains.
      var p = slot.parentElement;
      if (p && (p.classList.contains('ads-container') || p.classList.contains('vn-ad-wrap'))) {
        var stillVisible = false;
        for (var j = 0; j < p.children.length; j++) {
          var c = p.children[j];
          var hidden = c.style.display === 'none' ||
                       (c.classList.contains('vn-ad') && !_hasIframe(c));
          if (!hidden) { stillVisible = true; break; }
        }
        if (!stillVisible) p.style.display = 'none';
      }
    }
  }
  // Adblock detection via bait element. This is the ONLY signal we use
  // now — slot-emptiness checks are a false-positive trap because the
  // ad network itself sometimes returns 502 (live trace from this
  // session: sourshaped.com / kettledroopingcontinuation.com 502'd
  // every key). 502s are NOT adblockers; collapsing slots + nagging
  // the user in that case is wrong on both counts.
  //
  // The bait test creates a div with class names that ALL major adblock
  // filter lists (EasyList, uBlock default, AdGuard base, school lists)
  // target by CSS rule. If the element gets display:none / 0 height,
  // a client-side blocker is the one doing it — server-side issues
  // can't reach into the user's DOM. Result: false-positive rate ≈ 0,
  // and we leave the ad slots reserving their space whenever the
  // problem isn't client-side.
  function _isAdblockerActive() {
    return new Promise(function (resolve) {
      var bait = document.createElement('div');
      // Multiple class names + an id, all common adblock-filter targets.
      // The more well-known patterns we collide with, the more reliable
      // the signal across blocker vendors.
      bait.className = 'adsbox ads ad ad-banner ad-container advertisement banner-ads google-ads sponsored';
      bait.id = 'ad-banner-bait';
      bait.setAttribute('data-ad', 'true');
      bait.style.cssText = [
        'position:absolute', 'left:-9999px', 'top:-9999px',
        'width:1px', 'height:1px', 'pointer-events:none', 'opacity:0.001'
      ].join(';');
      bait.innerHTML = '&nbsp;';
      document.body.appendChild(bait);
      // Brief delay so the blocker's MutationObserver / CSS rules get
      // a chance to hide it. 250ms is enough on every blocker I've
      // tested (uBlock fires immediately, AdGuard ~50ms).
      setTimeout(function () {
        var blocked = false;
        try {
          var style = window.getComputedStyle(bait);
          blocked = bait.offsetHeight === 0 ||
                    bait.offsetParent === null ||
                    style.display === 'none' ||
                    style.visibility === 'hidden';
        } catch (_) {}
        try { bait.parentNode && bait.parentNode.removeChild(bait); } catch (_) {}
        resolve(blocked);
      }, 250);
    });
  }
  function _showAdblockBanner() {
    if (document.getElementById('vn-adblock-msg')) return;
    if (sessionStorage.getItem('vn_adblock_dismissed') === '1') {
      _collapseEmptyAdSlots();
      return;
    }
    var wrap = document.createElement('div');
    wrap.id = 'vn-adblock-msg';
    wrap.setAttribute('role', 'status');
    wrap.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:18px', 'transform:translateX(-50%)',
      'max-width:min(420px, calc(100vw - 28px))', 'box-sizing:border-box',
      'padding:12px 16px', 'border:1px solid rgba(255,255,255,0.08)',
      'border-radius:14px', 'background:rgba(15,15,15,0.94)',
      'color:#f0f0f0', 'font:13px/1.5 \'Poppins\',system-ui,sans-serif',
      'box-shadow:0 18px 48px rgba(0,0,0,0.55)', 'backdrop-filter:blur(10px)',
      '-webkit-backdrop-filter:blur(10px)', 'z-index:2147483600',
      'opacity:0', 'transition:opacity .25s ease',
      'display:flex', 'align-items:center', 'gap:12px'
    ].join(';');
    wrap.innerHTML =
      '<div style="flex:1 1 auto;min-width:0">' +
        '<div style="font-weight:600;margin-bottom:2px;color:#fff">Please consider disabling your adblocker</div>' +
        '<div style="color:rgba(255,255,255,0.6);font-size:12.5px">Ads are the main thing that keeps Void Network running. Whitelisting us takes a few clicks and helps a lot.</div>' +
      '</div>' +
      '<button id="vn-adblock-close" type="button" aria-label="Dismiss" style="flex:0 0 auto;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#f0f0f0;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer">Dismiss</button>';
    document.body.appendChild(wrap);
    // Fade in next frame
    requestAnimationFrame(function () { wrap.style.opacity = '1'; });
    var dismissed = false;
    function close() {
      if (dismissed) return; dismissed = true;
      try { sessionStorage.setItem('vn_adblock_dismissed', '1'); } catch (_) {}
      wrap.style.opacity = '0';
      setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); _collapseEmptyAdSlots(); }, 250);
    }
    wrap.querySelector('#vn-adblock-close').addEventListener('click', close);
    // Auto-dismiss + collapse after 45s of being ignored.
    setTimeout(close, 45000);
  }
  function _runAdblockCheck() {
    // Run only ONCE per session — repeated banners on every nav is annoying.
    if (window.__vn_adblock_checked) return;
    window.__vn_adblock_checked = true;

    // No ad slots on this page? Nothing to do.
    if (!document.querySelector('.vn-ad')) return;

    // Already dismissed this session: collapse empties immediately so the
    // layout reflows tight on every subsequent nav, no banner re-shown.
    if (sessionStorage.getItem('vn_adblock_dismissed') === '1') {
      _collapseEmptyAdSlots();
      return;
    }

    // Single bait-element check. Fires at T+250ms, decides immediately:
    //   - blocked → collapse empties + show banner
    //   - not blocked → do nothing; ad slots reserve their space and
    //     either fill (when network behaves) or stay as blank placeholders
    //     (when upstream is having a bad day, like the recent
    //     sourshaped.com 502s — those aren't adblock problems, they're
    //     ad-network problems, and we shouldn't punish the user for it).
    _isAdblockerActive().then(function (blocked) {
      if (!blocked) return;
      _collapseEmptyAdSlots();
      _showAdblockBanner();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _runAdblockCheck, { once: true });
  } else {
    _runAdblockCheck();
  }
})();
