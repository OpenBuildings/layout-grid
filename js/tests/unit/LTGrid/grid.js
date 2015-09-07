$(function () {
    'use strict'

    QUnit.module('LTGrid', {
        beforeEach: function () {
            Store.clear()
            $('#container1').removeData('lt-grid')
        }
    })

    QUnit.test('grid getter / setter', function (assert) {
        var lt = new LTGrid($('#container1'))
        var grid = lt.grid('lg')

        assert.ok(grid instanceof Grid)

        assert.deepEqual(
            grid.rects,
            [
                new Rect(0, 0, 1, 1),
                new Rect(1, 0, 1, 2),
                new Rect(0, 2, 1, 1)
            ],
            'Rects of the widgets are retrieved properly for the "lg" size'
        )

        grid.rects[0].y = 1
        grid.rects[1].y = 2
        grid.rects[2].y = 4

        lt.grid('lg', grid)

        assert.deepEqual($('#rect1').ltRect('lg'), new Rect(0, 1, 1, 1), 'Is modified by grid setter')
        assert.deepEqual($('#rect2').ltRect('lg'), new Rect(1, 2, 1, 2), 'Is modified by grid setter')
        assert.deepEqual($('#rect3').ltRect('lg'), new Rect(0, 4, 1, 1), 'Is modified by grid setter')
    })
})
