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
        this.lastScrollTop = this.scrollDiff = 0;

        $(window).bind('scroll.sidebar', function () {
            self.setScrollDirection()
                .setBoundaries()
                .positionSidebar();
        });
    };

    Plugin.prototype.setBoundaries = function () {
        this.boundaries = {
            'anchorTop': this.content.parent().offset().top,
            'contentBottom': this.content.offset().top + this.content.outerHeight(),
            'windowBottom': this.lastScrollTop + $(window).height()
        };
        return this;
    };

    Plugin.prototype.positionSidebar = function () {
        this[this.scrollDirection === 'DOWN' ? 'scrollDown' : 'scrollUp']();
        return this;
    };

    Plugin.prototype.scrollDown = function () {
        if (this.sidebar.hasClass('top-fixed')) {
            this.sidebar.removeClass('top-fixed')
                        .css('top', this.sidebar.position().top - this.content.position().top + 'px')
                        .addClass('scrolling-down');
        } else {
            if (this.sidebar.hasClass('scrolling-up')) {
                this.sidebar.removeClass('scrolling-up').addClass('scrolling-down');
            }

            if (this.sidebar.hasClass('scrolling-down')) {
                if (this.boundaries.windowBottom > this.sidebar.offset().top + this.sidebar.outerHeight()) {
                    this.sidebar.addClass('bottom-fixed').css('top', '').removeClass('scrolling-down');
                }
            }
        }

        if (this.boundaries.windowBottom > (this.boundaries.anchorTop + this.sidebar.outerHeight()) && !this.sidebar.hasClass('scrolling-down')) {
            if ((this.lastScrollTop + $(window).height()) > this.boundaries.contentBottom) {
                this.sidebar.css({
                    position: 'absolute',
                    top: this.content.outerHeight() - this.sidebar.outerHeight()
                });
                this.sidebar.removeClass('bottom-fixed');
            } else {
                this.sidebar.addClass('bottom-fixed');
                this.sidebar.css({
                    top: '',
                    position: ''
                });
            }
        }
    };

    Plugin.prototype.scrollUp = function () {
        this.sidebar.addClass('scrolling-up');

        if (this.sidebar.offset().top > this.boundaries.windowBottom) {
            this.sidebar.css('top', this.boundaries.contentBottom - this.sidebar.outerHeight() - this.boundaries.anchorTop);
            return;
        }

        if (this.sidebar.hasClass('scrolling-down')) {
            this.sidebar.removeClass('scrolling-down');
        } else {
            if (this.sidebar.hasClass('bottom-fixed')) {
                this.sidebar.css({
                    position: 'absolute',
                    top: -(this.root.offset().top - this.sidebar.offset().top - this.boundaries.anchorTop)
                }).removeClass('bottom-fixed').addClass('scrolling-up');
            }

            if (this.sidebar.hasClass('scrolling-up')) {
                if (this.lastScrollTop < this.sidebar.offset().top) {
                    this.sidebar.css({
                        top: ''
                    }).addClass('top-fixed').removeClass('scrolling-up');
                }
            }

            if (this.lastScrollTop < this.boundaries.anchorTop) {
                this.sidebar.removeClass('top-fixed').css('position', '');
            }
        }
    };

    Plugin.prototype.setScrollDirection = function () {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > this.lastScrollTop) {
            this.scrollDirection = 'DOWN';
            this.scrollDiff = scrollTop - this.lastScrollTop;
        } else {
            this.scrollDirection = 'UP';
            this.scrollDiff = this.lastScrollTop - scrollTop;
        }

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
