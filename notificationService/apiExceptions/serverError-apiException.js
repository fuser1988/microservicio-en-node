const  apiExceptionMod = require('./api-exception');


class ServerError extends apiExceptionMod.ApiException{
    constructor() {
        super('serverError', 500, "INTERNAL_SERVER_ERROR")
    }
}

module.exports = {
    ServerError,
};