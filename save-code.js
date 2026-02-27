function downloadSave() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'void-save.json';
    a.click();
}

function uploadSave(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            for (var key in data) {
                localStorage.setItem(key, data[key]);
            }
            alert('Save loaded! Page will reload.');
            location.reload();
        } catch (err) {
            alert('Invalid save file!');
        }
    };
    reader.readAsText(file);
}

function initSaveCode() {
    var downloadBtn = document.getElementById('downloadSaveBtn');
    var uploadBtn = document.getElementById('uploadSaveBtn');
    var fileInput = document.getElementById('saveFileInput');
    var debugDiv = document.getElementById('debugInfo');
    
    if (debugDiv) {
        debugDiv.textContent = 'localStorage: ' + localStorage.length + ' items';
    }
    
    if (downloadBtn) {
        downloadBtn.onclick = downloadSave;
    }
    
    if (uploadBtn && fileInput) {
        uploadBtn.onclick = function() { fileInput.click(); };
        fileInput.onchange = function(e) {
            if (e.target.files[0]) {
                uploadSave(e.target.files[0]);
            }
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSaveCode);
} else {
    initSaveCode();
}
