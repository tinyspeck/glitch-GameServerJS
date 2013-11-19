//#include include/takeable.js

var label = "Tin Ingot";
var version = "1345780594";
var name_single = "Tin Ingot";
var name_plural = "Tin Ingots";
var article = "a";
var description = "It's tin.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 50;
var input_for = [180,181,182,183,184,196,201,203,205,209,210,211,215,216,217,221,222,254,279,280,284,302];
var parent_classes = ["tin", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.inspect = { // defined by tin
	"name"				: "inspect",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var choices = [
			"As you know, tin is in my blood",
			"...but nary a sheet of tin has rolled out of our production lines in over 30 years!",
			"who would have thought that Electronic Mail would come to supplant the nation’s own great and venerable post!?",
			"tending to my small but growing alpaca herd",
			"tin, my first love"
		];

		var choice = choose_one(choices);
		self_msgs.push('It replies: "'+choice+'".');


		var pre_msg = this.buildVerbMessage(msg.count, 'inspect', 'inspected', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with an <a href=\"\/items\/621\/\" glitch=\"item|alchemical_tongs\">Alchemical Tongs<\/a>."]);
	if (pc && !pc.skills_has("alchemy_2")) out.push([2, "You need to learn <a href=\"\/skills\/81\/\" glitch=\"skill|alchemy_2\">Alchemy II<\/a> to use an <a href=\"\/items\/621\/\" glitch=\"item|alchemical_tongs\">Alchemical Tongs<\/a>."]);
	return out;
}

var tags = [
	"metal",
	"advanced_resource",
	"nobag_advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-17,"w":34,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEIklEQVR42u2Y10prURCG8wZ5hDxC\nHsFHsPcSe9fYu0bFLvZet72hRsXeDgoKghDwxgsvAoLX+xHmzL9we\/bJSdmJMeaAAws1mOTLfLNm\n1opO9xP\/SZSXlxvKysqspaWlpqCDq62tDeElV1dXU2VlJTGoPWhAW1pazLzIYrFQY2Mj1dfXE8MS\nYCsqKuyc2e8B7erq0vf09Ej8kzo6OqitrY1aW1upubmZmpqaqKGhgerq6qimpgawgQUdHR01DA4O\n2gYGBqivr496e3upu7ubOjs7PcHa+QOFfinc9PR0yMTEhDw+Pk5jY2M0MjJCQ0NDpAUW\/7+8vCyv\nrKwYvgRucXHRvLCwQPPz8zQ7O0sMS5OTk+QJFmt4eFjUJ2AZ0upXsK2tLf3Gxoa0vr5Oq6urxBmg\npaUlcgXLJSCAuAzEmpubE7vbbDZTYWGh2FD8Ov5RfXR0ZNjb27Pt7u7S9vY2MSxtbm6SAsvZIM4s\nSZIkQGZmZj5gAT41NUVVVVVUUlJCRUVFlJ+fTzk5OdjpMj74p+DOz89DTk5O5OPjYzo8PKSDgwNi\nWNICu7a2JiC51RD3RCouLqaCggLKzc2lrKwsSklJoeTkZMlnuLOzM9Pp6Sk5Li2weBx1+N60P9Tm\n5eVRdnY2paWlUXx8PIWFhfkGyCCSMzgtsFwSYiMAjnvfP2ozMzMpMTGRIiIivIe7uLjQs1KbFjj1\n4ucI2J2dHTFFAOdObXR0tORL1oyoN2\/hsC4vL0XNAQpw7tTGxcVZ\/FZvWtbV1ZXYqdCpALpRa\/qy\nenMFx\/P4Lzg3ak0BqTdlXV9fizmrhnOj1hSweuPeKDYFjlOA8aQ2IyPDFLB646yLdgKFjnDO1HoN\n95l6u7m5EVPCGZwLtd7B7e\/v+1xvd3d34gAAfc4AHdTKrNboFRyPFRO2OWYkK\/YK7vb2lnBqdgXn\noNZ7OERsbKwVHZxrQhyDUOha4O7v78WR3RWcg1rf4HjmGWJiYigpKUl0cuwsvCkyiey4mgyPj48f\ncBrU+gaHiIyMNPPso4SEBEpNTRVNE7sML4zD5tPTk+hpCtzDw4MAVMA0qJU5e0afj00MaI+KisIM\nJEUzdhm04E36+\/vp5eWF3t7e6Pn5WfzuCU6l9nNwCIYLZUiZ61BoTk9PF5qx4\/Am0IiLzevrKyFw\nr\/AE+K7W9mk4JcLDw40Masc5DJoxfhTNOI7jWoj7BbKoRS3g+DX0On8G16GeNf+CZrQctWbcWd8v\nMh7V8uP+h1MH7gFqzQCAZgx+vrm5BeS\/bTyDvw5OCZwuFM0AUWt2ozYwcEpwuwnBWIJmAEAzbv+4\nbDtRG1g4JTiDBt6JNrXm9vZ2R8DvgVMCBc9arTjfQTO+CVDBSbpgCQYaUL7bCzo41TelJr7TypzB\n4INTgrNo0P3En\/gNs0dROkPo3SEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/tin-1334276661.swf",
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
	"metal",
	"advanced_resource",
	"nobag_advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "inspect"
};

log.info("tin.js LOADED");

// generated ok 2012-08-23 20:56:34 by martlume
