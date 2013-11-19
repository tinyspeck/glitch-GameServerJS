//#include include/garden.js

var label = "Garden";
var version = "1324500880";
var name_single = "Garden";
var name_plural = "";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["garden"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function onCreate(){ // defined by garden
	this.initGarden();
}

function onPlayerEnter(pc){ // defined by garden
	if (this.container.isInstance('tower_room_5') && !this.spinach_done){
		for (var i in this.data.plots){
			this.setPlotData(i, {
				state: 'crop',
				wet: true,
				start_water: time(),
				seed: 'seed_spinach',
				growth: 0
			});
		}

		this.spinach_done = true;
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"garden",
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
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-06\/1276796872-4191.swf",
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
	"garden",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("garden.js LOADED");

// generated ok 2011-12-21 12:54:40 by mygrant
