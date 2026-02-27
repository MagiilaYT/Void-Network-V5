function createParticles() {
    const particlesContainer = document.getElementById('particles');
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


document.addEventListener('mousemove', (e) => {
    const title = document.querySelector('.holographic-title');
    const rect = title.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = (y / rect.height) * 8;
    const rotateY = (x / rect.width) * 8;
    const translateX = (x / rect.width) * 10;
    const translateY = (y / rect.height) * 10;
    
    title.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px)`;
});

document.addEventListener('mouseleave', () => {
    const title = document.querySelector('.holographic-title');
    title.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px)';
});


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
