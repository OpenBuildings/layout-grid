$(function () {
    'use strict'

    QUnit.module('LTGrid', {
        beforeEach: function () {
            Store.clear()
            $('#container1').removeData('lt-grid')
        }
    })

    QUnit.test('end method', function (assert) {
        var lt = new LTGrid($('#container1'))
        var $widget = $('#rect1')

        lt._windowWidth = function () {
            return 1500
        }

        lt._getGhost($widget)
        lt._getMask()

        lt.end()

        assert.deepEqual(
            lt.grid('lg').rects,
            [
                new Rect(0, 0, 1, 1),
                new Rect(1, 0, 1, 2),
                new Rect(0, 1, 1, 1)
            ],
            'Rects are compacted'
        )

        assert.equal($('#container1').ltRect('lg').h, 2, 'Container is resized')

        assert.ok($('#container1').find('lt-ghost').length === 0, 'Ghost is removed')
        assert.ok($('#container1').find('lt-mask').length === 0, 'Mask is removed')
    })

})
