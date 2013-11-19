var label = "Scrap of Head Polishing Cloth";
var version = "1354942545";
var name_single = "Scrap of Head Polishing Cloth";
var name_plural = "Scrap of Head Polishing Cloths";
var article = "a";
var description = "<i>This is a lost artifact, known only through ancient stories of long-deceased ancestors, and has not been discovered in Ur.<\/i>\r\n\r\nSeeking ways to please their particular, peculiar, pristinely manicured protector, the Tii-ites were always seeking the greatest possible way of pleasing the giant with the perfectly smooth bald head. Dedicated supplicant Threepwood declared his decision to create a giant-sized head-polishing cloth. However, since it took him 47 years to collect enough batterfly silk for this small (perfect) corner, the great supplication never came to pass.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_scrap_of_head_polishing_cloth"];
var has_instance_props = false;

var classProps = {
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
	"no_auction",
	"artifact",
	"collectible"
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
	"no_rube",
	"no_trade",
	"no_auction",
	"artifact",
	"collectible"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("artifact_scrap_of_head_polishing_cloth.js LOADED");

// generated ok 2012-12-07 20:55:45
