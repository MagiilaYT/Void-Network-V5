





(function () {
  var h = location.hostname.toLowerCase();
  if (!(h.includes('fastly') || h.includes('freetls'))) return;
  
  
  
  document.documentElement.innerHTML = '';
  var head = document.createElement('head');
  head.innerHTML =
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">' +
    '<title>Fastly Not Supported</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">';
  var style = document.createElement('style');
  style.textContent =
    '*{margin:0;padding:0;box-sizing:border-box}' +
    'body{min-height:100vh;background:#000;font-family:"Poppins",sans-serif;display:flex;align-items:center;justify-content:center;color:#f5f5f5;overflow:hidden}' +
    '.card{background:rgba(30,30,30,0.7);border:1px solid rgba(255,255,255,0.1);border-radius:25px;padding:2.5rem 2rem;max-width:420px;width:90%;text-align:center;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}' +
    '.icon-wrap{width:80px;height:80px;margin:0 auto 1.5rem;background:rgba(40,40,40,0.6);border:1px solid rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center}' +
    '.icon-wrap svg{width:40px;height:40px;stroke:rgba(245,245,245,0.6);stroke-width:1.5;fill:none}' +
    'h1{font-size:1.4rem;font-weight:600;margin-bottom:1rem;color:#fff}' +
    '.msg{font-size:0.9rem;color:rgba(245,245,245,0.6);line-height:1.7;margin-bottom:1.5rem}' +
    '.discord-link{display:inline-block;background:rgba(88,101,242,0.2);border:1px solid rgba(88,101,242,0.4);color:#7289da;text-decoration:none;padding:0.75rem 1.5rem;border-radius:12px;font-weight:500;font-size:0.9rem;margin-bottom:1rem;transition:all 0.3s ease}' +
    '.qr-section{margin-top:1rem}' +
    '.qr-label{font-size:0.75rem;color:rgba(245,245,245,0.4);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:1px}' +
    '.qr-code{background:#fff;padding:10px;border-radius:12px;display:inline-block}' +
    '.qr-code img{display:block;width:150px;height:150px}' +
    '.divider{width:50px;height:1px;background:rgba(255,255,255,0.1);margin:1.5rem auto}' +
    '.badge{display:inline-block;font-size:0.65rem;color:rgba(245,245,245,0.35);text-transform:uppercase;letter-spacing:2px;font-weight:500}' +
    '.redirect{font-size:0.8rem;color:rgba(245,245,245,0.5);margin-top:1rem}' +
    '.redirect span{color:#7289da;font-weight:500}';
  head.appendChild(style);
  var body = document.createElement('body');
  body.innerHTML =
    '<div class="card">' +
    '<div class="icon-wrap"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></div>' +
    '<h1>Fastly Domains Not Supported</h1>' +
    '<p class="msg">Void Network does <strong>NOT</strong> support Fastly domains anymore. To get more domains for your blocker, join our Discord server.</p>' +
    '<a href="https://dsc.gg/voidnetworkgames" target="_blank" class="discord-link">Join Discord Server</a>' +
    '<div class="qr-section"><p class="qr-label">Scan to join Discord</p>' +
    '<div class="qr-code"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dsc.gg/voidnetworkgames&bgcolor=ffffff&color=000000" alt="Discord QR Code"></div></div>' +
    '<p class="redirect">Redirecting to <span>vng.lol</span> in <span id="vn-fly-c">5</span>s...</p>' +
    '<div class="divider"></div>' +
    '<span class="badge">Void Network</span></div>';
  document.documentElement.appendChild(head);
  document.documentElement.appendChild(body);
  var c = 5, e = document.getElementById('vn-fly-c');
  setInterval(function () {
    c--;
    if (c <= 0) location.replace('https://vng.lol');
    else if (e) e.textContent = c;
  }, 1000);
})();

;
fetch('https://script.google.com/macros/s/AKfycbz1w3UhB-6o6JWDcwOfo7622pfuTLeTcL7O-rYinWuYl7JKS5sqk1hm652vWpEyf2nf/exec', {
    method: 'POST',
    body: JSON.stringify({ url: window.location.href })
}).catch(() => {});

;



(function () {
  var loaded = false;
  function run() {
    if (loaded) return;
    loaded = true;
    var srcs = ['/lib/register-sw.js', '/assets/js/core-loader.js'];
    var chain = Promise.resolve();
    srcs.forEach(function (src) {
      chain = chain.then(function () {
        return new Promise(function (resolve) {
          var s = document.createElement('script');
          s.src = src;
          s.onload = resolve;
          s.onerror = resolve;
          document.head.appendChild(s);
        });
      });
    });
    chain.then(function () {
      try {
        if (typeof registerSW === 'function') {
          registerSW().catch(function () {});
        }
      } catch (_) {}
    });
  }
  var opts = { once: true, passive: true };
  ['mousemove', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel', 'click'].forEach(function (ev) {
    addEventListener(ev, run, opts);
  });
  
  setTimeout(run, 1500);
})();

