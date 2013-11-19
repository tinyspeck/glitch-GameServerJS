//#include include/food.js, include/takeable.js

var label = "Salmon Jaella";
var version = "1354649353";
var name_single = "Salmon Jaella";
var name_plural = "Salmon Jaella";
var article = "a";
var description = "An assortment of fresh Salmon from Jal, Rice, Legumes and veggies thrown together into a dish Jal-loving Glitchen identify themselves by.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 241;
var input_for = [];
var parent_classes = ["salmon_jaella", "food", "takeable"];
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
	if (pc && !(pc.skills_has("cheffery_3"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/69\/\" glitch=\"skill|cheffery_3\">Cheffery III<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-20,"w":38,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI+ElEQVR42u2XeVCTZx7H3U53uzs7\nO+paHY8qXrurXRSv2qpVVGzrrteWIhUsR1VQPAilClalaRWF0QqigFSoXHJJNZwCckQ5BMKRAQmQ\nQAiBhCPHm4OQBBC++74vkpZVV8d1dvyD38x33vDM87zv5\/ldz8O4cWM2ZmM2Zq+P9XTetuztzmQa\n5LnMAVWB5WsFp5MkWui6c6BXFMIguwsjkY9Boz8D2L9D1LTTUib2Z2gVdexetYDd1ZQUSAj9x\/9\/\nvdeRKdIT1egS3IBSfBtaxVUopL6q6ho7Vad8D7TEEeh7gtFZFoLMfy3BtTWzcM1mHff44qlMSg3s\nWGavvIhJtESYvTIoAGb86CAnCTueK+FEQdx4C1W8RvCzIyGJnQWi+kP0i1bA2OEMot4Wyvp\/ojnl\nE8RaLwIJZdLJtZNRVxEKEhDK5nCVtqtgx6uAi9T16sH2\/RoPwjxxP28N7pdYQRS\/EY\/uHcBQqgt0\nvhaQnp4MzZ3JUD2YC6NwN4zdLuhJ3Q2W\/bsoCfdATNocXEr4DaISZqAm4QCaC3zQLYiAUsgXcc8c\ncnoZsB1DQ0MiYZsUCZl5qCjxRWerKxrS34GW9xWGWreDUDBgrGWg\/9JaaL+Zi97vzdF5Zhb44W9A\nED0Ocp8Z9JiW3EBJpgey7m5GsuMMOuyhq2chbv0cpG6ah8yP50N48xqLitSLgI0nxeqUK3E79z7K\nin+CQuGLNuEuNBeugaTZDYauY1AIHdFfvRqayo\/QF7cN+rNLaUj9mcXDz8d\/y7znQXhoOlq8\/47s\nuHOoTnJFSYg9Lmx5lw579LrZuOHxNmLi\/gKB+KaKcszz4LiiqjKkb11E76ySuQFN9zagJel9GFu2\nYqBhEwx566B+SELxNsJoOA1jnhP6fvgA2pPzoWMuhMp7NloZM1HyxUQU7p5AK3\/fDCSG2KAoxQ2i\nan+0VPki44InmEun4eL+CQgNfgus69ug0WhIBDg9C5AlaG1HdPQN3Dy8ig5HvvtcDHRsh1qwBcaG\nzzDY6Q59lS2IzLUYqHNAb60tNNmf0nDK7xahwnkSDTTyzLOfiIi9C8kQf4eO+jBIai6iusQdpXeO\noKn0PH7YNlxISRvmINdlKUQ1oWR3YJH5GckWc75i\/BrOydjXj+SsdKRkJSE6xZZO6puBEyH3Nwdx\n9W9oj1mA2gtvgnuJzK+0N2nw\/vZNEIf\/Cd1fzxrlsTyHt5F4yAK3QnajqSIIjVFedEQoRYeYoY0f\ni8YHPsiKskPUwbVgMSzBveEIfokHhJVn0VR2Eq0cD0jKPS1GALmd4kJIGyNh7BGhR9MIXjkD8uCV\neBS8kaxWVyDeDga\/5ZAfn4kGr4mo8P4jOMd+T+bXZFTum2qCi7WfjmsuH6Iu2QsdxTGQshNNcCnW\nZgiK\/y3Skj9FlN9G3PJchXy\/zRCWeyInzgaVOW54WBaGdhEHrXWRXBIykoakAk+IU2DUCqFTVkMm\nCIc2fieM51fCGLAG+mAruiIHLq8frloypCM5Jzg4bRRckPViukIp3bKaa4KjRIWz5l4gmiqZ4MS5\n0mPUvLu2i8FLcoCg+DAayy+CIAgKidla7hHYUOgGGlAlzYGowgtFOT6oj7YHcXwuGbqZJlFVOVKp\nFCj1W\/nNfFNoU+0mIdJ7K+I3L4TfihmmBn1m2XQTIOeUA\/iVoShLODzcvC2m0nPveK5FZfTndFjr\nH5ylAck2x6aiW5buyKAAVb1ELdqqvBF93RtNblNQs2fiE2p3n06DUZ6jQNsZ75jgQpk7yCiw0Keu\nhLy5ZNQpEm41EwkHp9CQdxyXISPMGrFHrRC0cymu2C5DA\/syxJXHICxzB+++O3Q6HeUz1qgTY3BA\njzauDzjZR8DbN+mpgJQoeKqVSL3m0dVaum8aTh9cDWHVJUjrQqCV3KIvE\/4fLzEBBkS+QRcd1Rko\nyLTtC5AUugVl6c7gFx0Cv9idBPSiAZs5p\/DYfmk3KoPBkhrRyLhk+XtCEPbJMwEp8feT56rrFLC\/\n+DP8XN5Dgq81+GV+0LT\/DKIlBsKKs6jJ8KfhuHlHUcp2Rl7BP5C8fykNmO+4HHVsN5RnOIMVsQ0Z\n0dYk4FES9BAMmiYqvCKqL4\/qg11qHZuClAjZKE7ejcRvrRC3dz6yHCc\/FbL2wDT4WM+Gr81fkZnw\nGXpkpeDdPY0r9isQ5vIBOD+fQHXGt8i+YY\/Un2yQm+SE1upzkDUGkbl+AndibRB2bh3Cz29GW0Mi\nBFVXIGsrpF2n0vcznmjUBfUiyw5CS0+QdwmQGuWE0gg7xDmtxGWH9xDhaI5Q1yUIPTAsv\/0rELjV\nHOf9f0eHLzjxLdxjOSDMdRVOrZxJe09YHoD863ZI32lOey7XYRmqA3ZBWuOLiuyDCPdfj\/PHlyM9\nzh1qpZT+dpdWLxISePo9Mr9OGChSaPBocGgYtLEA9eFMOmeog\/3XB\/yIok5NwI8Bf6BFj21dgKKA\nnZDyQsmqvIgMW\/NR8ykle6xCffEJiOuTIG6uoL\/V\/2gQLUod+N06i\/96YSjgtbDru9RQG\/rpRZRp\n1Z3gxJ9BKfMjFHz5\/hMf\/E+xD6xD+0PyBInzQJq9BVnli5GyaxEy9ixHVdiX4BQEQk10DL9bb0Sb\nUgse+c1GmYbx3BtNrlA4vkQg4VIL+HItFBoCfcaekcpCn66NPKpyyH52DRLeVQg536PgpjOyYu2R\nEfU5CpL3Ii9pD1ko\/uTF9EekxezFg7sXwau6DUVXk+k9hE6PqpYO3G8U03D13drAF74PUpDlwg4W\ntVBAQko0vZDpjND1DWBgcBAva4aBR+juMaC8WYL8uhYT3At57mlWKZYx6rrUqgaZFmJVL9rVZK8k\nn2J1Lzq1eihIaKW+D8rePih6jZDrnhS1hlpLvYNSEb+dhiOjBF6nmlsv7\/nf\/jOsbiHM6rpUgdTL\nhWQSU4CtpESEjk7qZmUPmhQ9dDo0PoZ4mihPUVAFPBHIjate2mvPMmqnZJ6wKBAK1ASoeD5grZSg\nPVfW0qGiNvvMNvJKQAmDGbV7EorVJCfhSLBnAVJeqxLLRBxRV2StVLVj3JiN2ZiN2etp\/wZz9sXu\nLu6rNwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/salmon_jaella-1353118491.swf",
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
	"newfood",
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

log.info("salmon_jaella.js LOADED");

// generated ok 2012-12-04 11:29:13 by martlume
