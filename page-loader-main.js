window.VoidNetworkLoader = {
    scriptsList: [
        '/assets/footer/footer.js',
        '/assets/js/settings.js', 
        '/assets/js/blank.js',
        '/assets/js/particles.js'
    ],
    
    addScript: function(scriptPath) {
        if (!this.scriptsList.includes(scriptPath)) {
            this.scriptsList.push(scriptPath);
        }
    },
    
    addScripts: function(scriptPaths) {
        scriptPaths.forEach(path => this.addScript(path));
    },
    
    loadAllScripts: function() {
        // Check which scripts are already in the DOM (added as <script defer> in HTML)
        const existingSrcs = new Set();
        document.querySelectorAll('script[src]').forEach(s => {
            try { existingSrcs.add(new URL(s.src).pathname); } catch {}
        });

        this.scriptsList.forEach(scriptPath => {
            // Normalize to absolute path for comparison
            const absPath = scriptPath.startsWith('/') ? scriptPath : '/' + scriptPath;
            if (existingSrcs.has(absPath)) return; // Already loaded via HTML

            const script = document.createElement('script');
            script.src = scriptPath;
            document.head.appendChild(script);
        });
    },

    init: function() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAllScripts());
        } else {
            this.loadAllScripts();
        }
    }
};

window.addScript = function(scriptPath) {
    window.VoidNetworkLoader.addScript(scriptPath);
};

window.addScripts = function(scriptPaths) {
    window.VoidNetworkLoader.addScripts(scriptPaths);
};

(function() {
    const currentScript = document.currentScript;
    if (currentScript) {
        const additionalScripts = currentScript.getAttribute('data-scripts');
        if (additionalScripts) {
            const scripts = additionalScripts.split(',').map(s => s.trim());
            window.VoidNetworkLoader.addScripts(scripts);
        }
    }
})();

window.VoidNetworkLoader.init();
