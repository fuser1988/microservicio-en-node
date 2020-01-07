# Practical Work - UNQfy - Group 5
**Team members:**
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • _Guzmán Sergio_
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • _Velázquez Mariana_
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • _Marino Alan_

# Important Information
To manipulate UNQfy correctly, the parameters that are Arrays must have to be declared with no spaces between separators.
<br>
<br>
Examples:
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✓ &nbsp;&nbsp; ["Hard Rock","Samba"]
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✗ &nbsp;&nbsp; ["Hard Rock", "Samba"] -> It's not correct because it have a white space.
 
 
# Interface to manipulate UNQfy

| COMMANDS                | FIRST PARAMETER                                           | SECOND PARAMETER                                    | THIRD PARAMETER                                    | FOURTH PARAMETER                 |
|-------------------------|-----------------------------------------------------------|-----------------------------------------------------|----------------------------------------------------|----------------------------------|
| **addArtist**             | **_country_** - The country where the Artist was founded      | **_name_** - The name of the Artist                     |<p align="center"> - </p>|<p align="center"> - </p>|
| **addAlbum**                | **_artistId_** - The id of the Artist to insert the new Album | **_name_** - The name of the Album                      | **_year_** - Year in which Album was released            |<p align="center"> - </p>|
| **addTrack**                | **_albumId_** - The id of the Album to insert the new Track   | **_name_** - The name of the Track                      | **_duration_** - The duration of the Track in seconds    | **_genres_** - The genres of the Track |
| **createPlaylist**          | **_name_** - The name of the Playlist                         | **_genres_** - The genres you want to include on Playlist | **_maxDuration_** - The maximum duration of the Playlist |<p align="center"> - </p>|
| **getArtistById**           | **_id_** - The id of the Artist                               |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **getAlbumById**            | **_id_** - The id of the Artist                               |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **getTrackById**            | **_id_** - The id of the Track                                |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **getPlaylistById**         | **_id_** - The id of the Playlist                             |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **removeArtistById**        | **_id_** - The id of the Artist                               |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **removeAlbumById**         | **_id_** - The id of the Album                                |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **removeTrackById**         | **_id_** - The id of the Track                                |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **removePlaylistById**      | **_id_** - The id of the Playlist                             |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **getTracksMatchingGenres** | **_genres_** - The genres to match tracks                       |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **getTracksMatchingArtist** | **_id_** - The id of the Artist to get tracks                   |<p align="center"> - </p>|<p align="center"> - </p>|<p align="center"> - </p>|
| **searchByName**            | **_name_** - The name to match with all music instances         | <p align="center"> - </p>| <p align="center"> - </p>|<p align="center"> - </p>|


<br>


# Examples Using The Commands

<br>

## ⚫ Commands To Add A New Instance

![](allAddExamples.gif)

<br>
<br>
<br>

## ⚫ Commands To Get An Instance

![](allGetExamples.gif)

<br>
<br>
<br>

## ⚫ Commands To Remove An Instance

![](allRemoveExamples.gif)

<br>
<br>
<br>

## ⚫ Commands To Do A Special Search

![](specificSearch.gif)
