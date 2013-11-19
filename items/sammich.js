//#include include/food.js, include/takeable.js

var label = "Sammich";
var version = "1343497566";
var name_single = "Sammich";
var name_plural = "Sammiches";
var article = "a";
var description = "A basic bun 'n' meat sammich.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 29;
var input_for = [];
var parent_classes = ["sammich", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
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
		'position': {"x":-14,"y":-25,"w":29,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKFElEQVR42u2Y6VNTyRrG+Q+sW3Vv\nTTkqgQiIosMIirhgFHVUrguL4IKIoIKiiPsy6kSU1Q0FV1xQxAUVURCQNUAgYQ8BRPawyhIgoFPl\nx+d29zEhARRvTc29XzxVb1XqnD7dv376ed\/uEz29H9eP6+vXh\/xNPGXWRkFnmrOgLXm1oC1hpaAz\n97Dg82elID8pgPd\/A\/tUtEugyt8u68\/1QE\/WZnSlrUdHsiPaEtZA2ZaOtvfPUfl4JWoezse7qDmo\nuD0TZTemi0qumLj\/rWCNzyzH9eVs8ftUvBsDkh3oy906AlDxciUany9F\/ZNFqHlsi4akrWhMdEXt\no4WofjCXAivqYxcJa58sEFZHzxX8JaCPHblr+5rTw+peO4u4gZehS3oEn4p8GOBA5SX0N8WhS3J4\nGOAydBQFobvgKDoz3NBZdR+9raloSXBA04vlaIhdgrrHAtREz0c1U9giquzq1O+zRH+J8zhl5iZh\nZ9p6VVfRabSKj5KOV6P5jQvasnzRXhCAgfJTGJDuQG3mQTTmB6M91Q0fkp3QlrgGrSlu6JZfgjLf\nh6jrytTlnq1Fy6t\/6wISC9Q+W4P3T1eh\/Ia5quSq2bctoBJvNldmu8uUIrJs6Rvw4e06tL+xZ4At\n6dvRLv0DtbF2aMk+iF75BfTle0EpcuPapjihPcMTyqpw9OdvQ2+Ou2b56TMG+HrVCMCuyvvoevcQ\nFXfmoDRiGnJC9P1Gh5N6ufeLPVXqjnvEe\/AhcyvakxzQShV8aYem57+h4akt67zuuR0+lF6AsuCg\nBrC3+gY+FuwcBsg9a0t2hrLmEZS1T9GQuhN1TzjAd\/etUXnHEvJb5ii7ZobcEANk+U\/U9ebHYp+1\ngwXe6M8b6liRsQuNKRwg9VZzvC6guvPGdF90FQeiM+8ABivPYrBoD\/pKjkFZdBg90gPoyvdDZ+4e\ndIh2oTLRG5UJXiiLXj4McJYGsDDMGBn+ExQ6gIOFuxQMkMxcnZnd6RvR+dZ5TMDKu7NQ\/8YTPYpX\nULam4ENxCBRxK1ii1D9dzNrWxzuhKXUXmnOOoUMqRHOKB5flMQt0AGXXzVB82QSZZyYi3f\/ntUN1\njZQNbUDqq1EBv\/in4ZUzGpM90SY9gx5ZCPplQu5d4smemig0J7roADbEOaH+1Qa8e2DDYBpTvMi7\nZ1EbY6OZpPzWrwRwOgovGXOAZyZEfRdgR5obOrJ2MmW6S4PRWx6M\/pLj6Cs+xtpSS9D2NGO7Mzah\nu\/AE2vOOMUC12m2SM2jNO43y21asaJff\/AXyu3OgyNw3BBjJAeaf5zPAtLMTRF\/Kite4P4t2y\/4s\n2QMag\/I\/MCA\/hcGam+ivjkCfPBT9kp3oE3tw8NlbOPPLLqO5IJhlKZ0ILSVU7Za07WjL2a8DqLZD\n1d3ZGkDqN9ktCzRl7GX3KWAJyeKssxN1FfxYvDuMKvixcCcGpV6kAG9nydL\/7hr6qiLQk7+X8yRR\nh2ZrZ6oLKz+0MNMSRGsfK0OkxtEi3ZwnZDVzuF\/pLlJ1jwJaaABLw00hf2CL6kfLQGoggZvE4Gjc\n9TWIP+FoyNMjMCJVHre0vdlflivTlS2xRp0UTh0GRPxI6xn1JAWivmRqEW9W3LVCe2Egd18bkCSD\nNqD8prkGsPiyMQpv2WjAaMT\/bohgTwscd5mq0qt\/tvy71KHZ15iynQ3c+GwpG5xmIgWgZpffnoXa\n1H1kJ9mkC\/iEe84BWukCRkyF9OJkHbgnh3g4tdEU53bMwkGnKdArDJ+uqw4tyqOowzKSDkY2farI\n++h5zFf0tFJydQZK7y1BR+4+7n11Uac7xlcAaUmhgNmB+hq46z58HF8\/FUGeM3GeALovmaTQo2aU\nk+yitYup83ykOmoPMaOTQWipoAMVhU+D5NIUFF79Fa2ZPpptURuQ9jMCkNS8UuI5Mdk11HDRhyxw\n54AA9w4txkVvK\/is5sN+zr\/89DIDxvNIA5U0zJSoMn+EOjTD6FZUETmTdVx+YwaKrpiScmCEvPPG\nkFw0ISBLOZ8SwNYvK6CumTqAUVasrzJSTnJDDHWW9tTGqdhpZ4gtSyayoICr5\/6T2\/JaEu2FotAp\nrGFuCB9Soor0kgnxhzELyUUjSC4QoHN8spnzkRvKh\/icEcShhuwQwB0I1o0JWEHqXUHYFJ1spRHh\nzWNwfmuN2BLT2OdkgqWWeuMYoCLDK54aM9KXj7fCoRdpR1kB+hARn2QHGSA72IAAGrLZ5wRx3lGQ\n5WSA9OQzyq5TG7MQskhLZgVtKHU8PGCggVKH7+rJuLLfGpqdpOaNB444m+LkRjOWPec8jRns86M8\nvDhG4rgB4o4bIlnIGzF7USCPAFiRncEa8jtW5PcslN2yRP4FE6b0aFA0Ek9OYuNog9GspUrudzAm\nHNOGAO+fXowdK3iskbZRKbB2B1RlOuOvDTpW0NWJ8jNE4BaTEarROECWNdDbgsU5jwlDgNePzGfU\nW5dOYvLSxqfdZrB0p0F\/a3fkv3mKRuGx4vXJqaztcLVGxMZp6C3wxeeKg1AkOiLVf+IQYFvGNhxz\nNWOQ1KhUZqqo52\/6HPQaI1zxscZNPxtc853HQg2vjq8NTN\/7Fhgd02cVH3Up2xicUrwNGUF8pAgn\nyDSALUmuquaMHdhGoKgXh3dCoSks9cjwZ8NBKTy1CZ2MekKxJ5ezZxRm8+IJLGgpoSKoMzfigDW6\nsrYgM8SIqDcJqad\/FmoAFQku8a3Jm0Ahrx5ZwF4cLWinjvN+wrr5P+kMpP5NgypO21KraE+WTk7t\n89EE8HfVR3qAATlm6TPApBPjh77yFK9d3BvJIVSRsB6qAh\/mBQp6yn2GZjD1TOmg1AJUURraE6D3\naVu6ZKm37PEyzA4xQcs0IY52QfAuS9aXelXcbMfj9l4eMgL5DDD9LI+oN1E44qOJnJJlDfHrUB\/n\niOakDeR07M08QaP0xWY2WCDpfLc917F2UdX20+9u0\/E+yUPz7vDozvZA2kVrxByZjJjDfGSFkBN0\nsJEGMNVfX5Z+9B\/jRgA2xTmYN7x0VFHAuhf27Hu1JnYNmhLICSeDHFJzPNEn8WZRk7AZyddW48qh\neUNlwdeKqaYNM1C0Gz2529D02gFVD5dCGjET4ktmyLlADgnnTSEKNdEAZhLAtDM8RVLA+K9\/wDe8\ncHKvj3NQ1cU5aADpR3X1Ezu8e7QCVY+WoyJ6GYklKI+yhezeIhILUXrHBiW356M4ch6Kbs5F4Y05\nKLg2G9KrlgTKApLwX5F\/+Rfkhc2A+OLogEQ92Tfh1Fdt3Crz2mf2ov8ZYLCRKjOYL0wPGWVZvwka\nu8a9OnaVQgcw5r8HlHwFMCvUVEEAhZkBhn\/tb7rqxysF1Y+XhxH1RBUPl4nGBrQeFTAvzFwkDpsu\nzD1nKsgKMTH\/W\/+GK4ux5ZXdWywou2fDRaSNoChyLhfXZ7OQXJ8pkITPFPz4m\/fHNcb1H5KmYYmh\n6XaxAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/sammich-1334341538.swf",
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

log.info("sammich.js LOADED");

// generated ok 2012-07-28 10:46:06 by mygrant
