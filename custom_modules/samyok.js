module.exports = function(options){
    var output = {
        count: function (obj) {
            var count = -1; // the clean function
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    ++count;
            }
            return count;
        }
    };
    var winston = options.logger;
    winston.info("success: Samyok.js")
    return output;
}
