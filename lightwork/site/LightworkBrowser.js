define(["jquery","site/Pattern.js","text!site/LightworkBrowser.html","bootstrap"],
function($,Pattern,template) {
    var This = function() {
        this.init.apply(this,arguments);
    }

    function deserializePatternForDownload(b64) {
        var content = atob(b64);
        var loc = content.indexOf("\n\n");
        var headerraw = content.substring(0,loc);
        var body = content.substring(loc+2);

        var pattern = {};
        _.each(headerraw.split("\n"),function(line) {
            if (line == "") return;
            var index = line.indexOf(":");
            var tokens = [line.substring(0,index),line.substring(index+1)];
            if (tokens[1][0] == "[" || tokens[1][0] == "{") {
                //assume json
                tokens[1] = JSON.parse(tokens[1]);
            }
            pattern[tokens[0]] = tokens[1];
        });

        pattern.body = body[0] == "[" || body[0] == "{" ? JSON.parse(body) : body;
        return pattern;
    }

    $.extend(This.prototype, {
        init:function(main) {
            this.main = main;
            this.$el = $("<div class='lightworkBrowser'/>");
            this.$el.html(template);

            $(this.main.loginPanel).on("UserUpdated",_.bind(this.loadPatterns,this));

            $(this.main).on("SavePattern",_.bind(this.savePattern,this));
        },
        savePattern:function(e,pattern) {
            var patternObject = new Pattern();
            _.extend(patternObject,pattern);

            patternObject.pixelData = patternObject.body;

            delete patternObject.data;
            delete patternObject.body;

            if (pattern.id) {
                var opt = {
                    type:"POST",
                    contentType: "application/json; charset=utf-8",
                    data:patternObject.serializeToJSON(),
                    url:this.main.host+"/pattern/"+pattern.id+"/update"
                };

                $.ajax(opt).done(_.bind(this.loadPatterns,this));
            } else {
                var opt = {
                    type:"POST",
                    contentType: "application/json; charset=utf-8",
                    data:patternObject.serializeToJSON(),
                    url:this.main.host+"/pattern/create",
                };

                $.ajax(opt).done(_.bind(this.loadPatterns,this));
            }
        },
        loadPatterns:function() {
            var opt = {
                type:"GET",
                dataType:"json",
                url:this.main.host+"/user/"+this.main.loginPanel.currentUser.id+"/patterns",
            };

            $.ajax(opt).success(_.bind(function(patterns) {
                var $lightworkList = this.$el.find(".lightworkList").empty();
                _.each(patterns,_.bind(function(pattern) {
                    var $el = $("<li class='list-group-item'></li>");
                    $el.text(pattern.name);
                    $el.click(_.bind(function() {
                        this.loadLightwork(pattern);
                    },this));

                    $lightworkList.append($el);
                },this));
            },this));
        },
        loadLightwork:function(pattern) {
            var opt = {
                type:"GET",
                url:this.main.host+"/pattern/"+pattern.id,
                dataType:"text",
            };

            $.ajax(opt).success(_.bind(function(jsonString) {
                var pattern = new Pattern();
                pattern.deserializeFromJSON(jsonString);

                pattern.body = pattern.pixelData;
                $(this.main).trigger("LoadPattern",pattern);
            },this));
        }
    });

    return This;
});

