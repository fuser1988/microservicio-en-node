class NotFoundException extends Error{

    constructor(className, id) {
        super("FAILED TO GET " + className.toUpperCase() + " - There is no " + className + " with id: " + id + ".");
        Error.captureStackTrace(this, NotFoundException);
    }

}

module.exports = {
    NotFoundException,
};