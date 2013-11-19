//#include include/food.js, include/takeable.js

var label = "Awesome Stew";
var version = "1354589325";
var name_single = "Awesome Stew";
var name_plural = "Awesome Stews";
var article = "an";
var description = "Chunky awesome stew, so thick you can eat it with a spork.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 268;
var input_for = [];
var parent_classes = ["awesome_stew", "food", "takeable"];
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
	if (pc && pc.skills_has("masterchef_1") && !pc.making_recipe_is_known("40")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a> a bit more."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIrElEQVR42u2YaVBTWRbH\/TJ+mJqx\np6bLZVTcbQUVtFEBQbHVEVBslriiLaIoiMoiIIuBYMAEwq6sIgSCQ4MKkR1cmqEAcaFFBdwRd0HF\nuJYf\/3PO02RkXLvbnpqq4VSdekle3r2\/e\/7nnHuTPn16rdd6rdf+twzAV69evbK8f\/++88uXLyWf\n411dXc78DD\/7xYFevHhhRO587dq1mtbWVk11dTXUajXy8vKQmZkJpVKJnJwcHIyVojA+Avn5+eiS\nGaApyUX4XnFxMY4cOYKGhgacPn0a7e3tmnv37tXwmDz2rwbr6Oiwa2tr6ygrK4NKpUJiYiKSkpKQ\nkpKCtLQ0ZGRkCICq9FQ0yVfhgq8VWqSLUJUixouw\/igsLNQBlpaWory8HFVVVTh8+DCOHj0qAJ87\ndw7Xr1\/vePTokd1ng5Ekdg8ePKiprKxEQkICYmNjER8f3wMwNmQL3OaOgMzZHCcC\/o7OA0vwME+E\nB7krcTdnNQpdBiNg1VwcjAyCOjUGBXk57wDW1NSgtrYWdXV1IGXQ3d1dw3N\/NLco5DWnTp1CTEwM\nIiMjoVAoegDGhfsh3MsR4SuMELBoLCrch0OTaoLurJk45q2H\/W4jEDB7KH6y\/Stq7QYhcdZAhMwe\ngl3Ww6FaMgBF6wZBsX09DuQpewByNE+cOAFKIzDDO7n6Js80LEtERARkMlkPwBiZGEEuFvAWjUeA\n4ziE0TXWYRwq1xijInk59jjoI+H7MTgm0kPVksGoWPAXNC3qi5O2fZFt0g8HRP2gFH2NDTajsH7B\naLjS1W+lCdIVvj0AOTgtLS149uyZRpefbyKnKSkpgVQqfQdQGuhGg02F9+LxAmAIAcrIT1qPwSZz\nPaRaDsePJHf9cgP8vHAMKmwGIn3FMKSJRqJo2UCol36NXMf+cJk1DCvNhyJwmT487ccKkOusR8LD\nYSKS5b6or\/1JAGxqagLlPkdSI0SSdFdTokIikegApSF+EG9yhN9yI2ymwTbQqv0JIM7DGOE0gcqe\nokhgLmZDEG85FEecRuCy85\/R7toXP68eCJXTcGSIRiPbSQ\/lTgMgpueXmQ6BEwHK1xoizdcM2SHf\nYccaQ7g762P5urFwF03APzITBcAzZ87g7t27YDYGBLcOLWCw20L4LdWHL\/sSfaydPxIik8EIc5qA\nPMlsVO5ywD+j7ZHrNAX7KA+9rEejbHU\/xNn3R+jGyQgOMkTC1mHY7fg3FDoMQqaNHpKdJiFLsgAp\nPqZI952B0kR75O+0QspWU7iKjWEfZgAPjzHwXTwOSTtcBcArV64wIHoAbt+8FP7LDOBHUdq2cgJd\nOWrfQrnNDK0lG3GvMVjwW3UBaFQuQ5PHVzi36U9QOOoJEYre8C3agocgjBbnR3J7Wo2Cv9VQQd4E\nb0tcPeKNs2o3tJVvRmH0QiRsNqa2tBjF8XaIXGcIOXnoKgOU5O\/5NyBrzQkq3uoqwLEHOU9CRpgl\nylMWoCBiNqqTHNBS5o7yXbbIFZtDtd0cRV7foHzdAKFgGIQBZS6GKIqygYwixp9rne+tnqUHP5k5\nVu2YIEgc4zaZFmQExXojKEMsUBA1F9mSmYhcb4hob2vuj0Ie9tFoNPuYNGSjjQ4wZI0RcnfORniM\nuQBYKJ+PvB2WyPQ3pet8KAMsEOY5Bav8XgN4W7\/OMekPExGzfjJiKJIKgpXT+4gVBnCnBQSTKiKZ\nMexCv4HYw6AHoJ\/cBJIwY2SJLSBbOwlS54l4\/PgxR1DZh3aKeU+ePEH7xTMENl0ATPKciohQUzhI\nJyLS2wgZW02Qtc2UpFiKc8ci0agOhKdkGuWOPgJcxgmSbrIZLUic6jsLse7TEEsAcoKMc5+MBEqT\n7O2WVK1zEbrFULinBfT3mQLHcCPYB40SJGbA08f2C\/IKO4ytre0fqby7+AOG3CteiNygGSiiqOUE\nzkB2gBkOKuYKcl+ui8GtM5loOOCPqJ2zECKdjoxgM6jEM1GdIkKK1zQk0+J2Uoq4zxuJDXNGCM6A\n7PtlVrhR66\/L5TrVD4jymootvkbw3EK9dfMMHdzt27c1ukZNG3wW7b14\/vy5cLOpMpW2KQcBkEHz\nw7+DMtAMLdVhuNecgtrMlVArrAXo0t3WUIVaINV7Gs4fluP6yTQkbjHHJpKV4TwpsgKc3BoNuatx\nOHWJUMEqyRyhSFjiePr+ofRAPH7YqYXDpUuXlDrAuLi4qfX19ULlUFiFL7HfaDuOhqJo7AuZJ0ic\nE2wBdaQV9vqaIE9qieJEK+yh1z7iabCTjEe5mhruwW34Ufa90O9YYq5ObQTjN05BNAEFUdNnP5C0\nDS0nKnVgdCzD2bNncfnyZS6S4T22u4KCgtwLFy4IN2nj5goSnB\/UdHehtaEIdYUKknOOALhfNg\/7\nqOrSfaZjsfw1YLiPoVAkPrZjyamv2Y1FGLWrtwHL9gajsSIL929fez22RoMbN24IJxve8ngX6RE9\nrUVFRQ2mc9uLN\/Q6QNoXddJrvetOO663NqCxNFnw6opklFUkoqEkGQ3FSah\/43WH2Hej7WQVOt8A\naZ2rlBVjKK03NzcznIbOjO8\/2NIhdAV3cYbs7OzUAXKV84Ba5\/dPnz7tMeHHnJ+hI5ywfXG0eHz2\nxsZGHRz3Yv6MAD9+NqQDZpJWah74bUDOT56I4elUjDt37uDmzZvgAqNV4+rVq7rJP+VaSdmPHz8O\nnvO90r7PaOvbxw+wBNqI\/ScgR+O3AGqjx3AfzLsPmbGx8R\/onKbkgXhirbRfCpArVRu98+fP\/zK4\nt42O6BtpdXd48ocPH34RQI4WR42dQDs+mXOfsoqKiv60ypMsN4P9FsC34SgHaz5Yrb\/UWHJeKbcA\nBvo1gFo4+umpodd2v9sPd4L0oh83zbdu3foswIsXLwr9jeCa6bTs9V\/7h4G3IoJzpr6mpIo\/RU2+\nm9Kh+9ChQ91FRUXdtJAaTn6qVlfK5TG9\/8n0Wq\/9v9q\/AMfdmPDjg+TTAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/awesome_stew-1334207757.swf",
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

log.info("awesome_stew.js LOADED");

// generated ok 2012-12-03 18:48:45 by martlume
