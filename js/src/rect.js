/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

/**
 * Object that represents a rectangle with many supporting methods
 */
class Rect {

    /**
     * @param  {Number} x
     * @param  {Number} y
     * @param  {Number} w width
     * @param  {Number} h height
     */
    constructor (x = 0, y = 0, w = 1, h = 1) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    /**
     * @return {Number}
     */
    bottom () {
        return this.y + this.h
    }

    /**
     * @return {Number}
     */
    right () {
        return this.x + this.w
    }

    /**
     * Check if this rect is intersecting with another rect
     *
     * @param  {Rect} rect
     * @return {Boolean}
     */
    intersect (rect) {
        return this.x < rect.right() && this.right() > rect.x && this.y < rect.bottom() && this.bottom() > rect.y
    }

    /**
     * Modify a "css classes" string
     * with the pos and size of this rect,
     * for a specific screen size
     *
     * @param {String} classes html classes
     * @param {String} size    xs, sm, md or lg
     * @return {String}
     */
    setCss (classes, size) {
        for (var name of ['x', 'y', 'w', 'h']) {
            classes = classes.replace(new RegExp('lt-' + size + '-' + name + '-(\\d+)'), 'lt-' + size + '-' + name + '-' + this[name])
        }

        return classes
    }

    /**
     * Load data from "css classes", for a specific screen size
     *
     * @param {String} classes html classes
     * @param {String} size    xs, sm, md or lg
     */
    loadCss (classes, size) {
        for (var name of ['x', 'y', 'w', 'h']) {
            let match = classes.match(new RegExp('lt-' + size + '-' + name + '-(\\d+)'))

            if (match) {
                this[name] = parseInt(match[1])
            }
        }

        return this
    }
}

export default Rect
