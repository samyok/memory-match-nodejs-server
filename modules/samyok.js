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
    },
    /**
     * Finds a key with an element
     * @param {string} needle the needle in the haystack
     * @param {object} haystak the haystack the needle is in
     */
     findKey: function(needle, haystack){
        for(var a in haystack){
            if(haystack[a] == needle){
                return a;
            }
        }
    }
}
