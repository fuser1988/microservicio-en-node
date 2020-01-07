const notificatorMod = require('./notificator');
const clientUnqfyMod = require('./clientUnqfy');
const notifExceptions = require('./notificationServiceUnqfyExceptions');

class NotificationServiceUnquify{

    constructor(){
        this._notificator = new notificatorMod.Notificator();
        this._clientUnqfy = new clientUnqfyMod.ClientUnqfy();
    }
    
    subscribeEmailToArtist(email, idArtist){
        return this._clientUnqfy.hasArtist(idArtist).then((res)=>{
            if(res) {
                this._notificator.subscribe(idArtist, email);
            } else { throw new notifExceptions.NotFoundArtistException(idArtist) }
        }).catch(() => { throw new notifExceptions.NotFoundArtistException(idArtist) });
    }

    unSubscribeEmailToArtist(email, idArtist){
        return this._clientUnqfy.hasArtist(idArtist).then(res => {
            if(res){
                this._notificator.unsubscribe(idArtist, email);
            } else { throw new notifExceptions.NotFoundArtistException(idArtist) }
        }).catch(err => { throw new notifExceptions.NotFoundSubscriptionException(email, idArtist) })
    }

    notifyNewAlbum(idArtist, dataEmail) {    
        this._notificator.notify(idArtist, dataEmail);
    }

    getAllSubscriptors(idArtist) {
        return this._clientUnqfy.hasArtist(idArtist)
            .then((res) => {
                if (!res ){
                    throw new notifExceptions.NotFoundArtistException(idArtist);
                }else{
                    return Promise.resolve(this._notificator.getAllSubscriptors(idArtist)); 
                }
            })
            .catch(err => { throw new notifExceptions.NotFoundArtistException(idArtist) });
        }


    deleteAllSubscriptorToArtist(idArtist) {
        return this._clientUnqfy.hasArtist(idArtist).then(() => {
            this._notificator.removeSubscription(idArtist);
        }).catch( () => { throw new notifExceptions.NotFoundArtistException(idArtist) })
    }

}

module.exports = {
    NotificationServiceUnquify,
};