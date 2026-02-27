(function() {
    'use strict';
    
    const footerConfig = {
        logo: {
            src: "https://lh7-rt.googleusercontent.com/formsz/AN7BsVAsEUdNIJ37l2osQJwSfhirbiW-Xmspc_FvDtbR-aeq20ovmOhBLq9tnKKm-Uwgoc3tGPzvExx4Puuitz8Oj2PcBJnn-uFrzqEFuqb3WR4tzY5EgAK9XVdN__9APcELoHIZ2oIzSKUmyGoXKT9zlFXISDXqNErA4KyPiA?key=yj4V8pHW144VjA9YlEbf1Q",
            alt: "Home",
            href: "/"
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
                href: "/g.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>`
            },
            {
                id: "a",
                tooltip: "Apps",
                href: "/a.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`
            },
            {
                id: "p",
                tooltip: "Browser",
                href: "/p.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
            },
            {
                id: "c",
                tooltip: "Contact",
                href: "/c.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
            },
            {
                id: "s",
                tooltip: "Settings",
                href: "/s.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`
            },
            {
                id: "vc",
                tooltip: "Chat",
                href: "/vc.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
            },
            {
                id: "vg",
                tooltip: "Void GPT",
                href: "/vg.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`
            },
            {
                id: "nvpro",
                tooltip: "VN PRO",
                href: "/vnpro.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`
            },
            {
                id: "vnmusic",
                tooltip: "Music",
                href: "/voidmusic.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
            },
            {
                id: "donate",
                tooltip: "Donate",
                href: "/donate.html",
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
            var extraClass = item.id === 'donate' ? ' di-donate' : '';
            return '<a href="' + item.href + '" class="di-item' + extraClass + '" data-tooltip="' + item.tooltip + '" data-nav-id="' + item.id + '">' + item.icon + '</a>';
        }).join('');

        return '<nav class="void-dynamic-island" data-dynamic-island="true">' +
            '<div class="di-section di-section-left">' +
                '<a href="' + footerConfig.logo.href + '" class="di-item di-logo" data-tooltip="' + footerConfig.logo.alt + '">' +
                    '<img src="' + footerConfig.logo.src + '" alt="' + footerConfig.logo.alt + '">' +
                '</a>' +
                '<a href="' + footerConfig.customButton.href + '" class="di-item di-discord" data-tooltip="' + footerConfig.customButton.tooltip + '" data-nav-id="' + footerConfig.customButton.id + '">' +
                    '<img src="' + footerConfig.customButton.src + '" alt="' + footerConfig.customButton.alt + '">' +
                '</a>' +
            '</div>' +
            '<div class="di-divider"></div>' +
            '<div class="di-nav-section">' + leftNavHTML + '</div>' +
            '<div class="di-divider"></div>' +
            '<div class="di-nav-section">' + rightNavHTML + '</div>' +
        '</nav>';
    }

    function injectCSS() {
        var existingStyles = document.querySelectorAll('style[data-dynamic-island]');
        for (var i = 0; i < existingStyles.length; i++) {
            existingStyles[i].parentNode.removeChild(existingStyles[i]);
        }
        var style = document.createElement('style');
        style.setAttribute('data-dynamic-island', 'true');
        style.textContent = footerCSS;
        document.head.appendChild(style);
    }

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
    }

    function setActiveNavItem() {
        var currentPath = window.location.pathname;
        var navItems = document.querySelectorAll('.di-item');
        for (var i = 0; i < navItems.length; i++) {
            navItems[i].classList.remove('active');
            var href = navItems[i].getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFooter);
    } else {
        initializeFooter();
    }

    window.addEventListener('popstate', setActiveNavItem);
})();
