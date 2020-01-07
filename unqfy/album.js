const arrayListMod = require('./array-list');
const arrayListExceptionMod = require('./exceptions/array-list-exception');
const albumExceptionMod = require('./exceptions/album-exception');
const artistMod = require('./artist');


class Album{

    /**
     * Create an album.
     * 
     * @constructor
     * @param {number} id - The id of the Album.
     * @param {string} name - The name of the Album.
     * @param {number} year - The year that the Album was created.
     * @param {typeof artistMod.Artist} author - The Artist who made the Album.
     * @param {typeof arrayListMod.ArrayList} tracks - The Tracks of the Album.
     */
    constructor(id, name, year, author, tracks = new arrayListMod.ArrayList()){

        /** @type {number} */
        this._id = id;

        /** @type {string} */
        this._name = name;

        /** @type {number} */
        this._year = year;

        /** @type {typeof artistMod.Artist} */
        this._author = author;

        /** @type {typeof arrayListMod.ArrayList} */
        this._tracks = tracks; 
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    set name(newName){
        this._name = newName;
    }

    get year(){
        return this._year;
    }

    set year(newYear){
        this._year = newYear;
    }

    get author(){
        return this._author;
    }

    set author(newAuthor){
        this._author = newAuthor;
    }

    get tracks(){
        return this._tracks;
    }

    set tracks(newTracks){
        this._tracks = newTracks;
    }

    /**
     * Add a Track to the Album.
     * 
     * @param track - A Track to add to the Album.
     */
    addTrack(track){
        this.tracks.push(track);
    }

    /**
     * Checks if contains a given Track on the Album.
     * 
     * @param aTrack - A Track to check if it's include on the Album.
     * @returns {boolean} The result of checking all the elements with the given Track.
     */
    hasTrack(aTrack){
        return this._tracks.includes(aTrack);
    }

    /**
     * Returns a Conditional Element of searching the Track. 
     * 
     * @param {number} trackId - An id of a track to search and get.
     * @returns A Conditional Element for the given track id. 
     */
    getTrackById(trackId){
        return this._tracks.findById(trackId);
    }

    /**
     * Remove a Track from the Album that has the same id of the parameter.
     * 
     * @param {number} trackId An id of a Track to remove of the Album.
     * @throws {AlbumException} If the id of the Track doesn't exists on the Album.
     */
    removeTrack(trackId){
        try{
            this._tracks.removeById(trackId);
        }
        catch(exception){
            if(exception instanceof arrayListExceptionMod.ArrayListException)
                throw new albumExceptionMod.AlbumException("FAILED TO REMOVE A TRACK FROM AN ALBUM " + "\"" + this.name + "\"" + " - There is no track with id: " + trackId + ".");
            throw exception;
        }
    }

    /**
     * @returns {string} Returns a string representing the Album.
     */
    toString(){
        return ("    ________________________________________________________________________  "
         + "\n    |                     ALBUM"
         + "\n    |"
         + "\n    |  ╔═════╗   ♪ Name: " + this._name
         + "\n    |  ║ ♪ ♫ ║   ♪ Year: "+ this._year
         + "\n    |  ║ (●) ║   ♪ Id: "+ this._id
         + "\n    |  ╚═════╝   ♪ Author: "+ this._author.name
         + "\n    |" 
         + "\n    |   Track List:" 
         + "\n    |"
         + this._tracks.map((track) => "\n    |     • " + track.name).join(" ")
         + "\n    |_______________________________________________________________________"
        );
    }

    toJson(){
        return {
            id: this._id,
            name: this._name,
            year: this._year,
            tracks: this._tracks,
        }
    }

    hasSameData(dataAlbum) {
        return this._name == dataAlbum.name && this._year == parseInt(dataAlbum.year);
    }
    
}

module.exports = {
   /**
   * @type {Album}
   */
    Album,
};