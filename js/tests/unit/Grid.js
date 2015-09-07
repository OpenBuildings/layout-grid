$(function () {
    'use strict'

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
    QUnit.module('Grid', {
        beforeEach: function () {
            this.rects = [
                new Rect(0, 0, 4, 3),
                new Rect(4, 0, 3, 3),
                new Rect(10, 0, 3, 6),
                new Rect(1, 3, 3, 3),
                new Rect(7, 3, 3, 3),
                new Rect(4, 6, 3, 3),
                new Rect(7, 8, 6, 3)
            ]

            this.grid = new Grid(this.rects)
        }
    })

    QUnit.test('constructor', function (assert) {
        var grid1 = new Grid()
        var grid2 = new Grid(this.rects.slice(0, 2))

        assert.deepEqual(grid1.rects, [])
        assert.deepEqual(grid2.rects, this.rects.slice(0, 2))
    })

    QUnit.test('getIntersectingRects', function (assert) {
        var rects = [
            new Rect(0, 0, 1, 1),
            new Rect(0, 1, 1, 1),
            new Rect(0, 0, 2, 2),
            new Rect(0, 2, 2, 2)
        ]

        var grid = new Grid(rects.slice(0, 2))

        assert.deepEqual(grid.getIntersectingRects(rects[2]), rects.slice(0, 2))
        assert.deepEqual(grid.getIntersectingRects(rects[3]), [])
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
        var expected = [
            new Rect(0, 0, 4, 3),
            new Rect(4, 0, 3, 3),
            new Rect(10, 0, 3, 6),
            new Rect(1, 3, 3, 3),
            new Rect(7, 0, 3, 3),
            new Rect(4, 3, 3, 3),
            new Rect(7, 6, 6, 3)
        ]

        assert.deepEqual(
            this.grid.compact().rects,
            expected,
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

        var grid = new Grid([
            new Rect(0, 8, 4, 3),
            new Rect(4, 0, 3, 3),
            new Rect(10, 0, 3, 6),
            new Rect(1, 3, 3, 3),
            new Rect(7, 3, 3, 3),
            new Rect(4, 6, 3, 3),
            new Rect(7, 8, 6, 3)
        ])

        assert.deepEqual(
            grid.compact().rects,
            [
                new Rect(0, 3, 4, 3),
                new Rect(4, 0, 3, 3),
                new Rect(10, 0, 3, 6),
                new Rect(1, 0, 3, 3),
                new Rect(7, 0, 3, 3),
                new Rect(4, 3, 3, 3),
                new Rect(7, 6, 6, 3)
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
        var grid0 = new Grid([])
        var grid1 = new Grid(this.rects.slice(0, 2))
        var grid2 = new Grid(this.rects.slice(0, 4))
        var grid3 = new Grid(this.rects.slice(0, 7))

        assert.equal(grid0.height(), 0, 'Height for no rects')
        assert.equal(grid1.height(), 3, 'Height for 1 - 2')
        assert.equal(grid2.height(), 6, 'Height for 1 - 4')
        assert.equal(grid3.height(), 11, 'Height for 1 - 7')

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
        var grid = this.grid.updateNoOverlap(this.rects[1], { w: 5, h: 5 })

        assert.deepEqual(
            grid.rects,
            [
                new Rect(0, 0, 4, 3),
                new Rect(4, 0, 5, 5),
                new Rect(10, 0, 3, 6),
                new Rect(1, 3, 3, 3),
                new Rect(7, 5, 3, 3),
                new Rect(4, 6, 3, 3),
                new Rect(7, 8, 6, 3)
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
        var grid = this.grid.updateNoOverlap(this.rects[1], { x: 4, y: 4 })

        assert.deepEqual(
            grid.rects,
            [
                new Rect(0, 0, 4, 3),
                new Rect(4, 4, 3, 3),
                new Rect(10, 0, 3, 6),
                new Rect(1, 3, 3, 3),
                new Rect(7, 3, 3, 3),
                new Rect(4, 7, 3, 3),
                new Rect(7, 8, 6, 3)
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
        var grid = this.grid.updateNoOverlap(this.rects[1], { x: 9, y: 1 })

        assert.deepEqual(
            grid.rects,
            [
                new Rect(0, 0, 4, 3),
                new Rect(9, 1, 3, 3),
                new Rect(10, 4, 3, 6),
                new Rect(1, 3, 3, 3),
                new Rect(7, 4, 3, 3),
                new Rect(4, 6, 3, 3),
                new Rect(7, 10, 6, 3)
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
        var grid = this.grid.updateNoOverlap(this.rects[1], { x:1, y: 0 })

        assert.deepEqual(
            grid.rects,
            [
                new Rect(0, 3, 4, 3),
                new Rect(1, 0, 3, 3),
                new Rect(10, 0, 3, 6),
                new Rect(1, 6, 3, 3),
                new Rect(7, 3, 3, 3),
                new Rect(4, 6, 3, 3),
                new Rect(7, 8, 6, 3)
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
        var grid = this.grid.updateNoOverlap(this.rects[1], { x: 4, y: 4, w: 5, h: 4 })

        assert.deepEqual(
            grid.rects,
            [
                new Rect(0, 0, 4, 3),
                new Rect(4, 4, 5, 4),
                new Rect(10, 0, 3, 6),
                new Rect(1, 3, 3, 3),
                new Rect(7, 8, 3, 3),
                new Rect(4, 8, 3, 3),
                new Rect(7, 11, 6, 3)
            ]
        )
    })
})
