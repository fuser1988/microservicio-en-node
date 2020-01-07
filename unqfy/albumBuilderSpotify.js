const clientSpotifyhMod = require('./clientSpotify');

class AlbumBuilderSpotify {
    /* clase encargada de retornar correctamente objetos album para ser agregados en UNQfy
       -pensar mejor nombre
    */
    
    getAlbumsFor(anArtist) {
        const clSpotify = new clientSpotifyhMod.ClientSpotify;
        return clSpotify.requestIdByArtistName(anArtist.name)
            .then(idRes => { 
                return clSpotify.requestAlbumsById(idRes) 
            })
            .then(albumsRes => {
                return this.buildUNQfyAlbums(albumsRes) 
            })
    }

    buildUNQfyAlbums(albumsData){
        let albums = [];
        albumsData.forEach(data => {
            albums.push({
                name: data.name,
                year: data.release_date.slice(0,4),
            });
        });
        return albums;
    }
}

module.exports = {
    AlbumBuilderSpotify,
};