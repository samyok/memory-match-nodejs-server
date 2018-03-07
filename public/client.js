$("body").append('<div id="snackbar">Loading...</div>');
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
var socket = io.connect('http://localhost:4000');
var username_modal = null;
socket.on("connected", function(data){
	if(data.connected){
		setTimeout(function(){
			$("#overlayLoading").fadeOut(750, function(){
				this.remove();
			});
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
		$("#overlayLoading .spinner").fadeOut(500, function(){this.remove()});
		$("#overlayLoading h2").html(data.reason);
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
			socket.emit("play", {type: single});
			this.remove();
		});
	$("<button class='doublePlayer w3-margin w3-button w3-green w3-hover'>Against someone</button>")
		.appendTo(room_modal.find(".body")).on("click", function(){
			$(".body button").each($(this).remove());
			$("<button class='join w3-margin w3-button w3-green w3-hover'>Join someone</button>")
				.appendTo(room_modal.find(".body")).on("click", function(){
					room_modal.find(".body button").each($(this).remove());
					$("<input type='text' id='roomJoiner' placeholder='Type the code here'>")
						.appendTo(room_modal.find(".body"));
					$("<button class='joinActual w3-margin w3-button w3-green w3-hover'>Join</button>")
						.appendTo(room_modal.find(".body")).on("click", function(){
							if($("#roomJoiner").val()!=""){
								socket.emit("join_room", {room: $("#roomJoiner").val()});
							} else {
								toast("red", "blank :/")
							}
						});
				});
		});
}
