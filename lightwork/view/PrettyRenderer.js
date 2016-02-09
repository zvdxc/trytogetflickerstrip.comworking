define(['jquery','underscore','tinycolor',"view/util.js"],function($,_,tinycolor,util) {
    var This = function() {
        this.init.apply(this,arguments);
    }

    $.extend(This.prototype,{
        init:function(stripLength) {
            window.pr = this;
            var canvas = document.createElement("canvas");
            canvas.width = 500;
            canvas.height = 80;

            this.i = 0;

            this.canvas = canvas;
            this.$el = $(this.canvas);

            this.repaint();
        },
		setTimer:function(fps) {
			if (this.runningTimer != null) clearInterval(this.runningTimer);
			if (fps != null) this.runningTimer = setInterval(_.bind(this.requestFrame,this),1000.0/fps);
		},
        resizeToParent:function() {
            this.canvas.height = this.$el.parent().height();
            this.canvas.width = this.$el.parent().width();

            this.generateScene();

			this.repaint();
        },

        generateScene:function() {
            var Lamp = illuminated.Lamp;
            var RectangleObject = illuminated.RectangleObject;
            var DiscObject = illuminated.DiscObject;
            var Vec2 = illuminated.Vec2;
            var Lighting = illuminated.Lighting;

            this.lights = [];
            this.lighting = [];
            var margin = 50;
            var availableSpace = this.canvas.width - margin*2;
            var n = availableSpace/70;
            var lightSeparation = availableSpace / (n-1);
            var bottomMargin = 15;
            for (var i=0; i<n; i++) {
                var lamp = new Lamp({
                    position: new Vec2(margin+lightSeparation*i, this.canvas.height-bottomMargin),
                    color: '#f00',
                    distance: 45,
                    diffuse: 0.5,
                    radius: 5,
                    samples: 2,
                    angle: Math.PI/2,
                    roughness: 1,
                });

                this.lights.push(lamp);
                this.lighting.push(new Lighting({
                    light: lamp,
                    objects: [],
                }));
            }
        },
        repaint:function() {
            var g = this.canvas.getContext("2d");
            this.paint(g);
        },
        stop:function() {
			this.setTimer(null);
            this.running = false;
        },
        start:function() {
			this.setTimer(5);
            this.running = true;
        },
		requestFrame:function() {
            this.canvas.ownerDocument.defaultView.requestAnimationFrame(_.bind(this.repaint,this));
		},
        setLightColors:function(colorData) {
            for (var i=0; i<this.lights.length; i++) {
                var dataIndex = i % colorData.width;
                var r = colorData.data[dataIndex*4];
                var g = colorData.data[dataIndex*4+1];
                var b = colorData.data[dataIndex*4+2];
                this.lights[i].color = 'rgb('+r+','+g+','+b+')';
            }
            this.repaint();
        },
        paint:function(g) {
            if (!this.lights) return;

            g.fillStyle = "black";
            g.fillRect(0, 0, this.canvas.width, this.canvas.height);

            //this.lights[0].color = 'rgb('+this.i*10+',255,0)';

            _.each(this.lighting,_.bind(function(lighting) {
                lighting.compute(this.canvas.width, this.canvas.height);
                g.globalCompositeOperation = "lighter";
                lighting.render(g);
            },this));

            g.globalCompositeOperation = "source-over";

            var ledWidth = 30;
            var ledHeight = 10;
            var separation = 2;
            for (var i=0; i<this.lights.length; i++) {
                var light = this.lights[i];
                g.fillStyle = "white";
                var sx = light.position.x - ledWidth/2;
                var sy = light.position.y + separation;
                g.fillRect(sx,sy,ledWidth,ledHeight);
                g.fillStyle = light.color;
                sx = light.position.x - ledWidth/4;
                sy = light.position.y + separation;
                g.fillRect(sx,sy,ledWidth/2,ledHeight);
            }

            g.strokeStyle = "#ddd";
            g.moveTo(0,this.lights[0].position.y+separation);
            g.lineTo(this.canvas.width,this.lights[0].position.y+separation);
            g.stroke();

            g.moveTo(0,this.lights[0].position.y+separation+ledHeight);
            g.lineTo(this.canvas.width,this.lights[0].position.y+separation+ledHeight);
            g.stroke();

        }
    });

    return This;
});
