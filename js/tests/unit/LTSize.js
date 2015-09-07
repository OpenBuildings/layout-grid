$(function () {
    'use strict'

    QUnit.module('LTSize')

    QUnit.test('generate', function (assert) {
        var $grid = $('#container1')
        var lt = $grid.ltGrid().data(LTGrid.DATA_KEY)

        lt._windowWidth = function () {
            return 1500
        }

        assert.equal($grid.ltSize(), 'lg')

        lt._windowWidth = function () {
            return 300
        }

        assert.equal($grid.ltSize(), 'xs')
    })
})
