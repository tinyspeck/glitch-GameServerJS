//#include include/food.js, include/takeable.js

var label = "Bean";
var version = "1354597515";
var name_single = "Bean";
var name_plural = "Beans";
var article = "a";
var description = "A bean. It can be used for cooking, or it can be seasoned to turn it into seeds for different trees and plants.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 1;
var input_for = [1,19,75,76,77,78,79,80,82,195,323];
var parent_classes = ["bean_plain", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.season = { // defined by bean_plain
	"name"				: "season",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Season to taste",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('botany_1')) return {state:null};

		if (!pc.items_find_working_tool('bean_seasoner')) return {state:'disabled', reason: "You could season this with a working Bean Seasoner."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var tool = pc.items_find_working_tool('bean_seasoner');
		return tool.verbs['use'].handler.call(tool, pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be seasoned with a <a href=\"\/items\/261\/\" glitch=\"item|bean_seasoner\">Bean Seasoner<\/a>, turning it into seeds for other trees and plants. Requires <a href=\"\/skills\/15\/\" glitch=\"skill|botany_1\">Botany<\/a>."]);
	out.push([2, "This can be harvested from a <a href=\"\/items\/100\/\" glitch=\"item|trant_bean\">Bean Tree<\/a>."]);
	return out;
}

var tags = [
	"food",
	"basic_resource",
	"trantproduct",
	"nobag_food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-11,"w":19,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADbUlEQVR42u2XS0xTQRSGSUzYsjJx\nx9pFuS0FLM9KaWPUSB\/Q8KYFAUUMSFtoeQkoKFSgigRCNKiIBoFSRXygEsRE1BAXLrowGokxuiUx\nMTFuxvsPufUWb19IojH3JP+qc898c\/45M9OoKDHEEEMMMcQQY5tjB6vof4qofDCNKepJdJj7k1fM\nfYqXpc49q\/kd8sVDVklV1ag85q\/C1Y4r60\/cVBFOdROZpGo4jVRcTCXlF1KI8WT8R70jThVxYtus\nWmubUS\/x1TCjqbNPqcNesXUmy9Tg1pDNsk6rfZBQwekEUtqbZAorKQAojEBiyOZWr1vcmUwkcC13\nsqkcnv2+PLXXM32AZa5kktsqI1a3KjYkIGvBUuPsPnL2YQnpXTCTrvsFgqANsxplOHDINf16gAwv\nW8jAkyo\/SA4Qyu+Uk5LeRFdQuJoJVezxq3tJx3wuOb9YTbxfVsiC9xppvn1QsJKw\/Lfqu9Uu\/rhn\n79wE8eLDPM3Z\/aDI99uRkV82F3YnEr1DuhwUsHIwWQnAU\/fyaDKs+unbKb+kkWhk2Urhvv\/4RiZe\nddOcqCL3+9HRdD\/AnGYpCQmIj9rvGmgyTkgOwXbspXDgkOPz+nsKBxf4+QIB6u1McMBipyIeg9Fl\nzkflfkn5apvT+SbBngI0qo79Ova8lUyuOun2QPXhAv9bLFLIYuxBfWPcp5BNYjqn+AqbkQCTolGg\nQIBYCCDQCIEWxAljuSax3MryaxKDgyG6RsYTEtDYKhs\/PJhCE4RjJSoSCoxrDnQ09131pQwfHHuz\nUHv1dok2JOCBmt0alBvlh9WhADEpJheqdN\/jCvob\/2jZfAZC7G1CDE3Meti3iNYmuQFInPb1k1lb\n6mAhwRVsHz5c0ZmN5jA0S9sjuemi2f3gBSTsRtJwqhlMqFrlUKofXHFPEoVjj5e1iB8N6cZdO7Ot\nEi\/OJnO\/giY\/djmDThQuLB4HNWNKv27lHgm4f2nlWGsLu2SxW3qJGHvkMTktsjkkQkIk5iaB\/TjH\nAokPxAkLhaVYNIVzMGtsFZk\/fjKVDShMOnvcGxwFsN3UpxAEEBIeArASjbDRqRSM5LZJXdv+Fszr\nTNCylni4CkB4hWByIQGEG8fZyTbDlS1bGpH9bTIlOi\/bIhnS2ZmlQDI0ST0Yh\/Hivx0xxBBDjP8w\nfgJkN0KelEjKdgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bean_plain-1334602478.swf",
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
	"food",
	"basic_resource",
	"trantproduct",
	"nobag_food"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"o"	: "season"
};

log.info("bean_plain.js LOADED");

// generated ok 2012-12-03 21:05:15 by martlume
