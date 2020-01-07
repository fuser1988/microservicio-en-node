class ConditionalElement{

    /**
     * Create a Conditional Element.
     * 
     * @constructor
     * @param {boolean} hasValue A boolean that represents if there is an element value on this instance.
     * @param value An element value.
     */
    constructor(hasValue, value){
        this._hasValue = hasValue;
        this._value = value;
    }

    /**
     * @returns {boolean} If contains an element.
     */
    get hasValue(){
        return this._hasValue;
    }

    /**
     * @returns The element.
     */
    get value(){
        return this._value;
    }

}

module.exports = {
    /**
     * @type {ConditionalElement}
     */
    ConditionalElement,
};