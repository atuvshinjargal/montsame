
//    <div class="page">
//        <label for="ani-2" class="front">
//            <img src="http://drublic.de/blog/wp-content/uploads/2011/10/rotate-images.jpg" width="220" height="220" alt="A photo of me.">
//        </label>
//        <label for="ani-1" class="back">
//            <img src="http://drublic.de/blog/wp-content/uploads/2011/10/rotate-images-2.jpg" width="220" height="220" alt="Another photo of me.">
//        </label>
//    </div>


FLIPBOOK.Page3d = function (book, front, back, width, height, index, time1, transition1, time2, transition2) {

    this.book = book;
    this.wrapper = document.createElement('div');
    this.s = this.wrapper.style;
    this.s.width = String(width) + 'px';
    this.s.height = String(height) + 'px';
    this.index = index;
    this.s.position = 'absolute';
    //rotate around right edge
    this.s[this.book.parent.transformOrigin] = '100% 50%';

    //flipped to right initially
    this.s[this.book.parent.transform] = 'rotateY(180deg)';
    //doesn't work without this
    this.s[this.book.parent.transformStyle] = 'preserve-3d';   //!important
    //not selectable
    this.s.userSelect = 'none';
    this.s.webkitUserSelect = "none";
    this.s.MozUserSelect = "none";
    this.wrapper.setAttribute("unselectable", "on"); // For IE and Opera

    this.width = width;
    this.height = height;
    this.time1 = time1;
    this.transition1 = transition1;
    this.time2 = time2;
    this.transition2 = transition2;

    this.imageF = new Image();
    this.imageF.src = 'images/preloader.jpg';
    this.imageSrcF = front;
    this.wrapper.appendChild(this.imageF);

    this.imageB = new Image();
    this.imageB.src = 'images/preloader.jpg';
    this.imageSrcB = back;
    this.wrapper.appendChild(this.imageB);

    this.imageLoaderF = new Image();
    this.imageLoaderB = new Image();

//    this.html = document.createElement('div');
    //!!!!!performance issue with html content on pages - out
//    this.wrapper.appendChild(this.html);

    this.shadowF = new Image();
    this.shadowF.src = '/montsame/public/images/right.png';
    this.wrapper.appendChild(this.shadowF);
    this.shadowB = new Image();
    this.shadowB.src = '/montsame/public/images/left.png';
    this.wrapper.appendChild(this.shadowB);

    //black overlay that will be used for shadow in 3d flip
    this.overlayF = new Image();
    this.overlayF.src = '/montsame/public/images/overlay.jpg';
    this.wrapper.appendChild(this.overlayF);
    this.overlayF.style.opacity = '0';
    this.overlayB = new Image();
    this.overlayB.src = '/montsame/public/images/overlay.jpg';
    this.wrapper.appendChild(this.overlayB);
    this.overlayB.style.opacity = '0';

    this.initImage(this.shadowF);
    this.initImage(this.shadowB);
    this.initImage(this.overlayF);
    this.initImage(this.overlayB);
    this.initImage(this.imageF);
    this.initImage(this.imageB);

    this.initFrontImage(this.shadowF);
    this.initFrontImage(this.overlayF);
    this.initFrontImage(this.imageF);

}

FLIPBOOK.Page3d.prototype = {

    loadFrontImage:function () {
        var self = this;
        if(self.frontLoaded == true)
            return;
        self.imageLoaderF.src =     this.imageSrcF;
        $(self.imageLoaderF).load(function () {
            self.frontLoaded = true;
            self.imageF.src = self.imageSrcF;
        });
    },

    loadBackImage:function () {
        var self = this;
        if(self.backLoaded == true)
            return;
        self.imageLoaderB.src =     this.imageSrcB;
        $(self.imageLoaderB).load(function () {
            self.backLoaded = true;
            self.imageB.src = self.imageSrcB;
        });
    },

    initImage:function(img){
        img.style.width = String(this.width)+'px';
        img.style.height = String(this.height)+'px';
        img.style.top = '0px';
        img.style.left = '0px';
        img.style.position = 'absolute';

//        img.style[this.book.parent.transform] = 'translateZ(0)';
        img.style[this.book.parent.backfaceVisibility] = 'hidden';
    },

    initFrontImage:function(img){
        img.style[this.book.parent.transform] = 'rotateY(180deg)';
        img.style.zIndex = '2';
    },

    flipView:function () {

    },

    pickUp:function(){
        //rotate animation duration and type
        this.s[this.book.parent.transition] = 'all '+String(this.time1)+'ms '+this.transition1;
        this.s[this.book.parent.transform] = 'rotateY(90deg)';
    },

    shadow:function(opacity){
        $(this.overlayF).stop();
        $(this.overlayB).stop();
        this.overlayB.style.opacity = String(opacity);
        this.overlayF.style.opacity = String(opacity);
    },
    shadowPickUp:function(opacity){
         var self = this;
        $(this.overlayB).stop().animate({
            opacity: String(opacity)
        }, Number(self.time1), 'easeInSine', function() {

        });
        $(this.overlayF).stop().animate({
            opacity: String(opacity)
        }, Number(self.time1), 'easeInSine', function() {
        });
    },
    shadowDrop:function(opacity){
        var self = this;
        $(this.overlayB).stop().animate({
            opacity: String(opacity)
        }, Number(self.time2), 'easeOutSine', function() {

        });
        $(this.overlayF).stop().animate({
            opacity: String(opacity)
        }, Number(self.time2), 'easeOutSine', function() {
        });
    },
    dropLeft:function(){
        //rotate animation duration and type
        this.s[this.book.parent.transition] = 'all '+String(this.time2)+'ms '+this.transition2;
        this.s[this.book.parent.transform] = 'rotateY(0deg)';
    },
    dropRight:function(){
        //rotate animation duration and type
        this.s[this.book.parent.transition] = 'all '+String(this.time2)+'ms '+this.transition2;
        this.s[this.book.parent.transform] = 'rotateY(180deg)';
    },
    flipLeft:function () {
        this.s[this.book.parent.transform] = 'rotateY(0deg)';
        this.show();
    },

    flipRight:function () {
        this.s[this.book.parent.transform] = 'rotateY(180deg)';
        this.show();
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
