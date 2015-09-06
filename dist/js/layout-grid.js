
/**
 * A collection of rect objects
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Grid = (function () {

    /**
     * @param  {Array}  rects array of Rect objects
     */

    function Grid() {
        var rects = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        _classCallCheck(this, Grid);

        this.rects = rects;
    }

    /**
     * Return all the rects that intersect with a given rect
     *
     * @param  {Rect} rect
     * @return {Array}
     */

    _createClass(Grid, [{
        key: 'getIntersectingRects',
        value: function getIntersectingRects(rect) {
            return this.rects.filter(function (item) {
                return rect !== item && rect.intersect(item);
            });
        }

        /**
         * Reduce all the vertical whitespace between rects
         *
         * @return {Grid} self
         */
    }, {
        key: 'compact',
        value: function compact() {
            var _this = this;

            var rectsCopy = [].concat(_toConsumableArray(this.rects));

            rectsCopy.sort(function (a, b) {
                return a.y - b.y;
            }).forEach(function (item) {
                do {
                    item.y -= 1;
                } while (item.y >= 0 && _this.getIntersectingRects(item).length === 0);

                item.y += 1;
            });

            return this;
        }

        /**
         * The maximum height of the rects in the grid
         *
         * @return {Number}
         */
    }, {
        key: 'height',
        value: function height() {
            var hights = this.rects.map(function (item) {
                return item.bottom();
            });

            return hights.length ? Math.max.apply(Math, _toConsumableArray(hights)) : 0;
        }
    }, {
        key: 'updateNoOverlap',

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
        value: function updateNoOverlap(rect, params) {
            var _this2 = this;

            this.update(rect, params);

            this.getIntersectingRects(rect).forEach(function (item) {
                _this2.updateNoOverlap(item, { x: item.x, y: rect.bottom() });
            });

            return this;
        }
    }, {
        key: 'update',

        /**
         * Move a rect inside the grid, or update its size
         *
         * @param  {Rect}   rect
         * @param  {Object} params An object with optional keys x, y, w, h to modify the rect
         * @return {Grid}          self
         */
        value: function update(rect, params) {

            rect.x = 'x' in params ? params.x : rect.x;
            rect.y = 'y' in params ? params.y : rect.y;
            rect.w = 'w' in params ? params.w : rect.w;
            rect.h = 'h' in params ? params.h : rect.h;

            return this;
        }
    }]);

    return Grid;
})();

