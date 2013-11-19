//#include include/food.js, include/takeable.js

var label = "Pineapple Upside-Down Pizza";
var version = "1354593600";
var name_single = "Pineapple Upside-Down Pizza";
var name_plural = "Pineapple Upside-Down Pizzas";
var article = "a";
var description = "A plate of exotically topsy-turvy pizza.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 111;
var input_for = [];
var parent_classes = ["papl_upside_down_pizza", "food", "takeable"];
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
	if (pc && !pc.making_recipe_is_known("25")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> and complete the associated quest."]);
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
		'position': {"x":-27,"y":-20,"w":51,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKc0lEQVR42u2XZ1RVVxqG+Zu1ZpYr\nyURFElHHAaOMiJcmFiQiEpFmGbuIKBYUSyzRURGxYEXFhgUwFEFAGEUFBa6FKk0QRATpKgK30YSL\n8M6397kXwThJxuXML89a3zqwzzl7P\/v92r4aGp+vz9fn6\/9\/QSrqg3pLny7JUnGXdL0Y8j253GTu\nPpAZ6\/+PFjXTRoOpEyQzPZi1Va4TNz91LG\/IWIH6tNWCpa+FIm813r6yBeTHgMYgQOoOSBYBsh2C\nyffRfaPHJ1ZjUgCkK1ULHBMWUZwkgEACIKj8+d2Qb8rX0dhP9M5RdDXMhbJqDN48G4Xmx7poq3Ci\n8f00zyaCnrf208A1OORCcYkm9kVXnTk6aiahvcIcbc8d0NmwmkDPQVmzDmUXHVHmvxyoNwUaSEGJ\nC0ofWOLSjmEI2DIYIR5DkRyoR98QnHQDf95eZvXx7q5LX722pXSzDIoLpNRldEk3oTB+DHJiDJEV\nOQqZYSPQUjqZgMxVUORGeQwtvpEWXyCMN8xCbf405MdZIivKGvnXhvMxSN3ouRVans2Xkeoe0izX\nPv8dXJpbAHOXsmqysDjbbe125Mc7If+2K7+nRkxAe40Jh+msd8azU2OQ52GD5mIbdL0eJ6ikguRG\nczAoPh+Nt1c6oSl\/Pd48PQ1J5pby+tQ15n8Irj7Vzac7nkrsu3cL6dZu16mhhcVM0fhoEPL290Wi\n7UDkhtjjTSULBTPaoAndp1LS2ODtC0N0vFyEjmoDtBQMheTBX3DPawgqry9BS6EPFI92szV\/O3ka\n0tycFAX7yHWn8TppN1qf2pEaY9FVv1QF6aZyp6BKe\/lINOYMgiS5L5J8tfA0dAUa83xxdZ0O0gJ0\n0FhkiLaS0Wgt+jslyTA05v4V8syBkKVpIj9CG9G7jJC4ZASKTtiiueAw5DkeYN77IJwsY7U+U63y\nNkE03iUTo6lyPTprLUiFcVBWmKCtVETQI2my79H0aCgUWdqQpWshI1gH4d4iKEriuIrM7riLEO1j\ngfhzIsT7jUaSvwHKkw1orimksCOkReNpwzuhrP4ZL\/+1Fi9vLeeAzJhQv4671NViBvjQwxyXl5uj\n8sFJlMf8EwmHdPEkVh81GSaoTjWk8VGouKuH8sRhyI38HuEHjBCy1wSpUaRyeyVtLImS5SpZFFkk\nlZQICgcPUtyR\/v5ZKFHcDgnliMpX3R1bFaQrd7U0c7NMmuKm3SPu1pgzuBe3liB7sxVXsPjUUq7E\nbdtvETz9a0TtMMG9EGs8T\/kBTVVrqLycUhVdVQGWONMY1cXOFqAl6x2glN6TedOc4fQ8gBLKBW9r\nZ1Jcughz8FimZJJ4kpqn8fzSDLQ+8e3tarV6T3zsoay7T0pUcxdzNRoTyO7QIgdoEiq0imOqgn1I\nVbAvCGOsaMtPoLXYmWdz9iYLuk8l5WYSJIPxIbjFVENNeJg05f2N3p0gwCv8ae5V6KjwRM6WMai\/\nuxWSh5vAVWSxx\/zOBiSp9HJzFgdsfByIqvCfkbfLnuT\/hwDUGEKTnaUOQaXllSXevvyBlJhDizAl\nyV2Ko6TCbGS4DUeKsz6qwlzpOx9BPflxVKSPxe3zhhSTBog7MxLFN\/WEyqCqBg2p0xBlpYW8nZM5\nT2XC4rUakowNHu3PLkCatRWKzM3ofB3BXZzhNo67OMV5GC06lxY\/ziHbauag5qEpqlJG81gsu6NL\ndWwUAXrS8zOC0goy5QugNU5YXL6bxj1Qlb0CtQUHybxR+3g\/dRo7oaizEkaubi5wgp95P4hnDkHp\njQUE6CLWkGfvECtLAzmg2N0Q8pSlpEoIlK9ieRzWJdAEil8IOpj34ZQrFpQUpjwx1HbXXw8dL+xU\nJcgS6CimOEymhbcJBZsXbSsh3iRLyFYKplKOWceLhVSSNiJtmR4X5nHEDAJcItOQZW2TtRX78ZNI\n+nojnLMdhPqUje9isMGGu47vlFRqqtqLLlkojd0ku0EWS4psfwfyJpHuC6k3W6PQ24Bq6BQBginc\nq7Ms6O4snbXGVK76oz51FjLXGHBAlhPPrs+DRo14Gc8aniTHf0S8zXcoC3JElyRWBUiBLj8iBDOb\nkBbqqp9JTZ81\/DX0nmcvJSB1ppCYh1i7AcjeqEsHDAt01s2muHVTAdoKgPzdreioMoAieyDvLCkX\nRyF5oS4yfzLmCnLA5zcXytSArMww+mdHLaEsPSAAynb1mNBNFTMb3inB4kd9YGCuolbGFvN3\/Q53\nXHXxOseUkmkCgZhR5zGiE8xoaqHGlMkjKJOHQv5wIKTUWcTH+8B\/9gC+fvElR2QEWKMoZjY08sIc\nxE35ByDL3s4hc7aN5buQp60ida7z9O98PZ5Us1OpaKqKKVXLU8cW\/d9WMhzS1P7IPP8VTjv3Rfpe\na5Q92IxHN81RkWxKcEb8bNjyRA\/N+brUJoeg5PoABK79My44fMnh2PosQZiCaf7WBBju4FEt3tDt\n5lrxctxfoIuLU75FYfBcamkbURBrzFVQVjOFjKldTYeyUkTtj04lZfpUz0yhyB1MPXYAyuO0ELRB\nE\/7uQyDLP8Y7SUflUVQlOkF8cQpiTrAkEyFopw783AfgsP2fEOnQT6gYLnp8\/apEF1TcXoy4Y+PF\nGmU35mnn0Amk9ek53gcZZFXMQojn6yJokibC5ujAe+KX2GP\/BZLO6VC7M6CePJoX25bC4XRk0uFK\nVCYMhNhvMIL3iAjACM\/TdpHyAWgv2oY3uau6TVmyC+3F2\/nfN9wMeMwzuHT6m8Hx9QkwO9gWEXuN\nhG6SHmgjLrmxEqwesgLJXkj3m8w\/Ujf\/6xT0Z+d8jfPrtXBqZT\/scfyil\/k4f4Wg7UNo14YoS1xG\nIF7dUKx0xW8zQ8ii4dyyD1igJnR6N1ze7omC95JXIi9ciL+44xNwxdNIOCMmnbXSv392kux5nBs\/\nQL56sIq\/yD4qD5vTC\/SWnRau2Wsixk4TV+36cwu31oTvuL5IO2LZSy1mJeEzccZGGwfHfIMjZt\/w\nTqGei4USm18Nlxtqx+Hunp2EMC9Dca\/TTOzhsU7J5yfjSfRCfoBkhbv715oqNlkAqyf\/kMVYa\/FO\nwGCYUv6zhnKo0xP6IdRyQPd7bMPFfna95mdJweBSL1ohcp\/xO\/V6XikBUwPu+1ni0eXpqE3dCVbA\nWYYzt\/ecjO264GDvEHjfWLtiz9XGahurs6yUvby\/HJmXpnJjdVitHIO76m2CcC\/D\/3yyjved6MEg\n2QcFkfNQl74HrBWy+GSn3sa8fYK61Hl6Qv+WMQgWMiy21R0iO3gaz1R27wkX5iX6\/Z+j8ScnOsUe\nHSdjscA+Zvb0mgtq7m2F\/JEPB1Ybi1lWorrBPwDIwBhUz7GyuEVcQXXMRe43KQ\/zNLT\/w7\/scoKn\na0cfNAuIPUKFm2JTDcos6xdbFF5dhLJ4dw4tyTrYC5oBs5LFgHuaGlbt0qTTFrh2eKyMufSKt6jP\nR\/0+jtpjoM0muH7YrJxNyHb7PrDackNncPD3jblXKB8\/IuHkRNz0GZd7Za9xNHPnR4N96ArbbaDP\n3MCAmYXtFgWwckCG3zF6RxQd7iVy+qRAn6\/P1+dLQ+PfnvxK1GCI9\/0AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/papl_upside_down_pizza-1334341378.swf",
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

log.info("papl_upside_down_pizza.js LOADED");

// generated ok 2012-12-03 20:00:00 by martlume
