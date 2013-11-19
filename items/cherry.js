//#include include/food.js, include/takeable.js

var label = "Cherry";
var version = "1354601203";
var name_single = "Cherry";
var name_plural = "Cherries";
var article = "a";
var description = "A basic cherry, freshly picked from a <a href=\"\/items\/291\/\" glitch=\"item|trant_fruit\">Fruit Tree<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 1;
var input_for = [52,108,109,111,112,113,114,115,142,144,172,173];
var parent_classes = ["cherry", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by cherry)
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

verbs.change = { // defined by cherry
	"name"				: "change",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "With a Fruit Changing Machine",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.items_find_working_tool('fruit_changing_machine')) return {state:'disabled', reason: "You could change this with a working Fruit Changing Machine."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var tool = pc.items_find_working_tool('fruit_changing_machine');
		return tool.verbs['convert'].handler.call(tool, pc, msg);
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
	"sort_on"			: 54,
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be turned into other fruit using a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit",
	"basic_resource",
	"trantproduct",
	"nobag_food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-6,"y":-22,"w":12,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEg0lEQVR42u2Y729TVRjHn9u1RVCp\nIwHFYUr0lYlmWYzG8KZRE8MLzDT+AQiMgXFrRcC4xFEG2+xcR+laZB1z\/TmnG6xdl81JdXcbqIhi\nSRTURS0agxniavwdYnz8nnJqGpxsUm\/pC07yTdt7T3M+9\/v8uOdeomujCEdwkNbu6yGbw0emogQc\nnLhNbQ\/reIeb1hYdXF+CTABMN7QrSesOshcdYH9iiT0QW8S19Tr\/5ud0\/qKCiwyTeWBsedoVEHCK\nWr1d4Q1Pkbl4wnu4NNnZZ0yL4rDZlWhdq8JP1FK0KOB6hxfZe0cWc4vvYmFse4HsL3YrvHFbBtJ\/\n1UMbiRvZG9G5ssesDVTpDCqoZIWrnhGglKyuvkptJxTT+bv6lVRu33P0kUkANnYovGU3cnFLxsnU\n+hoqL7h7gQEd7wlS5aXnWgPkz0LWOWW4rZR+8tkC9ke45\/JGFHW2c84ImQWgyEXxKYpm41aF11kz\noIXpkSK0Dd5\/upfjokvAZUGFauslZC25NIULD1H53qCSmmteNtS5oLadFyHXWf\/94vIHHNTZm326\nebkwm5M1zwPQRinNAEXu7eqYf1W2opCcAUpnQXd6FF5v09BFT1hJ\/9f\/7AmRJQsoeuTWRo0KJhQn\ny\/7e2at3ruEMki0b6iafcFGDO43YlIocvNL\/I9SqgGzuVHjTdlI1KZC8AGWPdHShP7Zo0G7yBcxt\nP9jY5ndnOU56y0kyqKdogTp1Q6n6KT4nLYaUp06Xeg3Hx6ER6BAUIb16gPTzAm8Lkr3Bm8eeMUFk\nOkbG6EkyMqD4S+jbspV8xPIgeyuWcktVCQfLzDxxdwW\/iTlx6FUycDfkIYN\/PhUN9648vJNY5AMs\nehpgKcP1PL3czOeXlvH5hSaeuW8Vz6xew58D+DjmjEMjUD8UBOBLkJNKLhu6+vY8djajZCg\/isWS\n0NR1i3n63lX8Y+Xj\/NtDq\/mXFbfzd4D+GvoEOoE5k9Dr0CEoBLj9GUC9SlqNBBntb2MxEd6fDkZZ\njD\/TP\/AfGzbxhbsqeAZg35TenAn9h5hzBBqVgGHAdUBtkGaAcNCfdXC65mn+NRbnC+OT\/HvVZv75\njjs5DUfPPfLYZR0UgLtIow2qqEqxqMjBz25dyWcfeJi\/X\/Moz9xzP59bcCOfvWkZp+DgRzifzcFh\nmYMBmYOtWgIOoXrHsNi7MsxTS27hM8tW8FclC\/kMXPsCOi3DK1Lh0ir2Qi1ahngQOfgGFpyA3pOQ\np2RRCH2M3wLumHRPhHcAigCqE9oLNZEhqRkgnCiHi5yQ+SWcfB86ISW+vyPhxIXgghhN++\/wivzb\nTQabtq8x4MCQBBiToEdlxQpn35KVG5e5F5buuSFHRho\/ZkbQaPulO8MS5rDUqDwWg\/okXJfMPWem\nOAyFeVgPo9mKxD8IiKgEisl8E\/C9OBeScPtkaJuhRirQO5mX0Sb8pE8Lh3qgV6R6JFi3DKs3B65h\njlvc\/z46AIk7Q+qAdEpIfPdJ19wyrE24kILD5Q43FvdgKyXkhlxQG+SgkkrNGvK1kef4Cz8Ww12O\n+048AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cherry-1334605821.swf",
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
	"fruit",
	"basic_resource",
	"trantproduct",
	"nobag_food"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "change",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("cherry.js LOADED");

// generated ok 2012-12-03 22:06:43 by martlume
