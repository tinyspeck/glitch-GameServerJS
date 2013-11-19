//#include include/takeable.js

var label = "Wall Segment";
var version = "1339619505";
var name_single = "Wall Segment";
var name_plural = "Wall Segments";
var article = "a";
var description = "On its own, it would just fall over. But among a house and other Wall Segments, it becomes the building block of home expansions. Useful for widening and adding floors to houses.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 2500;
var input_for = [];
var parent_classes = ["wall_segment", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
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
	"include_target_items_from_location"		: false,
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
	"include_target_items_from_location"		: false,
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

verbs.use = { // defined by wall_segment
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "If you want to expand your house, go there, enter decoration mode and click \"expand\"",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:'disabled', reason: 'If you want to expand your house, go there, enter decoration mode and click "expand"'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var pre_msg = this.buildVerbMessage(msg.count, 'use', 'used', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/751\/\" glitch=\"item|construction_tool\">Construction Tool<\/a>."]);
	if (pc && !pc.skills_has("furnituremaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/99\/\" glitch=\"skill|furnituremaking_1\">Furnituremaking I<\/a> to use a <a href=\"\/items\/751\/\" glitch=\"item|construction_tool\">Construction Tool<\/a>."]);
	if (pc && !(pc.skills_has("engineering_1") && pc.skills_has("furnituremaking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering I<\/a> and <a href=\"\/skills\/100\/\" glitch=\"skill|furnituremaking_2\">Furnituremaking II<\/a>."]);
	return out;
}

var tags = [
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-80,"y":-44,"w":161,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAC6ElEQVR42s2ZS24TQRCGfZMcIUfw\nEdghWGWLxIIVIFgQ5QIgNmxYIMEacgTL7\/f7\/X5bliw5R+j0P9KPSk17ZKJ0T0Yqzdie0XzzV\/3V\nlUks9sDteDxeHA6HOGO3273ZbrfXIm51JBD6t8R+v1ffv76+u\/nwIvH71\/vL2GNvq9VK6ZupzWYT\nxGQyUd1uV3U6HTUYDILAsYx2u616vZ5aLpcKgN8+v1I3H1+qPz\/fxh8dcDabqcVioUajUQDWbDbP\nCkDiOueAuFmr1TobTAYeCqo7BYQSD4HjgzkHRE2FQTQajSBsv+HaSAGLxaJKp9OqVqudrMPIAKFa\nPp9XqVRKVSqVkw\/hHBBtxAYH1aAgIgxwvV77BwSQjGq1aoUbDocKffTJAqLNRAqIGkSKke56vf6P\nm3Gt8xq0rR6AKxQKgUGy2awql8vBsakkAPV67N\/FUIwOzuVyJ90cWR9EKqEcoKAk0oxj7E3ASGqQ\ncIhSqfRXQRybdYiBwSkgnBgGSMPgOwDCLPLc+XzuDxA3hxFsgDAK9iagcwWZYqROthcCogZlT\/Se\nYkzGdC4hMCAQEJHJZAI325Y854BwItImVZJwUknbVOMF0FzeJBjU5MAQCWC\/3w9uBHPYUswahIOR\nZnxGeDeJrEHUHAFhGJuyBMRfdk8GUH5PQG8riUwxVw8AERB9kKlHn2Q\/dA6INiPhZACEgKg\/qofz\nOdl4cbENEIpBSQbhAMpy8AIoWwyguOZyb6qHcyTgdDr1B0gTcLwCpBxeaQ4JiFcnTgFt\/U+6FXCc\nqKmgXJedp1jWnQSTIacbfmb6MQ15A5QKnoJlcPnDSuQcEGqYQHLkMgPnMtXoo84BpQk42psjl\/k7\nVR+Px24BoVQYjBk4nw+ANDt3se5xiWQyeXcOHKDMB3LeB7npm15q0Ct90x96Xz9XUedtJmzTAHEN\nfq33txp6bms\/eAEfGaC5aaALDfZMxxft5ATqj68+Pr17Xv+ff0PcA\/hOv+RJHUK2AAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/wall_segment-1336691700.swf",
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
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"u"	: "use"
};

log.info("wall_segment.js LOADED");

// generated ok 2012-06-13 13:31:45 by cal
