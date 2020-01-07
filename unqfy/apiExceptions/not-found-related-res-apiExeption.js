const  apiExceptionMod = require('./api-exception');

class NotFoundRelRes extends apiExceptionMod.ApiException{
    constructor() {
        super('notFoundRelError', 404, "RELATED_RESOURCE_NOT_FOUND")
    }
}

module.exports = {
    NotFoundRelRes,
};