$(function () {
    'use strict'

    QUnit.test('reposition method', function (assert) {
        var lt = new LTGrid($('#container1'))
        var $widget = $('#rect1')

        lt._windowWidth = function () {
            return 1500
        }

        lt.reposition($widget, { x: 1, y: 0, w: 2, h: 2 })

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(1, 0, 2, 2),
                new Rect(1, 2, 1, 2),
                new Rect(0, 0, 1, 1)
            ],
            'Widgets move around to keep the grid from overlapping after repositioning, compact & resize'
        )
    })

    QUnit.test('reposition method without overlap', function (assert) {
        var lt = new LTGrid($('#container1'))

        lt.option('overlap', true)

        var $widget = $('#rect1')

        lt._windowWidth = function () {
            return 1500
        }

        lt.reposition($widget, { x: 1, y: 0, w: 2, h: 2 })

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(1, 0, 2, 2),
                new Rect(1, 0, 1, 2),
                new Rect(0, 0, 1, 1)
            ],
            'Widgets move around with overlapping'
        )

        lt.option('overlap', false)
    })
})
