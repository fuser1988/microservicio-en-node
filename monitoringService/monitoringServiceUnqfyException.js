
class MonitoringServiceUnqfyException extends Error {
    constructor(messg) {
        super('Monitoring Service UNQfy Error - '+messg);
    }
}

class LogException extends MonitoringServiceUnqfyException {
    constructor(message) {
        super('could not send log: ' + message);
    }
}

module.exports = {
    MonitoringServiceUnqfyException, LogException};