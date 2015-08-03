module('lt_ensure_id');

test('generate', function () {
    var divs = $('#rect1,#rect2,.other-rect');
    var div1 = $('#rect1');
    var div2 = $('#rect2');
    var div3 = $('.other-rect');

    divs.lt_ensure_id();

    equal(div1.attr('id'), 'rect1');
    equal(div2.attr('id'), 'rect2');
    ok(div3.attr('id').match(/rect-\d+/));
});
