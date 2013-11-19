//#include include/food.js, include/takeable.js

var label = "Fried Egg";
var version = "1342483399";
var name_single = "Fried Egg";
var name_plural = "Fried Eggs";
var article = "a";
var description = "One sunny-side-up egg.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 11;
var input_for = [];
var parent_classes = ["fried_egg", "food", "takeable"];
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
		'position': {"x":-25,"y":-15,"w":49,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEtElEQVR42u2WS08bVxiG8w\/4CfSi\nJBASUEugBKJaSaNWbReoaqtW3VBV7ZpNF1U3LFt14x\/QRf5AJXYsSAItolx8icHhYojBQG1s48sY\nezy3c47ffucMvnBx0kZJpUrzSa98mfGcx+9833vm0iWvvPLKK6+88up\/XXg84EP07n1e+DWBzPfA\n3jtAfADY6oeI9IIFrkXEn29MQFvwAeh8tTAwO2FVxsGqEzW7OlmL\/wQ8uQ3EPoaV7AcOR4DUMEEO\nQTy9CR7tgxPqAVu4DL78Bbi2BdS4K8EiJD+9mQD4KMF3vCBUsUMYJT+3SglhHaNmlVGzy3D2foYd\nuIHaejec2Ai0bC+QvQOR9sE6uA0jPoRqtB\/lx32o0nnWw8uwpgbh5NeakOc16QL\/Q6e5mR\/j1XxC\nGEUIU0pT4noS+vwILTwMa20I1k4\/+AE5eEDu7ZOLO0PgT94Gj5CDS9dhzo3AnL4K80EPSovfgjsG\naoI9C5SO81kC7WsPp2fHRPUIopoj5SGMPMziLqzSAbk0A2vmLbClXtSivRBbXdR35OT+Ldh0e434\nIAwCNAiwEuiB\/egKxFQn+Mon0Oc+g13OEoNNEM6JGBxpAjPPgmptAUUlMy70DISeJUlQklFQsLy0\nhsrcm9CXu2GuXIG+9hrM2OsQG9fB125Q71HfBW6DLw6D\/TGI6sNrYCufg29\/B236S3DZJgRTYxYx\nWLD1HPKJeWjJ8Clna04V7Xuvkvbx8iFEJU3KuJL\/8gTWWf2RBuAjsPD7sEM34QR7UVntQnmlG+VI\nF\/TAVRiBAVjhe2CbXys469GH5O4MLayrxWvyVktQ7ihYRu0jQZlZIjcNsHT0vIMwDztZ6cDPj5NQ\nKqdOdBqW0WcnMA4RGgWPfaMA2ir8Kezpr1CO\/gZeLaohq9kVku7CSkAFa0DQd7z0F5xkUOP5rbEm\nWHGng2l7fq7taby0T0BpdSI\/rusi2DT03Snkgj\/g6PdbqC69C2P5Hr2+B2PhLsz5Ozh+8AHSi79A\nP1wHo1sppDuWVDMR6rCyz530aoSlIxMohjqaYIWnfl7cAachqKTCKCeDLpS2BwWrdNAWllfITW0f\nVn4VZjZACsLKBGFmorAKCbBKVi2uevhMIrTCOofRRAOsMQx61s\/y2yBIJftoAwZdWMIqaYkTPQs2\neQq20Qpnh6wlEVzYwilYOxmavSCIxYT8kQLMb6EVlhXicJ3dOQ0rwSRMHbYB7MIeJ0NKdjHxHNg6\nsAvrpEKRNruFGKfxTsh+kBeoLy4BWf4MLIG456SbzjbcdWHN3DaMo03YhZ2ms2cTQcHWgXPkfJoG\nI6w9Z1ujPZG2G5Xi9SySgUpNzOXkSuA6bKHF2Ya7ewpIRohD7uUoUnLxWQXMj1MqSuSQtA5ZHVZe\n00mF77\/AXgyfBBfC9gunmpAAqg0arSBh4xfDnnH2oiFjlBQsF4Oc3JfyREMB6pf9om59vWf\/FawL\nzOiY\/L2TWU3wTHT05T522XofRcOsciC35TpwDrZ1yHbVK5OSx3ObYEfrGsuuT8iYe3XPh6zi44Y2\nKfScpgbhZPdh0iHKRQp+16mCVDzh5LdnnUJsHMWNTu9R3yuvvPLKq\/+m\/gYD4H9T604PBAAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fried_egg-1334210095.swf",
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

log.info("fried_egg.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
