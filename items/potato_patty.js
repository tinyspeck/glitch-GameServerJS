//#include include/food.js, include/takeable.js

var label = "Potato Patty";
var version = "1348007886";
var name_single = "Potato Patty";
var name_plural = "Potato Patties";
var article = "a";
var description = "One potato, mashed and fried in a pleasing disc shape.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 33;
var input_for = [];
var parent_classes = ["potato_patty", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
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
		'position': {"x":-21,"y":-16,"w":41,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGX0lEQVR42u2X6U+UVxTG\/Q9Iv5RB\nEZQBcamC+9IFtdE2RqNpGr\/SRGvUtKHWUuPGuIFsFpGKW8tUba2pTUibpiJLUbHINjA4CzPMyr4z\niIK7p+c5wzvFpakVbfthbvLknXmXe3\/3Ocs7M2qUf\/iHf\/iHfzzTsKWOi7GmhGlsByZrbQenkjFJ\nTeU7RrtKt6qKdQnBmqtbVbH8OQb6fXtQ6L8G5kwfH2o7MEHrYKimY\/PIfXgWNRyZS9a0SDInR1DL\nV2+Q\/dB0qk1U09VtKlHptkBP6dbAXEBXbXkl4KXBOTImajpPLvRY0ydRXXIYWVPUDBVOOk0wVe8K\nls9Vu0KojKFMSePIvH886XePFeFc5c7RAsvQmhcOWp8aoe05s1Tcsn0xhaypEeTKms4OzqSKnWOo\nfHsQGfaFkjFxnA9egQOoNSWcLOxyPT9bsy9MnuHwu8q3vBo1Yri8NYFx9WkTyJ09h5xZM8gOQAYA\nCFwxJIZRfXokWZLVVLsnRCCxgZo9oeIuIK\/tDSE7p4WTw6\/fp5bn4DZvDHkbMzLAtapiU1I4OTKj\n2Y2wIUfUAtWQPZt6z75LTcfnCxSuXeN7u75bQk0nFpAxZaLIlBTmcxaC8w3ZM8mS4k0R3a6QjOeC\nK1j3SkDhxiCZpGLHaDliAUdmFLkOzyZrxjQypUR6XcPiDAmn4DbUeGQOcaVLiLEhCMWE++0ZU6jz\n9GLy\/LCMGo\/NJ1vmdJc9PzOut7c34B+4F7gSYKhGwMEhFASSHkcl5xBafK\/jQgGkAqs4htB2nn6b\nGo\/OlQ3gHFLFljF1aJMTqYzzWJ+9gnp6eqi7uzvX4\/HE\/i1s0Zqg0CvxKskhTIojoACLY1XCGIHn\nHijhRmjr0ifLNdyL68hFS+oEMuyPkHtRTAo47sE5+8FosqZPIffRN6nLUkIMJmJISNvf37\/yqYAV\nFRUxF+PV4pi4MzSx0kawgJ7dQ7jth2ZQpWasr\/9BcFYpKNyL8LqzotnRaF\/aoGCajszjXF5Ffefe\np\/aCJAWM+vr6fGLIYh9YVVVVQFlZmdZms5Eu51O6vFlFVz4PJkfWbGr\/ZinZDiHH5pIj4zUJlSVt\nkrQaQGFRgAEKDiqQEmruAshNaVccXjiNzeJaA28SgOXp7\/mgrl+\/Lrp37x6HvYcEjsHiWB7AtbW1\niXRfb6bfPlZRyWcqbhOR1JKzRCaDGo8u8PU8JXzDmzOcxnmcwysRhSKFxptzcrFBzcdfl7k6Ti2n\nC9sWU0lJCTU3N8M1unv3LnV0dpLRaCoGnLa8vJy\/GAWsvb1d1NHRQebzJyhvbRDlr\/eGr5ybrTl9\nGjUeX0Q9Z1ZQW84iWQgLwjWlHSkhBqDilgKkqPvMKtIlRIkJ+buXU1FREdXW1tKdO3fI6XILnMPh\nCBhlMBgIgNXV1dTa2ipgijp5F279Zbq0cyEVx3kh4SiKqDIhlMXtZj+3lYOc6N8u4\/fyWwLyuDpP\nvfMImH7vDLr0SbDMdWEdA2bHk06no\/4bN8hab2M48589koi0AAFoZWUluVwuAYO6urp8qvo+iQrj\n1LLjS5u8oAAGbN6HKrq8KVwcAWzjsSVPqC5tAZXGR0pEoIINKir6SEUXt8yizha35JvBaPIYjXWx\nj1QtA4Y+fPiwmI+SnGazWWARZu5NPqFXWSwWKv7lHBWc0AgsXAUwCgrQcEMBgMSd9SrfZ9\/1DWrK\nT\/2Aas9racDTRQ2NjQJnMFj\/+j3NfFFwE6C3b98WJ51Op4ApQp9CniIlkDOFP52lgpMpslhe3FQB\nLtzodVUJH5wClOTaem84L+b\/KvMNDg56Q2oy1Ui+PcuAo8NB4WRTU9PwJipCvlqtViotLfXCnv+Z\nCpJXP+GiUmQXElfLPUgjRKqX5zDXWchgMmmf653MfAEsDcvj7UndAvt4v4LQHvR6vRf0xxwqOPOl\nuIvvw4UUwVzNzS3sGqeS2Rw34p9ew0HhKvoUoHBUdIOrD8Im+E30BBhcw6YGb90iu90h+ca5HvPC\nf2EzXywXlAug9+\/fp1u8IMBu3rzp08DAgE\/IMTRdDCWkyDeGe7n\/WQDKqsHCDx48EIjhYMhdhJI3\nI3CtXFgSUpM595mL4QWBxigt6mlDCSngTKY6zX\/2lxSgSuUrQwFDvplMppX\/i\/\/OQy0KBZXrdLqL\nGTL3peebf\/iHf\/jHyMYf\/vVkanjFeRQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/potato_patty-1334213396.swf",
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

log.info("potato_patty.js LOADED");

// generated ok 2012-09-18 15:38:06 by martlume
