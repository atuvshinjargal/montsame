
(function ($, window, document, undefined) {
    /**
     * Plugin constructor method
     * @param options Object containing options, overrides default options
     * @return {*}
     */
    $.fn.flipBook = function (options) {
        //entry point
        return this.each(function () {
            var flipBook = new FlipBook();
            $.fn.flipBook.FlipBook = flipBook;
            flipBook.init(options, this);
        });
    };

    $.fn.flipBook.goToPage = function (page) {
        if(this.FlipBook.Book)
            this.FlipBook.Book.goToPage(page);
    };

    // DEFAULT OPTIONS
    $.fn.flipBook.options = {
        //stylesheet for the plugin
        css:"css/style.css",

        //pdf file  - not supported
        pdf:"",

        //array of page objects - this must be passed to plugin constructor
        // {
        // src:"page url",
        // thumb:"thumb url",
        // title:"page title for table of contents"
        // }
        pages:[],

        //page that will be displayed when the book starts
        startPage:0,

        //book default settings
        pageWidth:1000,
        pageHeight:1414,
        thumbnailWidth:100,
        thumbnailHeight:141,

        //menu buttons
        btnNext:true,
        btnPrev:true,
        btnZoomIn:true,
        btnZoomOut:true,
        btnToc:true,
        btnThumbs:true,
        btnShare:true,
        btnExpand:true,

        //flip animation type; can be "2d" or "3d"
        flipType:'3d',

        //flip animation parameters
        time1:500,
        transition1:'ease-in',
        time2:600,
        transition2:'ease-out',

        //social share buttons -  if value is "" the button will not be displayed
        facebook:"http://codecanyon.net",
        twitter:"http://codecanyon.net",
        googleplus:"http://codecanyon.net",
        linkedin:"http://codecanyon.net"
    };

    /**
     *
     * @constructor
     */
    var FlipBook = function () {

//        this.pagesSrc = [],
//        this.thumbnailsSrc = [];


    }
    /**
     * Object prototype
     * @type {Object}
     */
    FlipBook.prototype = {

        init:function(options,elem)
        {
            /**
             * local variables
             */
            var self = this;
            self.elem = elem;
            self.$elem = $(elem);
            self.options = {};

            //stats for debug
//            var
//                stats,
//                createStats = function () {
//                    stats = new Stats();
//                    stats.domElement.style.position = 'absolute';
//                    stats.domElement.style.top = '0px';
//                    self.$elem.append($(stats.domElement));
//                }();
//
//
//            function animate() {
//                requestAnimationFrame(animate);
//                stats.update();
//            }
//            animate();

            var dummyStyle = document.createElement('div').style,
                vendor = (function () {
                    var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                        t,
                        i = 0,
                        l = vendors.length;

                    for (; i < l; i++) {
                        t = vendors[i] + 'ransform';
                        if (t in dummyStyle) {
                            return vendors[i].substr(0, vendors[i].length - 1);
                        }
                    }
                    return false;
                })(),
                prefixStyle = function (style) {
                    if (vendor === '') return style;

                    style = style.charAt(0).toUpperCase() + style.substr(1);
                    return vendor + style;
                },
                isAndroid = (/android/gi).test(navigator.appVersion),
                isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
                isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
                has3d = prefixStyle('perspective') in dummyStyle,
                hasTouch = 'ontouchstart' in window && !isTouchPad,
                RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
                CLICK_EV = hasTouch ? 'touchend' : 'click',
                START_EV = hasTouch ? 'touchstart' : 'mousedown',
                MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
                END_EV = hasTouch ? 'touchend' : 'mouseup',
                CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
                transform = prefixStyle('transform'),
                perspective = prefixStyle('perspective'),
                transformOrigin = prefixStyle('transformOrigin'),
                transition = prefixStyle('transition'),
                transitionProperty = prefixStyle('transitionProperty'),
                transitionDuration = prefixStyle('transitionDuration'),
                transformOrigin = prefixStyle('transformOrigin'),
                transformStyle = prefixStyle('transformStyle'),
                transitionTimingFunction = prefixStyle('transitionTimingFunction'),
                transitionDelay = prefixStyle('transitionDelay'),
                backfaceVisibility = prefixStyle('backfaceVisibility');

            /**
             * Global variables
             */
            self.has3d = has3d;
            self.hasTouch = hasTouch;
            self.RESIZE_EV = RESIZE_EV;
            self.CLICK_EV = CLICK_EV;
            self.START_EV = START_EV;
            self.MOVE_EV = MOVE_EV;
            self.END_EV = END_EV;
            self.CANCEL_EV = CANCEL_EV;
            self.transform = transform;
            self.transitionProperty = transitionProperty;
            self.transitionDuration = transitionDuration;
            self.transformOrigin = transformOrigin;
            self.transitionTimingFunction = transitionTimingFunction;
            self.transitionDelay = transitionDelay;
            self.perspective = perspective;
            self.transformStyle = transformStyle;
            self.transition = transition;
            self.backfaceVisibility = backfaceVisibility;

            //default options are overridden by options object passed to plugin constructor
            self.options = $.extend({}, $.fn.flipBook.options, options);
            self.p = false;

            //load pdf ?
            if(self.options.pdf != "")
            {
                //load pdf
                PDFJS.disableWorker = true;
                //
                // Asynchronous download PDF as an ArrayBuffer
                //
                PDFJS.getDocument(self.options.pdf).then(
                    function (pdf) {

                        var info = pdf.pdfInfo, numPages = info.numPages, context, scale = 2;

                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');

                        loadPage(1);

                        function loadPage(index, callback) {
                            var callback = callback;
                            pdf.getPage(index).then(
                                function (page) {
                                    var viewport = page.getViewport(scale);

                                    canvas.height = viewport.height;
                                    canvas.width = viewport.width;
                                    context.clearRect(0, 0, canvas.width, canvas.height);
                                    context.fillStyle = "rgba(255, 255, 255, 1)";
                                    context.fillRect(0, 0, canvas.width, canvas.height);

                                    var pageRendering = page.render({canvasContext:context, viewport:viewport});

                                    pageRendering.onData(
                                        function () {
                                            saveCanvasToPNG(canvas);

                                            if(index < numPages )
                                                loadPage(index+1);
                                        }
                                    );
                                }
                            );
                        }

                        //save canvas to image
                        function saveCanvasToPNG(canvas) {
                            var img = Canvas2Image.saveAsPNG(canvas, true);
                            var imgUrl = img.src;
                            self.options.pages.push({src:imgUrl});
                            if(self.options.pages.length == numPages)
                                self.continueXmlSuccess(xml);
//                        img.style.left = '0px';
//                        img.style.display = 'block';
//                        img.style.width = '50%';
//                        document.getElementById("img").appendChild(img);
                        }
                    }
                );

            }
            //start the app by loading the CSS
            else
            {
                self.loadCSS(self.options.css);
            }

        },


        /**
         * start everything, after we have options
         */
        start:function (){
            this.createBook();
            this.Book.updateVisiblePages();
            this.createMenu();
            this.createCurrentPage();
            this.updateCurrentPage();
            this.createToc();
            this.createThumbs();
            if(this.options.btnShare)
                this.createShareButtons();
            this.resize();
        },

        loadCSS:function(url){

            var self = this;
            //append css to head tag
            $('<link rel="stylesheet" type="text/css" href="'+url+'" />').appendTo("head");
            //wait for css to load
            $.ajax({
                url:url,
                success:function(data){
                    //css is loaded
                    //start the app
                    self.start();
                }
            })
        }  ,

        /**
         * create the book
         */
        createBook : function () {
            var self = this;
            self.bookLayer = $(document.createElement('div'))
                .attr('id', 'bookLayer')
                .appendTo(self.$elem)
            ;
            self.book = $(document.createElement('div'))
                .attr('id', 'book')
                .appendTo(self.bookLayer)
            ;
            self.scroll = new iScroll(self.bookLayer[0], {
//                bounce:false,
                wheelAction:'zoom',
                zoom:true,
                keepInCenterH:true,
                keepInCenterV:true
            });
            //2d flip book
            if(self.options.flipType == "2d" || !self.has3d)
            {
                self.Book = new FLIPBOOK.Book(self.book[0], {
                    pagesArr:self.options.pages,
                    scroll:self.scroll,
                    parent:self,
                    pageW:self.options.pageWidth,
                    pageH:self.options.pageHeight,
                    flipType:self.options.flipType,
                    time1:self.options.time1,
                    transition1:self.options.transition1,
                    time2:self.options.time2,
                    transition2:self.options.transition2
                });

            }

            //3d flip book
            else if(self.options.flipType == "3d")
            {
                self.Book = new FLIPBOOK.Book3d(self.book[0], {
                    pagesArr:self.options.pages,
                    scroll:self.scroll,
                    parent:self,
                    pageW:self.options.pageWidth,
                    pageH:self.options.pageHeight,
                    time1:self.options.time1,
                    transition1:self.options.transition1 ,
                    time2:self.options.time2,
                    transition2:self.options.transition2

                });
            }

            self.currentPage = $(document.createElement('div'))
                .attr('id','currentPage');
            self.updateCurrentPage();
            self.Book.goToPage(Number(self.options.startPage)-1);

            $(window).resize(function () {
                self.resize();
            });

        },

        /**
         * create menu
         */
        createMenu:function(){

//            <span aria-hidden="true" class="icon-share"></span>


            var self = this;
            var menu = $(document.createElement('div'))
                .attr('id','menu')
                .appendTo(this.$elem)
            ;

//            var btnFirst = $(document.createElement('a'))
//                .appendTo(menu)
//                .bind(this.CLICK_EV, function(){
//                    self.Book.firstPage();
//                })
//                .addClass('btn')
//                .addClass('first');
            if(self.options.btnPrev)
            {
                var btnPrev = $(document.createElement('span'))
                    .attr('aria-hidden', 'true')
                    .appendTo(menu)
                    .bind(this.CLICK_EV, function(){
                        self.Book.prevPage();
                    })
                    .addClass('icon-arrow-left')
//                    .addClass('icon-arrow-left-2')
                    .addClass('btn')
                    .addClass('icon-general')
//                    .addClass('prev')
                    ;
            }
            if(self.options.btnNext)
            {
                var btnNext = $(document.createElement('span'))
                    .attr('aria-hidden', 'true')
                    .appendTo(menu)
                    .bind(this.CLICK_EV, function(){
                        self.Book.nextPage();
                    })
                    .addClass('btn')
                    .addClass('icon-general')
                    .addClass('icon-arrow-right')
//                    .addClass('icon-arrow-right-2')
            ;
            }
            if(self.options.btnZoomIn)
            {
                var btnZoomIn = $(document.createElement('span'))
                    .attr('aria-hidden', 'true')
                    .appendTo(menu)
                    .bind(this.CLICK_EV, function(){
                        self.zoomIn();
                    })
                    .addClass('btn')
                    .addClass('icon-general')
//                    .addClass('icon-plus')
                    .addClass('icon-zoom-in')
                    ;
            }
            if(self.options.btnZoomOut)
            {
                var btnZoomOut = $(document.createElement('span'))
                    .attr('aria-hidden', 'true')
                    .appendTo(menu)
                    .bind(this.CLICK_EV, function(){
                        self.zoomOut();
                    })
                    .addClass('btn')
                    .addClass('icon-general')
                    .addClass('icon-zoom-out')
//                    .addClass('icon-minus')
                    ;
            }
//            var btnLast = $(document.createElement('a'))
//                .attr('aria-hidden', 'true')
//                .appendTo(menu)
//                .bind(this.CLICK_EV, function(){
//                    self.Book.lastPage();
//                })
//                .addClass('btn')
//                .addClass('last');
            if(self.options.btnToc)
            {
                var btnToc = $(document.createElement('span'))
                    .attr('aria-hidden', 'true')
                    .appendTo(menu)
                    .bind(this.CLICK_EV, function(){
                        self.toggleToc();
                    })
                    .addClass('btn')
                    .addClass('icon-general')
                    .addClass('icon-list');
            }
            if(self.options.btnThumbs)
            {
                var btnThumbs = $(document.createElement('span'))
                    .attr('aria-hidden', 'true')
                    .appendTo(menu)
                    .bind(this.CLICK_EV, function(){
                        self.toggleThumbs();
                    })
                    .addClass('btn')
                    .addClass('icon-general')
                    .addClass('icon-layout');
            }
            if(self.options.btnShare)
            {
                var btnShare = $(document.createElement('span'))
                    .attr('aria-hidden', 'true')
                    .appendTo(menu)
                    .bind(this.CLICK_EV, function(){
                        self.toggleShare();
                    })
                    .addClass('btn')
                    .addClass('icon-general')
                    .addClass('icon-share');
            }

            if (THREEx.FullScreen.available() && self.options.btnExpand){
                var btnExpand = $(document.createElement('span'))
                    .attr('aria-hidden', 'true')
                    .appendTo(menu)
                    .bind(this.CLICK_EV, function(){


                        if (THREEx.FullScreen.available()) {
                            if (THREEx.FullScreen.activated()) {
                                THREEx.FullScreen.cancel();
                                $(this)
                                    .removeClass('icon-resize-shrink')
                                    .addClass('icon-resize-enlarge')
                                ;
                            }
                            else {
                                THREEx.FullScreen.request();
                                $(this)
                                    .removeClass('icon-resize-enlarge')
                                    .addClass('icon-resize-shrink')
                                ;
                            }
                        }
//                        $(this).addClass('icon-resize-enlarge');
                    })
                    .addClass('btn')
                    .addClass('icon-general')
                    .addClass('icon-resize-enlarge');
            }

        },

        createShareButtons:function(){
            var self = this;
            this.shareButtons = $(document.createElement('span'))
                .appendTo(this.bookLayer)
                .attr('id', 'shareButtons')
                .addClass('invisible')
                .addClass('transition')
            ;
            if(self.options.facebook != "")
            {
                var facebook = $(document.createElement('span'))
                        .attr('aria-hidden', 'true')
                        .appendTo(this.shareButtons)
                        .addClass('shareBtn')
                        .addClass('icon-facebook')
                        .addClass('icon-general')
                        .bind(self.CLICK_EV, function(e){
                            window.open(self.options.facebook,"_self")
                        })
                    ;
            }

            if(self.options.twitter != "")
            {
                var twitter = $(document.createElement('span'))
                        .attr('aria-hidden', 'true')
                        .appendTo(this.shareButtons)
                        .addClass('shareBtn')
                        .addClass('icon-twitter')
                        .addClass('icon-general')
                        .bind(self.CLICK_EV, function(e){
                            window.open(self.options.twitter,"_self")
                        })
                    ;
            }

            if(self.options.googleplus != "")
            {
                var googleplus = $(document.createElement('span'))
                        .attr('aria-hidden', 'true')
                        .appendTo(this.shareButtons)
                        .addClass('shareBtn')
                        .addClass('icon-googleplus')
                        .addClass('icon-general')
                        .bind(self.CLICK_EV, function(e){
                            window.open(self.options.googleplus,"_self")
                        })
                    ;
            }

            if(self.options.linkedin != "")
            {
                var linkedin = $(document.createElement('span'))
                        .attr('aria-hidden', 'true')
                        .appendTo(this.shareButtons)
                        .addClass('shareBtn')
                        .addClass('icon-linkedin')
                        .addClass('icon-general')
                        .bind(self.CLICK_EV, function(e){
                            window.open(self.options.linkedin,"_self")
                        })
                    ;
            }

        },

        zoomIn:function(){
            var newZoom = this.scroll.scale * 1.5 > this.scroll.options.zoomMax ? this.scroll.options.zoomMax : this.scroll.scale * 1.5;
//            newZoom *= this.ratio;
            this.scroll.zoom(this.bookLayer.width()/2,this.bookLayer.height()/2,newZoom,400);
        },
        zoomOut:function(){
            var newZoom = this.scroll.scale / 1.5 < this.scroll.options.zoomMin ? this.scroll.options.zoomMin : this.scroll.scale / 1.5;
//            newZoom *= this.ratio;
            this.scroll.zoom(this.bookLayer.width()/2,this.bookLayer.height()/2,newZoom,400);
        },

        toggleShare:function(){
            this.shareButtons.toggleClass('invisible');
        },
        /**
         * create current page indicator
         */
        createCurrentPage : function(){
            this.currentPage =  $(document.createElement('div'))
                .attr('id', 'currentPage')
                .appendTo(this.bookLayer)
            ;
        },

        createToc:function(xml){
            var self = this;
            this.tocHolder =  $(document.createElement('div'))
                .attr('id', 'tocHolder')
                .attr('class', 'invisible')
                .appendTo(this.$elem)
//                .hide();
            ;
            this.toc =  $(document.createElement('div'))
                .attr('id', 'toc')
                .appendTo(this.tocHolder)
            ;
            self.tocScroll = new iScroll(self.tocHolder[0],{bounce:false});

            //tiile
            var title = $(document.createElement('span'))
                .attr('id', 'tocTitle')
                .appendTo(this.toc)
            ;
//            title.text(this.options.tocTitle);
//            var btnToc = $(document.createElement('span'))
//                .attr('aria-hidden', 'true')
//                .appendTo(title)
//                .css('float','left')
//                .addClass('icon-list')
//                .addClass('icon-social')
//                ;

             var btnClose = $(document.createElement('span'))
                .attr('aria-hidden', 'true')
                .appendTo(title)
                .css('float','right')
                .css('position','absolute')
                .css('top','0px')
                .css('right','0px')
                .css('cursor','pointer')
                .css('font-size','.8em')
                .addClass('icon-cross')
                .addClass('icon-general')
                 .bind(self.START_EV, function(e){
                     self.toggleToc();
                 });
                ;

            for(var i = 0; i<this.options.pages.length; i++)
            {
                if(this.options.pages[i].title == "")
                    continue;

                var tocItem = $(document.createElement('a'))
                    .attr('class', 'tocItem')
                    .attr('title', String(i+1))
                    .appendTo(this.toc)
                    .bind(self.CLICK_EV, function(e){
                        if(!self.tocScroll.moved)
                        {
                            var clickedPage = Number($(this).attr('title'));
                            self.Book.goToPage(clickedPage - 1);
                        }
                    });
                ;
                $(document.createElement('span'))
                    .appendTo(tocItem)
                    .text(this.options.pages[i].title);
                $(document.createElement('span'))
                    .appendTo(tocItem)
                    .attr('class', 'right')
                    .text(i+1);
            }

            self.tocScroll.refresh();
        },

        toggleToc:function(){
//            this.tocHolder[0].classList.toggle('invisible');
            this.tocHolder.toggleClass('invisible');

            this.tocScroll.refresh();
        },

        /**
         * update current page indicator
         */
        updateCurrentPage : function(){
            var text, rightIndex = this.Book.rightIndex, pagesLength = this.Book.pagesNumber;
            if (rightIndex == 0) {
                text = "1 / " + String(pagesLength);
            }
            else if (rightIndex == pagesLength) {
                text = String(pagesLength) + " / " + String(pagesLength);
            }
            else {
                text = String(rightIndex) + "," + String(rightIndex + 1) + " / " + String(pagesLength);
            }
            if(this.p && this.options.pages.length != 24 && this.options.pages.length != 8)
                this.Book.rightIndex = 0;
            this.currentPage.text(text);
        },

        /**
         * page turn is completed, update what is needed
         */
        turnPageComplete:function () {
            //this == FLIPBOOK.Book

            this.animating = false;
            this.updateCurrentPage();
        },

        /**
         * update book size
         */
        resize:function(){
            var blw = this.bookLayer.width(),
                blh = this.bookLayer.height(),
                bw = this.book.width(),
                bh = this.book.height();
            if(blw/blh > bw/bh)
//            if (this.bookLayer.width() > this.bookLayer.height())
                this.fitToHeight(true);
            else
                this.fitToWidth(true);
        },

        /**
         * fit book to screen height
         * @param resize
         */
        fitToHeight:function (resize) {
            if (resize)
                this.ratio = this.bookLayer.height() / this.book.height();
            this.fit(this.ratio, resize);
            this.thumbsVertical();
        },

        /**
         * fit book to screen width
         * @param resize
         */
        fitToWidth:function (resize) {
            if (resize)
                this.ratio = this.bookLayer.width() / this.book.width();
            this.fit(this.ratio, resize);
            this.thumbsHorizontal();
        },

        /**
         * resize book by zooming it with iscroll
         * @param r
         * @param resize
         */
        fit:function(r, resize) {
            r = resize ? this.ratio : this.scroll.scale;
            if (resize)
                this.scroll.setZoomMin(r);
             this.scroll.zoom(0, 0, r, 0);
        },

        /**
         * create thumbs
         */
        createThumbs : function () {
            var self = this,point1,point2;
            self.thumbsCreated = true;
            //create thumb holder - parent for thumb container
            self.thumbHolder = $(document.createElement('div'))
                .attr('id', 'thumbHolder')
                .attr('class', 'invisible')
                .appendTo(self.bookLayer)
                .css('position', 'absolute')
            ;
            //create thumb container - parent for thumbs
            self.thumbsContainer = $(document.createElement('div')).
                appendTo(self.thumbHolder)
                .attr('id', 'thumbContainer')
                .css('margin', '0px')
                .css('padding', '0px')
                .css('position', 'relative')
            ;
            //scroll for thumb container
            self.thumbScroll = new iScroll(self.thumbHolder[0],{bounce:false});
            self.thumbs = [];
            for (var i = 0; i < self.options.pages.length; i++) {
                var imgUrl = self.options.pages[i].thumb;
                var thumbsLoaded = 0;
                var thumb = new FLIPBOOK.Thumb(imgUrl, self.options.thumbnailWidth, self.options.thumbnailHeight, i);
                thumb.image.style[self.transform] = 'translateZ(0)';
                self.thumbs.push(thumb);
                $(thumb.image)
                    .attr('title', i + 1)
                    .appendTo(self.thumbsContainer)
                    .bind(self.CLICK_EV, function(e){
                        if(!self.thumbScroll.moved)
                        {
                            var clickedPage = Number($(this).attr('title'));
                            self.Book.goToPage(clickedPage - 1);
                        }
                    });
                thumb.loadImage();
            }
        },

        /**
         * toggle thumbs
         */
        toggleThumbs : function () {

            if (!this.thumbsCreated)
                this.createThumbs();
            this.thumbHolder.toggleClass('invisible');
            var self = this;
            (this.bookLayer.width() > this.bookLayer.height()) ? this.thumbsVertical() : this.thumbsHorizontal();
//            setTimeout(
//                self.thumbScroll.refresh(), 2000
//            );

        },

        /**
         * thumbs vertical view
         */
        thumbsVertical:function(){
            if (!this.thumbsCreated)
                return;
            var w = this.options.thumbnailWidth,
                h = this.options.thumbnailHeight * this.thumbs.length;
            this.thumbHolder
                .css('width', String(w) + 'px')
                .css('height', '100%')
                .css('bottom', 'auto')
                .css('left', 'auto')
                .css('top', '0px')
                .css('right', '0px');
            this.thumbsContainer
                .css('height', String(h) + 'px')
                .css('width', String(w) + 'px');
            for(var i=0;i<this.thumbs.length;i++)
            {
                var thumb = this.thumbs[i].image;
                thumb.style.top = String(i*this.options.thumbnailHeight)+'px';
                thumb.style.left = '0px';
            }
            this.thumbScroll.hScroll = false;
            this.thumbScroll.vScroll = true;
            this.thumbScroll.refresh();
        },

        /**
         * thumbs horizontal view
         */
        thumbsHorizontal:function(){
            if (!this.thumbsCreated)
                return;
            var w = this.options.thumbnailWidth* this.thumbs.length,
                h = this.options.thumbnailHeight ;
            this.thumbHolder
                .css('width', '100%')
                .css('height', String(h) + 'px')
                .css('left', '0px')
                .css('right', 'auto')
                .css('top', 'auto')
                .css('bottom', '0px')
            ;
            this.thumbsContainer
                .css('height', String(h) + 'px')
                .css('width', String(w) + 'px')
            ;
            for(var i=0;i<this.thumbs.length;i++)
            {
                var thumb = this.thumbs[i].image;
                thumb.style.top = '0px';
                thumb.style.left = String(i*this.options.thumbnailWidth)+'px';
            }
            this.thumbScroll.hScroll = true;
            this.thumbScroll.vScroll = false;
            this.thumbScroll.refresh();
        }   ,

        /**
         * toggle full screen
         */
        toggleExpand : function() {
            if (THREEx.FullScreen.available()) {
                if (THREEx.FullScreen.activated()) {
                    THREEx.FullScreen.cancel();
                }
                else {
                    THREEx.FullScreen.request();
                }
            }
        }
    }

})(jQuery, window, document);