class AlbumException extends Error{

    constructor(message) {
        super(message);
        Error.captureStackTrace(this, AlbumException);
    }

}

module.exports = {
    AlbumException,
};