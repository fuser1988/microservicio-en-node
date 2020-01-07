const  apiExceptionMod = require('./api-exception');

class BadRequestException extends apiExceptionMod.ApiException {
    constructor() {
        super('badRequest', 400, 'BAD_REQUEST');
    }
}

module.exports = {
    BadRequestException,
};