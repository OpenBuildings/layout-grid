$(function () {
    'use strict'

    QUnit.module('lt_size')

    QUnit.test('generate', function (assert) {
        var grid = $('#container1')

        grid.lt_grid().data(LTGrid.DATA_KEY)._windowWidth = function () { return 1500 }
        assert.equal(grid.lt_size(), 'lg')

        grid.lt_grid().data(LTGrid.DATA_KEY)._windowWidth = function () { return 300 }
        assert.equal(grid.lt_size(), 'xs')
    })
})
