
const picklify = require('picklify');
const fs = require('fs');
const artistMod = require('./artist')
const albumMod = require('./album');
const trackMod = require('./track');
const idGeneratorMod = require('./id-generator');
const playlistMod = require('./playList');
const notFoundExceptionMod = require('./exceptions/not-found-exception');
const duplicatedExceptionMod = require('./exceptions/duplicated-data-exception');
const unqfyExceptionMod = require('./exceptions/unqfy-exception');
const arrayListExceptionMod = require('./exceptions/array-list-exception');
const arrayListMod = require('./array-list');
const clientNotfMod = require('./clientNotificator');
const clientMonitorMod = require('./clientMonitor');

class UNQfy {
  
  /**
   * Create an UNQfy
   * 
   * @constructor
   */
  constructor(){
    this.artistIdGenerator = new idGeneratorMod.IdGenerator(1);
    this.albumIdGenerator = new idGeneratorMod.IdGenerator(1);
    this.trackIdGenerator = new idGeneratorMod.IdGenerator();
    this.playlistIdGenerator = new idGeneratorMod.IdGenerator();
    this.artists = new arrayListMod.ArrayList();
    this.playlists = new arrayListMod.ArrayList();
    this.clientNotificator = new clientNotfMod.ClientNotificator();
    this.clientMonitor = new clientMonitorMod.ClientMonitor();
  }
   
  /**
   * Add a new instance music to UNQf, and return the new instance created.
   * 
   * @private
   * @param {Function} functionThatAdd A function that add an instance music, and return the new instance created.
   * @param {string} exceptionMessage An exception message to throw if the id of the music instance
   *  doesn't exists.
   * @returns The new music instance created.
   */
  _addMusicInstance(functionThatAdd, exceptionMessage){
    try{
      return functionThatAdd.apply();
    }
    catch(exception){
      // if ((exception instanceof notFoundExceptionMod.NotFoundException)) {
      //   throw new unqfyExceptionMod.UnqfyException(exceptionMessage);
      // }
      throw exception;
    }
  }

  /**
   * Add an Artist to Unqfy.
   * 
   * @param {typeof artistMod.Artist} artistData An Artist to add to Unqfy.
   * @returns {typeof artistMod.Artist} The Artist that it's been added.
   */
  addArtist(artistData) {
    this.checkDuplicatedData(this.artists, artistData, 'artist');
    const newArtist =  new artistMod.Artist(this.artistIdGenerator.newId, artistData.name, artistData.country);
    this.artists.push(newArtist);
    this.clientMonitor.notifyUpdate(newArtist, 'add');
    return newArtist;
  }

  /**
   * Add an Album to Unqfy.
   * 
   * @param {number} artistId An id of an Artist that want to add the new Album.
   * @param {typeof albumMod.Album} albumData An Album to add to Unqfy.
   * @returns {typeof albumMod.Album} The Album that it's been added.
   * @throws {UnqfyException} If the  id of the artist doesn't exists.
   */
  addAlbum(artistId, albumData) {
    const functionThatAdd = () => {
      const artist = this.getArtistById(artistId);
      this.checkDuplicatedData(this.getAllAlbum(), albumData, 'album');
      const newAlbum = new albumMod.Album(this.albumIdGenerator.newId, albumData.name, albumData.year, artist);
      artist.addAlbum(newAlbum);
      this.clientMonitor.notifyUpdate(newAlbum, 'add');
      return newAlbum;
    };
    return this._addMusicInstance(functionThatAdd, "FAILED TO ADD AN ALBUM TO AN ARTIST - There is no artist with id: " + artistId + ".");
  }

  addAlbumsFor(anArtist, albums) {
    albums.forEach( alb => this.addAlbum(anArtist.id, alb));
  }

  /**
   * Add a Track to Unqfy.
   * 
   * @param {number} albumId An id of an Album that want to add the new Track.
   * @param {typeof trackMod.Track} trackData A Track to add to Unqfy.
   * @returns {typeof trackMod.Track} The Track that it's been added.
   * @throws {UnqfyException} If the id of the Album doesn't exists.
   */
  addTrack(albumId, trackData) {
    const functionThatAdd = () => {
      const track = new trackMod.Track(this.trackIdGenerator.newId, trackData.name, trackData.duration, trackData.genres);
      this.getAlbumById(albumId).addTrack(track);
      this.clientMonitor.notifyUpdate(track, 'added');
      return track;
    };
    return this._addMusicInstance(functionThatAdd, "FAILED TO ADD A TRACK TO AN ALBUM - There is no album with id: " + albumId + ".");
  }

