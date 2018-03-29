
var socket = io.connect('/');
var already_connected = false;
socket.on("kill", function(){
	$("#overlayLoading").fadeIn(500);
	$("#overlayLoading h2").html("Please refresh.<br>You logged in from another location or you disconnected.");
})
socket.on("connected", function(data){
	console.log(data);
	console.log(already_connected);
	if(data.connected && !already_connected){
		already_connected = true;
		setTimeout(function(){
			var sessid = getCookie("PHPSESSID");
			socket.emit("user-sid", {sid: sessid});
			console.log("USER-SID");
		}, 250);
	} else {
		$("#playingArea").html("<br> <br> <h2>Please refresh. The server just restarted. Sorry!</h2>")
		$("#overlayLoading").fadeIn(500);
		$("#overlayLoading h2").html("Please refresh. Sorry. ;(");
	}
});
socket.on("user-sid-response", function(data){
	console.log(data);

	if(data.message == "error"){
		toast('red', data.reason);
	} else {
		username = data.username;
		$("#overlayLoading").fadeOut(500, function(){this.remove();});
		changeRooms();
	}
})
function changeRooms() {
	console.log("changeRooms");
	modal.reset();
	modal.data.header.color = "orange";
	modal.data.header.text = "Go to a Room!";
	modal.data.body.color = "orange";
	modal.data.body.helptext = "Do you want to play alone or against someone?";
	modal.data.close_button.show = false;
	modal.data.body.input.show = false
	modal.data.footer.color = "orange";
	modal.data.footer.text = 'Logged in as '+username;
	modal.data.body.button.show = false;
	room_modal = modal.create().hide().fadeIn(600);
	$("<button class='singlePlayer w3-button w3-green w3-hover'>Alone</button>")
		.appendTo(room_modal.find(".body")).on("click", function(){
			singlePlayer();
			$(room_modal).remove();
		});
	$("<button class='doublePlayer w3-margin w3-button w3-green w3-hover'>Against someone</button>")
		.appendTo(room_modal.find(".body")).on("click", function(){ doubleplayers(this, room_modal);});
}
function singlePlayer(){
	$("#scoreTo").hide();
	$("#personScoreplayer2").hide();
	console.log("ssss");
	socket.emit('create_room', {type: "single"});
	$("#overlayLoading").fadeIn(750);
}
function doubleplayers(thing1, room_modal){
	room_modal.fadeOut(400, function(){this.remove();})
	modal.reset();
	modal.data.header.color = "orange";
	modal.data.header.text = "Go to a Room!";
	modal.data.body.color = "orange";
	modal.data.body.helptext = "Do you want to create or join a game?";
	modal.data.close_button.show = false;
	modal.data.body.input.show = false
	modal.data.footer.color = "orange";
	modal.data.footer.text = 'Logged in as '+username;
	modal.data.body.button.show = false;
	room_modal = modal.create().hide().fadeIn(600);
	$("<button class='w3-button w3-green w3-hover'>Create</button>")
		.appendTo(room_modal.find(".body")).on("click", function(){
			create_room();
			room_modal.fadeOut(600, function(){
				this.remove()});
		});
	$("<button class='w3-margin w3-button w3-green w3-hover'>Join</button>")
		.appendTo(room_modal.find(".body"))
		.on("click", function(){ room_modal.fadeOut(600, function(){
			this.remove()}); join_room(this, room_modal);});
}
function join_room(button, oringinal_modal){
	modal.reset();
	modal.data.header.color = "orange";
	modal.data.header.text = "Go to a room!";
	modal.data.body.color = "orange";
	modal.data.body.helptext = "What room do you want to join?";
	modal.data.close_button.show = false;
	modal.data.body.input.show = true;
	modal.data.body.input.hover.color = "amber";
	modal.data.body.input.placeholder="room10213";
	modal.data.body.input.color = "orange";
	modal.data.footer.color = "orange";
	modal.data.footer.text = 'Logged in as '+username;
	modal.data.body.button.show = true;
	modal.data.body.button.text = "Enter room &gt;&gt;";
	new_modal = modal.create().hide().fadeIn(600);
	new_modal.find(".body button").on("click", function(){joiner_room(new_modal)});
}
function create_room(){
	// console.log("ssss");
	socket.emit('create_room', {type: "double"});
	$("#overlayLoading").fadeIn(750);
}
socket.on("console", function(data){
	if(data.href != undefined){
		location.href=data.href;
	} else {
		console.log(data);
	}
});
socket.on("room_created", function(data){
	console.log(data);
	$("#placeType").text("Room Code");
	$("#placeName").text(data.room);
	$("h1").show();
	$("#overlayLoading").fadeOut(750, function(){	$("h1").show();});
	if(data.type=="single"){
		$("#scoreTo").hide();
		$("#personScoreplayer2").hide();
	}
});
socket.on("player_joined", function(data){
	console.log(data);
	$("<span />").html(" &gt; &gt; Opponent: <img class='opponent' src='/profile_pics/"+data.player+"' > "+data.player).appendTo($("#placeType").parent());
	socket.emit("ready", {data:null});
	console.log("ready");
});
socket.on("game_start", function(data){
	$("#playingArea").show();
	if(data.first){
		toast("green", "You are first!");
	}
});
var join_modal = null;
function joiner_room(thing){
	var val = thing.find(".body input").val();
	console.log(val);
	socket.emit("join_room", {code: val, type:""});
	join_modal = thing;
}
socket.on("toast", function(data){
	toast(data.color, data.message);
});
socket.on("join_response", function(data){
	console.log(data);
	if(data.message == "error"){
		$("#overlayLoading").fadeOut(600, function(){join_modal.fadeIn(600);})
		toast("red", data.reason);
		if(data.reason=="Please log in."){
			location.href = "/index?login";
		}
	} else {
		toast("green", "Success!");
		console.log(data);
		$(join_modal).fadeOut(600, function(){
			$("#placeType").html("Room Code");
			$("#placeName").html(data.code);
			$("<span />").html(" &gt; &gt; Opponent: <img class='opponent' src='/profile_pics/"+data.player+"' > "+data.player).appendTo($("#placeType").parent());
			socket.emit("ready", {data:null});
			$("h1").show();
			console.log("ready");
		}).hide();
	}
});
socket.on("gameUpdate", function(data){
	if(data.type=="tie"){
		modal.reset();
		modal.data.header.color = "yellow";
		modal.data.header.text = "Neato!";
		modal.data.body.color = "yellow";
		modal.data.body.helptext = "You tied "+data.game.winner.score + " to " + data.game.loser.score+"!";
		modal.data.close_button.show = false;
		modal.data.body.input.show = false;
		modal.data.footer.color = "yellow";
		modal.data.footer.text = 'Logged in as '+username;
		modal.data.body.button.show = true;
		modal.data.body.button.text = "Continue &gt;&gt;";
		new_modal = modal.create().hide().fadeIn(600);
		new_modal.find(".body button").on("click", function(){location.reload();});
	} else {
		if(data.game.winner.username == username){
			var reason = "";
			switch(data.type){
				case "abandon":
					reason = "The opponent abandoned the game scared of your card tricks. LOL!";
					break;
				case "force":
					reason = "The opponent logged in from another location and cannot continire this. ;("
					break;
				default:
					reason = "";
			}
			modal.reset();
			modal.data.header.color = "green";
			modal.data.header.text = "Congrats!";
			modal.data.body.color = "green";
			modal.data.body.helptext = "You won "+data.game.winner.score + " to " + data.game.loser.score+"! "+reason;
			modal.data.close_button.show = false;
			modal.data.body.input.show = false;
			modal.data.footer.color = "green";
			modal.data.footer.text = 'Logged in as '+username;
			modal.data.body.button.show = true;
			modal.data.body.button.text = "Continue &gt;&gt;";
			new_modal = modal.create().hide().fadeIn(600);
			new_modal.find(".body button").on("click", function(){location.reload();});
		} else if(data.game.loser.username == username){
			var reason = "";
			switch(data.type){
				case "abandon":
					reason = "You abandoned the game scared of your card tricks. LOL!";
					break;
				case "force":
					reason = "You logged in from another location and cannot continire this. ;("
					break;
				default:
					reason = "";
			}
			modal.reset();
			modal.data.header.color = "red";
			modal.data.header.text = "Wow.";
			modal.data.body.color = "red";
			modal.data.body.helptext = "You lost "+data.game.winner.score + " to " + data.game.loser.score+"! "+reason;
			modal.data.close_button.show = false;
			modal.data.body.input.show = false;
			modal.data.footer.color = "red";
			modal.data.footer.text = 'Logged in as '+username;
			modal.data.body.button.show = true;
			modal.data.body.button.text = "Continue &gt;&gt;";
			new_modal = modal.create().hide().fadeIn(600);
			new_modal.find(".body button").on("click", function(){location.reload();});
		}
	}
});
socket.on("rebus_time", function(data1){
	modal.reset();
		modal.data.header.color = "orange";
		modal.data.header.text = "Rebus Time!";
		modal.data.body.color = "orange";
		modal.data.body.helptext = "What does the rebus say?";
		modal.data.close_button.show = false;
		modal.data.body.input.show = true;
		modal.data.body.input.hover.color = "amber";
		modal.data.body.input.placeholder="Type your answer here.";
		modal.data.body.input.color = "orange";
		modal.data.footer.color = "orange";
		modal.data.footer.text = 'Logged in as '+username;
		modal.data.body.button.show = true;
		modal.data.body.button.text = "Submit Score &gt; &gt;";
		rebus_modal = modal.create().hide().fadeIn(600);
		$("<img />").attr("src", "//memory.samyok.us/rebus?imageID="+data1.rebus_link).prependTo(rebus_modal.find(".body"));
		rebus_modal.find(".body button").click(function(){
            var value = rebus_modal.find("input").val();
			socket.emit("rebus_answer", {answer: value});
		});
});
socket.on("rebus_response", function(data){
	console.log(data);
	if(data.game.winner.username == username){
		if(data.game.winner.got_rebus){
			var rebus = ", and you got the rebus!";
		} else {
			var rebus = "! Unfortunately, you got the rebus wrong."
		}
		modal.reset();
		modal.data.header.color = "green";
		modal.data.header.text = "Congrats!";
		modal.data.body.color = "green";
		modal.data.body.helptext = "You finished the game with "+data.game.winner.score + " points"+rebus;
		modal.data.close_button.show = false;
		modal.data.body.input.show = false;
		modal.data.footer.color = "green";
		modal.data.footer.text = 'Logged in as '+username;
		modal.data.body.button.show = true;
		modal.data.body.button.text = "Continue &gt;&gt;";
		new_modal = modal.create().hide().fadeIn(600);
		new_modal.find(".body button").on("click", function(){location.reload();});
	}
});