var LTGrid = (function ($) {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */

    var NAME = 'lt_grid';
    var DATA_KEY = 'lt.grid';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';

    var Event = {
        START: 'dragstart.' + EVENT_KEY + ' touchstart.' + EVENT_KEY,
        OVER: 'dragover.' + EVENT_KEY + ' touchmove.' + EVENT_KEY,
        END: 'dragend.' + EVENT_KEY + ' touchcancel.' + EVENT_KEY,
        DROP: 'drop.' + EVENT_KEY + ' touchend.' + EVENT_KEY,
        LEAVE: 'dragleave.' + EVENT_KEY
    };

    var Selector = {
        GRID: '[data-arrange="layout-grid"]',
        WIDGET: '[data-arrange="layout-grid"] .lt'
    };

    var Default = {
        resize: true,
        overlap: false,
        compact: true,
        params: {
            lg: {
                gap: 1,
                maxWidth: Number.MAX_VALUE,
                cols: 4,
                aspect: 2 / 3
            },
            md: {
                gap: 2,
                maxWidth: 1200,
                cols: 3,
                aspect: 2 / 3
            },
            sm: {
                gap: 3,
                maxWidth: 992,
                cols: 2,
                aspect: 2 / 3
            },
            xs: {
                gap: 4,
                maxWidth: 768,
                cols: 1,
                aspect: 2 / 3
            }
        }
    };

    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var LTGrid = (function () {

        /**
         * @param  {jQuery} element
         * @param  {Object} options
         */

        function LTGrid(element) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, LTGrid);

            this._element = $(element);
            this._options = this._getOptions(options);
            this._mask = null;
            this._ghost = null;
        }

        /**
         * ------------------------------------------------------------------------
         * Data Api implementation
         * ------------------------------------------------------------------------
         */

        // getters

        _createClass(LTGrid, [{
            key: 'option',

            // public

            /**
             * Update an option directly
             *
             * @param  {String} name
             * @param  {mixed} value
             */
            value: function option(name, value) {
                this._options[name] = value;
            }

            /**
             * Get the current screen size
             * @return {String} xs, sm, md or lg
             */
        }, {
            key: 'size',
            value: function size() {
                var currentSize = undefined;
                var windowWidth = this._windowWidth();

                for (var size in this._options.params) {
                    if (windowWidth < this._options.params[size].maxWidth) {
                        currentSize = size;
                    }
                }

                return currentSize;
            }

            /**
             * Return a ghost item for a widget, cache ghost
             *
             * @param  {jQuery} $widget
             * @return {jQuery}
             */
        }, {
            key: 'ghost',
            value: function ghost($widget) {
                if (null === this._ghost) {
                    this._ghost = $('<div class="' + $widget.attr('class') + ' lt-ghost"></div>');
                    this._element.append(this._ghost);
                }

                return this._ghost;
            }

            /**
             * Remove the ghost element for this grid
             *
             * @param  {jQuery} $widget
             */
        }, {
            key: 'removeGhost',
            value: function removeGhost() {
                if (this._ghost) {
                    this._ghost.remove();
                    this._ghost = null;
                }
            }

            /**
             * Compact the grid for current size
             */
        }, {
            key: 'compact',
            value: function compact() {
                var size = this.size();
                var grid = this.grid(size);

                this.grid(size, grid.compact());
            }

            /**
             * Resize container to match items
             */
        }, {
            key: 'resize',
            value: function resize() {
                var size = this.size();
                var rect = new Rect(0, 0, 0, this.grid(size).height());
                var modifiedClass = rect.setCss(this._element.attr('class'), size);

                this._element.attr('class', modifiedClass);
            }

            /**
             * Move the ghost element of a widget inside the grid.
             * Pass a mouse x and y coords, relative to the grid
             *
             * @param  {jQuery} $widget
             * @param  {Number} mouseX
             * @param  {Number} mouseY
             */
        }, {
            key: 'moveGhost',
            value: function moveGhost($widget, mouseX, mouseY) {
                var size = this.size();
                var $ghost = this.ghost($widget);
                var rect = $ghost.lt_rect(size);
                var gap = this.options.params[size].gap;
                var cols = this.options.params[size].cols;

                rect.x = Math.floor(mouseX / (this._itemWidth(size) + gap));
                rect.y = Math.floor(mouseY / (this._itemHeight(size) + gap));

                rect.x = Math.min(Math.max(0, rect.x), cols - rect.w);

                $ghost.lt_rect(size, rect);
            }

            /**
             * Clear artefacts like mask and ghost and update
             */
        }, {
            key: 'end',
            value: function end() {
                this.removeMask();
                this.removeGhost();
                this.update();
            }

            /**
             * Call resize and compact if allowed
             */
        }, {
            key: 'update',
            value: function update() {
                if (this._options.compact) {
                    this.compact();
                }

                if (this._options.resize) {
                    this.resize();
                }
            }

            /**
             * Get the mask of the grid. Create one if there is none.
             *
             * @return {jQuery}
             */
        }, {
            key: 'mask',
            value: function mask() {
                if (null === this._mask) {
                    this._mask = $('<div class="lt-mask" data-lt-grid="mask"></div>');
                    this._element.append(this._mask);
                }

                return this._mask;
            }

            /**
             * Remove the mask
             */
        }, {
            key: 'removeMask',
            value: function removeMask() {
                if (null !== this._mask) {
                    this._mask.remove();
                    this._mask = null;
                }
            }

            /**
             * Setter / getter of a Grid object for this Layout Grid
             *
             * @param  {String} size xs, sm, md or lg
             * @param  {Grid}   grid
             * @return {Grid}
             */
        }, {
            key: 'grid',
            value: function grid(size, _grid) {
                var $items = this._element.children('[draggable]');

                if (undefined === _grid) {
                    return new Grid($.map($items.toArray(), function (item) {
                        return $(item).lt_rect(size);
                    }));
                } else {
                    for (var index in _grid.rects) {
                        $items.eq(index).lt_rect(size, _grid.rects[index]);
                    }
                }
            }

            /**
             * Move a widget within the grid, repositioning other elements
             * so there is no overlapping
             *
             * @param  {jQuery} $widget
             * @param  {Object} params An object with optional keys x, y, w, h to modify the rect
             */
        }, {
            key: 'reposition',
            value: function reposition($widget, params) {
                var size = this.size();
                var rect = $widget.lt_rect(size);
                var grid = this.grid(size);

                if (this.options.overlap) {
                    grid.update(rect, params);
                } else {
                    grid.updateNoOverlap(rect, params);
                }

                this.grid(size, grid);
                this.update();
            }

            /**
             * Move the widget to its corresponding ghost position
             *
             * @param  {jQuery} $widget
             */
        }, {
            key: 'moveToGhost',
            value: function moveToGhost($widget) {
                var size = this.size();
                var $parent = $widget.parent();
                var $ghost = this.ghost($widget);
                var pos = $ghost.lt_rect(size);

                this._element.append($widget);

                this.reposition($widget, { x: pos.x, y: pos.y });

                $parent.add(this._element).lt_grid('update');
            }

            // private

            /**
             * The width of a single grid count, in pixels
             *
             * @param  {String} size xs, sm, md or lg
             * @return {Number}
             */
        }, {
            key: '_itemWidth',
            value: function _itemWidth(size) {
                var cols = this._options.params[size].cols;
                var gap = this._options.params[size].gap;

                return (this._element.width() - (cols - 1) * gap) / cols;
            }

            /**
             * The height of a single grid count, in pixels
             *
             * @param  {String} size xs, sm, md or lg
             * @return {Number}
             */
        }, {
            key: '_itemHeight',
            value: function _itemHeight(size) {
                var aspect = this._options.params[size].aspect;

                return this._itemWidth(size) * aspect;
            }

            /**
             * Return the current window width
             *
             * @return {Number}
             */
        }, {
            key: '_windowWidth',
            value: function _windowWidth() {
                return $(window).width();
            }
        }, {
            key: '_getOptions',
            value: function _getOptions(options) {
                return $.extend({}, Default, options);
            }

            // static

        }, {
            key: 'options',
            get: function get() {
                return this._options;
            }
        }], [{
            key: '_jQueryInterface',
            value: function _jQueryInterface(config, a1, a2, a3) {
                return this.each(function () {
                    var $this = $(this);
                    var data = $this.data(DATA_KEY);
                    var _config = $.extend(true, {}, Default, $this.data(), typeof config === 'object' && config);

                    if (!data) {
                        data = new LTGrid(this, _config);
                        $this.data(DATA_KEY, data);
                    }

                    if (typeof config === 'string') {
                        data[config](a1, a2, a3);
                    }
                });
            }
        }, {
            key: 'Default',
            get: function get() {
                return Default;
            }
        }, {
            key: 'DATA_KEY',
            get: function get() {
                return DATA_KEY;
            }
        }]);

        return LTGrid;
    })();

    $(document).on(Event.START, Selector.WIDGET, function (event) {
        Store.set(event.originalEvent, this);
    }).on(Event.OVER, Selector.GRID, function (event) {
        var original = event.originalEvent;
        var $widget = $(Store.get(original));
        var $this = $(this);

        if ($widget) {
            var pos = original.touches ? original.touches[0] : original;
            var mouseX = pos.pageX - $this.offset().left;
            var mouseY = pos.pageY - $this.offset().top;

            event.preventDefault();

            $this.lt_grid('mask').lt_grid('moveGhost', $widget, mouseX, mouseY);
        }
    }).on(Event.END, Selector.GRID, function () {
        $(this).lt_grid('end');
    }).on(Event.LEAVE, Selector.GRID, function (event) {
        event.preventDefault();

        if ($(event.target).data('lt-grid') === 'mask') {
            $(this).lt_grid('end');
        }
    }).on(Event.DROP, Selector.GRID, function (event) {
        var $widget = $(Store.get(event.originalEvent));

        if ($widget.length) {
            event.preventDefault();

            $(this).lt_grid('moveToGhost', $widget).lt_grid('end');
        }
    });

    /**
    * ------------------------------------------------------------------------
    * jQuery
    * ------------------------------------------------------------------------
    */

    $.fn[NAME] = LTGrid._jQueryInterface;
    $.fn[NAME].LTGrid = LTGrid;

    return LTGrid;
})(jQuery);

