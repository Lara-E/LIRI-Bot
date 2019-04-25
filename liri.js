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
var movie = "movie-this";
// var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
var queryUrl;

switch (command) {
    case (spotifySong):
        if (input) {
            getSpotify(input);
        }
        else {
            getSpotify("The Sign Ace of Base")
        }
        break;
    case (concert):
        if (input) {
            getConcert(input);
        }
        else {
            getConcert("Iron Maiden");
        }
        break;
}

function getSpotify(track) {
    console.log("\r\n Here are the top 3 Spotify results for " + track + ":\r\n")
    spotify.search({
            type: "track",
            query: track,
            limit: 3
        })
        .then(function(response) {
            var song = response.tracks.items;
            for (var i = 0; i < song.length; i++) {
                console.log(" Song Title: " + song[i].name + "\r\n Artist : " + song[i].album.artists[0].name + ":\r\n Album: " + song[i].album.name);
                if (song[i].preview_url === null) {
                    console.log(" Sorry, no preview available. Open the song on Spotify instead: " + song[i].href + "\r\n ==========")
                }
                else {
                    console.log(" Preview: " + song[i].preview_url + "\r\n ===========");
                };
            };
        })
        .catch(function(err) {
            console.log("Oops, something went wrong \r\n" + err);
        });
};

function getConcert(band) {
    console.log("\r\n Here are the next 5 upcoming concerts for " + band + ":\r\n")
    queryUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp"
    axios.get(queryUrl)
    .then(function(response) {
        var events = response.data;
        for (var i = 0; i < 5; i++) {
            var date = moment(events[i].datetime).format("MM/DD/YYYY")
            console.log("Date: " + date + "\r\n Venue: " + events[i].venue.name);
           if (!events[i].venue.region) {
               console.log(" Location: " + events[i].venue.city + ", " + events[i].venue.country + "\r\n ==========");
           }
           else {
               console.log(" Location: " + events[i].venue.city + ", " + events[i].venue.region + "\r\n ==========")
           }
        }
    })
    .catch(function(err) {
        console.log("Oops, something went wrong \r\n" + err)
    })
}