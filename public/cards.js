for (var a = 0; a < 36; a++) {
    var newCard = $("#playingArea .ORIGINAL").clone().attr("number", a).show().appendTo("#playingArea").removeClass("ORIGINAL");
    newCard.find(".number").html(parseInt(a) + 1);
}
$("#playingArea").hide();
$(".card").on("click", function() {
	var num = $(this).parent().attr("number");
	console.log(num);
    if(num>= 0){
        socket.emit("click_card", {
            number: num
        });
    }
});

socket.on("flip_card", function(data){
	console.log(data);
	$(".card-wrapper[number='"+data.number+"']").find(".card").toggleClass("flipped").find("pre").html(data.text);
});
socket.on("remove_card", function(data){
    console.log("remove");
    console.log(data);
	$(".card-wrapper[number='"+data.number+"']").attr("number", -1).find(".card").addClass("remove");
});
socket.on("message", function(data){
	toast(data.color, data.message);
});
socket.on("gameInfo", function(data){
    switch(data.type){
        case "notif":
            switch(data.message){
                case "opponent_abandoned":
                    location.reload();
                    break;
                case "score":
                    $('#personScore'+data.person).html(data.score);
                default:
                    toast("red", data.message);
            }
        default:
            console.log(data);
    }
});
