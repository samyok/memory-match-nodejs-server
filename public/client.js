$("body").append('<div id="snackbar">Loading...</div>');
var showlater= $("h1").hide();
/**
 * Does the toast function--creates a "toast".
 * @param  {String} [color="red"]     Decides the toast color. Note that the text color is still white.
 * @param  {String} [msg="Error! Please report this."] The message in the toast.
 * @param  {String} [elem="snackbar"] Which snackbar?
 * @return {void}
 */
function toast(color="red",msg="Error! Please report this.",elem="snackbar"){// creates the snackbar at top.
	var x=document.getElementById(elem); // get element
	x.className="show"; // add class show
	x.style.backgroundColor=color;  // set the color to whatever
	$("#"+elem).html(msg);  // set message
	setTimeout(function(){
    x.className=x.className.replace("show","");
  },3000); // remove class after 3 seconds.
}
var modal_default = {
  "close_button": {
    "show": true,
    "onclick": "$(this).parent().parent().parent().remove()"
  },
  "header": {
    "color": "teal",
    "text": "Modal header"
  },
  "body": {
    "input": {
      "show": true,
      "color": "white",
      "placeholder": "Your Name",
      "type": "text",
      "hover": {
        "exist": false,
        "color": "teal"
      }
    },
    "button": {
      "color": "teal",
      "show": true,
      "text": "Submit &gt;&gt;",
      "onclick": "$(this).parent().parent().parent().hide()",
      "hover": {
        "exist": false,
        "color": "teal"
      }
    },
    "color": "white",
    "helptext": "Please enter your name to continue: "
  },
  "footer": {
    "color": "teal",
    "show": true,
    "text": "This is a footer"
  }
};
var modal = {
  data: modal_default,
  create: function() {
    var newmodal = $("#original-modal").clone().appendTo("body").show();
    newmodal.find('header').addClass("w3-" + this.data.header.color);
    // do data.close_button.show
    if (this.data.close_button.show) {
      newmodal.find('span.x-out').show();
    } else {
      newmodal.find('span.x-out').hide();
    }
    newmodal.find('span.x-out').attr("onclick", this.data.close_button.onclick);
    newmodal.find('header h2').text(this.data.header.text);
    newmodal.find('div.body').addClass("w3-" + this.data.body.color);
    newmodal.find('div.body p').html(this.data.body.helptext);
    if (this.data.body.input.show) { // do input show
      newmodal.find('div.body input').show();
    } else {
      newmodal.find('div.body input').hide();
    }
    newmodal.find('div.body input')
      .attr("type", this.data.body.input.type)
      .addClass("w3-" + this.data.body.input.color)
      .attr('placeholder', this.data.body.input.placeholder);
    if (this.data.body.input.hover.exist) {
      newmodal.find('div.body input')
        .addClass("w3-hover-" + this.data.body.input.hover.color);
    }
    if (this.data.body.button.hover.exist) {
      newmodal.find('div.body button')
        .addClass("w3-hover-" + this.data.body.button.hover.color);
    }
    if (this.data.body.button.show) { // do input show
      newmodal.find('div.body button').show();
    } else {
      newmodal.find('div.body button').hide();
    }
    newmodal.find('div.body button')
      .html(this.data.body.button.text)
      .attr("onclick", this.data.body.button.onclick)
      .addClass("w3-" + this.data.body.button.color);
    newmodal.find("footer p").html(this.data.footer.text);
    if (this.data.footer.show) { // do input show
      newmodal.find('footer')
        .addClass("w3-" + this.data.footer.color)
        .show();
    } else {
      newmodal.find('footer').hide();
    }
    return newmodal;
  },
  reset: function() {
    this.data = modal_default;
  }
}
var LOGGER = {
	level : 5,
	setLevel : function(string){
		const levels = {  error: 0,   warn: 1,   info: 2,   verbose: 3,   debug: 4,   silly: 5 };
		if(levels[string]!== undefined){this.level = levels[string];}
		else {this.level = -1;}
	},
	error : function(error){if(this.level >= 0){console.error("ERROR" + error);}},
	warn : function(warn){if(this.level>=1){console.warn("Warning: "+warn)}},
	info : function(info){if(this.level>=2){console.log("INFO: "+info)}},
	verbose : function(verbose){if(this.level>=3){console.log("Verbose: "+verbose)}},
	debug : function(debug){if(this.level>=4){console.log("debug: "+debug)}},
	silly : function(silly){if(this.level>=5){console.log("silly: "+silly)}}
}
var username = null;
// connection
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
var socket = io.connect('/');
var username_modal = null;
var already_connected = false;
socket.on("connected", function(data){
	if(data.connected && !already_connected){
		already_connected = true;
		setTimeout(function(){
			var sessid = getCookie("PHPSESSID");
			socket.emit("user-sid", {sid: sessid});
			$("#overlayLoading").fadeOut(750, function(){});
			modal.data.header.color = "red";
			modal.data.header.text = "Welcome!";
			modal.data.body.color = "red";
			modal.data.body.helptext = "Type your name in to play!";
			modal.data.close_button.show = false;
			modal.data.body.input.color = "red";
			modal.data.body.input.hover.exist = true;
			modal.data.body.input.hover.color = "pale-red";
			modal.data.footer.color = "red";
			modal.data.footer.text = '&copy; 2018 Samyok Nepal';
			modal.data.body.button.color = "green";
			modal.data.body.button.onclick = null;
			username_modal = modal.create().hide().fadeIn(600);
			username_modal.find(".body button").on("click", function(){
				var val = username_modal.find("input").val();
				if(val!=""){socket.emit("username", {username: val});}
				else {toast("red", "try something that is not blank");}
			});
		}, 250);
	} else {
		$("#overlayLoading").fadeIn(500);
		$("#overlayLoading h2").html("Please refresh. Sorry. ;(");
	}
});
socket.on("username_response", function(data){
	if(data.message=="success"){
		toast("green", "Success!");
		username = data.username;
		username_modal.fadeOut(500, function(){this.remove();});
		changeRooms();
	}
	else{toast("red", data.reason);}
})
function changeRooms() {
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
			location.href="http://f451.samyok.us";
		});
	$("<button class='doublePlayer w3-margin w3-button w3-green w3-hover'>Against someone</button>")
		.appendTo(room_modal.find(".body")).on("click", function(){ doubleplayers(this, room_modal);});
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
	socket.emit('create_room', {type: "double"});
	$("#overlayLoading").fadeIn(750);
}
socket.on("console2", function(data){
	if(data.href != undefined){
		location.href=data.href;
	} else {
		console.log(data);
	}
});
socket.on("gameUpdate", function(data){
	console.log(data);
	location.reload();
});
socket.on("room_created", function(data){
	$("#placeType").text("Room Code");
	$("#placeName").text(data.room);
	$("#overlayLoading").fadeOut(750, function(){	$("h1").show();});

});
socket.on("player_joined", function(data){
	$("<span />").html(" &gt; &gt; Opponent: "+data.player).appendTo($("#placeType").parent());
	socket.emit("ready", {data:null});
	console.log("ready");
});
socket.on("game_start", function(data){
	$("#playingArea").show();
});
var join_modal = null;
function joiner_room(thing){
	var val = thing.find(".body input").val();
	console.log(val);
	socket.emit("join_room", {code: val, type:""});
	join_modal = thing;
}
socket.on("join_response", function(data){
	if(data.message == "error"){
		$("#overlayLoading").fadeOut(600, function(){join_modal.fadeIn(600);})
		toast("red", data.reason);
	} else {
		toast("green", "Success!");
		console.log(data);
		$(join_modal).fadeOut(600, function(){
			$("#placeType").html("Room Code");
			$("#placeName").html(data.code);
			$("<span />").html(" &gt; &gt; Opponent: "+data.player).appendTo($("#placeType").parent());
			socket.emit("ready", {data:null});
			$("h1").show();
			console.log("ready");
		}).hide();
	}
});
