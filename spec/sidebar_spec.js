/*global $, it, expect, spyOn, describe, beforeEach,
         setFixtures, setStyleFixtures*/
describe('StickyColumn', function () {

    'use strict';

    beforeEach(function () {
        this.addMatchers({
            toHaveEvent: function (eventType) {
                return (this.actual.data('events')) && (typeof this.actual.data('events')[eventType] === 'object');
            }
        });
        setFixtures('<div id="container"><div class="content"></div><div class="column"></div></div>');
        setStyleFixtures('#container{position: relative;}.bottom-fixed {position: fixed; bottom: 0;}.top-fixed {position: fixed; top: 0;}');
    });

    it('should be a jQuery plugin', function () {
        expect(typeof $.fn.stickyColumn).toEqual('function');
    });

    describe('Invalid scenarios', function () {
        it('should do nothing when column is greater than content', function () {
            $('.content').height(800);
            $('.column').height(1000);
            $('#container').stickyColumn();
            expect($(window)).not.toHaveEvent('scroll');
            expect(typeof $(window).data('events')).toEqual('undefined');
        });

        it('should do nothing when column is smaller than viewport', function () {
            spyOn($.fn, 'height').andReturn(2000);
            $('.content').height(400);
            $('.column').height(800);
            $('#container').stickyColumn();
            expect($(window)).not.toHaveEvent('scroll');
            expect(typeof $(window).data('events')).toEqual('undefined');
        });
    });

    describe('Initialization', function () {
        it('should bind stickyColumn to window.scrollTo event', function () {
            $('.content').height(2000);
            $('.column').height(1800);
            $('#container').stickyColumn();
            expect($(window)).toHaveEvent('scroll');
            expect($(window).data('events').scroll[0].namespace).toEqual('sticky_column');
        });
    });

    describe('Scrolling', function () {
        beforeEach(function () {
            window.scrollTo(0, 0);
        });

        describe('Scroll down', function () {
            it('should add class "bottom-fixed" when scroll reaches the bottom of the column', function () {
                $('.content').height(1000);
                $('.column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 550);
                $(window).trigger('scroll');
                expect($('.column')).toHaveClass('bottom-fixed');
            });

            it('should remove "scrolling-up" class if it exists and add "scrolling-down"', function () {
                $('.content').height(1000);
                $('.column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                $('.column').addClass('scrolling-up');
                window.scrollTo(0, 550);
                $(window).trigger('scroll');
                expect($('.column')).toHaveClass('scrolling-down');
                expect($('.column')).not.toHaveClass('scrolling-up');
            });

            it('should calculate absolute offset if column has class top-fixed', function () {
                $('.content').height(2000);
                $('.column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 2000);
                $(window).trigger('scroll');
                window.scrollTo(0, 1800);
                $(window).trigger('scroll');
                window.scrollTo(0, 1000);
                $(window).trigger('scroll');
                window.scrollTo(0, 1200);
                $(window).trigger('scroll');
                expect($('.column')).not.toHaveClass('top-fixed');
                expect($('.column')).toHaveClass('scrolling-down');
                expect($('.column')).toHaveCss({position: 'absolute',
                                                 top: '836px'});
            });
        });

        describe('Scroll up', function () {

            it('should add class "top-fixed" when column reaches the top of the column', function () {
                $('.content').height(2000);
                $('.column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 2000);
                $(window).trigger('scroll');
                window.scrollTo(0, 1800);
                $(window).trigger('scroll');
                window.scrollTo(0, 1000);
                $(window).trigger('scroll');
                expect($('.column')).toHaveClass('top-fixed');
            });

            it('should remove "scrolling-down" class if it exists and add "scrolling-up"', function () {
                $('.content').height(1000);
                $('.column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 850);
                $(window).trigger('scroll');
                window.scrollTo(0, 800);
                $(window).trigger('scroll');
                expect($('.column')).toHaveClass('scrolling-up');
                expect($('.column')).not.toHaveClass('scrolling-down');
            });

            it('should calculate absolute offset if column has class bottom-fixed', function () {
                $('.content').height(1000);
                $('.column').height(500);
                $('#container').stickyColumn({tolerance: 0});
                window.scrollTo(0, 850);
                $(window).trigger('scroll');
                expect($('.column')).toHaveClass('bottom-fixed');
                window.scrollTo(0, 830);
                $(window).trigger('scroll');
                expect($('.column')).not.toHaveClass('bottom-fixed');
                expect($('.column')).toHaveClass('scrolling-up');
                expect($('.column')).toHaveCss({position: 'absolute',
                                                 top: '154px'});
            });
        });


    });

});
