module('lt_ensure_id');

test('generate', function () {
    var grid = $('#container1');

    grid.lt_grid().data('lt-grid').windowWidth = function () { return 1500; };
    equal(grid.lt_size(), 'lg');

    grid.lt_grid().data('lt-grid').windowWidth = function () { return 300; };
    equal(grid.lt_size(), 'xs');
});
