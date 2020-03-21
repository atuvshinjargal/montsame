var FLIPBOOK = FLIPBOOK || {};

/**
 *
 * @param el  container for the book
 * @param options
 * @constructor
 */
FLIPBOOK.Book3d = function (el, options) {

    var self = this,
        i;

    this.wrapper = typeof el == 'object' ? el : document.getElementById(el);

    // Default options
    this.options = {
        //A4
        pageW:1000,
        pageH:1414,
        onTurnPageComplete:null,

        shadow1opacity:.7, // black overlay for 3d flip
        shadow2opacity:.7 // gradient overlay
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

    var s = this.wrapper.style;
    s.width = String(2 * this.pageW) + 'px';
    s.height = String(this.pageH) + 'px';
    s.position = 'relative';
    s[this.parent.perspective] = '3000px';

    this.flipType = this.options.flipType;
    this.shadow1opacity = this.options.shadow1opacity;
    this.shadow2opacity = this.options.shadow2opacity;
    this.time1 = this.options.time1;
    this.transition1 = this.options.transition1;
    this.time2 = this.options.time2;
    this.transition2 = this.options.transition2;

    //add bitmap pages
    for (var i = 0; i < this.pagesArr.length/2; i++) {
//    for (var i = 0; i < 2; i++) {
        this.addPage(this.pagesArr[2*i].src, this.pagesArr[2*i+1].src);
//                self.Book.pages[i].html.innerHTML = self.options.pages[i].html;
        $(this.pages[i].wrapper)
            .attr('title', i)
            .bind(self.parent.CLICK_EV, function(e){
                if(!self.scroll.moved && !self.scroll.animating && !self.scroll.zoomed && (self.zoomOnMouseDown == self.scroll.scale))
                {
                    var clickedPage = Number($(this).attr('title'));
                    clickedPage != (self.rightIndex/2) ? self.prevPage() : self.nextPage();
                }
            })
            .bind(self.parent.START_EV, function(e){
                self.zoomOnMouseDown = self.scroll.scale;
            });
        this.updateVisiblePages();
    }

    this.pagesNumber = this.pagesArr.length;

    this.pages[0].loadFrontImage();
    this.pages[0].loadBackImage();
    this.pages[1].loadFrontImage();
};

FLIPBOOK.Book3d.prototype.constructor = FLIPBOOK.Book3d;

FLIPBOOK.Book3d.prototype = {
    /**
     * add new page to book
     * @param pageSrc
     */
    addPage:function (leftSrc, rightSrc) {

        var page = new FLIPBOOK.Page3d(this,leftSrc, rightSrc, this.pageW, this.pageH, this.pages.length, this.time1, this.transition1, this.time2, this.transition2 );
        this.wrapper.appendChild(page.wrapper);
        this.pages.push(page);
    },

    // i - sheet index, 0-based 0,1,2,... pages.length-1
    goToPage:function (i) {
        i = Math.round(i/2);
        var rightSheetIndexNew = i;
        var rightSheetIndex = this.rightIndex/2;
        if(rightSheetIndexNew == rightSheetIndex)
            return;
        if(this.animating)
            return;
        this.animating = true;
        var self = this;

        //update z index
        var i;
        var leftUp, rightUp, leftDown, rightDown;

        if(rightSheetIndexNew > rightSheetIndex)
        {
            leftDown = self.pages[rightSheetIndex-1];
            leftUp = self.pages[rightSheetIndex];
            rightUp = self.pages[rightSheetIndexNew-1];
            rightDown = self.pages[rightSheetIndexNew];
//            if(leftUp)
//            {
//                leftUp.show();
//            }
            if(leftDown)
            {
                leftDown.wrapper.style.zIndex = -1;
                leftDown.show();
            }
            if(rightDown)
            {
                rightDown.wrapper.style.zIndex = -1;
                rightDown.show();
            }

            //going forward - flipping from right to left
            for( i = rightSheetIndex; i < rightSheetIndexNew; i++)
            {
                this.pages[i].pickUp();
                this.pages[i].shadow(0);
                this.pages[i].shadowPickUp(.5);
            }
        }

        if(rightSheetIndexNew < rightSheetIndex)
        {
            leftDown = self.pages[rightSheetIndexNew-1];
            leftUp = self.pages[rightSheetIndexNew];
            rightUp = self.pages[rightSheetIndex-1];
            rightDown = self.pages[rightSheetIndex];
//            if(rightUp)
//            {
//                rightUp.show();
//            }
            if(leftDown)
            {
                leftDown.wrapper.style.zIndex = -1;
                leftDown.show();
            }
            if(rightDown)
            {
                rightDown.wrapper.style.zIndex = -1;
                rightDown.show();
            }
            //going forward - flipping from right to left
            for( i = (rightSheetIndex-1); i >= rightSheetIndexNew; i--)
            {
                this.pages[i].pickUp();
                this.pages[i].shadow(0);
                this.pages[i].shadowPickUp(.5);
            }


        }

        this.rightIndex = rightSheetIndexNew*2;

        //half of animation
        setTimeout(function(){
            //update visible pages
            //drop pages that are up to left - going forward
            if(rightSheetIndexNew > rightSheetIndex)
            {

                //going forward - flipping from right to left

                if(leftUp && (leftUp != rightUp))
                {
                    leftUp.hide();
                }
                if(leftUp && leftUp != rightUp)
                {
                    rightUp.show();
                }

                for( i = rightSheetIndex; i < rightSheetIndexNew; i++)
                {
                    self.pages[i].dropLeft();
                    self.pages[i].shadowDrop(0);
                }
            }
            //boing backward, drop pages to right
            if(rightSheetIndexNew < rightSheetIndex)
            {
                //going forward - flipping from right to left

                if(rightUp && (leftUp != rightUp))
                {
                    rightUp.hide();
                }
                if(rightUp && leftUp != rightUp)
                {
                    leftUp.show();
                }
                for( i = (rightSheetIndex-1); i >= rightSheetIndexNew; i--)
                {
                    self.pages[i].dropRight();
                    self.pages[i].shadowDrop(0);
                }
            }

        },Number(this.time1));

        //end of animation
        setTimeout(function(){
            self.parent.turnPageComplete();
            self.updateVisiblePages();
            self.loadPages();
            self.animating = false;
        },Number(this.time1)+Number(this.time2));
    },
    /**
     * page flip animation
     * @param first
     * @param second
     */
    animatePages:function (first, second) {

    },

    loadPages:function(){
        var rightSheetIndex =  this.rightIndex/2;
        if(this.pages[rightSheetIndex-2])
        {
           this.pages[rightSheetIndex-2].loadBackImage();
        }
        if(this.pages[rightSheetIndex-1])
        {
            this.pages[rightSheetIndex-1].loadFrontImage();
            this.pages[rightSheetIndex-1].loadBackImage();
        }
        if(this.pages[rightSheetIndex])
        {
            this.pages[rightSheetIndex].loadFrontImage();
            this.pages[rightSheetIndex].loadBackImage();
        }
        if(this.pages[rightSheetIndex+1])
        {
            this.pages[rightSheetIndex+1].loadFrontImage();
        }
    },
    /**
     * update page visibility depending on current page index
     */
    updateVisiblePages:function () {
        var rightSheetIndex =  this.rightIndex/2;
        for (var i = 0; i < this.pages.length; i++) {

            if ((i < (rightSheetIndex - 1)) || (i > rightSheetIndex)) {
                this.pages[i].hide();
            }
            else {
                this.pages[i].show();
                this.pages[i].shadow(0);
            }
            this.pages[i].wrapper.style.zIndex = 0;
        }
    },
    /**
     * go to next page
     */
    nextPage:function () {
        if (this.rightIndex/2 == this.pages.length || this.animating)
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
        if (this.rightIndex/2 == this.pages.length || this.animating)
            return;
        this.goToPage(this.pages.length*2);
    }

}