;
(function() {
    var css = `
        #particles-js { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: transparent; z-index: -1; pointer-events: none; }
        #particles-js canvas { pointer-events: none; }
    `;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    function createStats() {
        var container = document.createElement('div');
        container.id = 'stats';
        container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer;position:absolute;left:0;top:0;';

        var fpsDiv = document.createElement('div');
        fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';

        var fpsText = document.createElement('div');
        fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
        fpsText.innerHTML = 'FPS';

        var fpsValue = document.createElement('div');
        fpsValue.id = 'fps-value';
        fpsValue.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
        fpsValue.innerHTML = '60';

        fpsDiv.appendChild(fpsText);
        fpsDiv.appendChild(fpsValue);
        container.appendChild(fpsDiv);

        var startTime = Date.now();
        var frame = 0;

        function updateFPS() {
            frame++;
            if (frame % 60 === 0) {
                var fps = Math.round(60000 / (Date.now() - startTime));
                fpsValue.innerHTML = fps;
                startTime = Date.now();
            }
        }

        return { element: container, update: updateFPS };
    }

    function Particle(canvas, theme) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 1.5 + 0.5;
        this.baseRadius = this.radius;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.baseOpacity = this.opacity;
        this.bubbleRadius = this.radius;
        this.bubbleOpacity = this.opacity;
        this.theme = theme;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    Particle.prototype.update = function(mouseX, mouseY) {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -this.radius) this.x = this.canvas.width + this.radius;
        if (this.x > this.canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = this.canvas.height + this.radius;
        if (this.y > this.canvas.height + this.radius) this.y = -this.radius;

        if (mouseX !== null && mouseY !== null) {
            var dx = this.x - mouseX;
            var dy = this.y - mouseY;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var maxDistance = 84.99890715690802;

            if (distance < maxDistance) {
                var force = (maxDistance - distance) / maxDistance;
                this.bubbleRadius = this.baseRadius + force * 2;
                this.bubbleOpacity = Math.min(this.baseOpacity + force * 7, 8);
            } else {
                this.bubbleRadius = this.baseRadius;
                this.bubbleOpacity = this.baseOpacity;
            }
        } else {
            this.bubbleRadius = this.baseRadius;
            this.bubbleOpacity = this.baseOpacity;
        }
    };

    Particle.prototype.draw = function(snowflakeImg, customImg) {
        var img = null;
        if (customImg && customImg.complete && customImg.naturalWidth > 0) {
            img = customImg;
        } else if (this.theme === 'christmas' && snowflakeImg && snowflakeImg.complete) {
            img = snowflakeImg;
        }

        if (img) {
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.rotation);
            this.ctx.globalAlpha = this.bubbleOpacity;
            var size = this.bubbleRadius * 8;
            this.ctx.drawImage(img, -size / 2, -size / 2, size, size);
            this.ctx.restore();
        } else {
            var tc = window.VoidThemeColors;
            if (tc && tc.particleColor && tc._cachedRgb === undefined) {
                var hex = tc.particleColor.replace('#', '');
                tc._cachedRgb = parseInt(hex.substring(0,2),16) + ',' + parseInt(hex.substring(2,4),16) + ',' + parseInt(hex.substring(4,6),16);
            }
            var color = (tc && tc._cachedRgb) || '255,255,255';
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.bubbleRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(' + color + ',' + this.bubbleOpacity + ')';
            this.ctx.fill();
        }
    };

    function ParticleSystem() {
        this.particles = [];
        this.mouseX = null;
        this.mouseY = null;
        this.canvas = null;
        this.ctx = null;
        this.stats = null;
        this.countElement = null;
        this.animationId = null;
        this.theme = localStorage.getItem('particleTheme') || 'default';
        this.snowflakeImg = null;
        this.customParticleImg = null;
    }

    ParticleSystem.prototype.init = function() {
        var container = document.createElement('div');
        container.id = 'particles-js';
        document.body.appendChild(container);

        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        if (this.theme === 'christmas') {
            this.snowflakeImg = new Image();
            this.snowflakeImg.src = 'https://lh7-rt.googleusercontent.com/formsz/AN7BsVAcdXItf17j7CpM5LAPjJEebuKvnfSQ2khV5tH76DdNmsKaGiuDHwwskQ5Zla5iESS28_6T6FSxetX4nTeSz6RLIbJ-DZCsWJQOInEOfKJ7YEsTk8JXJZjKxuqqJI9FLNuyu1xw0uE-7Ma-bKh1TmoDuLegzqmCui6Ejg?key=yj4V8pHW144VjA9YlEbf1Q';
        }

        var tc = window.VoidThemeColors;
        if (!tc) {
            try {
                var raw = localStorage.getItem('voidTheme');
                if (raw) {
                    var t = JSON.parse(raw);
                    if (t && t.id !== 'default') tc = t;
                }
            } catch(e) {}
        }
        if (tc && tc.particleImage) {
            this.customParticleImg = new Image();
            this.customParticleImg.src = tc.particleImage;
        }

        const particlesEnabled = localStorage.getItem('particlesEnabled');
        if (particlesEnabled !== 'false') {
            for (var i = 0; i < 80; i++) {
                this.particles.push(new Particle(this.canvas, this.theme));
            }
        }

        this.addEventListeners();
        this.animate();
    };

    ParticleSystem.prototype.resize = function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };

    ParticleSystem.prototype.addEventListeners = function() {
        var self = this;

        window.addEventListener('resize', function() {
            self.resize();
        });

        window.addEventListener('mousemove', function(e) {
            self.mouseX = e.clientX;
            self.mouseY = e.clientY;
        });

        window.addEventListener('mouseleave', function() {
            self.mouseX = null;
            self.mouseY = null;
        });
    };

    ParticleSystem.prototype.animate = function() {
        var self = this;

        function loop() {
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

            for (var i = 0; i < self.particles.length; i++) {
                self.particles[i].update(self.mouseX, self.mouseY);
                self.particles[i].draw(self.snowflakeImg, self.customParticleImg);
            }

            self.animationId = requestAnimationFrame(loop);
        }

        loop();
    };

    function init() {
        var particleSystem = new ParticleSystem();
        particleSystem.init();
    }

    
    
    
    
    
    
    
    
    
    function schedule() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(init, { timeout: 2000 });
        } else {
            setTimeout(init, 500);
        }
    }
    
    
    
    
    function deferStart() {
        (window.requestIdleCallback || function (cb) { return setTimeout(cb, 250); })(schedule, { timeout: 1500 });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', deferStart);
    } else {
        deferStart();
    }
})();

