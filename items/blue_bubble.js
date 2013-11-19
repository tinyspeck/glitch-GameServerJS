//#include include/food.js, include/takeable.js

var label = "Blue Bubble";
var version = "1347912404";
var name_single = "Blue Bubble";
var name_plural = "Blue Bubbles";
var article = "a";
var description = "A big blue bubble.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 5;
var input_for = [32,61,65,72,240,245,308];
var parent_classes = ["blue_bubble", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "bubbles",	// defined by takeable (overridden by blue_bubble)
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
	out.push([2, "This can be made with a <a href=\"\/items\/263\/\" glitch=\"item|bubble_tuner\">Bubble Tuner<\/a>."]);
	return out;
}

var tags = [
	"bubble",
	"gassesbubbles"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-17,"w":18,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHVUlEQVR42rWYW1BTVxSG88ajjzz6\n4gyPPvKYsZ2p+iLTWkXbjhQEE5QkcguEW7gmgKCAIqBWptqq1VG8jKCi6BT1OHInCZdwCRcRGakI\nYlMC5HTvnLXJyuYkgJcz8w9JOMn+9vrXXnvto1B84tX+Ttx8fUwMrxxaNhbbl2sL+5gWa829kgp6\nXbXn+l0RF3qcysYhcZPia1+t78RNdyfEsGK7uyHB5nYesrjFgxZxTR22LIup3a7Jkq6P5ouWma1f\nBezKqKjKs7t7Y63iuqD86WjXotPY+fHx+dbp0C8C92BSVJrtovC5YLy0nS5nfuts1dXWd59m\/YAo\nBl0fF1NSetyTgQaKBsXIKHoNyOhut5jWMtdRJrzZeDTrRkVjnNXt9PfjFOAQkYpITRTLSQ1SwX2B\nYJNbPkyWNr9af242ji2FJ9qWJ\/2BMajDREeI4vzoCNzDgAOBpgr\/CGUPh4PXhGseF0P1PV64bOL1\nrSlJteNeMAqgoblEpKPJz0kH0iLYWJhcjKzdy6L+6XRDRf1AkF+4F1NicH7vkoDh+OvCuATGoBKs\nkhKJkkCJIPp5PNzHQA+jaK5yp2tJTH08YfQL+NuAqwp\/4e3CasCKYS8YhUkm0hOlcNKDkgE23ipN\nSoOiKQepbvnoNNQ7lKvgmhyLSq3VPRMoet2zUkQSYWAKkkpkIEojSkdKg89TATQJIsqiGQhS+2RK\n0GCr6wfEoMJe12V804O3vnAD82TAHmkgPQxMITKIMomyZJQBsAaYDIsmhlTL5GR056KYdKMvbAXw\nXv\/8Vq1leQbf1DfvhZsmVhtsXjgDDEzBjETZ5H85RLlI9H02Ak2DSWFIDeSkSmZ1H2l683gF8KTN\naebDfHtKgrMT0FSb9KMYLgvAKEw+UQHIhF7nAagRJoMhEyAn48BqPooxLf+KuotPQzz2plpcAl\/r\n1GCBDhZEMvw4hssDEDNRIVERUiHA5sMkMGQK5GQ8F0U+SKq7gzrFzb65EE33kk9RPgSz0kCJSIQf\nTYNBqHUMjoIUE5UQlYLo62MAaob7GGSGTBT95WLMw9d1ihvdM0r8ob5PyrlHb6VEprPko5eL4I4B\n1AmygMqIyuHvcQAtBsh8sBtHkeVinL8V\/fe0Q1HeMavDH6b0SblXM+JrrwFmz6JnhsEpHAWqIDoF\nOgmgJwCyiItiOkyYt5kHjHo+51QUdHww8t2JGmals3gXB7M3h4sehaBwlURVRNVEpwG0HCLJopgH\nKxvbTAu4lsvDoz0ASBaKIq\/NFzBGBpDlH7a3CKJTBhGjcGeIzhLVAHAFAB5DNtPFlQGOsDxkNZEB\nZtoB8CUBzG6b\/aKA5wDwdADAzACANHo+gFktawPqESC2uAQWB7O4GuCq1mExD8gsplsssziSApqE\nqQi5HMQ1kBXoTKh\/+WiRUIByiGIl6BRAU3i2SEwyiyRZZpGcHCXBsUksEc3vZxSnmxzKVQUSALVc\nkc6ArY0vM8dt3hLDROFKYRKFqMxkASAr1mzLo2XGQCpI1ZiX48DDKYeirGk4JLZjIWChTuLyMAcG\nNEF0WC08DipFNbBQplAbwBW83VHXKkhpMw15OX667ahT0A5W+\/KDECgP5bY6DMm2uWIkvIvkocWR\nzm11LP\/SSPSqSfQSe70cey526TzNguHJazOfhyr4ogZ2ExZFA7I6B+3HJgAyo4aB7cPZyFq5ZoGq\nkuRe2Qiy9\/mcuCPjaogH0HTTFhrduTTDRzGWiyK2OoM1DVZvq5WHlMt1MunIWr7dKh5aHb19d0aE\nlXbLY3PzdIO\/KPJWp3A9YRZE1AjARq5pTeM663h0RikcJKWJwBUPe8eObFsQd9UIET4tf+bVdqVc\nFLHVOJJ61O6zNj8DCbf9uJuOt3itTe+T4GhpwU8u9t52CDs19b6nO3oG0DSO18qdg9UcJD6X6NHZ\nhBcD488jFC6X7BZnCNwpVPc8uSfMiztKGrfLnuoS\/2jfrHr+vjcQZBwMQgeLt3ojyk54yQgKHz3Z\niS6JlqJhebjIziUx7EJnVcCDu+7Ptu0H2\/7z1EUcdmZ3LHqagA\/t8UxW7+ujCIyCFpF8Ozsm2Vo+\n4gtHtfu6XdjCWyt3qa\/ZVAfbFpwMkq4u+jcairiaA9Wgpwxa9D6dfC+fWFkyJIGdAThajPneb++d\nUcc3JY82r\/v5TAyJZNSz2ZUdhm7gdCOnq81IBk0g7xPpMZQomUgPMvZLkaoalaAwGLUUlxJm6\/dX\nehq+LXsRvOEnXJHnhdCoZ+99tkFqCz0W0KJaDQMHEoWik6Lf4aPmybnLtoZ12erv+qW6eeuv9yfq\nosiPrXpaSiJm6JcsoxBYeYPyUCv77JNp566\/bMbPgmPXzor6oP2XOlW0\/ZED3YgOkB5v981BYVtF\n85d\/Vr2r4Fbwnt9bdT\/XjwuR7a4NgdGIhV2y1G0zPVBu0VQEfdWn\/TSiYTXNoT8Si\/bdHXu8\/\/5r\nx\/77Ex7tu0f1yhFOVf\/K8cM1e+13lU\/DQ3WXgj9lrP8BGF+XaTmEID0AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/blue_bubble-1334268679.swf",
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
	"bubble",
	"gassesbubbles"
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

log.info("blue_bubble.js LOADED");

// generated ok 2012-09-17 13:06:44 by martlume
