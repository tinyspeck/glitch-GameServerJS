//#include include/takeable.js

var label = "Essence of Hole Potion";
var version = "1327361898";
var name_single = "Essence of Hole Potion";
var name_plural = "Essence of Hole Potions";
var article = "an";
var description = "An enchanted liquid hole in a bottle. Single application with the ability to invoke into being a life-supporting patch where once there was nothing. Or \"where once there was some other ground that you weirdly couldn't plant a tree in\". DO NOT QUAFF.";
var is_hidden = false;
var has_info = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["invoking_patch", "invoking", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"placement_set"	: "aboveground_items,underground_items",	// defined by invoking (overridden by invoking_patch)
	"proto_class"	: "proto_patch"	// defined by invoking (overridden by invoking_patch)
};

var instancePropsDef = {};

var verbs = {};

verbs.invoke = { // defined by invoking
	"name"				: "invoke",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		pc.apiSendMsg({
			type:'gol_invoke_start',
			invoking_item_tsid: this.tsid
		});
	}
};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

function createProtoItem(pc, x, y, pl_tsid){ // defined by invoking
	var proto_class = this.getClassProp('proto_class');

	if (!proto_class) {
		log.error(this.class_tsid+' has no proto_class');
		return false;
	}

	if (!pc.location.geo_placement_can_invoke(pl_tsid, this.class_tsid)){
		log.error(this.class_tsid+' cannot be invoked on '+pl_tsid);
		return false;
	}
		
	x = intval(x);
	y = intval(y);

	if (isNaN(x)) x = pc.x;
	if (isNaN(y)) y = pc.y;

	// this was just for testing
	//pc.location.createItemStackWithPoof(proto_class, 1, x, y);

	var stack = pc.location.createItemStack(proto_class, 1, x, y);
	if (stack){
		stack.pl_tsid = pl_tsid;
		return true;
	}

	return false;
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this with a <a href=\"\/items\/cauldron\/\" glitch=\"item|cauldron\">Cauldron<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"invoking",
	"potion",
	"tinctures_potions",
	"pm3",
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
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/invoking_patch-1321647701.swf",
	admin_props	: false,
	obey_physics	: true,
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
	"invoking",
	"potion",
	"tinctures_potions",
	"pm3",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "invoke"
};

log.info("invoking_patch.js LOADED");

// generated ok 2012-01-23 15:38:18 by lizg
