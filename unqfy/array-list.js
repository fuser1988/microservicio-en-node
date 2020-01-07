const arrayListExceptionMod = require('./exceptions/array-list-exception');
const conditionalElementMod = require('./conditional-element');

class ArrayList extends Array {

    constructor(...items){
        super(...items);
    }

    /**
     * Apply a function that returns an ArrayList, to all the elements from the list, and the return all the results concatenated.
     * 
     * @param {Function} functionThatReturnsAnArray A function that returns an ArrayList to apply to all the elements from the list.
     * @returns {ArrayList} An Arraylist with all the results from the parameter function concatenated.
     */
    flatMap(functionThatReturnsAnArray){
        return this.reduce((acc, x) => acc.concat(functionThatReturnsAnArray(x)), new ArrayList());
    }
    
    /**
     * This method do a search of the first element that have an id property with the same id of the parameter.
     * 
     * @param {number} idToSearch An id to find on the list.
     * @returns {typeof conditionalElementMod.ConditionalElement} A Condition Element as a result of the searching.
     */
    findById(idToSearch){
        const elem = this.find((x) => x.id === idToSearch);
        return new conditionalElementMod.ConditionalElement(elem !== undefined, elem);
    }

    /**
     * Remove an element from the list, that has the same id property as id of the parameter.
     * 
     * @param {number} idToRemove An id of an element to remove from the list.
     * @throws {ArrayListException} No elements for the given id.
     */
    removeById(idToRemove){
        const elemConditional = this.findById(idToRemove);
        if(!elemConditional.hasValue) throw new arrayListExceptionMod.ArrayListException("FAILED TO REMOVE AN ELEMENT - There is no element with id: " + idToRemove + ".");
        this.splice(this.indexOf(elemConditional.value), 1);
        return elemConditional.value;
    }

    /**
     * Apply a function that that returns a number, to all the elements from the list.
     * Then return the sum of all the results of the function.
     * 
     * @param {Function} functionThatReturnsANumber A function that that returns a number, to apply to all the elements from the list.
     * @returns {number} The sum of all the results of the function.
     */
    mapSum(functionThatReturnsANumber){
        return this.map((elem) => functionThatReturnsANumber(elem)).reduce((a,b)=> a + b,0);
    }

    /**
     * @returns {boolean} If the list don't have elements.
     */
    isEmpty(){
        return this.length === 0;
    }

}

module.exports = {
   /**
   * @type {ArrayList}
   */
    ArrayList,
};