  /**
   * Returns a random number between 0 and maxIndex.
   * 
   * @private
   * @param {number} maxIndex the maximum number allowed.
   * @returns {number} a random number between 0 and maxIndex.
   */
  _randomIndex(maxIndex){
    return Math.floor((Math.random() * maxIndex));
  }

  /**
   * Add a Playlist to Unqfy.
   * 
   * @param {string} name A name of the Playlist.
   * @param {typeof arrayListMod.ArrayList} genresToInclude Genres to create an aleator Playlist of Tracks with the given genres.
   * @param {number} maxDuration The maximum duration of the playlist.
   * @returns {typeof playlistMod.PlayList} The Playlist that it's been added.
   */
  createPlaylist(name, genresToInclude, maxDuration) {
    const tracksMatchingGenres = this.getTracksMatchingGenres(genresToInclude); 
    const trackList = this._generateAleatorList(tracksMatchingGenres, maxDuration);
    const playlist = new playlistMod.PlayList(this.playlistIdGenerator.newId, name, genresToInclude, maxDuration, trackList); 
    this.playlists.push(playlist);
    return playlist;
  }

  /**
   * Get the element on the listToDoTheSearch with the same id as the id of the parameter (idToSearch).
   * 
   * @private
   * @param {typeof arrayListMod.ArrayList} listToDoTheSearch ArrayList to find the element.
   * @param {string} className The name of the class to put inside the exception message what kind
   * of element is it.
   * @param {number} idToSearch The id of the element to search.
   * @returns The element with the same id as the id of the parameter (idToSearch).
   * @throws {NotFoundException} If there is no element with same id as the parameter id (idToSearch).
   */
  _getById(listToDoTheSearch, className, idToSearch){
    const conditionalElement = listToDoTheSearch.findById(idToSearch);
    if(!conditionalElement.hasValue) throw new notFoundExceptionMod.NotFoundException(className, idToSearch);
    return conditionalElement.value;
  }

  /**
   * Get an Artist that has the same id of the parameter.
   * 
   * @param {number} id The id of the Artist to do the search.
   * @returns {typeof artistMod.Artist} The Artist that has the same id of the parameter.
   * @throws {NotFoundException} If the id of the Artist doesn't exists.
   */
  getArtistById(id) {
    return this._getById(this.artists, "artist", id);
  }

   /**
   * Get an Album that has the same id of the parameter.
   * 
   * @param {number} id The id of the Album to do the search.
   * @returns {typeof albumMod.Album} The Album that has the same id of the parameter.
   * @throws {NotFoundException} If the id of the Album doesn't exists.
   */
  getAlbumById(id) {
    return this._getById(this.getAllAlbum(), "album", id);
  }

   /**
   * Get a Track that has the same id of the parameter.
   * 
   * @param {number} id The id of the Track to do the search.
   * @returns {typeof trackMod.Track} The Track that has the same id of the parameter.
   * @throws {NotFoundException} If the id of the Track doesn't exists.
   */
  getTrackById(id) {
    return this._getById(this.getAllTracks(), "track", id);
  }

  /**
   * Get a Playlist that has the same id of the parameter.
   * 
   * @param {number} id The id of the Playlist to do the search.
   * @returns {typeof playlistMod.PlayList} The Playlist that has the same id of the parameter.
   * @throws {NotFoundException} If the id of the Playlist doesn't exists.
   */
  getPlaylistById(id) {
    return this._getById(this.playlists, "playlist", id);
  }

  /**
   * Get all the Tracks that contains at least one of the given genres.
   * 
   * @param {typeof arrayListMod.ArrayList} genres An ArrayList of genres to match.
   * @returns {typeof arrayListMod.ArrayList} All the tracks that contains at least one of the given genres.
   */
  getTracksMatchingGenres(genres) {
    return this.getAllTracks().filter((track) => track.containsAnyGenre(genres));
  }

  /**
   * @returns {typeof arrayListMod.ArrayList} All the tracks of Unqfy.
   */
  getAllTracks(){
    return this.artists.flatMap((artist) => artist.getAllTracks());
  }

  /**
   * @returns {typeof arrayListMod.ArrayList} All the Albums of Unqfy.
   */
  getAllAlbum(){
    return this.artists.flatMap((artist) => artist.albums);
  }

