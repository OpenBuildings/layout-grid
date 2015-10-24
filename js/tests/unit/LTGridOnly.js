$(function () {
    'use strict'

    QUnit.module('LTGridOnly')

    QUnit.test('Constructor', function (assert) {
        var $only = $('#only1')
        var ltGridOnly = $only.ltGridOnly().data(LTGridOnly.DATA_KEY)

        assert.equal(ltGridOnly.$element[0], $only[0])
        assert.equal(ltGridOnly.$target[0], $('#container1')[0])
        assert.equal(ltGridOnly.ltGrid, $('#container1').data(LTGrid.DATA_KEY))
    })

    QUnit.test('originalParams method', function (assert) {
        var $only = $('#only1')
        var ltGridOnly = $only.ltGridOnly().data(LTGridOnly.DATA_KEY)

        var expectedParams = {
            lg: {
                aspect: 0.6666666666666666,
                cols: 4,
                gap: 1,
                maxWidth: Number.MAX_VALUE
            },
            md: {
                aspect: 0.6666666666666666,
                cols: 3,
                gap: 2,
                maxWidth: 1200
            },
            sm: {
                aspect: 0.6666666666666666,
                cols: 2,
                gap: 3,
                maxWidth: 992
            },
            xs: {
                aspect: 0.6666666666666666,
                cols: 1,
                gap: 4,
                maxWidth: 768
            }
        }

        assert.deepEqual(
            ltGridOnly.originalParams(),
            expectedParams,
            'Should equal the params of the ltGrid'
        )

        ltGridOnly.ltGrid.option('params', { test: 10 })

        assert.deepEqual(
            ltGridOnly.originalParams(),
            expectedParams,
            'Should still be the original params '
        )
    })

    QUnit.test('set method', function (assert) {
        var $only = $('#only1')
        var ltGridOnly = $only.ltGridOnly().data(LTGridOnly.DATA_KEY)
        var original = ltGridOnly.originalParams()

        var expectedParamsLg = {
            lg: {
                aspect: 0.6666666666666666,
                cols: 4,
                gap: 1,
                maxWidth: Number.MAX_VALUE
            }
        }

        var expectedParamsMd = {
            md: {
                aspect: 0.6666666666666666,
                cols: 3,
                gap: 2,
                maxWidth: Number.MAX_VALUE
            }
        }

        ltGridOnly.set('lg')

        assert.deepEqual(
            ltGridOnly.ltGrid.options().params,
            expectedParamsLg,
            'Params should be only lg'
        )

        assert.ok(
            $('#container1').hasClass('lt-only-lg'),
            'The lt-only-lg class should be set on the container'
        )

        ltGridOnly.set('md')

        assert.deepEqual(
            ltGridOnly.ltGrid.options().params,
            expectedParamsMd,
            'Params should be only md'
        )

        assert.notOk(
            $('#container1').hasClass('lt-only-lg'),
            'Should have removed the lt-only-lg class'
        )

        assert.ok(
            $('#container1').hasClass('lt-only-md'),
            'The lt-only-md class should be set on the container'
        )

        ltGridOnly.set()

        assert.notOk(
            $('#container1').hasClass('lt-only-md'),
            'Should have removed the lt-only-md class'
        )

        assert.deepEqual(
            ltGridOnly.ltGrid.options().params,
            original,
            'Params should be return to the original params'
        )
    })

    QUnit.test('Events', function (assert) {
        var click = $.Event('click' + LTGridOnly.EVENT_KEY)

        $('#only1').trigger(click)

        assert.ok(
            $('#container1').hasClass('lt-only-xs'),
            'Event should trigger "set" method on ltGridOnly'
        )
    })
})
