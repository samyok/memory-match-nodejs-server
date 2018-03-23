function place(){}
function lobby(type="public"){
    this.type = type;
    this.users = [];
    this.games = [];
    this.chats = [];
}
Array.prototype.clean = function(){
    for(var i=0; i<this.length; i++){
        if(this[i] == null){
            this.splice(i,1);
            i--
        }
    }
    return this;
}
module.exports = {
    users: new place(), // new constructor in case i want anything
    lobbies: new place(),
    addUser: function(key, username){
        this.users[key].username = username;
    },
    removeKey: function(key){
        delete this.users[key];
    },
    addLocation: function(key, location){
        this.users[key].location = location;
    },
    deleteLocation: function(location, newlocation=null){
        for(a in this.users){
            if(this.users[a].location == location){
                this.users[a].location = newlocation;
            }
        }
    },
    changeLocation: function(key, newLocation){
        this.users[key].location= newLocation;
    }
    changeRooms: function(key, firstroom=null, secondroom, io, socket){
        this.changeLocation(key, secondroom);
        socket.join(secondroom);
        if(firstroom==null){
            firstroom=key
        }
        socket.leave(firstroom);
        io.to(secondroom).emit("join", {username: this.users[key].username});
        io.to(firstroom).emit("leave", {username: this.users[key].username});
        var room = io.sockets.adapter.rooms[secondroom];
        var userlist = {};
        for(person_key in room){
            userlist[this.users[person_key].username] = true;
        }
        socket.to(key).emit("userlist", userlist);
    }
}
