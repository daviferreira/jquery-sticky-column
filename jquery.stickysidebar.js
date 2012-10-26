/*jslint browser:true */
/*global jQuery*/
'use strict';

(function ($, window, undefined) {

    var pluginName = 'stickySidebar',
        document = window.document,
        defaults = {
            sidebar: '.sidebar',
            content: '.content'
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

        $(window).bind('scroll.sidebar', function () {
            self.setScrollDirection()
                .setBoundaries()
                .positionSidebar();
        });
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
        if (this.lastScrollTop > this.boundaries.contentTop
                && this.lastScrollTop < this.boundaries.contentBottom) {
            this[this.scrollDirection === 'DOWN' ? 'scrollDown' : 'scrollUp']();
        } else if (this.lastScrollTop < this.boundaries.contentTop) {
            this.sidebar.css('top', '').removeClass('top-fixed');
        }
        return this;
    };

    Plugin.prototype.scrollDown = function () {
        this.sidebar.removeClass('scrolling-up').addClass('scrolling-down');
        if (this.lastScrollTop + this.boundaries.windowHeight > this.boundaries.contentBottom) {
            this.sidebar.removeClass('bottom-fixed').css({
                position: 'absolute',
                top: this.boundaries.contentHeight - this.boundaries.sidebarHeight
            });
        } else if (this.lastScrollTop + this.boundaries.windowHeight > this.boundaries.sidebarHeight + this.boundaries.contentTop) {
            this.sidebar.css('top', '').removeClass('top-fixed').addClass('bottom-fixed');
        }
    };

    Plugin.prototype.scrollUp = function () {
        this.sidebar.removeClass('scrolling-down').addClass('scrolling-up');
        if (this.lastScrollTop < this.boundaries.contentTop) {
            this.sidebar.css('position', '').removeClass('top-fixed');
        } else if (this.lastScrollTop < this.boundaries.contentBottom - this.boundaries.sidebarHeight) {
            this.sidebar.css('top', '').removeClass('bottom-fixed').addClass('top-fixed');
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
