var FLIPBOOK = FLIPBOOK || {};

/**
 *
 * @param el  container for the book
 * @param options
 * @constructor
 */
FLIPBOOK.Book = function (el, options) {
    /**
     * local variables
     */
    var self = this,i;

    this.parent = null;

    this.wrapper = typeof el == 'object' ? el : document.getElementById(el);

    // Default options
    this.options = {
        //A4
        pageW:1000,
        pageH:1414,
        onTurnPageComplete:null,
        //2d or 3d
        flipType:'2d',
        shadow1opacity:.6, // black overlay for flip animations
        shadow2opacity:.6 // gradient overlay
    }

    // User defined options
    for (i in options) this.options[i] = options[i];

    this.parent = this.options.parent;
    this.scroll = this.options.scroll;
    this.pagesArr = this.options.pagesArr;

    this.pages = [];
    this.pageW = this.options.pageW;
    this.pageH = this.options.pageH;
    this.animating = false;
    this.rightIndex = 0;
    this.onTurnPageComplete = this.options.onTurnPageComplete;

    var s = this.wrapper.style;
    s.width = String(2 * this.pageW) + 'px';
    s.height = String(this.pageH) + 'px';
    s.position = 'relative';

    this.flipType = this.options.flipType;
    this.shadow1opacity = this.options.shadow1opacity;
    this.shadow2opacity = this.options.shadow2opacity;

    //add bitmap pages
    for (var i = 0; i < this.pagesArr.length; i++) {
        this.addPage(this.pagesArr[i].src);
//                self.Book.pages[i].html.innerHTML = self.options.pages[i].html;
        $(this.pages[i].wrapper)
            .attr('title', i + 1)
            .bind(self.parent.CLICK_EV, function(e){
                if(!self.scroll.moved && !self.scroll.animating && !self.scroll.zoomed && (self.zoomOnMouseDown == self.scroll.scale))
                {
                    var clickedPage = Number($(this).attr('title'));
                    clickedPage % 2 == 0 ? self.prevPage() : self.nextPage();
                }
            })
            .bind(self.parent.START_EV, function(e){
                self.zoomOnMouseDown = self.scroll.scale;
            })
    }
    this.pagesNumber = this.pagesArr.length;

    this.pages[0].loadImage();
    this.pages[1].loadImage();
    this.pages[2].loadImage();

    this.updateVisiblePages();

};

FLIPBOOK.Book.prototype.constructor = FLIPBOOK.Book;

FLIPBOOK.Book.prototype = {
    /**
     * add new page to book
     * @param pageSrc
     */
    addPage:function (pageSrc) {
        var page = new FLIPBOOK.Page(pageSrc, this.pageW, this.pageH, this.pages.length);
        this.wrapper.appendChild(page.wrapper);
        this.pages.push(page);
        if (this.flipType == '3d') {
            page.wrapper.style[this.transformOrigin] = this.pages.length % 2 == 0 ? '100% 50%' : '0% 50%';
        }
        //much faster with this
        page.wrapper.style[this.backfaceVisibility] = 'hidden';

        //performance problems on android with shadow opacity
//        page.shadow.style.opacity = String(this.shadow2opacity);

    },

    // i - page number, 0-based 0,1,2,... pages.length-1
    goToPage:function (i) {
        if (i < 0 || i > this.pages.length)
            return;

        if (this.animating)
            return;
        //convert target page to right index 0,2,4, ... pages.length
        i = (i % 2 == 1) ? i + 1 : i;

        var pl, pr, plNew, prNew;
        //if going left or right
        if (i < this.rightIndex)
        //flip left
        {
            pl = this.pages[this.rightIndex - 1];
            pr = this.pages[i];
            if (i > 0) {
                plNew = this.pages[i - 1];
                plNew.show();
                plNew.expand();
            }
            pr.show();
            pr.contract();

            this.animatePages(pl, pr);
        }
        //flip right
        else if (i > this.rightIndex) {
            pl = this.pages[i - 1];
            pr = this.pages[this.rightIndex];
            if (i < this.pages.length) {
                prNew = this.pages[i];
                prNew.show();
                prNew.expand();
            }
            pl.show();
            pl.contract();
            this.animatePages(pr, pl);
        }

        this.rightIndex = i;

//        if(parent.p && this.pages[0].imageSrc != "images/Art-1.jpg")
//            this.rightIndex = 0;
    },
    /**
     * page flip animation
     * @param first
     * @param second
     */
    animatePages:function (first, second) {
        this.animating = true;
        var self = this,
            time1 = self.options.time1,
            time2 = self.options.time2,
            transition1 = self.options.transition1,
            transition2 = self.options.transition2
            ;

        $(first.wrapper).animate({
            width: 0
        }, Number(time1), 'easeInSine', function() {
            first.expanded = false;
            $(second.wrapper).animate({
                width: second.width
            }, Number(time2), 'easeOutSine', function() {
                second.expanded = true;
                self.parent.turnPageComplete();

                //load more pages - current, left and right
                var index =self.rightIndex, pages = self.pages;
                if(index > 2)
                    pages[index -3].loadImage();
                if(index > 0)
                    pages[index -2].loadImage();
                if(index > 0)
                    pages[index -1].loadImage();
                if(index < pages.length)
                    pages[index].loadImage();
                if(index < pages.length)
                    pages[index +1].loadImage();
                if(index < pages.length-2)
                    pages[index +2].loadImage();

                self.animating = false;
                self.updateVisiblePages();
                first.wrapper.style[self.parent.transform] = 'rotateY(0deg)';
                first.overlay.style.opacity = '0';
            });
        });

    },
    /**
     * update page visibility depending on current page index
     */
    updateVisiblePages:function () {
        if (this.animating)
            return;
        for (var i = 0; i < this.pages.length; i++) {
            if ((i < (this.rightIndex - 1)) || (i > (this.rightIndex))) {
//                this.pages[i].contract();
                this.pages[i].hide();
            }
            else {
//                this.pages[i].expand();
                this.pages[i].show();
            }
            if (this.rightIndex == 0) {
//                this.pages[1].contract();
                this.pages[1].hide();
            }
        }
    },
    /**
     * go to next page
     */
    nextPage:function () {
        if (this.rightIndex == this.pages.length || this.animating)
            return;
        this.goToPage(this.rightIndex + 2);
    },
    /**
     * go to previous page
     */
    prevPage:function () {
        if (this.rightIndex == 0 || this.animating)
            return;
        this.goToPage(this.rightIndex - 2);
    },

    firstPage:function () {
        if (this.rightIndex == 0 || this.animating)
            return;
        this.goToPage(0);
    },

    lastPage:function () {
        if (this.rightIndex == this.pages.length || this.animating)
            return;
        this.goToPage(this.pages.length);
    }

}
