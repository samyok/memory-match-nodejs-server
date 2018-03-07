var http = require('http'); //Because
var arrayShuffle = require('array-shuffle'); //For the array shuffler
var formidable = require('formidable'); //For the HTML form (could probably be removed)
/**
 * Shuffles the string
 * @param  {string} string The string that you want to shuffle
 * @return {string}       The shuffled string.
 */
function stringShuffle(string){
    var array = string.split();
    var randomID = -1;
    while(newArray.length != 36){
        randomID = Math.floor(Math.random() * (37-newArray.length));
        newArray.push(array[randomID]);
        array.splice(randomID, 1);
    }
    var newString  = newArray.toString().replace(/,/g, '');
    return newString;
}



http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    //Shuffle Array
    const shuffled = arrayShuffle(['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R']);
    //Everything Else
    if (req.url == '/input') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
        var inputOne = fields.inputOne;
        var inputTwo = fields.inputTwo;
        res.write(shuffled[inputOne]);
        res.write(shuffled[inputTwo]);
        if (shuffled[inputOne] == shuffled[inputTwo]) {
        res.write('Match');
        }
        res.end();
        });

    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="input" method="post" enctype="multipart/form-data">');
        res.write('Input One:<br>');
        res.write('<input type="text" name="inputOne"><br>');
        res.write('Input Two:<br>');
        res.write('<input type="text" name="inputTwo"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        console.log(shuffled);
        return res.end();
    }

}).listen(8080);
