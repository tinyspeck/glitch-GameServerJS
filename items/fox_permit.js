//#include include/takeable.js

var label = "Fox-Brushing Permit";
var version = "1339712453";
var name_single = "Fox-Brushing Permit";
var name_plural = "Fox-Brushing Permits";
var article = "a";
var description = "In order to keep entry to the Fox Brushing Preserves entirely fair and balanced, a permit can be procured directly from the Fox Ranger. Long form birth certificate not currently required for permit procurement.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 300;
var input_for = [];
var parent_classes = ["fox_permit", "takeable"];
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
	"no_rube",
	"no_trade",
	"bureaucracy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-33,"y":-22,"w":65,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHAUlEQVR42u2XWVBTVxjHffClL\/rg\nQx\/qtLWtVNEWtS7FVnGpy4hK1Rl3R8Wt6iijoiAusYKKiA2gKKIsspgIokG2hEAIBJJAgCQQIZGt\n7liXdMpDH\/893zE3vSBjAy71wTPzn1xyb3J++X\/L+Rgw4MP6sDxfJqMyoL5a6fPeAtbolR0mgxIm\ng0ry3sHVGlRrX8ApUWtUwWbRlrW11Q5+r9wzm0rQ1FCBdofRrTa7MaWjpcbvf4Uz1xQH3bKWu6Fa\nGjUwynf3BO1ocxik7Y7qd5ujjfUan5amKqcYrip9K7QJS9FkzO4G6Zbd4GTAZQTcYTcGkMPdZDcG\n3euok3Q9ux302oBsE7N4c3KOIG26NK5eAf9DHber4XzcjC5ni9\/rwkl7wtXmHeOAVk1Cr4CUo5ba\nUl5M9NrabHDfu2XRsvdK8OiuBX89u53yWnAUCvHGjvoCFIWP4dKcmc9FoOJnWpr0ECpdUF118b\/w\nLI8J8OEdS1fQ9o2z2DZe\/XOOtQ\/KI\/Hm5JwAKEgV6ctzkZw1K6UcmByszD0NnWwfqq6GQpu8iT9D\n39FoLoPdpoO6UJ7JtpnPNKefoTXeEMD0FbmwN1a4C4RAyb2esGIRkOAuFZSQCs3se+6113aNHum1\nzAU4rO+hZRUmdq6hrgTnzkYgPzcVtYYiNyyFnJxTn57Zq7PkKFU5vQrfdafVBFWBTHDPtz9wAWIw\nck\/sJAHmZCWyPFLza+EeOUROEZgYslmXhEd3LHj68Ba6nrXgeWez2L2P+tzv7I06p1B15NT17IvQ\nlmTz69ZmPRy2SnbMKVFdVYB8xWXU16hRz4rAcauS32+zG7hjuqS1bufINedjOwcU5V7fisPRqPMx\n6YucQuWVqK5yp2gDAkxLlSLqZCjKi7NQeTMF+WlSxB7ZgYy4I0g8GQLZqX3IjT2A3LNHUHEjCbrc\nZOTFHUJmWCAy9geinfW9x\/caOl1wU\/oE1x4X4tNamOa0XY6GWZHsbg95ilRErvdHcUYMqq4nQp0U\niZjQDTgXtgmK8+G4GXeQ3YvFtegQXL9wHPLzx3A5Mhhpx3ah+NpFZBzajHz2XM7JPaww6pCWFCd1\nAQ7yGK5lha+fddkPqFg0CekzRiN71reQrV8Ao+YGh0w\/ugPxu1dDdmIXZAc2IDd6L06tmIbobUuQ\nEryau0OQijMSDkqSR+xEEXOYrgmSfhyrXME9b4\/haPDMXDnbefbHETgwbhh2ffMp1\/GJX0G+ag7M\nmmwUxkugvRKL\/MTj3DV9USZKZWegz7+MgpRoaLPOISUqBOkndiM1NJA9d4IDEljm4S0ovBCBuw6D\n4N4MpoEew1njjzhjJ3+Nrd5DET7hS+wfOwwhYz7nr4WLJkOzeCKyWHgIUqyM8J1IYDCXDm7hYSap\nZPFIPh0GWXw4ylkOWuteNGzKvbutpjaXe0M8rlZ9crTTsW4md4vg4pmLF6aORMKUkSBHqzcvRM1K\nP5wN3tDrYU+FoyrIRLY8AWqlnDVgHRdVuHBtZxX\/5EEjJIf2hLJtx3vW5xzVa+kIUx0PRu2SSZB8\n9wVimItSXy9c8vPmwKHMxcqfJ+Dm3DGQLJ\/brQ8WF15xN2pqKQSUmBAJRU6SG0wQudfaZGhwHWcD\n+zSZWMsVHOg0AyMHfx3\/JYc9xf5O9Z8E21JfXjD7V\/n36h7Jyhq5AKPX5bkldm+h\/+xAtvXHrwTD\n87bB99vrynpulLc3EPXLp8C00R+p00ehaN5YWFdPhyZgIlKnjYIkYCouJUa9BNjCGrLNUsZDW16a\nw0BLX3KP3NWVKRQeH2d\/P2\/\/7MlDm\/TpA5vzfkc9C5MOWZIgHsZi\/3HcLcFRCvGeBX48nD3PZAqz\n2VTcDUacd4J7NBD4jB6xuM\/HGa1ydU40O3660tctQNSk4Ty0pG2smjeM+ARBDI6OODEcwZKb9D4N\nDfQe\/VAaQHu6d7\/D3ZSH9meSog\/NpwM7du8v6sSw7QhesxBhE4dj+4zxuHrxFHdKDEdFIc+M71Ys\nwthus2hYyKvAxjM8+N3MhwJXYfj2B26gq9znC6IWwAbITmNlAWsbV7qN54LINTqLyUEau4QfQIVS\nlJfO8k3PBwFhWlkcMG+Nxw35FaBDXZ2du1mqylZQuOh4o4lFnHcEFnVyPyLC93BAQQRO7j7rbHID\n3shKSvS4IXu46OD2EdxsazZ0sgTvFl5hDhTGLwp3jPSw28nOe1YO5wqt14C3tAa6QOdUaW8qKJfE\noGJRkVDRCFP24\/sNPLTfjx\/707v4P53agje5SY5Qs6WBszdQclCtlOHPP+yIijwY9Lp51x9Qr4ij\nIcFNFq2BudRFTlELIWcFUf7J0xOi+jTjvYVFSe8d89vRbTSy19eo1OQuidLhTRfFmyqsIS4NGvBh\nfVivXv8AzY4k2SCjv8oAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/fox_permit-1339712452.swf",
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
	"no_trade",
	"bureaucracy"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("fox_permit.js LOADED");

// generated ok 2012-06-14 15:20:53
