/**
 *
 * @param src  page image url
 * @param width   page width
 * @param height  page height
 * @param index   page index in the book, first page is 0
 * @constructor
 */
FLIPBOOK.Page = function (src, width, height, index) {

    this.wrapper = document.createElement('div');
    this.s = this.wrapper.style;
    this.s.overflow = 'hidden';
    this.s.width = String(width) + 'px';
    this.s.height = String(height) + 'px';
    this.index = index;
    this.s.position = 'absolute';
    this.s.userSelect = 'none';
    this.s.webkitUserSelect = "none";
    this.s.MozUserSelect = "none";

    this.wrapper.setAttribute("unselectable", "on"); // For IE and Opera
    this.width = width;
    this.height = height;

    this.image = new Image();
    /**
     * lightweight preloader for the page - shows until the page is loaded
     */
    this.image.src = 'images/preloader.jpg';
    this.imageSrc = src;
    this.wrapper.appendChild(this.image);

    this.imageLoader = new Image();

    this.html = document.createElement('div');
    //!!!!!performance issue with html content on pages - out
//    this.wrapper.appendChild(this.html);

    this.shadow = new Image();
    this.wrapper.appendChild(this.shadow);

    //black overlay that will be used for shadow in 3d flip
    this.overlay = new Image();
    this.overlay.src = '/images/overlay.jpg';
    this.wrapper.appendChild(this.overlay);
    this.overlay.style.opacity = '0';

    this.expanded = true;

    //index is 0-based, even pages : 0,2,4.. pages on the right side
    this.isEven = (this.index % 2 == 0);

    this.flipView();

    this.pageLoaded= false;
}

/**
 * prototype
 * @type {Object}
 */
FLIPBOOK.Page.prototype = {
    loadImage:function () {
        var self = this;
        //if page is already loaded
        if(self.pageLoaded)
            return;
        self.imageLoader.src =     this.imageSrc;
        $(self.imageLoader).load(function () {
            self.image.src = self.imageSrc;
            self.pageLoaded = true;
        });
    },

    flipView:function () {
        //left pages (indexes 1,3,5,...)
        if (this.index % 2 == 0) {
            this.s.zIndex = String(100 - this.index);
            this.s.left = '50%';
            this.right(this.image);
            this.right(this.shadow);
            this.right(this.overlay);
            this.right(this.html);
            this.shadow.src = 'images/right.png';
        }
        //right pages (indexes 0,2,4,...)
        else {
            this.s.zIndex = String(100 + this.index);
            this.s.right = '50%';
            this.left(this.image);
            this.left(this.shadow);
            this.left(this.overlay);
            this.left(this.html);
            this.shadow.src = 'images/left.png';
        }
        this.s.top = '0px';
    },
    /**
     * expand page to full width
     */
    expand:function () {
        this.expanded ? null : this.s.width = String(this.width) + 'px';
        this.expanded = true;
//        this.s.width != String(this.width) + 'px' ? this.s.width = String(this.width) + 'px' : null;
    },
    /**
     * contract page to width 0
     */
    contract:function () {
        this.expanded ? this.s.width = '0px' : null;
        this.expanded = false;
//        this.s.width != '0px' ? this.s.width = '0px' : null;
    },
    /**
     * init left page image
     * @param image
     */
    left:function (image) {
        var s= image.style;
        s.width = String(this.width) + 'px';
        s.height = String(this.height) + 'px';
        s.position = 'absolute';
        s.top = '0px';
        s.right = '0px';
    },
    /**
     * init right page image
     * @param image
     */
    right:function (image) {
        var s= image.style;
        s.width = String(this.width) + 'px';
        s.height = String(this.height) + 'px';
        s.position = 'absolute';
        s.top = '0px';
        s.left = '0px';
    }  ,

    show:function(){
        if(this.hidden)
        {
            this.wrapper.style.display = 'block';
            this.hidden = false;
        }
    } ,

    hide:function(){
        if(!this.hidden)
        {
            this.wrapper.style.display = 'none';
            this.hidden = true;
        }
    }
}
