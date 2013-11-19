var label = "Furniture\/Deco Bag";
var version = "1336414555";
var name_single = "Furniture\/Deco Bag";
var name_plural = "Furniture\/Deco Bags";
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
var parent_classes = ["bag_furniture"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function canContain(stack){ // defined by bag_furniture
	if (stack.has_parent('furniture_base') || stack.has_parent('trophy_base')) return stack.getProp('count');
	return 0;
}

// global block from bag_furniture
var capacity = 1000;
var is_furniture = true;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube"
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
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("bag_furniture.js LOADED");

// generated ok 2012-05-07 11:15:55 by mygrant
