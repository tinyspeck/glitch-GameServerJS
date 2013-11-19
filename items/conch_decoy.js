var label = "Conch";
var version = "1347643462";
var name_single = "Conch";
var name_plural = "";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["conch_decoy"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.event = "";	// defined by conch_decoy
}

var instancePropsDef = {
	event : ["event to fire"],
};

var instancePropsChoices = {
	event : [""],
};

var verbs = {};

verbs.pickup = { // defined by conch_decoy
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Pickup",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var val = this.getInstanceProp("event");

		if (val)
		{
		   var events = val.split(',');
		   for (var i=0; i<events.length; i++)
		   {
		       log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
		       this.container.events_broadcast(events[i]);
		   }
		}
		return true;
	}
};

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-50,"y":-94,"w":99,"h":98},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGnUlEQVR42u2XWUxUVxjHUaui4l43\nrFvdNabUpVoTE2uNRh+saUNaW02MSU1qalITl6ptb6qILDLAyCrLuOEyoKDIqjgisyEDzMBl7szc\nbeYusyIqiJpq+\/UcKj740iaM1Yf5kpOTmcm98zvf+j9hYSELWchCFrKgW7bJNFDF8+EA0O\/doSKg\nfxhB9KxaWZ7Cdz1dbUKg7wgb9I9WwwCCJAftRFAavz\/C9rB7ae\/v0Wr1gLcGptJowvGOwdI1ZEQ2\ny47cr7UNL6dhcBgKsZKme\/ZX6\/8z6JdtkodqACKw5+JMppHHW1pGx2u1wxN1lvEYGK8D6Hvswd4V\nBigN3igoyjH8x9F6\/ZBtVVXDDiCPHXe5RivM5snJFDW9QJKizrDsHIKmR2DgTLt9cq3bPZ8wGkeg\n54ZuRx5frdG894acBv2wF3ahUMY2NY0jmpoi40hyKgZLYMTZaTS9+Jworlb5\/VGEIESmcNzcFJ9v\nQpnZsLykumTjHr1+zC6SjHhjgEuyTQO3WSzDFMgrSQwzJd7hnJ\/KMEvwSmfZZbmS83O17NpUwlLf\nxnk8C5Ue4ZOadmkNxbaculSs2h1vEyKJ5uZR2JM7TdkDe6o+eN4j+m8oLx+MvXDe5VkQR9MLcyR+\nxS2v95u7PLvnbptlXzlD7dT6pUM6c+3tLFvLF+d9vnXO+x6V1WpoyKirXBvjdk8jJPoDgmHGb0eg\n23lNeNAqHIdlByqAg5I09rAoTr7IictJqzmmrfRSTVvRWTtVeNplvpxvbK4prTDfKuw2Whsu6Vq1\nBTxr8VXXXi1M9HqXpwjCsmSejzrOMLMO0p5xONw4n4NSNOikg3BBHLI6Jyk9rgXNtHWPQ63ytCT8\nCi0nfgOrMgaojDiwqVKeSfrKP+k27ROfaH3O06ZnLbZ7RuphQKHp8G09Ljs\/PirQMxXokLEUNXZ3\nTxsKQqh3o\/ASPD8qBr04x8Us4Rp0d1qTCCBTjoAtOxHoM0rgLmSCX1sJHsc9kLlmeNLphcePPPDg\nvvD8QYcU6OwONMtd\/gy2u3NHQ8ejLWpOnhutF4f0HRCFYJdaE7Hf1hR51OGYn8+Qa7g7FRyZ\/DvY\ncxXAXswCV8kZ8OurwOuoB7fTAg8CTgi4HfDscTs87X4Afi8DjjYDMLbGToY2C\/V2849FojgbHTq8\nz4A4kffbbMOPOa2TCImdk8eQnzmrr3diz7EXskAsPQ8BXQV4KSPIfDO0u+3gFVqhI8AD06aDBm0J\nGGuLoMlwHXQ1l6Cqpigxz6Kd+zPqn30HhLB+0aR60E8ovL84nTOO2GzL0nnma67+DutQpYLrqgp8\ntaXQwTT1wPklCnxiG\/B2PYKrA44ygNlYBg11V6DhbiFcL8utzLxbsR5XM87pPgNGAwxArWXIPvLe\nRMLOz4sR2KXZjH2zS3dLYAoyQb5ZBO5WLUhsIzgdyIMovA9ReNs9DgRZDwLTCKSp+q+yqxl\/FBUq\ndUnFp79CUNNxq0EVPHJ376zuKyAOx2HUnGN5fp7By37n1leDrK8EkdQCS+nBcq\/iRaPhWpexrvBR\nbdXprrpbp5\/ersh9UluZ96SsOL1dkR5z7cjVC1uPcNxHhzluGiHL7+M2E43meN\/yDwESWLGgEFdL\njijmvvi9r50ztkt2ENim5w3GG4EbpbnWswWpupziPFV++cWMbHXOubT8pNKTuQnFyaeOFSTlJSiz\nGg1f5vvklUdpeuZhNIkO1lNj8Vzuc6PuBVTep0c0WoyxDFX\/wnDncrepvsxUefPC9VPF+fExN4q3\noLm7SeEWVilleW2mwK9XyfLmLFHcGC8IS+Nc9MJ4WZ6bjkRDGoemCTps0KYIBsR5Eo+quEZb+UNd\nXenlwitZsVkVl7cozcZ1CgSQ7JeiUmV5ZZzLtVCJGrFCZBdlcMKqDJ5fkWalF8fIzBSCJycilTMV\nqxsCybQewRCUCfIScC8SCeieMb1asC09xnETVKK4qMApfYqk1ocJIjMbTYZZhN8\/MR5V5wmUY2kU\nOyfVap190mabkcL5JiDNGLEXybMN5fTgoKqZXkBcKLfd7iWNnZ2rcMEgj0aeDAQiD6JxtR\/JLgQw\nZo8oDjlgujky0WIZj7XgMWPrBKwDsYLZgN7xT0iDLVZRj8InxkP9itM5SdfVNR7DYtm1HfUwnOhY\nPm142S4INLMR4DACPUcY6RGEhscFFk70tVr\/bdT1LOKlXH9t4TvJq3zCn1+GEOfaTqQhid4b31uz\n15K9BxjvCPSt3ehCFrKQhey\/2d92\/7cu2M\/R\/QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/conch_decoy-1347643462.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {};

log.info("conch_decoy.js LOADED");

// generated ok 2012-09-14 10:24:22
