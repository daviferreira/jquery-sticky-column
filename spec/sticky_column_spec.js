/*global $, it, expect, spyOn, describe, beforeEach,
         setFixtures, setStyleFixtures*/
describe('StickyColumn', function () {

    'use strict';

    beforeEach(function () {
        $.fx.off = true;
        this.addMatchers({
            toHaveEvent: function (eventType) {
                return (this.actual.data('events')) && (typeof this.actual.data('events')[eventType] === 'object');
            }
        });
        setFixtures('<div id="container"><div class="jquery-sticky-column-content"></div><div class="jquery-sticky-column"></div></div>');
        setStyleFixtures('#container{position: relative;}.jquery-sticky-column-bottom-fixed {position: fixed; bottom: 0;}.jquery-sticky-column-top-fixed {position: fixed; top: 0;}');
    });

    it('should be a jQuery plugin', function () {
        expect(typeof $.fn.stickyColumn).toEqual('function');
    });

    describe('Invalid scenarios', function () {
        it('should do nothing when column is greater than content', function () {
            $('.jquery-sticky-column-content').height(800);
            $('.jquery-sticky-column').height(1000);
            $('#container').stickyColumn();
            expect($(window)).not.toHaveEvent('scroll');
            expect(typeof $(window).data('events')).toEqual('undefined');
        });

        it('should do nothing when column is smaller than viewport', function () {
            spyOn($.fn, 'height').andReturn(2000);
            $('.jquery-sticky-column-content').height(400);
            $('.jquery-sticky-column').height(800);
            $('#container').stickyColumn();
            expect($(window)).not.toHaveEvent('scroll');
            expect(typeof $(window).data('events')).toEqual('undefined');
        });
    });

    describe('Initialization', function () {
        it('should bind stickyColumn to window.scrollTo event', function () {
            $('.jquery-sticky-column-content').height(2000);
            $('.jquery-sticky-column').height(1800);
            $('#container').stickyColumn();
            expect($(window)).toHaveEvent('scroll');
            expect($(window).data('events').scroll[0].namespace).toEqual('jquery_sticky_column');
        });
    });

    describe('Scrolling', function () {
        beforeEach(function () {
            window.scrollTo(0, 0);
        });

        describe('Scroll down', function () {
            it('should add class "jquery-sticky-column-bottom-fixed" when scroll reaches the bottom of the column', function () {
                $('.jquery-sticky-column-content').height(1000);
                $('.jquery-sticky-column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 550);
                $(window).trigger('scroll');
                expect($('.jquery-sticky-column')).toHaveClass('jquery-sticky-column-bottom-fixed');
            });

            it('should remove "jquery-sticky-column-scrolling-up" class if it exists and add "jquery-sticky-column-scrolling-down"', function () {
                $('.jquery-sticky-column-content').height(1000);
                $('.jquery-sticky-column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                $('.jquery-sticky-column').addClass('jquery-sticky-column-scrolling-up');
                window.scrollTo(0, 550);
                $(window).trigger('scroll');
                expect($('.jquery-sticky-column')).toHaveClass('jquery-sticky-column-scrolling-down');
                expect($('.jquery-sticky-column')).not.toHaveClass('jquery-sticky-column-scrolling-up');
            });

            it('should calculate absolute offset if column has class jquery-sticky-column-top-fixed', function () {
                $('.jquery-sticky-column-content').height(2000);
                $('.jquery-sticky-column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 2000);
                $(window).trigger('scroll');
                window.scrollTo(0, 1800);
                $(window).trigger('scroll');
                window.scrollTo(0, 1000);
                $(window).trigger('scroll');
                window.scrollTo(0, 1200);
                $(window).trigger('scroll');
                expect($('.jquery-sticky-column')).not.toHaveClass('jquery-sticky-column-top-fixed');
                expect($('.jquery-sticky-column')).toHaveClass('jquery-sticky-column-scrolling-down');
                expect($('.jquery-sticky-column')).toHaveCss({position: 'absolute',
                                                top: ($('.jquery-sticky-column:first').offset().top - $('.jquery-sticky-column-content:first').offset().top) + 'px'});
            });
        });

        describe('Scroll up', function () {

            it('should add class "jquery-sticky-column-top-fixed" when column reaches the top of the column', function () {
                $('.jquery-sticky-column-content').height(2000);
                $('.jquery-sticky-column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 2000);
                $(window).trigger('scroll');
                window.scrollTo(0, 1800);
                $(window).trigger('scroll');
                window.scrollTo(0, 1000);
                $(window).trigger('scroll');
                expect($('.jquery-sticky-column')).toHaveClass('jquery-sticky-column-top-fixed');
            });

            it('should remove "jquery-sticky-column-scrolling-down" class if it exists and add "jquery-sticky-column-scrolling-up"', function () {
                $('.jquery-sticky-column-content').height(1000);
                $('.jquery-sticky-column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 850);
                $(window).trigger('scroll');
                window.scrollTo(0, 800);
                $(window).trigger('scroll');
                expect($('.jquery-sticky-column')).toHaveClass('jquery-sticky-column-scrolling-up');
                expect($('.jquery-sticky-column')).not.toHaveClass('jquery-sticky-column-scrolling-down');
            });

            it('should calculate absolute offset if column has class jquery-sticky-column-bottom-fixed', function () {
                $('.jquery-sticky-column-content').height(1000);
                $('.jquery-sticky-column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 850);
                $(window).trigger('scroll');
                expect($('.jquery-sticky-column')).toHaveClass('jquery-sticky-column-bottom-fixed');
                window.scrollTo(0, 830);
                $(window).trigger('scroll');
                expect($('.jquery-sticky-column')).not.toHaveClass('jquery-sticky-column-bottom-fixed');
                expect($('.jquery-sticky-column')).toHaveClass('jquery-sticky-column-scrolling-up');
                expect($('.jquery-sticky-column')).toHaveCss({position: 'absolute',
                                                 top: ($('.jquery-sticky-column:first').offset().top - $('.jquery-sticky-column-content:first').offset().top) + 'px'});
            });
        });
    });

    describe('Boundaries', function () {
        describe('Position column', function () {
            it('should reset column position when scrollTop is less than contentTop', function () {
                $('.jquery-sticky-column-content').height(1000).css('margin-top', 300);
                $('.jquery-sticky-column').height(500).css('margin-top', 300).addClass('jquery-sticky-column-top-fixed');
                $('#container').stickyColumn({tolerance: 0});
                expect($('.jquery-sticky-column')).toHaveClass('jquery-sticky-column-top-fixed');
                spyOn($.fn, 'css').andCallThrough();
                window.scrollTo(0, 850);
                $(window).trigger('scroll');
                expect($('.jquery-sticky-column')).not.toHaveClass('jquery-sticky-column-top-fixed');
                expect($.fn.css).toHaveBeenCalledWith('top', '');
                expect($('.jquery-sticky-column').css('top')).toBe('auto');
            });
        });

        /*
        describe('Scrolling up', function () {
            it('should reset column position when scrollTop is less than contentTop', function () {
            });
        });

        describe('Scrolling down', function () {
            it('should reset column position when windowScroll is greater than contentBottom', function () {
            });
        });
        */
    });

});
