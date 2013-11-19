var label = "Chain";
var version = "1341337002";
var name_single = "Chain";
var name_plural = "Chain";
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
var parent_classes = ["newxp_chain"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.location_event = "glitch";	// defined by newxp_chain
}

var instancePropsDef = {
	location_event : [""],
};

var instancePropsChoices = {
	location_event : [""],
};

var verbs = {};

verbs.pull = { // defined by newxp_chain
	"name"				: "pull",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"handler"			: function(pc, msg, suppress_activity){

		var location = this.getLocation();

		this.current_pc = pc;

		this.setAndBroadcastState('pull');
		pc.announce_sound('CHAIN_PULL');
		pc.announce_music_stop('NEW_XP_BEFORE_CHAIN_PULL');
		pc.announce_music('NEW_XP_INTRO', 999);

		if (this.getInstanceProp('location_event')){
			location.events_broadcast(this.getInstanceProp('location_event'));
		}

		// If we are not in an instance, reset the chain (for testing)
		if (!location.isInstance()){
			this.apiSetTimerX('reset', 10*1000);
		}
	}
};

function onPlayerEnter(pc){ // defined by newxp_chain
	this.reset();
}

function reset(){ // defined by newxp_chain
	this.setAndBroadcastState('hang');

	if (this.current_pc){
		this.current_pc.announce_music_stop('NEW_XP_INTRO');
		delete this.current_pc;
	}
}

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
	"no_tooltip"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-229,"w":43,"h":223},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAB7UlEQVR42u2XT2vTYBzH+w5EPOkG\nrVqcVaEtrKAilu06phfRww7FkwhKFJQdVqhCEeaUwP6cPJQNFbWMJ03N0yRtfNqNdq5ue5p0rU0J\nZrgX0JcQ24OvYEK\/DB\/IJacPT36\/z\/cbn+8fnn3bSdS5KfhQT7PrCJXad1xAquvxYnkjAwvYaHXc\n95+zLizgrtVibLOaggU02x2XFkscFpC3O4JcUHFncMdsClQHvsHtPZNJikqglyRLJBEWsNV1uEw1\nXM1s1GrxSnULVzNWp8vyqu4CL0mDyQVNhF6SdTmP60Hn9yGRFIqrGfg207S7bo5quElSNy1mVDZx\nNbPfF7Wil3Bn0Pxpp1RWxp3BWn1HoCWDwQL+aFh89cMnXMCBqGVawE2SfuXvqcY33CyuWxZ6m7FF\nWjR60G1mXf6KO4ODJIH+q7PdA9Kv\/Lia+d9mjn2baTu\/3KyUAxY1NwVFL+LNYDs95y9M38xkJ6J8\ndSruvrt6Ceczr8UC8ZVrl3vp0ChTro\/dpjdCZDly1nt9xc\/fhE77hw74MRYUl8IBb\/bcyRN\/32mT\nEZKOXvDmxkaGnyrz40G29Piup32ZJwZ5mxo8kvgkk7w44s2Mnhq+tB8Gz5Bn92\/x5NMZ9vJ5gi2+\nesQXXjzwkuHznnDvzpEB\/wCxGw5WaGehZgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/newxp_chain-1340734593.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

itemDef.oneclick_verb	= { // defined by newxp_chain
	"id"				: "pull",
	"label"				: "pull",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
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
	"no_auction",
	"no_tooltip"
];
itemDef.keys_in_location = {
	"u"	: "pull"
};
itemDef.keys_in_pack = {};

log.info("newxp_chain.js LOADED");

// generated ok 2012-07-03 10:36:42 by tim
