//#include include/events.js, include/takeable.js

var label = "Game";
var version = "1352852331";
var name_single = "Game";
var name_plural = "Games";
var article = "a";
var description = "This is a tiny box containing a whole imaginary world, created in the minds of 11 Giants. At the bottom, there's a tagline: \"Do stuff. In a game.\" it says. Wow. That's a terrible tag line. Game looks pretty awesome, though.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["game_box", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by game_box
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.player) { 
			return {state:'disabled', reason:"You're in the middle of playing this Game!"};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_takeable_give(pc, msg, suppress_activity);
	}
};

verbs.drop = { // defined by game_box
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.player) { 
			return {state:'disabled', reason:"You can't drop this while you are playing it!"};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.parent_verb_takeable_drop(pc, msg, suppress_activity);
	}
};

verbs.play = { // defined by game_box
	"name"				: "play",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Play the Game",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_playing_game) { 
			return {state:"disabled", reason: "You're already playing!"};
		}

		if (this.player) { 
			return {state: "disabled", reason: "Somebody else is playing this Game."};
		}

		return {state:"enabled"};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var context = {'class_id':this.class_tsid, 'verb':'play'};

		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			swf_url: overlay_key_to_url('play_glitch'),
			duration: 24500,
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 0,
			delta_y: -140,
			width: 110,
			height: 110,
			uid: pc.tsid+'_play_glitch'
		});

		pc.is_playing_game = true;
		this.player = pc;

		this.events_add({callback: 'onFinishPlayGame', pc: pc}, 24.5);


		return failed ? false : true;
	}
};

function parent_verb_takeable_give(pc, msg, suppress_activity){
	return this.takeable_give(pc, msg);
};

