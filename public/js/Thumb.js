FLIPBOOK.Thumb = function (src, width, height, index) {
    this.image = new Image();
    this.image.src = 'images/preloader.jpg';
    this.image.style.width = String(width)+'px';
    this.image.style.height = String(height)+'px';
    this.imageSrc = src;
    this.index = index;
    //style
    this.image.style.position = 'absolute';
    this.image.style.userSelect = 'none';
    this.image.style.margin = '0px';
    this.image.style.padding = '0px';
    this.image.style.webkitUserSelect = "none";
    this.image.style.MozUserSelect = "none";
    this.image.setAttribute("unselectable", "on"); // For IE and Opera
    this.width = width;
    this.height = height;

    this.preloader = new Image();

}

FLIPBOOK.Thumb.prototype = {
    loadImage:function () {
        var self = this;

        this.preloader.src = this.imageSrc;
        $(this.preloader).load(function () {
            self.image.src = self.imageSrc;
        });
    }
}
