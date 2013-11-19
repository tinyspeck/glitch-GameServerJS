//#include include/takeable.js

var label = "Barnacle Talc";
var version = "1353110971";
var name_single = "Barnacle Talc";
var name_plural = "Barnacle Talc";
var article = "a";
var description = "The post-Grinder form of the lovable <a href=\"\/items\/639\/\" glitch=\"item|barnacle\">barnacle<\/a>, this smooth off-white powder is bound to be good for something. If only you knew what…";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 15;
var input_for = [178,199,200,209,261,304,321];
var parent_classes = ["barnacle_talc", "takeable"];
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
	"barnacle",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-25,"w":57,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFeklEQVR42u2X2VIbVxCG\/QZ6BB5B\nj6B7h4QkFVeqEsd2YhxD7IDNLjCREJuAAe0rQvs6QvuC0GhDgNhkxmGzwbFJ5cK+ix6h0+fIIqlU\nqpzNy4W6qmvmjDQ13\/x\/dx\/p0qVmNKMZzWhGM96bePE81fJkx1+scibBewn34izFH256oRzX2d4b\nsF+fcYKXT1OSF2fJ2suzFPy47oG1hB5yIWUxH2Ja3incT3z4+uOdZXhU9sBRJYBHF6ynTVCIaiAf\nVcMqOw9R56SNNQ2+XcufVVnBYYWNHG4GYL\/kgmrBDg+LTjjZYWFr1YKAWlhhGYi7psCpHQKXQVxM\nuSfejpqFuFq0nbPWfj6Iwja3BDucFfYKTni8y8LpXhDXNthImyHplUPEPgFB6xiE7eMQceD5klTx\nRuEOK\/5uvuypHW354WDDRxU72Q7AxooZNjOLcFjxwiaer6C1Ce8McBE1BcvFdJDyMxB1T4HfPPpm\nLD\/eYm37JTfCGNFOBwXay9vh\/CACvxzHUE0LVDJmql7UOUFVqycCxvUQsEjAa3oAHsMwOHVi3sL0\n\/j+WH677hSfbbPfxVgAqWF\/ZsAIbwYh154DtrBX4NSeuDcCFlVCMaWiDrAQY0hwUKuKcugALIbBL\nJwaLohfUk3dq87Lbwv\/UCNidqJoHFXPRPHtYr7GdnI2CkfojihWwY7MhBQJqaebR2lxYBWn\/LHiM\nI+DSi2lm2Dm8NgOLC\/eBkbTD1MiNmmzwqvBfwT0seXgCVcUGIFYSsLWkEXIRDdbZInbrIsLoEEyJ\n37FRextgCc80VSvhkaOdQ2DXDFDbS3E1qjtLYZXjHSDt+wJG7l3hB7+98vdrsopw+ZiO5xAk5p2F\nhG+OzjYyPghYNqSC9ZQRgUywElwAr0UKfqsMX2ARR44VFZqjdnpNo6jeA3q0qvohu8xAyifH7p7G\nuhxDyCGYGPoK+jo\/hnu3PuB7b15+fU3uF1zCvbyD383VFYt6ZiDsmobVZSVaaYIyKkh2iVJcR5Mo\nFkOVfEtS\/NyAFjJ0vDi0g2BT90MIO9iFsAS4FFdhY+kpJIFlLaNYh50I11rP9tYapsRrHhVVi67u\njH++bv16xigsp4xte3mnogG2nV1ChSyvLFRhA6gvwBo1Vk7qIB1k6EhJ+mbQujm0V0EBrKo+bIQe\n0M92gYm5h4rJcNzI8ChF2ydx1IyAzzQM5vku6O346HfIVzkz2l7cydmLuYiqm0KSKU+od3O2GrGR\nZDlpgCTOrjQCEDC6fb0C28qaYBXtDWGnxtzTEMcsRJX4MvPUQrumn4JNj9wA1UQnqtkHbrS0AWZX\n94JmqhNBvqZA0v4vYV7arlgNqnjybC6kpD82nu7GRRf2HmwGio\/WPOd1+\/S1TICJFKOaCCl6vAHV\nUWLt6amVRCmiWAqVozuGYxyvLVD1iFI+8wPQz3wPw91XYODOJyDu+gymxNfAMHsXtNPfwWjP5zB4\n91MYH7oGcc9svZwc48UG1FrCILkAfL6fanlW5QT4JUm9gznBftkrYk1y2lkcKxcsW8e6\/WbJORkb\nfwSL486wbJWCG2uMgIVsY7iWYM2JQTXZUbcPa8uuGa7JBq5GSI3db7\/cdv\/Wh6Keb1qFfz1BOME\/\nGDecAEeN5LgS5MlQJrZGcFy4cUwEFn+gjaAYvw0LstvYGAPUWlJ\/aBf0dbQROEkhrhcdoTthx1gb\nUeRgw0\/d4EtuBb4sFYWIRLa\/02rs+mZK2\/JkL9b2WjByU+O8sT6qBLEDFeBS9wiZkZstWnlXWy6q\nPU\/gOCK7hXqyw0bUIUnGBrlnPaG+UIqsDyqsqJw2i07wmPHLhQ0r3+hPMlIe6QBz\/c8POd1PCMuo\nYPPPUDOa0YxmNOPdxW+6BsZe3AcF8AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/barnacle_talc-1334274751.swf",
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
	"barnacle",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("barnacle_talc.js LOADED");

// generated ok 2012-11-16 16:09:31 by martlume
