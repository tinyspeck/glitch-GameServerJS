//#include include/food.js, include/takeable.js

var label = "Mustard";
var version = "1354597650";
var name_single = "Mustard";
var name_plural = "Mustards";
var article = "a";
var description = "A dash of tangy mustard.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 4;
var input_for = [6,63,327];
var parent_classes = ["mustard", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by mustard)
	"energy_factor"	: "0.2"	// defined by food (overridden by mustard)
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

verbs.plaster = { // defined by mustard
	"name"				: "plaster",
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
		if (pc.metabolics_get_mood() <= 4) {
			return {state: 'disabled', reason: "You are too depressed to do this."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Ah, a good old-fashioned mustard plaster. It's good for what ails you.");
		var val = 4;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		var val = 10;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "energy",
				"value"	: val
			});
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

		self_msgs.push("Ah, a good old-fashioned mustard plaster. It's good for what ails you.");
		var val = pc.metabolics_lose_mood(4);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		var val = pc.metabolics_add_energy(10);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "energy",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'plaster', 'plastered', failed, self_msgs, self_effects, they_effects);
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
	out.push([2, "This can be made with a <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a> or purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-12,"w":37,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD80lEQVR42u2W7U7bVhzGo3YLSXyO\nk6yhiE4sICaQpkqZto\/7kEvIJXAJuYLJ0rStLUNkpXQ0XWlYy0rCWwohEBKCgZAX8mYS4lBoiCkk\npSmouYT\/zrFE2yljlbaW7YMfyZJl+eXn53n+x1apFClSpEiRIkWKPrSKfo1ZmMWu9GPEJ6cQn53S\nmP83cOIiy236cV3wYcjMYEhNY0hM4nrCzdj\/U7AdHveIIbZeirZDPmCAtwE3JjHMOzWw8hsjRB4y\nlnMFK0c15p0V7N1PdsLOagsUwyYoBC81AE7+rIbwiA78d7QQGta5wvfOIXYpxtrLUVN9d5WF3VUT\nbIeNcJC5+peAcQ+G9UcIRn64CO4+NSy7EIR+ZRwhp0r\/3sEOk8i6H9cL5ZgeyvEW2Iu2gJRof+0g\njbgQvNwASB2cvU2jRjLgRH8TeB3a+sIvjMM\/+B4cfV7UmKsZ1lVJN8NBqhmquS9gP9kG1MEny6wM\nKIaMUE50kX1zA+DckAaGv7sI4fuMDPjohhrcvWoIDDHgH2RgdoCA9v0D0FdFg7m2xXJHm3qoZvVw\nlO+WAamDpXUj1J58A7SDxSUCyrdAbh6fGfHaKJIBx35Sw6KTQN3Swl3uAnh6m2C6XwsPv1fDRK\/O\nNXX9HcNU3zJYDjNd3HYYu45FA9TEz8jWTeA6oFb8GipCB+lbhxxxOX5FdnA\/1UVc\/erMiE8BF5xa\nGXBmQAtzt3Uweu1j+P0acfNGEzi\/vQDTN5vAd5Oh13kP0u0QHmZc1KR8EFlVJyK2CT7EHWZYbi\/W\nysc8yPuyaLDX8npBdlAg0WY\/hWfJT6Cy2S07SDt46mBhkYVtvpXAXoWszwDP0hbYjXTJgNExJHfw\nwY8fQegeA\/NDOjliP4GkEfsGGHjs0ElVgXR5qZUc175eO09Eg20rwNpVx0Vk3YuxjtI65gN33thc\nyTIWMYBtL3KsnboXH8cgLmG+FGEJpAmeRoiTURbEIAtpL3FtAjU4GPcgyC82ky5qZcDdtU6yXYEY\nAQ8M6mzlCGPJziJrevzNZB+LJu7ljpXPzrXyf9vPioB76JLwas+op1O84f5zR04Khp4XhW45Ztkt\nNyNlSBKJCWxLTiNrbJy8eITlpMRlb3RUY6bnP899TpwyyufHPIx0VCD1WLgEKyOMdApDq1aKYG\/U\njfh3DhDpIrf2gPTgrCkXWPt2mOWeRszkYV+SiDEs30fQcJ+iwVrNdUo5ArM+hiXiLHeUa64fpNrk\n4VoZQfWZfp2NPM9Lv+lTff9yCaIdLW+08WEX4k6nXoohK42LAFrfHjx6LEt+Jg5TLEe7Hrx79guf\nu6hzFHD8+gf4eihSpEiRIkWKzkV\/AHB24QCpfWMTAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mustard-1334275941.swf",
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
	"c"	: "plaster"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"c"	: "plaster"
};

log.info("mustard.js LOADED");

// generated ok 2012-12-03 21:07:30 by martlume
