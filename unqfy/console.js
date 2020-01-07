const arrayListMod = require('./array-list');
const artistMod = require('./artist');
const albumMod = require('./album');
const trackMod = require('./track');
const unqfyMod = require('./unqfy');
const albumSpotifyMod = require('./albumBuilderSpotify');

class Console{

  /**
  * Create a Console.
  * 
  * @constructor
  * @param {typeof unqfyMod.UNQfy} unqfy The Tracks of the Album.
  */
  constructor(unqfy){
    this._unqfy = unqfy;
    this._methods = new Map();
    this._methods.set("addArtist", this._addArtist);
    this._methods.set("addAlbum", this._addAlbum);
    this._methods.set("addTrack", this._addTrack);
    this._methods.set("createPlaylist", this._createPlaylist);
    this._methods.set("getArtistById", this._getArtistById);
    this._methods.set("getAlbumById", this._getAlbumById);
    this._methods.set("getTrackById", this._getTrackById);
    this._methods.set("getPlaylistById", this._getPlaylistById);
    this._methods.set("searchByName", this._searchByName);
    this._methods.set("removeArtistById", this._removeArtistById);
    this._methods.set("removeAlbumById", this._removeAlbumById);
    this._methods.set("removeTrackById", this._removeTrackById);
    this._methods.set("removePlaylistById", this._removePlaylistById);
    this._methods.set("getTracksMatchingGenres", this._getTracksMatchingGenres);
    this._methods.set("getTracksMatchingArtist", this._getTracksMatchingArtist);
    this._methods.set("populateAlbumsForArtist", this._populateAlbumsForArtist);
    this._methods.set("getAlbumsForArtist", this._getAlbumsForArtist); 
  }

  /**
   * Execute the specific method.
   * If the method doesn't exists, Console print the valid methods.
   * 
   * @param {string} methodName The name of the method to execute.
   * @param {Array} argumentsOfMethod All the arguments for the the method.
   */
  executeMethod(methodName, argumentsOfMethod){
      const method = this._methods.get(methodName);
      if(method === undefined){
        console.log("There is no command called " + "\"" + methodName + "\".");
        console.log("\n" + "Valid commands are:");
        (new arrayListMod.ArrayList(...this._methods.keys())).forEach((keyMethod) => console.log("       • " + keyMethod));
      }
      else { 
        if(methodName =='populateAlbumsForArtist'){
          return method.apply(this,argumentsOfMethod)
        }else
        return Promise.resolve( method.apply(this,argumentsOfMethod));
      }
  }

  /**
   * Add an instance music to UNQfy.
   * 
   * @private
   * @param musicInstance A music instance can be an Artist, Album or Track.
   * @param {Function} functionToAdd A function that add the music instance.
   * @param {Array} argumentsOfFunction An Array with the parameters of the funcion.
   * @param {string} typeOfInstance The name of the class.
   */
  _addMusicInstance(musicInstance,functionToAdd,argumentsOfFunction,typeOfInstance){
    argumentsOfFunction.push(musicInstance);
    const musicInstanceAdded = functionToAdd.apply(unqfy,argumentsOfFunction);
    console.log(typeOfInstance + " \"" + musicInstanceAdded.name + "\"" + " has been created.");
    console.log(musicInstanceAdded.toString());
  }

  /**
   * Print the Artist that it's been added.
   * 
   * @private
   * @param {string} artistName The name of the Artist.
   * @param {string} artistCountry The country of the Artist.
   */
  _addArtist(artistName, artistCountry){
    const artistToAdd = new artistMod.Artist();
    artistToAdd.name = artistName;
    artistToAdd.country = artistCountry;
    this._addMusicInstance(artistToAdd, unqfy.addArtist, [], "Artist");
  }

  /**
   * Print the Album that it's been added.
   * 
   * @private
   * @param {string} artistId The id of the Artist that it's the author of the Album.
   * @param {string} albumName The name of the Album.
   * @param {string} artistCountry The year that the Album was created.
   */
  _addAlbum(artistId, albumName, albumYear){
    this._executeOrPrintException(() => {
      const albumToAdd = new albumMod.Album();
      albumToAdd.name = albumName;
      albumToAdd.year = parseInt(albumYear);
      this._addMusicInstance(albumToAdd, unqfy.addAlbum, [parseInt(artistId)], "Album");
    });
  }

  /**
   * Print the Track that it's been added.
   * 
   * @private
   * @param {string} albumId The id of the Album that contains the Track.
   * @param {string} trackName The name of the Track.
   * @param {string} trackDuration The duration of the Track.
   * @param {string} trackGenres The genres of the Track.
   */
  _addTrack(albumId, trackName, trackDuration, trackGenres){
    this._executeOrPrintException(() => {
      const trackToAdd = new trackMod.Track();
      trackToAdd.name = trackName;
      trackToAdd.duration = parseInt(trackDuration);
      trackToAdd.genres = this._buildArrayList(trackGenres);
      this._addMusicInstance(trackToAdd, unqfy.addTrack, [parseInt(albumId)], "Track");
    });
  }

