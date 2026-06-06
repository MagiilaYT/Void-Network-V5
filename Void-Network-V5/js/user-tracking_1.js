function generateUserId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 9; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function getOrCreateUserId() {
    let userId = localStorage.getItem('voidUserId');
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('voidUserId', userId);
    }
    return userId;
}

const userId = getOrCreateUserId();

if (document.getElementById('userIdDisplay')) {
    document.getElementById('userIdDisplay').textContent = userId;
}

let isInverted = false;
let gravityEnabled = true;
let chaosActive = false;
let trollBanner = null;
let chaosInterval = null;
let chaosInitTimeout = null;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let chaosElements = [];

function createTrollBanner() {
    if (trollBanner) return;

    const style = document.createElement('style');
    style.id = 'vn-troll-style';
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap');

        #vn-troll-banner {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 48px !important;
            background: linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(30, 30, 60, 0.98) 100%) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            z-index: 2147483647 !important;
            font-family: 'Poppins', sans-serif !important;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
            pointer-events: none !important;
        }

        #vn-troll-banner::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #667eea);
            background-size: 200% 100%;
            animation: vn-gradient-slide 3s linear infinite;
        }

        @keyframes vn-gradient-slide {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        #vn-troll-banner .vn-troll-icon {
            font-size: 20px;
            animation: vn-bounce 1s ease-in-out infinite;
        }

        @keyframes vn-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }

        #vn-troll-banner .vn-troll-text {
            color: #ffffff !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
        }

        #vn-troll-banner .vn-troll-highlight {
            background: linear-gradient(90deg, #667eea, #764ba2) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            font-weight: 700 !important;
        }
    `;
    document.head.appendChild(style);

    trollBanner = document.createElement('div');
    trollBanner.id = 'vn-troll-banner';
    trollBanner.innerHTML = `
        <span class="vn-troll-icon">&#127917;</span>
        <span class="vn-troll-text">You Are Currently Being <span class="vn-troll-highlight">TROLLED</span> By a Void Network PRO User!</span>
        <span class="vn-troll-icon">&#127917;</span>
    `;

    document.body.appendChild(trollBanner);
}

function removeTrollBanner() {
    if (trollBanner) {
        trollBanner.remove();
        trollBanner = null;
        const style = document.getElementById('vn-troll-style');
        if (style) style.remove();
    }
}

function initChaosMode() {
    if (chaosActive) return;
    chaosActive = true;
    chaosElements = [];

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);

    const style = document.createElement('style');
    style.id = 'vn-chaos-style';
    style.textContent = `
        .vn-chaos-element {
            transition: none !important;
            animation: none !important;
        }
    `;
    document.head.appendChild(style);

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const bannerH = 58;
    const padding = 5;
    const maxElWidth = screenW - padding * 2;
    const maxElHeight = screenH - bannerH - padding * 2;

    const elements = document.querySelectorAll('body > *');
    elements.forEach(el => {
        if (el.id === 'vn-troll-banner' ||
            el.tagName === 'SCRIPT' ||
            el.tagName === 'STYLE' ||
            el.tagName === 'LINK' ||
            el.tagName === 'NOSCRIPT' ||
            el.tagName === 'META') return;

        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);

        if (computed.display === 'none' || rect.width === 0 || rect.height === 0) return;

        el.dataset.vnOriginalPosition = computed.position;
        el.dataset.vnOriginalLeft = el.style.left || '';
        el.dataset.vnOriginalTop = el.style.top || '';
        el.dataset.vnOriginalRight = el.style.right || '';
        el.dataset.vnOriginalBottom = el.style.bottom || '';
        el.dataset.vnOriginalMargin = el.style.margin || '';
        el.dataset.vnOriginalTransform = el.style.transform || '';
        el.dataset.vnOriginalZIndex = el.style.zIndex || '';
        el.dataset.vnOriginalWidth = el.style.width || '';
        el.dataset.vnOriginalMaxWidth = el.style.maxWidth || '';
        el.dataset.vnOriginalMaxHeight = el.style.maxHeight || '';
        el.dataset.vnOriginalOverflow = el.style.overflow || '';

        let elWidth = rect.width;
        let elHeight = rect.height;
        let scale = 1;

        if (elWidth > maxElWidth || elHeight > maxElHeight) {
            const scaleX = maxElWidth / elWidth;
            const scaleY = maxElHeight / elHeight;
            scale = Math.min(scaleX, scaleY, 1);
            elWidth = elWidth * scale;
            elHeight = elHeight * scale;
        }

        let startX = Math.random() * (screenW - elWidth - padding * 2) + padding;
        let startY = Math.random() * (screenH - elHeight - bannerH - padding) + bannerH;

        startX = Math.max(padding, Math.min(startX, screenW - elWidth - padding));
        startY = Math.max(bannerH, Math.min(startY, screenH - elHeight - padding));

        el.style.position = 'fixed';
        el.style.left = startX + 'px';
        el.style.top = startY + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.margin = '0';
        el.style.zIndex = '10000';
        el.style.maxWidth = maxElWidth + 'px';
        el.style.maxHeight = maxElHeight + 'px';
        el.style.overflow = 'hidden';
        if (scale < 1) {
            el.style.transform = 'scale(' + scale + ')';
            el.style.transformOrigin = 'top left';
        }
        el.classList.add('vn-chaos-element');

        chaosElements.push({
            el: el,
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            width: elWidth,
            height: elHeight
        });
    });

    chaosInterval = setInterval(updateChaos, 16);
}

function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
}

function updateChaos() {
    if (!chaosActive) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const bannerH = 58;
    const padding = 5;

    const repelRadius = 200;
    const repelForce = 20;
    const friction = 0.985;
    const bounceDecay = 0.9;
    const minSpeed = 1;
    const maxSpeed = 20;

    for (let i = chaosElements.length - 1; i >= 0; i--) {
        const obj = chaosElements[i];
        if (!obj.el || !obj.el.isConnected) {
            chaosElements.splice(i, 1);
            continue;
        }

        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;

        const dx = centerX - mouseX;
        const dy = centerY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repelRadius && distance > 0) {
            const force = Math.pow(1 - distance / repelRadius, 2) * repelForce;
            obj.vx += (dx / distance) * force;
            obj.vy += (dy / distance) * force;
        }

        obj.vx *= friction;
        obj.vy *= friction;

        const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
        if (speed < minSpeed) {
            const angle = Math.random() * Math.PI * 2;
            obj.vx += Math.cos(angle) * 2;
            obj.vy += Math.sin(angle) * 2;
        }
        if (speed > maxSpeed) {
            const ratio = maxSpeed / speed;
            obj.vx *= ratio;
            obj.vy *= ratio;
        }

        obj.x += obj.vx;
        obj.y += obj.vy;

        const minX = padding;
        const maxX = screenW - obj.width - padding;
        const minY = bannerH;
        const maxY = screenH - obj.height - padding;

        if (obj.x <= minX) {
            obj.x = minX;
            obj.vx = Math.abs(obj.vx) * bounceDecay;
        } else if (obj.x >= maxX) {
            obj.x = Math.max(minX, maxX);
            obj.vx = -Math.abs(obj.vx) * bounceDecay;
        }

        if (obj.y <= minY) {
            obj.y = minY;
            obj.vy = Math.abs(obj.vy) * bounceDecay;
        } else if (obj.y >= maxY) {
            obj.y = Math.max(minY, maxY);
            obj.vy = -Math.abs(obj.vy) * bounceDecay;
        }

        obj.el.style.left = Math.round(obj.x) + 'px';
        obj.el.style.top = Math.round(obj.y) + 'px';
    }
}

function stopChaosMode() {
    if (!chaosActive) return;
    chaosActive = false;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchmove', onTouchMove);

    if (chaosInterval) {
        clearInterval(chaosInterval);
        chaosInterval = null;
    }

    chaosElements.forEach(obj => {
        if (!obj.el || !obj.el.isConnected) return;

        obj.el.style.position = obj.el.dataset.vnOriginalPosition || '';
        obj.el.style.left = obj.el.dataset.vnOriginalLeft || '';
        obj.el.style.top = obj.el.dataset.vnOriginalTop || '';
        obj.el.style.right = obj.el.dataset.vnOriginalRight || '';
        obj.el.style.bottom = obj.el.dataset.vnOriginalBottom || '';
        obj.el.style.margin = obj.el.dataset.vnOriginalMargin || '';
        obj.el.style.transform = obj.el.dataset.vnOriginalTransform || '';
        obj.el.style.zIndex = obj.el.dataset.vnOriginalZIndex || '';
        obj.el.style.maxWidth = obj.el.dataset.vnOriginalMaxWidth || '';
        obj.el.style.maxHeight = obj.el.dataset.vnOriginalMaxHeight || '';
        obj.el.style.overflow = obj.el.dataset.vnOriginalOverflow || '';
        obj.el.classList.remove('vn-chaos-element');
    });

    chaosElements = [];

    const style = document.getElementById('vn-chaos-style');
    if (style) style.remove();
}


function playSounds(sounds) {
    if (!sounds || !sounds.length) return;
    for (const s of sounds) {
        try {
            const a = document.createElement('audio');
            a.crossOrigin = 'anonymous';
            a.preload = 'auto';
            a.src = s.u;
            a.volume = typeof s.v === 'number' ? s.v : 1;
            a.style.display = 'none';
            document.body.appendChild(a);
            const p = a.play();
            if (p && p.catch) p.catch(() => {});
            a.addEventListener('ended', () => a.remove());
            a.addEventListener('error', () => a.remove());
            setTimeout(() => { try { a.remove(); } catch {} }, 60000);
        } catch {}
    }
}

function applyTrollData(data) {
    if (!data) return;

    
    if (data.sounds && data.sounds.length) {
        playSounds(data.sounds);
    }

    if (data.kickUser === true) {
        window.close();
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 100);
        return;
    }

    const shouldShowBanner = (data.invertColors === true) || (data.gravityOn === false);
    if (shouldShowBanner) {
        createTrollBanner();
    } else {
        removeTrollBanner();
    }

    if (data.invertColors === true && !isInverted) {
        isInverted = true;
        const style = document.createElement('style');
        style.id = 'vn-invert-filter';
        style.textContent = `
            html { filter: invert(1) hue-rotate(180deg); }
            img, video, canvas, [style*="background-image"], svg image { filter: invert(1) hue-rotate(180deg); }
            #vn-troll-banner { filter: invert(1) hue-rotate(180deg); }
        `;
        document.head.appendChild(style);
    } else if (data.invertColors !== true && isInverted) {
        isInverted = false;
        const style = document.getElementById('vn-invert-filter');
        if (style) style.remove();
    }

    if (data.gravityOn === false && gravityEnabled) {
        gravityEnabled = false;
        if (chaosInitTimeout) clearTimeout(chaosInitTimeout);
        chaosInitTimeout = setTimeout(() => {
            chaosInitTimeout = null;
            if (!gravityEnabled) initChaosMode();
        }, 200);
    } else if (data.gravityOn !== false && !gravityEnabled) {
        gravityEnabled = true;
        if (chaosInitTimeout) { clearTimeout(chaosInitTimeout); chaosInitTimeout = null; }
        stopChaosMode();
    }
}







let _lastTrollEtag = null;
let _lastTrollData = null;
async function pollUserData() {
    try {
        const headers = {};
        if (_lastTrollEtag) headers['If-None-Match'] = _lastTrollEtag;
        const res = await fetch('/api/uid/data?uid=' + encodeURIComponent(userId), { headers, cache: 'no-store' });
        if (!res.ok && res.status !== 304) return;
        const newEtag = res.headers.get('ETag');
        if (newEtag) _lastTrollEtag = newEtag;
        let data;
        if (res.status === 304 && _lastTrollData) {
            
            
            data = Object.assign({}, _lastTrollData, { sounds: [] });
        } else {
            data = await res.json();
            
            _lastTrollData = Object.assign({}, data, { sounds: [] });
        }
        applyTrollData(data);

        const now = Date.now();
        const today = new Date().toDateString();
        let needsUpdate = false;
        let updates = {};

        if (data.lastResetDate !== today) {
            updates.invertUsedToday = 0;
            updates.gravityOffUsedToday = 0;
            updates.lastResetDate = today;
            needsUpdate = true;
        }

        if (data.invertColors && data.invertStartTime) {
            const totalUsed = (data.invertUsedToday || 0) + (now - data.invertStartTime);
            if (totalUsed >= 300000) {
                updates.invertColors = false;
                updates.invertUsedToday = 300000;
                updates.invertStartTime = null;
                needsUpdate = true;
            }
        }

        if (data.gravityOn === false && data.gravityOffStartTime) {
            const totalUsed = (data.gravityOffUsedToday || 0) + (now - data.gravityOffStartTime);
            if (totalUsed >= 300000) {
                updates.gravityOn = true;
                updates.gravityOffUsedToday = 300000;
                updates.gravityOffStartTime = null;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            fetch('/api/uid/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: userId, updates })
            }).catch(() => {});
        }
    } catch (e) {}
}









pollUserData();
var _pollIv = setInterval(function () {
    if (document.visibilityState === 'visible') pollUserData();
}, 30000);
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') pollUserData();
});



window._vnPollNow = function(data) {
    if (data && typeof data === 'object') {
        applyTrollData(data);
    } else {
        pollUserData();
    }
};

window.addEventListener('beforeunload', () => {
    if (chaosInterval) {
        clearInterval(chaosInterval);
    }
    if (chaosInitTimeout) {
        clearTimeout(chaosInitTimeout);
    }
});

export { userId };
