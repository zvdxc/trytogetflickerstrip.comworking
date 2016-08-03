define(["jquery","text!site/Pagination.html","bootstrap"],
function($,template) {
    var This = function() {
        this.init.apply(this,arguments);
    }
    $.extend(This.prototype, {
        init:function(results,sortTypes) {
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

            var sorting = this.$el.find(".sorting").toggle(sortTypes != undefined);
            if (sortTypes) {
                var currentSorting = results.sortBy.split(" ");
                sorting.find(".currentSort").text(sortTypes[currentSorting[0]].display);
                var $sortTypes = sorting.find(".sortTypes");
                _.each(sortTypes,_.bind(function(item,key) {
                    var $el = $("<li><a href='#' class=''></a></li>");
                    $el.data("sortBy",key);
                    $el.data("ascending",key == currentSorting[0] ? currentSorting[1] == "DESC" : item.defaultAscending);
                    $el.find("a").text(item.display).click(_.bind(function(e) {
                        var sortBy = $(e.target).closest("li").data("sortBy");
                        var ascending = $(e.target).closest("li").data("ascending");
                        $(this).trigger("SortingUpdated",[sortBy,ascending]);
                    },this));
                    $sortTypes.append($el);
                },this));
                sorting.find("button").dropdown()
            }
        },
    });

    return This;
});


