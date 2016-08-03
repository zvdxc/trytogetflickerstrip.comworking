define(["jquery","view/SelectList.js","site/Pattern.js","text!site/LightworkBrowser.html","bootstrap","jquery.blockUI"],
function($,SelectList,Pattern,template) {
    var This = function() {
        this.init.apply(this,arguments);
    }

    $.blockUI.defaults.message = "<div class='loadingIndicator'><span class='glyphicon glyphicon-repeat spinning'></span></div>";
    delete $.blockUI.defaults.css.border;
    delete $.blockUI.defaults.css.backgroundColor;
    $.blockUI.defaults.fadeIn = 0;

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

            $(this.main.loginPanel).on("UserUpdated",_.bind(this.reloadUserPatterns,this));

            $(this.main).on("SavePattern",_.bind(this.savePattern,this));
            $(this.main).on("DeleteLightwork",_.bind(this.deleteLightwork,this));
        },
        deleteLightwork:function(e,pattern) {
            var opt = {
                type:"POST",
                contentType: "application/json; charset=utf-8",
                url:this.main.host+"/pattern/"+pattern.id+"/delete"
            };

            $.ajax(opt).done(_.bind(function() {
                this.patternSelectList.each(_.bind(function(obj,$el) {
                    if (obj.id == pattern.id) {
                        $el.remove();
                    }
                },this));
            },this));
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

                $.ajax(opt).done(_.bind(function(dbPattern) {
                    this.patternSelectList.each(_.bind(function(obj,$el) {
                        if (obj.id == pattern.id) {
                            _.extend(obj,pattern);
                            this.patternSelectList.updateElement(obj);
                        }
                    },this));
                },this));
            } else {
                var opt = {
                    type:"POST",
                    contentType: "application/json; charset=utf-8",
                    data:patternObject.serializeToJSON(),
                    url:this.main.host+"/pattern/create",
                };

                $.ajax(opt).done(_.bind(function(pattern) {
                    this.patternSelectList.addElement(pattern,null,0);
                },this));
            }
        },
        populateList:function(patterns,append) {
            if (append) {
                this.patternSelectList.addElements(patterns);
            } else {
                var $lightworkList = this.$el.find(".lightworkList").empty();
                this.patternSelectList = new SelectList(patterns,this.patternOptionRenderer,{multiple:false});
                this.$el.find(".lightworkList").empty().append(this.patternSelectList.$el);

                $(this.patternSelectList).on("change",_.bind(this.patternSelected,this));
                $(this.patternSelectList).on("MoreClicked",_.bind(this.loadMore,this));
            }
        },
        loadMore:function(e,pagination) {
            this.loadUserPatterns(pagination.page+1,true);
        },
        patternOptionRenderer:function(pattern,$el) {
            if ($el) {
                $el.find(".name").text(pattern.name);
                $el.find(".published").toggle(pattern.published);
            } else {
                $el = $("<li class='list-group-item listElement' />");
                $el.append($("<span class='name'></span>").text(pattern.name));
                $el.append($("<span class='published glyphicon glyphicon-globe'></span>").toggle(pattern.published === true));
            }
            return $el;
        },
        reloadUserPatterns:function() {
            this.loadUserPatterns();
        },
        loadUserPatterns:function(page,append) {
            page = page || 0;
            var opt = {
                type:"GET",
                dataType:"json",
                url:this.main.host+"/user/"+this.main.loginPanel.currentUser.id+"/patterns?size=20&page="+page,
            };

            if (this.main.loginPanel.currentUser.email == "admin@hohmbody.com") {
                opt.url = this.main.host+"/pattern?all&size=20&page="+page;
            }

            $.ajax(opt).success(_.bind(function(json) {
                this.populateList(json,append);
            },this));
        },
        patternSelected:function(e,selectedObjects,selectedIndexes) {
            $.blockUI();
    
            if (selectedObjects.length != 1) return;
            var pattern = selectedObjects[0];

            setTimeout(_.bind(function() {
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
                    $.unblockUI();
                },this));
            },this),100);
        }
    });

    return This;
});

