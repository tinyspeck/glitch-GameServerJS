//#include include/food.js, include/takeable.js

var label = "Lazy Salad";
var version = "1348007854";
var name_single = "Lazy Salad";
var name_plural = "Lazy Salads";
var article = "a";
var description = "Sliced tomatoes and cheese. It doesn't get much lazier than a lazy salad.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 38;
var input_for = [];
var parent_classes = ["lazy_salad", "food", "takeable"];
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
		'position': {"x":-19,"y":-18,"w":37,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGAElEQVR42u2Xa0yTVxjH+bA4xQhF\nnIiiFRRQkHkBL1Nm1SEqwzERNfEyovhhxmXED0u2ZUuTabLtw0Kc+k1tzDazmWDxgoi3t5SrFFoo\nvdALtFCoWGhfWi7FFvjvnBfpQGXTecmy9En+7due8z7Pr895nnPeBgT4zW9+85vf\/DbWHE27gj26\ng9mm\/BjxfwrMazoo8BhyRH3KPawpPxqa8yHQnOXxX2vQy7GTMgxZSXkTjbs1e\/nepkNCjz7H5NVm\nwKNcB6c0BupzPA5Qe5aX\/VrALkUFBItj384rWDwZytSFkG6YLnoqYwTMq90JT8MmeBTLiN7l5JYt\n8QGqzwUJKzfMzyO+FNQX\/cEvXz\/GnFxxzCSReNFkUCm3xaHivVCUr+CJHmeLcYjTTK4riT6oJ0UB\nqVQ5kVBticX1hGmggAT0xeuyYXuCyJiVxFh\/SGHoUvWr9uLG2qnsKGDVxvmQb+CjcmUozN+sg9d4\nGOrvVkGyZhbqPoqB+YsEsBeWwXVrsQ\/QcPEd6I9Fs7ItC3D\/gzm4u2omRv29WI0tektQkjoH7O+Z\nXGAqV00GijcH+hxS57LUeahKnom6TZFoP5GCyswo3\/iVuEBIV\/AgWT4V2n0LYP52ART7Z0GVnoCy\n1TNRv3khKtbzffPzIwP+uXEK5XK+jXXmSjKjFc7SHT44KptkPe6k81BIluVGfCDuJM+ALHk2atdH\ncIA0m3LBXNwShHBwihRSo4LpkKVHwpCZCD0RBaJjdxJDufljAWlSJtwGRmtoyHoa+jYzCve\/j96y\neFLo6+FVb4O3cTd0Z2JRui4CMgEf9VmLoEiN4oJUfRgBaVIQlDui4bj2MZxMIuQZC1FPapRKRkDH\nLiWXXaLy9PBxgNpTx4UA\/soi+RA84PWK7ZbfxmWqXXoQRYfCUC8MH4EcrZ8zc3zOipbxOOe0DimE\natsiWE9v5O6nc7sux+D6iinjoHyKnwzJ1hmQLJkCReYCtJ5bgq67ybBcXwr9r7PhMOYzlI0Cstr2\nh6ir\/ckHN9D4CdrOpqBqz1wwu0IhyZgB+QHSBN\/Phe74nGcHJCpNCuGyNwr4LMgCouLl03B7UyDK\n90T5apDO7bjB93V4p7EAlC2Ae+3rQ6XyJpr\/mOWbQBuBdiKtIU1aHLeM1WnzUE62lJLVYbga93Rm\nJKQZHFczxgFSNZ\/iQ7tzGdmOwriupR1PweqIbxqD3jsWUPvLPHSbrlE0UEARvXjkHYSt9kc0XkxD\n2dfTxgWmS1meHAFlZjy3b9WsC8fdnUEwiaJQ8XkIitfwcIsU\/L2lQWg9I+AA6YlBZSueD9N5Ptpz\n14L9dCsaM5dCtj0a956oRwrokm1HW8kRPHK1cHBqywMRBeQPDQ1jcGgIQ8PDGDXb\/RIYLvyMmi8P\no\/RACqfiD2K4ZSxNCUFR9lSoToZxv1iyfTrkqbFcHeqOrkTdsQjUHgmHYl8kqrdG4tbuYDBH5sF9\n8ivYTnyGyqNZ0Jw67hONNTzo5OJ297vR2N6BYqUW+eXykWbxDCLbMzgI0ixwezycRq69JLNeDn6s\nOVRS2DVSOPRSuFpL0VlTwgV5Ur0WMyayfhLD5nTB2NFJZENtcyvuqfS4Jm\/AlRolxNX1ueO2GQIk\nojD0xt6BR3C53eju64ejtw+dPT2cM3vPyDV9p3XrILKT8a7H33e6evCQzOtwOvGgm4jthpWozc5C\nRxqxwWKFsqUdZbpmSDQGDuhOQyPJlgZFdRoUKlQEUIUCmfLZRx4BFE4ESAPToDSgpYuFudMOk62L\ny4DhgQ0660No2zpo3UDZ2o46cxvkJgtqSGaqjS2oMphRrm9GaaMRJVrDhIBXaxtEl27XBE94iri9\nXkFPv5t904AEji1UqIXPdQbTDdLVO5Dn7HO\/AUAdbtZrGFJ7S\/\/VIxbb05\/b5XSxrxqQURtYpkEn\nvF3zN8v53M+BJKMd5OHByrrELwso1eiZEo0+95WATWQWlhW02O3CpoedeUarjSFwDNm7GHWrlVER\n1bW0MfLmVobAMbImc57M0CKsMJgE\/r+MfvOb3\/z2P7Q\/AbqgAB6m0+8eAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/lazy_salad-1334209715.swf",
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

log.info("lazy_salad.js LOADED");

// generated ok 2012-09-18 15:37:34 by martlume
