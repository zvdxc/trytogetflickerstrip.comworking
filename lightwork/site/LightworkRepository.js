define(["jquery","site/Pagination.js","site/Pattern.js",'view/LEDStripRenderer.js',"text!site/LightworkRepository.html","bootstrap"],
function($,Pagination,Pattern,LEDStripRenderer,template) {
    var This = function() {
        this.init.apply(this,arguments);
    }
    $.extend(This.prototype, {
        init:function(main) {
            this.main = main;
            this.$el = $("<div class='lightworkRepository'/>");
            this.$el.html(template);
            this.page = 0;

            $(this.main.loginPanel).on("UserUpdated",_.bind(this.refreshLightworks,this));

            this.refreshLightworks();
        },
        refreshLightworks:function() {
            $.getJSON(this.main.host+"/pattern?includeData&page="+this.page).done(_.bind(function(data) {
                var $lightworks = this.$el.find(".lightworks").empty();
                _.each(data.results,_.bind(function(item) {
                    var renderer = new LEDStripRenderer(150);
                    renderer.$el.hover(function() {
                        renderer.start();
                    }, function() {
                        renderer.stop();
                    });
                    var pattern = new Pattern();
                    pattern.deserializeFromJSON(JSON.stringify(item));
                    pattern.data = pattern.pixelData;
                    setTimeout(_.bind(function() {
                        renderer.resizeToParent();

                        renderer.setPattern(pattern);
                        renderer.stop();
                    },this),5);

                    var $div = $("<div class='flexParent flexHorizontal' />");
                    var $left = $("<div class='left flexShrink' />").appendTo($div);
                    var $name = $("<span class='name'>").text(pattern.name).appendTo($left);
                    var $author = $("<span class='author'>").text(pattern.owner.display).appendTo($left);

                    var $middle = $("<div class='middle flexShrink' />").appendTo($div);
                    var $upvote = $("<div class='up vote'><i class='glyphicon glyphicon-chevron-up'></i></div>").toggleClass("active",pattern.vote==1).appendTo($middle);
                    var $downvote = $("<div class='down vote'><i class='glyphicon glyphicon-chevron-down'></i></div>").toggleClass("active",pattern.vote==-1).appendTo($middle);

                    $middle.find(".vote").click(_.bind(function(e) {
                        var $el = $(e.target).closest(".vote");
                        var vote =  $el.is(".down") ? -1 : 1;
                        $.ajax({url:this.main.host+"/pattern/"+pattern.id+"/vote",method:"POST",data:{score:vote}});
                        $middle.find(".vote").removeClass("active");
                        $el.addClass("active");
                    },this));

                    var $right = $("<div class='right flexGrow' />").appendTo($div);

                    $right.append(renderer.$el);
                    $lightworks.append($div);
                },this));

                this.$el.find(".paginationContainer").each(_.bind(function(index,oldPaginationElement) {
                    var pagination = new Pagination(data)
                    $(pagination).on("PageSelected",_.bind(this.pageSelected,this));
                    $(oldPaginationElement).replaceWith(pagination.$el);
                },this));
            },this));
        },
        pageSelected:function(e,page) {
            this.page = page;
            this.refreshLightworks();
        },
    });

    return This;
});

