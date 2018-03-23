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

const fs = require('fs');



// start main express/socket server

mm.docServers.start();
mm.server.init();

var io = mm.server.io;
io.on("connection", (socket)=>{
    var key = socket.id;
    io.to(key).emit("connected", {
        connected: true
    });
    io.on("user-sid", function(data){
        var username = mm.validateSID(data.sid);
        if(username == null){
            io.emit("user-sid-response",  {message: "error", reason:"Please log in."});
        } else {
            io.emit("user-sid-resonse", {message:"success"});
            mm.uc.addUser(key, username);
        }
    });
    io.on("join", function(data){
        mm.uc.changeRooms(key,  null, data.placeName, io, socket);
    });
})

//
// on connection--send msg to either refresh or do something
