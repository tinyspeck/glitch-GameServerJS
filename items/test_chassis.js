var label = "Test Chassis";
var version = "1331820238";
var name_single = "Test Chassis";
var name_plural = "Test Chassis";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["test_chassis"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function (){ // defined by test_chassis
	return {
		door: 'door_knockergreen'
	};
}

function make_config(){ // defined by test_chassis
	return {
		door: 'door_knockerwood',
		fence: 'fence_bars',
		statue: 'statue_rooks',
		roof: 'roof_wood',
		topdeco: 'topdeco_rook',
		window: 'window_boardwood',
		stairs: 'stairs_woodlight',
		stairsdeco: 'stairsdeco_pighead',
		siding: 'siding_tan',
		platform: 'platform_wood'
	};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/test_chassis-1331821047.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
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
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("test_chassis.js LOADED");

// generated ok 2012-03-15 07:03:58
