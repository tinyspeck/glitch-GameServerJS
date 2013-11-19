//#include include/takeable.js

var label = "A Piece of Butterfly Bone Hair Clip";
var version = "1348197833";
var name_single = "A Piece of Butterfly Bone Hair Clip";
var name_plural = "Pieces of Butterfly Bone Hair Clip";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 100;
var input_for = [];
var parent_classes = ["artifact_butterlfy_hair_clip_piece1", "takeable"];
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/artifacts\/butterfly-bone-hair-clip\/\" glitch=\"external|\/achievements\/artifacts\/butterfly-bone-hair-clip\/\">Butterfly Bone Hair Clip<\/a>"]);
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
		'position': {"x":-16,"y":-15,"w":33,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFF0lEQVR42u2X61JTVxiGuQOnfwoR\nKwc5R9k5h5wD4UwwkGCiBgggCBQkRARKIYaDqQiUiCieBmNlpmPtIL\/80XamuQQugUvgEt6ub9m9\nGyDj1Go7\/bG\/mXd22CR7Pev9DivJypJDDjnkkEMOOT41dtea835YcIW2Y87k5qQlFR1Qp57MOlM7\n8fq9n1fdsbfr7Z7\/FOj1cr2wE28Iv1x07W1MWA5uhzQYdVeg214MjyYPPl0B\/IZCDNUrcctfibk+\nLe5P2vHjctMeffZfAXqx4Aozh\/Yez9gPZ4IqXG8sQ7e1GF2GYgzZKjBWfR4RVyUm6wR806DG4kU9\n4m1GLLTq8W2jBpGGSkTaK5GYsCF525n4JKA3K62OnaXamAi0dE2HSNsF9DlK0WcuxTgDibZosXTR\nwCHueAyYa9ZykHQdv0ebGKgrw\/ygAdtRZ+rptPbURwG9nHelkrFqLA8ZMO0XMNqoRLexGCMOJXdl\nxVuFVZ8J3zGoeJpibp0EMV2v4u8NV1\/gonvkKj3jurUcg7ZyjHqUWGdOPpu1JU\/A\/Pb00qnXy80e\nZnOMdrEddWD1ayOiV9mDWgW2S\/bQJo3kzt12I+4xsPt+C1f8GBy5J8JN1akwyCBoU+1CPjrUBeip\nKkEnKwO6howlCGgLEbQUYSqkBpnBoX7f7hReLdYmkvM1+wS0NlKFO916RL0a3GTpmmVAYs2sMYc2\nGMhmwIpHV2z8Sn9\/32HmsOlwVF\/0WYIj14btFRLch9TXWMLSrH8PSI69WXEfbk1bMXtZLdlO9THP\nUkMOpC9KEA8CFg5HIjDxf\/T+TLU2UStIzvlUBQjqi+DNAObV5SNYV4QbASVeLdXhwZRlP2s30bb\/\nfM6O4aYK7hbtmqAIRHRLVOKSmdfZXQIlh9x69JpK+cKUJlqYROm6xpplwFLO64rUbynj9+g1XUWo\nNiEPbs1Z9LtLMT+kx+aUDWsRMyJXL6DBdCactcNICXDUqeTpEN0gGBGMCp\/A092hwqauE4u7j4ES\n2GXtuRPOUK3RfXEDpKuWcxj3VSI+bMTWjB3xESMGvWXw1uTDps6BRZV9qNV+cSrrp3stHHCs9v1i\nYvEfl1hLYicS3KD1qEN8Yd05nsZMtdXDxlCsx4CHbChvTNpYIwjobC5Co\/mMJIdWweAIMCfEG+Td\nVoA3xl02e2iGUSFHmVM0Gm63ZK6pdN1wnpcgj7t3SVuAMbeAeH8VnkVrjriUDkWqr8qFXaOAWZVz\nYFJlh\/8aK8+7Eu8eBXjHrIdN6LWV8Nqhwv4QmFj8dEqQc6Jr3dZS3PKxo2vcjodTDu5S78WSE0Ai\nlFOngF2dc8BSmrCqvzx5zP36rMvBIPHL0yAo3dTNM1fUCFmKpfl0XOSUX1PIRVD9LiXmgjqsj1m5\nS6P+iowuiVA1+tMMSrHP3IplhDoJ2XlAkCLoqzsNSM67kAibMeEVMFBbjpFm4YhioSo8nq5hqXN9\n0CVSgykXLsNpODSKfUqfWa3I+6iz9e1Gh2d33YfkYhPXCgNbGNJhNWJjs8iJJ7PVXGvj7CgLsxEz\napAKvKO2AIH6Qkkttq84VB1zqlqnOGB1lfhHUMdjecwUJqilYb2kW10Cxtk8EhVqZcdSS3FG+Rio\nx5lP6dtnHZg0qXMcn\/1r00yv2sGgUgR2M1gpgY1dYZ3qLT8C0mI7y9KWK46FFI2Fv1VPnyNoMeoq\nGpZ\/ziRJNAbeA2UnzKpsj\/x7QQ455JBDjv93\/AHVlP6xbARPQQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_butterlfy_hair_clip_piece1-1348197832.swf",
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

log.info("artifact_butterlfy_hair_clip_piece1.js LOADED");

// generated ok 2012-09-20 20:23:53
