//#include include/food.js, include/takeable.js

var label = "Egg";
var version = "1354597642";
var name_single = "Egg";
var name_plural = "Eggs";
var article = "an";
var description = "A plain, unseasoned egg, newly harvested from an <a href=\"\/items\/99\/\" glitch=\"item|trant_egg\">Egg Plant<\/a>. It can be used for all kinds of cooking, or it can be hatched into different animals.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 5;
var input_for = [2,4,10,17,18,51,60,72,73,74,81,82,83,85,88,89,91,325,343];
var parent_classes = ["egg_plain", "food", "takeable"];
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

verbs.give_to_dustbunny = { // defined by egg_plain
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Drag the Egg onto the Dustbunny",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.location.is_newxp) return {state:null};

		return {state:'disabled', reason:'Drag the egg onto the Dustbunny'}
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var pre_msg = this.buildVerbMessage(msg.count, 'give', 'gave', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

verbs.nog = { // defined by egg_plain
	"name"				: "nog",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Nog the Egg",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (isGlitchmas()){
			if (pc.stats_get_daily_counter('egg_nog') >= 1){
				return {state:'disabled', reason:'You\'ve already nogged an Egg today.'};
			}
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.sendActivity('You nogged an egg. It was a creamy, but ultimately unsatisfying experience.');
		pc.stats_add_xp(11, true);
		pc.stats_inc_daily_counter('egg_nog', 1);
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
	"sort_on"			: 55,
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

verbs.season = { // defined by egg_plain
	"name"				: "season",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Season to taste",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('animalhusbandry_1')) return {state:null};

		if (!pc.items_find_working_tool('egg_seasoner')) return {state:'disabled', reason: "You could season this with a working Egg Seasoner."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var tool = pc.items_find_working_tool('egg_seasoner');
		return tool.verbs['use'].handler.call(tool, pc, msg);
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
	"sort_on"			: 57,
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
	out.push([2, "This can be hatched into different animals with the help of an <a href=\"\/items\/262\/\" glitch=\"item|egg_seasoner\">Egg Seasoner<\/a> and a chicken. Requires <a href=\"\/skills\/30\/\" glitch=\"skill|animalhusbandry_1\">Animal Husbandry<\/a>."]);
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
		'position': {"x":-10,"y":-24,"w":19,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGcklEQVR42sWY7U9TZxjG\/Q\/8E\/Zx\nH\/ngl81kwX2YybJsblmMwpCiog5RG5UpbrIqjFJ5UUAQYbwpQVCEFqiIvJUCLS2UFgSlIlCL5W0I\nOLPpjLp7z\/XgOWsLtD2FsSZXImDO+Z37fq7rvk83bVrDZ8HSvHnWXCubMWvUMyaNTtCkrlQ9WqOU\nLTSrNm\/6vz4zplr5tEmzyOBoJU3czSV7ZeLiYNlZ+YaCoWq8Ugxi1qKl+QcdtPi4l2uuv1kEnO6u\nJqc2i0arU6gn74iuWbVz84bATZs1NgDMD3fRi4mhZVqwG0VIZ3MhNZzcRgNFcWTOibGZsw+FbEjl\nALESnCC7JpvaleFkr8kgY3oUPao4R8M3FGTIjHZY8g\/+N5VkYJcAtzhiplcLU\/Tn7PiqgM\/HbaSJ\n\/YhDThur6EldBtdA8Q9kuLTPtu6QzBA7APdsUEdvX78kfF6\/eOaziiN1OdSVvo+3eqA4nvSJ39Lj\nqmQyXY6hzowoxXq31jHTU0ev5l0kfHxVEIJ5hLM4qS8na95RXkVb4UkGuJfW7TyynFPw1jKXvnvz\nmsP9\/e6tTzhulhGTR+zA0QDEWTTnHKaO9Cjd+lSPXfw32z1+0zev\/uCAfz2f9QuIB3IHfNpSyAHH\nNWlkuXqMOtJkZMqK3rFu1Xvx9CGXv9auBog2C2ZBm7uzD5E+NdK2tsxjk0KoHtr6cs4ZENykpZGs\n18\/TUEWyB6QAOFT2E69i+4UIMqTv\/2BN1cNZwk0DrRw0bWuhlqTd1Bj\/uQgHR3epwjngo5tJHLCT\nZWRH6p6SIKOFOZddOFAob5nzjpOlIE4EbFF8w6cKAMdqLnDA7qyD1K6KWJSci3M9daG4KGarcMPR\n1nKaHdQvqxR+7w33+5OBZcsDpkrfVbnYZgD25MaSLiWcui\/ul0mtXgmftyzL3AEB5JF1Iz00N2z0\nOY\/d5Wot9jAKIHWq79hZ3KOWBCisUe6AUjTb1+ATEKFdf2wrFggeN\/rUPSS5vWiJU18pGc47XlYC\nhFluRn5I+uRdbDZH8zYbLx4IleTe29Eh1JMfJwmOnz02Ev0B9mYf5IAtP39FxswDHLAzLVIR6Nai\nxsXgwElDlSRALBPeUMhCbDWujgpxmozeVlKHcjdvMZYHAOrTZDpJ8SK6704+D16ps1cQ1i5UC4B4\nDRBM8rA8gZtEAGSh7Qi0gv8mf3MxVR\/aQoM1WUHBCfkH8evVX1oG2HvlCAeEmyUDwih4ek3sxzT\/\nyOwB1V+ZSuP6Wyu2dSVNdVaIcO6APGoAyBRUBQEI2dWZHAbRA+nT9lNr4s6A4Ny3Gfft2hvQWnA0\nVBIghHkKwFHtFY\/f95eeFTdmf8IbHtoLc2Czbk34cv0AvWW6HMsjCNX1de7c57AQL03x28WO9OXL\nlwEGNJP9AQION0B0rPZ\/UF2h4vyl6b05BDjIkBHF4dpYRevknwR+BqcMt2xCFQDj3VrtiW38Bu6r\nlC+5Rwvai42m8fRnYvWqD4RQ7dGtpFOGB7a8ssPMg1p4UkAiw8R2sX\/D3b5aLBqjqcDDGN4LK4R7\nNJzezgDD1IECyifbr4sBC6FlgboVQtXH6rNWhIP6S+LJVnyKrIVxpGPzeCkHw+UBzuL6ELyBYXcT\nAN0PvD\/hYXhV3i+nHtJm0kRLEdlrs0QZ2NIKwDbVrsBfQyca8xx8Zys4LgnO0VQoPpQ34MS9PJo2\n3KTRu1dFuGFNJunT91JbSphD0j7oupcvEy\/OHIiYEFoHc8BA7uaBU3HeHlw\/IwJiY\/GGe9peRtbS\nBOrKjCFb2TkmxVJ7lWEyye8krM0O7xaNVCk9ouL+tbMeLoUACQk\/O+9k8zEH3a\/4hdqSI7j6yxPJ\nkB0jvXriVt1WHCrkF9ol3BTbMH5G6GIyrGaEpepfZO\/DZWJrUTXAdefKyXotYensKcNCg343dumK\nZYBEfqm\/3+IfyAvOpSvlcGONBR7GQPV0qojgWrsa5P2ikysC4rs\/7785G3JoqqOcn7kRba4HXG\/R\n6eDP3arZ2HAF7XYILcawB9CYOpUaz3xB9cc\/5WpK+JpcLEOdraX0oOoCN4OgftZe4+XD\/Mytqa2+\nvgpx1mco7LeSFrHLQcNVKfRYm0MDN5K4hqpSxUoNVqZQ76+nWM4dZm9tURhli6xyig35rtpeeX5H\nX8GJEnNurKMXWzHLS2vpjx6yFJ2CSx0MqqRNFR70t1j\/AAo2k7lwK1A6AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/egg_plain-1334275334.swf",
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
	"o"	: "give_to_dustbunny",
	"n"	: "nog",
	"c"	: "season"
};

log.info("egg_plain.js LOADED");

// generated ok 2012-12-03 21:07:22 by martlume
