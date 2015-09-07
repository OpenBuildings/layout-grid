$(function () {
    'use strict'

    QUnit.module('LTGrid', {
        beforeEach: function () {
            Store.clear()
            $('#container1').removeData('lt-grid')
        }
    })

    QUnit.test('Constructor with default options', function (assert) {
        var $container = $('#container1')
        var lt = $container.ltGrid().data(LTGrid.DATA_KEY)

        assert.equal(lt, $container.ltGrid().data(LTGrid.DATA_KEY), 'Set the ltGrid object as data object')
        assert.deepEqual(lt.options(), $.extend(LTGrid.Default, { arrange: 'lt-grid' }), 'Set DEFAULTS to options')
    })

    QUnit.test('Constructor with custom options and modifiable options', function (assert) {
        var $container = $('#container2')

        var expectedParams = {
            lg: {
                aspect: 0.6666666666666666,
                cols: 5,
                gap: 8,
                maxWidth: 80
            },
            md: {
                aspect: 0.6666666666666666,
                cols: 3,
                gap: 9,
                maxWidth: 90
            },
            sm: {
                aspect: 1.4,
                cols: 2,
                gap: 10,
                maxWidth: 992
            },
            xs: {
                aspect: 1.5,
                cols: 2,
                gap: 11,
                maxWidth: 110
            }
        }

        $container.ltGrid({
            arrange: 'lt-grid',
            resize: false,
            compact: false,
            overlap: true,
            params: {
                lg: {
                    gap: 8,
                    maxWidth: 80,
                    cols: 5
                },
                md: {
                    gap: 9,
                    maxWidth: 90
                },
                sm: {
                    gap: 10,
                    aspect: 1.4
                },
                xs: {
                    gap: 11,
                    maxWidth: 110,
                    cols: 2,
                    aspect: 1.5
                }
            }
        })

        var lt = $container.data(LTGrid.DATA_KEY)

        assert.equal(lt.options().resize, false, 'Match the passed option for resize')
        assert.equal(lt.options().compact, false, 'Match the passed option for compact')
        assert.equal(lt.options().overlap, true, 'Match the passed option for overlap')
        assert.deepEqual(lt.options().params, expectedParams, 'Match the passed option for params')

        $container.ltGrid('option', 'resize', true)
        $container.ltGrid('option', 'compact', true)
        $container.ltGrid('option', 'overlap', false)

        assert.equal(lt.options().resize, true, 'Match the changed option for resize')
        assert.equal(lt.options().compact, true, 'Match the changed option for compact')
        assert.equal(lt.options().overlap, false, 'Match the changed option for overlap')
    })
})
