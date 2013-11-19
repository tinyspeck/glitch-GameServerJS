var label = "Red Throne Armchair";
var version = "1326473520";
var name_single = "Red Throne Armchair";
var name_plural = "Red Throne Armchairs";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["furniture_armchair_pimpchair_red", "furniture_armchair", "furniture_base"];
var has_instance_props = false;

var classProps = {
	"placement_set"	: "chair"	// defined by furniture_base
};

var instancePropsDef = {};

var verbs = {};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"furniture"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	asset_swf	: "http:\/\/c2.glitch.bz\/items\/2011-12\/furniture_armchair_pimpchair_red-1324422308.swf",
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-12\/furniture_armchair_pimpchair_red-1324422308.swf",
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
	"no_rube",
	"no_trade",
	"furniture"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("furniture_armchair_pimpchair_red.js LOADED");

// generated ok 2012-01-13 08:52:00 by eric
