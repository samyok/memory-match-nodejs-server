  var arr = [
{question: "Main character", answer: "Guy Montag"},
{question: "Montag's wife", answer: "Mildred"},
{question: "Last Person killed by Montag", answer: "Captain Beatty"},
{question: "A machine that tries to kill Montag", answer: "The Hound"},
{question: "The book Montag memorized", answer: "Book of Ecclesiastes"},
{question: "Poem that Montag reads", answer: "Dover Beach"},
{question: "Temperature at which paper burns", answer: "451 degrees Farenheit"},
{question: "Most important girl in the story", answer: "Clarisse McClellan"},
{question: "Author of Fahrenheit 451 ", answer: "Ray Bradbury"},
{question: "Number of walls in Mildred's \"family\"", answer: "3"},
{question: "Clarisse makes Montag question this feeling", answer: "Happiness"},
{question: "Mildred ___, so techies were called. ", answer: "Ate too many sleeping pills"},
{question: "Leader of so-called \"criminals\" ", answer: "Granger"},
{question: "Montag original thoughts on burning", answer: "Pleasing"},
{question: "Montag convinced Faber to help him by...", answer: "Ripping pages out of the Bible"},
{question: "The Hound's weapon", answer: "A procaine needle"},
{question: "Name of fireman that Montag reported", answer: "Black"},
{question: "A(n) ___ man is killed instead of Montag", answer: "Innocent"}
];
    const blah = [
{question: "Main character", answer: "Guy Montag"},
{question: "Montag's wife", answer: "Mildred"},
{question: "Last Person killed by Montag", answer: "Captain Beatty"},
{question: "A machine that tries to kill Montag", answer: "The Hound"},
{question: "The book Montag memorized", answer: "Book of Ecclesiastes"},
{question: "Poem that Montag reads", answer: "Dover Beach"},
{question: "Temperature at which paper burns", answer: "451 degrees Farenheit"},
{question: "Most important girl in the story", answer: "Clarisse McClellan"},
{question: "Author of Fahrenheit 451 ", answer: "Ray Bradbury"},
{question: "Number of walls in Mildred's \"family\"", answer: "3"},
{question: "Clarisse makes Montag question this feeling", answer: "Happiness"},
{question: "Mildred ___, so techies were called. ", answer: "Ate too many sleeping pills"},
{question: "Leader of so-called \"criminals\" ", answer: "Granger"},
{question: "Montag original thoughts on burning", answer: "Pleasing"},
{question: "Montag convinced Faber to help him by...", answer: "Ripping pages out of the Bible"},
{question: "The Hound's weapon", answer: "A procaine needle"},
{question: "Name of fireman that Montag reported", answer: "Black"},
{question: "A(n) ___ man is killed instead of Montag", answer: "Innocent"}
];
Array.prototype.clean = function(d) {for(var i=0;i<this.length;i++){if(this[i]==d){this.splice(i,1);i--;}}return this;};

var NUMBER_OF_CARDS = arr.length * 2; //MUST BE EVEN
var new_arr = rearrange();

function rearrange(){
var newArr= [];
	for(var i = 0; i < NUMBER_OF_CARDS/2; i++){
		item =Math.floor(Math.random() * arr.length)
		newArr.push(arr[item].question);
		newArr.push(arr[item].answer);
		delete arr[item];
		arr.clean(null);
	}
	return newArr;
}
super_arr = shuffle(new_arr);
function shuffle(arr){
	var TheArr = arr;
	var return_arr = [];
  var iterations  = TheArr.length;
	for(var i = 0; i < iterations; i++){
		var theNumber = Math.floor(Math.random()*(TheArr.length));
		return_arr.push(TheArr[theNumber]);
        delete TheArr[theNumber];
		TheArr.clean();
	}
	return return_arr;
}
console.log(super_arr);
for(var a in super_arr){
	if(super_arr.hasOwnProperty(a)){
		var newCard = $("#playingArea .ORIGINAL").clone().show().appendTo("#playingArea").removeClass("ORIGINAL");
	newCard.find(".number").html(parseInt(a)+1);
	newCard.find(".card-back pre").html(super_arr[a]);
    }
}

function findCP(cardText){
	for(var number in blah){
		if(blah[number].question==cardText){
			return blah[number].answer;
		} else if(blah[number].answer == cardText) {
			return blah[number].question;
		}
	}
}
function stopListeningClicks(card){
    card.off('click');
}


// cards.js
// used for controlling all aspects of the cards.

var $cardOne = ""; // global vars
var $cardTwo = "";
(function() {
	var cards = $("#playingArea .card"); // create array of all cards
	for ( var i  = 0, len = cards.length; i < len; i++ ) {
		var card = cards[i];
		listenForClicks( card ); // add listner to all cards by looping through
	}
})();

function listenForClicks(card) {
	card.on( "click", function() {
		var c = this.classList;
		var cardHtml = $(this).find("div pre").html();
		if($cardOne != "" && $cardTwo != ""){
		if( !$(this).hasClass("remove") ){
		   if(findCP($cardOne) == $cardTwo) {
			  $('#playingArea .flipped').addClass("remove");
				  $('#playingArea .flipped div pre').html("");
		   } else {
				  $('#playingArea .card').removeClass('flipped');
		   }
			 $cardOne = "";
			 $cardTwo = "";
		}
		}else if($cardOne ===""){
			c.add("flipped");
			$cardOne = cardHtml;
		} else if($cardTwo ==="" && $cardOne != cardHtml){
			c.add("flipped");
			$cardTwo = cardHtml;
		} else {
			//TO DO TOAST
		}
	});
}
