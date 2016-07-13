({
    baseUrl: ".",
    "shim": {
        "bootstrap" : { "deps" :['jquery'] },
        "jquery.spectrum"  : { "deps" :["jquery"] },
    },
    paths: {
        "view":"./view",
        "tmpl":"./view/tmpl",
        "jquery":"./view/lib/jquery",
        "underscore":"./view/lib/underscore",
        "tinycolor":"./view/lib/tinycolor",
        "base64-js":"./view/lib/base64js",
        "text":"./view/lib/text",
        "jquery.spectrum":"./view/lib/jquery.spectrum",
        "bootstrap":"./view/lib/bootstrap.min",
    },
    include: ['./view/lib/require.js'],
    name: "main",
    out: "main-built.js"
})
