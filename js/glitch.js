/**
 *
 * Copyright (c) 2019 suchu <https://githuboy.online>
 * Released under MIT License
 */
!function (window) {

    var _MAX_WIDTH_OFFSET = 10;

    var _DEFAULT_GLITCH_INTERVAL = 50;

    function _init() {
        this.timerId = 0;
        var canvas = document.createElement("canvas");
        var dummyCanvas = document.createElement("canvas");
        var imgNode = this.elem;
        canvas.width = imgNode.width;
        canvas.height = imgNode.height;
        dummyCanvas.width = imgNode.width;
        dummyCanvas.height = imgNode.height;
        this.canvas = canvas;
        this.canvas.className = "glitch";
        this.hratio = this.canvas.height / 430;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(this.elem, 0, 0);
        this.elem.parentNode.style = `width:${canvas.width}px;margin-right:0px;`;
        this.elem.parentNode.insertBefore(dummyCanvas, this.elem);
        this.elem.parentNode.replaceChild(canvas, this.elem);
        $(this.canvas).hover(function () {
            clearInterval(this.timerId);
            this.timerId = setInterval(this.process.bind(this), _DEFAULT_GLITCH_INTERVAL);
        }.bind(this), function () {
            clearInterval(this.timerId);
            this.ctx.drawImage(this.elem, 0, 0);
        }.bind(this));
    }
    function Glitch(imgNode) {
        if (imgNode && !imgNode.TAG === "IMG") {
            console.warn("target element not a <img> type", imgNode);
            return;
        }
        this.elem = imgNode;
        this.frame = 0;
        if (imgNode.width <= 0) {
            imgNode.onload = function () {
                _init.call(this);
            }.bind(this)
        } else {
            _init.call(this);
        }


        /**
         *  enerate the glitch slip effect
         * @param maxOffsetX Maximum the slip x from the coordinate
         * @param from The beginning of the canvas height;
         * @param to The ending of the canvas height
         */
        this.glitchSlip = function (maxOffsetX, from, to) {
            if (to < from) {
                var temp = to;
                to = from;
                from = temp;
            }
            for (var i = from; i < to; i++) {
                Math.random() < 0.1 && i++;//skip
                //The random x offset use for generate  the `slip` effect
                var x = Math.random() * maxOffsetX - maxOffsetX / 2;
                var imageData = this.ctx.getImageData(0, i, this.canvas.width, 1);
                this.ctx.putImageData(imageData, x, i);
            }
        };
        this.process = function () {
            var e = this.frame++;
            this.ctx.drawImage(this.elem, 0, 0);
            this.glitchSlip(_MAX_WIDTH_OFFSET, 200 * this.hratio, 300 * this.hratio);
            //When frame
            if (e % 100 > 90) {
                this.glitchSlip(_MAX_WIDTH_OFFSET, 100 * this.hratio * Math.random(), 400 * this.hratio * Math.random());
            }
        }
    }

    window.Glitch = Glitch;
}(window);