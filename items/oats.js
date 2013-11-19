//#include include/food.js, include/takeable.js

var label = "Oats";
var version = "1354601499";
var name_single = "Oats";
var name_plural = "Oats";
var article = "an";
var description = "Regular non-wild oats.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 8;
var input_for = [31,33,85,90,93,305];
var parent_classes = ["oats", "food", "takeable"];
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
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-14,"w":33,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEFklEQVR42u1W204bVxTlD\/IJ+YR8\nAi99KEgtlXIhgkYOAYcECAYKjUMKboKaqk0ISZWqIiSympCGS8CYYMzF9pjxBfBlxh7bmIuRBTaQ\nNm1HSqu+7s466XGhFxW1EKnSbGnJ8syZc9Zee+09U1Skhx566KGHHnr8L0NyVB\/Ny52GZd8H1q1Y\nl5DwfmTbfT8ndRTn5E4LMNv71pE3Su7HyOUj\/lGDKs\/UU06+TnnlNsVmG2jV3yqn55osYWed9eXy\nHUq4GxmQxBsjB2XSYptV8XxI4rP3aX78HIUd5xmRFX8bZUNXaSPaRfnEF+wX191Py9XDJyZ3mjLB\ny+rSXDNtKzcoHbhGC+NnKThmoOnHx8n1tJwh7KwnRTDT3HAFLU6cp+cP32H38RzIH4qaoUljcWbe\nzA7Ix65Tau4KU0+avqiRqClAcTeRrF2LTNYwiCOVjFhOshSA579N3zMcKMGZx8etKJU0XY9yvVat\n\/3dV+OFq5iuKu1sKBEMT58gzUE6LjgvMp8Bm7DYJg5U9B0Is4Wk4tr7YbkMzbEQslAl9wsqKwwO2\nMzT7zUlSPK0Uc7VQSuygwJiR4q4GWl8w02qgVfNfA1uLZ0AUEAZPv07AUa1KWmX2NS7gL4wDdODL\ndLdlbeFaGa5LU3UqSgeVXqS6GQGuGtTwaSXkarl\/82DEWbtH2dWgubAGiE7VUsLTyO5lw1fVlUCb\ngHH1t6NI60I1OFZFUAkkcPD0k1MW+\/0Sk2\/kDCurNGOioL2a4EOUGj7aWfqSKcIPZuoMVewp+Yvk\nZ\/TL9hCzBF8Ha2CP3euA7zMPhLjrkpDyNgsgjdm6pfTYisbvlxRz2PtKyxT3pZ7NqEXIhtplkIYa\na\/OdbEMkwr0WmmwslJsDRMQRg9bF7azLgYDdSFFN1XzsBtsL8NsMtB7qYmLspO7Sqw0rEwHnrWmK\n7yS7KRu9ScLw2b0d7x2qFJAdNsFMA5nvlro1733KuhT\/VwJm8o1WaYTgtzqGqNP4J6LwKFdOGKyg\nn3OPWJIgwRL3mtgaJIqhjjNxtqaiOvvkRNlflnym\/4TKR0bC08LGSVLsUIP2KkF8VqmiKXCPb4aS\ng\/Rm7NYeNcOOGkYgLTYzYPRgry3l88KzvFlEzUbbybvMNtgLHtZs8O\/G0OLz6ix\/Y2AzDOyfNh+R\nd7gqyzMWBipMsAL8yxsGa39Yvaf5uFZm\/u4rtbgHTlkjjhoB0MaYTRw1CmO9JQyOB6VH\/5FMXuo4\nxl74GjCoQWDi4bsyGgEqxl1N2SX\/x4Kz\/2TP7nI4v37PwokByz7t9RfuoqT3Ctl73zYcyIdAdOqC\nwEvI1crHb8n7\/SrBut3NB+xLlf0EsuQ+Q0ehNOp6HwXGL2YP7JD\/Gn\/MHtC\/gPXQQw899NDjUOJX\nLqMzXygiqhgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/oats-1334212891.swf",
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
	"food"
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

log.info("oats.js LOADED");

// generated ok 2012-12-03 22:11:39 by martlume
