$(function () {
    'use strict'

    QUnit.module('Grid')

    QUnit.test('constructor', function (assert) {
        var rect1 = new Rect(1,1,1,1)
        var rect2 = new Rect(2,2,2,2)

        var grid1 = new Grid()
        var grid2 = new Grid([rect1, rect2])

        assert.deepEqual(grid1.rects, [])
        assert.deepEqual(grid2.rects, [rect1, rect2])
    })

    QUnit.test('getIntersectingRects', function (assert) {
        var rect1 = new Rect(0,0,1,1)
        var rect2 = new Rect(0,1,1,1)
        var rect3 = new Rect(0,0,2,2)
        var rect4 = new Rect(0,2,2,2)

        var grid = new Grid([rect1, rect2])

        assert.deepEqual(grid.getIntersectingRects(rect3), [rect1, rect2])
        assert.deepEqual(grid.getIntersectingRects(rect4), [])
    })

    /**
     * ┌─────────────┐    ┌─────────────┐
     * │┌──┐┌─┐   ┌─┐│    │┌──┐┌─┐┌─┐┌─┐│
     * ││1 ││2│   │ ││    ││1 ││2││5││ ││
     * │└──┘└─┘   │3││    │└──┘└─┘└─┘│3││
     * │ ┌─┐   ┌─┐│ ││    │ ┌─┐┌─┐   │ ││
     * │ │4│   │5││ ││    │ │4││6│   │ ││
     * │ └─┘   └─┘└─┘├────▶ └─┘└─┘   └─┘│
     * │    ┌─┐      │    │       ┌────┐│
     * │    │6│      │    │       │ 7  ││
     * │    └─┘┌────┐│    │       └────┘│
     * │       │ 7  ││    │             │
     * │       └────┘│    │             │
     * └─────────────┘    └─────────────┘
     */
    QUnit.test('compact method', function (assert) {
        var rect1 = new Rect(0,0,4,3)
        var rect2 = new Rect(4,0,3,3)
        var rect3 = new Rect(10,0,3,6)
        var rect4 = new Rect(1,3,3,3)
        var rect5 = new Rect(7,3,3,3)
        var rect6 = new Rect(4,6,3,3)
        var rect7 = new Rect(7,8,6,3)

        var grid = new Grid([rect1, rect2, rect3, rect4, rect5, rect6, rect7])

        assert.deepEqual(
            grid.compact().rects,
            [
                new Rect(0,0,4,3),
                new Rect(4,0,3,3),
                new Rect(10,0,3,6),
                new Rect(1,3,3,3),
                new Rect(7,0,3,3),
                new Rect(4,3,3,3),
                new Rect(7,6,6,3)
            ],
            'Horisontal space reduced, as in the diagram in the comment'
        )
    })

    /**
     * ┌─────────────┐    ┌─────────────┐
     * │    ┌─┐   ┌─┐│    │ ┌─┐┌─┐┌─┐┌─┐│
     * │    │2│   │ ││    │ │4││2││5││ ││
     * │    └─┘   │3││    │ └─┘└─┘└─┘│3││
     * │ ┌─┐   ┌─┐│ ││    │┌──┐┌─┐   │ ││
     * │ │4│   │5││ ││    ││1 ││6│   │ ││
     * │ └─┘   └─┘└─┘├────▶└──┘└─┘   └─┘│
     * │    ┌─┐      │    │       ┌────┐│
     * │    │6│      │    │       │ 7  ││
     * │┌──┐└─┘┌────┐│    │       └────┘│
     * ││1 │   │ 7  ││    │             │
     * │└──┘   └────┘│    │             │
     * └─────────────┘    └─────────────┘
     */
    QUnit.test('compact method another configuration', function (assert) {
        var rect1 = new Rect(0,8,4,3)
        var rect2 = new Rect(4,0,3,3)
        var rect3 = new Rect(10,0,3,6)
        var rect4 = new Rect(1,3,3,3)
        var rect5 = new Rect(7,3,3,3)
        var rect6 = new Rect(4,6,3,3)
        var rect7 = new Rect(7,8,6,3)

        var grid = new Grid([rect1, rect2, rect3, rect4, rect5, rect6, rect7])

        assert.deepEqual(
            grid.compact().rects,
            [
                new Rect(0,3,4,3),
                new Rect(4,0,3,3),
                new Rect(10,0,3,6),
                new Rect(1,0,3,3),
                new Rect(7,0,3,3),
                new Rect(4,3,3,3),
                new Rect(7,6,6,3)
            ],
            'Horisontal space reduced, as in the diagram in the comment'
        )
    })

    /**
     * ┌─────────────┐
     * │┌──┐┌─┐   ┌─┐│
     * ││1 ││2│   │ ││
     * │└──┘└─┘   │3││
     * │ ┌─┐   ┌─┐│ ││
     * │ │4│   │5││ ││
     * │ └─┘   └─┘└─┘│
     * │    ┌─┐      │
     * │    │6│      │
     * │    └─┘┌────┐│
     * │       │ 7  ││
     * │       └────┘│
     * └─────────────┘
     */
    QUnit.test('height', function (assert) {
        var rect1 = new Rect(0,0,4,3)
        var rect2 = new Rect(4,0,3,3)
        var rect3 = new Rect(10,0,3,6)
        var rect4 = new Rect(1,3,3,3)
        var rect5 = new Rect(7,3,3,3)
        var rect6 = new Rect(4,6,3,3)
        var rect7 = new Rect(7,8,6,3)

        var grid0 = new Grid([])
        var grid1 = new Grid([rect1, rect2])
        var grid2 = new Grid([rect1, rect2, rect3, rect4])
        var grid3 = new Grid([rect1, rect2, rect3, rect4, rect5, rect6])
        var grid4 = new Grid([rect1, rect2, rect3, rect4, rect5, rect6, rect7])

        assert.equal(
            grid0.height(),
            0,
            'Height for no rects'
        )

        assert.equal(
            grid1.height(),
            3,
            'Height for rect1, rect2'
        )

        assert.equal(
            grid2.height(),
            6,
            'Height for rect1, rect2, rect3, rect4'
        )

        assert.equal(
            grid3.height(),
            9,
            'Height for rect1, rect2, rect3, rect4, rect5, rect6'
        )

        assert.equal(
            grid4.height(),
            11,
            'Height for rect1, rect2, rect3, rect4, rect5, rect6, rect7'
         )

    })

    /**
     * Initial        changed
     * ┌─────────────┐┌─────────────┐
     * │┌──┐╔═╗   ┌─┐││┌──┐╔═══╗ ┌─┐│
     * ││1 │║2║   │ ││││1 │║ 2 ║ │ ││
     * │└──┘╚═╝   │3│││└──┘║   ║ │3││
     * │ ┌─┐   ┌─┐│ │││ ┌─┐╚═══╝ │ ││
     * │ │4│   │5││ │││ │4│   ┌─┐│ ││
     * │ └─┘   └─┘└─┘││ └─┘   │5│└─┘│
     * │    ┌─┐      ││    ┌─┐└─┘   │
     * │    │6│      ││    │6│      │
     * │    └─┘┌────┐││    └─┘┌────┐│
     * │       │ 7  │││       │ 7  ││
     * │       └────┘││       └────┘│
     * │             ││             │
     * │             ││             │
     * └─────────────┘└─────────────┘
     */
    QUnit.test('updateNoOverlap method change width and height keeping position', function (assert) {
        var grid = new Grid([
            new Rect(0,0,4,3),
            new Rect(4,0,3,3),
            new Rect(10,0,3,6),
            new Rect(1,3,3,3),
            new Rect(7,3,3,3),
            new Rect(4,6,3,3),
            new Rect(7,8,6,3)
        ])

        assert.deepEqual(
            grid.updateNoOverlap(grid.rects[1], { w: 5, h: 5 }).rects,
            [
                new Rect(0,0,4,3),
                new Rect(4,0,5,5),
                new Rect(10,0,3,6),
                new Rect(1,3,3,3),
                new Rect(7,5,3,3),
                new Rect(4,6,3,3),
                new Rect(7,8,6,3)
            ]
        )
    })

    /**
     * Initial        moved
     * ┌─────────────┐┌─────────────┐
     * │┌──┐╔═╗   ┌─┐││┌──┐      ┌─┐│
     * ││1 │║2║   │ ││││1 │      │ ││
     * │└──┘╚═╝   │3│││└──┘      │3││
     * │ ┌─┐   ┌─┐│ │││ ┌─┐   ┌─┐│ ││
     * │ │4│   │5││ │││ │4│╔═╗│5││ ││
     * │ └─┘   └─┘└─┘││ └─┘║2║└─┘└─┘│
     * │    ┌─┐      ││    ╚═╝      │
     * │    │6│      ││    ┌─┐      │
     * │    └─┘┌────┐││    │6│┌────┐│
     * │       │ 7  │││    └─┘│ 7  ││
     * │       └────┘││       └────┘│
     * │             ││             │
     * │             ││             │
     * └─────────────┘└─────────────┘
     */
    QUnit.test('updateNoOverlap method move with pushing down one element - 6', function (assert) {
        var grid = new Grid([
            new Rect(0,0,4,3),
            new Rect(4,0,3,3),
            new Rect(10,0,3,6),
            new Rect(1,3,3,3),
            new Rect(7,3,3,3),
            new Rect(4,6,3,3),
            new Rect(7,8,6,3)
        ])

        assert.deepEqual(
            grid.updateNoOverlap(grid.rects[1], { x: 4, y: 4 }).rects,
            [
                new Rect(0,0,4,3),
                new Rect(4,4,3,3),
                new Rect(10,0,3,6),
                new Rect(1,3,3,3),
                new Rect(7,3,3,3),
                new Rect(4,7,3,3),
                new Rect(7,8,6,3)
            ]
        )
    })

    /**
     * Initial        moved
     * ┌─────────────┐┌─────────────┐
     * │┌──┐╔═╗   ┌─┐││┌──┐         │
     * ││1 │║2║   │ ││││1 │     ╔═╗ │
     * │└──┘╚═╝   │3│││└──┘     ║2║ │
     * │ ┌─┐   ┌─┐│ │││ ┌─┐     ╚═╝ │
     * │ │4│   │5││ │││ │4│   ┌─┐┌─┐│
     * │ └─┘   └─┘└─┘││ └─┘   │5││ ││
     * │    ┌─┐      ││    ┌─┐└─┘│3││
     * │    │6│      ││    │6│   │ ││
     * │    └─┘┌────┐││    └─┘   │ ││
     * │       │ 7  │││          └─┘│
     * │       └────┘││       ┌────┐│
     * │             ││       │ 7  ││
     * │             ││       └────┘│
     * └─────────────┘└─────────────┘
     */
    QUnit.test('updateNoOverlap with pushing three element downward, 5, 4 and 7', function (assert) {
        var grid = new Grid([
            new Rect(0,0,4,3),
            new Rect(4,0,3,3),
            new Rect(10,0,3,6),
            new Rect(1,3,3,3),
            new Rect(7,3,3,3),
            new Rect(4,6,3,3),
            new Rect(7,8,6,3)
        ])

        assert.deepEqual(
            grid.updateNoOverlap(grid.rects[1], { x: 9, y: 1 }).rects,
            [
                new Rect(0,0,4,3),
                new Rect(9,1,3,3),
                new Rect(10,4,3,6),
                new Rect(1,3,3,3),
                new Rect(7,4,3,3),
                new Rect(4,6,3,3),
                new Rect(7,10,6,3)
            ]
        )
    })


    /**
     * Initial        moved
     * ┌─────────────┐┌─────────────┐
     * │┌──┐╔═╗   ┌─┐││ ╔═╗      ┌─┐│
     * ││1 │║2║   │ │││ ║2║      │ ││
     * │└──┘╚═╝   │3│││ ╚═╝      │3││
     * │ ┌─┐   ┌─┐│ │││┌──┐   ┌─┐│ ││
     * │ │4│   │5││ ││││1 │   │5││ ││
     * │ └─┘   └─┘└─┘││└──┘   └─┘└─┘│
     * │    ┌─┐      ││ ┌─┐┌─┐      │
     * │    │6│      ││ │4││6│      │
     * │    └─┘┌────┐││ └─┘└─┘┌────┐│
     * │       │ 7  │││       │ 7  ││
     * │       └────┘││       └────┘│
     * │             ││             │
     * │             ││             │
     * └─────────────┘└─────────────┘
     */
    QUnit.test('updateNoOverlap with pushing two elements downward - 1 and 4', function (assert) {
        var grid = new Grid([
            new Rect(0,0,4,3),
            new Rect(4,0,3,3),
            new Rect(10,0,3,6),
            new Rect(1,3,3,3),
            new Rect(7,3,3,3),
            new Rect(4,6,3,3),
            new Rect(7,8,6,3)
        ])

        assert.deepEqual(
            grid.updateNoOverlap(grid.rects[1], { x:1, y:0 }).rects,
            [
                new Rect(0,3,4,3),
                new Rect(1,0,3,3),
                new Rect(10,0,3,6),
                new Rect(1,6,3,3),
                new Rect(7,3,3,3),
                new Rect(4,6,3,3),
                new Rect(7,8,6,3)
            ]
        )
    })

    /**
     * Initial        moved
     * ┌─────────────┐┌─────────────┐
     * │┌──┐╔═╗   ┌─┐││┌──┐      ┌─┐│
     * ││1 │║2║   │ ││││1 │      │ ││
     * │└──┘╚═╝   │3│││└──┘      │3││
     * │ ┌─┐   ┌─┐│ │││ ┌─┐      │ ││
     * │ │4│   │5││ │││ │4│╔═══╗ │ ││
     * │ └─┘   └─┘└─┘││ └─┘║2  ║ └─┘│
     * │    ┌─┐      ││    ║   ║    │
     * │    │6│      ││    ╚═══╝    │
     * │    └─┘┌────┐││    ┌─┐┌─┐   │
     * │       │ 7  │││    │6││5│   │
     * │       └────┘││    └─┘└─┘   │
     * │             ││       ┌────┐│
     * │             ││       │ 7  ││
     * │             ││       └────┘│
     * └─────────────┘└─────────────┘
     */
    QUnit.test('updateNoOverlap method move and resize an item, pushing down 6, 5 and 7', function (assert) {
        var grid = new Grid([
            new Rect(0,0,4,3),
            new Rect(4,0,3,3),
            new Rect(10,0,3,6),
            new Rect(1,3,3,3),
            new Rect(7,3,3,3),
            new Rect(4,6,3,3),
            new Rect(7,8,6,3)
        ])

        assert.deepEqual(
            grid.updateNoOverlap(grid.rects[1], { x: 4, y: 4, w: 5, h: 4 }).rects,
            [
                new Rect(0,0,4,3),
                new Rect(4,4,5,4),
                new Rect(10,0,3,6),
                new Rect(1,3,3,3),
                new Rect(7,8,3,3),
                new Rect(4,8,3,3),
                new Rect(7,11,6,3)
            ]
        )
    })
})
