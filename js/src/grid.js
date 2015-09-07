/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

'use strict';

/**
 * A collection of rect objects
 */
var Grid = (function () {

    /**
     * @param  {Array}  rects array of Rect objects
     */
    function Grid(rects) {
        this.rects = rects || []
    }

    /**
     * Return all the rects that intersect with a given rect
     *
     * @param  {Rect} rect
     * @return {Array}
     */
    Grid.prototype.getIntersectingRects = function (rect) {
        return this.rects.filter(item => {
            return rect !== item && rect.intersect(item);
        })
    }

    /**
     * Reduce all the vertical whitespace between rects
     *
     * @return {Grid} self
     */
    Grid.prototype.compact = function () {
        var rectsCopy = this.rects.slice(0)
        var self = this

        rectsCopy
            .sort(function (a, b) {
                return a.y - b.y
            })
            .forEach(function (item) {
                 do {
                    item.y -= 1
                } while (item.y >= 0 && self.getIntersectingRects(item).length === 0)

                item.y += 1
            })

        return this
    }

    /**
     * The maximum height of the rects in the grid
     *
     * @return {Number}
     */
    Grid.prototype.height = function () {
        var hights = this.rects.map(function (item) {
            return item.bottom()
        })

        return hights.length ? Math.max.apply(null, hights) : 0
    };

    /**
     * Move a rect inside the grid, or update its size
     * If there is overlap move rects downards
     *
     * @param  {Rect}   rect
     * @param  {Object} params An object with optional keys x, y, w, h to modify the rect
     * @return {Grid}          self
     */
    Grid.prototype.updateNoOverlap = function (rect, params) {

        var self = this

        this.update(rect, params)

        this.getIntersectingRects(rect)
            .forEach(function (item) {
                self.updateNoOverlap(item, {x: item.x, y: rect.bottom()})
            })

        return this
    };

    /**
     * Move a rect inside the grid, or update its size
     *
     * @param  {Rect}   rect
     * @param  {Object} params An object with optional keys x, y, w, h to modify the rect
     * @return {Grid}          self
     */
    Grid.prototype.update = function (rect, params) {

        rect.x = ('x' in params) ? params.x : rect.x
        rect.y = ('y' in params) ? params.y : rect.y
        rect.w = ('w' in params) ? params.w : rect.w
        rect.h = ('h' in params) ? params.h : rect.h

        return this
    }

    return Grid;
})();
