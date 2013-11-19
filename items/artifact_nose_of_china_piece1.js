//#include include/takeable.js

var label = "Piece of Fake Nose Made of China";
var version = "1350087195";
var name_single = "Piece of Fake Nose Made of China";
var name_plural = "Pieces of Fake Nose Made of China";
var article = "a";
var description = "A single and somewhat snotty half of a fake nose made from delicate china.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_nose_of_china_piece1", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1313\/\" glitch=\"item|artifact_nose_of_china\">Fake Nose Made of China<\/a> artifact."]);
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
		'position': {"x":-7,"y":-15,"w":14,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFu0lEQVR42sWY7U+TZxTG+Q\/4E\/iw\nZMtMFmYWEzeXMHQ6AmIRB9MOUmlZeesLUKFYVlrepEWgUHkpoBTQAUOxgIow1MJAkQk0TmHidKjj\nTdhoFuem24ez59zxeXzaPi3gWmhyhaZ8+eU693XOuW8\/vw34NFXlyI26VIuhUG5FZSsOW49I+JoM\n6aEgv838DPWaAocv1diGe0zgrM7TOtBkCu0ZEr58U+BmbncJhi7V2LngaJ01F0CG9Eug3JzZUDev\nJQQHXlfz7SN5hwE1lC+E68Y0uFKlhMFOIwN4vllHAGnIDYFbmb8a8EOhiIEbkIbBtYTdjPqTQ2Cg\nJosAmkqVDCBKkcIP8CkcrIz5z0522mYnu4Ct+33VMKoXM5AIPVgihdToXZAUvgPEu7YSxQe\/x\/Mp\n3J9zN2z2xwPwbO4G\/PHke+ACpR2tO7Ad4ra95SDhjncNPgN8uTyuoQRs\/f7LVRfIBwMn4Yp4N2R+\nssUFUPThO1afwP27PBHkDIf6++ktmP\/pogvkWSkPkj962xXw4y12n5T2xfK4nQsQxVXqem0CpOwP\nglRBuIt8UVqDOzgUnkc23Mh39VBZrHBIL1vpkphAL7o3EeAJDvXX4igD9+h2B3Q0HYNj6kS3gF5t\n2C+WxqyrAbIdHO0\/CaeMKg9wpGFrvAL3z29jgtXg2GfwwXg7XGg9DiV5UgKilMdCRVEaKbcsMQYS\nhdFEScIog8+Dwdbyw34COGE1Q2t9HgFD1RmyoKQwE+JFiRAVFQs7d4YQBQeHWL1Q2nHzWuBQ2Gbw\n7PWfryCOoXvomkaVDjExXzEKDd3\/CvAzm096nqfyTo20gIVar1TpAtBrkqFCn+UAh4qM5DMu\/r+2\nsjRmW497pLX01UOtQQnqjDioKlHBYYHYBZDPFzGAb7w0rDUYKJzJCPfkjgUut5dBvkoMJ\/RHOOFo\n7dkTTgCT4qKCfBoMHHFzU90E8N5oK3xTpyWlTUpIcguHCguLJIChoaE8r08MtlYeWZneN06lt6xQ\nDlkKmUc4FI8XTQD50RHr64Uv7ROBa4XDyUG7h+ppLwWdNs0BRJqSQlJMKzsz1aHd7Nu7V+P1ieHc\n9+jzZ67KYc4d\/sUEnzZpXNRQqQalQkIAw0LDzD4JxvP5EYfF4PZQM3GLdi5frSDtpu9cOfR1VML5\nM+VwrrkMGqtzGdCDn0fAgYhwq9eDgXp6v9cBsLu1zKG0ZxuPMxemfK0WZLKjjMp1KgKIvfKLAzyr\n14PhvFbNUNOjXK8iYLGxYkiVKxm4WqPOAQ5VXKAmgFplPMgSDoJXg8G1OQ9RIBgAgSARUlIyiWMI\nd6HN6AJHHCzOYwBxHHo1GM53D3QPFwOZRALJyRkEAF2j3WuoLibnT5GucguoFEf5+yQYtHvfnsoH\nrVrNANCACMZ1DotyVQ6AbhdXEoylsZm1lnZhusfFPdyaBy9WOwCU6Qtcnj7o\/+MRqC7NZgA9vjJw\nXR\/daennPhf3bINNBM7ZISznta5qBg6\/428SiRJEomSmzbwC1LzxHYOrIb9uzF0MHFcrQSD8DZWl\n\/JrAYYgy02UMILXM2t2ev7UGg+sqibpzvcWhhFzthBYNly6TkimCcOS+4u457tnCjaD1LgJszU1d\ndDljOC3YSWVLKJSQGcwed3UGpfsRtzjda10tEM6T4jVcN9y62sj5Boh9D51kqyj3KLmPsOGaa3I8\nX5Zm73YJsMRcCcblk72hOOvuSBuZr54eK2nhLGaDndKnwpnaHMH69z9qkjxfvMlbnL5s4HpSo\/X4\nRwu0UT2PHY7V4JpOqMAo3ge6kPdndHu2euclYeVhvz+6\/Otkp4UN2Es5h015NTi8EyOcSRUH+vBt\nUHpop6G9Vunvm1dUCnZhqjvo3s02ntlwRNPZojd4eo\/GOwnC1WTEQHHEdrNRuDfQbzM+wz21guFL\nJisb9oqlwkbBWRpK0gS6Tz9Yt2P\/AZMcU+4lLxmtAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_nose_of_china_piece1-1348253337.swf",
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

log.info("artifact_nose_of_china_piece1.js LOADED");

// generated ok 2012-10-12 17:13:15 by martlume
