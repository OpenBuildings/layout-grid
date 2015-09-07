$(function () {
    'use strict'

    QUnit.module('LTGrid', {
        beforeEach: function () {
            $('#container1').removeData('lt-grid')
        }
    })

    QUnit.test('_windowWidth method', function (assert) {
        var lt = new LTGrid($('#container1'))
        var width = $(window).width()

        assert.equal(lt._windowWidth(), width, 'Are the same width as window')
    })

    QUnit.test('_itemWidth method', function (assert) {
        var lt = new LTGrid($('#container1'))
        $('#container1').width(750)
        assert.equal(lt._itemWidth('lg'), 186.75, 'The width of a single cell in the grid with 750')
    })

    QUnit.test('_itemHeight method', function (assert) {
        var lt = new LTGrid($('#container1'))

        $('#container1').width(750)

        assert.equal(lt._itemHeight('lg'), 124.5, 'The height of a single cell in the grid with width 750')
    })

    QUnit.test('_getGhost method', function (assert) {
        var lt = new LTGrid($('#container1'))
        var $widget = $('#rect1')
        var $ghost = lt._getGhost($widget)

        assert.equal($ghost[0], lt._getGhost($widget)[0], 'Return the same object when called twice')
        assert.equal($ghost.parent()[0], $widget.parent()[0], 'Is inside the same container')
        assert.deepEqual($ghost.ltRect('lg'), $widget.ltRect('lg'), 'Is with the same Rect as the widget')
        assert.ok($ghost.hasClass('lt-ghost'))
    })

    QUnit.test('_removeGhost method', function (assert) {
        var lt = new LTGrid($('#container1'))
        var $widget = $('#rect1')

        assert.equal(lt.$ghost, undefined, 'Reference set to null')

        lt._removeGhost()

        lt._getGhost($widget)
        lt._removeGhost()

        assert.equal($('#container1 .lt-ghost').length, 0, 'Ghost is removed from the DOM')
        assert.equal(lt.$ghost, undefined, 'Reference set to null')
    })

    QUnit.test('_getMask method', function (assert) {
        var lt = new LTGrid($('#container1'))
        var $mask = lt._getMask()

        assert.equal($mask[0], lt._getMask()[0], 'Return the same object when called twice')
        assert.ok($mask.hasClass('lt-mask'), 'Have a lt-mask class')
        assert.equal('mask', $mask.data('lt-grid'))
        assert.equal($mask.parent()[0], $('#container1')[0], 'Is child of the container')
    })

    QUnit.test('removeMask method', function (assert) {
        var lt = new LTGrid($('#container1'))

        assert.equal(lt.$mask, undefined, 'Reference set to null')

        lt._removeGhost()

        assert.equal(lt.$mask, undefined, 'Reference set to null')

        lt._getMask()
        lt._removeMask()

        assert.equal($('#container1 .lt-mask').length, 0, 'Mask is removed from the DOM')
        assert.equal(lt.$mask, null, 'Reference set to null')
    })

    QUnit.test('_moveGhost method', function (assert) {
        var lt = new LTGrid($('#container1'))
        var $widget = $('#rect1')
        var $ghost = lt._getGhost($widget)

        lt._windowWidth = function () {
            return 1500
        }

        assert.deepEqual($ghost.ltRect('lg'), new Rect(0, 0, 1, 1), 'Initial position and size of the ghost')

        lt._moveGhost($widget, 500, 500)

        assert.deepEqual($ghost.ltRect('lg'), new Rect(1, 2, 1, 1), 'Moved position and size of the ghost')
    })

    QUnit.test('moveToGhost method', function (assert) {
        var lt = new LTGrid($('#container1'))
        var $widget = $('#rect1')

        lt._windowWidth = function () {
            return 1500
        }

        lt._getGhost($widget)

        lt._moveGhost($widget, 300, 160)

        lt._moveToGhost($widget)

        assert.deepEqual(
            $widget.ltRect('lg'),
            new Rect(1, 0, 1, 1),
            'New rect postion the same as ghost'
        )
    })
})
