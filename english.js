// a mem match game for english class yay
// made by samyok nepal. (c) 2018.
// no part of this may be reproduced unless one or both of the following apply:
// either
//  the portion that is to be reproduced is from another source
//  or with written permission from the author.
const APP_NAME = "English Memory Match";
const startTime = Date();
const logger = require('./custom_modules/logger.js');
var samyok = require('./custom_modules/samyok.js')({
    "logger": logger
});

const fs = require("fs");
const blah = JSON.parse(fs.readFileSync('./custom_modules/questions.json', 'utf8'));

var socket = require("socket.io");
var express = require("express");
var app = express(); // server STUFF
var documentation = new express();
var jsdocFiles = new express();
var restart_code = randInt(10000, 9999999);
app.get('/restart_code=' + restart_code, function(req, res, next) { // restart function
    logger.error("/restart HIT! RESTART NOOoOooOOOOO");
    res.send('<h1>Server Restart</h1><script>setTimeout(function(){location.href="/"}, 1000)</script>');
    process.exit(1);
});

logger.silly("Imports done.");

var server = app.listen(4000, function() {
    logger.info("Started " + APP_NAME + "'s express server. Listening to port 4000.");
});
app.use(express.static("public"));

var docsServer = documentation.listen(8080, function() {
    logger.info("Started " + APP_NAME + "'s documentation server. Listening to port 8080.");
});
documentation.use(express.static("docs"));


var jsdocServer = jsdocFiles.listen(8081, function() {
    logger.info("Started " + APP_NAME + "'s jsdoc server. Listening to port 8081.");
});
jsdocFiles.use(express.static("public/jsdocs/memnode/1.0.0"));

var io = socket(server);
logger.info("Started " + APP_NAME + "'s socket server.");

var place = function() {
    this.clean = function(a) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == a) {
                this.splice(i, 1);
                i--
            }
        }
        return this;
    };
}
// define vars and add .clean() functions.
var users = new place();
var rooms = new place();
var lobbies = new place();

