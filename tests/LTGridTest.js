module('LTGrid');

QUnit.begin(function () {
    $.lt.currentEventData = null;
    $('#container1').removeData('lt-grid');
});

test('Constructor with default options', function () {
    var $container = $('#container1');
    var lt_grid = $container.lt_grid().data('lt-grid');

    equal(lt_grid, $container.lt_grid().data('lt-grid'), 'Set the lt_grid object as data object');
    deepEqual(lt_grid.options, $.extend($.fn.lt_grid.Constructor.DEFAULTS, {arrange: 'layout-grid'}), 'Set DEFAULTS to options');
});

test('Constructor with custom options and modifiable options', function () {
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
        arrange: 'layout-grid',
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

    equal($container.data('lt-grid').options.resize, false, 'Match the passed option for resize');
    equal($container.data('lt-grid').options.compact, false, 'Match the passed option for compact');
    equal($container.data('lt-grid').options.overlap, true, 'Match the passed option for overlap');
    deepEqual($container.data('lt-grid').options.params, expectedParams, 'Match the passed option for params');

    $container.lt_grid('option', 'resize', true);
    $container.lt_grid('option', 'compact', true);
    $container.lt_grid('option', 'overlap', false);

    equal($container.data('lt-grid').options.resize, true, 'Match the changed option for resize');
    equal($container.data('lt-grid').options.compact, true, 'Match the changed option for compact');
    equal($container.data('lt-grid').options.overlap, false, 'Match the changed option for overlap');
});

test('windowWidth method', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var width = $(window).width();

    equal(lt_grid.windowWidth(), width, 'Are the same width as window');
});

test('size method', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);

    lt_grid.windowWidth = function () { return 1500; };
    equal(lt_grid.size(), 'lg', 'Match size for lg size (≥1200px)');

    lt_grid.windowWidth = function () { return 1000; };
    equal(lt_grid.size(), 'md', 'Match size for md size (≥992px) ');

    lt_grid.windowWidth = function () { return 800; };
    equal(lt_grid.size(), 'sm', 'Match size for sm size (≥768px) ');

    lt_grid.windowWidth = function () { return 300; };
    equal(lt_grid.size(), 'xs', 'Match size for xs size (<768px) ');
});

test('ghost setter / getter', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var $widget = $('#rect1');
    var $ghost = lt_grid.ghost($widget);

    equal($ghost[0], lt_grid.ghost($widget)[0], 'Return the same object when called twice');
    equal($ghost.parent()[0], $widget.parent()[0], 'Is inside the same container');
    deepEqual($ghost.lt_rect('lg'), $widget.lt_rect('lg'), 'Is with the same Rect as the widget');

    lt_grid.removeGhost();

    equal($ghost.parent().length, 0, 'Ghost is removed from the DOM');
    equal(lt_grid.$ghost, null, 'Reference set to null');

    lt_grid.removeGhost();
});

test('compact method', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    lt_grid.windowWidth = function () { return 1500; };
    lt_grid.compact();

    deepEqual(
        lt_grid.grid('lg').rects,
        [
            new $.lt.Rect(0, 0, 1, 1),
            new $.lt.Rect(1, 0, 1, 2),
            new $.lt.Rect(0, 1, 1, 1)
        ],
        'Rects of the widgets are properly compacted for the "lg" size'
    );
});

test('resize method', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    lt_grid.windowWidth = function () { return 1500; };
    lt_grid.resize();

    var rect = $('#container1').lt_rect('lg');

    equal(rect.h, 3, 'Height of the grid container should be shrinked to 3');
});

test('itemWidth getter', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    $('#container1').width(750);
    equal(lt_grid.itemWidth('lg'), 186.75, 'The width of a single cell in the grid with 750');
});

test('itemHeight getter', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);

    $('#container1').width(750);

    equal(lt_grid.itemHeight('lg'), 124.5, 'The height of a single cell in the grid with width 750');
});

test('update method without any options', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    lt_grid.options.compact = false;
    lt_grid.options.resize = false;

    lt_grid.update();

    deepEqual(
        lt_grid.grid('lg').rects,
        [
            new $.lt.Rect(0, 0, 1, 1),
            new $.lt.Rect(1, 0, 1, 2),
            new $.lt.Rect(0, 2, 1, 1)
        ],
        'Rects of the widgets are properly compacted for the "lg" size'
    );

    lt_grid.options.compact = true;
    lt_grid.options.resize = true;

});

test('moveGhost method', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var $widget = $('#rect1');
    var $ghost = lt_grid.ghost($widget);
    lt_grid.windowWidth = function () { return 1500; };

    deepEqual($ghost.lt_rect('lg'), new $.lt.Rect(0, 0, 1, 1), 'Initial position and size of the ghost');

    lt_grid.moveGhost($widget, 500, 500);

    deepEqual($ghost.lt_rect('lg'), new $.lt.Rect(1, 2, 1, 1), 'Moved position and size of the ghost');
});

test('mask getter / setter', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var $mask = lt_grid.mask();

    equal($mask[0], lt_grid.mask()[0], 'Return the same object when called twice');
    ok($mask.hasClass('lt-mask'), 'Have a lt-mask class');
    equal($mask.parent()[0], $('#container1')[0], 'Is child of the container');

    lt_grid.removeMask();

    equal($mask.parent().length, 0, 'Removed from container');
    equal(lt_grid.$mask, null, 'Reference set to null');

    lt_grid.removeMask();

    equal(lt_grid.$mask, null, 'Fine to be called multiple times');
});