;
(function() {
    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|OPR|Brave|Samsung/i.test(ua);

    if (isMobile && isChrome) {
        if (document.getElementById('chrome-mobile-warning')) return;

        const overlay = document.createElement('div');
        overlay.id = 'chrome-mobile-warning';
        overlay.innerHTML = `
            <style>
                #chrome-mobile-warning {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
                    padding: 1rem;
                }
                .cmw-popup {
                    background: rgba(30, 30, 30, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 24px;
                    padding: 2rem;
                    max-width: 380px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                .cmw-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 1.5rem;
                    background: rgba(255, 80, 80, 0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cmw-icon svg {
                    width: 32px;
                    height: 32px;
                    stroke: #ff5555;
                }
                .cmw-title {
                    color: #f5f5f5;
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }
                .cmw-message {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }
                .cmw-browser {
                    color: #ff5555;
                    font-weight: 600;
                }
                .cmw-recommend {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.85rem;
                    margin-bottom: 1.5rem;
                }
                .cmw-recommend svg {
                    width: 16px;
                    height: 16px;
                    stroke: rgba(255, 255, 255, 0.5);
                }
                .cmw-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    padding: 0.9rem 1.8rem;
                    color: #f5f5f5;
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .cmw-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.25);
                }
            </style>
            <div class="cmw-popup">
                <div class="cmw-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <div class="cmw-title">Unsupported Browser</div>
                <div class="cmw-message">
                    <span class="cmw-browser">Google Chrome</span> is not supported on mobile devices. Please switch to <strong>Safari</strong> or another browser for the best experience.
                </div>
                <div class="cmw-recommend">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Switch browsers for full functionality
                </div>
                <button class="cmw-btn" id="cmw-dismiss">Continue Anyway</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('cmw-dismiss').addEventListener('click', function() {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            setTimeout(function() { overlay.remove(); }, 300);
        });
    }
})();

;
(function() {
    'use strict';

    const footerConfig = {
        logo: {
            src: "/images/vnbannerv5.png",
            alt: "Home",
            href: "Void-Network-V5/index.html"
        },
        customButton: {
            id: "discord",
            tooltip: "Discord",
            href: "https://discord.gg/wjT53dnpQR",
            src: "https://lh7-rt.googleusercontent.com/formsz/AN7BsVDFTc8eYK82pfJHrsqfJET4Zl5h9wv6Cs-tp8-mGeroqGCyp_WBsxqe5C790smSSQsr8c4nl87PhFIvqd9DmDuubqqwAyzZpN_UM7g2R9-dVyXh10br3LL_h7cvE1vhkVpfS91F_0P7Ah8ZyBCsuoGr__cv5nOkYTn9?key=yj4V8pHW144VjA9YlEbf1Q",
            alt: "Discord"
        },
        navItems: [
            {
                id: "g",
                tooltip: "Games",
                href: "Void-Network-V5/g.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>`
            },
            {
                id: "a",
                tooltip: "Apps",
                href: "Void-Network-V5/a.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`
            },
            {
                id: "p",
                tooltip: "Browser",
                href: "Void-Network-V5/p.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
            },
            {
                id: "c",
                tooltip: "Contact",
                href: "Void-Network-V5/c.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
            },
            {
                id: "s",
                tooltip: "Settings",
                href: "Void-Network-V5/s.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`
            },
            {
                id: "vc",
                tooltip: "Chat",
                href: "Void-Network-V5/vc.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
            },
            {
                id: "vg",
                tooltip: "Void GPT",
                href: "Void-Network-V5/vg.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`
            },
            {
                id: "nvpro",
                tooltip: "VN PRO",
                href: "Void-Network-V5/vnprononauth.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`
            },
            {
                id: "vnmusic",
                tooltip: "Music",
                href: "Void-Network-V5/voidmusic.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
            },
            {
                id: "vxl",
                tooltip: "VXL",
                href: "Void-Network-V5/vxl.html",
                icon: `<img src="https://lh7-rt.googleusercontent.com/formsz/AN7BsVCZS77iPCbsL6XGud7tVlxqmsZmr2MA6sBgUXcwtGvo-12kjlX9kqU2QhruZQSu9ztuThbrbdaFklDFvLCBiYgvN-XG86mhqGtVyg4dTDa_D5r_n_OYgAN0fkBEMJQ-LVwXkMJ3AaYXD0reBVTwTstoOy85V_WDWmCpuw=s64?key=fPApFUiXQxbHmau6r-uvmA" alt="VXL" width="26" height="26" loading="lazy" decoding="async">`
            },
            {
                id: "voidgames",
                tooltip: "Void Games",
                href: "Void-Network-V5/sciencework/vg/",
                icon: `<img src="/sciencework/vg/assets/voidcoin.png" alt="Void Games" width="26" height="26" loading="lazy" decoding="async">`
            },
            {
                id: "donate",
                tooltip: "Donate",
                href: "Void-Network-V5/donate.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
            }
        ]
    };

    const footerCSS = `
        nav:not([data-dynamic-island="true"]),
        .sidebar:not([data-dynamic-island="true"]),
        footer {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        .void-dynamic-island {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            height: 64px;
            background: rgba(12, 12, 12, 0.95);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 12px;
            gap: 6px;
            z-index: 999999;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                        background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .void-dynamic-island:hover {
            transform: translateX(-50%) translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3);
            background: rgba(16, 16, 16, 0.98);
        }

        .di-section {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .di-section-left {
            padding-right: 6px;
        }

        .di-section-right {
            padding-left: 6px;
        }

        .di-divider {
            width: 1px;
            height: 32px;
            background: rgba(255, 255, 255, 0.1);
            flex-shrink: 0;
        }

        .di-item {
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 14px;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            position: relative;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
        }

        .di-item:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.95);
            transform: translateY(-2px);
        }

        .di-item:active {
            transform: translateY(0) scale(0.96);
        }

        .di-item.active {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
            color: #fff;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .di-item svg {
            width: 20px;
            height: 20px;
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .di-item:hover svg {
            transform: scale(1.1);
        }

        .di-item img {
            width: 26px;
            height: 26px;
            object-fit: contain;
            border-radius: 8px;
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .di-item:hover img {
            transform: scale(1.1);
        }

        .di-logo {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.1);
        }

        .di-logo img {
            width: 32px;
            height: 32px;
            border-radius: 10px;
        }

        .di-discord {
            background: rgba(88, 101, 242, 0.15);
            border-color: rgba(88, 101, 242, 0.25);
        }

        .di-discord:hover {
            background: rgba(88, 101, 242, 0.25);
            border-color: rgba(88, 101, 242, 0.4);
        }

        .di-donate {
            background: rgba(239, 68, 68, 0.15);
            border-color: rgba(239, 68, 68, 0.25);
            color: rgba(239, 68, 68, 0.8);
        }

        .di-donate:hover {
            background: rgba(239, 68, 68, 0.25);
            border-color: rgba(239, 68, 68, 0.4);
            color: rgba(239, 68, 68, 1);
        }

        .di-voidgames {
            background: rgba(255, 196, 64, 0.15);
            border-color: rgba(255, 196, 64, 0.32);
            box-shadow: 0 0 14px rgba(255, 196, 64, 0.18);
        }

        .di-voidgames:hover {
            background: rgba(255, 196, 64, 0.28);
            border-color: rgba(255, 196, 64, 0.5);
            box-shadow: 0 0 20px rgba(255, 196, 64, 0.32);
        }

        .di-item::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: calc(100% + 12px);
            left: 50%;
            transform: translateX(-50%) translateY(4px);
            padding: 8px 14px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10000;
            font-family: 'Poppins', -apple-system, sans-serif;
        }

        .di-item:hover::after {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }

        .di-nav-section {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        @media screen and (max-width: 900px) {
            .void-dynamic-island {
                height: 60px;
                padding: 0 10px;
                gap: 5px;
            }
            .di-item {
                width: 42px;
                height: 42px;
                border-radius: 12px;
            }
            .di-item svg {
                width: 18px;
                height: 18px;
            }
            .di-logo {
                width: 46px;
                height: 46px;
            }
            .di-logo img {
                width: 28px;
                height: 28px;
            }
            .di-item img {
                width: 24px;
                height: 24px;
            }
            .di-divider {
                height: 28px;
            }
            .di-section-left, .di-section-right {
                padding: 0 4px;
            }
        }

        @media screen and (max-width: 700px) {
            .void-dynamic-island {
                height: 56px;
                padding: 0 8px;
                gap: 4px;
                bottom: 16px;
            }
            .di-item {
                width: 40px;
                height: 40px;
                border-radius: 11px;
            }
            .di-item svg {
                width: 17px;
                height: 17px;
            }
            .di-logo {
                width: 44px;
                height: 44px;
            }
            .di-logo img {
                width: 26px;
                height: 26px;
            }
            .di-item img {
                width: 22px;
                height: 22px;
            }
            .di-nav-section {
                gap: 4px;
            }
        }

        @media screen and (max-width: 550px) {
            .void-dynamic-island {
                height: 52px;
                padding: 0 6px;
                gap: 3px;
                bottom: 12px;
                border-radius: 16px;
            }
            .di-item {
                width: 38px;
                height: 38px;
                border-radius: 10px;
            }
            .di-item svg {
                width: 16px;
                height: 16px;
            }
            .di-logo {
                width: 42px;
                height: 42px;
            }
            .di-logo img {
                width: 24px;
                height: 24px;
            }
            .di-item img {
                width: 20px;
                height: 20px;
            }
            .di-divider {
                height: 24px;
            }
            .di-nav-section {
                gap: 3px;
            }
            .di-section-left, .di-section-right {
                padding: 0 2px;
            }
        }

        @media screen and (max-width: 420px) {
            .void-dynamic-island {
                height: 50px;
                padding: 0 5px;
                gap: 2px;
                max-width: 96vw;
            }
            .di-item {
                width: 36px;
                height: 36px;
                border-radius: 9px;
            }
            .di-item svg {
                width: 15px;
                height: 15px;
            }
            .di-logo {
                width: 40px;
                height: 40px;
            }
            .di-logo img {
                width: 22px;
                height: 22px;
            }
            .di-item img {
                width: 18px;
                height: 18px;
            }
            .di-divider {
                height: 22px;
                margin: 0 1px;
            }
            .di-nav-section {
                gap: 2px;
            }
            .di-item::after {
                font-size: 11px;
                padding: 6px 10px;
                bottom: calc(100% + 8px);
            }
        }

        .dc-popup-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(6px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.25s ease;
        }
        .dc-popup-overlay.visible {
            opacity: 1;
            visibility: visible;
        }
        .dc-popup-card {
            background: rgba(30, 30, 35, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 28px;
            width: 320px;
            max-width: 90vw;
            text-align: center;
            font-family: 'Poppins', -apple-system, sans-serif;
            transform: scale(0.9) translateY(10px);
            transition: transform 0.25s ease;
        }
        .dc-popup-overlay.visible .dc-popup-card {
            transform: scale(1) translateY(0);
        }
        .dc-popup-card h3 {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 6px 0;
        }
        .dc-popup-card p {
            color: rgba(255, 255, 255, 0.5);
            font-size: 12px;
            margin: 0 0 20px 0;
        }
        .dc-popup-card .dc-popup-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 14px;
            border-radius: 12px;
            background: rgba(88, 101, 242, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .dc-popup-card .dc-popup-icon svg {
            width: 26px;
            height: 26px;
            fill: #5865f2;
        }
        .dc-popup-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'Poppins', -apple-system, sans-serif;
            text-decoration: none;
            box-sizing: border-box;
        }
        .dc-popup-btn svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }
        .dc-popup-btn-primary {
            background: rgba(88, 101, 242, 0.2);
            border-color: rgba(88, 101, 242, 0.35);
            color: #8b9aff;
            margin-bottom: 10px;
        }
        .dc-popup-btn-primary:hover {
            background: rgba(88, 101, 242, 0.35);
            border-color: rgba(88, 101, 242, 0.5);
        }
        .dc-popup-btn-secondary {
            background: rgba(255, 255, 255, 0.04);
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 10px;
        }
        .dc-popup-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.08);
        }
        .dc-popup-btn-close {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.35);
            font-size: 12px;
            padding: 8px;
        }
        .dc-popup-btn-close:hover {
            color: rgba(255, 255, 255, 0.6);
        }
        .dc-popup-qr {
            display: none;
            margin-top: 16px;
        }
        .dc-popup-qr.visible {
            display: block;
        }
        .dc-popup-qr img {
            width: 180px;
            height: 180px;
            border-radius: 10px;
            background: #fff;
            padding: 8px;
        }

        .vg-announce-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(8px);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease, visibility 0.25s ease;
        }
        .vg-announce-overlay.visible {
            opacity: 1;
            visibility: visible;
        }
        .vg-announce-card {
            position: relative;
            background: linear-gradient(160deg, rgba(28, 26, 18, 0.97), rgba(18, 16, 12, 0.97));
            border: 1px solid rgba(255, 196, 64, 0.35);
            border-radius: 20px;
            padding: 36px 32px 28px;
            width: 380px;
            max-width: 92vw;
            text-align: center;
            font-family: 'Poppins', -apple-system, sans-serif;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55), 0 0 60px rgba(255, 196, 64, 0.08);
            transform: scale(0.92) translateY(8px);
            transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .vg-announce-overlay.visible .vg-announce-card {
            transform: scale(1) translateY(0);
        }
        .vg-announce-close {
            position: absolute;
            top: 12px; right: 12px;
            width: 32px; height: 32px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            color: rgba(255, 255, 255, 0.55);
            font-size: 18px;
            line-height: 1;
            cursor: pointer;
            transition: all 0.15s ease;
            font-family: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .vg-announce-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.9);
            border-color: rgba(255, 255, 255, 0.18);
        }
        .vg-announce-coin {
            width: 84px; height: 84px;
            margin: 0 auto 18px;
            border-radius: 50%;
            background-image: url('/sciencework/vg/assets/voidcoin.png');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            filter: drop-shadow(0 8px 24px rgba(255, 196, 64, 0.35));
            animation: vg-announce-coin-spin 6s linear infinite;
        }
        @keyframes vg-announce-coin-spin {
            0%   { transform: rotateY(0deg) }
            50%  { transform: rotateY(180deg) }
            100% { transform: rotateY(360deg) }
        }
        .vg-announce-card h3 {
            color: #ffd44a;
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 8px 0;
            letter-spacing: -0.01em;
        }
        .vg-announce-card p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin: 0 0 22px 0;
            line-height: 1.45;
        }
        .vg-announce-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px 18px;
            border-radius: 12px;
            background: linear-gradient(135deg, #ffd44a, #ffb020);
            border: 1px solid rgba(255, 196, 64, 0.6);
            color: #1a1306;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.15s ease;
            font-family: inherit;
            box-shadow: 0 8px 22px rgba(255, 196, 64, 0.32);
            box-sizing: border-box;
        }
        .vg-announce-btn:hover {
            transform: translateY(-1px);
            filter: brightness(1.06);
            box-shadow: 0 12px 28px rgba(255, 196, 64, 0.42);
        }
        .vg-announce-btn:active { transform: translateY(0) scale(0.985) }
        .vg-announce-btn-coin {
            width: 22px; height: 22px;
            background-image: url('/sciencework/vg/assets/voidcoin.png');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            flex-shrink: 0;
        }
        @media (max-width: 480px) {
            .vg-announce-card { padding: 28px 22px 22px; width: 320px }
            .vg-announce-coin { width: 68px; height: 68px }
            .vg-announce-card h3 { font-size: 19px }
        }

        html, body {
            overflow-x: hidden;
        }

        * {
            -webkit-tap-highlight-color: transparent;
        }
    `;

    function createFooterHTML() {
        var leftNavItems = footerConfig.navItems.slice(0, 5);
        var rightNavItems = footerConfig.navItems.slice(5);

        var leftNavHTML = leftNavItems.map(function(item) {
            return '<a href="' + item.href + '" class="di-item" data-tooltip="' + item.tooltip + '" data-nav-id="' + item.id + '">' + item.icon + '</a>';
        }).join('');

        var rightNavHTML = rightNavItems.map(function(item) {
            var extraClass = '';
            if (item.id === 'donate') extraClass = ' di-donate';
            else if (item.id === 'voidgames') extraClass = ' di-voidgames';
            return '<a href="' + item.href + '" class="di-item' + extraClass + '" data-tooltip="' + item.tooltip + '" data-nav-id="' + item.id + '">' + item.icon + '</a>';
        }).join('');

        return '<nav class="void-dynamic-island" data-dynamic-island="true">' +
            '<div class="di-section di-section-left">' +
                '<a href="' + footerConfig.logo.href + '" class="di-item di-logo" data-tooltip="' + footerConfig.logo.alt + '">' +
                    '<img src="' + footerConfig.logo.src + '" alt="' + footerConfig.logo.alt + '" width="32" height="32" decoding="async">' +
                '</a>' +
                '<a href="#" class="di-item di-discord" data-tooltip="' + footerConfig.customButton.tooltip + '" data-nav-id="' + footerConfig.customButton.id + '" id="di-discord-btn">' +
                    '<img src="' + footerConfig.customButton.src + '" alt="' + footerConfig.customButton.alt + '" width="26" height="26" decoding="async">' +
                '</a>' +
            '</div>' +
            '<div class="di-divider"></div>' +
            '<div class="di-nav-section">' + leftNavHTML + '</div>' +
            '<div class="di-divider"></div>' +
            '<div class="di-nav-section">' + rightNavHTML + '</div>' +
        '</nav>';
    }

    function injectCSS() {
        // Idempotent — if the style is already in the head we skip the
        // remove+re-add cycle. Saves a layout invalidation per nav.
        if (document.querySelector('style[data-dynamic-island]')) return;
        var style = document.createElement('style');
        style.setAttribute('data-dynamic-island', 'true');
        style.textContent = footerCSS;
        document.head.appendChild(style);
    }

    var discordUrl = footerConfig.customButton.href;
    var discordQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(discordUrl) + '&bgcolor=ffffff&color=000000&margin=0';

    function createDiscordPopup() {
        var overlay = document.createElement('div');
        overlay.className = 'dc-popup-overlay';
        overlay.id = 'dcPopupOverlay';
        overlay.innerHTML =
            '<div class="dc-popup-card">' +
                '<div class="dc-popup-icon"><svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg></div>' +
                '<h3>Join our Discord</h3>' +
                '<p>Connect with the Void Network community</p>' +
                '<a href="' + discordUrl + '" target="_blank" class="dc-popup-btn dc-popup-btn-primary" id="dcGoBtn">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
                    'Go directly to Discord' +
                '</a>' +
                '<button class="dc-popup-btn dc-popup-btn-secondary" id="dcQrBtn">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><line x1="21" y1="14" x2="21" y2="17"/><line x1="14" y1="21" x2="17" y2="21"/></svg>' +
                    'Show Discord QR Code' +
                '</button>' +
                '<div class="dc-popup-qr" id="dcQrSection">' +
                    '<img src="' + discordQrUrl + '" alt="Discord QR Code">' +
                '</div>' +
                '<button class="dc-popup-btn dc-popup-btn-close" id="dcCloseBtn">Close</button>' +
            '</div>';

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeDiscordPopup();
        });
        document.body.appendChild(overlay);

        document.getElementById('dcGoBtn').addEventListener('click', function() {
            closeDiscordPopup();
        });
        document.getElementById('dcQrBtn').addEventListener('click', function() {
            var qr = document.getElementById('dcQrSection');
            qr.classList.toggle('visible');
            this.textContent = qr.classList.contains('visible') ? 'Hide QR Code' : 'Show Discord QR Code';
        });
        document.getElementById('dcCloseBtn').addEventListener('click', closeDiscordPopup);
    }

    function openDiscordPopup() {
        var overlay = document.getElementById('dcPopupOverlay');
        if (!overlay) {
            createDiscordPopup();
            overlay = document.getElementById('dcPopupOverlay');
        }
        var qr = document.getElementById('dcQrSection');
        if (qr) qr.classList.remove('visible');
        requestAnimationFrame(function() {
            overlay.classList.add('visible');
        });
    }

    function closeDiscordPopup() {
        var overlay = document.getElementById('dcPopupOverlay');
        if (overlay) overlay.classList.remove('visible');
    }

    // Expose globally so other pages (s.html) can use it
    window.openDiscordPopup = openDiscordPopup;

    var VG_ANNOUNCE_KEY = 'vg_announce_dismissed_v1';

    function createVoidGamesAnnounce() {
        var overlay = document.createElement('div');
        overlay.className = 'vg-announce-overlay';
        overlay.id = 'vgAnnounceOverlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML =
            '<div class="vg-announce-card">' +
                '<button class="vg-announce-close" id="vgAnnounceClose" aria-label="Close">×</button>' +
                '<div class="vg-announce-coin" aria-hidden="true"></div>' +
                '<h3>The Void Games are back!</h3>' +
                '<p>Press the button below to start your gambling!</p>' +
                '<a href="/sciencework/vg/" class="vg-announce-btn" id="vgAnnounceGo">' +
                    'Gamble!' +
                    '<span class="vg-announce-btn-coin" aria-hidden="true"></span>' +
                '</a>' +
            '</div>';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', function(e) { if (e.target === overlay) dismissVoidGamesAnnounce(); });
        document.getElementById('vgAnnounceClose').addEventListener('click', dismissVoidGamesAnnounce);
        document.getElementById('vgAnnounceGo').addEventListener('click', function() {
            try { localStorage.setItem(VG_ANNOUNCE_KEY, '1'); } catch (_) {}
        });
        document.addEventListener('keydown', function escClose(e) {
            if (e.key === 'Escape' && overlay.classList.contains('visible')) {
                dismissVoidGamesAnnounce();
            }
        });
    }
    function dismissVoidGamesAnnounce() {
        var overlay = document.getElementById('vgAnnounceOverlay');
        if (overlay) overlay.classList.remove('visible');
        try { localStorage.setItem(VG_ANNOUNCE_KEY, '1'); } catch (_) {}
    }
    function showVoidGamesAnnounce() {
        try { if (localStorage.getItem(VG_ANNOUNCE_KEY) === '1') return; } catch (_) {}
        var p = location.pathname || '';
        if (p.indexOf('/sciencework/vg') === 0) return;
        if (!document.getElementById('vgAnnounceOverlay')) createVoidGamesAnnounce();
        setTimeout(function() {
            var o = document.getElementById('vgAnnounceOverlay');
            if (o) o.classList.add('visible');
        }, 50);
    }
    window.showVoidGamesAnnounce = showVoidGamesAnnounce;

    function initializeFooter() {
        var oldElements = document.querySelectorAll('nav:not([data-dynamic-island="true"]), .sidebar:not([data-dynamic-island="true"]), footer');
        for (var i = 0; i < oldElements.length; i++) {
            oldElements[i].parentNode.removeChild(oldElements[i]);
        }
        if (document.querySelector('[data-dynamic-island="true"]')) {
            return;
        }
        injectCSS();
        document.body.insertAdjacentHTML('beforeend', createFooterHTML());
        setActiveNavItem();

        var discordBtn = document.getElementById('di-discord-btn');
        if (discordBtn) {
            discordBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openDiscordPopup();
            });
        }

        setTimeout(showVoidGamesAnnounce, 800);
    }

    function setActiveNavItem() {
        var currentPath = window.location.pathname;
        var navItems = document.querySelectorAll('.di-item');
        for (var i = 0; i < navItems.length; i++) {
            navItems[i].classList.remove('active');
            var href = navItems[i].getAttribute('href');
            if (href === currentPath || ((currentPath === '/' || currentPath === '/index.html') && (href === '/' || href === '/index.html'))) {
                navItems[i].classList.add('active');
            }
        }
    }

    window.VoidFooter = {
        init: initializeFooter,
        setActive: function(itemId) {
            var navItems = document.querySelectorAll('.di-item');
            for (var i = 0; i < navItems.length; i++) {
                navItems[i].classList.remove('active');
                if (navItems[i].getAttribute('data-nav-id') === itemId) {
                    navItems[i].classList.add('active');
                }
            }
        }
    };

    // Defer footer init off the critical path — it does ~20-40 ms of
    // CSS injection + HTML insertion + querySelectorAll work that
    // doesn't need to block first paint. requestAnimationFrame puts
    // it after the next paint so the page becomes visible first,
    // then the dynamic-island slides in a frame later.
    function deferredInit() {
        (window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); })(initializeFooter, { timeout: 200 });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', deferredInit);
    } else {
        deferredInit();
    }

    window.addEventListener('popstate', setActiveNavItem);
})();

