class PlayListException extends Error {

    constructor(anError){
        super(anError);
        Error.captureStackTrace(this, PlayListException);
    }

}

module.exports = {
    PlayListException,
};