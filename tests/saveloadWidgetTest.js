module('SaveLoadWidget');

QUnit.begin(function () {
    $.lt.currentEventData = null;
});

test('saveWidget and loadWidget', function () {
    var $item = $('#rect1');
    var event = $.Event('test');
    var $loaded;

    event.originalEvent = {};

    $.lt.saveWidget(event, $item);

    $loaded = $.lt.loadWidget(event);

    deepEqual($item, $loaded);
});

test('saveWidget and loadWidget with DataTransfer', function () {
    var $item = $('#rect1');
    var event = $.Event('test');
    var $loaded;

    event.originalEvent = {
        dataTransfer: {
            setData: function (type, data) {

                this.type = type;
                this.data = data;
            },
            getData: function (type) {
                if (type === this.type) {
                    return this.data;
                }
            }
        }
    };

    $.lt.saveWidget(event, $item);

    $loaded = $.lt.loadWidget(event);

    deepEqual($item, $loaded);

    equal(event.originalEvent.dataTransfer.type, 'text');
    equal(event.originalEvent.dataTransfer.data, '{"LTWidget":"#rect1"}');
});


test('loadWidget without data', function () {
    var event = $.Event('test');
    var $loaded;

    $.lt.currentEventData = null;

    event.originalEvent = {
        dataTransfer: {
            getData: function (type) {
                return '';
            }
        }
    };


    $loaded = $.lt.loadWidget(event);

    equal(undefined, $loaded);
});


