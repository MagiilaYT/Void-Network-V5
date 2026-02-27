(function() {
    var css = `
        #particles-js { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: transparent; z-index: -1; }
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
