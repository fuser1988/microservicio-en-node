class UnqfyException extends Error {

    constructor(anError){
        super(anError);
        Error.captureStackTrace(this, UnqfyException);
    }

}

module.exports = {
    UnqfyException,
};