  /**
   * Get all the tracks of an Artist.
   * 
   * @param {number} artistId An id of an Artist to get all the tracks of that Artist.
   * @returns {typeof arrayListMod.ArrayList} All the tracks of the Artist.
   * @throws {UnqfyException} If the id of the artist doesn't exists on Unqfy.
   */
  getTracksMatchingArtist(artistId) {
    const elementConditional = this.artists.findById(artistId);
    if(!elementConditional.hasValue) throw new unqfyExceptionMod.UnqfyException("FAILED TO GET TRACKS MATCHING ARTIST - There is no artist with id: " + artistId);
    return elementConditional.value.getAllTracks();
  }

  /**
   * Get all the albums of the Artist.
   * 
   * @param {number} artistId An id of an Artist to search.
   * @returns {typeof arrayListMod.ArrayList} All the albums of the Artist.
   * @throws {NotFoundException} If the id of the Artist doesn't exists.
   */
  getAlbumsByArtistId(artistId){
    return this.getArtistById(artistId).albums;
  }

  getArtistByName(artistName) {
    let artistsFound = this._filterByName(this.artists, artistName);
    if(artistsFound.isEmpty()){
      throw new notFoundExceptionMod.NotFoundException('artist', artistName);
    }
    return artistsFound[0];
  }

  getAlbumByArtistNameArtist(artistName){
    return this.getArtistByName(artistName).albums;
  }

  getLyricsByTrackId(trackId) {
    let trackFound = this.getTrackById(trackId);
    return trackFound.lyrics.then(() => { return trackFound.lyrics });
  }

  getLyricsByTrackName(aTrackName) {
    let trackFound = this.searchByName(aTrackName).tracks;
    if (trackFound.isEmpty()) {
      return this.getLyricsByTrackId(trackFound[0].id);
    } else {
      return new notFoundExceptionMod.NotFoundException('track', aTrackName);
    }
  }

  /**
   * Generate an aleator list of tracks.
   * 
   * @private
   * @param {typeof arrayListMod.ArrayList} tracks The tracks to generate the aleator playlist.
   * @param {number} maxDuration The maximum duration of the playlist.
   * @returns {typeof arrayListMod.ArrayList} The tracks with an aleator order.
   */
  _generateAleatorList(tracks, maxDuration){
    const trackss = tracks.slice(0);
    const trackList = new arrayListMod.ArrayList();
    let duration = 0;
    while(duration < maxDuration && !trackss.isEmpty()){
      var ranIndex = this._randomIndex(trackss.length);
      const track = trackss.splice(ranIndex,1).pop();
      if ((duration + track.duration) <= maxDuration){      
         trackList.push(track);
         duration = duration + track.duration;
      }    
    }
    return trackList;  
  }

  /**
   * Create a new Arraylist of the music elements that contains the parameter name inside
   * element.name.
   * 
   * @private
   * @param {typeof arrayListMod.ArrayList} list An ArrayList of music elements to match.
   * @param {string} aName The name to match to list.
   * @returns {typeof arrayListMod.ArrayList} An Arraylist of the music elements that contains the name on the given list.
   */
  _filterByName(list, aName){
    return list.filter((elem) => elem.name.toUpperCase().includes(aName.toUpperCase()));
  }

  /**
   * The unqfy elements that contains a part of the name.
   * 
   * @param {string} aName The name to match all unqfy elements.
   * @returns The unqfy elements that contains a part of the name.
   */
  searchByName(aName){
      return {
      artists: this._filterByName(this.artists, aName),
      albums: this._filterByName(this.getAllAlbum(), aName),
      tracks: this._filterByName(this.getAllTracks(), aName),
      playlists: this._filterByName(this.playlists, aName),
    };
  }

  /**
   * Remove an Artist from Unqfy.
   * 
   * @param {number} artistId An id of an Artist to search and remove from Unqfy.
   * @returns The music elements that have been modified.
   * @throws {UnqfyException} If the id of the Artist doesn't exists.
   */
  removeArtist(artistId){
    try{
      const albums = this.getAlbumsByArtistId(artistId);
      const albumsModified = albums.slice(0);
      const elementsModified = new arrayListMod.ArrayList();

      while(albums.length > 0){
        elementsModified.push(this.removeAlbum(albums[0].id));
      }
      const tracksModified = elementsModified.flatMap((result) => result.tracks);
      const playlistsModified = new arrayListMod.ArrayList(...new Set(elementsModified.flatMap((result) => result.playlists)));

      // Cuando el notificator 'pregunte' si ese id existe en unqfy, ya va a estar eliminado
      this.clientNotificator.notifyRemovedArtist(artistId)
        .then(() => {
          const removed = this.artists.removeById(artistId);
          this.clientMonitor.notifyUpdate(removed, 'removed');
          return {
            albums: albumsModified,
            tracks: tracksModified,
            playlists: playlistsModified
          };
        }).catch(err => console.log('Failed to notify removed artist - ' + err));
    }catch(exception){
      // if (exception instanceof notFoundExceptionMod.NotFoundException) {
      //   throw new unqfyExceptionMod.UnqfyException("FAILED TO REMOVE AN ARTIST - There is no artist with id: " + artistId + ".");
      // }
      throw exception;
    }
  }

