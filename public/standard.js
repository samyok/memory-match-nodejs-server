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
