$(function () {
    'use strict'

    QUnit.test('resize method', function (assert) {
        var lt = new LTGrid($('#container1'))

        lt._windowWidth = function () {
            return 1500
        }

        lt.resize()

        var rect = $('#container1').ltRect('lg')

        assert.equal(rect.h, 3, 'Height of the grid container should be shrinked to 3')
    })
})
