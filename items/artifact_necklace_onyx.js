//#include include/takeable.js

var label = "Gnipperite Gnecklace";
var version = "1350441002";
var name_single = "Gnipperite Gnecklace";
var name_plural = "Gnipperite Gnecklaces";
var article = "a";
var description = "A necklace of 19 beads, as black as night. Given by the followers of Friendly to their loved ones on Recurse Eve, in mourning for the year that had passed and holding the promise of Recurse and the year to come. It was also said that the original Gnipperite Gnecklace, owned by a ancient called Masha, had hollow beads, each big enough to hold a stiff swig of hooch. But this reproduction, cheaper version, is boringly solid.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_onyx", "takeable"];
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
		'position': {"x":-16,"y":-17,"w":29,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEiElEQVR42u1YS28bVRTOLlI3USQW\nsezY4\/Fj\/BjPe\/waJzN27DiJ0zjvBzVxSGlVCqmVAJVSGlkgSosqiAQIUCUUIaRuEPIWsZmf4D0b\niyViMT\/hcM+gVGrVpHY8aZDIWY5m7v3u+c75zndnYOAyLuMyLj7EaNQnxuN8sVgcyqnq75P6GIyn\nkx0tKdcvFBg9PDyUS6rt2uI8vLlQBYmLd+anJuHnH76Ht9dWQFNl80IBBilKnzJ0+PrR59D8cBfS\nsggI8IuDe3CzVgUxwZrxcJiPBIP668saTQ9lFblV0nNmVhGqlYJqLUwZsDI7A1IibmVlyUKKy7oA\n1aJiZ3S2NIFgLZfL5Tt3gATE0cb8HDy8vw9r1VlobKmmyDKmEI+YAWq0evxe1O\/3IbBvHj6A3Rvb\nYGTSQHm951+TIhuH5coMPG4ewHr1KslMRD8p04WcZm2vr8LizJRNP+XxnA\/ViRhTzSWVpiom9JxK\nt7MyA2VjHLKKBH6SqZO+w\/rDdzDjeJi0LDifwbDfz0\/nDbhdr9mdOjnONSmvp0kapOl3u\/nTvg1R\nVAMPgk30yd0PoDiW67+r42E\/b6TTJlmsJYpxno2ETKTop+++hXc3a5i1ZrdrkYM0fB43bC5X7Axm\nFLE\/gMNE17Kq1L5xbR3u796B2WLBClDeIz3lh7W5EkzldeAYptHLej6Pp71+VQCRjXUCFFXtC6DH\nM6KrAgcIECnBLvx0L8mzDN1imZDJBOlD3LRXWTIysjlf\/leWzgRMEbhDrI+MIh3SPreVz8QAtUwR\n+I7TsoQjsceaC9er5RJ8tn8XUBLmS7JJe71NmhS4E8LarSydDJBQh5326OBjeGdjDdJS903QTfjc\nblNPhbqSpeeCKH99IqeZSVGwshJlU6pnUhAJBxzTKtzDyKTaBU2CEE0fvkqWngU5BT8xplkfvXcL\ndra38GQd1DVqdLTqFLgX9yjkMq1eXEhzLKXCvcb7cOf6FuRzGcdtUV97eEZG9LkiQ0xlCgjNIMQi\nR07SiqVDFKE9oYV63wPbPJdSTC4Ws4KUr02EuN6rtvVaOl3vgcMbJWVnu25rkpxg4T9DKwYXZRoI\n7OmPT2xLnhIFcHfbWa+YFqhvZJTVNcUPlUL2bKWDC2lk1ua1DBncEjDBgCPNoSmyeWyppg2h1ROt\n502xo5bqZRQzNN3odT4eU4rXTbRUQoyGa4uz\/VsqXHg8pbYjwQAslBVQuIRtx\/HaaGTTR2ehdK4k\nHZbHox0+FnXGUiFIvAYqXNjuuP3GDjz56jEsTJfhtNIQEwn93FzyyyIpCHWF52CJZPCt5QXAxnnR\nTdv3kUhQr0zkiSteBGL92+h00lL42T2jb5d8Woy6XF8KbPxvReT+nDZirbGkaqFZ3d+5bbtpfEfm\nOWtrdQl++\/UX+yDXV+UjIxVuO0ZptyFzbENTZbhZ24CDvYbtph\/sZZto15crGtRXlmCmYEDidf4l\neG4EiqKP1NpfeMFG60Vs2B\/43Ot21yMBGrAcWCbcGrjIGBwcDLhHRm4RUJtvXLniuvxvdxn\/h\/gH\n3zso7M0dzukAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_onyx-1350441001.swf",
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

log.info("artifact_necklace_onyx.js LOADED");

// generated ok 2012-10-16 19:30:02
