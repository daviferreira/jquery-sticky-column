/*jslint browser:true */
/*global jQuery*/

(function ($, window) {
    'use strict';

    var pluginName = 'stickyColumn',
        defaults = {
            column: '.jquery-sticky-column',
            content: '.jquery-sticky-column-content',
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

        this.column = this.root.find(this.options.column);
        this.content = this.root.find(this.options.content);
        this.lastScrollTop = 0;

        if (this.canBeSticky() === true) {
            $(window).bind('scroll.jquery_sticky_column', function () {
                self.setScrollDirection()
                    .setBoundaries()
                    .positionColumn();
            });
        }
    };

    Plugin.prototype.canBeSticky = function () {
        return this.column.height() < this.content.height() &&
               this.column.height() > $(window).height();
    };

    Plugin.prototype.setBoundaries = function () {
        var contentTop = this.content.offset().top,
            contentHeight = this.content.outerHeight();
        this.boundaries = {
            contentTop: contentTop,
            contentBottom: contentTop + contentHeight,
            contentHeight: contentHeight,
            columnHeight: this.column.outerHeight(),
            windowHeight: $(window).height()
        };
        return this;
    };

    Plugin.prototype.positionColumn = function () {
        if (this.lastScrollTop > this.boundaries.contentTop &&
                this.lastScrollTop < this.boundaries.contentBottom) {
            this[this.scrollDirection === 'DOWN' ? 'scrollDown' : 'scrollUp']();
        } else if (this.lastScrollTop < this.boundaries.contentTop) {
            this.column.css('top', '').removeClass('jquery-sticky-column-top-fixed');
        }
        return this;
    };

    Plugin.prototype.scrollDown = function () {
        var windowScroll = this.lastScrollTop + this.boundaries.windowHeight,
            columnOffsetTop;
        if (this.column.hasClass('jquery-sticky-column-scrolling-up')) {
            this.column.removeClass('jquery-sticky-column-scrolling-up')
                .addClass('jquery-sticky-column-scrolling-down');
        } else if (this.column.hasClass('jquery-sticky-column-top-fixed')) {
            columnOffsetTop = this.column.offset().top - this.boundaries.contentTop;
            this.column.removeClass('jquery-sticky-column-top-fixed')
                .css({
                    position: 'absolute',
                    top: columnOffsetTop
                })
                .addClass('jquery-sticky-column-scrolling-down');
        }
        if (this.column.hasClass('jquery-sticky-column-scrolling-down')) {
            if (windowScroll > this.column.offset().top + this.boundaries.columnHeight) {
                this.column.css(clearPosition)
                            .addClass('jquery-sticky-column-bottom-fixed')
                            .removeClass('jquery-sticky-column-scrolling-down');
            }
        } else {
            if (windowScroll > this.boundaries.contentBottom) {
                this.column.removeClass('jquery-sticky-column-bottom-fixed').css({
                    position: 'absolute',
                    top: this.boundaries.contentHeight - this.boundaries.columnHeight
                });
            } else if (windowScroll + this.options.tolerance >
                       this.boundaries.columnHeight + this.boundaries.contentTop) {
                this.column.css(clearPosition)
                            .removeClass('jquery-sticky-column-top-fixed')
                            .addClass('jquery-sticky-column-bottom-fixed');
            }
        }
    };

    Plugin.prototype.scrollUp = function () {
        if (this.column.hasClass('jquery-sticky-column-scrolling-down')) {
            this.column.removeClass('jquery-sticky-column-scrolling-down')
                        .addClass('jquery-sticky-column-scrolling-up');
        } else if (this.column.hasClass('jquery-sticky-column-bottom-fixed')) {
            this.column.css({
                position: 'absolute',
                top: this.column.offset().top - this.boundaries.contentTop
            }).removeClass('jquery-sticky-column-bottom-fixed').addClass('jquery-sticky-column-scrolling-up');
        }
        if (this.column.hasClass('jquery-sticky-column-scrolling-up')) {
            if (this.lastScrollTop < this.column.offset().top) {
                this.column.css(clearPosition)
                            .addClass('jquery-sticky-column-top-fixed')
                            .removeClass('jquery-sticky-column-scrolling-up');
            }
        } else {
            if (this.lastScrollTop < this.boundaries.contentTop) {
                this.column.css('position', '').removeClass('jquery-sticky-column-top-fixed');
            } else if (this.lastScrollTop - this.options.tolerance <
                       this.boundaries.contentBottom - this.boundaries.columnHeight) {
                this.column.css(clearPosition)
                            .removeClass('jquery-sticky-column-bottom-fixed')
                            .addClass('jquery-sticky-column-top-fixed');
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
