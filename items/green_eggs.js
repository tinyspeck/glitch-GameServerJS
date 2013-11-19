//#include include/food.js, include/takeable.js

var label = "Green Egg";
var version = "1347906565";
var name_single = "Green Egg";
var name_plural = "Green Eggs";
var article = "a";
var description = "One order of fried green eggs, hold the ham.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 12;
var input_for = [240];
var parent_classes = ["green_eggs", "food", "takeable"];
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
	if (pc && pc.skills_has("cheffery_1") && !pc.making_recipe_is_known("89")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> a bit more."]);
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
		'position': {"x":-24,"y":-14,"w":48,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF4klEQVR42u2YW0xTdxzHTSQGrzgv\nxF0S4MEs29xwb3tjZvFtCfHBZG8km8uybJMszizoNrzippOq87KpBBc2xbvopi4qFXRyvxVooYCF\n0iu9F9rCufDd7\/8\/bS22IExd9tB\/8s3\/nJ7Tns\/5\/i7\/czprVnIkR3IkR3I8k4Fha448bC6cSpLf\nnMvOe\/4wIUuG5DfmCl6TWvSZwEQXn5FEn7lF9JtLGTD7vaeHGjFli16jSvAOGGgGl28wKuPQFRgd\nEVVgwH4FFsed6UP7TGrm8MzB3O40wd2vFj39BDUQIyNGXJ1oGtyDsp5slPW\/hku2NTg1sBIne7Nw\nRPsy9rcsxZHm13G96zMMu3XTdNZkYOkAuNOmAdeXJnoMHhIU9Uc17GxHuW4tjupeIahVuOXdgLsj\nn+Oc7R2UDa5GqeEtHO99Ez82r8COvxfhRMMa+F3aGaSAyfBERwVXn1p0P0RUBOkzNfC5TPMeDmhe\nQgmB\/Gpcjd9M2ThtWUXzGzhFbv6iz8LhzgzsbVyOHfcX4hv1fBTfe5tDTjtvfSbPlICiq4\/AInoE\n2tinwu7aNBzqyMTP3SsJJgMnelagpO9FPh\/rSseh9mXY37wEe+oWY\/u9hdhaOR+b\/0pF+YP1GHV0\nhnPXFJXHWEs33xgH+QTAXkQk+cxKmAm2pPFd7HywCD80LEZxyxIOc1SbjmO6dAp5On7qWA5V61Jy\n7wXsrklDYfUCFNyZh003UrH9UhaMtQcRMNVySGlkiM\/Oh9Vw9KoxRukzbUDBqW8RXT1Q1As56OIO\nnqjLwTZyhbnIIBjkgbalOKhZxlVMcPvo86K6NGwPh\/frW3ORf20OCs9lQnN9K+ytxzE61Alp2A7R\nbw07qYB6Bmr5PqXY5ICSsztPdOoRVRS0B2ebP8C3dxfwizPI7+sXc6B9TYqYs0X0OSuO76oU9766\nmYpPL6ag6MKraPuzgLvo67vOO4IsBBRQ6gwhRzdJD4GMEAbrPYkr19GlEulE0RmRfoJqu\/ah4PY8\nLpZfLNwslAyKAe+ifQbP4LYQHMu9jVfn4KPTs1Fe8T4HNNUfhrenQukKzD3eW5UWRpHjcIK1LW9i\nzjm0OcKQ1kCA4GL5x7fjYYurs7H55lxspfAxkG3VC3nY2cz2WVgLwnBfENyHv8\/GtouZHE53ewcc\nmhIEzfVx7YuujzFTnXrM3p49AW7MrlWJdJBp1KohiHDOOXSIAsfA2s2V2F+VzUPHQDddT8WWynnc\nMeYszzkC++RcCjacmU3FkYn6P77k+WdpPApP98UJ7YtJYL9vbiqMLwZbe6lg7yT6Tvip3C3aawha\nWqAA6xQ5dHGwfmsDanR7setOlgJzPgUflxMQ0xnaPpuCjRfmo6xiLXdOry7ixeHWnaUwdse1MMGm\noQWkceIKAimQK9g7EKuguRkhaysHZpYLYWengtX2nMLV+g24dH89LlSvw\/mqdbhRlQdd9U4M1Khg\naz0Jr\/4KAsZ7iG1fsb1WsLXFVy0g5coBJx1sJ7h2PA4bcTYeVjsp7GR5m6gjxMJSUUC0NuckgJTz\n5VEft52DRmHb42HDwONiaFJYZ28lTxM2PxHW+QhWoKglBOSQsqjCuEQXDoI5ysudwSSAFT10jN3x\nY+4+rbOCpWlyQMVJZBPkZQYa0fjYCC1HdiUE03CWSQq4KBo98NCqwJz0DdRwWDnggDzqTwgr0E0J\n5qb4IpkCNoPlJ3N2XBYN47IAOeRW8pCqbXLYDmWZIkeClmYE6KIhllv0PclnoRXDltBdln9jpibV\nv3+ihpgjS6NqmRzl4eCQmkewMy6ycEfgN0zfM7eUPpv3ESGYz8Kk5GfbY6DTgLXHwNK2SOeOWVpV\nz\/alSQzlyEGvIRIaLltbAuDJOkJnBM4j2Tvyns+bHZAmj3pLpWGrEnKW5Ky5TwCOAWWOOcKV69B5\nSIVwazP+g1dQT44cchVKAedl2W\/1SOyphC38bgNfJSRqVxJba129BsGlLxVcXfnsiSn5T0JyJEdy\n\/E\/GP4y8y22hvvq+AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/green_eggs-1334210127.swf",
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

log.info("green_eggs.js LOADED");

// generated ok 2012-09-17 11:29:25 by martlume
