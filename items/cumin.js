//#include include/food.js, include/takeable.js

var label = "Cumin";
var version = "1354592776";
var name_single = "Cumin";
var name_plural = "Cumin";
var article = "a";
var description = "A heap of pleasantly aromatic cumin.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 8;
var input_for = [19,305,324];
var parent_classes = ["cumin", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by cumin)
	"energy_factor"	: "0.1"	// defined by food (overridden by cumin)
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
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

verbs.lick = { // defined by cumin
	"name"				: "lick",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Examine the spice",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('spice_examiner')) return {state:null};
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Powdery cumin coats your tongue. It's not unpleasant, but it's not exactly pleasant, either.");
		// effect does nothing in dry run: player/xp_give
		// effect does nothing in dry run: item/destroy

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Powdery cumin coats your tongue. It's not unpleasant, but it's not exactly pleasant, either.");
		var context = {'class_id':this.class_tsid, 'verb':'lick'};
		var val = pc.stats_add_xp(2, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'lick', 'licked', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from spice
this.is_spice = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_spicerack", 1))) out.push([2, "Spices are much easier to manage if you have a <a href=\"\/items\/271\/\" glitch=\"item|bag_spicerack\">Spice Rack<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a>."]);
	return out;
}

var tags = [
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-14,"w":44,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEpklEQVR42u2We09TdxzGeQe8BJK9\ngWYx23C0HAbIzQuwoBGc68QBY6AVL\/M2OC4O5y0zy5Y4DKbaIgoDO1QUwdmpgJZ29H6jl0NtEQyU\nA9TeaPHZOcfRBNkyMufmH+dJTnJ+aU\/y6fM8329PUhIvXrx48eLFa6Wa7tuY7H\/wifSpsvQMe\/9G\nwU3dLyukB8ppWlWJ8d4SjN0qpse6iwvfCDj63hZxYLgWIdNeTN77iAP0dRdB8\/1qjLTlKZ90F6T8\nb3BzQ5XSoH4Xpn7dgplHFQlAqzwbj69vgFWWBU\/XOtgvZ5Ou9uz\/LnZoKpMZOO2C52uwgPPOBvgf\niDGrrk4A6s+lQ\/Xtu3BcyYH2RyEc7TkUdXUN8drhnqnKBWHjbnr20XbMPvoUdL8Y9MPtmLxbmnDw\nSc+HGGWcc7TlcQ5SigK4OvPg7FgDe1uWwt2S+Xpij2hrJRHLPjxTV2F2cBvC5r2I2A5yEbOAT+9s\nSgD6bhZh5HIOdIx75gsfQP1dKmytmTCcF8EsJ2jrpXTy34vUVZkc+a1aEXeRiI8eRUBVwQHOO77E\nzGD5EkDWNWd7PtfBRQdtLVkcoP1KFizyDOYiYL1EwCwTag2y1a8WO4y1goiuhorodyCsrUGIucLG\nOg6QjXf6\/tYlgJ6uDdwUs4Duq2uXRcz20igVcYCmi0IMn02F7nyq1NW06u+HCO7TKYGhOsLbW0r4\nrhcLFsy7yPjIIcwzscZd9Zi3H0DEtDsR8dxQFWLUV38ZMQvJAlpkmdA1CTlA04V0Bi6DAzRI0zjg\n4bPvMZDv0NrmVeKlQNOnU0K2\/ZKR9lwJe37uO6GMekj4+piy922iF0y7EDPsRMy2H1FTHUKaKjwb\nqkCAHRAGkB2SlyNeBLQwK4btIAuoPyeC9mwaB2i7nAl9s5CJOR2aH1JhvJgGXXMqPNfKEDIfwvRg\nDUZvlFDmSxnKJDhPKKb6q5Uj7XlSDpg6SSw6aGl5PwWWOiJm3iONOw4japAgrNuBmKshAfhyxOO3\nS+C9UZQAdHXkL4uY7aDuXBrTP3ZYRBygQbpa4R\/4XBF1HIG\/v5oFVFr+bNLZiOOjxxS+njJquPnt\nJV9YcDRKY+NH4Vcxv\/A6u0bWLwP0\/LyBgSpYErG9NReTD6sQMO3D+C9iuBTr2IilllYRYZGJiPHe\nrYT35kbOkJihnqAfVAlW1MWo5YjW8VP+mcXzc+dxBA0HMHF3G9wMiLklQzneW0zMqarFQcsXdNhT\nD19PKdzXCuHozKOortxC77X1RMRUrwyaD2JGI+EAJwbK4bpRSIX1h8Ux71FqRlvHOgaTLF37StMc\ndx5TBJmdN3F\/G7h+\/FGJmKsR0dEjmFbVcoCT6krYO3OgaXorGU9PkfHJRnriXjkcHQWU9\/Zmkuoq\nIpnnSbhOkRFTA6ZeRAqTXKT856vGfVywYG8kadVO0ntrM2ltzRC\/2I\/Hk+OPv9GGrIfw5M7H8HRv\nVDo71irNciH54vOT2qDpAMZ6t8LWlq1YtviNDRL\/wGekp7uENMqFgtfy7\/LceYKaU+9hILbAdiWL\neuNeVFl3A+rd5FhfGenuzExJ4sWLFy9evHitVL8Dm8nuc6IZmpUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cumin-1334275244.swf",
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
	"spice"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "lick"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"c"	: "lick"
};

log.info("cumin.js LOADED");

// generated ok 2012-12-03 19:46:16 by martlume
