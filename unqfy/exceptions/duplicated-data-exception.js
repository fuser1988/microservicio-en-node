class DuplicatedDataException extends Error{

    constructor(className) {
        super("FAILED TO ADD "+className.toUpperCase()+": Already exists "+className+" with same data");
        Error.captureStackTrace(this, DuplicatedDataException);
    }

}

module.exports = {
    DuplicatedDataException,
};