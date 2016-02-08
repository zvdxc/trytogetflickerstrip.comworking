requirejs.config({
    baseUrl: "./view/lib",
    "shim": {
        "jquery.spectrum"  : ["jquery"]
    },
    paths: {
        "view":"..",
        "tmpl":"../tmpl"
    }
});

require(['jquery','view/EditPatternDialog.js'],function($,EditPatternDialog) {
    window.platform = "desktop";
    var editPatternDialog = new EditPatternDialog({"type":"bitmap"});
    $("body").append(editPatternDialog.$el);
});

