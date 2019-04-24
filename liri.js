require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment")

var command = process.argv[2];
var input = process.argv.slice(3).join(" ");
var spotifySong = "spotify-this-song";
var concert = "concert-this";
var doThis = "do-what-it-says";
var move = "movie-this";

switch (command) {
    case (spotifySong):
    if (input) {
        getSpotify(input)
    }
    else {
        getSpotify("The Sign Ace of Base")
    }
    break;
}

    function getSpotify(track) {
    spotify
    .search({ 
        type: "track",
        query: track,
        limit: 3
     })
    .then(function(response) {
         var song = response.tracks.items;
        for (var i = 0; i < song.length; i ++) {
            console.log("\r\n Song Title: " + song[i].name + "\r\n Artist : " + song[i].album.artists[0].name + "\r\n Album: " + song[i].album.name);
            if (song[i].preview_url === null) {
                console.log(" Sorry, no preview available. Open the song on Spotify instead: " + song[i].href  + "\r\n ==========")
            }
            else {
                console.log(" Preview: " + song[i].preview_url + "\r\n ===========");
            };
        };
    })
    .catch(function(err) {
      console.log(err);
    });
};