//#include include/takeable.js

var label = "Caiyotite Necklace";
var version = "1350441337";
var name_single = "Caiyotite Necklace";
var name_plural = "Caiyotite Necklaces";
var article = "a";
var description = "A necklace of 17 multi-coloured beads, traditionally given as gifts between the ancients to celebrate a successful Feat. Possibly the most democratically forged (and cheap) ancient jewellery, the beads were first forged when devotees of all the giants came together, each bringing their sacred stones and melding them over intense heat to form this marbled, chaotic but undeniably pleasing piece.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_rhyolite", "takeable"];
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
		'position': {"x":-16,"y":-14,"w":32,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEeElEQVR42u1XW1MbZRjuP8j0F6T2\nyo6OucA6hRkN1pnW6dQitOkY2iFUSnUKNjZUYmXCkjSQUJCUgwPK6MpJh+MGIocGwoYclmQJWUjI\nmWQJCRR0zN7gML163eD0zjpEF7nJM7OzV9+3z\/e+3\/s8z544kUUWWWSRxbFgfz\/F3w67pBuWEcrZ\nJhMcGxFIpXiRqBcNrVogujzLJH0E\/pvHIvS5cSZux4DofABVl87wj43gdtCBJcgpCI21AoEqYVxZ\nBJPDLVRoYRicPzWBS3WdPqjodoyfiJDC\/6dqALx4aBlJpbb5irt5aJP8IjWhuY1Tqms6lewtgc86\nQkf0bfS0thztUomxjTUbHSWnwa0rx4+c3O\/b0SqfFYOAXQ8eywhMdsuYmKn\/pS2MxHx00DQARHcN\njFdfQY6c4JXcM1JLnxKsugpwNJeD\/fHHzLz88t8OAU17CrZW5oHs1wBae5mpOH9EdzHFDgJpHBI+\nf74nUMtyddV33kQqL7yOTN6\/KBXlnOS9bN1uMiTwWMYZv4+EeWMPHX9GSzgnt8ckBXTUQ8VWzRBx\nTsEGoYfQ9\/JDyUafTiHbmB+AUC8CoT4VBNl3EK3RcSoZYbue8mKtQPaoYOFxGZhV4ow+kP\/GaelY\nwyeMPb2ener+5ho+Z5JBNJZS9ffOIQ9v5UhaP30fcSsLCzLdk\/I7dT7SCGHnJPj0HTBacZ6fcdV+\n3YlLE5EVzLFglHYjN\/FhVTGVloz\/ej3+YHYK6PUVCP7yHTjapWB8dBPLeJOk17a5NtEFHnYTj+Fb\nsP\/wJbi0Ih4X99dDGIXUzI+Yvl2G4V99iBTnvZJ5e8+9ekoyUHeDsTfdBqu2FAhNiY4LcmvOp5Ld\n8DIdXRgCZ921w+vf3m5SEPM58KjfidOUCUnLhroqFxefPSUsy+NGp\/b39\/n+AAmhpyhYW+6CovDs\n4SyO2aELYl4rBM2DEJ7oZNupgAH5e1KupWmTXtPFWZfpRYpgSSmiDr3wa61CsDL0BDOobzCWhhJm\n7IsPODXv9VWbxO824y7HNBOYRqnKd1\/LPGapq\/L46ZZyXbVA1Iv41ghYN\/WDs68BsNrizDqTTiCJ\n0DIWDZJ40k\/odlif5JJggnUa60gTzDSWg1tZRGfmpeksFnYxARsGUUMnuIefwNSjq3jD\/Vyha25E\nQlG4zu8y4rHR5n8cEvf8qOBZIiJMH\/YgqdB+YdhPMtEVM6wvz9LmQc2\/64xcfoe3aOhF5zSltE0j\ngRmlSJomt0AY6AiFQ9g8BDY2DmlFObwXB\/KSRnTVNUsFiYkD791KhBA6tATrSzOw4Z6DpfF22qRv\nhcW+Olj9uRGs3zwAW+1V7sIAO9HSrYADXGgdOJvKoK3qHTp9N9MP5bEyEXIG\/JPdMFgvhi7tR2h0\ncQI8PXXgYCP8nLqE1t57u6Cj8Z6kV34ddarFuKHyArf\/Hc2sabcoPhM+vFUoVIpyhadP\/hWbduM+\nZJMygbX9c3DUF0N\/Wf5BVTqa1fxqcb4Er76EvKh0FllkkUUWWRw\/\/gRczNk4hL3YxwAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_rhyolite-1350441337.swf",
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

log.info("artifact_necklace_rhyolite.js LOADED");

// generated ok 2012-10-16 19:35:37
