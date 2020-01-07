
const arrayListMod = require('./array-list');
const trackMod = require('./track');
const playListExceptionMod = require('./exceptions/play-list-exception'); 
const arrayListExceptionMod = require('./exceptions/array-list-exception');

class PlayList{

    /**
     * Create a Playlist.
     * 
     * @constructor
     * @param {number} id The id of the Playlist.
     * @param {string} name The name of the Playlist.
     * @param {number} maxDuration The maximum duration of the Playlist.
     * @param {typeof arrayListMod.ArrayList} tracks The tracks of the Playlist.
     */
    constructor(id, name, genres, maxDuration, tracks = new arrayListMod.ArrayList()){
        
        /** @type {typeof arrayListMod.ArrayList} */
        this._tracks = tracks;

        const durationOfTracks = this.duration();
        if(durationOfTracks > maxDuration) throw new playListExceptionMod.PlayListException("FAILED TO CREATE A PLAYLIST: The duration of the tracks " + "(" + durationOfTracks + " seconds)" + " is greater than the maximum duration allowed " + "(" + maxDuration + " seconds).");
        
        /** @type {number} */
        this._id = id;

        /** @type {string} */
        this._name = name;

        /** @type {number} */
        this._maxDuration = maxDuration;

        /** @type {typeof arrayListMod.ArrayList} */
        this._genres = genres;
    }

    get id(){
        return this._id
    }

    set id(id){
        this._id = id;
    }

    get tracks(){
        return this._tracks;
    }

    set tracks(tracks){
        this._tracks = tracks;
    }

    get name(){
        return this._name;
    }

    set name(name){
        this._name = name;
    }

    get genres(){
        return this._genres;
    }
    
    set genres(genres){
        this._genres = genres;
    }

    /**
     * Remove a Track from the playlist.
     * 
     * @param {number} idTrack 
     */
    removeTrack(idTrack){
        try{
            this._tracks.removeById(idTrack);
        }
        catch(exception){
            if (exception instanceof arrayListExceptionMod.ArrayListException) {
                throw new playListExceptionMod.PlayListException("FAILED TO REMOVE A TRACK - There is no track with id: " + trackId + ".")
            }
            throw exception;
        }
    }

    /**
     * Add a Track to the Playlist.
     * 
     * @param {typeof trackMod.Track} track A Track to add to the Playlist.
     * @throws {PlayListException} If the duration of the playlist with the track of 
     * the parameter, has more duration than the maximum duration of the playlist.
     */
    addTrack(aTrack){
        const fullDuration = this.duration() + aTrack.duration;
        if(fullDuration <= this._maxDuration) this._tracks.push(aTrack);
        else throw new playListExceptionMod.PlayListException("FAILED TO ADD A TRACK TO THE PLAYLIST - The maximum duration for the playlist is " + this._maxDuration + " seconds. So with this track more called " + "\"" + aTrack.name + "\", " + "the duration is gonna be " + fullDuration + " seconds, that's why fails.");
    }

    /**
     * @returns {number} The sum of all the durations of the tracks.
     */
    duration(){
        return this._tracks.mapSum((track)=>track.duration);
    }

    /**
     * Checks if contains a given Track on the Playlist.
     * 
     * @param {typeof trackMod.Track} track - A Track to check if it's include on the Playlist.
     * @returns {boolean} The result of checking all the elements with the given Track.
     */
    hasTrack(track){
        return this._tracks.includes(track);
    }

    /**
     * @returns {string} Returns a string representing the Playlist.
     */
    toString(){
        return ("    ________________________________________________________________________"
        + "\n    |"
        + "\n    |                          PLAYLIST"
        + "\n    |"
        + "\n    |  ╔═══╗   ♪ Name: " + this._name           + "    ♪ Id: " + this.id
        + "\n    |  ║███║   ♪ Genres: " + this._genres.join(" - ")
        + "\n    |  ║(●)║   ♪ Duration: " + this.duration() + " seconds"
        + "\n    |  ╚═══╝   ♪ Max Duration: " + this._maxDuration + " seconds"
        + "\n    |"
        + "\n    |   Track List:"
        + "\n    |"
        + this._tracks.map((track) => "\n    |     • " + track.name).join(" ")          
        + "\n    |_______________________________________________________________________");                                                                      
    }
    
}

module.exports = {
    /**
     * @type {PlayList}
     */
    PlayList,
};