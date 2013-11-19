var label = "Store Spawner";
var version = "1305689480";
var name_single = "Store Spawner";
var name_plural = "";
var article = "a";
var description = "Spawns a store in the location when the player enters.";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["store_spawner"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "420";	// defined by store_spawner
	this.instanceProps.height = "260";	// defined by store_spawner
	this.instanceProps.store_id = "0";	// defined by store_spawner
	this.instanceProps.x = "0";	// defined by store_spawner
	this.instanceProps.y = "0";	// defined by store_spawner
}

var instancePropsDef = {
	width : ["Width of the store interface"],
	height : ["Height of the store interface"],
	store_id : ["ID of the store to open"],
	x : ["x location of the store"],
	y : ["y location of the store"],
};

var instancePropsChoices = {
	width : [""],
	height : [""],
	store_id : [""],
	x : [""],
	y : [""],
};

var verbs = {};

verbs.buyfrom = { // defined by store_spawner
	"name"				: "buy from",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"store_id"			: 0,
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this, "buyfrom");
	}
};

function onPlayerEnter(pc){ // defined by store_spawner
	if (this.instanceProps.store_id){
		log.info('--------- opening a store window');
		pc.openStoreInterface(this, "buyfrom");
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
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "buyfrom"
};
itemDef.keys_in_pack = {};

log.info("store_spawner.js LOADED");

// generated ok 2011-05-17 20:31:20
