module('SaveLoadWidget');

QUnit.begin(function () {
    $.lt.currentEventData = null;
});

test('saveload', function () {
    var $item = $('#rect1');
    var event = $.Event('test');
    var $loaded;

    event.originalEvent = {};

    $.lt.saveWidget(event, $item);

    $loaded = $.lt.loadWidget(event);

    deepEqual($item, $loaded);
});

test('saveloadDataTransfer', function () {
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

    equal(event.originalEvent.dataTransfer.type, 'text/plain');
    equal(event.originalEvent.dataTransfer.data, '{"LTWidget":"#rect1"}');
});

