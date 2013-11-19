//#include include/takeable.js

var label = "Piece of Woolly Glove Darned with a Metal Finger";
var version = "1350087107";
var name_single = "Piece of Woolly Glove Darned with a Metal Finger";
var name_plural = "Pieces of Woolly Glove Darned with a Metal Finger";
var article = "a";
var description = "A shred of wool and a chunk of metal that look remarkably like one third of a glove.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_glove_metal_finger_piece2", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1316\/\" glitch=\"item|artifact_glove_metal_finger\">Wooly Glove Darned with a Metal Finger<\/a> artifact."]);
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
		'position': {"x":-17,"y":-22,"w":35,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFHElEQVR42u2YaVZbRxCFvQM7kZgH\nCUloNKOYgyQmMWMxC4gxDjEmJhgchpOfLMFL0BJYAktgCVqCltCpr0WJh4Kxcw4x\/qE+p454T0\/d\nt27dut2PZ88qozIqozK+\/zjding+rYRz7+YC+V8nWszCYJOZ62+8TrbX7jwpqNPN2M7ZRuzq43LY\n\/DbjN8uJZjPSWWviQbfpDbtNor3GzA82Xq+lPFdryebc+oj3oiv4ouN\/B3eSjXWcZWOF842YOVmL\nmC1hbaq33gy9rLbARrtqzUx\/vVkcbjICysbmeIt5M+kze\/Ot5kMmlCe57bQ3tTzW4nl05g6XQoV0\nT53pC7sskG1ZuC9SZQaiVYb7mV+aTHbUa36fDZiDTMjA8F+SCAlpHMk9Bc\/z0331NiSBqw+LoVIc\nvArmDpfDFwRJsf6DAM82ohejXTUWnMZ22mfezbUa9LeSbLaL7kz5hamgDVgj3kucZaMW4J+LIZsY\nzCINBfh22m+\/I6H74nS9+HukdbgYOo77fnp+F6CU1gmOGIy5ZSGv\/SFAV1Meu\/iWLE7w9x+vguZ4\nJXyHRcDzXZHFRguQZDUhDZ6TqpWS0+Ca78c66z6XAPJFv4BKtFWZZHu1GX5ZZa8BSnnJUkun2oPZ\n1+kiUGegXdijxMhhfdRj5gYapLEajDRWaQ60DPiJeK3ZGPNalt\/fVMT+Tp5ZGGq6LAEE2KSA0Zjo\nrrWAAQlAZYVysxCfS7IILGlwT2zJPg8T+8Iw1wpaQaU6aqwbOGMiXidW1mifsc9KgtxLtFXnLMCF\nocY7AJkIJgG4NuKxi1JadIj9ELszgTtaVH3CACwTr9NFZvU3AN5fCJq3U\/7C1rgv1x10XxDxoOsy\n3uq+ws7KgyaxZgwwykG3wuiYNA4xEHGVFl5KFBtGWVy9+aSUb6Z8tlRqPQSAnMDKNXckGt6bD1xu\njnpTKjl8tSvgTmlIk0QzRyuRApnSbR+XwhbsrNgNtAMyIYBpCMoFiwSAYVFBUJrZ\/qLW0BX3y5uD\n0I52NgYNhwXtzrc8bPrnm+HUeTZ6rewoQ4NRt7DXZEvpXOzT6q1NnNhm8pgZkYdaE0mXA1UpaDid\ngLnYYmeH6jwPgjyQLBGsBiXHepgAtmBPdXfiYIPvN4W94bZqK\/Kl4WYrGdXktqP8+wvFBJ1eqIzK\nGoUH2cQ0t8QHtWkASMMwMWUFIH8fZP6tK4ISq8h7Qm67IwE6WdzLS3blZBaQgEUCJL47GyiMdX2B\nyb\/XfM+l1JeYKYZNiRWgcydxgoNJtruDm++FhTy7AkIvdqsrD2D2d3xSfRFAyqQG17hGd6sr97Am\ns5Fjdhr2ZwVIg5RnTyB0EmKf1gWPVyKXzvmKYF15GEUCevhwahVgSGNcvFjYv\/qmkw6LwSSfK0lP\naW9WcIAqL\/NtRHNUxDmn+N4OQO1JSY5z2BusauAGHFbwx2878XBOFCZhBk2lb5yfbqVp7jPsO\/u0\nOAOJls+rQFWvAIZd1rD3yw8OXzuW7c0EUp1+VwZtSBSYkK2LbU93jHJLue3OWIFE75sboLqbMHe8\n9efj\/wTuS8NOLJMCdLKn3gofW3ECRZsw7wD6+bu\/LljxS+bYiJo02ycdSmfDpHqd9dJp\/9O82wC0\nP1KVn+5tKB2t8E3tboJrOUQUnuzlC+3ge70i9Il4vbWM1eTtWRAXoHOf\/NW1q+WFR49QmDMvXmPd\nt\/HDvGMXu9597Tzjcf3D\/TMARvWM9ygWUhmVURmV8TjjH3jnNVIWBObTAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_glove_metal_finger_piece2-1348197980.swf",
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

log.info("artifact_glove_metal_finger_piece2.js LOADED");

// generated ok 2012-10-12 17:11:47 by martlume
