define(["jquery","view/SelectList.js","site/Pattern.js","text!site/LightworkBrowser.html","bootstrap"],
function($,SelectList,Pattern,template) {
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

            $(this.main.loginPanel).on("UserUpdated",_.bind(this.loadUserPatterns,this));

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

                $.ajax(opt).done(_.bind(this.loadUserPatterns,this));
            } else {
                var opt = {
                    type:"POST",
                    contentType: "application/json; charset=utf-8",
                    data:patternObject.serializeToJSON(),
                    url:this.main.host+"/pattern/create",
                };

                $.ajax(opt).done(_.bind(this.loadUserPatterns,this));
            }
        },
        populateList:function(patterns) {
            this.patternSelectList = new SelectList(patterns,this.patternOptionRenderer,{multiple:false});
            this.$el.find(".lightworkList").empty().append(this.patternSelectList.$el);

            $(this.patternSelectList).on("change",_.bind(this.patternSelected,this));
        },
        patternOptionRenderer:function(pattern,$el) {
            if ($el) {
                $el.find(".name").text(pattern.name);
                $el.find(".published").toggle(pattern.published);
            } else {
                $el = $("<li class='list-group-item listElement' />");
                $el.append($("<span class='name'></span>").text(pattern.name));
                $el.append($("<span class='published glyphicon glyphicon-globe'></span>").toggle(pattern.published));
            }
            return $el;
        },
        loadUserPatterns:function() {
            var opt = {
                type:"GET",
                dataType:"json",
                url:this.main.host+"/user/"+this.main.loginPanel.currentUser.id+"/patterns",
            };

            $.ajax(opt).success(_.bind(function(patterns) {
                var $lightworkList = this.$el.find(".lightworkList").empty();
                this.populateList(patterns);
            },this));
        },
        patternSelected:function(e,selectedObjects,selectedIndexes) {
            if (selectedObjects.length != 1) return;
            var pattern = selectedObjects[0];

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

