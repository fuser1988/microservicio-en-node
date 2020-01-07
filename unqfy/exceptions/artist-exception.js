class ArtistException extends Error{
    
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, ArtistException);
    }

}

module.exports = {
    ArtistException,
};