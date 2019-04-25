require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment")
var wrap = require('word-wrap');
var fs = require("fs");
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");
var spotifySong = "spotify-this-song";
var concert = "concert-this";
var doThis = "do-what-it-says";
var movie = "movie-this";
var queryUrl;

function askLIRI(command, input) {
    switch (command.toLowerCase()) {
        case (spotifySong):
            input = input || "The Sign Ace of Base";
            getSpotify(input);
            break;
        case (concert):
            input = input || "Iron Maiden";
            getConcert(input);
            break;
        case (movie):
            input = input || "Mr. Nobody";
            getMovie(input);
            break;
        case (doThis):
            doWhat();
            break;
        default:
            console.log("\r\n Please enter one of the following requests: \r\n spotify-this-song <song-name> \r\n concert-this <artist or band> \r\n movie-this <movie title> \r\n do-what-it-says");
    };
};

function getSpotify(track) {
    console.log("\r\n Here are the top 3 Spotify results for " + track.toUpperCase() + ":\r\n")
    spotify.search({
        type: "track",
        query: track,
        limit: 3
    })
        .then(function (response) {
            var song = response.tracks.items;
            for (var i = 0; i < song.length; i++) {
                console.log(" Song Title: " + song[i].name + "\r\n Artist : " + song[i].album.artists[0].name + ":\r\n Album: " + song[i].album.name);
                if (song[i].preview_url === null) {
                    console.log(" Sorry, no preview available. \r\n Open the song on Spotify instead: " + song[i].href + "\r\n ==========")
                }
                else {
                    console.log(" Preview: " + song[i].preview_url + "\r\n ===========");
                };
            };
        })
        .catch(function (err) {
            console.log("Oops, something went wrong \r\n" + err);
        });
};

function getConcert(band) {
    console.log("\r\n Here are the next 5 upcoming concerts for " + band.toUpperCase() + ":\r\n");
    queryUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    axios.get(queryUrl)
        .then(function (response) {
            var events = response.data;
            for (var i = 0; i < 5; i++) {
                var date = moment(events[i].datetime).format("MM/DD/YYYY")
                console.log(" Date: " + date + "\r\n Venue: " + events[i].venue.name);
                if (!events[i].venue.region) {
                    console.log(" Location: " + events[i].venue.city + ", " + events[i].venue.country + "\r\n ==========");
                }
                else {
                    console.log(" Location: " + events[i].venue.city + ", " + events[i].venue.region + "\r\n ==========");
                }
            }
        })
        .catch(function (err) {
            console.log("Oops, something went wrong \r\n" + err);
        });
};

function getMovie(title) {
    console.log("\r\n Here is the OMDB information for " + title.toUpperCase() + ": \r\n");
    queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl)
        .then(function (response) {
            var film = response.data
            console.log(" Title: " + film.Title + "\r\n Rated: " + film.Rated + "\r\n Year: " + film.Year + "\r\n IMDB Rating: " + film.imdbRating + "\r\n Rotten Tomatoes Score: " + film.Ratings[1].Value + "\r\n Country: " + film.Country + "\r\n Language: " + film.Language + "\r\n Plot:" + wrap(film.Plot) + "\r\n Actors: " + film.Actors);
        })
        .catch(function (err) {
            console.log("Oops, something went wrong \r\n" + err);
        });
};

function doWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var doWhatArr = data.split(", ");
        var command = doWhatArr[0];
        var input = doWhatArr[1];
        askLIRI(command, input);
    });
};

askLIRI(command, input);