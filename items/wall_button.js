var label = "Wall Button";
var version = "1347576691";
var name_single = "Wall Button";
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
var parent_classes = ["wall_button", "wall_switch"];
var has_instance_props = true;

var classProps = {
	"state_down"	: "in",	// defined by wall_switch (overridden by wall_button)
	"state_up"	: "out",	// defined by wall_switch (overridden by wall_button)
	"state_down_static"	: "lockIn",	// defined by wall_switch (overridden by wall_button)
	"state_up_static"	: "lockOut"	// defined by wall_switch (overridden by wall_button)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.switch_mode = "resetting";	// defined by wall_switch (overridden by wall_button)
	this.instanceProps.reset_timer = "1000";	// defined by wall_switch
	this.instanceProps.on_press_down = "";	// defined by wall_switch
	this.instanceProps.on_press_up = "";	// defined by wall_switch
	this.instanceProps.on_reset = "";	// defined by wall_switch
	this.instanceProps.distance = "1000";	// defined by wall_switch
}

var instancePropsDef = {
	switch_mode : ["Whether the switch is toggled by the player, or automatically resets itself"],
	reset_timer : ["Time after switch switch automatically flips back (in ms)"],
	on_press_down : ["Event(s) to fire when switch is pressed down"],
	on_press_up : ["Event(s) to fire when switch is pressed up (toggle mode only)"],
	on_reset : ["Event(s) to fire when switch resets"],
	distance : ["If outside of range then won't fire"],
};

var instancePropsChoices = {
	switch_mode : ["toggle","resetting","custom"],
	reset_timer : [""],
	on_press_down : [""],
	on_press_up : [""],
	on_reset : [""],
	distance : [""],
};

var verbs = {};

verbs.press = { // defined by wall_switch
	"name"				: "press",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.class_tsid != "esquibeth_button") {
			return "Press";
		}

		return "";
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"handler"			: function(pc, msg, suppress_activity){

		var mode = this.getInstanceProp('switch_mode');
		var is_pressed = !!this.is_pressed;

		//added for distance check
		var dis = this.getInstanceProp("distance");
		var xs = 0;
		var ys = 0;
		xs = pc.x - this.x;
		xs = xs * xs;
		ys = pc.y - this.y;
		ys = ys * ys;

		if((Math.sqrt(xs+ys) <= dis) || dis == "null" || dis == "" || dis == "none" || dis == null) // if within range, activate verb
		{
		     if (mode == 'toggle'){
			   if (is_pressed){
				this.setState(false);
				this.onEvent('on_press_up', pc);
			   }else{
				this.setState(true);
				this.onEvent('on_press_down', pc);
			   }
		     }

		     if (mode == 'resetting'){
			 this.setState(true);
			 this.onEvent('on_press_down', pc);
			 this.apiCancelTimer('onTimer');
			 this.apiSetTimer('onTimer', intval(this.getInstanceProp('reset_timer')), pc);
		     }

		     if (mode == 'custom')
		     {
			 this.onEvent('on_press_down', pc);
		     }
		}

		return true;
	}
};

function onCreate(){ // defined by wall_switch
	this.initInstanceProps();
	this.is_pressed = true;
	this.setState(true);
}

function onEvent(event, pc){ // defined by wall_switch
	var val = this.getInstanceProp(event);
	if (val){
		var events = val.split(',');
	        for (var i=0; i<events.length; i++){
			this.broadcastLocationEvents(events[i], {target_pc: pc});
		}
	}
}

function onTimer(pc){ // defined by wall_switch
	this.setState(false);
	this.onEvent('on_reset', pc);
}

