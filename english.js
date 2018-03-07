// a mem match game for english class yay

// made by samyok nepal. (c) 2018.
// no part of this may be reproduced unless one or both of the following apply:
// either
//  the portion that is to be reproduced is from another source
//  or with written permission from the author.
const APP_NAME = "English Memory Match";
const startTime = Date();

const logger = require('./custom_modules/logger.js');
var samyok = require('./custom_modules/samyok.js')({"logger":logger});

var socket = require("socket.io");
var express = require("express");
var app = express(); // server STUFF

logger.silly("Imports done.");

var server= app.listen(4000,function(){
    logger.info("Started " + APP_NAME+"'s express server. Listening to port 4000.");
});
app.use(express.static("public"));
var io = socket(server);
logger.info("Started "+ APP_NAME+"'s socket server.");

// define vars and add .clean() functions.
var users = {};
users.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
}
  return this;
};
var rooms = {};
rooms.clean = function(a){for(var i=0;i<this.length;i++){
    if(this[i]==a){this.splice(i,1);i--}}return this;};
var lobbies = {};
lobbies.clean = function(a){for(var i=0;i<this.length;i++){
    if(this[i]==a){this.splice(i,1);i--}}return this;};

io.on("connection", (socket) =>{
    var key = socket.id;
    users[key]={};
    logger.info("+1 user! Key: "+key+" Total: "+samyok.count(users));
    users[key].logged_in = false;
    logger.silly(JSON.stringify(users));
    io.to(key).emit("connected", {connected: true}); // make sure that they are
    // connected and trigger login.
    socket.on("username", function(data){
        // check if username exists:
        var allow = true;
        for(var a in users){
            if(users[key].username == data.username){
                allow = false;
            }
        }
        if(allow){
            users[key].logged_in = true;
            users[key].username = data.username;
            logger.silly(JSON.stringify(users));
            logger.info("Login: "+users[key].username);
            io.to(key).emit("username_response", {message:"success", lobby:"main", username: users[key].username});
            logger.info("Move "+ users[key].username+ " to lobby 'main'.");
            if(lobbies.main != undefined){
                lobbies.main.push(key);
            } else {
                lobbies.main = [key];
            }
            logger.silly(JSON.stringify(lobbies));
        } else {
            io.to(key).emit("username_response", {message:'error', reason: "Your username is taken. Please pick another one."})
        }
    });
    socket.on("disconnect", function(){
        delete users[key];
        users.clean(null); // look for null and get rid of it.
        logger.info("-1 user. Key: "+key+" Total: "+samyok.count(users));
    });
});
