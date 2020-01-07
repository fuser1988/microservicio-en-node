const request = require('request-promise');
class ClientMusixMatch{
    
    constructor(){
        this.urlMusixMatch = "http://api.musixmatch.com/ws/1.1/";
        this.apiKey = '6c6e31a005105f654a01249c588c2d26';
    }
 
    requestLyricsByTrackId( aTrack, id ){
        let options = {
            url: this.urlMusixMatch+'track.lyrics.get?track_id=' + id +'&apikey=' + this.apiKey,
            json: true,
        }

        return request.get(options).then((response)=>{
            aTrack.lyrics = response.message.body.lyrics.lyrics_body;
            return aTrack.lyrics;
        });
    }

    requestLyricsByTrackName( aTrack ){
        
        let options = {
            url: this.urlMusixMatch+'track.search?q_track=' + aTrack.name +'&apikey=' + this.apiKey,
            json: true,
        }

        return request.get(options)
                .then((response)=>{
                    return response.message.body.track_list[0].track.track_id; 
                    })
                .then((res)=>{ return this.requestLyricsByTrackId(aTrack, res)});
    }

}

module.exports = {
    ClientMusixMatch,
};