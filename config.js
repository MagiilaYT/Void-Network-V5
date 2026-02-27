self.__uv$config = {
    prefix: '/~/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/lib/uv/handler.js',
    bundle: '/lib/uv/bundle.js',
    config: '/lib/uv/config.js',
    sw: '/lib/uv/sw.js',
};
