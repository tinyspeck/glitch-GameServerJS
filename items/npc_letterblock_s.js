//#include include/takeable.js

var label = "Letter Block S";
var version = "1337965213";
var name_single = "Letter Block S";
var name_plural = "Letter Block S";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_letterblock_s", "takeable"];
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
	"letterblock",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-70,"y":-116,"w":137,"h":133},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEFElEQVR42u2XXVMbdRTGe+eFH8EL\nP4YfwCuvqlWnM9IWwUopHcXSN2sHKpIa5aUlm83mZfOy2Wx2s0lISCBZEhaSohSwtFNpQChS1KmO\n2lHbSqUtjI+7\/23BVGa8yerNPjO\/mcw\/yeyTc55zdrNrlyVLlixZsvS\/6Wh46DmbnH2VSaXqjwkF\nwhkxX+\/PpHakVBLqUwW5vkPK720N5l6ouaGXqPwzTZ7UkcNsRjrNp1eDQ0mMT2iUZZQnEoTRcgKp\nYhyDowlk1OQWSikJdVLBhXQOjZS4\/to5D2pusM4Rm9pHxfA2FcYhJ7dFIxWBfv5vNHtkNDNxnHZS\n8EXo2hvUL8IE+1Ap2rFc7sXNifNVrFzsw3zxE8yr3bg6Rm1xRXWgOEThsFvE3u4Q1Ew\/6IjbHINZ\n0Ya7lQDWvgrh3nyQvH6wKmNlPoOFikLY+FHF5vc53F2SsPmNxqpIcKck7O8L4mrZg8YeEwx+EBSg\nxLoMY\/MB3LnuR1HlSev+3sq3GJlwysehUqKxfoMnMANRUsHK5yz2dDG1N3iAkjAs2XB\/kSNcm47g\ngHPbWINTJJncr33uyVlUduHWDP24gkaL5z7zmWPwoEsiLf7zWwn4Lga7VD0EvOzGZLIdy7Mc2gLG\nWT\/vxUz6LDHoSUvE4JVxD96wm1RB3eDvWv7uL3E46t+ulF7JE6yA8lQOmz+XcHs5AybOIxnuwGy2\ns6rFM6MMjrtMWDPN2hTqBn+dY3Gn4scFWdhxnTS4ZLCKgl9uTeLhanwrEu6kgHdoPy4VaPRwXvOm\nWL+Y3ubla7GqDD7NETaBaZUlFX\/4dQTisIBWzaBewQ99JlTwTafR4kcrArngI606M9NJtHi3W30q\nVG3SHvLjy0I3+Y5ukGSw5MFJl4l78I+lMH6qGBM8kmXw2wIP9eI\/zemc9IUxJp7Bxs0o2LQxxVPj\nLNqcJhrUA\/\/DnHF7e88bwRcFh5ZJY3F7U9W57AoGUAgfJxXPFAQ0UwEoCotD5z3mGdQz9WA5glZW\nQgMdA5cVEVUVDJQVtAUTRv68MfK+GLZhaqCd5PZSOYSugA\/xQR8O9pqwZhppI4P3FoKERJ7fvnu4\nnppkSkCA\/QhjkRNYWwxpezCK\/GiYtLiQoSDItFkVPEeqoYdeZ2mWx9AIh\/6wC+0uitDntiPLvY\/r\nIx+TH6JHQt+bqsoRg7k0hXcdnss1NxhMcRgZ1PK2GNMmWCas3YhifUXSBocnhomZx3vvCXo2dRyy\nMcUt\/e7be2z08zU3aBf4y\/qy7pIHYYtnt+hNDcObVwjRsSIGJlQkxrVMjueQLOVJNvnCEJoYCa9\/\nGth4uZN+0ZRH\/B6ef7YjHN3d4hWP7XPKZ3eiziG566hYaCeaGJF9pdOx2\/qzZMmSJUuW\/jv9BV8G\nY2xU65zMAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-03\/1268375176-7283.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: true,
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
	"letterblock",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("npc_letterblock_s.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
