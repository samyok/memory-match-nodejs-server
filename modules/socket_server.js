var express = require("express");
var logger = require("./logger");
var socket = require("socket.io");

function randInt(low, high){
    return Math.round(Math.random() * (high-low +1) +low);
}


module.exports = {
    port: 4000,
    restart_code: randInt(10000000, 99999999),
    app: express(),
    init: function(){ // start sets up server
        var port = this.port;
        var server = this.app.listen(port, function() {
            logger.info("Started express server. Listening to port "+port+".");
        });
        this.app.get('/restart_code=' + this.restart_code, function(req, res, next) { // restart function
            logger.error("/restart HIT! RESTART NOOoOooOOOOO"); // log this "error" lol
            res.send('<h1>Server Restart</h1><script>setTimeout(function(){location.href="/"}, 1000)</script>'); // send html response
            process.exit(1); // stops nodejs script
        });
        logger.debug("Set restart code to "+this.restart_code+".");
        this.app.use(express.static("public"));
        this.server = server;
        this.io = socket(server);
        logger.info("Started socket.io server.");
    }
}
