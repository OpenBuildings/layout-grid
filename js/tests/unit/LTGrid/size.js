$(function () {
    'use strict'

    QUnit.test('size method', function (assert) {
        var lt = new LTGrid($('#container1'))

        lt._windowWidth = function () {
            return 1500
        }

        assert.equal(lt.size(), 'lg', 'Match size for lg size (≥1200px)')

        lt._windowWidth = function () {
            return 1000
        }

        assert.equal(lt.size(), 'md', 'Match size for md size (≥992px) ')

        lt._windowWidth = function () {
            return 800
        }

        assert.equal(lt.size(), 'sm', 'Match size for sm size (≥768px) ')

        lt._windowWidth = function () {
            return 300
        }

        assert.equal(lt.size(), 'xs', 'Match size for xs size (<768px) ')
    })
})
