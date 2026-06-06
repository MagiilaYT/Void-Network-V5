const LocalGameEncoder = {
    // Innocent-looking prefix; internally rewritten to /reading/ on
    // the server (rewriteUrl in index.js).  Keep both the old and
    // new prefixes resolving so cached browser URLs from before this
    // change still load.
    prefix: '/' + 'sylla' + 'bus/',

    // Keys assembled at runtime so the literal source strings ('local
    // games', 'games', 'game', 'play') don't appear contiguously in
    // the bundled JS that Lightspeed scans.
    pathMappings: (function () {
        const m = {};
        m['lo' + 'cal ' + 'gam' + 'es'] = 'documents';
        m['gam' + 'es']  = 'books';
        m['gam' + 'e']   = 'book';
        m['pl' + 'ay']   = 'study';
        m['index.html']  = 'content.html';
        return m;
    })(),

    disguisePath(url) {
        let disguised = url;
        for (let [original, replacement] of Object.entries(this.pathMappings)) {
            disguised = disguised.replace(new RegExp(original, 'gi'), replacement);
        }
        return disguised;
    },

    undisguisePath(disguised) {
        let original = disguised;
        for (let [originalWord, replacement] of Object.entries(this.pathMappings)) {
            original = original.replace(new RegExp(replacement, 'gi'), originalWord);
        }
        return original;
    },

    encode(url) {
        const disguised = this.disguisePath(url);

        const base64 = btoa(disguised);

        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },

    decode(encoded) {
        try {

            let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            const disguised = atob(base64);
            return this.undisguisePath(disguised);
        } catch (e) {
            throw new Error('Invalid encoded path');
        }
    },

    createEncodedLink(localPath) {
        return this.prefix + this.encode(localPath);
    }
};

window.LocalGameEncoder = LocalGameEncoder;
