module('Rect');

test('constructor', function () {
    var rect1 = new $.lt.Rect();
    var rect2 = new $.lt.Rect(2, 3, 5, 7);

    equal(rect1.x, 0);
    equal(rect1.y, 0);
    equal(rect1.w, 1);
    equal(rect1.h, 1);

    equal(rect2.x, 2);
    equal(rect2.y, 3);
    equal(rect2.w, 5);
    equal(rect2.h, 7);
});

test('bottom', function () {
    var rect1 = new $.lt.Rect(1, 2, 3, 4);
    var rect2 = new $.lt.Rect(4, 3, 2, 1);

    equal(rect1.bottom(), 6);
    equal(rect2.bottom(), 4);
});

test('right', function () {
    var rect1 = new $.lt.Rect(1, 2, 3, 4);
    var rect2 = new $.lt.Rect(4, 3, 2, 1);

    equal(rect1.right(), 4);
    equal(rect2.right(), 6);
});

/**
 * ┌────────┐ ┌───────┐
 * │ rect1  │ │       │
 * └────────┘ │ rect2 │
 *      ┌─────┼─┐     │
 *      │     │ │     │
 *      │ rect3─┼─────┘
 * ┌────┼──┐  ┌─┼─────┐
 * │    └──┼──┼─┘     │
 * │ rect4 │  │ rect5 │
 * │       │  │       │
 * └───────┘  └───────┘
 */
test('intersect', function () {
    var rect1 = new $.lt.Rect(0, 0, 10, 3);
    var rect2 = new $.lt.Rect(10, 0, 9, 6);
    var rect3 = new $.lt.Rect(5, 3, 9, 5);
    var rect4 = new $.lt.Rect(0, 6, 9, 5);
    var rect5 = new $.lt.Rect(11, 6, 9, 5);

    // rect 1
    equal(rect1.intersect(rect2), false);
    equal(rect2.intersect(rect1), false);

    equal(rect1.intersect(rect3), false);
    equal(rect3.intersect(rect1), false);

    equal(rect1.intersect(rect4), false);
    equal(rect4.intersect(rect1), false);

    equal(rect1.intersect(rect5), false);
    equal(rect5.intersect(rect1), false);

    // rect 2
    equal(rect2.intersect(rect3), true);
    equal(rect3.intersect(rect2), true);

    equal(rect2.intersect(rect4), false);
    equal(rect4.intersect(rect2), false);

    equal(rect2.intersect(rect5), false);
    equal(rect5.intersect(rect2), false);

    // rect 3
    equal(rect3.intersect(rect4), true);
    equal(rect4.intersect(rect3), true);

    equal(rect3.intersect(rect5), true);
    equal(rect5.intersect(rect3), true);

    // rect 4
    equal(rect4.intersect(rect5), false);
    equal(rect5.intersect(rect4), false);
});

test('loadCss', function () {
    var rect1 = (new $.lt.Rect()).loadCss('lt-xs-x-12 lt-xs-y-3 lt-xs-h-2 lt-xs-w-3', 'xs');
    var rect2 = (new $.lt.Rect()).loadCss('lt-lg-x-1 lt-lg-y-2 lt-lg-h-8 lt-lg-w-5', 'lg');
    var rect3 = (new $.lt.Rect()).loadCss('lt-lg-x-1 lt-lg-y-2', 'lg');

    deepEqual(
        rect1,
        new $.lt.Rect(12, 3, 3, 2),
        'Load x, y, w, h appropriately from css classes of the xs size'
    );

    deepEqual(
        rect2,
        new $.lt.Rect(1, 2, 5, 8),
        'Load x, y, w, h appropriately from css classes of the lg size'
    );

    deepEqual(
        rect3,
        new $.lt.Rect(1, 2, 1, 1),
        'Load x, y appropriately from css classes, use rect defaults for w and h'
    );
});

test('setCss', function () {
    var css = 'some other class lt-xs-x-1 lt-xs-y-1 lt-xs-w-1 lt-xs-h-1';
    var rect = new $.lt.Rect(3, 4, 8, 9);
    var newCss = rect.setCss(css, 'xs');

    equal(
        newCss,
        'some other class lt-xs-x-3 lt-xs-y-4 lt-xs-w-8 lt-xs-h-9',
        'Update css classes without changing other classes'
    );
});
