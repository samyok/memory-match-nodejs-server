/**
 * creates an announcement in server console.
 */
function announce(string){
    console.log("---------");
    console.log(string);
    console.log("---------");
}
/**
 * Shuffles the string
 * @param  {string} string The string that you want to shuffle
 * @return {string}       The shuffled string.
 */
function stringShuffle(string){
    var array = string.split();
    var randomID = -1;
    while(newArray.length != 36){
        randomID = Math.floor(Math.random() * (37-newArray.length));
        newArray.push(array[randomID]);
        array.splice(randomID, 1);
    }
    var newString  = newArray.toString().replace(/,/g, '');
    return newString;
}
function update(lobby, action="", user_key=null){
    var output = [];
    switch(action){
        case "users":
            for(var a in lobbies[lobby]){output.push(users[a]);}
            for(var a in lobbies[lobby]){io.to(lobbies[lobby][a]).emit("update", {"type": "users", "update": output});}
            break;
        case "join":
            lobbies[lobby].push(user_key);
            update(lobby, "users");
            break;
        case "leave":

    }
}
// get packages!
// yay!
var socket = require("socket.io");
var express = require("express");
var app = express();

// sets up users -- all active ones go in here
// custom module :D
var users = [];
var lobbies = [];
/*
 Example setup:
 var users = [
 %%KEY%%: {
 username: techguy2,
 profile: {STUFF FROM MYSQL}
 }
]
 */
var server = app.listen(4000, function(){
    announce("NodeJS server started!");
})
app.use(express.static("public"));

var io = socket(server);

io.on("connection", (socket) => {
    var key = socket.id;
    users[key] = null;
    console.log('+1 user. Total: '+users.length+'.');
    // add all sorts of socket.on("thing")s here.
    socket.on("disconnect", function(){
        console.log("-1 user. Total: "+users.length);
        delete users[key];
    });

});
