/**
 * A class to store / retrieve element inside of dataTransfer object of an event
 * Fall back to a static variable if dataTransfer is not available
 */
class Store {

    /**
     * Genrate a time based random number
     *
     * @return {Number}
     */
    static getRandomNumber() {
        return Math.round(new Date().getTime() + (Math.random() * 100))
    }

    /**
     * Make sure the item has an id to quickly find it
     * Do not override existing ids
     *
     * @param  {Element} item
     * @return {String}
     */
    static getId(item) {
        if (!item.id) {
            item.id = `lt-${this.getRandomNumber()}`
        }

        return item.id
    }

    /**
     * Clear internal storage variable
     */
    static clear () {
        this.item = null
    }

    /**
     * Save the element
     *
     * @param {Event}    event
     * @param {Element}  item
     */
    static set (event, item) {

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
    static get (event) {
        var dataString = (event.dataTransfer && event.dataTransfer.getData('text')) || this.item

        if (dataString) {
            var data = JSON.parse(dataString)
            return document.getElementById(data.LTWidget)
        }
    }
}

export default Store
