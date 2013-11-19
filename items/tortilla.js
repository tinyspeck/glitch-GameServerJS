//#include include/food.js, include/takeable.js

var label = "Tortilla";
var version = "1354597977";
var name_single = "Tortilla";
var name_plural = "Tortillas";
var article = "a";
var description = "A roundish tortilla.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 19;
var input_for = [6,82,102,333,348];
var parent_classes = ["tortilla", "food", "takeable"];
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
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-14,"w":36,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE7UlEQVR42u2Yy24TVxjHeQMegUdg\n0R1xFQoqiCaQkuZSW5WyqAqbIsSGLvMIeYQscVCpqSolpSUySoqdKImn4paIkKSE0qY0jguqKsTm\ndH4n+Y8+n4wdcxULj\/TJM2fO5f\/9v+t437721b7e82urkjtQjXLnNxeyxb2kupAb3YyyQ1vz\/fvf\nOrBaJdsZH1p4XOp3D6d63fr0Z+7J3OduZbLHLV8\/5X9\/v9nn\/p7Pumol54U5G7OD2887YN88Y7H2\nMWPDHPLnzIAHJQAaAzByb7zLy+JElwfNmAWLcrGSa1jgjbA6f\/mD\/ZsLuUiHcCCAOAwAq8VPXfgO\nJgHCL2CXrnUnjOs5UfJ1gf41N1jAZBz4243TCUNWOBwwYu3+Tyf9OPMBLIbtc2CFGhZ6aXDVhewI\nG8ASvsWhgEV4hok0wLyDLcS6AsD5ZT3KsB7Q8lFM37KP1iq5HrTkMLRnQw7XoRwippjDGPP1LIVg\nXgBhV3O5l0IAxQLP7px1z5cvALRIpmgKEG04UCAkbMyhjFtz2vtQZHopaQUGsZD1ZZm9IZu1yuBB\nJkG93UxmYzM0xpdghHtYbgSwVZFfKmWxfypIIsuaxbJnUwtAQ7OH7Nj1oQDCpiAURGGI4R7G2XMX\nyPXp3gKLmKD0kGYea8I0Bq1Z+VUEW9A8p1kL5aqVIfdi5WLsm185YiIBuHy9u8YiNORQtNB9aPJW\nzapcaAMOYX0j9wDk09tfuv+Wzrmt6Itaki+Xrp0oyGRh1UBT5bFGebGZhLkyjPSQSc7hvS+fcan0\nAKPvDg9pMi\/FABsjAHvVgEjqsgGzbc7tNGX3ZZwxuQeZJSlvDya7k1wWOrZMZUVlDbOzWaMkbgMN\nCdOQXAFi2AfAjKkBSfJjdPVIxAQ5ss13NpIBhpY2cYeMhwGmmm2bC1uFFNUKPsYUTEmwzOQz5x+X\n+rwmHGZ9I0wfAGMD+STzLUuAb8Romo9an5QVk5Skmn3zyqEDd8eP+0EWANBGosyQxoJlAnB7BVNd\nd7NT+20Dwl781gHkKuU71jZmBzw4aRKUIyc3AIT80ObGVpmTQgh7sV4VS3N2GopiArA8lhmGRcuA\npV85zTq5SpR8jHEURMR8GmgppPdyG1lIDD6ZG4zqmtXSpUzt0fQ23VYbBUxYylSurP\/tVYla8UsF\nyqNfel1d2SuPdQxVCh95H1E7pUhMS6wSzKMAE8NSRuzYzlzjNhNonvIje\/5R7o92NQ8ytQJG5gzZ\na9Zy2TRkWyuB1Lj2fDDZ6\/5d\/NqXOiVx\/4FWPDma2oLBJCBttIVfcLYzsR9NYRQrA+i9RABxpRcr\n37h\/bp1JlOI9Abs6+UnjRhaQ81cO1\/ADmVepR89SgHsBsL4LCLFhfTVNxCbKxqZ1dyeO7f3dMpvP\nHCRwfv3+qHdYDlKWl8\/ZAAGErSY2wsOgsylHPYDAVa4eWSNoW\/peIYmX8pliOZ9xAH04Ve9TmNSa\nrlkEy\/lVw9VMqGtanz7tKLsQ89JffSwq5ztGYXTu2063+OOJhFUY4OBGiRolxHh9k6pOZ8Dd+uFj\nFxNRaJm5Zlfp8oedpUsdI7FEMMvmYlbf1WLUfo5yr4YAUPd\/7vJWwULs+Vb+w4FZmg25AXkUdleL\npzzDodDaoRBzUXAmf6jnnf0ThnmIfs9uXNsBEQougqu8kp+1r\/bVvnZf\/wP+gw1dFSc1XAAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/tortilla-1334341746.swf",
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

log.info("tortilla.js LOADED");

// generated ok 2012-12-03 21:12:57 by martlume
