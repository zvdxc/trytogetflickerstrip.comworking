requirejs.config({
    baseUrl: "./view/lib",
    "shim": {
        "bootstrap" : { "deps" :['jquery'] },
        "jquery.spectrum"  : { "deps" :["jquery"] },
    },
    paths: {
        "view":"..",
        "tmpl":"../tmpl",
        "bootstrap" :  "bootstrap.min"
    }
});

require(['jquery','view/EditPatternDialog.js','bootstrap'],function($,EditPatternDialog) {
    $(document).ready(function() {
        //setTimeout(function() {
            window.platform = "desktop";
            var editPatternDialog = new EditPatternDialog({"type":"bitmap"});
            $(".lightworkEditor").empty().append(editPatternDialog.$el);
        //},500);
    });
});

