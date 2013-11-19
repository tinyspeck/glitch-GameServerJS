//#include include/food.js, include/takeable.js

var label = "Meat";
var version = "1354598067";
var name_single = "Meat";
var name_plural = "Meats";
var article = "a";
var description = "A simple meat.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 60;
var base_cost = 10;
var input_for = [3,5,6,7,8,11,12,23,28,32,34,35,36,37,38,39,40,46,59,88,92,102,336];
var parent_classes = ["meat", "food", "takeable"];
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
	out.push([2, "You can get this by nibbling <a href=\"\/items\/24\/\" glitch=\"item|npc_piggy\">Piggies<\/a>."]);
	return out;
}

var tags = [
	"food",
	"basic_resource",
	"animalproduct",
	"nobag_food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-22,"w":35,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADLUlEQVR42u2XbU9SYRzG+QZ+BD+C\nc8CLoGWrtfXwQlerF7mizXiTbdR6kbMWBwI1JTHiQcw8WL6ptbEFtjlJ5ngqIynMLA3pG\/gR7s51\nw308wAGJB31z\/ts12IFz7h\/X\/\/rf56BSKaWUUkop1dJaVqs7FjW63rBG7xQUlUo4bg51H+86MrCQ\nVseHtXoCRfv7SWroHkk7bCTLu8mqcYCwzwB7qHBhtd4Q0uj3Ppw4TYFyyTD5++0j1db7BYLjIlxR\nWfuDaO6tv6OtYIvduk6pa5tvZkUwCKBLZy9UwEHJmzfIbmBqL\/\/K1dMSGGQnpD1mQo5oprS6DFsM\nDqGdUjg4F7l4SRYOWjp1huzOT1Hl55+ZG3dJCHxIo8uzC2PRjMdR0sZysDXrQ9m2lit27Sr59dxO\nIXOBqeB\/tZy2T6MLMofipkG6uBwMBkDaXrh5EJxUnweNZGdmHJCZ3deurrpzVe4WXjGRgJXLFsDY\ndzEs9bjItHzufMFNIZcVkEIGejdGh83SVjYqNsmA3I68o9tN3efqT5KfDq4AueDuFOGQAeShWbiS\nIRAchtsAxWutgSmHLLa7sFfu8JNOACIHrQSUgiImAEVOEYODWo920wlHqxM+S\/RPwEmpV\/r62gIp\nBUVG0XrEoNoeCX25ewsuOlUxD5dfm7aJe9L60J22QbKMYvLZMMFVDF25qzCLtjnutRAo7bcTOAlI\nuIlMIg\/thAUY254AjPdsD129crkUEEr5rCQ7+4Rs85Oio5iqjZHhmkJmmgHFAGEvBRyEY7ju+sxo\nXhX3cBkppBT268wI+TE7XgJcTYgGbl+tcBb523w5QTlUMS8XlAOsBvz9xRjZmnOQ33NPKyARDYA2\n6igiBedw\/YSwpjAfe2ixoR7Aavo0\/ZjmF+AMHspOPKJPLPXCsjsJriFe38MV9kKBlG8GspbgRMpl\nJtH7gyRivC6rldsDJO220u9KzwWXeLujTgrE7QJtUIaKh4WE29YZ93JO9P8o4bB+2j9W+\/HrKF1N\n+Lj6H2LxS2IeiwmZwJ3nENzjm3r8RwwAjChQh4tqJBb0B++fzye9lh7lz7tSSiml1H79A\/9YjfMI\n\/\/ymAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/meat-1334212028.swf",
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
	"basic_resource",
	"animalproduct",
	"nobag_food"
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

log.info("meat.js LOADED");

// generated ok 2012-12-03 21:14:27 by martlume
