// a setup of global variables and functions (like servers)
var express = require("express");
var logger = require("./logger");
var socket = require("socket.io");
const http = require('http')
var docServers = {
    docco: {
        path: 'docs',
        port: 8081
    },
    jsdoc:{
        path: "public/jsdocs/memnode/1.0.0",
        port: 8082
    },
    start: function(){
        var documentation = new express();
        var jsdocFiles = new express();
        // start documentation express servers
        var docco = this.docco;
        var jsdoc = this.jsdoc;
        var docsServer = documentation.listen(docco.port, function() {
            logger.info("Started docco server. Listening to port "+docco.port+".");
        });
        documentation.use(express.static(docco.path));

        var jsdocServer = jsdocFiles.listen(jsdoc.port, function() {
            logger.info("Started jsdoc server. Listening to port "+jsdoc.port+".");
        });
        jsdocFiles.use(express.static(jsdoc.path));
        var output = {
            jsdoc: jsdocServer,
            docco: docsServer
        };
        return output;
    }
}

var server = require("./socket_server");
var uc = requre("./user-control");

function validateSID(sid){
    http.get("localhost/api/username.php", (res) =>{
        res.setEncoding('utf8');
        res.on('data', function (body) {
            data = JSON.parse(body);
            if(data.logged_in){
                return data.username;
            } else {
                return null;
            }
        });
    });
}

module.exports = {
    "docServers": docServers,
    "server": server,
    "uc": uc
}
