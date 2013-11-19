var label = "Lazy Chair";
var version = "1328051814";
var name_single = "Lazy Chair";
var name_plural = "Lazy Chairs";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["furniture_lazychair", "furniture_base"];
var has_instance_props = true;

var classProps = {
	"placement_set"	: "chair",	// defined by furniture_base
	"can_flip"	: "1"	// defined by furniture_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.upgrade_id = "";	// defined by furniture_base
	this.instanceProps.facing_right = "1";	// defined by furniture_base
}

var instancePropsDef = {
	upgrade_id : ["Which upgrade is applied to this furniture"],
	facing_right : ["Are we facing right?"],
};

var verbs = {};

verbs.flip = { // defined by furniture_base
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Turn it around",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var can_flip = intval(this.getClassProp('can_flip'));
		if (!can_flip) return {state:null};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var facing_right = intval(this.getInstanceProp('facing_right'));
		this.setInstanceProp('facing_right', (facing_right+1)%2);

		var pre_msg = this.buildVerbMessage(msg.count, 'flip', 'flipped', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.upgrade = { // defined by furniture_base
	"name"				: "upgrade",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Change it",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var upgrades = this.getUpgrades();

		var ret = {
			type: "furniture_upgrade_start",
			itemstack_tsid: this.tsid, // the piece of furniture being upgraded
			upgrades: []
		};

		for (var i in upgrades){
			var up = upgrades[i];
			ret.upgrades.push({
				id: i,
				label: up.name,
				credits: intval(up.credits_cost), // 0==free
				imagination: intval(up.imagination_cost),
				config: {
					swf_url: up.swf,
				}
			});
		}

		pc.apiSendMsg(ret);

		return true;
	}
};

function getLabel(){ // defined by furniture_base
	var upgrade = this.getUpgradeDetails();
	if (upgrade && upgrade.name) return upgrade.name;

	return this.label;
}

function getPlatsAndWalls(){ // defined by furniture_base
	var upgrade = this.getUpgradeDetails();
	if (upgrade.plats || upgrade.walls){
		return {
			plats: utils.copy_hash(upgrade.plats),
			walls: utils.copy_hash(upgrade.walls)
		};
	}

	var plats = this.plats ? utils.copy_hash(this.plats) : {};
	var walls = this.walls ? utils.copy_hash(this.walls) : {};

	return {
		plats: plats,
		walls: walls
	};
}

function getUpgradeDetails(){ // defined by furniture_base
	var upgrade_id = this.getInstanceProp('upgrade_id');
	if (!upgrade_id) return {};

	return this.getUpgrades()[upgrade_id];
}

function getUpgrades(){ // defined by furniture_base
	var catalog = apiFindItemPrototype('catalog_furniture');
	if (!catalog || !catalog.furniture){
		log.error("No furniture catalog!?");
		return {};
	}

	if (catalog.furniture[this.class_tsid]){
		return catalog.furniture[this.class_tsid];
	}

	return {};
}

function make_config(){ // defined by furniture_base
	var upgrade = this.getUpgradeDetails();

	var ret = {
		facing_right: (this.getInstanceProp('facing_right') == 1 ? true : false)
	};

	if (upgrade && upgrade.swf) ret.swf_url = upgrade.swf;

	return ret;
}

function onPropsChanged(){ // defined by furniture_base
	this.broadcastConfig();
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
	"no_rube",
	"no_trade",
	"furniture"
];
itemDef.keys_in_location = {
	"c"	: "flip",
	"u"	: "upgrade"
};
itemDef.keys_in_pack = {};

log.info("furniture_lazychair.js LOADED");

// generated ok 2012-01-31 15:16:54
