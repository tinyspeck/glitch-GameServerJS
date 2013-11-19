//#include include/food.js, include/takeable.js

var label = "Pinch of Salt";
var version = "1354588325";
var name_single = "Pinch of Salt";
var name_plural = "Pinches of Salt";
var article = "a";
var description = "A tiny pinch of very salty salt.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 2;
var input_for = [17,22,31,33,42,66,83,139,140,143,322,341];
var parent_classes = ["pinch_of_salt", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.5"	// defined by food (overridden by pinch_of_salt)
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

// global block from spice
this.is_spice = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "Additional information on this item is available at the <a href=\"http:\/\/wherecanigetsalt.com\/\" glitch=\"external|http:\/\/wherecanigetsalt.com\/\">following website<\/a>."]);
	if (pc && (!pc.checkItemsInBag("bag_spicerack", 1))) out.push([2, "Spices are much easier to manage if you have a <a href=\"\/items\/271\/\" glitch=\"item|bag_spicerack\">Spice Rack<\/a>."]);
	return out;
}

var tags = [
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-11,"w":32,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACrUlEQVR42u2VW07bQBiF2QFL6BJY\nAktgCVlClpAl5KUvSJUiVZVatQ8QteSBtlghBSFaakqdQGIHN8SJ48Q3bCe+JPHpjBPzkBYJ2nJR\nNZ\/0yxrbmjn\/OePx0hKDwWAwGAzGXWMCy7IVZOtauPLoxLljrGpuKLcvQ0iGj6rm576YWH5wYQCe\nkNqIJlPY\/hg9N0Lfi7DXNFBpGlZZsrIPKS5HyiKFyTTGMJrCIiK7TohzM0BF0lEmQg8uHLksO5n7\nFLZCiscC0SSGE0wwGI6RRi1oIxx1POxIJoqCxpdEd\/U+XLuWYEyjniRRt+wADd3HSW+Iz4qHzW8q\nXh0peHOs8qX6P3aUrL32O9cWmcazqM0RjTqCTKI+HYxQqDRw0HaxXTew+V1DYV\/GVt3m\/srRtoVV\ne4T8TYQtRu2Gs6iVJOoAu6KOtyddIlDHs4qIYnWA5wctvDzqoFjTOb5Njyes1Lp4khxZ\/ux6rTBR\nQ67eizk3QJZ8oBZuSRq15tGoQ\/CKcxX1B9FIoi41bJTqFhGrW7vysNDsA0RgvqbO1q92sJYKXlp\/\n31ym1SRnF32BPqAd0ZpHnJnvvxu5SaMekai\/towk6vWdGs4GPo7VIbYEFe+EPl8592QiBNuCapH1\nsnTdnpOIylIdzfk5SoX+4mIqbBFJQ0bqg+87AHF3g2gpDMNY9gLg+MIhDpiI45ijFU6mHPmquZ4z\nlltmyCl2xBke8PrwgqNmnKrIVETHerF\/zu2LfrIXFQv5aifmrpy7CYmr864Sd0mRyXNph\/TZDz3m\n6MR7kmkJSsivl09zVETabO8S2bNunDh2KI\/4wqcGp7uw6LjIq3j6UcjTea4z5o+hLnTtmKPXdEzF\n7545a6lA6gZ1hu7p9L3k\/rzZW7l1F1ARzcfwX2YwGAwGg\/H\/8hN3lZYFK+WirgAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pinch_of_salt-1334276345.swf",
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
	"spice"
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

log.info("pinch_of_salt.js LOADED");

// generated ok 2012-12-03 18:32:05 by martlume
