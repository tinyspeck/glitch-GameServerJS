var label = "Timer Tester";
var version = "1308250790";
var name_single = "Timer Tester";
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
var parent_classes = ["timer_tester"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.squash = { // defined by timer_tester
	"name"				: "squash",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Wtf, mate?",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.apiDelete();
		return true;
	}
};

function onCreate(){ // defined by timer_tester
	this.apiSetTimer('onTimerFire', 10000);
}

function onTimerFire(){ // defined by timer_tester
	log.info('test timer has fired!');
	this.apiSetTimer('onTimerFire', 10000);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
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
	admin_props	: false,
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
	"no_trade"
];
itemDef.keys_in_location = {
	"q"	: "squash"
};
itemDef.keys_in_pack = {};

log.info("timer_tester.js LOADED");

// generated ok 2011-06-16 11:59:50
