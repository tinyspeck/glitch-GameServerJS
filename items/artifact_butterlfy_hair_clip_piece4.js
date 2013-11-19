//#include include/takeable.js

var label = "A Piece of Butterfly Bone Hair Clip";
var version = "1348197865";
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
var parent_classes = ["artifact_butterlfy_hair_clip_piece4", "takeable"];
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
		'position': {"x":-11,"y":-17,"w":22,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGKUlEQVR42u2Y61JaVxTH8wY+go\/g\nI\/C90wyxTWO1KCLeL6BGQfByUERBuctFQD2KilxEBBQNKMdLkmrSlDSJppkkQ9okTTqd8TzC6lm7\n4sToZPpBjR\/cM2vOePaZvX97rbX\/a8m1a1fjalyNsx2zoz18naqBEZVc519KwDePw7RloBnEgm8j\nlwbqxa6\/IDY7zLpNHeA0yMA21IaAzKUBfLu3SGc2JiHuGwarthW6FHWgUMkujwcPXqfyHjE0G6I1\nMD5tzc5trIDZ64L1P1+a5h7uUvQ2Q9FbTASfpnCIMgaDvJxpg8G8C4VNHRzkOfTtEbWyGqrLb9By\nl4sAuH5J5SGgZz2VNcwHQR\/ys8NBP33hgDmP3k2MZvWaVugzD4Lcas5opqekE1tpHmd891ryEDIA\n+qCf0c8HhBcO+u5pvCD6cAsW9p7A\/JMM+B7uwOTdTeBCDa7kKhwBHtl\/Hr1QWObv95Q\/EWQ1hl5w\nx8Owkn1FYBGS8oyypkiIJrm5mWY860lmNLnC2pZjBHg4GMhw3pWeO+xSQC90GeXQUPk9VEprWHsi\nTgDNi2GoU\/XADVE5I+5UCKvlcgKCaeBYXWaJh4OByHDIz9eHw\/nnCvl81yc09kuh16Amof403Ajc\nrBuEig4ZtA5paYXDinnKG99YJ2lAPHlK2A1hfwHCnxnk2JRFOL2RhGGTChR9Chjw0kBvbxBYBHWv\n3YEelxMGpidhcHoqi+Aj8eiJHDWEAhT3zCL4mYf\/TthCbSecwMkQSOqKQVxbRltjCzwO0ERvMiyC\njjFrn4Gdbqih5xLuD\/sx3utf57NMzAY23W1obxKwFT9dN4lLvsknoIeQ5sUFAtI6rAORrA1adFoi\nV+jBc8\/JVMqV934vSu3\/7IP04giMGJVc2OXgWIqwhjkvKO0jUN7eBkX1tVDa2gxKmxU6rGYOcpA5\nc5DgRC8v\/c8HXvrjez7KTii1wMf3OL9\/byb\/6W4w4tvZBs9qHPq1ClC2CqFSfAsEVcKMWNYiPFOg\n9L1lfvheMrLy+H5mITELz3fn4EFqDGifHVbfvCaiPZFOgoc2AjYX7\/aixJ6+2ILk2zdkPrSzARNR\nHwyomqBOVMhiVzSkqqe5p1RUev1k3r18FKLfPltk\/3gSgZ07HuLi9YO\/8tEb6x\/fmRZ\/f8Z4fE7T\nb9teyHU045NG8N7fhlDIAUzUBpMBN\/kb8wsNId3WLghN9JP59JILYi\/2j+Y50QaH1w73Vl2Q2ZyC\nV49CkAybwaiWwAlI3BQ334jZyWJMwh0Zi8xmbF4nSWZccDy5DL5xDSxMDZIbKm8SZNUOEzhX4kAZ\nB8DFVZHc5jnrdZihRFgEZaXfgdqohpnd+wQM5yyxCBhDfpjz9MGDtXHIPg6TPrNWVAgVgm8LjgEm\nAgYGvTJp6yKAm3E7zLpUpO\/TDMoBBRUX7bPqoFhYlBEICskCN6sqGQWX3Khvn8PlDCuJdFBDvul0\n2IAac5NSl5OZdlldZtyqhO1lJxj7JVBVxsdGWHoM0KWV53EwkVTEksHTICy2UnjyImExp\/R+wEXx\nlkkG+kExYskqbBamoVfFYnXAjdEzDepeaOQMq0P\/FE28j4dzrCwTSWkz6qFE0kihLua0DqtFW2MJ\nxXmPlVT\/kDnhvWPdybOoEGVhcUYHcmkpCU9hhQjEHXKyqc7vg8b+PiIJaKhf+OzkJMMUCYOgWcJJ\nx22o6emC+l4KmwUChnPoMe4QR70jqRjzQTa3N2rkqRfkWGcStVNcuMGpl4Gk5hbcLC\/L\/NhQD2Jl\nB5S2NIPWNwMtQ1oCJreYjkDRVGNuMlfVpSTznTYLH21g1htBT9kTS8RyAowlDA2b3P8tIfFpbYFB\n3UjVlt+g0NXFTU28qk4F1FDdRExrurugVT9EgDDMyhGLFAs\/F24hl4umbq7OYlOAqYDvciBYY3Mh\nRc+dqe7d1g9J0VvV3Z0gkrdz3jkEPAT4dGDt5MLNEK+OWI9AsFM519KltFkyHCgJn8xkIDmHHjzt\nWwRBOLxEuXfn3pBiYmM+cTeUbdSoj\/LuS9\/joS78HyWExAuAOfYlQByYm502W\/6FQ+LF4IxFu7Q\/\nHuVCfql\/4foq4bsaV+MrjX8BV3w+HmmhUAEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_butterlfy_hair_clip_piece4-1348197864.swf",
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

log.info("artifact_butterlfy_hair_clip_piece4.js LOADED");

// generated ok 2012-09-20 20:24:25
