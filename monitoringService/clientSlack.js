
const request = require('request-promise');

class ClientSlack{
    
    constructor(){
        // this._urlSlack = "https://slack.com/api/"; // + "postMessage";
        this._urlSlack = 'https://hooks.slack.com/services/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';
    }
    log(message){
        let option = {
            url: this._urlSlack,
            json:true,
            headers:{
                Authorization:'Bearer xoxp-421083284737-423382856871-498983184069-5d83685654ce3af4d09abc9c06c27921' 
            },
            body:{
                // channel:"#unqfylog",
                text: message
            },
        }
        return request.post(option)
            .then((response)=>{return Promise.resolve(true)})
            .catch((err)=>{return Promise.resolve(err)});

    }
}

module.exports = {
    ClientSlack,
};
 