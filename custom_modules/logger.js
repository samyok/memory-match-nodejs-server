const startTime = Date();
'use strict';
const Winston = require('winston');
const logLevel = 'silly';

var logger;

(function createLogger() {

    logger = new(Winston.Logger)({
        transports: [
            new Winston.transports.File({
              filename: 'logs/english.js.'+'['+startTime.substr(4, startTime.length-19)+']'+'.log',
              level: 'silly'
            }),
            new Winston.transports.Console ({
                level: logLevel,
                colorize: true,
                timestamp: function () {
                    return (new Date()).toLocaleTimeString();
                },
                prettyPrint: true
            })
        ]
    });

    Winston.addColors({
        error: 'red bold underline',
        warn: 'yellow',
        info: 'cyan',
        debug: 'green',
        silly: 'blue strikethrough'
    });
})();

module.exports = logger;
