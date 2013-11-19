//#include include/food.js, include/takeable.js

var label = "Banana No-Names";
var version = "1348007899";
var name_single = "Banana No-Names";
var name_plural = "Banana No-Names";
var article = "a";
var description = "One banana fried to crispy, buttery perfection and drizzled with honey. Mmmm.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 40;
var input_for = [];
var parent_classes = ["banana_no_names", "food", "takeable"];
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
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-23,"w":59,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGxElEQVR42u2We0xTZxjGm\/jPFjeJ\niZrNBXEj0ehgqIgwp3OZS9xclt3+MS6bWZbFZMl0mVemk3nBeZngbV62YTuGBBUtKCqMS1lBoKVw\n6OUcyqUtWGhLS1tALt6ffe8H7WDGbU7c\/umbPEkLzfl+53mf9z1HJgtVqEIVqlA9VLlz41d7chOS\nxJ0ypUXxgryvclWSr+AtlScnPtVz\/sVF\/wtU4QZZmPXwkyqrYiY8OQnoLfsELVlL0Kddg4HaLejM\nexXdpR\/x\/xGorzA27D8Bo4M8F16RX5VH+p3KJRyGICzyaLSdWYiukmVDUAkc0ntxKaQ9j0GXJMOV\nRJlQvEYW8cjgOnPj3\/bmLfaTS43Ho3BTSg3CGPdNCn4OyJk9F8L2MdDsGI+GtDj4ipbzv7tzEmx0\nrVEDy\/9SFuNQvqbs1yWih7Wyt3IV6vZOAstZEMawdzwc2fEjAJt+iIR5\/3h4zs4GRWH47xsy4lQP\nDQbLrjBv4Ydycf9kP4FRywKH6JLHBQ9rzYiGfu8EiIpY2E\/P46Cus\/GwHp0I64lpHI7c9JxfyG+O\nrmPLmgcpPe7hBsibv9TmOLsEFsXsEc4QEDkW+N52ciaqdj0Nkzx2hPS7n+S\/DfyOBslzMhKazTKU\nrpPh1y9kgs\/ni\/j3q4Nd1Jw67p5sWdMiIR6O4J\/JKcOhZ6HdFwH9T3NQc3xWELB00xMj8lifMh4+\n9VreBXLQkDYbxuzP0SJcFBxC1uoHgnXnxAvcnbSn+AGBtvG8pTzFXI1iayWOHTIH5dsn4krKNKgP\nREOVEoXS1Choj8aQQ5B+jh3M3PfhcChfxw3jbt7qDmU8xJ\/joDs4DYLiPXTYBDBAeL1ewe\/3\/zWs\nTqcLs1xaqbp6ah6q90yGNTOOO0Iwhp9ioNr4ODRHYlDGgNQpM1C4\/jEUJIejaPdzKGWAqiERoPDD\nLO6ebtdE+AvfBw1awFUCNMrnoi7zHTgtGjiaq+C2S3BZq9HV1UUSrl27NjKnVVVVq2tra\/3NkgY1\n6W+hOHEsKg5Ho+JQFMqZS0Ubx+K35MkoOfYmCjK3oOTIMlSmfwadKgNFB15C\/p4oFChWoWT7FJ4z\ncrMmdSrMxyJhz0qALT2GDw1lkw0JTIo41LKbaDUVcCifz4tOTwe6u7vR39+P3t5ecDCtVruIwdmM\nRiMcDgdsxhKUfBOBwrSVKEtfgeLkqShY9wTUeXJUV1dDr9fDWq1E8YZxcF5tgsfjgdPphKjORGlS\nOJehNAPluftQtHUKGo88A2GrjKviKz4gsGXGcsCaY9HQnPyAQ7mYk11dfg53+\/ZtNFusfplGo0li\nQl1dHT+k4fIm5lQYjBe2oTbjU6h3Pg999lo4Whvhdru5msoUHK6V3QjBtTfXsra\/wcEaSg5Tlnim\nSGVH30Xl5jFolM\/Htap1waFp+SWaA+oVC9BhF9HT08MGJhsDA\/0MtgeS2cwMa4ihzIEADQYDXC4X\ns\/x1GI7Nh6VwOyzac9whghLz1kC8uAbm8+tQkTIfrjYLl+7EMpR9GwXLlXS01RfxPBEYCztMyg1s\nYJbypwllkHZgIIP1P87ggJUHp6PFkA+WN9y4cQMOZpJRlJQWi2Xw+T0wMOBnX0CgNTU1aG1tDTpF\nIodILSJr+9cTYDy3Hs0MpmYITLqUDLfDBo+rFXVnPobxchKDrIWW5bSp9AjEnI1oy\/pjl7aw4TP\/\nEoeqvSwGJ2JRduEg2tvbeVubmy0QxfqkkU8MIIZJeevWLXR0dEAQBDQ2NvIsElhnZydXQ\/4OCDvH\nQfguHLrd4dwdAgu4RfI4WzhQ5f4FsNflwVZ1kk3+KyP2KHvMceeMx6dDp0xkLR1g1\/fCaBL9kiTd\n\/+nCICOY5Ex+CqzVauUiOMrU8FwNhyINrQU2sSzw28KgT1\/O9ttyGLJXoYK10HVucIc6zg7uPwI0\nZCzhJlhtLTCZRFWwpX\/7DAbCmJLu3r1ru379Oh8cu91+XygS3RDJnP8tpNxEOBvKeaZIqpSZbB++\nwNtK4u6lv4wmfTGkevO9LX2gFwZgBZPAYAdbyFpOTg6HItEEBhQAs9ed4io\/vRaFhxajUvE2tKdX\nQn95K5oNKt5SURRH57WLQS6inDLxMN8PikTLldTN9pmv0807oFarUV5eDpYxiFI9TKIosM+j\/\/I6\nlNNUyumdO3f4WhgORerr6wuKBoAWLlUH2wgmUWJ5k1If+av\/UE5XU07pcNoAN2\/eDIq+0w1Q0U3Q\nIIxqSx80pwxUhT8VrQ5yjQaBWsqfCv9nDeVUHgBsa2vnrlFL\/\/EK+Q9hY2w2+6JHMgihClWoQjW6\n9Tsiv212+flsIgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/banana_no_names-1334339788.swf",
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

log.info("banana_no_names.js LOADED");

// generated ok 2012-09-18 15:38:19 by martlume
