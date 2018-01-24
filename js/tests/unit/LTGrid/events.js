$(function () {
    'use strict'

    QUnit.test('Events', function (assert) {
        function noop () {}

        var dragstart = $.Event('dragstart' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null,
                preventDefault: noop
            }
        })

        var dragover = $.Event('dragover' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null,
                pageX: 300 + ($('#container1').offset().left),
                pageY: 260 + ($('#container1').offset().top),
                preventDefault: noop
            }
        })

        var dragoverTouch = $.Event('touchmove' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null,
                touches: [
                    {
                        pageX: 300 + ($('#container1').offset().left),
                        pageY: 260 + ($('#container1').offset().top)
                    }
                ],
                preventDefault: noop
            }
        })

        var drop = $.Event('drop' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null,
                preventDefault: noop
            }
        })

        var dragleave = $.Event('dragleave' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null,
                preventDefault: noop
            }
        })

        var dragend = $.Event('dragend' + LTGrid.EVENT_KEY, {
            originalEvent: {
                dataTransfer: null,
                preventDefault: noop
            }
        })

        var lt = $('#container1').ltGrid().data(LTGrid.DATA_KEY)

        lt._windowWidth = function () {
            return 1500
        }

        $('#rect1').trigger(dragstart)
        $('#container1').trigger(dragover)

        assert.deepEqual(
            lt._getGhost($('#rect1')).ltRect('lg'),
            new Rect(1, 1, 1, 1)
        )

        $('#container1').trigger(dragleave)

        dragleave.target = $('#container1 .lt-mask')[0]
        $('#container1').trigger(dragleave)

        assert.equal(0, $('#container1 lt-mask').length)

        $('#container1').trigger(dragoverTouch)

        $('#container1').trigger(drop)

        assert.deepEqual(
            $('#rect1').ltRect('lg'),
            new Rect(1, 0, 1, 1)
        )

        $('#container1').trigger(dragend)

        assert.equal(0, $('#container1 .lt-ghost').length)

        Store.clear()

        $('#container1').trigger(dragover)
        $('#container1').trigger(drop)

        Store.clear()
        $('#container1').removeData('lt-grid')
    })
})
