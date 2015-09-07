$(function () {
    'use strict'

    QUnit.module('LTRect')

    QUnit.test('get', function (assert) {
        var $div1 = $('#rect1')
        var $div2 = $('#rect2')

        assert.deepEqual($div1.ltRect('xs'), new Rect(0, 0, 1, 1))
        assert.deepEqual($div1.ltRect('sm'), new Rect(0, 0, 1, 1))
        assert.deepEqual($div1.ltRect('md'), new Rect(0, 0, 1, 1))
        assert.deepEqual($div1.ltRect('lg'), new Rect(0, 0, 1, 1))

        assert.equal($div1.ltRect('xs'), $div1.ltRect('xs'), 'Should return the same cached object')
        assert.equal($div1.ltRect('md'), $div1.ltRect('md'), 'Should return the same cached object')

        assert.deepEqual($div2.ltRect('xs'), new Rect(0, 1, 1, 2))
        assert.deepEqual($div2.ltRect('sm'), new Rect(1, 0, 1, 2))
        assert.deepEqual($div2.ltRect('md'), new Rect(2, 0, 1, 2))
        assert.deepEqual($div2.ltRect('lg'), new Rect(1, 0, 1, 2))
    })


    QUnit.test('set', function (assert) {
        var $div = $('#rect1')

        $div.ltRect('xs', new Rect(4, 3, 1, 1))
        $div.ltRect('sm', new Rect(1, 2, 1, 1))
        $div.ltRect('md', new Rect(5, 8, 1, 1))
        $div.ltRect('lg', new Rect(1, 1, 1, 1))

        var classes = $.grep(
            $.map(
                $div.attr('class').split(' '),
                function (cl) {
                    return $.trim(cl)
                }
            ),
            function (cl) {
                return cl
            }
        )

        assert.deepEqual(classes, [
            'lt',
            'test-class',
            'lt-xs-x-4',
            'lt-xs-y-3',
            'lt-xs-w-1',
            'lt-xs-h-1',
            'lt-sm-x-1',
            'lt-sm-y-2',
            'lt-sm-w-1',
            'lt-sm-h-1',
            'lt-md-x-5',
            'lt-md-y-8',
            'lt-md-w-1',
            'lt-md-h-1',
            'lt-lg-x-1',
            'lt-lg-y-1',
            'lt-lg-w-1',
            'lt-lg-h-1'
        ])

    })
})
