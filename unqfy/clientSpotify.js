const rp = require('request-promise');
const fs = require('fs');
const credentials = "spotifyCreds.json";

class ClientSpotify{

    constructor(){
        this.endPoint = 'https://api.spotify.com/v1/'
        this.header = { Authorization: 'Bearer ' + this.getAccessToken() }
    }

    getAccessToken(){
        return JSON.parse(fs.readFileSync(credentials)).access_token;
    }

    // Retorna el SpotifyID del artista encontrado de nombre aName
    requestIdByArtistName(aName) {
        let optionsSearchArtist = {
            url: this.endPoint + 'search',
            headers: this.header,
            qs: {
                q: aName,
                type: 'artist',
                limit: 1,
            },
            json: true,
        };
        return (
            rp.get(optionsSearchArtist).then((response) => {
                    return response.artists.items[0].id;
            })
                .catch(err => console.error(err))
        )
    }

    // Retorna una lista de albumsSpotify dado el ID de un artista
    requestAlbumsById(spotifyID) {

        const albumsAmount = 5;
        const optionsAlbumsById = {
            url: this.endPoint + `artists/${spotifyID}/albums`,
            headers: this.header,
            qs: {
                include_groups: 'album',
                limit: albumsAmount,
            },
            json: true,
        }
        return (
            rp.get(optionsAlbumsById)
                .then(responseAlbums => {
                    return responseAlbums.items;
                })
                .catch(err => console.error(err))
        )
    }

}

module.exports = {
    ClientSpotify,
};