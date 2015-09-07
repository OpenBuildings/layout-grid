$(function () {
    'use strict'

    QUnit.test('compact method', function (assert) {
        var lt = new LTGrid($('#container1'))

        lt._windowWidth = function () {
            return 1500
        }

        lt.compact()

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(0, 0, 1, 1),
                new Rect(1, 0, 1, 2),
                new Rect(0, 1, 1, 1)
            ],
            'Rects of the widgets are properly compacted for the "lg" size'
        )
    })
})
