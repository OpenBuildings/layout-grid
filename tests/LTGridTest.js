module('LTGrid');

test('construct same item', function () {
    var $container = $('#container1');
    var lt_grid = $container.lt_grid().data('lt-grid');

    equal(lt_grid, $container.lt_grid().data('lt-grid'));
    deepEqual(lt_grid.options, $.fn.lt_grid.Constructor.DEFAULTS);
});

test('construct options', function () {
    var $container = $('#container2');

    var expectedParams = {
        lg: {
            aspect: 0.6666666666666666,
            cols: 5,
            gap: 8,
            maxWidth: 80
        },
        md: {
            aspect: 0.6666666666666666,
            cols: 3,
            gap: 9,
            maxWidth: 90
        },
        sm: {
            aspect: 1.4,
            cols: 2,
            gap: 10,
            maxWidth: 992
        },
        xs: {
            aspect: 1.5,
            cols: 2,
            gap: 11,
            maxWidth: 110
        }
    };

    $container.lt_grid({
        resize: false,
        compact: false,
        overlap: true,
        params: {
            lg: {
                gap: 8,
                maxWidth: 80,
                cols: 5,
            },
            md: {
                gap: 9,
                maxWidth: 90,
            },
            sm: {
                gap: 10,
                aspect: 1.4
            },
            xs: {
                gap: 11,
                maxWidth: 110,
                cols: 2,
                aspect: 1.5
            }
        }
    });

    equal($container.data('lt-grid').options.resize, false);
    equal($container.data('lt-grid').options.compact, false);
    equal($container.data('lt-grid').options.overlap, true);
    deepEqual($container.data('lt-grid').options.params, expectedParams);

    $container.lt_grid('option', 'resize', true);
    $container.lt_grid('option', 'compact', true);
    $container.lt_grid('option', 'overlap', false);

    equal($container.data('lt-grid').options.resize, true);
    equal($container.data('lt-grid').options.compact, true);
    equal($container.data('lt-grid').options.overlap, false);
});

test('windowWidth', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var width = $(window).width();

    equal(lt_grid.windowWidth(), width);
});

test('size', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);

    lt_grid.windowWidth = function () { return 1500; };
    equal(lt_grid.size(), 'lg');

    lt_grid.windowWidth = function () { return 1000; };
    equal(lt_grid.size(), 'md');

    lt_grid.windowWidth = function () { return 800; };
    equal(lt_grid.size(), 'sm');

    lt_grid.windowWidth = function () { return 300; };
    equal(lt_grid.size(), 'xs');
});

test('ghost', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var $widget = $('#rect1');
    var $ghost = lt_grid.ghost($widget);

    equal($ghost[0], lt_grid.ghost($widget)[0]);
    equal($ghost.parent()[0], $widget.parent()[0]);
    deepEqual($ghost.lt_rect('lg'), $widget.lt_rect('lg'));

    lt_grid.removeGhost();

    equal($ghost.parent().length, 0);

    lt_grid.removeGhost();
});

test('compact', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    lt_grid.windowWidth = function () { return 1500; };
    lt_grid.compact();

    deepEqual(
        lt_grid.grid('lg').rects,
        [
            new $.lt.Rect(0, 0, 1, 1),
            new $.lt.Rect(1, 0, 1, 2),
            new $.lt.Rect(0, 1, 1, 1)
        ]
    );
});

test('resize', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    lt_grid.windowWidth = function () { return 1500; };
    lt_grid.resize();

    var rect = $('#container1').lt_rect('lg');

    equal(rect.h, 3);
});

test('itemWidth', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    $('#container1').width(750);
    equal(lt_grid.itemWidth('lg'), 186.75);
});

test('itemHeight', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);

    $('#container1').width(750);

    equal(lt_grid.itemHeight('lg'), 124.5);
});

