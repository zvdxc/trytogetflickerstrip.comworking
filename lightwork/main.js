require(['jquery','site/Pattern.js','view/EditPatternDialog.js','site/LoginPanel.js','site/LightworkBrowser.js','bootstrap'],function($,Pattern,EditPatternDialog,LoginPanel,LightworkBrowser) {
    $(document).ready(function() {
        window.platform = "desktop";
        var This = function() {
            this.host = "http://localhost:3000";
            this.editPatternDialog = new EditPatternDialog(this,{"type":"bitmap"});
            $(".lightworkEditor").empty().append(this.editPatternDialog.$el);

            $(this).on("LoadPattern",_.bind(function(e,pattern) {
                this.editPatternDialog.loadPattern(pattern);
            },this));

            this.loginPanel = new LoginPanel(this);
            $(".loginPanel").replaceWith(this.loginPanel.$el);

            this.lightworkBrowser = new LightworkBrowser(this);
            $(".lightworkBrowser").replaceWith(this.lightworkBrowser.$el);

            this.lightworkBrowser.$el.find(".newLightwork").click(_.bind(function() {
                var pattern = Pattern.DEFAULT_PATTERN.clone()
                pattern.body = pattern.pixelData;
                this.editPatternDialog.loadPattern(pattern);
            },this));
        }();
    });
});

