//#include include/takeable.js

var label = "Platinumium Spork";
var version = "1350277478";
var name_single = "Platinumium Spork";
var name_plural = "Platinumium Sporks";
var article = "a";
var description = "The traditional gift given to a child born under the auspices of Alph, this particular platinumium Spork belonged to a baby named Weena, who was only allowed to gaze at it, glinting, rounded and pointy, from her crib. Not so much because of the rarity of the material - but because of her mother Jules' fear that she would take someone’s eye out experimenting with it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_platinumium_spork", "takeable"];
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
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-13,"w":40,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEhUlEQVR42u2YR04jYRCFuYGP4CP4\nCD6Cj2CERJSQFyAQIhiEBCKJjEiiASEymJzB5AxNztDksKGPUPPer2nESLOYjbtZTEstNN74m1dV\nr145Kur\/829Pb2+v68fA7O7uuubm5gLNzc3h+Ph4Dz9rb2\/Xs7OzPZeXl578\/PywY3Bra2u+lZUV\nc3l5Werr64WfzczMaFBQNjc3fXt7e0ZhYaF+e3vrmpqa8tkKhy\/XoJ5sb2\/LxsaG+kvQ2dlZCYfD\nAnAZHh6W2NjY0OnpqdbV1WXaBscvPDk5kZ2dHYEyEgqFZGhoSAYHBxXUxMSETE5OCkov8\/PzX68t\ncIZh+G9ubmR\/f186Ozulu7tbBgYGFNj4+LgCRpmVknynp6cFrSAse8Th2EuPj4\/m9fW1guvp6VGq\njY6OKjAqtri4qErNd2lpSb2Hh4fS1tYmdpQ2iMlUMFSOcGNjY0olq+\/Yj1tbW6onMShydnam1C4v\nL5eI2wl6zuSXU73+\/n6lnAXHMhKKMFTs4OBAjo6O5Pz8XIHn5uZGFhDl87NcIyMjqrQcCg4Cm391\ndVXBEYqKXVxcCJVGS8jV1ZU0NDRIXl5eZP0QA6BRLcJ9V489x7JSOU42+\/Pu7k7Qq4KBUv+B0tJS\nKS4u9kYUsK+vz6Bq8LOv3uOUchjYaxYgVeOUE5Jlr6urk+rq6mDEBwTr64\/JpaUQkGWnguy34+Nj\n5Y1UkaVlOzQ1NWkRh4MK3sbGRmlpaRGC0vMWFhZU83NoCMlBsaZ3fX2dvWiiFfwRh0P\/uEtKSvSK\nigqpqalROxfBQFpbW5XdsOzsSW4PKgtD1rFZArYkGjY2lr1ZUFCgGp0l40QSsqqqSpBYrM9DKHkQ\ng+OxZZ0BwgXFNJprWVkZVTKgnpmUlCTR0dEGXi0nJ8fPSGV7hEJT+9BzZm1trVKLkwhQMyUlxUxM\nTPRHOfmgr8o1TVM9xr80XJRZsrKy9MzMTLejER27NUQb6ejoUF5Hm2B5CZeenu5chEdzuzF1OiMT\nzFj53I+Bg014AGhyK9DbGDzpYZxawBmOwsFovdiTphUq6WM0Xxw5tA8TijrXc1DJax07XPYE47TS\n06AaAb2OwWGpe61cxx1KML4MoKmpqSxtwDE4LHMPFzoDJdMHFztBqWRycjLhnLthEX888DWTCRfR\nXSxQ\/ptw8DnTsaF4fn723N\/fm8xozGq0EZowsxvzWlpamnOl\/fz8dL2+vhovLy\/y9PQkDw8PKukS\nlgMSCAScKy3PRCinE+79\/V3e3t7EAiUklUNpxZGlTzj0l27dCFTOAv34+FDhk1MLOM0JK3FjQnVe\nWRwGXlrWlQVF1fWFZKIM2fbBwHZwo7dMnoI8Zmgl1q3Ko4ZKMmhmZGSw94K2wmFtubBbDa4u\/gzB\nO+E7KNVkUvk9GPbvWoAEuBV4s3K3fgclJK0lJiZGDQZevyOWgnhuWtvB+qWJL9XDfSEJCQkSDAZ1\nxzYGbgUf4xIvMJowX15gPA35C1NcXJyzYYAP4zliUxDpRC8qKlLKAVwqKyv5i2c46v\/z9+cXEwQO\nFFza2jgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_platinumium_spork-1348275121.swf",
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
	"collectible",
	"artifact",
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

log.info("artifact_platinumium_spork.js LOADED");

// generated ok 2012-10-14 22:04:38 by mackenzie
