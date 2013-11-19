//#include include/food.js, include/takeable.js

var label = "Rice";
var version = "1354587262";
var name_single = "Rice";
var name_plural = "Rice";
var article = "a";
var description = "A pot of freshly made rice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 4;
var input_for = [22,141];
var parent_classes = ["rice", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_rice"	// defined by crop_base (overridden by rice)
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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/324\/\" glitch=\"item|seed_rice\">Rice Seeds<\/a> in a Crop Garden."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-14,"y":-18,"w":28,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEtUlEQVR42u2X2VIbRxSGucqtq\/IC\nPAKPwBvEj6CkqLK54xaqoKbYAgm7kGAIkodFWGxCLBKbhFbEooVBCBBbLAyYxXFF2K6QuHzx5+9O\n2eULXwC2IRc6VV1zZqZn+pv\/9Dk9nZeXs5zlLGd3Y9vb2\/nJZNKg67oWj8f9Kysr\/qWlJefi4qLB\n4\/E8uDew5eXllnQ6rW9tbWFjYwNzc3MoKytDRUUFKisr0draitnZWSwsLGg8PrxzwP7+ftjtdkxP\nT4OqgQpiamoqQ\/8hFSwcHBwsGR4ezhJQwrvd7izvaxMTE5+FBU4KgNP8D+exRLuWvYzg8nIuk8kM\nyGeurqIl796llOzb6cLrQhZomqZYLBa9t7cXTqcTfr8fBEQ4HJb+B0DxIS6XC+Pj4xgbG8sSXjs7\nixa+f79f+OqVy\/D7MzuOT5zYP+jT9\/cdmdSmDaFQPaKxNuzsDvO6Uz+\/8OLFqRuJNVMmGJwwRCKR\n\/GsrSsh8VVVLOjo6dPqgghLqc4Cjo6MQEdja7sHJi0k8PxqGvq5ic6sPqc1e7O2NQqj35m0S5xdu\nJJNPEFlqwsVLF16\/8RPSQQE64PE6EAx5EU9EdBG5a8MStKC9vV0zGo0wm83o6emRwJOTk9IvLS2F\n1tNAuAAHDWB3z46j4xn8mY1iO\/0UsVgHQS2ENskWiTQRopsqjiC9M4CV1VZ+3CgOn3uxGGngcx6e\nT2N+fj7DRC25NmhXV9eDtra2kubmZr2pqQkmkwnFxcV49MiAWNzKQc0crAXPMqN4+UeYxxGGT8XF\nRZjqbeD0LMB+XQiFG7G80k7fSHCVYW9FKjVElXUcHnqo5M+cDkasrfn4sWGktla0GycVs1oTmf34\n8Y8fw5re6aEqdqzpRnnt6NjB+abJEO8fjNMfksqenHhl6PX1PmQOZ7Ea7UY8rvG8Hz5\/PRZ8v\/Lj\nXAT28b12JBKDuDGg1WpVhIKqWoezcw\/nmyZDevk6xrD2EtLM+VRPRY1IpwfZJ0gYF0NnkYOKFour\n7L+Ov\/\/ZZT8VgWAz1pNWqu+RU0GqG7UiEAjcHJDlRRkYGACTCBZLC182gL39pxx4HH9drdHXCPmb\nTJSDgzGGigqnbVI5EeJA8BeGtov9XQy9i4nTzQ+Y59HGe3WcAmYebbJ6CCFuBSgymPVQNpHFIyNP\nEAxaqZwZ\/oCZIBa2Dira\/1+jetGYiaqo7NOAjZTG0KoySUIhleq5mUBuQgVEAmY5149ramrQ2Nh4\ne0BRbhKJBDM1Jgu8CAcLOGFHZBPFf2hoSJYi1ktZlkT2ixI1MzMjVqcsy1aGGQsupRmv18tLs+fV\n1dUoLy\/HVwdksaUaoY9FXQwsQITKAkwUf4fDARZ2CW+z2WTJIpysr6KveGcOMAd434B1dXX\/b8CG\nhoYc4L0DGu4KkH7mVtsErhQOsToIsG8FWFtbK\/zb7YHELo+QS2LZ+hJA4X8KKPqKMiM2bAyv4Ys2\nW4qifMdfr5\/44tRtAYVinwJ2dnaiqqpKKyoq+v6r7QoF6OrqaoHYPxPQeV1Aob7o5\/P5zvmMlX1\/\nEH\/u33wbK8LPQQsJWMJBFQIq\/MtRCKgQUOHUUMR1qmaggoV5OctZznJ2v\/YvvRsEOU7RRT4AAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/rice-1334213505.swf",
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
	"crop",
	"croppery_gardening_supplies"
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

log.info("rice.js LOADED");

// generated ok 2012-12-03 18:14:22 by martlume