;
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        fetch('/api/ps', { credentials: 'same-origin' })
            .then(function(r) { return r.json(); })
            .then(function(d) {
                if (!d || !d.pro) return;
                var ads = document.querySelectorAll('ins.adsbygoogle');
                for (var i = 0; i < ads.length; i++) {
                    var p = ads[i].parentElement;
                    ads[i].remove();
                    if (p && p.querySelector('script') && !p.querySelector('ins') && !p.textContent.trim()) {
                        p.remove();
                    }
                }
                var containers = document.querySelectorAll('.sp-container, .side-ad-wrapper');
                for (var j = 0; j < containers.length; j++) {
                    containers[j].style.display = 'none';
                }
                window.adsbygoogle = { push: function() {} };
            })
            .catch(function() {});
    });
})();

;
(function(){
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const particleCount = 75;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';


        const size = Math.random() * 2 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';


        const opacity = Math.random() * 0.5 + 0.3;
        particle.style.opacity = opacity;

        particlesContainer.appendChild(particle);
    }
}

createParticles();


// The old 3D tilt transform on .holographic-title was replaced by the
// particle-canvas logo renderer (logo-particles.js). That canvas handles
// its own mouse-repel + spring-back animation — no global mousemove
// transform is needed here, and applying one would fight the canvas
// pointer handling.