  /**
   * Print the Playlist that it's been added.
   * 
   * @private
   * @param {string} playlistName The name of the Platlist.
   * @param {string} playlistGenres The genres of the Playlist.
   * @param {string} playlistMaxDuration The maximum duration of the Playlist.
   */
  _createPlaylist(playlistName, playlistGenres, playlistMaxDuration){
    this._executeOrPrintException(() => {
      const playList = unqfy.createPlaylist(playlistName, this._buildArrayList(playlistGenres), parseInt(playlistMaxDuration));
      console.log("Playlist " + "\"" + playList.name + "\"" + " has been created.");
      console.log(playList.toString());
    });
  }

  /**
   * Get a music instance and print on Console.
   * 
   * @private
   * @param {string} musicInstanceId The id of the music instance.
   * @param {Function} functionToGetMusicInstance The function that get the music instance.
   */
  _getMusicInstanceById(musicInstanceId, functionToExecute){
    this._executeOrPrintException(() => {
      const musicInstance = functionToExecute.apply(unqfy, [parseInt(musicInstanceId)]);
      console.log(musicInstance.toString());
    });
  }

  /**
   * Print the Artist with the given id.
   * 
   * @private
   * @param {string} artistId An id to search an Artist.
   */
  _getArtistById(artistId){ 
    this._getMusicInstanceById(artistId, unqfy.getArtistById);
  }

  /**
   * Print the Album with the given id.
   * 
   * @private
   * @param {string} albumId An id to search an Album.
   */
  _getAlbumById(albumId){
    this._getMusicInstanceById(albumId, unqfy.getAlbumById);
  }

  /**
   * Print the Track with the given id.
   * 
   * @private
   * @param {string} trackId An id to search a Track.
   */
  _getTrackById(trackId){
    this._getMusicInstanceById(trackId, unqfy.getTrackById);
  }

  /**
   * Print the Playlist with the given id.
   * 
   * @private
   * @param {string} playlistId An id to search a Playlist.
   */
  _getPlaylistById(playlistId){
    this._getMusicInstanceById(playlistId, unqfy.getPlaylistById);
  }

  /**
   * Get all the tracks that match with at least one of the given genres.
   * 
   * @private
   * @param {string} genres - genres to match with the tracks. 
   */
  _getTracksMatchingGenres(genres){
    const listGenres = this._buildArrayList(genres);
    const tracksMatchingGenres = unqfy.getTracksMatchingGenres(this._buildArrayList(genres));
    if(tracksMatchingGenres.isEmpty()) console.log("There are no tracks with genres: " + listGenres.join(" - "));
    else{
      console.log("Tracks matched:");
      tracksMatchingGenres.forEach((track) => console.log("         • "+ "Id: " + track.id + " - " + "Name: " + track.name +
       " - Genres: " + "[" + track.genres.join(",") + "]"));
    }
  }

  /**
   * Get all the tracks of an Artist.
   * 
   * @private
   * @param {number} artistId An id of an Artist to get all the tracks of that Artist.
   */
  _getTracksMatchingArtist(artistId){
    this._executeOrPrintException(() => {
      const tracks = unqfy.getTracksMatchingArtist(parseInt(artistId));
      if(tracks.isEmpty()) console.log("There are no tracks for the Artist with id: " + artistId);
      else {
        console.log("Tracks Matching Artist With Id: " + artistId);
      }
      console.log("\n" + tracks.map((track) => "  • Id: " + track.id + " - Name: " + track.name).join("\n"));
    });
  }

  _getAlbumsForArtist(artistName) {
    unqfy.getAlbumByArtistNameArtist(artistName).forEach(alb => console.log(alb.toString()));
  }

  /**
   * Print all the music elements from Unqfy that contains the name.
   * 
   * @private
   * @param {string} nameToMatch A name to match with all the music elements of Unqfy.
   */
  _searchByName(nameToMatch){
    const results = unqfy.searchByName(nameToMatch);
    const artistsIsEmpty = this._printFoundResults(results.artists, "artists");
    const albumsIsEmpty = this._printFoundResults(results.albums, "albums");
    const tracksIsEmpty = this._printFoundResults(results.tracks, "tracks");
    const playlistsIsEmpty = this._printFoundResults(results.playlists, "playlists");
    if(artistsIsEmpty && albumsIsEmpty && tracksIsEmpty && playlistsIsEmpty) console.log("There are no results for " + "\"" + nameToMatch + "\".");
  }

