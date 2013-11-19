//#include include/food.js, include/takeable.js

var label = "Cardamom";
var version = "1354597543";
var name_single = "Cardamom";
var name_plural = "Cardamom";
var article = "a";
var description = "A generous pinch of zesty cardamom. A little goes a long way.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 12;
var input_for = [43,78,326,328];
var parent_classes = ["cardamom", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by cardamom)
	"energy_factor"	: "0.1"	// defined by food (overridden by cardamom)
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

verbs.watch = { // defined by cardamom
	"name"				: "watch",
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

		self_msgs.push("You observe the cardamom closely for several minutes. Not surprisingly, it does nothing.");

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

		self_msgs.push("You observe the cardamom closely for several minutes. Not surprisingly, it does nothing.");

		var pre_msg = this.buildVerbMessage(msg.count, 'watch', 'watched', failed, self_msgs, self_effects, they_effects);
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
		'position': {"x":-19,"y":-11,"w":37,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEDElEQVR42u2We1MTVxjG+QZ8BD5C\nPsJOO7bjkGAMF69jYRjroEVCMUIR7AJBLkkACZGbhBDDtRVSoFhUZLmH0JBQkgm3JEtCQRQl3IqU\n6jzdsx0YW8AZp7X9o\/v8l33Pnve3z3neMwkJESRIkCBBggQJ+lAadl8LY5yJ8p6JK+ZuWwLTNfo5\n0zF8kfluMN5sZuLo1ifnwv4TMJs3LXRwNsXQ504OupeUYCaT8HD8Mh5YL6Fz5CLaB+PRxsThfs8F\nNHefZ+q7\/kXQsYXr1Ij3GmvxKmDxpKHXdRU9E18cClhaKUVL93k0fH82aGo\/RX9QMPtqRphtMd08\ntZILi0+BqWUlPCsqbL6ug92XdShg04NzPGBFXSTu1J5EXWsUW9sii\/3H4X56mUnblzOCHCCsgTQ4\nl2ge0OJJxajnK97BIbfi0CMmgPfMpzlIGYxt0aj9JhLVTVK2ql7890Hdm9mUcy2LZTdVmA2qsLpb\nBdezXIwH0jHGpvOAwzMKPoOuQM6hgMW6EygqiwB3xDxgTbMMhUVi7rkYd+rEwTL9cVpX8\/H7ZZT9\nLY\/y7hQw7LYa7jUlZtfy4FzJBnHQvpiJrdcGzsVbWNoohe\/F7SMzuOdgY9dZVDdEosokw91GGcrr\nTqDCKEFZjRjq0nCUlH8aLKk4xmd0YbOYqm+NPAjsh5oOrJcwTyYTHZ7dfPh2CkEAfVsqbL25B3ZD\nC89qAebXNHwGh+ZSYPdnvuWg8p2A5IgrjCe5LEqh0Uq4AZJAe1eMIl0452oUKk0RJLOO2Zf5jNEc\nTQeglvZPJdEh8ygseTiewDDOJLnVn0qb++Noz25e7PQrpcG9kc3ObORibj0fo2wa9jLoXs7BwroW\n\/VPJ\/BRbpq\/D5sngASd8X8Plz98HrGmK4VySwHA\/GvqWSOibT6H2W+JmBDliRqs\/bvBuFbI2z03o\njOHSPcOWoAkbnEkU8T8WoKJsS+mMvlki2ltAICtNEhGpzW+pScPgY8cV2hpINY94FczovIJ1B3Pw\nI3sD7QPxHMxnBxzsGIrH1HMl6jvOsMSdZ9s6bn0GV4tFdWME5Vi+IX\/sSKBNnaf3+3LOGV7slOOR\n9SqKKj8SHZlDH3LDCNxRdT9U8p9\/LYZzMQdtvbHom0hmuZOguUHYd+GPD0+T87l+UyB3Pc\/CwHQy\nDzgyrcArNKDflYKGzjPQVn\/C91pFQejY03SqrfcCVVB1LPSdw+JHYWxjR8wBSLIJG1RR3NUjHZj7\nknNYwyz8cpsfFKM5Bhrdn6eS7OPfLkLfZDKpO0jzZWjNvnUNQ+LFOcyQSSbryEf+9f33FtnI+TSL\ncytq\/y6bXLlJPbJfpkytMtHbLv9gvcQ3JFcWqeubZSLhX4wgQYIECRIk6P+j3wHbwE44s8dYGwAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cardamom-1334275047.swf",
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
	"c"	: "watch"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"c"	: "watch"
};

log.info("cardamom.js LOADED");

// generated ok 2012-12-03 21:05:43 by martlume
