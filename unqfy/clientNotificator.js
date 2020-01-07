const req = require('request-promise');
const obs = require('./observer')

class ClientNotificator extends obs.Observer {

    get endPoint() { return 'http://172.20.0.22:5001/api/' }

    refresh(object, data) {
        this.notifyNewAlbum(object, data);
    }

    /** Le notifica a ServerNotificator sobre nuevo album de artista */
    notifyNewAlbum(album, artistId) {
        const artName = album.author.name
        let options = {
            uri: this.endPoint+'notify',
            body: {
                artistId: artistId,
                subject: "Nuevo Album para artista " + artName,
                message: "Se ha agregado el album "+album.name+" al artista "+artName,
                from: "UNQfy",
            },
            json: true,
        };
        req.post(options).then(() => Promise.resolve())
            .catch(err => console.log('error to conect'));
    }

    /** notifica artista eliminado */
    notifyRemovedArtist(artistId) {
        let options = {
            uri: this.endPoint+'subscriptions',
            body: {
                artistId: artistId,
            },
            json: true,
        };
        return req.delete(options).then(() => { return Promise.resolve() })
            .catch(err => console.log('error to conect'));
    }
}

module.exports = { ClientNotificator };