  /**
   * Print on console all the music elements from the ArrayList.
   * 
   * @private
   * @param {typeof arrayListMod.ArrayList} results An ArrayList to print all the music elements in console.
   * @param {string} typeElements class name in lower case.
   * @return {boolean} return if parameter results is empty.
   */
  _printFoundResults(results, typeElements){
    const resultsIsEmpty = results.isEmpty();
    if(!resultsIsEmpty) {
      console.log("\nFound " + typeElements + ": ");
      results.forEach((musicElem) => console.log("         • "+ "Id: " + musicElem.id + " - " + "Name: " + musicElem.name));
    }
    return resultsIsEmpty;
  }

  /**
   * Print the Artist that it's been removed, with the affected elements.
   * 
   * @private
   * @param {string} artistId An id to remove an Artist.
   */
  _removeArtistById(artistId){
    this._executeOrPrintException(() => {
      const artistIdToRemove = parseInt(artistId);
      const elementsRemoved = unqfy.removeArtist(artistIdToRemove);
      console.log("The artist with id: " + artistIdToRemove + ", was removed.");
      if(!elementsRemoved.albums.isEmpty()) console.log("\n" + "\n" + "Albums removed: " + elementsRemoved.albums.map((album) =>"\n         • " + album.name).join(" "));
      if(!elementsRemoved.tracks.isEmpty()) console.log("\n" + "Tracks Removed: " + elementsRemoved.tracks.map((track) =>"\n         • " + track.name).join(" "));
      if(!elementsRemoved.playlists.isEmpty()) console.log("\n" + "Playlists modified:" + elementsRemoved.playlists.map((playlist) => "\n         • " + playlist.name).join(" "));
    });
  }
  
  /**
   * Print the Album that it's been removed, with the affected elements.
   * 
   * @private
   * @param {string} albumId An id to remove an Album.
   */
  _removeAlbumById(albumId){
    this._executeOrPrintException(() => {
      const albumIdToRemove = parseInt(albumId);
      const elementsRemoved = unqfy.removeAlbum(albumIdToRemove);
      console.log("The album with id: " + albumIdToRemove + " was removed from:")
      console.log("\n" + "\n" + "Artist: " + "\n" + "         • " + elementsRemoved.author.name);
      if(!elementsRemoved.tracks.isEmpty()) console.log("\n" + "Tracks Removed: " + elementsRemoved.tracks.map((t) =>"\n         • " + t.name).join(" "));
      if(!elementsRemoved.playlists.isEmpty()) console.log("\n" + "Playlists modified:" + elementsRemoved.playlists.map((playlist) => "\n         • " + playlist.name).join(" "));
    });
  }

  /**
   * Print the Track that it's been removed, with the affected elements.
   * 
   * @private
   * @param {string} trackId An id to remove a Track.
   */
  _removeTrackById(trackId){
    this._executeOrPrintException(() => {
      const trackIdToRemove = parseInt(trackId);
      const elementsRemoved = unqfy.removeTrack(trackIdToRemove);
      console.log("The track with Id: " + trackIdToRemove + " - Name: " + elementsRemoved.track.name + ", was removed from:");
      console.log("\n" + "\n" + "Album: " + "\n" + "         • " + elementsRemoved.album.name);
      if(!elementsRemoved.playlists.isEmpty()) console.log("\n" + "Playlists modified:" + elementsRemoved.playlists.map((playlist) => "\n         • " + playlist.name).join(" "));
    });
  }

  /**
   * Print the Playlist that it's been removed.
   * 
   * @private
   * @param {string} playlistId An id to remove a Playlist.
   */
  _removePlaylistById(playlistId){
    this._executeOrPrintException(() => {
      const playlistIdToRemove = parseInt(playlistId);
      const playListRemoved = unqfy.removePlaylist(playlistIdToRemove);
      console.log("The playlist " + "\"" + playListRemoved.name + "\"" + " with id: " + playListRemoved.id + ", was removed.");
    });
  }

  _populateAlbumsForArtist(artistName) {
    return (
      this._executeOrPrintException(() => {
        let artistFound = this._unqfy.getArtistByName(artistName);
        let albumBuilder = new albumSpotifyMod.AlbumBuilderSpotify;
        return albumBuilder.getAlbumsFor(artistFound)
          .then(albums => Promise.resolve(this._unqfy.addAlbumsFor(artistFound, albums)))
          .then(() => console.log("Albums added to Artist " + artistName))
      }));
  }

  /**
   * Converts an array string into an ArrayList.
   * 
   * @private
   * @param {string} listString Converts a list string into an ArrayList.
   * @returns {typeof arrayListMod.ArrayList} An ArrayList with the elements of the listString.
   */
  _buildArrayList(listString){
    const list = listString.substring(1,listString.length -1).split(',');
    return Reflect.construct(arrayListMod.ArrayList, list);
  }

  /**
   * Execute a function and if throws an Exception, the Console will print the message Exception.
   * 
   * @private
   * @param {Function} functionToExecute A function to execute.
   */
  _executeOrPrintException(functionToExecute){
    try{
      return functionToExecute.apply();
    }
    catch(exception){
      console.log(exception.message);
    }
  }

}

module.exports = {
    Console,
};