function setState(new_state){ // defined by wall_switch
	var old_state = !!this.is_pressed;
	this.is_pressed = !!new_state;

	if (old_state == new_state) return;

	// animate the switch thing!
	this.setAndBroadcastState(this.getClassProp(new_state ? 'state_down' : 'state_up'));
	this.apiCancelTimer('setAndBroadcastState');
	this.apiSetTimer('setAndBroadcastState', 500, this.getClassProp(new_state ? 'state_down_static' : 'state_up_static'));
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
		'position': {"x":-19,"y":-35,"w":36,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIAUlEQVR42r2Y20\/cxxXHLWTJwpEJ\nEopwLEq8rFnui7kZc2e5X5b73YAxBQPFBDCJRaNYtmJFaqKodV3Fbh+StJWqPLhy1Uq9SInkxJaq\nVnlJ+1A\/5IWkfbD8VPUvOD2f6cxqvKyxgdQrfcWyv\/md+c73XObMHDiwh4+IJHs4qD+BFMWxsrKy\nYDQazTx69OhL+v+hA8\/ro0RSFBmKkEWm4iXFC4ok+zctDubZ8yCX5hELKFL954FA4JVgMNgXCoWu\nJgLPGOPZSrXK75sYyhxTpOPOeFKWwJZCcnJyJD8\/PyHy8vKEMXbsVUf22yCYHr\/SrKysF7Ozs687\nUuFwWDTu5NSpUzuivLxciouLJTc315G96pklVncVCknHjx9PnZ2d\/Y5NAPNRo8WoADEm8wmcPn1a\nmpubpbu7W0bHxuRH16\/L2vq6dHR0SGtrq9TV1cXGlpaWGqK60H8PDg7W2DhNJ8meJbFwZXBlZaXo\n0aNH6R65GQziLtRwkzU1Ncnw8LDMzMzE0NnVJQNDwzI6PiETExOx38eUOGRZTE1NjVEfNTXrL5FQ\nlmRIkboTOQYEfeVsAkhhYaFUVFQYYigyNDQk09PT2zAyMiLRnh5RdRI+P3PmjFmYcz22L1++3EsC\n6XQZlkN6IoLuYZrvVpQj2J1qkEOZqampGDQcZGlpSS5evLgNa2trsrCwYMj57\/T39xtbJ0+exOX\/\ngeTDhw+pnwFFueLlROplxiWEcSvKVVZWSktLi0xOTsZw7tw5QwJyfX190tbWtg0ozfPNzU1ZXl42\n5Nz74+PjxibuLioqekApu337NiSrFaWJ1IsFqZL7jIQgSyFXVVUlo6OjRj2AKqjT3t5unrMIkice\nPAMNDQ2yuLgoGxsbcvbs2Zgd0KVxixCq6C+UZDAjIyNbKdQ6Lgfj\/W5rnFmZm6BH44oVg7m5OQOC\nnTjK17HVoWwZLS2WyfKSxxDJz5M8fc44EgSlL126ZIg5e6Czs9PE482bNyP37t17jKDLnoO+aykF\njlwkEjFZCIil8+fPG0VNuVFiC1UV8lp9tbzd2ig\/7GyRG92tBu91NstbLQ2yUlMptbk5UlBQYN4j\nqwkNZ9MBL+gi7uBqjftTjmCmH3tKbo2VELyO4MDAgMlOjBBHtbW1UlJSIg15ObKhxH48EJWPF2bl\nd6+tPoZfrSzKh+cm5d1ou1xT8ox3XlldXTULxa6DU\/Hu3btlt27dCsc86tceV4x99ah1gLijlrHS\ngqyAvNHcIH9a+558c+0N+XrzVdlanXsc6+fl6zc35J\/vviV\/1HHvqLoFgeNmcSQQrsa9zj7AcyrI\nJir6BJO93cLUPOIF9NiaRoIQ3MSd1kaZrSyTv11+XbZeX95OLBG+vyp\/v7KpileJ7lQm+VgwsYx9\nB7sz3UlI0LmXFbqKj3sBxtjOMExC\/H55Xr7Sib9amX126GLuLM5KXe7\/RCB7qQRuDsCcruT4BF38\n\/TzkZRylgYIKKBEUVtz\/g\/6oPLi4KP9Yntk1HmyuykZTvfFCdXW1XLhwwSjn5iGE4PAkgp\/x0LkX\nxXp7e40B3FtfXy+6tchf1hfly6XpPeM3c1OS9UqmqQLz8\/MmfJgHULjjCR7biSAxiAGCGUXHTlfI\nF4tn5YuFqT3j86UZCQezcKUpOew2zAOYM55gWjxBahVgl9Buw5QACKLgeqRO\/jx3Zt+oLSwwdZHm\ngeLNPIBGIp5gypMIIjeBzAohSAzeGuiSz787vm+0hQuNgniHksM8gBqrxP\/lE0z2CJpumToHQWog\nxRPpaQwg+NPBqHwyM7ZvtBUXmeaV+G5sbDTzAObWJP00nmCSa0whSCmBIDFHVwwIZlx8c6hH\/jA9\nsm+0nQybkoJtfx7KjxJ9W1uv\/ANx5wJ3GDLbEQSR27VNtEm09Nd6OuS3k0P7xokTJ2LHAQgyh4s\/\nGob79++XJmyr1c1fst24OMQIID7IuLnWJvn1xOC+cKUtYrzkOmtc7LZQ7QH+yvFWm4mChASdm4kP\nCilxSLIAsnm4r1c+Gu6Vj8f694z2shITLpCknEEUsAlodz5mD1KBJ56cnIoQxAXOgDskzUe75Jcj\nvXvCcmOtIYVaiOCSke9OPaXwwpPOJf4R08SiU9GBeMHdrw70yQeaMLvBRksk1nljm+8oSbK4cwlX\nLFa9lB3Pn76rUZE4ccCgaWK7OuSdvk752WD3UzFaW2Vs4UYy1akHQX5zLZYeeQM7utcd3uPLDiQx\n5oCbaCogO9PaLFe62+T9\/q5teLOjWbqqKs2ugS3+0gyjHu9yYnTt1dbWVu6RI0dyn6qeX3o4F3ME\nwDAGIQooQTS0KMGOgNtYCK2acyFwdzPENMpBjsxlLMrZg5K5MdP3QvYA90yf2B0fMakTfINBCEEO\nQBiSTMbEEA3b0xz\/Qw6FIAZZ3rWlxI+5kD20p1vXPvM9TbJ\/kOciScm8hxpM7MoQ8LOyQ7erfm08\n19fXDSnIoKpTl3dxKecO69ZU21EF9nLpGfAO9FzHJenBOoetiA0dRXE9E7tLpMZIk0R7+2RoZDR2\nWYSCjKWMeKoFtcdMs1ctx3Z7w+V3OiHv3Jxk1TyEWzTj2rU2\/oSJ7bVa7K6QmMONbPwsiO3LxdqN\nGzeyDx8+zFbWuNNl0W5IBj2SKdbtB72LzuSnQV2eat+vVLQoahQvfpu3wcmWmCPngjpth9g5ZJON\ncfn2UihsQ+a5XLIfsvETikPAlosM+9wtLPW53v7\/vz\/\/Bfi4QtZoUFXJAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/wall_button-1335897544.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by wall_switch
	"id"				: "press",
	"label"				: "press",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.class_tsid != "esquibeth_button") {
			return "Press";
		}

		return "";
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
};

;
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
	"e"	: "press"
};
itemDef.keys_in_pack = {};

log.info("wall_button.js LOADED");

// generated ok 2012-09-13 15:51:31 by lizg
