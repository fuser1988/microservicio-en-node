const arrayListMod = require('./array-list');
const artistExceptionMod = require('./exceptions/artist-exception');
const albumMod = require('./album');
const subj = require('./subject')
const clientNotfMod = require('./clientNotificator');

class Artist extends subj.Subject {

    /**
     * Create an Artist.
     * 
     * @constructor
     * @param {number} id The id of the Artist.
     * @param {string} name The name of the Artist.
     * @param {string} country The country where the Artist was founded.
     * @param {typeof arrayListMod.ArrayList} albums The Albums that the Artist made.
     */
    constructor(id, name, country, albums = new arrayListMod.ArrayList()){
        super();
        this.addObserver(new clientNotfMod.ClientNotificator);

        /** @type {number} */
        this._id = id;

        /** @type {string} */
        this._name = name;

        /** @type {string} */
        this._country = country;

        /** @type {typeof arrayListMod.ArrayList} */
        this._albums = albums;
    }

    get id(){
        return this._id;
    }

    set id(newId){
        this._id = newId;
    }

    get name(){
        return this._name;
    }

    set name(newName){
        this._name = newName;
    }

    get country(){
        return this._country;
    }

    set country(newCountry){
        this._country = newCountry;
    }

    get albums(){
        return this._albums;
    }

    /**
    * @returns {typeof arrayListMod.ArrayList} All the tracks of the Artist.
    */
    getAllTracks(){
        return this._albums.flatMap((album) => album.tracks);
    }

    set albums(newAlbums){
        this._albums = newAlbums;
    }

    /**
     * Add an Album to the Artist.
     * 
     * @param {typeof albumMod.Album} anAlbum An Album to add to the Artist.
     */
    addAlbum(anAlbum){
        this._albums.push(anAlbum);
        this.notify(anAlbum, this.id);
    }

    /**
     * Remove an Album from the Artist that has the same id of the parameter.
     * 
     * @param {number} albumId An id of an Album to remove of the Artist.
     * @throws {ArtistException} If the id of the Album doesn't exists on the Artist.
     */
    removeAlbum(albumId){
        try{
            return this._albums.removeById(albumId);
        }
        catch(exception){
            if(exception instanceof arrayListExceptionMod.ArrayListException)
                throw new artistExceptionMod.ArtistException("FAILED TO REMOVE AN ALBUM FROM AN ARTIST " + "\"" + this.name + "\"" + " - There is no album with id: " + albumId + ".");
            throw exception;
        }
    }

    /**
     * @returns {string} Returns a string representing the Artist.
     */
    toString(){
        return ("    ________________________________________________________________________"
         + "\n    |"
         + "\n    |     '&`           ARTIST"
         + "\n    |      #"
         + "\n    |      #      ♪ Name: " + this._name                
         + "\n    |     _#_"  
         + "\n    |    ( # )    ♪ Id: " + this._id 
         + "\n    |    / 0 \\"
         + "\n    |   ( === )   ♪ Country: " + this._country
         + "\n    |    `---´"
         + "\n    |"
         + "\n    |  Album List:"
         + "\n    |"
         + this._albums.map((album) => "\n    |       • " + album.name).join(" ")
         + "\n    |_________________________________________________________________________");
    }

    toJson(){
        return {
            id: this._id,
            name: this._name,
            albums: this._albums.map(alb => { return alb.toJson() }),
            country: this._country,
        }
    }

    hasSameData(artistData) {
        return this._name == artistData.name && this._country == artistData.country
    }

}

module.exports = {
   /**
   * @type {Artist}
   */
    Artist,
};
