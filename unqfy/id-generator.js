class IdGenerator{

    /**
     * Create an IdGenerator
     * 
     * @constructor
     * @param {number} anId - An id to start the generation of ids.
     */
    constructor(anId = 0){
        this.id = anId;
    }

    /**
     * @returns {number} Get a new Id.
     */
    get newId(){
        const newId = this.id;
        this.id++;
        return newId;
    }

}

module.exports = {
    IdGenerator,
};