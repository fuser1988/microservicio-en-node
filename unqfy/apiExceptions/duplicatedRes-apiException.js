const  apiExceptionMod = require('./api-exception');

class DuplicatedRes extends apiExceptionMod.ApiException{
    constructor() {
        super('duplicatedError', 409, "RESOURCE_ALREADY_EXISTS")
    }
}

module.exports = {
    DuplicatedRes,
};