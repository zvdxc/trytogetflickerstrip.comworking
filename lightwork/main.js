require(['jquery','site/LightworkRepository.js','site/Pattern.js','view/EditPatternDialog.js','site/LoginPanel.js','site/LightworkBrowser.js','bootstrap'],function($,LightworkRepository,Pattern,EditPatternDialog,LoginPanel,LightworkBrowser) {
    $(document).ready(function() {

        var debug = window.location.host == "localhost";
        
        window.platform = "desktop";
        var This = function() {
            this.host = debug ? "http://localhost:3000" : "https://lightwork.hohmbody.com";

            this.editorActive = !(window.location.search.indexOf("browse") >= 0);
            $(".mainContainer").toggleClass("editorActive",this.editorActive);

            this.loginPanel = new LoginPanel(this);
            $(".loginPanel").replaceWith(this.loginPanel.$el.attr("class",$(".loginPanel").attr("class")));

            if (this.editorActive) {
                this.editPatternDialog = new EditPatternDialog(this,{"type":"bitmap"});
                $(".lightworkEditor").empty().append(this.editPatternDialog.$el);
                console.log(window.location);
                if (window.location.search.indexOf("?id=") === 0) {
                    var loadId = parseInt(window.location.search.substring(4));
                    $.blockUI();
                    setTimeout(_.bind(function() {
                        var opt = {
                            type:"GET",
                            url:this.host+"/pattern/"+loadId,
                            dataType:"text",
                        };

                        $.ajax(opt).success(_.bind(function(jsonString) {
                            var pattern = new Pattern();
                            pattern.deserializeFromJSON(jsonString);

                            pattern.body = pattern.pixelData;
                            $(this).trigger("LoadPattern",pattern);
                            this.editPatternDialog.$el.addClass("loadedPattern");
                            $.unblockUI();
                        },this));
                    },this),100);
                    console.log("load id",loadId);
                }

                window.stuff  = function() {
                    var p = new Pattern();
                    _.extend(p,this.editPatternDialog.pattern);
                    p.pixelData = p.body;
                    delete p.body;
                    delete p.palette;
                    delete p.type;
                    delete p.data;
                    console.log(p);
                    return p.serializeToJSON();
                }


                $(this).on("LoadPattern",_.bind(function(e,pattern) {
                    this.editPatternDialog.loadPattern(pattern);
                },this));

                this.lightworkBrowser = new LightworkBrowser(this);
                $(".lightworkBrowser").replaceWith(this.lightworkBrowser.$el.attr("class",$(".lightworkBrowser").attr("class")));

                this.lightworkBrowser.$el.find(".newLightwork").click(_.bind(function() {
                    var pattern = Pattern.DEFAULT_PATTERN.clone()
                    pattern.body = pattern.pixelData;
                    this.editPatternDialog.$el.removeClass("loadedPattern");
                    this.editPatternDialog.loadPattern(pattern);
                },this));
            } else {
                this.lightworkRepository = new LightworkRepository(this);
                $(".lightworkRepository").replaceWith(this.lightworkRepository.$el.attr("class",$(".lightworkRepository").attr("class")));
            }
        }();
    });
});

