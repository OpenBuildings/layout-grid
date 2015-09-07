$(function () {
    'use strict'

    QUnit.module('Store', {
        beforeEach: function () {
            Store.clear()
        }
    })

    QUnit.test('getId', function (assert) {
        var rect1 = $('#rect1')[0]
        var rect2 = $('#rect2')[0]
        var div3 = $('.other-rect')[0]

        assert.equal(Store.getId(rect1), 'rect1')
        assert.equal(Store.getId(rect2), 'rect2')
        assert.ok(Store.getId(div3).match(/lt-\d+/))
    })

    QUnit.test('set and get', function (assert) {
        var item = $('#rect1')[0]
        var event = {}
        var loaded

        Store.set(event, item)

        loaded = Store.get(event)

        assert.equal(item, loaded)
    })

    QUnit.test('set and get with DataTransfer', function (assert) {
        var item = $('#rect1')[0]
        var event = {}
        var loaded

        event.dataTransfer = {
            setData: function (type, data) {
                this.type = type
                this.data = data
            },
            getData: function (type) {
                if (type === this.type) {
                    return this.data
                }
            }
        }

        Store.set(event, item)

        loaded = Store.get(event)

        assert.deepEqual(item, loaded)

        assert.equal(event.dataTransfer.type, 'text')
        assert.equal(event.dataTransfer.data, '{"LTWidget":"rect1"}')
    })


    QUnit.test('get without data', function (assert) {
        var event = {}
        var loaded

        event.dataTransfer = {
            getData: function () {
                return ''
            }
        }

        loaded = Store.get(event)

        assert.equal(undefined, loaded)
    })
})
