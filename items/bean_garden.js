//#include include/takeable.js

var label = "Garden Bean";
var version = "1320438575";
var name_single = "Garden Bean";
var name_plural = "Garden Beans";
var article = "a";
var description = "Plant a garden. Ta-da!";
var is_hidden = false;
var has_info = true;
var stackmax = 50;
var base_cost = 0;
var input_for = [];
var parent_classes = ["bean_garden", "invoking", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"placement_set"	: "",	// defined by invoking (overridden by bean_garden)
	"proto_class"	: ""	// defined by invoking (overridden by bean_garden)
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
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

function createProtoItem(pc, x, y){ // defined by invoking
	var proto_class = this.getClassProp('proto_class');

	if (!proto_class) {
		log.error(this.class_tsid+' has no proto_class');
		return false;
	}

		
	x = intval(x);
	y = intval(y);

	if (isNaN(x)) x = pc.x;
	if (isNaN(y)) y = pc.y;

	var proto_stack = apiNewItemStack(proto_class, 1);

	pc.location.apiPutItemIntoPosition(proto_stack, x, y); 
	pc.apiSendLocMsg({type: 'location_event'});

	return true;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"invoking"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	asset_swf	: "http:\/\/c2.glitch.bz\/items\/2011-10\/bean_garden-1319656257.swf",
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/bean_garden-1319656257.swf",
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
	"invoking"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "invoke"
};

log.info("bean_garden.js LOADED");

// generated ok 2011-11-04 13:29:35 by eric
