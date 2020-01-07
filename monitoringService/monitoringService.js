const clientSlackMod = require('./clientSlack');
const logExceptionMod = require('./monitoringServiceUnqfyException');
const monitorMod= require('./monitor');

class MonitoringService{

    constructor(){
        this.logActivityOn = true;
        this.clientSlack = new clientSlackMod.ClientSlack();
    }

    logActivity(message){
        if (this.logActivityOn)
            this.clientSlack.log(message).then((res)=>{if(res != true) throw new logExceptionMod.LogException(res.message); });
    }

    setStateLog(state){
        if(state)
            this.activateLog();
        else
            this.unactivateLog();    
    }

    activateLog(){
        this.logActivityOn = true;
    }

    unactivateLog(){
        this.logActivityOn = false;
    }

    unqfyServerIsAlive(){
        let monitor = new monitorMod.Monitor() 
        return monitor.unqfyServerIsAlive().then((res)=>{return res});
    }

    notificationServerIsAlive(){
        let monitor = new monitorMod.Monitor() 
        return monitor.notificationServerIsAlive().then((res)=>{return res});
    }

}
module.exports = {
    MonitoringService,
};
 