(function ($) {

    var $window = $(window);
    var $box = $('#scroll-view-box');
    var $img = $('#scroll-view-image');
    var $titleBox = $('#scroll-view-image-title');
    var $overlay = $('#scroll-view-overlay');
    var $closeButton = $('#scroll-view-close-button');
    var $nextButton = $('#scroll-view-next-button');
    var $prevButton = $('#scroll-view-prev-button');

    $(document).keyup(function (e) {
        if (e.keyCode == 13) { }     // enter
        if (e.keyCode == 27) {       // esc
            hide();
        }
        //TODO: next, prev, up (zoom), down(zoom), +/-(zoom)
    });

    function show() {
        $box.show();
        $overlay.show();
    }

    function hide() {
        $box.hide();
        $overlay.hide();
    }

    function centerBox() {
        var height = $box.outerHeight();
        var width = $box.outerWidth();
        var top = Math.max(0, (($window.height() - height) / 2));
        var left = Math.max(0, (($window.width() - width) / 2));
        $box.css({ top: top, left: left });
    }

    function createScrollBox() {
        if (!$box.length) {
            $overlay = $('<div id="scroll-view-overlay"></div>');
            var $html = $(
                '<div id="scroll-view-box">' +
                '<img id="scroll-view-image" src=""/>' +
                '<div id="scroll-view-image-title"></div>' +
                '<div id="scroll-view-close-button"><span>×</span></div>' +
                '<div id="scroll-view-next-button"></div>' +
                '<div id="scroll-view-prev-button"></div>' +
                '</div>');
            $html.hide();
            $overlay.hide();
            $('body').append($overlay);
            $('body').append($html);

            $box = $('#scroll-view-box');
            $img = $('#scroll-view-image');
            $titleBox = $('#scroll-view-image-title');
            $closeButton = $('#scroll-view-close-button');
            $nextButton = $('#scroll-view-next-button');
            $prevButton = $('#scroll-view-prev-button');
            $box.drags();

            $overlay.click(function () {
                hide();
            });
            $closeButton.click(function() {
                hide();
            });

            $box.mousewheel(function (event) {
                resize((event.deltaY < 0) ? -1 : 1, event.clientX, event.clientY);
                event.preventDefault();
            });
        }
    }

    // zoomDirection - zoom: in -1 or zoom out: 1
    function resize(zoomDirection, clientX, clientY) {

        var mouseX = clientX - ($box.offset().left - $window.scrollLeft());
        var mouseY = clientY - ($box.offset().top - $window.scrollTop());

        var multiplier = 0.05 * zoomDirection;
        var width = $box.width();
        var paddingW = ($box.outerWidth() - $box.width()) / 2;
        var paddingH = ($box.outerHeight() - $box.height()) / 2;

        var newWidth = width + (width * multiplier);

        var mouseXDelta = ((mouseX - paddingW) * multiplier);
        var mouseYDelta = ((mouseY - paddingH) * multiplier);

        var boxTop = $box.offset().top;
        var boxLeft = $box.offset().left;

        $box.width(newWidth);
        $box.css({ top: boxTop - mouseYDelta - $window.scrollTop(), left: boxLeft - mouseXDelta - $window.scrollLeft() });
    }

    function adjustBoxSizeForImage() {
        log.write("adjustBoxSizeForImage", {for_src: $img[0].src});
        var imgWidth = $img[0].naturalWidth;
        var imgHeight = $img[0].naturalHeight;

        log.info({imgWidth: imgWidth, imgHeight: imgHeight});
        if (imgWidth == 0 || imgHeight == 0) {
            imgWidth = 128;
            imgHeight = 128; //TODO: loader size;
        }

        var paddingW = ($box.outerWidth() - $box.width());
        var paddingH = ($box.outerHeight() - $box.height());
        var titleBoxH = $titleBox.outerHeight();

        // place to show image
        //TODO: calculate image frame paddings
        var navButtonWidth = 40;
        var sw = $(window).width() - paddingW - navButtonWidth * 2;
        var sh = $(window).height() - paddingH - titleBoxH - 60;

        // image scales
        var kw = sw / imgWidth;
        var kh = sh / imgHeight;

        if (kw > 1 && kh > 1) {
            $box.width(imgWidth);
        }
        else if (kw < 1 || kh < 1) {
            if (kw > kh) {
                $box.width(imgWidth * kh);
            } else {
                $box.width(imgWidth * kw);
            }
        }
        else {
            $box.width(500);
        }
    }

    function showBox() {
        adjustBoxSizeForImage();
        centerBox();
        show();
    }

    $.ambaImageViewer = function (el, options) {
        var self = this;
        self.$el = $(el);
        self.el = el;
        self.$img = self.$el.find('img');

        self.init = function () {
            self.options = $.extend({}, $.ambaImageViewer.defaultOptions, options);
            self.imageSrc = self.$el.attr('href');

            createScrollBox();

            self.$el.click(function (e) {
                e.preventDefault();
                self.open();
            });
        };

        self.next = function() {
            if (!options.group) {
                return;
            }
            var nextIdx = options.groupIndex + 1 == options.group.length ? 0 : options.groupIndex + 1;
            var $nextPic = options.group[nextIdx];
            $nextPic.ambaImageViewer('open');
        };

        self.prev = function () {
            if (!options.group) {
                return;
            }
            var prevIdx = options.groupIndex == 0 ? options.group.length - 1 : options.groupIndex - 1;
            var $prevPic = options.group[prevIdx];
            $prevPic.ambaImageViewer('open');
        };

        self.hide = function() {
            hide();
        };

        self.open = function () {
            var img = new Image();
            img.src = self.imageSrc;

            if (!imageIsLoaded(img) && self.options.loaderImage) {
                log.write("show loader", {for_src: img.src});
                $img.attr('src', '');
                $img.attr('src', self.options.loaderImage);
                openPopup();
            }

            waitImageLoad(img, function () {
                $img.attr('src', img.src);
                openPopup();
            });
        };

        function openPopup() {
            // set image title from alt
            var alt = self.$img.attr('alt');
            if (!alt) {
                $titleBox.hide();
            } else {
                $titleBox.html(alt);
                $titleBox.show();
            }
            showOrHideNexPrevButtons();
            showBox();
        }

        function showOrHideNexPrevButtons() {
            if (!options.group) {
                $nextButton.hide();
                $prevButton.hide();
            } else {
                $nextButton.show();
                $prevButton.show();

                $nextButton.unbind('click');
                $nextButton.click(nextClick);
                $prevButton.unbind('click');
                $prevButton.click(prevClick);
            }
        }

        function prevClick() {
            self.prev();
        }

        function nextClick() {
            self.next();
        }

        self.init();
    };

    $.ambaImageViewer.defaultOptions = {
        loaderImage: "img/loader.gif"
    };

    $.fn.ambaImageViewer = function (options) {
        // call plugin method
        if (typeof options == "string") {
            this.each(function () {
                $(this).data('ambaImageViewer')[options]();
            });
            return;
        }
        if (!options)
            options = {};
        // group images by data-group tag
        var groups = {};

        return this.each(function (i, e) {
            var $el = $(e);
            var group = $el.attr('data-group');
            var newOptions = $.extend({}, options);
            if (group) {
                if (!groups[group]) {
                    groups[group] = [];
                }
                groups[group].push($el);
                newOptions.group = groups[group];
                newOptions.groupIndex = groups[group].length - 1;
            }
            //init plugin
            var viewer = new $.ambaImageViewer(e, newOptions);
            $el.data('ambaImageViewer', viewer);
        });
    };


    function imageIsLoaded(img) {
        return img.complete
            || img.readyState == "complete"
            || img.readyState == 4;
    }

    function waitImageLoad(img, callback) {
        log.write("start waiting", {src: img.src});
        if(imageIsLoaded(img)) {
            log.write("image already loaded", {src: img.src});
            callback(img);
            return;
        }
        $(img).one("load", callback).each(function(){
            log.write("image load fired", {src: img.src})
            if(imageIsLoaded(img)) {
                log.write("image just loaded", {src: img.src});
                callback(img);
            }
        });
    };

})(jQuery);