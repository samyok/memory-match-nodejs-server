// a memory match game
// made by samyok nepal. (c) 2018.
// no part of this may be reproduced unless one or both of the following apply:
// either
//   the portion that is to be reproduced is from another source
//   or with written permission from the author.

// import logger
const logger = require("./modules/logger.js");
// import samyok -- basically a collection of weird functions usable anywhere.
var samyok = require("./modules/samyok.js");
var mm = require("./modules/global");

const cardos = new mm.cardMaker();
const perm_cards = cardos.cards;
console.log(perm_cards);

const fs = require('fs');
var roomNumber = 1;

function randInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min))
}
var place = function() {}
// define vars and add .clean() functions.
var users = new place();
var rooms = new place();
var lobbies = new place();


// start main express/socket server

mm.docServers.start();
mm.server.init();

var io = mm.server.io;
io.on("connection", (socket)=>{
    // sets key to the ID
    var key = socket.id;
    socket.to(key).emit("console", {message: "Connected!"});
    users[key] = {};
    // console.log(users);

    // console.log(socket.adapter);
    // console.log("ASD");
    logger.silly("Join!" + key);
    io.to(key).emit("connected", {
        connected: true
    });
    logger.debug("TO "+key+" MSG: connected");
    socket.on("user-sid", function(data){
        // get PHPSESSID
        var usernamePromise = mm.validateSID(data.sid);
        usernamePromise.then(function(uname){
            logger.silly(uname);
            if(uname == null){
                // give error if no username
                io.to(key).emit("user-sid-response",  {message: "error", reason:"Please log in."});
                logger.warn("please log in" + key + ' : sid : ' + data.sid);
            } else {
                io.to(key).emit("user-sid-response",  {message: "success", username:uname});
                // check if username already exists
                for(var a in users){
                    if(users.username == uname){
                        kill_key(a);
                        delete users[a];
                    }
                }
                users[key] = {};
                users[key].username = uname;
                // mm.uc.addUser(key, uname);

                logger.debug("added "+key+" as " + uname);
            }
        });
    });
    /**
     * @param {string} room the room key
     * @return {void}
     */
    function start_game(room) {
        logger.warn(mm.cards);
        var okay = true;
        for(var a in rooms[room].ready){
            if(!rooms[room].ready[a]){
                return false;
            }
        }
        logger.info("Started game in room " + room + ".");
        rooms[room].started = 1;
        io.to(rooms[room].gameInfo.leader).emit("game_start", {
            first: true
        });
        io.to(rooms[room].gameInfo.player2).emit("game_start", {
            first: false
        });
        var arr = "ABCDEFGHIJKLMNOPQR";
        arr += arr.toLowerCase();
        console.log(arr);
        var NUMBER_OF_CARDS = arr.length; //MUST BE EVEN

        super_arr = stringShuffle(arr);

        /**
        * Shuffles the string
        * @param  {string} string The string that you want to shuffle
        * @return {string}       The shuffled string.
        */
        function stringShuffle(string){
           var array = string.split("");
           var randomID = -1;
           var newArray = [];
           while(newArray.length != 36){
               // console.log(newArray);
               randomID = Math.floor(Math.random() * (36-newArray.length));
               // console.log(randomID);
               newArray.push(array[randomID]);
               array.splice(randomID, 1);
               // console.log(array);
           }
           return newArray;
        }
        rooms[room].game.turn = "leader";
        rooms[room].scores = {
            leader: 0,
            player2: 0
        }
        rooms[room].rebus_link = randInt(1,100);
        rooms[room].cardPairsLeft = 18;
        rooms[room].game.card1 = null;
        rooms[room].game.card2 = null;
        rooms[room].cards = super_arr;
        logger.silly(rooms);
    }
    socket.on("click_card", function(data){;
        var room = findRoomName(key);
        logger.silly('card click in room '+room);
        if(key == rooms[room].gameInfo[rooms[room].game.turn]){ // if it is your turn ...
            if(rooms[room].game.card1 ==null){ // if no cards have been chosen ...
                rooms[room].game.card1 = rooms[room].cards[data.number]; // then set the card clicked to card1
                io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2).emit("flip_card", {number : data.number, text :rooms[room].game.card1});
            } else if(rooms[room].game.card1 == rooms[room].cards[data.number]) { // if the card clicked is the same as card1...
                //do nothing
            } else if(rooms[room].game.card2 == null){ // if 1 card has been chosen. ..
                rooms[room].game.card2 =rooms[room].cards[data.number]; // set new card to card 2
                io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2).emit("flip_card", {number : data.number, text: rooms[room].game.card2});
            } else { // otherwise both cards have been clicked so now we check.
                if(findCP(rooms[room].game.card1)==rooms[room].game.card2.toLowerCase()){ // was right
                    if(key == rooms[room].gameInfo.leader){ // if you are the leader
                        rooms[room].scores.leader++;
                        rooms[room].cardPairsLeft--;
                        io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                            .emit("gameInfo", {type: "notif", message: "score", person: "leader", score:rooms[room].scores.leader });
                    } else { // you are the player2
                        rooms[room].scores.player2++;
                        rooms[room].cardPairsLeft--;
                        io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                            .emit("gameInfo", {type: "notif", message: "score", person: "player2", score:rooms[room].scores.player2});
                    }
                    // notify
                    // nothing wrong with .to(null)
                    io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                        .emit("remove_card", {number: samyok.findKey(rooms[room].game.card2, rooms[room].cards)});
                    io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                        .emit("remove_card", {number: samyok.findKey(rooms[room].game.card1, rooms[room].cards)});
                } else { // was wrong
                    console.log(findCP(rooms[room].game.card1));
                    console.log(rooms[room].game.card2);
                    if(rooms[room].type == "single"){
                        // you are the leader
                        rooms[room].scores.leader--;
                        io.to(rooms[room].gameInfo.leader).emit("gameInfo", {type: "notif", message: "score", person: "leader", score:rooms[room].scores.leader });

                    } else {
                        if(rooms[room].game.turn == "leader"){ // switch turns
                            rooms[room].game.turn = "player2";
                        } else {
                            rooms[room].game.turn = "leader";
                        }
                    }
                    io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                        .emit("flip_card", {number: samyok.findKey(rooms[room].game.card2, rooms[room].cards), text: "Don't Cheat"});
                    io.to(rooms[room].gameInfo.leader).to(rooms[room].gameInfo.player2)
                        .emit("flip_card", {number: samyok.findKey(rooms[room].game.card1, rooms[room].cards), text: "Don't Cheat"});
                }
                rooms[room].game.card2 = null;
                rooms[room].game.card1 = null;
            }
        } else {
            io.to(key).emit("message", {color: "red", message: "Not your turn!"});
        }
        if(rooms[room].cardPairsLeft == 0){
            end_game(room);
        }
        logger.silly(rooms);
    });
    function end_game(room){
        if(rooms[room].type=="double"){
            if(rooms[room].scores.leader > rooms[room].scores.player2){
                socket.of('/').emit("gameUpdate", {
                    type: "fair",
                    game: {
                        winner: {
                            username: users[rooms[room].gameInfo.leader].username,
                            score: rooms[room].scores.leader
                        },
                        loser: {
                            username: users[rooms[room].gameInfo.player2].username,
                            score:  rooms[room].scores.player2
                        }
                    }
                });
            } else if (rooms[room].scores.leader < rooms[room].scores.player2) {
                socket.of('/').emit("gameUpdate", {
                    type: "fair",
                    game: {
                        loser: {
                            username: users[rooms[room].gameInfo.leader].username,
                            score: rooms[room].scores.leader
                        },
                        winner: {
                            username: users[rooms[room].gameInfo.player2].username,
                            score:  rooms[room].scores.player2
                        }
                    }
                });
            } else {
                socket.of('/').emit("gameUpdate", {
                    type: "tie",
                    game: {
                        winner: { // not really but w/e continuity
                            username: users[rooms[room].gameInfo.leader].username,
                            score: rooms[room].scores.leader
                        },
                        loser: {
                            username: users[rooms[room].gameInfo.player2].username,
                            score:  rooms[room].scores.player2
                        }
                    }
                });
            }
        } else {
            console.log("Emit to "+ rooms[room].gameInfo.leader);
            io.to(rooms[room].gameInfo.leader).emit("rebus_time", {rebus_link: rooms[room].rebus_link});
        }
        /* TODO POST SCORES */
    }
    function findRoomName(key){
        for(var a in rooms){
            if(rooms[a].gameInfo.leader == key || rooms[a].gameInfo.player2 == key){
                return a;
            }
        }
    }
