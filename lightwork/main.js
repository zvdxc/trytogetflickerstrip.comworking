requirejs.config({
    baseUrl: "./view/lib",
    "shim": {
        "bootstrap" : { "deps" :['jquery'] },
        "jquery.spectrum"  : { "deps" :["jquery"] },
    },
    paths: {
        "view":"..",
        "tmpl":"../tmpl",
        "bootstrap" :  "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min"
    }
});

require(['jquery','view/EditPatternDialog.js'],function($,EditPatternDialog) {
    $(document).ready(function() {
        window.platform = "desktop";
        var editPatternDialog = new EditPatternDialog({"type":"bitmap"});
        $(".lightworkEditor").empty().append(editPatternDialog.$el);
    });
});

