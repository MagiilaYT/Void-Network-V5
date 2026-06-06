(function() {
    'use strict';

    
    var toastContainer = null;
    var lastToastTime = 0;

    function createContainer() {
        if (toastContainer && document.body.contains(toastContainer)) return;
        toastContainer = document.createElement('div');
        var s = toastContainer.style;
        s.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
        document.body.appendChild(toastContainer);
    }

    function showToast(msg) {
        if (!document.body) return;
        createContainer();
        var toast = document.createElement('div');
        toast.textContent = msg;
        
        toast.style.cssText = [
            'background:#0a0a0a',
            'color:#f0f0f0',
            'padding:14px 22px',
            'border-radius:14px',
            "font-family:'Poppins',sans-serif",
            'font-size:14px',
            'font-weight:500',
            'max-width:320px',
            'box-shadow:0 8px 32px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.06)',
            'transform:translateX(120%)',
            'transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275),opacity 0.3s ease',
            'opacity:0',
            'backdrop-filter:blur(20px)',
            '-webkit-backdrop-filter:blur(20px)',
            'border:1px solid rgba(255,255,255,0.06)',
            'pointer-events:auto',
            'letter-spacing:-0.01em'
        ].join(';');
        toastContainer.appendChild(toast);

        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                toast.style.transform = 'translateX(0)';
                toast.style.opacity = '1';
            });
        });

        setTimeout(function() {
            toast.style.transform = 'translateX(120%)';
            toast.style.opacity = '0';
            setTimeout(function() {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 400);
        }, 4000);
    }

    function showToastCooldown(msg, ms) {
        var now = Date.now();
        if (now - lastToastTime < (ms || 6000)) return;
        lastToastTime = now;
        showToast(msg);
    }

    function isInput(el) {
        if (!el) return false;
        var tag = (el.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    }

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    
    
    
    (function() {
        var msgs = [
            "Hey! Stop looking at my code!",
            "I see you... inspecting things.",
            "Nothing to see here, move along.",
            "You think you're a hacker now?",
            "The code is watching you back.",
            "Close DevTools... I dare you.",
            "Found anything interesting yet?",
            "My creator said not to talk to strangers in DevTools.",
            "You know I can see you, right?",
            "Congratulations, you found the secret: there is no secret.",
            "Stop poking around in my insides!",
            "If you break something, it's YOUR fault.",
            "Yes, the code is messy. Don't judge me.",
            "Are you trying to find bugs? Good luck.",
            "I'm not hiding anything... probably."
        ];
        var wasOpen = false;
        var greeted = false;

        function greetConsole() {
            if (greeted) return;
            greeted = true;
            console.log(
                '%c VOID ',
                'background:#0f0f0f;color:#f0f0f0;font-size:20px;font-weight:bold;padding:10px 24px;border-radius:14px;border:1px solid rgba(255,255,255,0.06);letter-spacing:0.1em;'
            );
            console.log(
                '%cHey there, curious one.',
                'color:rgba(255,255,255,0.6);font-size:14px;font-weight:600;padding:4px 0;'
            );
            console.log(
                '%cWe see you poking around. No secrets here... or are there?',
                'color:rgba(255,255,255,0.35);font-size:12px;padding:2px 0;'
            );
        }

        function check() {
            var open = (window.outerWidth - window.innerWidth > 160) ||
                       (window.outerHeight - window.innerHeight > 160);
            if (open && !wasOpen) {
                wasOpen = true;
                greetConsole();
                showToast(pick(msgs));
                lastToastTime = Date.now();
            } else if (open && wasOpen && Math.random() < 0.04) {
                showToast(pick(msgs));
                lastToastTime = Date.now();
            } else if (!open) {
                wasOpen = false;
            }
        }

        function init() { setInterval(check, 2000); }
        if (document.body) init();
        else document.addEventListener('DOMContentLoaded', init);
    })();

    
    
    
    (function() {
        var times = [];
        var bouncing = false;
        var msgs = [
            "Calm down with the spacebar!",
            "The spacebar has feelings too.",
            "BOING BOING BOING... happy now?",
            "That spacebar owes you nothing.",
            "You're gonna break it!"
        ];

        function bounce() {
            if (bouncing) return;
            bouncing = true;
            var s = document.createElement('style');
            s.textContent = '@keyframes vn-bounce{0%{transform:translateY(0)}15%{transform:translateY(-8px)}30%{transform:translateY(0)}45%{transform:translateY(-4px)}60%{transform:translateY(0)}75%{transform:translateY(-2px)}100%{transform:translateY(0)}}';
            document.head.appendChild(s);
            document.body.style.animation = 'vn-bounce 0.5s ease';
            setTimeout(function() {
                document.body.style.animation = '';
                if (s.parentNode) s.parentNode.removeChild(s);
                bouncing = false;
            }, 550);
        }

        
        window.addEventListener('keydown', function(e) {
            if (e.code !== 'Space' || isInput(e.target)) return;
            var now = Date.now();
            times.push(now);
            times = times.filter(function(t) { return now - t < 2000; });
            if (times.length >= 6) {
                bounce();
                showToastCooldown(pick(msgs), 8000);
                times = [];
            }
        }, true);
    })();

    
    
    
    (function() {
        var pos = [];
        var trailing = false;
        var msgs = [
            "You're gonna break your mouse!",
            "Easy there, speed racer.",
            "Is your mouse having a seizure?",
            "That mouse has a family!",
            "Slow down, this isn't a race."
        ];

        document.addEventListener('mousemove', function(e) {
            var now = Date.now();
            pos.push({ x: e.clientX, y: e.clientY, t: now });
            while (pos.length > 0 && now - pos[0].t > 500) pos.shift();
            if (pos.length < 8) return;

            var dist = 0, dirs = 0;
            for (var i = 1; i < pos.length; i++) {
                var dx = pos[i].x - pos[i - 1].x;
                var dy = pos[i].y - pos[i - 1].y;
                dist += Math.sqrt(dx * dx + dy * dy);
                if (i >= 2) {
                    var px = pos[i - 1].x - pos[i - 2].x;
                    var py = pos[i - 1].y - pos[i - 2].y;
                    if ((px > 0 && dx < 0) || (px < 0 && dx > 0)) dirs++;
                    if ((py > 0 && dy < 0) || (py < 0 && dy > 0)) dirs++;
                }
            }

            if (dist > 1500 && dirs > 8) {
                showTrail();
                showToastCooldown(pick(msgs), 10000);
                pos = [];
            }
        });

        function showTrail() {
            if (trailing) return;
            trailing = true;

            function dot(e) {
                var d = document.createElement('div');
                
                d.style.cssText = 'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:rgba(240,240,240,0.7);box-shadow:0 0 8px rgba(255,255,255,0.25),0 0 16px rgba(255,255,255,0.1);pointer-events:none;z-index:999998;transition:opacity 0.5s ease,transform 0.5s ease;';
                document.body.appendChild(d);
                requestAnimationFrame(function() {
                    d.style.opacity = '0';
                    d.style.transform = 'scale(3)';
                });
                setTimeout(function() {
                    if (d.parentNode) d.parentNode.removeChild(d);
                }, 500);
            }

            document.addEventListener('mousemove', dot);
            setTimeout(function() {
                document.removeEventListener('mousemove', dot);
                trailing = false;
            }, 2000);
        }
    })();

    
    
    
    (function() {
        var buffer = '';
        var active = false;

        
        window.addEventListener('keydown', function(e) {
            if (active) return;
            var ch = e.key;
            if (!ch || ch.length !== 1) return;
            buffer += ch.toLowerCase();
            if (buffer.length > 20) buffer = buffer.slice(-20);
            if (buffer.indexOf('void') !== -1) {
                buffer = '';
                codeRain();
            }
        }, true);

        var snippets = [
            '<div class="void">',
            '</div>',
            '<script src="void.js">',
            '</script>',
            '<span id="null">',
            'const void = null;',
            'function() { return; }',
            '<link rel="void">',
            'if (void === true) {',
            '} else { break; }',
            '<meta name="void">',
            'import { nothing }',
            'export default void;',
            'while (true) { }',
            '<style>*{display:none}',
            'document.body = null;',
            'window.close();',
            'return undefined;',
            '<p>you found me</p>',
            'try { } catch { }',
            '<!-- void -->',
            'console.log("void");',
            '<br/><br/><br/>',
            'var x = x + x;',
            '@keyframes void {',
            'position: absolute;',
            'z-index: -Infinity;',
            'opacity: 0;',
            '<input type="hidden">',
            'throw new Error();'
        ];

        function codeRain() {
            active = true;

            var ov = document.createElement('div');
            ov.style.cssText = 'position:fixed;inset:0;z-index:999997;pointer-events:none;overflow:hidden;';
            document.body.appendChild(ov);

            var cols = Math.floor(window.innerWidth / 140);
            if (cols < 3) cols = 3;
            var spawned = 0;
            var totalDrops = cols * 12;

            var spawnInterval = setInterval(function() {
                if (spawned >= totalDrops) {
                    clearInterval(spawnInterval);
                    return;
                }

                
                var batch = Math.min(cols, totalDrops - spawned);
                for (var i = 0; i < batch; i++) {
                    spawnDrop(ov);
                    spawned++;
                }
            }, 120);

            
            setTimeout(function() {
                if (ov.parentNode) ov.parentNode.removeChild(ov);
                active = false;
            }, 6000);

            showToast("You summoned the void.");
            lastToastTime = Date.now();
        }

        function spawnDrop(container) {
            var drop = document.createElement('div');
            var text = snippets[Math.floor(Math.random() * snippets.length)];
            drop.textContent = text;

            var left = Math.random() * 100;
            var duration = 2.5 + Math.random() * 3;
            var delay = Math.random() * 0.3;
            var opacity = 0.15 + Math.random() * 0.35;
            var size = 11 + Math.floor(Math.random() * 4);

            drop.style.cssText = [
                'position:fixed',
                'top:-40px',
                'left:' + left + '%',
                'color:rgba(240,240,240,' + opacity + ')',
                "font-family:'Courier New',monospace",
                'font-size:' + size + 'px',
                'font-weight:400',
                'white-space:nowrap',
                'pointer-events:none',
                'user-select:none',
                '-webkit-user-select:none',
                'animation:vn-rain ' + duration + 's linear ' + delay + 's forwards'
            ].join(';');

            
            if (!document.getElementById('vn-rain-css')) {
                var css = document.createElement('style');
                css.id = 'vn-rain-css';
                css.textContent = '@keyframes vn-rain{0%{top:-40px;opacity:0}5%{opacity:1}90%{opacity:1}100%{top:' + (window.innerHeight + 20) + 'px;opacity:0}}';
                document.head.appendChild(css);
            }

            container.appendChild(drop);

            
            setTimeout(function() {
                if (drop.parentNode) drop.parentNode.removeChild(drop);
            }, (duration + delay) * 1000 + 100);
        }
    })();

})();
