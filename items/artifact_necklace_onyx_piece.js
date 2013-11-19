//#include include/takeable.js

var label = "Bead of Gnipperite Gnecklace";
var version = "1350430282";
var name_single = "Bead of Gnipperite Gnecklace";
var name_plural = "Beads of Gnipperite Gnecklace";
var article = "a";
var description = "A single inky bead from a Gnipperite Gnecklace, cold, smooth, and with a faint sparkle of a billion stars when looked at closely. Acquire 19 of them to remember the whole necklace.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 19;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_onyx_piece", "takeable"];
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
	out.push([2, "Collecting 19 of these gets you the <a href=\"\/items\/1363\/\" glitch=\"item|artifact_necklace_onyx\">Gnipperite Gnecklace<\/a> artifact."]);
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
		'position': {"x":-5,"y":-9,"w":9,"h":9},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACzklEQVR42u2WS08TURTHSTC4MLZs\nwLgQaMuj79d0pi2dTqe0FGiBAhJogTDyEJSHlQQKwcSKim6MJBqMiYn42JgY1i4bXfol+Aj9CH\/v\nubGJC3embUzmn5zc3DuL+c35n3PuNDXp0qVLly5duv5rCYJgVCMhbUDuL1EoIanUH\/CXQoKgJZNJ\nY0PhEnK4kI6rlezQICaGU6A1nYgjGZXBQBH2+ypyUCw0BC6pyKXxVBIzYxksTE1gcXqKr7PZUQ6a\nikURDYoIeNxQJKlUV7iheDwzNphALjuGtYU57KyvYm\/jDnbWVrHO9vmJcRA8sxxhwQ+f04GwKMbq\nApdKpa6kYvLFzfQwVvI5FLc2cHx4gBePHuLZ4T7b38XqXA7TmREMqQpkSYTgchLkRV0AI5KgjcRV\nbu3msobH+7v49PYU386\/4sPpaxwVd7G5tMizmx5QeS2SzY6+XqihkFZzwKgknlUBt1Zu4cnBHs4\/\nf8TPH9\/x5f07ti9ie2Xpr4CC23VW+wwGhDI1AFlM9Xd4fxuvnh+zLL7By6dHfL+2MI\/p0TSG1Rii\nvy229\/aQzeWaA4Z83jIVPzXJ3GSW2anxunuwcw\/FzQ1uL51TJyfkCG8Sr8MOa7eFrXUAJJsoK4OK\nzCFyk+NYys\/i9nwey\/kZ3sE0E6tjRvS64bL2ocdkgt\/lOKsDoLMg+Tz85TSQM2wwVwc1RSY5wOGp\n9oI+Lzx2G8+epbMDajhY+6FN1xerpYro9aBfFNBqMKDVaMD19nYGFWQQIUTYOX0EWUu1123qYqD2\nSt2uPsqi22aF5PfBaLiKS83NPC63tPCMUVPQ8ypc3bL3p4J+74mT1RaFmQFIYgDX2tpgtVjgYGB9\nFjMsXZ3cXiUonjTkPg4JXo0Ae80mDkQrNQOBmTtu8CymFEVraqSorsKiUPA6bGUPhc1WdtmsZbK0\n4b9bunTp0qVLl65\/1i\/Uf2ZYaQ3NJAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_onyx_piece-1350348731.swf",
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

log.info("artifact_necklace_onyx_piece.js LOADED");

// generated ok 2012-10-16 16:31:22 by martlume
