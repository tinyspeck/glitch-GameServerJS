//#include include/food.js, include/takeable.js

var label = "Fortifying Gruel";
var version = "1354603999";
var name_single = "Fortifying Gruel";
var name_plural = "Fortifying Gruels";
var article = "a";
var description = "One bowl of lumpy fortifying gruel.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 271;
var input_for = [];
var parent_classes = ["fortifying_gruel", "food", "takeable"];
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
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !(pc.skills_has("masterchef_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/48\/\" glitch=\"skill|masterchef_2\">Master Chef II<\/a>."]);
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
		'position': {"x":-18,"y":-19,"w":36,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAISklEQVR42u2Ya2+T5xnH0b5A3+8N\nHwFpX6CaqmpbkQotomxsFdtaDqPNgDEoDJoEk6NDMCEHAimkwHJy4rhO4sSJ7TiOE5\/i2LHx+Rzb\ncWzHh\/iQGFil\/6772ZIhDiqobNqL3NKl6HH8XPfvvs63d+3aWTtrZ+2snfXaq1Qq7dnY2KhisrKy\nInY6nSq3282Jx+NReb1eTvx+PyeBQICTZDIp3nqP6XhrQKRwH1OaTqctBoMB09PTuH\/\/Pjo7O9HV\n1YW7d++iu7ub++zhw4fo7e1Ff38\/hEIhRCIRxGIxJBIJRkdHIZVKIZfLsbS0BIIH0\/lv6H1vDFYu\nl9+NxWIhrVaLO3fuQCAQoKWlBW1tbejo6Hgl4KBwAMopKVSKCYxIvnsBUCaTYWpqCgqFAiqVCnNz\nc3A4HMjn8xa252uBkQtC7MX29nbw+Xw0Nze\/ACgZHoBWLYNjUY2wSw+rcRqP025EPUb09\/VifkaG\nmM\/EiWFOCT2Jw6KFz7EAt82wDahWq6HRaKDX6+Hz+Rho6KWgAN4hU3dbrVbcvHkTdXV1aGhowLDw\n79CqpNDNjMOsUyBo18JrFkKnuAGZmAe9nIc52WVYda0wzfKhll7AzNhXUI2ex\/TIX6H47izk4jOQ\nDl2EZrIGJrUAAeswYh4l7BYNlhb1sJkNsFtNMC8aYTKZEA6HwVgY07PBr2Kn4PF46Opsg9WghM2o\nhGJcBGHPLTiM\/bBq27EwzYNReQV6RTVJFT1fgXOhE8VcCEFnP\/xTPPgfHMPyzV8jwd+PjYbDsMw1\nQyu\/DOXIGUwO\/xkTgxUYF36BsYGTMKhuIxHUY33VzVkx4LFykCxGGdMWnCAej3NWY4AG9Thqa2sx\nLr4N04wA5tl6OnktSQ1cYxcQGb+I6ORFBI0N8JuvwbvIR2zqCvI1+7DWfAC+ifOw664i0XIQRe19\nlAsOJJdH4RJ9gXDnYQTvfgZv\/1koJKcI8gRGeo9DPlIFk24EsaAdtiUzzGYzKPMZpIAB5iYnJ1FV\nVYWBnnt4mnFhXt6MJQ0fDkMb1uJGpAMSZKcbkXL3IZfQIRWRYWPdiYTzITKiCyjWfYQoWcVpqENw\njo\/sjcPwEYB1rpqem7DedBDrl95DpPUTpCvfR+zafqRW9IgHJTCQV6TCExD3HIVUdBlRrw5elw1U\nrhhgjpUSMMD6uhqkyNxOYxts83wOMOoZwpOsD6XxWmRWJhBz30PUdRfRpTY81nyLcsvvkfj2c3hM\nDXAv1CP28Bgy9R\/CrfgbHDOXkVBeQ7HyA7hFX2JRfYmzYI73ITxL9xALjCNg74ZFcxUB5yDKRS+c\ni7cx0vcnxP0arEQCLBbBWZD5XyUbRtB6H4+0TXAtdFAGirGmv44y\/yDij9oR19QgQ4o3es4R2B+Q\nolgL6OuRTz\/CRtKODUU7kv1nEHeJ4NPxUZwUINv4MWzKi3TgWqTGGpGp\/iXsFC6xoBwhlxDJyATs\nhiY8dU7jifIOUgvfYGLoBKSD55BLRf9lwVwux6o8VgM6ip1mDrCYc6Psm8b3ogaUeXtRvvQ+ntQc\nQOn6b5CkrAwtNCKw1MzFYCowjE1pM5bFpzkXhymJNgRHkO08Cp+hlTxRiejAabLkr2CWn6fEuojF\nmUp8\/zSDTWMPylf3E\/gHWG38CPOSk5T9X0I5WonNUoHL5l06ne7I+vo68rk4bdDKASZCEyhMNaLU\n\/inSI+eR1jRjI6xGOiZDMjTExeDmmhubslbk+s7Cq70KzzyP3H0cxa9+juBQBXxLnfDbupGk\/5eu\nf4pl9Q3YyLIM0CH5C5JNB7BSvxf+tk+wcuszpBM25NJeaKhseRxKFItFUE3cvYvazzusaDLIQiGL\nZe8kWecm8sl5rCfnEPd8Q5noRim3hLXoGIoZI6Iz1Sg2H0Ki9ySXxWHpObLQL1Aa5CEfmUUiLCHA\ndoREp\/GPwXoUdULEw0q4KCFWbxxC7spe2AaOw9Z\/FKnL71EtPQPNxGmY5yks0jEOjuqharsOUivq\nXlxcZP2RC8x8NoJ0VI64+xZWXB1IhSheSOK+B4gZ+Cg3HsKq6BRikrNItx\/m4FaGTqGU92E9ZUA8\nIMSavRebfV9zSRK5\/TuK2QoU6g7giU6E9IoCCzOXOEBmwdUH55G3KLm9WcljXYUGkP\/0aOqTu0ly\nNJFgeXmZOwH7MgebCVAdk1H23sbyoxYuBgtdx5Bv+hiZ9t8iRoV3K4uDj+4g7LiHEElSfg2Pe66g\ndONzrNXuRfDeEVinv0YqOkMhJEHEN4Z4xLS9D6t7drsdzFBsOnqh3ZGbq9jEwiDZKSiDtoUpKBaz\nWE\/7sUb1KxGWUwnq40KBuXgL0GchtzoeIEiSjBDIsgpucwdJF\/z2foS9E0itOlHIZzidqVQKLhfV\n3fl5TigfuGey4MsHB2riFprxOMhMJsPBFQoFLj65RMrnueetU7+pZLNZDop5ibUzo9G4DccmJzbZ\n0N6CV04zLGGoaFsYIFPAYLYAmXIWo2yDRCKB1dVV7i+zNo1miEaj3Mas2T8vTBfT+awwmC04JmxQ\nIdd2\/+DIRX1wz+zsLAcZDAa3rfc8IE3UHBiDCoVCoMmZC+7nQV4lz1qPwdFnYtLxzmsNrMyS9CIH\nyTZmcG8TkAG9seVetiguBBSTJbY5g3sbgMy1LN6YEFyIPjvyo+4lfX19P2VpzzZnYD8GkFmLgbHe\nb7PZBG\/1RscKJ4sTBsMSgwFuJcbrAFosFnYHyVGd66bnPf+1qydTTrCnCMjCMvSHAFnxpVgbI6ud\nogTc\/T+\/KxPcu3Td\/GNra2sFXbIqqqurKyorKytYsSWX\/oy+8pOdXxR21s7aWf\/H659s+y60iYkj\n8gAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fortifying_gruel-1334208453.swf",
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

log.info("fortifying_gruel.js LOADED");

// generated ok 2012-12-03 22:53:19 by martlume
