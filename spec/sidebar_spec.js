describe('StickySidebar', function () {

    beforeEach(function () {
        this.addMatchers({
            toHaveEvent: function (eventType) {
                return (this.actual.data('events')) && (typeof this.actual.data('events')[eventType] == 'object');
            }
        });
        setFixtures('<div id="container"><div class="content"></div><div class="sidebar"></div></div>');
        setStyleFixtures('.bottom-fixed {position: fixed; bottom: 0;}.top-fixed {position: fixed; top: 0;}');
    });

    it('should be a jQuery plugin', function () {
        expect(typeof $.fn.stickySidebar).toEqual('function');
    });

    describe('Invalid scenarios', function () {
        it('should do nothing when sidebar is greater than content', function () {
            $('.content').height(800);
            $('.sidebar').height(1000);
            $('#container').stickySidebar();
            expect($(window)).not.toHaveEvent('scroll');
            expect(typeof $(window).data('events')).toEqual('undefined');
        });

        it('should do nothing when sidebar is smaller than viewport', function () {
            spyOn($.fn, 'height').andReturn(2000);
            $('.content').height(400);
            $('.sidebar').height(800);
            $('#container').stickySidebar();
            expect($(window)).not.toHaveEvent('scroll');
            expect(typeof $(window).data('events')).toEqual('undefined');
        });
    });

    describe('Initialization', function () {
        it('should bind stickySidebar to window.scrollTo event', function () {
            $('.content').height(2000);
            $('.sidebar').height(1800);
            $('#container').stickySidebar();
            expect($(window)).toHaveEvent('scroll');
            expect($(window).data('events')['scroll'][0].namespace).toEqual('sticky_sidebar');
        });
    });

    describe('Scrolling', function () {
        beforeEach(function () {
            window.scrollTo(0, 0);
        });


        describe('Scroll down', function () {
            it('should add class "bottom-fixed" when scroll reaches the bottom of the sidebar', function () {
                $('.content').height(1000);
                $('.sidebar').height(500);
                $('#container').stickySidebar({tolerance: 0});
                window.scrollTo(0, 550);
                $(window).trigger('scroll');
                expect($('.sidebar')).toHaveClass('bottom-fixed');
            });

            it('should remove "scrolling-up" class if it exists and add "scrolling-down"', function () {
            });


            it('should calculate absolute offset if sidebar has class top-fixed', function () {
            });

            it('should clear position if scroll is out of boundaries', function () {
            });
        });

        describe('Scroll up', function () {

            it('should add class "top-fixed" when sidebar reaches the top of the sidebar', function () {
                $('.content').height(2000);
                $('.sidebar').height(500);
                $('#container').stickySidebar({tolerance: 0});
                window.scrollTo(0, 2000);
                $(window).trigger('scroll');
                window.scrollTo(0, 1800);
                $(window).trigger('scroll');
                window.scrollTo(0, 1000);
                $(window).trigger('scroll');
                expect($('.sidebar')).toHaveClass('top-fixed');
            });

            it('should remove "scrolling-down" class if it exists and add "scrolling-up"', function () {
            });

            it('should calculate absolute offset if sidebar has class bottom-fixed', function () {
            });

            it('should clear position if scroll is out of boundaries', function () {
            });
        });


    });

});
