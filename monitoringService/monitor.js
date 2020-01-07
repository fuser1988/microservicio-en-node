const request = require('request-promise');

class Monitor{

constructor(){
    this.unqfyUrlPing = 'http://172.20.0.21:5000/ping';
    this.notificationUrlPing = 'http://172.20.0.22:5001/api/ping';
}

unqfyServerIsAlive(){
    
    let options = {
        url: this.unqfyUrlPing,
        json: true,
    }
    return request.get(options)
        .then((res) => { return Promise.resolve(true) })
        .catch((err) => { return Promise.resolve(false) });

}

notificationServerIsAlive(){

    let options = {
        url: this.notificationUrlPing,
        json: true,
    }
    return request.get(options)
        .then((res) => { return Promise.resolve(true) })
        .catch((err) => { return Promise.resolve(false) });

}    
    
}
module.exports = {
    Monitor,
};
 