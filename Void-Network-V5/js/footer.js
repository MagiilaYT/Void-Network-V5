(function() {
    'use strict';

    const footerConfig = {
        logo: {
            src: ".../images/vnbannerv5.png",
            alt: "Home",
            href: "/home.html"
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
                href: "/vnprononauth.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`
            },
            {
                id: "vnmusic",
                tooltip: "Music",
                href: "/voidmusic.html",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
            },
            {
                id: "vxl",
                tooltip: "VXL",
                href: "/vxl.html",
                icon: `<img src="https://lh7-rt.googleusercontent.com/formsz/AN7BsVCZS77iPCbsL6XGud7tVlxqmsZmr2MA6sBgUXcwtGvo-12kjlX9kqU2QhruZQSu9ztuThbrbdaFklDFvLCBiYgvN-XG86mhqGtVyg4dTDa_D5r_n_OYgAN0fkBEMJQ-LVwXkMJ3AaYXD0reBVTwTstoOy85V_WDWmCpuw=s64?key=fPApFUiXQxbHmau6r-uvmA" alt="VXL" width="26" height="26" loading="lazy" decoding="async">`
            },
            {
                id: "voidgames",
                tooltip: "Void Games",
                href: "/sciencework/vg/",
                icon: `<img src="/sciencework/vg/assets/voidcoin.png" alt="Void Games" width="26" height="26" loading="lazy" decoding="async">`
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
