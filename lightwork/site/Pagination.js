define(["jquery","text!site/Pagination.html","bootstrap"],
function($,template) {
    var This = function() {
        this.init.apply(this,arguments);
    }
    $.extend(This.prototype, {
        init:function(results) {
            this.$el = $("<div class='paginationContainer'/>");
            this.$el.html(template);

            var $pagination = this.$el.find(".pagination");
            for (var i=0; i<results.totalPages; i++) {
                var $el = $("<li><span>"+(i+1)+"</span></li>");
                if (i == results.page) $el.addClass("active");
                $el.data("page",i);
                $el.click(_.bind(function(e) {
                    $(this).trigger("PageSelected",[$(e.target).closest("li").data("page")]);
                },this));
                $pagination.append($el);
            }
        },
    });

    return This;
});


