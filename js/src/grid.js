import Rect from 'rect'

/**
 * A collection of rect objects
 */
class Grid {

    /**
     * @param  {Array}  rects array of Rect objects
     */
    constructor (rects = []) {
        this.rects = rects
    }

    /**
     * Return all the rects that intersect with a given rect
     *
     * @param  {Rect} rect
     * @return {Array}
     */
    getIntersectingRects (rect) {
        return this.rects.filter(item => {
            return rect !== item && rect.intersect(item);
        })
    }

    /**
     * Reduce all the vertical whitespace between rects
     *
     * @return {Grid} self
     */
    compact () {
        let rectsCopy = [...this.rects]

        rectsCopy
            .sort((a, b) => {
                return a.y - b.y
            })
            .forEach(item => {
                 do {
                    item.y -= 1
                } while (item.y >= 0 && this.getIntersectingRects(item).length === 0)

                item.y += 1
            })

        return this
    }

    /**
     * The maximum height of the rects in the grid
     *
     * @return {Number}
     */
    height () {
        let hights = this.rects.map(item => {
            return item.bottom()
        })

        return hights.length ? Math.max(...hights) : 0
    };

    /**
     * @param  {Rect} rect
     * @param  {object} params An object with optional keys x, y, w, h to modify the rect
     */


    /**
     * Move a rect inside the grid, or update its size
     * If there is overlap move rects downards
     *
     * @param  {Rect}   rect
     * @param  {Object} params An object with optional keys x, y, w, h to modify the rect
     * @return {Grid}          self
     */
    updateNoOverlap (rect, params) {

        this.update(rect, params)

        this.getIntersectingRects(rect).forEach(item => {
            this.updateNoOverlap(item, {x: item.x, y: rect.bottom()})
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
    update (rect, params) {

        rect.x = ('x' in params) ? params.x : rect.x
        rect.y = ('y' in params) ? params.y : rect.y
        rect.w = ('w' in params) ? params.w : rect.w
        rect.h = ('h' in params) ? params.h : rect.h

        return this
    }
}

export default Grid
