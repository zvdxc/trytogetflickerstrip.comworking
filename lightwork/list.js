requirejs.config({
    baseUrl: "./view/lib",
    "shim": {
        "bootstrap" : { "deps" :['jquery'] },
        "jquery.spectrum"  : ["jquery"]
    },
    paths: {
        "view":"..",
        "tmpl":"../tmpl",
        "bootstrap" :  "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min"
    }
});

function deserializePattern(b64) {
    var content = atob(b64);
    var loc = content.indexOf("\n\n");
    var headerraw = content.substring(0,loc);
    var body = content.substring(loc+2);

    var pattern = {};
    var split = headerraw.split(",");
    pattern.name = split[0];
    pattern.frames = split[1];
    pattern.fps = split[2];
    pattern.pixels = split[3];
    if (split.length >= 5) pattern.datastring = split[4];

    var bytes = [];
    for (var i=0; i<body.length; i++) {
        bytes.push(body.charCodeAt(i));
    }
    pattern.body = bytes;
    return pattern;
}

function serializePattern(pattern,datastring) {
    var out = "";
    out += pattern.name+",";
    out += pattern.frames+",";
    out += pattern.fps+",";
    out += pattern.pixels+","
    out += (datastring ? datastring : "");
    out += "\n\n";
    var bstring="";
    for (var i = 0; i < pattern.body.length; i++) {
        bstring += String.fromCharCode( pattern.body[ i ] );
    }
    out += bstring;
    return btoa(out);
}

var dels = [];
require(['jquery','underscore','moment','view/LEDStripRenderer.js','view/util.js'],function($,_,moment,LEDStripRenderer,util) {
    window.platform = "desktop";
    var $lw = $(".lightworks");

    if (window.location.hash == "#LOGGED") {
        $.get("patterns.txt",function(txt) {
            var patterns = txt.split("\n")
            _.each(patterns,_.bind(function(pat) {
                var renderer = new LEDStripRenderer(150);
                $lw.append(renderer.$el);
                var pattern = deserializePattern(pat);
                pattern.type = "bitmap";
                renderer.$el.click(function() {
                    $.post("./lightworks.php?create",serializePattern(pattern),function(result) {
                        renderer.$el.css("outline","2px solid blue");
                        console.log("created result: "+result.id);
                    });
                });
                setTimeout(_.bind(function() {
                    renderer.resizeToParent();
                    util.evaluatePattern(pattern);
                    renderer.setPattern(pattern.rendered);
                },this),5);
            },this));
        });
    }

    function renderShared(shared) {
        var created = moment(shared.created).format("MMMM Do YYYY, h:mm a");
        var renderer = new LEDStripRenderer(150);
        var $div = $("<div></div>");
        var url = "index.html#"+shared.id;
        $div.append("<div class='posted'><a href='"+url+"'>#"+shared.id+"</a> "+created+"</div>");
        $div.append(renderer.$el);
        renderer.$el.click(function() {
            if (window.location.hash = "#DELETE") {
                dels.push(shared.id);
                renderer.$el.css("outline","2px solid red");
                console.log(dels.join(","));
            } else {
                window.location = url;
            }
        });
        try {
            var pattern = deserializePattern(shared.payload);
            pattern.type = "bitmap";
            setTimeout(_.bind(function() {
                renderer.resizeToParent();

                util.evaluatePattern(pattern);
                renderer.setPattern(pattern.rendered);
            },this),5);
        } catch (e) {
            console.log("err",shared.id,e);
        }
        return $div;
    }

    var sharedPatterns = null;
    var pageSize = 10;

    function renderPage(page) {
        var $el = $(".elements").empty();
        $(".pagination li").removeClass("active");
        $(".pagination [data-page="+page+"]").addClass("active");
        for (var i=page*pageSize; i<(page+1)*pageSize; i++) {
            if (!sharedPatterns[i]) continue;
            $el.append(renderShared(sharedPatterns[i]));
        }
        return $el;
    }

    function renderPagination(pages) {
        var $el = $("<ul class='pagination'></ul>");
        for (var i=0; i<pages; i++) {
            var $a = $("<a href='#'></a>");
            $a.text(i+1);
            $a.data("page",i);
            $a.click(function(e) {
                var page = $(this).data("page");
                renderPage(page);
            });
            var $li = $("<li></li>").append($a);
            $li.attr("data-page",i);
            $el.append($li);
        }
        return $el;
    }

    $.get("lightworks.php?list",function(data) {
        sharedPatterns = data;
        var pages = sharedPatterns.length / pageSize;

        var $pagination = renderPagination(pages);
        $(".pagination").each(function() {
            $(this).replaceWith($pagination.clone(true));
        });
        renderPage(0);
    });
});