test('end method', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var $widget = $('#rect1');

    lt_grid.windowWidth = function () { return 1500; };

    lt_grid.ghost($widget);
    lt_grid.mask();

    lt_grid.end();

    deepEqual(
        lt_grid.grid('lg').rects,
        [
            new $.lt.Rect(0, 0, 1, 1),
            new $.lt.Rect(1, 0, 1, 2),
            new $.lt.Rect(0, 1, 1, 1)
        ],
        'Rects are compacted'
    );

    equal($('#container1').lt_rect('lg').h, 2, 'Container is resized');

    ok($('#container1').find('lt-ghost').length === 0, 'Ghost is removed');
    ok($('#container1').find('lt-mask').length === 0, 'Mask is removed');
});

test('grid getter / setter', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var grid = lt_grid.grid('lg');

    ok(grid instanceof $.lt.Grid);

    deepEqual(
        grid.rects,
        [
            new $.lt.Rect(0, 0, 1, 1),
            new $.lt.Rect(1, 0, 1, 2),
            new $.lt.Rect(0, 2, 1, 1)
        ],
        'Rects of the widgets are retrieved properly for the "lg" size'
    );

    grid.rects[0].y = 1;
    grid.rects[1].y = 2;
    grid.rects[2].y = 4;

    lt_grid.grid('lg', grid);

    deepEqual($('#rect1').lt_rect('lg'), new $.lt.Rect(0, 1, 1, 1), 'Is modified by grid setter');
    deepEqual($('#rect2').lt_rect('lg'), new $.lt.Rect(1, 2, 1, 2), 'Is modified by grid setter');
    deepEqual($('#rect3').lt_rect('lg'), new $.lt.Rect(0, 4, 1, 1), 'Is modified by grid setter');
});

test('reposition method', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var $widget = $('#rect1');

    lt_grid.windowWidth = function () { return 1500; };

    lt_grid.reposition($widget, {x: 1, y: 0, w: 2, h: 2});

    deepEqual(
        lt_grid.grid('lg').rects,
        [
            new $.lt.Rect(1, 0, 2, 2),
            new $.lt.Rect(1, 2, 1, 2),
            new $.lt.Rect(0, 0, 1, 1)
        ],
        'Widgets move around to keep the grid from overlapping after repositioning, compact & resize'
    );
});

test('reposition method without overlap ', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);

    lt_grid.option('overlap', true);

    var $widget = $('#rect1');

    lt_grid.windowWidth = function () { return 1500; };

    lt_grid.reposition($widget, {x: 1, y: 0, w: 2, h: 2});

    deepEqual(
        lt_grid.grid('lg').rects,
        [
            new $.lt.Rect(1, 0, 2, 2),
            new $.lt.Rect(1, 0, 1, 2),
            new $.lt.Rect(0, 0, 1, 1)
        ],
        'Widgets move around with overlapping'
    );

    lt_grid.option('overlap', false);
});


test('moveToGhost method', function () {
    var lt_grid = new $.fn.lt_grid.Constructor($('#container1'), $.fn.lt_grid.Constructor.DEFAULTS);
    var $widget = $('#rect1');
    lt_grid.windowWidth = function () { return 1500; };
    var $ghost = lt_grid.ghost($widget);

    lt_grid.moveGhost($widget, 300, 160);

    lt_grid.moveToGhost($widget);

    deepEqual(
        $widget.lt_rect('lg'),
        new $.lt.Rect(1, 0, 1, 1),
        'New rect postion the same as ghost'
    );
});

test('Events', function () {
    var dragstart = $.Event('dragstart', {
        originalEvent: {
            dataTransfer: null
        }
    });

    var dragover = $.Event('dragover', {
        originalEvent: {
            dataTransfer: null,
            pageX: 300 + ($('#container1').offset().left),
            pageY: 260 + ($('#container1').offset().top),
        }
    });

    var dragoverTouch = $.Event('touchmove', {
        originalEvent: {
            dataTransfer: null,
            touches: [
                {
                    pageX: 300 + ($('#container1').offset().left),
                    pageY: 260 + ($('#container1').offset().top),
                }
            ]
        }
    });

    var drop = $.Event('drop', {
        originalEvent: {
            dataTransfer: null,
        }
    });

    var dragleave = $.Event('dragleave', {
        originalEvent: {
            dataTransfer: null,
        }
    });

    var dragend = $.Event('dragend', {
        originalEvent: {
            dataTransfer: null,
        }
    });

    $('#container1').lt_grid().data('lt-grid').windowWidth = function () { return 1500; };

    $('#rect1').trigger(dragstart);
    $('#container1').trigger(dragover);

    deepEqual(
        $('#container1').lt_grid().data('lt-grid').ghost($('#rect1')).lt_rect('lg'),
        new $.lt.Rect(1, 1, 1, 1)
    );

    $('#container1').trigger(dragleave);

    dragleave.target = $('#container1 .lt-mask')[0];
    $('#container1').trigger(dragleave);

    equal(0, $('#container1 lt-mask').length);

    $('#container1').trigger(dragoverTouch);

    $('#container1').trigger(drop);

    deepEqual(
        $('#rect1').lt_rect('lg'),
        new $.lt.Rect(1, 0, 1, 1)
    );

    $('#container1').trigger(dragend);

    equal(0, $('#container1 .lt-ghost').length);

    $.lt.currentEventData = null;

    $('#container1').trigger(dragover);
    $('#container1').trigger(drop);

});

