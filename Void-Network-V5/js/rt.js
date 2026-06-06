// Minimal runtime config for main thread. Contains only the encoder/decoder
// and route prefix — the fields used by gg.js, apps.js, game-loader.js etc.
// to build routed URLs. Vendor-bundle paths are only needed inside the SW
// context (where the full config file is imported separately).
(function () {
  function xorEncode(str) {
    if (!str) return str;
    var result = '';
    for (var i = 0; i < str.length; i++) {
      result += i % 2 ? String.fromCharCode(str.charCodeAt(i) ^ 2) : str[i];
    }
    return encodeURIComponent(result);
  }
  function xorDecode(str) {
    if (!str) return str;
    var parts = str.split('?');
    var input = parts.shift();
    var search = parts.join('?');
    var result = '';
    input = decodeURIComponent(input);
    for (var i = 0; i < input.length; i++) {
      result += i % 2 ? String.fromCharCode(input.charCodeAt(i) ^ 2) : input[i];
    }
    return result + (search ? '?' + search : '');
  }
  self.__ccfg = {
    prefix: '/~/px/',
    encodeUrl: xorEncode,
    decodeUrl: xorDecode,
  };
})();
