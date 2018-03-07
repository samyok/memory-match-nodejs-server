// cards.js
// used for controlling all aspects of the cards.

var $cardOne = ""; // global vars
var $cardTwo = "";
(function() {
	var cards = document.querySelectorAll("#playingArea .card"); // create array of all cards
	for ( var i  = 0, len = cards.length; i < len; i++ ) {
		var card = cards[i];
		listenForClicks( card ); // add listner to all cards by looping through
	}

  function listenForClicks(card) {
  	card.addEventListener( "click", function() {
  		var c = this.classList;
  		var cardHtml = $(this).find("div pre").html();
  		if($cardOne != "" && $cardTwo != ""){
    		if( !$(this).hasClass("remove") ){
           if($cardOne.toLowerCase() === $cardTwo.toLowerCase()) {
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
})();
