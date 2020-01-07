const  apiExceptionMod = require('./api-exception');

class NotFoundRes extends apiExceptionMod.ApiException{
    constructor() {
        super('notFoundError', 404, "RESOURCE_NOT_FOUND")
    }
}

module.exports = {
    NotFoundRes,
};