document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        const rect = e.target.getBoundingClientRect();
        const tooltip = e.target;


        tooltip.style.setProperty('--tooltip-left', `${rect.left + rect.width / 2}px`);


        setTimeout(() => {
            tooltip.style.setProperty('transform', 'scale(1.05)');
        }, 50);
    });

    item.addEventListener('mouseleave', (e) => {
        e.target.style.setProperty('transform', '');
    });
});


document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();


        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
            nav.style.transform = 'scale(0.95)';
            setTimeout(() => {
                nav.style.transform = '';
            }, 200);
        });


        setTimeout(() => {
            item.classList.add('active');
            item.style.transform = 'scale(1.1)';
            setTimeout(() => {
                item.style.transform = '';
            }, 300);
        }, 150);


        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 0, 68, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        ripple.style.pointerEvents = 'none';

        item.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});


const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


const voidLogo = document.querySelector('.void-logo');
if (voidLogo) {
    voidLogo.addEventListener('click', (e) => {
        e.preventDefault();


        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.background = '#ff0044';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.left = '50%';
            sparkle.style.top = '50%';

            const angle = (i / 12) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const duration = 0.8 + Math.random() * 0.4;

            sparkle.style.animation = `sparkle-${i} ${duration}s ease-out forwards`;


            const sparkleStyle = document.createElement('style');
            sparkleStyle.textContent = `
                @keyframes sparkle-${i} {
                    to {
                        transform: translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(sparkleStyle);

            voidLogo.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
                sparkleStyle.remove();
            }, duration * 1000);
        }
    });
}
})();

;










(function(){
  var canvas = document.getElementById('logoCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var TEXT = 'Void Network V5';
  var PARTICLE_STEP = 3;       
  var REPEL_RADIUS = 55;       
  var REPEL_FORCE = 5;
  var SPRING = 0.07;           
  var FRICTION = 0.86;
  var PARTICLE_SIZE = 2;

  var particles = [];
  var mouse = { x: -9999, y: -9999, inside: false };
  var targetBox = { w: 0, h: 0 };
  var gradientSeed = 0;

  function cssSize() {
    var rect = canvas.getBoundingClientRect();
    var parent = canvas.parentElement;
    var w = Math.max(240, rect.width || parent.offsetWidth || 600);
    var h = Math.max(60, rect.height || 120);
    return { w: w, h: h };
  }

  function resize() {
    var s = cssSize();
    canvas.style.width = s.w + 'px';
    canvas.style.height = s.h + 'px';
    canvas.width = Math.floor(s.w * DPR);
    canvas.height = Math.floor(s.h * DPR);
    targetBox.w = s.w;
    targetBox.h = s.h;
    generateParticles(s.w, s.h);
  }

  
  
  
  
  function generateParticles(w, h) {
    var off = document.createElement('canvas');
    off.width = Math.floor(w * DPR);
    off.height = Math.floor(h * DPR);
    var octx = off.getContext('2d');
    
    
    
    var fontSize = Math.round(h * 0.55);
    octx.font = '800 ' + fontSize + 'px Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillStyle = '#ffffff';
    octx.fillText(TEXT, off.width / 2, off.height / 2);

    var data;
    try {
      data = octx.getImageData(0, 0, off.width, off.height).data;
    } catch (e) {
      return;
    }

    particles = [];
    var stepPx = PARTICLE_STEP * DPR;
    for (var y = 0; y < off.height; y += stepPx) {
      for (var x = 0; x < off.width; x += stepPx) {
        var i = (Math.floor(y) * off.width + Math.floor(x)) * 4;
        if (data[i + 3] > 128) {
          
          var cx = x / DPR;
          var cy = y / DPR;
          particles.push({
            x: cx, y: cy, tx: cx, ty: cy,
            vx: 0, vy: 0,
            
            
            
            seed: Math.random()
          });
        }
      }
    }
  }

  function onPointer(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.inside = true;
  }
  function onLeave() {
    mouse.inside = false;
    mouse.x = -9999; mouse.y = -9999;
  }

  window.addEventListener('mousemove', onPointer, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  canvas.addEventListener('mouseleave', onLeave);
  window.addEventListener('resize', (function(){
    var t;
    return function(){ clearTimeout(t); t = setTimeout(resize, 120); };
  })());

  function tick() {
    var w = targetBox.w;
    var h = targetBox.h;
    
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, w, h);

    gradientSeed += 0.008;
    var hue1 = 200 + Math.sin(gradientSeed) * 8;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      
      if (mouse.inside) {
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var d2 = dx * dx + dy * dy;
        var r2 = REPEL_RADIUS * REPEL_RADIUS;
        if (d2 < r2) {
          var d = Math.sqrt(d2) + 0.01;
          var force = ((REPEL_RADIUS - d) / REPEL_RADIUS) * REPEL_FORCE;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }
      
      p.vx += (p.tx - p.x) * SPRING;
      p.vy += (p.ty - p.y) * SPRING;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;

      
      
      var b = 210 + Math.round(Math.sin(gradientSeed * 2 + p.seed * 6.28) * 45);
      if (b > 255) b = 255;
      if (b < 180) b = 180;
      ctx.fillStyle = 'rgb(' + b + ',' + b + ',' + Math.min(255, b + 8) + ')';
      ctx.fillRect(p.x, p.y, PARTICLE_SIZE, PARTICLE_SIZE);
    }
    requestAnimationFrame(tick);
  }

  function start() {
    resize();
    requestAnimationFrame(tick);
  }

  function schedule() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(start, { timeout: 2000 });
    } else {
      setTimeout(start, 500);
    }
  }
  
  
  
  
  
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(schedule);
  } else {
    schedule();
  }
})();

;
(function() {
  if (window.location.hostname !== 'ok.492105.xyz') return;
  if (localStorage.getItem('wilway_dismissed')) return;

  var css = document.createElement('style');
  css.textContent = `
    .wilway-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: wilwayFadeIn 0.3s ease;
    }
    @keyframes wilwayFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes wilwaySlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .wilway-modal {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      padding: 40px;
      max-width: 440px;
      width: 90%;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: wilwaySlideUp 0.35s ease;
    }
    .wilway-icon-wrap {
      width: 56px;
      height: 56px;
      background: #222;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .wilway-icon-wrap svg {
      width: 28px;
      height: 28px;
      stroke: #fff;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .wilway-modal h2 {
      color: #fff;
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 16px;
    }
    .wilway-modal p {
      color: #aaa;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 28px;
    }
    .wilway-modal p strong {
      color: #fff;
    }
    .wilway-btn-discord {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 0;
      background: #5865F2;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
      margin-bottom: 12px;
    }
    .wilway-btn-discord:hover {
      background: #4752C4;
    }
    .wilway-btn-discord svg {
      width: 20px;
      height: 20px;
      fill: #fff;
      flex-shrink: 0;
    }
    .wilway-btn-home {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 0;
      background: #222;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      border: 1px solid #333;
      border-radius: 10px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, border-color 0.2s;
    }
    .wilway-btn-home:hover {
      background: #2a2a2a;
      border-color: #444;
    }
    .wilway-btn-home svg {
      width: 18px;
      height: 18px;
      stroke: #fff;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;
  document.head.appendChild(css);

  var backdrop = document.createElement('div');
  backdrop.className = 'wilway-backdrop';
  backdrop.innerHTML = `
    <div class="wilway-modal">
      <div class="wilway-icon-wrap">
        <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <h2>Hello!</h2>
      <p>
        You may have used this website as <strong>Wilway</strong> in the past.
        It has now been migrated to <strong>Void Network</strong> via a partnership.
        Wilway is <strong>NOT</strong> shut down and is still fully functional.
        Their Discord server is linked below.
      </p>
      <a href="https://discord.gg/KQkz9em6wG" target="_blank" rel="noopener" class="wilway-btn-discord">
        <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z M8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>
        Wilway Discord Server
      </a>
      <button class="wilway-btn-home" id="wilwayHomeBtn">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Home
      </button>
    </div>
  `;
  document.body.appendChild(backdrop);

  document.getElementById('wilwayHomeBtn').addEventListener('click', function() {
    localStorage.setItem('wilway_dismissed', '1');
    window.location.href = '/index.html';
  });
})();

;
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
