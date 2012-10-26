/*! jQuery Sticky Sidebar plugin - v0.1.0 - 2012-10-26
* https://github.com/daviferreira/jquery_sticky_sidebar/
* Copyright (c) 2012 Davi Ferreira; Licensed THE BEER-WARE LICENSE */

/*global jQuery*/

(function ($, window, undefined) {
    'use strict';

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
        if (this.lastScrollTop > this.boundaries.contentTop && this.lastScrollTop < this.boundaries.contentBottom) {
            this[this.scrollDirection === 'DOWN' ? 'scrollDown' : 'scrollUp']();
        } else if (this.lastScrollTop < this.boundaries.contentTop) {
            this.sidebar.css('top', '').removeClass('top-fixed');
        }
        return this;
    };

    Plugin.prototype.scrollDown = function () {
        var windowScroll = this.lastScrollTop + this.boundaries.windowHeight,
            sidebarOffsetTop;
        if (this.sidebar.hasClass('top-fixed')) {
            sidebarOffsetTop = this.sidebar.offset().top - this.boundaries.contentTop;
            this.sidebar.removeClass('top-fixed')
                .css({
                    top: sidebarOffsetTop
                })
                .addClass('scrolling-down');
        }
        if (this.sidebar.hasClass('scrolling-down')) {
            if (windowScroll > this.sidebar.offset().top + this.boundaries.sidebarHeight) {
                this.sidebar.css({
                    position: '',
                    top: ''
                }).addClass('bottom-fixed').removeClass('scrolling-down');
            }
        } else {
            if (windowScroll > this.boundaries.contentBottom) {
                this.sidebar.removeClass('bottom-fixed').css({
                    position: 'absolute',
                    top: this.boundaries.contentHeight - this.boundaries.sidebarHeight
                });
            } else if (windowScroll > this.boundaries.sidebarHeight + this.boundaries.contentTop) {
                this.sidebar.css({
                    position: '',
                    top: ''
                }).removeClass('top-fixed').addClass('bottom-fixed');
            }
        }
    };

    Plugin.prototype.scrollUp = function () {
        if (this.sidebar.hasClass('bottom-fixed')) {
            this.sidebar.css({
                position: 'absolute',
                top: this.sidebar.offset().top - this.boundaries.contentTop
            }).removeClass('bottom-fixed').addClass('scrolling-up');
        }
        if (this.sidebar.hasClass('scrolling-up')) {
            if (this.lastScrollTop < this.sidebar.offset().top) {
                this.sidebar.css({
                    position: '',
                    top: ''
                }).addClass('top-fixed').removeClass('scrolling-up');
            }
        } else {
            if (this.lastScrollTop < this.boundaries.contentTop) {
                this.sidebar.css('position', '').removeClass('top-fixed');
            } else if (this.lastScrollTop < this.boundaries.contentBottom - this.boundaries.sidebarHeight) {
                this.sidebar.css({
                    position: '',
                    top: ''
                }).removeClass('bottom-fixed').addClass('top-fixed');
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
