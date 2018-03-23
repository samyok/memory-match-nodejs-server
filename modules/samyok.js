module.exports = {
    /**
     * Counts the number of non-prototype things in an object. *Not recursive.*
     * @param {object} obj The object you want things to be counted out of
     * @return {integer} The number of things. 
     */
    count: function (obj) {
        var count = -1; // the clean function
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                ++count;
        }
        return count;
    }
}
