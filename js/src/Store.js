/* Copyright 2015 Clippings Ltd. Licensed under BSD-3-Clause
 * See license text at https://github.com/clippings/layout-grid/blob/master/LICENSE */

/* exported Store */

/**
 * A class to store / retrieve element inside of dataTransfer object of an event
 * Fall back to a static variable if dataTransfer is not available
 */
var Store = (function () {

    'use strict'

    var Store = {}

    /**
     * Genrate a time based random number
     *
     * @return {Number}
     */
    Store.getRandomNumber = function () {
        return Math.round(new Date().getTime() + (Math.random() * 100))
    }

    /**
     * Make sure the item has an id to quickly find it
     * Do not override existing ids
     *
     * @param  {Element} item
     * @return {String}
     */
    Store.getId = function (item) {
        if (!item.id) {
            item.id = 'lt-' + this.getRandomNumber()
        }

        return item.id
    }

    /**
     * Clear internal storage variable
     */
    Store.clear = function () {
        this.item = null
    }

    /**
     * Save the element
     *
     * @param {Event}    event
     * @param {Element}  item
     */
    Store.set = function (event, item) {

        this.item = JSON.stringify({
            LTWidget: this.getId(item)
        })

        if (event.dataTransfer) {
            event.dataTransfer.setData('text', this.item)
        }
    }

    /**
     * Retrieve stored element
     *
     * @param  {Event}   event
     * @return {Element}
     */
    Store.get = function (event) {
        var dataString = (event.dataTransfer && event.dataTransfer.getData('text')) || this.item

        if (dataString) {
            var data = JSON.parse(dataString)
            return document.getElementById(data.LTWidget)
        }
    }

    return Store
})()
