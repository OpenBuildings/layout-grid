$(function () {
    'use strict';

    QUnit.module('LTGrid', {
        beforeEach: function () {
            Store.clear()
            $('#container1').removeData('lt-grid')
        }
    });

    QUnit.test('Constructor with default options', function (assert) {
        var $container = $('#container1');
        var lt = $container.ltGrid().data(LTGrid.DATA_KEY);

        assert.equal(lt, $container.ltGrid().data(LTGrid.DATA_KEY), 'Set the ltGrid object as data object');
        assert.deepEqual(lt.options(), $.extend(LTGrid.Default, { arrange: 'lt-grid' }), 'Set DEFAULTS to options');
    });

    QUnit.test('Constructor with custom options and modifiable options', function (assert) {
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

        $container.ltGrid({
            arrange: 'lt-grid',
            resize: false,
            compact: false,
            overlap: true,
            params: {
                lg: {
                    gap: 8,
                    maxWidth: 80,
                    cols: 5
                },
                md: {
                    gap: 9,
                    maxWidth: 90
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

        assert.equal($container.data(LTGrid.DATA_KEY).options().resize, false, 'Match the passed option for resize');
        assert.equal($container.data(LTGrid.DATA_KEY).options().compact, false, 'Match the passed option for compact');
        assert.equal($container.data(LTGrid.DATA_KEY).options().overlap, true, 'Match the passed option for overlap');
        assert.deepEqual($container.data(LTGrid.DATA_KEY).options().params, expectedParams, 'Match the passed option for params');

        $container.ltGrid('option', 'resize', true);
        $container.ltGrid('option', 'compact', true);
        $container.ltGrid('option', 'overlap', false);

        assert.equal($container.data(LTGrid.DATA_KEY).options().resize, true, 'Match the changed option for resize');
        assert.equal($container.data(LTGrid.DATA_KEY).options().compact, true, 'Match the changed option for compact');
        assert.equal($container.data(LTGrid.DATA_KEY).options().overlap, false, 'Match the changed option for overlap');
    });

    QUnit.test('_windowWidth method', function (assert) {
        var lt = new LTGrid($('#container1'));
        var width = $(window).width();

        assert.equal(lt._windowWidth(), width, 'Are the same width as window');
    });

    QUnit.test('size method', function (assert) {
        var lt = new LTGrid($('#container1'));

        lt._windowWidth = function () { return 1500; };
        assert.equal(lt.size(), 'lg', 'Match size for lg size (≥1200px)');

        lt._windowWidth = function () { return 1000; };
        assert.equal(lt.size(), 'md', 'Match size for md size (≥992px) ');

        lt._windowWidth = function () { return 800; };
        assert.equal(lt.size(), 'sm', 'Match size for sm size (≥768px) ');

        lt._windowWidth = function () { return 300; };
        assert.equal(lt.size(), 'xs', 'Match size for xs size (<768px) ');
    });

    QUnit.test('ghost setter / getter', function (assert) {
        var lt = new LTGrid($('#container1'));
        var $widget = $('#rect1');
        var $ghost = lt.ghost($widget);

        assert.equal($ghost[0], lt.ghost($widget)[0], 'Return the same object when called twice');
        assert.equal($ghost.parent()[0], $widget.parent()[0], 'Is inside the same container');
        assert.deepEqual($ghost.ltRect('lg'), $widget.ltRect('lg'), 'Is with the same Rect as the widget');
        assert.ok($ghost.hasClass('lt-ghost'));

        lt.removeGhost();

        assert.equal($ghost.parent().length, 0, 'Ghost is removed from the DOM');
        assert.equal(lt.$ghost, null, 'Reference set to null');

        lt.removeGhost();
    });

    QUnit.test('compact method', function (assert) {
        var lt = new LTGrid($('#container1'));
        lt._windowWidth = function () { return 1500; };
        lt.compact();

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(0, 0, 1, 1),
                new Rect(1, 0, 1, 2),
                new Rect(0, 1, 1, 1)
            ],
            'Rects of the widgets are properly compacted for the "lg" size'
        );
    });

    QUnit.test('resize method', function (assert) {
        var lt = new LTGrid($('#container1'));
        lt._windowWidth = function () { return 1500; };
        lt.resize();

        var rect = $('#container1').ltRect('lg');

        assert.equal(rect.h, 3, 'Height of the grid container should be shrinked to 3');
    });

    QUnit.test('itemWidth getter', function (assert) {
        var lt = new LTGrid($('#container1'));
        $('#container1').width(750);
        assert.equal(lt._itemWidth('lg'), 186.75, 'The width of a single cell in the grid with 750');
    });

    QUnit.test('itemHeight getter', function (assert) {
        var lt = new LTGrid($('#container1'));

        $('#container1').width(750);

        assert.equal(lt._itemHeight('lg'), 124.5, 'The height of a single cell in the grid with width 750');
    });

    QUnit.test('update method without any options', function (assert) {
        var lt = new LTGrid($('#container1'), { compact: false, resize: false });

        lt.update();

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(0, 0, 1, 1),
                new Rect(1, 0, 1, 2),
                new Rect(0, 2, 1, 1)
            ],
            'Rects of the widgets are properly compacted for the "lg" size'
        );
    });

    QUnit.test('moveGhost method', function (assert) {
        var lt = new LTGrid($('#container1'));
        var $widget = $('#rect1');
        var $ghost = lt.ghost($widget);
        lt._windowWidth = function () { return 1500; };

        assert.deepEqual($ghost.ltRect('lg'), new Rect(0, 0, 1, 1), 'Initial position and size of the ghost');

        lt.moveGhost($widget, 500, 500);

        assert.deepEqual($ghost.ltRect('lg'), new Rect(1, 2, 1, 1), 'Moved position and size of the ghost');
    });

    QUnit.test('mask getter / setter', function (assert) {
        var lt = new LTGrid($('#container1'));
        var $mask = lt.mask();

        assert.equal($mask[0], lt.mask()[0], 'Return the same object when called twice');
        assert.ok($mask.hasClass('lt-mask'), 'Have a lt-mask class');
        assert.equal('mask', $mask.data('lt-grid'))
        assert.equal($mask.parent()[0], $('#container1')[0], 'Is child of the container');

        lt.removeMask();

        assert.equal($mask.parent().length, 0, 'Removed from container');
        assert.equal(lt.$mask, null, 'Reference set to null');

        lt.removeMask();

        assert.equal(lt.$mask, null, 'Fine to be called multiple times');
    });

    QUnit.test('end method', function (assert) {
        var lt = new LTGrid($('#container1'));
        var $widget = $('#rect1');

        lt._windowWidth = function () { return 1500; };

        lt.ghost($widget);
        lt.mask();

        lt.end();

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(0, 0, 1, 1),
                new Rect(1, 0, 1, 2),
                new Rect(0, 1, 1, 1)
            ],
            'Rects are compacted'
        );

        assert.equal($('#container1').ltRect('lg').h, 2, 'Container is resized');

        assert.ok($('#container1').find('lt-ghost').length === 0, 'Ghost is removed');
        assert.ok($('#container1').find('lt-mask').length === 0, 'Mask is removed');
    });

    QUnit.test('grid getter / setter', function (assert) {
        var lt = new LTGrid($('#container1'));
        var grid = lt.grid('lg');

        assert.ok(grid instanceof Grid);

        assert.deepEqual(
            grid.rects,
            [
                new Rect(0, 0, 1, 1),
                new Rect(1, 0, 1, 2),
                new Rect(0, 2, 1, 1)
            ],
            'Rects of the widgets are retrieved properly for the "lg" size'
        );

        grid.rects[0].y = 1;
        grid.rects[1].y = 2;
        grid.rects[2].y = 4;

        lt.grid('lg', grid);

        assert.deepEqual($('#rect1').ltRect('lg'), new Rect(0, 1, 1, 1), 'Is modified by grid setter');
        assert.deepEqual($('#rect2').ltRect('lg'), new Rect(1, 2, 1, 2), 'Is modified by grid setter');
        assert.deepEqual($('#rect3').ltRect('lg'), new Rect(0, 4, 1, 1), 'Is modified by grid setter');
    });

    QUnit.test('reposition method', function (assert) {
        var lt = new LTGrid($('#container1'));
        var $widget = $('#rect1');

        lt._windowWidth = function () { return 1500; };

        lt.reposition($widget, { x: 1, y: 0, w: 2, h: 2 });

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(1, 0, 2, 2),
                new Rect(1, 2, 1, 2),
                new Rect(0, 0, 1, 1)
            ],
            'Widgets move around to keep the grid from overlapping after repositioning, compact & resize'
        );
    });

    QUnit.test('reposition method without overlap ', function (assert) {
        var lt = new LTGrid($('#container1'));

        lt.option('overlap', true);

        var $widget = $('#rect1');

        lt._windowWidth = function (assert) { return 1500; };

        lt.reposition($widget, { x: 1, y: 0, w: 2, h: 2 });

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(1, 0, 2, 2),
                new Rect(1, 0, 1, 2),
                new Rect(0, 0, 1, 1)
            ],
            'Widgets move around with overlapping'
        );

        lt.option('overlap', false);
    });


    QUnit.test('moveToGhost method', function (assert) {
        var lt = new LTGrid($('#container1'));
        var $widget = $('#rect1');
        lt._windowWidth = function () { return 1500; };
        var $ghost = lt.ghost($widget);

        lt.moveGhost($widget, 300, 160);

        lt.moveToGhost($widget);

        assert.deepEqual(
            $widget.ltRect('lg'),
            new Rect(1, 0, 1, 1),
            'New rect postion the same as ghost'
        );
    });

    QUnit.test('Events', function (assert) {
        var dragstart = $.Event('dragstart' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null
            }
        });

        var dragover = $.Event('dragover' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null,
                pageX: 300 + ($('#container1').offset().left),
                pageY: 260 + ($('#container1').offset().top)
            }
        });

        var dragoverTouch = $.Event('touchmove' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null,
                touches: [
                    {
                        pageX: 300 + ($('#container1').offset().left),
                        pageY: 260 + ($('#container1').offset().top)
                    }
                ]
            }
        });

        var drop = $.Event('drop' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null
            }
        });

        var dragleave = $.Event('dragleave' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null
            }
        });

        var dragend = $.Event('dragend' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null
            }
        });

        $('#container1').ltGrid().data(LTGrid.DATA_KEY)._windowWidth = function () { return 1500; };

        $('#rect1').trigger(dragstart);
        $('#container1').trigger(dragover);

        assert.deepEqual(
            $('#container1').ltGrid().data(LTGrid.DATA_KEY).ghost($('#rect1')).ltRect('lg'),
            new Rect(1, 1, 1, 1)
        );

        $('#container1').trigger(dragleave);

        dragleave.target = $('#container1 .lt-mask')[0];
        $('#container1').trigger(dragleave);

        assert.equal(0, $('#container1 lt-mask').length);

        $('#container1').trigger(dragoverTouch);

        $('#container1').trigger(drop);

        assert.deepEqual(
            $('#rect1').ltRect('lg'),
            new Rect(0, 0, 1, 1)
        );

        $('#container1').trigger(dragend);

        assert.equal(0, $('#container1 .lt-ghost').length);

        Store.clear();

        $('#container1').trigger(dragover);
        $('#container1').trigger(drop);

    });
})
