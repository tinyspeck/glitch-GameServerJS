//#include include/food.js, include/takeable.js

var label = "Best Bean Dip";
var version = "1348007922";
var name_single = "Best Bean Dip";
var name_plural = "Best Bean Dips";
var article = "a";
var description = "Bowl of beany, dippy bean dip.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 54;
var input_for = [];
var parent_classes = ["best_bean_dip", "food", "takeable"];
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
	if (pc && !pc.making_recipe_is_known("19")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> and complete the associated quest."]);
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
		'position': {"x":-14,"y":-18,"w":27,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHNElEQVR42u2Y+1NTZxrH+Q\/8E\/gT\n\/GF\/67Citd3ZtTuDdrbbapGrWrkoVCqsVqWtu6vrJeGm3CKJXCVAg1wEAcFgBCQhOUnIjVxO7ic3\nCFe73bH97nMOa7rbdpxWpdsfeGa+c3LOeybv53yf53nzniQlbcd2bMd2\/PoCS5d3aJv\/kKpt3Zf8\n\/bGMq3vSxH1ZE9cGc5P\/f4ChK0WLc6ega3kH+pb9Ew7psTjbnAdfVwkmZTkoadoHgoxL7mZnOuXH\ndtib8lLB\/SNT2\/LHna8N4tC1N5LPjxxOPVr129T3Lv9mB3\/N21um83ScxLr2AsBdgWcsR4B8Inof\nloYc+BWl8PedxaWqfShseAvNrR\/CeTsPK5rzwv2M7EDcWJ+jmJfkZr4S3LufvpF8ums\/PhtJxwnZ\nHpytelvKthUqgg8vE8AZrM6ew4bxM6ww52GWHxQAbZJcBDpOIDDwqeAk7+iC9BhcBOjpK8XiTBm0\nt9KgrU6H7kYGDPU5rL7+JUGdwI682ndQKNuLvMbdOHP1TcyKP4BLfgqBkS\/gJ5AgD9NeCHfzcUHe\nljwwNemCbJIj8LQWwN2SD1dzPrzkKtv1CWxNH0Ffmw1N5SHMVR+G+XY+DA1HWMasFvNzvhDK\/BWS\nmXWI7\/tjOimzgFvtF5F5NQUFV3ah\/+oBwSVTfTZ8PZ\/A310iAHK9peD6\/oKIvIjOC2FtzIH+xmHB\nPa8AWACPogzsnWI4O4phkRyF\/mYWzJJjmG88ClVdJhR176Nc+nucbH4TotFLOp6BZ0mAGdexk9mA\n7kFwGRfHVPhY\/iUu3bkNg7QQPRV\/hqE2C0bSfF0WPAQnALZvOhjsPoWQvBhhAgx1nkSQ0h\/oKYGH\nnNNUHISRHshPjru\/LBXc57NgIAftBHtTlIYsUQqON+xGcdtefNyxF+X9ZzAaewb12rfgmXi2JCKO\n6zeALwZHMCS\/BCc9MRUyTI1HYGrIFQBNdM5SqvgG8RKcv7MIgd4yODoLUdOXBXH3B5TCYgTvf05j\nxaCuFtx2yj4SUuygOrRLjwspdshL4B0qR+nf30LGlRQcvbEL+ZLdyL+1G7UNB3GP5TC6+A14Jp4t\nif\/A69HMKExNedDXZQvp5MXDPf\/slB3fLHhKXWDsr2B7T0PamwNxfxYudKehtX4\/1eQJmBuyoaNG\ncNH9XP8pPDV9TjVYQA2zCWiho4cAuyk72X9LQea1FORV7MJN8T7MVqZD2VeLR8vf4jlXknH5n4rn\nJ3qXFXPyiwmouaoPBfeMBG2mo6O1EL67Z4RG0crzBbhzbQdQ1LAHk6L34GsrFB7ETEsO3yAxVSmW\n9aUwNP9JyIaeHthC9bfQXvQfM3KhoWbRVKVDXZ0BTfsFaJlHCbjh0LIiyR5eLDfFVmBc\/VdigAlF\nMKfsgmasGdbOs7DTpPx6xqeLpYk97SfhIZgOySGcE\/8Og6J3wVBz+IcuwEd1yMN5ek7D2VYAqywb\nNukRGs8Q6o9vEBM1iKGtDOphCdQqBdQmDZhwNDG\/kltGi82L63pbeZI9Gk+1hmKwR5bArX8Fdu1r\nWNafJW7mZYjEYGRtMDMPYFEPwKa8DcdQBZy8hr8Tf80+JIb9nhgL90SwDYpgHbwOy8B1zKs6Mf+k\nDwbjY+j\/CyYBFV5Dj8mJepUalQ9UEGtMEBnsqUInW7hY3MzFEF7bQGTtqXAMkYIrGzAtrkETW4N2\n+Wswa9\/84It\/rrRrz6BafIrhwBI6nQE0zjtQZ3SgZkYngPGqGH8MMWONJ5Yaaygq5gG98RUBMLRK\ncCQ\/ATJ0fcYXwpSXg4o06Qli0hvGZCAKpT+KCV8E46Qx0qg3gvs0NuwJY8gTwqA7hAE3hz5St92H\nVguLFosLMrMLUnJLQvpRQJUGIsYmTgC6lpaSeUAzpZpbfYoAwfkIzrNMi9GPAD50BzHuDmCMDWDE\n5ccw6Z7ThwGHD\/0OL3rtXijsHnQveNBlc+MOqcPKvhCwekr7HeCsEdfMrv\/dDZm4qHSei8JJDeMl\nODfJRYDa4C8DWKWc2QScmEIFsyD94U9dcCnZGIzGjeSYK74OJ8HZ4xtU0PEtB6zVLyTcq5zWxWu+\n797zmOdimYZgFCbq6AWCsy5twBhb3XLAG5RSAY6ao0Zve\/EOxxCISJlgBPPRFZh4wMUNPPGHtxSw\nanJWAKya1kl\/0naLIUhtIAImugqGANWh+JYB1mnNm3ATj6U\/a084R5Aacm4usgp1bB1T\/shrB2w0\n2oW0Vk1MS19q46rloqmzvlB8hlvCFK30Kl\/4tQFKGCuqlTPxyjHVq23\/tdTd015O99gbosV5CUpa\niF8VUKKzoHZap6vRml\/fmx8Bpqk8QZ2SHJwgwAcvCSgzLOiaDNa0LXvlfOQP73zoDkjH3f746E8E\n7LC64wQobbG5dv6i78fjLJc6wvqK7rOB8iGnr3yQ1E+6a\/eVE2A5ARbJ7b7U7b86tmM7tuNXHP8G\nKlGyEVMQ5RYAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/best_bean_dip-1334339858.swf",
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

log.info("best_bean_dip.js LOADED");

// generated ok 2012-09-18 15:38:42 by martlume
