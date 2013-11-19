//#include include/food.js, include/takeable.js

var label = "Cucumber";
var version = "1354598409";
var name_single = "Cucumber";
var name_plural = "Cucumbers";
var article = "a";
var description = "An innocuous cucumber.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 4;
var input_for = [15,143,337];
var parent_classes = ["cucumber", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_cucumber"	// defined by crop_base (overridden by cucumber)
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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/320\/\" glitch=\"item|seed_cucumber\">Cucumber Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-14,"w":40,"h":13},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGKUlEQVR42s3Y6VJTZxgHcO7AsRUh\nOfvBQFmziUKCCcomFhcoa1gSFrMISYRAAgWNrGGriLZ+6HSGS\/ASuASmV+AlME4v4N\/nPckJQe03\nT+yZycDH3zzP+yzvW1Lynb7QLmcNbIlHw+vyaW9aPu1Zk0\/vryqn7Sn5ccn3\/OYI9mxP+DC1LcG3\nIeOXtIJHLxTcX1XRvlKBe8sV8KTUk++Ci+7z3tihgukdCaObMvpfyXj8UkF3Aa41VYE7yQo4psR0\ncSN3IKaj+yJ8aQG+dQkDOdyDNRUdv6p5nIdw7sUK2CeF8yJGTjhhuGBGwsSWhMF1GU8I9zPhOgnX\ntnKBa1m6gea4CusED3uIsxYNFyKcn3BD6wrGd+x4kq4qwKl5HPs1RmQ0jPNwBq9eMQwW3L16ZW5f\nPGO48K6IgFYUNzC134zhbRu6VrM4b1LFnSX6JbO45nkVjqci6sa4j8aeuRwuQrhJwk1s1yD02gMf\nRU+v2AtcNnouOns3wxKsAYGAfNq4yO0Jp3OvLZjdE7WKDRAucuTBeMaZr1jvkoKWhJLHscJonJWz\n0RvlPhmWXsJ9YJFjP4YLHzqQ+qsLgf3Gy7gFOY\/Tzl1UpjOXjV7DhEHRK8Q9JVxwz465Yw8erlSh\nfUnU2omOKyyKWzFFw9mmKXo+7m9jqvWNeqLjQrsywgcORN96MLJVl28nrckvcY0xihydOztLrc\/8\nyZDWwlpJJCNkcRkZEcLFGG67Dj2E69JxCRne1GdpDUlwUPTqxzhUD5t6DZsQ2XYiEc6G6HELfIR7\nmJuxdwtwbWsWeJctWuQcQRGeeQLPKqgZLE8Y0UrieRxFcO43B+bfezC0UXkJdyeHY0XRvkrtZF7R\nUqpFbpxD7bD52y8H1EL8Oi6yIyCyb6W0tmA4U42ORUGrWC\/BGE5fAFhab8cV2GYErSioWim1\/AdD\nthKCnWuR2+HxjHDxYxcGN2gjWeDQkZLgXSTcgnxpxn6Oswb4M2dK\/bb9ju1zl3AHVsy\/dcG3ackv\nAN5FiapVuoRreq4aj2NTohA3q+GaMbp1gWslnOu5iLvLBdsJzVfrFG88Tp+vwW0e0UMrEu\/cGCNc\nL23FPVQUdwtwejvRcY3U62wBg3CFU4LhIrtVWPzdjfFtC\/oIxyq2LSnBXYBjReFKVGg4Nl\/rxw3E\n5RdOwoUzlUj92UrbiSV\/n+hYlrM42use7VRfwjm1VkK4SYNwejthZy5I6Uz+4cbAywq6T2RxXSsK\nXDFBw7GiaKb\/m5\/LDATHjKgtno6QZFBacxXLcNObKlKEm9yx5O8T3asKRe4C59EjN5lNawONL\/p7\nYghOr9jZXQH+tITl924Ediox+OriPuGO89qM\/QI3c4EzbiM+VM5CGdqG6QaWeteEmd1KGmEKegnX\nk9tO2PqktxPXQhFx0T3+iJ27sRccku9uIXRQgxG6ZPfl2olnXqC9TkbLvJhtJ+yaSE24KLjYgfBY\n24Y3OCTeOGmvu8CxdnJvSdJmrN5O3AlVi5x9OoujRhw39CamF0XssB7PDmswWvA80ZbDsUt258tK\nuBeUHE7QcLUjnN\/YmxhddlhRRDIWRF83YKzgeaKTeh1bAPQXABa5hgCXw\/HnxuNot2O46Q0BiWMn\nxgk3RK2FVWw7TYlWip6Oa9FxU9nI1fvMxr5IzR6aJJbaibQZcwfV8G\/L2vPEg2URXRQ5tgB00KJ5\nb4Wuh7Rs2mhCMFz9KHduOE4fZQwXzqjUiFUME44tAN0rslYU7AWgk1Z1V0zSUmqbzOFGyr2G41j0\nAq84jKU5wsn5ir2\/QilNZnGsYt1x+RKudqgIDzvsG31hOupLlSOwKeYfFLtSItpTsnbJZmOseY5W\npUnWQujn486qfSapaE9j\/cvlHx8umtC\/JuLRqoT2BK+1E+0FIKGgKUz9zW9Grc\/M7q1n6oCBL05f\n+7qjZXiQ5DWYN26GO8rRuaNpQSm9HWTPEGbUDJtQP8IdFR3HPvfENXhCZXCHy9EUNMEeKCMYr0Wu\nevA63VdNxanU\/\/oaR66d3vKX4qa\/DPaJMjgDJtQMXUdlb+k\/VX2lR0U9b1\/7nJS2+oEfjuoGrqGm\nvxSEOq98Unoi9\/z4U8n\/4PsXzrt8v4k3iH4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cucumber-1334211658.swf",
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
	"crop",
	"croppery_gardening_supplies"
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

log.info("cucumber.js LOADED");

// generated ok 2012-12-03 21:20:09 by martlume