  /**
   * Remove an Album and the tracks of the Album from Unqfy .
   * 
   * @param {number} albumId An id of an Album to search and remove from Unqfy.
   * @returns The music elements that have been modified.
   * @throws {UnqfyException} If the id of the Album doesn't exists.
   */
  removeAlbum(albumId){
    try{
      const albumToRemove = this.getAlbumById(albumId);
      const playlistsRemoved = new arrayListMod.ArrayList(...new Set(albumToRemove.tracks.flatMap(track => this._removeTrackFromPlaylists(track))));
      albumToRemove.author.removeAlbum(albumId);
      this.clientMonitor.notifyUpdate(albumToRemove, 'removed');
      return {
        author: albumToRemove.author,
        playlists: playlistsRemoved,
        tracks: albumToRemove.tracks
      }
    }
    catch(exception){
      // if(exception instanceof notFoundExceptionMod.NotFoundException) {
      //   throw new unqfyExceptionMod.UnqfyException("FAILED TO REMOVE AN ALBUM - There is no album with id: " + albumId + ".")
      // }
      throw exception;
    }
  }

  /**
   * Remove the track of the Album and playlists from Unqfy .
   * 
   * @param {number} trackId An id of a Track to search and remove from Unqfy.
   * @returns The music elements that have been modified.
   * @throws {UnqfyException} If the id of the Track doesn't exists.
   */
  removeTrack(trackId){
    try {
      const trackFound = this.getTrackById(trackId);
      const playlistsRemoved = this._removeTrackFromPlaylists(trackFound);
      const albumFound = this.getAllAlbum().find(album => album.hasTrack(trackFound));
      albumFound.removeTrack(trackId);
      this.clientMonitor.notifyUpdate(trackFound, 'removed');

      return {
        track: trackFound,
        album: albumFound,
        playlists: playlistsRemoved 
      };
    } catch (exception) {
      if (exception instanceof notFoundExceptionMod.NotFoundException) {
        throw new unqfyExceptionMod.UnqfyException("FAILED TO REMOVE A TRACK - There is no track with id: " + trackId + ".")
      }
      throw exception;
    }
  }

  /**
   * Remove a Track from the Playlist.
   * 
   * @private
   * @param {typeof trackMod.Track} aTrack A track to remove from playlist.
   * @returns {typeof arrayListMod.ArrayList} The playlists that contains the track.
   */
  _removeTrackFromPlaylists(aTrack){
    const playlistsFound = this.playlists.filter(pl => pl.hasTrack(aTrack));
    playlistsFound.forEach(p => p.removeTrack(aTrack.id));
    return playlistsFound;
  }

  /**
   * Remove a Playlist with the given id.
   * 
   * @param {number} playlistId The id of a Playlist to remove.
   * @returns {typeof playlistMod.PlayList} The Playlist deleted.
   * @throws {UnqfyException} If the id of the Playlist doesn't exists.
   */
  removePlaylist(playlistId){
    try{
      return this.playlists.removeById(playlistId);
    }
    catch(exception){
      if (exception instanceof arrayListExceptionMod.ArrayListException) {
        throw new unqfyExceptionMod.UnqfyException("FAILED TO REMOVE A PLAYLIST - There is no playlist with id: " + playlistId + ".");
      }
      throw exception;
    }
  }

  checkDuplicatedData(list, data, className) {
    if ( list.some( ent => ent.hasSameData(data)) ) {
      throw new duplicatedExceptionMod.DuplicatedDataException(className);
    }
  }

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];
    const serializedData = picklify.picklify(this);
    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    const classes = [UNQfy,artistMod.Artist, albumMod.Album, trackMod.Track, idGeneratorMod.IdGenerator, playlistMod.PlayList, arrayListMod.ArrayList, clientNotfMod.ClientNotificator, clientMonitorMod.ClientMonitor];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  /**
   * @type {UNQfy}
   */
  UNQfy,
};
