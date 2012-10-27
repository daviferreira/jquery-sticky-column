describe('StickySidebar', function () {

    beforeEach(function () {
        this.addMatchers({
            toHaveEvent: function (eventType) {
                return (this.actual.data('events')) && (typeof this.actual.data('events')[eventType] == 'object');
            }
        });
        setFixtures('<div id="container"><div class="content"></div><div class="sidebar"></div></div>');
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
        it('should bind stickySidebar to window scroll event', function () {
            $('.content').height(2000);
            $('.sidebar').height(1800);
            $('#container').stickySidebar();
            expect($(window)).toHaveEvent('scroll');
            expect($(window).data('events')['scroll'][0].namespace).toEqual('sticky_sidebar');
        });
    });

    describe('Scroll down', function () {
        it('should add class "scrolling-down"', function () {
            $('body').height(2000);
            $('.content').height(2000);
            $('.sidebar').height(1800);
            $('#container').stickySidebar();
            setTimeout(function () {
                window.scroll(0, 500);
                expect($('.sidebar')).not.toHaveClass('scrolling-up');
                expect($('.sidebar')).toHaveClass('scrolling-down');
                $('body').height('auto');
            }, 100);
        });

        it('should add class "bottom-fixed" when sidebar reaches the bottom of the container', function () {
        });

        it('should calculate absolute offset if sidebar has class top-fixed', function () {
        });
    });

    describe('Scroll up', function () {
        it('should add class "scrolling-up"', function () {
            $('body').height(2000);
            $('.content').height(2000);
            $('.sidebar').height(1800);
            $('#container').stickySidebar();
            window.scroll(0, 500);
            setTimeout(function () {
                window.scroll(0, 0);
                expect($('.sidebar')).not.toHaveClass('scrolling-down');
                expect($('.sidebar')).toHaveClass('scrolling-up');
                $('body').height('auto');
            }, 100);
        });

        it('should add class "top-fixed" when sidebar reaches the top of the container', function () {
        });

        it('should calculate absolute offset if sidebar has class bottom-fixed', function () {
        });
    });

});
