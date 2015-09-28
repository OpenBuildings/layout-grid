$(function () {
    'use strict'

    QUnit.module('LTData')

    QUnit.test('get', function (assert) {
        var data = $('#container1').ltData('lg')
        var json = JSON.stringify(data)

        assert.equal(
            json,
            '[{"x":0,"y":0,"w":1,"h":1},{"x":1,"y":0,"w":1,"h":2},{"x":0,"y":2,"w":1,"h":1}]'
        )
    })

    QUnit.test('set', function (assert) {
        var json = '[{"x":0,"y":0,"w":1,"h":2},{"x":1,"y":0,"w":1,"h":2},{"x":0,"y":2,"w":1,"h":1}]'

        $('#container1').ltData('lg', JSON.parse(json))

        assert.deepEqual(
            $('#container1').data('lt.grid').grid('lg').rects,
            [
                new Rect(0, 0, 1, 2),
                new Rect(1, 0, 1, 2),
                new Rect(0, 2, 1, 1)
            ]
        )
    })
})