io.on("connection", (socket) => {
    var key = socket.id;
    users[key] = {};
    logger.info("+1 user! Key: " + key + " Total: " + samyok.count(users));
    users[key].logged_in = false;
    logger.silly(users);
    io.to(key).emit("connected", {
        connected: true
    }); // make sure that they are
    // connected and trigger login.
    socket.on("username", function(data) {
        // check if username exists:
        var allow = true;
        for (var a in users) {
            if (users[a].username == data.username) {
                allow = false;
            }
        }
        if (allow) {
            users[key].logged_in = true;
            users[key].username = data.username;
            logger.silly(users);
            logger.info("Login: " + users[key].username);
            io.to(key).emit("username_response", {
                message: "success",
                lobby: "main",
                username: users[key].username
            });
            logger.info("Move " + users[key].username + " to lobby 'main'.");
            if (lobbies.main != undefined) {
                lobbies.main[key] = users[key].username;
            } else {
                var main = new place();
                lobbies.main = main;
                lobbies.main[key] = users[key].username;
            }
            logger.silly(lobbies);
        } else {
            io.to(key).emit("username_response", {
                message: 'error',
                reason: "Your username is taken. Please pick another one."
            })
        }
    });
    socket.on("create_room", function(data) {
        switch (data.type) {
            case "double":
                io.to(key).emit('room_created', {
                    room: create_room("double", key)
                })
                break;
            default:
                io.to(key).emit("error", {
                    message: "lol"
                });
        }
    });
    socket.on('samyok_says_restart', function(data) {
        logger.warn("Restart code Requested by " + key);
        socket.emit("console", {
            href: "/restart_code=" + restart_code
        });
    })
    socket.on("join_room", function(data) {
        join_room(data.code, key);
    });
    socket.on("ready", function() {
        for (var a in rooms) {
            if (rooms[a].gameInfo == null || rooms[a].gameInfo.leader == key) {
                var other = "player2";
            } else {
                var other = "leader";
            }
            if (rooms[a].gameInfo == undefined) {
                delete rooms[a];
                logger.error("Deleted room " + a + ", the room's info was undefined.");
                logger.silly(rooms);
            } else if (rooms[a].gameInfo.leader == key) {
                rooms[a].ready.leader = true;
                logger.info("Marked " + users[key].username + " as ready to play in room " + a + '.');
                logger.silly(rooms);
                start_game(a);
            } else if (rooms[a].gameInfo.player2 == key) {
                rooms[a].ready.player2 = true;
                logger.info("Marked " + users[key].username + " as ready to play in room " + a + '.');
                logger.silly(rooms);
                start_game(a);
            }
        }
    });
    Array.prototype.clean = function(d) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == d) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };
    /**
     * @param {string} room the room key
     * @return {void}
     */
    function start_game(room) {
        logger.warn(blah);
        if (!rooms[room].ready.leader || !rooms[room].ready.player2) {
            return false;
        }
        logger.info("Started game in room " + room + ".");
        rooms[room].started = 1;
        io.to(rooms[room].gameInfo.leader).emit("game_start", {
            first: true
        });
        io.to(rooms[room].gameInfo.player2).emit("game_start", {
            first: false
        });
        var arr = [{
                "question": "Main character",
                "answer": "Guy Montag"
            },
            {
                "question": "Montag's wife",
                "answer": "Mildred"
            },
            {
                "question": "Last Person killed by Montag",
                "answer": "Captain Beatty"
            },
            {
                "question": "A machine that tries to kill Montag",
                "answer": "The Hound"
            },
            {
                "question": "The book Montag memorized",
                "answer": "Book of Ecclesiastes"
            },
            {
                "question": "Poem that Montag reads",
                "answer": "Dover Beach"
            },
            {
                "question": "Temperature at which paper burns",
                "answer": "451 degrees Farenheit"
            },
            {
                "question": "Most important girl in the story",
                "answer": "Clarisse McClellan"
            },
            {
                "question": "Author of Fahrenheit 451 ",
                "answer": "Ray Bradbury"
            },
            {
                "question": "Number of walls in Mildred's \"family\"",
                "answer": "3"
            },
            {
                "question": "Clarisse makes Montag question this feeling",
                "answer": "Happiness"
            },
            {
                "question": "Mildred ___, so techies were called. ",
                "answer": "Ate too many sleeping pills"
            },
            {
                "question": "Leader of so-called \"criminals\" ",
                "answer": "Granger"
            },
            {
                "question": "Montag original thoughts on burning",
                "answer": "Pleasing"
            },
            {
                "question": "Montag convinced Faber to help him by...",
                "answer": "Ripping pages out of the Bible"
            },
            {
                "question": "The Hound's weapon",
                "answer": "A procaine needle"
            },
            {
                "question": "Name of fireman that Montag reported",
                "answer": "Black"
            },
            {
                "question": "A(n) ___ man is killed instead of Montag",
                "answer": "Innocent"
            }
        ];
        console.log(arr);
        var NUMBER_OF_CARDS = arr.length * 2; //MUST BE EVEN
        var new_arr = rearrange();

        function rearrange() {
            var newArr = [];
            for (var i = 0; i < NUMBER_OF_CARDS / 2; i++) {
                item = Math.floor(Math.random() * arr.length)
                newArr.push(arr[item].question);
                newArr.push(arr[item].answer);
                delete arr[item];
                arr.clean(null);
            }
            return newArr;
        }
        super_arr = shuffle(new_arr);

        function shuffle(arr) {
            var TheArr = arr;
            var return_arr = [];
            var iterations = TheArr.length;
            for (var i = 0; i < iterations; i++) {
                var theNumber = Math.floor(Math.random() * (TheArr.length));
                return_arr.push(TheArr[theNumber]);
                delete TheArr[theNumber];
                TheArr.clean();
            }
            return return_arr;
        }
        rooms[room].game.turn = "leader";
        rooms[room].scores = {
            leader: 0,
            player2: 0
        }
        rooms[room].game.card1 = null;
        rooms[room].game.card2 = null;
        rooms[room].cards = super_arr;
        logger.silly(rooms);
    }
    socket.on("click_card", function(data){;
        var room = findRoomName(key);
        logger.silly('card click in room '+room);
        if(key == rooms[room].gameInfo[rooms[room].game.turn]){
            if(rooms[room].game.card1 ==null){
                rooms[room].game.card1 = rooms[room].cards[data.number];
                io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2).emit("flip_card", {number : data.number, text :rooms[room].game.card1});
            } else if(rooms[room].game.card1 == rooms[room].cards[data.number]) {
                //do nothing
            } else if(rooms[room].game.card2 == null){
                rooms[room].game.card2 =rooms[room].cards[data.number];
                io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2).emit("flip_card", {number : data.number, text: rooms[room].game.card2});
            } else {
                if(findCP(rooms[room].game.card1)==rooms[room].game.card2){ // was right
                    if(key == rooms[room].gameInfo.leader){
                        rooms[room].scores.leader++;
                        io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                            .emit("gameInfo", {type: "notif", message: "score", person: "leader", score:rooms[room].scores.leader });
                    } else {
                        rooms[room].scores.player2++;
                        io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                            .emit("gameInfo", {type: "notif", message: "score", person: "player2", score:rooms[room].scores.player2});
                    }
                    io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                        .emit("remove_card", {number: findKey(rooms[room].game.card2, rooms[room].cards)});
                    io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                        .emit("remove_card", {number: findKey(rooms[room].game.card1, rooms[room].cards)});
                } else {
                    if(rooms[room].game.turn == "leader"){
                        rooms[room].game.turn = "player2";
                    } else {
                        rooms[room].game.turn = "leader";
                    }
                    io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                        .emit("flip_card", {number: findKey(rooms[room].game.card2, rooms[room].cards), text: "Don't Cheat"});
                    io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                        .emit("flip_card", {number: findKey(rooms[room].game.card1, rooms[room].cards), text: "Don't Cheat"});
                }
                rooms[room].game.card2 = null;
                rooms[room].game.card1 = null;
            }
        } else {
            io.to(key).emit("message", {color: "red", message: "Not your turn!"});
        }
        logger.silly(rooms);
    });
    function findRoomName(key){
        for(var a in rooms){
            if(rooms[a].gameInfo.leader == key || rooms[a].gameInfo.player2 == key){
                return a;
            }
        }
    }
    socket.on("disconnect", function() {
        for (var a in rooms) {
            if (rooms[a].gameInfo == null || rooms[a].gameInfo.leader == key) {
                var other = "player2";
            } else {
                var other = "leader";
            }
            if (rooms[a].hasOwnProperty() && (rooms[a].gameInfo.leader == null && rooms[a].gameInfo.player2==null)) {
                delete rooms[a];
                logger.error("Deleted room " + a + ", the room's info was undefined or no other player was in it. ");
                logger.silly(rooms);
            } else if (rooms[a].hasOwnProperty() && rooms[a].gameInfo.leader == key) {
                rooms[a].gameInfo.leader = null;
                rooms[a].abandoned = true;
                logger.info(users[key].username + " just left room " + a + ", marked as abandoned.");
                io.to(rooms[a].gameInfo.player2).emit("gameInfo", {
                    type: "notif",
                    message: "opponent_abandoned"
                });
                logger.info("Sent abandoned, win notification to " + users[rooms[a].gameInfo.player2].username)
                logger.silly(rooms);
            } else if ( rooms[a].hasOwnProperty() && rooms[a].gameInfo.player2 == key) {
                rooms[a].gameInfo.player2 = null;
                rooms[a].abandoned = true;
                logger.info(users[key].username + " just left room " + a + ", marked as abandoned.");
                io.to(rooms[a].gameInfo.leader).emit("gameInfo", {
                    type: "notif",
                    message: "opponent_abandoned"
                });
                logger.info("Sent abandoned, win notification to " + users[rooms[a].gameInfo.leader].username)
                logger.silly(rooms);
            }
        }
        logger.info("-1 user. Key: " + key + " Total: " + samyok.count(users));
        for (var a in lobbies) {
            delete lobbies[a][key];
            logger.info("Removed user " + users[key].username + " from lobby " + a);
        }
        logger.info("Deleting " + users[key].username);
        delete users[key];
        users.clean(null); // look for null and get rid of it.
    });
});
var roomNumber = 0;

function randInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min))
}

function create_room(type, key) {
    for (var a in lobbies) {
        delete lobbies[a][key];
    } // remove from lobby
    roomNumber += randInt(9, 20);
    var room_name = "room" + roomNumber.toString();
    rooms[room_name] = new place();
    rooms[room_name].type = type;
    rooms[room_name].gameInfo = {};
    rooms[room_name].game = {};
    rooms["room" + roomNumber.toString()].gameInfo.leader = key;
    rooms[room_name].ready = {};
    rooms[room_name].ready.leader = false;
    if (type == "double") {
        rooms[room_name].gameInfo.player2 = null;
        rooms[room_name].ready.player2 = false;
    }
    rooms[room_name].started = false;
    rooms[room_name].abandoned = false;
    logger.silly(rooms);
    return room_name;
}

function join_room(code, key) {
    if (rooms[code] == null || rooms[code].abandoned) {
        io.to(key).emit("join_response", {
            message: "error",
            reason: "Not a real room."
        });
        logger.info(key + " just tried to go to room " + code);
        logger.silly(rooms);
        return true;
    } else {
        rooms[code].gameInfo.player2 = key;
        io.to(rooms[code].gameInfo.leader).emit("player_joined", {
            player: users[key].username
        });
        logger.silly(rooms);
        io.to(key).emit("join_response", {
            message: "success",
            code: code,
            player: users[rooms[code].gameInfo.leader].username
        });
    }
}

function findCP(cardText) {
    for (var number in blah) {
        if (blah[number].question == cardText) {
            return blah[number].answer;
        } else if (blah[number].answer == cardText) {
            return blah[number].question;
        }
    }
}
/**
 * Finds a key with an element
 * @param {string} needle the needle in the haystack
 * @param {object} haystak the haystack the needle is in
 */
function findKey(needle, haystack){
    for(var a in haystack){
        if(haystack[a] == needle){
            return a;
        }
    }
}
