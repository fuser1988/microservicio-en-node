class ArrayListException extends Error{

    constructor(message) {
        super(message);
        Error.captureStackTrace(this, ArrayListException);
    }

}

module.exports = {
    ArrayListException,
};