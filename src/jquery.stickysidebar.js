/*jslint browser:true */
/*global jQuery*/

(function ($, window, undefined) {
    'use strict';

    var pluginName = 'stickySidebar',
        document = window.document,
        defaults = {
            sidebar: '.sidebar',
            content: '.content',
            tolerance: 110
        },
        clearPosition = {
            position: '',
            top: ''
        };

    function Plugin(element, options) {
        this.options = $.extend({}, defaults, options);

        this.defaults = defaults;
        this.name = pluginName;

        this.root = $(element);

        this.init();
    }

    Plugin.prototype.init = function () {
        var self = this;

        this.sidebar = this.root.find(this.options.sidebar);
        this.content = this.root.find(this.options.content);
        this.lastScrollTop = 0;

        if (this.canBeSticky() === true) {
            $(window).bind('scroll.sticky_sidebar', function () {
                self.setScrollDirection()
                    .setBoundaries()
                    .positionSidebar();
            });
        }
    };

    Plugin.prototype.canBeSticky = function () {
        return this.sidebar.height() < this.content.height() && 
               this.sidebar.height() > $(window).height();
    };

    Plugin.prototype.setBoundaries = function () {
        var contentTop = this.content.offset().top,
            contentHeight = this.content.outerHeight();
        this.boundaries = {
            contentTop: contentTop,
            contentBottom: contentTop + contentHeight,
            contentHeight: contentHeight,
            sidebarHeight: this.sidebar.outerHeight(),
            windowHeight: $(window).height()
        };
        return this;
    };

    Plugin.prototype.positionSidebar = function () {
        if (this.lastScrollTop > this.boundaries.contentTop &&
            this.lastScrollTop < this.boundaries.contentBottom) {
            this[this.scrollDirection === 'DOWN' ? 'scrollDown' : 'scrollUp']();
        } else if (this.lastScrollTop < this.boundaries.contentTop) {
            this.sidebar.css('top', '').removeClass('top-fixed');
        }
        return this;
    };

    Plugin.prototype.scrollDown = function () {
        var windowScroll = this.lastScrollTop + this.boundaries.windowHeight,
            sidebarOffsetTop;
        if (this.sidebar.hasClass('scrolling-up')) {
            this.sidebar.removeClass('scrolling-up') 
                .addClass('scrolling-down');
        } else if (this.sidebar.hasClass('top-fixed')) {
            sidebarOffsetTop = this.sidebar.offset().top - this.boundaries.contentTop;
            this.sidebar.removeClass('top-fixed')
                .css({
                    position: 'absolute',
                    top: sidebarOffsetTop
                })
                .addClass('scrolling-down');
        }
          if (this.sidebar.hasClass('scrolling-down')) {
            if (windowScroll > this.sidebar.offset().top + this.boundaries.sidebarHeight) {
                this.sidebar.css(clearPosition)
                            .addClass('bottom-fixed')
                            .removeClass('scrolling-down');
            }
        } else {
            if (windowScroll > this.boundaries.contentBottom) {
                this.sidebar.removeClass('bottom-fixed').css({
                    position: 'absolute',
                    top: this.boundaries.contentHeight - this.boundaries.sidebarHeight
                });
            } else if (windowScroll + this.options.tolerance >
                       this.boundaries.sidebarHeight + this.boundaries.contentTop) {
                this.sidebar.css(clearPosition)
                            .removeClass('top-fixed')
                            .addClass('bottom-fixed');
            }
        }
    };

    Plugin.prototype.scrollUp = function () {
        if (this.sidebar.hasClass('scrolling-down')) {
          this.sidebar.removeClass('scrolling-down') 
                      .addClass('scrolling-up');
        } else if (this.sidebar.hasClass('bottom-fixed')) {
            this.sidebar.css({
                position: 'absolute',
                top: this.sidebar.offset().top - this.boundaries.contentTop
            }).removeClass('bottom-fixed').addClass('scrolling-up');
        }
        if (this.sidebar.hasClass('scrolling-up')) {
            if (this.lastScrollTop < this.sidebar.offset().top) {
                this.sidebar.css(clearPosition)
                            .addClass('top-fixed')
                            .removeClass('scrolling-up');
            }
        } else {
            if (this.lastScrollTop < this.boundaries.contentTop) {
                this.sidebar.css('position', '').removeClass('top-fixed');
            } else if (this.lastScrollTop - this.options.tolerance <
                       this.boundaries.contentBottom - this.boundaries.sidebarHeight) {
                this.sidebar.css(clearPosition)
                            .removeClass('bottom-fixed')
                            .addClass('top-fixed');
            }
        }
    };

    Plugin.prototype.setScrollDirection = function () {
        var scrollTop = $(window).scrollTop();
        this.scrollDirection = (scrollTop > this.lastScrollTop ? 'DOWN' : 'UP');
        this.lastScrollTop = scrollTop;
        return this;
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

}(jQuery, window));