(function ($) {

    /**
     * Getter / setter for div element's rect.
     * Uses its css classes to laod the initial rect for a given size,
     * then caches in data.
     * Each screen size has its own rect
     *
     * @param  {string} size    xs, sm, md or lg
     * @param  {Rect}   newRect a Rect object to set
     * @return {jQuery}
     */
    $.fn.lt_rect = function (size, newRect) {
        if (undefined === newRect) {
            if (undefined === this.data('lt-item-' + size)) {
                this.data('lt-item-' + size, new Rect().loadCss(this.attr('class'), size));
            }
            return this.data('lt-item-' + size);
        }

        this.data('lt-item-' + size, newRect);
        this.attr('class', newRect.setCss(this.attr('class'), size));

        return this;
    };
})(jQuery);

(function ($) {

    /**
     * Get the current size of the grid
     */
    $.fn.lt_size = function () {
        return this.lt_grid().data(LTGrid.DATA_KEY).size();
    };
})(jQuery);

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

var Rect = (function () {

    /**
     * @param  {Number} x
     * @param  {Number} y
     * @param  {Number} w width
     * @param  {Number} h height
     */

    function Rect() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var w = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
        var h = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

        _classCallCheck(this, Rect);

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * A class to store / retrieve element inside of dataTransfer object of an event
     * Fall back to a static variable if dataTransfer is not available
     */

    /**
     * @return {Number}
     */

    _createClass(Rect, [{
        key: 'bottom',
        value: function bottom() {
            return this.y + this.h;
        }

        /**
         * @return {Number}
         */
    }, {
        key: 'right',
        value: function right() {
            return this.x + this.w;
        }

        /**
         * Check if this rect is intersecting with another rect
         *
         * @param  {Rect} rect
         * @return {Boolean}
         */
    }, {
        key: 'intersect',
        value: function intersect(rect) {
            return this.x < rect.right() && this.right() > rect.x && this.y < rect.bottom() && this.bottom() > rect.y;
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
    }, {
        key: 'setCss',
        value: function setCss(classes, size) {
            var _arr = ['x', 'y', 'w', 'h'];

            for (var _i = 0; _i < _arr.length; _i++) {
                var name = _arr[_i];
                classes = classes.replace(new RegExp('lt-' + size + '-' + name + '-(\\d+)'), 'lt-' + size + '-' + name + '-' + this[name]);
            }

            return classes;
        }

        /**
         * Load data from "css classes", for a specific screen size
         *
         * @param {String} classes html classes
         * @param {String} size    xs, sm, md or lg
         */
    }, {
        key: 'loadCss',
        value: function loadCss(classes, size) {
            var _arr2 = ['x', 'y', 'w', 'h'];

            for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                var name = _arr2[_i2];
                var match = classes.match(new RegExp('lt-' + size + '-' + name + '-(\\d+)'));

                if (match) {
                    this[name] = parseInt(match[1]);
                }
            }

            return this;
        }
    }]);

    return Rect;
})();

