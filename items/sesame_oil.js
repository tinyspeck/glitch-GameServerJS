//#include include/food.js, include/takeable.js

var label = "Sesame Oil";
var version = "1354588648";
var name_single = "Sesame Oil";
var name_plural = "Sesame Oil";
var article = "a";
var description = "Some slippery sesame oil.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 4;
var input_for = [];
var parent_classes = ["sesame_oil", "food", "takeable"];
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
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-47,"w":14,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEXUlEQVR42s3X\/y\/cdxwH8M9S6nvP\nqlQVV9f6Vk6PGmGOc64cdb3ijnK+zJd+HZtdLQwthmm1Fm1VbO22KGs4hqNsPxSrdqgthm1dF1pf\nLrgvKm2yZIksfY7bKru1yX7Y0s\/n9Q+8H3k+38n79SaI\/2FqPIiURl\/D\/htBpv3f8F\/t\/+mg9WcL\nCdvoBFVGnUjvfyi2wcj+LejhmKHBxwAEleZFwBpXgjoJjpzk5\/2QvW+lN9VvpSXWc+Uy30lz0Y3Y\nQxlg7+fVmQ8XNeqRX2bme8fvLVyXd6ooVfFA26d1s5pHS8+AbbeHF9\/LELGpU\/FXzUNTiyrVGrBv\n4v68fHhsseCYSEIJ3Id+hNGP396a1AV+rzxXcTqXEsDLYZt2Td4bfTy5oANUVZ0vraEEsCmLFz2v\nVC7\/Hdg5PKaqLMvvogSw5Z3w1MXlx48eLKg1z4BddykGHLwz8OT2rb4nTdevaRoaPlmqr7+6XCpN\n66YEsIJtllGSwEF5cuhT0Q4CMQw9CHaZQsyyGaUEsJJjllGZyEZZPBtxDALRDnqIcjZbBVrPUCRB\n06wz8f6oeTtOCxQ7GSPamaYFim0JI3LvX44g92ys168fSQ\/hfEbEX0AjiN0swLPVh9BjW98RMY9G\nCk6WvFtaHLzlaUPBG7iSk4DcMBe8G86E0H71HrqaI8rdGoE2BghxtvqOFGD1PtrEBYkPGgtTUR7r\ng2RHQpvgGlDAMESMhw3CnSzxuh3td4k4gvnSgWfZBoq6IzzU50pQLGQij6mHdKdX\/gQ6GEDsabda\nsR28zAkkisLYpABr04PQnheP+28GYJBvgZshNBQzN2qBcXvpiGLRyQNe4Bgqmo9yMFEiwfTVFExU\nBWIon4lO7iZku5sg058BibcDecAmPk2hKYiE8poUii+l+LlRgNErHPRJd6KZbY7mA87ID9xJLlCd\nx8dSfwUUPdnrwMFLXpCFbIZM6Ip8jiPJwNKDWBo8h7nut3SA7THWaIl2xymuC8kVX5JAc6cCczcy\ndYDdx3agNcYDp3m7SQbWJkEzUIrZrhO6wOMO+ELMQlGoO8kV18RD\/XURZjuP6gB71oCxXijme5AM\nrIqGuq8Qs\/LD\/wAy0HbIGyXhLHKByoJgqHrzMNORoQPsEG9He4IP3t\/vRS5wMd0Nyu5szLSn6QBb\nQ63QIfFFmcCbXOBCihPmykMx3ZayDryZ5QBZsCXkyf4oF\/qSDExk4EECA1O1kVrg3fK92qdOxrVE\nZ0oAKqL8SAbG22Mq1hbjwq3ry4KcbYoWrhU6UwPJTbCOa7wKtMOUyAbjB6yeA3alBSGHxyR33ar2\nN8BQpOVzwI\/ZlvhAxIaETTIwh0Ugy53AYVdCZ6MWu21GpiCAusCk1+zJB1YFGcn\/DSj2cYT\/Vv3f\nuBbE9pcOvBhssueUr\/70i4AnQllaII9uglC6cSlp\/+IzPIJW6LOx6KSnnuw4c4MizWWDIsnFQJHJ\ndRlL47i1RtgS\/P96xh9ToCNGxTDWDwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/sesame_oil-1339640371.swf",
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
	"food"
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

log.info("sesame_oil.js LOADED");

// generated ok 2012-12-03 18:37:28 by martlume
