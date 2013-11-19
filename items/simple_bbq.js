//#include include/food.js, include/takeable.js

var label = "Simple BBQ";
var version = "1354588920";
var name_single = "Simple BBQ";
var name_plural = "Simple BBQs";
var article = "a";
var description = "Some hot meat with tangy sauce.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 116;
var input_for = [];
var parent_classes = ["simple_bbq", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
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
		'position': {"x":-21,"y":-19,"w":41,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHNklEQVR42u2Y+VOTRxjH+Q8URHtY\niwdaUWvksNXRDiPWiq2CtyhYUJnaais6jlLREKKCCSCIgoQjJBwD8kOr5T6cRlBqPeOB4M2hHIr4\net\/O0\/2ubhpiwGptf+KdeWaT3X2zn\/0+xy7Y2HQ\/3U\/30\/10+ixx7ukQ4GansGaLnXvK\/negRaN7\nurPFYwNcbesWudnRsrG9aeUX71HIlx9RqGd\/Wj+pH\/8O+2lcH2LzJLzzn0JBiQBXOx1fjEEJA9za\nCR9Q4OhetG5iX1J81Y\/Cv3bgBji0Gz0\/5vMCXHsGvTOghw8fOkiS5J+njzMsnzDQCBiARHo7coM6\nAIqePpi2zXYitZcjh1B7DeLjQklALv3cnrfYBJR\/a6h79+7J7t69q2i+2ij9po2hH9wd+KKr3d\/n\nMDtmD6FUv5HcYmc48oXR7pznxMegHubqvh1Fu74bQ0nzh1PM9IF8HsYAiI0iZt9YLQZnqL9QQ8ny\npXy35oZFsYgAhcF1aLEBc9fi+wYWiwCLm+nIDWPmYZEcseqfx+ODBw+C2lqapCz1Wv7DgIAaUECY\ndqGMor0HmRTLDvzMpBA2AECAiNgTSYN+oZqwObJelLcrXaqpqelaRSLqweAMba3NtMFnPEWy2MlY\n5MoDGqBwm3BnyoIRHFoEO\/owN2HOJxTlNYBDYEwoBkhsxhzO19mWvnGyJc+hdlT8Sw6dPn1aYma9\nBD1+\/FjG4KSbN2+SRvEjD34AbJ81mC+A3WNBoYi5iZg078N3ASlUA9CMEbY0ZagtTRpiSx6DXxgA\na08cocbGRjp58qR06tQpd0vlHFjMsQSVaP\/vpXx3+EGRZebueBtb6NIRyNK8R31I+fn59PTpU7p4\n8SKdOHGio7uZekbAsQGKXOHDd48ghopJviOJFTqehfKXGQlV8R0uRSzCrUKlhLlOpPEZZlIdqk3s\nBGyqywAK8PIg5brVFB8fT8eOHSPGQkxBOn78uIHDMWoFOs+cOUMHD1TyHaNuYWEBg3hD8GNRqAp4\nxBwSAyZKBwCxKcxD2xmc7+SxpI7YxKHMDYDPnj2jK1eukNFoJJ4UT548kVpbW\/lgXo6OAyIhEEdY\nRJQPYaJ2WYtHKIb38Y6\/q3W3Lveb+QoYLDs7m1hZ44C3b99+Acjg\/KHeuXPnOGCicqXpqBL1TsSi\nuWEc8yz7zWN22rBX4UJWLbcKdvbsWe5axCAAnz9\/DheTyb21tbUdAKGg3t+ZWxhTCobPiDm0iDlR\nrBFvoh9Zjz4khSXcZsX6DmB6vZ5YIhCrHPTo0aMOgCxhuwZEvUKwI84Qg6LOiSINGBFzwR59TZtR\nTxvA30dtM4dT\/LzaBJaUlETV1dXcnffv37cK2NbW9jcgBrETAGZHrulwI0GcAQQxBVWhnDhjkQgY\nF4qrpvbn78wf1XnMlZeX88Xv3LnTJeD58+c5j027JHHA5uZm3rF72zoKehnolga1xFFlbiLmRGue\nGCgjAq6iooJQypAAXQHeunWLq1dZWUk2ZWV7gzCIyciaYl0MrfXoRwuc2RXI9c0L8qxP7Tqot2bZ\nYg6n0+kIJ9TrANEi3ACYmqqts8nKynLA8YJJ7e3tdKB0Dymn9KfZst7c5srsyWeUPfm59GJlo2s4\nPxc78hrey6p67Ph6LSBaZDOEKi0tpeCQkBcX2cLCEgMGMfnGjRuUsmQc+br2MUFa2jwGbG6AByBU\n9x5h\/4p6ubm5fPNdAcKtgMNJdujQIQpTKo2mYy4zM1Nm2FfBJ+OluuojpF4wplNASwMYAKH0tJcK\nmquHE6ozQLRXr17lWQ04g8HA4DZKwXJ5xxuNLj1Tsf9AFbGbM38JmZYTtZaWjHN4DaA9j1W4H59x\nKzEvyFAPv2UJ2NLSQpcvX+bVA+cuQgAZrty4idavD\/W2et3S6vS6vPwCamAxiR+B7MWF+bRhRSB9\n7zWeAj3durTFk934GStqHupdXV2dCRDHKdRCCQEYVGN3Pzp69ChptWkkD1VIcrm861t1alp6UKpW\nR1V\/HOS7xa4bGhqoqqqKCgoKuCJpaWlWz1JhGRkZVFRUxOGQgGgBheMUcQY4uB3uTEpOoc3hERSq\nCDPKLd3aKWRqqkNyitao02fQn4cOc3cgea5fv07Xrl3jSqAPtbOpqYmrgtsHNlJfX8+B4L5Lly7x\nu92FCxdMcCghFRWVlJ6ewd0ZFqY0hoaFKYKDVT3e+K+5pBRtrCY5VdKm6amouIQOHz7CQSwB0Qel\nrAECrroaau2jX3fvoZjYONq0OQJwdUql8t\/\/0c7iqEdiUkpsokZTtzNRQwk7EylNp6ecXblUvncv\nlbHALi0ro5KSUiouKWGuLabCwiLKLygkbCxRk0xbVJEUsUVN4REq2hS+RaeMiPhv\/pug0WhkCQma\noPj4BMP2HfESM4rbvoO2xW3nysTEbqPorbEUFR1DkVFbSaWONqjUkbtVqsgglUols+l+up\/u590\/\nfwF\/udCJFssIowAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/simple_bbq-1334190186.swf",
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

log.info("simple_bbq.js LOADED");

// generated ok 2012-12-03 18:42:00 by martlume
