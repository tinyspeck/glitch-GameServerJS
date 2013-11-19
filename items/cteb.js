var label = "Collision-triggered Event Box";
var version = "1340999041";
var name_single = "Collision-triggered Event Box";
var name_plural = "";
var article = "a";
var description = "Used to run location events on collision";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["cteb"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "10";	// defined by cteb
	this.instanceProps.height = "10";	// defined by cteb
	this.instanceProps.onEnter = "";	// defined by cteb
	this.instanceProps.onExit = "";	// defined by cteb
	this.instanceProps.onTimer = "";	// defined by cteb
	this.instanceProps.timer_ms = "0";	// defined by cteb
	this.instanceProps.timer_fire = "Never";	// defined by cteb
}

var instancePropsDef = {
	width : ["Width of hitbox"],
	height : ["Height of hitbox"],
	onEnter : ["Comma separated list of events to call when entering hit box (i.e. event_2)"],
	onExit : ["Comma separated list of events to call when exiting hit box (i.e. event_2)"],
	onTimer : ["Comma separated list of events to call when timer fires (i.e. event_2)"],
	timer_ms : ["Milliseconds to wait before triggering onTimer"],
	timer_fire : ["When the timer should start counting"],
};

var instancePropsChoices = {
	width : [""],
	height : [""],
	onEnter : [""],
	onExit : [""],
	onTimer : [""],
	timer_ms : [""],
	timer_fire : ["Never","On Enter","On Exit"],
};

var verbs = {};

function make_config(){ // defined by cteb
	return {
		w: this.getInstanceProp('width'),
		h: this.getInstanceProp('height')
	};
}

function onEvent(event, pc){ // defined by cteb
	var val = this.getInstanceProp(event);
	if (val){
		var events = val.split(',');
	        for (var i=0; i<events.length; i++){
			log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
			this.broadcastLocationEvents(events[i], {target_pc: pc});
		}
	}
}

function onPlayerCollision(pc){ // defined by cteb
	this.onEvent('onEnter', pc);
	if (this.getInstanceProp('timer_fire') == 'On Enter'){
		this.setTimer(pc);
	}
}

function onPlayerLeavingCollisionArea(pc){ // defined by cteb
	this.onEvent('onExit', pc);
	if (this.getInstanceProp('timer_fire') == 'On Exit'){
		this.setTimer(pc);
	}
}

function onPropsChanged(){ // defined by cteb
	this.apiSetHitBox(intval(this.instanceProps.width), intval(this.instanceProps.height));
}

function onTimerFire(pc){ // defined by cteb
	this.onEvent('onTimer', pc);
}

function setTimer(pc){ // defined by cteb
	this.apiSetTimerX('onTimerFire', intval(this.getInstanceProp('timer_ms')), pc);
}

// global block from cteb
var hitBox = {
	w: 10,
	h: 10,
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
	"no_auction",
	"no_scale"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":0,"y":0,"w":40,"h":40},
		'thumb': null,
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/missing.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_scale"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("cteb.js LOADED");

// generated ok 2012-06-29 12:44:01 by jupro