var Store = (function () {
    function Store() {
        _classCallCheck(this, Store);
    }

    _createClass(Store, null, [{
        key: 'getRandomNumber',

        /**
         * Genrate a time based random number
         *
         * @return {Number}
         */
        value: function getRandomNumber() {
            return Math.round(new Date().getTime() + Math.random() * 100);
        }

        /**
         * Make sure the item has an id to quickly find it
         * Do not override existing ids
         *
         * @param  {Element} item
         * @return {String}
         */
    }, {
        key: 'getId',
        value: function getId(item) {
            if (!item.id) {
                item.id = 'lt-' + this.getRandomNumber();
            }

            return item.id;
        }

        /**
         * Clear internal storage variable
         */
    }, {
        key: 'clear',
        value: function clear() {
            this.item = null;
        }

        /**
         * Save the element
         *
         * @param {Event}    event
         * @param {Element}  item
         */
    }, {
        key: 'set',
        value: function set(event, item) {

            this.item = JSON.stringify({
                LTWidget: this.getId(item)
            });

            if (event.dataTransfer) {
                event.dataTransfer.setData('text', this.item);
            }
        }

        /**
         * Retrieve stored element
         *
         * @param  {Event}   event
         * @return {Element}
         */
    }, {
        key: 'get',
        value: function get(event) {
            var dataString = event.dataTransfer && event.dataTransfer.getData('text') || this.item;

            if (dataString) {
                var data = JSON.parse(dataString);
                return document.getElementById(data.LTWidget);
            }
        }
    }]);

    return Store;
})();
