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
