/* =================================================================================
 * Layout Grid
 * http://github.com/clippings/layout-grid
 * =================================================================================
 * Copyright 2015 Clippings Ltd.
 * Licensed under BSD (https://github.com/clippings/layout-grid/blob/master/LICENSE)
 * ================================================================================= */

'use strict';

/**
 * Object that represents a rectangle with many supporting methods
 */
var Rect = (function () {

    var paramNames = ['x', 'y', 'w', 'h']

    /**
     * @param  {Number} x default 0
     * @param  {Number} y default 0
     * @param  {Number} w width, default 1
     * @param  {Number} h height, default 1
     */
    function Rect(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 1;
        this.h = h || 1;
    }

    /**
     * @return {Number}
     */
    Rect.prototype.bottom = function () {
        return this.y + this.h
    }

    /**
     * @return {Number}
     */
    Rect.prototype.right = function () {
        return this.x + this.w
    }

    /**
     * Check if this rect is intersecting with another rect
     *
     * @param  {Rect} rect
     * @return {Boolean}
     */
    Rect.prototype.intersect = function (rect) {
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
    Rect.prototype.setCss = function (classes, size) {
        var self = this

        paramNames.forEach(function (name) {
            classes = classes.replace(new RegExp('lt-' + size + '-' + name + '-(\\d+)'), 'lt-' + size + '-' + name + '-' + self[name])
        })

        return classes
    }

    /**
     * Load data from "css classes", for a specific screen size
     *
     * @param {String} classes html classes
     * @param {String} size    xs, sm, md or lg
     */
    Rect.prototype.loadCss = function (classes, size) {
        var self = this

        paramNames.forEach(function (name) {
            var match = classes.match(new RegExp('lt-' + size + '-' + name + '-(\\d+)'))

            if (match) {
                self[name] = parseInt(match[1])
            }
        })

        return this
    }

    return Rect;
})();
