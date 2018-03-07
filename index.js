function announcement(string){
    console.log("-----");
    console.log(string);
    console.log("-----");
}

var socket = require("socket.io");
var express = require("express");
var app = express();

var users =[];

var server= app.listen(4000,function(){
    console.log("App Started");
});
app.use(express.static("public"));

var io = socket(server);
var countUsers=0;
io.on("connection", (socket) =>{
    countUsers++;
    console.log(countUsers);
    var key = socket.id;
    users[key] = null;
    announcement("New User!: Total: "+countUsers+".");
    socket.on("username", function(data){
        var allow = true;
        for(j in users){
            if(users[j] == data.username){
                allow=false;
            }
        }
        if(users[key] == null){
            if(allow){
                users[key] = data.username;
                console.log(users);
                io.to(key).emit("success", {
                    type: "username"
                });
            }else {
                io.to(key).emit("error", {
                    type: "username",
                    reason: "Your username already matches someone else's."
                });
            }

        } else {
            io.to(key).emit("error", {
                type: "username",
                reason: "Your username was already changed. "
            });
        }
    });
    socket.on("message", function(data){
        console.log(data.value);
        io.emit("message", {
            value: data.value,
            sender: users[key]
        });
    });
    socket.on("private", function(data){
        var allow = false;
        var reciever = null;
        for(j in users){
            if(users[j] == data.to){
                allow=true;
                reciever = j;
            }
        }
        io.to(reciever).emit("private", {message: data.message, sender: users[key]});
    });
    socket.on("disconnect", function(){
        countUsers--;
        announcement(users[key]+" disconnected. Total Users Now: "+countUsers+".")
        delete users[key];
        console.log(users);
    })

});
