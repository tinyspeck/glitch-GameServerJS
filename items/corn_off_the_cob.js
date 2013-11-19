//#include include/food.js, include/takeable.js

var label = "Corn-off-the-Cob";
var version = "1348007937";
var name_single = "Corn-off-the-Cob";
var name_plural = "Corn-off-the-Cobs";
var article = "a";
var description = "All the goodness of corn-on-the-cob, without the cob.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 55;
var input_for = [];
var parent_classes = ["corn_off_the_cob", "food", "takeable"];
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !(pc.skills_has("cheffery_3"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/69\/\" glitch=\"skill|cheffery_3\">Cheffery III<\/a>."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-17,"w":40,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEKUlEQVR42u2W32tbdRjGgyD+mNoJ\nik4v4o85YWKLu9KroChTUCt4MRQhOtQLYQ7\/AAneilB35430boKwxUns7Eqb2JVqkrZZlnOS1Obk\npPm5nCY5aZqmLU37+L5vPGkKOqd0dRfnhYeTb845PZ\/v8z7vSR0Ou+yyyy677LLrRqv884GBjfmP\nvdvK8379vGPwlgNcGjvoaQWfgDF2P7RzDj330x1eOg7972BYeNfTVl5E5ofbkD7vEBnjD6MydUw+\nk5su7XtH3\/6Dlc642bW87y6zePEAsj\/ejsbMS0Dy9S4oi8F1r+P0vsKxI+vhp5D33SkQ0D9Bc9op\nkPydMfEY2om3YIFTqyN0NNPnHM6bChaPx53V+TOe4vgRnZ1pRV+VzDEIryu\/PInG9OFd7a5fflwg\nWYWRuyOcyz1t+czMTF8ikXBnMhlvLpdDWf2qAzN5tOvQtYnDqM2+jYr\/UdQCD8l3xUuPyPneVvNm\n+Fzmt89QLpf91Wp1yDTNwVqt9u+BQ6GQK5lMDmuaZubzeRTyGVwLn5SHMogReBrG5ICAskucvfrk\nITnPba5dPtJ1lwF7YRcuHEIu+jUIDAQoqtfrOmm40Wi4m83mwF9Czc3NOSORiIdaqVOBwQSuUCC4\nD3YcG70PlfEHBIBlPZjPQTuJVuhoZ+27V9renW66luFZyUtvgDtCUFheXhYRnGhlZUXW3RYGg0E3\nKUKtRDabhaFfRCP9DUoLF1AsFmHMfYSWcqIDRc6xO9yy2tSz4mbr6mB3YKxN8HXWujeTson4y8DV\nfpRmT+2CYpF7WF9fx8bGRgeQwUgg18QplvHrcclSfOwdUIuRjX2L2NiHKAWeEyjLBb6GjxZUfuQg\nWrMv7Mqd5SC\/G8U53zFkRvuRHXkQVyY+l+cxFGttbQ2rq6vIF4qmqiY8AkjUJg0AYrGYiFtb0EPQ\nomdBGUSpVOJASzv0ieM7cATKD2YoK2+yZmAaEJ5mq60MqoyekE1GAl+CDYlGo1haWhIgdmyZXEzr\nGShKfIhM2RkaAH0kN2mYdmAahiGuscRNWvMfYjFoKpVCWvUhNXUK2uT73SFhsGaov9tGFn9mKHaK\noXq1uLgoYNxWBoup6jC\/xv75FwJwkYa2t7d5qsRBdo+P9FoQ8fRZE1jO+KH6P4UW\/AKL\/lco\/G92\nXjPUdm4nw4TDYaTTaYFioM3NTbrfpM1qNw72N7BO0mmC9XM+OMwMValUZPqsCaxfeU9C3448g0zg\nNckzA7E4Mnwfh35raws1un\/+9wVqpeqn61x799vbicIgR4GATX5gq9WSh1e076SdKe89iEyflQ1Y\n2Wq32+JYpVK9OWDXAR7gKJAiDNErdoqrRa6XKcPxRBIxRdX3Bex6USB58WdxvhQ1LmCKknDfUv+8\nsru6nnP95\/DbZZdddtll157UH+ue\/5w4A8SgAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/corn_off_the_cob-1334340343.swf",
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
	"foodbonus"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("corn_off_the_cob.js LOADED");

// generated ok 2012-09-18 15:38:57 by martlume
