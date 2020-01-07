const request = require('request-promise');

class ClientUnqfy{
    
    constructor(){
        this._urlUnqfy = "http://172.20.0.21:5000/api/";
    }
    hasArtist(idArtist){
        console.log(this._urlUnqfy + "artists/" + idArtist);
        let option = {
            url: this._urlUnqfy + "artists/" + idArtist,
            json:true,
        }
        return request.get(option)
            .then((response)=>{return Promise.resolve(true)})
            .catch(()=>{return Promise.resolve(false)});

    }
}

module.exports = {
    ClientUnqfy,
};
