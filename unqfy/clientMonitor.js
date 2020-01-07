const req = require('request-promise');

class ClientMonitor {

    get endPoint() { return 'http://172.20.0.23:5002/api/' }

    /** Le notifica a MonitorServer sobre altas o bajas en UNQfy */
    notifyUpdate(musicInstance, action) {
        const message = this.createMessage(musicInstance, action);
        let options = {
            uri: this.endPoint + 'activity',
            body: {
                message: message,
            },
            json: true,
        };
        req.post(options).then(() => { return Promise.resolve()})
            .catch(err => { console.log('Error to connect Monitor Server') });
    }

    createMessage(musicInstance, action) {
        let actionDone = action == 'add'? 'created' : 'deleted';
        let message = 'The '+ musicInstance.constructor.name.toLowerCase() + ' ' + musicInstance.name + ' has been ' + actionDone + '.';
        return message;
    }
}

module.exports = {
    ClientMonitor,
}
