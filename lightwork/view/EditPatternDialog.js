define(["jquery","tinycolor","view/util.js","view/LEDStripRenderer.js","view/CanvasPixelEditor","text!tmpl/editPatternDialog.html"],
function($,tinycolor,util,LEDStripRenderer,CanvasPixelEditor,desktop_template) {
    var This = function() {
        this.init.apply(this,arguments);
    }
    
    var defaultBody = '({\n\tcontrols:[\n\t\t{name: "Repetitions",id:"num",type:"numeric",default:"3"}\n\t],\n\tpattern:function(args) {\n\t\tthis.pixels=150;\n\t\tthis.frames=150;\n\t\tthis.fps=30;\n\t\tthis.render=function(x,t) {\n\t\t\tvar v = 360* ((x+t) % (this.pixels/parseInt(args.num)))/(this.pixels/parseInt(args.num))\n\t\t\treturn {h:v,s:100,v:100};\n\t\t}\n\t\treturn this;\n\t}\n})\n';

    var defaultPixelPattern = {
        pixels:7,
        fps:3,
        frames:7,
        type:"bitmap",
        body:[0,0,0,0,0,0,0,0,0,251,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,251,255,0,255,170,0,251,255,0,0,0,0,0,0,0,0,0,0,251,255,0,255,170,0,255,0,0,255,170,0,251,255,0,0,0,0,251,255,0,255,170,0,255,0,0,255,255,255,255,0,0,255,170,0,251,255,0,0,0,0,251,255,0,255,170,0,255,0,0,255,170,0,251,255,0,0,0,0,0,0,0,0,0,0,251,255,0,255,170,0,251,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,251,255,0,0,0,0,0,0,0,0,0,0],
        palette:[
            [0,0,0],
            [255,255,255],
            [255,0,0],
            [255,255,0],
            [0,255,0],
            [0,255,255],
            [0,0,255]
        ]
    };

    function resizePalette(original,paletteSize) {
        var palette = $.extend([],original);
        while(palette.length < paletteSize) palette.push([255,255,255]);
        while(palette.length > paletteSize) palette.pop();
        return palette;
    }

    function createCanvas(width,height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        var g=canvas.getContext("2d");
        g.fillStyle = "#000";
        g.fillRect(0,0,width,height);

        return canvas;
    }

    function serializePattern(pattern) {
        var out = "";
        _.each(pattern,function(value,key) {
            if (key == "body" || key == "rendered" || key == "path") return;
            if (typeof value == "string") {
                out += key+":"+value+"\n";
            } else {
                out += key+":"+JSON.stringify(value)+"\n";
            }
        })
        out += "\n";
        var body = typeof(pattern.body) == "string" ? pattern.body : JSON.stringify(pattern.body);
        out += body;
        return btoa(out);
    }

    function deserializePattern(b64) {
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
        init:function(pattern) {
            this.pattern = $.extend({},pattern);
			this.widgets = [];
            this.$el = $("<div class='editPatternDialog'/>");

            if (window.location.hash) {
                this.pattern = deserializePattern(window.location.hash.substring(1));
            }

            this.$el.append(desktop_template);
            this.$el = this.$el.children();

            this.$el.find(".hideButton").click(_.bind(function(e) {
                e.preventDefault();
                this.hide()
            },this));

            if (!this.pattern.name) this.pattern.name = "New Lightwork";

            this.$preview = this.$el.find(".patternPreview");
            this.stripRenderer = new LEDStripRenderer(150);
            this.$preview.empty().append(this.stripRenderer.$el);
            setTimeout(_.bind(function() {
                this.stripRenderer.resizeToParent();
            },this),5);

            $(window).on("resize",_.bind(function() {
                this.stripRenderer.resizeToParent();
                this.editor.resizeToParent();
            },this));

            this.$el.find(".titletext").text(this.pattern.name);
            this.$el.find(".titletext").click(_.bind(function(e) {
                e.preventDefault();
                var name = prompt("Pattern name",this.pattern.name);
                if (name == null) return;
                this.pattern.name = name;
                this.$el.find(".titletext").text(this.pattern.name);
            },this));

            this.$el.find(".patternControls").addClass("hide");
            this.$el.find(".savePattern").click(_.bind(function(e) {
                e.preventDefault();
                var target = e.target;
                var pattern = this.pattern;
                var name = prompt("Choose a name for your pattern: ",pattern.name);
                if (!name) return;
                pattern.name = name;
                var b64 = serializePattern(pattern);
                target.download=name+".pattern";
                target.href="data:;base64,"+b64;
            },this));

            this.$el.find(".openPattern input").change(_.bind(function(e) {
                if (e.target.files.length == 0) return;
                var file = e.target.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                $(reader).on("load",_.bind(function(e) {
                    var preamble = "data:;base64,";
                    var dataUrl = e.target.result;
                    this.$el.find(".openPattern input").val("");
                    if (!dataUrl.startsWith(preamble)) {
                        alert("Invalid pattern file");
                        throw "Invalid pattern file!";
                    }
                    var b64 = dataUrl.substring(preamble.length);
                    this.pattern = deserializePattern(b64);

                    this.canvas = util.renderPattern(this.pattern.body,this.pattern.pixels,this.pattern.frames,null,null,false,false);
                    this.editor.setImage(this.canvas);
                    this.editor.setFps(this.pattern.fps);

                    this.updateEditor();
                    this.updatePattern();
                },this));
            },this));

            this.$el.find(".openConsole").hide();
            this.$el.find(".patternControls").removeClass("hide");

            this.pattern = $.extend({},defaultPixelPattern,this.pattern);
            var palette = resizePalette(this.pattern.palette,10);
            this.editor = new CanvasPixelEditor(null,palette);
            $(this.editor).on("PaletteUpdated",_.bind(function(e,palette) {
                this.pattern.palette = palette;
            },this));
            
            $(this.canvas).css("border","1px solid black");

            this.canvas = util.renderPattern(this.pattern.body,this.pattern.pixels,this.pattern.frames,null,null,false,false);
            this.editor.setImage(this.canvas);

            this.$el.find(".metricsPanel input").change(_.bind(function() {
                this.pattern.fps = parseInt(this.$fps.val()); //TODO upgeade to float
                this.pattern.frames = parseInt(this.$frames.val())
                this.pattern.pixels = parseInt(this.$pixels.val());
                if (!this.pattern.fps || this.pattern.fps < 1) this.pattern.fps = 1;
                if (!this.pattern.frames || this.pattern.frames < 1) this.pattern.frames = 1;
                if (!this.pattern.pixels || this.pattern.pixels < 1) this.pattern.pixels = 1;

                this.updateEditor();
                this.updatePattern();
            },this));

            $(this.editor).on("change",_.bind(function(e) {
                this.doUpdateDelay();
            },this));

            this.$el.find(".controls").replaceWith(this.editor.$controls);
            this.$el.find(".editorcontainer").append(this.editor.$el);
            setTimeout(_.bind(function() {
                this.editor.resizeToParent();
            },this),5);

            this.$fps = this.$el.find(".metricsPanel .fps");
            this.$frames = this.$el.find(".metricsPanel .frames");
            this.$pixels = this.$el.find(".metricsPanel .pixels");
            this.updateEditor();

            this.pattern.body = util.canvasToBytes(this.canvas);
            this.updateRendered();
        },
        updateEditor:function() {
            this.$frames.val(this.pattern.frames);
            this.$pixels.val(this.pattern.pixels);
            this.$fps.val(this.pattern.fps);
            this.editor.setFps(this.pattern.fps);
            this.editor.setCanvasSize(this.pattern.pixels,this.pattern.frames);
        },
        savePatternClicked:function() {
            this.updatePattern();
            $(this).trigger("Save",this.pattern);
        },
        updatePattern:function() {
            if (this.pattern.type == "javascript") {
                this.pattern.body = this.editor.getValue();
            } else if (this.pattern.type == "bitmap") {
                this.pattern.body = util.canvasToBytes(this.canvas,false);
            }

            window.location.hash=serializePattern(this.pattern);

            this.updateRendered();
        },
        updateRendered:function() {
            util.evaluatePattern(this.pattern);
            this.stripRenderer.setPattern(this.pattern.rendered);
        },
        doUpdateDelay:function() {
            if (this.updateDelay) clearTimeout(this.updateDelay);
            this.updateDelay = setTimeout(_.bind(this.updatePattern,this),500);
        },
        destroy:function() {
            if (this.stripRenderer) this.stripRenderer.destroy();
        }
    });

    return This;
});
