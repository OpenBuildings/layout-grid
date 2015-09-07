$(function () {
    'use strict'

    QUnit.module('Rect')

    QUnit.test('constructor', function (assert) {
        var rect1 = new Rect()
        var rect2 = new Rect(2, 3, 5, 7)

        assert.equal(rect1.x, 0)
        assert.equal(rect1.y, 0)
        assert.equal(rect1.w, 1)
        assert.equal(rect1.h, 1)

        assert.equal(rect2.x, 2)
        assert.equal(rect2.y, 3)
        assert.equal(rect2.w, 5)
        assert.equal(rect2.h, 7)
    })

    QUnit.test('bottom', function (assert) {
        var rect1 = new Rect(1, 2, 3, 4)
        var rect2 = new Rect(4, 3, 2, 1)

        assert.equal(rect1.bottom(), 6)
        assert.equal(rect2.bottom(), 4)
    })

    QUnit.test('right', function (assert) {
        var rect1 = new Rect(1, 2, 3, 4)
        var rect2 = new Rect(4, 3, 2, 1)

        assert.equal(rect1.right(), 4)
        assert.equal(rect2.right(), 6)
    })

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
    QUnit.test('intersect', function (assert) {
        var rect1 = new Rect(0, 0, 10, 3)
        var rect2 = new Rect(10, 0, 9, 6)
        var rect3 = new Rect(5, 3, 9, 5)
        var rect4 = new Rect(0, 6, 9, 5)
        var rect5 = new Rect(11, 6, 9, 5)

        // rect 1
        assert.equal(rect1.intersect(rect2), false)
        assert.equal(rect2.intersect(rect1), false)

        assert.equal(rect1.intersect(rect3), false)
        assert.equal(rect3.intersect(rect1), false)

        assert.equal(rect1.intersect(rect4), false)
        assert.equal(rect4.intersect(rect1), false)

        assert.equal(rect1.intersect(rect5), false)
        assert.equal(rect5.intersect(rect1), false)

        // rect 2
        assert.equal(rect2.intersect(rect3), true)
        assert.equal(rect3.intersect(rect2), true)

        assert.equal(rect2.intersect(rect4), false)
        assert.equal(rect4.intersect(rect2), false)

        assert.equal(rect2.intersect(rect5), false)
        assert.equal(rect5.intersect(rect2), false)

        // rect 3
        assert.equal(rect3.intersect(rect4), true)
        assert.equal(rect4.intersect(rect3), true)

        assert.equal(rect3.intersect(rect5), true)
        assert.equal(rect5.intersect(rect3), true)

        // rect 4
        assert.equal(rect4.intersect(rect5), false)
        assert.equal(rect5.intersect(rect4), false)
    })

    QUnit.test('loadCss', function (assert) {
        var rect1 = (new Rect()).loadCss('lt-xs-x-12 lt-xs-y-3 lt-xs-h-2 lt-xs-w-3', 'xs')
        var rect2 = (new Rect()).loadCss('lt-lg-x-1 lt-lg-y-2 lt-lg-h-8 lt-lg-w-5', 'lg')
        var rect3 = (new Rect()).loadCss('lt-lg-x-1 lt-lg-y-2', 'lg')

        assert.deepEqual(
            rect1,
            new Rect(12, 3, 3, 2),
            'Load x, y, w, h appropriately from css classes of the xs size'
        )

        assert.deepEqual(
            rect2,
            new Rect(1, 2, 5, 8),
            'Load x, y, w, h appropriately from css classes of the lg size'
        )

        assert.deepEqual(
            rect3,
            new Rect(1, 2, 1, 1),
            'Load x, y appropriately from css classes, use rect defaults for w and h'
        )
    })

    QUnit.test('setCss', function (assert) {
        var css = 'some other class lt-xs-x-1 lt-xs-y-1 lt-xs-w-1 lt-xs-h-1'
        var rect = new Rect(3, 4, 8, 9)
        var newCss = rect.setCss(css, 'xs')

        assert.equal(
            newCss,
            'some other class lt-xs-x-3 lt-xs-y-4 lt-xs-w-8 lt-xs-h-9',
            'Update css classes without changing other classes'
        )
    })
})
