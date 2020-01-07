const arrayListMod = require('./array-list');
const clientMusixMatchMod = require('./clientMusixMatch');
class Track{

    /**
     * Create a Track.
     * 
     * @constructor
     * @param {number} id - The id of the Track.
     * @param {string} name - The name of the Track.
     * @param {number} duration - The duration of the Track.
     * @param {typeof arrayListMod.ArrayList} genres - The genres of the track.
     */
    constructor(id, name, duration, genres = new arrayListMod.ArrayList()){

        /** @type {number} */
        this._id = id;

        /** @type {string} */
        this._name = name;

        /** @type {number} */
        this._duration = duration;

        /** @type {typeof arrayListMod.ArrayList} */
        this._genres = genres;
        
        /** @type {string} */
        this._lyrics = null;

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

    get duration(){
        return this._duration;
    }

    set duration(newDuration){
        this._duration = newDuration;
    }

    get genres(){
        return this._genres;
    }

    set genres(newGenres){
        this._genres = newGenres;
    }

    get lyrics(){
        if ( !this._lyrics ) {
            const req = new clientMusixMatchMod.ClientMusixMatch();
            return req.requestLyricsByTrackName( this )
            .then( () => { return this.lyrics } );
        } else {
            return Promise.resolve(this._lyrics);
        }
    }

    set lyrics(lyrics){
        this._lyrics = lyrics;
    }

    /**
     * This method do a search if the tracks of the playlist contains at least one genre of the 
     * given genres of the parameter.
     * 
     * @param {ArrayList} genresToMatch - An ArrayList of genres to know if the playlist has at least one of this genres.
     * @returns {boolean} If the playlist contains at least one of the genres of the parameter.
     */
    containsAnyGenre(genresToMatch){
        const genresWithUpperCase = genresToMatch.map((x) => x.toUpperCase());
        return this._genres.some((genre) => genresWithUpperCase.includes(genre.toUpperCase()));
    }

    /**
     * @returns {string} Returns a string representing the Track.
     */
    toString(){
        return ("    ________________________________________________________________________"
         + "\n    |                    TRACK"
         + "\n    |"
         + "\n    |  ╔═══╗   ♪ Name: " + this._name
         + "\n    |  ║███║   ♪ Genres: " + this._genres.join(" - ")               
         + "\n    |  ║(●)║   ♪ Duration: " + this._duration + " seconds" 
         + "\n    |  ╚═══╝   ♪ Id: " + this._id 
         + "\n    |_______________________________________________________________________");
    }

}

module.exports = {
    /**
     * @type {Track}
     */
    Track,
};

