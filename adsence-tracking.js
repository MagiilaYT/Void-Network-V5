fetch('https://script.google.com/macros/s/AKfycbz1w3UhB-6o6JWDcwOfo7622pfuTLeTcL7O-rYinWuYl7JKS5sqk1hm652vWpEyf2nf/exec', {
    method: 'POST',
    body: JSON.stringify({ url: window.location.href })
}).catch(() => {});
