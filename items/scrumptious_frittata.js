//#include include/food.js, include/takeable.js

var label = "Scrumptious Frittata";
var version = "1354585958";
var name_single = "Scrumptious Frittata";
var name_plural = "Scrumptious Frittatas";
var article = "a";
var description = "A truly tantalizing scrumptious frittata.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 78;
var input_for = [];
var parent_classes = ["scrumptious_frittata", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !(pc.skills_has("cheffery_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/37\/\" glitch=\"skill|cheffery_2\">Cheffery II<\/a>."]);
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
		'position': {"x":-18,"y":-26,"w":35,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGmUlEQVR42u2XfWxTVRjGZ\/gDCSEL\nThhj7LtrBZxDnHyEYAUNYRAYUcCJKDr4A1QcIRkaAgyJSgwmjSiiAgGCjhmN6xAwbG5j3UfXre0Y\nZWyjjjFWHGMda9eWbrDxet739tz2dk0RIkyT3eTJbe89O\/d3nvd5T+9CQoaP4WP4GPrDWTY+GfRj\nQ\/9zYA7Nk0pbhaKkp2Y22M6Oqx06CM0klb0yqYQLoWyl48Ffjx6sPLYW3XGeXw6u+jfBaUoHh2E+\n2MqiRShXZQTcrp4Ed43RALXRmY8EjpXrsL1qGgEhmMO4APC7TTMResrC4ZY2Avr1UQwoxl\/dYIxM\nfshw4\/PslQpw1qUBZYu5ZdeEg7tqIgwYpFA91VFw8kQYHMgNhe9zQsFSGonXH14W7aXjMql05QmS\n8iGMvTwWDD9NgZrjCujVCYBFeePg+W0hMGuXoJc+eYygWamzHxgC9PGh7mqZ8lZVYqZLJ8vm6qmM\nViEUd+uuaTKAZZGoXn0iVOckQmdJnODgBXa\/TgZvZ4+ElK1eyI8Pjhbu32+p3ca4GAEqEVz658BV\nOw9c59NITsNscJRPgD5dpLeECGBfB3A7SxCDkeStew2AOxPszQth96EEyPh0JOnr70IBGpJZ08S0\n\/KO9ER1z6mQqZ5Ws22WcCy7TSgo+nRlkr34K9BtiAgVegGpKoQdKruN3Ds7Ueek1sBTEC+NxUQhP\nY6NV997lGRy5xh3Ds34GuKsTWOhjKU84+eXCGFAdGwMb9o0kYfB\/PD6WdW8UFB2Uw+n9isGQCM9U\n97OMxLMpkXGSMihgU74CrvwuB4Jk6q2JhwGjdwIMP2br9a2Pw\/Qt3ixxLdszAhqLIwI7HEgI3Z4m\nuMh0t04WvNQIiLKVJwpgLUpJeWgyz+QNBRGwe+8YWPjRCHh2cwhp2qYQUOeGScuOc\/AGYtfQ3W92\nTIWyo4kCIMsmzY3ne5W6US3vRkBLyRy4XvwMOLVySXnoYZ7VQuvLIojuZDjJs7cJYB3LvQvDz9hI\n3DXfJuLZ5feDlbpRrShBQOv51eC8\/AH8pXkBLH9Mg+4yn8mtq7yQvpOiEITf44vyHeNxE2NgKAwn\n+UcCY6Q5Im\/5dvvU5AAllq\/hgODcCwO2Lwi027Qa+gzCg3pZw9grniLh5zv6OOl2g86imDO4D4p7\noUf5v4TBzJ3e3OLnPQfGSACxiXoqYweXurkwPpS52NJYsYgAr1a8SnJZtgOYkmiCOy2rwN6QATd0\ni6CtcLqoztKnCdgXBvNGWePus7hgRjGrPLeobV+ODtxEgUrdpE5UHToSBgXaV8BYky7AMVioTxH+\n6EaW8N2jvo6d0GNeD536ZdClnS26HKx7scF4blF0HV13vivJbcANnJU5uzA3CjJUIRJ9dWwUqPNC\nIWv\/CPFa1oEnIKdQCZ3t2XDbultYDFtI77WtMHBOAX1sm+IZvlUlo7006LaDnc4hMevC9bxBgBW\/\nyuHzXJkof1h\/IWj9xfVgPuPp7K5twrlxDjmMkcAcYywsxbMoErhL3DibRNGQ5DhgqaPSJIBXiuZI\nyohyX99FDnHhd7ze2rqF4vDevlHwg1rIm7VmMTi0k8FRM1McF0joNKltMwyYFweDZO+OETEiIP2i\nlC6lBsFz02llQFl06dDPOh0fVm58AwpOTaAJa7TzQVuSCleNa7wZ9hNGwlq\/Hm42bhTnEJ3HHDcs\nha5zK6FL9yK5LL47YpPQZl21QuxiBMGJcFKU7c\/NNDme8R6e6QGt6TR5Tn4CZB+NpPJjRA6enAHq\n0lQwXFhHjuNY\/Bu+0OaiVC\/8pfmCfBZzx\/oZzSvZrLHMV0vngaViIe2LrrYPob97D63W11V0COER\nFEtr1SSz8e\/QAngcbNd2QMOljRQFBMY4IHRB8QLaKUymtXSfj8HG88++ozqqxZvD3+TJjfmKTPbT\nd7hJLa\/lv9EohG6vXgY3GzbQw8XyeMomQnlcxgqgQ+2Gt+g+jkMn0VFsLt9GQyiEw7hwp3nOT2hS\ng7\/pmE\/IlIGgERgddrRsIof5pAiOXY3i0OgygoqRCNCIeA\/H8HihsELu9u3K+\/6XIBC0+VQSQXcY\nVzBw9qDyJeQczyq6itHAmOBn7jIuBM8ddWvF61wIbD49V\/mv\/DN1+VRcDAenHUEtz8NcN59JEfNs\nM78PVlPGoJjgmWebA\/NYPJCDDwLPwNM4OLqOjt+8uFZsQgTmzkm2KPdeZchQHPSCwqAxJviigk5j\nRPzVppk3NIDDx\/Dxfzr+Bh71PMa\/Qp\/EAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/scrumptious_frittata-1334210155.swf",
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

log.info("scrumptious_frittata.js LOADED");

// generated ok 2012-12-03 17:52:38 by martlume
