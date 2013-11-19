//#include include/food.js, include/takeable.js

var label = "Juicy Carpaccio";
var version = "1354582579";
var name_single = "Juicy Carpaccio";
var name_plural = "Juicy Carpaccios";
var article = "a";
var description = "A tempting platter of juicy carpaccio with all the trimmings.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 71;
var input_for = [];
var parent_classes = ["juicy_carpaccio", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food (overridden by juicy_carpaccio)
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
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
		'position': {"x":-21,"y":-20,"w":41,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALGUlEQVR42u2YeVCTZx7Hmd26nd3u\n1O410zJAQm4VRC1iT2mtx7Rdq\/VoFUEQFFFQ1Fq1tha1HrWtAoKo2HoMLlUQQbnvQIAkkJD7JJAQ\nQBCFqK09p\/Pd53lY0qrt7HS33dk\/fGZ+k0zmfZ\/3836f3xkfn\/vr\/rq\/fr0Vezgw5P8WLi4zkLPh\nxNT6a9euhQ8ODiZfvXo1hVp\/fz+zvr6+lJ6enhSZpjilu7s7mXwPV6lUY39VKABjb926NW9oaKiw\nsjXHGXOIB7tLDwIIAoeBgQFcuXIFBA69vb0gUNjz6SJcbsqGy+WC0+mEw+HQdHR0pHZ1df1y6lOo\nmzdv1t+4cQMejwfDw8P4tG4\/og\/ycOhiLAPpPLgPzk1r0P1xFtx6HYiKzHLr9iHusAAnSrfCYGsD\nAaOQIJCw2WxOq9Wa3NnZ+Z8p++WXX4YTOCcxEED2QKoC3fxMxS6sSOUj6oNAplJ\/YiSc62LQtyUJ\n3VvWwbRrJ9R7DqAwbQNi0\/k4VrqBvVxa0Uo0aAuYyna7HQQQZrPZYzKZ5v0suC+++CL5s88+81y5\n6sa645OhaJfCpFJDnnEUso1bkLbxWdAjXrqXg5UZArRtehmD61egd1UEeiJeRd6SqXh7nRDr9wqZ\ngrsSRFCsewNdvWbQFyZ74\/PPP2duQV+YQMJoNKb+W7Cvv\/465Pbt2xpiTDGLxQKpsgSKw0dQPOFx\nXOKOY3Zkg4Qd8bL9XGb1G2ajLzECg2uj4F69CGt3ixD9EY9d806yyHufo\/DSHYCHL8dj6MZV5qME\nEHq9\/tRPwn311VfziHIeepxUfhNRza4qgvzjU94HUMteI8HqoyKsyhxRJ\/IAFzUxYeiMm8cgNUlz\ncSTqz9gW\/zds2SNE2VMSlE+QsHtrVgfD427CLXcNblyzoaD5IIgrgQgDt9sNg8Hw45BUOQLIJCcX\nQKfTsYvNqnJcWjoOFzkSLxyF2rvZF01TxiB97sOoW\/gQbNN\/g9yJD8C47AWULOBhR8xfsCpDhLf2\nSrAjRYhLc0UoChKhKWs+hjur0FO1BLaahbjhrIFbvpkBfvPNNwySPptY8g\/TB4fAeagTazQaaLVa\nDLpa0aXcB70yF9azz+L8HDHyXxczf1udJcLqTAnWZEuQE\/NXND8+BmWTxiCfAGrDHoDh6d\/i7NQH\nsSE9GGszg5GQMYH4Kx+5O\/zR31WFm0NXMNTdCM+gDbcG9BjuafQCfvvttzS6KYOnvb2dM6pePfU5\nCkfN0ngMg607YbgwEfr2GjhKo9CdS\/xvjYABrjoiRMIRCeQz\/oCm0AdwNvR3qHnyQeQ983tsT+bg\nw5jHUDjzIRxI5KLxpYdxYv4jSMgch\/iPBCh9cxUaFi0bscXLoIiLQGd2NGzZJ3H7+nU0GvPg7LUw\nkQhLqg8hDqf0NDdVNhZg26mZ0LfVQpOzE9WvL0f93Gno3P84HPuCkDubxwDjs4RMxaKFj0A6eQyy\n\/v4nJG4TY9VyXyyP9MPCBb6IXueH5A9CsOlEKBKzgpGUFYLEeC6OcwVeXy4WSaBN8sMlychvtsJ8\nfFBAAs3jZgGjVqudPkTWUyQwQMoQ\/QEN8koozuayG6ThQeh+PxTyiPEoCiabPCdA4m4e3nzXD8cX\njkUsyYP5S\/6Eghf\/iJVJAYh79VHsXPYoDkz2Q+RiX0S+Q17msBiJR4MQ\/SEf60jKyQsSsr2rpopg\neMMfpdMCvcCy16LYEVvccljsBpAjBgX0kNLlBaRHXPFsOAzxU9C1fzJKQkc2zOeIUTlDjNSoQKxI\n45EEzUVsGh9x6QLEHhQhIcEfx2cG4Fw0B58u5ODMEn+8uz4A8ekSlszXHB+HjcsDcClMyODsu\/1Q\nMo1zR3YYBcwsSWBVZxQQdwN2bAmDY\/cUFImF3ptbFwfDdWgytuzkY2UmH7GH+SzPRb7PRdwBHo6+\nwoEiQoy8SC4ubPZHzTt++GQpB0k7uFj7RgA2beQhZS4HpU8J0LHbH2XTeCjiSu4ArJwzmQF+9913\nIOWP8dAAuQNQryjG1cwnUT9nPOSvTER71CT0fhiK\/owpaHhFggMhPGwN42D1Pj4S9vGQuCYAabEc\n1M8UoXk28anNImh2clH3Ip8oLkTddg6OzfJHBlGr9DkhrG9zUTsz8B445pMLAryANNW0tbWNANL0\nMgpobMnD9ZNPY\/iTp9CfFQrT1oloWkQ2GDdSDaiTZ3H52B3sj91P+OPsqzw0RPMZnGG1BG6S+0qn\nCPAPkRD6eBG6DnHQNEuMy9OEqF3Chf7NABRyxffA0Txbtk3EAEkLx463ubnFQxsC0ARNiUcBNe+R\nlDJRiIuBwnvelG50mgTMxSfIA18QoefgBMheEjK4K9liyJYKvNdp3+KjfEkAcoL4KJgqgP09DvJf\n9kNugOiePXOmB8AuTxgJElJeKaC0sbHQZ3jY46GQtIJ4ffDs88gNE3urx6jRjQvmi9GyKgjnAogq\n5Agt28VQvSZBX5YEiuU81C8beXj5RAk69gfiskiM2mfEcJKgaokgNXtlIKr3+CJndgDOTOcwO7\/C\nF20Xubgx2M66HMqgbG1FSUlJtE9f\/8ApCkhTDc2FDLBiEzrOTEPePAlyp4uZXZwvgSp1IgxpIV5g\nw9og1L0mgjt9PKpeJilHLELD3hEFdaR7cZHEbN8hQG8GD8pYLjvaCvJSA85qWKWRUJU+h6Kcx2Bp\niMAtj4M1vvT5VL2a2lpPdXX1WJ8OpzN8aNjDAGl3QSF16hZ0XV6M7vxpcOWHwZk\/FY6ySDiKZkO5\nPtgL6D4QDMeu8SgbTUViMUx5JIFLJOgkoOq1PMgW8VAySfC9q7zIY4DXDGeIYnZsPR0Oqe4c65z+\nVT0gkzWhuLT0+1rs6HTVj7Y\/9JNebDWqYVZeIM1CGcwGFZytGTBWx0OaNMELWBNOnF30vT+VPD8C\n2JgsgHwZ\/55gyAnjQXrQlwHe7LwMa\/F0qG21aGwrYzFAAZtbWlBSVlF\/RydD2nBOl6vbM9qn0U\/a\n3tNZ4q3TszDkkqFf+TaMyo+hPfkCTvgJftQ\/i0iAUEDNSXLcM7jsOmong3k493oAWk\/5wVg2A4OW\nfFy1lsBcMgekk\/Z2T7KmZpSWV2rY0d69Ojqc4XZHF66TnEj7QQpIu+mObgN6GrbDeiEMFpMKdmMT\nmo\/E4NQsPrKf4eE4s0BcXMGH9jTxO\/150kbFQHeOB31eIHR5XGjzONCe94etLgr9fQ50qs8xMFpv\naUtHlaurl6KsvEpTUVHx08OU1doxz2yxe7rdPfjhgHRtwIUBt4FNalqTArXKAjjMctir4mDNm0Bs\nPCx5xO9a0zFM1HYo9qBLlY792XyYKubDJN0IO5lDaBtFUwht7ymglqjW1NyCqppaVFRWFf6ocncv\nMzluk9lWaLM70EdGSFplrpM2iCZPGmWuHgeb1EwdajbNuZ0WuIwlcBqLQeZfDGtSYS5fAIWuBknH\nJsFg1rDunMLRAYkCUuWor1XX1lE4T2V1bcrPnuhMFluKwUimLYsVLvLg\/v4BBkjzJQ2iu+df2glT\nQKe+FA5LC0xWHZrbK9lARAEpmIYFgRx10gYK56ypqY\/+r+ZhchQcvdGcqtMbPVo98ReTBR2OTgZM\nwUYBR+FGh3M6+1K1jEYTVLRkyeWkKsggbWhErVSqqa1vSPlF\/1Ggg7VOZ4zWaA2FGq0eag0pi+1a\ntKk1aFW1o7VNDUWrCnJlG1oUSgKkYErJiH81yJo8UpmssKFBliyTyf43\/+W0txtCVBpdNAFMYdam\nTlESI4DElCnNcmLNinkymTLE5\/66v+6vX3f9E1zQU3PA9snGAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/juicy_carpaccio-1334189993.swf",
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

log.info("juicy_carpaccio.js LOADED");

// generated ok 2012-12-03 16:56:19 by martlume
