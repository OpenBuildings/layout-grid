$(function () {
    'use strict'

    QUnit.module('LTSize')

    QUnit.test('generate', function (assert) {
        var $grid = $('#container1')

        $grid.ltGrid().data(LTGrid.DATA_KEY)._windowWidth = function () { return 1500 }
        assert.equal($grid.ltSize(), 'lg')

        $grid.ltGrid().data(LTGrid.DATA_KEY)._windowWidth = function () { return 300 }
        assert.equal($grid.ltSize(), 'xs')
    })
})