function parent_verb_takeable_give_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function onFinishPlayGame(details){ // defined by game_box
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];


	var context = {'class_id':this.class_tsid, 'verb':'play'};
		
	var xp = this.player.stats_add_xp(250, false, context);
		
	self_msgs.push("Woah! How much fun was that!?!!");
		
	self_effects.push({
		"type"	: "xp_give",
		"value"	: xp
	});
		
	var pre_msg = this.buildVerbMessage(1, 'play', 'played', false, self_msgs, self_effects, they_effects);
	this.player.sendActivity(pre_msg);

	delete this.player.is_playing_game;
		
	this.apiDelete();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_discovery_dialog",
	"collectible",
	"swf",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-50,"w":37,"h":51},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK1ElEQVR42sXY+VNUVxoG4PwH\/jpV\nceJMajKTMSaacWERRRZjQIOyi+z72gp0s4uNssjWCMiObAoiIoKsbtgoNCigqLjgirspjYIRaBXw\nne+cpjuNE6tyZyYzVL11obuKfu773XPuhU8+EfAFYN709HTZ9NSUfGpqqp6+l9LRFZOThvTenE\/+\nX1\/04a6vXr2Sv3\/\/Hu+np0FATE9OYorl3TtMvX2LyTdvKEq8nZiQU+onlePSd2NjrpNKpSGUynm\/\nB2oOg1FLw2rYG6USbyYmoKQ8+\/FHjPz0E549fcoz\/vPPGH\/1ijKKt+PjeDs2hjevX1N+xht6T0nv\nTYyODoyPvpQrR0akEyMjW+hoqHz5Ujh+\/PXrMsKMvKVWNI1NfdDYTGvvCP2OwO8mxjlsbHQU1wcH\nMXzrJkaePeMwJaEnRkdAKEy8fInxly8w\/uInjNEJPrh5EylZhfCPSjL8zcCnDx9CO89ZW8+f4yk1\ndf\/RIzyi4ySDKSc4TtPY2GtVazONPX\/8CE\/u38OTe\/fwjH7PiyeP8eLxYw57\/vABsnMLsGajD1Za\neWGFpbdw4JMHD3ge37+PR\/QhLA+Hh\/Hw7l0MXb+OS1cG0XK6A4rz\/TjZ04O+S5dwj0CsMSU1yRsb\nUTdGIdjoj0\/R1nYUdj7BHKbOCkv33w7UhqlxHEZ5QLj7d+7w3Lt9m2f41i0M06h6+\/vRKj+FzMpK\n1LS1Ir\/2IPbUH0bjqXacpZO4fOki4nflwtDORwvniZWWnsKAatj+2iMwcwyCobU3nEUxHHf4SBt\/\nTQOj3CXc3Rs3cIdye2gIt6ndW5Sb167xtJ85g4rDh2HsGzSrNQZTxUMYkDU2cOEihxVX1OB8\/wVN\nazFJWXAOivkFRmlpO6mCUW5p465exQ3K0JUrGKKFY+QeMKs1VXOE2yAQyEaZlFkE37D4fxmntZcY\nvpIdHMYau0ModiK\/BivbdxBpu\/fwVX398mUC+s+GqXEb3IUB2SgZLrOgQoNTj9PKUwynoGgkyPLh\nI9mO\/JIqDuxR9HAcg91gjVGsPEPhHRqHa4S7RgtIBfwAps4PAoAMxYC78stxj1BXLw+io6OLt+ZD\n7clyS\/k4e7rP4mBdEweWVdbOGmdXpwJehNscvRNXCXf14kWsIqAKpoVb7wYDymJTn99+q2SNMRy7\n3vrO9XEAS3RiJm+wouoQmluPIz2nBE3Nx\/h7rLXSmZHmFO1FQ2MrInbIkJpdjCuEuzIwgFVu\/low\ndw6z95HAbXMMBN1J2Cj7evs5ppUWALvW4mmkza0neGMyBms5hh1peWhsOgpvcRy\/zhiUwRqOtGJ\/\nTT2+3xSI3p6zGCTc4IULBPSb1RrDbU3MgIGFqzCgenXW1jfDKTBaE7YILp6\/QKDtaKTmGOxIUxs\/\nMphjQJRmnF6hUoRvT0dKZiHq6ptw+fx5DjSYwRmsd0VFZQ2PhXOgMOCdj+1pM6uzoLSMrrFuGmkN\nus508ebUjWUXVvDWisur+c8syYS8RJv4994ijmOtJcpykZFTzI\/Lf3ARBpy1p81sttqrs\/3Ufmqy\nR7M61a1VHaijG38Risv2Q36qA5v8I1FUWoVtO7Nxsa8PHuHbCLWHp6m5DYnpufCXxBHQWRjwo5st\nhV1rlTVRiE1dhpMnKzlMvQjYdaboOsrHeYlykVrr7uwiYBYGenvhERYLN1HULFhieg6WrxMI1Ibd\n0IKxzZa1tu9AJELi\/kR3kEIVjNLbc4ZWfCdiU5ZCcaaV41hrDHaB5dw5DmTjVMNMbTwRkyCD\/jon\nYcAbH9yiGI7B6ury+TgzC+05MD5jFbqpMYYTx6ymseVhKwF7uzswoMYR7DzL2bNwl8RynBpYTgvE\n1isEJtYewoBDv9Ja\/zkFbNz+QNdZGvZWR3BgRMJ8utYOITsvFIESPWTk2\/LXy6vCeGtqWD8LPY65\nS7bycS6nxkyovXWOASjfd0A4UBvGFkFnowyHMr9DWIQuR0qkizmEpWJ\/ODxF3yAoYpHmtbJKCVpb\nqtHSXM1hfSzd3XDdHMlxCdTeyRPtaGpqha1nMPTNNwkDaq\/O\/tP0PJdjzpMTrw8H309pj5urwQRG\nfwbnwLkICP+b5rVtyWsQINZDssyLw3pZFAo4B4QjJCYRClo4MfHphNuC\/OIK6AkFqrcNtjrPd7bi\naG0kOloCsDNvMUTSv8DJ71M4+qriF\/lnxOYsQEzmfIQnf8GBoshFBNTFyWMNHHaOpasLzv5h0F\/r\nSKP1hyth2XhdAsJgbOUmDKjZNij1bclIKtVDQd1aRGUtgKvojxoci3PAXGwvXqRJ5K6vEJb6JSRb\nTVU4gp1l6eyEs5+EjzMhbTfWbvLjOFl2IfTMHIQB1ffOU90K1LaLkFyuyz9cWrgQ4uQvIYr7Ap6h\n87A5\/q+IzPoKMTlfQ5zyd3iK53G0f\/TnSCzRQ11zOof1sNBTtbOvGLYeWwiYzWGNdA3qmW3kEQS8\nzHBtTfDOroJF8kGk1h1G7YlYxBUsJdACRGQuQDg1FZ4xE9aabD48QubByX8u3Ld8hriihfykjh3f\nj27CdZ8+jUhpMgZof6yprUf0jlS40MjjU7NhtEHgra5UJkJi4AZIQ91gJ6uBWVw51ksLEZ6\/G3kH\nYpBTaQVZqTlkJeZIKjCGOHU+xGnzCakCs5NgrabvXYXm0xlQEE7R0QFHn1A+TtaYsaUryvZWI6+o\nHD7B0QOCgHsTzRDpaoJwRyMkZiXCJCIXq0IysCIoGfp+O+C+IxmppdmULKSWZPFjQfUuJBdZcCyD\nJhQa4Ii8AKujC5FR2YQuuZyAIVjr4APd7zdS7JGeXcCju8ZWLggYaL8SkU7GENkYICHUBobB6TAI\nTISetxTL3KOx1DUCS1zCsNhJTAlVxVmCld5RECUHo7MnBYreUqyRpMFInImNSSVoP3kCm7xDeGMM\nx2K03hnxKVnQEQqMcDbGFrsV8LbQQVS0PwwCEqHrtQ1L3SKxhCD\/cAz5aBh2iUs4PxF93+1YIUpB\nVX8jUhr2wMotkI81PauAw9hmbW7vCZ3VNsKAMS4mCLRajtAQ+tshaCd0vVU41hiHbArGt+o4bFGF\nvmevq6GsYYYMz8tBVk8DTEOCsdzKGTauQRzHYu0aCJ3vbIUDJQ6r4GOhi+D4bbyFZe5RfISzcGrY\nxs2qaENnkB7bE9F8pRGZfS0wi5BguaUTjdOOjVQF47GBjqlAIBuv57plyMqV0mhj+cg0uBnIIkLx\n2ItUmflZG5lZtwd5l48jSX6IN6hv6TgbtlqVpabWwoBscbibL0WYpxkcIqWa9vIPFmDsZSPOnSvm\nqIUsdkE8aqi6TXYyHbdbOTBN0QDr+FgY2rmpYDO4ZauteQQDAy2Xy93MF484mC6Cr4MpnEJU7Z1W\nlPCHhtYiSxQfzIW+SzAW2gaqokZqtVjRXsmBLKHVhbDwF83AfsEtM7Vikf5b\/2W1NV08x9boW0M\/\nu1VSa\/HW+iO1McPqJxv5AU+cqd8MWfFOfGMToEJ+ALShJ+h9nTVoGGpD8eAxWPiJtGDUnInlyBJT\ny\/X\/1X8Nnyg0ndOYZ2bYlGsubdxtVt8vTxj4GJCvZro8jAO2wTclEyb2XhzGWltqailfbGr7v\/nH\n++e2PnO+thUZLrILkq7wFMsrD+0ayEl1QMEuN+yrlUHHYytt9EnQpT\/a\/6OR\/h5Nn6jYKNXxjq1f\nIdo5omflNbzMyHKhkN\/zT0VFYmNYVlKDAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-09\/game_box-1316567440.swf",
	admin_props	: false,
	obey_physics	: true,
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
	"no_discovery_dialog",
	"collectible",
	"swf",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"y"	: "play"
};

log.info("game_box.js LOADED");

// generated ok 2012-11-13 16:18:51 by martlume
