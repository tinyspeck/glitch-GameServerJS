var label = "Playback Button";
var version = "1347650539";
var name_single = "Playback Button";
var name_plural = "Playback Button";
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
var parent_classes = ["esquibeth_button", "wall_switch"];
var has_instance_props = true;

var classProps = {
	"state_down"	: "in",	// defined by wall_switch (overridden by esquibeth_button)
	"state_up"	: "out",	// defined by wall_switch (overridden by esquibeth_button)
	"state_down_static"	: "lockIn",	// defined by wall_switch (overridden by esquibeth_button)
	"state_up_static"	: "lockOut"	// defined by wall_switch (overridden by esquibeth_button)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.switch_mode = "resetting";	// defined by wall_switch (overridden by esquibeth_button)
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
		'position': {"x":-24,"y":-52,"w":47,"h":55},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEvUlEQVR42u1XWUxcVRimoW3cKA01\n4UWCTAvMFIeWZVBAloCAMmWb0oIoS1MsXWUiDMvAMGWbAWZhmJWZgSn70lJQlmJqtC02VGPUaoyp\nD5Vioqa2TWu0+vh5zuUO8cE3uejDfMmXO\/fe\/57z3e\/\/z3\/menl54IEHHniwIeDv4Se5yePxfP8f\nokL4pYJg\/pW9IXyEhQoQJxIhJiISEcJw0GsMg0MfCoIEgZsqLCQkZJ8ghL9CRe0PEyI2SoT87EwU\nF+SipFACcXoKkuJjkCtOJ6KjqcgvN81V6gZ1JTMtBW8ezkXp6xIceeMgDuVmQnryCOrfOY6i\/Cwk\nxIlQkCcmMTlIS06kDm+OSJpScXoqjpUVMmIGrF1QKaogycrA1KAZQ3YtBm0avJIcj66WWlSeKEN5\nyWFkZaRyL5LWXCSpLypO11aPi8MWuMwdcBjVkGS\/hmGHnvlNKa86ydyjgp1GFY4WH2LqUxAcWsmd\ne6Tu0pJehqqpmnGLTuwgtFl0aG5VwGozrNHajQG7HnZDGxNzztqJblUDUhMTiED+Vc7aSIRQiELJ\ngXXn1gSqYek1oX9sBBcWLsHgcqGnvw8msw5201oMJX2moqwI4XvDljgT+GJkFBplp3B+wLQ+MRVh\nsNvQOz4FiqUvvoZm5Dy0FjPjJH0BGtdnUjO1mRIf94gzgbHRImZRuN2j7DVroOt3wT41BzeWbn6L\nTrsTJoeVSX8vSbWjpx3j\/QYkx8WCDLd9wwUK+fwk0f59mCapsulb19wjE1MBusFROGcvM+KufnOb\nOY7MLqLb6SDpN8KgaYWpS8ksmMgXhODv3h234QIjBILAeNJ0R516GDub0NvdyhxtJI26wTHMf\/wJ\nI0w9v4yJ61\/ht8ePYRudQA9Jv06rQk+HgnGRCgzm8cScpDk6PHxVQ3obncxNo0kH7cAoFpaWGYHt\n715Dy9SHGHrvEn65\/wAmV\/+6QMoo0qaCg4ISORGY82q6mu4efxeo1XWg3XEOC9eWce\/hI6imP0Lb\nhcsYn1vEd7dXYCYr2i2wuV4K8pK\/kqF2ctUKd5QWSqZbyEQGdSP07XLodGqo7C7i4A3cuvMD2iYX\nYZ+\/grv3HmBwcgKdei302naoSe\/ME2eQbTD3UzoOVwKfJOQ1yk5\/rqx9G1QoM7nVjtH593Hnx5\/x\nwWc3sfrTXYzOTMNgMaKhsQ6NtVLUSY+jvLgQU8O2G+w4nMCb8Dm6ZipKC6c7lDW\/a9RKdJp6MHRx\nhqnBWyur6JuagdVpg0arRrNCBoXsNHG8CdJTR8tVypp8dhzO4Ed3PcKEs\/WVcy2NMqi7yP47NITJ\n+XnonX1QqEldqlqgbKiCrPIYqs+Uf18trahnn\/Pj+g\/NE4QB1EXCVElOpqW6Rnr\/bIsStfLaP+UK\nOeQkrXVVZ\/4oLZJc5z0fcMLf\/9lsNj6AfZ5z0FXIIxR5bd2auv0Z3\/xtT+8o2faUT3lRQd7swVzx\nmJ+f71vkfh59CSZuLX6n1yaB1tAuwj2sMwmEGYQHCLPYYwZ7PYKN28V17f2TSFpP9HsjjBUSQ\/gS\ne4xgrweycZsqzo0thD6E\/mx98Vi3eOy5P3t\/y3\/9gefN9jYftgn7sOfeXh544IEHHvwr\/AXbmdV4\n9CTYhgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/esquibeth_button-1347650539.swf",
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

log.info("esquibeth_button.js LOADED");

// generated ok 2012-09-14 12:22:19
