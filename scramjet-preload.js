(async function() {
    if (window.scramjetPreloaded && window.scramjet && window.scramjetInitialized) return;
    window.scramjetPreloaded = true;

    try {
        if (typeof BareMux === 'undefined') {
            await new Promise((resolve, reject) => {
                const s = document.createElement("script");
                s.src = "/baremux/index.js";
                s.onload = resolve;
                s.onerror = () => reject(new Error("Failed to load BareMux"));
                document.head.appendChild(s);
            });
        }

        if (typeof window.$scramjetLoadController !== "function") {
            await new Promise((resolve, reject) => {
                const s = document.createElement("script");
                s.src = "/scram/scramjet.all.js";
                s.onload = resolve;
                s.onerror = () => reject(new Error("Failed to load Scramjet"));
                document.head.appendChild(s);
            });
        }

        const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
        const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        await Promise.race([
            connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Transport timeout')), 10000))
        ]);

        const { ScramjetController } = window.$scramjetLoadController();
        window.scramjet = new ScramjetController({
            files: {
                wasm: "/scram/scramjet.wasm.wasm",
                all: "/scram/scramjet.all.js",
                sync: "/scram/scramjet.sync.js",
            },
            flags: {
                serviceworkers: false,
                syncxhr: false,
                strictRewrites: false,
                rewriterLogs: false,
                captureErrors: false,
                cleanErrors: false,
                scramitize: false,
                sourcemaps: false,
                destructureRewrites: false,
                interceptDownloads: false,
                allowInvalidJs: true
            }
        });

        if (navigator.serviceWorker) {
            await window.scramjet.init();
            const reg = await navigator.serviceWorker.register("/sw.js");
            if (reg.installing) {
                await Promise.race([
                    new Promise((resolve, reject) => {
                        reg.installing.addEventListener('statechange', e => {
                            if (e.target.state === 'activated') resolve();
                            else if (e.target.state === 'redundant') reject(new Error('SW became redundant'));
                        });
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('SW activation timeout')), 10000))
                ]);
            }
        }

        window.scramjetInitialized = true;
    } catch (e) {}
})();