socket.on('force-end', function(data){
    console.log("FORCE END ROOM" + findRoomName(key));
    end_game(findRoomName(key));
})
    function kill_key(key){
        console.log(key);
        console.log(users[key]);
        var username = users[key].username;
        console.log(username + " just disconnected");
        delete users[key];
        for(var a in rooms){
            if(rooms[a].gameInfo.leader==key){
                rooms[a].gameInfo.leader= null;
                rooms[a].abandoned = username;
                console.log("deleting leader");
                abandoned_key(key, a);
            }else if(rooms[a].gameInfo.player2 == key){
                rooms[a].gameInfo.player2= null;
                rooms[a].abandoned = username;
                abandoned_key(key, a);
            } else {
                console.log("key" + key + 'not in room. ');
                console.log(rooms);
            }
        }
    }
    function abandoned_key(key, room){
        // leader still in
        console.log(key+ " " + room);
        if(!rooms[room].started){
            console.log("room hasnt started or already abandoned")
            delete rooms[room];
            return true;
        }
        if(rooms[room].gameInfo.player2 ==null && rooms[room].gameInfo.leader==null){
            return true;
        }
        if(rooms[room].gameInfo.player2==null){
            console.log("leader won!");
            socket.broadcast.emit("gameUpdate", {
                type: "abandon",
                game: {
                    winner: {
                        username: users[rooms[room].gameInfo.leader].username,
                        score: rooms[room].scores.leader
                    },
                    loser: {
                        username: rooms[room].abandoned,
                        score:socket
                    }
                }
            });
        } else {
            console.log("sending to player2: " + rooms[room].gameInfo.player2);
            socket.broadcast.emit("gameUpdate", {
                type: "abandon",
                game: {
                    winner: {
                        username: users[rooms[room].gameInfo.player2].username,
                        score: rooms[room].scores.player2
                    },
                    loser: {
                        username: rooms[room].abandoned,
                        score: 0
                    }
                }
            });
        }
        console.log(rooms);
    }
    /////////////////////////
    socket.on("create_room", function(data) {
        switch (data.type) {
            case "double":
                io.to(key).emit('room_created', {
                    room: create_room("double", key),
                    type: "double"
                })
                break;
            case "single":
                var theRoom = create_room("single", key);
                io.to(key).emit('room_created', {
                    room: theRoom,
                    type: "single"
                })
                io.to(key).emit("game_start", {
                    first: true
                });
                rooms[theRoom].ready.leader = true;
                start_game(theRoom);
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
            href: "restart_code=" + mm.server.restart_code
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
    socket.on("rebus_answer", function(data1){
        // get PHPSESSID
        var rebusPromise = new Promise(function(resolve, reject) {
            http.get("http://memory.samyok.us/rebus?imageID="+rooms[findRoomName(key)].rebus_link+"&answer="+data1.answer, (res) =>{
                    res.setEncoding('utf8');
                    res.on('data', function (body) {
                        resolve(JSON.parse(body));
                    });
                });
        });
        rebusPromise.then(function(data){
            logger.silly(uname);
            console.log(data);
            if(data.percentage >= 80){
                io.to(key).emit("rebus_response", {
                    game: {
                        winner: {
                            username: users[key].username,
                            score: rooms[findRoomName(key)].scores.leader,
                            got_rebus: true
                        }
                    }
                });
            } else {
                io.to(key).emit("rebus_response", {
                    game: {
                        winner: {
                            username: users[key].username,
                            score: rooms[findRoomName(key)].scores.leader,
                            got_rebus: false
                        }
                    }
                });
            }
        });
    });
    socket.on("disconnect", function(){
        // console.log(users);
        kill_key(key);
        // console.log(key + " : + users[key].username");
        // console.log(users);
    })
})

//
// on connection--send msg to either refresh or do something




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
    // console.log(perm_cards);
    // for (var number in perm_cards) {
    //     if (perm_cards[number].question == cardText) {
    //         return perm_cards[number].answer;
    //     } else if (perm_cards[number].answer == cardText) {
    //         return perm_cards[number].question;
    //     }
    // }
    return cardText.toLowerCase();
}
