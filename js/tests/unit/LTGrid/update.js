$(function () {
    'use strict'

    QUnit.test('update method without any options', function (assert) {
        var lt = new LTGrid($('#container1'), { compact: false, resize: false })

        lt.update()

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(0, 0, 1, 1),
                new Rect(1, 0, 1, 2),
                new Rect(0, 2, 1, 1)
            ],
            'Rects of the widgets are properly compacted for the "lg" size'
        )
    })
})
