//#include include/takeable.js

var label = "Piece of Platinumium Spork";
var version = "1350087207";
var name_single = "Piece of Platinumium Spork";
var name_plural = "Pieces of Platinumium Spork";
var article = "a";
var description = "Half of a platinuminium spork that requires its partner before functioning like a spoon, fork, or both.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_platinumium_spork_piece1", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "artifact_platinumium_spork"	// defined by takeable (overridden by artifact_platinumium_spork_piece1)
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1314\/\" glitch=\"item|artifact_platinumium_spork\">Platinumium Spork<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-7,"w":24,"h":9},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADgUlEQVR42u3YayusURQH8PkGPoKP\n4CPMR5hSyF1Kym1CyvVM5PZCHSlS0ggppBG5TkzuZHjIdVzmcb+WSfH6f9Z\/59FwnPNunnE6s2s3\nmnnza62911qbxRJZkRVZ\/9a6v79Pv7u782xubnr6+\/vTvwXq6ekpirDT01N9eXkZnZ2dKCgoQEJC\ngh5uWPTFxYVTooXx8XG0t7ejrKyMMMTHxwfkMyZcaYw5Pj52LiwsQNKInp4e1NXVISMjw8A5Y2Nj\no8MSMcH9XF9fx+DgoMJ1d3fDbrcr2BsuPVxRcxwdHQUmJyfhcrkwNDSEtrY2pKSkBKfUZjrs8fHR\nenV1pa+trWFsbAyjo6MqelVVVUhLSwvfeePNlHLh3Nvbw8zMDKampjAxMaHSmp+fj+zsbAUUnCsu\nLi7KVJzAbJeXlzrPmsfjUUC3242+vj7k5uaipKQEiYmJ5qfUiJrf78fKygp4S+fm5hSS562oqEjh\nkpKSzI8aS4fg9P39ffC8Ebi0tKSQHR0dKC4uVsVXcM6wRE0uAnZ2drCxsQGm1kAODw+jtLQUOTk5\nqr6ZHjXZ2vn5OXZ3d7G9vQ1N096R09PTqK6uRmZmpvk4iZr99vY2wPN2cHAA3lZGkMitrS3Mzs6+\nlxJTcewGnDZubm5AnLQs+Hy+D0hejIqKCiQnJ5uLM1JKHNOq6zpkAvmAXFxcVDgpI6bjHLIhacX1\n9TWkzv2G5KUwHefz+1XUCGPk\/oRkp3grwObheBEIIeDs7EyBvkKyx5aXlxtnzhVymBRbDpKek5MT\nsPAeHh6qFAYjHx4eFLK3t1fd1qysLOK0kHcIgdkEFGAd83q9qmSwxn1GMqqcgIkrLCw0Byc908n6\nxTLBtwG7wVdI1rrm5maFY2rZ+EOKGxgYiBoZGdH4LuDUYSBZMj4jCa+pqVE4bnaJkE4lLy8vMdKa\nAhwkuf+G5G8GjDsvL4+pdYS6vmmvr6\/g5rkyppDV1VXVT\/niYvQ4kQTjWFJkXLeH\/MbOz88rCNvW\n8\/MzDGzwZvPnaM6RyTh3klpzap1ERqWXKSX2q82phECWEuJkXNfcbq85A2d9fb1VdqChoQEtLS3o\n6upSr65gML9LTU1VXUKQgaamJvPfrI2NjTZBOgk1NsGtra3qb75diZSaZw37\/0oYVUE55FMzsBw8\nKyt\/OCzfbdXW1ka\/Ya2WyIqs\/3D9AmhwNsmoM4v1AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_platinumium_spork_piece1-1348253028.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_platinumium_spork_piece1.js LOADED");

// generated ok 2012-10-12 17:13:27 by martlume
