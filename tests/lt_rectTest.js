module('lt_rect');

test('get', function () {
    var div1 = $('#rect1');
    var div2 = $('#rect2');

    deepEqual(div1.lt_rect('xs'), new $.lt.Rect(0,0,1,1));
    deepEqual(div1.lt_rect('sm'), new $.lt.Rect(0,0,1,1));
    deepEqual(div1.lt_rect('md'), new $.lt.Rect(0,0,1,1));
    deepEqual(div1.lt_rect('lg'), new $.lt.Rect(0,0,1,1));

    equal(div1.lt_rect('xs'), div1.lt_rect('xs'), 'Should return the same cached object');
    equal(div1.lt_rect('md'), div1.lt_rect('md'), 'Should return the same cached object');

    deepEqual(div2.lt_rect('xs'), new $.lt.Rect(0,1,1,2));
    deepEqual(div2.lt_rect('sm'), new $.lt.Rect(1,0,1,2));
    deepEqual(div2.lt_rect('md'), new $.lt.Rect(2,0,1,2));
    deepEqual(div2.lt_rect('lg'), new $.lt.Rect(1,0,1,2));
});


test('set', function () {
    var div = $('#rect1');

    div.lt_rect('xs', new $.lt.Rect(4,3,1,1));
    div.lt_rect('sm', new $.lt.Rect(1,2,1,1));
    div.lt_rect('md', new $.lt.Rect(5,8,1,1));
    div.lt_rect('lg', new $.lt.Rect(1,1,1,1));

    var classes = $.grep(
        $.map(
            div.attr('class').split(' '),
            function (cl) {
                return $.trim(cl);
            }
        ),
        function (cl) {
            return cl;
        }
    );


    deepEqual(classes, [
        "lt",
        "test-class",
        "lt-xs-x-4",
        "lt-xs-y-3",
        "lt-xs-w-1",
        "lt-xs-h-1",
        "lt-sm-x-1",
        "lt-sm-y-2",
        "lt-sm-w-1",
        "lt-sm-h-1",
        "lt-md-x-5",
        "lt-md-y-8",
        "lt-md-w-1",
        "lt-md-h-1",
        "lt-lg-x-1",
        "lt-lg-y-1",
        "lt-lg-w-1",
        "lt-lg-h-1"
    ]);

});
