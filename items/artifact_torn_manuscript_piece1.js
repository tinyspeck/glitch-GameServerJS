//#include include/takeable.js

var label = "Piece of Torn Manuscript";
var version = "1350087217";
var name_single = "Piece of Torn Manuscript";
var name_plural = "Pieces of Torn Manuscript";
var article = "a";
var description = "One of four pieces of paper and frame that, when stitched together, create a string of words which probably shouldn't be read.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_torn_manuscript_piece1", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1308\/\" glitch=\"item|artifact_torn_manuscript\">Torn Manuscript<\/a> artifact."]);
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
		'position': {"x":-33,"y":-18,"w":66,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADK0lEQVR42u2V7W7aZhiGcwY7hP1N\nKSTQJbRbcGywA+bTGAeDjW2MsbEx+VrV0Kpr5H1JVddOaZdO+6i2qFu1\/lr51f31oeQQegj3XpMt\nUrpF66RNkyZf0iWQDe9zcz+WWFiIiYmJiYmJiYn5v\/D9Zxv086NK8PxRNfz5a2H28qko\/OeBfjzk\ng68+5cJ7twu44dOwB3loPQ59JYe9YRZffsKezL5pBC+ftd7+1wP99EWZfnKXCx5\/xIb3SaB9Esgx\n8zAHFRi2iNG2Am+rA9dvw39fg+3LGJgbGBtZ3J1S+O5ecfbiyT\/Y6u8NPQry4cODqKF1WDoF3SjO\nAzmTDrztLpyRCMuoQJcL0DYZ9CR6\/t6y6uS+AndHgWlVoclXMXWzePABc3J8vxg8e1z5e62++LY+\nbygKdHiHw60JA9dkYOgb0AYCrHEbYzLM9SQ4ZLjVK8HsknV2WBgkkN7OnwWMVFvrUEQKBvmc47Yw\nua5jSL5raAwG8jLsTgp\/GejoQy54eMCGD25xuO0XMDFZ9LUSFKMGcyTBJS35ZFWeI5KwNTh6GbbG\nY0iGWmrxjQJGdps5yE0KgsSiJRXg9ZagCIsn5wL98oNIP\/28EhwdlMKPdxjsmBQZsA6nX4GqkxUN\nm+T5kTEhz9HWeBMTuwnfamA8IKsi4dx+9Y0DdoQcpNq7EPgsyoUM8mtJMO8lUa2sot1YwkhJYSin\njhfURiLYd1fDqbdKUl+FKVNQZQbdXhmqWYftkSCkpV3iHlnhkFy3ejwGagldkSaH5bBZj1wjA9dQ\n5VbIwCvg52bA5zNgqSUy\/PKfyuYSKOcvQSwtoi9dhqOkXm0b6cOxnqHnrdndFEwpgY3yGkpVCnxt\nHbVmHmX+GmrFLOrE6JWlUhcOeV2OSqBI\/1GeSaDOnYaRyovQxUukpSR8LY0968rsjs\/sjtrvvHVu\nrRMjfeyqS1DFZbTqGQjVU6ODNivJuUojCVU4NfqVdic5f0Zed7ufxu4gc05yLbzprZw5dVcOp95K\nELk\/XqXPmrqIKDEJ2ff19Gyip8OLJPePfSMd\/OZudHDklpZZjv8jY2JiYmJiYmIu4lfI7BmouqiG\newAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_torn_manuscript_piece1-1348253796.swf",
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

log.info("artifact_torn_manuscript_piece1.js LOADED");

// generated ok 2012-10-12 17:13:37 by martlume
